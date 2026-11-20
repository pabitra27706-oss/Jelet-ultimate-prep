import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { subsetFor, hasBleed, DEFECTS } from '../scripts/derived-key-subset.mjs';
import { validateKeyFile, NO_OFFICIAL_TIER } from '../scripts/validate-keys.mjs';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const corpus = JSON.parse(readFileSync(resolve(REPO, 'src/data/papers.json'), 'utf8'));
const KEY_2017 = JSON.parse(readFileSync(resolve(REPO, 'editorial/derived-keys/2017/2017-keys.json'), 'utf8'));

function clone(o) { return JSON.parse(JSON.stringify(o)); }

test('the authorised slice is a deterministic function of the corpus', () => {
  const a = subsetFor(2017, corpus);
  const b = subsetFor(2017, corpus);
  assert.deepEqual(a, b, 'two runs must agree exactly');
  const again = subsetFor(2017);
  assert.deepEqual(a, again, 'reloading the corpus must not change the slice');
});

test('the slice excludes every documented 2017 defect and accounts for all 100 items', () => {
  const s = subsetFor(2017, corpus);
  assert.equal(s.questionCount, 100);
  assert.equal(s.candidates.length + s.excluded.length, 100, 'every question is either in or out, with a reason');
  for (const q of Object.keys(DEFECTS[2017]).map(Number)) {
    assert.ok(!s.candidates.includes(q), `Q${q} carries a documented defect and must not be in the slice`);
    assert.ok(s.excluded.some((e) => e.q === q), `Q${q} must appear in excluded with a reason`);
  }
  for (const e of s.excluded) assert.ok(e.reason && e.reason.length > 5, `Q${e.q} excluded without a real reason`);
});

test('signature checks — the corpus defects the slice is built to avoid', () => {
  assert.equal(subsetFor(2017, corpus).candidates.length, 85);
  assert.equal(subsetFor(2018, corpus).candidates.length, 84);
  assert.equal(subsetFor(2019, corpus).candidates.length, 80);
  assert.equal(subsetFor(2021, corpus).candidates.length, 80);
  // 2019 lost a whole page: three questions the corpus cannot supply
  const s19 = subsetFor(2019, corpus);
  for (const q of [77, 78, 79]) assert.ok(s19.excluded.some((e) => e.q === q), `2019 Q${q} must be excluded`);
});

test('heading bleed is detected, not assumed', () => {
  assert.equal(hasBleed('None of these ENVIRONMENTAL ENGINEERING (Q56-'), true);
  assert.equal(hasBleed('3 m STRENGTH OF MATERIALS'), true);
  assert.equal(hasBleed('0.556 m approx'), false);
});

test('the 2017 key file validates', () => {
  const { errors, warnings } = validateKeyFile(KEY_2017, { corpus });
  assert.deepEqual(errors, [], `unexpected errors:\n${errors.join('\n')}`);
  assert.equal(warnings.length, 0, `unexpected warnings:\n${warnings.join('\n')}`);
});

test('2017 status arithmetic closes', () => {
  const st = KEY_2017.status;
  const tiers = Object.values(st.tierCounts).reduce((a, b) => a + b, 0);
  assert.equal(tiers, KEY_2017.entries.length);
  assert.equal(st.eligibleCount + st.heldCount, KEY_2017.entries.length);
  const reasons = Object.values(st.heldReasons).reduce((a, b) => a + b, 0);
  assert.equal(reasons, st.heldCount);
  assert.ok(st.eligibleCount <= st.tierCounts['derived-verified']);
});

test('no entry in any covered year carries the official tier', () => {
  assert.deepEqual(NO_OFFICIAL_TIER, [2017, 2018, 2019, 2021]);
  for (const e of KEY_2017.entries) assert.notEqual(e.tier, 'official');
});

test('every solved 2017 entry carries reasoning, a verification note and a hold reason', () => {
  const solved = KEY_2017.entries.filter((e) => e.tier === 'derived-provisional');
  assert.equal(solved.length, 17);
  for (const e of solved) {
    assert.ok(e.answer.length === 1, `q=${e.q}: expected a single letter`);
    assert.ok(e.reasoning.length > 40, `q=${e.q}: reasoning is too thin to audit`);
    assert.ok(e.verification.length > 20, `q=${e.q}: verification note missing`);
    assert.equal(e.scoringEligibility, 'held');
    assert.equal(e.holdReason, 'no-approved-tier');
    assert.equal(e.optionFidelity, 'corpus-text-unverified', 'a text-layer session may not claim better fidelity');
  }
});

test('the validator rejects the failures the external review found in the docs', () => {
  // 1. official tier for a year with no board key
  let k = clone(KEY_2017); k.entries[0].tier = 'official';
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes('official')));

  // 2. eligible while the owner has not approved scoring
  k = clone(KEY_2017); k.entries[0].scoringEligibility = 'eligible'; k.entries[0].holdReason = null;
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes('ownerApprovedForScoring')));

  // 3. unsolved carrying an answer
  k = clone(KEY_2017); k.entries[20].answer = ['A'];
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes("'unsolved' must carry answer null")));

  // 4. verbatim fidelity with no page image
  k = clone(KEY_2017); k.entries[0].optionFidelity = 'verbatim';
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes('requires a sourceImage')));

  // 5. a status block whose totals do not match the entries
  k = clone(KEY_2017); k.status.tierCounts['derived-provisional'] = 18;
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes('recomputed')));

  // 6. the one-equation reconciliation the review rejected
  k = clone(KEY_2017); k.reconciliation.matched = 99;
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes('bookletQuestionCount')));

  // 7. a dispute tier with no dispute record
  k = clone(KEY_2017); k.entries[0].tier = 'disputed'; k.entries[0].disputeId = 'D-2017-001';
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes('not present in disputes')));
});

test('the 2017 numeric checks re-run green', () => {
  const r = spawnSync('python3', ['editorial/derived-keys/2017/checks/math-q01-20.py'], { cwd: REPO, encoding: 'utf8' });
  assert.equal(r.status, 0, `check script failed:\n${r.stdout}\n${r.stderr}`);
  assert.match(r.stdout, /Q16: PASS/);
  assert.doesNotMatch(r.stdout, /FAIL/);
});

test('every machine check in the key file names the command that reproduces it', () => {
  const checked = KEY_2017.entries.filter((e) => e.machineCheck);
  assert.equal(checked.length, 11);
  for (const e of checked) {
    assert.match(e.machineCheck.command, /^python3 editorial\/derived-keys\/2017\/checks\/math-q01-20\.py -q \d+$/);
    assert.equal(e.machineCheck.pass, true);
    assert.ok(e.machineCheck.observed.length > 0);
  }
  // the command named must actually be the one that produces this item's observed value
  const r = spawnSync('bash', ['-lc', checked[0].machineCheck.command], { cwd: REPO, encoding: 'utf8' });
  assert.equal(r.status, 0);
});
