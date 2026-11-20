# Phase 07 evidence · the topic map, the coverage dashboard, and the authoring desk

**Date:** 2026-11-19
**Branch:** `arena/1e582bac-jelet-ultimate-prep`
**Scope agreed with the owner:** the toolchain and the coverage dashboard. **No lesson prose was written.**

This record states what was built, what was measured, and what is still not true.
Every number here comes from a committed file and can be regenerated with
`npm run topics`, `npm run variants` and `npm run coverage:delta`.

---

## 1 · What was built

| Piece | Where | What it does |
|---|---|---|
| The mapping rules | `scripts/topic-mapping.mjs` | Decides which topic a question belongs to. Kept apart from the file writer so the rules can be exercised against any term list. |
| The approved terms | `scripts/topic-terms.mjs` | The reviewable record of what each topic is allowed to claim. A term that is not here cannot match anything. |
| The map builder | `scripts/build-topics.mjs` | Writes `src/data/topics.json`. `--check` rebuilds in memory and fails if the committed file differs. |
| The coverage library | `src/lib/coverage.ts` | Reads the map and answers: what is covered, what is not, and what a reviewer has to settle. |
| The dashboard | `src/pages/coverage/index.astro` | The learner- and reviewer-facing map, with the gaps and their reasons beside the numbers. |
| The authoring desk | `src/pages/workspace/topics.astro` | Where a reviewer inspects the map, the generated exercises and the queue. |
| The exercise generator | `scripts/build-variants.mjs` | Builds original exercises at build time from declared templates, and checks each one against an independent re-solve. |
| The delta | `scripts/measure-coverage.mjs` | Compares the current map with the map as it stood at the start of the phase. |

---

## 2 · The rules, and why they are conservative

A question is mapped to a topic when its stem or options contain an approved
term as a **whole word or phrase**. Four things stop the mapper from
inventing a link:

1. **Subject scoping.** A question is only ever considered against the topics
   of its own subject. A mechanics word cannot claim a chemistry question.
2. **Whole-phrase boundaries.** "Integral" does not match inside "particular
   integral". The first version of the mapper used a plain substring test and
   produced 52 false ties; the boundary check is what removed them.
3. **Weak terms.** A term like "force" or "energy" appears in questions from
   several topics, so it only counts inside a longer phrase.
4. **Specificity weighting.** The weight is the sum of the lengths of the
   distinct matching terms, so a specific phrase outranks a common word.

**A tie is never broken by guesswork.** When two topics match equally well,
the question is left unmapped and listed for review with the evidence for
both sides. This is why the map can honestly report zero ties: the seven ties
that existed at the start of the phase were resolved by removing the
ambiguous term that caused them, not by picking a winner.

---

## 3 · What the map says now

```
286 questions mapped · 146 unmapped · 0 ties · 258 outside the syllabus
39 of 42 topics have markable coverage
```

| Subject | Topics covered | Broad | Moderate | Thin | Not covered |
|---|---|---|---|---|---|
| Mathematics | 11 of 11 | 3 | 4 | 4 | 0 |
| Physics | 15 of 15 | 1 | 3 | 11 | 0 |
| Chemistry | 8 of 8 | 1 | 3 | 4 | 0 |
| Electrical | 5 of 8 | 0 | 2 | 3 | 3 |

**Bands.** Broad is 8 or more markable questions across 3 or more papers.
Moderate is 4 or more across 2 or more. Thin is anything else that has at
least one. None is zero. The thresholds are published so the bands can be
argued with rather than taken on trust.

**What a band does not mean.** A band counts questions and papers. It does not
say a topic is understood, does not rank difficulty, and does not predict a
score. The dashboard says this in its own words, under the heading "What this
page does not say".

**The 258 questions outside the syllabus.** The 2017, 2018, 2019 and 2021
papers each carried a Fundamentals of Computers section. The 2026 syllabus
does not list that subject. Those questions are recorded in their own bucket
with the reason attached, rather than left to look like a mapping failure.
They are never counted as coverage, and `tests/phase07.test.mjs` asserts that
no question is both outside the syllabus and mapped.

---

## 4 · The measured delta

The baseline is not a note and not a hand-written set of figures. The
pre-expansion term lists are stored in `scripts/topic-terms-baseline.json`,
and `scripts/find-baseline-split.mjs` has proved that those lists reproduce
the recorded starting figures **exactly**: 212 questions mapped, 478 unmapped,
7 ties, 34 topics covered, with the per-subject breakdown
(mathematics 10, physics 13, chemistry 5, electrical 6) matching as well. The
search rejects any combination that does not reproduce every figure, and
writes nothing when it fails.

| Measure | Start of phase | Now | Change |
|---|---|---|---|
| Topics with a markable question | 34 | 39 | **+5** |
| Questions mapped to a topic | 212 | 286 | **+74** |
| Broad topics | 4 | 5 | +1 |
| Moderate topics | 7 | 12 | +5 |
| Thin topics | 23 | 22 | −1 |
| Ties left for a reviewer | 7 | 0 | **−7** |
| Questions still unmapped | 478 | 404 | −74 |

The six topics that went from no markable question to some: Partial
Differentiation (5 questions, moderate), Units and dimensions (3, thin),
Gravitation (2, thin), Chemical equilibrium (1, thin), Metallurgy (1, thin),
Water (2, thin).

**Eight questions moved to a better-fitting topic.** These are corrections,
not losses: the question was sitting in the wrong topic, and both topics'
counts changed. Each move was checked against the syllabus wording.

| Question | Moved from | Moved to | Why it is right |
|---|---|---|---|
| 2025 Q13 — a determinant chosen at random | Determinants | Probability | "Chosen at random" makes it a random experiment, not a determinant calculation. |
| 2022 Q29 — digits in random order | Ordinary Differential Equations | Probability | A probability question that the word "probability" had pulled into ODE. |
| 2025 Q67 — a block over a smooth pulley | Kinematics | Laws of motion | Newton's laws and pulley tension, not motion description. |
| 2025 Q68 — a planet in an elliptical orbit | Work, power, energy | Laws of motion | Orbital motion is a law-of-motion question, not an energy one. |
| 2022 Q55 — an isobaric process of a monatomic gas | Work, power, energy | Thermodynamics | An isobaric process with a P–V graph is a thermodynamics question. |
| 2025 Q45 — a particle shifted under forces | Work, power, energy | Thermodynamics | A vector-work question; "work done by" was the only phrase it matched. |
| 2022 Q78 — a hydroxide that dissolves in KOH and ammonia | Oxidation and reduction | Acids, bases and salts | An amphoteric hydroxide is an acid–base property, not a redox one. |
| 2022 Q92 — impedance referred to primary | AC circuits | Transformers | A transformer question that the word "impedance" had pulled into AC circuits. |

Two of these moves were **not** corrections, and the terms that caused them
were withdrawn:

- "maximum value of" and "minimum value of" had been placed in Differential
  Calculus. They belong to Application of Derivative, whose syllabus detail
  names "maxima/minima (one variable)". Withdrawn from one topic, approved
  for the other. 2024 Q19 moved accordingly.
- "molecules have" and "molecule of" were too generic for Organic Chemistry
  and pulled 2024 Q84 — a question about a molecule with one lone pair, which
  is a Chemical Bonding question — out of bonding. Withdrawn. The question is
  now mapped back to Chemical Bonding on its own evidence, "lone pair", which
  is where it belongs.

**The delta is a count.** It says the corpus now reaches five more topics
than it did. It does not say a learner has learned anything, and no number on
the dashboard or in this document is evidence of pedagogical efficacy. The
learner-transfer evidence remains explicitly untested and owner-waived.

---

## 5 · The three topics that are still uncovered

| Topic | Questions held | Why |
|---|---|---|
| DC circuits | 4 | Every question the corpus holds for this topic depends on a diagram the transcription does not reproduce. |
| AC circuits | 13 | The same. |
| Digital electronics | 2 | The same. |

This is a **corpus limit, not a mapper limit**. No term list can fix it: a
question whose diagram was never transcribed cannot be matched by its text,
and the owner rule is that a diagram-dependent item is held, never scored,
and never counted as coverage. The dashboard shows all three with this
reason attached, and they appear in the review queue as gaps rather than
being quietly absent.

Closing them needs either a transcription of the missing diagrams or an
original exercise for each. The generator reaches two of the three topics
(`electrical-t04`, `electrical-t05`), but a generated exercise is not the
same as a past-year question and is not counted as past-year coverage.

---

## 6 · The original-exercise toolchain

`scripts/build-variants.mjs` produces **14 exercises from 4 declared
templates**. Every template declares its equation, its ranges, its
exclusions, its unit and its seed. Nothing is generated at runtime: a
learner never sees a question produced in their browser.

**The checks.** Each generated item must survive:

- an **independent re-solve** — a second implementation transcribed from the
  equation, not from the generator's code, must agree with the stated answer;
- **unique options** — no repeated value, four options exactly;
- **a single answer** — exactly one option may be right, checked against the
  independent solve rather than against the generator's own claim;
- **its own exclusions** — a draw that breaks a declared exclusion is
  discarded and redrawn, up to a limit, and the count of discarded draws is
  recorded.

**Two real bugs the checks caught during development**, both of which would
have shipped silently:

1. The answer was in position A for every single item. The placement logic
   was replacing a value that was already in the right slot rather than
   moving the correct option into it. The fix moved the option; the check
   that catches it is now permanent — a batch where every answer sits in the
   same position fails the build.
2. The seeded generator's first output clustered low, so the placement was
   not actually seeded. Fixed by mixing the seed before the first draw.

**What 14 exercises is worth.** Very little on its own, and the generator
says so. A template that produces the same shape many times adds one shape.
The item count is not evidence of coverage: the coverage map counts what a
learner can meet, and it counts the corpus, not the generator. The 14
exercises exist so the toolchain can be verified, and every one of them is
labelled `original:` with its provenance stated.

---

## 7 · The review queue

The queue is what the mapper refused to decide. It has three kinds, and the
dashboard renders each with its evidence:

| Kind | Count | What a reviewer settles |
|---|---|---|
| Tie | 0 | Two topics claimed the question equally well. |
| Unmapped | 146 | A question in a syllabus subject that no approved term matched. |
| Gap | 3 | A topic with no markable question at all. |

The 146 unmapped questions are not errors and not a backlog of promises.
They are questions whose text does not contain an approved term for any topic
in their subject — an aggressive question on a topic whose wording the
syllabus uses differently, or a question that needs a diagram. Each one is
listed with its stem, so a reviewer can decide whether to approve a term, and
the delta will move when they do.

---

## 8 · Verification

| Check | Result |
|---|---|
| `npm run check` | 63 files, 0 errors, 0 warnings |
| `npm run build` | 42 pages |
| `npm run topics:check` | the committed map matches a fresh build |
| `npm run variants:check` | the committed exercises match a fresh build |
| `npm run test:rules` | 19 / 19 |
| `npm run test:phase05` | 27 / 27 |
| `npm run test:phase06` | 12 / 12 |
| `npm run test:phase07` | 22 / 22 |
| `npm run test:browser` | 36 / 36 |

**The Phase 07 suite** (`tests/phase07.test.mjs`, 22 tests) asserts the
properties that matter rather than the numbers:

- every question in the corpus is accounted for exactly once;
- a question is only mapped inside its own subject;
- every mapping names the terms that produced it;
- a held question is never counted as coverage, and the counts are checked
  against the records;
- the covered-year count is the count of distinct papers;
- the headline counts agree with the records they summarise;
- every generated exercise survives an independent re-solve and has exactly
  one correct option;
- the answer is not always in the same position;
- the corpus was not modified to make the coverage look better — the three
  published papers keep their original question counts;
- the read-only papers are still read-only.

**The browser suite** grew from 30 to 36. The new tests check that the
dashboard states the real numbers, that every topic card shows the evidence
for its mapping, that the review queue lists all three kinds, that the desk
and the dashboard agree with each other and with the map file, that no topic
card claims more than it has, and that the coverage pages survive the network
being switched off.

---

## 9 · What is still not true

- **No lesson prose was written.** This phase is the toolchain and the map.
  A learner who is not comfortable with a topic still has nothing new to
  read. That work is not started.
- **Three topics have no markable coverage**, for the reason above.
- **146 questions are unmapped.** They are visible and reviewable, not
  resolved.
- **No transfer evidence exists.** The exercises are checked for arithmetic
  correctness, not for whether they teach anything. The independent
  learner-transfer task remains untested and owner-waived.
- **The generated exercises are not past-year questions** and are not counted
  as such anywhere.
- **The three uncovered electrical topics need a decision** that only the
  owner can make: transcribe the missing diagrams, write original exercises
  for each, or leave the gap stated.

---

## 10 · Files

```
scripts/topic-mapping.mjs              the mapping rules
scripts/topic-terms.mjs                the approved terms
scripts/topic-terms-baseline.json      the pre-expansion terms (the baseline)
scripts/topic-terms-added.json         the terms Phase 07 added
scripts/topic-terms-restored.json      the terms removed again to clear ties
scripts/build-topics.mjs               writes src/data/topics.json
scripts/build-variants.mjs             writes src/data/variants.json
scripts/find-baseline-split.mjs        proves the baseline against the recorded figures
scripts/measure-coverage.mjs           writes the delta
src/lib/coverage.ts                    the coverage library
src/lib/authoring.ts                   the authoring library
src/pages/coverage/index.astro         the dashboard
src/pages/workspace/topics.astro       the authoring desk
src/data/topics.json                   the map (204 KB)
src/data/variants.json                 the exercises (15 KB)
docs/phases/07-expansion/coverage-baseline.json
docs/phases/07-expansion/coverage-delta.json
tests/phase07.test.mjs                 22 tests
```
