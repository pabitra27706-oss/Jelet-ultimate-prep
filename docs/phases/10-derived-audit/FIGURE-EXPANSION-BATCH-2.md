# Inline figure expansion — batch 2, 2026-11-20

## Scope and outcome

Owner said “Continue” after authorising inline figure reconstructions for all papers. Continued the ADR-0002 vector-only layer using supplied PDFs, without fetching remote PDFs, copying raster pixels, editing the immutable archive, changing answers or promoting held questions.

**16 new inline SVGs:** 11 for 2018 and five for 2019. Together with batch 1, **28 of the 83 originally corpus-flagged items now have redraws**. Of the remaining 55 flagged items, 54 await diagram work/source review and one (2019 Q94) needs a non-diagram transcription correction. An additional source diagram (2019 Q77) was discovered outside the original figure-flag inventory. This is not all-paper completion.

| Year | Attached redraws | Original figure flags | Outstanding original flags |
|---|---:|---:|---:|
| 2017 | 10 | 10 | 0 |
| 2018 | 11 | 11 | 0 |
| 2019 | 5 | 6 | 1 transcription correction, not a missing diagram |
| 2021 | 0 | 15 | 15 |
| 2022 | 0 | 8 | 8 |
| 2024 | 2 | 18 | 16 |
| 2025 | 0 | 15 | 15 |

2023 remains unchanged with its existing 11 reconstructions and existing fidelity caveats.

## Evidence inspected

### 2018 — source 2023111538-1.pdf, booklet 88115903

The supplied file's SHA-256 was checked against the intake manifest before authoring. Inspected PDF/printed pages agree:

- Page 7, Q27: 12 V source, positive top; 6 ohm top resistor; upward 2 A current source in parallel with 4 ohm resistor.
- Page 15, Q73: m2 on table, m1 hanging, both tension directions.
- Page 16, Q74: wall-contact sphere, string and phi; geometry respects the stated string length equal to radius, with no numerical angle supplied.
- Page 17, Q78–80: projectile incline, inclined block/pulley, and three-panel truss. Truss connections, pin/roller supports, 9/12 kN loads and three 3 m intervals retained. Alpha in Q78 follows the stem's horizontal reference.
- Page 18, Q82/Q85: vertical incidence/horizontal rebound at 30 degrees; hollow sphere with radius and height from its lowest point.
- Page 19, Q89: all four shear-distribution alternatives, without selecting one.
- Page 20, Q90/Q91: stepped shaft and all four hollow-shaft shear profiles. Q91 was omitted from the archived figure manifest but is in the current corpus and source; it is included here. Central blank intervals in Q91 A/B retained.

### 2019 — source 2023111582-1.pdf

The supplied file's SHA-256 was checked against intake metadata. Inspected printed pages are one greater than PDF sheet index; both are recorded separately:

- PDF 14 / printed 15: Q75 hinged lamina and Q76 cone. Horizontal string, external W, 60-degree apex, A/B/C/D/G retained. G is schematic, not solved, and the source does not depict the removed sphere.
- PDF 17 / printed 18: Q84 three-pulley system. Both attachments to B are preserved: one rope end and the movable-pulley axle. A has a downward 4 m/s arrow.
- PDF 19 / printed 20: Q90 input moment diagram and all four shear alternatives.
- PDF 20 / printed 21: Q91 beam with equal W loads at A/C/E, supports B/D, equal L spans, and all four moment alternatives.
- PDF 21 / printed 22: Q94 has formula choices, **no diagram**. No invented figure was added.
- PDF 15 / printed 16: Q77–79 are present in the supplied paper, contrary to the corpus missing-source note. Q77 includes an incline/block diagram but its corpus stem/options are empty and figure=false. Do not attach an unexplained drawing to that empty item or claim completeness. A separate transcription restoration is needed.

These discrepancies are recorded in `editorial/figures/SOURCE-FINDINGS.json`. The status generator preserves the original 83-item inventory, labels Q94 as source-correction-needed-no-diagram, and lists Q77–79 as additional source findings. No answer is inferred from a drawing.

## Implementation

New editorial and public 2018/2019 collections and provenance manifests; regenerated paper data and offline-pack metadata; explicit public-artifact allowlist entries. Expanded figure tests, browser coverage and progress generator. No new runtime dependency, account, service or cost.

No question text/options/keys were corrected in this figure batch, including the discovered Q94 issue. This intentionally preserves existing holds and makes remaining transcription work explicit rather than silently mixing it with diagram production.

## Checks observed

- All 16 source diagrams/options visually inspected; all 16 browser-rendered SVGs visually inspected. Label/curve refinements were made for readability, then content/build/tests rerun.
- Pre/post all-790-question comparison: stems, options, option completeness, key answers, scorable flags and board awards unchanged.
- Astro check: zero errors/warnings/hints. Static build: 58 pages, success. Used temporary npm-provided Node 22.23.4 for the required Astro runtime; no dependency pin changed.
- Final `npm test`: **249 passed**, including 26 figure tests and 52 browser tests. Browser regression covers every new inline figure on 390px and 1280px layouts, IDs, held scoring, text equivalents and page overflow. Chromium 153.0.8010.0.
- `npm run figures:check`: passed; `git diff --check`: passed.
- No physical Android pass, independent second content review or new rights determination. Automated checks do not certify answers.

## Release and next work

Local preview only. No commit/push/merge/deployment; PR #9 untouched. The legal status of original redraws remains the residual risk recorded in ADR-0002, not resolved by source availability.

Next diagram batch: 2021's 15 corpus-flagged questions. Separately restore source-backed 2019 Q77–79/Q94 transcription with explicit non-scoring safeguards and reconcile subject metadata; do not claim all 2019 questions are complete merely because its five correctly flagged diagrams now render.
