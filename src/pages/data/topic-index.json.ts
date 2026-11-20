import type { APIRoute } from 'astro';
import { syllabusSubjects, topicsOfSubject } from '../../lib/topics.ts';
import { buildCandidates, topicsByQuestion } from '../../lib/mock-pool.ts';
import type { SubjectKey } from '../../lib/subjects.ts';

/**
 * Which topic each markable question belongs to.
 *
 * The revision desk and the plan need this to say where a learner's mistakes
 * concentrate, and they need it in the browser, so it is published as a small
 * file rather than recomputed from the whole corpus on every page.
 *
 * It is an index, not a copy: it holds ids and names, no question text.
 */
export const GET: APIRoute = () => {
  const topics: Record<string, { id: string; name: string; subjectKey: SubjectKey; subjectName: string }> = {};
  for (const group of syllabusSubjects) {
    for (const topic of topicsOfSubject(group.id as SubjectKey)) {
      topics[topic.id] = { id: topic.id, name: topic.name, subjectKey: topic.subject, subjectName: topic.subjectName };
    }
  }

  const mapped = topicsByQuestion();
  const questions: Record<string, string[]> = {};
  for (const candidate of buildCandidates()) {
    const ids = mapped.get(candidate.id) ?? [];
    if (ids.length === 0) continue;
    questions[candidate.id] = ids;
  }

  return new Response(JSON.stringify({ schema: 1, topics, questions }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
