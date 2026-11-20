import chrome from '@sparticuz/chromium';
import { chromium } from 'playwright-core';
import { prepareChromiumLibraries } from '../chromium-env.mjs';
import { base, staticServer } from '../static-server.mjs';

prepareChromiumLibraries();
const server = await staticServer();
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ args: ['--disable-dev-shm-usage', '--disable-gpu'], executablePath: await chrome.executablePath(), headless: true });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));

await page.goto(origin + base + 'quiz/?s=mathematics&n=3', { waitUntil: 'load' });
await page.waitForSelector('[data-quiz-question] .qcard', { timeout: 20000 });
for (let i = 0; i < 3; i++) {
  const options = page.locator('[data-quiz-question] .opt[data-option]');
  const n = await options.count();
  for (let j = 0; j < n; j++) {
    await options.nth(j).click();
    await page.waitForTimeout(50);
    if (await page.locator('[data-quiz-question] .opt[data-state="correct"]').count() > 0) { await options.nth(j).click(); await page.waitForTimeout(50); break; }
  }
  await page.locator('[data-quiz-check]').click();
  await page.waitForTimeout(120);
  if (await page.locator('[data-quiz-next]').isVisible()) await page.locator('[data-quiz-next]').click();
  else await page.locator('[data-quiz-finish]').click();
  await page.waitForTimeout(120);
}
await page.waitForSelector('[data-quiz-result] .score-hero', { timeout: 15000 });

await page.goto(origin + base + 'plan/', { waitUntil: 'load' });
await page.waitForSelector('#plan-list a', { timeout: 15000 });
const hrefs = await page.locator('#plan-list a').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
console.log('plan hrefs:', hrefs);

const retryHref = hrefs.find((h) => h && h.includes('retry='));
console.log('retry link:', retryHref);
await page.goto(origin + retryHref, { waitUntil: 'load' });
await page.waitForTimeout(3000);
console.log('error node:', await page.locator('[data-quiz-error]').textContent());
console.log('loading hidden:', await page.locator('[data-quiz-loading]').isHidden());
console.log('retry position:', await page.locator('[data-quiz-position]').textContent());
console.log('retry progress:', await page.locator('[data-quiz-progress]').textContent());

await browser.close();
server.close();
