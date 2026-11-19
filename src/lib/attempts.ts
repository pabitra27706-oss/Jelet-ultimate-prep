/**
 * Attempt storage.
 *
 * Every attempt lives in this browser only: no account, no upload, no sync.
 * The storage helpers never throw — a learner whose browser blocks storage
 * still gets a working session, and is told plainly that nothing was saved.
 */

export type AttemptMode = 'mock' | 'drill';

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
  timeSpentSeconds: number;
  /** questionId → selected option letters */
  responses: Record<string, string[]>;
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

export function upsertAttempt(attempt: Attempt): { saved: boolean; attempts: Attempt[] } {
  const attempts = readAttempts();
  const index = attempts.findIndex((entry) => entry.id === attempt.id);
  if (index === -1) attempts.unshift(attempt);
  else attempts[index] = attempt;
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

/** Stable id for one set, so a resumed session keeps its own history. */
export function attemptId(paperId: string, scope: string): string {
  return `${paperId}::${scope}`;
}
