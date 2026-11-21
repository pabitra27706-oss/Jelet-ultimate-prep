# Phase 17 — Practice result (evidence record)

- **Phase, status, date, branch/commit, owner/reviewer:** Phase 17, practice
  result and review. **Built and agent-verified; owner visual review pending.**
  2026-11-21. Branch `arena/61a4f729-jelet-ultimate-prep`, commit `TODO_HASH`.
  Owner is the reviewer; Phase 18 has not started.

- **Inputs and pre-change evidence; reused/adapted/rejected reference and
  licence:** the owner's concept
  [`03-practice-results.png`](../../references/ui-concepts/03-practice-results.png)
  (positive: one glanceable outcome, a mark ring, item-by-item rows with a
  worded status, generous touch rows, a primary retry and a secondary review
  action), read with the [Phase 17 plan](README.md) and the existing renderer
  in `src/lib/runner.ts` (`renderResults`, the stored `AttemptItemResult`
  records, `src/lib/scoring.ts`). **Rejected from the concept:** the sample
  “6 of 10 / 60%”, “3 questions lacked a verified key”, the invented topic
  names, the **AI Analysis** banner, the “Unverified Key” and “Unresolved
  Issue” guesses, and the phone bezel/status bar. No new data was invented to
  fill the mock's shape.

- **Approved scope, delivered outputs, deliberate exclusions:** the submitted
  result surface of the runner (full paper, subject drill and composed mock),
  including the recorded result after a reload. Delivered: a result hero with
  a mark ring whose denominator is written out, the exact score, a counts
  sentence and outcome chips; a deterministic “Where to look first” line built
  from the attempt's own subject marks (no AI); a single card listing every
  question with `Correct / Partial / Wrong / Blank / Board-awarded / Not
  marked` plus a glyph, each row opening to the marked option, the key, the
  mark arithmetic, the key tier, any explanation and a link to the real paper;
  full-width **Retry the N wrong or blank** and **Review answers**, with a
  quiet “Back to Today”; a recorded-result view on reload that shows the saved
  score unchanged; and an honest gap when a submitted attempt has no saved
  result. Excluded: the practice chooser (Phase 18), the quiz result surface,
  the reader, scoring rules, attempt storage schema, keys, review queue and
  offline packs. The sitting bar and navigator are hidden once the paper is
  marked; nothing can be re-submitted from the result.

- **Gate-by-gate results:**

| Gate | Expected | Observed | Evidence | Result |
|---|---|---|---|---|
| Composition | ring + exact score, counts, item card, actions | hero, 4 outcome chips, 85 rows, retry + review + back | “the result screen states its denominator…” | pass |
| Denominator | marks this set can award, stated explicitly | “3.75 of 103 marks”, note “103 marks … 85 questions were in scope” | same test | pass |
| Category I / II, negative marks | one correct, one wrong, blanks, partials | 3.75 and 3.5 cases unchanged | existing scoring tests | pass |
| Board voids | named and included | row Q41 pill “Board-awarded”; counts sentence “3 voided by the board” | same test | pass |
| Per-item disclosure | answer, key, marks, tier, paper link | “Your answer D”, “Key D”, “+1 of 1”, “official board answer key”, `/library/jelet-et-p1-2025/#subject-mathematics` | “a result row opens by keyboard…” | pass |
| Keyboard | row opens with Enter | Enter opens the row (`open === true`) | same test | pass |
| Retry | new attempt, eligible set, original intact | 81 of 85 panes, id `…::full::retry-…`, original `submittedAt`/results/answers unchanged | “retrying builds a new attempt…” | pass |
| Reload | recorded score unchanged, labelled | “Recorded result”, same 4, “not recalculated”, bar hidden | “a submitted result is recorded…” | pass |
| Corrupt/old attempt | no invented score | notice “no marked result was saved … Nothing is invented here” | “an attempt marked submitted without a saved result…” | pass |
| No invented content | no AI diagnosis, no mock numbers | no “AI”, no 60% / 6 of 10 in the result | “the result screen states…” | pass |
| 320 px @ 200 % | no page-wide overflow | passes on every route, including the practice page | suite sweep | pass |
| Offline | the saved result still opens | shell-cached practice page passes | suite test | pass |

- **Python/build/Chromium:** `python3 docs/phases/01-evidence/check_inventory.py`
  → PASS (42 rows). `npm run check` → 116 files, 0 errors / 0 warnings /
  0 hints. `npm run build` → 63 pages, 10 packs, 26,660 KB. `npm test` →
  **301 passed, 0 failed** (browser **87**, of which 6 are new for this screen;
  the five result tests plus the gap test). Headless Chromium 153.0.8010.0 at
  390×844, 320×700 and 1280×900, light and dark. `git diff --check` clean.

- **Residual physical gate:** **ANDROID CHECK NEEDED — pending.** No deployed
  URL for this branch. In Termux: `git fetch origin
  arena/61a4f729-jelet-ultimate-prep`, `git switch -C phase17 FETCH_HEAD`,
  `npm run build`, `npm run preview`, open
  `/Jelet-ultimate-prep/practice/jelet-et-p1-2025/`, answer a few questions
  (Q1 D is correct, Q2 C is correct), submit, and check: the result appears
  without scrolling hunting, the ring and “of 103 marks” agree, a row opens
  and closes on a thumb tap, “Retry the 81 wrong or blank” starts a shorter
  set without changing the first result, a reload still shows the same score,
  320 px and phone text zoom do not scroll sideways, and TalkBack reads the
  row's status and the “open one to review it” hint. Not tested on a device.

- **CI run, build size, published URL and browser/device:** CI is reported on
  the pull request after the push (see the phase's commit); nothing is deployed
  or merged by this phase. Browser: headless Chromium 153.0.8010.0; no
  physical device. The screenshots are a **seeded, test-only** attempt in a
  fresh browser profile (Q1 right, Q2 wrong, the rest blank); the numbers in
  the images are not site content.

- **Privacy, accessibility, cost, editorial and rollback checks:** the result is
  computed in the browser from the local attempt and the shipped key file; no
  request leaves the site and no new dependency or asset was added. Status is
  always a word plus a glyph; each row is a native `<details>` with a 58 px
  summary; the ring carries a text label and the percentage's meaning is
  written out; the retry button is disabled when there is nothing to repeat.
  Scoring, keys, attempt records, review-queue writes, routes and the stored
  schema are untouched, so old results still open. Rollback is a revert of the
  implementation commit; stored attempts remain valid because the schema did
  not change.

- **Blockers, unresolved risks, next action and decision needed:** no code
  blocker. Risks: the ring percentage is rounded for display while the marks
  are exact, and the +/− marks still dominate the headline — both are stated in
  the copy. The recorded view keeps the outcome but not the key text, which the
  row states rather than invents. Decision needed: owner visual review of
  [`screenshots/`](screenshots/); on acceptance Phase 18 (practice choices)
  starts.

## Visual comparison with `03-practice-results.png`

| Element | Reference | Delivered | Note |
|---|---|---|---|
| Headline | ring “60%” + “6 of 10 correct” | ring with the real percentage + “3.75 of 103 marks” | exact marks, percentage explicitly marks ÷ maximum |
| Sub-line | “3 questions lacked a verified key” | exact counts: correct · partial · wrong · blank · board-awarded | only true numbers |
| Banner | blue “AI Analysis: focus on KVL & KCL” | blue “Where to look first” with the lowest-scoring **attempted** subject from this attempt | deterministic, never a diagnosis; hidden with fewer than two attempted subjects |
| Rows | “Question N”, topic, status pill, chevron | same, with topic + marks and a glyph+word status | statuses are Correct / Partial / Wrong / Blank / Board-awarded / Not marked |
| “Unverified Key”, “Unresolved Issue” | guessed states | “Not marked” only when a question truly has no key; “Board-awarded” for voids | no guessing |
| Row body | none | marked option, key, mark arithmetic, key tier, explanation, paper link | review is the point of the screen |
| Primary action | “Retry independently” | “Retry the N wrong or blank” | the real eligible set, and the count is honest |
| Secondary action | “Review answers” (outline) | same, to the review desk | — |
| Header | “Practice Result” + back arrow | app shell + breadcrumbs; the sitting bar is hidden after submission | route and history preserved |
| Bottom bar | absent in the mock | the shared five-tab bar remains | shell consistency, as in every other phase |
| Desktop | absent | 46 rem centred column | no reference counterpart |

Not claimed: pixel identity with the mock, its 60%/6-of-10 figures, its topic
names, an AI analysis, or any score that is not in the stored attempt.
