# Inline figure expansion — batch 5, 2026-11-20

## Outcome and scope

Added **19 original inline SVG figures for 2024**: Q45, Q46, Q49, Q52, Q54, Q55, Q57, Q65–68, Q70, Q78, Q79, Q89, Q94, Q96–98. Together with previously attached Q42/Q43, this covers all 18 legacy diagram flags and three additional source diagrams (Q46/Q52/Q55) missed by the old inventory.

Supplied-year total is now **74 attached figures = 67/83 legacy flags + seven additional figures**. The existing 11 figures for 2023 are unchanged and excluded from these totals. Of the 16 remaining legacy flags, 15 are 2025 diagrams; 2019 Q94 is a non-diagram transcription correction. The additional 2019 Q77 diagram/transcription backlog remains. This is not an exhaustive whole-paper certification.

## Source inspection and reconstruction

Input: owner-supplied `2024120234.pdf`, SHA-256 `f9de5246588259b260ba9a1d71c17041a9576443181d5074c18fe536efb4611d`.

The input hash was programmatically checked against the intake manifest before authoring. All attached figures' inspected PDF sheet and printed page numbers agree. Individual provenance, text equivalents and deviations are in `editorial/figures/2024/manifest.json` and each SVG.

| Page | Questions | Preserved source features |
|---|---|---|
| 12 | 45, 46 | Circular motion reference O/C/theta and tangent velocity; acceleration intercepts 10 m/s² and 25 s |
| 13 | 49, 52 | Rod labels l/2l, k/2k, t1/t2; all four lens pieces and rearranged orientations |
| 14 | 54, 55 | Four mass labels and tension directions; photoelectric graph A/B/C/O and negative vertical intercept |
| 15 | 57 | Two unequal potential peaks and an intervening trough |
| 17 | 65, 66 | Minimum V0 above the axis; all four velocity-displacement alternatives |
| 18 | 67, 68, 70 | Leftward plate acceleration and 1 kg block; three rod labels and end temperatures; two labelled adiabatic curves |
| 20 | 78, 79 | All four alternatives per question, including substituent positions and single/double/triple bond orders |
| 21 | 89 | Both text alternatives and both aromatic carbonyl structures |
| 22 | 94 | Four terminals and every long/short cell-plate orientation |
| 23 | 96–98 | Opposed diode orientations and source polarities; feedback wiring and input signs; XOR extra curves, inversion bubbles and all three final gate inputs |

Q78/Q79 chemistry, Q94 cells and Q96 source/diode polarities received additional enlarged-crop inspection. Rod dimensions follow stated proportions rather than approximate scan lengths; deviations are explicit. Q79 alternatives are stacked for readability. No option is selected and no numerical answer is derived in the figure descriptions.

Original vector primitives only, under ADR-0002; no official pixels published. Residual publication-rights uncertainty remains unresolved.

## Safety and transcription findings

Pre/post comparison across all 790 questions preserved stems, options, option completeness, keys, scoring eligibility, board-award flags and legacy figure flags. Legacy-held items remain held. Q46/Q52/Q55 were already scoreable before figure attachment and remain so; this does not validate their answers. Q49's pre-existing board-award flag is preserved separately from its held scoring eligibility.

**Release-blocking finding: 2024 Q46 has mismatched options.** The supplied source lists A: 225 m/s, B: 120 m/s, C: 100 m/s, D: 125 m/s. The corpus currently stores A: 225 m/s, B: 100 m/s, C: 150 m/s, D: 200 m/s. Its existing key label is D. This batch attaches the source graph but does not silently rewrite options, scoring or key data. `SOURCE-FINDINGS.json` records the discrepancy and requires separate source-backed transcription/scoring-safety review before release. The earlier 2022 Q6 missing mathematical stem and 2019 transcription backlog also remain unresolved. The previous 2019 PDF/printed-page provenance concern is not cleared by this batch.

## Verification observed

- All 19 new browser-rendered SVGs visually inspected after source comparison. Subsequently moved Q66 option labels farther from V0 and Q94 V2 below its wire to avoid collisions.
- Final Astro check: zero errors, warnings or hints; build successful, 58 pages, using Node 22.23.4.
- Final full `npm test`: **254 passed**, zero failures, including 31 figure tests and 52 browser tests.
- Browser regression verifies every attached figure in its correct question card at 390px and 1280px, accessible descriptions, unchanged scoring status and absence of page-wide overflow.
- `npm run figures:check` and `git diff --check`: passed.
- No physical Android testing, independent second content review, answer verification or legal permission determination. Tests do not certify source fidelity or answer correctness.

## Next and release status

Next diagram batch: 2025. Separate transcription corrections and additional full-paper completeness review remain necessary.

Local/unreleased only: no commit, push, merge or deployment; PR #9 untouched.
