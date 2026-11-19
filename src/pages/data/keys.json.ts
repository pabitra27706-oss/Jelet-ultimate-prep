import type { APIRoute } from 'astro';
import { keys, papers } from '../../lib/content';

/**
 * The published answer keys, keyed by question id.
 *
 * The runner fetches this only when the learner submits, so the answer is not
 * part of the page they practise from. It is a public file: the same keys are
 * published in the paper library, and every entry carries its tier so a
 * derived answer is never presented as a board key.
 */
export const GET: APIRoute = () => {
  const map: Record<string, { key: string[]; tier: string; voided: boolean; reasoning?: string }> = {};
  for (const key of keys) {
    if (!key.hasPaper) continue;
    const paper = papers.find((entry) => entry.year === key.year);
    if (!paper) continue;
    for (const question of paper.questions) {
      const answer = key.answers[String(question.n)];
      if (!answer) continue;
      const letters = answer.split('').filter((letter) => 'ABCD'.includes(letter));
      map[question.id] = {
        key: letters,
        tier: key.tier,
        voided: key.voided.includes(question.n),
        reasoning: key.reasoning?.[String(question.n)],
      };
    }
  }
  return new Response(JSON.stringify({ schema: 1, keys: map }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
