#!/usr/bin/env node
/**
 * Build the offline pack manifest.
 *
 * A pack is a named bundle of the site's own published files that a learner
 * can choose to keep on their device. This script measures the real byte
 * size of every file in every pack from the built site, so the size shown
 * before a download is the size the learner actually gets.
 *
 * Nothing from the raw archive is published: a pack may only name a file
 * that exists in `dist/` and is on the public artifact allowlist.
 *
 * The manifest is written to `public/`, so Astro copies it into the build
 * verbatim and the browser fetches it at runtime. It is deliberately not
 * baked into a page: the pack list has to state the sizes of the files the
 * browser will actually download, and those are only known after the build.
 *
 * Usage: node scripts/build-packs.mjs [--check]
 *   --check  rebuild in memory and fail if the committed file differs
 */
import { readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const output = join(root, 'public/data/packs.json');
const check = process.argv.includes('--check');

/** The site's release version. */
const VERSION = process.env.JELET_RELEASE_VERSION ?? '2026.11.19-phase06';

/**
 * The packs.
 *
 * Each entry lists the routes and assets a learner needs for that pack to
 * work with no connection. The list is written out rather than derived from
 * a route pattern, so a pack cannot quietly grow to include something the
 * maintainer did not intend it to carry.
 */
const PACK_DEFINITIONS = [
  {
    id: 'paper-2025',
    title: 'JELET 2025 · Paper I',
    summary: 'The whole 2025 paper: every question, the answer key, and a timed rehearsal.',
    routes: [
      'practice/jelet-et-p1-2025/index.html',
      'practice/jelet-et-p1-2025/mathematics/index.html',
      'practice/jelet-et-p1-2025/physics/index.html',
      'practice/jelet-et-p1-2025/chemistry/index.html',
      'practice/jelet-et-p1-2025/electrical/index.html',
      'practice/jelet-et-p1-2025/print/index.html',
      'practice/jelet-et-p1-2025/reconciliation/index.html',
      'library/jelet-et-p1-2025/index.html',
    ],
    data: ['data/keys.json'],
    onlineOnly: [],
  },
  {
    id: 'paper-2024',
    title: 'JELET 2024 · Paper I',
    summary: 'The whole 2024 paper: every question, the official Set-A key, and a timed rehearsal.',
    routes: [
      'practice/jelet-et-p1-2024/index.html',
      'practice/jelet-et-p1-2024/mathematics/index.html',
      'practice/jelet-et-p1-2024/physics/index.html',
      'practice/jelet-et-p1-2024/chemistry/index.html',
      'practice/jelet-et-p1-2024/electrical/index.html',
      'practice/jelet-et-p1-2024/print/index.html',
      'practice/jelet-et-p1-2024/reconciliation/index.html',
      'library/jelet-et-p1-2024/index.html',
    ],
    data: ['data/keys.json'],
    onlineOnly: [],
  },
  {
    id: 'paper-2022',
    title: 'JELET 2022 · Paper I',
    summary: 'The whole 2022 paper with the derived answer key. The board published no key for this year.',
    routes: [
      'practice/jelet-et-p1-2022/index.html',
      'practice/jelet-et-p1-2022/mathematics/index.html',
      'practice/jelet-et-p1-2022/physics/index.html',
      'practice/jelet-et-p1-2022/chemistry/index.html',
      'practice/jelet-et-p1-2022/electrical/index.html',
      'practice/jelet-et-p1-2022/print/index.html',
      'practice/jelet-et-p1-2022/reconciliation/index.html',
      'library/jelet-et-p1-2022/index.html',
    ],
    data: ['data/keys.json'],
    onlineOnly: [],
  },
  {
    id: 'chapter-parallel-circuits',
    title: 'Parallel circuits · the lesson',
    summary: 'The worked lesson, its practice card and the original variant.',
    routes: [
      'learn/parallel-circuits/index.html',
      'cards/orig-parallel-independent-v1/index.html',
    ],
    data: [],
    onlineOnly: [],
  },
];

/** The assets every pack needs: the shell, the maths renderer and its fonts. */
const SHARED_ASSETS = [
  'index.html',
  'practice/index.html',
  'library/index.html',
  'search/index.html',
  'review/index.html',
  'workspace/index.html',
  'manifest.webmanifest',
  'icon.svg',
  'search-index.json',
];

/** The compiled assets a pack needs: the KaTeX bundle and its fonts. */
async function compiledAssets() {
  const css = await readFile(join(dist, '_astro'), 'utf8').catch(() => null);
  void css;
  const { readdir } = await import('node:fs/promises');
  const astro = join(dist, '_astro');
  const names = await readdir(astro).catch(() => []);
  const js = names.filter((name) => name.endsWith('.js'));
  const cssFiles = names.filter((name) => name.endsWith('.css'));
  const fonts = names.filter((name) => name.endsWith('.woff2'));
  return [
    ...js.map((name) => `_astro/${name}`),
    ...cssFiles.map((name) => `_astro/${name}`),
    ...fonts.map((name) => `_astro/${name}`),
  ];
}

/**
 * The vendored KaTeX bundle, if the site ships one.
 *
 * The fonts are what make a maths question readable with no connection, so a
 * pack that carries questions must carry them. They are listed with their
 * real byte sizes like everything else.
 */
async function katexAssets() {
  const { readdir } = await import('node:fs/promises');
  const dir = join(dist, 'vendor/katex');
  const names = await readdir(dir).catch(() => []);
  const out = [];
  for (const name of names) {
    // The upstream checksum list is not published and is not needed offline.
    if (name.endsWith('.sha256')) continue;
    const path = `vendor/katex/${name}`;
    const info = await stat(join(dist, path)).catch(() => null);
    if (info?.isFile()) out.push(path);
  }
  const fontsDir = join(dir, 'fonts');
  const fontNames = await readdir(fontsDir).catch(() => []);
  for (const name of fontNames) {
    const path = `vendor/katex/fonts/${name}`;
    const info = await stat(join(dist, path)).catch(() => null);
    if (info?.isFile()) out.push(path);
  }
  return out;
}

async function sizeOf(path) {
  try {
    const info = await stat(join(dist, path));
    return info.size;
  } catch {
    return null;
  }
}

async function build() {
  const allowlist = JSON.parse(await readFile(join(root, 'scripts/public-artifact.json'), 'utf8'));
  const allowed = new Set(allowlist.files);
  const shared = await compiledAssets();
  const katex = await katexAssets();

  const packs = [];
  for (const definition of PACK_DEFINITIONS) {
    const wanted = [
      ...SHARED_ASSETS,
      ...definition.routes,
      ...definition.data,
      ...shared,
      ...katex,
    ];
    const files = [];
    const missing = [];
    for (const path of [...new Set(wanted)]) {
      // A pack may only name a file that is actually published.
      if (!allowed.has(path) && !path.startsWith('_astro/') && !path.startsWith('vendor/')) {
        missing.push(path);
        continue;
      }
      const bytes = await sizeOf(path);
      if (bytes === null) {
        missing.push(path);
        continue;
      }
      files.push({ path, bytes });
    }
    if (missing.length > 0) {
      throw new Error(`Pack ${definition.id} names files that are not published: ${missing.join(', ')}`);
    }
    const bytes = files.reduce((sum, file) => sum + file.bytes, 0);
    packs.push({
      id: definition.id,
      title: definition.title,
      summary: definition.summary,
      version: VERSION,
      files,
      bytes,
      offlineComplete: definition.onlineOnly.length === 0,
      onlineOnly: definition.onlineOnly,
    });
  }

  return { schema: 1, version: VERSION, packs };
}

const manifest = await build();
const text = `${JSON.stringify(manifest, null, 2)}\n`;

if (check) {
  const current = await readFile(output, 'utf8').catch(() => '');
  if (current !== text) {
    console.error('[packs] the committed manifest differs from a fresh build');
    process.exit(1);
  }
  console.log('[packs] the committed manifest matches a fresh build');
} else {
  await writeFile(output, text);
  const total = manifest.packs.reduce((sum, pack) => sum + pack.bytes, 0);
  console.log(`[packs] wrote public/data/packs.json — ${manifest.packs.length} packs, ${Math.round(total / 1024)} KB in total`);
  for (const pack of manifest.packs) {
    console.log(`         ${pack.id}: ${pack.files.length} files, ${Math.round(pack.bytes / 1024)} KB`);
  }
}
