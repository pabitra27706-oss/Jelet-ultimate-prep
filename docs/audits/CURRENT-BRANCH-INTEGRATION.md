# Audit import and implementation assessment

## Import

Owner requested bringing all work from `arena/e4208b54-jelet-ultimate-prep` onto the current branch, then assessing next steps. Imported all **22 audit files**, byte-for-byte, from commit `53470c85dc13043aa40669329abc013ac53cc079`. Its changes relative to the common base are entirely additions under `docs/audits/`; no application files were taken from the older checkout. Current branch remains `arena/a05b85e3-jelet-ultimate-prep`.

Imported documents retain historical branch names, dates, limitations and snapshots. Their statements that records/figures were absent must not be read as descriptions of this current branch. The source summary's exact-commit historical reconciliation uses our `7903a34`; its 2024/2025 transcription reports instead describe the older checkout.

## Checks performed here

- All 22 imported files match source git blobs exactly.
- Historical ledger contains exactly 500 unique year/question rows; all stored labels match the current imported records (2017–2021) or current derived key (2022). Array answers were normalized to concatenated labels for comparison.
- All 200 modern audit-table answer labels match current 2024/2025 keys. Each of the eight set-number columns is a permutation of 1–100. This checks the imported comparison against this repository, not fresh retrieval/authentication of the board notices.
- Historical source-report links resolve. Counts reproduce 349 agreements, 25 disagreements, 46 ambiguous, one not-checkable, 73 new candidates and six unsolved holds.
- Added `CURRENT-BRANCH-REVIEW-QUEUE.tsv`: all 500 historical rows enriched with present-day record, figure and scoring availability. It is a work list, not a public key or approval to score.
- Content/figure/topic freshness, key validation and whitespace checks passed. No application build/browser rerun is necessary for this documentation-only import; no new mathematical certification is claimed.

## Recommended implementation order

### 1. Restore missing source content, preserving official answers

Current gaps independently confirmed: **2022 Q86–90** and **2024 Q60–62**. These eight questions already have stored key entries. Restore their full stems/options from the PDF, not from answer-only report rows. Confirm category, figure requirements, numbering and marks; missing-question restoration changes totals and needs explicit regression checks.

Next repair scorable questions with missing or changed source inputs, beginning with **2024 Q6**, then the audited option-order/exponent/code discrepancies. Read full source pages before editing. Do not change an official key merely to fit corrupted bank text.

### 2. Review and fill the 73 proposed historical candidates in batches

Start with **2019 Q77–79/Q94**: source wording is already restored and the reconciliation agrees with the corrected options. Candidate labels in question order are **D, B, B, B**. These are promising first implementation cases, not applied answers or tier promotions in this import.

For every candidate preserve source working, assumptions, exact option text and provenance. Refresh stale historical evidence rather than claiming old checks cover a new answer. Maintain unresolved holds; public display/scoring integration is a separate implementation task.

### 3. Resolve disagreements separately

There are **21 imported-answer disagreements**, plus **four 2022 derived-key disagreements**. Some have no valid literal option rather than a simple replacement letter. Read each source argument and original page; do not bulk substitute labels from a TSV. Matching-letter cases still need option-text fidelity checks.

Keep official exam scoring and mathematical commentary separate for **2025 Q39**. The report alleges an official AC versus mathematically derived AB discrepancy; do not silently overwrite the official record.

### 4. Close remaining evidence gaps

- Inspect the 2024 final-notice symbol legend against the uploaded booklet before asserting fully verified Set-A mapping.
- The imported work does not constitute an independent visual review of our redraws.
- 2023 has no new source audit in this import.
- Source ambiguity, legal/publication review and physical-device evidence are not resolved by importing reports.

## Avoid redoing completed fixes

**2022 Q6, 2024 Q46 and 2025 Q95** are already corrected here. In particular, the modern report's Q46 missing-graph/incorrect-options finding is an old-checkout finding: current Q46 has the graph and options 225/120/100/125 m/s. Current Q95 has the circuit and I/I1/I2 labels. Other missing-figure observations must likewise be compared against current assets before treating them as open tasks.

## Scope of this turn

Audit import, mechanical reconciliation and implementation queue only. No answers filled, no official keys overwritten, no scoring changes, no archive changes, no merge or deployment. Imported source claims remain attributed to their reports. Commit/push not performed in this turn.

## Subsequent local update: 2024 page 16

The owner has now supplied the full page and Q60–62 have been restored, including Q61's four graph options. See [restoration provenance](../../editorial/provenance/2024-q60-q62-restoration.md). The eight-missing-record recommendation above is historical: **only 2022 Q86–90 remain missing**. Historical TSV comparisons remain valid for their stated reference; they do not cover this later 2024 addition. Corpus is now 795 records.

## Subsequent local update: 2022 page 21

Owner supplied Chemistry Q86–90; all five are restored with the existing derived keys and Category-II classification. See [provenance](../../editorial/provenance/2022-q86-q90-restoration.md). **The missing-number backlog is now closed: all eight papers contain 100 records (800 total).** This does not close remaining transcription/answer disputes. Historical reference reports remain unchanged; the current-state queue is refreshed for record availability.
