import { readFile, writeFile } from 'node:fs/promises';
const { papers } = JSON.parse(await readFile('src/data/papers.json', 'utf8'));
const findings = JSON.parse(await readFile('editorial/figures/SOURCE-FINDINGS.json', 'utf8')).entries;
const findingById = new Map(findings.map(entry => [entry.id, entry]));
// Keep the original 83-item denominator stable after transcription corrections.
const legacyIds = new Set(JSON.parse(await readFile('editorial/figures/LEGACY-FIGURE-IDS.json', 'utf8')));
const entries = papers.filter(p => p.year !== 2023).flatMap(p => p.questions.filter(q => legacyIds.has(q.id)).map(q => ({
  id: q.id, year: p.year, question: q.n,
  status: q.figureAsset ? 'reconstructed-source-compared' : (findingById.get(q.id)?.status ?? 'pending-source-review'),
  asset: q.figureAsset?.url ?? null,
  optionsComplete: q.optionsComplete, scorable: q.scorable,
})));
await writeFile('editorial/figures/EXPANSION-STATUS.json', JSON.stringify({
  scope: 'Existing corpus figure flags for the seven supplied years, not exhaustive PDF completeness certification', entries,
  additionalSourceFindings: findings.filter(f => !entries.some(e => e.id === f.id)),
  additionalAttachedFigures: papers.filter(p => p.year !== 2023).flatMap(p => p.questions.filter(q => !legacyIds.has(q.id) && q.figureAsset).map(q => ({
    id: q.id, year: p.year, question: q.n, status: 'reconstructed-source-compared',
    asset: q.figureAsset.url, scorable: q.scorable,
    note: 'Source diagram found despite absence of the original corpus figure flag; scoring unchanged.',
  }))),
}, null, 2) + '\n');
console.log(`${entries.filter(e => e.asset).length}/${entries.length} supplied-year diagram items have redraws`);
