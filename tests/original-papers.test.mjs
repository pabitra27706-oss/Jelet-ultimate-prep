import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { originalPaperUrl, paperIndexUrl } from '../src/lib/original-papers.mjs';

test('all eight bank papers have distinct board-hosted original references', () => {
  const { papers } = JSON.parse(readFileSync(new URL('../src/data/papers.json', import.meta.url)));
  const urls = papers.map(p => originalPaperUrl(p.year));
  assert.equal(urls.length, 8);
  assert.equal(new Set(urls).size, 8);
  for (const url of urls) {
    assert.ok(url);
    assert.equal(new URL(url).hostname, 'cdnbbsr.s3waas.gov.in');
    assert.ok(url.endsWith('.pdf'));
  }
  assert.equal(new URL(paperIndexUrl).hostname, 'wbjeeb.nic.in');
});
test('unknown years and inherited properties never produce a link', () => {
  for (const year of [2020, 2026, null, undefined, '__proto__', 'constructor']) {
    assert.equal(originalPaperUrl(year), null);
  }
});
test('year mappings retain the supplied filenames and 2023 reference', () => {
  const manifest = JSON.parse(readFileSync(new URL('../docs/phases/10-derived-audit/UPLOAD-MANIFEST-2026-11-20.json', import.meta.url)));
  for (const entry of manifest.files) assert.ok(originalPaperUrl(entry.year).endsWith('/' + entry.file));
  assert.ok(originalPaperUrl(2023).endsWith('/2023111575-2.pdf'));
});
