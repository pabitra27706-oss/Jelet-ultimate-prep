/**
 * The candidate pool for a composed mock.
 *
 * A mock may only use questions the archive preserves and the board keyed, so
 * the pool is built from the corpus rather than assembled by hand. This module
 * is server-side: it reads the corpus, so it never reaches a browser bundle.
 * The browser receives the pool as a published file instead.
 */
import topicsData from '../data/topics.json' with { type: 'json' };
import { papers, type Paper } from './content.ts';
import type { MockCandidate } from './mock.ts';
import type { SubjectKey } from './subjects.ts';

type TopicMap = { id: string; subjectId: string; questions: { questionId: string }[] }[];

const topicMap = (topicsData as { topics?: TopicMap }).topics ?? [];

/**
 * Which topics each question was mapped to.
 *
 * A question that was not mapped simply has no topics. It is still a
 * candidate: the topic filter narrows the draw when the learner asks for a
 * topic, and never removes a question from the corpus as a whole.
 */
export function topicsByQuestion(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const topic of topicMap) {
    for (const entry of topic.questions) {
      const list = map.get(entry.questionId) ?? [];
      list.push(topic.id);
      map.set(entry.questionId, list);
    }
  }
  for (const list of map.values()) list.sort();
  return map;
}

/**
 * The topics of the syllabus, with the number of markable questions each one
 * can offer. This is what the builder shows the learner.
 */
export function topicCatalogue(): { id: string; subjectId: SubjectKey; name: string; code: string; available: number }[] {
  const counts = new Map<string, number>();
  for (const candidate of buildCandidates()) {
    for (const topicId of candidate.topicIds) counts.set(topicId, (counts.get(topicId) ?? 0) + 1);
  }
  return topicMap
    .map((topic) => ({
      id: topic.id,
      subjectId: topic.subjectId as SubjectKey,
      name: (topic as { name?: string }).name ?? topic.id,
      code: (topic as { code?: string }).code ?? '',
      available: counts.get(topic.id) ?? 0,
    }))
    .sort((a, b) => (a.subjectId === b.subjectId ? a.id.localeCompare(b.id) : a.subjectId.localeCompare(b.subjectId)));
}

/**
 * Every question a mock is allowed to draw.
 *
 * A candidate must carry a published key and a complete set of options,
 * because only those can be marked. A question the board voided counts: the
 * board awarded its marks to every candidate, so it carries marks and it can
 * be shown.
 */
export function buildCandidates(source: Paper[] = papers): MockCandidate[] {
  const topics = topicsByQuestion();
  const candidates: MockCandidate[] = [];
  for (const paper of source) {
    for (const question of paper.questions) {
      const markable = question.scorable || question.boardAwarded;
      if (!markable) continue;
      if (!question.optionsComplete || question.options.length !== 4) continue;
      candidates.push({
        id: question.id,
        n: question.n,
        paperId: paper.id,
        year: paper.year,
        subjectKey: question.subjectKey,
        subject: question.subject,
        category: question.category,
        marks: question.marks,
        voided: question.boardAwarded,
        topicIds: topics.get(question.id) ?? [],
        keyTier: paper.keyTier,
      });
    }
  }
  return candidates;
}
