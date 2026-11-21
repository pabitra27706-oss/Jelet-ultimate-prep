# Inline figure expansion — 2026-11-20, batch 1

## Authorisation and boundary

The owner explicitly requested all papers to have question-specific figures like 2023. This separately authorises source inspection and the figure-layer implementation, not promotion of derived answers. Follow accepted ADR-0002: original SVG primitives, source-page provenance, accessible equivalents, no official raster pixels, no guessed topology and no scoring changes. The residual rights uncertainty remains open, as with the 2023 layer. Archive files are immutable.

**The complete request is not finished.** This batch adds 12 diagrams; 71 of the other corpus-flagged items remain pending. The inventory covers existing figure flags, not every possible transcription omission in the original PDFs.

| Year | Corpus diagram items | Newly attached | Pending |
|---|---:|---:|---:|
| 2017 | 10 | 10 | 0 |
| 2018 | 11 | 0 | 11 |
| 2019 | 6 | 0 | 6 |
| 2021 | 15 | 0 | 15 |
| 2022 | 8 | 0 | 8 |
| 2024 | 18 | 2 | 16 |
| 2025 | 15 | 0 | 15 |
| Total | 83 | 12 | 71 |

2023's existing 11 figures are unchanged; their previously recorded fidelity/review caveats are not cleared by this work.

## Source comparisons

Owner-supplied PDF pages were rendered locally and visually inspected, without OCR, external PDF downloads or answer-key inference. Each new manifest entry records the source SHA-256 and PDF sheet/printed page. These particular inspected pages have matching PDF and printed numbering.

- 2017 sheet 14: Q72, bar and cord, A/B/C, 30 degrees.
- Sheet 15: Q73 triangular pendulum and Q75 two cables; retain the 60-degree angles and weight/tension labels. Q73 label is damaged in the source; location before Q74 identifies it.
- Sheet 17: Q81 force-time graph, 80 N plateau, 5/10 seconds.
- Sheet 18: Q89 axial bar, 2 m + 2 m, 2 kN right, 1.5 kN left, x.
- Sheet 19: Q90 returning bracket and Q91 cantilever point load, all symbolic dimensions retained.
- Sheet 21: Q97 shear diagram and all four graphical loading alternatives, including the shifted point loads in D. No option selected.
- Sheet 22: Q98 normal and shear stress directions and values.
- Sheet 23: Q100 stress element and all four Mohr-circle alternatives. No option selected.
- 2024 sheet 11: Q42 projectile with all four graph-pair alternatives, Q43 refraction with alpha 2 visibly greater than alpha 1. No angle value is invented in the displayed figure.

Archived pilots were consulted but not copied blindly: the old Q72 pilot omitted the visible C label, Q81 used unequal five-second axis intervals, and Q43 geometry/descriptive text had inconsistencies. New original SVGs address those differences and leave the archive untouched.

## Implementation

- New editorial/public SVG collections and manifests for 2017 and 2024, attached through the existing content generator and Question/Figure components.
- Figure asset lookup now matches year-qualified URL rather than basename, avoiding cross-year filename collisions.
- Figure builder discovers year collections rather than only publishing 2023.
- Public artifact allowlist explicitly adds the 12 SVG paths; offline pack metadata regenerated.
- `editorial/figures/EXPANSION-STATUS.json` records each of the 83 items. Refresh with `node scripts/figure-expansion-status.mjs` after generating content.
- No crop, private PDF, raster scan or answer key imported into public assets.

## Observed checks

- Pre/post comparison of all 790 corpus questions: stems, options, option-completeness, key answers, scorable flags and board awards unchanged.
- Astro check: zero errors/warnings/hints. Build: 58 pages. Used npm-provided Node 22.23.4 because installed Node 22.22.3 is below Astro's declared minimum.
- `npm run figures:check`: published copies current (before final spacing-only edits; final full suite checks byte equality).
- Final `npm test`: **245 tests passed**, including 22 figure tests and 52 browser tests. Chromium 153.0.8010.0 tested inline identities/holds and text equivalents at 390px and 1280px; no page-wide overflow.
- Browser screenshots of all 12 drawings were visually inspected against the rendered source pages. Q97 row spacing was subsequently enlarged to remove adjacent-row label collisions; Q100 option-label spacing was increased. The final build and full suite were rerun after those changes. Screenshot captures can include the sticky site header; that overlay is not part of SVG artwork.
- `git diff --check`: passed.

## Remaining work and release status

71 corpus-flagged diagrams still need source mapping, redraw and checks, starting with 2018. Beyond this inventory, question-level omissions/fidelity need a separate full-paper comparison. Source comparison here is agent review, not an independent second content review. Phone-specific readability, publication rights and existing 2023 ambiguities remain open.

Available in the running local preview; **not committed, pushed, merged or deployed**. PR #9 remains untouched. This batch does not certify answers or complete phase 10.
