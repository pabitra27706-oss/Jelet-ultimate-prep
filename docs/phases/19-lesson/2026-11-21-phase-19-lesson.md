# Phase 19 — Lesson reading screen (evidence record)

- **Phase, status, date, branch/commit, owner/reviewer:** Phase 19, the lesson
  reading screen. **Built and agent-verified; owner visual review pending.**
  2026-11-21. Branch `arena/61a4f729-jelet-ultimate-prep`, commit `90f2ea6`.
  Phase 20 has not started.

- **Inputs and pre-change evidence; reused/adapted/rejected reference and
  licence:** the owner's concept
  [`05-lesson.png`](../../references/ui-concepts/05-lesson.png) (positive: a
  back arrow, a large lesson title, a small position mark, a thin teal progress
  bar, a comfortable single-column prose measure, a tinted worked-example card
  and a persistent bottom action bar), read with the [Phase 19
  plan](README.md), the one open/`open` lesson
  (`src/content/parallel-circuits.md`, topic
  `jelet-syllabus:electrical:t04`, 8 minutes, six declared sections), the topic
  map, and `src/progress.ts`. **Rejected from the concept:** the *Alternating
  Currents* lesson body, its 311 V / 50 Ω numerical example, the **“3 / 8”**
  position and the **bookmark** control (no saved lesson exists), the
  **“Explain this step”** AI button and the **“Listen to Audio”** control (no
  model and no audio file exist offline). The phone bezel and operating-system
  chrome are not reproduced.

- **Approved scope, delivered outputs, deliberate exclusions:** the lesson
  route only (`learn/<lesson>/`), rebuilt around the existing authored content.
  Delivered:
  1. **Header** — a back-to-Learn control with its own accessible name, the
     real subject label, the real lesson title, and the real metadata line
     `DC circuits · 8 min read · Original · Revision 1`.
  2. **Reading position** — a `progressbar` with `aria-valuemax` equal to the
     six declared sections, a small `N / 6` mark, a thin teal bar and the line
     `Section N of 6: <name>`. The bar sticks under the app bar while reading.
     A fresh visit starts at **1 / 6**; nothing is marked complete, and the
     words “mastery”, “complete” and “finished” appear nowhere.
  3. **Contents** — the six section links in a disclosure (it closes itself when
     a section is chosen), with the honest status lines beneath it (“No account
     or answers collected.”, the guided-hint note and the independent-check
     note) visible rather than buried in the collapsed panel.
  4. **Prose** — the prose card was dissolved: one 44 rem column on the page,
     numbered section headings with hairline rules, a real equation/symbol
     treatment, the existing inline SVG at full measure with its caption, and
     `overflow-wrap: anywhere` kept so nothing pushes the page sideways.
  5. **Progressive reveal** — the worked example is a tinted mint card labelled
     “Worked example”; hints and both checks stay closed until the reader opens
     them, exactly as before, and the independent check still only records that
     it was opened.
  6. **Persistent practice action** — a fixed bar at every width with
     **Practise this topic** pointing at the only real mapped card
     (`cards/orig-parallel-independent-v1/?from=lesson&topic=…t04`) and **Read
     the notes** pointing at `notes/electrical/#electrical-t04`, plus the
     lesson's own “Take the independent check” and revision links. When a
     lesson has no reviewed card the bar prints “No reviewed practice for this
     topic yet.” instead of inventing one.
  Excluded: audio, alternate formats, AI explanations, bookmarks, mock section
  counts, mastery/score language, new lesson prose, and any new dependency.

- **Gate-by-gate results:**

| Gate | Expected | Observed | Evidence | Result |
|---|---|---|---|---|
| Header | back to Learn, real name, subject/topic, real minutes, derived position | back link → `/learn/`; title `Parallel circuits`; `DC circuits · 8 min read · Original · Revision 1`; `1 / 6` on a fresh visit | “the lesson header gives the real reading position…” | pass |
| Position, not mastery | `progressbar` bounded by the real section list; no completion claim | `aria-valuemax=6`, `aria-valuenow=1`, text `Section 1 of 6: Prerequisite`; no “mastery/complete/finished” in the header | same test | pass |
| Bounded prose and equations | one readable measure, display math scrolls in place | 44 rem column, section rules, `pre`/`table` scroll locally, inline SVG at full width | `lesson-mobile-light.png`, `lesson-desktop-light.png` | pass |
| Reveal and privacy | hints/checks closed until opened; no answer leak | worked steps, hints and checks open only on request; the card's answer is absent from the lesson and the card HTML | existing hint test + “the lesson and its practice card point at each other…” | pass |
| Practice route | real mapped card or an honest gap | dock and the related-card link both resolve to the one real card; the notes and mock links are the real routes | “the lesson header…” | pass |
| Resume | lands on the exact saved section | `?resume=1#independent-practice` → `Section 5 of 6`, parameter cleaned, checks still closed | “the reading position follows the section opened…” | pass |
| Fresh lesson | no false completion | `1 / 6`, bar ~1/6 filled | “the lesson header…” | pass |
| Storage blocked | still readable and honest | page reads, hint opens, note stays `Progress cannot be saved on this browser.` | “the lesson is readable and honest when the browser refuses storage” | pass |
| Anchors and return | every declared section anchor and a return from the card | all six anchors present; lesson → card → “Learn this concept” returns to `#independent-practice` with the origin note | “the lesson and its practice card point at each other…” | pass |
| Bottom bar and tab bar | bar visible, never covering the navigation or the last line, at any text size | bar bottom ≤ tab bar top at 390 px and at 320 px / 200 %; last line clears the bar; heights measured at runtime | “the lesson header…” and “the lesson is usable from the keyboard…” | pass |
| Keyboard | back and the prediction jump reachable and operable | focus + Enter navigate to `/learn/` and to `#predict` | same test | pass |
| 320 px / 200 % text | no page-wide overflow | scroll width ≤ client width | same test | pass |
| Dark mode | legible in the dark palette | `lesson-mobile-dark.png` | screenshot | pass |
| No-JS | the static page still reads | content is server-rendered; only the position/resume extras need script | build + earlier no-JS suite | pass |

- **Python/build/Chromium:** `python3 docs/phases/01-evidence/check_inventory.py`
  → PASS (42 rows). `npm run check` → 116 files, 0 errors / 0 warnings /
  0 hints. `npm run build` → 63 pages, packs rebuilt (largest `mock-builder`,
  4,204 KB). `npm test` → **310 passed, 0 failed** (browser **96**, five new
  for this screen). Headless Chromium 153.0.8010.0 at 390×844, 320×700 and
  1280×900, light and dark. `git diff --check` clean.

- **Residual physical gate:** **ANDROID CHECK NEEDED — pending.** Open the
  built site on the phone with
  `cd ~/Jelet-ultimate-prep && git checkout -- public/data/packs.json && git fetch origin arena/61a4f729-jelet-ultimate-prep && git switch -C phase19 FETCH_HEAD && npm run build && npm run preview`
  and open `/Jelet-ultimate-prep/learn/parallel-circuits/`. Please check the
  sticky position bar while scrolling, the fixed practice bar against the tab
  bar (and the phone's safe area), and that a saved section resumes. The owner
  has not yet reported a device pass for this phase; nothing here is a physical
  device result.

- **CI run, build size, published URL and browser/device:** CI `pilot`
  **pass** on [run 44984031279](https://github.com/pabitra27706-oss/Jelet-ultimate-prep/actions/runs/44984031279)
  (1 m 42 s) for `f90e159`. Local artifact 63 pages, 17.9 MB. Nothing is
  deployed or merged by this branch; no published URL carries this screen yet.

- **Privacy, accessibility, cost, editorial and rollback checks applicable
  here:** no account, no network request, no analytics, no AI and no audio; the
  only stored value is the existing `jelet:parallel-circuits:v1` reading
  position under the unchanged key; storage denial degrades to an honest
  message. The bar is a real `progressbar` with a text equivalent; the back
  control is a 44 px target; both fixed bars are measured at runtime so a 200 %
  text size cannot hide the navigation. ₹0 static hosting unchanged; no
  dependency added, so no new licence, size or cost. Rollback is
  `git revert 90f2ea6`.

- **Blockers, unresolved risks, next action and decision needed:** the owner's
  visual review of this screen against `05-lesson.png`; the Android pass above;
  and the standing gap that only one topic has a written lesson (the page never
  implies otherwise). Next action: on acceptance, Phase 20 (Learn subjects).

- **Roadmap updated by/date:** `docs/ROADMAP.md`, 2026-11-21 (Phase 19 row and
  next-action entry), same change. Phase 19 is **not** marked accepted.
