# 2017 · authorised text-layer slice — complete for the whole paper

**Task:** `09-2017` · **Step:** 09.4 (authorised provisional pass, complete) ·
**Mode:** RESEARCH · **Date:** 2026-11-20

**What this is.** On 2026-11-20 the owner authorised a text-layer-only subset to be solved
as `derived-provisional`, for all four years, because no page image can be produced in this
sandbox. This file records the 2017 pass, now **complete**: every item in the computed
subset is solved, and every item outside it carries a specific reason.

**Headline:** **83 of 100 solved**, 23 of them
machine-checked by two re-runnable scripts; **17 unsolved**, of which 15 are outside the
subset and 2 are held because the transcribed options contain no correct answer.

**What this is not.** It is not a key. Nothing is `derived-verified`, nothing has been read
from a printed page, `eligibleCount` is 0, and **nothing here may be scored.**

---

## 1 · Coverage by section

| Section | Range | Solved | Machine-checked | Unsolved |
|---|---|---:|---:|---:|
| Mathematics | Q1–Q20 | 17 | 11 | 3 |
| Electrical Technology | Q21–Q35 | 15 | 5 | 0 |
| Computer Application | Q36–Q55 | 19 | 1 | 1 |
| Environmental Engineering | Q56–Q70 | 14 | 0 | 1 |
| Engineering Mechanics | Q71–Q85 | 9 | 5 | 6 |
| Strength of Materials | Q86–Q100 | 9 | 1 | 6 |
| **Total** | Q1–Q100 | **83** | **23** | **17** |

An asterisk in the grid marks a machine-checked item.

---

## 2 · The answer grid

**Mathematics (Q1–Q20)**

```
**1** B* | 2 — | **3** B* | **4** D | **5** A* | **6** C* | **7** C*
**8** B* | **9** C | **10** D | **11** A* | **12** D | **13** C* | **14** B
**15** D | **16** B* | 17 — | 18 — | **19** D* | **20** B*
```

**Electrical Technology (Q21–Q35)**

```
**21** A* | **22** C | **23** B* | **24** B | **25** D | **26** A | **27** A
**28** C* | **29** A | **30** A* | **31** B* | **32** B | **33** D | **34** B
**35** B
```

**Computer Application (Q36–Q55)**

```
**36** C | **37** C | **38** B | **39** A | **40** A | **41** A | **42** C
**43** B | **44** D | **45** C | **46** D | **47** C | **48** A | **49** C
**50** C | **51** D* | **52** B | **53** A | **54** B | 55 —
```

**Environmental Engineering (Q56–Q70)**

```
**56** A | **57** C | **58** D | **59** B | **60** A | **61** B | **62** A
**63** C | **64** A | **65** C | **66** A | **67** B | **68** C | **69** A
70 —
```

**Engineering Mechanics (Q71–Q85)**

```
**71** A | 72 — | 73 — | **74** C* | 75 — | **76** C | **77** A*
**78** C | **79** A* | **80** B* | 81 — | **82** B | 83 — | **84** A*
85 —
```

**Strength of Materials (Q86–Q100)**

```
**86** D | **87** A | **88** D | 89 — | 90 — | 91 — | **92** B
**93** A | **94** A | **95** C | **96** D* | 97 — | 98 — | **99** D
100 —
```

---

## 3 · The 17 unsolved items

| Q | Reason | Note |
|---|---|---|
| 2 | corpus-defect | The transcribed options contain no correct answer for general n. adj(kA) = k^(n-1) adj(A); option A is the n = 2 special case, option D is the recipro |
| 17 | corpus-defect | The corpus stem reads '1, 2, 4, 8, 16, 2', which is not a well-formed series, and the option that matches the mathematics (2^((n-1)/2)) is not among t |
| 18 | corpus-defect | Excluded from the authorised slice: the corpus carries a substituted textbook example for this item (2017 pre-flight). The printed question was not re |
| 55 | options-not-reproduced | Outside the authorised text-layer slice: printed section heading bled into option D. |
| 70 | options-not-reproduced | Outside the authorised text-layer slice: printed section heading bled into option D. |
| 72 | figure-not-reproduced | Outside the authorised text-layer slice: figure-dependent. |
| 73 | figure-not-reproduced | Outside the authorised text-layer slice: figure-dependent. |
| 75 | figure-not-reproduced | Outside the authorised text-layer slice: figure-dependent. |
| 81 | figure-not-reproduced | Outside the authorised text-layer slice: figure-dependent. |
| 83 | options-not-reproduced | Outside the authorised text-layer slice: corpus carries 1 options, not 4. |
| 85 | options-not-reproduced | Outside the authorised text-layer slice: printed section heading bled into option D. |
| 89 | figure-not-reproduced | Outside the authorised text-layer slice: figure-dependent. |
| 90 | figure-not-reproduced | Outside the authorised text-layer slice: figure-dependent. |
| 91 | figure-not-reproduced | Outside the authorised text-layer slice: figure-dependent. |
| 97 | options-not-reproduced | Outside the authorised text-layer slice: corpus carries 0 options, not 4. |
| 98 | figure-not-reproduced | Outside the authorised text-layer slice: figure-dependent. |
| 100 | options-not-reproduced | Outside the authorised text-layer slice: corpus carries 0 options, not 4. |

The two `corpus-defect` answers that are *not* outside the subset are Q2 and Q17: both passed
the mechanical filter and still could not be answered, because no transcribed option is
correct. They are held rather than guessed, and one page image each would settle them.

---

## 4 · Reproducing every check

```
node scripts/validate-keys.mjs                                    # schema: 0 errors
npm run test:keys                                                 # 12 tests
python3 editorial/derived-keys/2017/checks/math-q01-20.py         # 11 numeric checks
python3 editorial/derived-keys/2017/checks/engg-q21-100.py        # 12 numeric checks
```

Both scripts exit non-zero if any computed value drifts from what the key file claims, and
the test suite runs every command the key file names, so a claim and its evidence cannot
silently diverge. Items without a numeric check say why in `--list`; none carries a
fabricated `machineCheck`.

**Checks run:** validator PASS · 12/12 tests · 23/23 numeric checks · subset deterministic ·
`test:rules` PASS (no `src/` change) · 429 markdown links, 0 broken.

---

## 5 · Known weaknesses of this pass, stated plainly

1. **The input is the corpus, not the paper.** Every answer rests on a stem and four options
   that were never checked against a page. The 2017 pre-flight found 45 label conflicts and
   one substituted stem, so confidence in the input is moderate, not high.
2. **Recall-based items are the weakest.** Q56–Q70 (Environmental) and Q36–Q55 (Computer)
   are factual, not computable. Six of them are the ones I would re-check first against a
   page: **Q42** (both examples qualify), **Q57** (albedo 0.31), **Q60** (N,P,K versus N,P),
   **Q63** (L10 18-hour index), **Q86** (bulk endurance strength), **Q93** (most conservative
   theory).
3. **Q96's option set is only reachable one way.** The printed value comes out at 45.6 MPa
   only if the radial stress at the inner wall is included; a solver who computes the 2-D
   maximum shear gets 22.5 MPa and finds no matching option. That is recorded in the item's
   verification, not hidden.

---

## 6 · What would upgrade this

1. **A page image of any item** makes it a candidate for `derived-verified` — with a second
   independent pass, per the tier definition. It cannot be promoted on one reading.
2. **One image each for Q2 and Q17** closes two items that no amount of solving can fix.
3. **A second solver on the same 83 items** is the cheapest quality signal available without
   images: disagreements would point straight at the recall-based answers in §5.2.
