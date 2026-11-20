import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { after, before, test } from 'node:test';
import chrome from '@sparticuz/chromium';
import { chromium } from 'playwright-core';

import { prepareChromiumLibraries } from '../scripts/chromium-env.mjs';
import { base, staticServer } from '../scripts/static-server.mjs';

const root = resolve('dist');
let browser, origin, server;
const chapter = 'learn/parallel-circuits/';
const card = 'cards/orig-parallel-independent-v1/';
const paper2025 = 'jelet-et-p1-2025';

before(async () => {
  prepareChromiumLibraries();
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
  page.setDefaultTimeout(8000);
  page.setDefaultNavigationTimeout(12000);
  const faults = [];
  page.on('pageerror', (e) => faults.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') faults.push(m.text()); });
  page.on('request', (r) => { if (!r.url().startsWith(origin + base)) faults.push(`unexpected request: ${r.url()}`); });
  page.on('dialog', (dialog) => dialog.accept());
  t.after(() => assert.deepEqual(faults, []));
  return page;
}
const go = (page, path = '') => page.goto(origin + base + path);
const closed = (page, selector) => page.locator(selector).evaluate((el) => !el.open);

/* ------------------------------------------------------------------ *
 * Artifact
 * ------------------------------------------------------------------ */

test('built artifact contains only the published routes and vendored assets', async () => {
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => (entry.parentPath && entry.parentPath !== root ? `${entry.parentPath.slice(root.length + 1)}/${entry.name}` : entry.name))
    .sort();
  // One allowlist, shared with the Pages workflow, so nothing can ship by accident.
  const allowlist = JSON.parse(await readFile(resolve('scripts/public-artifact.json'), 'utf8'));
  const allowed = new Set(allowlist.files);
  const directories = allowlist.assetDirectories;
  const unexpected = files.filter((file) => {
    if (allowed.has(file)) return false;
    if (directories.some((directory) => file.startsWith(directory))) return false;
    return true;
  });
  assert.deepEqual(unexpected, [], 'every published file is on the allowlist');
  assert.deepEqual(files.filter((file) => file.startsWith('_astro/')).filter((file) => !['.js', '.css'].includes(extname(file))), [], 'only compiled JS and CSS ship');
  assert(files.includes('practice/jelet-et-p1-2025/index.html'));
  assert(files.includes('library/jelet-et-p1-2025/index.html'));
  assert(files.includes('review/index.html'));
  assert(files.includes('syllabus/index.html'));
  assert(files.includes('cards/orig-parallel-independent-v1/index.html'));
  assert(!files.some((file) => file.startsWith('archive/')));
  assert.equal((await fetch(`${origin}/`)).status, 404);
  assert.equal((await fetch(`${origin}${base}archive/`)).status, 404);
  assert.equal((await fetch(`${origin}${base}unknown/`)).status, 404);
  assert.equal((await fetch(`${origin}${base}practice/unknown/`)).status, 404);
});

test('the old published practice-card address still lands on the card', async (t) => {
  const page = await context(t);
  await go(page, 'practice/orig-parallel-independent-v1/');
  await page.waitForURL((url) => url.pathname.endsWith('/cards/orig-parallel-independent-v1/'), { timeout: 8000 });
  assert.match(await page.locator('h1').first().textContent(), /parallel/i);
});

test('the answer key file is published, marked with its tier and never leaks a private key', async () => {
  const response = await fetch(`${origin}${base}data/keys.json`);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.schema, 1);
  const entry = data.keys['jelet-et-p1-2025:q1'];
  assert.deepEqual(entry.key, ['D']);
  assert.equal(entry.tier, 'official');
  assert.equal(entry.voided, false);
  assert.equal(data.keys['jelet-et-p1-2025:q41'].voided, true);
  assert.equal(data.keys['jelet-et-p1-2022:q1'].tier, 'derived');
});

/* ------------------------------------------------------------------ *
 * Dashboard and library
 * ------------------------------------------------------------------ */

test('the dashboard shows real corpus numbers and an honest empty record', async (t) => {
  const page = await context(t);
  await go(page);
  assert.match(await page.title(), /^Today/);
  const attempted = await page.locator('[data-stat="attempted"]').textContent();
  assert.equal(attempted, '0');
  assert.equal(await page.locator('[data-stat="accuracy"]').textContent(), '—');
  assert(await page.getByText(/790 questions from eight previous-year papers/).isVisible());
  assert(await page.getByRole('link', { name: /Start the 2025 full paper/ }).isVisible());
  assert(await page.getByRole('link', { name: /JELET 2025 · Paper I/ }).first().isVisible());
});

test('the paper library lists every paper with its key tier and real counts', async (t) => {
  const page = await context(t);
  await go(page, 'library/');
  const rows = page.locator('[data-paper-row]');
  assert.equal(await rows.count(), 8);
  await page.selectOption('#filter-key', 'official');
  await page.waitForFunction(() => /3 of 8 papers shown/.test(document.querySelector('#filter-status')?.textContent ?? ''));
  assert.equal(await page.locator('[data-paper-row]:not([hidden])').count(), 3);
  await page.selectOption('#filter-key', 'none');
  await page.waitForFunction(() => /4 of 8 papers shown/.test(document.querySelector('#filter-status')?.textContent ?? ''));
  assert.equal(await page.locator('[data-paper-row]:not([hidden])').count(), 4);
});

test('a paper reader renders typeset maths, the key and the honest hold note', async (t) => {
  const page = await context(t);
  await go(page, `library/${paper2025}/`);
  assert.equal(await page.locator('.katex').count() > 20, true);
  const first = page.locator('#q1');
  assert(await first.getByText('Let').first().isVisible());
  assert(await first.locator('.keynote').first().isVisible());
  // A question whose diagram was never transcribed says so and is not marked.
  const held = page.locator('#q95');
  assert(await held.getByText(/diagram/i).first().isVisible());
  assert(await held.getByText('Not marked').isVisible());
});

/* ------------------------------------------------------------------ *
 * The practice runner
 * ------------------------------------------------------------------ */

test('the runner answers, saves, resumes and marks a paper with the real rules', async (t) => {
  const page = await context(t);
  await go(page, `practice/${paper2025}/`);
  await page.waitForSelector('[data-runner]');

  // Q1 is a Category I item with key D.
  await page.locator('.pane.active .opt[data-option="D"]').click();
  assert.equal(await page.locator('.pane.active .opt[data-option="D"]').getAttribute('aria-pressed'), 'true');
  await page.waitForFunction(() => /1 of 82 answered/.test(document.querySelector('[data-runner-progress-text]')?.textContent ?? ''));

  // Reload: the answer must still be there.
  await page.reload();
  await page.waitForSelector('[data-runner]');
  assert.equal(await page.locator('.pane.active .opt[data-option="D"]').getAttribute('aria-pressed'), 'true');

  // Q2 is Category I with key C; mark it wrong on purpose.
  await page.locator('.pane.active [data-jump="next"]').click();
  await page.locator('.pane.active .opt[data-option="A"]').click();
  await page.locator('.pane.active [data-jump="next"]').click();
  // Q3 is Category I with key A; leave it blank.
  await page.locator('[data-runner-submit]').click();
  await page.waitForSelector('[data-runner-results] .score-hero', { timeout: 15000 });

  // 2025 has three board-voided items (Q41, Q79, Q84). The board awarded
  // them to every candidate, so their three marks are in the total whatever
  // the learner answered: 1 − 0.25 + 0 + 3 = 3.75.
  const score = await page.locator('[data-runner-results] .score-hero b').textContent();
  assert.equal(score, '3.75', 'one correct (+1), one wrong (−0.25), one blank (0) and three board-awarded');
  const summary = page.locator('[data-runner-results] .micro').first();
  assert.match(await summary.textContent(), /1 correct/);
  assert.match(await summary.textContent(), /1 wrong/);
  assert.match(await summary.textContent(), /80 blank/);
  assert.match(await summary.textContent(), /3 voided by the board/);

  // The navigator repaints with the outcome of each item.
  const states = await page.locator('[data-runner-nav] button').evaluateAll((nodes) => nodes.slice(0, 3).map((node) => node.dataset.state));
  assert.deepEqual(states, ['correct', 'wrong', 'wrong']);
});

test('the clock survives a reload without handing back time', async (t) => {
  const page = await context(t);
  await go(page, `practice/${paper2025}/`);
  await page.waitForSelector('[data-runner-timer]');
  const read = () => page.locator('[data-runner-timer]').textContent();
  assert.equal((await read()).trim(), '120:00', 'a fresh paper starts with the full clock');
  await page.waitForTimeout(3500);
  const before = (await read()).trim();
  assert.notEqual(before, '120:00', 'the clock runs down while the learner works');
  await page.reload();
  await page.waitForSelector('[data-runner-timer]');
  const after = (await read()).trim();
  assert.equal(after, before, 'a reload restores the same remaining time, not a fresh clock');
});

test('a submitted paper is final: a second tab cannot overwrite the result', async (t) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  t.after(() => ctx.close());
  const first = await ctx.newPage();
  await first.goto(origin + base + `practice/${paper2025}/`, { waitUntil: 'networkidle' });
  const second = await ctx.newPage();
  await second.goto(origin + base + `practice/${paper2025}/`, { waitUntil: 'networkidle' });
  for (const page of [first, second]) await page.evaluate(() => { window.confirm = () => true; });

  // Two tabs answer the same question differently.
  await first.locator('.pane.active .opt[data-option="D"]').click();
  await second.locator('.pane.active .opt[data-option="B"]').click();
  await second.locator('[data-runner-submit]').click();
  await second.waitForSelector('[data-runner-results] .score-hero', { timeout: 15000 });

  const read = (page) => page.evaluate(() => {
    const stored = JSON.parse(localStorage.getItem('jelet:attempts:v1') ?? 'null');
    const attempt = stored?.attempts?.[0];
    return { submittedAt: attempt?.submittedAt ?? null, q1: attempt?.responses?.['jelet-et-p1-2025:q1'] ?? null };
  });
  const firstResult = await read(second);

  // The other tab submits afterwards. Its submission must be refused.
  await first.locator('[data-runner-submit]').click();
  await first.waitForTimeout(1200);
  const secondResult = await read(second);
  assert.equal(secondResult.submittedAt, firstResult.submittedAt, 'the first submission timestamp stands');
  assert.deepEqual(secondResult.q1, firstResult.q1, 'the recorded answers are unchanged');
});

test('a category II item scores partial credit and a wrong option scores zero', async (t) => {
  const page = await context(t);
  await go(page, `practice/${paper2025}/`);
  await page.waitForSelector('[data-runner]');
  // Open the navigator (it is behind a button on a phone) and jump to Q31.
  await page.locator('[data-runner-navtoggle]').click();
  await page.locator('[data-runner-nav] button').nth(30).click();
  await page.waitForFunction(() => document.querySelector('.pane.active')?.dataset.n === '31');
  // Q31 is Category II with key ABCD: one correct option earns 2 x 1/4 = 0.5.
  await page.locator('.pane.active .opt[data-option="A"]').click();
  await page.locator('[data-runner-nav] button').nth(31).click();
  await page.waitForFunction(() => document.querySelector('.pane.active')?.dataset.n === '32');
  // Q32 is Category II with key BCD: mark only A, which is wrong, so it scores 0.
  await page.locator('.pane.active .opt[data-option="A"]').click();
  await page.locator('[data-runner-submit]').click();
  await page.waitForSelector('[data-runner-results] .score-hero', { timeout: 15000 });
  // 0.5 from the partial credit, plus the three marks the board awarded.
  const score = await page.locator('[data-runner-results] .score-hero b').textContent();
  assert.equal(score, '3.5');
  const summary = page.locator('[data-runner-results] .micro').first();
  assert.match(await summary.textContent(), /1 partial/);
  assert.match(await summary.textContent(), /1 wrong/);
});

test('a board-voided question is awarded to everyone and is never asked for', async (t) => {
  const page = await context(t);
  await go(page, `practice/${paper2025}/`);
  await page.waitForSelector('[data-runner]');

  // 2025 Q41 is a board-voided item. It is in the paper, labelled, and the
  // learner is never asked to answer it.
  const voided = page.locator('.pane[data-voided="true"]');
  assert.equal(await voided.count(), 3, '2025 has three board-voided items in the paper');
  const pane = page.locator('.pane[data-n="41"]');
  assert.equal(await pane.getAttribute('data-voided'), 'true');

  // Open it in the runner so it is on screen.
  await page.locator('[data-runner-navtoggle]').click();
  await page.locator('[data-runner-nav] button', { hasText: /^41$/ }).click();
  await page.waitForFunction(() => document.querySelector('.pane.active')?.dataset.n === '41');
  assert(await pane.getByText('Voided by the board').first().isVisible(), 'the pane says the board voided it');
  assert(await pane.locator('[data-void-notice]').isVisible(), 'the pane explains the marks go to every candidate');

  // Its options are not live: clicking one does not record an answer.
  await pane.locator('.opt[data-option="A"]').click();
  assert.equal(await pane.locator('.opt[data-option="A"]').getAttribute('aria-pressed'), 'false');

  // It is not reported as unanswered and it does not block submission.
  const progress = await page.locator('[data-runner-progress-text]').textContent();
  assert.match(progress, /3 voided by the board/, 'the progress bar reports the board-awarded items');
  assert.doesNotMatch(progress, /83 of/, 'the voided items are not counted as unanswered');

  // Submitting with nothing answered warns only about the answerable items.
  await page.locator('[data-runner-submit]').click();
  await page.waitForSelector('[data-runner-results] .score-hero', { timeout: 15000 });
  const score = await page.locator('[data-runner-results] .score-hero b').textContent();
  assert.equal(score, '3', 'the three voided items carry their marks with no answers at all');
  assert.match(await page.locator('[data-runner-results] .micro').first().textContent(), /3 voided by the board/);
});

test('a board-voided question never enters the review queue', async (t) => {
  const page = await context(t);
  await go(page, `practice/${paper2025}/`);
  await page.waitForSelector('[data-runner]');
  await page.locator('.pane.active .opt[data-option="B"]').click();
  await page.locator('[data-runner-submit]').click();
  await page.waitForSelector('[data-runner-results] .score-hero', { timeout: 15000 });

  await go(page, 'review/');
  await page.waitForFunction(() => (document.querySelector('[data-stat="queue"]')?.textContent ?? '') !== '—');
  // The paper now holds 85 items: 82 keyed and 3 board-voided. All 82 keyed
  // items are wrong or blank, so all 82 are queued. The three voided items
  // were awarded to everyone and are not mistakes, so they are not queued.
  assert.equal(await page.locator('[data-stat="queue"]').textContent(), '82');
  const queueText = await page.locator('#queue-list').textContent();
  assert.doesNotMatch(queueText, /Q41/, 'a voided question is never queued for revision');
});

test('the subject drill only contains that subject and marks its own scope', async (t) => {
  const page = await context(t);
  await go(page, `practice/${paper2025}/mathematics/`);
  await page.waitForSelector('[data-runner]');
  const subjects = await page.locator('.pane').evaluateAll((nodes) => [...new Set(nodes.map((node) => node.dataset.subjectKey))]);
  assert.deepEqual(subjects, ['mathematics']);
  const count = await page.locator('.pane').count();
  assert.equal(count, 40, '2025 mathematics: 30 Category I + 10 Category II, all markable');
});

test('a submitted attempt reaches the review desk and the dashboard', async (t) => {
  const page = await context(t);
  await go(page, `practice/${paper2025}/`);
  await page.waitForSelector('[data-runner]');
  await page.locator('.pane.active .opt[data-option="B"]').click();
  await page.locator('[data-runner-submit]').click();
  await page.waitForSelector('[data-runner-results] .score-hero', { timeout: 15000 });

  await go(page, 'review/');
  await page.waitForFunction(() => (document.querySelector('[data-stat="queue"]')?.textContent ?? '') !== '—');
  assert.equal(await page.locator('[data-stat="queue"]').textContent(), '82', 'every unanswered item joins the queue');
  assert.equal(await page.locator('[data-stat="due"]').textContent(), '82');
  await page.getByRole('link', { name: 'Open the question' }).first().waitFor();

  await go(page);
  assert.equal(await page.locator('[data-stat="attempted"]').textContent(), '82');
  assert.equal(await page.locator('[data-stat="accuracy"]').textContent(), '0%');
});

test('the navigator, mark-for-review and clear all work without a server', async (t) => {
  const page = await context(t);
  await go(page, `practice/${paper2025}/`);
  await page.waitForSelector('[data-runner]');
  await page.locator('.pane.active .opt[data-option="A"]').click();
  await page.locator('[data-runner-mark]').click();
  await page.waitForFunction(() => document.querySelector('[data-runner-nav] button')?.dataset.state === 'marked');
  await page.locator('[data-runner-clear]').click();
  await page.waitForFunction(() => /0 of 82 answered/.test(document.querySelector('[data-runner-progress-text]')?.textContent ?? ''));
});

test('the mock builder composes a paper from the real corpus and shows exactly what it holds', async (t) => {
  const page = await context(t);
  await go(page, 'mock/');
  await page.waitForSelector('[data-mock-plan-body] table');

  // The plan is the paper, not an estimate: the counts add up and the
  // subject table names the real subjects.
  const summary = await page.locator('[data-mock-plan-summary]').textContent();
  assert.match(summary, /40 questions/);
  const rows = await page.locator('[data-mock-plan-body] tbody tr').count();
  assert.ok(rows >= 4, 'the plan lists a row per subject');

  // The questions are listed with the paper each one came from.
  const firstRow = await page.locator('[data-mock-plan-questions] tbody tr').first().textContent();
  assert.match(firstRow, /20\d\d Q\d+/, 'a planned question names its paper and its number');
  const planned = await page.locator('[data-mock-plan-questions] tbody tr').count();
  assert.equal(planned, 40, 'the plan lists every question of the mock');

  // Changing the count changes the plan.
  await page.locator('[data-mock-count]').fill('15');
  await page.waitForFunction(() => /15 questions/.test(document.querySelector('[data-mock-plan-summary]')?.textContent ?? ''));
});

test('a composed mock sits, marks with the board rules and lands in the review desk', async (t) => {
  const page = await context(t);
  await go(page, 'mock/run/?s=physics&n=10&m=paper&d=20&seed=5');
  await page.waitForSelector('.pane[data-question]');

  const count = await page.locator('.pane').count();
  assert.equal(count, 10, 'the mock holds the ten questions that were asked for');
  const subjects = await page.locator('.pane').evaluateAll((nodes) => [...new Set(nodes.map((node) => node.dataset.subjectKey))]);
  assert.deepEqual(subjects, ['physics'], 'only the chosen subject is drawn');
  const numbers = await page.locator('.pane').evaluateAll((nodes) => nodes.map((node) => node.dataset.n));
  assert.deepEqual(numbers, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], 'a mock numbers its own questions');
  const sources = await page.locator('.pane').evaluateAll((nodes) => nodes.map((node) => node.dataset.sourcePaper));
  assert.ok(sources.every((paper) => /^jelet-et-p1-20\d\d$/.test(paper)), 'every question remembers the paper it came from');
  assert.ok(await page.locator('.pane [data-source-chip]').first().isVisible(), 'the learner is told where the question came from');

  // The clock is the one that was asked for.
  assert.equal((await page.locator('[data-runner-timer]').textContent()).trim(), '20:00');

  // Answer the first question with a deliberately wrong option and submit.
  // The wrong option is read from the published key rather than hard-coded,
  // because a mock's composition changes whenever the corpus grows, and a
  // hard-coded letter would quietly start marking the right answer.
  const publishedKey = await (await fetch(`${origin}${base}data/keys.json`)).json();
  const firstId = await page.locator('.pane.active').getAttribute('data-question');
  const firstKey = publishedKey.keys[firstId]?.key ?? [];
  const wrongOption = ['A', 'B', 'C', 'D'].find((letter) => !firstKey.includes(letter));
  assert.ok(wrongOption, `the first mock question ${firstId} has a key to be wrong about`);
  await page.locator(`.pane.active .opt[data-option="${wrongOption}"]`).click();
  await page.locator('[data-runner-submit]').click();
  await page.waitForSelector('[data-runner-results] .score-hero', { timeout: 15000 });
  const summaryText = await page.locator('[data-runner-results]').textContent();
  assert.match(summaryText, /10 questions were in scope/, 'the mock marks its own scope');
  assert.match(summaryText, /1 wrong/, 'the wrong answer is marked wrong');

  // The wrong and blank questions go to the review desk under the paper they
  // actually came from.
  await go(page, 'review/');
  await page.waitForFunction(() => (document.querySelector('[data-stat="queue"]')?.textContent ?? '') !== '\u2014');
  const queue = Number(await page.locator('[data-stat="queue"]').textContent());
  assert.ok(queue >= 9, 'every unanswered item joins the queue');
  const link = await page.locator('#queue-list a').first().getAttribute('href');
  assert.match(link, /\/library\/jelet-et-p1-20\d\d\/#q\d+$/, 'a queued question links to the paper that holds it');
});

test('a mock is a link: the same specification always composes the same paper', async (t) => {
  const page = await context(t);
  await go(page, 'mock/run/?s=chemistry&n=8&m=paper&d=0&seed=77');
  await page.waitForSelector('.pane[data-question]');
  const first = await page.locator('.pane').evaluateAll((nodes) => nodes.map((node) => node.dataset.question));
  await page.reload();
  await page.waitForSelector('.pane[data-question]');
  const second = await page.locator('.pane').evaluateAll((nodes) => nodes.map((node) => node.dataset.question));
  assert.deepEqual(second, first, 'the same link composes the same paper');
});

test('the mock attempt keeps its specification and can be repeated from the review desk', async (t) => {
  const page = await context(t);
  await go(page, 'mock/run/?s=electrical&n=6&m=paper&d=10&seed=3');
  await page.waitForSelector('.pane[data-question]');
  await page.locator('.pane.active .opt[data-option="A"]').click();
  await page.locator('[data-runner-submit]').click();
  await page.waitForSelector('[data-runner-results] .score-hero', { timeout: 15000 });

  await go(page, 'review/');
  const repeat = page.getByRole('link', { name: 'Repeat the wrong ones' }).first();
  await repeat.waitFor();
  const href = await repeat.getAttribute('href');
  assert.match(href, /\/mock\/run\/\?.*retry=/, 'a mock is repeated through its own link');

  // Following the link comes back to the same mock, with only the wrong
  // questions in it. The panes that are not part of the repeat are hidden
  // rather than removed, so the selector has to ask for a visible one.
  await go(page, href.replace(/^.*\/mock\//, 'mock/'));
  await page.waitForSelector('.pane:not([hidden])');
  const count = await page.locator('.pane:not([hidden])').count();
  assert.ok(count > 0 && count <= 6, 'the repeat holds only the questions that were wrong');
});

test('the plan is built from the learner\u2019s own record, not from a guess', async (t) => {
  const page = await context(t);

  // With nothing on the device, the plan is honest about that.
  await go(page, 'plan/');
  await page.waitForSelector('#plan-list a');
  assert.match(await page.locator('[data-plan-note]').textContent(), /have not sat a paper/);
  assert.equal(await page.locator('[data-signal="accuracy"]').textContent(), '\u2014', 'no accuracy without an attempt');
  assert.equal(await page.locator('[data-signal="coverage"]').textContent(), '0%');
  assert.equal(await page.locator('#week-list tbody tr').count(), 7, 'the week is always seven days');

  // Sit a paper. The plan must now know about it.
  await go(page, `practice/${paper2025}/`);
  await page.waitForSelector('[data-runner]');
  await page.locator('.pane.active .opt[data-option="B"]').click();
  await page.locator('[data-runner-submit]').click();
  await page.waitForSelector('[data-runner-results] .score-hero', { timeout: 15000 });

  await go(page, 'plan/');
  await page.waitForSelector('#plan-list a');
  const steps = await page.locator('#plan-list a').allTextContents();
  const joined = steps.join(' | ');
  assert.match(joined, /Revise \d+ question/, 'the plan asks for the reviews that are due');
  assert.match(joined, /Read one lesson/, 'the plan asks for one lesson');
  assert.match(joined, /Do two problems/, 'the plan asks for two problems');
  assert.match(joined, /Repeat the \d+ you got wrong/, 'the plan asks for one repeat');
  assert.match(await page.locator('[data-plan-note]').textContent(), /Your last paper was today|You sat a paper today/);
  assert.notEqual(await page.locator('[data-signal="accuracy"]').textContent(), '\u2014');
  assert.ok(Number(await page.locator('[data-signal="due"]').textContent()) > 0, 'items due is separate from coverage');
});

test('the review desk says where the mistakes are, and the reason tag is the learner\u2019s own', async (t) => {
  const page = await context(t);
  await go(page, `practice/${paper2025}/`);
  await page.waitForSelector('[data-runner]');
  await page.locator('.pane.active .opt[data-option="B"]').click();
  await page.locator('[data-runner-submit]').click();
  await page.waitForSelector('[data-runner-results] .score-hero', { timeout: 15000 });

  await go(page, 'review/');
  await page.waitForSelector('#remediation-list table', { timeout: 15000 });
  const firstRow = await page.locator('#remediation-list tbody tr').first().textContent();
  assert.match(firstRow, /MATHEMATICS|PHYSICS|CHEMISTRY|FUNDAMENTALS/i, 'a topic of the syllabus is named');
  const drill = await page.locator('#remediation-list a').first().getAttribute('href');
  assert.match(drill, /\/quiz\/\?s=/, 'a drill can be built from the topic');

  // The reason tag is optional and it is the learner's own word.
  await page.waitForSelector('[data-reason-for] button');
  await page.locator('[data-reason-for] button').first().click();
  await page.waitForSelector('[data-reason-for] [aria-pressed="true"]', { timeout: 15000 });
  const tagged = await page.locator('[data-reason-for]').first().textContent();
  assert.match(tagged, /You said:/);
});

test('the subject notes list the past questions of every topic with the learner\u2019s own result', async (t) => {
  const page = await context(t);
  await go(page, 'notes/physics/');
  await page.waitForSelector('[data-question-row]');
  const rows = await page.locator('[data-question-row]').count();
  assert.ok(rows > 30, 'physics holds a real number of past questions');
  const header = await page.locator('[data-topic-table] thead').first().textContent();
  assert.match(header, /Your result/, 'the notes carry the learner\u2019s own result');
  assert.match(await page.locator('[data-notes-summary]').textContent(), /have not sat any/);

  // The notes answer a question that belongs to a topic, and the answer is
  // the published one.
  const answered = await page.locator('[data-question-row] td:nth-child(5)').first().textContent();
  assert.ok(answered.trim().length > 0, 'the published answer is shown');
});

test('the quiz shows one question, marks it when you check it, and shows the paper it came from', async (t) => {
  const page = await context(t);
  await go(page, 'quiz/?s=mathematics&n=3');
  await page.waitForSelector('[data-quiz-question] .qcard', { timeout: 15000 });

  // A quiz is untimed: there is no clock and no navigator.
  assert.equal(await page.locator('[data-runner]').count(), 0, 'a quiz is not a paper');
  assert.match(await page.locator('[data-quiz-lead]').textContent(), /no time limit/);
  assert.equal(await page.locator('[data-quiz-position]').textContent(), 'Question 1 of 3');

  // The answer is marked only when the learner checks it.
  await page.locator('[data-quiz-question] .opt[data-option]').first().click();
  assert.equal(await page.locator('[data-quiz-feedback]').textContent(), '', 'nothing is said before the check');
  await page.locator('[data-quiz-check]').click();
  await page.waitForTimeout(150);
  const feedback = await page.locator('[data-quiz-feedback]').textContent();
  assert.match(feedback, /Key:/, 'the published key is shown');
  assert.match(feedback, /read the question in the paper/, 'the paper it came from is one click away');
  assert.ok(await page.locator('[data-quiz-question] .opt[data-state="correct"]').count() > 0, 'the right option is marked');

  // The place is kept on the device.
  await page.reload({ waitUntil: 'load' });
  await page.waitForSelector('[data-quiz-question] .qcard', { timeout: 15000 });
  assert.equal(await page.locator('[data-quiz-progress]').textContent(), '1 of 3 checked');
});

test('the quiz marks the board\u2019s own way and files the wrong ones for revision', async (t) => {
  const page = await context(t);
  await go(page, 'quiz/?s=mathematics&n=3');
  await page.waitForSelector('[data-quiz-question] .qcard', { timeout: 15000 });

  // Answer every question wrongly on purpose.
  for (let index = 0; index < 3; index += 1) {
    const options = page.locator('[data-quiz-question] .opt[data-option]');
    const count = await options.count();
    for (let option = 0; option < count; option += 1) {
      await options.nth(option).click();
      await page.waitForTimeout(60);
      if (await page.locator('[data-quiz-question] .opt[data-state="correct"]').count() > 0) {
        await options.nth(option).click();
        await page.waitForTimeout(60);
        break;
      }
    }
    await page.locator('[data-quiz-check]').click();
    await page.waitForTimeout(120);
    if (await page.locator('[data-quiz-next]').isVisible()) await page.locator('[data-quiz-next]').click();
    else await page.locator('[data-quiz-finish]').click();
    await page.waitForTimeout(120);
  }
  await page.waitForSelector('[data-quiz-result] .score-hero', { timeout: 15000 });
  const hero = await page.locator('[data-quiz-result] .score-hero').textContent();
  assert.match(hero, /3 wrong/, 'every wrong answer is counted');
  assert.equal(await page.locator('[data-quiz-result] .result-row').count(), 3, 'every question is listed');

  // The wrong questions wait for revision, filed under the paper that holds them.
  const queue = await page.evaluate(() => JSON.parse(localStorage.getItem('jelet:review:v1') ?? '{"items":[]}'));
  assert.equal(queue.items.length, 3, 'the three wrong questions are in the queue');
  for (const item of queue.items) {
    assert.match(item.paperId, /^jelet-et-p1-\d{4}$/, 'each is filed under the paper it came from');
    assert.equal(item.lastStatus, 'wrong');
  }

  // And the plan now knows about the quiz.
  await go(page, 'plan/');
  await page.waitForSelector('#plan-list a', { timeout: 15000 });
  const steps = (await page.locator('#plan-list a').allTextContents()).join(' | ');
  assert.match(steps, /Revise 3 questions that are due/);
});

test('the repeat step of the plan shows only the questions that were wrong', async (t) => {
  const page = await context(t);

  await go(page, 'quiz/?s=mathematics&n=3');

  // The published key, so the test can answer one question right on purpose.
  const keys = await page.evaluate(async () => {
    const response = await fetch(`${location.pathname.replace(/quiz\/.*$/, '')}data/keys.json`);
    return (await response.json()).keys;
  });
  await page.waitForSelector('[data-quiz-question] .qcard', { timeout: 15000 });

  // Question 1 right, question 2 wrong, question 3 wrong.
  for (let index = 0; index < 3; index += 1) {
    const questionId = await page.locator('[data-quiz-question] .qcard').getAttribute('data-quiz-question-id');
    const key = keys[questionId]?.key ?? [];
    const options = page.locator('[data-quiz-question] .opt[data-option]');
    const count = await options.count();
    if (index === 0) {
      for (let option = 0; option < count; option += 1) {
        if ((await options.nth(option).getAttribute('data-option')) === key[0]) {
          await options.nth(option).click();
          break;
        }
      }
    } else {
      // Any option the key does not name.
      for (let option = 0; option < count; option += 1) {
        const letter = await options.nth(option).getAttribute('data-option');
        if (!key.includes(letter)) {
          await options.nth(option).click();
          break;
        }
      }
    }
    await page.locator('[data-quiz-check]').click();
    await page.waitForTimeout(150);
    const label = await page.locator('[data-quiz-feedback]').textContent();
    if (index === 0) assert.match(label, /^Correct/, 'the right answer is marked right');
    else assert.match(label, /^Wrong/, 'the wrong answer is marked wrong');
    if (await page.locator('[data-quiz-next]').isVisible()) await page.locator('[data-quiz-next]').click();
    else await page.locator('[data-quiz-finish]').click();
    await page.waitForTimeout(150);
  }
  await page.waitForSelector('[data-quiz-result] .score-hero', { timeout: 15000 });

  await go(page, 'plan/');
  await page.waitForSelector('#plan-list a', { timeout: 15000 });
  const repeat = page.locator('#plan-list a').filter({ hasText: 'Repeat the' }).first();
  const href = await repeat.getAttribute('href');
  assert.match(href, /retry=/, 'the repeat carries the attempt it repeats');

  await page.goto(origin + href);
  await page.waitForSelector('[data-quiz-question] .qcard', { timeout: 15000 });
  assert.match(await page.locator('[data-quiz-position]').textContent(), /Question 1 of 2/, 'only the wrong questions are repeated');
});

test('a quiz of a topic says so, and the builder opens on the set the link asked for', async (t) => {
  const page = await context(t);
  await go(page, 'quiz/?s=physics&t=t01&n=2');
  await page.waitForSelector('[data-quiz-question] .qcard', { timeout: 15000 });
  assert.equal(await page.locator('[data-quiz-position]').textContent(), 'Question 1 of 2');
  const chips = await page.locator('[data-quiz-chips]').innerText();
  assert.match(chips, /2 questions/);

  // The mock builder opens on the selection the link carries.
  await go(page, 'mock/?s=chemistry&n=12');
  await page.waitForSelector('[data-mock-plan-questions]', { state: 'attached', timeout: 15000 });
  assert.equal(await page.locator('input[name="s"][value="chemistry"]').isChecked(), true, 'the subject is chosen');
  assert.equal(await page.locator('input[name="s"][value="mathematics"]').isChecked(), false, 'the other subjects are not');
  assert.equal(await page.locator('[data-mock-count]').inputValue(), '12');
  let rows = await page.locator('[data-mock-plan-questions] tbody tr').count();
  assert.equal(rows, 12, 'the plan is the set that was asked for');
  let subjects = await page.locator('[data-mock-plan-questions] tbody tr td:nth-child(2)').allTextContents();
  assert.deepEqual([...new Set(subjects.map((name) => name.toUpperCase()))], ['CHEMISTRY'], 'every planned question is from the subject that was asked for');

  // A topic in the link narrows the plan to that topic.
  await go(page, 'mock/?s=chemistry&t=tb&n=12');
  await page.waitForSelector('[data-mock-plan-questions]', { state: 'attached', timeout: 15000 });
  assert.equal(await page.locator('input[name="t"][value="chemistry-tb"]').isChecked(), true, 'the topic is chosen');
  rows = await page.locator('[data-mock-plan-questions] tbody tr').count();
  assert.ok(rows < 12, 'the plan is narrowed by the topic');
  const topics = await page.locator('[data-mock-plan-questions] tbody tr td:nth-child(6)').allTextContents();
  assert.ok(topics.every((name) => name.includes('Chemical Bonding')), 'every planned question is from that topic');
});

test('the printed companion prints an answer sheet in the booklet order and a ledger', async (t) => {
  const page = await context(t);
  await go(page, `practice/${paper2025}/print/`);
  await page.waitForSelector('[data-omr-sheet]');

  // The sheet names the booklet it belongs to, and says how that was known.
  const body = await page.locator('body').textContent();
  assert.match(body, /Set A/, 'the sheet names the set');
  assert.match(body, /booklet/i, 'the sheet names the booklet');

  // One row per printed number, in printed order.
  const rows = await page.locator('[data-omr-row]').evaluateAll((nodes) => nodes.map((node) => Number(node.dataset.omrRow)));
  assert.ok(rows.length > 90, `the sheet covers the paper: ${rows.length} rows`);
  const sorted = [...rows].sort((a, b) => a - b);
  assert.deepEqual(rows, sorted, 'the sheet is in printed order');
  assert.equal(new Set(rows).size, rows.length, 'no printed number is duplicated');

  // The ledger covers the same printed numbers.
  const ledgerRows = await page.locator('[data-ledger-row]').evaluateAll((nodes) => nodes.map((node) => Number(node.dataset.ledgerRow)));
  assert.deepEqual(ledgerRows, rows, 'the ledger and the sheet cover the same numbers in the same order');

  // A voided row takes no bubble and says so.
  const voided = page.locator('[data-omr-row][data-omr-status="voided"]');
  assert.equal(await voided.count(), 3, 'the sheet carries the three board-voided rows');
  const bubbles = await voided.locator('.omr-bubble').evaluateAll((nodes) => nodes.map((node) => node.className.includes('off')));
  assert.ok(bubbles.every((off) => off), 'a voided row offers no bubble to fill');

  // A held row is not offered either.
  const held = page.locator('[data-omr-row][data-omr-status="held"]');
  assert.ok(await held.count() > 0, 'the sheet carries the held rows');
  const heldBubbles = await held.locator('.omr-bubble').evaluateAll((nodes) => nodes.map((node) => node.className.includes('off')));
  assert.ok(heldBubbles.every((off) => off), 'a held row offers no bubble to fill');

  // The sheet must never state an answer.
  const sheetText = await page.locator('[data-omr-sheet]').textContent();
  assert.doesNotMatch(sheetText, /Answer: [A-D]/, 'the printed sheet states no answer');
});

test('the reconciliation page shows the reference sheet and the expected totals', async (t) => {
  const page = await context(t);
  await go(page, `practice/${paper2025}/reconciliation/`);
  await page.waitForSelector('[data-reference-sheet]');

  // The reference sheet exercises every scoring path, including the board's.
  const statuses = await page.locator('[data-reference-status]').evaluateAll((nodes) => [...new Set(nodes.map((node) => node.dataset.referenceStatus))]);
  for (const status of ['correct', 'wrong', 'blank', 'partial', 'voided']) {
    assert.ok(statuses.includes(status), `the reference sheet exercises ${status}`);
  }

  // The credited total is stated, and it includes the board's award.
  const credited = await page.locator('[data-reference-total]').textContent();
  assert.ok(credited && credited.trim().length > 0, 'the credited total is stated');
  const body = await page.locator('body').textContent();
  assert.match(body, /Awarded to every candidate/, 'the board award is shown separately');
  assert.match(body, /103 of the paper's 120 printed marks|103 of the paper/, 'the marks a candidate can earn are stated');
});

/* ------------------------------------------------------------------ *
 * Search, syllabus, lesson and workspace
 * ------------------------------------------------------------------ */

test('local search finds a past exam question by number and filters by tier', async (t) => {
  const page = await context(t);
  await go(page, 'search/');
  await page.waitForFunction(() => /results? on this device/.test(document.querySelector('[data-search-status]')?.textContent ?? ''));
  await page.locator('input[name="q"]').fill('JELET 2025 · Q31');
  await page.waitForFunction(() => /result/.test(document.querySelector('[data-search-status]')?.textContent ?? ''));
  const link = page.locator('#search-results a[href*="#q31"]').first();
  await link.waitFor();
  assert.match(await link.getAttribute('href'), /library\/jelet-et-p1-2025\/#q31/);
  await page.selectOption('select[name="readiness"]', 'read-only');
  await page.waitForFunction(() => /0 results/.test(document.querySelector('[data-search-status]')?.textContent ?? ''));
});

test('the syllabus page lists every topic group and the exam pattern', async (t) => {
  const page = await context(t);
  await go(page, 'syllabus/');
  assert(await page.getByRole('heading', { name: 'Syllabus.' }).isVisible());
  const topics = await page.locator('section ol li').count();
  assert.equal(topics, 42, '11 mathematics + 15 physics + 8 chemistry + 8 electrical');
  assert(await page.getByText('Category I').first().isVisible());
});

test('fresh touch-sized navigation: Today → Papers → a question → Back', async (t) => {
  const page = await context(t);
  await go(page);
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Papers' }).click();
  await page.getByRole('link', { name: /JELET 2025 · Paper I/ }).first().click();
  assert(new URL(page.url()).pathname.endsWith(`/library/${paper2025}/`));
  await page.getByRole('link', { name: 'Physics' }).click();
  assert.equal(new URL(page.url()).hash, '#subject-physics');
});

test('hint and notebook progress survives returning and reload, without showing answers automatically', async (t) => {
  const page = await context(t);
  await go(page, chapter + '#guided-practice');
  await page.getByText('Hint 1 · Trace the nodes', { exact: true }).click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('jelet:parallel-circuits:v1') ?? 'null')?.guidedHints.includes('hint-one'));
  assert(await closed(page, '[data-reveal="hint-two"]'));
  await go(page);
  const resume = page.getByRole('link', { name: /Parallel circuits · the lesson/ });
  await resume.click();
  assert.equal(new URL(page.url()).hash, '#guided-practice');
  await page.getByText('Guided hint opened on this browser.').waitFor();
  assert(!(await closed(page, '[data-reveal="hint-one"]')));
  assert(await closed(page, '[data-reveal="guided-check"]'));
});

test('the practice card shows stable identity, provenance and answer status without the answer', async (t) => {
  const page = await context(t);
  assert.equal((await go(page, card)).status(), 200);
  assert.equal(await page.locator('[data-public-id]').textContent(), 'orig-parallel-independent-v1');
  assert(await page.getByText('ORIGINAL PRACTICE · NOT A PAST EXAM QUESTION').isVisible());
  const html = await page.content();
  assert(!html.includes('1.5 A'), 'answer leaked into the practice card');
  assert(!html.includes('4.5 A'), 'answer leaked into the practice card');
});

test('workspace saves a bookmark, note and resume, then survives reload', async (t) => {
  const page = await context(t);
  await go(page, 'workspace/');
  await page.waitForFunction(() => {
    const text = document.querySelector('[data-workspace-status]')?.textContent ?? '';
    return /loaded on this device|Storage is unavailable/.test(text);
  });
  await page.locator('#workspace-item').selectOption('practice:orig-parallel-independent-v1');
  await page.locator('#workspace-note').fill('Retry the 9 V circuit');
  await page.getByRole('button', { name: 'Bookmark & resume here' }).click();
  await page.waitForFunction(() => (document.querySelector('[data-workspace-status]')?.textContent ?? '').includes('Saved'));
  await page.getByRole('button', { name: 'Save note' }).click();
  await page.waitForFunction(() => (document.querySelector('#workspace-list')?.textContent ?? '').includes('Retry the 9 V circuit'));
  await page.reload();
  await page.waitForFunction(() => (document.querySelector('#workspace-list')?.textContent ?? '').includes('Retry the 9 V circuit'));
});

/* ------------------------------------------------------------------ *
 * Layout and accessibility
 * ------------------------------------------------------------------ */

test('320px viewport and 200% text: no page-wide overflow on any route', async (t) => {
  const page = await context(t, { viewport: { width: 320, height: 700 } });
  for (const path of ['', 'learn/', chapter + '#revision-sheet', 'practice/', `library/${paper2025}/`, `practice/${paper2025}/`, 'review/', 'syllabus/', 'search/', card]) {
    assert.equal((await go(page, path)).status(), 200);
    await page.addStyleTag({ content: ':root { font-size: 200% !important; }' });
    const width = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    assert(width[0] <= width[1] + 1, `${path}: ${width}`);
  }
});

test('the theme toggle switches the palette and remembers the choice', async (t) => {
  const page = await context(t);
  await go(page);
  const before = await page.evaluate(() => document.documentElement.dataset.theme ?? 'light');
  await page.locator('[data-theme-toggle]').click();
  const after = await page.evaluate(() => document.documentElement.dataset.theme ?? 'light');
  assert.notEqual(before, after);
  await page.reload();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.theme ?? 'light'), after);
});

test('the site keeps working with the network switched off', async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: 'allow' });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(origin + base, { waitUntil: 'load' });
    // The worker registers on load; wait until it controls this page.
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined));
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 15000 });
    // Visit the routes the worker precaches so they land in the cache.
    for (const path of ['library/', 'practice/', 'review/', 'search/', 'syllabus/', 'data/keys.json']) {
      await page.goto(origin + base + path, { waitUntil: 'load' });
    }
    await page.goto(origin + base, { waitUntil: 'load' });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 15000 });

    await ctx.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.match(await page.locator('h1').first().textContent(), /JELET/i, 'the shell renders from the cache while offline');
    // Cached navigation must work too, not just the home page.
    await page.goto(origin + base + 'syllabus/', { waitUntil: 'domcontentloaded' });
    assert.match(await page.locator('h1').first().textContent(), /Syllabus/i);
    assert.match(await page.locator('.lead').first().textContent(), /2026/, 'the cached syllabus keeps its real content');
    await page.goto(origin + base + 'search/', { waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('#library-search input[name="q"]').count(), 1, 'search works offline from the cached index');
    await page.locator('#library-search input[name="q"]').fill('parallel branches');
    await page.waitForFunction(() => document.querySelectorAll('#search-results a').length > 0, null, { timeout: 10000 });
    assert((await page.locator('#search-results a').count()) > 0, 'the offline index still returns matches');
    await ctx.setOffline(false);
  } finally {
    await ctx.close();
  }
});

test('the offline pack list states what each pack holds before anything is downloaded', async (t) => {
  const page = await context(t);
  await go(page, 'offline/');
  await page.waitForSelector('[data-pack="paper-2025"]');
  const rows = await page.locator('[data-pack]').count();
  assert.ok(rows >= 4, `the packs are listed: ${rows}`);
  const text = await page.locator('[data-pack="paper-2025"]').textContent();
  assert.match(text, /version/i, 'the pack states its version');
  assert.match(text, /KB|MB/, 'the pack states its size');
  assert.match(text, /works with no connection/, 'the pack says whether it works offline');
  // Nothing is downloaded until the learner asks.
  assert.equal(await page.locator('[data-pack-state="paper-2025"]').textContent(), 'Not downloaded.');
  assert.equal(await page.locator('[data-pack-summary]').textContent(), 'Nothing downloaded yet.');
});

test('a downloaded pack opens offline, and removing it leaves the study record alone', async (t) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: 'allow' });
  const page = await ctx.newPage();
  page.setDefaultTimeout(20000);
  page.on('dialog', (dialog) => dialog.accept());
  t.after(() => ctx.close());
  try {
    await page.goto(origin + base + 'offline/', { waitUntil: 'load' });
    await page.waitForSelector('[data-pack="paper-2025"]');

    await page.locator('[data-pack-download="paper-2025"]').click();
    await page.waitForFunction(() => (document.querySelector('[data-pack-state="paper-2025"]')?.textContent ?? '').startsWith('Ready'), null, { timeout: 90000 });
    assert.match(await page.locator('[data-pack-summary]').textContent(), /1 pack ready/);

    // The pack's files live in a pack cache, not the shell cache.
    const caches = await page.evaluate(() => window.caches.keys());
    assert.ok(caches.some((name) => name.startsWith('jelet-pack-paper-2025-')), 'the pack has its own cache');
    assert.ok(!caches.some((name) => name.endsWith('.staging')), 'no staging cache is left behind');

    // The whole paper opens with no connection.
    await ctx.setOffline(true);
    await page.goto(origin + base + 'practice/jelet-et-p1-2025/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-runner]', { timeout: 20000 });
    assert.equal(await page.locator('.pane').count(), 85, 'the whole paper is available offline');
    assert((await page.locator('.katex').count()) > 20, 'the maths renders offline from the cached fonts');
    await ctx.setOffline(false);

    // Remove the pack. The pack files go; the study record stays.
    await page.goto(origin + base + 'practice/jelet-et-p1-2025/', { waitUntil: 'load' });
    await page.locator('.pane.active .opt[data-option="D"]').click();
    await page.locator('[data-runner-submit]').click();
    await page.waitForSelector('[data-runner-results] .score-hero', { timeout: 15000 });

    await page.goto(origin + base + 'offline/', { waitUntil: 'load' });
    await page.waitForSelector('[data-pack="paper-2025"]');
    await page.locator('[data-pack-remove="paper-2025"]').click();
    await page.waitForFunction(() => (document.querySelector('[data-pack-summary]')?.textContent ?? '') === 'Nothing downloaded yet.', null, { timeout: 20000 });
    const after = await page.evaluate(() => window.caches.keys());
    assert.ok(!after.some((name) => name.startsWith('jelet-pack-paper-2025-')), 'the pack files are gone');

    // The attempt the learner just made is still there.
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('jelet:attempts:v1') ?? 'null'));
    assert.ok(stored?.attempts?.length > 0, 'removing a pack does not erase the study record');
  } finally {
    await ctx.close();
  }
});

test('the site declares a manifest and a service worker that caches only its own files', async () => {
  const manifest = JSON.parse(await readFile(resolve('dist/manifest.webmanifest'), 'utf8'));
  assert.equal(manifest.name, 'JELET Ultimate Prep');
  assert.equal(manifest.display, 'standalone');
  const worker = await readFile(resolve('dist/sw.js'), 'utf8');
  assert.match(worker, /self\.location\.origin/);
  assert(!/https?:\/\/(?!self\.location)/.test(worker.replace(/https?:\/\/self\.location/g, '')), 'the worker must not contact another origin');
});

test('the search index ships the whole corpus in a compact payload', async () => {
  const raw = await readFile(resolve('dist/search-index.json'), 'utf8');
  const data = JSON.parse(raw);
  assert.equal(data.version, 2);
  const questions = data.entries.filter((entry) => entry.i.startsWith('question:'));
  assert.equal(questions.length, 790);
  assert(raw.length < 500 * 1024, `index too large: ${raw.length}`);
});

/* ------------------------------------------------------------------ *
 * Phase 07 — the coverage map and the authoring desk
 * ------------------------------------------------------------------ */

test('the coverage dashboard states the real numbers and the gaps beside them', async (t) => {
  const page = await context(t);
  await go(page, 'coverage/');

  const map = JSON.parse(await readFile(resolve('src/data/topics.json'), 'utf8'));
  const topics = map.topics.length;
  const covered = map.topics.filter((topic) => topic.coveredQuestions > 0).length;

  // The headline count must be the one the map records.
  await page.waitForFunction(
    (expected) => (document.querySelector('.stat-grid .stat b')?.textContent ?? '').trim() === expected,
    `${covered} of ${topics}`,
  );

  // The gaps are shown as gaps, not hidden.
  for (const topic of map.topics.filter((entry) => entry.coveredQuestions === 0)) {
    const text = await page.locator('[data-topic]').filter({ hasText: topic.name }).first().innerText();
    assert.match(text, /Not covered/i, `${topic.name} is not shown as uncovered`);
  }

  // The page must not claim more than it has.
  const body = await page.locator('main').innerText();
  assert.match(body, /does not say|not a claim/i, 'the page must state its own limits');
  // No topic may be described as mastered. The page may *say* it does not
  // claim mastery, so the check is on the topic cards themselves.
  const cards = await page.locator('[data-topic]').allInnerTexts();
  for (const card of cards) {
    assert.doesNotMatch(card, /mastered|fully covered|complete/i, `a topic card claims more than it has: ${card.slice(0, 60)}`);
  }
});

test('every topic on the coverage dashboard shows the evidence for its mapping', async (t) => {
  const page = await context(t);
  await go(page, 'coverage/');
  const details = page.locator('[data-topic]');
  const count = await details.count();
  assert.ok(count > 0, 'the dashboard lists no topics');

  // Open a topic that has questions and check the evidence is there.
  const target = details.filter({ has: page.locator('.details-body ul li') }).first();
  await target.locator('summary').click();
  const body = await target.innerText();
  assert.match(body, /matched on/i, 'the topic does not name the terms that produced its mapping');
  assert.match(body, /\d{4} Q\d+/, 'the topic does not point at the questions it covers');
});

test('the review queue lists the ties, the gaps and the unmapped questions', async (t) => {
  const page = await context(t);
  await go(page, 'coverage/');
  const rows = page.locator('[data-review-queue] tbody tr');
  const kinds = await rows.evaluateAll((items) => items.map((item) => item.getAttribute('data-queue-kind')));
  assert.ok(kinds.length > 0, 'the queue is empty');
  for (const kind of kinds) {
    assert.ok(['conflict', 'unmapped', 'uncovered-topic'].includes(kind), `unexpected queue kind ${kind}`);
  }
  // The gaps must be present, because three topics have no markable question.
  assert.ok(kinds.includes('uncovered-topic'), 'the queue does not list the uncovered topics');
});

test('the authoring desk shows the generated exercises with their evidence', async (t) => {
  const page = await context(t);
  await go(page, 'workspace/topics/');
  const variants = JSON.parse(await readFile(resolve('src/data/variants.json'), 'utf8'));
  assert.ok(variants.items.length > 0, 'the generator produced nothing');

  const blocks = page.locator('[data-variant-id]');
  assert.equal(await blocks.count(), variants.items.length, 'the desk does not show every exercise');

  // Open a template and check the exercise carries its seed and its answer.
  await page.locator('[data-template]').first().locator('summary').click();
  const first = page.locator('[data-variant-id]').first();
  const text = await first.innerText();
  assert.match(text, /seed/i, 'the exercise does not show its seed');
  assert.match(text, /Answer/i, 'the exercise does not show its answer');
  assert.match(text, /verified/i, 'the exercise does not show that it was checked');
});

test('the authoring desk and the coverage dashboard agree with each other', async (t) => {
  const page = await context(t);
  await go(page, 'workspace/topics/');
  const map = JSON.parse(await readFile(resolve('src/data/topics.json'), 'utf8'));

  const rows = page.locator('[data-topic-row]');
  assert.equal(await rows.count(), map.topics.length, 'the desk and the map disagree on the topic count');

  const shown = await rows.evaluateAll((items) =>
    items.map((item) => ({
      id: item.getAttribute('data-topic-row'),
      questions: Number.parseInt(item.children[3].textContent ?? '0', 10),
    })),
  );
  for (const topic of map.topics) {
    const row = shown.find((entry) => entry.id === topic.id);
    assert.ok(row, `${topic.id} is missing from the desk`);
    assert.equal(row.questions, topic.coveredQuestions, `${topic.id} shows a different question count`);
  }
});

test('the coverage pages keep working with the network switched off', async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: 'allow' });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(origin + base + 'coverage/', { waitUntil: 'load' });
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined));
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 15000 });
    // The shell precaches the coverage route, so it must be there already.
    const cached = await page.evaluate(async (basePath) => {
      const target = new URL(basePath + 'coverage/', location.origin).href;
      const names = await caches.keys();
      for (const name of names) {
        const cache = await caches.open(name);
        if (await cache.match(target)) return true;
      }
      return false;
    }, base);
    assert.ok(cached, 'the coverage route is not in the shell cache');

    await ctx.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    const heading = await page.locator('h1').first().innerText();
    assert.match(heading, /corpus covers/i, 'the coverage page did not survive being offline');
    // The offline page must still carry real numbers, not an empty shell.
    const body = await page.locator('main').innerText();
    assert.match(body, /42 topics across four subjects/i, 'the offline coverage page lost its real content');
    assert.match(body, /mapped against \d+ corpus questions/i, 'the offline coverage page lost its mapped count');
  } finally {
    await ctx.close();
  }
});

/* ------------------------------------------------------------------ *
 * Phase 08 — the full study-record backup
 * ------------------------------------------------------------------ */

test('the whole study record exports and imports, and a submitted result survives', async (t) => {
  const page = await context(t);

  // Make a real attempt on the 2025 paper and submit it.
  await go(page, 'practice/jelet-et-p1-2025/');
  await page.waitForSelector('[data-runner]');
  await page.locator('.pane.active .opt[data-option="D"]').click();
  await page.waitForFunction(() => /1 of \d+ answered/.test(document.querySelector('[data-runner-progress-text]')?.textContent ?? ''));
  await page.locator('[data-runner-submit]').click();
  await page.waitForSelector('[data-runner-results] .score-hero', { timeout: 15000 });

  // The workspace must show the attempt in the record counts.
  await go(page, 'workspace/');
  await page.waitForFunction(() => {
    const value = document.querySelector('[data-record-attempts]')?.textContent ?? '';
    return Number.parseInt(value, 10) >= 1;
  }, null, { timeout: 15000 });

  const counts = await page.evaluate(() => ({
    attempts: document.querySelector('[data-record-attempts]')?.textContent,
    review: document.querySelector('[data-record-review]')?.textContent,
    notes: document.querySelector('[data-record-notes]')?.textContent,
  }));
  assert.equal(Number.parseInt(counts.attempts, 10), 1, 'the attempt is not in the record');

  // Export the record. The download is intercepted so the bytes can be read.
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15000 }),
    page.locator('#export-record').click(),
  ]);
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8');
  const backup = JSON.parse(text);

  assert.equal(backup.kind, 'jelet-full-backup');
  assert.equal(backup.attempts.length, 1, 'the exported file does not carry the attempt');
  assert.ok(backup.attempts[0].submittedAt, 'the exported attempt is not marked as submitted');
  assert.ok(backup.attempts[0].results, 'the exported attempt carries no results');

  // Now wipe the device and import the file back.
  await page.evaluate(() => localStorage.clear());
  await go(page, 'workspace/');
  await page.waitForFunction(() => {
    const value = document.querySelector('[data-record-attempts]')?.textContent ?? '';
    return value === '0';
  }, null, { timeout: 15000 });

  await page.locator('#import-record-file').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(text, 'utf8'),
  });
  await page.waitForSelector('#record-import-preview:not([hidden])', { timeout: 15000 });
  await page.locator('#record-import-replace').click();
  await page.waitForFunction(() => {
    const value = document.querySelector('[data-record-attempts]')?.textContent ?? '';
    return Number.parseInt(value, 10) >= 1;
  }, null, { timeout: 15000 });

  const restored = await page.evaluate(() => JSON.parse(localStorage.getItem('jelet:attempts:v1') ?? 'null'));
  assert.equal(restored.attempts.length, 1, 'the attempt was not restored');
  assert.equal(restored.attempts[0].submittedAt, backup.attempts[0].submittedAt, 'the submission time was rewritten');
});

test('a foreign backup file changes nothing on the device', async (t) => {
  const page = await context(t);
  await go(page, 'workspace/');
  await page.waitForFunction(() => document.querySelector('[data-record-attempts]')?.textContent !== null);

  await page.locator('#import-record-file').setInputFiles({
    name: 'foreign.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ kind: 'something-else', schemaVersion: 1 }), 'utf8'),
  });
  await page.waitForFunction(() => {
    const text = document.querySelector('[data-record-status]')?.textContent ?? '';
    return /Not a JELET backup|not a backup/i.test(text);
  }, null, { timeout: 10000 });

  // The preview must stay hidden, so nothing was written.
  assert.equal(await page.locator('#record-import-preview').isHidden(), true, 'a rejected file opened the preview');
  const stored = await page.evaluate(() => localStorage.getItem('jelet:attempts:v1'));
  assert.equal(stored, null, 'a rejected file wrote to storage');
});

test('the optional-service decisions are published with their fallbacks', async (t) => {
  const page = await context(t);
  await go(page, 'workspace/');
  const body = await page.locator('main').innerText();
  // The workspace must say why the record is a file and not an account.
  assert.match(body, /no server|no account/i, 'the workspace does not explain the no-account position');
  assert.match(body, /nothing is uploaded/i, 'the workspace does not say that nothing is uploaded');
});
