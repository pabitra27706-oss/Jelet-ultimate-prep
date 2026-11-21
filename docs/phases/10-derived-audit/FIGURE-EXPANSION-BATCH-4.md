# Inline figure expansion — batch 4, 2026-11-20

## Outcome

Added nine original SVG reconstructions for 2022: Q49, Q55, Q57, Q62, Q93, Q96–99. This covers all eight legacy diagram flags plus the previously unflagged Q55 source graph. All graphical alternatives are included for Q49/Q57/Q62; none is selected as an answer.

Supplied-year total is now **55 attachments: 51/83 legacy flags plus four additional figures**. The existing 11 figures for 2023 are unchanged and excluded from this count. Of the 32 legacy flags without assets, 31 await diagram work (16 for 2024, 15 for 2025); 2019 Q94 needs a non-diagram transcription correction. Additional 2019 Q77 diagram/transcription work remains pending. These counts are not whole-paper completeness certification.

## Source and fidelity

Owner-supplied `2023111591-3.pdf`, booklet 2091013057; source hash and per-question provenance are in `editorial/figures/2022/manifest.json`. Inspected PDF sheets 4, 13–16 and 21–23, including enlarged vessel, thermodynamic graphs and transistor circuit. For attached figures, PDF sheets and printed page labels agree:

| Page | Questions | Preserved features |
|---|---|---|
| 13 | 49 | All four potential-magnitude graphs |
| 14 | 55, 57 | Constant-pressure states A/B; vessel H/x/d/P/P′/Q and all four depth graphs |
| 16 | 62 | Given V–T triangle and all four directed P–V cycle alternatives |
| 22 | 93 | W left of zero speed, X rising, Y falling, Z at negative torque |
| 23 | 96–99 | Diode cathode/source orientation and output polarity; comparator reference polarity; exact switch topology; transistor connections, emitter arrow, current direction, supplies and 100-ohm label |

Original vector artwork only under ADR-0002; no official scan pixels published. Accessible descriptions, deviations and residual rights uncertainty remain recorded. No independent second content review or legal permission determination.

## Safety and discovered backlog

No stems, options, keys, legacy flags or scoring eligibility changed in this batch. Pre/post comparison covered all 790 questions. Eight legacy-held 2022 items remain held; Q55 was already scoreable and remains so. Figures do not establish answer correctness.

Source inspection also found the missing mathematical stem in **2022 Q6**, which is already scoreable in the baseline. This is explicitly recorded in `SOURCE-FINDINGS.json` for separate transcription/scoring-safety review before release; it is not fixed or concealed by a fabricated figure. The earlier 2019 transcription backlog and unresolved printed/PDF page provenance concern remain open.

## Verification

- Browser-rendered all nine SVGs and visually inspected the resulting drawings. Moved Q57 option labels away from axis values after the review.
- Final Astro check/build passed (58 pages).
- Final full `npm test`: **253 passed**, zero failures, including 30 figure tests and 52 browser tests. Browser tests cover attachments in their question cards at 390px and 1280px and preserve Q55's existing scoring status.
- `npm run figures:check` and `git diff --check` passed.
- No physical Android test or independent second review. Automated tests do not verify answers.

Next diagram batch: remaining 2024 items, then 2025. Changes remain local/unreleased: no commit, push, merge or deployment; PR #9 untouched.
