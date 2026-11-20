# Editorial contract and exam scoring

Keep **raw archive → editorial working records → approved public subset** separate. Never bundle an entire source folder into the site by default. A publicly downloadable document is not necessarily licensed for republication. Record the permission/licence, scope and attribution; if unresolved, hold reproduction and link to the official source. Check original diagrams and videos separately. Use original authored explanations with named editorial review.

| Record | Required information |
|---|---|
| Rule edition / paper | Exam year, paper/stream, booklet identity and series mapping, language, subject/category quotas, duration, effective notices, withdrawal handling and sources |
| PYQ | Immutable ID, year, paper, set, printed section/number (numbers may repeat), source page/URL, stem/options/figure status, category, topic IDs, primary section anchor, answer provenance, worked solution and separate reviews |
| Lesson / topic | Stable topic and section IDs, syllabus edition/location, prerequisites, learning objective, examples, hint ladder, revision sheet, optional video metadata, language/reviewer, links back to mapped questions |
| Original numerical problem | Explicitly label original, record template version/parameters, admissible ranges, derivation, units/tolerance and unique options; never mix generated items into an official paper |

**Decision per item:** held (identity/rights/content not publishable); read only (publishable but not gradeable); scoreable (complete, permitted, mapped to appropriate scoring rules and checked key). Withdrawn is a board status, not a missing option; show the notice and apply only documented year-specific treatment in a full paper. Label derived answers independently solved, never official. Separate reviewed original practice from verified PYQs. A figure with missing axes, labels or graphical options blocks scoring. Specify review date and source for status changes. Missing lesson mapping need not block an otherwise verified independent practice item.

### Dated reference: 2026 Paper I

English OMR, 120 minutes. See the [source register](RESEARCH.md). Confirm a different year's own rules before using these numbers.

| Subject | Category I | Category II | Marks |
|---|---:|---:|---:|
| Mathematics | 30 | 10 | 50 |
| Physics | 25 | 5 | 35 |
| Chemistry | 15 | 5 | 25 |
| Fundamentals of Electrical & Electronics Engineering | 10 | 0 | 10 |
| Total | 80 | 20 | 120 |

Category I: exactly the correct choice +1; wrong or multiple marked −¼; blank 0. Category II: all correct and no wrong +2; any wrong or blank 0; nonempty correct subset earns `2 × correct selected / total correct`. Keep full precision for totals; distinguish displayed rounding. For key A,C: A = 1; A,C = 2; A,B = 0. Include a three-correct-option fractional case in tests. 2026 Pharmacy Paper II is separate (100 Category I), not a Paper I filter.

**Full-paper gate:** reconcile *every* printed question in the selected series, not just Set A numbering; resolve all missing diagram/key/withdrawal policies, category quotas, duration and total. If one item is held without a documented board disposition, offer a labelled incomplete drill, not an official-style total. On corrections, version the record, preserve old attempt context and disclose changed scoring via the [corrections log](CORRECTIONS.md).

### Published corpus · 2026-11-19

The generator (`scripts/build-content.mjs`) reads the preserved archive and emits three datasets. These are the measured numbers, not a plan.

| Year | Questions | Keyed | Keyed marks | Board-awarded | Awarded marks | Sit-able | Key tier | Board reference |
|---|---:|---:|---:|---:|---:|---:|---|---|
| 2017 | 100 | 0 | — | 0 | — | 0 | read only | no usable key |
| 2018 | 100 | 0 | — | 0 | — | 0 | read only | no usable key |
| 2019 | 98 | 0 | — | 0 | — | 0 | read only | no usable key |
| 2021 | 100 | 0 | — | 0 | — | 0 | read only | no usable key |
| 2022 | 95 | 87 | 102 | 0 | — | 87 | **derived** | independently solved; never labelled official |
| 2023 | 100 | 86 | 103 | 4 | 5 | 90 | official | WBJEEB notice JEEB/Reg-267/23, Set A, identity-mapped |
| 2024 | 97 | 78 | 93 | 2 | 2 | 80 | official | WBJEEB notice, Set A, identity-mapped |
| 2025 | 100 | 82 | 100 | 3 | 3 | 85 | official | WBJEEB notice, Set A, identity-mapped |

- 790 questions in total. **333** carry a published key and are marked against it. **9** more were voided by the board and award their marks to every candidate, so **342** questions can be sat and carry marks in a total. The other 448 are readable and searchable but never marked, and they are excluded from the denominator of every total.
- A board-voided item is *not* a held item. The board published "W": no option is keyed and the full marks go to every candidate, whatever the candidate answered. These nine items are labelled in the reader, in the runner and in the result, they are never asked for, and they never enter the review queue:
  - 2023 Q6, Q46, Q88 and Q94 · 2024 Q49 and Q58 · 2025 Q41, Q79 and Q84.
  - 2024 Q49 also depends on a diagram the transcription does not reproduce. The board voided it precisely so that no answer was needed, so the board's award governs the credit; ordinary held diagram items stay held and stay out of the totals.
  - 2023 Q88 is a Category II item and carries two marks.
- Corpus gaps carried openly rather than filled: 2019 Q78–79, 2022 Q86–90, 2024 Q60–62.
- A question is held when its diagram was never transcribed, its options are malformed, or the transcription note says the item is ambiguous. Held items keep their reason on the page.
- The 2026 key exists in the key file but no paper was transcribed for it, so nothing is published for that year.
- Every paper page shows its year, paper, set/booklet, key tier and the board document reference. The key tier is never dropped from a screen that shows a key.

### The figure layer

A question whose stem points at a diagram is a dead end unless the diagram is there. The figure layer is the set of reconstructed drawings that closes that gap, and it is governed by [ADR-0002](../archive/jelet-prep/data/docs/decisions/ADR-0002-figure-reconstruction.md), which is a decision rather than a preference:

| Rule | What it means here | Where it is enforced |
|---|---|---|
| No official pixels | An asset may not embed, link or trace any raster from the booklet. Only hand-authored SVG primitives. | `scripts/build-figures.mjs`, `tests/figures.test.mjs` |
| Explicit provenance | Every asset names its source paper, booklet reference and retrieval date in a comment, and the manifest repeats it in structured form. | `editorial/figures/<year>/manifest.json` |
| A text equivalent | Every asset carries a `<title>` and a `<desc>`, and the manifest carries an alt text and a long description, both published beside the figure. | `src/components/Figure.astro` |
| No automatic scoring | A redraw does not verify an item. Ten of the 2023 items remain held with their figure on the page, and no held item becomes scoreable. | `tests/figures.test.mjs` |

The layer is authored in `editorial/figures/<year>/`, published to `public/figures/<year>/` by `scripts/build-figures.mjs`, and inlined into the reader so a figure inherits the page's colour tokens in both themes. The published copies are byte-identical to the authored ones, and the check step in the release workflow fails if they drift.

**The eleven 2023 figures** cover Q42, Q48, Q60, Q61, Q68, Q70, Q84, Q91, Q92, Q94 and Q95. Each manifest entry records what the drawing is, how faithful it is to the printed values, and how it differs from the booklet's artwork. Four entries — Q68, Q84, Q94 and Q95 — are marked as reconstructions whose wiring or layout was derived rather than traced, because the booklet's accessible text layer preserved the element labels but not the connections between them. Those four are flagged for owner review against the original page and are labelled as such on the site.

**Figures do not unblock scoring.** Q94 is the clearest case: the board voided it, so it is board-awarded, and the figure beside it changes nothing about that. The ten held items keep their hold reason, and the total a learner can score is unchanged by the presence of a drawing.

