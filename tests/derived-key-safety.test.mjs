import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateKeyFile } from '../scripts/validate-keys.mjs';

const prefix = 'editorial/derived-keys/2017/';
function fixture() {
  return {
    schemaVersion: '1.1.0', paper: { id: 'jelet-et-p1-2017', year: 2017 },
    booklet: { documentRef: null, streamSet: 'main' }, provenance: { questionCount: 1 },
    scoring: { ownerApprovedForScoring: false, integrationGates: { gateA_disputedMappingFixed: false, gateB_setStatedInMetadata: true } },
    entries: [{ q: 1, category: 'I', section: 'Mathematics', streamSet: 'main', sourcePage: null,
      sourceImage: null, officialText: 'Synthetic test input; not an exam question.', optionFidelity: 'corpus-text-unverified',
      figure: 'unverified', figureNote: null, answer: ['A'], tier: 'derived-provisional', confidence: 'low',
      reasoning: 'Synthetic fixture, no real answer asserted.', verification: 'Synthetic verification note.',
      machineCheck: null, crossCheck: null, scoringEligibility: 'held', holdReason: 'no-approved-tier',
      disputeId: null, note: null, practiceReports: [] }], disputes: [],
    reconciliation: { matched: 1, missingInCorpus: [], extraInCorpus: [], bookletQuestionCount: 1, corpusQuestionCount: 1 },
    status: {},
  };
}
function tally(k) {
  const e = k.entries[0];
  k.status = { tierCounts: Object.fromEntries(['official', 'derived-verified', 'derived-provisional', 'disputed', 'unsolved'].map(t => [t, +(e?.tier === t)])),
    eligibleCount: +(e?.scoringEligibility === 'eligible'), heldCount: +(e?.scoringEligibility === 'held'),
    heldReasons: e?.scoringEligibility === 'held' ? { [e.holdReason]: 1 } : {},
    disputedCount: +(e?.tier === 'disputed'), openDisputes: 0,
    machineCheckedCount: +!!e?.machineCheck, crossCheckedCount: +!!e?.crossCheck };
  return k;
}
function errors(k, root) { return validateKeyFile(tally(k), { evidenceRoot: root }).errors; }
function evidence(t) {
  const root = mkdtempSync(join(tmpdir(), 'jelet-validator-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, prefix, 'pages'), { recursive: true });
  mkdirSync(join(root, prefix, 'checks'), { recursive: true });
  // Deliberately not an image: unit tests check path/existence, not content authenticity.
  writeFileSync(join(root, prefix, 'pages/fixture.txt'), 'synthetic evidence placeholder');
  writeFileSync(join(root, prefix, 'checks/q1.py'), '# never executed by validator\n');
  return root;
}
function verified() {
  const k = fixture();
  Object.assign(k.entries[0], { tier: 'derived-verified', sourcePage: 1,
    sourceImage: prefix + 'pages/fixture.txt', optionFidelity: 'verbatim', figure: 'none',
    crossCheck: { solver: 'synthetic independent reviewer', independent: true, verdict: 'agree' } });
  return k;
}
function eligible() {
  const k = verified();
  k.scoring.ownerApprovedForScoring = true;
  k.scoring.integrationGates.gateA_disputedMappingFixed = true;
  Object.assign(k.entries[0], { scoringEligibility: 'eligible', holdReason: null });
  return k;
}

test('provisional and unsolved remain valid held records without page evidence', () => {
  assert.deepEqual(errors(fixture()), []);
  const k = fixture(); Object.assign(k.entries[0], { tier: 'unsolved', answer: null, holdReason: 'corpus-defect' });
  assert.deepEqual(errors(k), []);
});
test('regression: bare promotion with adjusted totals is rejected', () => {
  const k = fixture(); k.entries[0].tier = 'derived-verified';
  const result = errors(k).join('\n');
  assert.match(result, /requires an existing sourceImage/);
  assert.match(result, /independent agreeing crossCheck/);
});
test('well-formed verified held and eligible fixtures pass structural checks', t => {
  const root = evidence(t);
  assert.deepEqual(errors(verified(), root), []);
  assert.deepEqual(errors(eligible(), root), []);
});
for (const approval of [undefined, null, false, 'true', 1]) {
  test(`eligibility rejects approval ${String(approval)}`, t => {
    const root = evidence(t); const k = eligible(); k.scoring.ownerApprovedForScoring = approval;
    assert.match(errors(k, root).join('\n'), /ownerApprovedForScoring/);
  });
}
for (const gate of ['gateA_disputedMappingFixed', 'gateB_setStatedInMetadata']) {
  test(`eligibility requires ${gate}`, t => {
    const root = evidence(t); const k = eligible(); delete k.scoring.integrationGates[gate];
    assert.match(errors(k, root).join('\n'), new RegExp(gate));
  });
}
test('verified means page-checked and independently cross-checked, not machine-only', t => {
  const root = evidence(t); const k = verified(); k.entries[0].crossCheck = null;
  k.entries[0].machineCheck = { method: 'synthetic', expected: '1', observed: '1', pass: true, command: `python3 ${prefix}checks/q1.py -q 1` };
  assert.match(errors(k, root).join('\n'), /independent agreeing crossCheck/);
  k.entries[0].crossCheck = { solver: 'same reviewer', independent: false, verdict: 'agree' };
  assert.match(errors(k, root).join('\n'), /independent agreeing crossCheck/);
});
test('missing files, traversal, other years and symlinks cannot establish evidence', t => {
  const root = evidence(t);
  symlinkSync(join(root, prefix, 'checks/q1.py'), join(root, prefix, 'pages/link.txt'));
  for (const path of [prefix + 'pages/missing.png', prefix + 'pages/../checks/q1.py',
    'editorial/derived-keys/2018/pages/fixture.txt', prefix + 'pages/link.txt']) {
    const k = verified(); k.entries[0].sourceImage = path;
    assert.match(errors(k, root).join('\n'), /sourceImage/);
  }
});
test('eligible figures, unresolved fidelity, mismatched streams and multiple letters are rejected', t => {
  const root = evidence(t);
  for (const patch of [{ figure: 'unverified' }, { figure: 'read-from-image' },
    { optionFidelity: 'corpus-text-unverified' }, { streamSet: 'alternate' }, { answer: ['A', 'B'] }]) {
    const k = eligible(); Object.assign(k.entries[0], patch); assert.ok(errors(k, root).length > 0);
  }
});
test('passing checks must refer to confined existing scripts, never arbitrary shell commands', t => {
  const root = evidence(t);
  for (const command of ['echo PASS', `python3 ${prefix}checks/missing.py`,
    `python3 ${prefix}checks/q1.py -q 2`, `python3 ${prefix}checks/q1.py; echo PASS`]) {
    const k = fixture(); k.entries[0].machineCheck = { method: 'test', expected: '1', observed: '1', pass: true, command };
    assert.match(errors(k, root).join('\n'), /machine check|machineCheck/);
  }
  const k = fixture(); k.entries[0].machineCheck = { method: 'test', expected: '1', observed: '1', pass: true, command: `python3 ${prefix}checks/q1.py -q 1` };
  assert.deepEqual(errors(k, root), []);
});
test('malformed entries and verification fields return errors rather than crash', () => {
  const k = fixture(); k.entries[0].verification = 42;
  assert.match(errors(k).join('\n'), /verification note/);
  k.entries[0] = null;
  assert.ok(errors(k).length > 0);
});
test('unknown schema and tier cannot slip through', () => {
  const k = fixture(); k.schemaVersion = '999'; k.entries[0].tier = 'trusted';
  assert.match(errors(k).join('\n'), /unsupported schemaVersion/);
  assert.match(errors(k).join('\n'), /tier.*not in/);
});
