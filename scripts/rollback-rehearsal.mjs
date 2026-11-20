/**
 * The rollback rehearsal.
 *
 * The Phase 06 gate says: *"rehearse rollback on a cached client"*. A
 * rehearsal is only worth anything if it is run, so this script actually
 * runs it:
 *
 * 1. The **new** release is served. A client loads it, downloads an
 *    offline pack and records a study attempt.
 * 2. The server is **swapped for the previous release** — the real files
 *    from the previous deployed commit, not a mock.
 * 3. The same client reloads.
 *
 * The questions the rehearsal answers:
 *
 * - Does the cached client still work after the rollback?
 * - Does the learner lose the study record?
 * - Does the offline pack survive?
 * - Does the stale service worker strand the client on a version the
 *   server no longer serves?
 *
 * The rehearsal is run against real builds of both releases. It is not a
 * claim about the live site, and it is not a physical-device test.
 *
 * Usage: node scripts/rollback-rehearsal.mjs
 */
import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';

import chrome from '@sparticuz/chromium';
import { chromium } from 'playwright-core';

import { prepareChromiumLibraries } from './chromium-env.mjs';

const base = '/Jelet-ultimate-prep/';
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
};

/** Serve a directory. The root is swapped in place for the rollback. */
function makeServer() {
  let root = '';
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (!url.pathname.startsWith(base)) throw new Error('outside base');
      const relative = url.pathname.slice(base.length) + (url.pathname.endsWith('/') ? 'index.html' : '');
      const file = await realpath(resolve(root, decodeURIComponent(relative)));
      const contentType = types[extname(file)];
      if (!file.startsWith(root + sep) || !contentType) throw new Error('unexpected artifact');
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': contentType, 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    }
  });
  server.setRoot = (next) => { root = realpathSyncish(next); };
  return server;
}

function realpathSyncish(path) {
  // `realpath` is async in the request handler; the root is set before
  // the server answers anything, so a resolved path is fine here.
  return resolve(path);
}

function check(label, condition, detail) {
  const mark = condition ? 'PASS' : 'FAIL';
  console.log(`  [${mark}] ${label}${detail ? ` — ${detail}` : ''}`);
  return condition;
}

async function main() {
  const newRelease = resolve('dist');
  const oldRelease = process.argv[2] ? resolve(process.argv[2]) : null;

  if (!oldRelease || !existsSync(oldRelease)) {
    console.log('The previous release build was not found.');
    console.log('Usage: node scripts/rollback-rehearsal.mjs <path-to-previous-dist>');
    console.log('Build it with: git archive <previous-commit> | tar -x -C <dir> && npm --prefix <dir> run build');
    process.exitCode = 2;
    return;
  }

  prepareChromiumLibraries();
  const server = makeServer();
  server.setRoot(newRelease);
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({
    args: ['--disable-dev-shm-usage', '--disable-gpu'],
    executablePath: await chrome.executablePath(),
    headless: true,
  });
  console.log(`Chromium ${browser.version()}`);

  const results = [];
  try {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: 'allow',
    });
    const page = await ctx.newPage();
    page.setDefaultTimeout(8000);
    // The runner asks for confirmation before it submits a paper.
    page.on('dialog', (dialog) => dialog.accept());

    /* ---- Step 1: the new release, a downloaded pack, a recorded attempt ---- */
    console.log('\nStep 1 — the new release');
    await page.goto(origin + base, { waitUntil: 'load' });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 20000 })
      .catch(async () => {
        await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined));
        await page.reload({ waitUntil: 'load' });
        await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 20000 });
      });

    // Download the 2025 pack, so the client holds a real pack cache.
    await page.goto(origin + base + 'offline/', { waitUntil: 'load' });
    await page.waitForSelector('[data-pack="paper-2025"]');
    await page.locator('[data-pack-download="paper-2025"]').click();
    const downloaded = await page.waitForFunction(
      () => (document.querySelector('[data-pack-state="paper-2025"]')?.textContent ?? '').startsWith('Ready'),
      null, { timeout: 120000 },
    ).then(() => true).catch(() => false);
    results.push(check('the new release downloads an offline pack', downloaded));

    // Record a study attempt, so there is a record that could be lost.
    await page.goto(origin + base + 'practice/jelet-et-p1-2025/', { waitUntil: 'load' });
    await page.waitForSelector('[data-runner]');
    await page.locator('.pane.active .opt[data-option="D"]').click();
    await page.waitForFunction(() => /1 of \d+ answered/.test(document.querySelector('[data-runner-progress-text]')?.textContent ?? ''));
    await page.locator('[data-runner-submit]').click();
    await page.waitForSelector('[data-runner-results] .score-hero', { timeout: 20000 });
    const before = await page.evaluate(() => {
      const raw = localStorage.getItem('jelet:attempts:v1');
      const parsed = raw ? JSON.parse(raw) : null;
      return {
        attempts: parsed?.attempts?.length ?? 0,
        submitted: parsed?.attempts?.filter((a) => a.submittedAt !== null).length ?? 0,
      };
    });
    results.push(check('the new release records a submitted attempt', before.submitted === 1,
      `${before.submitted} submitted`));
    const packCachesBefore = await page.evaluate(() => caches.keys())
      .then((names) => names.filter((name) => name.startsWith('jelet-pack-')));
    results.push(check('the client holds a pack cache', packCachesBefore.length > 0,
      packCachesBefore.join(', ') || 'none'));

    /* ---- Step 2: roll the server back to the previous release ---- */
    console.log('\nStep 2 — the server is rolled back to the previous release');
    server.setRoot(oldRelease);
    console.log(`  serving the previous release from ${oldRelease}`);

    /* ---- Step 3: the same client reloads ---- */
    console.log('\nStep 3 — the cached client reloads after the rollback');
    const faults = [];
    page.on('pageerror', (error) => faults.push(error.message));
    await page.goto(origin + base, { waitUntil: 'load' });
    const title = await page.locator('h1').first().textContent().catch(() => '');
    results.push(check('the site still renders after the rollback', /JELET/i.test(title ?? ''), title?.trim()));

    // The study record must survive: it lives in localStorage, which the
    // service worker never touches.
    const after = await page.evaluate(() => {
      const raw = localStorage.getItem('jelet:attempts:v1');
      const parsed = raw ? JSON.parse(raw) : null;
      return {
        attempts: parsed?.attempts?.length ?? 0,
        submitted: parsed?.attempts?.filter((a) => a.submittedAt !== null).length ?? 0,
      };
    });
    results.push(check('the study record survives the rollback', after.submitted === before.submitted,
      `${after.submitted} submitted, was ${before.submitted}`));

    // The pack cache must survive: the previous release's service worker
    // deletes caches it does not know about, so this is the real question.
    const packCachesAfter = await page.evaluate(() => caches.keys())
      .then((names) => names.filter((name) => name.startsWith('jelet-pack-')));
    results.push(check('the offline pack survives the rollback', packCachesAfter.length > 0,
      packCachesAfter.join(', ') || 'none'));

    // And the client must not be stranded on a version the server dropped.
    const online = await page.goto(origin + base + 'library/', { waitUntil: 'load' })
      .then(() => page.locator('h1').first().textContent().catch(() => ''))
      .catch(() => '');
    results.push(check('a deep link still works after the rollback', /JELET|library|paper/i.test(online ?? ''),
      online?.trim().slice(0, 60)));

    // The service worker must still be the one the previous release ships,
    // so the next update is not fought over by two versions.
    const workerState = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      return {
        controlled: Boolean(navigator.serviceWorker.controller),
        script: registration?.active?.scriptURL ?? registration?.installing?.scriptURL ?? '',
      };
    });
    results.push(check('the client is still controlled by a service worker', workerState.controlled,
      workerState.script));

    // The hardest case: the client is offline *and* the server has been
    // rolled back. The pack must still open the paper, because the pack
    // cache is the client's own copy.
    await ctx.setOffline(true);
    await page.goto(origin + base + 'practice/jelet-et-p1-2025/', { waitUntil: 'load' })
      .catch(() => undefined);
    const panesOffline = await page.locator('.pane').count().catch(() => 0);
    results.push(check('the offline pack still opens the paper after the rollback', panesOffline > 0,
      `${panesOffline} questions available with no connection`));
    await ctx.setOffline(false);

    console.log('\nFaults during the reload:', faults.length === 0 ? 'none' : faults.join(' | '));
    results.push(check('no page errors during the rollback reload', faults.length === 0));

    await ctx.close();
  } finally {
    await browser.close();
    server.close();
  }

  const passed = results.filter(Boolean).length;
  console.log(`\n${passed} of ${results.length} rollback checks passed.`);
  if (passed !== results.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
