/**
 * JELET marking rules.
 *
 * Contract (docs/CONTENT.md, dated reference 2026 Paper I):
 *   Category I  — exactly the correct option marked: +1.
 *                 wrong or multiple options marked: −1/4.
 *                 nothing marked: 0.
 *   Category II — every correct option and no wrong option: +2.
 *                 a wrong option marked: 0.
 *                 a non-empty correct subset: 2 × marked correct ÷ total correct.
 *                 nothing marked: 0.
 *   Voided item — the board published "W": no option is keyed and the marks go
 *                 to every candidate, so the full marks are awarded.
 *
 * Totals are exact rationals; rounding happens only for display.
 */

export type Category = 'I' | 'II';
export type ItemStatus = 'correct' | 'partial' | 'wrong' | 'blank' | 'voided' | 'unmarked';

export type Rational = { n: number; d: number };

const make = (n: number, d = 1): Rational => ({ n, d });

export const zero: Rational = make(0);

export function add(a: Rational, b: Rational): Rational {
  return make(a.n * b.d + b.n * a.d, a.d * b.d);
}

export function toNumber(value: Rational): number {
  return value.d === 0 ? 0 : value.n / value.d;
}

/** Display rounding only: keep two decimals, drop a trailing ".00". */
export function formatMarks(value: Rational | number): string {
  const numeric = typeof value === 'number' ? value : toNumber(value);
  const rounded = Math.round(numeric * 100) / 100;
  if (Math.abs(rounded - Math.round(rounded)) < 1e-9) return String(Math.round(rounded));
  return rounded.toFixed(2).replace(/0$/, '');
}

export type ScoreableItem = {
  category: Category;
  marks: number;
  /** Correct option letters. Empty for a voided item. */
  key: string[];
  voided?: boolean;
};

export type ItemScore = {
  status: ItemStatus;
  awarded: Rational;
  selected: string[];
  key: string[];
  explanation: string;
};

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((value) => b.includes(value));

/**
 * Score one item. `selected` may hold any order; duplicates are ignored.
 */
export function scoreItem(item: ScoreableItem, selected: string[]): ItemScore {
  const chosen = [...new Set(selected)].filter((letter) => 'ABCD'.includes(letter)).sort();
  const key = [...new Set(item.key)].filter((letter) => 'ABCD'.includes(letter)).sort();

  if (item.voided) {
    return {
      status: 'voided',
      awarded: make(item.marks),
      selected: chosen,
      key,
      explanation: 'The board voided this question in its final answer-key notice. No option was keyed, so the marks go to every candidate.',
    };
  }

  if (chosen.length === 0) {
    return {
      status: 'blank',
      awarded: zero,
      selected: chosen,
      key,
      explanation: item.category === 'I'
        ? 'Nothing was marked, so this item scores 0.'
        : 'Nothing was marked, so this item scores 0.',
    };
  }

  if (item.category === 'I') {
    if (sameSet(chosen, key)) {
      return {
        status: 'correct',
        awarded: make(item.marks),
        selected: chosen,
        key,
        explanation: 'Exactly the correct option was marked: full marks.',
      };
    }
    const multiple = chosen.length > 1;
    return {
      status: 'wrong',
      awarded: make(-1, 4),
      selected: chosen,
      key,
      explanation: multiple
        ? `Multiple options were marked in a Category-I item, so −1/4 applies (${formatMarks(-0.25)} mark).`
        : `The wrong option was marked, so −1/4 applies (${formatMarks(-0.25)} mark).`,
    };
  }

  // Category II
  const wrong = chosen.filter((letter) => !key.includes(letter));
  if (wrong.length > 0) {
    return {
      status: 'wrong',
      awarded: zero,
      selected: chosen,
      key,
      explanation: `A wrong option (${wrong.join(', ')}) was marked in a Category-II item, so the item scores 0.`,
    };
  }
  if (sameSet(chosen, key)) {
    return {
      status: 'correct',
      awarded: make(item.marks),
      selected: chosen,
      key,
      explanation: 'All correct options were marked with no wrong option: full marks.',
    };
  }
  const correctMarked = chosen.length;
  const awarded = make(item.marks * correctMarked, key.length);
  return {
    status: 'partial',
    awarded,
    selected: chosen,
    key,
    explanation: `${correctMarked} of ${key.length} correct options were marked with no wrong option: partial credit of ${formatMarks(awarded)} mark.`,
  };
}

export type ScoredItem = ItemScore & {
  id: string;
  n: number;
  subject: string;
  subjectKey: string;
  category: Category;
  marks: number;
};

export type AttemptSummary = {
  awarded: Rational;
  maxMarks: number;
  scoredCount: number;
  correct: number;
  partial: number;
  wrong: number;
  blank: number;
  voided: number;
  bySubject: Record<string, { awarded: Rational; maxMarks: number; correct: number; partial: number; wrong: number; blank: number; count: number }>;
  byCategory: Record<string, { awarded: Rational; maxMarks: number; count: number }>;
};

export function summarise(items: ScoredItem[]): AttemptSummary {
  const summary: AttemptSummary = {
    awarded: zero,
    maxMarks: 0,
    scoredCount: 0,
    correct: 0,
    partial: 0,
    wrong: 0,
    blank: 0,
    voided: 0,
    bySubject: {},
    byCategory: {},
  };
  for (const item of items) {
    summary.awarded = add(summary.awarded, item.awarded);
    summary.maxMarks += item.marks;
    summary.scoredCount += 1;
    if (item.status === 'correct') summary.correct += 1;
    else if (item.status === 'partial') summary.partial += 1;
    else if (item.status === 'wrong') summary.wrong += 1;
    else if (item.status === 'blank') summary.blank += 1;
    else if (item.status === 'voided') summary.voided += 1;

    const subject = summary.bySubject[item.subjectKey] ?? { awarded: zero, maxMarks: 0, correct: 0, partial: 0, wrong: 0, blank: 0, count: 0 };
    subject.awarded = add(subject.awarded, item.awarded);
    subject.maxMarks += item.marks;
    subject.count += 1;
    if (item.status === 'correct') subject.correct += 1;
    else if (item.status === 'partial') subject.partial += 1;
    else if (item.status === 'wrong') subject.wrong += 1;
    else if (item.status === 'blank') subject.blank += 1;
    summary.bySubject[item.subjectKey] = subject;

    const category = summary.byCategory[item.category] ?? { awarded: zero, maxMarks: 0, count: 0 };
    category.awarded = add(category.awarded, item.awarded);
    category.maxMarks += item.marks;
    category.count += 1;
    summary.byCategory[item.category] = category;
  }
  return summary;
}

/** Percentage of available marks, using exact rationals. */
export function percentage(summary: AttemptSummary): number {
  if (summary.maxMarks === 0) return 0;
  return toNumber(summary.awarded) / summary.maxMarks * 100;
}
