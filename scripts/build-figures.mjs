#!/usr/bin/env node
/**
 * The figure layer.
 *
 * The corpus is transcribed text, so a question whose stem points at a
 * diagram is a dead end: the stem says "the figure" and there is no figure.
 * This script publishes the figure layer that closes that gap for the 2023
 * paper.
 *
 * The rules it enforces come from ADR-0002, which is a decision, not a
 * preference:
 *
 *   - No official pixels. An asset may not embed, link or trace any raster
 *     from the official booklet. Only hand-authored SVG primitives.
 *   - Every asset carries a provenance comment naming the source paper and
 *     question, a title and a description that convey the content of the
 *     figure, and a text equivalent in the content model.
 *   - A redraw never makes a question scoreable. This script does not touch
 *     the corpus, the key or the hold rules.
 *
 * The assets are authored in `editorial/figures/<year>/` and published to
 * `public/figures/<year>/`. The editorial copy is the source of truth; the
 * published copy is what the site and the offline pack serve.
 *
 * Usage:
 *   node scripts/build-figures.mjs           # validate and publish
 *   node scripts/build-figures.mjs --check   # fail if the published copy is stale
 */
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');

/** The collections that carry a figure layer, and where each one lives. */
const COLLECTIONS = (await readdir(join(root, 'editorial/figures')))
  .filter((year) => /^\d{4}$/.test(year))
  .sort()
  .map((year) => ({ year: Number(year), source: `editorial/figures/${year}`, manifest: `editorial/figures/${year}/manifest.json` }));

/**
 * Every asset must satisfy these. A file that fails one is not published:
 * a figure without a description is not done, and a figure with an embedded
 * bitmap is not this project's figure at all.
 */
const RULES = [
  {
    name: 'provenance comment',
    test: (svg) => svg.includes('RECONSTRUCTED FIGURE') && svg.includes('ADR-0002'),
    why: 'ADR-0002 requires an in-file provenance block naming the source paper and question.',
  },
  {
    name: 'accessible title',
    test: (svg) => /<title[^>]*>[^<]+<\/title>/.test(svg),
    why: 'ADR-0002 requires a title that conveys the figure, not merely its existence.',
  },
  {
    name: 'accessible description',
    test: (svg) => /<desc[^>]*>[^<]{40,}<\/desc>/.test(svg),
    why: 'ADR-0002 requires a description of the figure content.',
  },
  {
    name: 'no embedded raster',
    test: (svg) => !/<image\b/i.test(svg) && !/data:image\//i.test(svg),
    why: 'ADR-0002 forbids any pixel data from the official booklet.',
  },
  {
    name: 'no external reference',
    test: (svg) => !/xlink:href\s*=\s*"(?!#)/i.test(svg) && !/\shref\s*=\s*"(?!#)/i.test(svg),
    why: 'A figure that pulls anything from the network is not self-contained.',
  },
  {
    name: 'no script or foreign content',
    test: (svg) => !/<script\b/i.test(svg) && !/<foreignObject\b/i.test(svg),
    why: 'The figure layer holds line art and nothing else.',
  },
  {
    name: 'no external stylesheet',
    test: (svg) => !/@import\b/i.test(svg) && !/url\(\s*['"]?https?:/i.test(svg),
    why: 'The figure must render the same way wherever it is served.',
  },
];

const problems = [];
const published = [];

for (const collection of COLLECTIONS) {
  const manifestPath = join(root, collection.manifest);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const sourceDir = join(root, collection.source);
  const targetDir = join(root, 'public/figures', String(collection.year));

  const files = (await readdir(sourceDir)).filter((name) => name.endsWith('.svg')).sort();
  const listed = new Set(manifest.entries.map((entry) => entry.svg));

  for (const name of files) {
    if (!listed.has(name)) problems.push(`${collection.source}/${name}: not listed in the manifest`);
  }

  for (const entry of manifest.entries) {
    const label = `${collection.source}/${entry.svg}`;
    if (!entry.svg.endsWith('.svg')) {
      problems.push(`${label}: the manifest entry does not name an SVG asset`);
      continue;
    }
    if (!entry.alt || entry.alt.length < 40) {
      problems.push(`${label}: the entry has no usable alt text`);
    }
    if (!entry.description || entry.description.length < 80) {
      problems.push(`${label}: the entry has no text equivalent`);
    }
    if (!entry.deviations) {
      problems.push(`${label}: the entry records no deviation from the official artwork`);
    }

    let svg;
    try {
      svg = await readFile(join(sourceDir, entry.svg), 'utf8');
    } catch {
      problems.push(`${label}: the asset is missing`);
      continue;
    }
    for (const rule of RULES) {
      if (!rule.test(svg)) problems.push(`${label}: ${rule.name} — ${rule.why}`);
    }
    if (!svg.startsWith('<svg')) problems.push(`${label}: the asset is not an SVG document`);

    const target = join(targetDir, entry.svg);
    let current = null;
    try {
      current = await readFile(target, 'utf8');
    } catch {
      /* not published yet */
    }
    if (current === svg) continue;
    if (checkOnly) {
      problems.push(`${label}: the published copy is out of date. Run: npm run figures`);
      continue;
    }
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, svg);
    published.push(`public/figures/${collection.year}/${entry.svg}`);
  }

  // The published directory must not keep assets the manifest has dropped.
  if (!checkOnly) {
    await mkdir(targetDir, { recursive: true });
    const stale = (await readdir(targetDir)).filter((name) => name.endsWith('.svg') && !listed.has(name));
    for (const name of stale) {
      await rm(join(targetDir, name));
      published.push(`removed public/figures/${collection.year}/${name}`);
    }
  }
}

if (problems.length > 0) {
  console.error('[figures] the figure layer is not publishable:');
  for (const problem of problems) console.error(`         ${problem}`);
  process.exitCode = 1;
} else if (checkOnly) {
  console.log('[figures] the published figure layer is up to date');
} else if (published.length > 0) {
  for (const item of published) console.log(`[figures] ${item}`);
  console.log(`[figures] published ${published.length} change(s)`);
} else {
  console.log('[figures] the published figure layer is already up to date');
}
