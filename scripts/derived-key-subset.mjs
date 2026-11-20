#!/usr/bin/env node
/**
 * derived-key-subset.mjs — what "the authorised text-layer slice" means, mechanically.
 *
 * The owner authorised (2026-11-20) a text-layer-only subset to be solved as
 * `derived-provisional`, because no page image can be produced in this sandbox.
 * A subset defined by prose is unfalsifiable, so it is defined here as a pure
 * function of `src/data/papers.json` plus the documented defect lists taken from
 * each year's pre-flight record. Re-running this script reproduces the list
 * exactly; nothing about membership is decided at solve time.
 *
 * Excluded, in order:
 *   1. the record is missing or its stem is empty            (S6 / corpus gap)
 *   2. it carries fewer or more than four options, or an
 *      option's text is empty                               (options unreadable)
 *   3. `figure` is true or `optionsComplete` is false        (image-dependent)
 *   4. an option contains a printed section heading          (transcription bleed)
 *   5. it appears in that year's documented defect list       (see DEFECTS)
 *
 * Anything excluded is still an entry in the key file — held, with a reason.
 * Nothing here decides an answer or a tier.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');

/** Printed section headings, used to detect bleed into an option. */
const HEADINGS = [
  'MATHEMATICS',
  'ELECTRICAL TECHNOLOGY',
  'COMPUTER APPLICATION',
  'COMPUTER & IT',
  'ENVIRONMENTAL ENGINEERING',
  'ENGINEERING MECHANICS',
  'STRENGTH OF MATERIALS',
];

/**
 * Documented defects per year, each traced to a pre-flight record.
 * `reason` is what the entry's holdReason/note will say.
 */
export const DEFECTS = {
  2017: {
    18: 'stem substituted: the corpus carries a different textbook example (2017-preflight)',
    83: 'option (A) is a transcriber placeholder, not printed text (2017-preflight)',
  },
  2018: {
    2: 'stem substituted; the corpus determinant vanishes only at x = 10, not an option (2018-preflight)',
    13: 'stem substituted with a different textbook example (2018-preflight)',
    19: 'stem substituted with a different textbook example (2018-preflight)',
  },
  2019: {
    13: 'option (B) is an unprinted option replacing a printed one; order changed (2019-preflight)',
    41: 'stem substituted: (0.875)10 in the corpus, (0.6975)10 in the booklet (2019-preflight)',
    47: 'the C program itself was rewritten, changing what is asked (2019-preflight)',
    49: 'options (C) and (D) altered from the print (2019-preflight)',
    73: 'one printed option lost, another duplicated (2019-preflight)',
    77: 'corpus record empty; the booklet prints the question (2019-preflight)',
    78: 'absent from the corpus; printed on booklet page 16 (2019-preflight)',
    79: 'absent from the corpus; printed on booklet page 16 (2019-preflight)',
    87: 'a printed option dropped and an unprinted one invented (2019-preflight)',
    94: 'printed text options lost; the corpus has none (2019-preflight)',
  },
  2021: {
    3: 'determinant rows reordered by the transcription (2021-preflight)',
    16: 'two printed options not represented; option (A) lost its constant (2021-preflight)',
    72: 'option lettering differs from the print (2021-preflight)',
    73: 'denominators reassigned, so the letters do not mean what the paper means (2021-preflight)',
    74: 'an h was added inside option (A) (2021-preflight)',
    77: 'option (A) prints an ambiguous glyph; the corpus chose one reading (2021-preflight)',
  },
};

/** Does an option carry a section heading bled in from the next column? */
export function hasBleed(text) {
  const t = (text || '').toUpperCase();
  return HEADINGS.some((h) => t.includes(h));
}

function loadCorpus() {
  return JSON.parse(readFileSync(resolve(REPO, 'src/data/papers.json'), 'utf8'));
}

/**
 * @param {number} year
 * @param {object} [corpus] parsed papers.json (optional, for reuse)
 * @returns {{year:number, questionCount:number, candidates:number[], excluded:Array<{q:number,reason:string}>}}
 */
export function subsetFor(year, corpus = loadCorpus()) {
  const paper = corpus.papers.find((p) => p.year === year);
  if (!paper) throw new Error(`no corpus paper for ${year}`);
  const defects = DEFECTS[year] || {};
  const candidates = [];
  const excluded = [];

  for (let q = 1; q <= paper.questionCount; q += 1) {
    const rec = paper.questions.find((r) => r.n === q);
    if (!rec) { excluded.push({ q, reason: 'absent from the corpus' }); continue; }
    if (!(rec.stem || '').trim()) { excluded.push({ q, reason: 'empty stem in the corpus' }); continue; }
    if (!Array.isArray(rec.options) || rec.options.length !== 4) {
      excluded.push({ q, reason: `corpus carries ${(rec.options || []).length} options, not 4` }); continue;
    }
    if (rec.options.some((o) => !(o.text || '').trim())) {
      excluded.push({ q, reason: 'at least one option is empty in the corpus' }); continue;
    }
    if (rec.figure) { excluded.push({ q, reason: 'figure-dependent' }); continue; }
    if (rec.optionsComplete === false) { excluded.push({ q, reason: 'options incomplete in the corpus' }); continue; }
    const bleed = rec.options.find((o) => hasBleed(o.text));
    if (bleed) { excluded.push({ q, reason: `printed section heading bled into option ${bleed.label}` }); continue; }
    if (defects[q]) { excluded.push({ q, reason: defects[q] }); continue; }
    candidates.push(q);
  }

  return { year, questionCount: paper.questionCount, candidates, excluded };
}

/** Convenience: the subset for every year the phase covers. */
export function allSubsets(years = [2017, 2018, 2019, 2021]) {
  const corpus = loadCorpus();
  return years.map((y) => subsetFor(y, corpus));
}

// CLI: `node scripts/derived-key-subset.mjs` prints a per-year summary.
if (import.meta.url === `file://${process.argv[1]}`) {
  for (const s of allSubsets()) {
    console.log(
      `${s.year}: ${s.candidates.length} of ${s.questionCount} in the authorised slice, ` +
      `${s.excluded.length} excluded`,
    );
    const byReason = {};
    for (const e of s.excluded) {
      const key = e.reason.replace(/\d+/g, 'N');
      byReason[key] = (byReason[key] || 0) + 1;
    }
    for (const [reason, n] of Object.entries(byReason)) console.log(`   ${n}  ${reason}`);
  }
}
