import type { APIRoute } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Question from '../../../components/Question.astro';
import { papers } from '../../../lib/content';
import { PAPER_SUBJECTS } from '../../../lib/mock';
import { buildCandidates } from '../../../lib/mock-pool';
import type { SubjectKey } from '../../../lib/subjects';

/**
 * The candidate pool for one subject, rendered and ready to sit.
 *
 * A composed mock is assembled in the browser, so the questions it might
 * draw have to reach the browser. They are rendered here, at build time, by
 * the same component that renders a paper: the maths is typeset on the
 * server, exactly as it is everywhere else on this site, so a phone
 * downloads plain HTML and CSS rather than a maths library.
 *
 * The pool is published per subject, so a mock that only asks for physics
 * never downloads the mathematics.
 */
export function getStaticPaths() {
  return PAPER_SUBJECTS.map((subject) => ({ params: { subject: subject.key } }));
}

export const GET: APIRoute = async ({ params }) => {
  const subjectKey = params.subject as SubjectKey;
  if (!PAPER_SUBJECTS.some((subject) => subject.key === subjectKey)) {
    return new Response(JSON.stringify({ schema: 1, subject: subjectKey, items: [] }), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const candidates = buildCandidates().filter((candidate) => candidate.subjectKey === subjectKey);
  const byId = new Map(papers.flatMap((paper) => paper.questions.map((question) => [question.id, question] as const)));
  const container = await AstroContainer.create();

  const items = [];
  for (const candidate of candidates) {
    const question = byId.get(candidate.id);
    if (!question) continue;
    const html = await container.renderToString(Question, {
      props: { question, mode: 'runner', headingLevel: 'h2', anchor: `q-${question.id}` },
    });
    items.push({
      id: candidate.id,
      n: candidate.n,
      paperId: candidate.paperId,
      year: candidate.year,
      subjectKey: candidate.subjectKey,
      subject: candidate.subject,
      category: candidate.category,
      marks: candidate.marks,
      voided: candidate.voided,
      topicIds: candidate.topicIds,
      keyTier: candidate.keyTier,
      html,
    });
  }

  return new Response(JSON.stringify({ schema: 1, subject: subjectKey, items }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
