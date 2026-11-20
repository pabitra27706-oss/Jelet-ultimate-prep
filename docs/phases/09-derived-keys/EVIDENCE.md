# 09 evidence and handoff record

Use [`docs/templates/phase-record.md`](../../templates/phase-record.md) for the record
of each solving session. This file holds the phase-level record and the standing
record of what has and has not been done.

---

## Phase record — 09 · design

- **Phase:** 09-derived-keys
- **Status:** designed; no solving session has run
- **Date:** 2026-11-19
- **Branch / commit:** `arena/2776b27f-jelet-ultimate-prep`, from `e2d6f09`
- **Owner / reviewer:** owner · to be named on the first solving session

### Inputs and pre-change evidence

Reused, unchanged and not forked:

| Reference | Reuse | Licence / status |
|---|---|---|
| `archive/jelet-prep/data/docs/derived-keys/2022-keys.json` | The 2022 derived key — the schema's precedent | Immutable archive, checksum-locked |
| `archive/jelet-prep/data/docs/derived-keys/SOLVER-PROMPT.md` | Prompts A, B and C — the solving, attack and cross-check protocol | Immutable archive |
| `archive/jelet-prep/data/docs/derived-keys/2022-crosscheck.md` | The cross-check narrative format | Immutable archive |
| `archive/jelet-prep/data/docs/decisions/ADR-0003-derived-answer-keys.md` | The tier model this phase implements | `PROPOSED` — owner decision still open |
| `archive/jelet-prep/data/docs/decisions/ADR-0002-figure-reconstruction.md` | The rule that a redraw never unblocks scoring | In force |
| `editorial/README.md` | The five collection rules | In force |
| `docs/phases/08-optional/` | The phase layout used here (README + RUNBOOK + records) | In force |

Rejected as a source: `archive/jelet-prep/data/pyq-md/{2017,2018,2019,2021}.md` —
evidence only. The section headings stop at Q55, the 2019 file is headed "JELET-2018",
and the corpus it feeds contains demonstrably fabricated option text (2017 Q83).

### Approved scope, delivered outputs, deliberate exclusions

**Delivered:** a documentation-only phase design — [README](README.md),
[RUNBOOK](RUNBOOK.md), [SCHEMA](SCHEMA.md), [STOP-CONDITIONS](STOP-CONDITIONS.md),
[OWNER-PRACTICE-LOOP](OWNER-PRACTICE-LOOP.md), and four self-contained year
packages in [years/](years/).

**Deliberately excluded:**

- Any change under `src/`, `scripts/`, `tests/`, `public/` or `src/data/`.
- Any change under `archive/`.
- Any derived key. No key exists for 2017, 2018, 2019 or 2021 yet.
- Any scoring, integration, pack inclusion or UI change.
- Any analytics, account, telemetry or feedback mechanism.

### Findings that shaped the design

| Finding | Effect on the phase |
|---|---|
| WBJEEB publishes key notices for JELET 2023–2026 and **none** for 2017, 2018, 2019 or 2021 | All four years are derived-key work; `official` is unavailable as an item tier |
| The corpus labels Q36–100 of every target year as Computer; the official booklets divide those ranges among five subjects and print extra stream-specific sets | A mandatory reconciliation step, and a hard rule that the corpus subject must not drive filtering |
| Text-layer labels are dropped for eight 2021 items (Q74, Q75, Q77, Q81, Q84, Q87, Q93, Q94) and four 2019 items (Q75, Q76, Q84, Q90) | Numbering must come from the page images |
| 2019 Q78–79 are absent from the corpus and the corpus's Q77 record is empty — **all three are printed on page 16** (the blank-stem claim was refuted at pre-flight) | Stop condition S5; a page-shaped corpus gap; the highest-risk year package |
| The corpus's 2017 Q83 option text is a transcriber's placeholder, not the booklet's four distinct exponents | Stop condition S3; the strongest argument for reading page images only |
| `scripts/build-content.mjs` maps a derived `disputed` tier into the voided path, where a presentable item becomes `boardAwarded` | Integration Gate A: no target-year key may be integrated until this is fixed |
| The application holds one paper and one key per year; the booklets print several Q71–100 sets | Integration Gate B: the solved set must be named in the paper's metadata |
| The 2022 generator lets 13 provisional answers score, which ADR-0003 forbids | ADR-0003 stays `PROPOSED`; the phase does not resolve it by copying either behaviour |
| The 2026 syllabus has four subjects and no Computer, Environmental, Mechanics or Strength subject | Keying these years does not close the modern-syllabus coverage gap; no such claim is made |

### Gates

Not applicable to a documentation-only phase. The gates that a *solving* session must
clear are listed per year in [years/](years/) §10 and enforced by the
[runbook](RUNBOOK.md).

### Blockers, unresolved risks, next action

| Item | Status |
|---|---|
| ADR-0003 remains `PROPOSED` | **Owner decision required.** The phase produces keys that *can* enforce the rule; it does not decide whether they do |
| The `disputed → voided → boardAwarded` loader defect | **Owner decision + application work.** Not fixed here. It blocks integration of every target-year key |
| One paper and one key per year | **Owner decision** if the alternate stream sets are ever wanted |
| Publication rights for the four booklets | **Open**, and separate from technical verification. The [content standard](../../CONTENT.md) governs |
| Page images for the booklets | **Still not captured (2026-11-20).** All four booklets' text layers are retrievable and all four section maps are established, but the sandbox cannot render a page image; without one no entry may be written |

**Next action:** all four pre-flights are done, so the next move is the owner's. Supply
page images for any one booklet — 2017 `80116361`, 2018 `Engg & Tech/JT3`, 2019 Set A
(page 16 first) or 2021 `1091007537` (Q74–Q94 first) — and step 09.2 resumes from that
year's pre-flight record. Alternatively record an explicit decision that a named
text-layer-only subset may be solved as `derived-provisional`.
If images cannot be produced for any of the four booklets, the alternative is an
explicit owner decision on a text-layer-only subset — a decision the runbook does not
take on its own. Until then no year package can produce a key.

---

## Session records

One record per solving session, appended below. Use the phase-record template.

### 09-2017 · pre-flight only, 2026-11-20 — solving blocked

- **Phase:** 09-derived-keys · **Task:** `09-2017` · **Step reached:** 09.1 (complete)
- **Mode:** RESEARCH · **Date:** 2026-11-20
- **Branch:** `arena/f4180f76-jelet-ultimate-prep`, from `b546c8b`
- **Owner / reviewer:** owner · solver not yet named, because no solving pass ran
- **Artifact:** [editorial/derived-keys/2017/2017-preflight.md](../../../editorial/derived-keys/2017/2017-preflight.md)

**Inputs used.** The board's booklet `2023111594.pdf` (booklet 80116361,
`JELET-2017/DIP. ENGG.&TECH.`), retrieved 2026-11-20 through `fetch_page`. Read-only
comparison against `src/data/papers.json`. The archive, the corpus and the
application were not modified.

**What was delivered.** A retrieval record; the booklet's identity and printed
marking rule; the corrected six-row section map with printed page starts; a 30-slot
page map; both alternate stream sets listed and marked out of scope; an inventory of
text-layer defects; a 14-item structural spot-check against the corpus; and the
documentation corrections listed below.

**Findings that changed the documentation.**

| Finding | Effect |
|---|---|
| The booklet's Q1–20 is **Mathematics**; Electrical Technology begins at Q21 | The phase README, the 2017 year package and the schema example all claimed Q1–35 Electrical. All three corrected; the other three years' rows are now marked *unverified* |
| The paper prints one marking rule and no Category-II rule | The 2017 package's Category-II expectation removed; every item is Category-I |
| 45 subject-label conflicts, not 64 (2019: 43) | Corrected in the README and the 2017 package |
| Corpus Q18 carries a different distribution stem under the booklet's options; Q73 option B and Q63's symbol differ | Recorded as candidate reconciliation differences for 09.3; the page decides |
| Corpus Q83 is a transcriber placeholder; the booklet prints four distinct exponents | Confirmed |
| Ten stems name a figure; Q97 and Q100 have diagram options | Confirmed; both are held candidates |

**Checks.**

| Check | Result |
|---|---|
| Booklet retrievable by the documented route | pass (text layer, 4 chunks, pages 1–30) |
| Direct PDF download | **fail** — `SSL_ERROR_SYSCALL`; no checksum obtainable |
| Section map against printed headings | pass — corrected |
| Corpus label and figure counts | pass (Python count over `papers.json`) |
| Markdown links in touched files | pass (local resolver) |
| Key-file schema validation | **not applicable** — no key file exists |
| Page capture, solving, attack, cross-check, machine checks, tiers | **not run** |

**Stop and blocker.** [RUNBOOK 09.2](RUNBOOK.md) needs one
image per printed page. The sandbox cannot render the booklet, so under
[S1](STOP-CONDITIONS.md) the year stops there and **no key
entry may be written**. Two items of information would unblock it, in order of
preference: the owner supplies 30 legible page images; or the owner decides, on the
record, that a named text-layer-only subset may be solved as `derived-provisional`.

**Scope.** Only documentation and the pre-flight record changed. No file under `src/`,
`scripts/`, `tests/`, `public/`, `src/data/` or `archive/` was touched, and no PDF,
page image or personal data entered Git.

### 09-2018 · pre-flight only, 2026-11-20 — solving blocked

- **Phase:** 09-derived-keys · **Task:** `09-2018` · **Step reached:** 09.1 (complete)
- **Mode:** RESEARCH · **Date:** 2026-11-20
- **Branch:** `arena/f4180f76-jelet-ultimate-prep`
- **Owner / reviewer:** owner · solver not yet named, because no solving pass ran
- **Artifact:** [editorial/derived-keys/2018/2018-preflight.md](../../../editorial/derived-keys/2018/2018-preflight.md)

**Inputs used.** The board's booklet `2023111538-1.pdf` (`Engg & Tech/JT3`),
retrieved 2026-11-20 through `fetch_page`, plus a read-only comparison against
`src/data/papers.json`. Nothing under `archive/` or the application was modified.

**What was delivered.** Retrieval record; booklet identity and printed marking rule;
the corrected six-row section map with page starts; a 31-slot page map anchored on the
five page numbers that survive extraction; both alternate stream sets listed and out
of scope; the text-layer defect inventory; and a **stem-level comparison of all 100
items** against the corpus.

**Findings that changed the documentation.**

| Finding | Effect |
|---|---|
| Q1–20 is **Mathematics**; Electrical Technology starts at Q21 | Phase README and the year package corrected; the package's `Q1–35` row removed |
| The paper prints one marking rule and no Category-II rule | Category-II expectations removed; every item is Category-I |
| 45 subject-label conflicts, not 64 | Corrected in the package |
| **Q2, Q13 and Q19 keep the booklet's options but carry a different stem** — the 2017 Q18 defect repeats three times | Recorded as known defects with the instruction to solve from the page |
| The corpus's Q2 matrix is internally impossible — its determinant vanishes only at x = 10, not among the options | Machine-checked and recorded; independent proof the stem does not belong to those options |
| Q55, Q70 and Q85 option D absorb the next printed section heading | Recorded as transcription defects |
| Q74, Q79 and Q85 carry no textual figure pointer, though the corpus flags them | Figure status deferred to the page image |
| The booklet prints no booklet number anywhere in the capture | `bookletNumber` stays `null`, with the reason recorded |

**Checks.** Booklet retrieval **pass**; direct download **fail** (`SSL_ERROR_SYSCALL`);
section map **pass after correction**; 100-item stem comparison **pass**; the Q2
determinant check **pass**; corpus label count **pass**; markdown links **pass**;
key-file schema **not applicable**; page capture, solving, attack, cross-check, machine
checks on answers and tiers **not run**.

**Stop and blocker.** As 2017: no page image can be produced, so 09.2 cannot start and
no entry may be written. The 2018 pre-flight makes the case sharper — three
Mathematics stems in the corpus belong to different questions, so a text-only session
would be at its least safe exactly where the corpus looks most complete.

### 09-2019 · pre-flight only, 2026-11-20 — solving blocked

- **Phase:** 09-derived-keys · **Task:** `09-2019` · **Step reached:** 09.1 (complete)
- **Mode:** RESEARCH · **Date:** 2026-11-20
- **Artifact:** [editorial/derived-keys/2019/2019-preflight.md](../../../editorial/derived-keys/2019/2019-preflight.md)

**Delivered.** Retrieval record; booklet identity (Set A, booklet number not printed);
printed marking rule; corrected six-row section map; a **fully anchored page map**; the
alternate-set question answered; the label-drop inventory; and a stem-level comparison
of all 100 printed items against the corpus's 98 records.

**Findings.**

| Finding | Effect |
|---|---|
| **Q77 is printed in full** — numbered, with a stem about a block toppling on an inclined plane and four μ-relations | The phase's "blank printed stem" claim is **refuted**; the blank record is a corpus loss. README, year package, runbook and S6 corrected |
| Q78 and Q79 are printed and complete | Confirmed as `missingInCorpus` cases |
| **Q77, Q78, Q79 all sit on printed page 16** | The corpus's gap is page-shaped: one page lost, three questions |
| **No alternate Q71–100 sets inside this booklet**; the other 2019 papers are separate files | `outOfScopeSets` is empty for 2019 |
| Corpus keeps options but swaps stems at **Q41**; corrupts options at **Q13, Q49, Q73, Q87**; rewrites the C program at **Q47**; loses Q94's text options | Five new known defects in the year package |
| 43 subject-label conflicts, not 63 | Corrected |
| No 2018 question transposed in by the mislabelled legacy file | Checked with a stem-similarity pass against the 2018 corpus, ratio ≥ 0.75 — two low-similarity pairs, both different questions |

**Checks.** Whole-booklet retrieval **pass** (no truncation); direct download **fail**;
section map and alternate sets **pass**; page arithmetic **pass**; 100-item comparison
**pass**; corpus counts **pass**; transposition check **pass**; links **pass**; schema
**not applicable**; solving, cross-check, machine checks, tiers **not run**.

### 09-2021 · pre-flight only, 2026-11-20 — solving blocked

- **Phase:** 09-derived-keys · **Task:** `09-2021` · **Step reached:** 09.1 (complete)
- **Mode:** RESEARCH · **Date:** 2026-11-20
- **Artifact:** [editorial/derived-keys/2021/2021-preflight.md](../../../editorial/derived-keys/2021/2021-preflight.md)

**Delivered.** Retrieval record; booklet identity (booklet number **1091007537**
confirmed); printed marking rule; corrected six-row section map; a provisional page map
with three anchors; both alternate sets confirmed; the label-drop inventory; and a
stem-level comparison of all 100 items against the corpus.

**Findings.**

| Finding | Effect |
|---|---|
| The text layer drops labels from **eight** items (Q74, Q75, Q77, Q81, Q84, Q87, Q93, Q94); **Q76 is labelled** | Runbook and year package corrected |
| Page numbers 8, 10 and 18 survive, but the capture's page breaks are **one short** between 10 and 18 | Page map is provisional; a page image is required — the only year where the map does not close |
| Corrupted options at **Q16, Q72, Q73, Q74**; reordered determinant at **Q3**; ambiguous `∼` glyph at **Q77** | New known defects for the year package |
| **Five figure flags (Q74, Q75, Q77, Q81, Q84) have no textual pointer** | Figure dependence must be confirmed from the page |
| Both alternate sets are printed inside the booklet | Confirmed, out of scope |
| 45 subject-label conflicts, not 64 | Corrected |

**Checks.** Whole-booklet retrieval **pass**; direct download **fail**; section map
**pass after correction**; page map **fail, recorded** (arithmetic short by one page);
100-item comparison **pass**; corpus counts **pass**; links **pass**; schema **not
applicable**; solving, cross-check, machine checks, tiers **not run**.

### 09-2017 · _solving not run_

### 09-2018 · _solving not run_

### 09-2019 · _solving not run_

### 09-2021 · _solving not run_
