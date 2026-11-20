/**
 * The 2023 paper, held to the same standard as every other year.
 *
 * 2023 is the one paper that was transcribed after the immutable archive was
 * captured, so its record lives in the editorial collection. These tests are
 * the regression net for that record: they check the corpus shape, the key,
 * the subject and category layout, the holds and the board awards against the
 * official source, so a later edit to the generator or the transcription
 * cannot quietly change what the board published.
 *
 * Every figure below is a fact from the source, not a description of what the
 * code happens to do today.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { answerLetters, keyFor, paperById, papers } from '../src/lib/content.ts';

const PAPER = paperById.get('jelet-et-p1-2023');

/** The answers the board published, read from the preserved official key. */
const officialKey = JSON.parse(
  await readFile(resolve('archive/jelet-prep/data/docs/official-keys/2023-paper1.json'), 'utf8'),
);

/* ------------------------------------------------------------------ *
 * The corpus
 * ------------------------------------------------------------------ */

test('the 2023 paper is published with a hundred questions and no gaps', () => {
  assert.ok(PAPER, 'the 2023 paper is in the published corpus');
  assert.equal(PAPER.questionCount, 100);
  assert.equal(PAPER.questions.length, 100);
  assert.deepEqual(PAPER.gaps, [], 'no question number is missing');
  assert.deepEqual(
    PAPER.questions.map((question) => question.n),
    Array.from({ length: 100 }, (_, index) => index + 1),
    'the questions run one to one hundred in booklet order',
  );
});

test('the 2023 paper carries the shape the booklet itself prints', () => {
  assert.equal(PAPER.pattern, 'modern');
  assert.equal(PAPER.durationMinutes, 120);
  assert.equal(PAPER.maxMarks, 120);
  assert.equal(PAPER.hasKey, true);
  assert.equal(PAPER.keyTier, 'official');
});

test('every 2023 question has four options with a label and a text', () => {
  for (const question of PAPER.questions) {
    assert.equal(question.options.length, 4, `Q${question.n} has four options`);
    assert.deepEqual(
      question.options.map((option) => option.label),
      ['A', 'B', 'C', 'D'],
      `Q${question.n} labels its options A to D`,
    );
    for (const option of question.options) {
      assert.ok(option.text.trim().length > 0, `Q${question.n} option ${option.label} has text`);
    }
  }
});

test('the 2023 marks are the booklet marks: one for Category I, two for Category II', () => {
  let total = 0;
  for (const question of PAPER.questions) {
    const expected = question.category === 'II' ? 2 : 1;
    assert.equal(question.marks, expected, `Q${question.n} carries the right marks`);
    total += question.marks;
  }
  assert.equal(total, 120, 'the paper is worth 120 marks');
});

/* ------------------------------------------------------------------ *
 * The subject and category layout
 * ------------------------------------------------------------------ */

test('the 2023 subjects are the sections the booklet prints', () => {
  assert.deepEqual(
    PAPER.subjects.map((subject) => [subject.subject, subject.from, subject.to]),
    [
      ['Mathematics', 1, 40],
      ['Physics', 41, 70],
      ['Chemistry', 71, 90],
      ['Electrical & Electronics', 91, 100],
    ],
  );
  assert.deepEqual(
    PAPER.subjects.map((subject) => subject.subjectKey),
    ['mathematics', 'physics', 'chemistry', 'electrical'],
  );
});

test('the 2023 categories are the ranges the booklet prints', () => {
  const ranges = PAPER.subjects.flatMap((subject) =>
    subject.categories.map((category) => [category.category, category.from, category.to]),
  );
  assert.deepEqual(ranges, [
    ['I', 1, 30],
    ['II', 31, 40],
    ['I', 41, 65],
    ['II', 66, 70],
    ['I', 71, 85],
    ['II', 86, 90],
    ['I', 91, 100],
  ]);
});

test('every 2023 question sits in the subject and category its number falls in', () => {
  for (const question of PAPER.questions) {
    const subject = PAPER.subjects.find(
      (entry) => question.n >= entry.from && question.n <= entry.to,
    );
    assert.ok(subject, `Q${question.n} falls in a subject`);
    assert.equal(question.subject, subject.subject, `Q${question.n} names its subject`);
    assert.equal(question.subjectKey, subject.subjectKey, `Q${question.n} names its subject key`);
    const category = subject.categories.find(
      (entry) => question.n >= entry.from && question.n <= entry.to,
    );
    assert.ok(category, `Q${question.n} falls in a category`);
    assert.equal(question.category, category.category, `Q${question.n} names its category`);
  }
});

/* ------------------------------------------------------------------ *
 * The key
 * ------------------------------------------------------------------ */

test('the 2023 key is the board key, with the board\'s own references', () => {
  const key = keyFor(PAPER);
  assert.ok(key, 'the 2023 paper has a key');
  assert.equal(key.tier, 'official');
  assert.equal(key.documentRef, 'JEEB/Reg-267/23');
  assert.equal(key.documentDate, '2023-08-03');
  assert.equal(key.hasPaper, true);
  assert.equal(key.usableForScoring, true);
});

test('the 2023 key is mapped to Set A identically', () => {
  const key = keyFor(PAPER);
  assert.equal(key.booklet.mapping, 'identity');
  assert.equal(key.booklet.set, 'A');
});

test('every 2023 answer is the letter the board published', () => {
  const key = keyFor(PAPER);
  const published = new Map(officialKey.entries.map((entry) => [entry.q, entry.answer]));
  assert.equal(published.size, 100, 'the board key covers all hundred questions');
  for (const question of PAPER.questions) {
    assert.ok(published.has(question.n), `Q${question.n} is answered in the board's key`);
    assert.equal(
      key.answers[String(question.n)],
      published.get(question.n),
      `Q${question.n} carries the answer the board published`,
    );
  }
});

test('a 2023 answer letter is always one of the four options that were printed', () => {
  for (const question of PAPER.questions) {
    const letters = answerLetters(PAPER, question);
    if (question.voided) {
      assert.deepEqual(letters, [], `Q${question.n} is voided, so it has no keyed letter`);
      continue;
    }
    assert.ok(letters.length > 0, `Q${question.n} has a keyed letter`);
    for (const letter of letters) {
      assert.ok(
        question.options.some((option) => option.label === letter),
        `Q${question.n} option ${letter} exists`,
      );
    }
  }
});

test('a 2023 multi-answer key only appears on a Category II item', () => {
  for (const question of PAPER.questions) {
    const letters = answerLetters(PAPER, question);
    if (letters.length > 1) {
      assert.equal(question.category, 'II', `Q${question.n} is a Category II item`);
    }
  }
});

/* ------------------------------------------------------------------ *
 * The holds and the board awards
 * ------------------------------------------------------------------ */

test('the 2023 held items are the ten the transcription cannot reproduce', () => {
  const held = PAPER.questions.filter((question) => question.holdReason !== null).map((q) => q.n);
  assert.deepEqual(held, [42, 48, 60, 61, 68, 70, 84, 91, 92, 95]);
  assert.equal(PAPER.heldQuestions, 10);
});

test('a 2023 held item is never marked and never carries marks', () => {
  for (const question of PAPER.questions) {
    if (!question.holdReason) continue;
    assert.equal(question.scorable, false, `Q${question.n} is not scorable`);
    assert.equal(question.boardAwarded, false, `Q${question.n} is not board-awarded`);
    assert.ok(question.figure, `Q${question.n} is held because of its figure`);
    // The board did key this item, and the corpus keeps that letter, because
    // the key is a fact about the board's paper. What the corpus refuses to
    // do is mark the item: the learner cannot see the figure the question
    // depends on, so no answer they give can be judged against it.
  }
});

test('the 2023 board-voided items are the four the board published W for', () => {
  const voided = PAPER.questions.filter((question) => question.voided).map((question) => question.n);
  assert.deepEqual(voided, [6, 46, 88, 94]);
  assert.deepEqual(PAPER.voidedQuestions, [6, 46, 88, 94]);
  assert.deepEqual(officialKey.voided ?? voided, voided);
});

test('a 2023 voided item is awarded to every candidate, not held', () => {
  for (const question of PAPER.questions) {
    if (!question.voided) continue;
    assert.equal(question.boardAwarded, true, `Q${question.n} is board-awarded`);
    assert.equal(question.scorable, false, `Q${question.n} is not scored against a key`);
    assert.equal(question.holdReason, null, `Q${question.n} is not held`);
  }
});

test('the 2023 counts the board award correctly', () => {
  assert.equal(PAPER.scoreableQuestions, 86);
  assert.equal(PAPER.scoreableMarks, 103);
  assert.equal(PAPER.boardAwardedQuestions, 4);
  assert.equal(PAPER.boardAwardedMarks, 5);
  assert.equal(PAPER.rehearsableQuestions, 90);
  assert.equal(PAPER.rehearsableMarks, 108);
  // 86 keyed + 4 awarded = 90 rehearsalable; 103 keyed marks + 5 awarded = 108.
  assert.equal(PAPER.scoreableQuestions + PAPER.boardAwardedQuestions, PAPER.rehearsableQuestions);
  assert.equal(PAPER.scoreableMarks + PAPER.boardAwardedMarks, PAPER.rehearsableMarks);
});

/* ------------------------------------------------------------------ *
 * The editorial record
 * ------------------------------------------------------------------ */

test('the 2023 paper says which collection it came from', () => {
  assert.equal(PAPER.sourceFile, 'editorial/pyq-md/2023.md');
  assert.match(PAPER.sourceSha256, /^[0-9a-f]{64}$/);
});

test('the 2023 transcription is not inside the immutable archive', async () => {
  const editorial = JSON.parse(await readFile(resolve('src/data/papers.json'), 'utf8')).papers;
  const fromArchive = editorial.filter((paper) => paper.sourceFile.startsWith('archive/'));
  const fromEditorial = editorial.filter((paper) => paper.sourceFile.startsWith('editorial/'));
  assert.ok(fromEditorial.length > 0, 'at least one paper is transcribed after the capture');
  assert.ok(
    fromEditorial.every((paper) => paper.year === 2023),
    'only the 2023 paper is an editorial record so far',
  );
  for (const paper of fromArchive) {
    assert.ok(paper.sourceFile.startsWith('archive/jelet-prep/data/pyq-md/'));
  }
});

test('the 2023 provenance record exists and names its source and its limits', async () => {
  const provenance = await readFile(resolve('editorial/provenance/2023-paper1.md'), 'utf8');
  assert.match(provenance, /2023111575-2\.pdf/, 'it names the official booklet');
  assert.match(provenance, /JEEB\/Reg-267\/23/, 'it names the board key notice');
  assert.match(provenance, /Rights review:?\*\*\s*not yet completed/, 'it states the rights position');
  assert.match(provenance, /Q34/, 'it records the defective item');
  assert.match(provenance, /voided by the board/i, 'it separates voided items from held ones');
});

/* ------------------------------------------------------------------ *
 * The corpus as a whole
 * ------------------------------------------------------------------ */

test('the published corpus holds every paper it claims to', () => {
  const years = papers.map((paper) => paper.year).sort((a, b) => a - b);
  assert.deepEqual(years, [2017, 2018, 2019, 2021, 2022, 2023, 2024, 2025]);
  const total = papers.reduce((sum, paper) => sum + paper.questions.length, 0);
  assert.equal(total, 790, 'the corpus holds 790 question records');
});

test('no question id is used twice, so no mock can draw the same item twice', () => {
  const ids = papers.flatMap((paper) => paper.questions.map((question) => question.id));
  assert.equal(new Set(ids).size, ids.length);
});
