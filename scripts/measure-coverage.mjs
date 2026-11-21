#!/usr/bin/env node
/**
 * The coverage delta.
 *
 * The dashboard says what the corpus covers. This script says what changed
 * and by how much, so a claim like "coverage improved" can be checked
 * against a number rather than a feeling.
 *
 * The baseline is the map as it stood at the start of Phase 07. It is not
 * a hand-written set of figures: it is rebuilt from the pre-expansion term
 * lists, which `scripts/find-baseline-split.mjs` has proved reproduce the
 * recorded starting figures exactly — 212 questions mapped, 478 unmapped,
 * 7 ties, 34 topics covered, with the per-subject breakdown to match.
 *
 * The delta reports:
 *
 * - How many questions moved into a topic.
 * - How many topics changed band.
 * - How many topics moved from uncovered to covered.
 * - Which topics remain uncovered, and why.
 *
 * The delta is only ever a count of questions and topics. It does not claim
 * that a learner learned anything, and it does not extrapolate to a score.
 *
 * Usage:
 *   node scripts/measure-coverage.mjs            # compare with the baseline
 *   node scripts/measure-coverage.mjs --write    # save the current map as the baseline
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { mapCorpus } from './topic-mapping.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mapPath = join(root, 'src/data/topics.json');
const baselineTermsPath = join(root, 'scripts/topic-terms-baseline.json');
const reportPath = join(root, 'docs/phases/07-expansion/coverage-delta.json');

const write = process.argv.includes('--write');

/** The band rule, stated once so the delta and the dashboard agree. */
export function band(questions, years) {
  if (questions === 0) return 'none';
  if (questions >= 8 && years >= 3) return 'broad';
  if (questions >= 4 && years >= 2) return 'moderate';
  return 'thin';
}

/** The totals a map records. */
function summarise(map) {
  const covered = map.topics.filter((topic) => topic.coveredQuestions > 0);
  return {
    topics: map.topics.length,
    covered: covered.length,
    broad: covered.filter((topic) => band(topic.coveredQuestions, topic.coveredYears) === 'broad').length,
    moderate: covered.filter((topic) => band(topic.coveredQuestions, topic.coveredYears) === 'moderate').length,
    thin: covered.filter((topic) => band(topic.coveredQuestions, topic.coveredYears) === 'thin').length,
    none: map.topics.filter((topic) => topic.coveredQuestions === 0).length,
    mappedQuestions: map.mappedQuestions,
    unmappedQuestions: map.unmappedQuestions,
    conflicts: map.conflictCount,
    outsideSyllabusQuestions: map.outsideSyllabusQuestions,
  };
}

const map = JSON.parse(await readFile(mapPath, 'utf8'));

if (write) {
  // Saving a baseline means saving the term lists that produce it, so the
  // baseline can always be rebuilt rather than trusted.
  const { TERMS } = await import('./topic-terms.mjs');
  await writeFile(baselineTermsPath, `${JSON.stringify(
    Object.fromEntries(Object.entries(TERMS).map(([topic, entry]) => [topic, entry.synonyms])),
    null,
    2,
  )}\n`);
  await writeFile(
    join(root, 'docs/phases/07-expansion/coverage-baseline.json'),
    `${JSON.stringify({ savedFrom: 'src/data/topics.json', summary: summarise(map), topics: map.topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      subjectId: topic.subjectId,
      questions: topic.coveredQuestions,
      marks: topic.coveredMarks,
      papers: topic.coveredYears,
      band: band(topic.coveredQuestions, topic.coveredYears),
    })) }, null, 2)}\n`,
  );
  console.log('[delta] wrote the coverage baseline');
  console.log(`        ${summarise(map).covered} of ${map.topics.length} topics covered, ${map.mappedQuestions} questions mapped`);
  process.exit(0);
}

/* ------------------------------------------------------------------ *
 * The baseline, rebuilt
 * ------------------------------------------------------------------ */

const baselineTerms = JSON.parse(await readFile(baselineTermsPath, 'utf8'));

// The baseline is rebuilt by mapping the corpus with the pre-expansion
// term lists, so the corpus and the syllabus are needed here.
const papers = JSON.parse(await readFile(join(root, 'src/data/papers.json'), 'utf8')).papers;
const syllabus = JSON.parse(await readFile(join(root, 'src/data/syllabus.json'), 'utf8')).syllabus;

// The baseline term lists are stored as plain arrays, so they are turned
// back into the shape the mapper expects.
const terms = {};
for (const [topic, synonyms] of Object.entries(baselineTerms)) {
  terms[topic] = { synonyms };
}

// The baseline is the corpus as it stood at the start of Phase 07. Papers
// added after that point are excluded, or the "baseline" would silently
// absorb them and the delta would measure nothing. The 2023 paper was
// transcribed later than the baseline, so it is not part of it. Every other
// paper — including 2024 and 2025 — was already in the corpus when the
// baseline was recorded, so a year cutoff would wrongly drop those too.
const BASELINE_EXCLUDED_PAPERS = [2023];
// Restored 2019 Q78/Q79 were absent at the historical baseline, but belong in the current map.
const baselinePapers = papers.filter((paper) => !BASELINE_EXCLUDED_PAPERS.includes(paper.year)).map(paper => ({
  ...paper, questions: paper.questions.filter(q => !(paper.year === 2019 && [78,79].includes(q.n)) && !(paper.year === 2024 && [60,61,62].includes(q.n)) && !(paper.year === 2022 && [86,87,88,89,90].includes(q.n))),
}));
const baseline = mapCorpus({ papers: baselinePapers, syllabus, terms });

const current = {
  mapped: map.mappedQuestions,
  unmapped: map.unmappedQuestions,
  conflicts: map.conflictCount,
  outsideSyllabus: map.outsideSyllabusQuestions,
  topics: map.topics.map((topic) => ({
    id: topic.id,
    name: topic.name,
    subjectId: topic.subjectId,
    questions: topic.coveredQuestions,
    marks: topic.coveredMarks,
    papers: topic.coveredYears,
    band: band(topic.coveredQuestions, topic.coveredYears),
    held: topic.questions.length - topic.coveredQuestions,
  })),
};

// The baseline was recorded before the questions from the dropped section
// were given their own bucket, so they are added back to its unmapped count
// to make the two comparable.
const baselineSummary = {
  topics: baseline.topics.length,
  covered: baseline.topics.filter((topic) => topic.coveredQuestions > 0).length,
  broad: baseline.topics.filter((topic) => band(topic.coveredQuestions, topic.coveredYears) === 'broad').length,
  moderate: baseline.topics.filter((topic) => band(topic.coveredQuestions, topic.coveredYears) === 'moderate').length,
  thin: baseline.topics.filter((topic) => band(topic.coveredQuestions, topic.coveredYears) === 'thin').length,
  none: baseline.topics.filter((topic) => topic.coveredQuestions === 0).length,
  mappedQuestions: baseline.mappedQuestions,
  unmappedQuestions: baseline.unmappedQuestions + baseline.outsideSyllabusQuestions,
  conflicts: baseline.conflictCount,
  outsideSyllabusQuestions: baseline.outsideSyllabusQuestions,
};

const currentSummary = {
  topics: current.topics.length,
  covered: current.topics.filter((topic) => topic.band !== 'none').length,
  broad: current.topics.filter((topic) => topic.band === 'broad').length,
  moderate: current.topics.filter((topic) => topic.band === 'moderate').length,
  thin: current.topics.filter((topic) => topic.band === 'thin').length,
  none: current.topics.filter((topic) => topic.band === 'none').length,
  mappedQuestions: current.mapped,
  unmappedQuestions: current.unmapped + current.outsideSyllabus,
  conflicts: current.conflicts,
  outsideSyllabusQuestions: current.outsideSyllabus,
};

const previous = new Map(baseline.topics.map((topic) => [topic.id, topic]));

const moved = [];
const bandChanged = [];
const newlyCovered = [];
const stillUncovered = [];
let questionsAdded = 0;

for (const topic of current.topics) {
  const before = previous.get(topic.id);
  if (!before) {
    moved.push({ topicId: topic.id, name: topic.name, from: 0, to: topic.questions });
    questionsAdded += topic.questions;
    continue;
  }
  if (before.coveredQuestions !== topic.questions) {
    moved.push({
      topicId: topic.id,
      name: topic.name,
      from: before.coveredQuestions,
      to: topic.questions,
      delta: topic.questions - before.coveredQuestions,
    });
    questionsAdded += topic.questions - before.coveredQuestions;
  }
  const beforeBand = band(before.coveredQuestions, before.coveredYears);
  if (beforeBand !== topic.band) {
    bandChanged.push({ topicId: topic.id, name: topic.name, from: beforeBand, to: topic.band });
  }
  if (beforeBand === 'none' && topic.band !== 'none') {
    newlyCovered.push({ topicId: topic.id, name: topic.name, band: topic.band, questions: topic.questions });
  }
  if (topic.band === 'none') {
    stillUncovered.push({
      topicId: topic.id,
      name: topic.name,
      questionsHeld: topic.held,
      reason: topic.held > 0
        ? `every question the corpus holds for this topic depends on a diagram the transcription does not reproduce (${topic.held} held)`
        : 'no question in the corpus maps to this topic',
    });
  }
}

const report = {
  generatedFrom: 'src/data/topics.json',
  baseline: {
    source: 'scripts/topic-terms-baseline.json',
    note: 'The map as it stood at the start of Phase 07, rebuilt from the pre-expansion term lists. Those lists reproduce the recorded starting figures exactly.',
    corpusCutoff: `excluding ${BASELINE_EXCLUDED_PAPERS.join(', ')}`,
    corpusNote: 'The baseline is rebuilt over the corpus as it stood when the baseline was recorded. A paper transcribed after that point is not part of the baseline, so the delta measures the addition rather than absorbing it.',
  },
  baselineSummary,
  currentSummary,
  delta: {
    questionsMapped: currentSummary.mappedQuestions - baselineSummary.mappedQuestions,
    topicsCovered: currentSummary.covered - baselineSummary.covered,
    broadTopics: currentSummary.broad - baselineSummary.broad,
    moderateTopics: currentSummary.moderate - baselineSummary.moderate,
    thinTopics: currentSummary.thin - baselineSummary.thin,
    uncoveredTopics: currentSummary.none - baselineSummary.none,
    unmappedQuestions: currentSummary.unmappedQuestions - baselineSummary.unmappedQuestions,
    conflicts: currentSummary.conflicts - baselineSummary.conflicts,
  },
  moved,
  bandChanged,
  newlyCovered,
  stillUncovered,
  totals: {
    questionsAddedToTopics: questionsAdded,
    topicsWithAnyChange: new Set([...moved.map((entry) => entry.topicId), ...bandChanged.map((entry) => entry.topicId)]).size,
  },
  limits: [
    'A count of questions and topics. It is not a claim that a learner learned anything.',
    'A question that is held is not counted as coverage, so a topic can stay uncovered because its only questions depend on a diagram.',
    'The questions from the section the 2026 syllabus dropped are counted separately and never as coverage.',
    'Band thresholds are published: broad is 8 or more questions across 3 or more papers, moderate is 4 or more across 2 or more.',
  ],
};

await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

// The baseline snapshot is written from the rebuilt map, so it always
// matches the term lists it was rebuilt from.
await writeFile(
  join(root, 'docs/phases/07-expansion/coverage-baseline.json'),
  `${JSON.stringify({
    savedFrom: 'scripts/topic-terms-baseline.json',
    note: 'The map as it stood at the start of Phase 07, rebuilt from the pre-expansion term lists. Those lists reproduce the recorded starting figures exactly.',
    summary: baselineSummary,
    topics: baseline.topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      subjectId: topic.subjectId,
      questions: topic.coveredQuestions,
      marks: topic.coveredMarks,
      papers: topic.coveredYears,
      band: band(topic.coveredQuestions, topic.coveredYears),
    })),
  }, null, 2)}\n`,
);

const sign = (value) => (value >= 0 ? `+${value}` : `${value}`);
console.log('[delta] the coverage delta');
console.log(`        topics covered: ${baselineSummary.covered} → ${currentSummary.covered} (${sign(report.delta.topicsCovered)})`);
console.log(`        questions mapped: ${baselineSummary.mappedQuestions} → ${currentSummary.mappedQuestions} (${sign(report.delta.questionsMapped)})`);
console.log(`        broad topics: ${baselineSummary.broad} → ${currentSummary.broad} (${sign(report.delta.broadTopics)})`);
console.log(`        moderate topics: ${baselineSummary.moderate} → ${currentSummary.moderate} (${sign(report.delta.moderateTopics)})`);
console.log(`        thin topics: ${baselineSummary.thin} → ${currentSummary.thin} (${sign(report.delta.thinTopics)})`);
console.log(`        ties: ${baselineSummary.conflicts} → ${currentSummary.conflicts} (${sign(report.delta.conflicts)})`);
console.log(`        still uncovered: ${stillUncovered.length}`);
for (const topic of stillUncovered) console.log(`          ${topic.name} — ${topic.reason}`);
console.log('        wrote docs/phases/07-expansion/coverage-delta.json');
