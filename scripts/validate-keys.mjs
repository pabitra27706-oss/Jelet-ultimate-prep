#!/usr/bin/env node
/**
 * validate-keys.mjs — the schema rules of docs/phases/09-derived-keys/SCHEMA.md,
 * enforced in code.
 *
 * Why this exists: the phase's own worked examples contained three classes of
 * defect that prose did not catch — an answer that its own verification
 * contradicted, tier totals that could not coexist with the eligibility policy,
 * and a reconciliation identity that could never balance. Every one of those is
 * mechanically detectable, so it is detected here rather than trusted.
 *
 * Usage:
 *   node scripts/validate-keys.mjs                       # every key file under editorial/derived-keys/
 *   node scripts/validate-keys.mjs editorial/derived-keys/2017/2017-keys.json
 *
 * Exit 1 on any error. Warnings never fail the run.
 */

import { readFileSync, existsSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative, isAbsolute } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');
const KEY_ROOTS = resolve(REPO, 'editorial/derived-keys');

/** Target derived-work years: no publisher key has been established for these inputs. */
export const NO_OFFICIAL_TIER = [2017, 2018, 2019, 2021];

export const TIERS = ['official', 'derived-verified', 'derived-provisional', 'disputed', 'unsolved'];
export const FIDELITY = ['verbatim', 'text-layer', 'corpus-text-unverified', 'figure-based', 'unreproduced', 'transcription-conflict'];
export const FIGURE = ['none', 'unverified', 'read-from-image', 'unreadable', 'not-present'];
export const ELIGIBILITY = ['eligible', 'held'];
export const HOLD_REASONS = [
  'figure-not-reproduced', 'options-not-reproduced', 'input-unreadable',
  'ambiguous-input', 'no-approved-tier', 'category-undetermined',
  'outside-authorized-subset', 'absent-from-corpus', 'corpus-defect', 'not-yet-solved',
];
export const CATEGORIES = ['I', 'II', null];
export const CONFIDENCE = ['high', 'medium', 'low'];
export const CROSS_VERDICTS = ['agree', 'disagree', 'undetermined'];

const ENTRY_FIELDS = [
  'q', 'category', 'section', 'streamSet', 'sourcePage', 'sourceImage', 'officialText',
  'optionFidelity', 'figure', 'figureNote', 'answer', 'tier', 'confidence', 'reasoning',
  'verification', 'machineCheck', 'crossCheck', 'scoringEligibility', 'holdReason',
  'disputeId', 'note', 'practiceReports',
];

// Based on PR #9 at 6a14ac1; hardened under phase 10. No answer records imported.
// Validation checks evidence structure, not mathematical correctness or independence.
function evidenceExists(root, path, prefix) {
  if (typeof path !== 'string' || !path.startsWith(prefix) || path.includes('\\')) return false;
  const tail = path.slice(prefix.length);
  if (!tail || tail.split('/').some(p => !p || p === '.' || p === '..')) return false;
  try {
    const repo = realpathSync(root);
    const base = realpathSync(resolve(root, prefix));
    const file = realpathSync(resolve(root, path));
    const inside = (a, b) => { const r = relative(a, b); return r && !r.startsWith('..') && !isAbsolute(r); };
    return inside(repo, base) && inside(base, file) && statSync(file).isFile();
  } catch { return false; }
}
const nonempty = v => typeof v === 'string' && v.trim().length > 0;

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/**
 * Validate one parsed key file.
 * @returns {{errors:string[], warnings:string[]}}
 */
export function validateKeyFile(key, { corpus, path = '<memory>', evidenceRoot = REPO } = {}) {
  const errors = [];
  const warnings = [];
  const err = (m) => errors.push(m);
  const warn = (m) => warnings.push(m);

  if (!isPlainObject(key)) return { errors: [`${path}: not a JSON object`], warnings };

  // ---- header -------------------------------------------------------------
  if (!['1.0.0', '1.1.0'].includes(key.schemaVersion)) err('unsupported schemaVersion');
  const year = key?.paper?.year;
  if (!Number.isInteger(year)) err('paper.year must be an integer');
  const expectedId = `jelet-et-p1-${year}`;
  if (key?.paper?.id !== expectedId) err(`paper.id should be ${expectedId}, found ${key?.paper?.id}`);
  if (key?.paper?.examBoard !== 'West Bengal Joint Entrance Examinations Board (WBJEEB)') {
    warn('paper.examBoard is not the full board name');
  }
  if (!('documentRef' in (key.booklet || {}))) err('booklet.documentRef missing (null is a value, absent is not)');

  const entries = key.entries;
  if (!Array.isArray(entries)) return { errors: [...errors, 'entries is not an array'], warnings };
  const n = key?.provenance?.questionCount;
  if (!Number.isInteger(n) || n < 1) err('provenance.questionCount must be a positive integer');
  if (n !== entries.length) err(`provenance.questionCount ${n} != ${entries.length} entries`);

  // ---- per-entry ----------------------------------------------------------
  const seen = new Set();
  entries.forEach((e, i) => {
    const at = `entries[${i}]${e && e.q != null ? ` (q=${e.q})` : ''}`;
    if (!isPlainObject(e)) { err(`${at}: not an object`); return; }
    for (const f of ENTRY_FIELDS) if (!(f in e)) err(`${at}: field '${f}' missing`);
    if (!Number.isInteger(e.q)) err(`${at}: q must be an integer`);
    if (seen.has(e.q)) err(`${at}: duplicate q`);
    seen.add(e.q);
    if (!CATEGORIES.includes(e.category)) err(`${at}: category '${e.category}' not allowed`);
    if (!TIERS.includes(e.tier)) err(`${at}: tier '${e.tier}' not in ${TIERS.join(', ')}`);
    if (!FIDELITY.includes(e.optionFidelity)) err(`${at}: optionFidelity '${e.optionFidelity}' not allowed`);
    if (!FIGURE.includes(e.figure)) err(`${at}: figure '${e.figure}' not allowed`);
    if (!ELIGIBILITY.includes(e.scoringEligibility)) err(`${at}: scoringEligibility '${e.scoringEligibility}' not allowed`);
    if (e.holdReason !== null && !HOLD_REASONS.includes(e.holdReason)) err(`${at}: holdReason '${e.holdReason}' not allowed`);
    if (e.confidence !== null && !CONFIDENCE.includes(e.confidence)) err(`${at}: confidence '${e.confidence}' not allowed`);
    if (e.tier === 'official' && NO_OFFICIAL_TIER.includes(year)) {
      err(`${at}: tier 'official' is forbidden for ${year} — no publisher key has been established for this input`);
    }
    if (!Array.isArray(e.answer) && e.answer !== null) err(`${at}: answer must be an array or null`);
    if (Array.isArray(e.answer)) {
      for (const a of e.answer) if (!['A', 'B', 'C', 'D'].includes(a)) err(`${at}: answer letter '${a}' invalid`);
      if (new Set(e.answer).size !== e.answer.length) err(`${at}: duplicate answer letters`);
    }

    // tier <-> answer coupling
    if ((e.tier === 'derived-verified' || e.tier === 'derived-provisional') && (!Array.isArray(e.answer) || e.answer.length === 0)) {
      err(`${at}: tier '${e.tier}' requires a non-empty answer`);
    }
    if (e.tier === 'unsolved') {
      if (e.answer !== null) err(`${at}: tier 'unsolved' must carry answer null`);
      if (!e.holdReason) err(`${at}: tier 'unsolved' must carry a holdReason`);
    }
    if (e.tier === 'disputed' && !e.disputeId) err(`${at}: tier 'disputed' requires a disputeId`);

    // eligibility coupling
    if (e.scoringEligibility === 'held' && !e.holdReason) err(`${at}: held item must name a holdReason`);
    if (e.scoringEligibility === 'eligible' && e.holdReason !== null) err(`${at}: eligible item must have holdReason null`);
    if (e.scoringEligibility === 'eligible' && e.tier !== 'derived-verified') {
      err(`${at}: only derived-verified may be eligible, found '${e.tier}'`);
    }

    // fidelity <-> evidence coupling
    if (e.optionFidelity === 'verbatim' && !e.sourceImage) {
      err(`${at}: optionFidelity 'verbatim' requires a sourceImage — verbatim means read off the page`);
    }
    const imagePresent = evidenceExists(evidenceRoot, e.sourceImage, `editorial/derived-keys/${year}/pages/`);
    if (e.sourceImage !== null && !imagePresent) {
      err(`${at}: sourceImage must name an existing file confined to this year's pages directory`);
    }
    if (e.tier === 'derived-verified') {
      if (!imagePresent) err(`${at}: derived-verified requires an existing sourceImage`);
      if (!Number.isInteger(e.sourcePage) || e.sourcePage < 1) err(`${at}: verified sourcePage must be positive`);
      if (!['verbatim', 'text-layer', 'transcription-conflict', 'figure-based'].includes(e.optionFidelity)) {
        err(`${at}: derived-verified requires page-checked option fidelity`);
      }
      if (!nonempty(e.reasoning) || !nonempty(e.officialText)) err(`${at}: verified reasoning and source text are required`);
      if (!(e.crossCheck?.independent === true && e.crossCheck?.verdict === 'agree' && nonempty(e.crossCheck?.solver))) {
        err(`${at}: derived-verified requires a named independent agreeing crossCheck`);
      }
      if (e.machineCheck && e.machineCheck.pass !== true) err(`${at}: failed machine check blocks verification`);
    }
    if (e.scoringEligibility === 'eligible') {
      if (key.scoring?.ownerApprovedForScoring !== true) err(`${at}: ownerApprovedForScoring must be explicitly true`);
      for (const gate of ['gateA_disputedMappingFixed', 'gateB_setStatedInMetadata']) {
        if (key.scoring?.integrationGates?.[gate] !== true) err(`${at}: integration gate ${gate} must be true`);
      }
      if (e.figure !== 'none' || e.optionFidelity === 'figure-based') err(`${at}: figure-dependent or unverified presentation must be held`);
      if (e.category !== 'I' || e.answer?.length !== 1) err(`${at}: target paper eligibility requires Category I and one answer`);
      if (!nonempty(key.booklet?.streamSet) || e.streamSet !== key.booklet.streamSet) err(`${at}: eligible streamSet must match booklet metadata`);
    }

    // machine check shape
    if (e.machineCheck !== null && e.machineCheck !== undefined) {
      const mc = e.machineCheck;
      if (!isPlainObject(mc)) err(`${at}: machineCheck must be an object or null`);
      else {
        for (const f of ['method', 'expected', 'observed', 'pass']) if (!(f in mc)) err(`${at}: machineCheck missing '${f}'`);
        if (typeof mc.pass !== 'boolean') err(`${at}: machineCheck.pass must be a boolean`);
        // A pass is a claim about a run, so it has to name the run. Without this the
        // field can be set by hand, which is the failure mode this phase exists to stop.
        if (mc.pass === true && !mc.command) err(`${at}: machineCheck.pass is true but no command reproduces it`);
        if (mc.pass === true && typeof mc.command === 'string' && !/^(python3|node) /.test(mc.command)) {
          err(`${at}: machineCheck.command must start with an interpreter, not '${mc.command.split(' ')[0]}'`);
        }
        if (mc.pass === true) {
          const match = typeof mc.command === 'string' && /^(python3|node) (editorial\/derived-keys\/\d{4}\/checks\/[\w-]+\.(?:py|mjs|js))(?: -q (\d+))?$/.exec(mc.command);
          if (!match || (match[3] && Number(match[3]) !== e.q) ||
              !evidenceExists(evidenceRoot, match[2], `editorial/derived-keys/${year}/checks/`)) {
            err(`${at}: passing machine check must name an existing confined check script and the correct question; shell commands are forbidden`);
          }
        }
        if (mc.pass === true && (e.tier === 'disputed')) warn(`${at}: machineCheck passed on a disputed item`);
      }
    }

    // cross check shape
    if (e.crossCheck !== null && e.crossCheck !== undefined) {
      if (!isPlainObject(e.crossCheck)) err(`${at}: crossCheck must be an object or null`);
      else if (!CROSS_VERDICTS.includes(e.crossCheck.verdict)) err(`${at}: crossCheck.verdict invalid`);
      else if (e.crossCheck.verdict === 'agree' && e.tier === 'derived-provisional') {
        warn(`${at}: crossCheck agrees but the tier is provisional — provisional means not independently cross-checked`);
      }
    }

    // a solved item must say something about how it was checked
    if ((e.tier === 'derived-verified' || e.tier === 'derived-provisional') && !nonempty(e.verification)) {
      err(`${at}: tier '${e.tier}' requires a verification note`);
    }
  });

  // complete numbering 1..n
  for (let q = 1; q <= (Number.isInteger(n) ? n : 0); q += 1) {
    if (!seen.has(q)) err(`no entry for question ${q}`);
  }
  for (const q of seen) if (Number.isInteger(n) && (q < 1 || q > n)) err(`entry q=${q} outside 1..${n}`);

  // ---- disputes -----------------------------------------------------------
  const disputes = Array.isArray(key.disputes) ? key.disputes : null;
  if (!disputes) err('disputes is not an array');
  else {
    const ids = new Set();
    for (const d of disputes) {
      if (!isPlainObject(d)) { err('dispute is not an object'); continue; }
      if (!d.id) err('dispute without id');
      if (ids.has(d.id)) err(`duplicate dispute id ${d.id}`);
      ids.add(d.id);
      if (!Number.isInteger(d.q)) err(`dispute ${d.id}: q must be an integer`);
      if (d.status !== 'open' && d.status !== 'resolved') err(`dispute ${d.id}: status must be open|resolved`);
      if (d.status === 'resolved' && (!d.resolution || d.resolution === 'unresolved')) {
        err(`dispute ${d.id}: resolved status requires a resolution`);
      }
    }
    for (const e of entries.filter(isPlainObject)) {
      if (e.tier === 'disputed' && e.disputeId && !ids.has(e.disputeId)) {
        err(`q=${e.q}: disputeId ${e.disputeId} not present in disputes`);
      }
    }
  }

  // ---- reconciliation -----------------------------------------------------
  const rec = key.reconciliation;
  if (!isPlainObject(rec)) err('reconciliation missing');
  else {
    const matched = rec.matched;
    const missing = Array.isArray(rec.missingInCorpus) ? rec.missingInCorpus.length : NaN;
    const extra = Array.isArray(rec.extraInCorpus) ? rec.extraInCorpus.length : NaN;
    if (!Number.isInteger(matched)) err('reconciliation.matched must be an integer');
    if (matched + missing !== rec.bookletQuestionCount) {
      err(`reconciliation: matched ${matched} + missing ${missing} != bookletQuestionCount ${rec.bookletQuestionCount}`);
    }
    if (matched + extra !== rec.corpusQuestionCount) {
      err(`reconciliation: matched ${matched} + extra ${extra} != corpusQuestionCount ${rec.corpusQuestionCount}`);
    }
    if (corpus) {
      const paper = corpus.papers.find((p) => p.year === year);
      if (paper) {
        const corpusNums = new Set(paper.questions.map((q) => q.n));
        if (rec.corpusQuestionCount !== corpusNums.size) {
          err(`reconciliation.corpusQuestionCount ${rec.corpusQuestionCount} != corpus ${corpusNums.size}`);
        }
        const missingNums = (rec.missingInCorpus || []).map((m) => m.q).sort((a, b) => a - b);
        const expectedMissing = [];
        for (let q = 1; q <= (rec.bookletQuestionCount || 0); q += 1) if (!corpusNums.has(q)) expectedMissing.push(q);
        if (JSON.stringify(missingNums) !== JSON.stringify(expectedMissing)) {
          err(`reconciliation.missingInCorpus ${JSON.stringify(missingNums)} != corpus gap ${JSON.stringify(expectedMissing)}`);
        }
        const extraNums = (rec.extraInCorpus || []).map((m) => m.q).sort((a, b) => a - b);
        const expectedExtra = [...corpusNums].filter((q) => q > (rec.bookletQuestionCount || Infinity)).sort((a, b) => a - b);
        if (JSON.stringify(extraNums) !== JSON.stringify(expectedExtra)) {
          err(`reconciliation.extraInCorpus ${JSON.stringify(extraNums)} != ${JSON.stringify(expectedExtra)}`);
        }
        if (matched !== corpusNums.size - extraNums.length) {
          err(`reconciliation.matched ${matched} should equal corpus records that also appear in the booklet`);
        }
      }
    }
  }

  // ---- status -------------------------------------------------------------
  const st = key.status;
  if (!isPlainObject(st)) err('status missing');
  else {
    const tally = { official: 0, 'derived-verified': 0, 'derived-provisional': 0, disputed: 0, unsolved: 0 };
    let eligible = 0; let held = 0; let disputesOpen = 0; let machineChecked = 0; let crossChecked = 0;
    const heldReasons = {};
    for (const e of entries.filter(isPlainObject)) {
      tally[e.tier] = (tally[e.tier] || 0) + 1;
      if (e.scoringEligibility === 'eligible') eligible += 1; else held += 1;
      if (e.scoringEligibility === 'held') heldReasons[e.holdReason] = (heldReasons[e.holdReason] || 0) + 1;
      if (e.machineCheck) machineChecked += 1;
      if (e.crossCheck) crossChecked += 1;
    }
    for (const d of disputes || []) if (d.status === 'open') disputesOpen += 1;

    for (const [tier, count] of Object.entries(st.tierCounts || {})) {
      if ((tally[tier] || 0) !== count) err(`status.tierCounts.${tier} ${count} != recomputed ${tally[tier] || 0}`);
    }
    for (const [tier, count] of Object.entries(tally)) {
      if (!(tier in (st.tierCounts || {}))) err(`status.tierCounts is missing '${tier}' (recomputed ${count})`);
    }
    if (st.eligibleCount !== eligible) err(`status.eligibleCount ${st.eligibleCount} != recomputed ${eligible}`);
    if (st.heldCount !== held) err(`status.heldCount ${st.heldCount} != recomputed ${held}`);
    if (st.disputedCount !== (tally.disputed || 0)) err(`status.disputedCount ${st.disputedCount} != recomputed ${tally.disputed || 0}`);
    if (st.openDisputes !== disputesOpen) err(`status.openDisputes ${st.openDisputes} != recomputed ${disputesOpen}`);
    if (st.machineCheckedCount !== undefined && st.machineCheckedCount !== machineChecked) {
      err(`status.machineCheckedCount ${st.machineCheckedCount} != recomputed ${machineChecked}`);
    }
    if (st.crossCheckedCount !== undefined && st.crossCheckedCount !== crossChecked) {
      err(`status.crossCheckedCount ${st.crossCheckedCount} != recomputed ${crossChecked}`);
    }

    // invariants
    const tierSum = Object.values(tally).reduce((a, b) => a + b, 0);
    if (tierSum !== entries.length) err(`tier totals ${tierSum} != ${entries.length} entries`);
    if (st.eligibleCount + st.heldCount !== entries.length) {
      err(`eligible ${st.eligibleCount} + held ${st.heldCount} != ${entries.length}`);
    }
    if (st.eligibleCount > (tally['derived-verified'] || 0)) {
      err(`eligibleCount ${st.eligibleCount} > derived-verified ${tally['derived-verified'] || 0} (only verified may be eligible)`);
    }
    const reasonSum = Object.values(st.heldReasons || {}).reduce((a, b) => a + b, 0);
    if (reasonSum !== st.heldCount) err(`sum of heldReasons ${reasonSum} != heldCount ${st.heldCount}`);
    for (const [reason, count] of Object.entries(heldReasons)) {
      if ((st.heldReasons || {})[reason] !== count) err(`status.heldReasons.${reason} ${(st.heldReasons || {})[reason]} != recomputed ${count}`);
    }

    // the scoring policy must be consistent with the counts
    // Check the policy against what the entries actually say, not against the
    // summary the file reports — otherwise a wrong summary hides a wrong file.
    const approved = key?.scoring?.ownerApprovedForScoring;
    if (approved !== true && eligible > 0) {
      err(`scoring.ownerApprovedForScoring is not true but ${eligible} entries claim 'eligible' — every item must be held`);
    }
  }

  return { errors, warnings };
}

/** Validate every key file found under editorial/derived-keys/ (or the given paths). */
export function validatePaths(paths) {
  const corpusPath = resolve(REPO, 'src/data/papers.json');
  const corpus = existsSync(corpusPath) ? JSON.parse(readFileSync(corpusPath, 'utf8')) : null;
  const targets = paths && paths.length ? paths.map((p) => resolve(REPO, p)) : discover();
  const results = [];
  for (const file of targets) {
    let parsed;
    try { parsed = JSON.parse(readFileSync(file, 'utf8')); }
    catch (e) { results.push({ file, errors: [`cannot parse: ${e.message}`], warnings: [] }); continue; }
    results.push({ file, ...validateKeyFile(parsed, { corpus, path: file }) });
  }
  return results;
}

function discover() {
  if (!existsSync(KEY_ROOTS)) return [];
  const out = [];
  for (const dir of readdirSync(KEY_ROOTS, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const sub = join(KEY_ROOTS, dir.name);
    for (const f of readdirSync(sub)) {
      if (/^\d{4}-keys\.json$/.test(f)) out.push(join(sub, f));
    }
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const results = validatePaths(process.argv.slice(2));
  if (!results.length) { console.log('no key files found'); process.exit(0); }
  let failed = 0;
  for (const r of results) {
    const rel = r.file.replace(`${REPO}/`, '');
    if (r.errors.length) {
      failed += 1;
      console.log(`FAIL ${rel}`);
      for (const e of r.errors) console.log(`  error: ${e}`);
    } else {
      console.log(`PASS ${rel}`);
    }
    for (const w of r.warnings) console.log(`  warning: ${w}`);
  }
  process.exit(failed ? 1 : 0);
}
