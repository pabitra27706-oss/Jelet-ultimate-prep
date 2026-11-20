# 09 stop conditions · when to stop, what to write instead

A stop is a **result**, not a failure. Every stop below produces a written artifact —
a gap record, a held item, a dispute — and leaves the rest of the year solvable.

The governing rule: **accuracy beats completeness.** A year with 60 solved items and
40 honestly held items is a good year. A year with 100 confident answers and no
evidence is a bad year, however good the answers look.

---

## The table

| # | Condition | What to do | Artifact | Who decides |
|---|---|---|---|---|
| S1 | **The booklet cannot be retrieved.** The URL is dead, the file is not the booklet, or the PDF has no usable text layer and no page images can be produced | Stop the year. Do not fall back to the legacy transcription as a source of truth | Source-gap record naming what was tried and what failed | Owner, on whether to supply page images |
| S2 | **A page image is missing or unreadable for an item** | Record the item as `disputed` with `holdReason: "input-unreadable"`. Never infer the geometry | Entry + dispute record | Solver |
| S3 | **Options cannot be read** (text layer has them as images and the image is illegible, or the corpus copy is a transcriber placeholder and the page will not resolve it) | Record `optionFidelity: "unreproduced"`, `holdReason: "options-not-reproduced"`, tier `disputed`. **Never synthesise option text** | Entry + dispute record | Solver |
| S4 | **The corpus and the booklet disagree** | The booklet wins. Record the difference in `reconciliation`; do **not** edit `src/data/papers.json` or the archive in this phase | Reconciliation block | Solver records; owner decides integration |
| S5 | **A question is in the booklet but not in the corpus** (2019 Q78, Q79) | Solve it normally and record it as `missingInCorpus`. The corpus record is created in `editorial/` and the corpus is rebuilt in the future integration phase | Reconciliation + entry | Solver records; owner decides integration |
| S6 | **A printed stem is blank** (no confirmed example among the four years — 2019's blank Q77 proved to be a corpus loss, not a printed blank; confirm on the page before applying this) | Re-read the page. If it is genuinely blank in the booklet, the item is `disputed` with `holdReason: "input-unreadable"`. A blank stem is not a question you may complete from context | Entry + dispute record | Solver |
| S7 | **Two solvers disagree and the page does not settle it** | Tier `disputed`, `holdReason: "ambiguous-input"`. Open a dispute. A solver majority never closes it | Entry + dispute record | A named human re-reads the page |
| S8 | **The two solvers disagree on more than about a third of the items** | Stop the year and re-check the input. The rate is a trigger, not a diagnosis: a wrong input is the likeliest cause, but a systematic solver error or genuinely ambiguous questions produce the same signal. The page decides which | Gap record | Solver |
| S9 | **More than 20% of a section is disputed or held** | Stop that section, complete the rest, and escalate. A section that cannot be read reliably will not become reliable by trying harder, and a key that is mostly holes is not worth publishing | Section gap note in the cross-check record | Owner, on whether to publish a partial key |
| S10 | **The category cannot be determined** (Category-I vs Category-II) | `category: null`, `holdReason: "category-undetermined"`, tier `disputed`. The marking rule changes the answer for multi-correct items, so an unknown category is an unknown answer | Entry | Solver |
| S11 | **A machine check disagrees with the first pass** | `machineCheck.pass: false`. Do not pick the winner by convenience — re-read the page, then re-derive. If it still disagrees, `disputed` | Entry + dispute record | Solver |
| S12 | **The booklet's own marking rule is not stated and cannot be inferred from the section header** | Hold every affected item and record the reason. Never assume Category-I because most of the paper is Category-I | Entry | Solver |
| S13 | **Publication rights for the booklet are unresolved** | Technical verification continues; **reproduction** does not. The record is held from publication and links to the official source instead | Provenance note | Owner; rights are a separate review from verification |
| S14 | **A board key for one of these years is later published** | Stop deriving. The board's key replaces the derived key for that paper, the paper's tier becomes `official`, and the derived work is kept as the audit trail of what we had before | Correction record | Owner |

---

## What "stop" means in practice

**Stop the year** (S1, S8) — the year produces a source-gap record and nothing else.
The rest of the phase is unaffected.

**Stop the section** (S9) — the section's items are recorded as held or disputed, the
reason is written, and the remaining sections are solved.

**Stop the item** (S2, S3, S6, S7, S10, S11) — the item keeps its record, its reason
and its place in the counts. It is excluded from scoring and from the denominator of
every total, and it is reported to the owner as a known gap rather than quietly
dropped.

**Never stop silently.** Every stop produces a line in the cross-check record and a
count in `status`. A year whose gaps are visible is more useful than a year whose
gaps are hidden.

---

## The two stops that are not the solver's to make

- **S14** — a board key appearing changes the tier of a whole paper. Only the owner
  can accept that, because it changes what the paper claims to be.
- **S13** — rights. Technical verification and republication permission are
  different questions, and answering one does not answer the other. The
  [editorial rules](../../../editorial/README.md) already say so; this table says what
  it means operationally: the key file can exist in `editorial/` while the paper
  itself stays unpublished.

---

## The stop that protects the whole phase

If the phase starts producing answers without page images, the whole phase is
invalid. The 2022 precedent's own note is the reason this is written down: a solver
handed garbled text will answer a question the examiner never set. The corpus is
**not** verbatim — this phase has already found items where it is demonstrably not.

Every entry's `sourceImage` points at a captured page image, and every capture is
traceable to a booklet URL and a retrieval date. If that chain cannot be produced for
an item, the item is held.

That is the single most important line in this document.
