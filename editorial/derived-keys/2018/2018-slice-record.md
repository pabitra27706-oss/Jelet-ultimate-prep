# 2018 · authorised text-layer slice

**Mode:** RESEARCH · **Date:** 2026-11-20 ·
**Key file:** [`2018-keys.json`](2018-keys.json)

**Headline:** **83 of 100 solved** as `derived-provisional`, 19 machine-checked;
**17 unsolved** — `no-approved-tier` 83 · `figure-not-reproduced` 9 · `corpus-defect` 4 · `options-not-reproduced` 4. **Nothing is `derived-verified`, `eligibleCount` is
0, and nothing here may be scored.**

This record is generated from the key file by `scripts/render-slice-record.py`, so the two
cannot drift apart.

---

## 1 · Coverage by section

| Section | Range | Solved | Machine-checked | Unsolved |
|---|---|---:|---:|---:|
| Mathematics | Q1–Q20 | 17 | 6 | 3 |
| Electrical Technology | Q21–Q35 | 13 | 7 | 2 |
| Computer Application | Q36–Q55 | 19 | 0 | 1 |
| Environmental Engineering | Q56–Q70 | 14 | 0 | 1 |
| Engineering Mechanics | Q71–Q85 | 8 | 3 | 7 |
| Strength of Materials | Q86–Q100 | 12 | 3 | 3 |
| **Total** | Q1–Q100 | **83** | **19** | **17** |

An asterisk in the grid marks a machine-checked item.

---

## 2 · The answer grid


**Mathematics (Q1–Q20)**

```
**1** B* | 2 — | **3** D | **4** A* | **5** B* | **6** A | **7** C
**8** B | **9** B* | **10** A | **11** B | **12** B | 13 — | **14** C*
**15** C | **16** D | **17** B | **18** B | 19 — | **20** D*
```

**Electrical Technology (Q21–Q35)**

```
**21** B | **22** B* | **23** A* | **24** C* | **25** A* | **26** B* | 27 —
**28** A | **29** B | **30** A* | 31 — | **32** C | **33** D | **34** B*
**35** A
```

**Computer Application (Q36–Q55)**

```
**36** C | **37** A | **38** B | **39** A | **40** C | **41** B | **42** A
**43** C | **44** C | **45** B | **46** A | **47** B | **48** D | **49** A
**50** B | **51** D | **52** C | **53** B | **54** B | 55 —
```

**Environmental Engineering (Q56–Q70)**

```
**56** A | **57** C | **58** B | **59** A | **60** D | **61** C | **62** D
**63** B | **64** D | **65** B | **66** B | **67** A | **68** A | **69** A
70 —
```

**Engineering Mechanics (Q71–Q85)**

```
**71** C | **72** C* | 73 — | 74 — | **75** C | **76** B | **77** D
78 — | 79 — | 80 — | **81** B | 82 — | **83** C* | **84** D*
85 —
```

**Strength of Materials (Q86–Q100)**

```
**86** B | **87** D | **88** C | 89 — | 90 — | 91 — | **92** A
**93** C | **94** D* | **95** C | **96** D* | **97** A | **98** D | **99** C*
**100** C
```

---

## 3 · The 17 unsolved items

| Q | Reason | Note |
|---|---|---|
| 2 | `corpus-defect` | Outside the authorised text-layer slice: stem substituted; the corpus determinant vanishes only at x = 10, not an option (2018-preflight). |
| 13 | `corpus-defect` | Outside the authorised text-layer slice: stem substituted with a different textbook example (2018-preflight). |
| 19 | `corpus-defect` | Outside the authorised text-layer slice: stem substituted with a different textbook example (2018-preflight). |
| 27 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 31 | `corpus-defect` | Held: the standard result for the copper ratio of a 3-phase 3-wire to a 1-phase 2-wire system, under the stated conditions, is 0.5, and no option offers it. Option A (0.67) corresponds to a  |
| 55 | `options-not-reproduced` | Outside the authorised text-layer slice: printed section heading bled into option D. |
| 70 | `options-not-reproduced` | Outside the authorised text-layer slice: printed section heading bled into option D. |
| 73 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 74 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 78 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 79 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 80 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 82 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 85 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 89 | `options-not-reproduced` | Outside the authorised text-layer slice: corpus carries 0 options, not 4. |
| 90 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 91 | `options-not-reproduced` | Outside the authorised text-layer slice: corpus carries 0 options, not 4. |

---

## 4 · Reproducing every check

```
node scripts/validate-keys.mjs                                   # schema, all years
npm run test:keys                                                # test suite
python3 editorial/derived-keys/2018/checks/computable-2018.py
```

Each check returns `(observed, agree)` and the script exits non-zero if any item drifts
from what the key file claims. Items without a numeric check say why in `--list`; none
carries a fabricated `machineCheck`.

---

## 5 · Weakest answers, named

The input is the corpus text, never the printed page. Within that, these are the answers I
would re-check first against a page — recall-based items where a single wrong fact is not
detectable by any computation:

1. **Q60** (MIC as contaminant and pollutant)
2. **Q64** (Indore is the aerobic method)
3. **Q37** (which diskette/hard-disk claim is true)
4. **Q77** (lift reading)
5. **Q92** (isotropic plane stress)
6. **Q97** (ordering of yield criteria)

---

## 6 · What would upgrade this

1. A page image makes an item a *candidate* for `derived-verified` — it still needs a second
   independent pass, per the tier definition.
2. An image of any item currently `corpus-defect` closes something no amount of solving can.
3. A second solver over the same items is the cheapest quality signal available without
   images: disagreements point straight at §5.
