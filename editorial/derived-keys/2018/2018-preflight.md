# 2018 · pre-flight record — what the booklet actually contains

**Task:** `09-2018` · **Step:** 09.1 pre-flight ·
**Mode:** RESEARCH (documentation only) · **Date:** 2026-11-20

**Result: pre-flight ran and corrected the section map again. It then stopped the
year at step 09.2**, exactly as 2017 did: the booklet's text layer is retrievable,
the **page images are not**. No key entry may be written for any of the 100 items.
Nothing here is an answer, a tier or a score.

---

## 1 · Retrieval record

| | |
|---|---|
| Source index | https://wbjeeb.nic.in/jelet-old-question-papers/ (WBJEEB old-question-paper archive) |
| Booklet URL fetched | `https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2023/11/2023111538-1.pdf` |
| Retrieval date | 2026-11-20 |
| Retrieval method | `fetch_page` retrieval of the PDF; the PDF's **text layer** was returned as Markdown |
| Direct download | **Failed** as in 2017 — `curl` aborts with `OpenSSL SSL_connect: SSL_ERROR_SYSCALL`. No bytes downloaded, so no checksum (`booklet.checksum` stays `null`) |
| File identity | `JELET—2018`, `For Diploma in Engg. & Tech. Candidates`, footer `Engg & Tech/JT3` throughout |
| Booklet number | **Not printed** in the capture — no `Booklet No.` on the cover and none in any page footer. Leave `bookletNumber: null`; a number hidden in artwork can only be ruled out from the page image |
| Page images | **None produced.** This is the blocking gap — see §8 |

**Capture limit.** The reader returns at most 30 pages. The capture ends inside the
Agricultural Engineering alternate set at **A94** (printed page 30). Agricultural
Q95–Q100 and any rough-work pages beyond page 30 were **not read**.

---

## 2 · Booklet identity and the printed rules

| Field | Value as printed |
|---|---|
| Paper | `JELET—2018`, "For Diploma in Engg. & Tech. Candidates" |
| Stream set (footer) | `Engg & Tech/JT3` |
| Time | 2 hours |
| Maximum marks | 100 |
| Questions | 100 objective items, four options each — 100 recorded in the corpus, 100 read in the capture |
| Set symbol | **None printed**; the footer's `JT3` is the stream label, not a set letter |
| Board key | None exists; the [JELET archive](https://wbjeeb.nic.in/archive-jelet/) carries key notices for 2023–2026 only |

**The marking rule, as printed (instruction 1):** "Only one option is correct.
Correct answer will carry full mark 1. In case of incorrect answer or any combination
of more than one answer, ¼ mark will be deducted."

**Consequence: every 2018 item is Category-I.** There is no Category-II rule and no
section that overrides instruction 1. The year package's expectation that Q71–85 and
Q86–100 "carry most of the Category-II items" is not supported by the booklet and has
been corrected in [years/2018.md](../../../docs/phases/09-derived-keys/years/2018.md).

---

## 3 · Section map — the Engg & Tech/JT3 set (corrected)

The phase documents recorded Q1–35 as Electrical Technology. **Q1–20 is
Mathematics**, as in 2017.

| Range | Printed heading | Page (slot in §4) | Direction line above it |
|---|---|---|---|
| Q1–20 | `Mathematics` | 3 | "Direction : Question Nos. 1 to 70 for all candidates" |
| Q21–35 | `Electrical Technology` | 6 | — |
| Q36–55 | `Computer Application` | 8 | — |
| Q56–70 | `Environmental Engineering` | 12 | — |
| Q71–85 | `Engineering Mechanics` | 15 | "Direction: Question Nos. 71 to 100 for all candidates except Printing Technology and Agricultural Engineering Candidates" |
| Q86–100 | `Strength of Materials` | 19 | — |

Page numbers 7, 11, 13, 15 and 27 survive in the capture and anchor this map; the rest
are slot positions between them (see §4).

---

## 4 · Page map

| Slot | Number in capture | Content | Items |
|---|---|---|---|
| 1 | — | Cover, `JELET—2018`, instructions 1–10 | — |
| 2 | — | "SPACE FOR ROUGH WORK" | — |
| 3 | not in text layer | Direction 1–70, `Mathematics` heading | Q1–8 |
| 4 | not in text layer | Mathematics | Q9–13 |
| 5 | not in text layer | Mathematics | Q14–19 |
| 6 | not in text layer | Q20, then `Electrical Technology` | Q20–26 |
| 7 | `7` | Electrical Technology | Q27–31 |
| 8 | not in text layer | Electrical tail, then `Computer Application` | Q32–37 |
| 9 | not in text layer | Computer Application | Q38–44 |
| 10 | not in text layer | Computer Application | Q45–50 |
| 11 | `11` | Computer Application | Q51–54 |
| 12 | not in text layer | Q55, then `Environmental Engineering` | Q55–60 |
| 13 | `13` | Environmental Engineering | Q61–65 |
| 14 | not in text layer | Environmental Engineering | Q66–70 |
| 15 | `15` | Direction 71–100, `Engineering Mechanics` | Q71–73 |
| 16 | not in text layer | Engineering Mechanics | Q74–77 |
| 17 | not in text layer | Engineering Mechanics | Q78–80 |
| 18 | not in text layer | Engineering Mechanics | Q81–85 |
| 19 | not in text layer | `Strength of Materials` heading | Q86–89 |
| 20 | not in text layer | Strength of Materials | Q90–95 |
| 21 | not in text layer | Strength of Materials | Q96–100 |
| 22 | not in text layer | Direction + `Basic Engineering` (Printing) | P71–P77 |
| 23 | not in text layer | Printing, Basic Engineering | P78–P80 |
| 24 | not in text layer | Printing, Basic Engineering | P81–P84 |
| 25 | not in text layer | P85, then `Printing Material Science` | P85–P89 |
| 26 | not in text layer | Printing Material Science | P90–P94 |
| 27 | `27` | P95–P100, then Agricultural direction + `Soil and Water Engineering` | P95–P100, A71–A75 |
| 28 | not in text layer | A76–A80, then `Farm Machinery and Power` at A81 | A76–A81 |
| 29 | not in text layer | Farm Machinery and Power | A82–A88 |
| 30 | not in text layer | A89–A90, then `Food Processes and Post-Harvest Engineering` at A91 | A89–A94 |
| 31+ | not captured | Not retrieved (30-page reader limit) | A95–A100 unverified |

Note that **printed page 27 carries the end of one alternate set and the start of the
next**, so a page number alone does not identify which Q71–100 section a question
belongs to. The heading does.

---

## 5 · Alternate stream sets — listed, out of scope

| Set | Sections and ranges | Status |
|---|---|---|
| Printing Technology | `Basic Engineering` Q71–85 (p. 22) and `Printing Material Science` Q86–100 (p. 25) | Out of scope — a different paper for different candidates; not in the corpus, not keyed here |
| Agricultural Engineering | `Soil and Water Engineering` Q71–80 (p. 27), `Farm Machinery and Power` Q81–90 (p. 28), `Food Processes and Post-Harvest Engineering` Q91–100 (p. 30) | Out of scope, as above. The capture stops at A94, so its last six items were not read |

The key covers **Q1–100 of the `Engg & Tech/JT3` set only**, and that limitation
travels in `booklet.streamSet` and `outOfScopeSets` (integration Gate B).

---

## 6 · What the text layer preserves, and what it loses

The 2018 text layer is cleaner than 2017's, and the year package predicted part of
this correctly. Observed:

| Observation | Items affected | Effect |
|---|---|---|
| No artwork at all | every figure item | The stems say "as shown in the figure" / "see figure" / options are drawings, and the drawings are absent |
| Options are the artwork | Q89, Q91 | Both extract as bare `(A) (B) (C) (D)`. Diagram options, therefore figure-dependent — not option-less |
| Page number printed on some pages only | pages 7, 11, 13, 15, 27 | The page map in §4 is anchored on those five and inferred between them |
| Two options per line | Q45–Q50 | `(A) FTP (B) SMTP` on one line; lettering is still recoverable |
| Stem wording degraded | Q80 prints "A plane **turns** of span 9 m…" (almost certainly "truss") | The page decides the word; the capture cannot |
| Section heading printed immediately after an option block | Q55, Q70, Q85, P85 | The capture keeps them separate; the **corpus** does not (see §9) |
| Cross-page splits | Q31 (`[P.T.O.]` split by the chunk boundary), Q78 (stem/options across pages) | Page attribution needs the image |

---

## 7 · Acceptance check for 09.1

> "the year package's recorded section map matches the booklet, or the difference is
> written down. Every alternate set is listed and marked out of scope."

**Not matched. Written down and corrected:**

| Document | Was | Is now |
|---|---|---|
| [phase 09 README](../../../docs/phases/09-derived-keys/README.md) § section map | 2018 row `*unverified*` | 2018 row filled in: Q1–20 Mathematics, Q21–35 Electrical, Q36–55 Computer Application, Q56–70 Environmental, Q71–85 Mechanics, Q86–100 Strength |
| [years/2018.md](../../../docs/phases/09-derived-keys/years/2018.md) §1, §4 | `Q1–35 Electrical Technology`; "most of the Category-II items" | corrected map; Category-I stated as the printed rule |
| README § "the corpus disagrees", years/2018.md §2, §4 | "64 wrong labels" | **45**, counted from `src/data/papers.json` (65 Computer labels, 20 correct) |

Both alternate sets are listed and marked out of scope in §5, and the status line,
phase evidence record, roadmap row and editorial index were updated in the same change.

---

## 8 · Stop condition: 09.2 cannot start

Same input gap as 2017, and the same rule:

- the CDN refuses a direct download in this sandbox, so the PDF cannot be rendered;
- `fetch_page` returns the text layer only;
- a screenshot from a coaching site is not the board's page and cannot be used.

Per [S1](../../../docs/phases/09-derived-keys/STOP-CONDITIONS.md) and the governing
rule ("if the phase starts producing answers without page images, the whole phase is
invalid"):

- **09.4 first pass, 09.5 attack, 09.6 cross-check, 09.7 machine checks, 09.8 tiers,
  09.9 artifacts: none run.**
- No `2018-keys.json`, no `2018.md`, no `2018-crosscheck.md`.
- Nothing under `src/`, `scripts/`, `tests/`, `public/`, `src/data/` or `archive/`
  changed.

---

## 9 · Corpus pre-check — all 100 items compared at stem level

This is **not** 09.3. The 2018 stems and options were compared against the captured
booklet text for every one of the 100 items; the differences below are recorded for
the page-based reconciliation that a solving session must run. No counts of
`matched / missingInCorpus / extraInCorpus` are claimed.

| Check | Result |
|---|---|
| Question numbers | 100 of 100, no gaps, no duplicates |
| Corpus subject ranges | Mathematics 1–20, Electrical Technology 21–35, Computer & IT 36–100 |
| Subject-label conflicts | **45** (Q56–Q100) |
| Figure flags | 27, 73, 74, 78, 79, 80, 82, 85, 89, 90, 91 — eleven |
| Incomplete options | 89, 91 |

**Substituted stems — the 2017 Q18 defect repeats three times, all in Mathematics.**
In each case the corpus keeps the booklet's four options but replaces the stem with a
different textbook example. This is the single most important finding of this
pre-flight, because a solver trusting the corpus would answer a question the examiner
never set.

| Item | Booklet prints | Corpus prints |
|---|---|---|
| **Q2** | `A = [[12, 24, 5], [x, 6, 2], [-1, -2, 3]]`, find x for which A is not invertible | `A = [[2, 3, 4], [5, 6, 7], [8, 9, x]]`, same options 6, 12, 3, 2. **The corpus version is internally impossible:** its determinant is `30 − 3x`, which vanishes only at x = 10 — not one of the four options. The stem and options do not belong together |
| **Q13** | `∫ (x²−1) / (x²{5 + (x + 1/x)²}) dx` | `∫ dx / (x⁴ + 3x² + 1)`, same four arctangent options |
| **Q19** | `A = [[cos θ, sin θ], [−sin θ, cos θ]]` | `A = [[1, 2, 3], [2, 4, 6], [3, 6, 9]]`, same options symmetric / skew-symmetric / orthogonal / singular |

**Other corpus defects found in the same pass.**

| Item | Observation |
|---|---|
| **Q72** | Confirmed: the corpus stem stops at "Where the weight must"; the booklet continues "be placed (distance from the man end) so that the man may bear twice of that the boy has to carry?" The options match exactly, as the package said |
| **Q55, Q70, Q85** | The option **D** text absorbs the next printed section heading — `"Segmentation ENVIRONMENTAL E…"`, `"antibiotic ENGINEERING MECHA…"`, `"0.204r STRENGTH OF MATERIA…"`. The capture keeps them separate, so this is a transcription defect, not a printing one |
| **Q89, Q91** | The corpus stems carry editorial notes — "(Options not reproduced in text)", "(diagram based)" — that are not printed text. Q91's stem is intact otherwise; Q89's is intact |
| **Q27, 73, 74, 78, 79, 80, 82, 85, 90** | The corpus prefixes `[Diagram]`. Only Q73, Q78, Q80, Q82 and Q90 name a figure in the printed stem; **Q74, Q79 and Q85 have no textual pointer to artwork at all**, so their figure status cannot be confirmed from the capture and must come from the page |
| **Q80** | Booklet text layer reads "A plane turns of span 9 m"; corpus reads "A plane truss of span 9 m". One word needs the page |
| **Q23, Q26** | The corpus drops the printed "≈" from the four numerical options — a small fidelity difference, not an answer difference |

---

## 10 · What is needed to continue

Identical to 2017, and now a two-year pattern rather than a one-off:

1. **Owner supplies page images** for the 2018 booklet — one image per printed page,
   1–30 at least, from the same URL, legible, with the printed page number visible.
   That unblocks 09.2 and everything after it.
2. Or the owner **decides on the record** that a named text-layer-only subset may be
   solved as `derived-provisional`. Given the three substituted stems found here, the
   Mathematics section is the *least* safe place to start that way.

Until then the honest state of `09-2018` is: **pre-flight complete, solving blocked.**

---

## 11 · Checks run for this record

| Check | Command | Result |
|---|---|---|
| Booklet retrievable by the documented route | `fetch_page` on the canonical URL, four chunks | **pass** — cover, instructions, all 100 JT3 items, both alternate sets (Agricultural truncated at A94) |
| Direct download | `curl -I` on the same URL | **fail** — `SSL_ERROR_SYSCALL`, no bytes |
| Section map against the booklet | manual read of every printed heading in the capture | **difference found and corrected** (Mathematics Q1–20) |
| All 100 items compared at stem level against the corpus | printed both sides and read them side by side | **6 difference groups recorded** in §9 |
| Corpus Q2 internal-consistency check | `python3` determinant of the corpus matrix | **pass** — determinant `30 − 3x`, zero only at x = 10, which is not offered |
| Corpus counts quoted here | `python3` count over `src/data/papers.json` | **pass** — 65 Computer labels, 20 correct, 45 wrong |
| Markdown links in touched documents | local resolver over the relative links | **pass** |
| Scope | `git status --short` | only this file plus the documentation files listed in §7 |
| Key-file schema | not run | **not applicable** — no key file exists |

Not run, and not claimed: any solving, any cross-check, any machine check on an
answer, any render of a booklet page, any device or accessibility check.
