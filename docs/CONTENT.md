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

| Year | Questions | Scoreable | Marks | Key tier | Board reference |
|---|---:|---:|---:|---|---|
| 2017 | 100 | 0 | — | read only | no usable key |
| 2018 | 100 | 0 | — | read only | no usable key |
| 2019 | 98 | 0 | — | read only | no usable key |
| 2021 | 100 | 0 | — | read only | no usable key |
| 2022 | 95 | 87 | 102 | **derived** | independently solved; never labelled official |
| 2024 | 97 | 78 | 93 | official | WBJEEB notice, Set A, identity-mapped |
| 2025 | 100 | 82 | 100 | official | WBJEEB notice, Set A, identity-mapped |

- 690 questions in total; **247** carry a published key and may enter a scored pool. The other 443 are readable and searchable but never marked, and they are excluded from the denominator of every total.
- Board-voided items award their full marks and are labelled in the reader and in the result: 2024 Q49 and Q58; 2025 Q41, Q79 and Q84.
- Corpus gaps carried openly rather than filled: 2019 Q78–79, 2022 Q86–90, 2024 Q60–62.
- A question is held when its diagram was never transcribed, its options are malformed, or the transcription note says the item is ambiguous. Held items keep their reason on the page.
- The 2023 and 2026 keys exist in the key file but no paper was transcribed for them, so nothing is published for those years.
- Every paper page shows its year, paper, set/booklet, key tier and the board document reference. The key tier is never dropped from a screen that shows a key.
