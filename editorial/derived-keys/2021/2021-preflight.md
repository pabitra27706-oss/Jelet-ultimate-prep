# 2021 · pre-flight record — what the booklet actually contains

**Task:** `09-2021` · **Step:** 09.1 pre-flight ·
**Mode:** RESEARCH (documentation only) · **Date:** 2026-11-20

**Result: pre-flight ran, confirmed both alternate sets, corrected the section map and
a phase-wide claim about lost question labels — and stopped at 09.2 on the same
page-image gap as the other three years.** No key entry may be written. Nothing here
is an answer, a tier or a score.

---

## 1 · Retrieval record

| | |
|---|---|
| Source index | https://wbjeeb.nic.in/jelet-old-question-papers/ |
| Booklet URL fetched | `https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2023/11/2023111536-1.pdf` |
| Retrieval date | 2026-11-20 |
| Retrieval method | `fetch_page`; text layer returned as Markdown, whole document (5 chunks, final `hasMore: false`) |
| Direct download | **Failed** — `SSL_ERROR_SYSCALL`; no checksum |
| File identity | `JELET-2021`, `For Diploma in Engg. & Tech. Candidates`, booklet number **1091007537**, footer `E & T <page> A` |
| Booklet number | **1091007537** — printed on the cover, matching the year package |
| Page images | **None produced** — the blocking gap, §8 |

**Coverage.** Complete: Q1–Q100 of the main set, then both alternate Q71–100 sets, then
`SPACE FOR ROUGH WORK`. Nothing is cut off by the reader's page limit.

---

## 2 · Booklet identity and the printed rules

| Field | Value as printed |
|---|---|
| Paper | `JELET-2021`, "For Diploma in Engg. & Tech. Candidates" |
| Set | **A** appears with the page number in the footers (`E & T 8 A`) |
| Time / marks | 2 Hours / Full Marks 100 |
| Questions | 100 numbered items, four options each |
| Board key | None exists; key notices on the [JELET archive](https://wbjeeb.nic.in/archive-jelet/) are only for 2023–2026 |

**The marking rule, as printed (instruction 1):** "Only one option is correct…
In case of incorrect answer or any combination of more than one answer, ¼ marks will
be deducted."

**Every 2021 item is Category-I.** No Category-II rule is printed.

---

## 3 · Section map (corrected)

| Range | Printed heading | Page |
|---|---|---|
| Q1–20 | `Question 1 to 70 for all candidates Mathematics` | 3 |
| Q21–35 | `Electrical Technology` | 6 |
| Q36–55 | `Computer Application` | 8 |
| Q56–70 | `Environmental Engineering` | 11 |
| Q71–85 | `Question 71 to 100 for all candidates except Printing Technology and Agricultural Engineering Candidates Engineering Mechanics` | 13 |
| Q86–100 | `Strength of Materials` | 17 |

Page cells for this year are **provisional** — see §4.

The year package's `Q1–35 Electrical Technology` row is wrong for the fourth time: Q1–20
is Mathematics. The Mathematics heading also carries the direction line
"(Question 1 to 70 for all candidates)", which is the only place the booklet tells a
candidate that Q1–Q70 is common.

---

## 4 · Page map — anchored at three points only

| Page | Number in capture | Block | Items |
|---|---|---|---|
| 1 | not printed | Cover, booklet number 1091007537, instructions 1–10 | — |
| 2 | not printed | `SPACE FOR ROUGH WORK` | — |
| 3 | not in text layer | Mathematics heading, direction line | Q1–6 |
| 4 | not in text layer | Mathematics | Q7–13 |
| 5 | not in text layer | Mathematics | Q14–20 |
| 6 | not in text layer | Q20 tail, then `Electrical Technology` | Q21–25 |
| 7 | not in text layer | Electrical Technology | Q26–32 |
| 8 | **`8`** | Electrical tail, `Computer Application` at Q36 | Q33–36 |
| 9 | not in text layer | Computer Application | Q37–45 |
| 10 | **`10`** | Computer Application | Q46–51 |
| 11 | not in text layer | Q52–55, then `Environmental Engineering` | Q52–61 |
| 12 | not in text layer | Environmental Engineering tail | Q62–70 |
| 13 | not in text layer | Mechanics direction + heading | Q71–73 |
| 14 | not in text layer | Engineering Mechanics | Q74–76 |
| 15 | not in text layer | Engineering Mechanics | Q77–80 |
| 16 | not in text layer | Engineering Mechanics | Q81–83 |
| 17 | not in text layer | Mechanics tail, then `Strength of Materials` | Q84–86 |
| 18 | **`18`** | Strength of Materials | Q87–92 *or* Q93–94 — see below |
| 19 | not in text layer | Strength of Materials | the other of the two |
| 20 | not in text layer | Strength of Materials | Q95–100 |
| 21+ | not in text layer | Printing `Basic Engineering`, then Agricultural sections | P71–P100, A71–A100 |

**The one real defect in this map.** Three page numbers survive — 8, 10 and 18 — but the
capture's page breaks are one short between page 10 and page 18. Counting breaks from
page 10 gives nine page-steps to the block that prints `18`, not eight. So exactly one
page break is missing from the text layer, and the map from page 11 onward shifts by one
depending on where it belongs. **The page image is the only way to settle it.** This is
why the table above calls pages 11–20 provisional: unlike 2019, whose arithmetic closed
exactly, 2021's does not.

**Eight items carry no printed question label in the text layer**: the two after page 13
(Q74, Q75), the item after Q76 (Q77), the item after Q80 (Q81), the item after Q83
(Q84), the item after Q86 (Q87), and the two after Q92 (Q93, Q94). Their numbers come
from the sequence, not from a label.

> **Correction to a phase-wide claim.** The runbook says the 2021 text layer "omits
> visible question labels around Q74, Q76 and Q81". Observed: **Q76 is labelled**, and
> the unlabelled set is larger — Q74, Q75, Q77, Q81, Q84, Q87, Q93 and Q94. Corrected
> in [RUNBOOK.md](../../../docs/phases/09-derived-keys/RUNBOOK.md).

---

## 5 · Alternate stream sets — confirmed, both of them

| Set | Sections and ranges | Status |
|---|---|---|
| Printing Technology | `Basic Engineering` Q71–100 (heading printed twice, once as a stray `Basic Engineering` line) | Out of scope — a different paper for different candidates |
| Agricultural Engineering | `Soil & Water Engineering` Q71–80, `Farm Machinery & Power` Q81–90, `Food Processes & Post Harvest Engineering` Q91–100 | Out of scope, as above |

Both are printed inside this booklet, after the main Q100, exactly as the year package
described. The main-set key covers **Q1–100 of the Engineering & Technology set only**.

---

## 6 · Text-layer quirks observed

| Observation | Items | Effect |
|---|---|---|
| Question labels dropped | 74, 75, 77, 81, 84, 87, 93, 94 | Numbering must be confirmed from the page; a label gap is not a question gap |
| Page numbers survive on three pages only | 8, 10, 18 | Page map provisional (§4) |
| Artwork absent | every figure item | Stems say "in the given circuit" / "as shown in the figure"; drawings missing |
| Options are the artwork | Q26, Q35 | Q26 extracts with no options at all; Q35 extracts option drawings as stray words (`Ballast`, `Starter`, `AC Supply`) |
| Duplicated running head | electrical section | `Electrical Technology` prints twice around a page break — cosmetic |
| Garbled fraction | Q80 ("seven turns advance through `2^{rd}/3` of a decimetre") | The printed fraction is unreadable in the capture; the page decides |
| Ambiguous symbol | Q77 option (A) prints `45° ∼ β/2`, a tilde-like glyph | Whether it is `−`, `+` or `~` changes the option; page required |
| Two options per line | Q41, Q46, Q62–Q70, Q85–Q100 | Lettering recoverable |

---

## 7 · Acceptance check for 09.1

| Document | Was | Is now |
|---|---|---|
| [phase 09 README](../../../docs/phases/09-derived-keys/README.md) 2021 row | `*unverified*`, `Q1–35 Electrical Technology` | verified six-row map with Mathematics Q1–20 |
| [years/2021.md](../../../docs/phases/09-derived-keys/years/2021.md) §1, §4 | `Q1–35 Electrical Technology` | corrected map; Category-I stated |
| [RUNBOOK](../../../docs/phases/09-derived-keys/RUNBOOK.md) §09.2 | "omits visible question labels around Q74, Q76 and Q81" | Q76 is labelled; the unlabelled items are Q74, Q75, Q77, Q81, Q84, Q87, Q93, Q94 |
| README § "the corpus disagrees", years/2021.md | "64 wrong labels" | **45** (65 Computer labels, 20 correct) |

Both alternate sets are listed and marked out of scope in §5.

---

## 8 · Stop condition: 09.2 cannot start

Same input gap, fourth year: no page image can be produced, so no entry may be written.
**09.4–09.9 not started; no `2021-keys.json`, no tiers, no answers.** Nothing under
`src/`, `scripts/`, `tests/`, `public/`, `src/data/` or `archive/` changed.

This year is the one where the page-image rule bites hardest: eight items have no
printed label in the capture, two items have their entire option set as drawings, and
one option is a single ambiguous glyph. A text-layer session here would be guessing in
at least eleven places.

---

## 9 · Corpus pre-check — all 100 items compared at stem level

**Not** 09.3; no reconciliation arithmetic is claimed.

| Check | Result |
|---|---|
| Corpus question numbers | 100 of 100 |
| Subject-label conflicts | **45** (Q56–Q100) |
| Figure flags | 26, 33, 35, 72, 73, 74, 75, 77, 81, 84, 89, 93, 94, 95, 99 — fifteen |
| Incomplete options | 26, 35 — both are diagram-option items, correctly recorded |
| Figure flags with **no textual pointer** in the capture | **Q74, Q75, Q77, Q81, Q84** — five of the fifteen. Their dependence on a drawing cannot be confirmed from the text layer |

**Differences found in the same pass.**

| Item | Booklet prints | Corpus holds |
|---|---|---|
| **Q3** | Determinant rows in the order `cos(α+β), −sin(α+β), cos2β / sinα, cosα, sinβ / −cosα, sinα, cosβ` | The same three rows in a different order. Row order does not change a determinant, but the transcription is not faithful |
| **Q16** | (A) `x−2 = c·e^{tan⁻¹y}`, (B) `2xe^{tan⁻¹y} = e^{2tan⁻¹y}+c`, (C) `xe^{tan⁻¹y} = tan⁻¹y+c`, (D) `x²e^{2tan⁻¹y} = e^{tan⁻¹y}+c` | (A) lost its constant `c`; printed (B) is missing; a fifth-style option `xe^{2tan⁻¹y} = e^{tan⁻¹y}+c` appears instead. Two printed options are not represented |
| **Q72** | (A) W/√3 compressive, (B) W/√3 tensile, (C) 2W/√3 compressive, (D) 2W/√3 tensile | (A) … compressiv, (B) 2W/√3 compres, (C) W/√3 tensile, (D) 2W/√3 tensil — lettering differs from the print |
| **Q73** | (A) `(1+sinα)/(m₂−m₁)`, (B) `(1−sinα)/(m₂+m₁)`, (C) `(1−sinα)/(m₂−m₁)`, (D) `(1+sinα)/(m₂+m₁)` | (A) as printed, (B) = printed (C), (C) `(1+sinα)/(m₁+m₂)`, (D) `(1−sinα)/(m₁+m₂)` — the denominators are reassigned, so the letters do not mean what the paper means |
| **Q74** | (A) `(2a+b)/(a+b)` — no `h` | (A) `h·(2a+b)/(a+b)` — an `h` added inside an option |
| **Q55, Q70, Q85** | Section heading printed after the last option | Option D absorbs it: `"None of these ENVIRONMENTA…"`, `"All of these ENGINEERING M…"`, `"3 m STRENGTH OF MATERIALS"` |
| **Q77** | (A) prints `45° ∼ β/2` | (A) reads `45° − β/2`, i.e. the corpus chose a reading of an ambiguous glyph. Record it as a fidelity difference, not a correction |

---

## 10 · What is needed to continue

One image per printed page of the 2021 booklet. Priorities, in order:

1. the pages holding **Q74–Q94**, where eight labels are missing, five figure flags are
   unconfirmed and three option sets are corrupted;
2. **Q26 and Q35**, whose entire option sets are drawings;
3. any page between printed pages 10 and 18, to close the one-page gap in the map.

Until then the honest state of `09-2021` is: **pre-flight complete, solving blocked.**

---

## 11 · Checks run for this record

| Check | Command | Result |
|---|---|---|
| Booklet retrievable, whole document | `fetch_page`, 5 chunks, final `hasMore: false` | **pass** — Q1–Q100, Printing and Agricultural sets complete |
| Direct download | `curl -I` | **fail** — `SSL_ERROR_SYSCALL` |
| Section map, alternate sets, labels | read every printed heading and question number in the capture | **pass after correction** — two sets confirmed, label claim corrected |
| Page map | three printed page numbers cross-checked against the question blocks | **fail (recorded)** — arithmetic short by one page; images required |
| All 100 items compared against the corpus | printed both sides, read them | **7 difference groups** in §9 |
| Corpus counts quoted here | `python3` over `src/data/papers.json` | **pass** — 100 records, 65 Computer labels, 45 wrong, 15 figure flags, 2 incomplete |
| Markdown links | local resolver | **pass** |
| Key-file schema | not run | **not applicable** |

Not run, and not claimed: any solving, any cross-check, any machine check on an
answer, any render of a booklet page, any device check.
