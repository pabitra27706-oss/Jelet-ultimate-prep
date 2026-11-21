# JELET audit update — transcription, final keys and historical reconciliation

Date: 2026-11-21 UTC. Working branch: `arena/e4208b54-jelet-ultimate-prep`.

**Documentation only. No bank, answer, figure, scoring, eligibility or submitted-result changes. No merge or deployment.** Earlier reports were committed/pushed at `546d97b`. After delivery, the owner authorized committing/pushing this documentation update to the same working branch. No merge or deployment is authorized.

## 2024 and 2025: requested limited-scope audit

All **200 questions and every uploaded PDF page** were visually inspected for transcription fidelity. This was **not a full independent solve**. Only discrepancies and observed ambiguities received targeted mathematical checks. Reports retain ten-question boundaries, viewer versus printed pages, official option labels with source text/graph descriptions, and current runtime scorable flags.

| Year | Report | Final-table comparison | Uploaded booklet mapping | Questions with findings / other reviewed rows |
|---|---|---|---|---:|
| 2024 | [Transcription and final key](2026-11-21-jelet-2024-transcription-final-key.md) | All 100 answers and 400 series-number fields match the fetched final notice and archived key; runtime answers agree | **Conditional**: square-to-Set-A legend still needs visual verification | 39 / 61 |
| 2025 | [Transcription and final key](2026-11-21-jelet-2025-transcription-final-key.md) | All 100 answers and 400 series-number fields match the fetched final notice and archived key; runtime answers agree | **Supported** by explicit A printed on question pages and A-labelled final-key column | 32 / 68 |

“Findings” includes omissions, altered text/options, parser contamination and source-level ambiguities; it is **not a count of wrong official answers**. “Other reviewed rows” does not mean independently solved or scoring-approved.

### Official authority and evidence limits

- 2024: [WBJEEB final notice WBE/Ex-71, 01-08-2024](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2024/08/2024080190.pdf), **Engg & B.Sc**, not Pharmacy. Set-A withdrawals **49, 58**.
- 2025: [WBJEEB final notice JEEB/Reg-171/25, 16-11-2025](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2025/11/202511162064778225.pdf), **JELET PAPER I**, not Paper II or the October model key. Set-A withdrawals **41, 79, 84**.
- Both notices explicitly award withdrawn-question marks to all appeared candidates. Archived/runtime void lists and per-question board-awarded flags match.
- [200-row final-table comparison record](2026-11-21-jelet-2024-2025-final-table-comparison.tsv): all four set-number columns plus final answer, with notice page. This is an audit artifact, not a replacement application key.
- The notices were obtained as **extracted Markdown**, not locally rendered PDFs. A direct PDF download failed with TLS EOF. Extracted text loses the symbol legends. The 2024 booklet cover’s square therefore cannot yet be independently matched to the notice’s Set-A symbol. Existing metadata and answer-fit evidence do not close that gap. No other-set booklet was uploaded, so B/C/D option-order identity was not visually audited.

**Outstanding mapping step:** inspect page 1 of the 2024 final notice as an image and compare its Set-A glyph with uploaded booklet `4091010805`. Until then, do not describe the 2024 booklet mapping as fully verified.

### Important findings

- **2024 Q60–62 are present** on viewer/printed page 16, but absent from the archive/runtime bank. The runtime has 97 questions; the archive’s missing-extraction note also contaminates runtime Q100 option D.
- Changed exponents, probability complements and option identities affect keyed answers: examples **2024 Q5/20/26/40/46/48/67**, **2025 Q5/10/20/37/38/69**. Reports separate corrupted-bank problems from faithful copies of the board key.
- Several items remain scorable despite missing required input; examples **2024 Q6/46/52/55**. Other scorable items, such as **2025 Q67**, omit the printed illustration even where the surviving text may suffice to solve them. Missing artwork and an unsolvable input are separate findings; neither automatically changes eligibility.
- **2025 Q39:** final notice really says **AC**, but the literal printed choices support **AB** under ordinary real coefficients. Printed C says “inconsistent”; the archive silently changes it to “consistent”. The report provides a rank/consistency argument and a concrete counterexample. This is a source/key mathematical dispute, **not** a copied-key or booklet-permutation error.
- Other observed source ambiguities—2025 Q9 duplicate primitives, Q15 unstated urn prior, Q25 overlapping monotonicity statements and Q30 probability model—remain separate from transcription errors. No source question was silently repaired.

## Historical reconciliation: exact commit 7903a34

Reference: **`7903a345c93d3434ff403260b2c8340bdf280b6c`**, from owner-named branch `arena/a05b85e3-jelet-ultimate-prep`. Fetched/read using git without checkout, merge or incorporation into the active corpus.

The completed historical PDF audits have now been compared against the **actual 400 imported entries** at that commit and the unchanged 100-entry 2022 runtime derived key. The earlier missing-import blocker is removed **for this exact read-only comparison**, not by adding imports to this branch.

**The following verdicts concern the stored answer versus the qualified PDF result. They do not certify the bank’s transcription, imported `officialText`, explanation, diagram or scoring eligibility.** A matching letter attached to corrupted option text is not a valid bank answer. Individual reports preserve qualifications and target-bank differences.

| Year | Qualified source agreement | Source disagreement | Source ambiguity | Not checkable | Unsolved: candidate proposed / still held | Report |
|---|---:|---:|---:|---:|---:|---|
| 2017 | 66 | 6 | 10 | 1 | 16 / 1 | [100-row reconciliation](2026-11-21-jelet-2017-reconciliation-7903a34.md) |
| 2018 | 71 | 5 | 7 | 0 | 17 / 0 | [100-row reconciliation](2026-11-21-jelet-2018-reconciliation-7903a34.md) |
| 2019 | 68 | 3 | 8 | 0 | 17 / 4 | [100-row reconciliation](2026-11-21-jelet-2019-reconciliation-7903a34.md) |
| 2021 | 57 | 7 | 12 | 0 | 23 / 1 | [100-row reconciliation](2026-11-21-jelet-2021-reconciliation-7903a34.md) |
| **Four imported years** | **262** | **21** | **37** | **1** | **73 / 6** | **321 answer-bearing + 79 unsolved** |
| 2022 | 87 | 4 | 9 | 0 | 0 / 0 | [100-row reconciliation](2026-11-21-jelet-2022-reconciliation-7903a34.md) |
| **Total** | **349** | **25** | **46** | **1** | **73 / 6** | **500 entries** |

The 73 newly identifiable unsolved candidates are **proposals only**: **0 entries filled**. Existing derived tiers and holds remain unchanged. The historical source-audit totals remain **441 qualified source sets / 59 source holds**; those are a different denominator/classification from the inspected-record verdicts here. For example, the old 2018 Q9 domain hold is counted as ambiguous in this stored-record reconciliation, not silently treated as a solved global minimum.

### Disagreement register

- **2017:** Q8, 10, 38, 60, 63, 78. Q49 remains not-checkable as a literal printed-code/output claim, not a repaired-code confirmation.
- **2018:** Q7, 15, 33, 38, 93.
- **2019:** Q56, 66, 93.
- **2021:** Q25, 28, 42, 49, 50, 71, 83. Q42’s stored D requires repairing the invalid printed option; that is not literal-PDF agreement.
- **2022:** Q7, 32, 37, 48; unchanged from the completed PDF/key audit. Repaired-bank and literal-source verdicts differ for some questions; the report keeps them separate.

Each reconciliation report retains ten-question batches, printed option text from the prior source audit, inspected stored labels/tiers, page references, source-working links and quoted reference reasoning for disagreements. [Machine-readable 500-row ledger](2026-11-21-jelet-2017-2022-reconciliation-7903a34.tsv).

### What the reference commit actually fixes

- **2017/2018/2021:** runtime stems/options are unchanged from the already-audited active checkout; there is no corrected editorial Markdown for those years at this commit. Their historical text/option findings remain open.
- **2019:** restores text/options for Q77–79 and Q94, consistent with the prior PDF audit; the imported answers still mark all four unsolved.
- **2022:** restores Q6’s determinant, consistent with source answer D=4. Other stem/options are unchanged; the key’s 100 answers are identical.
- **54 figure assets** are attached across these five years. This reconciliation checked availability and metadata, **not a new independent visual review of every redraw**. `reviewed=true` is not self-proving. The old 2022 current-bank totals must not be repackaged as fresh results against newly available artwork; only the unchanged key/PDF totals transfer directly. No figure attachment automatically clears an item for scoring.

## Validation and non-actions

Validation covers 200 modern table rows, all four permutations per year, runtime key equality, withdrawals, 500 historical records, import counts/tiers/holds, ten-question batch coverage, relative report links, source hashes and documentation-only changes. Mathematical spot checks target the reported discrepancies only.

### Validation record

- **PASS — 1,142 assertions**, Python standard-library audit validator (`python /tmp/validate-jelet-reconciliation.py`, temporary working script). Includes exact reference-key/runtime bytes against git objects, 321/79 imported record counts, held/provisional invariants, all 700 report rows, page/answer coverage, set/category permutations and local evidence links.
- **PASS — targeted exact arithmetic/counterexamples:** 2024 Q40/46/62 and 2025 Q37/39/69; the reports contain the other short symbolic discrepancy arguments. This is not a full solve or a fresh independent second pass.
- **PASS — `git diff --check`**; all modifications confined to `docs/audits/`. Runtime `papers.json` and `keys.json` match their recorded pre-audit SHA-256 values; archive has no diff. Uploaded 2024/2025 PDF hashes rechecked.
- The first local-link check correctly exposed two mathematical bracket expressions being interpreted as Markdown links; those literals were escaped and validation rerun successfully. No source/key correction was involved.
- **BLOCKED/PENDING:** visual 2024 final-notice symbol legend; independent review of reference redraws. Neither is reported as passed.

No build/browser/device/deployment test is claimed or needed for this documentation-only change. No imported evidence script was rerun, no independent human review occurred, and no publication-rights or scoring gate was cleared.
