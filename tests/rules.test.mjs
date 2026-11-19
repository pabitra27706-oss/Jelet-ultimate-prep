import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { formatMarks, percentage, scoreItem, summarise, toNumber } from '../src/lib/scoring.ts';
import { applyAttemptToQueue, BOX_INTERVAL_DAYS, gradeItem } from '../src/lib/review.ts';
import { buildStats, streakDays } from '../src/lib/stats.ts';

/* ------------------------------------------------------------------ *
 * Category I
 * ------------------------------------------------------------------ */

test('category I: the exact correct option scores the full mark', () => {
  const result = scoreItem({ category: 'I', marks: 1, key: ['A'] }, ['A']);
  assert.equal(result.status, 'correct');
  assert.equal(toNumber(result.awarded), 1);
});

test('category I: a wrong option scores minus one quarter', () => {
  const result = scoreItem({ category: 'I', marks: 1, key: ['A'] }, ['B']);
  assert.equal(result.status, 'wrong');
  assert.equal(toNumber(result.awarded), -0.25);
  assert.equal(formatMarks(result.awarded), '-0.25');
});

test('category I: several options marked score minus one quarter', () => {
  const result = scoreItem({ category: 'I', marks: 1, key: ['A'] }, ['A', 'B']);
  assert.equal(result.status, 'wrong');
  assert.equal(toNumber(result.awarded), -0.25);
  assert.match(result.explanation, /Multiple options/);
});

test('category I: nothing marked scores zero', () => {
  const result = scoreItem({ category: 'I', marks: 1, key: ['A'] }, []);
  assert.equal(result.status, 'blank');
  assert.equal(toNumber(result.awarded), 0);
});

/* ------------------------------------------------------------------ *
 * Category II
 * ------------------------------------------------------------------ */

test('category II: every correct option with no wrong option scores two', () => {
  const result = scoreItem({ category: 'II', marks: 2, key: ['A', 'C'] }, ['A', 'C']);
  assert.equal(result.status, 'correct');
  assert.equal(toNumber(result.awarded), 2);
});

test('category II: a correct subset earns two times marked correct over total correct', () => {
  const result = scoreItem({ category: 'II', marks: 2, key: ['A', 'C'] }, ['A']);
  assert.equal(result.status, 'partial');
  assert.equal(toNumber(result.awarded), 1);
  assert.equal(formatMarks(result.awarded), '1');
});

test('category II: a three-option key gives two thirds and four thirds', () => {
  const third = scoreItem({ category: 'II', marks: 2, key: ['A', 'C', 'D'] }, ['A']);
  assert.equal(toNumber(third.awarded), 2 / 3);
  const fourThirds = scoreItem({ category: 'II', marks: 2, key: ['A', 'C', 'D'] }, ['A', 'C', 'D']);
  assert.equal(toNumber(fourThirds.awarded), 2);
  const twoThirds = scoreItem({ category: 'II', marks: 2, key: ['A', 'C', 'D'] }, ['A', 'C']);
  assert.equal(toNumber(twoThirds.awarded), 4 / 3);
});

test('category II: a wrong option scores zero even with correct options marked', () => {
  const result = scoreItem({ category: 'II', marks: 2, key: ['A', 'C'] }, ['A', 'B']);
  assert.equal(result.status, 'wrong');
  assert.equal(toNumber(result.awarded), 0);
});

test('category II: nothing marked scores zero', () => {
  const result = scoreItem({ category: 'II', marks: 2, key: ['A', 'C'] }, []);
  assert.equal(result.status, 'blank');
  assert.equal(toNumber(result.awarded), 0);
});

/* ------------------------------------------------------------------ *
 * Voided items and totals
 * ------------------------------------------------------------------ */

test('a board-voided question awards its marks to every candidate', () => {
  const result = scoreItem({ category: 'I', marks: 1, key: [], voided: true }, ['C']);
  assert.equal(result.status, 'voided');
  assert.equal(toNumber(result.awarded), 1);
});

test('a summary keeps exact totals and separates categories and subjects', () => {
  const items = [
    { id: 'a', n: 1, subject: 'Mathematics', subjectKey: 'mathematics', category: 'I', marks: 1, status: 'correct', awarded: { n: 1, d: 1 }, selected: ['A'], key: ['A'], explanation: '' },
    { id: 'b', n: 31, subject: 'Mathematics', subjectKey: 'mathematics', category: 'II', marks: 2, status: 'partial', awarded: { n: 2, d: 3 }, selected: ['A'], key: ['A', 'C', 'D'], explanation: '' },
    { id: 'c', n: 41, subject: 'Physics', subjectKey: 'physics', category: 'I', marks: 1, status: 'wrong', awarded: { n: -1, d: 4 }, selected: ['B'], key: ['A'], explanation: '' },
  ];
  const summary = summarise(items);
  assert.ok(Math.abs(toNumber(summary.awarded) - (1 + 2 / 3 - 0.25)) < 1e-9);
  assert.equal(summary.maxMarks, 4);
  assert.equal(summary.correct, 1);
  assert.equal(summary.partial, 1);
  assert.equal(summary.wrong, 1);
  assert.equal(summary.byCategory.I.count, 2);
  assert.equal(summary.byCategory.II.count, 1);
  assert.equal(summary.bySubject.mathematics.count, 2);
  assert.ok(Math.abs(percentage(summary) - ((1 + 2 / 3 - 0.25) / 4) * 100) < 1e-9);
});

test('marks are displayed with two decimals at most and without a trailing zero', () => {
  assert.equal(formatMarks({ n: 4, d: 3 }), '1.33');
  assert.equal(formatMarks({ n: 2, d: 1 }), '2');
  assert.equal(formatMarks({ n: -1, d: 4 }), '-0.25');
});

/* ------------------------------------------------------------------ *
 * Review ladder
 * ------------------------------------------------------------------ */

const queueInput = (status) => ({
  questionId: 'jelet-et-p1-2025:q1',
  paperId: 'jelet-et-p1-2025',
  paperYear: 2025,
  n: 1,
  subjectKey: 'mathematics',
  subjectLabel: 'Mathematics',
  stem: 'Let Z be a complex number',
  status,
});

test('a wrong answer puts a question in the queue and due immediately', () => {
  const queue = applyAttemptToQueue([], [queueInput('wrong')]);
  assert.equal(queue.length, 1);
  assert.equal(queue[0].box, 0);
  assert.ok(queue[0].due <= Date.now());
});

test('the ladder promotes a correct answer and demotes a wrong one', () => {
  let queue = applyAttemptToQueue([], [queueInput('wrong')]);
  queue = applyAttemptToQueue(queue, [queueInput('correct')]);
  assert.equal(queue[0].box, 1);
  assert.equal(queue[0].correctStreak, 1);
  queue = applyAttemptToQueue(queue, [queueInput('wrong')]);
  assert.equal(queue[0].box, 0);
  assert.equal(queue[0].correctStreak, 0);
});

test('two correct answers in a row clear a question from the queue', () => {
  let queue = applyAttemptToQueue([], [queueInput('wrong')]);
  queue = applyAttemptToQueue(queue, [queueInput('correct')]);
  queue = applyAttemptToQueue(queue, [queueInput('correct')]);
  assert.equal(queue.length, 0);
});

test('the ladder intervals are one, three, seven, sixteen and thirty-five days', () => {
  assert.deepEqual(BOX_INTERVAL_DAYS, [0, 1, 3, 7, 16, 35]);
  const queue = applyAttemptToQueue([], [queueInput('wrong')]);
  const graded = gradeItem(queue, 'jelet-et-p1-2025:q1', true);
  assert.equal(graded[0].box, 1);
  const day = 24 * 60 * 60 * 1000;
  assert.ok(graded[0].due - Date.now() > day * 0.9);
});

/* ------------------------------------------------------------------ *
 * Statistics
 * ------------------------------------------------------------------ */

const attempt = (id, submittedAt, results) => ({
  id,
  paperId: 'jelet-et-p1-2025',
  paperYear: 2025,
  paperLabel: 'JELET 2025',
  title: 'paper',
  mode: 'mock',
  subjectKey: null,
  subjectLabel: null,
  questionIds: results.map((result) => result.questionId),
  startedAt: submittedAt,
  updatedAt: submittedAt,
  submittedAt,
  timeSpentSeconds: 60,
  responses: {},
  marked: [],
  visited: [],
  assisted: [],
  limitSeconds: 7200,
  scopeMarks: 100,
  scopeQuestions: results.length,
  results,
});

test('independent accuracy uses the first attempt and ignores assisted answers', () => {
  const attempts = [
    attempt('one', 1000, [
      { questionId: 'q1', subjectKey: 'mathematics', status: 'wrong', awarded: -0.25, assisted: false },
      { questionId: 'q2', subjectKey: 'mathematics', status: 'correct', awarded: 1, assisted: false },
      { questionId: 'q3', subjectKey: 'physics', status: 'correct', awarded: 1, assisted: true },
    ]),
    attempt('two', 2000, [
      { questionId: 'q1', subjectKey: 'mathematics', status: 'correct', awarded: 1, assisted: false },
    ]),
  ];
  const stats = buildStats(attempts, [], 10);
  assert.equal(stats.questionsAttempted, 3);
  assert.equal(stats.independentAnswered, 2);
  assert.equal(stats.independentCorrect, 1);
  assert.equal(stats.assisted, 1);
  assert.equal(stats.accuracy, 0.5);
});

test('a streak counts consecutive days of submitted papers and stops at a gap', () => {
  const day = 24 * 60 * 60 * 1000;
  const now = new Date('2026-11-19T12:00:00Z').getTime();
  const attempts = [
    attempt('one', now - day, []),
    attempt('two', now - 2 * day, []),
    attempt('three', now - 5 * day, []),
  ];
  assert.equal(streakDays(attempts, now), 2);
});

/* ------------------------------------------------------------------ *
 * The published dataset must agree with the marking rules
 * ------------------------------------------------------------------ */

test('the generated dataset agrees with the archived source files', async () => {
  const papers = JSON.parse(await readFile(resolve('src/data/papers.json'), 'utf8'));
  const keys = JSON.parse(await readFile(resolve('src/data/keys.json'), 'utf8'));
  const archive = JSON.parse(await readFile(resolve('archive/jelet-prep/data/docs/official-keys/2025-paper1.json'), 'utf8'));

  const paper = papers.papers.find((entry) => entry.year === 2025);
  assert.equal(paper.questionCount, 100);
  assert.equal(paper.questions.length, 100);
  assert.deepEqual(paper.gaps, []);

  // Every official key entry must line up with the transcription.
  const key = keys.keys.find((entry) => entry.year === 2025);
  assert.equal(key.tier, 'official');
  assert.equal(key.answers['1'], archive.entries.find((entry) => entry.q === 1).answer);
  assert.equal(key.answers['31'], archive.entries.find((entry) => entry.q === 31).answer);

  // A Category-II item must never carry a single-answer key, and a
  // Category-I item must never carry a multi-option key.
  for (const question of paper.questions) {
    const answer = key.answers[String(question.n)];
    assert.ok(answer, `Q${question.n} has no key`);
    const letters = answer.split('');
    if (question.category === 'I') assert.equal(letters.length, 1, `Q${question.n} is Category I with key ${answer}`);
    else assert.ok(letters.length >= 1, `Q${question.n} is Category II with key ${answer}`);
  }

  // Marking one Category-II item with its full key must give the full marks.
  const categoryTwo = paper.questions.find((question) => question.category === 'II');
  const full = scoreItem({ category: 'II', marks: 2, key: key.answers[String(categoryTwo.n)].split('') }, key.answers[String(categoryTwo.n)].split(''));
  assert.equal(toNumber(full.awarded), 2);
});
