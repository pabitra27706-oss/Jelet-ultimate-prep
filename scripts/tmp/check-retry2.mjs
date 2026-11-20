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

await page.goto(origin + base + 'quiz/?s=mathematics&n=3', { waitUntil: 'load' });
await page.waitForSelector('[data-quiz-question] .qcard', { timeout: 20000 });
for (let i = 0; i < 3; i++) {
  const options = page.locator('[data-quiz-question] .opt[data-option]');
  const n = await options.count();
  for (let j = 0; j < n; j++) {
    await options.nth(j).click();
    await page.waitForTimeout(60);
    if (await page.locator('[data-quiz-question] .opt[data-state="correct"]').count() > 0) { await options.nth(j).click(); await page.waitForTimeout(60); break; }
  }
  await page.locator('[data-quiz-check]').click();
  await page.waitForTimeout(120);
  if (await page.locator('[data-quiz-next]').isVisible()) await page.locator('[data-quiz-next]').click();
  else await page.locator('[data-quiz-finish]').click();
  await page.waitForTimeout(120);
}
await page.waitForSelector('[data-quiz-result] .score-hero', { timeout: 15000 });
const attempts = await page.evaluate(() => JSON.parse(localStorage.getItem('jelet:attempts:v1')).attempts);
console.log('attempt:', JSON.stringify(attempts[0], null, 1).slice(0, 1200));
await browser.close();
server.close();
