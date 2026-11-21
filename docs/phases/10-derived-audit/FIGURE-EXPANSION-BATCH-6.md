# Inline figure expansion — batch 6, 2026-11-20

## Outcome

Added **17 original inline figures for 2025**: all 15 legacy diagram flags (Q44, Q46, Q51, Q54, Q55, Q57, Q58, Q62, Q66, Q81, Q82, Q85, Q88, Q95, Q100), plus two source diagrams missed by the old inventory (Q61 and Q67).

Supplied-year total: **91 attachments = 82/83 legacy flags + nine additional figures**. The existing 11 figures for 2023 are unchanged and excluded from this count. The only legacy flag without an asset is 2019 Q94, which inspection identified as a non-diagram transcription correction. The additional 2019 Q77 diagram/transcription backlog remains unresolved. This completes coverage of the actual diagrams in the initial flagged inventory, **not** exhaustive whole-paper completeness or source/answer certification.

## Source comparison

Source: owner-supplied `202512161802442791.pdf`, Series A. The input hash was checked programmatically against the intake manifest before authoring; the exact hash is recorded in every new SVG and `editorial/figures/2025/manifest.json`.

Each relevant page was inspected individually. Printed page numbers are one higher than PDF sheet numbers on all pages used here; this offset was observed, not inferred from another year.

| PDF sheet / printed page | Questions | Features preserved |
|---|---|---|
| 10 / 11 | 44 | Given acceleration intercept −2 and zero at t=1; all four velocity-time alternatives |
| 11 / 12 | 46 | A–E order; straight AB/CD and curved BC/DE |
| 12 / 13 | 51 | All four viscous-fall velocity curves |
| 13 / 14 | 54, 55 | Curved ramp, two disc positions, V/h; extension/load axes and steeper B line |
| 14 / 15 | 57, 58 | Four thermodynamic states and every arrow, including returning b-to-a curve; all four P–V alternatives |
| 15 / 16 | 61, 62 | Three equal masses and mixture temperatures; heating curve with both plateaux and A–E labels |
| 17 / 18 | 66, 67 | All four displacement-time alternatives with t=4 guides; fixed pulley, 2 kg and downward 40 N force |
| 20 / 21 | 81, 82 | Full branched hydrocarbon connectivity and bond orders; both carbonyl structures |
| 21 / 22 | 85 | Reactant, both reagent steps and all four product alternatives |
| 22 / 23 | 88 | Reactant/HBr, candidates I–IV and complete option mapping |
| 24 / 25 | 95 | Parallel series-RL branches, I/I1/I2 labels and directions |
| 25 / 26 | 100 | Three NAND gates, all inversion bubbles and bridge at unconnected input-wire crossing |

Q57/Q58 arrows, Q85 chemistry and Q100 wire bridge received enlarged-crop review. Q58 V/3V guides are spaced proportionally; D retains its unlabelled guides. Q66 D's curve joins its rising straight segment tangentially. Chemistry alternatives are stacked where needed for legibility. All deviations and accessible text equivalents are recorded in the manifest.

No official raster pixels are published. These are original vector reconstructions under ADR-0002; residual rights uncertainty remains open. No numerical result or option is selected by the drawings.

## Preserved safety and discovered mismatch

Pre/post comparison across all 790 questions confirmed unchanged stems, options, option-completeness flags, keys, scoring eligibility, board awards and legacy figure flags. The 15 legacy-held questions stay held. Q61/Q67 were already scoreable and remain so; attaching their figures does not validate their answers. Missing graphical-option completeness flags also remain unchanged.

**2025 Q95:** the source uses I, I1 and I2, while the corpus stem currently names I1, I2 and I3. The redraw preserves the source labels; `SOURCE-FINDINGS.json` records the required separate transcription correction before release. Its existing hold is preserved.

Previously recorded 2024 Q46 option mismatch, 2022 Q6 missing mathematical stem and 2019 transcription/diagram backlog remain unresolved. The 2019 PDF/printed-page provenance concern is not cleared by this batch.

## Verification observed

- Visually inspected all 17 browser-rendered SVGs against the source review. Refined Q58 scale/arrow placement and Q66 tangent join after that inspection.
- Final Astro check: zero errors/warnings/hints. Build: success, 58 pages, using Node 22.23.4.
- Final full `npm test`: **256 passed**, zero failures, including 33 figure tests and 52 browser tests.
- Browser regression checks each attachment in the correct card at 390px and 1280px, descriptions, preserved scoring and page overflow.
- The existing Q95 hold-note assertion initially matched two text elements after the figure addition. It now checks the exact visible badge and explicitly asserts `data-scorable=no`.
- With all 91 supplied-year attachments checked twice, the browser suite reached its old 60-second whole-file timeout. Increased that explicit budget to 120 seconds; locator and navigation timeouts remain unchanged. Final full suite passed.
- `npm run figures:check` and `git diff --check`: passed.
- No physical Android test, independent second content review, legal permission determination or answer verification. Automated tests do not certify source fidelity.

## Next and release status

Next: source-backed transcription corrections and the additional 2019 Q77 diagram, with explicit scoring safeguards; individually resolve 2019 page provenance. Further whole-paper comparison remains needed before declaring every source figure accounted for.

Local/unreleased only: no commit, push, merge or deployment. PR #9 untouched.
