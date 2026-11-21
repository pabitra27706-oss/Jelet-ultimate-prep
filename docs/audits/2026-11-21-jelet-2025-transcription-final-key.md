# JELET 2025 — PDF transcription and final-key mapping audit

Date: 2026-11-21 UTC. Documentation only. No corrections, scoring edits, merge or deployment. This is **not a full independent solve**.

## Evidence and limits

- Uploaded scan SHA-256: `07215719c4f67d963e014bbc91c4a16cf0671979caf384d595cdde29680be861`. Every physical PDF page inspected, including cover/rough work. 25 pages; question viewer pages 2–25 correspond to printed pages 3–26 (offset +1).
- Read-only transcription: `archive/jelet-prep/data/pyq-md/2025.md`; runtime `src/data/papers.json`; archived key `archive/jelet-prep/data/docs/official-keys/2025-paper1.json`; runtime `src/data/keys.json`.
- [Official final notice](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2025/11/202511162064778225.pdf): JEEB/Reg-171/25, 16-11-2025, JELET PAPER I, pages 2–4; Paper II excluded. This is the FINAL notice, not the October model/challenge notice.
- Final-notice tables were retrieved as extracted Markdown, not visually inspected PDF pages. Independently copied their 100 rows × 5 fields, compared all four series-number columns plus answer against the archive, and compared all 100 answers against runtime keys. All match. A manual scratch-copy error in 2024 Q29 was detected and corrected against the fetched notice before recording results; it was not an archive error. Extraction is a remaining evidence limitation.
- Each of the four series columns is a permutation of 1–100. B/C/D are question-number mappings, not separate answer columns. Mapping n from booklet B means locating n in column B, not indexing master row n. This validates table representation, not unseen B/C/D option artwork.
- Withdrawn Set-A questions: [41, 79, 84]. The final notice’s last-page note explicitly awards marks to all appeared candidates. Runtime key voids and paper boardAwarded/voided flags agree. No W was turned into a guessed answer.
- Categories visually checked: I Q1–30/41–65/71–85/91–100; II Q31–40/66–70/86–90; printed maximum 120 marks/100 questions/120 minutes. Category II allows 2×(correct selected/total correct) only when no wrong choice is selected. No scoring implementation or attempt history was changed.

**2025 booklet mapping is supported directly**: the uploaded question-page headers print A; the final notice’s Paper-I table explicitly labels column A. Thus printed Qn maps to Set-A row n. The inaccessible pictorial legend is not needed to read this explicit letter. No B/C/D booklet was uploaded, so common-option order in those booklets has not been visually certified.

## What the verdicts mean

`MATCH` means no substantive transcription discrepancy found during this visual comparison, allowing harmless paraphrase/typography. It is not a proof that the board answer is mathematically unique. Other rows explicitly distinguish missing text, missing artwork, altered options and source ambiguity. The answer column quotes the official Set-A choice with its **printed** option text (or a labelled graphical description); it is not a newly derived key. Targeted working appears only for flagged conflicts. Existing scorable flags are observations, never approval.

## Current runtime snapshot

- Records: 100; gaps: []; scoreable questions/marks: 82/100; board-awarded questions/marks: 3/3; held records: 15.
- No runtime question in this year has a figureAsset. Figure availability in another commit is not silently imported into this audit.
- Questions with findings/limitations below: 32; other rows: 68. These are transcription-review counts, not mathematical correct/wrong totals.

## Batch Q1–10

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 1 | 2 / 3 | 2 / 1 | D — 1 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 2 | 2 / 3 | 2 / 2 | C — \(I\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 3 | 2 / 3 | 2 / 3 | A — Skew symmetric matrix | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 4 | 2 / 3 | 2 / 4 | B — 1 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 5 | 2 / 3 | 2 / 5 | A — \(3\sin 2u\) | TEXT: source (x⁷+y⁷)/x; archive (x²+y²)/x. Source degree 6 gives keyed A=3 sin 2u; bank degree 1 would give (1/2)sin 2u, not listed. | true |
| 6 | 2 / 3 | 2 / 6 | A — 0 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 7 | 3 / 4 | 2 / 7 | D — –2 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 8 | 3 / 4 | 2 / 8 | D — 1 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 9 | 3 / 4 | 2 / 9 | C — \(f(x)g(x) + C_{1}\) | SOURCE-AMBIGUITY (not a transcription defect): printed C=f(x)g(x)+C₁ and D=f(x)g′(x)+C₁ are identical under g′=g. Final key selects C only. Preserve both printed options; do not silently change D. | true |
| 10 | 3 / 4 | 2 / 10 | B — eˣ+2(y/x)²=C | TEXT: source B=eˣ+2(y/x)²=C; C=eˣ+4(y/x)²=C; D=eˣ+2(x/y)²=C. Archive B has 4, C is eˣ/x=y/x+C, D duplicates the source B formula. Key B is faithful to source, not to bank. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Explicit A header supports identity mapping.

## Batch Q11–20

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 11 | 3 / 4 | 2 / 11 | C — \(2\vec{a}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 12 | 3 / 4 | 2 / 12 | C — \(\frac{-n^{2}}{1+n^{2}}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 13 | 4 / 5 | 2 / 13 | B — \(\frac{3}{8}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 14 | 4 / 5 | 2 / 14 | B — 1 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 15 | 4 / 5 | 2 / 15 | C — \(\frac{2}{3}\) | SOURCE-ASSUMPTION: unknown urn colours do not specify a prior distribution. Key C=2/3 uses a symmetric/equal-expected-colour convention; the transcription retains the omission. | true |
| 16 | 4 / 5 | 2 / 16 | B — 121 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 17 | 4 / 5 | 2 / 17 | A — \(2a+3b=0\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 18 | 4 / 5 | 2 / 18 | A — \(2g(x)g(y)\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 19 | 5 / 6 | 2 / 19 | B — \(\frac{1}{\sqrt{2}}(\hat{j}+\hat{k})\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 20 | 5 / 6 | 2 / 20 | C — \(\sqrt{\beta-\alpha}\) | TEXT: second circle coefficient is 2fy, not 4fy; both source circles have the same centre. The bank destroys that condition. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Explicit A header supports identity mapping.

## Batch Q21–30

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 21 | 5 / 6 | 2 / 21 | B — –6 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 22 | 5 / 6 | 2 / 22 | D — 2 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 23 | 5 / 6 | 2 / 23 | A — \(\frac{1}{2}\|\vec{a}-\vec{b}\|\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 24 | 6 / 7 | 2 / 24 | C — \(\pi\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 25 | 6 / 7 | 2 / 25 | D — increases on \((-\infty,\infty)\) | SOURCE-OVERLAP: printed D increasing on (−∞,∞) entails printed B increasing on [0,∞). Final key is D. Derivative is nonnegative, zero only at 0; no transcription repair is justified. | true |
| 26 | 6 / 7 | 2 / 26 | A — \(9:4\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 27 | 6 / 7 | 2 / 27 | B — \(y = 2x \pm \sqrt{13}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 28 | 6 / 7 | 2 / 28 | C — \(\frac{1}{1-x^{2}}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 29 | 7 / 8 | 2 / 29 | A — \(-\frac{y^{2}}{x^{2}}\) | TEXT: source writes φ(x/y) in the differential equation and asks φ(x/y); archive changes both to φ(y/x). Explicit expression options are otherwise unchanged. | true |
| 30 | 7 / 8 | 2 / 30 | B — \(\frac{1}{3}\) | SOURCE-MODEL: final key B=1/3 corresponds to treating the three unordered outcomes as equally likely. For independent fair physical tosses, P(HT or TH)=1/2 (A), even when coins are indistinguishable. The stem does not supply an outcome-probability model; retain this ambiguity. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Explicit A header supports identity mapping.

## Batch Q31–40

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 31 | 7 / 8 | 2 / 31 | A — \(\|\text{adj }A\| = \|A\|^{2}\) if \(\|A\|\neq 0\); B — \(A(\text{adj }A) = \|A\|I_{3}\); C — \(A\) is invertible if \(\|A\|\neq 0\); D — \(\text{adj }A\) is invertible if \(\|A\|\neq 0\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 32 | 7 / 8 | 2 / 32 | B — \(f\) is continuous at \(x=0\); C — \(f\) is derivable at \(x=0\); D — \(f\) is derivable at \(x=0\) but \(f'\) is not continuous at \(x=0\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 33 | 8 / 9 | 3 / 33 | A — \(\frac{x^{7}}{2x^{7}+x^{2}+1}+c_{1}\); D — \(\frac{p(x)}{q(x)}+c_{1}\) (p,q polynomials of same degree) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 34 | 8 / 9 | 3 / 34 | A — \(y = -e^{-x}+c\); D — \(y - e^{x}=c\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 35 | 8 / 9 | 3 / 35 | A — \(f(x)\) is increasing on \([-1,2]\); B — \(f(x)\) is continuous on \([-1,3]\); C — \(f'(2)\) does not exist; D — \(f(x)\) has maximum value at \(x=2\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 36 | 8 / 9 | 3 / 36 | B — a rational number; D — zero | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 37 | 9 / 10 | 3 / 37 | A — P(E)=1/3,P(F)=1/4; D — P(E)=1/4,P(F)=1/3 | TEXT: source A=(1/3,1/4), B=(1/2,1/6), C=(1/6,1/2), D=(1/4,1/3). Archive B/C/D are reordered. Key AD is correct for printed options, not for the altered bank D. | true |
| 38 | 9 / 10 | 3 / 38 | A — −r√(1+m²)<c≤0; B — 0≤c<r√(1+m²) | TEXT: source A −r√(1+m²)<c≤0; B 0≤c<r√(1+m²); C −c√(1−m²)<r; D r<c√(1+m²). Archive replaces/reorders all four. Key AB applies to source, not to bank. | true |
| 39 | 9 / 10 | 3 / 39 | A — consistent if p=q=r; C — INCONSISTENT if a,b,c distinct and a+b+c=0 (literal printed option; disputed by algebra) | TEXT + SOURCE/KEY CONFLICT: printed C says INCONSISTENT if a,b,c are distinct and a+b+c=0; archive silently changes it to CONSISTENT. Final key AC quotes the notice accurately but does not solve the literal source options. See targeted adjudication below. | true |
| 40 | 9 / 10 | 3 / 40 | B — \(\frac{\pi}{2}\log a\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Explicit A header supports identity mapping.

## Batch Q41–50

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 41 | 10 / 11 | 3 / 41 | W — withdrawn; marks awarded to all appeared candidates | MATCH: no substantive discrepancy found; no independent solve performed. Board withdrawal controls; do not force an option. | false |
| 42 | 10 / 11 | 3 / 42 | B — \(7\%\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 43 | 10 / 11 | 3 / 43 | C — \(\vec{B}\times\vec{C}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 44 | 10 / 11 | 3 / 44 | C — upward-opening velocity–time curve, roots at t=0,2 and minimum at t=1 | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 45 | 11 / 12 | 3 / 45 | C — 5 J | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 46 | 11 / 12 | 3 / 46 | B — AB and CD | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 47 | 11 / 12 | 3 / 47 | C — 7.0 sec | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 48 | 11 / 12 | 3 / 48 | C — \(g\left(1-\frac{1}{\rho}\right)\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 49 | 11 / 12 | 3 / 49 | C — \(2E_{0}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 50 | 12 / 13 | 3 / 50 | A — \((-3\hat{i}+\hat{j})\) m/s | TEXT: source D=(î+3ĵ) m/s; archive inserts a minus before î. Key A unchanged. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Explicit A header supports identity mapping.

## Batch Q51–60

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 51 | 12 / 13 | 3 / 51 | A — speed rises from zero toward a constant terminal speed (graphical option) | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 52 | 12 / 13 | 3 / 52 | A — momentum is conserved | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 53 | 12 / 13 | 3 / 53 | D — \(\frac{3L}{4}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 54 | 13 / 14 | 3 / 54 | B — \(\frac{3V^{2}}{4g}\) | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 55 | 13 / 14 | 3 / 55 | A — \(Y_{A} > Y_{B}\) | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 56 | 13 / 14 | 3 / 56 | D — \(\{1+(n-1)p\}\rho\) | TEXT-OMISSION: source explicitly says the rest of the cylinder is within the other liquid. Archive drops that full-submersion condition. | true |
| 57 | 14 / 15 | 3 / 57 | D — 24 J | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 58 | 14 / 15 | 3 / 58 | B — curved isothermal expansion V→3V, then horizontal leftward constant-pressure compression to V | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 59 | 14 / 15 | 3 / 59 | A — \(2\pi\sqrt{\frac{x_{2}^{2}-x_{1}^{2}}{v_{1}^{2}-v_{2}^{2}}}\) | TEXT: source B=2π√((v₁²+v₂²)/(x₁²+x₂²)); C=2π√((v₁²−v₂²)/(x₁²−x₂²)); D=2π√((x₁²+x₂²)/(v₁²+v₂²)). Archive reassigns these B/C/D. Key A unchanged. | true |
| 60 | 15 / 16 | 3 / 60 | D — \(\frac{R}{\mu_{1}-\mu_{2}}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Explicit A header supports identity mapping.

## Batch Q61–70

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 61 | 15 / 16 | 3 / 61 | A — \(\frac{140}{11}\)°C | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 62 | 15 / 16 | 3 / 62 | D — Inverse of heat capacity of vapour | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 63 | 16 / 17 | 3 / 63 | C — \(8:9\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 64 | 16 / 17 | 3 / 64 | B — \(V_{1}>V_{2}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 65 | 16 / 17 | 3 / 65 | A — 20.41 m | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 66 | 17 / 18 | 3 / 66 | D — concave-up displacement–time curve until t=4, then rising straight line | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 67 | 17 / 18 | 3 / 67 | C — Work done by tension on the block is 80 J; D — Displacement of the block is 2 m | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | true |
| 68 | 18 / 19 | 3 / 68 | B — Angular momentum about the Sun; D — Total energy | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 69 | 18 / 19 | 4 / 69 | B — 100°C; C — 13 1/3 kg water; D — 1 2/3 kg steam | TEXT: source D is 1 2/3 kg steam, not 12 2/3 kg. Source BCD is coherent: 10 kg ice needs 1800 kcal to become water at 100°C; 10/3 kg steam condenses, leaving 5/3 kg. Altered bank D makes keyed BCD false. | true |
| 70 | 18 / 19 | 4 / 70 | B — \(\vec{P}\) lies in the plane containing \(\vec{A}\) and \(\vec{B}\); C — \(\vec{P}\) lies in the plane containing \(\vec{C}\) and \(\vec{D}\); D — \(\vec{P}\) is parallel to the line of intersection of the planes containing \(\vec{A},\vec{B}\) and \(\vec{C},\vec{D}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Explicit A header supports identity mapping.

## Batch Q71–80

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 71 | 19 / 20 | 4 / 71 | D — 5f | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 72 | 19 / 20 | 4 / 72 | B — Two | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 73 | 19 / 20 | 4 / 73 | C — \(n\)‑type semiconductor | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 74 | 19 / 20 | 4 / 74 | C — Comproportionation | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 75 | 19 / 20 | 4 / 75 | B — X is 10 times more acidic than Y | TEXT-LOSS: source option C includes a comparison glyph between [OH⁻] and [H⁺]; archive concatenates them without a comparator. Keyed B unchanged; exact typography should be preserved from the page, not invented. | true |
| 76 | 19 / 20 | 4 / 76 | A — 1.10 V | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 77 | 20 / 21 | 4 / 77 | C — \(\mathrm{H}_{2}\mathrm{O}(l)+\mathrm{CO}_{2}(g)\rightleftharpoons \mathrm{H}_{2}\mathrm{CO}_{3}(aq)\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 78 | 20 / 21 | 4 / 78 | C — \(\mathrm{Na}_{2}\mathrm{CO}_{3}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 79 | 20 / 21 | 4 / 79 | W — withdrawn; marks awarded to all appeared candidates | MATCH: no substantive discrepancy found; no independent solve performed. Board withdrawal controls; do not force an option. | false |
| 80 | 20 / 21 | 4 / 80 | D — 6 | MATCH: no substantive discrepancy found; no independent solve performed. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Explicit A header supports identity mapping.

## Batch Q81–90

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 81 | 20 / 21 | 4 / 81 | A — 3‑(2‑Methylpropyl)hept‑1‑en‑4‑yne | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 82 | 20 / 21 | 4 / 82 | C — Functional | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 83 | 21 / 22 | 4 / 83 | A — \(\mathrm{CH}_{4}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 84 | 21 / 22 | 4 / 84 | W — withdrawn; marks awarded to all appeared candidates | MATCH: no substantive discrepancy found; no independent solve performed. Board withdrawal controls; do not force an option. | false |
| 85 | 21 / 22 | 4 / 85 | B — CH₃CH₂–C≡C–CH₂CH₃ | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 86 | 22 / 23 | 4 / 86 | A — I; D — IV | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 87 | 22 / 23 | 4 / 87 | C — III; D — IV | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 88 | 22 / 23 | 4 / 88 | A — I; B — II; C — I and II (structural products in PDF; not independent species labels) | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 89 | 23 / 24 | 4 / 89 | B — II | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 90 | 23 / 24 | 4 / 90 | B — It is an oxoacid of nitrogen; D — It is an oxidizing agent | MATCH: no substantive discrepancy found; no independent solve performed. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Explicit A header supports identity mapping.

## Batch Q91–100

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 91 | 24 / 25 | 4 / 91 | A — 5 A | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 92 | 24 / 25 | 4 / 92 | B — 0.5 A | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 93 | 24 / 25 | 4 / 93 | D — Transformer | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 94 | 24 / 25 | 4 / 94 | A — 10 V | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 95 | 24 / 25 | 4 / 95 | B — \(\frac{R_{1}}{R_{2}} = \frac{L_{1}}{L_{2}}\) | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 96 | 25 / 26 | 4 / 96 | A — 9.9 mA | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 97 | 25 / 26 | 4 / 97 | D — Employs both N‑type and P‑type MOSFETs | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 98 | 25 / 26 | 4 / 98 | B — Non‑inverting amplifier | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 99 | 25 / 26 | 4 / 99 | B — 1 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 100 | 25 / 26 | 4 / 100 | B — AND Gate | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Explicit A header supports identity mapping.

## Targeted adjudication — Q39

Source viewer 9 / printed 10. The final notice really prints **AC** at Set-A Q39 (B32/C40/D32). That is not a table-copy or booklet-permutation error. However:

- Printed A says consistent if p=q=r. Then the RHS is zero and the homogeneous system is always consistent.
- Printed B says inconsistent if a=b=c and p≠q≠r. All LHS expressions are the same, while the three RHS differences are not all equal; they sum to zero and are not all zero. Hence B is true.
- Printed C says **inconsistent** if a,b,c are distinct and a+b+c=0. For real distinct coefficients the matrix has rank 2 and left null vector (1,1,1); the RHS always sums to zero, so it is consistent. Example: (a,b,c)=(1,0,−1), (p,q,r)=(1,2,3), (x,y,z)=(−1,−2,0) satisfies all three equations. C is false.
- Printed D says inconsistent for any a,b,c; homogeneous RHS p=q=r refutes it.

**Literal source-derived set: AB, not official AC**, under ordinary real-coefficient interpretation. The archive silently changes C to “consistent”, but even that does not eliminate true B. Preserve the official key as a quoted authority and record this mathematical dispute separately. No key replacement or scoring change was made.

Other targeted checks: Q9 product-rule primitive makes C and D identical under g′=g; Q25 derivative 2−1/(1+x²)−1/√(1+x²) is nonnegative, so D and its restricted B both hold; Q37 the event-probability roots are 1/3 and 1/4 (printed AD); Q38 distance-to-centre condition is |c|<r√(1+m²), represented by the two source half-intervals A/B; Q69 energy balance is recorded in its row. These checks do not expand into a full independent solve of the paper.

## No changes authorized/applied

No bank, source transcription, archived or runtime key, diagram, eligibility flag, scoring function, submitted result, or deployment was edited. These findings are proposals and review holds only.
