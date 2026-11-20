#!/usr/bin/env node
/**
 * Map the corpus onto the syllabus topics.
 *
 * The syllabus states 42 topics across four subjects. The corpus states
 * which subject each question belongs to, but not which topic. This script
 * closes that gap with an explicit, reviewable mapping.
 *
 * The rules are deliberately simple and mechanical:
 *
 * - Each topic owns a list of *terms*. A term is a word or a phrase that
 *   appears in the topic's own syllabus detail, or in a synonym list that a
 *   reviewer has approved for it.
 * - A question matches a topic when its stem or options contain a term.
 * - The topic with the most distinct term hits wins. A tie is *not* broken
 *   by guesswork: the question is left unmapped and listed for review.
 * - Every mapping records which terms matched, so a reviewer can check the
 *   decision without re-running anything.
 *
 * The output is `src/data/topics.json`: per topic, the questions that cover
 * it, the questions that map to it but are held, and the questions that were
 * considered and rejected. Nothing here invents a link — every link carries
 * the terms that produced it.
 *
 * Usage: node scripts/build-topics.mjs [--check]
 *   --check  regenerate in memory and fail if the committed file differs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { mapCorpus } from './topic-mapping.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const papersPath = join(root, 'src/data/papers.json');
const syllabusPath = join(root, 'src/data/syllabus.json');
const output = join(root, 'src/data/topics.json');
const check = process.argv.includes('--check');

/**
 * The approved terms for each topic.
 *
 * The first list is taken from the syllabus detail itself: each phrase there
 * is a term. The second list is the approved synonyms, added by a reviewer
 * because the syllabus wording and the question wording differ.
 */
import { TERMS } from './topic-terms.mjs';

const papers = JSON.parse(await readFile(papersPath, 'utf8')).papers;
const syllabus = JSON.parse(await readFile(syllabusPath, 'utf8')).syllabus;

const mapped = mapCorpus({ papers, syllabus, terms: TERMS });

const topicRecords = mapped.topics.map((topic) => ({
  ...topic,
  questions: topic.questions
    .sort((a, b) => a.year - b.year || a.n - b.n)
    .map((entry) => ({
      questionId: entry.questionId,
      paperId: entry.paperId,
      year: entry.year,
      n: entry.n,
      held: entry.held,
      voided: entry.voided,
      marks: entry.marks,
      terms: entry.hits,
    })),
}));

const result = {
  schema: 1,
  edition: mapped.edition,
  bulletinDate: mapped.bulletinDate,
  totalTopics: mapped.totalTopics,
  mappedQuestions: mapped.mappedQuestions,
  unmappedQuestions: mapped.unmappedQuestions,
  conflictCount: mapped.conflictCount,
  outsideSyllabusQuestions: mapped.outsideSyllabusQuestions,
  topics: topicRecords,
  unmapped: mapped.unmapped,
  conflicts: mapped.conflicts,
  outsideSyllabus: mapped.outsideSyllabus,
};

const text = `${JSON.stringify(result, null, 2)}\n`;
if (check) {
  const current = await readFile(output, 'utf8').catch(() => '');
  if (current !== text) {
    console.error('[topics] the committed file differs from a fresh build');
    process.exit(1);
  }
  console.log('[topics] the committed file matches a fresh build');
} else {
  await writeFile(output, text);
  const coveredTopics = topicRecords.filter((topic) => topic.coveredQuestions > 0);
  console.log(`[topics] wrote src/data/topics.json — ${mapped.mappedQuestions} questions mapped, ${mapped.unmappedQuestions} unmapped, ${mapped.conflictCount} conflicts, ${mapped.outsideSyllabusQuestions} outside the syllabus`);
  console.log(`         ${coveredTopics.length} of ${mapped.totalTopics} topics have markable coverage`);
  for (const subject of syllabus.subjects) {
    const own = topicRecords.filter((topic) => topic.subjectId === subject.id);
    const withCoverage = own.filter((topic) => topic.coveredQuestions > 0);
    console.log(`         ${subject.id}: ${withCoverage.length}/${own.length} topics covered`);
  }
}
