/**
 * Attempt storage.
 *
 * Every attempt lives in this browser only: no account, no upload, no sync.
 * The storage helpers never throw — a learner whose browser blocks storage
 * still gets a working session, and is told plainly that nothing was saved.
 */

export type AttemptMode = 'mock' | 'drill' | 'quiz';

export type AttemptItemResult = {
  questionId: string;
  subjectKey: string;
  status: string;
  awarded: number;
  assisted: boolean;
};

export type Attempt = {
  id: string;
  paperId: string;
  paperYear: number;
  paperLabel: string;
  title: string;
  mode: AttemptMode;
  subjectKey: string | null;
  subjectLabel: string | null;
  questionIds: string[];
  startedAt: number;
  updatedAt: number;
  submittedAt: number | null;
  /**
   * Identifies one submission.
   *
   * The first submission of a paper is the one that stands. A second tab that
   * submits later must not replace it. This token says which submission the
   * stored attempt holds, so the tab that owns it can still finish writing
   * its results while everyone else is locked out.
   */
  submissionId: string | null;
  timeSpentSeconds: number;
  /**
   * The moment the paper expires, fixed when the attempt starts.
   *
   * The remaining time is derived from this value and the wall clock, never
   * from a counter, so a reload, a backgrounded tab or a paused render loop
   * cannot hand the learner extra time.
   */
  deadlineAt: number | null;
  /** questionId → selected option letters */
  responses: Record<string, string[]>;
  /**
   * questionId → when that answer was last changed.
   *
   * Two tabs on the same paper must not silently overwrite each other, so
   * every answer carries its own timestamp and the newest one wins.
   */
  responseTimes: Record<string, number>;
  /** questionIds flagged for review */
  marked: string[];
  /** questionIds the learner opened */
  visited: string[];
  /** questionIds where a hint or the answer was opened before submitting */
  assisted: string[];
  limitSeconds: number | null;
  /** paper-level completeness facts shown next to the result */
  scopeMarks: number;
  scopeQuestions: number;
  /**
   * The specification of a composed mock, when this attempt is one.
   *
   * A mock is not a paper in the archive, so the only way back to it is the
   * link that composed it. It is kept on the attempt so the review desk and
   * the dashboard can reopen the same mock.
   */
  mockSpec?: string | null;
  /**
   * The specification of a notebook quiz, when this attempt is one.
   *
   * A quiz is not a paper and not a mock, so it keeps its own link: the only
   * way back to it is the specification that composed it.
   */
  quizSpec?: string | null;
  /**
   * The paper each question of a composed mock came from.
   *
   * A mock draws from several previous-year papers. The review queue files a
   * wrong question under the paper that actually holds it, so the learner is
   * always sent to a page that has the question on it.
   */
  sources?: Record<string, { paperId: string; year: number; n: number }> | null;
  /** Filled in when the attempt is submitted; the outcome of every item. */
  results?: AttemptItemResult[];
};

const STORAGE_KEY = 'jelet:attempts:v1';
const MAX_ATTEMPTS = 60;

export const attemptStorageKey = STORAGE_KEY;

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

export function readAttempts(): Attempt[] {
  const store = storage();
  if (!store) return [];
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { attempts?: Attempt[] };
    if (!parsed || !Array.isArray(parsed.attempts)) return [];
    return parsed.attempts.filter((attempt) => attempt && typeof attempt.id === 'string' && Array.isArray(questionIdsOf(attempt)));
  } catch {
    return [];
  }
}

function questionIdsOf(attempt: Attempt): string[] {
  return Array.isArray(attempt.questionIds) ? attempt.questionIds : [];
}

export function writeAttempts(attempts: Attempt[]): boolean {
  const store = storage();
  if (!store) return false;
  try {
    store.setItem(STORAGE_KEY, JSON.stringify({ schema: 1, attempts: attempts.slice(0, MAX_ATTEMPTS) }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Merge an incoming attempt into the stored one.
 *
 * Two rules matter for an exam rehearsal:
 *
 * 1. **A submitted result is final.** Once an attempt has `submittedAt`, its
 *    responses and results are never rewritten. A second tab that submits
 *    later cannot overwrite the first submission, and the first submission
 *    is the one that stands.
 * 2. **Two live tabs must not erase each other.** Each answer carries the
 *    time it was last changed, so the newest answer for a question wins and
 *    an answer only the other tab has typed survives.
 */
export function mergeAttempt(stored: Attempt | undefined, incoming: Attempt): Attempt {
  if (!stored) return incoming;

  // The earliest start wins so the deadline cannot be pushed back by a tab
  // that was opened later.
  const startedAt = Math.min(stored.startedAt, incoming.startedAt);
  const deadlineAt = stored.deadlineAt ?? incoming.deadlineAt;

  // A paper that has already been submitted is settled. The only writer
  // allowed to continue is the tab that owns that submission, so it can
  // finish saving the results it computed.
  if (stored.submittedAt) {
    const ownsSubmission = stored.submissionId !== null && stored.submissionId === incoming.submissionId;
    if (!ownsSubmission) {
      return { ...stored, updatedAt: Math.max(stored.updatedAt, incoming.updatedAt) };
    }
    return {
      ...stored,
      ...incoming,
      startedAt,
      deadlineAt,
      submittedAt: stored.submittedAt,
      submissionId: stored.submissionId,
      results: incoming.results ?? stored.results,
      updatedAt: Math.max(stored.updatedAt, incoming.updatedAt),
    };
  }

  const responses: Record<string, string[]> = {};
  const responseTimes: Record<string, number> = {};
  const questions = new Set([...Object.keys(stored.responses ?? {}), ...Object.keys(incoming.responses ?? {})]);
  for (const questionId of questions) {
    const storedTime = stored.responseTimes?.[questionId] ?? 0;
    const incomingTime = incoming.responseTimes?.[questionId] ?? 0;
    if (incomingTime >= storedTime && incoming.responses?.[questionId]) {
      responses[questionId] = incoming.responses[questionId];
      responseTimes[questionId] = incomingTime;
    } else {
      responses[questionId] = stored.responses?.[questionId] ?? [];
      responseTimes[questionId] = storedTime;
    }
  }

  const union = (a: string[] = [], b: string[] = []) => [...new Set([...a, ...b])];

  return {
    ...stored,
    ...incoming,
    startedAt,
    deadlineAt,
    responses,
    responseTimes,
    marked: union(stored.marked, incoming.marked),
    visited: union(stored.visited, incoming.visited),
    assisted: union(stored.assisted, incoming.assisted),
    // A submission is only accepted if nobody had already submitted.
    submittedAt: incoming.submittedAt ?? stored.submittedAt,
    submissionId: incoming.submissionId ?? stored.submissionId,
    results: incoming.submittedAt ? incoming.results ?? stored.results : stored.results,
  };
}

export function upsertAttempt(attempt: Attempt): { saved: boolean; attempts: Attempt[] } {
  const attempts = readAttempts();
  const index = attempts.findIndex((entry) => entry.id === attempt.id);
  if (index === -1) attempts.unshift(attempt);
  else attempts[index] = mergeAttempt(attempts[index], attempt);
  const saved = writeAttempts(attempts);
  return { saved, attempts };
}

export function getAttempt(id: string): Attempt | undefined {
  return readAttempts().find((attempt) => attempt.id === id);
}

export function deleteAttempt(id: string): boolean {
  const attempts = readAttempts().filter((attempt) => attempt.id !== id);
  return writeAttempts(attempts);
}

export function clearAttempts(): boolean {
  return writeAttempts([]);
}
