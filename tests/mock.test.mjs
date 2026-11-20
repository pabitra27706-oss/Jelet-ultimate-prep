import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import { mergeAttempt } from '../src/lib/attempts.ts';
import { papers } from '../src/lib/content.ts';
import {
  MAX_MOCK_QUESTIONS,
  PAPER_SUBJECTS,
  composeMock,
  decodeSpec,
  defaultSpec,
  describeSpec,
  encodeSpec,
  seededRandom,
  shuffled,
  withSpecId,
} from '../src/lib/mock.ts';
import { buildCandidates, topicCatalogue, topicsByQuestion } from '../src/lib/mock-pool.ts';
import { scoreItem, summarise } from '../src/lib/scoring.ts';

const pool = buildCandidates();
const allIds = new Set(pool.map((candidate) => candidate.id));
const byId = new Map(pool.map((candidate) => [candidate.id, candidate]));

/* ------------------------------------------------------------------ *
 * The pool
 * ------------------------------------------------------------------ */

test('the mock pool holds every question that can be marked, and nothing else', () => {
  assert.ok(pool.length > 0, 'the corpus holds markable questions');
  for (const candidate of pool) {
    assert.ok(candidate.id, 'a candidate has an id');
    assert.ok(['I', 'II'].includes(candidate.category), 'a candidate is in one of the two categories');
    assert.ok(candidate.marks >= 1, 'a candidate is worth at least one mark');
    assert.ok(allIds.has(candidate.id));
  }
  // Every candidate must be one the corpus really can mark: it carries a
  // published key, or the board voided it and awarded its marks.
  const corpus = new Map(papers.flatMap((paper) => paper.questions.map((question) => [question.id, question])));
  for (const candidate of pool) {
    const question = corpus.get(candidate.id);
    assert.ok(question, 'a candidate is a real corpus question');
    assert.ok(question.scorable || question.boardAwarded, 'a candidate can be marked');
    assert.equal(question.options.length, 4, 'a candidate has a complete set of options');
  }
});

test('the corpus question ids are unique, so a mock never draws the same question twice', () => {
  assert.equal(new Set(pool.map((candidate) => candidate.id)).size, pool.length);
});

test('the pool carries the key tier of the paper each question came from', () => {
  const tiers = new Set(pool.map((candidate) => candidate.keyTier));
  assert.ok(tiers.has('official'), 'the board published a key for some papers');
  assert.ok(tiers.has('derived'), 'the board published no key for some papers');
});

test('the topic map is a real map of the corpus, and every topic states what it can offer', () => {
  const topics = topicsByQuestion();
  assert.ok(topics.size > 0);
  const catalogue = topicCatalogue();
  assert.ok(catalogue.length >= 40, 'the syllabus holds forty-odd topics');
  // Some topics were mapped only to questions that cannot be marked, because
  // their diagram was never transcribed. The catalogue says so rather than
  // pretending the topic can fill a mock.
  const empty = catalogue.filter((topic) => topic.available === 0);
  for (const topic of empty) {
    assert.ok(topic.available === 0);
  }
  const filled = catalogue.filter((topic) => topic.available > 0);
  assert.ok(filled.length >= 35, 'most topics can fill a mock');
  for (const topic of filled) {
    const mapped = [...topics.keys()].filter((id) => topics.get(id).includes(topic.id));
    assert.ok(mapped.length >= topic.available, 'the count is not larger than the mapped questions');
  }
});

/* ------------------------------------------------------------------ *
 * Composition
 * ------------------------------------------------------------------ */

test('the same specification always composes the same paper', () => {
  const spec = withSpecId({ ...defaultSpec(), count: 30, seed: 42 });
  const first = composeMock(spec, pool);
  const second = composeMock(spec, pool);
  assert.deepEqual(first.items.map((item) => item.id), second.items.map((item) => item.id));
  assert.equal(first.marks, second.marks);
});

test('a different seed draws a different paper', () => {
  const base = withSpecId({ ...defaultSpec(), count: 30, seed: 42 });
  const other = withSpecId({ ...defaultSpec(), count: 30, seed: 43 });
  const a = composeMock(base, pool).items.map((item) => item.id).join(',');
  const b = composeMock(other, pool).items.map((item) => item.id).join(',');
  assert.notEqual(a, b);
});

test('the same seed draws the same paper whatever the order of the pool', () => {
  const spec = withSpecId({ ...defaultSpec(), count: 25, seed: 7 });
  const shuffledPool = shuffled(pool, 99);
  const a = composeMock(spec, pool).items.map((item) => item.id).join(',');
  const b = composeMock(spec, shuffledPool).items.map((item) => item.id).join(',');
  assert.equal(a, b, 'the composition does not depend on the order the pool arrived in');
});

test('the seeded generator is stable and stays inside the unit interval', () => {
  const a = seededRandom(1234);
  const b = seededRandom(1234);
  for (let index = 0; index < 50; index += 1) {
    const value = a();
    assert.equal(value, b());
    assert.ok(value >= 0 && value < 1, 'a random number stays inside the unit interval');
  }
});

test('a composed mock holds exactly the number of questions that were asked for', () => {
  for (const count of [1, 10, 25, 40, 60]) {
    const spec = withSpecId({ ...defaultSpec(), count });
    const composition = composeMock(spec, pool);
    assert.equal(composition.count, count);
    assert.equal(composition.shortfall, 0);
    assert.equal(composition.items.length, count);
    assert.equal(new Set(composition.items.map((item) => item.id)).size, count, 'no question is drawn twice');
  }
});

test('the paper shape is kept: the subjects follow Paper I and Category I comes first', () => {
  const spec = withSpecId({ ...defaultSpec(), count: 40 });
  const composition = composeMock(spec, pool);
  const order = PAPER_SUBJECTS.map((subject) => subject.key);
  const positions = composition.items.map((item) => order.indexOf(item.subjectKey));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b), 'the subjects run in the paper order');
  let previous = 'I';
  let subject = '';
  for (const item of composition.items) {
    if (item.subjectKey !== subject) {
      subject = item.subjectKey;
      previous = 'I';
    }
    assert.ok(previous === 'I' || item.category === 'II', 'Category I never follows Category II inside a subject');
    previous = item.category;
  }
});

test('the category mix follows the paper by default', () => {
  const spec = withSpecId({ ...defaultSpec(), count: 60 });
  const composition = composeMock(spec, pool);
  const share = composition.categoryI / composition.count;
  assert.ok(Math.abs(share - 0.85) <= 0.05, `the Category I share is about 85%, not ${share}`);
});

test('a custom category mix is honoured', () => {
  const spec = withSpecId({ ...defaultSpec(), count: 40, categoryMix: 'custom', categoryIShare: 0.5 });
  const composition = composeMock(spec, pool);
  const share = composition.categoryI / composition.count;
  assert.ok(Math.abs(share - 0.5) <= 0.1, `the Category I share is about half, not ${share}`);
});

test('the subjects are drawn in the paper shares', () => {
  const spec = withSpecId({ ...defaultSpec(), count: 100 });
  const composition = composeMock(spec, pool);
  const mathematics = composition.bySubject.find((entry) => entry.subjectKey === 'mathematics');
  const physics = composition.bySubject.find((entry) => entry.subjectKey === 'physics');
  const chemistry = composition.bySubject.find((entry) => entry.subjectKey === 'chemistry');
  assert.ok(mathematics && physics && chemistry);
  assert.ok(mathematics.count >= physics.count, 'mathematics holds at least as many as physics');
  assert.ok(physics.count >= chemistry.count, 'physics holds at least as many as chemistry');
});

test('a single-subject mock holds only that subject', () => {
  const spec = withSpecId({ ...defaultSpec(), subjects: ['physics'], count: 20 });
  const composition = composeMock(spec, pool);
  assert.equal(composition.items.length, 20);
  assert.ok(composition.items.every((item) => item.subjectKey === 'physics'));
});

test('the marks of the mock are the real marks of the questions in it', () => {
  const spec = withSpecId({ ...defaultSpec(), count: 30 });
  const composition = composeMock(spec, pool);
  const expected = composition.items.reduce((sum, item) => sum + item.marks, 0);
  assert.equal(composition.marks, expected);
});

/* ------------------------------------------------------------------ *
 * Honesty about scarcity
 * ------------------------------------------------------------------ */

test('a mock that asks for more than the corpus holds says so instead of padding', () => {
  const spec = withSpecId({ ...defaultSpec(), subjects: ['electrical'], count: 100 });
  const composition = composeMock(spec, pool);
  assert.ok(composition.shortfall > 0, 'the shortfall is reported');
  assert.equal(composition.items.length + composition.shortfall, 100);
  assert.ok(composition.notes.some((note) => /could only supply/.test(note)), 'the notes explain the shortfall');
  assert.ok(composition.items.every((item) => item.subjectKey === 'electrical'));
});

test('the largest mock the builder offers is honoured as a bound', () => {
  const spec = withSpecId({ ...defaultSpec(), count: 5000 });
  const composition = composeMock(spec, pool);
  assert.ok(composition.requested <= MAX_MOCK_QUESTIONS);
  assert.ok(composition.items.length <= MAX_MOCK_QUESTIONS);
});

test('no subject chosen is refused rather than silently filled', () => {
  const spec = withSpecId({ ...defaultSpec(), subjects: [], count: 20 });
  const composition = composeMock(spec, pool);
  assert.equal(composition.count, 0);
  assert.ok(composition.notes.some((note) => /at least one subject/.test(note)));
});

/* ------------------------------------------------------------------ *
 * Questions already seen
 * ------------------------------------------------------------------ */

test('questions already sat on the device are left out while enough remain', () => {
  const spec = withSpecId({ ...defaultSpec(), count: 20, avoidSeen: true });
  const first = composeMock(spec, pool);
  const answered = first.items.slice(0, 15).map((item) => item.id);
  const second = composeMock(spec, pool, answered);
  assert.ok(second.avoidedSeen, 'the composition says it left some out');
  for (const id of answered) {
    assert.ok(!second.items.some((item) => item.id === id), 'an answered question is not drawn again');
  }
  assert.ok(second.notes.some((note) => /already answered/.test(note)));
});

test('questions already sat are kept when the corpus cannot supply enough unseen ones', () => {
  const spec = withSpecId({ ...defaultSpec(), subjects: ['electrical'], count: 19, avoidSeen: true });
  const everything = composeMock(spec, pool).items.map((item) => item.id);
  const second = composeMock(spec, pool, everything);
  assert.equal(second.avoidedSeen, false);
  assert.ok(second.notes.some((note) => /kept to fill the mock/.test(note)));
});

test('questions already sat are ignored when the specification does not ask for it', () => {
  const spec = withSpecId({ ...defaultSpec(), count: 20, avoidSeen: false });
  const first = composeMock(spec, pool);
  const answered = first.items.map((item) => item.id);
  const second = composeMock(spec, pool, answered);
  assert.deepEqual(second.items.map((item) => item.id), first.items.map((item) => item.id));
});

/* ------------------------------------------------------------------ *
 * Topics and board-awarded questions
 * ------------------------------------------------------------------ */

test('a topic filter draws only the questions mapped to those topics', () => {
  const topics = topicCatalogue().filter((topic) => topic.available >= 4 && topic.subjectId === 'mathematics');
  assert.ok(topics.length > 0, 'mathematics has topics that can fill a mock');
  const topic = topics[0];
  const spec = withSpecId({ ...defaultSpec(), topics: [topic.id], count: 5, subjects: ['mathematics'] });
  const composition = composeMock(spec, pool);
  assert.equal(composition.count, 5);
  for (const item of composition.items) {
    assert.ok(item.topicIds.includes(topic.id), 'every drawn question is mapped to the chosen topic');
    assert.equal(item.subjectKey, 'mathematics');
  }
});

test('a topic with no markable questions cannot fill a mock, and the mock says so', () => {
  const empty = topicCatalogue().find((topic) => topic.available === 0);
  assert.ok(empty, 'the corpus holds a topic that cannot be marked');
  const spec = withSpecId({ ...defaultSpec(), topics: [empty.id], count: 5, subjects: ['electrical'] });
  const composition = composeMock(spec, pool);
  assert.equal(composition.count, 0);
  assert.ok(composition.shortfall > 0);
});

test('board-voided questions are left out when the specification says so', () => {
  const awarded = pool.filter((candidate) => candidate.voided);
  assert.ok(awarded.length > 0, 'the corpus holds board-voided questions');
  const spec = withSpecId({ ...defaultSpec(), count: 60, includeAwarded: false });
  const composition = composeMock(spec, pool);
  assert.ok(composition.items.every((item) => !item.voided), 'no board-voided question is in the mock');
});

test('board-voided questions are kept and announced when the specification allows them', () => {
  const spec = withSpecId({ ...defaultSpec(), count: 100, includeAwarded: true });
  const composition = composeMock(spec, pool);
  const awarded = composition.items.filter((item) => item.voided);
  assert.ok(awarded.length > 0, 'a board-voided question is in the mock');
  assert.ok(composition.notes.some((note) => /voided by the board/.test(note)));
});

/* ------------------------------------------------------------------ *
 * The specification in a link
 * ------------------------------------------------------------------ */

test('a specification survives a trip through a link', () => {
  const spec = withSpecId({
    ...defaultSpec(),
    title: 'Physics and chemistry',
    subjects: ['physics', 'chemistry'],
    topics: ['physics-ta'],
    count: 25,
    categoryMix: 'custom',
    categoryIShare: 0.6,
    durationMinutes: 45,
    avoidSeen: true,
    includeAwarded: false,
    seed: 4321,
  });
  const decoded = decodeSpec(encodeSpec(spec));
  assert.equal(decoded.id, spec.id, 'the id is derived from the fields that decide the paper');
  assert.equal(decoded.title, spec.title);
  assert.deepEqual(decoded.subjects, spec.subjects);
  assert.deepEqual(decoded.topics, spec.topics);
  assert.equal(decoded.count, spec.count);
  assert.equal(decoded.categoryMix, spec.categoryMix);
  assert.equal(decoded.categoryIShare, spec.categoryIShare);
  assert.equal(decoded.durationMinutes, spec.durationMinutes);
  assert.equal(decoded.avoidSeen, spec.avoidSeen);
  assert.equal(decoded.includeAwarded, spec.includeAwarded);
  assert.equal(decoded.seed, spec.seed);
});

test('a link with no subjects falls back to the whole paper rather than an empty mock', () => {
  const decoded = decodeSpec('s=&n=10');
  assert.deepEqual(decoded.subjects, defaultSpec().subjects);
  assert.equal(decoded.count, 10);
});

test('a hostile link cannot make the mock run past its bounds', () => {
  const decoded = decodeSpec('s=mathematics,not-a-subject&n=99999&d=99999&seed=-4&m=whatever');
  assert.deepEqual(decoded.subjects, ['mathematics']);
  assert.ok(decoded.count <= MAX_MOCK_QUESTIONS);
  assert.ok(decoded.durationMinutes <= 300);
  assert.ok(decoded.seed >= 0);
  assert.equal(decoded.categoryMix, 'paper');
});

test('the builder form and a written link mean the same thing', () => {
  // A form sends one value per box; a link sends a comma-joined list. Both
  // have to read the same way, and the last value of a checkbox pair wins.
  const fromForm = decodeSpec('s=mathematics&s=physics&t=a&t=b&n=30&m=paper&d=60&v=0&v=1&w=0&w=1&seed=9');
  const fromLink = decodeSpec('s=mathematics,physics&t=a,b&n=30&m=paper&d=60&v=1&w=1&seed=9');
  assert.deepEqual(fromForm.subjects, fromLink.subjects);
  assert.deepEqual(fromForm.topics, fromLink.topics);
  assert.equal(fromForm.avoidSeen, true);
  assert.equal(fromForm.includeAwarded, true);
  assert.equal(fromForm.id, fromLink.id);
});

test('the id of a specification is decided by the fields that decide the paper', () => {
  const base = defaultSpec();
  const same = withSpecId({ ...base, title: 'Another name' });
  assert.equal(same.id, base.id, 'the title is cosmetic and does not change the paper');
  const different = withSpecId({ ...base, count: base.count + 1 });
  assert.notEqual(different.id, base.id);
});

test('a specification describes itself in plain words', () => {
  const description = describeSpec(withSpecId({ ...defaultSpec(), subjects: ['physics'], count: 12 }));
  assert.match(description, /12 questions/);
  assert.match(description, /Physics/);
});

/* ------------------------------------------------------------------ *
 * Marking
 * ------------------------------------------------------------------ */

test('a composed mock is marked by the board rules, not by its own', () => {
  const spec = withSpecId({ ...defaultSpec(), count: 30 });
  const composition = composeMock(spec, pool);
  const items = composition.items.map((item) => {
    const candidate = byId.get(item.id);
    const key = candidate?.keyTier === 'official' ? 'A' : 'B';
    const scored = scoreItem({ category: item.category, marks: item.marks, key: [key], voided: item.voided }, [key]);
    return { ...scored, id: item.id, n: item.n, subject: item.subject, subjectKey: item.subjectKey, category: item.category, marks: item.marks };
  });
  const summary = summarise(items);
  assert.equal(summary.maxMarks, composition.marks, 'the maximum is the marks of the mock itself');
  assert.equal(summary.correct + summary.partial + summary.wrong + summary.blank + summary.voided, composition.count);
});

test('a board-voided question in a mock awards its marks to everyone', () => {
  const awarded = pool.find((candidate) => candidate.voided);
  assert.ok(awarded, 'the corpus holds a board-voided question');
  const scored = scoreItem({ category: awarded.category, marks: awarded.marks, key: [], voided: true }, []);
  assert.equal(scored.status, 'voided');
  assert.equal(scored.awarded.n / scored.awarded.d, awarded.marks, 'the marks go to the candidate');
});

/* ------------------------------------------------------------------ *
 * Keeping the attempt
 * ------------------------------------------------------------------ */

test('a mock attempt keeps its specification and the paper each question came from', () => {
  const spec = withSpecId({ ...defaultSpec(), count: 12 });
  const composition = composeMock(spec, pool);
  const sources = Object.fromEntries(composition.items.map((item) => [item.id, { paperId: item.paperId, year: item.year, n: item.n }]));
  const attempt = {
    id: `mock-${spec.id}::mock`,
    paperId: `mock-${spec.id}`,
    paperYear: 0,
    paperLabel: 'Composed mock',
    title: spec.title,
    mode: 'mock',
    subjectKey: null,
    subjectLabel: null,
    questionIds: composition.items.map((item) => item.id),
    startedAt: 1,
    updatedAt: 2,
    submittedAt: null,
    submissionId: null,
    timeSpentSeconds: 0,
    deadlineAt: null,
    responses: {},
    responseTimes: {},
    marked: [],
    visited: [],
    assisted: [],
    limitSeconds: 3600,
    scopeMarks: composition.marks,
    scopeQuestions: composition.count,
    mockSpec: encodeSpec(spec),
    sources,
  };
  const merged = mergeAttempt(undefined, attempt);
  assert.equal(merged.mockSpec, encodeSpec(spec));
  assert.equal(Object.keys(merged.sources ?? {}).length, composition.count);
  for (const item of composition.items) {
    assert.equal(merged.sources[item.id].paperId, item.paperId, 'each question remembers the paper it came from');
  }
});

test('a submitted mock is final, like every other attempt', () => {
  const spec = defaultSpec();
  const stored = {
    id: `mock-${spec.id}::mock`,
    paperId: `mock-${spec.id}`,
    paperYear: 0,
    paperLabel: 'Composed mock',
    title: spec.title,
    mode: 'mock',
    subjectKey: null,
    subjectLabel: null,
    questionIds: ['jelet-et-p1-2025:q1'],
    startedAt: 1,
    updatedAt: 2,
    submittedAt: 10,
    submissionId: 'sub-1',
    timeSpentSeconds: 60,
    deadlineAt: null,
    responses: { 'jelet-et-p1-2025:q1': ['A'] },
    responseTimes: {},
    marked: [],
    visited: [],
    assisted: [],
    limitSeconds: null,
    scopeMarks: 1,
    scopeQuestions: 1,
    mockSpec: encodeSpec(spec),
    sources: {},
    results: [{ questionId: 'jelet-et-p1-2025:q1', subjectKey: 'mathematics', status: 'correct', awarded: 1, assisted: false }],
  };
  const incoming = { ...stored, submittedAt: 20, submissionId: 'sub-2', responses: { 'jelet-et-p1-2025:q1': ['B'] } };
  const merged = mergeAttempt(stored, incoming);
  assert.equal(merged.submissionId, 'sub-1', 'the first submission is the one that stands');
  assert.deepEqual(merged.responses['jelet-et-p1-2025:q1'], ['A']);
});

/* ------------------------------------------------------------------ *
 * The published pool
 * ------------------------------------------------------------------ */

test('the published pools cover every candidate exactly once', async () => {
  const subjects = PAPER_SUBJECTS.map((subject) => subject.key);
  const seen = new Set();
  for (const subject of subjects) {
    const file = JSON.parse(await readFile(new URL(`../dist/data/mock-pool/${subject}.json`, import.meta.url), 'utf8'));
    assert.equal(file.schema, 1);
    assert.equal(file.subject, subject);
    for (const item of file.items) {
      assert.ok(!seen.has(item.id), 'a question is published once');
      seen.add(item.id);
      assert.ok(allIds.has(item.id), 'a published question is a real candidate');
      assert.ok(item.html.includes('qcard'), 'a published question carries its rendered body');
    }
  }
  assert.equal(seen.size, pool.length, 'every candidate is published');
});
