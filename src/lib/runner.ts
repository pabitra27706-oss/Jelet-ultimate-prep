/**
 * The practice runner.
 *
 * A static page with a small client-side engine: pick options, watch the
 * clock, mark for review, submit, and see the real JELET marking applied to
 * every item. State lives in this browser only; nothing is uploaded.
 */
import { readAttempts, upsertAttempt, type Attempt, type AttemptItemResult } from './attempts';
import { applyAttemptToQueue, readQueue, writeQueue } from './review';
import { scoreItem, summarise, formatMarks, toNumber, type ScoredItem, type AttemptSummary, type ItemStatus } from './scoring';

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
  /**
   * Where the "repeat the wrong ones" button goes.
   *
   * A paper rehearsal repeats itself. A composed mock repeats the mock, so
   * the route is supplied rather than derived from the paper id.
   */
  retryPath?: string | null;
  /**
   * The paper each question came from, by question id.
   *
   * A mock draws from several previous-year papers, so the review queue has
   * to know which paper each question belongs to. Without this, a wrong
   * question from 2024 would be filed under the mock and the learner would be
   * sent to a page that does not hold it.
   */
  sources?: Record<string, { paperId: string; year: number; n: number }> | null;
  /**
   * The specification of a composed mock, kept on the attempt so the review
   * desk can reopen the same mock.
   */
  mockSpec?: string | null;
};

type KeyEntry = { key: string[]; tier: string; voided: boolean; reasoning?: string };

/**
 * A scored item, with the paper it came from.
 *
 * A full paper needs no source: it is the paper. A composed mock draws from
 * several, and the learner is told which one each question belongs to.
 */
type RunnerItem = ScoredItem & {
  sourcePaperId: string;
  sourceYear: number;
  sourceN: number;
  /** Where the key came from: `official`, `derived`, or empty when unknown. */
  tier: string;
  /** True when the learner used an assistance option on this item. */
  assisted: boolean;
};

const readKeyFile = async (url: string): Promise<Record<string, KeyEntry>> => {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Answer key could not be loaded (${response.status})`);
  const data = (await response.json()) as { keys?: Record<string, KeyEntry> };
  return data.keys ?? {};
};

/**
 * Read the runner's settings off the page.
 *
 * The shell of the runner is rendered by one component, so the full paper and
 * the composed mock describe themselves in exactly the same way. Anything the
 * page cannot know in advance — the questions a mock composed, where each of
 * them came from — is passed in as an override.
 */
export function readRunnerConfig(root: HTMLElement, overrides: Partial<RunnerConfig> = {}): RunnerConfig {
  const scope = root.dataset.scope ?? 'full';
  const retryAttemptId = new URLSearchParams(window.location.search).get('retry');
  const questionIds = [...root.querySelectorAll<HTMLElement>('.pane[data-question]')].map((node) => node.dataset.question ?? '');
  const paperId = root.dataset.paper ?? '';
  return {
    attemptId: attemptIdOf(paperId, root.dataset.attemptScope ?? scope, retryAttemptId),
    paperId,
    paperYear: Number(root.dataset.paperYear ?? '0'),
    paperLabel: root.dataset.paperLabel ?? '',
    title: root.dataset.title ?? '',
    mode: (root.dataset.mode as 'mock' | 'drill') ?? 'mock',
    subjectKey: root.dataset.subjectKey || null,
    subjectLabel: root.dataset.subjectLabel || null,
    limitSeconds: root.dataset.limitSeconds ? Number(root.dataset.limitSeconds) : null,
    questionIds,
    scopeMarks: Number(root.dataset.scopeMarks ?? '0'),
    scopeQuestions: Number(root.dataset.scopeQuestions ?? String(questionIds.length)),
    keysUrl: root.dataset.keysUrl ?? '/data/keys.json',
    base: root.dataset.base ?? '/',
    retryAttemptId,
    retryPath: root.dataset.retryPath || null,
    ...overrides,
  };
}

/** Stable id for one set, so a resumed session keeps its own history. */
function attemptIdOf(paperId: string, scope: string, retryAttemptId: string | null): string {
  return `${paperId}::${retryAttemptId ? `${scope}::retry-${retryAttemptId}` : scope}`;
}

const readQuestionMeta = (root: ParentNode) => {
  const meta = new Map<string, { n: number; position: number; category: 'I' | 'II'; marks: number; subjectKey: string; subject: string; stem: string; voided: boolean; sourcePaperId: string; sourceYear: number; sourceN: number }>();
  root.querySelectorAll<HTMLElement>('.pane[data-question]').forEach((node) => {
    const id = node.dataset.question;
    if (!id) return;
    const sourcePaperId = node.dataset.sourcePaper ?? '';
    const sourceYear = Number(node.dataset.sourceYear ?? '0');
    const sourceN = Number(node.dataset.sourceN ?? node.dataset.n ?? '0');
    meta.set(id, {
      n: Number(node.dataset.n ?? '0'),
      position: Number(node.dataset.position ?? node.dataset.n ?? '0'),
      category: (node.dataset.category === 'II' ? 'II' : 'I'),
      marks: Number(node.dataset.marks ?? '1'),
      subjectKey: node.dataset.subjectKey ?? 'other',
      subject: node.dataset.subject ?? '',
      stem: node.querySelector('.qstem')?.textContent?.trim().slice(0, 160) ?? '',
      // The board voided this item: it awarded the marks to every candidate,
      // so the runner marks it for the learner and never asks for an answer.
      voided: node.dataset.voided === 'true',
      // Where this question came from. A composed mock draws from several
      // papers, so the source is recorded per question rather than per set.
      sourcePaperId,
      sourceYear,
      sourceN,
    });
  });
  return meta;
};

export function initRunner(config: RunnerConfig, rootOverride?: HTMLElement | null): void {
  const root = rootOverride ?? document.querySelector<HTMLElement>('[data-runner]');
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

  const storageNote = root.querySelector<HTMLElement>('[data-runner-storage]');
  const timerNode = root.querySelector<HTMLElement>('[data-runner-timer]');
  const progressNode = root.querySelector<HTMLElement>('[data-runner-progress-text]');
  const progressBar = root.querySelector<HTMLElement>('[data-runner-progress-bar]');
  const submitButton = root.querySelector<HTMLButtonElement>('[data-runner-submit]');
  const clearButton = root.querySelector<HTMLButtonElement>('[data-runner-clear]');
  const resultsNode = root.querySelector<HTMLElement>('[data-runner-results]');
  const paperNode = root.querySelector<HTMLElement>('[data-runner-paper]');
  const navigatorNode = root.querySelector<HTMLElement>('[data-runner-nav]');
  const markButton = root.querySelector<HTMLButtonElement>('[data-runner-mark]');
  const navPanel = root.querySelector<HTMLElement>('[data-runner-navpanel]');
  const navToggle = root.querySelector<HTMLButtonElement>('[data-runner-navtoggle]');
  const announce = root.querySelector<HTMLElement>('[data-runner-announce]');

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
    submissionId: existing?.submissionId ?? null,
    timeSpentSeconds: existing?.timeSpentSeconds ?? 0,
    deadlineAt: existing?.deadlineAt ?? (config.limitSeconds === null ? null : (existing?.startedAt ?? Date.now()) + config.limitSeconds * 1000),
    responses,
    responseTimes: existing?.responseTimes ?? {},
    marked,
    visited,
    assisted,
    limitSeconds: config.limitSeconds,
    scopeMarks: config.scopeMarks,
    scopeQuestions: config.scopeQuestions,
    // A composed mock is not a paper, so it carries its own specification
    // and the paper each of its questions came from. Without them the review
    // desk could not reopen the mock or link a wrong question back to the
    // paper that holds it.
    mockSpec: config.mockSpec ?? existing?.mockSpec ?? null,
    sources: config.sources ?? existing?.sources ?? null,
  };

  const save = () => {
    attempt.responses = responses;
    attempt.responseTimes = responseTimes;
    attempt.marked = marked;
    attempt.visited = visited;
    attempt.assisted = assisted;
    attempt.updatedAt = Date.now();
    const { saved, attempts } = upsertAttempt(attempt);
    // If another tab already submitted this paper, its result is the one that
    // stands. Reflect that here so this tab stops accepting changes.
    const stored = attempts.find((entry) => entry.id === attempt.id);
    if (stored?.submittedAt && stored.submissionId !== attempt.submissionId) {
      submitted = true;
      if (tick !== undefined) window.clearInterval(tick);
      if (announce) announce.textContent = 'This paper was already submitted in another tab. Its result has been kept.';
      attempt.submittedAt = stored.submittedAt;
      attempt.submissionId = stored.submissionId;
      attempt.results = stored.results;
      paintProgress();
    }
    if (storageNote) {
      storageNote.textContent = saved
        ? 'Saved on this device.'
        : 'This browser is blocking storage, so this attempt will be lost when the tab closes.';
    }
  };

  /* ---------------- rendering ---------------- */

  /**
   * The board awarded some items to every candidate. The learner is not asked
   * for an answer on those, so they are not part of the answering progress
   * and they never count as blank.
   */
  const voidedPanes = new Set(panes.filter((id) => meta.get(id)?.voided));
  const answerablePanes = panes.filter((id) => !voidedPanes.has(id));
  const answeredCount = () => answerablePanes.filter((id) => (responses[id] ?? []).length > 0).length;
  const responseTimes = { ...(existing?.responseTimes ?? {}) };

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
      const isVoided = voidedPanes.has(questionId);
      const state = isVoided ? 'voided' : isMarked ? 'marked' : selected ? 'answered' : 'unanswered';
      button.dataset.state = state;
      button.setAttribute('aria-label', `Question ${button.textContent?.trim()}${isVoided ? ', voided by the board and awarded to every candidate' : selected ? ', answered' : ''}${isMarked ? ', marked for review' : ''}`);
    });
  }

  function paintProgress() {
    const answered = answeredCount();
    const total = answerablePanes.length;
    if (progressNode) {
      progressNode.textContent = voidedPanes.size > 0
        ? `${answered} of ${total} answered · ${voidedPanes.size} voided by the board`
        : `${answered} of ${total} answered`;
    }
    if (progressBar) {
      const ratio = total > 0 ? answered / total : 0;
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
      // A voided item was awarded by the board to every candidate, so there is
      // nothing to mark. The options stay readable; they are just not live.
      if (voidedPanes.has(questionId)) return;
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
      responseTimes[questionId] = Date.now();
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
    for (const key of Object.keys(responseTimes)) delete responseTimes[key];
    // Clearing starts the paper over, so the clock restarts with it.
    attempt.startedAt = Date.now();
    attempt.deadlineAt = config.limitSeconds === null ? null : attempt.startedAt + config.limitSeconds * 1000;
    if (config.limitSeconds !== null) {
      const minutes = Math.floor(config.limitSeconds / 60);
      const seconds = config.limitSeconds % 60;
      if (timerNode) timerNode.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    marked = [];
    save();
    paintOptions();
    paintNavigator();
    paintProgress();
    if (announce) announce.textContent = 'All answers cleared.';
  });

  /* ---------------- clock ---------------- */

  // The deadline is fixed when the attempt starts and is derived from the
  // wall clock, never from a counter. A reload, a backgrounded tab or a
  // throttled render loop therefore cannot hand back time.
  const startedAt = existing?.startedAt ?? Date.now();
  const deadlineAt = existing?.deadlineAt
    ?? (config.limitSeconds === null ? null : startedAt + config.limitSeconds * 1000);

  const remainingSeconds = (): number => {
    if (config.limitSeconds === null || deadlineAt === null) return 0;
    return Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000));
  };

  let tick: number | undefined;

  function paintClock() {
    if (!timerNode) return;
    if (config.limitSeconds === null) {
      timerNode.textContent = 'No time limit';
      timerNode.classList.remove('warn');
      return;
    }
    const remaining = remainingSeconds();
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    timerNode.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerNode.classList.toggle('warn', remaining <= 60);
  }

  function startClock() {
    if (config.limitSeconds === null || submitted) return;
    if (tick !== undefined) window.clearInterval(tick);
    const check = () => {
      const remaining = remainingSeconds();
      attempt.timeSpentSeconds = Math.floor((Date.now() - startedAt) / 1000);
      paintClock();
      if (remaining === 0) {
        if (tick !== undefined) window.clearInterval(tick);
        if (announce) announce.textContent = 'Time is up. The paper was submitted automatically.';
        void submit('Time expired');
      }
    };
    check();
    tick = window.setInterval(check, 1000);
    // A tab that was in the background may have missed ticks; re-check when
    // the learner comes back so the clock never looks frozen.
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
  }

  /* ---------------- submit + score ---------------- */

  async function submit(reason?: string): Promise<void> {
    if (submitted) return;

    // Another tab may have submitted this paper while this one was open.
    // The first submission stands; this tab shows that result instead of
    // replacing it.
    const storedAttempt = readAttempts().find((entry) => entry.id === config.attemptId);
    if (storedAttempt?.submittedAt) {
      submitted = true;
      if (tick !== undefined) window.clearInterval(tick);
      attempt.submittedAt = storedAttempt.submittedAt;
      attempt.results = storedAttempt.results;
      if (announce) announce.textContent = 'This paper was already submitted in another tab. Its result has been kept.';
      paintProgress();
      if (resultsNode && storedAttempt.results) {
        resultsNode.hidden = false;
        resultsNode.innerHTML = '<div class="notice">This paper was already submitted in another tab. That result has been kept, and nothing here was changed.</div>';
        focusResult();
      }
      return;
    }

    submitted = true;
    if (tick !== undefined) window.clearInterval(tick);
    attempt.submittedAt = Date.now();
    // This token marks this tab's submission as the one that stands.
    attempt.submissionId = `sub-${attempt.submittedAt}-${Math.random().toString(36).slice(2, 8)}`;
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

    const items: RunnerItem[] = [];
    const results: AttemptItemResult[] = [];
    for (const questionId of attempt.questionIds) {
      const info = meta.get(questionId);
      if (!info) continue;
      const entry = keys[questionId];
      const keyLetters = entry?.key ?? [];
      const selected = responses[questionId] ?? [];
      // The pane's own disposition is authoritative: the board voided this
      // item, so it awards its marks to every candidate whatever the answer
      // key file happens to say.
      const isVoided = info.voided || Boolean(entry?.voided);
      const scored = isVoided
        ? scoreItem({ category: info.category, marks: info.marks, key: keyLetters, voided: true }, selected)
        : entry
          ? scoreItem({ category: info.category, marks: info.marks, key: keyLetters, voided: false }, selected)
          : { status: 'unmarked' as const, awarded: { n: 0, d: 1 }, selected, key: keyLetters, explanation: 'No published key for this item.' };
      items.push({
        ...scored,
        id: questionId,
        n: info.n,
        subject: info.subject,
        subjectKey: info.subjectKey,
        category: info.category,
        marks: info.marks,
        // Where the question came from. A composed mock draws from several
        // papers, and the learner is told which one each question belongs to.
        sourcePaperId: info.sourcePaperId,
        sourceYear: info.sourceYear,
        sourceN: info.sourceN,
        tier: entry?.tier ?? '',
        assisted: assisted.includes(questionId),
      });
      results.push({ questionId, subjectKey: info.subjectKey, status: scored.status, awarded: scored.awarded.n / scored.awarded.d, assisted: assisted.includes(questionId) });
    }

    attempt.results = results;
    save();

    // Fold the outcome into the spaced-review queue.
    const queue = applyAttemptToQueue(readQueue(), results.map((result) => {
      const info = meta.get(result.questionId);
      // A composed mock draws from several papers. Each question is filed
      // under the paper it actually came from, so the review desk always
      // links to a page that holds it.
      const source = config.sources?.[result.questionId];
      return {
        questionId: result.questionId,
        paperId: source?.paperId ?? config.paperId,
        paperYear: source?.year ?? config.paperYear,
        n: source?.n ?? info?.sourceN ?? info?.n ?? 0,
        subjectKey: result.subjectKey,
        subjectLabel: info?.subject ?? '',
        stem: info?.stem ?? '',
        status: result.status as ItemStatus,
      };
    }));
    writeQueue(queue);

    renderResults(resultsNode, items, { reason, queueSize: queue.length }, config);
    focusResult(true);
    paintNavigatorStates(items);
  }

  submitButton?.addEventListener('click', () => {
    const unanswered = answerablePanes.length - answeredCount();
    const message = unanswered > 0
      ? `${unanswered} of ${answerablePanes.length} questions are still blank. Submit anyway?`
      : 'Submit this paper and see the marks?';
    if (!window.confirm(message)) return;
    void submit();
  });

  /* ---------------- paint the result ---------------- */

  function paintNavigatorStates(items: RunnerItem[]) {
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

  /** The sitting is over: the result is the screen, so its controls step aside. */
  function focusResult(scroll = false): void {
    container.querySelector<HTMLElement>('.runner-bar')?.setAttribute('hidden', '');
    if (navPanel) navPanel.hidden = true;
    if (storageNote) storageNote.hidden = true;
    if (paperNode) paperNode.hidden = true;
    if (scroll && resultsNode) resultsNode.scrollIntoView({ block: 'start' });
  }

  type ResultOptions = {
    reason?: string;
    queueSize: number;
    /** True when the result comes from the saved attempt instead of a fresh marking. */
    recorded?: boolean;
  };

  const statusName = (status: string): string => ({
    correct: 'Correct',
    partial: 'Partial',
    wrong: 'Wrong',
    blank: 'Blank',
    voided: 'Board-awarded',
    unmarked: 'Not marked',
  }[status] ?? status);

  const statusGlyph = (status: string): string => ({
    correct: '✓', partial: '~', wrong: '✕', blank: '○', voided: '–', unmarked: '?',
  }[status] ?? '•');

  const tierLine = (tier: string): string => ({
    official: 'Key: official board answer key.',
    derived: 'Key: derived key — not an official board key.',
    none: 'Key: no published key for this question.',
  }[tier] ?? 'Key: source tier not recorded for this item.');

  function renderResults(
    node: HTMLElement,
    items: RunnerItem[],
    options: ResultOptions,
    cfg: RunnerConfig,
  ): void {
    // A question with no published key cannot be marked, so it is outside the
    // denominator rather than counted as wrong.
    const scoreable = items.filter((item) => item.status !== 'unmarked');
    const held = items.length - scoreable.length;
    const summary: AttemptSummary = summarise(scoreable);
    const maxMarks = summary.maxMarks;
    const awardedNumber = toNumber(summary.awarded);
    const percent = maxMarks > 0 ? Math.round((awardedNumber / maxMarks) * 100) : 0;
    const total = formatMarks(summary.awarded);
    const wrongIds = items.filter((item) => item.status === 'wrong' || item.status === 'blank').map((item) => item.id);
    const wrongCount = wrongIds.length;
    const assistedCount = items.filter((item) => item.assisted).length;
    // A composed mock draws from several papers, so each result says which one.
    const showSource = items.some((item) => item.sourcePaperId && item.sourcePaperId !== cfg.paperId);

    const subjectLabel = new Map(items.map((item) => [item.subjectKey, item.subject]));
    const subjectRows = Object.entries(summary.bySubject)
      .map(([key, value]) => `<tr><td>${escapeHtml(subjectLabel.get(key) ?? key)}</td><td>${formatMarks(value.awarded)} / ${value.maxMarks}</td><td>${value.correct + value.partial} of ${value.count}</td></tr>`)
      .join('');

    // The lowest-scoring subject is a fact, not a diagnosis: it is read from
    // this attempt's own marks and never guessed.
    const subjects = Object.entries(summary.bySubject)
      .filter(([, value]) => value.maxMarks > 0 && value.correct + value.partial + value.wrong > 0);
    const weakest = subjects.length > 1
      ? subjects.reduce((low, entry) => (toNumber(entry[1].awarded) / entry[1].maxMarks < toNumber(low[1].awarded) / low[1].maxMarks ? entry : low))
      : null;
    const weakestLine = weakest
      ? `<a class="result-focus" href="${cfg.base}review/">
          <span class="result-focus-mark" aria-hidden="true">↓</span>
          <span class="result-focus-copy">
            <span class="result-focus-label">Where to look first</span>
            <strong>${escapeHtml(subjectLabel.get(weakest[0]) ?? weakest[0])}: ${formatMarks(weakest[1].awarded)} of ${weakest[1].maxMarks} marks</strong>
            <span class="result-focus-note">Lowest marks in this set · open the review desk</span>
          </span>
        </a>`
      : '';

    const counts = [
      { key: 'correct', label: 'Correct', value: summary.correct },
      { key: 'partial', label: 'Partial', value: summary.partial },
      { key: 'wrong', label: 'Wrong', value: summary.wrong },
      { key: 'blank', label: 'Blank', value: summary.blank },
      { key: 'voided', label: 'Board-awarded', value: summary.voided },
      { key: 'assisted', label: 'Assisted', value: assistedCount },
    ].filter((entry) => entry.value > 0)
      .map((entry) => `<li class="result-count" data-count="${entry.key}"><span class="dot" aria-hidden="true"></span><b>${entry.value}</b> ${entry.label}</li>`)
      .join('');

    const summarySentence = `${summary.correct} correct · ${summary.partial} partial · ${summary.wrong} wrong · ${summary.blank} blank`
      + (summary.voided > 0 ? ` · ${summary.voided} voided by the board` : '')
      + (assistedCount > 0 ? ` · ${assistedCount} assisted` : '');

    const denominatorNote = `${maxMarks} mark${maxMarks === 1 ? '' : 's'} could be awarded by the ${scoreable.length} markable question${scoreable.length === 1 ? '' : 's'}, so the percentage is marks awarded ÷ ${maxMarks}. ${cfg.scopeQuestions} question${cfg.scopeQuestions === 1 ? '' : 's'} were in scope.`
      + (held > 0 ? ` ${held} question${held === 1 ? ' has' : 's have'} no published key and ${held === 1 ? 'is' : 'are'} outside that total.` : '');

    const recordedNote = options.recorded
      ? 'This is the result saved when you submitted. It is shown as recorded, not recalculated, so a later key correction cannot change it.'
      : '';

    const itemRows = items.map((item) => {
      const numeric = toNumber(item.awarded);
      const marksText = formatMarks(item.awarded).replace('-', '−');
      const signed = numeric > 0 ? `+${marksText}` : marksText;
      const selected = item.selected.length ? item.selected.join(', ') : 'nothing marked';
      const keyText = item.key.length ? item.key.join(', ') : 'no key recorded';
      const reader = item.sourcePaperId
        ? `${cfg.base}library/${item.sourcePaperId}/#subject-${item.subjectKey}`
        : '';
      const sourceLine = showSource && item.sourcePaperId
        ? `<span class="result-item-source">${item.sourceYear} · Q${item.sourceN}</span>`
        : '';
      return `
        <details class="result-item" data-result-row="${escapeHtml(item.id)}" data-status="${item.status}">
          <summary>
            <span class="result-item-main">
              <strong>Question ${item.n}</strong>
              <span class="result-item-sub">${escapeHtml(item.subject)} · ${item.marks} mark${item.marks === 1 ? '' : 's'}${sourceLine ? ` · ${sourceLine}` : ''}</span>
            </span>
            <span class="pill ${item.status}">${statusGlyph(item.status)} ${statusName(item.status)}</span>
            <span class="result-chevron" aria-hidden="true">›</span>
          </summary>
          <div class="result-item-body">
            <dl class="result-facts">
              <div><dt>Category</dt><dd>${item.category} · ${item.marks} mark${item.marks === 1 ? '' : 's'}</dd></div>
              <div><dt>Your answer</dt><dd>${escapeHtml(selected)}</dd></div>
              <div><dt>Key</dt><dd>${escapeHtml(keyText)}</dd></div>
              <div><dt>Marks awarded</dt><dd><strong>${signed}</strong> of ${item.marks}</dd></div>
            </dl>
            <p class="micro">${escapeHtml(item.explanation)}</p>
            <p class="micro">${escapeHtml(tierLine(item.tier))}${item.assisted ? ' Assistance was used on this question.' : ''}</p>
            ${reader ? `<a class="result-item-link" href="${reader}">Read this question in the paper</a>` : ''}
          </div>
        </details>`;
    }).join('');

    node.innerHTML = `
      <div class="result-view" data-result-view>
        <section class="result-hero" aria-labelledby="result-heading">
          <div class="result-ring" style="--result-value:${Math.max(0, Math.min(100, percent))}" role="img"
               aria-label="Marks awarded: ${percent} percent of the markable total">
            <span class="result-ring-value">${percent}%</span>
          </div>
          <div class="result-hero-copy">
            <p class="eyebrow">${options.recorded ? 'Recorded result' : options.reason === 'Time expired' ? 'Time expired · submitted automatically' : 'Practice result'}</p>
            <div class="score-hero">
              <b>${total}</b>
              <span class="result-denominator">of ${maxMarks} marks</span>
            </div>
            <p class="micro result-summary">${summarySentence}</p>
          </div>
        </section>

        <p class="micro result-note">${denominatorNote}${recordedNote ? ` ${recordedNote}` : ''}</p>

        <ul class="result-counts" aria-label="Outcome of this attempt">${counts}</ul>

        ${weakestLine}

        <section class="result-list" aria-labelledby="result-list-heading">
          <div class="result-list-head">
            <h3 id="result-list-heading">Every question</h3>
            <span class="micro">${items.length} question${items.length === 1 ? '' : 's'} · open one to review it</span>
          </div>
          ${itemRows}
          ${subjectRows ? `<details class="result-subjects">
            <summary>Marks by subject</summary>
            <div class="table-wrap"><table class="table"><thead><tr><th>Subject</th><th>Marks</th><th>Correct or partial</th></tr></thead><tbody>${subjectRows}</tbody></table></div>
          </details>` : ''}
        </section>

        <div class="result-actions">
          <button class="btn" type="button" data-retry-wrong ${wrongCount > 0 ? '' : 'disabled'}>Retry the ${wrongCount} wrong or blank</button>
          <a class="btn ghost" href="${cfg.base}review/">Review answers</a>
          <a class="result-action-back" href="${cfg.base}">Back to Today</a>
        </div>
        ${options.queueSize > 0 ? `<p class="micro">${options.queueSize} question${options.queueSize === 1 ? '' : 's'} now wait${options.queueSize === 1 ? 's' : ''} for spaced review.</p>` : ''}
      </div>`;

    node.querySelector<HTMLButtonElement>('[data-retry-wrong]')?.addEventListener('click', () => {
      // A paper rehearsal repeats itself; a composed mock repeats the mock.
      const path = cfg.retryPath ?? `${cfg.base}practice/${cfg.paperId}/${cfg.subjectKey ? `${cfg.subjectKey}/` : ''}`;
      const target = new URL(path, window.location.origin);
      target.searchParams.set('retry', cfg.attemptId);
      window.location.href = target.href;
    });
  }

  /**
   * Show the result that was saved when this attempt was submitted.
   *
   * Nothing is recalculated: the stored statuses and marks are the record. An
   * attempt whose marked result was not saved says so instead of inventing a
   * score.
   */
  function restoreRecordedResult(): void {
    if (!resultsNode) return;
    const stored = readAttempts().find((entry) => entry.id === config.attemptId);
    if (!stored?.submittedAt) return;
    submitted = true;
    focusResult(true);
    resultsNode.hidden = false;
    const storedResults = stored.results ?? [];
    if (storedResults.length === 0) {
      resultsNode.innerHTML = '<div class="notice"><strong>This attempt is marked as submitted, but no marked result was saved on this device.</strong> Nothing is invented here: open the review desk to see what was recorded, or sit the paper again.</div>';
      return;
    }
    const items: RunnerItem[] = [];
    for (const result of storedResults) {
      const info = meta.get(result.questionId);
      if (!info) continue;
      items.push({
        id: result.questionId,
        n: info.n,
        subject: info.subject,
        subjectKey: result.subjectKey || info.subjectKey,
        category: info.category,
        marks: info.marks,
        status: result.status as ItemStatus,
        // The stored value is a decimal number; a denominator of one keeps
        // the totals exact enough for display without growing denominators.
        awarded: { n: result.awarded, d: 1 },
        selected: stored.responses?.[result.questionId] ?? [],
        key: [],
        explanation: 'Recorded when you submitted this attempt. The saved result keeps the outcome and the marks, not your marked options or the key text.',
        tier: '',
        assisted: Boolean(result.assisted),
        sourcePaperId: info.sourcePaperId,
        sourceYear: info.sourceYear,
        sourceN: info.sourceN,
      });
    }
    renderResults(resultsNode, items, { queueSize: readQueue().length, recorded: true }, config);
  }

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
  if (submitted) restoreRecordedResult();
  startClock();
  save();
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); });
}
