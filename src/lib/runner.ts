/**
 * The practice runner.
 *
 * A static page with a small client-side engine: pick options, watch the
 * clock, mark for review, submit, and see the real JELET marking applied to
 * every item. State lives in this browser only; nothing is uploaded.
 */
import { readAttempts, upsertAttempt, type Attempt, type AttemptItemResult } from './attempts';
import { applyAttemptToQueue, readQueue, writeQueue } from './review';
import { scoreItem, summarise, formatMarks, type ScoredItem } from './scoring';

export type RunnerConfig = {
  attemptId: string;
  paperId: string;
  paperYear: number;
  paperLabel: string;
  title: string;
  mode: 'mock' | 'drill';
  subjectKey: string | null;
  subjectLabel: string | null;
  limitSeconds: number | null;
  questionIds: string[];
  scopeMarks: number;
  scopeQuestions: number;
  keysUrl: string;
  base: string;
  /** When set, only the wrong or blank items of that earlier attempt are repeated. */
  retryAttemptId?: string | null;
};

type KeyEntry = { key: string[]; tier: string; voided: boolean; reasoning?: string };

const readKeyFile = async (url: string): Promise<Record<string, KeyEntry>> => {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Answer key could not be loaded (${response.status})`);
  const data = (await response.json()) as { keys?: Record<string, KeyEntry> };
  return data.keys ?? {};
};

const readQuestionMeta = (root: ParentNode) => {
  const meta = new Map<string, { n: number; category: 'I' | 'II'; marks: number; subjectKey: string; subject: string; stem: string }>();
  root.querySelectorAll<HTMLElement>('.pane[data-question]').forEach((node) => {
    const id = node.dataset.question;
    if (!id) return;
    meta.set(id, {
      n: Number(node.dataset.n ?? '0'),
      category: (node.dataset.category === 'II' ? 'II' : 'I'),
      marks: Number(node.dataset.marks ?? '1'),
      subjectKey: node.dataset.subjectKey ?? 'other',
      subject: node.dataset.subject ?? '',
      stem: node.querySelector('.qstem')?.textContent?.trim().slice(0, 160) ?? '',
    });
  });
  return meta;
};

export function initRunner(config: RunnerConfig): void {
  const root = document.querySelector<HTMLElement>('[data-runner]');
  if (!root) return;
  const container = root;

  const allNodes = [...root.querySelectorAll<HTMLElement>('.pane[data-question]')];
  const meta = readQuestionMeta(root);

  // A retry repeats only what the learner got wrong in an earlier attempt.
  let retryIds: string[] | null = null;
  if (config.retryAttemptId) {
    const previous = readAttempts().find((attempt) => attempt.id === config.retryAttemptId);
    const wrong = (previous?.results ?? [])
      .filter((result) => result.status === 'wrong' || result.status === 'blank')
      .map((result) => result.questionId);
    if (wrong.length > 0) retryIds = wrong;
  }
  const questionNodes = retryIds ? allNodes.filter((node) => retryIds?.includes(node.dataset.question ?? '')) : allNodes;
  const panes = questionNodes.map((node) => node.dataset.question ?? '');
  allNodes.forEach((node) => { if (!questionNodes.includes(node)) node.hidden = true; });
  const currentIndex = { value: 0 };
  let submitted = false;
  let responses: Record<string, string[]> = {};
  let marked: string[] = [];
  let visited: string[] = [];
  let assisted: string[] = [];

  const storageNote = document.querySelector<HTMLElement>('[data-runner-storage]');
  const timerNode = document.querySelector<HTMLElement>('[data-runner-timer]');
  const progressNode = document.querySelector<HTMLElement>('[data-runner-progress-text]');
  const progressBar = document.querySelector<HTMLElement>('[data-runner-progress-bar]');
  const submitButton = document.querySelector<HTMLButtonElement>('[data-runner-submit]');
  const clearButton = document.querySelector<HTMLButtonElement>('[data-runner-clear]');
  const resultsNode = document.querySelector<HTMLElement>('[data-runner-results]');
  const paperNode = document.querySelector<HTMLElement>('[data-runner-paper]');
  const navigatorNode = document.querySelector<HTMLElement>('[data-runner-nav]');
  const markButton = document.querySelector<HTMLButtonElement>('[data-runner-mark]');
  const navPanel = document.querySelector<HTMLElement>('[data-runner-navpanel]');
  const navToggle = document.querySelector<HTMLButtonElement>('[data-runner-navtoggle]');
  const announce = document.querySelector<HTMLElement>('[data-runner-announce]');

  /* ---------------- attempt state ---------------- */

  const existing = readAttempts().find((attempt) => attempt.id === config.attemptId);
  if (existing) {
    responses = existing.responses ?? {};
    marked = existing.marked ?? [];
    visited = existing.visited ?? [];
    assisted = existing.assisted ?? [];
    submitted = Boolean(existing.submittedAt);
  } else {
    visited = panes.length > 0 ? [panes[0]] : [];
  }

  const attempt: Attempt = {
    id: config.attemptId,
    paperId: config.paperId,
    paperYear: config.paperYear,
    paperLabel: config.paperLabel,
    title: config.title,
    mode: config.mode,
    subjectKey: config.subjectKey,
    subjectLabel: config.subjectLabel,
    questionIds: retryIds ?? config.questionIds,
    startedAt: existing?.startedAt ?? Date.now(),
    updatedAt: Date.now(),
    submittedAt: existing?.submittedAt ?? null,
    timeSpentSeconds: existing?.timeSpentSeconds ?? 0,
    responses,
    marked,
    visited,
    assisted,
    limitSeconds: config.limitSeconds,
    scopeMarks: config.scopeMarks,
    scopeQuestions: config.scopeQuestions,
  };

  const save = () => {
    attempt.responses = responses;
    attempt.marked = marked;
    attempt.visited = visited;
    attempt.assisted = assisted;
    attempt.updatedAt = Date.now();
    const { saved } = upsertAttempt(attempt);
    if (storageNote) {
      storageNote.textContent = saved
        ? 'Saved on this device.'
        : 'This browser is blocking storage, so this attempt will be lost when the tab closes.';
    }
  };

  /* ---------------- rendering ---------------- */

  const answeredCount = () => panes.filter((id) => (responses[id] ?? []).length > 0).length;

  function paintOptions() {
    container.querySelectorAll<HTMLButtonElement>('.opt[data-option]').forEach((button) => {
      const questionId = button.dataset.question ?? '';
      const label = button.dataset.option ?? '';
      const selected = (responses[questionId] ?? []).includes(label);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
  }

  function paintNavigator() {
    if (!navigatorNode) return;
    navigatorNode.querySelectorAll<HTMLButtonElement>('button[data-nav]').forEach((button) => {
      const questionId = button.dataset.nav ?? '';
      const selected = (responses[questionId] ?? []).length > 0;
      const isMarked = marked.includes(questionId);
      const state = isMarked ? 'marked' : selected ? 'answered' : 'unanswered';
      button.dataset.state = state;
      button.setAttribute('aria-label', `Question ${button.textContent?.trim()}${selected ? ', answered' : ''}${isMarked ? ', marked for review' : ''}`);
    });
  }

  function paintProgress() {
    const answered = answeredCount();
    if (progressNode) progressNode.textContent = `${answered} of ${panes.length} answered`;
    if (progressBar) {
      const ratio = panes.length > 0 ? answered / panes.length : 0;
      progressBar.style.width = `${Math.round(ratio * 100)}%`;
    }
    if (submitButton) {
      submitButton.disabled = submitted;
      submitButton.textContent = submitted ? 'Submitted' : 'Submit paper';
    }
    if (markButton) {
      const current = panes[currentIndex.value];
      markButton.textContent = marked.includes(current) ? 'Unmark for review' : 'Mark for review';
    }
  }

  function show(index: number) {
    currentIndex.value = Math.max(0, Math.min(index, panes.length - 1));
    questionNodes.forEach((node, position) => {
      node.classList.toggle('active', position === currentIndex.value);
    });
    const current = panes[currentIndex.value];
    if (current && !visited.includes(current)) {
      visited.push(current);
      save();
    }
    if (navigatorNode) {
      navigatorNode.querySelectorAll<HTMLButtonElement>('button[data-nav]').forEach((button) => {
        button.classList.toggle('current', button.dataset.nav === current);
      });
    }
    paintProgress();
  }

  /* ---------------- interactions ---------------- */

  root.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const option = target.closest<HTMLButtonElement>('.opt[data-option]');
    if (option && !submitted) {
      const questionId = option.dataset.question ?? '';
      const label = option.dataset.option ?? '';
      const category = meta.get(questionId)?.category ?? 'I';
      const current = new Set(responses[questionId] ?? []);
      if (category === 'I') {
        if (current.has(label)) current.delete(label);
        else { current.clear(); current.add(label); }
      } else if (current.has(label)) {
        current.delete(label);
      } else {
        current.add(label);
      }
      responses[questionId] = [...current].sort();
      save();
      paintOptions();
      paintNavigator();
      paintProgress();
      return;
    }
    const nav = target.closest<HTMLButtonElement>('button[data-nav]');
    if (nav) {
      const questionId = nav.dataset.nav ?? '';
      const position = panes.indexOf(questionId);
      if (position >= 0) show(position);
      return;
    }
    const jump = target.closest<HTMLButtonElement>('[data-jump]');
    if (jump) {
      const action = jump.dataset.jump;
      if (action === 'next') show(currentIndex.value + 1);
      if (action === 'prev') show(currentIndex.value - 1);
      if (action === 'first') show(0);
      if (action === 'last') show(panes.length - 1);
      return;
    }
  });

  markButton?.addEventListener('click', () => {
    const current = panes[currentIndex.value];
    if (!current) return;
    marked = marked.includes(current) ? marked.filter((id) => id !== current) : [...marked, current];
    save();
    paintNavigator();
    paintProgress();
  });

  navToggle?.addEventListener('click', () => {
    if (!navPanel) return;
    const open = navPanel.hasAttribute('hidden');
    if (open) navPanel.removeAttribute('hidden');
    else navPanel.setAttribute('hidden', '');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  clearButton?.addEventListener('click', () => {
    if (submitted) return;
    if (!window.confirm('Clear every answer in this paper?')) return;
    responses = {};
    marked = [];
    save();
    paintOptions();
    paintNavigator();
    paintProgress();
    if (announce) announce.textContent = 'All answers cleared.';
  });

  /* ---------------- clock ---------------- */

  let remaining: number = config.limitSeconds ?? 0;
  if (existing?.submittedAt) remaining = 0;
  let tick: number | undefined;
  const startedAt = existing?.startedAt ?? Date.now();

  function paintClock() {
    if (!timerNode) return;
    if (config.limitSeconds === null) {
      timerNode.textContent = 'No time limit';
      timerNode.classList.remove('warn');
      return;
    }
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    timerNode.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerNode.classList.toggle('warn', remaining <= 60);
  }

  function startClock() {
    if (config.limitSeconds === null || submitted) return;
    if (tick !== undefined) window.clearInterval(tick);
    tick = window.setInterval(() => {
      remaining = Math.max(0, remaining - 1);
      attempt.timeSpentSeconds = Math.floor((Date.now() - startedAt) / 1000);
      paintClock();
      if (remaining === 0) {
        if (tick !== undefined) window.clearInterval(tick);
        if (announce) announce.textContent = 'Time is up. The paper was submitted automatically.';
        void submit('Time expired');
      }
    }, 1000);
  }

  /* ---------------- submit + score ---------------- */

  async function submit(reason?: string): Promise<void> {
    if (submitted) return;
    submitted = true;
    if (tick !== undefined) window.clearInterval(tick);
    attempt.submittedAt = Date.now();
    attempt.timeSpentSeconds = Math.floor((Date.now() - startedAt) / 1000);
    save();
    paintProgress();
    if (!resultsNode) return;
    resultsNode.hidden = false;
    resultsNode.innerHTML = '<p class="micro">Marking your paper…</p>';
    if (paperNode) paperNode.hidden = true;

    let keys: Record<string, KeyEntry> = {};
    try {
      keys = await readKeyFile(config.keysUrl);
    } catch {
      resultsNode.innerHTML = '<div class="notice">The answer key could not be loaded, so this attempt is saved but not marked. Reopen the page when you are online.</div>';
      return;
    }

    const items: ScoredItem[] = [];
    const results: AttemptItemResult[] = [];
    for (const questionId of attempt.questionIds) {
      const info = meta.get(questionId);
      if (!info) continue;
      const entry = keys[questionId];
      const keyLetters = entry?.key ?? [];
      const selected = responses[questionId] ?? [];
      const scored = entry
        ? scoreItem({ category: info.category, marks: info.marks, key: keyLetters, voided: entry.voided }, selected)
        : { status: 'unmarked' as const, awarded: { n: 0, d: 1 }, selected, key: keyLetters, explanation: 'No published key for this item.' };
      items.push({ ...scored, id: questionId, n: info.n, subject: info.subject, subjectKey: info.subjectKey, category: info.category, marks: info.marks });
      results.push({ questionId, subjectKey: info.subjectKey, status: scored.status, awarded: scored.awarded.n / scored.awarded.d, assisted: assisted.includes(questionId) });
    }

    const summary = summarise(items);
    attempt.results = results;
    save();

    // Fold the outcome into the spaced-review queue.
    const queue = applyAttemptToQueue(readQueue(), results.map((result) => {
      const info = meta.get(result.questionId);
      return {
        questionId: result.questionId,
        paperId: config.paperId,
        paperYear: config.paperYear,
        n: info?.n ?? 0,
        subjectKey: result.subjectKey,
        subjectLabel: info?.subject ?? '',
        stem: info?.stem ?? '',
        status: result.status,
      };
    }));
    writeQueue(queue);

    renderResults(resultsNode, items, summary, reason, config, queue.length);
    paintNavigatorStates(items);
  }

  submitButton?.addEventListener('click', () => {
    const unanswered = panes.length - answeredCount();
    const message = unanswered > 0
      ? `${unanswered} of ${panes.length} questions are still blank. Submit anyway?`
      : 'Submit this paper and see the marks?';
    if (!window.confirm(message)) return;
    void submit();
  });

  /* ---------------- paint the result ---------------- */

  function paintNavigatorStates(items: ScoredItem[]) {
    if (!navigatorNode) return;
    const byId = new Map(items.map((item) => [item.id, item]));
    navigatorNode.querySelectorAll<HTMLButtonElement>('button[data-nav]').forEach((button) => {
      const item = byId.get(button.dataset.nav ?? '');
      if (!item) return;
      button.dataset.state = item.status === 'correct' ? 'correct'
        : item.status === 'partial' ? 'partial'
          : item.status === 'voided' ? 'answered'
            : 'wrong';
      button.textContent = item.status === 'correct' ? '✓' : item.status === 'partial' ? '~' : item.status === 'voided' ? '–' : '✕';
    });
  }

  function renderResults(
    node: HTMLElement,
    items: ScoredItem[],
    summary: ReturnType<typeof summarise>,
    reason: string | undefined,
    cfg: RunnerConfig,
    queueSize: number,
  ): void {
    const wrongCount = items.filter((item) => item.status === 'wrong' || item.status === 'blank').length;
    const total = formatMarks(summary.awarded);
    const wrongIds = items.filter((item) => item.status === 'wrong' || item.status === 'blank').map((item) => item.id);
    const subjectRows = Object.entries(summary.bySubject)
      .map(([key, value]) => `<tr><td>${escapeHtml(key)}</td><td>${formatMarks(value.awarded)} / ${value.maxMarks}</td><td>${value.correct + value.partial} of ${value.count}</td></tr>`)
      .join('');

    node.innerHTML = `
      <div class="card" style="margin-bottom:1rem">
        <p class="eyebrow">${reason === 'Time expired' ? 'Time expired · submitted automatically' : 'Result'}</p>
        <div class="score-hero">
          <b>${total}</b>
          <div>
            <strong>out of ${summary.maxMarks} marks</strong>
            <p class="micro">${summary.correct} correct · ${summary.partial} partial · ${summary.wrong} wrong · ${summary.blank} blank${summary.voided > 0 ? ` · ${summary.voided} voided by the board` : ''}</p>
          </div>
        </div>
        <table class="table" style="margin-top:.8rem"><thead><tr><th>Subject</th><th>Marks</th><th>Correct or partial</th></tr></thead><tbody>${subjectRows}</tbody></table>
        <p class="micro">
          Category I: +1 for the correct option, −1/4 for a wrong or multiple answer. Category II: +2 for every correct
          option with no wrong option, 0 when a wrong option is marked, and 2 × marked correct ÷ total correct for a
          correct subset. This paper marked ${summary.scoredCount} questions worth ${summary.maxMarks} marks;
          ${cfg.scopeQuestions} questions were in scope.
        </p>
        <div class="btn-row" style="margin-top:.8rem">
          <button class="btn small" type="button" data-retry-wrong ${wrongIds.length > 0 ? '' : 'disabled'}>Retry the ${wrongCount} wrong or blank</button>
          <a class="btn ghost small" href="${cfg.base}review/">Open the review desk</a>
          <a class="btn ghost small" href="${cfg.base}">Back to Today</a>
        </div>
        ${queueSize > 0 ? `<p class="micro">${queueSize} question${queueSize === 1 ? '' : 's'} now wait for spaced review.</p>` : ''}
      </div>
      <h3 style="margin-top:1.2rem">Every item</h3>
      <div class="stack">
        ${items.map((item) => `
          <div class="result-row" data-result-row="${escapeHtml(item.id)}">
            <div class="row-between">
              <span><strong>Q${item.n}</strong> · ${escapeHtml(item.subject)} · Category ${item.category} · ${item.marks} mark${item.marks === 1 ? '' : 's'}</span>
              <span class="pill ${item.status}">${statusLabel(item.status)}</span>
            </div>
            <p class="small" style="margin:.2rem 0"><strong>${formatMarks(item.awarded)} mark${Math.abs(item.awarded.n / item.awarded.d) === 1 ? '' : 's'}</strong> · you marked ${item.selected.length ? item.selected.join(', ') : 'nothing'} · key ${item.key.length ? item.key.join(', ') : '—'}</p>
            <p class="micro" style="margin:0">${escapeHtml(item.explanation)}</p>
          </div>`).join('')}
      </div>`;

    node.querySelector<HTMLButtonElement>('[data-retry-wrong]')?.addEventListener('click', () => {
      const target = new URL(`${cfg.base}practice/${cfg.paperId}/${cfg.subjectKey ? `${cfg.subjectKey}/` : ''}`, window.location.origin);
      target.searchParams.set('retry', cfg.attemptId);
      window.location.href = target.href;
    });
  }

  const statusLabel = (status: string) => ({
    correct: 'Correct', partial: 'Partial', wrong: 'Wrong', blank: 'Blank', voided: 'Voided', unmarked: 'Not marked',
  }[status] ?? status);

  const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character] ?? character));

  /* ---------------- start ---------------- */

  // On a narrow screen the navigator lives behind its button; on a wide screen
  // it is a permanent column.
  if (window.matchMedia('(max-width: 45.99rem)').matches && navPanel && !navPanel.hasAttribute('hidden')) {
    navPanel.setAttribute('hidden', '');
    navToggle?.setAttribute('aria-expanded', 'false');
  }

  paintOptions();
  paintNavigator();
  paintClock();
  show(0);
  startClock();
  save();
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); });
}
