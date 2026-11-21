# 2021 · authorised text-layer slice

**Mode:** RESEARCH · **Date:** 2026-11-20 ·
**Key file:** [`2021-keys.json`](2021-keys.json)

**Headline:** **76 of 100 solved** as `derived-provisional`, 25 machine-checked;
**24 unsolved** — `no-approved-tier` 76 · `figure-not-reproduced` 14 · `options-not-reproduced` 5 · `corpus-defect` 3 · `ambiguous-input` 2. **Nothing is `derived-verified`, `eligibleCount` is
0, and nothing here may be scored.**

This record is generated from the key file by `scripts/render-slice-record.py`, so the two
cannot drift apart.

---

## 1 · Coverage by section

| Section | Range | Solved | Machine-checked | Unsolved |
|---|---|---:|---:|---:|
| Mathematics | Q1–Q20 | 17 | 10 | 3 |
| Electrical Technology | Q21–Q35 | 11 | 2 | 4 |
| Computer Application | Q36–Q55 | 19 | 1 | 1 |
| Environmental Engineering | Q56–Q70 | 14 | 0 | 1 |
| Engineering Mechanics | Q71–Q85 | 5 | 5 | 10 |
| Strength of Materials | Q86–Q100 | 10 | 7 | 5 |
| **Total** | Q1–Q100 | **76** | **25** | **24** |

An asterisk in the grid marks a machine-checked item.

---

## 2 · The answer grid


**Mathematics (Q1–Q20)**

```
**1** B | 2 — | 3 — | **4** B* | **5** B | **6** B* | **7** A*
**8** A* | **9** D | **10** D | **11** B* | **12** B* | **13** D* | **14** B*
**15** A | 16 — | **17** C | **18** D | **19** C* | **20** A*
```

**Electrical Technology (Q21–Q35)**

```
21 — | **22** C* | **23** A* | **24** D | **25** A | 26 — | **27** B
**28** C | **29** C | **30** D | **31** B | **32** C | 33 — | **34** B
35 —
```

**Computer Application (Q36–Q55)**

```
**36** A* | **37** D | **38** B | **39** C | **40** A | **41** B | **42** D
**43** B | **44** B | **45** D | **46** D | **47** C | **48** B | **49** A
**50** D | **51** A | **52** D | **53** D | **54** B | 55 —
```

**Environmental Engineering (Q56–Q70)**

```
**56** C | **57** B | **58** C | **59** C | **60** C | **61** B | **62** C
**63** C | **64** B | **65** B | **66** D | **67** A | **68** B | **69** A
70 —
```

**Engineering Mechanics (Q71–Q85)**

```
**71** C* | 72 — | 73 — | 74 — | 75 — | **76** B* | 77 —
78 — | **79** D* | 80 — | 81 — | **82** B* | **83** D* | 84 —
85 —
```

**Strength of Materials (Q86–Q100)**

```
**86** B | **87** B* | **88** D* | 89 — | **90** B* | **91** C* | **92** B
93 — | 94 — | 95 — | **96** D* | **97** C* | **98** D* | 99 —
**100** B
```

---

## 3 · The 24 unsolved items

| Q | Reason | Note |
|---|---|---|
| 2 | `corpus-defect` | The printed sums were evaluated for n = 3 to 6 and give 12, 52, 205 and 786, while the options (2nC_n, 2nC_(n-1), nC_(n-1), nC_(n+1)) are three orders of magnitude smaller. The matrix indexi |
| 3 | `corpus-defect` | Outside the authorised text-layer slice: determinant rows reordered by the transcription (2021-preflight). |
| 16 | `corpus-defect` | Outside the authorised text-layer slice: two printed options not represented; option (A) lost its constant (2021-preflight). |
| 21 | `figure-not-reproduced` | The stem is 'the value of the voltage source E in the given circuit', and the circuit exists only as a figure. The options (-16, 4, -6, 16 V) cannot be discriminated from text alone. |
| 26 | `options-not-reproduced` | Outside the authorised text-layer slice: corpus carries 0 options, not 4. |
| 33 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 35 | `options-not-reproduced` | Outside the authorised text-layer slice: corpus carries 0 options, not 4. |
| 55 | `options-not-reproduced` | Outside the authorised text-layer slice: printed section heading bled into option D. |
| 70 | `options-not-reproduced` | Outside the authorised text-layer slice: printed section heading bled into option D. |
| 72 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 73 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 74 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 75 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 77 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 78 | `ambiguous-input` | The two defensible limiting-friction models give 1:1 (pure translation) and 2:1 (rotation about the far end), and neither appears in the options; the printed 1:(sqrt2+1) and 1:(2sqrt2+1) nee |
| 80 | `ambiguous-input` | With pitch 2 pi/210 m, arm 1.8 m and W = 1100 N the ideal effort is 2.91 N, while the options cluster near 24/27 to 1 N, which requires an efficiency of about 33% that the stem never states. |
| 81 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 84 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 85 | `options-not-reproduced` | Outside the authorised text-layer slice: printed section heading bled into option D. |
| 89 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 93 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 94 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 95 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 99 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |

---

## 4 · Reproducing every check

```
node scripts/validate-keys.mjs                                   # schema, all years
npm run test:keys                                                # test suite
python3 editorial/derived-keys/2021/checks/math-q01-20.py and engg-q21-100.py
```

Each check returns `(observed, agree)` and the script exits non-zero if any item drifts
from what the key file claims. Items without a numeric check say why in `--list`; none
carries a fabricated `machineCheck`.

---

## 5 · Weakest answers, named

The input is the corpus text, never the printed page. Within that, these are the answers I
would re-check first against a page — recall-based items where a single wrong fact is not
detectable by any computation:

1. **Q41** (infix to postfix: one operator stack is the standard answer, but option A's two-stack reading is defensible)
2. **Q50** (printing a pointer through %d is undefined behaviour; 'address' is the expected output, not a guaranteed one)
3. **Q63** (the 5000 mg/L threshold for saline water is a convention, not a sharp boundary)
4. **Q66** ('all of these' for radioactive-waste disposal, where each listed method is used at some stage)
5. **Q69** (100 dBA as the damage threshold, where the physiological limit is nearer 85-90 dBA)

---

## 6 · What would upgrade this

1. A page image makes an item a *candidate* for `derived-verified` — it still needs a second
   independent pass, per the tier definition.
2. An image of any item currently `corpus-defect` closes something no amount of solving can.
3. A second solver over the same items is the cheapest quality signal available without
   images: disagreements point straight at §5.
