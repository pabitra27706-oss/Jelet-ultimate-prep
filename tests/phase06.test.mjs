import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  PACK_MANIFEST_SCHEMA,
  formatBytes,
  packCacheName,
  packStagingCacheName,
} from '../src/lib/offline.ts';

/* ------------------------------------------------------------------ *
 * Phase 06 · the pack manifest
 * ------------------------------------------------------------------ */

const manifestPath = resolve('public/data/packs.json');
const allowlistPath = resolve('scripts/public-artifact.json');

test('phase 06: the manifest states a version, a schema and at least one pack', async () => {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.schema, PACK_MANIFEST_SCHEMA);
  assert.ok(manifest.version, 'the manifest names the release it was built from');
  assert.ok(Array.isArray(manifest.packs) && manifest.packs.length > 0, 'there are packs to offer');
  const ids = manifest.packs.map((pack) => pack.id);
  assert.equal(new Set(ids).size, ids.length, 'no pack is listed twice');
});

test('phase 06: a pack states its size, its version and every file in it', async () => {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  for (const pack of manifest.packs) {
    assert.ok(pack.title, `${pack.id} has a title`);
    assert.ok(pack.summary, `${pack.id} says what it contains`);
    assert.ok(pack.version, `${pack.id} names its version`);
    assert.ok(pack.files.length > 0, `${pack.id} is not empty`);
    const declared = pack.files.reduce((sum, file) => sum + file.bytes, 0);
    assert.equal(declared, pack.bytes, `${pack.id} states the size of its own files`);
    assert.ok(pack.bytes > 0, `${pack.id} is not empty`);
    for (const file of pack.files) {
      assert.ok(file.path.startsWith('/') === false, `${pack.id} names a relative path`);
      assert.ok(!file.path.includes('..'), `${pack.id} names no path outside the site`);
      assert.ok(file.bytes > 0, `${file.path} is not empty`);
    }
  }
});

test('phase 06: a pack only names files the site actually publishes', async () => {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const allowlist = JSON.parse(await readFile(allowlistPath, 'utf8'));
  const allowed = new Set(allowlist.files);
  for (const pack of manifest.packs) {
    for (const file of pack.files) {
      const published = allowed.has(file.path)
        || file.path.startsWith('_astro/')
        || file.path.startsWith('vendor/');
      assert.ok(published, `${pack.id} names ${file.path}, which is not published`);
      // Nothing from the raw archive may travel in a pack.
      assert.ok(!file.path.includes('archive'), `${pack.id} names nothing from the archive`);
    }
  }
});

test('phase 06: the size a pack states is the size of the real file', async () => {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  for (const pack of manifest.packs) {
    for (const file of pack.files) {
      const info = await stat(resolve('dist', file.path)).catch(() => null);
      assert.ok(info, `${file.path} exists in the build`);
      assert.equal(info.size, file.bytes, `${file.path} states its real byte size`);
    }
  }
});

test('phase 06: a pack carries the maths fonts, so a question renders with no connection', async () => {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  for (const pack of manifest.packs.filter((entry) => entry.id.startsWith('paper-'))) {
    const fonts = pack.files.filter((file) => file.path.endsWith('.woff2'));
    assert.ok(fonts.length >= 20, `${pack.id} carries the maths fonts (${fonts.length})`);
    assert.ok(
      pack.files.some((file) => file.path.endsWith('katex.min.css')),
      `${pack.id} carries the maths stylesheet`,
    );
    assert.ok(
      pack.files.some((file) => file.path === 'data/keys.json'),
      `${pack.id} carries the answer key it needs`,
    );
    assert.equal(pack.offlineComplete, true, `${pack.id} can be completed offline`);
    assert.deepEqual(pack.onlineOnly, [], `${pack.id} needs nothing online-only`);
  }
});

test('phase 06: the chapter pack carries the lesson and its practice card', async () => {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const pack = manifest.packs.find((entry) => entry.id === 'chapter-parallel-circuits');
  assert.ok(pack, 'the lesson is offered as a pack');
  const paths = pack.files.map((file) => file.path);
  assert.ok(paths.includes('learn/parallel-circuits/index.html'));
  assert.ok(paths.includes('cards/orig-parallel-independent-v1/index.html'));
});

test('phase 06: a paper pack carries that paper and no other', async () => {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  for (const pack of manifest.packs.filter((entry) => entry.id.startsWith('paper-'))) {
    const year = pack.id.replace('paper-', '');
    const paths = pack.files.map((file) => file.path);
    const papers = new Set(
      paths
        .filter((path) => path.includes('jelet-et-p1-'))
        .map((path) => path.match(/jelet-et-p1-\d{4}/)?.[0] ?? ''),
    );
    assert.equal(papers.size, 1, `${pack.id} carries one paper`);
    assert.ok(papers.has(`jelet-et-p1-${year}`), `${pack.id} carries its own paper`);
  }
});

/* ------------------------------------------------------------------ *
 * Phase 06 · failure-safe update and removal
 * ------------------------------------------------------------------ */

test('phase 06: a pack cache and its staging cache are named apart', () => {
  assert.equal(packCacheName('paper-2025', 'v1'), 'jelet-pack-paper-2025-v1');
  assert.equal(packStagingCacheName('paper-2025', 'v1'), 'jelet-pack-paper-2025-v1.staging');
  // A staging cache must never look like a finished pack.
  assert.notEqual(packCacheName('paper-2025', 'v1'), packStagingCacheName('paper-2025', 'v1'));
});

test('phase 06: the service worker never serves a half-downloaded pack', async () => {
  const worker = await readFile(resolve('public/sw.js'), 'utf8');
  assert.ok(worker.includes("key.endsWith('.staging')"), 'the worker skips staging caches');
  assert.ok(worker.includes('PACK_PREFIX'), 'the worker knows about pack caches');
  assert.ok(worker.includes('jelet:pack-state'), 'the worker reports its pack state');
  // The study state lives in the page's storage, never in a cache the
  // worker owns. The worker may name it in a comment, but it never touches it.
  const code = worker.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  assert.ok(!code.includes('localStorage'), 'the worker never touches study state');
  assert.ok(!code.includes('indexedDB'), 'the worker never touches study state');
  assert.ok(!code.includes('caches.open(\'jelet:attempts'), 'the worker never opens a study-state cache');
});

test('phase 06: removing a pack cannot remove study state', async () => {
  const source = await readFile(resolve('src/lib/offline.ts'), 'utf8');
  const remove = source.slice(source.indexOf('export async function removePack'));
  const body = remove.slice(0, remove.indexOf('\n}'));
  assert.ok(body.includes('caches.delete'), 'the pack files are deleted');
  assert.ok(!body.includes('localStorage.clear'), 'the study state is not cleared');
  assert.ok(!body.includes('removeItem'), 'nothing is removed from localStorage');
  // The state list is rewritten, not emptied.
  assert.ok(body.includes('readInstalled().filter'), 'only the pack record is rewritten');
});

test('phase 06: the manifest is read at runtime so the stated sizes are the real ones', async () => {
  const page = await readFile(resolve('src/pages/offline/index.astro'), 'utf8');
  assert.ok(page.includes('readManifest'), 'the page reads the manifest at runtime');
  assert.ok(!page.includes('import packsData'), 'the page does not bake the manifest in');
  assert.ok(page.includes('download'), 'the page offers a download');
  assert.ok(page.includes('remove'), 'the page offers a removal');
  assert.ok(page.includes('Not ready'), 'a failed download is reported as not ready');
  assert.ok(page.includes('Ready'), 'a complete pack is reported as ready');
});

test('phase 06: the byte format is readable', () => {
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(2048), '2 KB');
  assert.equal(formatBytes(3 * 1024 * 1024), '3.0 MB');
});
