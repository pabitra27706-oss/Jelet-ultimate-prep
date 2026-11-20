# 09 · open doubts — the register

**Status:** live register, opened 2026-11-20. Not a phase record; a place to keep every
question this phase could not settle, so a later step finds it instead of rediscovering it.

**Rule for this file:** an entry is a doubt only if it is *specific* — a question number, a
claim, and what evidence would close it. "The key might be wrong somewhere" is not an entry.
An entry is removed only when the evidence arrives, and then the resolution is written here
rather than deleted, because a register that quietly shrinks teaches nothing.

Numbers in this file are recomputed from the key files, not remembered. If a key file
changes, this file is part of what must be re-read.

---

## How the second pass was run (and why it is not independent)

The owner asked for a second pass over the 321 provisional answers. Two limits are recorded
here because they bound what the result means:

1. **It is not an independent solver.** The same model produced both passes. A shared
   misreading of the same corpus text will agree with itself, so agreement here is a
   *consistency* check, not corroboration. ADR-0003's `derived-verified` tier requires "two
   independent solvers agree" or a machine check; **this pass satisfies neither** and moved
   no entry out of `derived-provisional`.
2. **The second pass was blind to the recorded answer but not to the reasoning style**, and
   it was done in one sitting. Its value is that a disagreement is a genuine signal: either
   the first pass or the second is wrong, and the arithmetic decides which.

**Method.** Stems and options were printed with the recorded answer stripped. A second
answer was chosen for all 321 items, 100% coverage, then diffed.

| Year | Solved | Second-pass coverage | Raw disagreements | Errors were in the **second** pass | Errors in the **recorded** key |
|---|---:|---:|---:|---:|---:|
| 2017 | 83 | 83 | 3 | 3 | 0 |
| 2018 | 83 | 83 | 19 | 19 | 0 |
| 2019 | 79 | 79 | 16 | 16 | 0 |
| 2021 | 76 | 76 | 10 | 10 | 0 |
| **Total** | **321** | **321** | **48** | **48** | **0** |

**Result: zero key changes were warranted.** Every one of the 48 disagreements was
adjudicated by re-deriving it — algebra, a numeric evaluation, or a definition — and in all
48 the recorded answer was right and the second pass was wrong. That is a reassuring number
and a suspicious one: a second pass that is wrong 48 times and the first pass never is
says more about the second pass than about the key.

Two cases are worth keeping precisely because I got them wrong twice:

- **2018 Q7.** My second pass said B (`fg = 2ch`); the key said C (`2fg = ch`). I then
  asserted in prose that the key was wrong. Expanding
  `(m₁y + n₁)(l₂x + n₂)` gives `2fg = ch` — C is correct — and 2,000 random factorisations
  produced zero violations. **The stated doubt was the error, not the key.** This is exactly
  why doubts belong in a document with their evidence attached.
- **2017 Q65.** Second pass said B; the key said C. Stability is `DALR > ELR`, so C is
  right. I had the inequality backwards on the second pass.

**What this pass does not cover:** the 10 items held inside the slice and the 69 excluded
items were not re-derived (they are held or excluded for stated reasons), and nothing here
touches a figure-dependent question.

---

## A. The ten items held *inside* the slice

These are the highest-value doubts in the phase: an answer exists in principle, the printed
options contradict it, and no page was available to say which side is wrong. Each is one page
image away from resolution.

| # | Year Q | Recorded doubt | What the arithmetic says | Evidence that would close it |
|---|---|---|---|---|
| A1 | 2017 Q2 | Transcribed options contain no correct answer for general *n* | `adj(kA) = k^(n−1) adj(A)`; option A is the *n* = 2 case, option D the reciprocal power | Page image of the options: a lost superscript is the likeliest cause |
| A2 | 2017 Q17 | Stem series reads `1, 2, 4, 8, 16, 2` | The matching option is `2^((n−1)/2)`; the printed option is `2^(n−1)` | Page image; the trailing `2` is very likely a mis-transcribed `2^…` |
| A3 | 2018 Q31 | Copper ratio for 3-phase 3-wire vs 1-phase 2-wire under the stated conditions is **0.5**, which no option offers | Option A (0.67) is a *different* comparison (same power, different conductor assumption) | Page image plus the full stem: the missing assumption is in the print |
| A4 | 2019 Q19 | Options bracket **1.62–1.65**; bisection on √3 converges to **1.732** | √3 is not among the options, at any rounding | Page image of stem **and** options |
| A5 | 2019 Q81 | Total momentum (10, 20) over 15 kg gives **1.491 m/s = 2√5/3**, absent from the options | Options are 2√2/3, 2√3/3, 2√3, 3√2 — none is 1.491 | Page image; a printed mass may differ from the corpus |
| A6 | 2019 Q92 | Corpus stem breaks off at *"If axial load capacity (b…"* | The width-to-depth ratio that decides between 1/2, 1/4, 1/8 and 1/16 is missing | The rest of the stem; nothing else can fix it |
| A7 | 2021 Q2 | Printed sums for n = 3…6 are **12, 52, 205, 786**; options (`2nC_n`, `2nC_(n−1)`, `nC_(n−1)`, `nC_(n+1)`) are three orders of magnitude smaller | The option set cannot describe the printed matrix at any *n* | Page image of the matrix — the indexing is the suspect |
| A8 | 2021 Q21 | Circuit exists only as an image; options −16, 4, −6, 16 V | Nothing to discriminate from text | Page image (circuit) |
| A9 | 2021 Q78 | Two defensible limiting-friction models give **1:1** and **2:1**; printed options are `1:(√2+1)` and `1:(2√2+1)` | Neither printed option follows from either model without an unstated assumption | Page image; the phrase that supplies the assumption is likely lost |
| A10 | 2021 Q80 | Ideal effort **2.91 N**; options cluster near 1 N | Reaching ~1 N needs ≈33% efficiency, which the stem never states | Page image; an efficiency figure may be printed |

**Why these were not forced.** Picking the nearest option would turn a recorded defect into
a confident wrong answer. The phase's own rule (STOP-CONDITIONS S1/S3/S7) is that the page
decides, and there is no page. They stay held, visible, and listed here.

---

## B. Pattern doubts — the ones that are about *me*, not about a question

These are the entries that would survive even a perfect page image, because they are about
how the answer was chosen rather than what the text says. They are the honest ceiling of a
text-layer pass.

| # | Pattern | Where it shows | Why it is a doubt | What would reduce it |
|---|---|---|---|---|
| B1 | **Answer chosen by elimination when the textbook wording is loose** | 2019 Q44 (only defensible option, others loosely worded), 2019 Q56 (scope of an environmental audit), 2019 Q66, 2018 Q60 (MIC as both contaminant and pollutant) | "The others are wrong" is not the same as "this one is right"; a board key would use the textbook's own phrasing | The prescribed textbook's exact sentence for the topic |
| B2 | **Convention presented as fact** | 2019 Q36 (first partition → local descriptor table), 2021 Q63 (5000 mg/L saline threshold), 2021 Q69 (100 dBA damage threshold; physiology says 85–90) | These are conventions with fuzzy edges, and the board may use a different one | The year's syllabus/reading list, or the page |
| B3 | **Defined behaviour versus guaranteed behaviour in C** | 2017 Q49, 2018 Q50, 2021 Q43/Q49/Q50/Q51 | `printf("%d", (int*)v)`, `unsigned char` overflow and `main()` recursion are *undefined/implementation* behaviour; the "expected" option is what a compiler usually does, not a guarantee | Either accept the practical reading (as now, and say so) or hold them all; changing this would move several answers at once |
| B4 | **"Most conservative" / "best" superlatives** | 2017 Q86/Q93, 2018 Q97, 2021 Q66 | Superlative items depend on the textbook's ordering, and two orderings are defensible for close pairs (total strain energy vs maximum shear) | The prescribed text's own ranking |
| B5 | **Data-table and threshold items answered from memory** | 2017 Q42 (batch vs job), Q60 (N,P,K), Q63 (L10 18-hour index); 2018 Q60 (MIC), Q64 (Indore) | No arithmetic exists to check these; a machine check cannot help, so they are medium confidence by construction | The source text; these cannot be upgraded by computation |

**None of B1–B5 is a claim that the recorded answer is wrong.** They are the reason the tier
stays `derived-provisional` even if every arithmetic check passes, and the reason this list
is the first thing a future reviewer should attack.

---

## C. Corpus-level doubts that outlive this phase

| # | Doubt | Scope | Evidence needed |
|---|---|---|---|
| C1 | **`src/data/papers.json` is a transcription, not the booklet.** Every answer here inherits its errors | All four years | Page images; the phase's entire 09.2 |
| C2 | **2019 Q77–Q79 page is absent from the corpus** | 2019 Q78, Q79 recorded `absent-from-corpus` | The page |
| C3 | **2019 booklet number is printed empty** (the footer says *Set A*) | 2019 provenance | Page image of the cover |
| C4 | **2018 has no booklet number and three alternate streams** | 2018 provenance | Page image; the stream sets decide which questions a candidate saw |
| C5 | **2021 alternate sets advance Q71–Q100** for Printing Technology and Agricultural Engineering | 2021 scope | Which stream any future key is *for*; unstated today |
| C6 | **2017 Q18 was substituted with a different textbook example** | 2017 Q18 | The printed question |
| C7 | **Section headings bleed into option D** (Q55 and Q70 in every year) | 2017, 2018, 2019, 2021 Q55/Q70 | Page images; the pattern is identical across four years, so it is a corpus-generation bug, not a booklet quirk |
| C8 | **No board key exists for 2017–2021**, checked as far as the archive allows | All four years | Absence is not proof; re-check if WBJEEB publishes (S14 would then retire this work) |

C7 is the one to fix first if anyone touches the corpus: it is a single mechanical defect
repeated across all four years, and it is the stated reason for six exclusions.

---

## D. Doubts about the machinery, not the answers

| # | Doubt | State |
|---|---|---|
| D1 | The slice is defined in code (`scripts/derived-key-subset.mjs`) and was once bounded by `paper.questionCount`, silently dropping 2019 Q99/Q100 | **Fixed**, and the test suite now fails if a key file and the subset disagree item by item |
| D2 | Three first-draft machine checks were wrong (2019 Q2, Q20, Q100) | **Fixed** by running them; recorded in EVIDENCE rather than removed |
| D3 | The validator carried a check that could not fail (`&& false`) | **Fixed**; `pass: true` now requires a reproducing command starting with an interpreter |
| D4 | `machineCheck.pass` is still *reported* by a builder, not independently re-run by the validator | **Open** — the suite re-runs every command, but a hand-edited JSON could still claim a pass the suite does not cover for a new year |
| D5 | The second pass cannot promote anything, so 86 is a hard ceiling on machine-checked items until pages arrive | **Open, by design** — most remaining items have no numeric formulation (see B5) |

---

## E. What a future step should do first

1. **Page images.** A1–A10, C1–C4 and C6 all close with images, and nothing else does. The
   validator is already ready: `sourceImage` must live under
   `editorial/derived-keys/<year>/pages/`, and `optionFidelity: "verbatim"` is rejected
   without it.
2. **Attack B1–B5 before trusting any promotion.** A reviewer reading only the 20 pattern
   items in B finds the phase's real error surface far faster than by re-reading 321 answers.
3. **Fix C7 in the corpus generator** if the corpus is ever regenerated. Six exclusions
   across four years become solvable for a one-line reason.
4. **Do not read this register as "the key is fine".** It records that one consistency pass
   found no arithmetic error. A page image, a second independent solver, or a board key is
   what would actually corroborate an answer — and none of those exists yet.
