/**
 * The notebook quiz.
 *
 * A quiz is not a paper. There is no clock and no navigator: one question at
 * a time, marked the moment the learner checks it, with the published answer
 * and the paper it came from shown straight away. The place is kept on this
 * device, so a backgrounded tab or a reload does not lose the work.
 *
 * The marking is the board's own. A quiz never invents a rule.
 */
import { readAttempts, upsertAttempt, type Attempt, type AttemptItemResult } from './attempts.ts';
import { applyAttemptToQueue, readQueue, writeQueue } from './review.ts';
import { scoreItem, summarise, type ScoredItem } from './scoring.ts';
import type { MockItem } from './mock.ts';

/** One question of a quiz, with the pool entry it came from. */
export type QuizQuestion = {
  item: MockItem;
  html: string;
};

export type QuizAnswer = {
  /** The options the learner marked. */
  selected: string[];
  /** Whether the learner has seen the answer before checking. */
  revealed: boolean;
  /** Whether the question has been marked. */
  checked: boolean;
};

export type QuizState = {
  /** The index of the question on screen. */
  index: number;
  /** questionId → what the learner did with it. */
  answers: Record<string, QuizAnswer>;
  /** The moment the quiz started. */
  startedAt: number;
};

export type KeyEntry = { key: string[]; tier: string; voided: boolean; reasoning?: string };

/** Where a quiz's place is kept. The key is the quiz's own identity. */
export const quizStateKey = (quizId: string): string => `jelet:quiz:${quizId}:v1`;

/** An empty state for a quiz that has not been started. */
export function emptyQuizState(startedAt = Date.now()): QuizState {
  return { index: 0, answers: {}, startedAt };
}

/** Read the place of a quiz. */
export function readQuizState(quizId: string): QuizState {
  try {
    const raw = localStorage.getItem(quizStateKey(quizId));
    if (!raw) return emptyQuizState();
    const parsed = JSON.parse(raw) as Partial<QuizState>;
    if (!parsed || typeof parsed.index !== 'number' || typeof parsed.answers !== 'object' || parsed.answers === null) {
      return emptyQuizState();
    }
    return {
      index: Math.max(0, Math.round(parsed.index)),
      answers: parsed.answers as Record<string, QuizAnswer>,
      startedAt: typeof parsed.startedAt === 'number' ? parsed.startedAt : Date.now(),
    };
  } catch {
    return emptyQuizState();
  }
}

/** Keep the place of a quiz. */
export function saveQuizState(quizId: string, state: QuizState): boolean {
  try {
    localStorage.setItem(quizStateKey(quizId), JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/** Forget the place of a quiz, so it can be sat again from the beginning. */
export function clearQuizState(quizId: string): void {
  try {
    localStorage.removeItem(quizStateKey(quizId));
  } catch { /* storage blocked: nothing to clear */ }
}

/**
 * Mark one question.
 *
 * The rules are the board's: Category I gives +1 for the exact option and
 * −¼ for anything else; Category II gives +2 for every correct option with no
 * wrong one, and a correct subset earns a share of the two marks.
 */
export function markQuestion(question: QuizQuestion, answer: QuizAnswer, key: KeyEntry | undefined) {
  const keyLetters = key?.key ?? [];
  const voided = question.item.voided || Boolean(key?.voided);
  if (voided) {
    return scoreItem({ category: question.item.category, marks: question.item.marks, key: keyLetters, voided: true }, answer.selected);
  }
  if (!key) {
    return { status: 'unmarked' as const, awarded: { n: 0, d: 1 }, selected: answer.selected, key: keyLetters, explanation: 'No published key for this item.' };
  }
  return scoreItem({ category: question.item.category, marks: question.item.marks, key: keyLetters, voided: false }, answer.selected);
}

/**
 * Turn a finished quiz into an attempt and fold it into the review queue.
 *
 * The quiz is a real attempt: it counts towards coverage and accuracy, and
 * the questions the learner got wrong wait for revision like any others.
 */
export function recordQuiz(options: {
  quizId: string;
  title: string;
  spec: string;
  questions: QuizQuestion[];
  answers: Record<string, QuizAnswer>;
  keys: Record<string, KeyEntry>;
  sources: Record<string, { paperId: string; year: number; n: number }>;
  startedAt: number;
}): { attempt: Attempt; summary: ReturnType<typeof summarise>; queueSize: number } {
  const { quizId, title, spec, questions, answers, keys, sources, startedAt } = options;

  const items: ScoredItem[] = [];
  const results: AttemptItemResult[] = [];
  for (const question of questions) {
    const answer = answers[question.item.id] ?? { selected: [], revealed: false, checked: false };
    const scored = markQuestion(question, answer, keys[question.item.id]);
    items.push({
      ...scored,
      id: question.item.id,
      n: question.item.n,
      subject: question.item.subject,
      subjectKey: question.item.subjectKey,
      category: question.item.category,
      marks: question.item.marks,
    });
    results.push({
      questionId: question.item.id,
      subjectKey: question.item.subjectKey,
      status: scored.status,
      awarded: scored.awarded.n / scored.awarded.d,
      assisted: answer.revealed,
    });
  }

  const summary = summarise(items);
  const attempt: Attempt = {
    // Every sitting is its own attempt: sitting the same quiz twice is two
    // records, not one record that overwrites the other.
    id: `quiz-${quizId}-${startedAt}`,
    paperId: `quiz-${quizId}`,
    paperYear: 0,
    paperLabel: 'Notebook quiz',
    title,
    mode: 'quiz',
    subjectKey: null,
    subjectLabel: null,
    questionIds: questions.map((question) => question.item.id),
    startedAt,
    updatedAt: Date.now(),
    submittedAt: Date.now(),
    submissionId: `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timeSpentSeconds: Math.max(0, Math.round((Date.now() - startedAt) / 1000)),
    deadlineAt: null,
    responses: Object.fromEntries(questions.map((question) => [
      question.item.id,
      (answers[question.item.id]?.selected ?? []),
    ])),
    responseTimes: {},
    marked: [],
    visited: questions.map((question) => question.item.id),
    assisted: questions.filter((question) => answers[question.item.id]?.revealed).map((question) => question.item.id),
    limitSeconds: null,
    scopeMarks: summary.maxMarks,
    scopeQuestions: questions.length,
    mockSpec: null,
    quizSpec: spec,
    sources,
    results,
  };
  upsertAttempt(attempt);

  const queue = applyAttemptToQueue(readQueue(), results.map((result) => {
    const question = questions.find((entry) => entry.item.id === result.questionId);
    const source = sources[result.questionId];
    return {
      questionId: result.questionId,
      paperId: source?.paperId ?? '',
      paperYear: source?.year ?? 0,
      n: source?.n ?? question?.item.n ?? 0,
      subjectKey: result.subjectKey,
      subjectLabel: question?.item.subject ?? '',
      stem: '',
      status: result.status,
    };
  }));
  writeQueue(queue);

  return { attempt, summary, queueSize: queue.length };
}

/** The questions of a quiz that were answered wrongly or left blank. */
export function wrongQuestionIds(attemptId: string): string[] | null {
  const attempt = readAttempts().find((entry) => entry.id === attemptId);
  if (!attempt) return null;
  return (attempt.results ?? [])
    .filter((result) => result.status === 'wrong' || result.status === 'blank')
    .map((result) => result.questionId);
}
