# Phase 19 — Lesson reading screen (evidence record)

- **Phase, status, date, branch/commit, owner/reviewer:** Phase 19, the lesson
  reading screen. **Built and agent-verified; owner review pending.** First
  delivered as a visual rebuild (`90f2ea6`); the owner rejected that as
  “only change the ui it need features change”, so commit `b4fc0ec` adds real
  features: a lesson bookmark in the local workspace, recorded sections
  visited, a return-to-your-place prompt, and a written explanation under every
  worked step. 2026-11-21. Branch
  `arena/61a4f729-jelet-ultimate-prep`. Phase 20 has not started.

- **Inputs and pre-change evidence; reused/adapted/rejected reference and
  licence:** the owner's concept
  [`05-lesson.png`](../../references/ui-concepts/05-lesson.png) (back arrow,
  title, position mark, **bookmark**, thin progress bar, prose measure, tinted
  worked-example card, per-step explanation, bottom action bar), the [Phase 19
  plan](README.md), the one open lesson (`src/content/parallel-circuits.md`,
  topic `jelet-syllabus:electrical:t04`, 8 minutes, six declared sections), the
  topic map, `src/progress.ts`, and the existing local workspace
  (`src/workspace.ts`, IndexedDB `bookmarks`/`notes`/`resume`, also used by
  Papers and the study-record backup). **Rejected:** the *Alternating Currents*
  lesson body and its 311 V / 50 Ω example, the mock **3 / 8** position, the
  **“Listen to Audio”** control (there is no audio file, and none may be
  implied), the **“Explain this step” AI** button (there is no model; the
  explanation shipped here is written prose), invented counts, mastery or score
  language. The phone bezel is not reproduced.

- **Approved scope, delivered outputs, deliberate exclusions:** the lesson
  route only, rebuilt around the existing authored content. **Features
  delivered (not styling):**
  1. **Bookmark this lesson → the local workspace.** The header carries a real
     toggle (`aria-pressed`, 44 px, filled when saved) writing the same
     IndexedDB bookmark store the Papers screen and backup use, with the
     section in hand stored in the bookmark URL. It survives a reload, appears
     in `/workspace/`, is removable, and reports its state in an `aria-live`
     line. It is the browser's own store: no account, no server, no sync.
  2. **Sections visited.** `Progress` gained `visited: Section[]` under the
     unchanged key `jelet:<lesson>:v1`, written by `recordVisit` and validated
     on read. The contents list ticks each section that has actually been on
     screen and prints “N of 6 visited”; older records without the field load
     with no invented history (tested).
  3. **Live scroll spy.** The reading position, the sticky bar and the contents
     follow the heading the reader passes, using the measured sticky header as
     the threshold; `aria-current` marks the section in hand.
  4. **Return to your place.** Landing on the lesson without a section shows
     “You left off at *Guided practice*. Continue reading ↓”, which jumps to the
     saved section, updates the address and the stored place. A first visit
     never shows it.
  5. **A written explanation under every worked step.** Three authored
     explanations (branch voltage, branch current, junction current) open
     independently, are labelled as written for this site (“no AI is involved”),
     and deliberately do not move the reading position.
  6. **Persistent practice action** — “Practise this topic” → the only real
     mapped card (`cards/orig-parallel-independent-v1/?from=lesson&topic=…t04`),
     “Read the notes” → `notes/electrical/#electrical-t04`, plus the lesson's
     own card/revision links and an honest “no reviewed practice” fallback.
  **Reading position, never mastery:** a real `progressbar` over the six
  declared sections, starting at 1 on a fresh visit, with no “mastery”,
  “complete” or “finished” anywhere.
  **Layout:** compact header, 44 rem prose measure, numbered section rules,
  equation treatment, existing SVG with caption, tinted worked card, fixed
  action bar. Excluded: audio, AI, bookmarks of other kinds, mock counts, new
  lesson prose beyond the three written explanations, and any new dependency.

- **Gate-by-gate results:**

| Gate | Expected | Observed | Evidence | Result |
|---|---|---|---|---|
| Bookmark | real toggle, persisted locally, visible in the workspace, removable | `aria-pressed` false → true, survives reload, listed as “Bookmark · Parallel circuits”, removes again | “a lesson can be bookmarked into the local workspace…” | pass |
| Sections visited | records what was on screen, not a score | fresh “1 of 6 visited”; jump to Worked example → “2 of 6”, ticks on Prerequisite and Worked example, `aria-current` on Worked example; stored as `['prerequisite','worked-example']` | “the contents records the sections actually read…” | pass |
| Old records | load without invented history | a record with no `visited` restores the place and reads “1 of 6 visited” | “a place saved before the visit list existed…” | pass |
| Return to place | prompt only when there is a place, and it works | no prompt on a deep link or a first visit; prompt names “Guided practice”, jump sets `#guided-practice` and hides the prompt | “returning to a lesson offers the saved section…” | pass |
| Step explanations | written, offline, no AI claim, no place change | opens under step 1, says “no AI is involved”, position unchanged, no AI wording | “each worked step carries a written explanation…” | pass |
| Reading position | section-based, honest | `aria-valuemax=6`, `aria-valuenow=1` on a fresh visit, `Section 1 of 6: Prerequisite` | “the lesson header gives the real reading position…” | pass |
| Resume | exact saved section | `?resume=1#independent-practice` → section 5, parameter cleaned, checks closed | “the reading position follows the section opened…” | pass |
| Storage refused | still readable and honest | page reads, hint opens, `[data-save-note]` says saving is impossible, bookmark disabled with “Bookmarks are unavailable on this browser.” | “the lesson is readable and honest when the browser refuses storage” | pass |
| Card ↔ lesson | real return path, no answer leak | lesson → card → “Learn this concept” → `#independent-practice` with the origin note; no “1.5 A”/“4.5 A” in the card | “the lesson and its practice card point at each other…” | pass |
| Bottom bar | clear of the tab bar and the last line, at any text size | bar bottom ≤ tab bar top at 390 px and 320 px / 200 %; last line clears it; bars measured at runtime | two tests above | pass |
| Keyboard | back and the prediction jump operable | Enter on the focused back control → `/learn/`; Enter on the jump → `#predict` | “the lesson is usable from the keyboard…” | pass |
| 320 px / 200 % | no page-wide overflow | scroll width ≤ client width | same test | pass |
| Dark mode | legible | `lesson-mobile-dark.png` | screenshot | pass |
| No fake controls | no audio element, no AI control | `!/Listen to Audio/`, `!/<audio/`, no AI wording | header test | pass |

- **Python/build/Chromium:** `python3 docs/phases/01-evidence/check_inventory.py`
  → PASS (42 rows). `npm run check` → 116 files, 0 errors / 0 warnings /
  0 hints. `npm run build` → 63 pages (packs rebuilt; largest `mock-builder`,
  4,204 KB). `npm test` → **315 passed, 0 failed** (browser **101**, ten new
  for this phase). Headless Chromium 153.0.8010.0 at 390×844, 320×700 and
  1280×900, light and dark. `git diff --check` clean.

- **Residual physical gate:** **ANDROID CHECK NEEDED — pending.** Open the
  built site on the phone with
  `cd ~/Jelet-ultimate-prep && git checkout -- public/data/packs.json && git fetch origin arena/61a4f729-jelet-ultimate-prep && git switch -C phase19 FETCH_HEAD && npm run build && npm run preview`
  and open `/Jelet-ultimate-prep/learn/parallel-circuits/`. Please check the
  bookmark (and that it appears in the workspace), the visited ticks in the
  contents, the “Continue reading” prompt after leaving and returning, the
  fixed practice bar against the tab bar and the phone's safe area, and one
  “Explain this step”. No physical device result has been reported for this
  phase.

- **CI run, build size, published URL and browser/device:** CI `pilot`
  **pass** on [run 44984031279](https://github.com/pabitra27706-oss/Jelet-ultimate-prep/actions/runs/44984031279)
  (1 m 42 s) for the visual rebuild, and **pass** on
  [run 44986655481](https://github.com/pabitra27706-oss/Jelet-ultimate-prep/actions/runs/44986655481)
  (2 m 01 s) for `e72c1bc`, which carries the feature commit `b4fc0ec`. Local
  artifact 63 pages, 17.9 MB.
  Nothing is deployed or merged by this branch; no published URL carries this
  screen yet.

- **Privacy, accessibility, cost, editorial and rollback checks applicable
  here:** no account, no network request, no analytics, no AI and no audio. The
  bookmark and the visit list live in this browser (IndexedDB and
  `localStorage`); refusing either degrades to an honest message and a disabled
  control instead of a dead button. The progress bar has a text equivalent,
  visited state has a text “visited” label, the position is announced through
  `aria-live`, and the bookmark is a real pressed-state button. ₹0 static
  hosting unchanged, no dependency added (no new licence, size or cost).
  Editorial: the three explanations are original prose for this site and say
  so; no Board question, key or claim is invented. Rollback is
  `git revert b4fc0ec`.

- **Blockers, unresolved risks, next action and decision needed:** the owner's
  review of the screen and its features; the Android pass above; only one topic
  has a written lesson, and the page never implies otherwise. Next action: on
  acceptance, Phase 20 (Learn subjects).

- **Roadmap updated by/date:** `docs/ROADMAP.md`, 2026-11-21 (Phase 19 row and
  next-action entry), same change. Phase 19 is **not** marked accepted.
