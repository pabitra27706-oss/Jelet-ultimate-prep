# JELET 2024 Q60–62 — printed page 16 restoration

## Source

Owner supplied `Screenshot_20261121_140942_Drive.jpg`, identifying 2024. The visible footer reads **16** and the page shows complete Q60–62. Screenshot SHA-256: `f6f26513d818b08e2ae032e79bd95370846b62cffe34cf9f53e14dad71551b7a`. Prior supplied-PDF review identifies this as viewer/printed page 16. No official raster pixels are published.

## Changes

Restored the three missing blocks in `editorial/pyq-md/2024.md`:

- Q60: rain/umbrella at 30 degrees to vertical, running at 10 km/h; all four velocity-pair options transcribed, preserving radicals and units.
- Q61: potential and kinetic energy versus time for a particle falling from height H. Original-vector reconstruction includes all four options. A: decreasing concave-down V and increasing concave-up K; B: decreasing concave-down V and increasing concave-down K; C: decreasing concave-up and increasing concave-up curves; D: increasing/decreasing curves with the shorter endpoint label. Endpoint labels are sqrt(2h/g) for A/B/C and sqrt(h/g) for D, preserving the source's lower-case h despite upper-case H in the stem. V/K labels appear only in A/B in the source. Curvature/spacing are schematic and radicals are written inline. Accessible descriptions retain distinctions without selecting an answer. Options in Markdown reference Graph A/B/C/D; SVG supplies their actual content.
- Q62: X(t)=At^4+Bt and Y(t)=Ct^3+D; A=1.00 m/s^4, B=-2.00 m/s, C=2.00 m/s^3, D=10 m, t=2 s, all four vector options restored.

Removed the obsolete in-body and trailing missing-question notes. These had contaminated Q59 and Q100 option D in generated data; the option expressions themselves are unchanged. Other subsequent sourceLine offsets naturally shift.

## Keys and scoring

Existing key labels A/A/D are retained, not newly derived or promoted. Under the existing policy, the restored text-complete Q60 and Q62 are scoreable; graph-based Q61 remains held. No previously existing question's keyAnswer, scorable or boardAwarded field changes: all 792 prior records checked. Corpus now 795; 2024 now 100, with no gaps. Three questions restore three printed marks of content, but only two enter the existing scoring pool.

Source/official-key mapping limitations recorded in the imported audit are unchanged. No independent official-notice verification is claimed here.

## Verification

- Astro check/build passed, 58 pages.
- Full main suite: 266 passed; separate 2023 regression suite: 22 passed after updating its stale corpus-count assertion.
- New regressions cover source values, key labels, scoring hold, graph option labels, missing-note cleanup, mathematical rendering and mobile page overflow.
- Q61 browser screenshot rendered and visually inspected against the supplied page: all four alternatives, curve directions/curvatures, endpoint differences and labels retained.
- Content/figure/topic freshness, key validation and whitespace checks passed; archive unchanged.
- Historical Phase 07 baseline excludes these newly restored records, just as it excludes later-restored 2019 Q78/Q79. Baseline remains 212 mapped/478 other; current topic report regenerated (352 mapped, 183 unmapped, 260 outside syllabus).
- Supplied-year figure count now 93 (82 original flagged attachments plus 11 additional); 2023's 11 pre-existing figures remain separate.

No independent second content review or physical Android test; residual rights uncertainty remains. No commit, push, merge or deployment in this restoration turn.
