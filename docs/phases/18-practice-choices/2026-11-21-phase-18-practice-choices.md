# Phase 18 — Practice choices (evidence record)

- **Phase, status, date, branch/commit, owner/reviewer:** Phase 18, the Practice
  chooser. **Built and agent-verified; owner visual review pending.** 2026-11-21.
  Branch `arena/61a4f729-jelet-ultimate-prep`, commit `TODO_HASH`. Phase 19 has
  not started.

- **Inputs and pre-change evidence; reused/adapted/rejected reference and
  licence:** the owner's concept
  [`04-practice-options.png`](../../references/ui-concepts/04-practice-options.png)
  (positive: a plain “Practice” title, a two-state Independent / With
  assistance control, vertically stacked high-touch cards with a circular line
  icon, a bold title, a short description and a right chevron), read with the
  [Phase 18 plan](README.md) and the routes that already exist
  (`practice/<paper>/`, `practice/<paper>/<subject>/`, `quiz/`, `mock/`,
  `review/`, `cards/<id>/`, `library/<paper>/`). **Rejected from the concept:**
  the **Live Study Room** card (no shared session exists and none may be
  implied), and any promise of mastery, saved time or a predicted score. The
  phone bezel and operating-system chrome are not reproduced.

- **Approved scope, delivered outputs, deliberate exclusions:** the Practice
  destination only. Delivered: `Practice` as the page title and one short
  sentence; a real Independent / With assistance switch that swaps two panels;
  five independent cards — **Exam-style paper** (newest markable paper),
  **Topic drill** (jump to the real drills), **Single question** (the original
  cards), **Custom mock** (`/mock/`), **Review queue** (`/review/`, with the
  real due count); one assisted card — **Notebook quiz** — because the quiz is
  the only mode where “Show the answer” exists and an assisted check is stored
  as assisted; and the whole existing page below it (every paper, subject
  drills, quiz links, revision notes, the queue card, original cards and the
  read-only years) so no route was lost. Excluded: the runner and result
  surfaces (Phases 17 and earlier), any new practice mode, a live room, a
  daily challenge, AI help, accounts, streaks or score prediction.

- **Gate-by-gate results:**

| Gate | Expected | Observed | Evidence | Result |
|---|---|---|---|---|
| Composition | title, switch, stacked cards with icons and chevrons | `Practice`, two-state switch, 5 + 1 cards, 3 rem icon tiles | “the Practice chooser offers only real modes…” | pass |
| Real destinations | every card leads to a live page or an existing anchor | 4 pages return 200; `#drills` / `#original` exist here | same test | pass |
| No unsupported mode | no live room, challenge, AI | none in the page text | same test | pass |
| Switch | changes panels, exposes `aria-pressed`, works by keyboard | Enter on “With assistance” hides Independent and shows the quiz | “the independent/assisted switch…” | pass |
| Assistance is real | only the mode that offers help is in the assisted panel | the quiz's “Show the answer” records `assisted`; the note says it never counts as independent | same test + the existing quiz tests | pass |
| No-JS | no dead control, nothing hidden | switch hidden by `<noscript>` CSS; both panels visible; 6 cards present | “without JavaScript the Practice chooser…” | pass |
| First-run queue | a real empty state, not a fake count | “Nothing waiting yet · wrong or blank questions land here” | “the Practice chooser offers…” | pass |
| Data-limited years | read-only papers still offered | the read-only card lists 2017–2019 style years with “read only” | existing content, unchanged | pass |
| Existing routes | every earlier link still present | papers, drills, quiz, notes, queue, originals kept below | suite | pass |
| 320 px @ 200 % | no page-wide overflow | passes after the switch was allowed to wrap | suite test | pass |

- **Python/build/Chromium:** `python3 docs/phases/01-evidence/check_inventory.py`
  → PASS (42 rows). `npm run check` → 116 files, 0 errors / 0 warnings /
  0 hints. `npm run build` → 63 pages, 10 packs, 26,660 KB. `npm test` →
  **305 passed, 0 failed** (browser **91**, of which 3 are new for this screen).
  Headless Chromium 153.0.8010.0 at 390×844, 320×700 and 1280×900, light and
  dark, with a no-JavaScript pass. `git diff --check` clean.

- **Residual physical gate:** **ANDROID CHECK NEEDED — pending.** No deployed
  URL for this branch. In Termux: `git fetch origin
  arena/61a4f729-jelet-ultimate-prep`, `git switch -C phase18 FETCH_HEAD`,
  `npm run build`, `npm run preview`, open `/Jelet-ultimate-prep/practice/`.
  Check: “Practice” and the switch fit without sideways scroll, both switch
  states are reachable with the thumb, each card is a comfortable target, the
  queue card states the real count, the drill card jumps to the drills, and
  320 px plus phone text zoom keep the cards readable. TalkBack reading of the
  switch state is not tested.

- **CI run, build size, published URL and browser/device:** reported on pull
  request #14 after the push; nothing is deployed or merged by this phase.
  Browser: headless Chromium 153.0.8010.0; no physical device.

- **Privacy, accessibility, cost, editorial and rollback checks:** every card
  is a plain link or anchor, so keyboard order follows the page and each target
  is a real route; the switch uses `aria-pressed` buttons and a live note; no
  icon carries meaning without text beside it; no request or dependency was
  added. The chooser changes no paper, attempt, score, timer or storage
  behaviour, and the whole page below it is the same content as before.
  Rollback is a revert of the implementation commit.

- **Blockers, unresolved risks, next action and decision needed:** no code
  blocker. Risk: the switch is a *view* switch — it shows which modes offer
  assistance, it does not change how anything is marked, and the note says so.
  Decision needed: owner visual review of [`screenshots/`](screenshots/); on
  acceptance Phase 19 (lesson) starts.

## Visual comparison with `04-practice-options.png`

| Element | Reference | Delivered | Note |
|---|---|---|---|
| Title | “Practice”, heavy | same, with the site's small “Paper I · Practice” eyebrow | shell consistency |
| Switch | Independent / With assistance | same two states, functional | swaps modes; does not change recording |
| Card 1 | Topic Drill | **Exam-style paper** first | the reference's order is not a product requirement; the paper is the recommended start |
| Card 2 | Single Question | **Topic drill** | card order follows the recommended path |
| Card 3 | Exam-Style Paper | **Single question** | — |
| Card 4 | Live Study Room | **Custom mock**, then **Review queue** | the live room does not exist; a mock and the queue do |
| Card style | 96 px teal-tinted icon circle, bold title, two-line text, chevron | 48 px (56 at 200 %) teal-tinted circle, bold title, short text, chevron | same shape at real pixel sizes |
| Assisted mode | no separate content | one card: Notebook quiz, with the real rule | the only mode that offers help |
| Bottom bar | five tabs, Practice active | same | no pill |
| Desktop | absent | two-column card grid | no reference counterpart |

Not claimed: pixel identity with the mock, a live study room, or any mode that
does not already have a working route.
