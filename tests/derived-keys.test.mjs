import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, basename } from 'node:path';

import { subsetFor, hasBleed, DEFECTS } from '../scripts/derived-key-subset.mjs';
import { validateKeyFile, NO_OFFICIAL_TIER } from '../scripts/validate-keys.mjs';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const corpus = JSON.parse(readFileSync(resolve(REPO, 'src/data/papers.json'), 'utf8'));
const KEYS_DIR = resolve(REPO, 'editorial/derived-keys');

/**
 * Every year with a key file on disk, so finishing a year needs no edit here.
 * Earlier versions hard-coded 2017 and its counters, which broke the moment a
 * second year was completed.
 */
const YEARS = readdirSync(KEYS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d{4}$/.test(d.name))
  .map((d) => Number(d.name))
  .filter((y) => existsSync(resolve(KEYS_DIR, String(y), `${y}-keys.json`)))
  .sort();

const KEYS = Object.fromEntries(YEARS.map((y) => [y, JSON.parse(readFileSync(resolve(KEYS_DIR, String(y), `${y}-keys.json`), 'utf8'))]));
const FIRST = KEYS[YEARS[0]];

function clone(o) { return JSON.parse(JSON.stringify(o)); }
function solvedOf(key) { return key.entries.filter((e) => e.tier === 'derived-provisional'); }
function optionsOf(year, q) {
  const paper = corpus.papers.find((p) => p.year === year);
  const rec = paper?.questions.find((x) => x.n === q);
  return new Set((rec?.options || []).map((o) => o.label));
}

test('every year on disk has a key file that validates', () => {
  assert.ok(YEARS.length >= 3, `expected at least the three completed years, saw ${YEARS.join(', ')}`);
  for (const y of YEARS) {
    const { errors, warnings } = validateKeyFile(KEYS[y], { corpus });
    assert.deepEqual(errors, [], `${y} errors:\n${errors.join('\n')}`);
    assert.equal(warnings.length, 0, `${y} warnings:\n${warnings.join('\n')}`);
  }
});

test('the authorised slice is a deterministic function of the corpus', () => {
  for (const y of [2017, 2018]) {
    const a = subsetFor(y, corpus);
    const b = subsetFor(y, corpus);
    assert.deepEqual(a, b, `two runs must agree exactly (${y})`);
    assert.deepEqual(a, subsetFor(y), `reloading the corpus must not change the slice (${y})`);
  }
});

test('the slice excludes every documented defect and accounts for all 100 items', () => {
  for (const y of YEARS) {
    const s = subsetFor(y, corpus);
    assert.equal(s.questionCount, 100, `${y}: the booklet prints 100 questions`);
    assert.equal(s.candidates.length + s.excluded.length, 100, `${y}: every question is either in or out`);
    for (const q of Object.keys(DEFECTS[y] || {}).map(Number)) {
      assert.ok(!s.candidates.includes(q), `${y} Q${q} carries a documented defect and must not be in the slice`);
      assert.ok(s.excluded.some((e) => e.q === q), `${y} Q${q} must appear in excluded with a reason`);
    }
    for (const e of s.excluded) assert.ok(e.reason && e.reason.length > 5, `${y} Q${e.q} excluded without a real reason`);
  }
});

test('signature checks — the corpus defects the slice is built to avoid', () => {
  assert.equal(subsetFor(2017, corpus).candidates.length, 85);
  assert.equal(subsetFor(2018, corpus).candidates.length, 84);
  // 82, not 80: the corpus holds 98 records for 2019, so a loop bound of
  // questionCount silently dropped Q99 and Q100 from the slice.
  assert.equal(subsetFor(2019, corpus).candidates.length, 82);
  assert.ok(subsetFor(2019, corpus).candidates.includes(100), '2019 Q100 must be a candidate');
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

test('status arithmetic closes for every year', () => {
  for (const y of YEARS) {
    const key = KEYS[y];
    const st = key.status;
    const n = key.entries.length;
    assert.equal(n, 100, `${y}: 100 entries expected`);
    assert.equal(Object.values(st.tierCounts).reduce((a, b) => a + b, 0), n, `${y}: tier counts must sum to the entries`);
    assert.equal(st.eligibleCount + st.heldCount, n, `${y}: eligible + held must cover every entry`);
    assert.equal(Object.values(st.heldReasons).reduce((a, b) => a + b, 0), st.heldCount, `${y}: held reasons must sum to heldCount`);
    assert.ok(st.eligibleCount <= st.tierCounts['derived-verified'], `${y}: eligibility may not exceed verified items`);
    assert.equal(st.eligibleCount, 0, `${y}: nothing is scoreable in this phase`);
    assert.equal(st.machineCheckedCount, key.entries.filter((e) => e.machineCheck).length, `${y}: machineCheckedCount must match`);
  }
});

test('no entry in any covered year carries the official tier', () => {
  assert.deepEqual(NO_OFFICIAL_TIER, [2017, 2018, 2019, 2021]);
  for (const y of YEARS) {
    for (const e of KEYS[y].entries) assert.notEqual(e.tier, 'official', `${y} Q${e.q}`);
  }
});

test('every solved entry carries reasoning, a verification note and a hold reason', () => {
  for (const y of YEARS) {
    const solved = solvedOf(KEYS[y]);
    assert.ok(solved.length > 70, `${y}: only ${solved.length} solved, the slice is not finished`);
    for (const e of solved) {
      assert.equal(e.answer.length, 1, `${y} q=${e.q}: expected a single letter`);
      assert.ok(e.reasoning.length > 40, `${y} q=${e.q}: reasoning is too thin to audit`);
      assert.ok(e.verification.length > 20, `${y} q=${e.q}: verification note missing`);
      assert.equal(e.scoringEligibility, 'held', `${y} q=${e.q}`);
      assert.equal(e.holdReason, 'no-approved-tier', `${y} q=${e.q}`);
      assert.equal(e.optionFidelity, 'corpus-text-unverified', `${y} q=${e.q}: a text-layer session may not claim better fidelity`);
    }
  }
});

test('every solved answer names an option the corpus actually prints', () => {
  for (const y of YEARS) {
    for (const e of solvedOf(KEYS[y])) {
      const opts = optionsOf(y, e.q);
      if (opts.size === 0) continue;
      assert.ok(opts.has(e.answer[0]), `${y} Q${e.q}: answer ${e.answer[0]} is not a printed option`);
    }
  }
});

test('the key file and the slice definition agree, item by item', () => {
  for (const y of YEARS) {
    const s = subsetFor(y, corpus);
    const key = KEYS[y];
    const out = new Set(s.excluded.map((e) => e.q));
    for (const e of key.entries) {
      if (out.has(e.q)) {
        assert.notEqual(e.tier, 'derived-provisional', `${y} Q${e.q} is outside the slice but marked solved`);
        assert.ok(e.holdReason && e.holdReason !== 'no-approved-tier', `${y} Q${e.q} is excluded but claims no reason`);
        assert.match(e.note, /(Outside the authorised|Excluded from the authorised)/, `${y} Q${e.q} must say why in its note`);
      } else if (e.tier !== 'derived-provisional') {
        assert.ok(e.holdReason && e.holdReason !== 'no-approved-tier', `${y} Q${e.q} is in the slice but not solved, so it needs a real reason`);
        assert.ok(e.note.length > 30, `${y} Q${e.q}: a held item must explain itself`);
      }
    }
  }
});

test('the validator rejects the failures the external review found in the docs', () => {
  // 1. official tier for a year with no board key
  let k = clone(FIRST); k.entries[0].tier = 'official';
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes('official')));

  // 2. eligible while the owner has not approved scoring
  k = clone(FIRST); k.entries[0].scoringEligibility = 'eligible'; k.entries[0].holdReason = null;
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes('ownerApprovedForScoring')));

  // 3. unsolved carrying an answer
  k = clone(FIRST);
  const unsolved = k.entries.find((e) => e.tier === 'unsolved');
  unsolved.answer = ['A'];
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes("'unsolved' must carry answer null")));

  // 4. verbatim fidelity with no page image
  k = clone(FIRST); k.entries[0].optionFidelity = 'verbatim';
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes('requires a sourceImage')));

  // 5. a status block whose totals do not match the entries
  k = clone(FIRST); k.status.tierCounts['derived-provisional'] = 18;
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes('recomputed')));

  // 6. the one-equation reconciliation the review rejected
  k = clone(FIRST); k.reconciliation.matched = 99;
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes('bookletQuestionCount')));

  // 7. a machine check that claims a pass but names no run
  k = clone(FIRST);
  const mcEntry = k.entries.find((e) => e.machineCheck);
  k.entries.find((e) => e.q === mcEntry.q).machineCheck = { ...mcEntry.machineCheck, command: undefined };
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes('no command reproduces it')));

  // 8. a machine check whose command is not an interpreter invocation
  k = clone(FIRST);
  const mcEntry2 = k.entries.find((e) => e.machineCheck);
  k.entries.find((e) => e.q === mcEntry2.q).machineCheck = { ...mcEntry2.machineCheck, command: 'echo PASS' };
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes('must start with an interpreter')));

  // 9. a dispute tier with no dispute record
  k = clone(FIRST); k.entries[0].tier = 'disputed'; k.entries[0].disputeId = 'D-2017-001';
  assert.ok(validateKeyFile(k, { corpus }).errors.some((e) => e.includes('not present in disputes')));
});

test('every check script on disk re-runs green', () => {
  let ran = 0;
  for (const y of YEARS) {
    const dir = resolve(KEYS_DIR, String(y), 'checks');
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.py'))) {
      const r = spawnSync('python3', [`editorial/derived-keys/${y}/checks/${f}`], { cwd: REPO, encoding: 'utf8' });
      assert.equal(r.status, 0, `${y}/${f} failed:\n${r.stdout}\n${r.stderr}`);
      assert.match(r.stdout, /PASS/, `${y}/${f} reported no PASS line`);
      assert.doesNotMatch(r.stdout, /FAIL/, `${y}/${f} reported a FAIL`);
      ran += 1;
    }
  }
  assert.ok(ran >= 4, `expected a check script per year, ran ${ran}`);
});

test('every machine check names the command that reproduces it, and it passes', () => {
  for (const y of YEARS) {
    const checked = KEYS[y].entries.filter((e) => e.machineCheck);
    assert.ok(checked.length >= 10, `${y}: only ${checked.length} machine-checked items`);
    for (const e of checked) {
      assert.match(
        e.machineCheck.command,
        new RegExp(`^python3 editorial/derived-keys/${y}/checks/[\\w-]+\\.py -q ${e.q}$`),
        `${y} Q${e.q}: the command must point at this year's checks and this question`,
      );
      assert.equal(e.machineCheck.pass, true, `${y} Q${e.q}`);
      assert.ok(e.machineCheck.observed.length > 0, `${y} Q${e.q}: no observed value`);
      const r = spawnSync('bash', ['-lc', e.machineCheck.command], { cwd: REPO, encoding: 'utf8' });
      assert.equal(r.status, 0, `${y} Q${e.q}: ${e.machineCheck.command} failed:\n${r.stdout}${r.stderr}`);
      assert.match(r.stdout, /PASS/, `${y} Q${e.q}: the named command does not report PASS`);
    }
  }
});

test('no check script can pass vacuously', () => {
  for (const y of YEARS) {
    const dir = resolve(KEYS_DIR, String(y), 'checks');
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.py'))) {
      const r = spawnSync('python3', [`editorial/derived-keys/${y}/checks/${f}`, '-q', '999'], { cwd: REPO, encoding: 'utf8' });
      assert.equal(r.status, 0, `${basename(f)}: asking for an unchecked question must not crash`);
      assert.match(r.stdout, /no numeric check/, `${basename(f)}: an unchecked question must be reported as such`);
    }
  }
});

test('the second-pass record matches the key files it claims to have re-derived', () => {
  const p = resolve(REPO, 'editorial/derived-keys/second-pass-2026-11-20.json');
  const rec = JSON.parse(readFileSync(p, 'utf8'));
  assert.equal(rec.pass, 'second-pass');
  assert.match(rec.independence, /NOT independent/, 'the record must not claim independence it does not have');

  let total = 0;
  for (const y of YEARS) {
    const yrs = rec.years[String(y)];
    assert.ok(yrs, `${y}: missing from the second-pass record`);
    const solved = KEYS[y].entries.filter((e) => e.tier === 'derived-provisional');
    assert.equal(yrs.solved, solved.length, `${y}: solved count drifted`);
    assert.equal(yrs.reAnswered, solved.length, `${y}: every solved item must have been re-answered`);
    assert.equal(yrs.disagreements, Object.keys(yrs.adjudication).length, `${y}: disagreement count drifted`);

    // every adjudication must point at a real item, and the recorded answer must still be the key's
    for (const [q, a] of Object.entries(yrs.adjudication)) {
      const e = solved.find((x) => x.q === Number(q));
      assert.ok(e, `${y} Q${q}: adjudication names an item that is not provisionally solved`);
      assert.equal((e.answer || []).join(''), a.recorded, `${y} Q${q}: recorded answer changed since adjudication`);
      assert.notEqual(a.secondPass, a.recorded, `${y} Q${q}: a non-disagreement is recorded as a disagreement`);
      assert.ok(a.note.length > 40, `${y} Q${q}: adjudication needs a real reason`);
      assert.equal(a.verdict, 'recorded-stands');
    }
    total += yrs.disagreements;
  }
  assert.equal(total, 48, 'the second pass found 48 disagreements; changing that claim needs new evidence');
});

test('no entry claims a verification tier without the evidence that tier requires', () => {
  for (const y of YEARS) {
    for (const e of KEYS[y].entries) {
      if (e.tier !== 'derived-verified') continue;
      const machineVerified = e.machineCheck && e.machineCheck.pass === true && e.machineCheck.command;
      const crossVerified = e.crossCheck && e.crossCheck.verdict === 'agree' && e.crossCheck.independent === true;
      assert.ok(
        machineVerified || crossVerified,
        `${y} Q${e.q}: derived-verified needs a passing machine check or an independent cross-check`,
      );
    }
  }
});
