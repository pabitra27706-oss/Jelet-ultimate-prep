# 2017 · authorised text-layer slice — first batch, Mathematics Q1–Q20

**Task:** `09-2017` · **Step:** 09.4 partial (authorised provisional pass) ·
**Mode:** RESEARCH · **Date:** 2026-11-20 · **Batch:** 1 of the Mathematics block

**What this is.** On 2026-11-20 the owner authorised a text-layer-only subset to be solved
as `derived-provisional`, for all four years, because no page image can be produced in this
sandbox. This file records the first batch of that authorisation for 2017: the 19 Mathematics
items that the computed slice contains, of which **17 are solved** and **2 are held for
transcription doubt**. Everything else in the paper is an `unsolved` entry in
[`2017-keys.json`](2017-keys.json) with a specific reason.

**What this is not.** It is not a key. Nothing here may be scored, nothing is
`derived-verified`, and no answer has been checked against a printed page. The 83 items
outside this batch are not implied to be wrong or unanswerable — they are not yet attempted.

---

## 1 · The 17 solved items

Every entry is `derived-provisional`, `confidence: medium`, `optionFidelity:
corpus-text-unverified`, `scoringEligibility: held`, `holdReason: no-approved-tier`. The
reasoning and verification notes live in the JSON; this table is the index.

| Q | Answer | Basis | Machine check |
|---|---|---|---|
| 1 | **B** — perfect square | det of an even-order skew-symmetric matrix is the square of its Pfaffian; the *odd*-order case is the one forced to zero | yes — exact integer test over 100 sampled matrices |
| 3 | **B** — −3/2 | \|a+b+c\|² = 0 ⇒ 3 + 2Σ(a·b) = 0 | yes — numeric vector evaluation |
| 4 | **D** — 3 | each scalar triple product reduces to a unit vector dotted with itself | no — definitional |
| 5 | **A** | Δ(f/g) = (gΔf − fΔg)/[g(g+Δg)] | yes — both sides evaluated numerically |
| 6 | **C** — 0.694 | Simpson ⅓, h = 0.5 → 0.6944 (and *not* ln 2 = 0.6931) | yes |
| 7 | **C** — 3.05 | Newton–Raphson from x₀ = 3 converges to 3.0514 | yes — iteration |
| 8 | **B** — 0.693 | trapezoid with five ordinates gives 0.6970, nearest printed option 0.693 | yes |
| 9 | **C** — n³/3 + n² − n/3 | quoted forward-elimination operation count | no — not computable here |
| 10 | **D** — order 2, degree 2 | clearing the radical gives (x″)² = 16(x + x′²) | no — by inspection |
| 11 | **A** — x cos y + y sin x | exact: ∂M/∂y = ∂N/∂x, then integrate | yes — exactness + potential by finite differences |
| 12 | **D** — A cos 2x + B sin 2x | auxiliary roots m = ±2i | no — read off the roots |
| 13 | **C** — (2x+3)/4 | y_p = ax + b gives 4a = 2, 4b = 3 | yes — substitution residual |
| 14 | **B** — 2u | u = xy·f(y/x) is homogeneous of degree 2, Euler's theorem | no — theorem |
| 15 | **D** — 1/v | implicit differentiation; the x, y, z factors cancel exactly | no — symbolic |
| 16 | **B** — 3/8 | C(4,2)/2⁴ = 6/16 | yes |
| 19 | **D** — 0.2 | P(A∩B) = 0.2 − 0.1… = 0.1, then 0.1/0.5 | yes |
| 20 | **B** — (1/x²)e^(−1/x) | IF = exp∫(1−2x)/x² dx | yes — IF′/IF against the coefficient |

**Machine-checked: 11 of 17.** Reproduce all of them with

```
python3 editorial/derived-keys/2017/checks/math-q01-20.py        # all 11
python3 editorial/derived-keys/2017/checks/math-q01-20.py -q 8   # one
python3 editorial/derived-keys/2017/checks/math-q01-20.py --list # which items have no check
```

The script exits non-zero if any value drifts from what the key file claims, so the file and
the checks cannot silently disagree. The six without a numeric check say why in
`--list`; none of them carries a fabricated `machineCheck`.

---

## 2 · The 2 held items — and what they say about the corpus

| Q | State | Why it is held |
|---|---|---|
| **2** | `unsolved`, `corpus-defect` | adj(kA) = k^(n−1)·adj(A) for general n, but the transcribed options offer only the n = 2 case (A), a reciprocal power (D) and two others. **No transcribed option is correct for general n.** Most likely a lost superscript. |
| **17** | `unsolved`, `corpus-defect` | The stem reads "1, 2, 4, 8, 16, 2", which is not a well-formed series, and the mathematically correct option (2^((n−1)/2)) is not among the four as transcribed (A is 2^(n−1)). Most likely the "/2" was lost. |

These are the first two items in the phase where the **slice filter passed the item but the
solver still could not answer it**. Both are recorded rather than guessed, and both are
cheap to settle with one page image each.

Q18 is outside the slice entirely: the corpus carries a substituted textbook example for it
(documented in the [2017 pre-flight](2017-preflight.md)), so it is not solvable from this
input at all.

---

## 3 · What the other 81 entries say

| Tier | Count | Reasons |
|---|---:|---|
| `derived-provisional` | 17 | solved in this batch |
| `unsolved` | 83 | `not-yet-solved` 66 · `figure-not-reproduced` 8 · `options-not-reproduced` 6 · `corpus-defect` 3 |

The 66 `not-yet-solved` items are inside the authorised slice and are next in the queue. The
15 exclusions are the computed ones: eight figure-dependent, six whose options are missing,
short or bled into by a printed section heading, and Q18.

---

## 4 · Checks run for this batch

| Check | Command | Result |
|---|---|---|
| Key file validates against the schema | `node scripts/validate-keys.mjs` | **PASS** — 0 errors, 0 warnings |
| Schema rules are tested, not just written | `npm run test:keys` | **PASS** — 11 tests |
| The slice is reproducible | `npm run keys:subset` | **PASS** — 85 of 100 in, 15 out, same list every run |
| Every claimed numeric check re-runs green | `python3 …/checks/math-q01-20.py` | **PASS** — 11/11 |
| Status arithmetic closes | inside the validator and the tests | **PASS** — tiers 17+83 = 100, held 100, reasons sum to 100 |
| No entry claims a fidelity or a tier it has not earned | validator | **PASS** — `verbatim` with no image is an error; `official` is an error for 2017 |
| Existing application tests unaffected | `npm run test:rules` | **PASS** — no `src/` change in this batch |

---

## 5 · What would upgrade this

1. **A page image of any of these 19 items** turns them from `derived-provisional` into
   candidates for `derived-verified` — but only with a second independent pass, per the
   tier definition.
2. **One image for Q2 and one for Q17** settles two items that are currently unanswerable
   for a reason no amount of solving can fix.
3. **The rest of the slice** (66 items) continues in later batches; the machinery —
   subset script, validator, tests, per-year checks — is now in place, so a batch is
   mechanical work rather than new infrastructure.
