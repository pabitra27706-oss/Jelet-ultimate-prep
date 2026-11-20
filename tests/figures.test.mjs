/**
 * The figure layer.
 *
 * ADR-0002 is the standard this file enforces. It is a decision, not a
 * preference, and each of its rules is checked here against the published
 * artefacts rather than against the code that made them:
 *
 *   - No official pixels. An asset may not embed, link or trace any raster
 *     from the booklet. Only hand-authored SVG primitives.
 *   - Every asset carries a provenance comment naming the source paper and
 *     question, a title and a description that convey the content of the
 *     figure, and a text equivalent in the content model.
 *   - A redraw never makes a question scoreable. The figure layer may change
 *     what a learner reads, never what they are marked.
 *
 * The last rule is the one most easily broken by accident, so it is checked
 * against the corpus itself: the set of scoreable questions must not move
 * when the figure layer is present.
 */
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { papers } from '../src/lib/content.ts';

const FIGURE_ROOT = resolve('editorial/figures/2023');
const manifest = JSON.parse(await readFile(resolve(FIGURE_ROOT, 'manifest.json'), 'utf8'));
const paper = papers.find((entry) => entry.year === 2023);
const entries = manifest.entries;

/* ------------------------------------------------------------------ *
 * The manifest
 * ------------------------------------------------------------------ */

test('the manifest names every asset it publishes and nothing else', async () => {
  const onDisk = (await readdir(FIGURE_ROOT)).filter((name) => name.endsWith('.svg')).sort();
  const listed = entries.map((entry) => entry.svg).sort();
  assert.deepEqual(listed, onDisk, 'every authored asset is listed, and every listed asset exists');
  assert.equal(entries.length, 11);
});

test('each entry names the question it belongs to and holds a unique identity', () => {
  const ids = new Set();
  const questions = new Set();
  for (const entry of entries) {
    assert.match(entry.id, /^jelet-et-p1-2023:q\d+$/, `${entry.id} is a question identity`);
    assert.ok(!ids.has(entry.id), `${entry.id} is unique`);
    ids.add(entry.id);
    assert.ok(!questions.has(entry.question), `Q${entry.question} appears once`);
    questions.add(entry.question);
    assert.equal(entry.id, `jelet-et-p1-2023:q${entry.question}`);
  }
});

test('every entry carries an alt text, a text equivalent and a record of its deviations', () => {
  for (const entry of entries) {
    assert.ok(entry.alt && entry.alt.length >= 40, `${entry.svg} has an alt text`);
    assert.ok(entry.description && entry.description.length >= 80, `${entry.svg} has a text equivalent`);
    assert.ok(entry.deviations && entry.deviations.length >= 40, `${entry.svg} records its deviations`);
    assert.ok(entry.fidelity && entry.fidelity.length >= 10, `${entry.svg} states its fidelity`);
    assert.ok(entry.status, `${entry.svg} states its status`);
    assert.equal(entry.optionsAreFigures, false, `${entry.svg} is not a set of option figures`);
  }
});

test('the text equivalent describes the figure and does not give the answer away', () => {
  /**
   * A text equivalent that works the item is not a text equivalent: it is a
   * worked solution pasted above the options, and a learner who opens the
   * paper to try a question would be handed the result. The reasoning
   * belongs to the key, which the reader already shows on its own line.
   */
  const forbidden = [/answer/i, /keyed/i, /the correct option/i, /is false/i, /is true/i, /one of the printed options/i];
  for (const entry of entries) {
    const text = `${entry.alt} ${entry.description} ${entry.deviations}`;
    for (const pattern of forbidden) {
      assert.ok(!pattern.test(text), `${entry.svg} keeps the answer out of its text equivalent (${pattern})`);
    }
  }
});

test('the text equivalent and the asset description say the same thing', async () => {
  for (const entry of entries) {
    const svg = await readFile(resolve(FIGURE_ROOT, entry.svg), 'utf8');
    const desc = svg.match(/<desc id="figdesc">([^<]+)<\/desc>/)?.[1] ?? '';
    assert.ok(desc.length > 80, `${entry.svg} has a description`);
    // The two are written for the same drawing, so the first sentence of the
    // published text equivalent has to be findable in the asset's own
    // description. This catches a manifest that has drifted from the asset.
    const opening = entry.description.split('.')[0].trim();
    const keywords = opening
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 4);
    const haystack = desc.toLowerCase();
    const shared = keywords.filter((word) => haystack.includes(word));
    assert.ok(
      shared.length >= Math.min(3, keywords.length),
      `${entry.svg} description matches its asset description (${shared.length}/${keywords.length} keywords)`,
    );
  }
});

/* ------------------------------------------------------------------ *
 * The assets
 * ------------------------------------------------------------------ */

test('every asset is original vector line art with no pixel data in it', async () => {
  for (const entry of entries) {
    const svg = await readFile(resolve(FIGURE_ROOT, entry.svg), 'utf8');
    assert.ok(!/<image\b/i.test(svg), `${entry.svg} embeds no raster`);
    assert.ok(!/data:image\//i.test(svg), `${entry.svg} holds no encoded bitmap`);
    assert.ok(!/base64/i.test(svg), `${entry.svg} holds no encoded bitmap`);
    assert.ok(!/<foreignObject\b/i.test(svg), `${entry.svg} embeds no foreign content`);
    assert.ok(!/<script\b/i.test(svg), `${entry.svg} carries no script`);
  }
});

test('every asset names its source, its standard and its accessibility text', async () => {
  for (const entry of entries) {
    const svg = await readFile(resolve(FIGURE_ROOT, entry.svg), 'utf8');
    assert.match(svg, /RECONSTRUCTED FIGURE/, `${entry.svg} says it is reconstructed`);
    assert.match(svg, /ADR-0002/, `${entry.svg} names the standard it follows`);
    assert.match(svg, /JELET 2023 Paper I, Set A/, `${entry.svg} names its source paper`);
    assert.match(svg, /<title id="figtitle">[^<]+<\/title>/, `${entry.svg} has a title`);
    assert.match(svg, /<desc id="figdesc">[^<]{60,}<\/desc>/, `${entry.svg} has a description`);
  }
});

test('every asset is self-contained: nothing is fetched and nothing is imported', async () => {
  for (const entry of entries) {
    const svg = await readFile(resolve(FIGURE_ROOT, entry.svg), 'utf8');
    assert.ok(!/@import\b/i.test(svg), `${entry.svg} imports no stylesheet`);
    assert.ok(!/url\(\s*['"]?https?:/i.test(svg), `${entry.svg} fetches nothing`);
    assert.ok(!/(xlink:)?href\s*=\s*"(?!#)/i.test(svg), `${entry.svg} links nothing outside itself`);
  }
});

test('every asset is a well-formed SVG document that opens on its own', async () => {
  for (const entry of entries) {
    const svg = await readFile(resolve(FIGURE_ROOT, entry.svg), 'utf8');
    assert.ok(svg.startsWith('<svg'), `${entry.svg} is an SVG document`);
    assert.match(svg, /viewBox="0 0 [\d.]+ [\d.]+"/, `${entry.svg} declares a view box`);
    assert.match(svg, /role="img"/, `${entry.svg} is marked as an image`);
    assert.match(svg, /aria-labelledby="figtitle figdesc"/, `${entry.svg} is labelled by its own title and description`);
  }
});

/* ------------------------------------------------------------------ *
 * The published copies
 * ------------------------------------------------------------------ */

test('the published copies match the authored assets byte for byte', async () => {
  for (const entry of entries) {
    const authored = await readFile(resolve(FIGURE_ROOT, entry.svg));
    const published = await readFile(resolve('public/figures/2023', entry.svg));
    assert.ok(authored.equals(published), `${entry.svg} is published as it was authored`);
  }
});

/* ------------------------------------------------------------------ *
 * The corpus
 * ------------------------------------------------------------------ */

test('the figure-bearing items carry their figure, and no other item does', () => {
  const withFigure = paper.questions.filter((question) => question.figureAsset);
  assert.equal(withFigure.length, 11);
  assert.deepEqual(
    withFigure.map((question) => question.n).sort((a, b) => a - b),
    [42, 48, 60, 61, 68, 70, 84, 91, 92, 94, 95],
    'the eleven items that name a diagram are the eleven that carry a figure',
  );
  for (const question of withFigure) {
    assert.ok(question.figure, `Q${question.n} is marked as depending on a diagram`);
    assert.equal(question.figureAsset.id, `jelet-et-p1-2023:q${question.n}`);
    assert.equal(question.figureAsset.url, `figures/2023/${question.figureAsset.svg}`);
  }
  for (const question of paper.questions) {
    if (question.figureAsset) continue;
    assert.equal(question.figure, false, `Q${question.n} names no diagram and carries no figure`);
  }
});

test('the figures do not make a single held item scoreable', () => {
  /**
   * The rule that matters. A redraw shows the printed values; it does not
   * verify an item, so no item that was held becomes scoreable, and no item
   * that was scoreable becomes held.
   */
  const held = paper.questions.filter((question) => !question.scorable && !question.boardAwarded);
  assert.equal(held.length, 10);
  assert.deepEqual(
    held.map((question) => question.n).sort((a, b) => a - b),
    [42, 48, 60, 61, 68, 70, 84, 91, 92, 95],
    'the ten held items are the ten held items',
  );
  for (const question of held) {
    assert.ok(question.figureAsset, `Q${question.n} still carries its figure`);
    assert.ok(question.holdReason, `Q${question.n} still says why it is held`);
    assert.match(question.holdReason, /reconstruction does not verify|redraw does not verify/i);
  }
});

test('the board awards are untouched by the figure layer', () => {
  const awarded = paper.questions.filter((question) => question.boardAwarded);
  assert.deepEqual(awarded.map((question) => question.n).sort((a, b) => a - b), [6, 46, 88, 94]);
  for (const question of awarded) {
    assert.ok(question.voided, `Q${question.n} is voided by the board`);
    assert.equal(question.scorable, false, `Q${question.n} is not marked by an answer`);
    assert.equal(question.holdReason, null, `Q${question.n} is not held`);
  }
});

test('the paper totals are what they were before the figure layer was added', () => {
  assert.equal(paper.questionCount, 100);
  assert.equal(paper.scoreableQuestions, 86);
  assert.equal(paper.scoreableMarks, 103);
  assert.equal(paper.boardAwardedQuestions, 4);
  assert.equal(paper.boardAwardedMarks, 5);
  assert.equal(paper.heldQuestions, 10);
  assert.equal(paper.rehearsableQuestions, 90);
  assert.equal(paper.rehearsableMarks, 108);
  assert.equal(paper.maxMarks, 120);
});

/* ------------------------------------------------------------------ *
 * The published site
 * ------------------------------------------------------------------ */

test('the paper reader shows every figure with its text equivalent', async () => {
  const html = await readFile(resolve('dist/library/jelet-et-p1-2023/index.html'), 'utf8');
  assert.equal((html.match(/class="qfigure"/g) ?? []).length, 11, 'every figure is on the page');
  assert.equal(
    (html.match(/class="qfigure-badge">Reconstructed figure</g) ?? []).length,
    11,
    'every figure carries the badge that says it is a reconstruction',
  );
  assert.equal(
    (html.match(/is not the official artwork/g) ?? []).length,
    11,
    'every figure says plainly that it is not the publisher\'s artwork',
  );
  assert.equal((html.match(/Text equivalent of the figure/g) ?? []).length, 11, 'every figure carries its text equivalent');
  for (const entry of entries) {
    assert.ok(html.includes(`data-figure="${entry.id}"`), `${entry.svg} is on the page`);
    assert.ok(html.includes(entry.alt.slice(0, 40)), `${entry.svg} carries its alt text`);
  }
});

test('the timed rehearsal shows the one figure-bearing item that can be sat', async () => {
  /**
   * Q94 is voided by the board, so it is awarded rather than marked, and it
   * is the only figure-bearing item that can appear in a rehearsal. Its
   * figure is on the page and the board's award is still what governs it.
   */
  const html = await readFile(resolve('dist/practice/jelet-et-p1-2023/electrical/index.html'), 'utf8');
  assert.ok(html.includes('data-figure="jelet-et-p1-2023:q94"'), 'Q94 shows its figure');
  assert.match(html, /voided this question in its final answer-key notice/, 'Q94 still carries the board notice');
  assert.match(html, /Text equivalent of the figure/, 'Q94 carries its text equivalent');
});

test('the composed mock pool carries the figure-bearing voided item', async () => {
  const pool = JSON.parse(await readFile(resolve('dist/data/mock-pool/electrical.json'), 'utf8'));
  const items = Array.isArray(pool) ? pool : (pool.items ?? Object.values(pool)[0]);
  const ids = items.map((item) => (typeof item === 'string' ? item : item.id));
  assert.ok(ids.includes('jelet-et-p1-2023:q94'), 'Q94 is in the electrical mock pool');
});

test('the figures are published as routes of their own', async () => {
  const allowlist = JSON.parse(await readFile(resolve('scripts/public-artifact.json'), 'utf8'));
  for (const entry of entries) {
    const path = `figures/2023/${entry.svg}`;
    assert.ok(allowlist.files.includes(path), `${path} is on the public allowlist`);
    const published = await readFile(resolve('dist', path));
    assert.ok(published.length > 0, `${path} is published`);
  }
});
