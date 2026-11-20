# 2019 · authorised text-layer slice

**Mode:** RESEARCH · **Date:** 2026-11-20 ·
**Key file:** [`2019-keys.json`](2019-keys.json)

**Headline:** **79 of 100 solved** as `derived-provisional`, 19 machine-checked;
**21 unsolved** — `no-approved-tier` 79 · `corpus-defect` 10 · `options-not-reproduced` 6 · `figure-not-reproduced` 3 · `absent-from-corpus` 2. **Nothing is `derived-verified`, `eligibleCount` is
0, and nothing here may be scored.**

This record is generated from the key file by `scripts/render-slice-record.py`, so the two
cannot drift apart.

---

## 1 · Coverage by section

| Section | Range | Solved | Machine-checked | Unsolved |
|---|---|---:|---:|---:|
| Mathematics | Q1–Q20 | 18 | 9 | 2 |
| Electrical Technology | Q21–Q35 | 15 | 2 | 0 |
| Computer Application | Q36–Q55 | 16 | 2 | 4 |
| Environmental Engineering | Q56–Q70 | 14 | 0 | 1 |
| Engineering Mechanics | Q71–Q85 | 6 | 3 | 9 |
| Strength of Materials | Q86–Q100 | 10 | 3 | 5 |
| **Total** | Q1–Q100 | **79** | **19** | **21** |

An asterisk in the grid marks a machine-checked item.

---

## 2 · The answer grid


**Mathematics (Q1–Q20)**

```
**1** B | **2** B* | **3** B* | **4** B* | **5** D | **6** B | **7** C
**8** A | **9** D | **10** C | **11** C* | **12** B | 13 — | **14** D
**15** B* | **16** C* | **17** D* | **18** C* | 19 — | **20** B*
```

**Electrical Technology (Q21–Q35)**

```
**21** D | **22** B* | **23** C* | **24** A | **25** C | **26** C | **27** D
**28** C | **29** D | **30** D | **31** D | **32** B | **33** B | **34** C
**35** D
```

**Computer Application (Q36–Q55)**

```
**36** B | **37** C | **38** C | **39** A* | **40** A* | 41 — | **42** A
**43** D | **44** C | **45** B | **46** A | 47 — | **48** A | 49 —
**50** C | **51** C | **52** B | **53** B | **54** C | 55 —
```

**Environmental Engineering (Q56–Q70)**

```
**56** B | **57** B | **58** B | **59** C | **60** A | **61** B | **62** A
**63** B | **64** D | **65** B | **66** A | **67** A | **68** A | **69** B
70 —
```

**Engineering Mechanics (Q71–Q85)**

```
**71** B | **72** C* | 73 — | **74** B* | 75 — | 76 — | 77 —
78 — | 79 — | **80** B | 81 — | **82** A* | **83** B | 84 —
85 —
```

**Strength of Materials (Q86–Q100)**

```
**86** A | 87 — | **88** C* | **89** C* | 90 — | 91 — | 92 —
**93** B | 94 — | **95** C | **96** D | **97** A | **98** C | **99** B
**100** D*
```

---

## 3 · The 21 unsolved items

| Q | Reason | Note |
|---|---|---|
| 13 | `corpus-defect` | Outside the authorised text-layer slice: option (B) is an unprinted option replacing a printed one; order changed (2019-preflight). |
| 19 | `corpus-defect` | The options bracket 1.62 to 1.65, while bisection on sqrt(3) converges to 1.732 and no printed option carries it. The stem or the options are corrupted in the corpus; solving it would mean p |
| 41 | `corpus-defect` | Outside the authorised text-layer slice: stem substituted: (0.875)10 in the corpus, (0.6975)10 in the booklet (2019-preflight). |
| 47 | `corpus-defect` | Outside the authorised text-layer slice: the C program itself was rewritten, changing what is asked (2019-preflight). |
| 49 | `corpus-defect` | Outside the authorised text-layer slice: options (C) and (D) altered from the print (2019-preflight). |
| 55 | `options-not-reproduced` | Outside the authorised text-layer slice: printed section heading bled into option D. |
| 70 | `options-not-reproduced` | Outside the authorised text-layer slice: printed section heading bled into option D. |
| 73 | `corpus-defect` | Outside the authorised text-layer slice: one printed option lost, another duplicated (2019-preflight). |
| 75 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 76 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 77 | `corpus-defect` | Outside the authorised text-layer slice: empty stem in the corpus. |
| 78 | `absent-from-corpus` | Outside the authorised text-layer slice: absent from the corpus. |
| 79 | `absent-from-corpus` | Outside the authorised text-layer slice: absent from the corpus. |
| 81 | `corpus-defect` | Total momentum (10, 20) over 15 kg gives 1.491 m/s = 2 sqrt(5)/3, which is not among 2 sqrt(2)/3, 2 sqrt(3)/3, 2 sqrt(3) and 3 sqrt(2). Held rather than forced onto the nearest option. |
| 84 | `figure-not-reproduced` | Outside the authorised text-layer slice: figure-dependent. |
| 85 | `options-not-reproduced` | Outside the authorised text-layer slice: printed section heading bled into option D. |
| 87 | `corpus-defect` | Outside the authorised text-layer slice: a printed option dropped and an unprinted one invented (2019-preflight). |
| 90 | `options-not-reproduced` | Outside the authorised text-layer slice: corpus carries 0 options, not 4. |
| 91 | `options-not-reproduced` | Outside the authorised text-layer slice: corpus carries 0 options, not 4. |
| 92 | `corpus-defect` | The corpus stem breaks off mid-sentence at 'If axial load capacity (b', so the width-to-depth ratio that decides between 1/2, 1/4, 1/8 and 1/16 is missing. The answer cannot be fixed without |
| 94 | `options-not-reproduced` | Outside the authorised text-layer slice: corpus carries 0 options, not 4. |

---

## 4 · Reproducing every check

```
node scripts/validate-keys.mjs                                   # schema, all years
npm run test:keys                                                # test suite
python3 editorial/derived-keys/2019/checks/math-q01-20.py and engg-q21-100.py
```

Each check returns `(observed, agree)` and the script exits non-zero if any item drifts
from what the key file claims. Items without a numeric check say why in `--list`; none
carries a fabricated `machineCheck`.

---

## 5 · Weakest answers, named

The input is the corpus text, never the printed page. Within that, these are the answers I
would re-check first against a page — recall-based items where a single wrong fact is not
detectable by any computation:

1. **Q36** (first partition mapped to the local descriptor table, a textbook convention rather than a law)
2. **Q44** (true-statement item: C is the only defensible option, but the wording of the others is loose)
3. **Q56** (scope of an environmental audit, answered by elimination)
4. **Q58** (stability expressed as 'dry adiabatic > ambient', which is one of two equivalent phrasings)
5. **Q66** (composting and 'stable organic matter', where the option wording is doing the work)

---

## 6 · What would upgrade this

1. A page image makes an item a *candidate* for `derived-verified` — it still needs a second
   independent pass, per the tier definition.
2. An image of any item currently `corpus-defect` closes something no amount of solving can.
3. A second solver over the same items is the cheapest quality signal available without
   images: disagreements point straight at §5.
