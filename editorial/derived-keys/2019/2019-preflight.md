# 2019 · pre-flight record — what the booklet actually contains

**Task:** `09-2019` · **Step:** 09.1 pre-flight ·
**Mode:** RESEARCH (documentation only) · **Date:** 2026-11-20

**Result: pre-flight ran, settled the alternate-set question, and refuted one of the
phase's three headline claims about this year.** It then stopped at step 09.2 for the
same reason as 2017 and 2018: text layer retrievable, page images not. No key entry
may be written. Nothing here is an answer, a tier or a score.

---

## 1 · Retrieval record

| | |
|---|---|
| Source index | https://wbjeeb.nic.in/jelet-old-question-papers/ |
| Booklet URL fetched | `https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2023/11/2023111582-1.pdf` |
| Retrieval date | 2026-11-20 |
| Retrieval method | `fetch_page`; text layer returned as Markdown, whole document (4 chunks, `hasMore: false` at the end) |
| Direct download | **Failed** — `SSL_ERROR_SYSCALL`; no checksum |
| File identity | `JELET-2019`, `Subject : DIPLOMA IN ENGINEERING & TECH.`, footer `JELET_Engg. & Tech. <page> A` |
| Booklet number | **Not printed** in the capture: the cover carries the label `(Booklet Number)` with no number beside it. Leave `bookletNumber: null`; the page image decides |
| Page images | **None produced** — the blocking gap, §8 |

**Coverage.** The capture is **complete for the main set**: Q1–Q100, first to last.
The reader reported no further pages, so unlike 2017 and 2018 nothing is cut off at a
30-page limit.

---

## 2 · Booklet identity and the printed rules

| Field | Value as printed |
|---|---|
| Paper | `JELET-2019`, "Subject : DIPLOMA IN ENGINEERING & TECH." |
| Set | **A**, printed with the page number in every footer (`… 5 A`, `… 8 A`) |
| Time / marks | 2 Hours / Full Marks 100 |
| Questions | 100 numbered items, four options each |
| Board key | **None located** (absence from the archive is not proof the Board never published one); the [JELET archive](https://wbjeeb.nic.in/archive-jelet/) lists key notices for 2023–2026 only |

**The marking rule, as printed (instruction 1):** "Only one option is correct…
In case of incorrect answer or any combination of more than one answer, ¼ marks will
be deducted."

**Every 2019 item is Category-I.** No Category-II rule is printed anywhere in the
booklet.

---

## 3 · Section map (corrected)

| Range | Printed heading | Page (see §4) |
|---|---|---|
| Q1–20 | `MATHEMATICS` | 3 |
| Q21–35 | `ELECTRICAL TECHNOLOGY` | 7 |
| Q36–55 | `COMPUTER APPLICATION` | 9 |
| Q56–70 | `ENVIRONMENTAL ENGINEERING` | 12 |
| Q71–85 | `ENGINEERING MECHANICS` | 14 |
| Q86–100 | `STRENGTH OF MATERIALS` | 19 |

Two corrections to the phase documents: the year package said **Q1–35 Electrical &
Electronics** (there is no Mathematics row at all, and the printed heading is
`ELECTRICAL TECHNOLOGY`, not "Electrical & Electronics"). The same missing-Mathematics
error was found in 2017 and 2018.

---

## 4 · Page map

This is the first of the four years where the page map is **fully anchored**: every
page number in the table below is either printed in the capture or placed between two
printed ones, and the arithmetic is consistent from page 5 to page 22.

| Page | Number in capture | Content | Items |
|---|---|---|---|
| 1–2 | not printed | Cover, booklet-number label, instructions 1–10, `CONFIDENTIAL` | — |
| 3 | not in text layer | `MATHEMATICS` heading | Q1–5 |
| 4 | not in text layer | Mathematics | Q6–10 |
| 5 | `5` | Mathematics | Q11–15 |
| 6 | not in text layer | Mathematics tail | Q16–20 |
| 7 | `7` | `ELECTRICAL TECHNOLOGY` | Q21–27 |
| 8 | `8` | Electrical Technology tail, then `COMPUTER APPLICATION` at Q36 | Q28–35 |
| 9 | `9` | Computer Application | Q36–43 |
| 10 | `10` | Computer Application | Q44–48 |
| 11 | `11` | Computer Application | Q49–55 |
| 12 | `12` | `ENVIRONMENTAL ENGINEERING` | Q56–62 |
| 13 | `13` | Environmental Engineering tail | Q63–70 |
| 14 | not in text layer | `ENGINEERING MECHANICS` heading | Q71–73 |
| 15 | `15` | Engineering Mechanics — two items carry no printed label | Q74–76 |
| 16 | not in text layer | Engineering Mechanics — **the page the corpus is missing** | Q77–79 |
| 17 | `17` | Engineering Mechanics | Q80–83 |
| 18 | `18` | Engineering Mechanics — one item carries no printed label | Q84–85 |
| 19 | `19` | `STRENGTH OF MATERIALS` heading | Q86–88 |
| 20 | `20` | Strength of Materials — one item carries no printed label | Q89–90 |
| 21 | `21` | Strength of Materials | Q91–92 |
| 22 | `22` | Strength of Materials | Q93–96 |
| 23 | not in capture | Strength of Materials | Q97–100 |

**Four items carry no printed question label in the text layer**: the two on page 15
(after Q74), the item on page 18 (before Q85) and the item on page 20 (after Q89).
Their numbers — 75, 76, 84 and 90 — are established by the sequence, not by a printed
label, and the page image must confirm them. This is the runbook's warning made
concrete: a missing label is not a missing question.

---

## 5 · Alternate stream sets — the answer is "none"

The year package asked this to be settled at pre-flight rather than assumed. **Settled:**

- The Engineering & Technology booklet contains **no alternate Q71–100 sections**. After
  Q100 it ends, and the only thing after the questions is `SPACE FOR ROUGH WORK`.
- The other 2019 papers on the Board's index — Agriculture, Printing, B.Sc. and
  Pharmacy — are **separate booklet files**, not sections inside this one. They are
  outside this key by construction, not by choice.

`outOfScopeSets` for 2019 is therefore **empty**, with this note. That differs from
2017, 2018 and 2021, where the alternate sets are printed inside the same booklet.

---

## 6 · Text-layer quirks observed

| Observation | Items | Effect |
|---|---|---|
| Question labels dropped | 75, 76, 84, 90 | Numbering must be confirmed from the page |
| Faulty extraction of instruction 1 | cover | The sentence interleaves two columns ("…having four answer opti correct…"); the marking meaning is still unambiguous |
| Artwork absent | every figure item | Stems say "as shown in the figure" and the drawings are missing |
| Options are the artwork | Q90, Q91 | Both extract as bare `(A) (B) (C) (D)` |
| Duplicated running head | electrical section | `# Electrical Technology` prints twice around the page break — cosmetic |
| Right-justified two-column options | Q28–Q35, Q46–Q70 | `(A) … (B) …` on one line; lettering recoverable |

---

## 7 · Acceptance check for 09.1

> "the year package's recorded section map matches the booklet, or the difference is
> written down. Every alternate set is listed and marked out of scope."

**Not matched — corrected, and the alternate-set question answered:**

| Document | Was | Is now |
|---|---|---|
| [phase 09 README](../../../docs/phases/09-derived-keys/README.md) 2019 row | `*unverified*`; `Electrical & Electronics` | verified row: Q1–20 Mathematics, Q21–35 Electrical Technology, … |
| [years/2019.md](../../../docs/phases/09-derived-keys/years/2019.md) §1, §4 | `Q1–35 Electrical & Electronics` | corrected six-row map; Category-I stated |
| years/2019.md §1 "alternate sets" | "Not recorded… confirm at pre-flight" | **none inside this booklet**; the other 2019 papers are separate files |
| README, years/2019.md §2 | "63 wrong labels" | **43** — counted from `src/data/papers.json`: 63 Computer labels over 98 items, 20 correct |
| **years/2019.md, README "Findings", STOP-CONDITIONS S6** | "Official Q77's printed stem is blank" | **False.** The booklet prints a numbered **Q77 with a full stem and four options**. The blank stem is a *corpus* defect, not a printing defect (§9) |

---

## 8 · Stop condition: 09.2 cannot start

Unchanged from 2017 and 2018 — no page image can be produced in this sandbox, and the
runbook allows no entry without one. **09.4–09.9 not started; no `2019-keys.json`, no
tiers, no answers.** Nothing under `src/`, `scripts/`, `tests/`, `public/`,
`src/data/` or `archive/` changed.

---

## 9 · Corpus pre-check — all 100 items compared at stem level

**Not** 09.3, and no `matched / missingInCorpus / extraInCorpus` arithmetic is claimed.

| Check | Result |
|---|---|
| Corpus question numbers | 98 of 100; **Q78 and Q79 absent** |
| Printed in the booklet? | **Yes** — Q78 (a projectile's `t₁`, `t₂` relation for height `h`) and Q79 (time to reach maximum height `H`) both print with four options |
| Q77 | Corpus record is **empty**: no stem, no options. The booklet prints it as a numbered figure item about a rectangular block toppling before it slips, with four μ-relations |
| Subject-label conflicts | **43** (63 Computer labels over 98 items, 20 correct) |
| Figure flags | 75, 76, 84, 90, 91, 94 — six |
| Incomplete options | 77, 90, 91, 94 — four |

**The gap is page-shaped.** The corpus's three defects are exactly the three questions
printed on **page 16** (Q77, Q78, Q79): one placeholder record where the first should
be, and nothing at all where the other two should be. That is consistent with one
printed page being lost in the legacy transcription. The cause is unproven, but the
shape of the gap is recorded because it predicts what a rebuild must restore: one page,
three questions, all readable in the capture.

**Option and stem differences found in the same pass.**

| Item | Booklet prints | Corpus holds |
|---|---|---|
| **Q13** | (B) `tan x`, options (A) cos, (B) tan, (C) sec, (D) sin | (B) `sin x`, (D) `csc x` — an unprinted option replaces a printed one, and the order changed |
| **Q41** | "The equivalent binary number of **(0.6975)₁₀**" | "**(0.875₁₀)**" — substituted stem, same options. The 2017/2018 pattern again |
| **Q47** | C code `a=-3 - -3; b=-3 -- (-3);` | `b = -3 - -(-3)` — the code itself was rewritten, which changes what the question asks |
| **Q49** | (C) `ptr = *j`, (D) `&ptr = &*j` | (C) `ptr = j`, (D) `&ptr = &j` — two options altered |
| **Q73** | (A) sin, (B) `cosθ`, (C) `/(2tanθ)`, (D) `/(2cosθ)` | (B) `/(2tanθ)`, (C) and (D) **both** `/(2cosθ)` — one printed option missing, another duplicated |
| **Q87** | (A) 1:2, (B) **2:3**, (C) 5:8, (D) 7:12 | 1:2, 5:8, 7:12, **3:4** — a printed option dropped and an unprinted one invented |
| **Q94** | Four printed formula options: `M`, `√M`, `M^{3/2}`, `M^{5/2}` | **No options**, and flagged as a figure item. The options are text, not drawings — the corpus lost them, and the figure flag is unsupported |
| **Q55, Q70, Q85** | Section heading printed below the last option | Option D swallows it: `"80 ENVIRONMENTAL ENGINEERING (Q56–…"`, `"Decibel ENGINEERING MECHANICS (Q71…"`, `"constant STRENGTH OF MATERIALS"` |
| **Q100** | (D) `16/15` | (D) `16/15` followed by a stray Markdown code fence (three backticks) |

**The "91 ceiling" trap, resolved in principle.** 91 was 98 − 6 figure items − the one
blank record. If the capture is right, Q78 and Q79 are complete and figure-free, and
Q94's four options are printed formulas, so the arithmetic moves to 94. **That is not a
coverage claim**: option completeness and figure dependence are page judgements, and
the number must be recomputed over 100 items from the images.

---

## 10 · What is needed to continue

One image per printed page of the Set A booklet, **page 16 mandatory** — it is the
evidence for the Q77–Q79 finding and the item the corpus cannot supply. Same two
fallbacks as 2017 and 2018 apply, and this year strengthens the case for images: the
corpus is missing an entire page, so a text-only session would start three questions
short and inherit every option corruption listed above.

---

## 11 · Checks run for this record

| Check | Command | Result |
|---|---|---|
| Booklet retrievable, whole document | `fetch_page`, 4 chunks, final `hasMore: false` | **pass** — Q1–Q100, no truncation |
| Direct download | `curl -I` | **fail** — `SSL_ERROR_SYSCALL` |
| Section map and alternate-set question | read every printed heading in the capture | **pass** — map corrected, no alternate sets inside the booklet |
| Page map arithmetic | page numbers 5, 7–13, 15, 17–22 cross-checked against the question blocks | **pass** — consistent end to end |
| All 100 items compared against the corpus | printed both sides, read them | **9 difference groups** recorded in §9 |
| Corpus counts quoted here | `python3` over `src/data/papers.json` | **pass** — 98 records, Q78/Q79 missing, 63 Computer labels, 43 wrong |
| Near-duplicate check against 2018 (the legacy file is headed "JELET-2018") | `difflib` over both corpus years, ratio ≥ 0.75 | **no transposition found** — two low-similarity pairs (Q31/Q52, Q7/Q12) are different questions; the wrong-year heading did not import 2018 questions |
| Markdown links | local resolver | **pass** |
| Key-file schema | not run | **not applicable** |

Not run, and not claimed: any solving, any cross-check, any machine check on an
answer, any render of a booklet page, any device check.
