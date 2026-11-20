# 2017 · pre-flight record — what the booklet actually contains

**Task:** `09-2017` · **Step:** 09.1 pre-flight ·
**Mode:** RESEARCH (documentation only) · **Date:** 2026-11-20

**Result: pre-flight ran and produced a corrected section map. It also stopped the
year at step 09.2.** The booklet's text layer is retrievable; the **page images are
not**. Under the [runbook](../../../docs/phases/09-derived-keys/RUNBOOK.md) and
[stop conditions](../../../docs/phases/09-derived-keys/STOP-CONDITIONS.md) that
means **no key entry may be written** for any of the 100 items. Nothing here is an
answer, a tier or a score.

---

## 1 · Retrieval record

| | |
|---|---|
| Source index | https://wbjeeb.nic.in/jelet-old-question-papers/ (WBJEEB old-question-paper archive) |
| Booklet URL fetched | `https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2023/11/2023111594.pdf` |
| Retrieval date | 2026-11-20 |
| Retrieval method | `fetch_page` retrieval of the PDF; the PDF's **text layer** was returned as Markdown |
| Direct download | **Failed.** `curl` against the CDN aborts with `OpenSSL SSL_connect: SSL_ERROR_SYSCALL` (exit 35). No bytes were downloaded, so **no checksum can be recorded** (`booklet.checksum` stays `null`) |
| File identity | The page returned the 2017 Engineering & Technology booklet: cover title `JELET-2017`, `For all Diploma holders in Engg./Tech.`, `Booklet No. 80116361`, footer `JELET-2017/DIP. ENGG.&TECH.` |
| URL trap avoided | `2023111594-1.pdf` was not requested; it returns JENPAS(UG)-2022 |
| Page images | **None produced.** This is the blocking gap — see §8 |

**Capture limit.** The PDF reader returns at most 30 pages. The capture runs from
the cover to printed page 30, which ends mid-way through the Agricultural
Engineering alternate set (its Q93). Whether the booklet continues past page 30
(Agricultural Q94–Q100, rough-work sheets) is **not established** by this capture.

---

## 2 · Booklet identity and the printed rules

| Field | Value as printed |
|---|---|
| Paper | `JELET-2017`, "For all Diploma holders in Engg./Tech." |
| Booklet number | `80116361` |
| Stream set (footer) | `JELET-2017/DIP. ENGG.&TECH.` |
| Time | 2 Hours |
| Maximum marks | 100 |
| Questions | "This question paper contains 100 MCQ type objective questions. Each question has four answer options given, viz. A, B, C and D." |
| Set symbol | **None printed.** No `Set A/B/C` marking appears on the cover or footers |
| Board key | None exists. The [JELET archive](https://wbjeeb.nic.in/archive-jelet/) carries key notices for 2023–2026 only |

**The marking rule, as printed (instruction 2):** "Only one answer is correct.
Correct answer will fetch full marks 1. Incorrect answer or any combination of more
than one answer will fetch -¼ marks. No answer will fetch 0 marks."

**Consequence for this year: every item is Category-I.** The paper prints no
Category-II rule and no section that overrides instruction 2. The year package's
expectation that "Q71–85 and Q86–100 carry most of the Category-II items" is not
supported by the booklet and has been corrected in
[years/2017.md](../../../docs/phases/09-derived-keys/years/2017.md).

---

## 3 · Section map — the main Engineering & Technology set (corrected)

Every heading below is quoted from the booklet. The phase documents previously
recorded Q1–35 as Electrical Technology; **that was wrong** — Q1–20 is Mathematics
and the Electrical Technology heading sits at Q21, on the same page as Q18–Q20.

| Range | Printed heading | Page (slot in §4) |
|---|---|---|
| Q1–20 | `(Question 1-70 for all candidates) MATHEMATICS` | 3 |
| Q21–35 | `ELECTRICAL TECHNOLOGY` | 6 |
| Q36–55 | `COMPUTER APPLICATION` | 9 |
| Q56–70 | `ENVIRONMENTAL ENGINEERING` | 12 |
| Q71–85 | `(Question 71-100 for all candidates except Printing Technology and Agricultural Engineering Candidates) ENGINEERING MECHANICS` — followed by "Unless stated otherwise, take acceleration due to gravity, g, as 10 m/s²" | 14 |
| Q86–100 | `(STRENGTH OF MATERIALS)` | 18 |

The numbers 3, 9, 12, 14 and 18 are observed in the text layer. **6** is a slot
position, not an observed number: the Electrical heading shares its page with
Q18–Q20 and that page's printed number does not survive extraction.

**Direction lines.** The booklet tells a candidate which Q71–100 section applies to
them, and only in the heading of each section: "for all candidates except Printing
Technology and Agricultural Engineering Candidates" (main set); "for Printing
Technology Candidates" (page 24); "for Agricultural Engineering Candidates"
(page 28). The Q1–70 direction is "(Question 1-70 for all candidates)" on the
Mathematics heading. There is no separate instruction paragraph naming the
sections, and no instruction telling a candidate their stream.

---

## 4 · Page map

Page slots run in printed order. Only some page numbers survive extraction; the
others were placed by counting the printed footer separators between two observed
numbers, so the **slot** is reliable while the **number** is not observed. The
`page` field of a future key entry must be taken from the page image, not from this
table.

| Slot | Number in capture | Content | Items |
|---|---|---|---|
| 1 | — | Cover, `Booklet No. 80116361`, instructions 1–10 | — |
| 2 | — | "Space for Rough Work" | — |
| 3 | `3` | Mathematics heading | Q1–5 |
| 4 | `4` | Mathematics | Q6–11 |
| 5 | not in text layer | Mathematics | Q12–17 |
| 6 | not in text layer | Mathematics tail, then `ELECTRICAL TECHNOLOGY` | Q18–22 |
| 7 | not in text layer | Electrical Technology | Q23–29 |
| 8 | `8` | Electrical Technology | Q30–35 |
| 9 | `9` | `COMPUTER APPLICATION` | Q36–42 |
| 10 | `10` | Computer Application | Q43–48 |
| 11 | not in text layer | Computer Application | Q49–55 |
| 12 | `12` | `ENVIRONMENTAL ENGINEERING` | Q56–62 |
| 13 | not in text layer | Environmental Engineering | Q63–70 |
| 14 | `14` | Engineering Mechanics heading, direction line, g-note | Q71–72 |
| 15 | not in text layer | Engineering Mechanics | Q73–75 |
| 16 | `16` | Engineering Mechanics | Q76–Q79 (Q79 stem runs on) |
| 17 | not in text layer | Engineering Mechanics | Q79 options–Q84 |
| 18 | `18` | Q85, then `(STRENGTH OF MATERIALS)` | Q85–89 |
| 19 | not in text layer | Strength of Materials | Q90–91 |
| 20 | `20` | Strength of Materials | Q92–96 |
| 21 | not in text layer | Strength of Materials | Q97 |
| 22 | `22` | Strength of Materials | Q98–99 |
| 23 | not in text layer | Strength of Materials | Q100 |
| 24 | `24` | `(Question Nos. 71-100 for Printing Technology Candidates) BASIC ENGINEERING` | P71–P77 |
| 25 | not in text layer | Printing, Basic Engineering | P78–P85 |
| 26 | `26` | `PRINTING MATERIAL SCIENCE` | P86–P93 |
| 27 | not in text layer | Printing Material Science | P94–P100 |
| 28 | `28` | `(Question Nos. 71-100 for Agricultural Engineering Candidates) FARM MACHINERY & POWER` | A71–A78 |
| 29 | not in text layer | Farm Machinery tail, then `SOIL & WATER ENGINEERING` at A81 | A79–A85 |
| 30 | `30` | Soil & Water tail, then `FOOD PROCESS & POST HARVEST ENGINEERING` at A91 | A86–A93 |
| 31+ | not captured | Not retrieved (30-page reader limit) | A94–A100 unverified |

---

## 5 · Alternate stream sets — listed, out of scope

| Set | Sections and ranges | Status |
|---|---|---|
| Printing Technology | `BASIC ENGINEERING` Q71–85 (p. 24) and `PRINTING MATERIAL SCIENCE` Q86–100 (p. 26) | Out of scope — a different paper for different candidates. Not carried in the corpus, not keyed here |
| Agricultural Engineering | `FARM MACHINERY & POWER` Q71–80 (p. 28), `SOIL & WATER ENGINEERING` Q81–90 (p. 29), `FOOD PROCESS & POST HARVEST ENGINEERING` Q91–100 (p. 30) | Out of scope, as above. **The capture stops inside this set at A93**, so its last seven items were not even read |

The main-set key covers **Q1–100 of the Engineering & Technology set only**, and that
limitation travels in `booklet.streamSet` and `outOfScopeSets` (integration Gate B).

---

## 6 · What the text layer preserves, and what it loses

The text layer preserved the printed values, options and most stems. It did **not**
preserve any artwork, and it mangled several items. These are observed, not
predicted:

| Observation | Items affected | Effect on a later solving session |
|---|---|---|
| No artwork at all | every figure item | Ten stems point at a diagram (Q72, Q73, Q75, Q81, Q89, Q90, Q91, Q97, Q98, Q100). Their figures are absent from the capture, so the geometry is unknown |
| Options are the artwork | Q97, Q100 | Q97 extracts as numeric layout text and Q100 as bare `(A) (B) (C) (D)`. Four loading diagrams / four Mohr circles cannot be compared from text |
| Question label missing | Q73, Q81 | The stem is present without its number. A reader could miscount the sequence; the page image fixes it |
| Stem truncated mid-sentence | Q76 ("leaning against a vertical w") | The corpus completes it as "vertical wall"; the booklet page decides whether that completion is faithful |
| Stem split across pages | Q79 (options on slot 17), Q31 (across the slot 8 boundary) | Page attribution needs the image |
| Option order scrambled | Q63–Q70 | Options extract as A, C, B, D. Lettering cannot be trusted from text |
| Option blocks re-extracted as images | Q82, Q83, Q84 | The formulas/values appear twice — once inline, once as display blocks. This is an extraction artefact, **not** evidence that these items carry a figure |
| Symbols degraded | Q63 `L_epn`/`L_epm`, Q83's last option, Q84's degree values | Any reading must come from the page |

**Rule carried forward:** the text layer is a convenience. No entry may cite it as
its source, and no option may be repaired from it.

---

## 7 · Acceptance check for 09.1

> "the year package's recorded section map matches the booklet, or the difference is
> written down. Every alternate set is listed and marked out of scope."

**Not matched. The difference is written down here, and the documents have been
corrected:**

| Document | Was | Is now |
|---|---|---|
| [phase 09 README](../../../docs/phases/09-derived-keys/README.md) § section map | `Q1–35 Electrical Technology` | two rows: Q1–20 Mathematics, Q21–35 Electrical Technology; the other three years' rows marked unverified |
| [years/2017.md](../../../docs/phases/09-derived-keys/years/2017.md) §1, §4 | `Q1–35 Electrical Technology`; "most of the Category-II items" | corrected map; Category-I stated as the printed rule |
| [SCHEMA.md](../../../docs/phases/09-derived-keys/SCHEMA.md) §1 example | `sectionMap` began at Q1 Electrical | example now shows Mathematics 1–20 and Electrical 21–35 |
| README § "the corpus disagrees" | "wrong for 64 questions in each of the three full years" | **45** for 2017, 2018 and 2021; **43** for 2019 (98 recorded questions) — counted from `src/data/papers.json` |
| years/2017.md §2, §4 | "**64 wrong labels**", "roughly 64" | **45**, counted |

Both alternate sets are listed and marked out of scope in §5. The phase status line,
the phase evidence record, the roadmap row and the editorial index were updated in the
same change, because leaving them at "designed, not started" would have been untrue.

---

## 8 · Stop condition: 09.2 cannot start

[RUNBOOK 09.2](../../../docs/phases/09-derived-keys/RUNBOOK.md) requires one image
per printed page, an index by printed page, and a page number for every question.
That cannot be produced here:

- the CDN refuses a direct download in this sandbox (`SSL_ERROR_SYSCALL`), so the PDF
  cannot be rendered locally;
- `fetch_page` returns the text layer only;
- no page image can be invented, and a screenshot from a third-party site is not the
  board's page.

Therefore, per [S1](../../../docs/phases/09-derived-keys/STOP-CONDITIONS.md) and the
governing rule in that document ("if the phase starts producing answers without page
images, the whole phase is invalid"):

- **09.4 first pass: not started. 09.5 attack: not started. 09.6 cross-check: not
  started. 09.7 machine checks: none written. 09.8 tiers: none assigned. 09.9
  artifacts: not written.**
- No `2017-keys.json`, no `2017.md`, no `2017-crosscheck.md`.
- No file outside this pre-flight record was changed in `editorial/`, and nothing at
  all was changed under `src/`, `scripts/`, `tests/`, `public/`, `src/data/` or
  `archive/`.

---

## 9 · Structural spot-check against the corpus (evidence for a later 09.3)

Not a reconciliation. Fourteen items were spot-checked against
`src/data/papers.json`; `matched + missingInCorpus + extraInCorpus = 100` is
**not** claimed here, and the item-by-item pass needs the page images.

| Check | Result |
|---|---|
| Question numbers present in corpus | 100 of 100, no gaps, no duplicates |
| Corpus subject ranges | Mathematics 1–20, Electrical Technology 21–35, Computer & IT 36–100 |
| Subject-label conflicts with the printed headings | **45** (Q56–Q100 carry `Computer & IT`; the booklet assigns Q56–70 Environmental Engineering, Q71–85 Engineering Mechanics, Q86–100 Strength of Materials) |
| Corpus figure flags | 72, 73, 75, 81, 89, 90, 91, 97, 98, 100 — ten, consistent with the ten stems that name a figure |
| Corpus items with incomplete options | 83, 97, 100 |

**New differences found by the spot-check** (each needs the page image to adjudicate;
the booklet wins where they differ):

| Item | Observation |
|---|---|
| **Q18** | The booklet prints `f(x) = kx²e^(−x/2), x > 0` with options 1/10, 1/12, 3/14, 1/16. The corpus prints a *different* distribution — a table `P(x) = k, 2k, 3k, 4k` — under the same options. One of the two stems is wrong, and the answer changes with it |
| **Q73** | Booklet option (B) is `2π√(a/(√3 g))`; the corpus records `2π√(a/(3g))`. An option was altered in transcription |
| **Q63** | The capture prints `L_epn` and orders the options A, C, B, D; the corpus records `Lₑₚₘ` with the letters realigned to A, B, C, D. Both the symbol and the lettering need the page |
| **Q76** | The corpus stem is complete ("vertical wall") while the capture truncates it. Whether "wall" is the printed word is unconfirmed |
| **Q82** | Booklet text layer reads "…tension in the [ring/string]…"; corpus says "string". Unconfirmed |
| **Q83** | Confirmed as the phase documents describe: the corpus holds one option that is a transcriber's note, while the booklet prints four distinct exponents, `e^(μ/θ)`, `e^(θ/μ)`, `e^(1/(μθ))`, `e^(μθ)` |

The first two are the strongest argument in the phase for reading the page image and
for never treating the corpus as the source.

---

## 10 · What is needed to continue

The owner is the only party who can unblock 09.2. The smallest sufficient input is
**one image per printed page (pages 1–30 at least) of booklet 80116361**, produced by
the owner from the same URL — phone screenshots of the PDF viewer are sufficient if
each page is legible and the printed page number is visible.

Two alternative decisions, if images cannot be supplied:

1. **Authorise a text-layer-only session** for a named subset (for example Q1–55,
   the Mathematics and Electrical blocks, where no figure sits). This contradicts the
   runbook's central rule and the 2022 precedent, so it must be an explicit, dated
   owner decision, and those entries would still be `derived-provisional` at best.
2. **Defer 2017** and run a different year package — which faces the same capture limit, so it needs its own page images too.

Until one of these happens, the honest state of `09-2017` is: **pre-flight complete,
solving blocked**.

---

## 11 · Checks run for this record

| Check | Command | Result |
|---|---|---|
| Booklet retrievable via the documented route | `fetch_page` on the canonical URL, four chunks | **pass** — cover, instructions, all 100 main-set items, both alternate Q71–100 sections (Agricultural truncated at A93) |
| Direct download | `curl -I` on the same URL | **fail** — `SSL_ERROR_SYSCALL`, no bytes; recorded, not worked around with a mirror |
| Section map against the booklet | manual read of every printed heading in the capture | **difference found and corrected** (Mathematics Q1–20) |
| Corpus counts quoted in these corrections | `python3` count over `src/data/papers.json` | **pass** — 2017: 65 Computer labels, 20 correct, 45 wrong; 2019: 63 Computer labels over 98 questions, 43 wrong |
| Markdown links in the touched documents resolve | local resolver over the relative links added here | **pass** |
| Scope | `git status --short` | only this file plus six documentation files: the phase README, `years/2017.md`, `SCHEMA.md`, the phase `EVIDENCE.md`, `docs/ROADMAP.md` and `editorial/derived-keys/README.md` |
| Key file schema | not run | **not applicable** — no key file exists to validate |

Not run, and not claimed: any solving, any cross-check, any machine check, any
render of a booklet page, any device or accessibility check.
