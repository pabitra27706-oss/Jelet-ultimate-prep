/**
 * Study statistics.
 *
 * Every number here is derived from recorded attempts and the review queue.
 * Nothing is estimated, extrapolated or presented as a prediction: the
 * denominator is always shown next to the numerator, a page visit never
 * counts as mastery, and an assisted answer never counts as an independent one.
 */
import type { Attempt } from './attempts';
import type { ReviewItem } from './review';

export type SubjectStat = {
  attempted: number;
  correct: number;
  partial: number;
  wrong: number;
  blank: number;
};

export type StudyStats = {
  attempts: number;
  submitted: number;
  inProgress: number;
  questionsAttempted: number;
  questionsAvailable: number;
  coverage: number;
  independentCorrect: number;
  independentAnswered: number;
  accuracy: number | null;
  assisted: number;
  bySubject: Record<string, SubjectStat>;
  queueSize: number;
  dueNow: number;
  streak: number;
  lastActivity: number | null;
};

const emptySubject = (): SubjectStat => ({ attempted: 0, correct: 0, partial: 0, wrong: 0, blank: 0 });

/** Consecutive days, ending today or yesterday, with at least one submitted attempt. */
export function streakDays(attempts: Attempt[], now = Date.now()): number {
  const days = new Set<string>();
  for (const attempt of attempts) {
    if (!attempt.submittedAt) continue;
    const date = new Date(attempt.submittedAt);
    days.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
  }
  if (days.size === 0) return 0;
  const key = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  if (!days.has(key(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(key(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(key(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function buildStats(attempts: Attempt[], queue: ReviewItem[], questionsAvailable: number, now = Date.now()): StudyStats {
  const bySubject: Record<string, SubjectStat> = {};
  /** questionId → the outcome of the learner's first submitted attempt */
  const firstOutcome = new Map<string, { status: string; assisted: boolean }>();

  const ordered = [...attempts].sort((a, b) => (a.submittedAt ?? a.updatedAt) - (b.submittedAt ?? b.updatedAt));
  for (const attempt of ordered) {
    for (const result of attempt.results ?? []) {
      // A board-voided item is awarded to everyone and is not a mark the
      // learner earned or lost, so it is not counted as an attempt.
      if (result.status === 'voided') continue;
      if (!firstOutcome.has(result.questionId)) {
        firstOutcome.set(result.questionId, { status: result.status, assisted: result.assisted });
      }
      const stat = bySubject[result.subjectKey] ?? (bySubject[result.subjectKey] = emptySubject());
      stat.attempted += 1;
      if (result.status === 'correct') stat.correct += 1;
      else if (result.status === 'partial') stat.partial += 1;
      else if (result.status === 'wrong') stat.wrong += 1;
      else if (result.status === 'blank') stat.blank += 1;
    }
  }

  let questionsAttempted = 0;
  let independentCorrect = 0;
  let independentAnswered = 0;
  let assisted = 0;
  for (const outcome of firstOutcome.values()) {
    questionsAttempted += 1;
    if (outcome.assisted) { assisted += 1; continue; }
    independentAnswered += 1;
    if (outcome.status === 'correct') independentCorrect += 1;
  }

  const dueNow = queue.filter((item) => item.due <= now).length;
  const lastActivity = ordered.reduce<number | null>((latest, attempt) => {
    const stamp = attempt.submittedAt ?? attempt.updatedAt;
    return latest === null || stamp > latest ? stamp : latest;
  }, null);

  return {
    attempts: attempts.length,
    submitted: attempts.filter((attempt) => attempt.submittedAt).length,
    inProgress: attempts.filter((attempt) => !attempt.submittedAt).length,
    questionsAttempted,
    questionsAvailable,
    coverage: questionsAvailable > 0 ? Math.min(1, questionsAttempted / questionsAvailable) : 0,
    independentCorrect,
    independentAnswered,
    accuracy: independentAnswered > 0 ? independentCorrect / independentAnswered : null,
    assisted,
    bySubject,
    queueSize: queue.length,
    dueNow,
    streak: streakDays(ordered, now),
    lastActivity,
  };
}
