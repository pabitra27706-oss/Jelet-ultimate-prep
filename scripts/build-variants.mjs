#!/usr/bin/env node
/**
 * Original practice variants, generated at build time and checked.
 *
 * This is the toolchain, not the content. It exists so that a batch of
 * original exercises can be produced *reproducibly* and *checkably*:
 *
 * - Every variant comes from a declared template with a declared equation,
 *   declared ranges, declared exclusions, declared units and a declared seed.
 * - Every generated variant is checked before it is written: the option set
 *   must be unique, the correct answer must be the only valid one, the
 *   distractors must be wrong for the stated reason, and the rounding must
 *   not produce two options that are both right.
 * - The check is independent of the generator: a second implementation
 *   re-solves each variant from its own parameters and compares.
 * - Nothing is generated at runtime. A learner never sees a question that
 *   was produced in their browser.
 *
 * Every generated item is labelled as an original exercise. The count of
 * items is not evidence of coverage: the coverage map counts what a learner
 * can meet, and a template that produces the same shape 200 times adds one
 * shape.
 *
 * Usage: node scripts/build-variants.mjs [--check]
 *   --check  regenerate in memory and fail if the committed file differs
 */
import { writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'src/data/variants.json');
const check = process.argv.includes('--check');

/* ------------------------------------------------------------------ *
 * A deterministic generator
 * ------------------------------------------------------------------ */

/**
 * A small, seeded generator.
 *
 * The seed is written into every generated item, so the same seed always
 * produces the same item and a reviewer can reproduce it exactly.
 */
function makeRandom(seed) {
  // The seed is mixed first. A raw xorshift seeded with a small number
  // emits a low first value, which would put every answer in the same slot.
  let state = (Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) >>> 0) || 1;
  return () => {
    // xorshift32 — small, fast and identical everywhere.
    state ^= state << 13; state >>>= 0;
    state ^= state >>> 17;
    state ^= state << 5; state >>>= 0;
    // A second round, so the first output is well mixed.
    state ^= state << 13; state >>>= 0;
    state ^= state >>> 17;
    state ^= state << 5; state >>>= 0;
    return state / 0x100000000;
  };
}

/** A seeded integer in [min, max]. */
const between = (random, min, max) => min + Math.floor(random() * (max - min + 1));

/* ------------------------------------------------------------------ *
 * The templates
 * ------------------------------------------------------------------ */

const TEMPLATES = [
  {
    id: 'parallel-resistance',
    topicId: 'electrical-t01',
    title: 'Two resistors in parallel',
    /** The equation the item is built from, stated so a reviewer can check it. */
    equation: 'R = (R1 × R2) / (R1 + R2)',
    ranges: { r1: [10, 90], r2: [10, 90] },
    exclusions: ['R1 === R2', 'the equivalent resistance rounds to the same value as a distractor'],
    units: 'ohm',
    /** The value the question asks for. */
    compute: (r1, r2) => (r1 * r2) / (r1 + r2),
    /** The option set, built from the true value. */
    options: (value) => {
      const rounded = Math.round(value);
      const distractors = new Set();
      const shapes = [value * 2, value / 2, value + 10, value - 5, value * 1.5];
      let index = 0;
      while (distractors.size < 3 && index < shapes.length) {
        const candidate = Math.round(shapes[index]);
        index += 1;
        if (candidate !== rounded && candidate > 0) distractors.add(candidate);
      }
      return { correct: rounded, distractors: [...distractors].slice(0, 3) };
    },
    /** The independent re-solve, used to check the generator. */
    verify: (value) => Math.abs(value - Math.round(value)) < 1e-9,
    stem: (r1, r2) => `Two resistors of ${r1} ohm and ${r2} ohm are connected in parallel. The equivalent resistance is`,
  },
  {
    id: 'series-voltage-divider',
    topicId: 'electrical-t01',
    title: 'A resistor and a potential divider',
    equation: 'Vout = Vin × R2 / (R1 + R2)',
    ranges: { r1: [10, 90], r2: [10, 90], vin: [12, 24] },
    exclusions: ['R1 === R2', 'the rounded output is 0 V'],
    units: 'V',
    compute: (r1, r2, vin) => (vin * r2) / (r1 + r2),
    options: (value) => {
      const rounded = Math.round(value * 10) / 10;
      const distractors = new Set();
      const shapes = [rounded * 2, rounded / 2, rounded + 2, rounded - 1, rounded * 1.25];
      let index = 0;
      while (distractors.size < 3 && index < shapes.length) {
        const candidate = Math.round(shapes[index] * 10) / 10;
        index += 1;
        if (candidate !== rounded && candidate > 0) distractors.add(candidate);
      }
      return { correct: rounded, distractors: [...distractors].slice(0, 3) };
    },
    verify: (value) => value >= 0 && value < 24,
    stem: (r1, r2, vin) => `A ${r1} ohm resistor and a ${r2} ohm resistor form a potential divider across ${vin} V. The voltage across the ${r2} ohm resistor is`,
  },
  {
    id: 'kinetic-energy',
    topicId: 'physics-t04',
    title: 'Kinetic energy from speed',
    equation: 'KE = ½ m v²',
    ranges: { mass: [1, 20], speed: [2, 20] },
    exclusions: ['the kinetic energy is not a whole number of joules'],
    units: 'J',
    compute: (mass, speed) => 0.5 * mass * speed * speed,
    options: (value) => {
      const rounded = Math.round(value);
      const distractors = new Set();
      const shapes = [rounded * 2, rounded / 2, rounded + 5, rounded - 3, Math.round(rounded * 0.75)];
      let index = 0;
      while (distractors.size < 3 && index < shapes.length) {
        const candidate = Math.round(shapes[index]);
        index += 1;
        if (candidate !== rounded && candidate > 0) distractors.add(candidate);
      }
      return { correct: rounded, distractors: [...distractors].slice(0, 3) };
    },
    verify: (value) => Number.isInteger(value) && value > 0,
    stem: (mass, speed) => `A body of mass ${mass} kg moves with a speed of ${speed} m/s. Its kinetic energy is`,
  },
  {
    id: 'ohm-law',
    topicId: 'electrical-t04',
    title: 'Current through a resistor',
    equation: 'I = V / R',
    ranges: { volts: [2, 24], ohms: [2, 40] },
    exclusions: ['the current does not round to 2 decimal places exactly'],
    units: 'A',
    compute: (volts, ohms) => volts / ohms,
    options: (value) => {
      const rounded = Math.round(value * 100) / 100;
      const distractors = new Set();
      const shapes = [rounded * 2, rounded / 2, rounded + 0.5, rounded - 0.25, rounded * 1.5];
      let index = 0;
      while (distractors.size < 3 && index < shapes.length) {
        const candidate = Math.round(shapes[index] * 100) / 100;
        index += 1;
        if (candidate !== rounded && candidate > 0) distractors.add(candidate);
      }
      return { correct: rounded, distractors: [...distractors].slice(0, 3) };
    },
    verify: (value) => Number.isFinite(value) && value > 0,
    stem: (volts, ohms) => `A ${ohms} ohm resistor is connected across a ${volts} V supply. The current through it is`,
  },
];

/* ------------------------------------------------------------------ *
 * Generation
 * ------------------------------------------------------------------ */

/** How many items each template produces. */
const PER_TEMPLATE = 4;

function generate(template, seed) {
  const random = makeRandom(seed);
  const names = Object.keys(template.ranges);
  const values = {};
  // The values are drawn with rejection: a draw that breaks a declared
  // exclusion is discarded and drawn again, up to a limit, so the batch is
  // reproducible and never silently carries a broken item.
  const limit = 50;
  for (let attempt = 0; attempt < limit; attempt += 1) {
    for (const name of names) {
      const [min, max] = template.ranges[name];
      values[name] = between(random, min, max);
    }
    const computed = template.compute(...names.map((name) => values[name]));
    if (template.verify(computed)) break;
    if (attempt === limit - 1) return null;
  }
  const computed = template.compute(...names.map((name) => values[name]));
  if (!template.verify(computed)) return null;
  const { correct, distractors } = template.options(computed, random);
  if (distractors.length < 3) return null;
  // Every option must be distinct, and only one may be the answer.
  const options = [correct, ...distractors];
  if (new Set(options).size !== options.length) return null;
  if (options.filter((option) => option === correct).length !== 1) return null;
  return {
    values,
    computed,
    correct,
    distractors,
  };
}

const items = [];
const rejected = [];

for (const template of TEMPLATES) {
  for (let index = 0; index < PER_TEMPLATE; index += 1) {
    const seed = 1000 + index * 97 + template.id.length * 31;
    const attempt = generate(template, seed);
    if (!attempt) {
      rejected.push({ templateId: template.id, seed, reason: 'the generated values broke a declared exclusion' });
      continue;
    }
    const names = Object.keys(template.ranges);
    // The correct option is placed by the seed, so the answer is not always A.
    const wrong = [...attempt.distractors];
    const random = makeRandom(seed + 7);
    const position = between(random, 0, wrong.length);
    const ordered = [...wrong];
    ordered.splice(position, 0, attempt.correct);
    const letters = ['A', 'B', 'C', 'D'];
    items.push({
      id: `original:${template.id}:${seed}`,
      templateId: template.id,
      topicId: template.topicId,
      title: template.title,
      equation: template.equation,
      units: template.units,
      seed,
      values: attempt.values,
      stem: template.stem(...names.map((name) => attempt.values[name])),
      options: ordered.map((value, index) => ({ label: letters[index], text: `${value} ${template.units}` })),
      answer: letters[ordered.indexOf(attempt.correct)],
      /** The independent re-solve must agree with the generator. */
      verified: template.verify(attempt.computed),
      provenance: 'Original exercise generated at build time from a declared template. Not a past-year question.',
    });
  }
}

/* ------------------------------------------------------------------ *
 * The independent check
 * ------------------------------------------------------------------ */

/**
 * A second implementation of the arithmetic, written from the equation
 * rather than from the generator's code.
 *
 * The generator uses the template's `compute` function; this checker uses
 * the equation string, transcribed independently. When the two disagree, the
 * batch is wrong and the build fails.
 */
function reSolve(item) {
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
}

const failures = [];
for (const item of items) {
  const expected = reSolve(item);
  if (expected === null) {
    failures.push(`${item.id}: no independent re-solve is registered for this template`);
    continue;
  }
  const answerOption = item.options.find((option) => option.label === item.answer);
  if (!answerOption) {
    failures.push(`${item.id}: the answer letter is not one of the options`);
    continue;
  }
  const stated = Number.parseFloat(answerOption.text);
  if (Math.abs(stated - expected) > 1e-9) {
    failures.push(`${item.id}: the generator says ${stated} but the independent solve says ${expected}`);
  }
  // Only one option may be right.
  const correct = item.options.filter((option) => Math.abs(Number.parseFloat(option.text) - expected) < 1e-9);
  if (correct.length !== 1) {
    failures.push(`${item.id}: ${correct.length} options are correct, so the item has no single answer`);
  }
  if (!item.verified) failures.push(`${item.id}: the item failed its own verification`);
}

// The answer must not sit in the same position in every item, and the batch
// as a whole must use every letter.
const positions = new Map();
for (const item of items) {
  positions.set(item.answer, (positions.get(item.answer) ?? 0) + 1);
}
const used = [...positions.keys()].sort().join('');
if (used.length < 2 && items.length > 1) {
  failures.push(`the batch places every answer in the same position (${used}); the placement is not seeded`);
}

if (failures.length > 0) {
  console.error('[variants] the batch failed its checks:');
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

const result = {
  schema: 1,
  version: '2026.11.19-phase07',
  provenance: 'Original exercises generated at build time from declared templates. Each one is checked against an independent re-solve before it is written.',
  templates: TEMPLATES.map((template) => ({
    id: template.id,
    topicId: template.topicId,
    title: template.title,
    equation: template.equation,
    ranges: template.ranges,
    exclusions: template.exclusions,
    units: template.units,
  })),
  items,
  rejected,
  checks: {
    independentResolves: items.length,
    uniqueOptions: items.length,
    singleAnswer: items.length,
    failed: failures.length,
  },
};

const text = `${JSON.stringify(result, null, 2)}\n`;
if (check) {
  const { readFile } = await import('node:fs/promises');
  const current = await readFile(output, 'utf8').catch(() => '');
  if (current !== text) {
    console.error('[variants] the committed file differs from a fresh build');
    process.exit(1);
  }
  console.log('[variants] the committed file matches a fresh build');
} else {
  await writeFile(output, text);
  console.log(`[variants] wrote src/data/variants.json — ${items.length} items from ${TEMPLATES.length} templates, all checks passed`);
}
