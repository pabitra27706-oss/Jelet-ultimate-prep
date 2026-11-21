import assert from 'node:assert/strict';
import { test } from 'node:test';

import { scoreItem, summarise, toNumber } from '../src/lib/scoring.ts';
import { mergeAttempt } from '../src/lib/attempts.ts';
import {
  allLedgers,
  bookletFor,
  bookletForYear,
  ledgerFor,
  omrSheetFor,
  referenceSheetFor,
  referenceSheet,
} from '../src/lib/rehearsal.ts';
import { answerLetters, keyFor, paperById, papers } from '../src/lib/content.ts';

/* ------------------------------------------------------------------ *
 * Phase 05 · deadline and immutability
 * ------------------------------------------------------------------ */

const attempt = (over = {}) => ({
  id: 'a1',
  paperId: 'p1',
  paperYear: 2025,
  mode: 'paper',
  scope: 'all',
  questionIds: ['q1', 'q2'],
  startedAt: 1_000,
  updatedAt: 1_000,
  submittedAt: null,
  submissionId: null,
  timeSpentSeconds: 0,
  deadlineAt: 61_000,
  responses: {},
  responseTimes: {},
  marked: [],
  visited: ['q1'],
  assisted: [],
  results: [],
  ...over,
});

test('phase 05: a reload cannot buy back time, because the deadline is absolute', () => {
  const stored = attempt({ responses: { q1: ['A'] }, responseTimes: { q1: 5_000 } });
  // A tab that opens later must not push the deadline out.
  const later = attempt({ startedAt: 40_000, updatedAt: 40_000 });
  const merged = mergeAttempt(stored, later);
  assert.equal(merged.startedAt, 1_000, 'the earliest start wins');
  assert.equal(merged.deadlineAt, 61_000, 'the deadline is unchanged');
});

test('phase 05: the first submitted result is preserved against a later second tab', () => {
  const first = attempt({
    submittedAt: 2_000,
    submissionId: 'sub-first',
    responses: { q1: ['B'] },
    responseTimes: { q1: 1_500 },
    results: [{ questionId: 'q1', subjectKey: 'mathematics', status: 'correct', awarded: 1, assisted: false }],
  });
  const second = attempt({
    submittedAt: 9_000,
    submissionId: 'sub-second',
    responses: { q1: ['D'] },
    responseTimes: { q1: 8_000 },
    results: [{ questionId: 'q1', subjectKey: 'mathematics', status: 'wrong', awarded: -0.25, assisted: false }],
  });
  const merged = mergeAttempt(first, second);
  assert.equal(merged.submittedAt, 2_000, 'the first submission timestamp stands');
  assert.equal(merged.submissionId, 'sub-first');
  assert.deepEqual(merged.responses.q1, ['B'], 'the recorded answer is not overwritten');
  assert.equal(merged.results?.length, 1);
  assert.equal(merged.results?.[0].status, 'correct');
});

test('phase 05: the tab that owns the submission can still finish saving its results', () => {
  const stored = attempt({ submittedAt: 2_000, submissionId: 'sub-first' });
  const owner = attempt({
    submittedAt: 2_000,
    submissionId: 'sub-first',
    updatedAt: 2_100,
    results: [{ questionId: 'q1', subjectKey: 'mathematics', status: 'correct', awarded: 1, assisted: false }],
  });
  const merged = mergeAttempt(stored, owner);
  assert.equal(merged.results?.length, 1, 'the results are written');
  assert.equal(merged.submittedAt, 2_000, 'the submission timestamp does not move');
});

test('phase 05: concurrent tabs merge answers by the time each was given', () => {
  const stored = attempt({ responses: { q1: ['B'] }, responseTimes: { q1: 3_000 } });
  const other = attempt({ responses: { q1: ['C'] }, responseTimes: { q1: 7_000 } });
  const merged = mergeAttempt(stored, other);
  assert.deepEqual(merged.responses.q1, ['C'], 'the later answer wins');

  const stale = attempt({ responses: { q1: ['A'] }, responseTimes: { q1: 1_000 } });
  const kept = mergeAttempt(stored, stale);
  assert.deepEqual(kept.responses.q1, ['B'], 'an older answer never overwrites a newer one');
});

test('phase 05: marks and the visited set are merged, not replaced', () => {
  const stored = attempt({ marked: ['q2'], visited: ['q1'], assisted: ['q2'] });
  const other = attempt({ marked: ['q1'], visited: ['q2'], assisted: ['q1'] });
  const merged = mergeAttempt(stored, other);
  assert.deepEqual([...merged.marked].sort(), ['q1', 'q2']);
  assert.deepEqual([...merged.visited].sort(), ['q1', 'q2']);
  assert.deepEqual([...merged.assisted].sort(), ['q1', 'q2']);
});

/* ------------------------------------------------------------------ *
 * Phase 05 · the reconciliation ledger
 * ------------------------------------------------------------------ */

test('phase 05: every printed number of a keyable paper appears in the ledger exactly once', () => {
  const paper = paperById.get('jelet-et-p1-2025');
  assert.ok(paper);
  const ledger = ledgerFor(paper);
  assert.equal(ledger.rows.length, paper.questions.length);
  const numbers = ledger.rows.map((row) => row.printedNumber);
  assert.equal(new Set(numbers).size, numbers.length, 'no printed number is duplicated');
  const sorted = [...numbers].sort((a, b) => a - b);
  assert.deepEqual(numbers, sorted, 'the ledger is in printed order');
});

test('phase 05: the ledger accounts for every markable mark against the rule', () => {
  const paper = paperById.get('jelet-et-p1-2025');
  const ledger = ledgerFor(paper);
  const scoreable = ledger.rows.filter((row) => row.status === 'scoreable');
  const voided = ledger.rows.filter((row) => row.status === 'voided');
  assert.equal(scoreable.length, paper.scoreableQuestions);
  assert.equal(voided.length, paper.boardAwardedQuestions);
  assert.equal(
    ledger.totals.marks,
    scoreable.reduce((sum, row) => sum + row.marks, 0) + voided.reduce((sum, row) => sum + row.marks, 0),
    'the marks in the ledger add up',
  );
  assert.equal(ledger.totals.keyedMarks, scoreable.reduce((sum, row) => sum + row.marks, 0));
  assert.equal(ledger.totals.voidedMarks, voided.reduce((sum, row) => sum + row.marks, 0));
  for (const row of scoreable) {
    assert.ok(row.key.length > 0, `${row.questionId} has a key`);
    assert.match(row.rule, /Category (I|II)/, `${row.questionId} states its rule`);
  }
});

test('phase 05: held items are held, never marked, and excluded from the totals', () => {
  for (const paper of papers) {
    const ledger = ledgerFor(paper);
    for (const row of ledger.rows) {
      if (row.status !== 'held') continue;
      assert.equal(row.marked, false, `${row.questionId} is held so it is never marked`);
      assert.ok(row.holdReason, `${row.questionId} says why it is held`);
      assert.ok(!ledger.rows.find((other) => other.questionId === row.questionId && other.status === 'scoreable'));
    }
    const heldMarks = ledger.rows.filter((r) => r.status === 'held').reduce((s, r) => s + r.marks, 0);
    assert.equal(heldMarks, ledger.totals.heldMarks, `${paper.id} reports its held marks`);
    // The earnable marks plus the held marks account for every printed mark.
    assert.equal(
      ledger.totals.marks + heldMarks,
      paper.questions.reduce((s, q) => s + q.marks, 0),
      `${paper.id} accounts for every printed mark`,
    );
  }
});

test('phase 05: a voided item awards its full marks and is marked as voided', () => {
  const paper = paperById.get('jelet-et-p1-2024');
  const ledger = ledgerFor(paper);
  const voided = ledger.rows.filter((row) => row.voided);
  assert.deepEqual(voided.map((row) => row.printedNumber).sort((a, b) => a - b), [49, 58]);
  for (const row of voided) {
    assert.match(row.rule, /Voided by the board/);
  }
});

test('phase 05: a board-voided item is marked for full marks whatever the candidate answers', () => {
  // The board published "W": no option is keyed and the marks go to everyone.
  const paper = paperById.get('jelet-et-p1-2024');
  const voided = paper.questions.filter((question) => question.voided);
  assert.equal(voided.length, 2, '2024 has two board-voided items');
  for (const question of voided) {
    assert.equal(question.boardAwarded, true, `${question.id} is board-awarded`);
    assert.equal(question.scorable, false, `${question.id} has no key to mark against`);
    for (const selected of [[], ['A'], ['B'], ['C'], ['D'], ['A', 'D']]) {
      const scored = scoreItem({ category: question.category, marks: question.marks, key: [], voided: true }, selected);
      assert.equal(scored.status, 'voided');
      assert.equal(toNumber(scored.awarded), question.marks, `${question.id} awards its full marks`);
    }
  }
});

test('phase 05: a board-voided item counts towards the marks a candidate can earn', () => {
  const expected = {
    'jelet-et-p1-2024': { voided: 2, marks: 2 },
    'jelet-et-p1-2025': { voided: 3, marks: 3 },
  };
  for (const [paperId, want] of Object.entries(expected)) {
    const paper = paperById.get(paperId);
    const ledger = ledgerFor(paper);
    assert.equal(ledger.totals.voided, want.voided, `${paperId} publishes its voided count`);
    assert.equal(ledger.totals.voidedMarks, want.marks, `${paperId} counts the voided marks`);
    assert.equal(
      ledger.totals.marks,
      ledger.totals.keyedMarks + ledger.totals.voidedMarks,
      `${paperId} counts the board's award in the total`,
    );
    assert.equal(
      paper.rehearsableMarks,
      ledger.totals.marks,
      `${paperId} publishes the same marks as its ledger`,
    );
  }
});

test('phase 05: an ordinary held item is never board-awarded', () => {
  for (const paper of papers) {
    for (const question of paper.questions) {
      if (question.boardAwarded) {
        assert.equal(question.voided, true, `${question.id} is board-awarded only because the board voided it`);
        // A board award is worth the marks its category carries. The board
        // voided a Category II item in 2023, so the award is two marks, not
        // one: the rule is the category, not the number of items seen so far.
        assert.equal(question.marks, question.category === 'II' ? 2 : 1, `${question.id} is awarded the wrong marks`);
        continue;
      }
      if (question.voided) continue;
      assert.equal(question.boardAwarded, false, `${question.id} is not board-awarded`);
    }
  }
});

test('phase 05: a paper with no key is never offered as a rehearsal', () => {
  for (const paper of papers) {
    const ledger = ledgerFor(paper);
    if (paper.scoreableQuestions === 0) {
      assert.equal(ledger.rehearsable, false, `${paper.id} is not rehearsable`);
      assert.match(ledger.blockedReason ?? '', /No published key/);
      assert.equal(ledger.totals.scoreable, 0);
    }
  }
});

test('phase 05: the gaps in the transcript are published, not hidden', () => {
  const expected = {
    'jelet-et-p1-2019': [],
    'jelet-et-p1-2022': [],
    'jelet-et-p1-2024': [],
  };
  for (const [paperId, missing] of Object.entries(expected)) {
    const paper = paperById.get(paperId);
    assert.ok(paper, paperId);
    const ledger = ledgerFor(paper);
    assert.deepEqual(ledger.missing, missing, `${paperId} publishes its gaps`);
  }
});

test('phase 05: every ledger has a rule string for every row', () => {
  for (const paper of papers) {
    for (const row of ledgerFor(paper).rows) {
      assert.ok(row.rule.length > 20, `${row.questionId} states a rule`);
    }
  }
});

/* ------------------------------------------------------------------ *
 * Phase 05 · booklet identity
 * ------------------------------------------------------------------ */

test('phase 05: a keyable paper records how its booklet maps to the master order', () => {
  const paper = paperById.get('jelet-et-p1-2025');
  const booklet = bookletFor(paper);
  assert.equal(booklet.set, 'A');
  assert.equal(booklet.identity, true, 'the master order is the candidate booklet order');
  assert.ok(booklet.determination, 'the determination is recorded');
  assert.ok(booklet.sourceFile, 'the source file is recorded');
});

test('phase 05: a year with no booklet held says so rather than guessing', () => {
  // 2026 has a key but no question booklet was ever transcribed.
  const booklet = bookletForYear(2026);
  assert.equal(booklet.mapping, null);
  assert.equal(booklet.identity, false);
  assert.equal(booklet.set, null);
});

/* ------------------------------------------------------------------ *
 * Phase 05 · the reference sheet reconciles with the scoring engine
 * ------------------------------------------------------------------ */

test('phase 05: the reference sheet agrees with the scoring engine item by item', () => {
  for (const paper of papers) {
    const sheet = referenceSheetFor(paper);
    if (!sheet) continue;
    for (const item of sheet.items) {
      const question = paper.questions.find((q) => q.id === item.questionId);
      assert.ok(question, item.questionId);
      const scored = scoreItem(
        {
          category: question.category,
          marks: question.marks,
          key: answerLetters(paper, question),
          voided: question.voided,
        },
        item.marked,
      );
      assert.equal(scored.status, item.expectedStatus, `${item.questionId} status agrees`);
      assert.equal(toNumber(scored.awarded), toNumber(item.expectedAwarded), `${item.questionId} marks agree`);
    }
  }
});

test('phase 05: the reference sheet total equals the sum of the runner scores', () => {
  const paper = paperById.get('jelet-et-p1-2025');
  const sheet = referenceSheetFor(paper);
  assert.ok(sheet);
  const items = sheet.items.map((item) => {
    const question = paper.questions.find((q) => q.id === item.questionId);
    return scoreItem(
      {
        category: question.category,
        marks: question.marks,
        key: answerLetters(paper, question),
        voided: question.voided,
      },
      item.marked,
    );
  });
  const summary = summarise(items);
  assert.equal(toNumber(summary.awarded), toNumber(sheet.expectedTotal), 'the expected total is the real total');
  // The board's award is on top of the responses, and it is stated apart.
  assert.equal(summary.voided, 3, '2025 has three board-voided items in the sheet');
  assert.equal(toNumber(sheet.voidedMarks), 3, 'each board-voided item is worth one mark');
  assert.equal(
    toNumber(summary.awarded) + toNumber(sheet.voidedMarks),
    toNumber(sheet.creditedTotal),
    'the credited total is the responses plus the board award',
  );
});

test('phase 05: the reference sheet exercises every scoring path', () => {
  const sheet = referenceSheet('jelet-et-p1-2025');
  assert.ok(sheet);
  for (const status of ['correct', 'wrong', 'blank', 'voided']) {
    assert.ok((sheet.counts[status] ?? 0) > 0, `the sheet contains a ${status} item`);
  }
  const categoryII = sheet.items.filter((item) => item.category === 'II');
  assert.ok(
    categoryII.some((item) => item.expectedStatus === 'partial'),
    'the sheet contains a partial-credit item',
  );
});

test('phase 05: a paper without a key has no reference sheet', () => {
  assert.equal(referenceSheet('jelet-et-p1-2017'), null);
});

test('phase 05: every ledger is reachable for every published paper', () => {
  const ledgers = allLedgers();
  assert.equal(Object.keys(ledgers).length, papers.length);
  for (const paper of papers) assert.ok(ledgers[paper.id]);
});

test('phase 05: the key of a keyable paper is published with the right tier', () => {
  const paper = paperById.get('jelet-et-p1-2025');
  const key = keyFor(paper);
  assert.equal(key?.tier, 'official');
  const derived = keyFor(paperById.get('jelet-et-p1-2022'));
  assert.equal(derived?.tier, 'derived');
});

/* ------------------------------------------------------------------ *
 * Phase 05 · the printed companion
 * ------------------------------------------------------------------ */

test('phase 05: the answer sheet follows the booklet and refuses an unmapped booklet', () => {
  for (const paper of papers) {
    if (paper.scoreableQuestions === 0) continue;
    const sheet = omrSheetFor(paper);
    assert.ok(sheet, `${paper.id} has a sheet`);
    const booklet = bookletFor(paper);
    // Every published key's booklet is mapped, so the sheet may be offered.
    assert.equal(sheet.identityOrder, booklet.identity, `${paper.id} states its ordering honestly`);
    assert.ok(sheet.booklet.set, `${paper.id} names the set the sheet belongs to`);
    assert.ok(sheet.booklet.determination, `${paper.id} records how the ordering was determined`);
  }
  // A year whose key cannot be mapped to a booklet produces no sheet order.
  const unmapped = bookletForYear(2026);
  assert.equal(unmapped.identity, false, '2026 has no booklet mapping');
  assert.match(unmapped.determination ?? '', /cannot yet be mapped/);
});

test('phase 05: the answer sheet numbers every printed number in order', () => {
  const paper = paperById.get('jelet-et-p1-2025');
  const sheet = omrSheetFor(paper);
  const ledger = ledgerFor(paper);
  assert.deepEqual(
    sheet.rows.map((row) => row.printedNumber),
    ledger.rows.map((row) => row.printedNumber),
    'the sheet and the ledger cover the same printed numbers in the same order',
  );
  for (const row of sheet.rows) {
    assert.equal(row.bubbles.length, 4, `Q${row.printedNumber} has four bubbles`);
    if (row.status === 'voided') {
      assert.ok(row.bubbles.every((bubble) => !bubble.selectable), `Q${row.printedNumber} takes no bubble`);
      assert.match(row.note ?? '', /go to every candidate/);
    }
    if (row.status === 'held') {
      assert.ok(row.bubbles.every((bubble) => !bubble.selectable), `Q${row.printedNumber} takes no bubble`);
      assert.ok(row.note, `Q${row.printedNumber} says why it is held`);
    }
    if (row.status === 'scoreable') {
      assert.ok(row.bubbles.every((bubble) => bubble.selectable), `Q${row.printedNumber} can be filled`);
    }
  }
});

test('phase 05: the sheet and the runner agree on what can be marked and what it is worth', () => {
  for (const paper of papers) {
    if (paper.scoreableQuestions === 0) continue;
    const sheet = omrSheetFor(paper);
    const ledger = ledgerFor(paper);
    assert.equal(sheet.totalMarks, ledger.totals.marks, `${paper.id} totals agree`);
    assert.equal(sheet.markedRows, ledger.totals.scoreable);
    assert.equal(sheet.voidedRows, ledger.totals.voided);
    assert.equal(sheet.heldRows, ledger.totals.held);
    assert.deepEqual(sheet.missing, ledger.missing);
  }
});

test('phase 05: the printed sheet never states an answer', () => {
  for (const paper of papers) {
    if (paper.scoreableQuestions === 0) continue;
    const sheet = omrSheetFor(paper);
    for (const row of sheet.rows) {
      if (row.status !== 'scoreable') continue;
      assert.ok(!row.note, `Q${row.printedNumber} carries no note`);
      assert.ok(!('key' in row), `Q${row.printedNumber} exposes no key`);
    }
  }
});
