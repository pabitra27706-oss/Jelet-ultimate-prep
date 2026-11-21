# Phase 16 — Papers library (evidence record)

- **Phase, status, date, branch/commit, owner/reviewer:** Phase 16, Papers
  library screen. **Built and agent-verified; owner visual review pending.**
  2026-11-21. Branch `arena/61a4f729-jelet-ultimate-prep` (branched from
  `main` `475e817`), implementation commit `4d3fe09`. Owner is the reviewer;
  Phase 17 has **not** started.

- **Inputs and pre-change evidence; reused/adapted/rejected reference and
  licence:** the owner's concept
  [`docs/references/ui-concepts/02-papers-library.png`](../../references/ui-concepts/02-papers-library.png)
  (positive: bold “Papers” title, one rounded search field, a pill row of year
  chips plus Bookmarked, vertical cards with year/title/provider, a status pill
  and a top-right bookmark). Read with the
  [Phase 16 plan](README.md), the
  [shared foundation notes](../14-ui-rebuild/IMPLEMENTATION-NOTES.md), the
  existing `src/pages/library/index.astro` and the generated corpus metadata.
  The concept's six “2023” sessions and its Full/Partial/No Key claims were
  **rejected**: the corpus holds one paper per year, with official, derived or
  no published key, and each card states exactly which.

- **Approved scope, delivered outputs, deliberate exclusions:** the library
  landing/list only. Delivered: `Papers` title; one in-corpus search field that
  lazily reads the shipped 437 KB local index and reports per-paper matching
  question counts; `All` + seven real year chips + `Bookmarked` as pressed-state
  buttons; a “More filters” disclosure keeping the existing year, subject and
  key selects; eight cards with the real year, identity, question and markable
  counts, held/missing/board-voided notes, an icon+text status pill
  (Official key / Derived key / No published key) and a 44 px stateful bookmark
  toggle in the shared IndexedDB store; empty and no-bookmark states with
  “Clear search and filters”; URL state (`q`, `year`, `key`, `subject`,
  `bookmarked`) so Back from a reader restores the list. Excluded: no change to
  the reader layout, paper order, permanent URLs, keys, counts, scoring,
  bookmark schema, search index or offline pack protocol; no invented sessions
  or key tiers; no auto-download, account or analytics.

- **Gate-by-gate results:**

| Gate | Expected | Observed | Evidence | Result |
|---|---|---|---|---|
| Composition | title → search → chips → cards, one card per paper | 8 cards, 10 chips, title 32 px, search 56 px, card 142 px at 390×844 | “the Papers screen matches the reference composition” | pass |
| Real metadata | counts and tiers match generated data | 3 official / 1 derived / 4 no key; 2025 = 100 questions, 82 markable, 15 held, 3 board-voided | same test | pass |
| No invented content | no sessions, no Full/Partial/No Key claims | none present | same test | pass |
| Year chips | filter the list, expose `aria-pressed`, sync with select | 2022 → 1 of 8, URL `year=2022`, select follows | “year chips, key filter and clear action” | pass |
| Key filter + empty state | 2022 + official → 0 with a way out | empty state visible, Clear restores 8 | same test | pass |
| Bookmark | toggles, persists, filters, agrees with You | pressed + label change, survives reload as exactly 1, You reads 1 | “a card bookmark persists…” | pass |
| Search | real index, per-paper counts, Back restores | “2 of 8 papers shown · 2 matching questions”; no-match → empty; Back keeps query and 2 cards | “the Papers search reads the real index…” | pass |
| Storage denied | list usable, bookmarking disabled honestly | 8 cards, bookmark button and Bookmarked chip disabled, reader link works | “a blocked bookmark store leaves the Papers list usable” | pass |
| Existing behaviour | key select still narrows to 3 and 4 | unchanged after opening More filters | “the paper library lists every paper…” | pass |
| 320 px @ 200 % | no page-wide overflow | passes on all ten routes incl. `library/` | suite test | pass |
| Offline | library opens from the shell cache | passes | suite test | pass |

- **Python/build/Chromium:** `python3 docs/phases/01-evidence/check_inventory.py`
  → PASS: 42 rows, unique IDs and all required fields; 92 local link targets.
  `npm run check` → 115 files, 0 errors / 0 warnings / 0 hints.
  `npm run build` → 63 pages, 10 packs, 26,660 KB of packs, `dist/` ≈ 18 MB.
  `npm test` → **294 passed, 0 failed** (browser **80**, of which 5 are new for
  this screen). Headless Chromium **153.0.8010.0** at 390×844, 375×812,
  320×700 and 1280×900. `git diff --check` clean.

- **Residual physical gate:** **ANDROID CHECK NEEDED — pending.** No deployed
  URL for this branch. From Termux: `git fetch origin
  arena/61a4f729-jelet-ultimate-prep`, switch to `FETCH_HEAD`, `npm run build`,
  `npm run preview`, open `/Jelet-ultimate-prep/library/`. Check: the chip row
  scrolls without moving the page, a chip can be tapped with the thumb, the
  bookmark fills and survives a reload, “Bookmarked” filters, typing in the
  search field shows matching-question counts, 320 px and phone text zoom do not
  scroll sideways, and the tab bar never covers a card. TalkBack reading of the
  chip pressed state and the bookmark label is not tested.

- **CI run, build size, published URL and browser/device:** local evidence at
  the time of writing; the branch's `pilot` job is reported on pull request
  #14. Nothing is deployed or merged by this phase; the published site still
  serves the Phase 14 build until the owner merges. Browser: headless Chromium
  153.0.8010.0; no physical device.

- **Privacy, accessibility, cost, editorial and rollback checks:** the search
  index is fetched from this site only, and typing nothing else leaves the
  device; the 437 KB index is loaded on demand, not with the page, and the page
  states when question search is unavailable offline. Chips are real buttons
  with `aria-pressed`; the search input has a label and a live status; the
  bookmark toggle exposes `aria-pressed` and a changing name; statuses combine
  icon and words; every row is ≥44 px. Search is skip-free and keyboard
  operable; the card link keeps its printed identity as its accessible name.
  No dependency or asset was added. Editorial data, keys, counts, scoring and
  URLs are untouched, and the tests assert the tier counts and 2025 arithmetic.
  Rollback is a revert of the implementation commit; bookmarks written by the
  previous UI remain valid because the schema is unchanged.

- **Blockers, unresolved risks, next action and decision needed:** no code
  blocker. Risk: the mock's session names may be expected; the page explains
  the real one-paper-per-year corpus and shows each paper's tier. Decision
  needed: owner visual review of [`screenshots/`](screenshots/); on acceptance,
  Phase 17 (Results) starts. Phase 15 was reported as PASS by the owner on
  2026-11-21 and is recorded in its own evidence file.

## Visual comparison with `02-papers-library.png`

| Element | Reference | Delivered | Note |
|---|---|---|---|
| Title | “Papers”, heavy, ~32 px | “Papers”, 800 weight, 32 px | same |
| Search | rounded field, magnifier, “Search inside papers…” | same shape, 56 px, real local index | question matching, not a fake filter |
| Chips | 2023 / 2022 / 2021 / Bookmarked, selected filled teal | All + 2018–2025 + Bookmarked, selected filled teal | real years only; the row scrolls |
| Card | year, title, provider line, status right, bookmark top-right | same, plus one line of real counts | counts are required provenance |
| Status | Full Key / Partial Key / No Key | Official key / Derived key / No published key | no “partial” claim; each tier is named |
| Sessions | six 2023 sessions | none | the corpus has one paper per year |
| Bookmark | outline glyph | outline → filled when saved, 44 px target | stateful, stored locally |
| Accuracy note | absent | shared caution disclosure above the title | shell-level honesty, not screen-specific |
| Bottom bar | Papers active in teal | same | no pill |
| Desktop | absent | 46 rem centred column | no reference counterpart |

Not claimed: pixel identity, the mock's session cards, a server search, or that
the bookmark store works when a browser blocks IndexedDB (it is disabled and
says so).
