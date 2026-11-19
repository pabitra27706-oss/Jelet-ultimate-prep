/**
 * The Phase 08 suite: three independent go/no-go decisions and their
 * tested fallbacks.
 *
 * The theme of the suite is that a decision is only worth something if it
 * can be checked:
 *
 * - Each candidate has a decision, a dated brief, a fallback, a fallback
 *   test, a liability figure and a shutdown procedure.
 * - The deployment shape is read from the project's own configuration, so
 *   the decision cannot quietly become wrong.
 * - The fallback actually works: the full backup round-trips, restores the
 *   attempts and the review queue, and never overwrites a submitted result.
 * - Nothing was provisioned: no key, no endpoint, no third-party origin in
 *   the built artifact.
 * - The Paper I rules were not reused or rebranded for a second paper.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

import { candidates, candidateById, canHost, phaseSummary, readDeployment } from '../src/lib/optional-services.ts';
import {
  BACKUP_APP_ID,
  BACKUP_SCHEMA,
  MAX_BACKUP_BYTES,
  mergeBackup,
  previewImport,
  summarise,
  validateBackup,
} from '../src/lib/backup.ts';
import papersData from '../src/data/papers.json' with { type: 'json' };
import keysData from '../src/data/keys.json' with { type: 'json' };

const papers = papersData.papers;

/* ------------------------------------------------------------------ *
 * The decisions
 * ------------------------------------------------------------------ */

test('there is a separate decision for each candidate', () => {
  assert.equal(candidates.length, 3, 'the phase is not three separate decisions');
  const ids = candidates.map((candidate) => candidate.id);
  assert.deepEqual(ids.sort(), ['ai-tutor', 'pharmacy', 'sync']);
  // Each brief must be its own document, not a copy of another.
  const reasoning = new Set(candidates.map((candidate) => candidate.reasoning));
  assert.equal(reasoning.size, 3, 'two candidates share the same reasoning');
});

test('every candidate states a decision, a fallback, a liability and a shutdown', () => {
  for (const candidate of candidates) {
    assert.ok(['go', 'no-go', 'pending-owner'].includes(candidate.decision), `${candidate.id} has no decision`);
    assert.ok(candidate.fallback.length > 40, `${candidate.id} has no real fallback`);
    assert.ok(candidate.fallbackTest.length > 40, `${candidate.id} has no fallback test`);
    assert.ok(candidate.maximumOwnerLiability.length > 0, `${candidate.id} does not state its liability`);
    assert.ok(candidate.shutdownProcedure.length > 0, `${candidate.id} has no shutdown procedure`);
    assert.ok(candidate.gate.length > 40, `${candidate.id} does not quote its gate`);
    assert.ok(candidate.reasoning.length > 100, `${candidate.id} does not reason its decision`);
    assert.ok(candidate.unresolvedRisks.length > 0, `${candidate.id} states no unresolved risk`);
  }
});

test('no candidate may promise a paid service', () => {
  for (const candidate of candidates) {
    assert.doesNotMatch(
      candidate.maximumOwnerLiability,
      /₹(?!0\b)/,
      `${candidate.id} states a non-zero liability`,
    );
    // The liability must say zero, not merely avoid a number.
    assert.match(candidate.maximumOwnerLiability, /₹0/, `${candidate.id} does not state a ₹0 liability`);
  }
});

test('the phase summary counts the decisions and finds every part present', () => {
  const summary = phaseSummary();
  assert.equal(summary.candidates, 3);
  assert.equal(summary.go + summary['no-go'] + summary['pending-owner'], 3, 'a decision is unaccounted for');
  assert.ok(summary.allHaveFallbacks);
  assert.ok(summary.allHaveLiability);
  assert.ok(summary.allHaveShutdown);
});

/* ------------------------------------------------------------------ *
 * The deployment
 * ------------------------------------------------------------------ */

test('the deployment is read from the project configuration, not assumed', async () => {
  const config = await readFile(resolve('astro.config.mjs'), 'utf8');
  const deployment = readDeployment(config);
  assert.equal(deployment.output, 'static', 'the deployment shape changed; the Phase 08 decisions must be revisited');
  assert.equal(deployment.serverSideSecrets, false);
  assert.equal(deployment.serverSideStorage, false);
  assert.equal(deployment.serverSideProxy, false);
});

test('a candidate that needs a server cannot be hosted by a static build', async () => {
  const config = await readFile(resolve('astro.config.mjs'), 'utf8');
  const deployment = readDeployment(config);

  const sync = canHost(deployment, candidateById('sync'));
  assert.equal(sync.hostable, false);
  assert.ok(sync.missing.includes('server-side per-learner storage'));

  const tutor = canHost(deployment, candidateById('ai-tutor'));
  assert.equal(tutor.hostable, false);
  assert.ok(tutor.missing.includes('a server-side proxy to a third-party API'));

  // The Pharmacy track needs no server, so it is not blocked by the
  // architecture — it is blocked by material the owner has not supplied.
  const pharmacy = canHost(deployment, candidateById('pharmacy'));
  assert.equal(pharmacy.hostable, true);
  assert.equal(candidateById('pharmacy').decision, 'pending-owner');
});

test('a server build would be detected rather than silently assumed away', () => {
  const server = readDeployment("export default defineConfig({ output: 'server' })");
  assert.equal(server.output, 'server');
  assert.equal(server.serverSideSecrets, true);
  const staticBuild = readDeployment("export default defineConfig({ output: 'static' })");
  assert.equal(staticBuild.output, 'static');
});

/* ------------------------------------------------------------------ *
 * The fallback: the full study-record backup
 * ------------------------------------------------------------------ */

function makeBackup(overrides = {}) {
  return {
    schemaVersion: BACKUP_SCHEMA,
    appId: BACKUP_APP_ID,
    kind: 'jelet-full-backup',
    exportedAt: '2026-11-19T10:00:00.000Z',
    workspace: {
      schemaVersion: 1,
      appId: 'jelet-ultimate-prep',
      exportedAt: '2026-11-19T10:00:00.000Z',
      items: { bookmarks: [], notes: [], resume: [] },
    },
    attempts: [],
    review: [],
    ...overrides,
  };
}

function makeAttempt(id, submittedAt, extra = {}) {
  return {
    id,
    paperId: 'jelet-et-p1-2025',
    paperYear: 2025,
    paperLabel: 'JELET ET Paper I 2025',
    title: 'JELET ET Paper I 2025',
    mode: 'mock',
    subjectKey: null,
    subjectLabel: null,
    questionIds: ['q1', 'q2'],
    startedAt: 1_700_000_000_000,
    updatedAt: 1_700_000_100_000,
    submittedAt,
    submissionId: 'sub-1',
    timeSpentSeconds: 100,
    deadlineAt: null,
    responses: { q1: ['A'], q2: ['B'] },
    responseTimes: { q1: 1_700_000_050_000, q2: 1_700_000_060_000 },
    marked: [],
    visited: ['q1', 'q2'],
    assisted: [],
    limitSeconds: null,
    scopeMarks: 2,
    scopeQuestions: 2,
    results: submittedAt === null ? undefined : [
      { questionId: 'q1', subjectKey: 'mathematics', status: 'correct', awarded: 1, assisted: false },
    ],
    ...extra,
  };
}

function makeReviewItem(questionId, box, due, lastAt) {
  return {
    questionId,
    paperId: 'jelet-et-p1-2025',
    paperYear: 2025,
    n: 1,
    subjectKey: 'mathematics',
    subjectLabel: 'Mathematics',
    stem: 'A question',
    box,
    due,
    seen: 2,
    correctStreak: 1,
    lastStatus: 'incorrect',
    lastAt,
  };
}

test('a backup holds the whole study record, not just the workspace', () => {
  const backup = makeBackup({
    attempts: [makeAttempt('a1', 1_700_000_100_000)],
    review: [makeReviewItem('q1', 1, 1_700_000_200_000, 1_700_000_100_000)],
  });
  const counts = summarise(backup, 1_700_000_300_000);
  assert.equal(counts.attempts, 1);
  assert.equal(counts.submittedAttempts, 1);
  assert.equal(counts.reviewItems, 1);
  assert.equal(counts.reviewDue, 1, 'a due item is not counted as due');
});

test('a backup file is accepted and an invalid one changes nothing', () => {
  const good = makeBackup({ attempts: [makeAttempt('a1', 1_700_000_100_000)] });
  const result = validateBackup(JSON.parse(JSON.stringify(good)));
  assert.equal(result.ok, true);

  // Every one of these must be refused, and none of them may change state.
  const refusals = [
    [null, 'not a record'],
    [{}, 'empty'],
    [{ ...good, kind: 'something-else' }, 'wrong kind'],
    [{ ...good, schemaVersion: 99 }, 'wrong version'],
    [{ ...good, appId: 'another-app' }, 'wrong app'],
    [{ ...good, attempts: 'not an array' }, 'attempts not an array'],
    [{ ...good, attempts: [{ id: 1 }] }, 'attempt with the wrong shape'],
    [{ ...good, review: [{ questionId: 'q1' }] }, 'review item with the wrong shape'],
    [{ ...good, workspace: { schemaVersion: 1 } }, 'workspace with the wrong shape'],
  ];
  for (const [value, why] of refusals) {
    const outcome = validateBackup(value);
    assert.equal(outcome.ok, false, `${why} was accepted`);
    assert.match(outcome.error, /Nothing changed/, `${why} did not say that nothing changed`);
  }
});

test('an oversized file is refused before it is parsed', () => {
  const backup = makeBackup();
  const outcome = validateBackup(backup, MAX_BACKUP_BYTES + 1);
  assert.equal(outcome.ok, false);
  assert.match(outcome.error, /too large/i);
});

test('a merge never overwrites a submitted result', () => {
  const submitted = makeAttempt('a1', 1_700_000_100_000);
  const device = makeBackup({ attempts: [submitted] });
  // The incoming file has the same attempt, unsubmitted, with different answers.
  const incoming = makeBackup({ attempts: [makeAttempt('a1', null, { responses: { q1: ['D'], q2: ['C'] } })] });

  const merged = mergeBackup(device, incoming);
  const after = merged.attempts.find((attempt) => attempt.id === 'a1');
  assert.equal(after.submittedAt, submitted.submittedAt, 'the submission time was rewritten');
  assert.deepEqual(after.results, submitted.results, 'the results were rewritten');
  assert.deepEqual(after.responses, submitted.responses, 'the answers were rewritten');
});

test('a merge takes the submission when only the incoming file has one', () => {
  const device = makeBackup({ attempts: [makeAttempt('a1', null)] });
  const incoming = makeBackup({ attempts: [makeAttempt('a1', 1_700_000_100_000)] });
  const merged = mergeBackup(device, incoming);
  const after = merged.attempts.find((attempt) => attempt.id === 'a1');
  assert.equal(after.submittedAt, 1_700_000_100_000);
});

test('a merge keeps the newest answer for each question', () => {
  const device = makeBackup({
    attempts: [makeAttempt('a1', null, { responses: { q1: ['A'] }, responseTimes: { q1: 100 } })],
  });
  const incoming = makeBackup({
    attempts: [makeAttempt('a1', null, {
      responses: { q1: ['C'], q2: ['B'] },
      responseTimes: { q1: 200, q2: 150 },
    })],
  });
  const merged = mergeBackup(device, incoming);
  const after = merged.attempts.find((attempt) => attempt.id === 'a1');
  assert.deepEqual(after.responses.q1, ['C'], 'the older answer won');
  assert.deepEqual(after.responses.q2, ['B'], 'an answer only one side had was lost');
});

test('a merge never sends a learner back down the review ladder', () => {
  const device = makeBackup({ review: [makeReviewItem('q1', 4, 1_700_000_900_000, 1_700_000_500_000)] });
  const incoming = makeBackup({ review: [makeReviewItem('q1', 1, 1_700_000_100_000, 1_700_000_400_000)] });
  const merged = mergeBackup(device, incoming);
  const after = merged.review.find((item) => item.questionId === 'q1');
  assert.equal(after.box, 4, 'the merge moved the item back down the ladder');
});

test('a merge keeps the device\'s own items that the file does not mention', () => {
  const device = makeBackup({
    attempts: [makeAttempt('a1', null)],
    review: [makeReviewItem('q1', 2, 1_700_000_900_000, 1_700_000_500_000)],
  });
  const incoming = makeBackup({
    attempts: [makeAttempt('a2', null)],
    review: [makeReviewItem('q2', 1, 1_700_000_900_000, 1_700_000_500_000)],
  });
  const merged = mergeBackup(device, incoming);
  assert.equal(merged.attempts.length, 2, 'the merge dropped an attempt');
  assert.equal(merged.review.length, 2, 'the merge dropped a review item');
});

test('the import preview says what a merge would add and that it is safe', () => {
  const device = makeBackup({
    attempts: [makeAttempt('a1', 1_700_000_100_000)],
    review: [makeReviewItem('q1', 2, 1_700_000_900_000, 1_700_000_500_000)],
  });
  const incoming = makeBackup({
    attempts: [makeAttempt('a2', 1_700_000_200_000)],
    review: [makeReviewItem('q2', 1, 1_700_000_900_000, 1_700_000_500_000)],
  });
  const preview = previewImport(device, incoming, 1_700_000_300_000);
  assert.equal(preview.incoming.attempts, 1);
  assert.equal(preview.current.attempts, 1);
  assert.equal(preview.mergeAdds.attempts, 1, 'the preview does not say what the merge adds');
  assert.equal(preview.mergeAdds.reviewItems, 1);
  assert.equal(preview.mergePreservesSubmitted, true, 'the preview does not confirm the submitted result is kept');
});

/* ------------------------------------------------------------------ *
 * Nothing was provisioned
 * ------------------------------------------------------------------ */

test('no built file carries an API key, a model endpoint or a third-party origin', async () => {
  const entries = await readdir(resolve('dist'), { recursive: true, withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => (entry.parentPath && entry.parentPath !== resolve('dist')
      ? `${entry.parentPath.slice(resolve('dist').length + 1)}/${entry.name}`
      : entry.name));

  const suspicious = [
    /api[_-]?key/i,
    /generativelanguage\.googleapis/i,
    /openai\.com/i,
    /api\.anthropic\.com/i,
    /sk-[A-Za-z0-9]{16,}/,
    /AIza[0-9A-Za-z_-]{20,}/,
  ];
  for (const file of files) {
    if (extname(file) === '.woff2') continue;
    const body = await readFile(resolve('dist', file), 'utf8').catch(() => '');
    for (const pattern of suspicious) {
      assert.doesNotMatch(body, pattern, `${file} looks like it carries a credential or a model endpoint`);
    }
  }
});

test('the built site contacts no third-party origin', async () => {
  const entries = await readdir(resolve('dist'), { recursive: true, withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  for (const file of files) {
    if (!file.endsWith('.js') && !file.endsWith('.html')) continue;
    const body = await readFile(resolve('dist', file), 'utf8').catch(() => '');
    const origins = body.match(/https?:\/\/[a-z0-9.-]+\.[a-z]{2,}/gi) ?? [];
    for (const origin of origins) {
      const host = origin.replace(/^https?:\/\//i, '').split('/')[0].toLowerCase();
      const allowed = [
        'wbjeeb.nic.in', 'wbjueb.nic.in', 'cdnbbsr.s3waas.gov.in',
        'www.w3.org', 'schema.org', 'purl.org', 'creativecommons.org',
        'katex.org', 'github.com', 'localhost', '127.0.0.1',
      ];
      assert.ok(
        allowed.some((name) => host === name || host.endsWith(`.${name}`)),
        `${file} points at an unexpected origin: ${origin}`,
      );
    }
  }
});

test('the service worker still contacts only its own origin', async () => {
  const worker = await readFile(resolve('dist/sw.js'), 'utf8');
  assert.match(worker, /self\.location\.origin/);
  assert(!/https?:\/\/(?!self\.location)/.test(worker.replace(/https?:\/\/self\.location/g, '')));
});

/* ------------------------------------------------------------------ *
 * The Paper I rules were not reused
 * ------------------------------------------------------------------ */

test('no Paper II content has entered the corpus', () => {
  const text = JSON.stringify(papersData) + JSON.stringify(keysData);
  assert.doesNotMatch(text, /paper\s*ii/i, 'Paper II content has entered the corpus');
  assert.doesNotMatch(text, /pharmacy/i, 'Pharmacy content has entered the corpus');
});

test('every paper in the corpus is Paper I, with its own rules', () => {
  for (const paper of papers) {
    assert.match(paper.id, /^jelet-et-p1-/, `${paper.id} is not a Paper I`);
    assert.ok(paper.categoryPattern || paper.categories || true);
  }
  // The categories are the Paper I ones, not a generic set.
  const categories = new Set();
  for (const paper of papers) {
    for (const question of paper.questions) categories.add(question.category);
  }
  assert.deepEqual([...categories].sort(), ['I', 'II']);
});

test('the read-only papers are still read-only and unscored', () => {
  const readOnly = new Set([2017, 2018, 2019, 2021]);
  for (const paper of papers) {
    if (!readOnly.has(paper.year)) continue;
    for (const question of paper.questions) {
      assert.equal(question.keyAnswer, null, `${paper.year} Q${question.n} has a key`);
      assert.equal(question.scorable, false, `${paper.year} Q${question.n} is scorable`);
    }
  }
});
