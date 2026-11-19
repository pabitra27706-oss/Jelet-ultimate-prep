# Phase 04 · exam engine and product upgrade · 2026-11-19

- **Phase/task/status:** 04-practice / 04 plus parts of 05 (full-paper mock) and 06 (offline shell); **implemented, agent-verified and published to Pages**; not independently content-reviewed.
- **Branch/commit:** `arena/9166576f-jelet-ultimate-prep` / `364ba8c`; [PR #4](https://github.com/pabitra27706-oss/Jelet-ultimate-prep/pull/4); [Pages run 44607760937](https://github.com/pabitra27706-oss/Jelet-ultimate-prep/actions/runs/44607760937).
- **Public URL:** https://pabitra27706-oss.github.io/Jelet-ultimate-prep/ — project subpath, HTTPS, no custom domain or spend. Verified live after the deploy: the dashboard, the 2022 reader, the 2025 full-paper runner, the review desk and the tier-labelled `data/keys.json` all serve correctly, and the old `/practice/orig-parallel-independent-v1/` address still redirects to the card.
- **Owner/reviewer:** owner approved the scope in-session (real exam engine, redesigned shell, publishing the papers and keys with visible provenance labels). No independent content, rights or accessibility reviewer has looked at this build.

## Inputs and pre-change evidence

- `archive/jelet-prep/data` — the preserved seven-paper corpus, the syllabus, the answer keys and the audit records. **Unmodified**; `git status archive/` is clean.
- `https://github.com/pabitrawers06-oss/Diploma-3rd-sem` and its live Pages build — the UI and product reference for a dense, phone-first exam-planning dashboard.
- `https://github.com/pabitrawers06-oss/Jelet-prep` — the PYQ, syllabus and key source.
- `docs/CONTENT.md` — the editorial and scoring contract this work implements rather than replaces.

## Approved scope and delivered outputs

| Asked for | Delivered |
|---|---|
| Real exam engine | `src/lib/scoring.ts` (exact rational Category I / Category II arithmetic), `src/lib/runner.ts` (timer, autosave, OMR navigator, mark-for-review, submit, retry-wrong), `src/components/Runner.astro` |
| Redesigned shell | `src/layouts/Site.astro`, `src/styles/site.css` (responsive light/dark token system), `src/pages/index.astro` (local-record dashboard) |
| Full-paper mock with correct JELET scoring | `src/pages/practice/[paper]/index.astro` for 2022, 2024, 2025; Category I −¼ and Category II partial credit applied per item, voided items award full marks |
| Publish the PYQs and keys with visible provenance | `src/pages/library/` reader and library, `src/pages/data/keys.json.ts`, `scripts/build-content.mjs` — every paper carries year, paper, set/booklet, key tier (official / derived / read only) and the board document reference |
| PYQ library and reader | `src/pages/library/index.astro`, `src/pages/library/[paper].astro` |
| Attempt history, mistake queue with spaced revision | `src/lib/attempts.ts`, `src/lib/review.ts` (Leitner ladder 1/3/7/14/35 days, a wrong answer resets), `src/pages/review/index.astro` |
| Redesigned dashboard, dark mode, PWA/offline, mobile-first | `src/pages/index.astro`, `public/manifest.webmanifest`, `public/sw.js`, `public/icon*.svg`, bottom tab bar, 320 px layout verified at 200 % text |

## Corpus and key facts (measured, not asserted)

| Year | Questions | Scoreable | Marks | Key tier |
|---|---|---|---|---|
| 2017 | 100 | 0 | — | read only |
| 2018 | 100 | 0 | — | read only |
| 2019 | 98 | 0 | — | read only |
| 2021 | 100 | 0 | — | read only |
| 2022 | 95 | 87 | 102 | derived |
| 2024 | 97 | 78 | 93 | official (Set A, identity-mapped) |
| 2025 | 100 | 82 | 100 | official (Set A, identity-mapped) |

- 690 transcribed questions in total; 247 carry a published key and can enter a scored pool.
- Board-voided items: 2024 Q49, Q58; 2025 Q41, Q79, Q84. Each awards its full marks and is labelled in the UI.
- Corpus gaps carried openly: 2019 Q78–79, 2022 Q86–90, 2024 Q60–62. Diagram-dependent and malformed items are held, never marked.
- The 2022 key is **derived** and labelled as such everywhere it appears. The 2023 and 2026 keys exist in the key file but have no transcribed paper, so nothing is published for them.

## Gate results

| Gate | Expected | Observed | Result |
|---|---|---|---|
| Scoring fixtures | Category I +1 / −¼ / 0; Category II +2 / 0 / `2 × correct ÷ total`; voided awards full marks | `tests/rules.test.mjs` derives the expected values independently of the implementation and compares exact rationals; 19/19 pass | Pass |
| Unverified items never enter a scored pool | held and read-only items are excluded from every drill | 2017/2018/2019/2021 have 0 scoreable items and publish no drill; held items are shown but never marked | Pass |
| Partial credit is explained, not just coloured | the result states the arithmetic | the result panel prints the rule and each item's own marks, your selection and the key | Pass |
| Blind retry | a retry repeats only wrong or blank items, with the earlier answer hidden | the retry button opens the drill with `?retry=<attempt>`; the runner filters to wrong/blank and starts a fresh attempt | Pass |
| Interrupted set resumes | reload keeps answers, mark-for-review and the clock | answers, marks and the attempt survive reload through `localStorage`; storage-blocked mode states that the attempt will be lost | Pass |
| Review desk is built from events, not visits | queue, due count, coverage and streak come from real attempts | 0 attempts shows an empty record with no invented streak; one submitted attempt puts every unanswered item in the queue | Pass |
| 320 px at 200 % text | no page-wide horizontal overflow on any route | measured on 11 routes at 320 px with the root font at 200 %; scroll width equals the viewport width | Pass after fix |
| Offline | the site still loads and searches with the network off | the service worker precaches the shell, the key file and the search index; a Chromium context switched offline reloads the shell, the syllabus and a live search | Pass |
| Local search | a question is findable by year and number | "JELET 2025 · Q31" returns that question first; "JELET 2017 · Q45" returns the 2017 item first | Pass after fix |
| Public artifact | nothing ships that is not declared | `scripts/public-artifact.json` is a single allowlist read by both the browser suite and the Pages workflow; the build publishes 73 files, all on it | Pass |
| Broken links | every internal link resolves | a link audit over all 32 built pages and all 692 search-index URLs reports 0 broken targets | Pass |
| Cost, privacy, access | no account, no server, no paid API, nothing uploaded | static build, `localStorage` only, no third-party request; the browser suite fails the build if any request leaves the origin | Pass |
| Independent content / rights / accessibility review | a reviewer checks the published corpus and the layout | **not done** — still open | Pending |
| Published build serves correctly | the deployed URL answers with real content | dashboard, 2022 reader, 2025 runner, review desk and `data/keys.json` verified live; the old practice-card address still redirects | Pass |

## Checks recorded

- `npm run check` — 42 files, 0 errors, 0 warnings, 0 hints.
- `npm run build` — 33 static pages.
- `npm run test:rules` — 19/19 (scoring, review ladder, statistics, corpus and key consistency).
- `npm run test:browser` — 22/22 (artifact, keys, dashboard, library, reader, runner, Category II partial credit, subject drill scope, review desk, navigator, search, syllabus, navigation, hint and notebook persistence, original card, the moved practice-card address, workspace, 320 px/200 % text, theme, **offline**, manifest and worker, compact search payload).
- `python3 docs/phases/01-evidence/check_inventory.py` — PASS, 42 rows, unique IDs, 45 local link targets.
- Chromium 153.0.8010.0, headless, 390 × 844 mobile viewport; screenshots of the dashboard, practice hub, library, reader, review desk, syllabus, search, lesson, original card and workspace.
- Build size: 73 files; `search-index.json` 381,610 bytes raw and 59,073 bytes gzip, carrying all 692 index entries.

## Bugs found and fixed during this work

1. **The runner read the wrong element for the marking facts.** `readQuestionMeta` queried `[data-question]`, which matched the inner question card as well as the pane, so the pane's own `data-category` was shadowed and every Category II item was scored as Category I (−0.5 instead of +0.5). Fixed by scoping the query to `.pane[data-question]` and by moving the marking facts onto the question section as well.
2. **A heading was being appended to the last option of a block.** The parser treated the `### Category‑II (Q31–40)` heading as option text, so 2025 Q30 option D read "1 ### Category‑II (Q31–40) …". Fixed by closing a question at the next heading; all 690 questions were regenerated and re-checked.
3. **The dashboard could not resume the lesson.** The learner progress was stored but never surfaced; the dashboard now offers the lesson with its last section.
4. **Wide text overflowed narrow screens.** Long labels, chips and KaTeX spans pushed pages past 320 px at 200 % text. Fixed with wrapping and scroll containment, and the lesson, card, workspace and search pages were brought onto the shared token system.
5. **The search directory shipped ~200 KB of markup.** Listing all 690 questions in the no-JavaScript fallback is unnecessary because every question is searchable; the directory now lists one entry per paper and the page is 12 KB.
6. **The published practice-card address would have broken.** The card moved from `/practice/orig-parallel-independent-v1/` to `/cards/orig-parallel-independent-v1/` when the PYQ drills took `/practice/`. A static redirect page now keeps the published URL alive, and a browser test follows it.

## Still not tested

- Live Lens app switching, TalkBack, cold launch in airplane mode, native share target.
- An independent content, rights or accessibility review of the published corpus and layout.
- A second device and a second browser.
- Whether 2022's derived key survives an independent recomputation by a reviewer.

## Rollback

Revert the branch and redeploy the last published build; `archive/jelet-prep/` was never modified and the older published site is still live. The new artefact is entirely static, so a bad release is a revert plus a Pages run.

**Roadmap updated by/date:** agent, 2026-11-19 — Phase 04 implemented, agent-verified and published; 05 and 06 partially delivered; the owner review of PR #4 and the independent content/rights/accessibility reviews remain open.
