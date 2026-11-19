import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { after, before, test } from 'node:test';
import chrome from '@sparticuz/chromium';
import { chromium } from 'playwright-core';

import { base, staticServer } from '../scripts/static-server.mjs';

const root = resolve('dist');
let browser, origin, server;
const chapter = 'learn/parallel-circuits/';
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
    'index.html', 'learn', 'learn/index.html', 'learn/parallel-circuits', 'learn/parallel-circuits/index.html', 'parallel-circuit.svg',
  ]);
  assert(files.filter((f) => f.startsWith('_astro/')).every((f) => ['.js', '.css'].includes(extname(f))));
  assert.equal((await fetch(`${origin}/`)).status, 404);
  assert.equal((await fetch(`${origin}${base}archive/`)).status, 404);
  assert.equal((await fetch(`${origin}${base}unknown/`)).status, 404);
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
  for (const path of ['', 'learn/', chapter + '#revision-sheet']) {
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
