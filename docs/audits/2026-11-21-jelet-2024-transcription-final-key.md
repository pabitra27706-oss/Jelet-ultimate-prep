# JELET 2024 — PDF transcription and final-key mapping audit

Date: 2026-11-21 UTC. Documentation only. No corrections, scoring edits, merge or deployment. This is **not a full independent solve**.

## Evidence and limits

- Uploaded scan SHA-256: `f9de5246588259b260ba9a1d71c17041a9576443181d5074c18fe536efb4611d`. Every physical PDF page inspected, including cover/rough work. 24 pages; viewer=printed for question pages 3–23.
- Read-only transcription: `archive/jelet-prep/data/pyq-md/2024.md`; runtime `src/data/papers.json`; archived key `archive/jelet-prep/data/docs/official-keys/2024-paper1.json`; runtime `src/data/keys.json`.
- [Official final notice](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2024/08/2024080190.pdf): WBE/Ex-71, 01-08-2024, Engg & B.Sc, pages 2–4; Pharmacy excluded.
- Final-notice tables were retrieved as extracted Markdown, not visually inspected PDF pages. Independently copied their 100 rows × 5 fields, compared all four series-number columns plus answer against the archive, and compared all 100 answers against runtime keys. All match. A manual scratch-copy error in 2024 Q29 was detected and corrected against the fetched notice before recording results; it was not an archive error. Extraction is a remaining evidence limitation.
- Each of the four series columns is a permutation of 1–100. B/C/D are question-number mappings, not separate answer columns. Mapping n from booklet B means locating n in column B, not indexing master row n. This validates table representation, not unseen B/C/D option artwork.
- Withdrawn Set-A questions: [49, 58]. The final notice’s last-page note explicitly awards marks to all appeared candidates. Runtime key voids and paper boardAwarded/voided flags agree. No W was turned into a guessed answer.
- Categories visually checked: I Q1–30/41–65/71–85/91–100; II Q31–40/66–70/86–90; printed maximum 120 marks/100 questions/120 minutes. Category II allows 2×(correct selected/total correct) only when no wrong choice is selected. No scoring implementation or attempt history was changed.

**2024 booklet mapping remains CONDITIONAL**: the cover/booklet 4091010805 has a square symbol and existing metadata calls it Set A. The fetched notice text omits the actual legend glyphs. Direct PDF download failed with TLS EOF; no notice page image was available. Answer-fit evidence in old metadata is not independent symbol evidence. All row comparisons below are therefore to the notice’s Set-A ordering, not an unconditional certification of this uploaded booklet’s mapping.

## What the verdicts mean

`MATCH` means no substantive transcription discrepancy found during this visual comparison, allowing harmless paraphrase/typography. It is not a proof that the board answer is mathematically unique. Other rows explicitly distinguish missing text, missing artwork, altered options and source ambiguity. The answer column quotes the official Set-A choice with its **printed** option text (or a labelled graphical description); it is not a newly derived key. Targeted working appears only for flagged conflicts. Existing scorable flags are observations, never approval.

## Current runtime snapshot

- Records: 97; gaps: [60, 61, 62]; scoreable questions/marks: 78/93; board-awarded questions/marks: 2/2; held records: 17.
- No runtime question in this year has a figureAsset. Figure availability in another commit is not silently imported into this audit.
- Questions with findings/limitations below: 39; other rows: 61. These are transcription-review counts, not mathematical correct/wrong totals.

## Batch Q1–10

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 1 | 3 / 3 | 2 / 1 | A — a singular matrix. | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 2 | 3 / 3 | 2 / 2 | C — rank \(\mathbf{A} = 2\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 3 | 3 / 3 | 2 / 3 | A — \(\begin{pmatrix}1+2K & -4K \\ K & 1-2K\end{pmatrix}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 4 | 3 / 3 | 2 / 4 | C — 21 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 5 | 4 / 4 | 2 / 5 | B — \(\frac{d}{dx}(\Delta_{1}) = 3\Delta_{2}\) | TEXT: Δ₂ prints rows (x,b);(a,x), not (x,−b);(a,x). This changes the determinant in the keyed derivative identity. | true |
| 6 | 4 / 4 | 2 / 6 | B — 4 | MISSING-INPUT: determinant omitted despite scorable=true. Source rows (a²,bc,ac+c²);(a²+ab,b²,ac);(ab,b²+bc,c²), equal to K a²b²c². Options A2/B4/C8/D16. | true |
| 7 | 4 / 4 | 2 / 7 | B — \(2\cos(m\theta - n\phi)\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 8 | 4 / 4 | 2 / 8 | B — a circle | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 9 | 4 / 4 | 2 / 9 | B — \(t_{1}^{3}t_{2}=-1\) | TEXT: option C prints t₁³t₂=1, not t₁⁹t₂=1; keyed B is unchanged. | true |
| 10 | 5 / 5 | 2 / 10 | B — \((c'-c)^{1/2}\) | TEXT: second circle is x²+y²+2gx+2fy+c′=0, not truncated x²+y²+2gx+1. D has square root √(c²+c′²−2cc′), not power 2. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Uploaded-booklet mapping still conditional on the 2024 symbol legend.

## Batch Q11–20

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 11 | 5 / 5 | 2 / 11 | B — \(\frac{\pi}{2}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 12 | 5 / 5 | 2 / 12 | B — \(-\frac{29}{2}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 13 | 5 / 5 | 2 / 13 | B — 40 units | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 14 | 5 / 5 | 2 / 14 | A — \([-2,-1]\cup[1,2]\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 15 | 6 / 6 | 2 / 15 | C — \(2f'(a)\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 16 | 6 / 6 | 2 / 16 | D — 0 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 17 | 6 / 6 | 2 / 17 | B — \(f(x)=\) constant | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 18 | 6 / 6 | 2 / 18 | B — (2,3) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 19 | 6 / 6 | 2 / 19 | B — \(\frac{25}{48}\) | TEXT: A=26/48 and C=24/48, not 26 and 24. Keyed B=25/48 unchanged. | true |
| 20 | 6 / 6 | 2 / 20 | A — \(x\frac{\partial u}{\partial x}+y\frac{\partial u}{\partial y} = \sin 2u\) | TEXT: numerator is x³+y³, not x²+y³. The keyed homogeneous-function identity is no longer valid in the corrupted bank. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Uploaded-booklet mapping still conditional on the 2024 symbol legend.

## Batch Q21–30

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 21 | 7 / 7 | 2 / 21 | C — \(\frac{3}{x+y+z}\) | TEXT: D=−3/(x+y+z)²; archive loses minus sign. Keyed C unchanged. | true |
| 22 | 7 / 7 | 2 / 22 | C — \(2e-1\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 23 | 7 / 7 | 2 / 23 | D — \(-\frac{1}{8}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 24 | 7 / 7 | 2 / 24 | D — \(\frac{\pi}{4}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 25 | 7 / 7 | 2 / 25 | B — \(3\pi\) sq. unit | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 26 | 8 / 8 | 2 / 26 | B — x²y+cos x=π²/4 | TEXT: B=x²y+cos x=π²/4; D=x²y+sin x=π²/4+1. Archive corrupts both; keyed B no longer denotes the printed solution. | true |
| 27 | 8 / 8 | 2 / 27 | A — \(a=1, b=-3, c=2\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 28 | 8 / 8 | 2 / 28 | A — a circle | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 29 | 8 / 8 | 2 / 29 | C — \(\frac{3}{4}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 30 | 8 / 8 | 2 / 30 | B — \(\frac{2}{3}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Uploaded-booklet mapping still conditional on the 2024 symbol legend.

## Batch Q31–40

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 31 | 9 / 9 | 2 / 31 | A — \(B^{2}=B\); B — \(AB=\theta\); C — \(BA=\theta\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 32 | 9 / 9 | 2 / 32 | A — \((x-a)\) is a factor of \(\det(A)\); B — \((x-a)^{2}\) is a factor | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 33 | 9 / 9 | 2 / 33 | A — 0; B — 1 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 34 | 9 / 9 | 2 / 34 | A — \(xy=c^{2}\); D — \(x^{2}-y^{2}=c^{2}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 35 | 9 / 9 | 2 / 35 | C — \([\vec{a}\vec{b}\vec{c}]^{2}\); D — 0 if \(\vec{a},\vec{b},\vec{c}\) are coplanar | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 36 | 10 / 10 | 2 / 36 | A — f is continuous in \(\mathbb{R}\); C — f is continuous but derivable except at \(x=1,2\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 37 | 10 / 10 | 2 / 37 | D — neither max nor min for any real \(x\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 38 | 10 / 10 | 2 / 38 | C — only c | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 39 | 10 / 10 | 2 / 39 | A — \(y=\sin x\); B — \(y=\cos x\); C — \(y=2\cos x+3\sin x\); D — \(y=-\frac{7}{11}\sin x+\frac{9}{132}\cos x\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 40 | 10 / 10 | 2 / 40 | B — 1/6; C — 4/5 | TEXT: second probability is P(A∩B′)=1/6, not P(A∩B)=1/6. First is P(A′∩B)=2/15. Source asks P(B). | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Uploaded-booklet mapping still conditional on the 2024 symbol legend.

## Batch Q41–50

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 41 | 11 / 11 | 2 / 41 | B — \(F T V^{-1}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 42 | 11 / 11 | 2 / 42 | A — constant horizontal speed and V-shaped magnitude of vertical speed (graphical pair) | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 43 | 11 / 11 | 3 / 43 | B — λ₂ = \(\frac{\sin\alpha_{2}}{\sin\alpha_{1}}\lambda_{1}\) | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 44 | 12 / 12 | 3 / 44 | A — \(3.1\times10^{6}\) N/m² | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 45 | 12 / 12 | 3 / 45 | B — \(1+\cos\theta\) | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 46 | 12 / 12 | 3 / 46 | D — 125 m/s | MISSING-FIGURE + TEXT: triangular a–t graph starts at 10 and reaches zero at t=25; A225/B120/C100/D125 m/s. Bank substitutes B100/C150/D200 and loses the graph while scorable=true. | true |
| 47 | 12 / 12 | 3 / 47 | B — \(\frac{0.8Pt}{Ms}\) | TEXT: C=0.8P/(Mst), not (0.8P/Ms)t. Archive creates a duplicate of keyed B. | true |
| 48 | 13 / 13 | 3 / 48 | B — γAᵃ<γBᵃ | TEXT: A γA>γB; B γA<γB; C γA=γB; D None of these. Archive swaps B/C and changes D; keyed B becomes incorrect for the bank. | true |
| 49 | 13 / 13 | 3 / 49 | W — withdrawn; marks awarded to all appeared candidates | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. Board withdrawal controls; do not force an option. | false |
| 50 | 13 / 13 | 3 / 50 | A — 40 cm | MATCH: no substantive discrepancy found; no independent solve performed. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Uploaded-booklet mapping still conditional on the 2024 symbol legend.

## Batch Q51–60

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 51 | 13 / 13 | 3 / 51 | D — material of the rod | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 52 | 13 / 13 | 3 / 52 | A — \(\frac{f}{2}\) | MISSING-FIGURE: four broken lens pieces and their rearrangement are absent while scorable=true; topology cannot be inferred from the surviving stem. | true |
| 53 | 14 / 14 | 3 / 53 | D — conservation of energy | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 54 | 14 / 14 | 3 / 54 | A — T₁ > T₂ > T₃ | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 55 | 14 / 14 | 3 / 55 | C — product of intercept OA and electron charge | MISSING-FIGURE: stopping-potential graph OA/AC absent while scorable=true. Source OA is the negative intercept and AC is the rising line. | true |
| 56 | 15 / 15 | 3 / 56 | A — \(\omega = \sqrt{\frac{\sigma g}{\rho H}}\) | TEXT: A √(σg/(ρH)); B √(ρg/(σH)); C √(σg/(ρR)); D √(ρg/(σR)). Archive swaps B/C and changes D. Keyed A unchanged. | true |
| 57 | 15 / 15 | 3 / 57 | C — three equilibrium points (one stable, two unstable) | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 58 | 15 / 15 | 3 / 58 | W — withdrawn; marks awarded to all appeared candidates | MATCH: no substantive discrepancy found; no independent solve performed. Board withdrawal controls; do not force an option. | false |
| 59 | 15 / 15 | 3 / 59 | C — \(\frac{\pi}{3}\) rad/h | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 60 | 16 / 16 | 3 / 60 | A — Vrg=20 km/h, Vrm=10√3 km/h | ABSENT: question exists on viewer/printed 16. Umbrella at 30° to vertical; man runs at 10 km/h. A (20,10√3), B (10,20), C (10√3,20√3), D (10,20√3), speeds in km/h. | absent |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Uploaded-booklet mapping still conditional on the 2024 symbol legend.

## Batch Q61–70

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 61 | 16 / 16 | 3 / 61 | A — V=mgH−(1/2)mg²t², K=(1/2)mg²t², fall-time endpoint √(2h/g) (graph shapes; formulas describe them, not printed text) | ABSENT: free fall from rest at height H; graph options for potential energy V and kinetic energy K against time. A has V concave down, K concave up, endpoint √(2h/g); B wrong K curvature, C wrong V curvature, D endpoint √(h/g). Printed H/h inconsistency retained. | absent |
| 62 | 16 / 16 | 3 / 62 | D — (12 m)î+(26 m)ĵ | ABSENT: X=At⁴+Bt, Y=Ct³+D; A=1, B=−2, C=2, D=10 in stated SI units; position at t=2. A(10,12), B(−5,15), C(−10,15), D(12,26) m. | absent |
| 63 | 17 / 17 | 3 / 63 | B — \(\frac{mg_{0}R}{2}\) | TEXT: C=−mg₀R/2 and D=−mg₀R. Archive substitutes positive mg₀R/3 and mg₀R/4. Keyed B unchanged. | true |
| 64 | 17 / 17 | 3 / 64 | D — remain unchanged | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 65 | 17 / 17 | 3 / 65 | A — \(F = -kx\) | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 66 | 17 / 17 | 3 / 66 | B — straight descending velocity–displacement line (graphical option) | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 67 | 18 / 18 | 3 / 67 | B — μ>g/a; C — μ=g/a | MISSING-FIGURE + TEXT: source A μ<g/a; B μ>g/a; C μ=g/a; D μ=a/g. Archive swaps A/C; source-key BC would become AB on the corrupted bank. | false |
| 68 | 18 / 18 | 3 / 68 | A — 66.67°C | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 69 | 18 / 18 | 3 / 69 | C — 1:2 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 70 | 18 / 18 | 3 / 70 | A — He and N₂ | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Uploaded-booklet mapping still conditional on the 2024 symbol legend.

## Batch Q71–80

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 71 | 19 / 19 | 3 / 71 | C — \(7.829\times10^{24}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 72 | 19 / 19 | 3 / 72 | A — Aufbau principle | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 73 | 19 / 19 | 3 / 73 | C — 26.5 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 74 | 19 / 19 | 3 / 74 | C — 144 pm | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 75 | 19 / 19 | 3 / 75 | A — \(3.75\times10^{21}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 76 | 19 / 19 | 3 / 76 | D — 2,4,6‑tribromophenol is precipitated, no catalyst required | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 77 | 19 / 19 | 3 / 77 | B — 3 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 78 | 20 / 20 | 3 / 78 | D — phenol (C₆H₅OH structure) | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 79 | 20 / 20 | 3 / 79 | C — CH₃–CH=CH–C≡CH | MISSING-OPTIONS: A CH₃–C≡C–CH=CH₂; B CH₃–C≡C–CH₂–CH₃; C CH₃–CH=CH–C≡CH; D CH₃–CH=C=CH–CH₃. | false |
| 80 | 20 / 20 | 3 / 80 | D — C₂H₅OH | MATCH: no substantive discrepancy found; no independent solve performed. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Uploaded-booklet mapping still conditional on the 2024 symbol legend.

## Batch Q81–90

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 81 | 20 / 20 | 3 / 81 | B — \(1\times10^{-10}\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 82 | 20 / 20 | 3 / 82 | B — sp³d | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 83 | 20 / 20 | 3 / 83 | D — Phenolphthalein | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 84 | 21 / 21 | 3 / 84 | A — SO₂ | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 85 | 21 / 21 | 3 / 85 | B — O₂⁺ | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 86 | 21 / 21 | 3 / 86 | A — It is a monobasic acid; D — It is a strong acid in presence of glycerol | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 87 | 21 / 21 | 4 / 87 | B — N₃⁻; C — I₃⁻; D — CO₂ | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 88 | 21 / 21 | 4 / 88 | B — Methanol; C — Propanoic acid | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 89 | 21 / 21 | 4 / 89 | C — ethanol; D — acetophenone | MISSING-OPTIONS: A methanol; B methyl benzoate; C ethanol; D acetophenone. | false |
| 90 | 21 / 21 | 4 / 90 | A — 2‑butanol; C — 3‑methyl‑2‑butanol | MATCH: no substantive discrepancy found; no independent solve performed. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Uploaded-booklet mapping still conditional on the 2024 symbol legend.

## Batch Q91–100

| Q | Viewer / printed | Final-key page / Set-A row | Official option label + printed text or graphical description | Transcription / source finding | Runtime scorable |
|---:|---|---|---|---|---|
| 91 | 22 / 22 | 4 / 91 | D — 11 | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 92 | 22 / 22 | 4 / 92 | B — load current | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 93 | 22 / 22 | 4 / 93 | B — a capacitor in series with the auxiliary winding | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 94 | 22 / 22 | 4 / 94 | C — +14 V, 2 V, 0 V | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 95 | 22 / 22 | 4 / 95 | C — \(i(t)=0.25\cos(40t-30^\circ)\) A | TEXT: source option D prints 0.25 cos(ωt+60°) A, whereas archive substitutes 40t. Keyed C is unchanged. | true |
| 96 | 23 / 23 | 4 / 96 | B — 5 V | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 97 | 23 / 23 | 4 / 97 | B — –10 V | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 98 | 23 / 23 | 4 / 98 | D — 0,0,1 | MISSING-FIGURE/OPTIONS: printed artwork is visible in the uploaded PDF, but the current runtime record has no figureAsset. Read the page; a placeholder is not a reproduction. | false |
| 99 | 23 / 23 | 4 / 99 | A — \(30^\circ\) | MATCH: no substantive discrepancy found; no independent solve performed. | true |
| 100 | 23 / 23 | 4 / 100 | C — 80 Nm | PARSER-CONTAMINATION: the archive’s end note claiming Q60–62 absent has been appended to runtime option D. The PDF contains those questions; its Q100 D is just 40 Nm. | true |

Batch table/key comparison: 10/10 Set-A answers and 40/40 series-number fields match archive; runtime answers match for all existing rows. Uploaded-booklet mapping still conditional on the 2024 symbol legend.

## Targeted discrepancy checks (not a full solve)

- Q5: dΔ₁/dx=3x²−3ab=3Δ₂ for the printed +b. With archived −b, Δ₂=x²+ab, so the keyed identity B is not generally true.
- Q20: printed (x³+y³)/(x−y) is homogeneous of degree 2, giving xuₓ+yuᵧ=sin 2u. The archived mixed-degree numerator invalidates that reasoning.
- Q26: (x²y)′=sin x gives x²y+cos x=C, with C=π²/4. Thus printed B is correct; the bank’s B is not that formula.
- Q40: write x=P(A), y=P(B). Then (1−x)y=2/15 and x(1−y)=1/6. Eliminate x to get 30y²−29y+4=0; y=1/6 or 4/5, printed B,C. Replacing the complement changes the problem.
- Q46: the triangular acceleration area is (1/2)×25×10=125 m/s, printed D, not runtime D=200.
- Q47: ΔT=0.8Pt/(Ms), printed B; archived C duplicates it through a misplaced t. Source C has t in the denominator.
- Q48: apparent volume expansion γᵃ=γliquid−3αvessel, so αA>αB gives γAᵃ<γBᵃ, printed B (runtime C).
- Q67: N=ma and static support needs μma≥mg. Printed B (>), C (=) together cover μ≥g/a. Archived A (=), B (>) would instead give AB. This is option-label drift, not an official-key transcription error.
- Q60–62: all are plainly present on PDF page 16; the archive’s missing-PDF-text note describes failed extraction, not missing source questions. No questions have been added in this task.

**Release limitation:** obtain/render page 1 of the 2024 final notice and compare its Set-A symbol with the uploaded cover before calling the booklet mapping independently verified. No amount of answer agreement substitutes for this.

## No changes authorized/applied

No bank, source transcription, archived or runtime key, diagram, eligibility flag, scoring function, submitted result, or deployment was edited. These findings are proposals and review holds only.
