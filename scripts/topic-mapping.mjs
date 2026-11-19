/**
 * The mapping rules, on their own.
 *
 * `build-topics.mjs` writes the map; this module decides what goes in it.
 * Keeping the two apart means the rules can be exercised against different
 * term lists without writing files, which is what the coverage-delta search
 * needs.
 *
 * The rules are deliberately simple and mechanical:
 *
 * - Each topic owns a list of terms: the phrases in its own syllabus detail,
 *   plus the synonyms a reviewer has approved for it.
 * - A question matches a topic when its stem or options contain a term as a
 *   whole word or phrase.
 * - A term that is too common to be evidence on its own only counts inside
 *   a longer phrase.
 * - The topic with the most distinct term hits wins. A tie is *not* broken
 *   by guesswork: the question is left unmapped and listed for review.
 * - Every mapping records which terms matched, so a reviewer can check the
 *   decision without re-running anything.
 */

/** Words that are too common to be evidence of a topic on their own. */
export const WEAK_TERMS = new Set([
  'force', 'energy', 'work', 'unit', 'power', 'current', 'voltage', 'mass', 'temperature',
  'measurement', 'function', 'frequency', 'phase', 'efficiency', 'symbol', 'symbols',
  'ratio', 'effect', 'value', 'change', 'number', 'condition', 'increase', 'decrease',
]);

/** Terms that are only evidence when they appear in a longer phrase. */
export const PHRASE_ONLY = new Set([
  'unit', 'image formation', 'equilibrium', 'structure of', 'error in measurement',
  'frequency', 'phase', 'efficiency', 'symbol', 'symbols', 'ratio', 'value', 'change',
]);

export const normalise = (text) => text
  .toLowerCase()
  .replace(/[’‘]/g, "'")
  .replace(/[^a-z0-9' +\-/]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

/**
 * Whether a term appears in the text as a whole word or phrase.
 *
 * A plain substring test would match "integral" inside "particular
 * integral", so the boundaries are checked explicitly.
 */
export function matches(text, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`);
  return pattern.test(text);
}

/** The text a topic's terms are matched against. */
export const questionText = (question) => normalise([
  question.stem,
  ...question.options.map((option) => option.text),
].join(' '));

/**
 * The distinctive terms of one topic, with the syllabus phrases included.
 *
 * The syllabus detail is split on commas and semicolons into phrases.
 */
export function termsFor(topic, detail, terms) {
  const own = [];
  for (const part of detail.split(/[,;]/)) {
    const cleaned = normalise(part).replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleaned.length >= 4 && !cleaned.includes('statement')) own.push(cleaned);
  }
  const synonyms = (terms[topic.id]?.synonyms ?? []).map(normalise);
  return { own, synonyms };
}

/** The syllabus topics, flattened. */
export function flattenTopics(syllabus) {
  const topics = [];
  for (const subject of syllabus.subjects) {
    for (const topic of subject.topics) {
      topics.push({
        id: topic.id,
        subjectId: subject.id,
        subjectName: subject.name,
        code: topic.code,
        name: topic.name,
        detail: topic.detail,
      });
    }
  }
  return topics;
}

/**
 * Map the corpus onto the topics.
 *
 * Returns the same shape `src/data/topics.json` has, so the writer and the
 * tests can both use it.
 */
export function mapCorpus({ papers, syllabus, terms }) {
  const topics = flattenTopics(syllabus);

  // The subject of a question is known from the transcript. A topic can only
  // be matched inside its own subject, so a mechanics word never claims a
  // chemistry question.
  const topicsBySubject = new Map();
  for (const topic of topics) {
    const list = topicsBySubject.get(topic.subjectId) ?? [];
    list.push(topic);
    topicsBySubject.set(topic.subjectId, list);
  }

  const covered = new Map();
  const unmapped = [];
  const conflicts = [];
  /**
   * Questions whose subject the 2026 syllabus does not have.
   *
   * The 2017, 2018, 2019 and 2021 papers each carried a Fundamentals of
   * Computers section that the 2026 syllabus no longer lists. Those
   * questions are recorded here rather than left to look like a mapping
   * failure: they are outside the syllabus, not missing from it.
   */
  const outsideSyllabus = [];

  for (const paper of papers) {
    for (const question of paper.questions) {
      const text = questionText(question);
      const candidates = topicsBySubject.get(question.subjectKey) ?? [];
      if (candidates.length === 0) {
        outsideSyllabus.push({
          questionId: question.id,
          paperId: paper.id,
          year: paper.year,
          n: question.n,
          subjectKey: question.subjectKey,
          held: !question.scorable && !question.boardAwarded,
          reason: `the 2026 syllabus has no ${question.subjectKey} subject`,
        });
        continue;
      }
      const scored = [];
      for (const topic of candidates) {
        const { own, synonyms } = termsFor(topic, topic.detail, terms);
        const hits = [];
        for (const term of [...own, ...synonyms]) {
          if (term.length < 4) continue;
          if (PHRASE_ONLY.has(term)) continue;
          if (WEAK_TERMS.has(term) && !term.includes(' ')) continue;
          if (matches(text, term)) hits.push(term);
        }
        if (hits.length > 0) {
          // A specific phrase is stronger evidence than a common word: a
          // question about "particular integral" is an ODE question, not an
          // integration question.
          const weight = hits.reduce((sum, term) => sum + term.length, 0);
          scored.push({ topic, hits: [...new Set(hits)], weight });
        }
      }
      if (scored.length === 0) {
        unmapped.push({
          questionId: question.id,
          paperId: paper.id,
          year: paper.year,
          n: question.n,
          subjectKey: question.subjectKey,
          held: !question.scorable && !question.boardAwarded,
          reason: 'no approved term for this question matched a topic in its subject',
        });
        continue;
      }
      scored.sort((a, b) => b.weight - a.weight);
      const best = scored[0];
      const tied = scored.filter((entry) => entry.weight === best.weight);
      if (tied.length > 1) {
        // A tie is not resolved by guesswork. The question goes to review.
        conflicts.push({
          questionId: question.id,
          paperId: paper.id,
          year: paper.year,
          n: question.n,
          subjectKey: question.subjectKey,
          candidates: tied.map((entry) => ({ topicId: entry.topic.id, hits: entry.hits })),
          reason: 'two or more topics matched equally well, so no mapping was made',
        });
        unmapped.push({
          questionId: question.id,
          paperId: paper.id,
          year: paper.year,
          n: question.n,
          subjectKey: question.subjectKey,
          held: !question.scorable && !question.boardAwarded,
          reason: 'two or more topics matched equally well, so no mapping was made',
        });
        continue;
      }
      covered.set(question.id, {
        questionId: question.id,
        paperId: paper.id,
        year: paper.year,
        n: question.n,
        subjectKey: question.subjectKey,
        topicId: best.topic.id,
        hits: best.hits,
        held: !question.scorable && !question.boardAwarded,
        voided: Boolean(question.boardAwarded),
        marks: question.marks,
      });
    }
  }

  const topicRecords = topics.map((topic) => {
    const questions = [...covered.values()].filter((entry) => entry.topicId === topic.id);
    const markable = questions.filter((entry) => !entry.held);
    const years = new Set(markable.map((entry) => entry.year));
    return {
      id: topic.id,
      subjectId: topic.subjectId,
      subjectName: topic.subjectName,
      code: topic.code,
      name: topic.name,
      detail: topic.detail,
      questions,
      coveredQuestions: markable.length,
      coveredMarks: markable.reduce((sum, entry) => sum + entry.marks, 0),
      coveredYears: years.size,
    };
  });

  const coveredTopics = topicRecords.filter((topic) => topic.coveredQuestions > 0).length;

  return {
    edition: syllabus.edition,
    bulletinDate: syllabus.bulletinDate,
    totalTopics: topics.length,
    mappedQuestions: covered.size,
    unmappedQuestions: unmapped.length,
    conflictCount: conflicts.length,
    outsideSyllabusQuestions: outsideSyllabus.length,
    topics: topicRecords,
    unmapped,
    conflicts,
    outsideSyllabus,
    coveredTopics,
  };
}
