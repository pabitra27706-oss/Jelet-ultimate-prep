#!/usr/bin/env node
/**
 * Vendor the KaTeX stylesheet and its woff2 fonts into `public/vendor/katex`.
 *
 * The maths corpus is typeset on the server at build time, so the browser
 * only needs the stylesheet and the handful of font files it actually uses.
 * Keeping the files in the repository means the site builds and runs offline
 * and no third-party CDN is ever contacted.
 *
 * Usage: node scripts/vendor-katex.mjs [--check]
 */
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'node_modules/katex/dist');
const target = join(root, 'public/vendor/katex');
const checkOnly = process.argv.includes('--check');

const sha256 = (data) => createHash('sha256').update(data).digest('hex');

async function main() {
  const css = await readFile(join(source, 'katex.min.css'), 'utf8');
  // Keep only the woff2 source of every font: the woff and ttf copies triple
  // the payload for no benefit on any browser that can run this site.
  const trimmed = css.replace(
    /src:url\(([^)]+)\)\s*format\("woff2"\),url\([^)]+\)\s*format\("woff"\),url\([^)]+\)\s*format\("truetype"\)/g,
    'src:url($1) format("woff2")',
  );
  const fontDir = join(source, 'fonts');
  const fonts = (await readdir(fontDir)).filter((name) => name.endsWith('.woff2')).sort();
  const fontData = new Map();
  for (const name of fonts) fontData.set(name, await readFile(join(fontDir, name)));

  const manifest = [
    `${sha256(Buffer.from(trimmed))}  katex.min.css`,
    ...[...fontData].map(([name, data]) => `${sha256(data)}  fonts/${name}`),
  ].join('\n') + '\n';

  if (checkOnly) {
    let stale = false;
    try {
      const current = await readFile(join(target, 'MANIFEST.sha256'), 'utf8');
      if (current !== manifest) stale = true;
      else {
        const cssNow = await readFile(join(target, 'katex.min.css'), 'utf8');
        if (cssNow !== trimmed) stale = true;
      }
    } catch {
      stale = true;
    }
    if (stale) {
      console.error('[katex] vendored files are out of date. Run: npm run build:katex');
      process.exitCode = 1;
    } else {
      console.log('[katex] vendored files are up to date');
    }
    return;
  }

  await rm(target, { recursive: true, force: true });
  await mkdir(join(target, 'fonts'), { recursive: true });
  await writeFile(join(target, 'katex.min.css'), trimmed);
  for (const [name, data] of fontData) {
    await copyFile(join(fontDir, name), join(target, 'fonts', name));
    void data;
  }
  await writeFile(join(target, 'MANIFEST.sha256'), manifest);
  console.log(`[katex] vendored katex.min.css + ${fonts.length} woff2 fonts`);
}

await main();
