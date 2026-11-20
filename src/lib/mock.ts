/**
 * The configurable mock.
 *
 * A full-paper rehearsal is one fixed paper. A mock is a paper the learner
 * composes: choose the subjects, the topics, how many questions, how the two
 * categories are mixed, how long it runs, and whether questions already
 * answered should be left out. This module turns that specification into a
 * concrete, marked paper drawn from the real corpus.
 *
 * The rules it follows:
 *
 * - **It never invents a question.** Every item comes from a paper the
 *   archive preserves, and only items that carry a published key and a
 *   complete set of options can enter a mock, because only those can be
 *   marked.
 * - **It keeps the real marking.** Category I and Category II items are
 *   marked by exactly the rules the board publishes, so a mock scores the
 *   same way a paper does.
 * - **It keeps the real shape.** Subjects are laid out in the Paper I order,
 *   and inside a subject the Category I block comes before the Category II
 *   block, which is how the paper itself is set.
 * - **It is reproducible.** The same specification always composes the same
 *   paper, so an interrupted mock resumes where it stopped instead of
 *   changing under the learner.
 * - **It is honest about scarcity.** When the corpus cannot supply what was
 *   asked for, the composition says so instead of quietly padding.
 *
 * This module is deliberately free of any import that pulls in the corpus.
 * The candidate pool arrives as an argument, so the same code composes a
 * paper in the browser and in a test, and the corpus never reaches a phone
 * that only needs to sit a mock.
 */
import { subjectLabels, type SubjectKey } from './subjects.ts';

/** The Paper I subject order and the share of the paper each subject holds. */
export const PAPER_SUBJECTS: { key: SubjectKey; label: string; share: number }[] = [
  { key: 'mathematics', label: 'Mathematics', share: 0.4 },
  { key: 'physics', label: 'Physics', share: 0.3 },
  { key: 'chemistry', label: 'Chemistry', share: 0.2 },
  { key: 'electrical', label: 'Electrical & Electronics', share: 0.1 },
];

/** The Category I share of a real Paper I: 85 of the 100 questions. */
export const PAPER_CATEGORY_I_SHARE = 0.85;

/** The largest mock the builder offers. */
export const MAX_MOCK_QUESTIONS = 100;

export type CategoryMix = 'paper' | 'custom';

export type MockSpec = {
  /** Stable id derived from the selection, so the same mock resumes. */
  id: string;
  title: string;
  /** The subjects to draw from. */
  subjects: SubjectKey[];
  /** Optional topic ids to restrict the draw to. Empty means every topic. */
  topics: string[];
  /** How many questions the mock should hold. */
  count: number;
  /** How the two categories are mixed. */
  categoryMix: CategoryMix;
  /** The Category I share when the mix is custom, between 0 and 1. */
  categoryIShare: number;
  /** Minutes allowed. Zero means untimed. */
  durationMinutes: number;
  /** Leave out questions this device has already answered. */
  avoidSeen: boolean;
  /** Include the questions the board voided, whose marks go to everyone. */
  includeAwarded: boolean;
  /** The seed of the shuffle. The same seed composes the same paper. */
  seed: number;
};

/**
 * One question the mock may draw.
 *
 * A candidate carries the facts the composer needs and the facts the runner
 * needs: which paper it came from, which number it has there, whether the
 * board voided it, and which topics it was mapped to.
 */
export type MockCandidate = {
  /** The corpus question id. It is unique across the whole corpus. */
  id: string;
  /** The question number inside its own paper. */
  n: number;
  /** The paper it came from. */
  paperId: string;
  /** The year of that paper. */
  year: number;
  /** The subject it belongs to. */
  subjectKey: SubjectKey;
  /** The subject's name, as the paper writes it. */
  subject: string;
  /** Which category the board set it in. */
  category: 'I' | 'II';
  /** What it is worth. */
  marks: number;
  /** True when the board voided it and awarded the marks to everyone. */
  voided: boolean;
  /** The topics it was mapped to. */
  topicIds: string[];
  /** Whether the key for its paper is the board's or a derived one. */
  keyTier: 'official' | 'derived' | null;
};

export type MockItem = MockCandidate;

export type MockSubjectShare = {
  subjectKey: SubjectKey;
  label: string;
  count: number;
  marks: number;
  categoryI: number;
  categoryII: number;
  /** How many the corpus could supply for this subject. */
  available: number;
};

export type MockComposition = {
  items: MockItem[];
  /** The number of questions in the mock. */
  count: number;
  /** The marks the mock is worth. */
  marks: number;
  /** The number of questions the learner asked for. */
  requested: number;
  /** The shortfall, if the corpus could not supply the request. */
  shortfall: number;
  bySubject: MockSubjectShare[];
  byYear: { year: number; count: number; tier: 'official' | 'derived' | null }[];
  /** The Category I and Category II counts in the composed mock. */
  categoryI: number;
  categoryII: number;
  /** Things the learner should know before the mock starts. */
  notes: string[];
  /** True when some questions were left out because they were already answered. */
  avoidedSeen: boolean;
};

/* ------------------------------------------------------------------ *
 * Deterministic shuffling
 * ------------------------------------------------------------------ */

/** A small, fast, seeded generator. The same seed always gives the same order. */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A stable order for a list, driven by the seed alone. */
export function shuffled<T>(items: readonly T[], seed: number): T[] {
  const random = seededRandom(seed);
  const out = [...items];
  for (let index = out.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [out[index], out[swap]] = [out[swap], out[index]];
  }
  return out;
}

/** A small stable hash of a string, used to vary the shuffle per subject. */
function hashOf(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash;
}

/* ------------------------------------------------------------------ *
 * The specification
 * ------------------------------------------------------------------ */

/** A short, stable hash of the fields that decide which questions are used. */
function specHash(spec: Omit<MockSpec, 'id'>): string {
  const material = JSON.stringify([
    spec.subjects.slice().sort(),
    spec.topics.slice().sort(),
    spec.count,
    spec.categoryMix,
    spec.categoryIShare,
    spec.durationMinutes,
    spec.avoidSeen,
    spec.includeAwarded,
    spec.seed,
  ]);
  let hash = 0x811c9dc5;
  for (let index = 0; index < material.length; index += 1) {
    hash ^= material.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

/** Fill in the id of a specification. */
export function withSpecId(spec: Omit<MockSpec, 'id'>): MockSpec {
  return { ...spec, id: specHash(spec) };
}

/** The default specification: a balanced paper drawn from every subject. */
export function defaultSpec(): MockSpec {
  return withSpecId({
    title: 'Balanced mock',
    subjects: PAPER_SUBJECTS.map((subject) => subject.key),
    topics: [],
    count: 40,
    categoryMix: 'paper',
    categoryIShare: PAPER_CATEGORY_I_SHARE,
    durationMinutes: 60,
    avoidSeen: false,
    includeAwarded: true,
    seed: 1,
  });
}

/** A readable title for a specification, used when the learner gives none. */
export function describeSpec(spec: MockSpec): string {
  const names = spec.subjects.map((key) => subjectLabels[key] ?? key);
  const subjectPart = names.length === 0
    ? 'no subject'
    : names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  const topicPart = spec.topics.length > 0 ? ` · ${spec.topics.length} topic${spec.topics.length === 1 ? '' : 's'}` : '';
  return `${spec.count} questions · ${subjectPart}${topicPart}`;
}

/** How many usable questions exist for one subject, in a given pool. */
export function availableForSubject(candidates: readonly MockCandidate[], subjectKey: SubjectKey): number {
  return candidates.filter((candidate) => candidate.subjectKey === subjectKey).length;
}

/* ------------------------------------------------------------------ *
 * The specification in a link
 * ------------------------------------------------------------------ */

/**
 * The route a mock is sat at.
 *
 * The specification travels in the query string, so a mock is a link: it can
 * be bookmarked, shared and reopened, and the same link always composes the
 * same paper.
 */
export function mockRoute(spec: MockSpec): string {
  return `/mock/run/?${encodeSpec(spec)}`;
}

/**
 * Write a specification into a query string.
 *
 * Only the fields that change the paper are written. The title is cosmetic,
 * so it is written separately and never changes the composition.
 */
export function encodeSpec(spec: MockSpec): string {
  const params = new URLSearchParams();
  params.set('s', spec.subjects.join(','));
  if (spec.topics.length > 0) params.set('t', spec.topics.join(','));
  params.set('n', String(spec.count));
  params.set('m', spec.categoryMix);
  if (spec.categoryMix === 'custom') params.set('c', spec.categoryIShare.toFixed(3));
  params.set('d', String(spec.durationMinutes));
  if (spec.avoidSeen) params.set('v', '1');
  if (!spec.includeAwarded) params.set('w', '0');
  params.set('seed', String(spec.seed));
  const base = defaultSpec();
  if (spec.title && spec.title !== base.title) params.set('name', spec.title);
  return params.toString();
}

/**
 * Read a specification back out of a query string.
 *
 * A malformed or hostile link must not produce a broken mock: anything that
 * cannot be read is replaced with the default, and the count is held inside
 * the bounds the builder offers.
 */
export function decodeSpec(search: string | URLSearchParams): MockSpec {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search;
  // A subject or a topic may arrive as one comma-joined value or as several
  // values, because the builder's own form sends one value per box.
  const list = (name: string): string[] => params.getAll(name)
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);
  // A checkbox that is on and off at once is resolved by the last value, so a
  // plain form submission and a written link mean the same thing.
  const last = (name: string): string | null => {
    const all = params.getAll(name);
    return all.length > 0 ? all[all.length - 1] : null;
  };

  const subjects = list('s').filter((value): value is SubjectKey => PAPER_SUBJECTS.some((subject) => subject.key === value));
  const topics = list('t');
  const count = Number(params.get('n'));
  const minutes = Number(params.get('d'));
  const share = Number(params.get('c'));
  const seed = Number(params.get('seed'));
  const mix = params.get('m');
  const title = params.get('name');

  return withSpecId({
    title: title && title.trim() ? title.trim().slice(0, 80) : defaultSpec().title,
    subjects: subjects.length > 0 ? subjects : defaultSpec().subjects,
    topics,
    count: Number.isFinite(count) ? Math.max(1, Math.min(MAX_MOCK_QUESTIONS, Math.round(count))) : defaultSpec().count,
    categoryMix: mix === 'custom' ? 'custom' : 'paper',
    categoryIShare: Number.isFinite(share) ? Math.min(1, Math.max(0, share)) : PAPER_CATEGORY_I_SHARE,
    durationMinutes: Number.isFinite(minutes) ? Math.max(0, Math.min(300, Math.round(minutes))) : defaultSpec().durationMinutes,
    avoidSeen: last('v') === '1',
    includeAwarded: last('w') !== '0',
    seed: Number.isFinite(seed) ? Math.abs(Math.round(seed)) % 100000 : defaultSpec().seed,
  });
}

/* ------------------------------------------------------------------ *
 * Composition
 * ------------------------------------------------------------------ */

/**
 * Compose a mock from a specification.
 *
 * `answeredIds` are the questions this device has already answered. They are
 * only excluded when the specification asks for it, and only while enough
 * questions remain to fill the request.
 */
export function composeMock(
  spec: MockSpec,
  candidates: readonly MockCandidate[],
  answeredIds: readonly string[] = [],
): MockComposition {
  const notes: string[] = [];
  const requested = Math.max(0, Math.min(MAX_MOCK_QUESTIONS, Math.round(spec.count)));
  const subjectKeys = spec.subjects.filter((key) => PAPER_SUBJECTS.some((subject) => subject.key === key));
  if (subjectKeys.length === 0) {
    return {
      items: [], count: 0, marks: 0, requested, shortfall: requested,
      bySubject: [], byYear: [], categoryI: 0, categoryII: 0,
      notes: ['Choose at least one subject before starting a mock.'], avoidedSeen: false,
    };
  }

  const answered = new Set(answeredIds);
  const pool = candidates.filter((candidate) => {
    if (!subjectKeys.includes(candidate.subjectKey)) return false;
    if (spec.topics.length > 0 && !candidate.topicIds.some((topic) => spec.topics.includes(topic))) return false;
    // A board-voided question is not held: the board awarded its marks to
    // every candidate, so it carries marks and it can be marked.
    if (candidate.voided) return spec.includeAwarded;
    return true;
  });

  let usable = pool;
  // The pool is sorted before the draw, so the paper depends on what the
  // corpus holds and not on the order the pool happened to arrive in. The
  // same specification therefore composes the same paper everywhere.
  usable = [...usable].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  let avoidedSeen = false;
  if (spec.avoidSeen && answered.size > 0) {
    const unseen = pool.filter((candidate) => !answered.has(candidate.id));
    if (unseen.length >= Math.min(requested, pool.length)) {
      usable = unseen;
      avoidedSeen = true;
      const leftOut = pool.length - unseen.length;
      notes.push(`${leftOut} question${leftOut === 1 ? '' : 's'} you have already answered on this device ${leftOut === 1 ? 'was' : 'were'} left out.`);
    } else {
      notes.push(`Only ${unseen.length} of the ${pool.length} matching questions are unanswered on this device, so already-answered questions were kept to fill the mock.`);
    }
  }

  // The share of Category I this mock should carry.
  const categoryIShare = spec.categoryMix === 'paper'
    ? PAPER_CATEGORY_I_SHARE
    : Math.min(1, Math.max(0, spec.categoryIShare));

  // How many questions each subject should contribute.
  const totalShare = subjectKeys.reduce((sum, key) => {
    const entry = PAPER_SUBJECTS.find((subject) => subject.key === key);
    return sum + (entry?.share ?? 0);
  }, 0);
  const quota = new Map<SubjectKey, number>();
  let assigned = 0;
  subjectKeys.forEach((key, index) => {
    const entry = PAPER_SUBJECTS.find((subject) => subject.key === key);
    const share = (entry?.share ?? 0) / (totalShare || 1);
    const count = index === subjectKeys.length - 1
      ? requested - assigned
      : Math.round(requested * share);
    quota.set(key, Math.max(0, count));
    assigned += Math.max(0, count);
  });

  // Take the questions. Each subject is filled with Category I first and
  // Category II second, in the proportion the specification asked for.
  const taken: MockItem[] = [];
  const shortfallBySubject = new Map<SubjectKey, number>();
  const draw = (key: SubjectKey, count: number) => {
    const subjectPool = usable.filter((candidate) => candidate.subjectKey === key);
    const categoryI = subjectPool.filter((candidate) => candidate.category === 'I');
    const categoryII = subjectPool.filter((candidate) => candidate.category === 'II');
    const wantI = Math.min(categoryI.length, Math.round(count * categoryIShare));
    const wantII = Math.min(categoryII.length, count - wantI);
    // Anything the category split could not fill is taken from the other
    // category rather than left out.
    const extraI = Math.min(categoryI.length - wantI, count - wantI - wantII);
    const extraII = Math.min(categoryII.length - wantII, count - wantI - wantII - extraI);
    const takeI = wantI + extraI;
    const takeII = wantII + extraII;
    const seed = hashOf(key);
    const picked = [
      ...shuffled(categoryI, spec.seed + seed).slice(0, takeI),
      ...shuffled(categoryII, spec.seed + seed + 7).slice(0, takeII),
    ];
    shortfallBySubject.set(key, count - picked.length);
    return picked;
  };

  for (const key of subjectKeys) {
    taken.push(...draw(key, quota.get(key) ?? 0));
  }

  // Give any shortfall to a subject that still has questions left.
  let shortfall = taken.length < requested;
  if (shortfall) {
    const used = new Set(taken.map((item) => item.id));
    const spare = usable.filter((candidate) => !used.has(candidate.id));
    const bySubject = new Map<SubjectKey, MockCandidate[]>();
    for (const candidate of spare) {
      const list = bySubject.get(candidate.subjectKey) ?? [];
      list.push(candidate);
      bySubject.set(candidate.subjectKey, list);
    }
    for (const key of subjectKeys) {
      const missing = shortfallBySubject.get(key) ?? 0;
      if (missing <= 0) continue;
      const list = bySubject.get(key);
      if (!list || list.length === 0) continue;
      const take = list.slice(0, missing);
      taken.push(...take);
      shortfallBySubject.set(key, 0);
    }
    shortfall = taken.length < requested;
  }

  // Lay the mock out the way the paper is laid out: subject by subject, and
  // inside a subject the Category I block before the Category II block.
  const order = [...PAPER_SUBJECTS.map((subject) => subject.key), ...subjectKeys]
    .filter((key, index, all) => all.indexOf(key) === index);
  taken.sort((a, b) => {
    const subjectDifference = order.indexOf(a.subjectKey) - order.indexOf(b.subjectKey);
    if (subjectDifference !== 0) return subjectDifference;
    if (a.category !== b.category) return a.category === 'I' ? -1 : 1;
    return a.n - b.n;
  });

  const bySubject: MockSubjectShare[] = subjectKeys.map((key) => {
    const items = taken.filter((item) => item.subjectKey === key);
    const label = subjectLabels[key] ?? key;
    return {
      subjectKey: key,
      label,
      count: items.length,
      marks: items.reduce((sum, item) => sum + item.marks, 0),
      categoryI: items.filter((item) => item.category === 'I').length,
      categoryII: items.filter((item) => item.category === 'II').length,
      available: availableForSubject(candidates, key),
    };
  });

  const yearMap = new Map<number, { count: number; tier: 'official' | 'derived' | null }>();
  for (const item of taken) {
    const entry = yearMap.get(item.year) ?? { count: 0, tier: item.keyTier };
    entry.count += 1;
    yearMap.set(item.year, entry);
  }

  const categoryICount = taken.filter((item) => item.category === 'I').length;
  const awarded = taken.filter((item) => item.voided).length;
  if (awarded > 0) {
    notes.push(`${awarded} question${awarded === 1 ? ' was' : 's were'} voided by the board, so ${awarded === 1 ? 'its' : 'their'} marks go to every candidate.`);
  }
  const derivedYears = [...yearMap.entries()].filter(([, entry]) => entry.tier === 'derived').map(([year]) => year);
  if (derivedYears.length > 0) {
    notes.push(`${derivedYears.join(', ')} ${derivedYears.length === 1 ? 'has' : 'have'} a derived answer key, not a board key: the board published none for ${derivedYears.length === 1 ? 'that year' : 'those years'}.`);
  }
  if (shortfall) {
    notes.push(`The corpus could only supply ${taken.length} of the ${requested} questions asked for. Every question in the mock carries a published key and a complete set of options; nothing was padded.`);
  }

  return {
    items: taken,
    count: taken.length,
    marks: taken.reduce((sum, item) => sum + item.marks, 0),
    requested,
    shortfall: Math.max(0, requested - taken.length),
    bySubject,
    byYear: [...yearMap.entries()].map(([year, entry]) => ({ year, ...entry })).sort((a, b) => a.year - b.year),
    categoryI: categoryICount,
    categoryII: taken.length - categoryICount,
    notes,
    avoidedSeen,
  };
}
