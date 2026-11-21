# Inline figure expansion — batch 3, 2026-11-20

## Outcome and scope

Continued the owner's requested question-specific SVG layer under ADR-0002. Added **18 inline figures for 2021**: all 15 originally flagged questions plus three source diagrams omitted by the old detection flags (Q21, Q71, Q87). Original PDFs remain private; no official pixels, OCR, answer-key inference or archive edits.

Current supplied-year total: **46 attached figures** = 43 of the original 83 flagged items + three newly discovered, attached items. The 2023 collection's 11 figures are unchanged and are not counted in those 46.

Of the original 83 flags, 39 still await figure work/source review and one (2019 Q94) needs a non-diagram transcription correction. Additionally, 2019 Q77 has a diagram but an empty corpus question and remains a transcription/figure backlog item. These figures do not certify whole-paper completeness or answers.

## Source inspection

Input: owner-supplied `2023111536-1.pdf`, booklet 1091007537, main Engineering/Technology stream. SHA-256 checked against the intake manifest before authoring; each asset and entry records it. PDF sheets and printed pages agree on inspected pages.

| Page | Questions | Source features preserved |
|---|---|---|
| 6 | 21 (newly identified) | Five sources, all long/short cell plate polarities, V1/V2/0 V/10 V terminals |
| 7 | 26 | All four V versus IL characteristic curves, no choice selected |
| 8 | 33, 35 | Bridge wiring, 12/24/6/12 ohm labels and 6 V polarity; all four fluorescent-tube wiring alternatives |
| 13 | 71 (new), 72, 73 | Oblique pull on rough-plane block; three-member truss and rope, 60 degrees, hinge, W; inclined m1 and hanging m2 |
| 14 | 74, 75 | Trapezoid a/b/h/y-bar and schematic centroid; two gear side views with opposite rotation arrows |
| 15 | 77, 81 | Inclined projectile, alpha/beta references and R; cylinder positions, tangent fixed cord, m/r/h |
| 16 | 84 | Hinged rod, length L, weight label W, upward free-end force F |
| 17 | 87 (new), 89 | Fixed-fixed shaft, torque at L/4; internal hinge B, two equal spans and midpoint P on BC |
| 18 | 93, 94 | Perspective crossarm with upward P at A and downward P at B; signed SF/BM plots, C discontinuity and all dimensions |
| 19 | 95, 99 | Partial shear diagram with −6/+14 kN jump and 3/7 m lengths; two cantilever load cases with symbolic deflections |

Q21 cell plate polarities, Q35 distinct filament terminals and wiring alternatives, and Q94 signs/values were additionally inspected at higher magnification. Q94's negative bending moment is drawn upward following the source; it is not silently reinterpreted. Q99's dashed shapes are schematic and do not encode a solved ratio. Q35 panels are stacked rather than arranged two-by-two to preserve phone legibility.

## Changes

- New `editorial/figures/2021/` and matching `public/figures/2021/` collection: 18 SVGs plus editorial manifest.
- Regenerated paper figure attachments and offline-pack metadata; public artifact allowlist explicitly includes the 18 SVGs.
- Progress generator now separately lists `additionalAttachedFigures`, preserving the original 83-item denominator instead of pretending the detection list was exhaustive.
- Figure tests cover all 18 entries, legacy flags and additional items. Browser regression checks all 18 within their exact question cards at mobile and desktop widths.

No stems, options, answer-key data, legacy figure flags or scoring eligibility were changed. Adding diagrams to Q21/Q71/Q87 is permitted by the existing question-ID attachment pipeline; their held status remains unchanged.

## Observed verification

- Visual comparison with all relevant source pages, then visual inspection of all 18 browser-rendered drawings. Refined label spacing, load-current subscript, gear boundary and hinge connection after that pass.
- Pre/post comparison across all 790 questions: stems, options, option-completeness, key answers, scorable flags, board awards and historical figure flags unchanged.
- Astro check: zero errors/warnings/hints; build: 58 pages, success. Used temporary npm-provided Node 22.23.4 to meet Astro's minimum; no dependency pin changed.
- Final `npm test`: **251 passed**, including 28 figure tests and 52 browser tests. Chromium 153.0.8010.0. Inline IDs, held scoring, text equivalents and page overflow checked at 390px and 1280px.
- `npm run figures:check` and `git diff --check`: passed.
- No physical Android test, independent second content review, or legal permission determination. Existing rights uncertainty remains recorded under ADR-0002. Automated tests do not verify answers.

## Current progress and next work

| Year | Original flagged items with figures | Additional figures attached |
|---|---:|---:|
| 2017 | 10/10 | 0 |
| 2018 | 11/11 | 0 |
| 2019 | 5/6 | 0 |
| 2021 | 15/15 | 3 |
| 2022 | 0/8 | 0 |
| 2024 | 2/18 | 0 |
| 2025 | 0/15 | 0 |

Next diagram batch: 2022. The source-backed 2019 Q77–79/Q94 transcription corrections and additional Q77 diagram remain separately pending. Existing 2023 fidelity caveats are not cleared.

Changes are local/preview only: no commit, push, merge or deployment. PR #9 remains untouched.
