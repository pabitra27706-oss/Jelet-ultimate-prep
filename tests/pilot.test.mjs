import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { after, before, test } from 'node:test';
import chrome from '@sparticuz/chromium';
import { chromium } from 'playwright-core';

import { base, staticServer } from '../scripts/static-server.mjs';

const root = resolve('dist');
let browser, origin, server;
const chapter = 'learn/parallel-circuits/';
const practice = 'practice/orig-parallel-independent-v1/';
before(async () => {
  server = await staticServer();
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ args: ['--disable-dev-shm-usage', '--disable-gpu'], executablePath: await chrome.executablePath(), headless: true });
  console.log(`Chromium ${browser.version()}`);
});
after(async () => { await browser?.close(); server?.close(); });

async function context(t, options = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, ...options });
  t.after(() => ctx.close());
  const page = await ctx.newPage();
  page.setDefaultTimeout(5000);
  page.setDefaultNavigationTimeout(8000);
  const faults = [];
  page.on('pageerror', (e) => faults.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') faults.push(m.text()); });
  page.on('request', (r) => { if (!r.url().startsWith(origin + base)) faults.push(`unexpected request: ${r.url()}`); });
  t.after(() => assert.deepEqual(faults, []));
  return page;
}
const go = (page, path = '') => page.goto(origin + base + path);
const closed = (page, selector) => page.locator(selector).evaluate((el) => !el.open);
const settleProgress = (page, section) => page.waitForFunction((value) => {
  return JSON.parse(localStorage.getItem('jelet:parallel-circuits:v1') ?? 'null')?.section === value;
}, section);

test('built artifact contains only approved public routes, diagram and compiled static assets', async () => {
  const files = (await readdir(root, { recursive: true })).sort();
  assert.deepEqual(files.filter((f) => !f.startsWith('_astro')), [
    'index.html', 'learn', 'learn/index.html', 'learn/parallel-circuits', 'learn/parallel-circuits/index.html',
    'parallel-circuit.svg', 'practice', 'practice/index.html', 'practice/orig-parallel-independent-v1',
    'practice/orig-parallel-independent-v1/index.html', 'search', 'search-index.json', 'search/index.html',
    'workspace', 'workspace/index.html',
  ]);
  assert(files.filter((f) => f.startsWith('_astro/')).every((f) => ['.js', '.css'].includes(extname(f))));
  assert.equal((await fetch(`${origin}/`)).status, 404);
  assert.equal((await fetch(`${origin}${base}archive/`)).status, 404);
  assert.equal((await fetch(`${origin}${base}unknown/`)).status, 404);
  assert.equal((await fetch(`${origin}${base}practice/unknown/`)).status, 404);
});

test('fresh touch-sized navigation: Today → Learn → chapter → prediction → full-size diagram → Back', async (t) => {
  const page = await context(t);
  await go(page);
  assert.match(await page.title(), /^Today/);
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Learn' }).click();
  await page.getByRole('link', { name: /Parallel circuits/ }).click();
  await page.getByRole('link', { name: /Start with a prediction/ }).click();
  assert.equal(new URL(page.url()).hash, '#predict');
  assert(await closed(page, '[data-reveal="worked"]'));
  assert(await page.getByRole('img', { name: /Two 6-ohm/ }).evaluate((el) => el.complete && el.naturalWidth > 0));
  await page.getByRole('link', { name: 'Open full-size diagram' }).click();
  assert(new URL(page.url()).pathname.endsWith('/parallel-circuit.svg'));
  await page.goBack();
  assert.equal(new URL(page.url()).hash, '#predict');
});

test('hint and notebook progress survives returning and reload, without showing answers automatically', async (t) => {
  const page = await context(t);
  await go(page, chapter + '#guided-practice');
  await page.getByText('Hint 1 · Trace the nodes', { exact: true }).click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('jelet:parallel-circuits:v1') ?? 'null')?.guidedHints.includes('hint-one'));
  assert(await closed(page, '[data-reveal="hint-two"]'));
  await go(page);
  const resume = page.getByRole('link', { name: /Resume parallel circuits/ });
  await resume.click();
  assert.equal(new URL(page.url()).hash, '#guided-practice');
  await page.getByText('Guided hint opened on this browser.').waitFor();
  assert(!(await closed(page, '[data-reveal="hint-one"]')));
  assert(await closed(page, '[data-reveal="guided-check"]'));
  assert.equal(new URL(page.url()).search, '');
  await page.getByRole('navigation', { name: 'Lesson sections' }).getByRole('link', { name: 'Independent practice' }).click();
  assert(await closed(page, '[data-reveal="independent-check"]'));
  await page.getByText('Check after attempting', { exact: true }).click();
  await settleProgress(page, 'independent-practice');
  await page.getByText('The independent check has been opened on this browser.').waitFor();
  await page.reload();
  assert.equal(new URL(page.url()).hash, '#independent-practice');
  assert(await closed(page, '[data-reveal="independent-check"]'));
  await page.getByText('The independent check has been opened on this browser.').waitFor();
});

test('keyboard focus and closed steps work without JS at desktop size', async (t) => {
  const page = await context(t, { viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false, javaScriptEnabled: false });
  await go(page, chapter + '#worked-example');
  const summary = page.locator('[data-reveal="worked"] summary');
  for (let i = 0; i < 22 && !(await summary.evaluate((el) => document.activeElement === el)); i++) {
    await page.keyboard.press('Tab');
  }
  assert(await summary.evaluate((el) => document.activeElement === el));
  assert.equal(await summary.evaluate((el) => getComputedStyle(el).outlineWidth), '3px');
  assert(await closed(page, '[data-reveal="worked"]'));
  await page.keyboard.press('Enter');
  assert(!(await closed(page, '[data-reveal="worked"]')));
  assert(await page.getByText('By Ohm’s law,', { exact: false }).first().isVisible());
  assert(await page.getByRole('heading', { name: 'Revision sheet' }).isVisible());
});

test('unavailable storage and corrupt progress do not block a learner', async (t) => {
  const page = await context(t);
  await go(page);
  await page.evaluate(() => localStorage.setItem('jelet:parallel-circuits:v1', '{invalid'));
  await page.reload();
  assert(await page.getByRole('link', { name: /Start parallel circuits/ }).isVisible());
  await page.addInitScript(() => {
    Storage.prototype.getItem = Storage.prototype.setItem = () => { throw new DOMException('blocked', 'SecurityError'); };
  });
  await go(page, chapter + '#independent-practice');
  await page.getByText(/Could not save progress/).waitFor();
  await page.getByText('Check after attempting', { exact: true }).click();
  assert(!(await closed(page, '[data-reveal="independent-check"]')));
});

test('320px viewport and 200% text: no page-wide overflow on any route', async (t) => {
  const page = await context(t, { viewport: { width: 320, height: 700 } });
  for (const path of ['', 'learn/', chapter + '#revision-sheet', 'practice/', practice]) {
    assert.equal((await go(page, path)).status(), 200);
    await page.addStyleTag({ content: ':root { font-size: 200% !important; }' });
    const width = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    assert(width[0] <= width[1], `${path}: ${width}`);
  }
});

test('simulated background freeze keeps a revealed hint and its exact section', async (t) => {
  const page = await context(t);
  await go(page, chapter + '#guided-practice');
  const hint = '[data-reveal="hint-two"]';
  await page.locator(`${hint} summary`).click();
  await page.getByText('Guided hint opened on this browser.').waitFor();
  const session = await page.context().newCDPSession(page);
  await session.send('Page.setWebLifecycleState', { state: 'frozen' });
  await session.send('Page.setWebLifecycleState', { state: 'active' });
  await session.detach();
  assert.equal(new URL(page.url()).hash, '#guided-practice');
  assert(!(await closed(page, hint)));
  assert(await closed(page, '[data-reveal="guided-check"]'));
});

test('practice card shows stable identity, provenance and answer status without the answer', async (t) => {
  const page = await context(t);
  assert.equal((await go(page, practice)).status(), 200);
  assert.match(await page.title(), /^Parallel branches · independent check/);
  assert.equal(await page.locator('[data-public-id]').textContent(), 'orig-parallel-independent-v1');
  assert(await page.getByText('ORIGINAL PRACTICE · NOT A PAST EXAM QUESTION').isVisible());
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), '/Jelet-ultimate-prep/' + practice);
  const html = await page.content();
  assert(!html.includes('1.5 A'), 'answer leaked into the practice card');
  assert(!html.includes('4.5 A'), 'answer leaked into the practice card');
});

test('generated lesson backlink → practice card → exact section → Back restores question and filter', async (t) => {
  const page = await context(t);
  await go(page, chapter + '#independent-practice');
  await page.getByRole('link', { name: /Parallel branches · independent check/ }).click();
  let url = new URL(page.url());
  assert(url.pathname.endsWith('/' + practice));
  assert.equal(url.searchParams.get('from'), 'lesson');
  assert(await page.locator('[data-origin]').isVisible());
  await page.getByRole('link', { name: /Learn this concept/ }).click();
  url = new URL(page.url());
  assert(url.pathname.endsWith('/' + chapter));
  assert.equal(url.hash, '#independent-practice');
  assert.equal(url.searchParams.get('from'), 'practice');
  assert(await page.locator('[data-origin]').isVisible());
  await page.goBack();
  url = new URL(page.url());
  assert(url.pathname.endsWith('/' + practice));
  assert.equal(url.searchParams.get('from'), 'lesson');
  assert(url.searchParams.has('topic'));
  assert(await page.locator('[data-origin]').isVisible());
});

test('practice card works without JS and rejects invalid filter context', async (t) => {
  const page = await context(t, { viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false, javaScriptEnabled: false });
  assert.equal((await go(page, practice + '?from=unknown&topic=wrong')).status(), 200);
  assert.equal(await page.locator('[data-origin]').isVisible(), false);
  assert(await page.getByRole('link', { name: /Learn this concept/ }).isVisible());
  assert(await page.getByRole('link', { name: /Back to lesson section without filters/ }).isVisible());
});

test('local index contains only approved groups and no private state or answer', async () => {
  const response = await fetch(`${origin}${base}search-index.json`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  const data = await response.json();
  assert.equal(data.version, 1);
  assert.deepEqual([...new Set(data.entries.map((entry) => entry.type))].sort(), ['lesson', 'practice']);
  for (const entry of data.entries) {
    assert(entry.url.startsWith(base), entry.url);
    for (const forbidden of ['bookmark', 'note', 'choice', 'attempt', 'storage']) {
      assert(!Object.hasOwn(entry, forbidden), `${entry.id} contains ${forbidden}`);
    }
  }
  const json = JSON.stringify(data);
  assert(!json.includes('1.5 A') && !json.includes('4.5 A'));
});

test('local search groups results, honours filters and handles a noisy query and no match', async (t) => {
  const page = await context(t);
  await go(page, 'search/');
  const input = page.locator('input[name="q"]');
  await page.waitForFunction(() => /results? on this device/.test(document.querySelector('[data-search-status]')?.textContent ?? ''));
  await input.fill('A 9 V source feeds 6 Ω and 3 Ω branches in parallel');
  await page.waitForFunction(() => document.querySelector('[data-search-status]')?.textContent?.startsWith('1 result'));
  assert(await page.getByRole('link', { name: /Parallel branches/ }).isVisible());
  assert.equal(await page.getByRole('link', { name: /Parallel circuits/ }).count(), 0);
  await page.locator('select[name="type"]').selectOption('lesson');
  await page.waitForFunction(() => document.querySelector('[data-search-status]')?.textContent?.startsWith('0 results'));
  await page.getByRole('heading', { name: 'No match yet' }).waitFor();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await page.getByRole('link', { name: /Parallel circuits/ }).waitFor();
  assert(await page.getByRole('link', { name: /Parallel branches/ }).isVisible());
  const url = new URL(page.url());
  assert.equal(url.searchParams.get('q'), null);
  assert.equal(url.searchParams.get('type'), null);
});

test('search reads a direct query URL and keeps a usable no-JS directory', async (t) => {
  const page = await context(t);
  await go(page, 'search/?q=independent&type=practice');
  await page.getByRole('link', { name: /Parallel branches/ }).waitFor();
  assert.equal(await page.getByRole('link', { name: /Parallel circuits/ }).count(), 0);
  const plain = await context(t, { viewport: { width: 1280, height: 800 }, isMobile: false, hasTouch: false, javaScriptEnabled: false });
  await go(plain, 'search/');
  assert(await plain.getByRole('heading', { name: /Browse the approved library/ }).isVisible());
  assert(await plain.getByRole('link', { name: /Parallel circuits/ }).isVisible());
  assert(await plain.getByRole('link', { name: /Parallel branches/ }).isVisible());
});

async function sharePage(t, mode) {
  const page = await context(t);
  await page.addInitScript((value) => {
    if (value === 'native') {
      Object.defineProperty(navigator, 'share', { configurable: true, value: (payload) => { window.__shared = payload; return Promise.resolve(); } });
    } else if (value === 'clipboard') {
      Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: (text) => { window.__copied = text; return Promise.resolve(); } } });
    } else {
      Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    }
  }, mode);
  await go(page, practice);
  return page;
}

test('default share uses the native sheet with no answer or private state', async (t) => {
  const page = await sharePage(t, 'native');
  await page.getByRole('button', { name: 'Share this card' }).click();
  const payload = await page.evaluate(() => window.__shared);
  assert.equal(payload.url, origin + base + practice);
  assert.match(payload.text, /Original practice · not a past exam question/);
  assert(!payload.text.includes('1.5 A') && !payload.text.includes('4.5 A'));
  assert(!payload.text.includes('localStorage') && !payload.text.includes('bookmark'));
  assert.equal(await page.locator('[data-share-status]').textContent(), 'Shared.');
});

test('clipboard and selectable-text fallbacks keep the same spoiler-free payload', async (t) => {
  const copied = await sharePage(t, 'clipboard');
  await copied.getByRole('button', { name: 'Share this card' }).click();
  const text = await copied.evaluate(() => window.__copied);
  assert(text.includes(origin + base + practice));
  assert(!text.includes('1.5 A') && !text.includes('4.5 A'));
  assert.match(await copied.locator('[data-share-status]').textContent(), /Link copied/);

  const manual = await sharePage(t, 'none');
  await manual.getByRole('button', { name: 'Share this card' }).click();
  assert(await manual.locator('[data-share-fallback]').isVisible());
  const fallbackText = await manual.locator('[data-share-text]').inputValue();
  assert(fallbackText.includes(origin + base + practice));
  assert(!fallbackText.includes('1.5 A') && !fallbackText.includes('4.5 A'));
});

test('photo discovery uses paste only, confirms identity and admits no match', async (t) => {
  const page = await context(t);
  await go(page, 'search/');
  await page.waitForFunction(() => /results? on this device/.test(document.querySelector('[data-search-status]')?.textContent ?? ''));
  assert.equal(await page.locator('input[type="file"]').count(), 0);
  assert(await page.getByRole('heading', { name: /Copy text, paste here/ }).isVisible());
  await page.locator('#photo-paste').fill('A 9 V source feeds 6 Ω and 3 Ω branches in parallel');
  await page.getByRole('button', { name: 'Search pasted text' }).click();
  await page.getByRole('link', { name: /Parallel branches/ }).waitFor();
  assert(await page.getByText(/Original practice · orig-parallel-independent-v1/).first().isVisible());
  await page.locator('#photo-paste').fill('a photograph of a graph with axes but no readable text');
  await page.getByRole('button', { name: 'Search pasted text' }).click();
  await page.getByRole('heading', { name: 'No match yet' }).waitFor();
});

async function readyWorkspace(page) {
  await page.waitForFunction(() => {
    const text = document.querySelector('[data-workspace-status]')?.textContent ?? '';
    return /loaded on this device|Storage is unavailable/.test(text);
  });
}

test('workspace saves a bookmark, note and resume, then survives reload and appears on Today', async (t) => {
  const page = await context(t);
  await go(page, 'workspace/');
  await readyWorkspace(page);
  await page.locator('#workspace-item').selectOption('practice:orig-parallel-independent-v1');
  await page.locator('#workspace-note').fill('Retry the 9 V circuit');
  await page.getByRole('button', { name: 'Bookmark & resume here' }).click();
  await page.waitForFunction(() => (document.querySelector('[data-workspace-status]')?.textContent ?? '').includes('Saved'));
  await page.getByRole('button', { name: 'Save note' }).click();
  await page.waitForFunction(() => (document.querySelector('#workspace-list')?.textContent ?? '').includes('Retry the 9 V circuit'));
  const lines = await page.locator('#workspace-list').textContent();
  assert.match(lines, /Bookmark · Parallel branches/);
  assert.match(lines, /Note · practice:orig-parallel-independent-v1 · Retry the 9 V circuit/);
  assert.match(lines, /Resume · Parallel branches/);
  await page.reload();
  await readyWorkspace(page);
  assert.match(await page.locator('#workspace-list').textContent(), /Retry the 9 V circuit/);
  await go(page);
  const link = page.locator('[data-workspace-link]');
  await link.waitFor({ state: 'visible' });
  assert.match(await link.textContent(), /Continue saved item: Parallel branches/);
  assert((await link.getAttribute('href')).endsWith('/practice/orig-parallel-independent-v1/'));
});

test('workspace export/import validates, previews, dedupes and confirms cancel/replace/reset', async (t) => {
  const page = await context(t, { acceptDownloads: true });
  await go(page, 'workspace/');
  await readyWorkspace(page);
  await page.getByRole('button', { name: 'Bookmark & resume here' }).click();
  await page.waitForFunction(() => (document.querySelector('[data-workspace-status]')?.textContent ?? '').includes('Saved'));

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export JSON' }).click(),
  ]);
  const exported = await readFile(await download.path(), 'utf8');
  const parsed = JSON.parse(exported);
  assert.equal(parsed.schemaVersion, 1);
  assert.equal(parsed.appId, 'jelet-ultimate-prep');
  assert.equal(parsed.items.bookmarks.length, 1);
  assert(!exported.includes('1.5 A') && !exported.includes('4.5 A'));

  await page.locator('#import-file').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{bad') });
  await page.waitForFunction(() => (document.querySelector('[data-workspace-status]')?.textContent ?? '').includes('Not a workspace file'));
  assert.equal(await page.locator('#import-preview').isVisible(), false);

  for (let i = 0; i < 2; i++) {
    await page.locator('#import-file').setInputFiles({ name: 'workspace.json', mimeType: 'application/json', buffer: Buffer.from(exported) });
    await page.locator('#import-preview').waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Merge' }).click();
    await page.waitForFunction(() => (document.querySelector('[data-workspace-status]')?.textContent ?? '').includes('Merged'));
  }
  const afterMerge = await page.locator('#workspace-list').textContent();
  assert.equal(afterMerge.split('Bookmark ·').length - 1, 1, 'duplicate import created a second bookmark');
  assert.equal(afterMerge.split('Resume ·').length - 1, 1);

  await page.locator('#import-file').setInputFiles({ name: 'workspace.json', mimeType: 'application/json', buffer: Buffer.from(exported) });
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.waitForFunction(() => (document.querySelector('[data-workspace-status]')?.textContent ?? '').includes('Import canceled'));
  await page.locator('#import-file').setInputFiles({ name: 'workspace.json', mimeType: 'application/json', buffer: Buffer.from(exported) });
  await page.locator('#import-preview').waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Replace' }).click();
  await page.waitForFunction(() => (document.querySelector('[data-workspace-status]')?.textContent ?? '').includes('Workspace replaced'));

  await page.locator('#reset-confirm').fill('no');
  await page.getByRole('button', { name: 'Clear this workspace' }).click();
  await page.waitForFunction(() => (document.querySelector('[data-workspace-status]')?.textContent ?? '').includes('Type RESET'));
  await page.locator('#reset-confirm').fill('RESET');
  await page.getByRole('button', { name: 'Clear this workspace' }).click();
  await page.waitForFunction(() => (document.querySelector('[data-workspace-status]')?.textContent ?? '').includes('Workspace cleared'));
  assert.match(await page.locator('#workspace-list').textContent(), /Nothing saved yet/);
});

test('denied workspace storage is reported without breaking reading and search', async (t) => {
  const page = await context(t);
  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', { configurable: true, value: { open() { throw new Error('denied'); } } });
  });
  await go(page, 'workspace/');
  await page.waitForFunction(() => (document.querySelector('[data-workspace-status]')?.textContent ?? '').includes('Storage is unavailable'));
  await page.getByRole('button', { name: 'Bookmark & resume here' }).click();
  await page.waitForFunction(() => (document.querySelector('[data-workspace-status]')?.textContent ?? '').includes('Could not save'));
  assert.equal((await go(page, 'search/')).status(), 200);
  assert(await page.getByRole('heading', { name: /Copy text, paste here/ }).isVisible());
});
