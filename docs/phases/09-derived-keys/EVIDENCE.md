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

---

## External review round — 2026-11-20

An independent reviewer was pointed at this phase with a prompt forbidding any file change,
any git write and any re-fetch or re-render of a question paper, and was asked to verify
every claim. Its report is reproduced in the conversation, not in this repository.

**One thing to know before reading its verdicts:** it ran against a *different checkout*
(`arena/a05b85e3-…` at `b546c8b`, the branch point) and therefore never saw the four
pre-flight records, which landed in `82aee49`, `78a8ac5` and `a225b56` on
`arena/f4180f76-…`. Every finding of the form "the requested pre-flight records are
absent", "the section map says Q1–35 Electrical" and "the counts say 64 wrong labels" is
that mismatch, not a defect: those were corrected in this branch before the review ran.
The reviewer said so itself, and explicitly declined to certify the review as complete.

**Accepted and fixed** — each one was real, and each is now corrected in the files:

| Finding | Where it was | What was wrong | Fix |
|---|---|---|---|
| Q72 stem "truncated" | `years/2018.md` §2, §4, prompt; `2018-preflight.md` §"other defects" | The corpus stem is **complete**. My own 2018 record asserted a truncation that was never there, and repeated the year package's "options match exactly" without comparing | Withdrawn in both files, with the date and the reason |
| Worked example Q72 | `SCHEMA.md` §2 | Answer A from reactions of 200/100 N — the pole's own 100 N was ignored; the "verification" equation `300x + 100 = 200·2` gives 1 m, not the 0·6667 it printed; "0·456 from the man is 0·544 from the boy" on a 2 m pole; `machineCheck.pass: true` on a false expected value | Re-solved: boy 400/3 N, man 800/3 N, moments about the boy's end give **x = 5/9 = 0·5556 m → C**, cross-checked against the pole length; expected and observed now agree |
| `officialText` "verbatim" | `SCHEMA.md` §2 | An ellipsized string was labelled verbatim | Full printed stem written out |
| Eligibility vs approval | `SCHEMA.md` §2, §7 | Example was `eligible` while `ownerApprovedForScoring` is `false`; the Status summary showed 79 eligible from 78 verified and 21 holds against 22 ineligible items | Example now `held` + `no-approved-tier`; Status block rewritten with the four invariants stated and satisfied |
| `documentRef: null` "is the proof that no board key exists" | `SCHEMA.md` §2 field rules | A locally assigned null proves nothing about the Board | Reworded: it records absence of a located reference, and may never be cited as proof |
| Reconciliation identity | `SCHEMA.md` §5, `RUNBOOK.md` 09.3 | `matched + missing + extra = booklet count` cannot balance, since extras are not booklet items; the 2019 example gave 94+1+0 = 95 ≠ 100 and 94 ≠ 98 corpus records | Two equations, one per set; example rebuilt from 2019's real defects (Q41 stem, Q77 empty record, Q73/Q87 options) with 98+2 = 100 and 98+0 = 98 |
| Dispute example | `SCHEMA.md` §4 | `D-2019-077` was raised on "the printed stem is blank", a claim this phase itself refuted | Replaced with a real held item (Q90, options printed as drawings) and the correction noted in place |
| Report count | `SCHEMA.md` §6 | `observationCount: 2` above an array of one observation | Corrected to 1 |
| "not physics" | `RUNBOOK.md` 09.6, `STOP-CONDITIONS.md` S8 | A >⅓ disagreement rate was treated as proof of a bad input | Reworded as a trigger to investigate, with the four candidate causes |
| "board published no key" | Phase README, four year packages, four pre-flights | Absence from the archive is not proof of non-publication | "None located", with the limit of the evidence stated |
| "will produce the most held items" | `years/2021.md` | A prediction stated as a property | Softened to "probably", with the count following from the pages |
| Category-II | `SCHEMA.md` §2 | A two-mark rule was carried in the marking string while 100 questions × 1 mark = Full Marks 100 | Marking rule corrected to the single printed rule; `"II"` kept but marked unreachable for these years |

**Rejected, with reasons.** Findings that the booklet prints Q78/Q79, that Q77 prints in
full, that 2021's alternate sets sit inside the booklet, that 2019's booklet number is
unprinted, and that the section maps are Mathematics-first were all marked
`UNVERIFIABLE-NEEDS-PAGE-IMAGE` by the reviewer because it had no booklet access. They are
not unverified here: each is recorded against a specific printed page in the year's
pre-flight record, including the page number and the printed heading. A reviewer without
the source cannot downgrade a claim that the source settles — but it also flagged, correctly,
that **my 2018 record contained one claim that did not survive exactly that test**, which is
why that one is withdrawn above.

**Not changed, and why.** The 2022 precedent figures (87 scoreable, 13 provisional), the
ADR-0003 status and the `build-content.mjs` behaviour the reviewer confirmed were already
accurate. No key entry, tier or answer was created or altered by this round: the phase is
still stopped at 09.2.

---

## Owner decision — 2026-11-20 · the authorised text-layer slice

| | |
|---|---|
| **Decision** | A text-layer-only subset may be solved as `derived-provisional`, for **all four years** |
| **Granted by** | Owner, in session, 2026-11-20 |
| **Why it was needed** | No page image can be produced in this sandbox: the Board's CDN refuses a direct download (`SSL_ERROR_SYSCALL`) and `fetch_page` returns text only. Every year had stopped at step 09.2 |
| **Scope** | Items that are complete text in the corpus, figure-free by the corpus flag, and free of the documented defects. Computed by `scripts/derived-key-subset.mjs`, not chosen item by item |
| **What it does not lift** | No entry may be `derived-verified`; nothing may be scored (`ownerApprovedForScoring` stays `false`, `eligibleCount` stays 0); every excluded item keeps a specific reason |
| **Schema change it required** | Amendment 1.1.0 in [SCHEMA.md](SCHEMA.md): tier `unsolved`, fidelity `corpus-text-unverified`, figure `unverified`, and four new hold reasons |

## Session record — 09-2017 batch 1 · 2026-11-20

- **Phase:** 09-derived-keys · **Task:** `09-2017` · **Step:** 09.4 partial (authorised provisional pass)
- **Mode:** RESEARCH · **Date:** 2026-11-20
- **Artifacts:** [`2017-keys.json`](../../../editorial/derived-keys/2017/2017-keys.json),
  [`2017-slice-record.md`](../../../editorial/derived-keys/2017/2017-slice-record.md),
  [`checks/math-q01-20.py`](../../../editorial/derived-keys/2017/checks/math-q01-20.py)

**Delivered.** 100 entries for 2017, of which 17 are solved (`derived-provisional`), 11 of
those machine-checked by a re-runnable script, 2 held for transcription doubt, and 81
`unsolved` with a named reason each. Plus the machinery the phase lacked:

| Artifact | What it does |
|---|---|
| `scripts/derived-key-subset.mjs` | Turns "the authorised slice" into a pure function of the corpus plus the documented defect lists — 85/84/80/80 items for 2017/2018/2019/2021 |
| `scripts/validate-keys.mjs` | Enforces the schema in code: enums, tier↔answer and fidelity↔evidence couplings, both reconciliation equations, and every `Status` invariant |
| `tests/derived-keys.test.mjs` | 11 tests, including seven seeded violations that must be rejected — each one a defect the external review found in the documentation |
| `checks/math-q01-20.py` | 11 numeric verifications, each reproducing the exact value the key file claims |

**Findings.** Two items passed the slice filter and still could not be answered: **Q2**
(no transcribed option is correct for general n) and **Q17** (the series is malformed and
the correct option is absent) — both recorded as `corpus-defect`, not guessed. This is the
first evidence that the mechanical filter is necessary but not sufficient, and it is now
part of the record rather than a surprise.

**Checks.** `node scripts/validate-keys.mjs` **PASS** (0 errors, 0 warnings);
`npm run test:keys` **PASS** 11/11; `npm run keys:subset` **PASS** (deterministic);
checks script **PASS** 11/11; `npm run test:rules` **PASS** (no `src/` change); link
resolver and fence balance **PASS**.

**Also corrected in this session.** The phase README's status block and section-map table
still said "pre-flight has run for 2017 and 2018, and only those two" and marked 2019 and
2021 `*unverified*`, although both had been pre-flighted. That was an overstatement in the
previous session's report, not in the work: the pre-flight records existed, the summary was
stale. Fixed here, with the correction noted in the file itself.

### 09-slice · authorised text-layer slice, 2026-11-20 — delivered for all four years

- **Phase:** 09-derived-keys · **Steps:** 09.2 substitute, 09.3 substitute, 09.4 · **Outcome:** complete for the authorised scope
- **Authorisation:** owner, 2026-11-20 — text layer only, `derived-provisional` only, all four years
- **Deliverables:** `editorial/derived-keys/<year>/<year>-keys.json`, `<year>/checks/*.py`, `<year>/<year>-slice-record.md` (generated)
- **Machinery:** `scripts/derived-key-subset.mjs` (slice is code, booklet-bounded), `scripts/validate-keys.mjs`,
  `scripts/render-slice-record.py`, `tests/derived-keys.test.mjs` (14 tests, every year on disk)

| Year | Solved | Machine-checked | Unsolved | Unsolved reasons |
|---|---:|---:|---:|---|
| 2017 | 83 | 23 | 17 | 8 figure not reproduced, 6 options not reproduced, 3 corpus defect |
| 2018 | 83 | 19 | 17 | 9 figure not reproduced, 4 corpus defect, 4 options not reproduced |
| 2019 | 79 | 19 | 21 | 10 corpus defect, 6 options not reproduced, 3 figure not reproduced, 2 absent from corpus |
| 2021 | 76 | 25 | 24 | 14 figure not reproduced, 5 options not reproduced, 3 corpus defect, 2 ambiguous input |

**What is proven.** Every count above is recomputed from the entries by the validator, and the
test suite fails if a key file and the slice definition disagree item by item. 86
answers are re-derived by a committed script whose command is recorded on the entry.

**What is not proven.** No page was seen for any year. `sourceImage` is null throughout,
no entry is `derived-verified`, `eligibleCount` is 0, and scoring remains blocked.

**Corrections made while working, recorded rather than hidden:**
- the slice loop was bounded by `paper.questionCount`, which for 2019 is 98, so Q99 and Q100 had
  silently fallen outside the slice; it is bounded by the booklet count now.
- three first-draft checks were wrong (2019 Q2, Q20, Q100) and the checks caught them; the
  Q100 error would have turned the right answer 16/15 into 4/3.
- ten items are held *inside* the slice rather than forced onto the nearest option
  (2017 Q2/Q17, 2018 Q31, 2019 Q19/Q81/Q92, 2021 Q2/Q21/Q78/Q80); each carries the
  arithmetic or the missing input in its `note`.
