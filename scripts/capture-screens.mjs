/**
 * Capture shared-shell screenshots from the built static artifact.
 *
 * Usage (after `npm run build`):
 *
 *   node scripts/capture-screens.mjs --out docs/phases/14-ui-rebuild/screenshots \
 *     --routes "/,you/,learn/,practice/,library/,offline/,review/" \
 *     --themes light,dark --widths 390,1280
 *
 * Each capture is a real headless-Chromium render of `dist/` served at the
 * site's real subpath, with the theme stored before first paint. These are
 * agent-generated browser screenshots, not physical-device evidence: the
 * phone bezel, status bar and home indicator in the owner's concepts are not
 * part of the page and are deliberately absent.
 *
 * The script writes only into the directory it is given. It is a review aid
 * for the per-screen UI phases, not a test.
 */
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import chrome from '@sparticuz/chromium';
import { chromium } from 'playwright-core';

import { prepareChromiumLibraries } from './chromium-env.mjs';
import { base, staticServer } from './static-server.mjs';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index].replace(/^--/, ''), process.argv[index + 1]);
}
const out = resolve(args.get('out') ?? 'screenshots');
const routes = (args.get('routes') ?? '/').split(',').map((route) => route.trim()).filter(Boolean);
const themes = (args.get('themes') ?? 'light').split(',').map((theme) => theme.trim());
const widths = (args.get('widths') ?? '390').split(',').map((width) => Number.parseInt(width, 10));
const height = Number.parseInt(args.get('height') ?? '', 10);

prepareChromiumLibraries();
const server = await staticServer();
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  args: ['--disable-dev-shm-usage', '--disable-gpu'],
  executablePath: await chrome.executablePath(),
  headless: true,
});
console.log(`Chromium ${browser.version()} · ${origin}${base}`);

await mkdir(out, { recursive: true });
const name = (route, theme, width) => {
  const slug = route === '/' ? 'today' : route.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  return `${slug}-${width === 390 ? 'mobile' : width === 1280 ? 'desktop' : width}-${theme}.png`;
};

try {
  for (const width of widths) {
    const viewport = { width, height: height || (width < 700 ? 844 : 900) };
    for (const theme of themes) {
      for (const route of routes) {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
        await context.addInitScript((value) => {
          try { localStorage.setItem('jelet:theme', value); } catch { /* storage blocked */ }
        }, theme);
        const page = await context.newPage();
        const faults = [];
        page.on('pageerror', (error) => faults.push(error.message));
        page.on('console', (message) => { if (message.type() === 'error') faults.push(message.text()); });
        const response = await page.goto(origin + base + route.replace(/^\//, ''), { waitUntil: 'load' });
        if (!response || response.status() !== 200) throw new Error(`${route} returned ${response?.status()}`);
        await page.waitForTimeout(250);
        const path = resolve(out, name(route, theme, width));
        await page.screenshot({ path, fullPage: false });
        if (faults.length > 0) throw new Error(`${route} ${theme} ${width}px: ${faults.join(' | ')}`);
        console.log(`saved ${path}`);
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}
