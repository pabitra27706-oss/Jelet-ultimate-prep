/**
 * Coverage over the syllabus topics.
 *
 * The corpus states which subject each question belongs to. The topic map
 * (`src/data/topics.json`, produced by `scripts/build-topics.mjs`) closes the
 * gap between a subject and the 42 topics the 2026 syllabus lists, and it
 * records the terms that produced every link so a reviewer can check the
 * decision without re-running anything.
 *
 * This module reads that map and answers three questions honestly:
 *
 * - What does the corpus cover today?
 * - What does it not cover, and why not?
 * - What would a batch have to add to change the picture?
 *
 * Nothing here claims a topic is "mastered" because questions exist for it.
 * Coverage is a count of questions and years, and it is always published
 * with its own limits.
 */
import topicsData from '../data/topics.json' with { type: 'json' };
import papersData from '../data/papers.json' with { type: 'json' };

export type TopicQuestion = {
  questionId: string;
  paperId: string;
  year: number;
  n: number;
  held: boolean;
  voided: boolean;
  marks: number;
  /** The approved terms that produced this mapping. */
  terms: string[];
};

export type TopicRecord = {
  id: string;
  subjectId: string;
  subjectName: string;
  code: string;
  name: string;
  detail: string;
  questions: TopicQuestion[];
  /** Questions that cover this topic and can be marked. */
  coveredQuestions: number;
  /** The marks that coverage is worth. */
  coveredMarks: number;
  /** How many different papers contribute a markable question. */
  coveredYears: number;
};

export type UnmappedQuestion = {
  questionId: string;
  paperId: string;
  year: number;
  n: number;
  subjectKey: string;
  held: boolean;
  reason: string;
};

export type Conflict = {
  questionId: string;
  paperId: string;
  year: number;
  n: number;
  subjectKey: string;
  candidates: { topicId: string; hits: string[] }[];
  reason: string;
};

export type OutsideSyllabus = {
  questionId: string;
  paperId: string;
  year: number;
  n: number;
  subjectKey: string;
  held: boolean;
  reason: string;
};

export type Coverage = {
  edition: string;
  bulletinDate: string;
  totalTopics: number;
  mappedQuestions: number;
  unmappedQuestions: number;
  /** How many questions two topics claimed equally well. */
  conflictCount: number;
  outsideSyllabusQuestions: number;
  topics: TopicRecord[];
  unmapped: UnmappedQuestion[];
  /** The questions two topics claimed equally well. */
  conflicts: Conflict[];
  outsideSyllabus: OutsideSyllabus[];
};

const data = topicsData as unknown as Coverage;
export const coverage: Coverage = data;
export const topics: TopicRecord[] = coverage.topics;
export const papers = [...papersData.papers].sort((a, b) => b.year - a.year);

/** How a topic's coverage should be described, without overclaiming. */
export type CoverageBand = 'none' | 'thin' | 'moderate' | 'broad';

export type TopicStatus = {
  topic: TopicRecord;
  band: CoverageBand;
  /** Why the topic is where it is, in one line. */
  note: string;
};

/**
 * The band a topic falls into.
 *
 * The thresholds are counts of *markable* questions and of *different
 * papers*. A topic with many questions from one paper is thin, because a
 * learner who has met it once has not met the range.
 */
export function bandFor(topic: TopicRecord): CoverageBand {
  if (topic.coveredQuestions === 0) return 'none';
  if (topic.coveredQuestions >= 8 && topic.coveredYears >= 3) return 'broad';
  if (topic.coveredQuestions >= 4 && topic.coveredYears >= 2) return 'moderate';
  return 'thin';
}

/** The status of every topic, in syllabus order. */
export function topicStatuses(): TopicStatus[] {
  return coverage.topics.map((topic) => {
    const band = bandFor(topic);
    const held = topic.questions.length - topic.coveredQuestions;
    const note = band === 'none'
      ? (held > 0
        ? `No markable question: all ${held} question${held === 1 ? '' : 's'} in the corpus for this topic depend on a diagram the transcription does not reproduce.`
        : 'No question in the corpus maps to this topic.')
      : `${topic.coveredQuestions} markable question${topic.coveredQuestions === 1 ? '' : 's'} across ${topic.coveredYears} paper${topic.coveredYears === 1 ? '' : 's'}.`
        + (held > 0 ? ` ${held} more are held.` : '');
    return { topic, band, note };
  });
}

/** The subjects of the syllabus, with their topic counts. */
export type SubjectCoverage = {
  id: string;
  name: string;
  topics: number;
  covered: number;
  broad: number;
  moderate: number;
  thin: number;
  none: number;
  questions: number;
  marks: number;
};

export function subjectCoverage(): SubjectCoverage[] {
  const order: string[] = [];
  const map = new Map<string, SubjectCoverage>();
  for (const status of topicStatuses()) {
    const topic = status.topic;
    if (!map.has(topic.subjectId)) {
      order.push(topic.subjectId);
      map.set(topic.subjectId, {
        id: topic.subjectId,
        name: topic.subjectName,
        topics: 0,
        covered: 0,
        broad: 0,
        moderate: 0,
        thin: 0,
        none: 0,
        questions: 0,
        marks: 0,
      });
    }
    const record = map.get(topic.subjectId)!;
    record.topics += 1;
    record.questions += topic.coveredQuestions;
    record.marks += topic.coveredMarks;
    if (status.band === 'none') record.none += 1;
    else record.covered += 1;
    if (status.band === 'broad') record.broad += 1;
    else if (status.band === 'moderate') record.moderate += 1;
    else record.thin += 1;
  }
  return order.map((id) => map.get(id)!);
}

/**
 * The questions a reviewer should look at next.
 *
 * The queue is ordered by what is most useful to a reviewer:
 *
 * 1. A question that two topics matched equally well. It has no mapping and
 *    a human has to decide.
 * 2. A question in a subject the syllabus has, with no term that matched.
 *    It may belong to a topic that needs a better term list.
 * 3. A topic with no markable coverage at all.
 */
export type ReviewItem = {
  kind: 'conflict' | 'unmapped' | 'uncovered-topic';
  /** What the reviewer has to settle. */
  subject: string;
  /** The question or topic it concerns. */
  reference: string;
  detail: string;
  /** Where the reviewer would go to look. */
  link: string;
};

export function reviewQueue(): ReviewItem[] {
  const items: ReviewItem[] = [];
  const base = '/';

  for (const conflict of coverage.conflicts) {
    const question = findQuestion(conflict.questionId);
    items.push({
      kind: 'conflict',
      subject: conflict.subjectKey,
      reference: `${conflict.paperId} Q${conflict.n}`,
      detail: `${conflict.candidates.map((entry) => entry.topicId).join(' or ')} — matched on ${conflict.candidates[0].hits.join(', ')}.`
        + (question ? ` ${question}` : ''),
      link: `${base}library/${conflict.paperId}/#q${conflict.n}`,
    });
  }

  for (const topic of coverage.topics.filter((entry) => entry.coveredQuestions === 0)) {
    items.push({
      kind: 'uncovered-topic',
      subject: topic.subjectId,
      reference: `${topic.code} · ${topic.name}`,
      detail: topic.questions.length > 0
        ? `Every question the corpus holds for this topic is held (${topic.questions.length}). ${topic.detail}`
        : `No question in the corpus maps here. ${topic.detail}`,
      link: `${base}coverage/`,
    });
  }

  for (const unmapped of coverage.unmapped) {
    const question = findQuestion(unmapped.questionId);
    items.push({
      kind: 'unmapped',
      subject: unmapped.subjectKey,
      reference: `${unmapped.paperId} Q${unmapped.n}`,
      detail: unmapped.reason + (question ? ` ${question}` : ''),
      link: `${base}library/${unmapped.paperId}/#q${unmapped.n}`,
    });
  }

  return items;
}

/** A short preview of a question's stem, for the review queue. */
function findQuestion(questionId: string): string | null {
  for (const paper of papers) {
    for (const question of paper.questions) {
      if (question.id === questionId) {
        return question.stem.replace(/\s+/g, ' ').slice(0, 110);
      }
    }
  }
  return null;
}

/**
 * What a batch would change.
 *
 * The figure is a count of *new* markable questions for a topic, not a
 * prediction of a score or a claim that the topic is now mastered. A batch
 * that adds one question to a broad topic changes little; a batch that adds
 * a first question to an uncovered topic changes that topic's band.
 */
export type BatchEffect = {
  topicId: string;
  topicName: string;
  subjectId: string;
  /** The band the topic is in now. */
  bandBefore: CoverageBand;
  /** The band it would be in with the new questions. */
  bandAfter: CoverageBand;
  questionsBefore: number;
  questionsAfter: number;
  /** Whether the band actually changes. */
  changes: boolean;
};

/** The effect of adding questions to one topic. */
export function batchEffect(topicId: string, added: { count: number; newPapers: number }): BatchEffect | null {
  const topic = coverage.topics.find((entry) => entry.id === topicId);
  if (!topic) return null;
  const bandBefore = bandFor(topic);
  const questionsAfter = topic.coveredQuestions + added.count;
  const yearsAfter = topic.coveredYears + added.newPapers;
  const bandAfter: CoverageBand = questionsAfter === 0
    ? 'none'
    : questionsAfter >= 8 && yearsAfter >= 3
      ? 'broad'
      : questionsAfter >= 4 && yearsAfter >= 2
        ? 'moderate'
        : 'thin';
  return {
    topicId,
    topicName: topic.name,
    subjectId: topic.subjectId,
    bandBefore,
    bandAfter,
    questionsBefore: topic.coveredQuestions,
    questionsAfter,
    changes: bandAfter !== bandBefore,
  };
}

/** The overall shape of the coverage, for the dashboard's headline. */
export type CoverageSummary = {
  topics: number;
  covered: number;
  broad: number;
  moderate: number;
  thin: number;
  none: number;
  markableQuestions: number;
  mappedQuestions: number;
  unmappedQuestions: number;
  conflicts: number;
  outsideSyllabusQuestions: number;
  /** The share of topics with markable coverage, as a percentage. */
  topicCoverage: number;
};

export function coverageSummary(): CoverageSummary {
  const statuses = topicStatuses();
  const markableQuestions = coverage.topics.reduce((sum, topic) => sum + topic.coveredQuestions, 0);
  const covered = statuses.filter((status) => status.band !== 'none').length;
  return {
    topics: statuses.length,
    covered,
    broad: statuses.filter((status) => status.band === 'broad').length,
    moderate: statuses.filter((status) => status.band === 'moderate').length,
    thin: statuses.filter((status) => status.band === 'thin').length,
    none: statuses.filter((status) => status.band === 'none').length,
    markableQuestions,
    mappedQuestions: coverage.mappedQuestions,
    unmappedQuestions: coverage.unmappedQuestions,
    conflicts: coverage.conflictCount,
    outsideSyllabusQuestions: coverage.outsideSyllabusQuestions,
    topicCoverage: statuses.length > 0 ? Math.round((covered / statuses.length) * 100) : 0,
  };
}

/** A readable label for a band. */
export function bandLabel(band: CoverageBand): string {
  return {
    none: 'Not covered',
    thin: 'Thin',
    moderate: 'Moderate',
    broad: 'Broad',
  }[band];
}
