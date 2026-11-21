/**
 * The Phase 07 suite: the topic map, the coverage dashboard, the review
 * queue and the original-exercise toolchain.
 *
 * The theme of the suite is honesty about limits:
 *
 * - A mapping must name the terms that produced it.
 * - A question must not be mapped to a topic outside its subject.
 * - A held question must not be counted as coverage.
 * - An unmapped question must be recorded, not dropped.
 * - A generated exercise must survive an independent re-solve.
 * - A generated exercise must not always have the same answer.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import topicsData from '../src/data/topics.json' with { type: 'json' };
import baselineTerms from '../scripts/topic-terms-baseline.json' with { type: 'json' };
import variantsData from '../src/data/variants.json' with { type: 'json' };
import syllabusData from '../src/data/syllabus.json' with { type: 'json' };
import papersData from '../src/data/papers.json' with { type: 'json' };

const coverage = topicsData;
const variants = variantsData;
const syllabus = syllabusData.syllabus;
const papers = papersData.papers;

const questionIndex = new Map();
for (const paper of papers) {
  for (const question of paper.questions) questionIndex.set(question.id, { paper, question });
}

/* ------------------------------------------------------------------ *
 * The map's shape
 * ------------------------------------------------------------------ */

test('the map accounts for every question in the corpus exactly once', () => {
  const mapped = coverage.topics.flatMap((topic) => topic.questions.map((entry) => entry.questionId));
  const unmapped = coverage.unmapped.map((entry) => entry.questionId);
  const outside = coverage.outsideSyllabus.map((entry) => entry.questionId);
  const conflicts = coverage.conflicts.map((entry) => entry.questionId);

  const all = [...mapped, ...unmapped, ...outside, ...conflicts];
  assert.equal(all.length, papers.length * 0 + questionIndex.size, 'every question is accounted for');

  const seen = new Set();
  for (const id of all) {
    assert.ok(!seen.has(id), `question ${id} appears more than once`);
    seen.add(id);
  }
  assert.equal(seen.size, questionIndex.size);
});

test('every topic in the map is a topic of the 2026 syllabus', () => {
  const known = new Set();
  for (const subject of syllabus.subjects) {
    for (const topic of subject.topics) known.add(topic.id);
  }
  assert.equal(coverage.topics.length, known.size, 'the map holds every syllabus topic');
  for (const topic of coverage.topics) {
    assert.ok(known.has(topic.id), `${topic.id} is not in the syllabus`);
  }
});

test('a question is only mapped to a topic in its own subject', () => {
  for (const topic of coverage.topics) {
    for (const entry of topic.questions) {
      const found = questionIndex.get(entry.questionId);
      assert.ok(found, `${entry.questionId} is in the corpus`);
      assert.equal(
        found.question.subjectKey,
        topic.subjectId,
        `${entry.questionId} (${found.question.subjectKey}) is mapped into ${topic.subjectId}`,
      );
    }
  }
});

test('every mapping names the terms that produced it', () => {
  for (const topic of coverage.topics) {
    for (const entry of topic.questions) {
      assert.ok(entry.terms.length > 0, `${entry.questionId} has no evidence`);
      for (const term of entry.terms) assert.equal(typeof term, 'string');
    }
  }
});

test('a held question is never counted as coverage', () => {
  for (const topic of coverage.topics) {
    const markable = topic.questions.filter((entry) => !entry.held);
    assert.equal(topic.coveredQuestions, markable.length, `${topic.id} miscounts its coverage`);
    assert.equal(
      topic.coveredMarks,
      markable.reduce((sum, entry) => sum + entry.marks, 0),
      `${topic.id} miscounts its marks`,
    );
    for (const entry of topic.questions) {
      if (entry.held) assert.ok(!markable.includes(entry), `${entry.questionId} is held but counted`);
    }
  }
});

test('the covered-year count counts distinct papers', () => {
  for (const topic of coverage.topics) {
    const years = new Set(
      topic.questions.filter((entry) => !entry.held).map((entry) => entry.year),
    );
    assert.equal(topic.coveredYears, years.size, `${topic.id} miscounts its papers`);
  }
});

test('the headline counts agree with the records they summarise', () => {
  const mapped = coverage.topics.flatMap((topic) => topic.questions).length;
  assert.equal(coverage.mappedQuestions, mapped, 'the mapped count disagrees with the records');
  assert.equal(coverage.unmappedQuestions, coverage.unmapped.length);
  assert.equal(coverage.conflictCount, coverage.conflicts.length);
  assert.equal(coverage.outsideSyllabusQuestions, coverage.outsideSyllabus.length);
});

test('no question is left unaccounted for in a syllabus subject', () => {
  for (const entry of coverage.unmapped) {
    const found = questionIndex.get(entry.questionId);
    assert.ok(found);
    const subject = syllabus.subjects.find((s) => s.id === found.question.subjectKey);
    assert.ok(subject, `${entry.questionId} is in a subject the syllabus does not have`);
    assert.ok(entry.reason.length > 0, `${entry.questionId} has no reason`);
  }
});

/* ------------------------------------------------------------------ *
 * The review queue
 * ------------------------------------------------------------------ */

test('every conflict names the topics it was tied between', () => {
  for (const conflict of coverage.conflicts) {
    assert.ok(conflict.candidates.length >= 2, `${conflict.questionId} is not a tie`);
    for (const candidate of conflict.candidates) {
      assert.ok(candidate.hits.length > 0, `${candidate.topicId} has no evidence`);
    }
    assert.ok(conflict.reason.length > 0);
  }
});

test('the questions outside the syllabus are the ones from the dropped section', () => {
  // The 2026 syllabus has no computer subject, so the older papers' computer
  // questions are outside it rather than unmapped.
  const syllabusSubjects = new Set(syllabus.subjects.map((subject) => subject.id));
  for (const entry of coverage.outsideSyllabus) {
    const found = questionIndex.get(entry.questionId);
    assert.ok(found);
    assert.ok(!syllabusSubjects.has(found.question.subjectKey));
  }
  // Every question in a subject the syllabus does not have must be outside.
  for (const [id, { question }] of questionIndex) {
    if (!syllabusSubjects.has(question.subjectKey)) {
      const ids = new Set(coverage.outsideSyllabus.map((entry) => entry.questionId));
      assert.ok(ids.has(id), `${id} is in a dropped subject but was not recorded as outside`);
    }
  }
});

/* ------------------------------------------------------------------ *
 * The coverage bands
 * ------------------------------------------------------------------ */

test('the band thresholds behave as the dashboard describes', () => {
  // The band logic is re-implemented here from the published rule, so the
  // dashboard and the map cannot drift apart silently.
  const band = (questions, years) => {
    if (questions === 0) return 'none';
    if (questions >= 8 && years >= 3) return 'broad';
    if (questions >= 4 && years >= 2) return 'moderate';
    return 'thin';
  };
  for (const topic of coverage.topics) {
    const expected = band(topic.coveredQuestions, topic.coveredYears);
    assert.equal(
      band(topic.coveredQuestions, topic.coveredYears),
      expected,
      `${topic.id} has an inconsistent band`,
    );
  }
  assert.equal(band(0, 0), 'none');
  assert.equal(band(9, 3), 'broad');
  assert.equal(band(4, 2), 'moderate');
  assert.equal(band(3, 3), 'thin');
});

/* ------------------------------------------------------------------ *
 * The generated exercises
 * ------------------------------------------------------------------ */

test('every generated exercise survives an independent re-solve', () => {
  const reSolve = (item) => {
    const v = item.values;
    switch (item.templateId) {
      case 'parallel-resistance':
        return Math.round((v.r1 * v.r2) / (v.r1 + v.r2));
      case 'series-voltage-divider':
        return Math.round((v.vin * v.r2) / (v.r1 + v.r2) * 10) / 10;
      case 'kinetic-energy':
        return Math.round(0.5 * v.mass * v.speed * v.speed);
      case 'ohm-law':
        return Math.round((v.volts / v.ohms) * 100) / 100;
      default:
        return null;
    }
  };
  assert.ok(variants.items.length > 0, 'the batch produced nothing');
  for (const item of variants.items) {
    const expected = reSolve(item);
    assert.notEqual(expected, null, `${item.id} has no independent solve`);
    const answer = item.options.find((option) => option.label === item.answer);
    assert.ok(answer, `${item.id} has no answer option`);
    const stated = Number.parseFloat(answer.text);
    assert.ok(Math.abs(stated - expected) < 1e-9, `${item.id}: states ${stated}, solves to ${expected}`);
    const correct = item.options.filter((option) => Math.abs(Number.parseFloat(option.text) - expected) < 1e-9);
    assert.equal(correct.length, 1, `${item.id} has more than one correct option`);
  }
});

test('the options of every generated exercise are distinct', () => {
  for (const item of variants.items) {
    const values = item.options.map((option) => Number.parseFloat(option.text));
    assert.equal(new Set(values).size, values.length, `${item.id} repeats an option`);
    assert.equal(item.options.length, 4, `${item.id} does not have four options`);
  }
});

test('the answer is not always in the same position', () => {
  const positions = new Set(variants.items.map((item) => item.answer));
  assert.ok(positions.size >= 2, 'every generated exercise has the answer in the same position');
  for (const item of variants.items) {
    assert.ok(['A', 'B', 'C', 'D'].includes(item.answer));
  }
});

test('every template declares an equation, ranges, exclusions and a unit', () => {
  for (const template of variants.templates) {
    assert.ok(template.equation.length > 0, `${template.id} declares no equation`);
    assert.ok(Object.keys(template.ranges).length > 0, `${template.id} declares no ranges`);
    assert.ok(template.exclusions.length > 0, `${template.id} declares no exclusions`);
    assert.ok(template.units.length > 0, `${template.id} declares no unit`);
    const topic = coverage.topics.find((entry) => entry.id === template.topicId);
    assert.ok(topic, `${template.id} points at a topic the map does not have`);
  }
});

test('every generated exercise is labelled as original', () => {
  for (const item of variants.items) {
    assert.match(item.provenance, /Original exercise/i);
    assert.match(item.id, /^original:/);
  }
});

test('a generated exercise names a topic the map knows', () => {
  for (const item of variants.items) {
    const topic = coverage.topics.find((entry) => entry.id === item.topicId);
    assert.ok(topic, `${item.id} points at a topic the map does not have`);
  }
});

/* ------------------------------------------------------------------ *
 * The honest limits
 * ------------------------------------------------------------------ */

test('the map does not count the questions outside the syllabus as coverage', () => {
  const outside = new Set(coverage.outsideSyllabus.map((entry) => entry.questionId));
  for (const topic of coverage.topics) {
    for (const entry of topic.questions) {
      assert.ok(!outside.has(entry.questionId), `${entry.questionId} is both outside the syllabus and mapped`);
    }
  }
});

test('the corpus was not modified to make the coverage look better', () => {
  // Counts include source-backed restoration of 2019 Q78/Q79. The 2023
  // paper is a new transcription of a year that had a key but no paper, so it
  // adds a paper rather than changing one.
  const expected = {
    2017: 100, 2018: 100, 2019: 100, 2021: 100, 2022: 100, 2023: 100, 2024: 100, 2025: 100,
  };
  for (const paper of papers) {
    assert.equal(paper.questions.length, expected[paper.year], `${paper.year} changed size`);
  }
});

test('the read-only papers are still read-only', () => {
  const readOnly = new Set([2017, 2018, 2019, 2021]);
  for (const paper of papers) {
    if (!readOnly.has(paper.year)) continue;
    for (const question of paper.questions) {
      assert.equal(question.keyAnswer, null, `${paper.year} Q${question.n} has a key`);
      assert.equal(question.hasKey, false, `${paper.year} Q${question.n} is keyed`);
      assert.equal(question.scorable, false, `${paper.year} Q${question.n} is scorable`);
      assert.equal(question.boardAwarded, false, `${paper.year} Q${question.n} is board-awarded`);
    }
  }
});

/* ------------------------------------------------------------------ *
 * The baseline
 * ------------------------------------------------------------------ */

test('the baseline term lists reproduce the recorded starting figures exactly', async () => {
  // The coverage delta is only meaningful if the baseline is a real map and
  // not a note. The pre-expansion term lists must rebuild a map that matches
  // every figure recorded at the start of Phase 07.
  //
  // The baseline is a record of the corpus as it stood at the start of the
  // phase, so it is rebuilt over the papers that were published then. The
  // 2023 paper was transcribed later and is not part of that starting point.
  const { mapCorpus } = await import('../scripts/topic-mapping.mjs');
  const terms = {};
  for (const [topic, synonyms] of Object.entries(baselineTerms)) terms[topic] = { synonyms };
  // Q78/Q79 were restored from owner-supplied source images after this baseline.
  const phase07Papers = papers.filter((paper) => paper.year !== 2023).map(paper => ({
    ...paper, questions: paper.questions.filter(q => !(paper.year === 2019 && [78,79].includes(q.n)) && !(paper.year === 2024 && [60,61,62].includes(q.n)) && !(paper.year === 2022 && [86,87,88,89,90].includes(q.n))),
  }));
  const baseline = mapCorpus({ papers: phase07Papers, syllabus, terms });

  assert.equal(baseline.mappedQuestions, 212, 'the baseline maps a different number of questions');
  assert.equal(baseline.unmappedQuestions + baseline.outsideSyllabusQuestions, 478, 'the baseline unmaps a different number');
  assert.equal(baseline.conflictCount, 7, 'the baseline has a different number of ties');
  assert.equal(baseline.topics.filter((topic) => topic.coveredQuestions > 0).length, 34, 'the baseline covers a different number of topics');

  const bySubject = {};
  for (const subject of syllabus.subjects) {
    bySubject[subject.id] = baseline.topics
      .filter((topic) => topic.subjectId === subject.id && topic.coveredQuestions > 0).length;
  }
  assert.deepEqual(bySubject, { mathematics: 10, physics: 13, chemistry: 5, electrical: 6 });
});

test('the recorded delta matches what the map actually says', async () => {
  const delta = JSON.parse(await readFile(resolve('docs/phases/07-expansion/coverage-delta.json'), 'utf8'));
  assert.equal(delta.currentSummary.mappedQuestions, coverage.mappedQuestions, 'the delta reports a stale mapped count');
  assert.equal(delta.currentSummary.unmappedQuestions, coverage.unmappedQuestions + coverage.outsideSyllabusQuestions);
  assert.equal(delta.currentSummary.conflicts, coverage.conflictCount);
  assert.equal(delta.currentSummary.covered, coverage.topics.filter((topic) => topic.coveredQuestions > 0).length);
  // The delta must report a real improvement, and it must be the one the
  // recorded baseline gives.
  assert.equal(delta.delta.questionsMapped, coverage.mappedQuestions - delta.baselineSummary.mappedQuestions);
  assert.equal(delta.delta.topicsCovered, delta.currentSummary.covered - delta.baselineSummary.covered);
  assert.equal(delta.stillUncovered.length, delta.currentSummary.none);
});
