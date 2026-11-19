/**
 * Exam rehearsal: booklet identity, reconciliation and the reference sheet.
 *
 * Phase 05 asks for one thing above all: a paper must be *reconciled* before
 * it can be called a full paper. That means every printed number is accounted
 * for — what it is, whether it can be marked, which rule applies to it and
 * what the key says. Nothing here is invented:
 *
 * - The ledger is derived from `src/data/papers.json` and `src/data/keys.json`,
 *   which the content generator produces from the preserved archive.
 * - The booklet identity comes from the key record's own `booklet` block, which
 *   records how the master ordering maps onto a candidate booklet.
 * - The reference sheet is a *synthetic* response sheet built by this module.
 *   It exists so a reviewer can score a known set of answers and compare the
 *   marks item by item with what the runner computes. It is not a candidate's
 *   sheet and nothing about it is private.
 */
import { answerLetters, keyByYear, keyFor, papers, paperById, type Paper, type Question } from './content.ts';

export type RehearsalStatus = 'scoreable' | 'held' | 'voided' | 'missing';

export type LedgerRow = {
  /** The number printed on the paper. */
  printedNumber: number;
  /** The immutable public id, e.g. `jelet-et-p1-2025:q31`. */
  questionId: string;
  subject: string;
  subjectKey: string;
  category: 'I' | 'II';
  marks: number;
  status: RehearsalStatus;
  /**
   * The key letters the published key gives for this printed number.
   *
   * This is the reconciliation mapping — it says which master key row this
   * printed number corresponds to. It is empty for a voided item, because the
   * board published "W" and keyed no option at all.
   */
  key: string[];
  /**
   * Whether the runner marks this item.
   *
   * A held item can have a published key and still not be marked: the
   * transcription does not reproduce it, so no candidate can be scored
   * against that key. A voided item is marked — with the board's award.
   */
  marked: boolean;
  /** Why the item cannot be marked, when it cannot. */
  holdReason: string | null;
  /** True when the board voided this item in its final notice. */
  voided: boolean;
  /** The rule the runner applies to this item. */
  rule: string;
};

export type PaperLedger = {
  paperId: string;
  year: number;
  label: string;
  /** Every printed number that the transcript contains, in order. */
  rows: LedgerRow[];
  /** Printed numbers the transcript does not contain. */
  missing: number[];
  totals: {
    printed: number;
    scoreable: number;
    held: number;
    voided: number;
    missing: number;
    /** The marks a candidate can earn: keyed items plus board-awarded ones. */
    marks: number;
    /** The marks that come from the published answer key. */
    keyedMarks: number;
    /** The marks the board awarded to every candidate on its voided items. */
    voidedMarks: number;
    /** The marks that no candidate can earn from this transcript. */
    heldMarks: number;
    categoryI: number;
    categoryII: number;
  };
  /** Whether this paper can be offered as a rehearsal at all. */
  rehearsable: boolean;
  /** Why it cannot, when it cannot. */
  blockedReason: string | null;
};

export type BookletIdentity = {
  set: string | null;
  setSymbol: string | null;
  mapping: string | null;
  sourceFile: string | null;
  bookletNumber: string | null;
  /** How the booklet was matched to the master ordering. */
  determination: string | null;
  /** True when the master ordering is the candidate's own ordering. */
  identity: boolean;
};

const ruleFor = (question: Question, voided: boolean): string => {
  if (voided) return 'Voided by the board: the item awards its full marks to every candidate.';
  if (!question.scorable) return 'Held: shown for reading, never marked, and excluded from the total.';
  return question.category === 'I'
    ? 'Category I: +1 for exactly one correct option, −¼ for a wrong or multiple answer, 0 when blank.'
    : 'Category II: +2 for every correct option with no wrong option, 0 when any wrong option is marked, '
      + '2 × marked correct ÷ total correct for a correct subset, 0 when blank.';
};

/**
 * The status of one printed number.
 *
 * `voided` is not the same as `held`. A held item is missing something the
 * transcription could not reproduce, so it can never be marked and its marks
 * are not in the total. A voided item was voided by the board, which awarded
 * its marks to every candidate: it is marked, with the board's award.
 */
const statusFor = (question: Question): RehearsalStatus => {
  if (question.voided) return 'voided';
  return question.scorable ? 'scoreable' : 'held';
};

/**
 * Build the reconciliation ledger for one paper.
 *
 * Every printed number in the transcript gets a row. Numbers the transcript
 * does not contain are listed separately as missing, so the gap is visible
 * instead of being silently closed.
 */
export function ledgerFor(paper: Paper): PaperLedger {
  const rows: LedgerRow[] = [];
  const seen = new Set<number>();
  const paperHasKey = Boolean(keyFor(paper));

  for (const question of paper.questions) {
    seen.add(question.n);
    const voided = Boolean(question.voided);
    const status = statusFor(question);
    // Two different reasons an item can be held, and the learner is told which.
    const holdReason = status === 'held'
      ? (question.holdReason
        ?? (paperHasKey ? 'The preserved transcription does not reproduce this item, so it is held.' : 'No answer key is published for this year, so no item can be marked.'))
      : null;
    rows.push({
      printedNumber: question.n,
      questionId: question.id,
      subject: question.subject,
      subjectKey: question.subjectKey,
      category: question.category,
      marks: question.marks,
      status,
      key: answerLetters(paper, question),
      marked: status !== 'held',
      holdReason,
      voided,
      rule: ruleFor(question, voided),
    });
  }

  rows.sort((a, b) => a.printedNumber - b.printedNumber);

  // The board prints 100 numbers. Anything the transcript lacks is a gap.
  const printed = Math.max(...rows.map((row) => row.printedNumber), 0);
  const missing: number[] = [];
  for (let n = 1; n <= printed; n += 1) if (!seen.has(n)) missing.push(n);

  const scoreableRows = rows.filter((row) => row.status === 'scoreable');
  const voidedRows = rows.filter((row) => row.status === 'voided');
  const totals = {
    printed: rows.length,
    scoreable: scoreableRows.length,
    held: rows.filter((row) => row.status === 'held').length,
    voided: voidedRows.length,
    missing: missing.length,
    /**
     * The marks a candidate can earn from this transcript: the keyed items
     * plus the items the board awarded to everyone. Held items are not in it.
     */
    marks: [...scoreableRows, ...voidedRows].reduce((sum, row) => sum + row.marks, 0),
    keyedMarks: scoreableRows.reduce((sum, row) => sum + row.marks, 0),
    voidedMarks: voidedRows.reduce((sum, row) => sum + row.marks, 0),
    heldMarks: rows.filter((row) => row.status === 'held').reduce((sum, row) => sum + row.marks, 0),
    categoryI: scoreableRows.filter((row) => row.category === 'I').length,
    categoryII: scoreableRows.filter((row) => row.category === 'II').length,
  };

  const noKey = totals.scoreable === 0 && totals.voided === 0;
  const rehearsable = !noKey && totals.missing === 0;
  let blockedReason: string | null = null;
  if (noKey) {
    blockedReason = 'No published key for this year, so no item can be marked. The paper is offered for reading only.';
  } else if (totals.missing > 0) {
    blockedReason = `The transcript is missing ${totals.missing} printed number${totals.missing === 1 ? '' : 's'}, so this is a labelled incomplete paper rather than a full rehearsal.`;
  } else if (totals.held > 0) {
    blockedReason = `${totals.held} item${totals.held === 1 ? '' : 's'} depend on a diagram the transcript does not reproduce, so they are held and the maximum score is lower than the printed paper.`;
  }

  return {
    paperId: paper.id,
    year: paper.year,
    label: paper.label,
    rows,
    missing,
    totals,
    rehearsable,
    blockedReason,
  };
}

/** The booklet identity recorded against this paper's key. */
export function bookletFor(paper: Paper): BookletIdentity {
  const booklet = keyFor(paper)?.booklet ?? null;
  return {
    set: booklet?.set ?? null,
    setSymbol: booklet?.setSymbol ?? null,
    mapping: booklet?.mapping ?? null,
    sourceFile: booklet?.sourceFile ?? null,
    bookletNumber: booklet?.bookletNumber ?? null,
    determination: booklet?.determination ?? null,
    identity: booklet?.mapping === 'identity',
  };
}

/**
 * The booklet identity for a key, whether or not the paper itself is published.
 *
 * A year can hold a key without holding the question paper. In that case the
 * booklet cannot be mapped to anything a candidate sat, and this says so
 * instead of guessing.
 */
export function bookletForYear(year: number): BookletIdentity {
  const booklet = keyByYear.get(year)?.booklet ?? null;
  return {
    set: booklet?.set ?? null,
    setSymbol: booklet?.setSymbol ?? null,
    mapping: booklet?.mapping ?? null,
    sourceFile: booklet?.sourceFile ?? null,
    bookletNumber: booklet?.bookletNumber ?? null,
    determination: booklet?.determination ?? null,
    identity: booklet?.mapping === 'identity',
  };
}

/**
 * A synthetic response sheet for a paper.
 *
 * The pattern is fixed so two runs always produce the same sheet: every
 * scoreable item gets an answer that exercises a different part of the
 * marking rules — a correct Category I item, a wrong Category I item, a
 * blank, a fully correct Category II item, a Category II item with a wrong
 * option and a Category II item with a correct subset. A reviewer can score
 * this by hand and compare it with what the runner produces.
 */
export type ReferenceItem = {
  questionId: string;
  printedNumber: number;
  category: 'I' | 'II';
  marks: number;
  /** The options this synthetic sheet marks. */
  marked: string[];
  /** The expected status under the published rule. */
  expectedStatus: 'correct' | 'wrong' | 'partial' | 'blank' | 'voided';
  /** The expected marks, as an exact fraction. */
  expectedAwarded: { n: number; d: number };
  /** Why this item was given this response. */
  note: string;
};

export type ReferenceSheet = {
  paperId: string;
  label: string;
  items: ReferenceItem[];
  /** The exact expected total. */
  expectedTotal: { n: number; d: number };
  counts: Record<string, number>;
  /**
   * The marks the board awarded to every candidate on its voided items.
   *
   * These are not part of `expectedTotal`, because they are not a response
   * the synthetic sheet gives. They are part of what the candidate is
   * credited, so the reference sheet states them separately.
   */
  voidedMarks: { n: number; d: number };
  /** The marks a candidate is credited overall on this paper. */
  creditedTotal: { n: number; d: number };
};

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const fraction = (n: number, d: number) => {
  const divisor = gcd(n, d) || 1;
  return { n: n / divisor, d: d / divisor };
};

/** The expected marks for one synthetic response, computed independently. */
function expectedMarks(category: 'I' | 'II', marks: number, key: string[], marked: string[]): { status: ReferenceItem['expectedStatus']; awarded: { n: number; d: number } } {
  if (marked.length === 0) return { status: 'blank', awarded: { n: 0, d: 1 } };
  const correct = marked.filter((letter) => key.includes(letter));
  const wrong = marked.filter((letter) => !key.includes(letter));
  if (category === 'I') {
    if (correct.length === 1 && wrong.length === 0) return { status: 'correct', awarded: { n: marks, d: 1 } };
    return { status: 'wrong', awarded: fraction(-marks, 4) };
  }
  if (wrong.length > 0) return { status: 'wrong', awarded: { n: 0, d: 1 } };
  if (correct.length === key.length) return { status: 'correct', awarded: { n: marks, d: 1 } };
  return { status: 'partial', awarded: fraction(marks * correct.length, key.length) };
}

/** Build the synthetic reference sheet for a paper. */
export function referenceSheetFor(paper: Paper): ReferenceSheet | null {
  const scoreable = paper.questions.filter(
    (question) => question.scorable && !question.voided && answerLetters(paper, question).length > 0,
  );
  const voided = paper.questions.filter((question) => question.boardAwarded);
  if (scoreable.length === 0 && voided.length === 0) return null;

  const items: ReferenceItem[] = [];
  let categoryICounter = 0;
  let categoryIICounter = 0;

  // The board's own dispositions come first in the sheet, because they are
  // the rows a reviewer must check first: no option is keyed and the marks go
  // to every candidate.
  for (const question of voided) {
    items.push({
      questionId: question.id,
      printedNumber: question.n,
      category: question.category,
      marks: question.marks,
      marked: [],
      expectedStatus: 'voided',
      expectedAwarded: { n: question.marks, d: 1 },
      note: 'The board voided this question: no option was keyed, so the marks go to every candidate.',
    });
  }

  for (const question of scoreable) {
    const key = answerLetters(paper, question);
    let marked: string[];
    let note: string;
    let status: ReferenceItem['expectedStatus'];

    if (question.category === 'I') {
      // Rotate through a correct answer, a wrong answer and a blank.
      const phase = categoryICounter % 3;
      categoryICounter += 1;
      if (phase === 0) {
        marked = [key[0]];
        note = 'Exactly the correct option is marked.';
        status = 'correct';
      } else if (phase === 1) {
        const wrongOption = ['A', 'B', 'C', 'D'].find((letter) => !key.includes(letter));
        if (!wrongOption) { marked = [key[0]]; note = 'Exactly the correct option is marked.'; status = 'correct'; }
        else { marked = [wrongOption]; note = 'A wrong option is marked.'; status = 'wrong'; }
      } else {
        marked = [];
        note = 'Left blank.';
        status = 'blank';
      }
    } else {
      // Rotate through fully correct, a wrong option and a correct subset.
      const phase = categoryIICounter % 3;
      categoryIICounter += 1;
      if (phase === 0) {
        marked = [...key];
        note = 'Every correct option is marked and no wrong option is.';
        status = 'correct';
      } else if (phase === 1 && key.length > 0) {
        const wrongOption = ['A', 'B', 'C', 'D'].find((letter) => !key.includes(letter));
        if (!wrongOption) { marked = [...key]; note = 'Every correct option is marked and no wrong option is.'; status = 'correct'; }
        else { marked = [wrongOption]; note = 'A wrong option is marked, so the item scores nothing.'; status = 'wrong'; }
      } else if (key.length > 1) {
        marked = [key[0]];
        note = 'One correct option of several is marked, which earns partial credit.';
        status = 'partial';
      } else {
        marked = [...key];
        note = 'Every correct option is marked and no wrong option is.';
        status = 'correct';
      }
    }

    const computed = expectedMarks(question.category, question.marks, key, marked);
    // The status the rule implies must match the status the pattern intended.
    if (computed.status !== status) {
      throw new Error(`Reference sheet pattern disagrees with the rule at ${question.id}`);
    }
    items.push({
      questionId: question.id,
      printedNumber: question.n,
      category: question.category,
      marks: question.marks,
      marked,
      expectedStatus: status,
      expectedAwarded: computed.awarded,
      note,
    });
  }

  const total = items.reduce((sum, item) => ({
    n: sum.n * item.expectedAwarded.d + item.expectedAwarded.n * sum.d,
    d: sum.d * item.expectedAwarded.d,
  }), { n: 0, d: 1 });
  const expectedTotal = fraction(total.n, total.d);

  const counts: Record<string, number> = {};
  for (const item of items) counts[item.expectedStatus] = (counts[item.expectedStatus] ?? 0) + 1;

  const voidedMarks = fraction(
    voided.reduce((sum, question) => sum + question.marks, 0),
    1,
  );
  const creditedTotal = fraction(expectedTotal.n * voidedMarks.d + voidedMarks.n * expectedTotal.d, expectedTotal.d * voidedMarks.d);

  return {
    paperId: paper.id,
    label: paper.label,
    items,
    expectedTotal,
    counts,
    voidedMarks,
    creditedTotal,
  };
}

/** Every paper that has a ledger, keyed by paper id. */
export function allLedgers(): Record<string, PaperLedger> {
  const ledgers: Record<string, PaperLedger> = {};
  for (const paper of papers) ledgers[paper.id] = ledgerFor(paper);
  return ledgers;
}

/** The reference sheet for a paper, if it has one. */
export function referenceSheet(paperId: string): ReferenceSheet | null {
  const paper = paperById.get(paperId);
  return paper ? referenceSheetFor(paper) : null;
}

/* ------------------------------------------------------------------ *
 * The printed companion
 * ------------------------------------------------------------------ */

/**
 * One bubble on an OMR answer sheet.
 *
 * The printed companion asks the candidate to fill bubbles on a sheet that
 * follows the *booklet's* printed order, not the master's. The runner reads
 * the bubbles back in that order, so the two must agree exactly.
 */
export type OmrBubble = {
  /** The number printed on the booklet next to this bubble. */
  printedNumber: number;
  /** The option letter this bubble selects. */
  letter: string;
  /** Whether the candidate may fill this bubble at all. */
  selectable: boolean;
  /** True when the board voided this row, so no bubble should be filled. */
  voided: boolean;
};

export type OmrRow = {
  printedNumber: number;
  questionId: string;
  subject: string;
  subjectKey: string;
  category: 'I' | 'II';
  marks: number;
  status: RehearsalStatus;
  /** The bubbles for this row, in option order. */
  bubbles: OmrBubble[];
  /** Why the row cannot be marked, when it cannot. */
  note: string | null;
};

export type OmrSheet = {
  paperId: string;
  label: string;
  year: number;
  /** The booklet identity this sheet belongs to. */
  booklet: BookletIdentity;
  /**
   * Whether the printed order is the master's order.
   *
   * When it is, the sheet and the runner agree by construction. When it is
   * not, the candidate's booklet is a different series and the sheet must be
   * read in the booklet's order — which this build does not hold, so the
   * printed companion refuses to offer it.
   */
  identityOrder: boolean;
  rows: OmrRow[];
  /** The marks a candidate can earn from this sheet. */
  totalMarks: number;
  /** The rows that carry marks. */
  markedRows: number;
  /** The rows the board awarded to everyone. */
  voidedRows: number;
  /** The rows that cannot be marked. */
  heldRows: number;
  /** The printed numbers the sheet does not contain. */
  missing: number[];
};

/**
 * Build the OMR answer sheet for a paper.
 *
 * The sheet follows the booklet's printed order. The board's own booklet
 * identity decides that order, and this build only supports the identity
 * mapping — where the booklet carries the master's ordering — because any
 * other series would need a mapping this transcription does not hold.
 */
export function omrSheetFor(paper: Paper): OmrSheet | null {
  const ledger = ledgerFor(paper);
  const booklet = bookletFor(paper);
  const identityOrder = booklet.identity;

  const rows: OmrRow[] = ledger.rows.map((row) => ({
    printedNumber: row.printedNumber,
    questionId: row.questionId,
    subject: row.subject,
    subjectKey: row.subjectKey,
    category: row.category,
    marks: row.marks,
    status: row.status,
    bubbles: (['A', 'B', 'C', 'D'] as const).map((letter) => ({
      printedNumber: row.printedNumber,
      letter,
      selectable: row.status === 'scoreable',
      voided: row.status === 'voided',
    })),
    note: row.status === 'voided'
      ? 'Voided by the board: the marks go to every candidate, so no bubble is filled.'
      : row.status === 'held'
        ? row.holdReason
        : null,
  }));

  const markedRows = rows.filter((row) => row.status === 'scoreable').length;
  const voidedRows = rows.filter((row) => row.status === 'voided').length;
  const heldRows = rows.filter((row) => row.status === 'held').length;

  return {
    paperId: paper.id,
    label: paper.label,
    year: paper.year,
    booklet,
    identityOrder,
    rows,
    totalMarks: rows.filter((row) => row.status !== 'held').reduce((sum, row) => sum + row.marks, 0),
    markedRows,
    voidedRows,
    heldRows,
    missing: ledger.missing,
  };
}
