# Owner-approved provisional practice and descending year lists

## Decision and scope

On active branch `arena/ff44d93c-jelet-ultimate-prep`, owner approved selectable-answer practice/scoring for the historical papers and requested all year lists newest first. This adds a **separate provisional comparison mode**, not verified scoring or a promotion of imported answer tiers. It supersedes the earlier display-only restriction only for this explicitly labelled mode. Further answer research remains paused.

## Behaviour

- Historical paper routes now provide selectable options and a Calculate provisional score button. Category I: +1 agreement with the provisional label, −0.25 disagreement, blank 0. Negative totals are allowed.
- Counts: 2017 66; 2018 71; 2019 68; 2021 57. Total 262.
- Only source-agreement provisional labels with complete options and any required diagram attached enter this pool. 59 disputed/ambiguous/uncheckable labels and 79 unsolved records remain excluded. No new answers inferred or selected.
- Labels/comparisons are revealed after submitting; changes clear old feedback. A selected option can be toggled off. Clear selections resets feedback and choices.
- Untimed, page-session only: reloading clears selections. This is stated before the questions. No normal attempt/history, mastery, review queue or mock-pool writes. No certified exam-readiness claim.
- Existing official and 2022 derived-key runner flows remain unchanged. All corpus fields and editorial keys are unchanged, including `scorable`, `keyAnswer`, held status and board awards. Reader study aids remain separate from ordinary marked answers.
- Paper reader links and practice cards expose the new historical routes. Library, practice, shared paper lists, coverage, mock year breakdowns and offline paper packs use descending year order: 2025, 2024, 2023, 2022, 2021, 2019, 2018, 2017. No 2020 paper is invented.
- Four new historical offline packs contain reader/practice pages and compiled assets, with provisional labels embedded in the practice page. Existing paper packs also sort newest first. No new network service or dependency.

## Verification

- Astro check/build passed: 62 pages.
- Full suite: **277 passed**. Additional 2023 regression suite: **22 passed**.
- Unit cases: pool exclusions, all-blank, agreement, disagreement, negative score; no scored-key promotion.
- Browser cases: all four routes, selection/submission/reset, no early feedback, no normal localStorage changes, mobile overflow, descending paper/year-selector/practice order.
- Offline browser case: install historical pack, open and submit while offline, reload clears choices. Pack ordering and embedded comparison data checked.
- Existing artifact allowlist, scored runner, immutable attempts and other full-suite tests passed. Added four routes to allowlist.
- Git comparison confirms no corpus, archived or editorial-key changes. Whitespace check passed.
- Not tested on physical Android; no independent new answer/rights verification. Existing notice and source limitations remain.

No commit, push, merge or deployment performed in this turn.
