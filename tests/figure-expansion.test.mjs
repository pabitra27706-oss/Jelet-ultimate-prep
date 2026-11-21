import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { papers } from '../src/lib/content.ts';

for (const year of [2017, 2018, 2019, 2021, 2022, 2024, 2025]) {
  const root = `editorial/figures/${year}`;
  const manifest = JSON.parse(await readFile(`${root}/manifest.json`, 'utf8'));
  test(`${year} figures have source evidence, safe SVGs, unique IDs and held scoring`, async () => {
    const paper = papers.find(p => p.year === year);
    const names = (await readdir(root)).filter(n => n.endsWith('.svg')).sort();
    assert.deepEqual(names, manifest.entries.map(e => e.svg).sort());
    for (const entry of manifest.entries) {
      assert.equal(entry.id, `${paper.id}:q${entry.question}`);
      assert.match(entry.sourceSha256, /^[a-f0-9]{64}$/);
      assert.ok(entry.pdfPage > 0);
      assert.equal(entry.kindReviewed, true);
      const svg = await readFile(`${root}/${entry.svg}`, 'utf8');
      assert.equal(svg, await readFile(`public/figures/${year}/${entry.svg}`, 'utf8'));
      assert.match(svg, /RECONSTRUCTED FIGURE/);
      assert.match(svg, /ADR-0002/);
      assert.match(svg, /<title[^>]*>[^<]+<\/title>/);
      assert.match(svg, /<desc[^>]*>[^<]{80,}<\/desc>/);
      assert.doesNotMatch(svg, /<image\b|<script\b|<foreignObject\b|data:image|href\s*=/i);
      const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
      assert.equal(new Set(ids).size, ids.length);
      assert.ok(ids.every(id => id.startsWith(`fig-${year}-${entry.question}-`)));
      const question = paper.questions.find(q => q.n === entry.question);
      assert.equal(question.figureAsset.url, `figures/${year}/${entry.svg}`);
      // These supplementary figures were already scoreable; attachment does not validate their keys.
      const alreadyScorable = (year === 2022 && entry.question === 55) || (year === 2024 && [46,52,55].includes(entry.question)) || (year === 2025 && [61,67].includes(entry.question));
      assert.equal(question.scorable, alreadyScorable);
      assert.equal(question.boardAwarded, year === 2024 && entry.question === 49, 'preserve the pre-existing board-award flag');
      assert.ok(entry.description.length > 80);
      assert.ok(entry.deviations.length > 40);
    }
  });
}

test('Q42 graphical options remain held and all four are described without solving', () => {
  const q = papers.find(p => p.year === 2024).questions.find(q => q.n === 42);
  assert.equal(q.optionsComplete, false);
  assert.equal(q.scorable, false);
  for (const label of ['A:', 'B:', 'C:', 'D:']) assert.ok(q.figureAsset.description.includes(label));
  assert.doesNotMatch(q.figureAsset.description, /correct|answer|solution/i);
});

test('new figure lookup is year-qualified rather than filename-only', async () => {
  const component = await readFile('src/components/Figure.astro', 'utf8');
  assert.ok(component.includes('path.endsWith(`/${asset.url}`)'));
});

test('2018 manifest covers all eleven flagged questions, including Q91 absent from old manifest', async () => {
  const manifest = JSON.parse(await readFile('editorial/figures/2018/manifest.json', 'utf8'));
  const p = papers.find(p => p.year === 2018);
  assert.deepEqual(manifest.entries.map(e => e.question), [27,73,74,78,79,80,82,85,89,90,91]);
  assert.deepEqual(manifest.entries.map(e => e.question), p.questions.filter(q => q.figure).map(q => q.n));
  for (const n of [89,91]) {
    const q = p.questions.find(q => q.n === n);
    const entry = manifest.entries.find(e => e.question === n);
    assert.equal(entry.optionsAreFigures, true);
    assert.equal(q.scorable, false);
    for (const label of ['A:', 'B:', 'C:', 'D:']) assert.ok(entry.description.includes(label));
    assert.doesNotMatch(entry.description, /correct|answer|solution/i);
  }
});

test('2019 page offset and source exceptions are explicit, not fabricated diagrams', async () => {
  const manifest = JSON.parse(await readFile('editorial/figures/2019/manifest.json', 'utf8'));
  assert.deepEqual(manifest.entries.map(e => e.question), [75,76,77,84,90,91]);
  for (const entry of manifest.entries) assert.equal(entry.officialPage, entry.pdfPage + 1);
  const ledger = JSON.parse(await readFile('editorial/figures/EXPANSION-STATUS.json', 'utf8'));
  assert.equal(ledger.entries.find(e => e.id === 'jelet-et-p1-2019:q94').status, 'transcription-corrected-no-key-promotion');
  assert.ok(ledger.additionalSourceFindings.some(e => e.id === 'jelet-et-p1-2019:q77'));
  const p = papers.find(p => p.year === 2019);
  assert.equal(p.questions.find(q => q.n === 94).figureAsset, null);
  assert.equal(p.questions.find(q => q.n === 94).scorable, false);
});

test('2021 covers all fifteen legacy flags and three additional source diagrams without unlocking scoring', async () => {
  const p = papers.find(p => p.year === 2021);
  const manifest = JSON.parse(await readFile('editorial/figures/2021/manifest.json', 'utf8'));
  assert.equal(manifest.entries.length, 18);
  assert.equal(p.questions.filter(q => q.figure).length, 15);
  for (const q of p.questions.filter(q => q.figure)) assert.ok(q.figureAsset);
  for (const n of [21,71,87]) {
    const q = p.questions.find(q => q.n === n);
    assert.equal(q.figure, false, 'do not silently rewrite historical detection flags');
    assert.ok(q.figureAsset);
    assert.equal(q.scorable, false);
  }
  for (const n of [26,35]) {
    const e = manifest.entries.find(e => e.question === n);
    assert.equal(e.optionsAreFigures, true);
    for (const label of ['A:', 'B:', 'C:', 'D:']) assert.ok(e.description.includes(label));
  }
  const status = JSON.parse(await readFile('editorial/figures/EXPANSION-STATUS.json', 'utf8'));
  assert.deepEqual(status.additionalAttachedFigures.filter(e => e.year === 2021).map(e => e.question), [21,71,87]);
});

test('2022 covers eight original holds and an already-scoreable supplementary graph without promoting a hold', async () => {
  const p = papers.find(p => p.year === 2022);
  const manifest = JSON.parse(await readFile('editorial/figures/2022/manifest.json', 'utf8'));
  assert.deepEqual(manifest.entries.map(e => e.question), [49,55,57,62,93,96,97,98,99]);
  for (const q of p.questions.filter(q => q.figure)) {
    assert.ok(q.figureAsset);
    assert.equal(q.scorable, false);
  }
  const supplement = p.questions.find(q => q.n === 55);
  assert.equal(supplement.figure, false);
  assert.equal(supplement.scorable, true, 'pre-existing scoreability must remain unchanged');
  for (const n of [49,57,62]) {
    const e = manifest.entries.find(e => e.question === n);
    assert.equal(e.optionsAreFigures, true);
    for (const label of ['A:', 'B:', 'C:', 'D:']) assert.ok(e.description.includes(label));
  }
  assert.equal(p.questions.find(q => q.n === 6).figureAsset, null, 'a determinant is not a missing diagram');
});

test('2024 covers all eighteen flags plus three supplementary source diagrams without scoring promotion', async () => {
  const p = papers.find(p => p.year === 2024);
  const manifest = JSON.parse(await readFile('editorial/figures/2024/manifest.json', 'utf8'));
  assert.deepEqual(manifest.entries.map(e => e.question), [42,43,45,46,49,52,54,55,57,65,66,67,68,70,78,79,89,94,96,97,98]);
  for (const q of p.questions.filter(q => q.figure)) {
    assert.ok(q.figureAsset);
    assert.equal(q.scorable, false);
  }
  for (const n of [46,52,55]) {
    const q = p.questions.find(q => q.n === n);
    assert.equal(q.figure, false);
    assert.ok(q.figureAsset);
    assert.equal(q.scorable, true, 'preserve baseline, not an answer-verification claim');
  }
  for (const n of [66,78,79,89]) {
    const e = manifest.entries.find(e => e.question === n);
    assert.equal(e.optionsAreFigures, true);
    for (const label of ['A:', 'B:', 'C:', 'D:']) assert.ok(e.description.includes(label));
  }
  const findings = JSON.parse(await readFile('editorial/figures/SOURCE-FINDINGS.json', 'utf8'));
  const q46 = findings.entries.find(e => e.id === 'jelet-et-p1-2024:q46');
  assert.equal(q46.status, 'transcription-corrected-key-unchanged');
  assert.match(q46.resolution, /D 125 m\/s/);
});

test('2025 covers fifteen legacy diagrams and two supplementary figures with individually checked page offset', async () => {
  const p = papers.find(p => p.year === 2025);
  const manifest = JSON.parse(await readFile('editorial/figures/2025/manifest.json', 'utf8'));
  assert.deepEqual(manifest.entries.map(e => e.question), [44,46,51,54,55,57,58,61,62,66,67,81,82,85,88,95,100]);
  for (const entry of manifest.entries) assert.equal(entry.officialPage, entry.pdfPage + 1);
  for (const q of p.questions.filter(q => q.figure)) {
    assert.ok(q.figureAsset);
    assert.equal(q.scorable, false);
  }
  for (const n of [61,67]) {
    const q = p.questions.find(q => q.n === n);
    assert.equal(q.figure, false);
    assert.ok(q.figureAsset);
    assert.equal(q.scorable, true, 'preserve pre-existing eligibility, not an answer-verification claim');
  }
  for (const n of [44,51,58,66,85,88]) {
    const e = manifest.entries.find(e => e.question === n);
    assert.equal(e.optionsAreFigures, true);
    for (const label of ['A:', 'B:', 'C:', 'D:']) assert.ok(e.description.includes(label));
    assert.equal(p.questions.find(q => q.n === n).optionsComplete, false);
  }
});

test('2019 screenshot-backed corrections restore four questions without inventing keys', async () => {
  const p = papers.find(p => p.year === 2019);
  assert.equal(p.sourceFile, 'editorial/pyq-md/2019.md');
  assert.equal(p.questionCount, 100);
  assert.deepEqual(p.gaps, []);
  for (const n of [77,78,79,94]) {
    const q = p.questions.find(q => q.n === n);
    assert.ok(q.stem.length > 80);
    assert.equal(q.optionsComplete, true);
    assert.deepEqual(q.options.map(o => o.label), ['A','B','C','D']);
    assert.equal(q.scorable, false);
    assert.equal(q.keyAnswer, null);
    assert.equal(q.boardAwarded, false);
  }
  assert.ok(p.questions.find(q => q.n === 77).figureAsset);
  assert.equal(p.questions.find(q => q.n === 94).figure, false);
  assert.match(p.questions.find(q => q.n === 78).stem, /from that point/);
  assert.equal(p.questions.find(q => q.n === 94).options[1].text, '\\(\\sqrt{M}\\)');
  const ledger = JSON.parse(await readFile('editorial/figures/EXPANSION-STATUS.json', 'utf8'));
  assert.equal(ledger.entries.length, 83, 'the historical flag denominator remains fixed');
  assert.ok(ledger.additionalAttachedFigures.some(e => e.id === 'jelet-et-p1-2019:q77'));
});

test('2022 Q6 restores the exact signed determinant without changing its existing key', () => {
  const p = papers.find(p => p.year === 2022);
  const q = p.questions.find(q => q.n === 6);
  assert.equal(p.sourceFile, 'editorial/pyq-md/2022.md');
  assert.equal(q.stem, 'If \\(\\begin{vmatrix}a^2 & -ab & -ac\\\\ -ab & b^2 & -bc\\\\ ca & bc & -c^2\\end{vmatrix}=Ka^2b^2c^2\\), then \\(K=\\)');
  assert.deepEqual(q.options.map(o => o.text), ['1','2','3','4']);
  assert.equal(q.figureAsset, null);
  assert.equal(q.transcriptionNote, null);
  assert.equal(q.keyAnswer, 'D');
  assert.equal(q.scorable, true, 'pre-existing eligibility, not a promotion');
  assert.equal(q.boardAwarded, false);
});

test('2024 Q46 uses the page-12 source options and preserves its key label and graph', () => {
  const p = papers.find(p => p.year === 2024);
  const q = p.questions.find(q => q.n === 46);
  assert.equal(p.sourceFile, 'editorial/pyq-md/2024.md');
  assert.match(q.stem, /starts moving from rest in a straight line/);
  assert.match(q.stem, /maximum velocity attained/);
  assert.deepEqual(q.options, ['225 m/s','120 m/s','100 m/s','125 m/s'].map((text,i) => ({label:'ABCD'[i],text})));
  assert.equal(q.keyAnswer, 'D');
  assert.equal(q.scorable, true);
  assert.equal(q.boardAwarded, false);
  assert.equal(q.figureAsset.url, 'figures/2024/q46-acceleration-time.svg');
});

test('2025 Q95 source current labels match the circuit and remain unscored', async () => {
  const p = papers.find(p => p.year === 2025);
  const q = p.questions.find(q => q.n === 95);
  assert.equal(p.sourceFile, 'editorial/pyq-md/2025.md');
  assert.equal(q.stem, '[Diagram] The following circuit carries alternating currents \\(I, I_1\\) and \\(I_2\\). Under which condition \\(I_1, I_2\\) and \\(I\\) will be in the same phase? (The frequency of the alternating current is 50Hz)');
  assert.doesNotMatch(q.stem, /I_3/);
  assert.equal(q.options[3].text, 'None of these');
  assert.equal(q.keyAnswer, 'B');
  assert.equal(q.scorable, false);
  assert.equal(q.boardAwarded, false);
  assert.equal(q.figure, true);
  assert.equal(q.figureAsset.url, 'figures/2025/q95-parallel-rl.svg');
  const findings = JSON.parse(await readFile('editorial/figures/SOURCE-FINDINGS.json', 'utf8'));
  const entry = findings.entries.find(e => e.id === q.id);
  assert.equal(entry.status, 'transcription-corrected-key-unchanged');
  assert.equal(entry.pdfPage, 24);
  assert.equal(entry.printedPage, 25);
});
