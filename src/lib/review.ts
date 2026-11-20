/**
 * Review queue and spaced repetition.
 *
 * Only questions the learner actually got wrong (or left blank) enter the
 * queue, so the queue is evidence of real work rather than a decorative
 * counter. Intervals follow a fixed Leitner ladder: a wrong answer sends the
 * item back to the first box, a correct answer promotes it.
 */

/**
 * Why the learner says they got it wrong.
 *
 * The tag is voluntary. It is never required, never scored and never used to
 * judge the learner; it exists so a person can see the shape of their own
 * mistakes — a run of "calculation" errors is a different problem from a run
 * of "concept" errors.
 */
export const mistakeReasons = ['concept', 'method', 'calculation', 'misread'] as const;
export type MistakeReason = typeof mistakeReasons[number];

/** What each tag means, in the learner's words. */
export const mistakeReasonLabels: Record<MistakeReason, string> = {
  concept: 'The idea itself',
  method: 'The method was wrong',
  calculation: 'The arithmetic went wrong',
  misread: 'I misread the question',
};

export type ReviewItem = {
  questionId: string;
  paperId: string;
  paperYear: number;
  n: number;
  subjectKey: string;
  subjectLabel: string;
  stem: string;
  box: number;
  due: number;
  seen: number;
  correctStreak: number;
  lastStatus: string;
  lastAt: number;
  /** The learner's own reason for the mistake, when they gave one. */
  reason?: MistakeReason | null;
};

const STORAGE_KEY = 'jelet:review:v1';
const MAX_ITEMS = 400;

/** Days between reviews for each box. */
export const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 16, 35];
export const MAX_BOX = BOX_INTERVAL_DAYS.length - 1;

function storage(): Storage | null {
  try {
    const probe = '__jelet_probe__';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return localStorage;
  } catch {
    return null;
  }
}

export function readQueue(): ReviewItem[] {
  const store = storage();
  if (!store) return [];
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { items?: ReviewItem[] };
    if (!parsed || !Array.isArray(parsed.items)) return [];
    return parsed.items.filter((item) => item && typeof item.questionId === 'string');
  } catch {
    return [];
  }
}

export function writeQueue(items: ReviewItem[]): boolean {
  const store = storage();
  if (!store) return false;
  try {
    store.setItem(STORAGE_KEY, JSON.stringify({ schema: 1, items: items.slice(0, MAX_ITEMS) }));
    return true;
  } catch {
    return false;
  }
}

export function clearQueue(): boolean {
  return writeQueue([]);
}

export type QueueInput = {
  questionId: string;
  paperId: string;
  paperYear: number;
  n: number;
  subjectKey: string;
  subjectLabel: string;
  stem: string;
  status: string;
};

/**
 * Fold a finished attempt into the queue: wrong, partial and blank items are
 * (re)scheduled, correct items move up a box, and an item that is answered
 * correctly twice in a row leaves the queue.
 */
export function applyAttemptToQueue(items: ReviewItem[], results: QueueInput[]): ReviewItem[] {
  const now = Date.now();
  const byId = new Map(items.map((item) => [item.questionId, item]));
  for (const result of results) {
    // A question the board voided was awarded to every candidate, so it is
    // not something the learner got wrong. It never enters the queue.
    if (result.status === 'voided') continue;
    const existing = byId.get(result.questionId);
    const passed = result.status === 'correct';
    if (passed && existing && existing.correctStreak >= 1) {
      byId.delete(result.questionId);
      continue;
    }
    const box = passed ? Math.min((existing?.box ?? 0) + 1, MAX_BOX) : 0;
    const due = now + BOX_INTERVAL_DAYS[box] * 24 * 60 * 60 * 1000;
    const item: ReviewItem = {
      questionId: result.questionId,
      paperId: result.paperId,
      paperYear: result.paperYear,
      n: result.n,
      subjectKey: result.subjectKey,
      subjectLabel: result.subjectLabel,
      stem: result.stem,
      box,
      due: passed ? due : now,
      seen: (existing?.seen ?? 0) + 1,
      correctStreak: passed ? (existing?.correctStreak ?? 0) + 1 : 0,
      lastStatus: result.status,
      lastAt: now,
    };
    byId.set(result.questionId, item);
  }
  return [...byId.values()].sort((a, b) => a.due - b.due);
}

export function dueItems(items: ReviewItem[], now = Date.now()): ReviewItem[] {
  return items.filter((item) => item.due <= now);
}

export function nextDue(items: ReviewItem[], now = Date.now()): ReviewItem | undefined {
  void now;
  return [...items].sort((a, b) => a.due - b.due)[0];
}

/**
 * Record why the learner says they got it wrong.
 *
 * The tag is theirs to give and theirs to take back: passing `null` clears
 * it. Nothing else about the item changes — the ladder still decides when it
 * comes back.
 */
export function tagReason(items: ReviewItem[], questionId: string, reason: MistakeReason | null): ReviewItem[] {
  return items.map((item) => (item.questionId === questionId ? { ...item, reason } : item));
}

/**
 * Grade one queue item by hand: a correct answer promotes it a box, a wrong
 * answer sends it back to the first box, and two correct answers in a row
 * clear it from the queue.
 */
export function gradeItem(items: ReviewItem[], questionId: string, correct: boolean): ReviewItem[] {
  const now = Date.now();
  return items
    .map((item) => {
      if (item.questionId !== questionId) return item;
      const box = correct ? Math.min(item.box + 1, MAX_BOX) : 0;
      const streak = correct ? item.correctStreak + 1 : 0;
      if (correct && streak >= 2) return null;
      return {
        ...item,
        box,
        correctStreak: streak,
        seen: item.seen + 1,
        lastStatus: correct ? 'correct' : 'wrong',
        lastAt: now,
        due: correct ? now + BOX_INTERVAL_DAYS[box] * 24 * 60 * 60 * 1000 : now,
      };
    })
    .filter((item): item is ReviewItem => item !== null);
}
