#!/usr/bin/env node
/**
 * Find the pre-expansion term lists, so the coverage delta is measured
 * against the map Phase 07 actually started from.
 *
 * Phase 07 appended terms to the mapper's synonym lists. The merge appended
 * only the terms that were not already there, so the appended part is a
 * suffix of the current list, and every term in that suffix is absent from
 * the prefix. That gives a small number of candidate split points per
 * topic.
 *
 * The right split is the one that reproduces the Phase 07 starting figures,
 * which are recorded facts. This script searches the candidate splits and
 * accepts only a combination that reproduces every one of them exactly. If
 * nothing reproduces the figures, it says so and writes nothing.
 *
 * The search is fast because the matching is precomputed: for each topic
 * and each candidate, the weight every question would contribute is
 * calculated once. The search then only has to look values up.
 *
 * The evaluator is checked against the real mapper before the search
 * starts, so it cannot drift from the rules that produce the published map.
 *
 * Usage: node scripts/find-baseline-split.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { mapCorpus, matches, normalise, questionText, WEAK_TERMS, PHRASE_ONLY } from './topic-mapping.mjs';
import { TERMS } from './topic-terms.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const ADDED = JSON.parse(await readFile(resolve(root, 'scripts/topic-terms-added.json'), 'utf8'));
const RESTORED = JSON.parse(await readFile(resolve(root, 'scripts/topic-terms-restored.json'), 'utf8'));

const papers = JSON.parse(await readFile(resolve(root, 'src/data/papers.json'), 'utf8')).papers;
const syllabus = JSON.parse(await readFile(resolve(root, 'src/data/syllabus.json'), 'utf8')).syllabus;

/**
 * The recorded Phase 07 starting figures.
 *
 * The `unmapped` figure is the one the first Phase 07 run reported. At that
 * point the questions from the section the 2026 syllabus dropped were still
 * in the unmapped bucket, so the comparable figure is the unmapped count
 * plus the questions that are now recorded as outside the syllabus.
 */
const TARGET = {
  mapped: 212,
  unmapped: 478,
  conflicts: 7,
  covered: 34,
  // The per-subject breakdown, as recorded at the start of Phase 07.
  bySubject: { mathematics: 10, physics: 13, chemistry: 5, electrical: 6 },
};

/* ------------------------------------------------------------------ *
 * The corpus and the topics
 * ------------------------------------------------------------------ */

const topics = [];
for (const subject of syllabus.subjects) {
  for (const topic of subject.topics) {
    topics.push({ id: topic.id, subjectId: subject.id, code: topic.code, name: topic.name, detail: topic.detail });
  }
}

const topicsBySubject = new Map();
for (const topic of topics) {
  const list = topicsBySubject.get(topic.subjectId) ?? [];
  list.push(topic);
  topicsBySubject.set(topic.subjectId, list);
}

/** Every question, with its text prepared once. */
const questions = [];
for (const paper of papers) {
  for (const question of paper.questions) {
    questions.push({
      id: question.id,
      paperId: paper.id,
      year: paper.year,
      n: question.n,
      subjectKey: question.subjectKey,
      text: questionText(question),
      held: !question.scorable && !question.boardAwarded,
    });
  }
}

/** The questions of each subject, by index. */
const questionIndexesBySubject = new Map();
questions.forEach((question, index) => {
  const list = questionIndexesBySubject.get(question.subjectKey) ?? [];
  list.push(index);
  questionIndexesBySubject.set(question.subjectKey, list);
});

/** The syllabus phrases of each topic, which never change. */
const ownTerms = new Map();
for (const topic of topics) {
  const own = [];
  for (const part of topic.detail.split(/[,;]/)) {
    const cleaned = normalise(part).replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleaned.length >= 4 && !cleaned.includes('statement')) own.push(cleaned);
  }
  ownTerms.set(topic.id, own);
}

/* ------------------------------------------------------------------ *
 * The candidate splits
 * ------------------------------------------------------------------ */

/**
 * The candidate split points for one topic.
 *
 * The list is `original ++ appended`. The appended part contains only terms
 * that were absent from the original, and it follows the order the terms
 * were added in. So a split at `k` is valid when the suffix holds no term
 * that also appears in the prefix, and the suffix follows the added order.
 */
function candidates(topic, terms) {
  const added = ADDED[topic] ?? [];
  const restored = RESTORED[topic] ?? [];
  const options = [];
  for (let k = terms.length; k >= 0; k -= 1) {
    const prefix = terms.slice(0, k);
    const suffix = terms.slice(k);
    const prefixSet = new Set(prefix);
    if (suffix.some((term) => prefixSet.has(term))) continue;
    let cursor = 0;
    let ordered = true;
    for (const term of suffix) {
      const at = added.indexOf(term, cursor);
      if (at < 0) { ordered = false; break; }
      cursor = at + 1;
    }
    if (!ordered) continue;
    // The terms that were removed again during the conflict cleanup belong
    // to the original list.
    const restoredTerms = restored.filter((term) => !prefix.includes(term));
    options.push({ original: [...prefix, ...restoredTerms] });
  }
  return options;
}

const optionsByTopic = new Map();
for (const [topic, entry] of Object.entries(TERMS)) {
  optionsByTopic.set(topic, candidates(topic, entry.synonyms));
}

/* ------------------------------------------------------------------ *
 * The precomputed weights
 * ------------------------------------------------------------------ */

/**
 * For every topic and every candidate, the weight each question would give
 * that topic under that candidate's terms.
 *
 * The weight is the sum of the lengths of the distinct terms that match,
 * which is what the mapper uses to decide the winner.
 */
const weights = new Map(); // topicId -> candidate index -> Map(question index -> weight)

for (const [topicId, options] of optionsByTopic) {
  const subject = topics.find((topic) => topic.id === topicId).subjectId;
  const indexes = questionIndexesBySubject.get(subject) ?? [];
  const own = ownTerms.get(topicId);
  const perOption = [];

  // The terms of every candidate, so each distinct term is matched once.
  const allTerms = new Map();
  for (const option of options) {
    const terms = [...own, ...option.original.map(normalise)];
    for (const term of terms) {
      if (term.length < 4) continue;
      if (PHRASE_ONLY.has(term)) continue;
      if (WEAK_TERMS.has(term) && !term.includes(' ')) continue;
      allTerms.set(term, true);
    }
  }

  // The questions each term matches.
  const matched = new Map();
  for (const term of allTerms.keys()) {
    const hits = new Set();
    for (const index of indexes) {
      if (matches(questions[index].text, term)) hits.add(index);
    }
    matched.set(term, hits);
  }

  for (const option of options) {
    const terms = [...own, ...option.original.map(normalise)]
      .filter((term) => term.length >= 4
        && !PHRASE_ONLY.has(term)
        && !(WEAK_TERMS.has(term) && !term.includes(' ')));
    const weightsForOption = new Map();
    for (const term of terms) {
      const length = term.length;
      for (const index of matched.get(term) ?? []) {
        weightsForOption.set(index, (weightsForOption.get(index) ?? 0) + length);
      }
    }
    perOption.push(weightsForOption);
  }
  weights.set(topicId, perOption);
}

const counts = [...optionsByTopic.values()].map((options) => options.length);
console.log(`[split] candidate split points per topic: min ${Math.min(...counts)}, max ${Math.max(...counts)}, total ${counts.reduce((a, b) => a + b, 0)}`);

/* ------------------------------------------------------------------ *
 * The evaluator
 * ------------------------------------------------------------------ */

/** The index of each candidate in its topic's list. */
const candidateIndex = new Map();
for (const [topic, options] of optionsByTopic) {
  options.forEach((option, index) => {
    candidateIndex.set(`${topic}|${option.original.join('|')}`, index);
  });
}

/** Evaluate a choice of candidate index per topic. */
function evaluate(choice) {
  let mapped = 0;
  let unmapped = 0;
  let conflicts = 0;
  const coveredTopics = new Set();

  for (let index = 0; index < questions.length; index += 1) {
    const question = questions[index];
    const candidates = topicsBySubject.get(question.subjectKey);
    if (!candidates || candidates.length === 0) {
      unmapped += 1;
      continue;
    }
    let best = null;
    let bestWeight = -1;
    let tie = false;
    for (const topic of candidates) {
      const optionIndex = choice.get(topic.id);
      const weight = weights.get(topic.id)[optionIndex].get(index) ?? 0;
      if (weight === 0) continue;
      if (weight > bestWeight) { bestWeight = weight; best = topic; tie = false; }
      else if (weight === bestWeight) tie = true;
    }
    if (best === null) { unmapped += 1; continue; }
    if (tie) { conflicts += 1; unmapped += 1; continue; }
    mapped += 1;
    if (!question.held) coveredTopics.add(best.id);
  }

  const bySubject = Object.fromEntries(syllabus.subjects.map((subject) => [
    subject.id,
    topics.filter((topic) => topic.subjectId === subject.id && coveredTopics.has(topic.id)).length,
  ]));

  return { mapped, unmapped, conflicts, covered: coveredTopics.size, bySubject };
}

/** The real mapper's totals for a choice. */
function realTotals(choice) {
  const terms = {};
  for (const topic of Object.keys(TERMS)) {
    const option = optionsByTopic.get(topic)[choice.get(topic)];
    terms[topic] = { synonyms: option.original };
  }
  const result = mapCorpus({ papers, syllabus, terms });
  return {
    mapped: result.mappedQuestions,
    unmapped: result.unmappedQuestions + result.outsideSyllabusQuestions,
    conflicts: result.conflictCount,
    covered: result.coveredTopics,
    bySubject: Object.fromEntries(syllabus.subjects.map((subject) => [
      subject.id,
      result.topics.filter((topic) => topic.subjectId === subject.id && topic.coveredQuestions > 0).length,
    ])),
  };
}

// The fast evaluator must agree with the real mapper on the current lists.
const currentChoice = new Map();
for (const [topic, options] of optionsByTopic) {
  currentChoice.set(topic, options.length - 1); // the widest candidate is the last one built
}
const widest = new Map();
for (const [topic, options] of optionsByTopic) {
  const index = options.findIndex((option) => option.original.join('|') === TERMS[topic].synonyms.join('|'));
  widest.set(topic, index >= 0 ? index : options.length - 1);
}
const fast = evaluate(widest);
const real = realTotals(widest);
console.log('[split] checking the fast evaluator against the real mapper');
console.log(`        fast: mapped ${fast.mapped}, unmapped ${fast.unmapped}, conflicts ${fast.conflicts}, covered ${fast.covered}`);
console.log(`        real: mapped ${real.mapped}, unmapped ${real.unmapped}, conflicts ${real.conflicts}, covered ${real.covered}`);
if (fast.mapped !== real.mapped || fast.unmapped !== real.unmapped
  || fast.conflicts !== real.conflicts || fast.covered !== real.covered) {
  console.error('[split] the fast evaluator disagrees with the real mapper, so the search is not trustworthy');
  process.exit(1);
}
console.log('[split] the two agree');

/* ------------------------------------------------------------------ *
 * The search
 * ------------------------------------------------------------------ */

function score(result) {
  let total = Math.abs(result.mapped - TARGET.mapped)
    + Math.abs(result.unmapped - TARGET.unmapped)
    + Math.abs(result.conflicts - TARGET.conflicts) * 2
    + Math.abs(result.covered - TARGET.covered) * 2;
  for (const [subject, count] of Object.entries(TARGET.bySubject)) {
    total += Math.abs((result.bySubject[subject] ?? 0) - count) * 2;
  }
  return total;
}

function matchesTarget(result) {
  return result.mapped === TARGET.mapped
    && result.unmapped === TARGET.unmapped
    && result.conflicts === TARGET.conflicts
    && result.covered === TARGET.covered
    && Object.entries(TARGET.bySubject).every(([subject, count]) => result.bySubject[subject] === count);
}

/** A deterministic shuffle, so the restarts are reproducible. */
function shuffled(list, seed) {
  const out = [...list];
  let state = seed >>> 0 || 1;
  for (let index = out.length - 1; index > 0; index -= 1) {
    state ^= state << 13; state >>>= 0;
    state ^= state >>> 17;
    state ^= state << 5; state >>>= 0;
    const at = state % (index + 1);
    [out[index], out[at]] = [out[at], out[index]];
  }
  return out;
}

/** The best candidate for one topic, given the rest of the choice. */
function bestFor(topic, choice, current) {
  let best = null;
  let bestScore = Infinity;
  const options = optionsByTopic.get(topic);
  for (let index = 0; index < options.length; index += 1) {
    if (index === current) continue;
    choice.set(topic, index);
    const value = score(evaluate(choice));
    if (value < bestScore) {
      bestScore = value;
      best = index;
    }
  }
  return best;
}

/**
 * A search run.
 *
 * Each run starts from a different choice and descends. A move that makes
 * things worse is undone, so the run never climbs into a worse basin.
 */
function search(seed, maxMoves = 6000) {
  const choice = new Map();
  for (const [topic, options] of optionsByTopic) {
    const order = shuffled(options.map((_, index) => index), seed + topic.length * 7919);
    choice.set(topic, order[0]);
  }
  let current = evaluate(choice);
  let currentScore = score(current);
  if (matchesTarget(current)) return { choice, result: current };

  const topicList = [...optionsByTopic.keys()];
  for (let move = 0; move < maxMoves; move += 1) {
    const topic = topicList[(seed + move * 31) % topicList.length];
    const before = choice.get(topic);
    const best = bestFor(topic, choice, before);
    if (best === null) continue;
    choice.set(topic, best);
    const result = evaluate(choice);
    const value = score(result);
    if (value <= currentScore) {
      currentScore = value;
      current = result;
      if (matchesTarget(current)) return { choice, result: current };
    } else {
      choice.set(topic, before);
    }
  }
  return { choice, result: current };
}

let winner = null;
for (let seed = 1; seed <= 200 && !winner; seed += 1) {
  const attempt = search(seed);
  if (matchesTarget(attempt.result)) {
    winner = attempt;
    console.log(`[split] run ${seed} reproduces the recorded figures`);
  }
  if (seed % 25 === 0) console.log(`[split] ... ${seed} runs, best score so far ${score(attempt.result)}`);
}

if (!winner) {
  const attempt = search(1);
  console.error('[split] no combination reproduces the recorded Phase 07 starting figures');
  console.error(`        wanted mapped ${TARGET.mapped}, unmapped ${TARGET.unmapped}, conflicts ${TARGET.conflicts}, covered ${TARGET.covered}`);
  console.error(`        closest mapped ${attempt.result.mapped}, unmapped ${attempt.result.unmapped}, conflicts ${attempt.result.conflicts}, covered ${attempt.result.covered}`);
  console.error(`        closest by subject ${JSON.stringify(attempt.result.bySubject)}, wanted ${JSON.stringify(TARGET.bySubject)}`);
  process.exit(1);
}

// The chosen lists must still agree with the real mapper.
const realWinner = realTotals(winner.choice);
if (realWinner.mapped !== TARGET.mapped || realWinner.conflicts !== TARGET.conflicts
  || realWinner.covered !== TARGET.covered) {
  console.error('[split] the real mapper disagrees with the fast evaluator on the chosen lists');
  process.exit(1);
}

await writeFile(
  resolve(root, 'scripts/topic-terms-baseline.json'),
  `${JSON.stringify(Object.fromEntries([...winner.choice].map(([topic, index]) => [topic, optionsByTopic.get(topic)[index].original])), null, 2)}\n`,
);

console.log('[split] the pre-expansion lists reproduce the recorded starting figures');
console.log('        wrote scripts/topic-terms-baseline.json');
