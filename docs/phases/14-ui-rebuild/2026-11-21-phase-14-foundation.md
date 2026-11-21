# Phase 14 — evidence record: shared UI foundation

- **Phase, status, date, branch/commit, owner/reviewer:** Phase 14 — shared UI foundation;
  **built and agent-verified, awaiting owner visual review**; 2026-11-21; branch
  `arena/14f27fdd-jelet-ultimate-prep`, implementation commit `aa158e0`; owner is the reviewer.
  Phase 15 has **not** started.
- **Inputs and pre-change evidence; reused/adapted/rejected reference and licence:**
  [Phase 14 plan](README.md), [cross-image analysis](IMAGE-ANALYSIS.md),
  [screen sequence](PHASE-SEQUENCE.md), [reference index](../../references/ui-concepts/README.md)
  and the seven owner-supplied concept images. Only shared composition was taken from them:
  five destinations, cool-neutral canvas, teal primary, rounded grouped cards, line icons with
  text status. No image was copied, traced or re-used as an asset, and the phone bezel, status
  bar and home indicator were not reproduced. Existing tokens in `src/styles/site.css` were kept
  as the semantic layer rather than replaced. No new dependency, font, icon library or service
  was added.
- **Approved scope, delivered outputs, deliberate exclusions:**
  - `src/lib/icons.ts` + `src/components/Icon.astro`: a typed local SVG set (24 names), one
    viewBox, one stroke, `currentColor`, decorative by default, named on request.
  - `src/components/StatusBadge.astro` and `src/components/EmptyState.astro`: shared status and
    empty-state primitives that always pair icon with text.
  - `src/layouts/Site.astro`: one app shell for every route — brand lockup, five global
    destinations (Today, Learn, Practice, Papers, You) in the desktop header and the mobile
    bottom bar, named search control, one theme control, a footer that keeps Review, Plan,
    Search, Syllabus, Offline packs, Coverage, Workspace and revision notes reachable, and a
    skip link.
  - `src/lib/theme.ts`: one stored preference (`jelet:theme`) shared by the header button and the
    You switch, with an explicit storage-denied message and operating-system default.
  - `src/pages/you/index.astro`: a working local-only You hub — privacy statement, theme
    preference, real bookmark/attempt/review/pack read-out, links to the existing offline,
    backup, workspace, review, plan, search, syllabus and coverage routes, and a compact
    "About, sources and limits" disclosure built from real corpus counts.
  - `src/styles/site.css`: token layer (space, type, radii, elevation, tap, safe area, layers) and
    shared controls (page head, panel/rows, action tiles, privacy and source notes, switch,
    empty state, panel disclosure).
  - `public/sw.js` precaches `./you/`; `scripts/public-artifact.json` allows the new route;
    `scripts/capture-screens.mjs` reproduces the screenshots below.
  - **Excluded deliberately:** sign-in/account/avatar, notification bell or badge, auto-download,
    sync, AI, audio, timers, analytics, invented counts, and any screen-specific redesign from the
    seven references. Phase 15's full settings composition is not implemented.
- **Gate-by-gate results (all pass unless stated):**
  - Route inventory: 63 built pages; the five destinations resolve; every previous route and deep
    link keeps its address. Observed via the artifact allowlist test, the footer-link fetch check
    and the existing route suites.
  - Shared shell at 390 px: five tabs, one icon each (`aria-hidden="true"`, label carries the
    name), labels are words, each tab ≥ 44 px tall, one `aria-current="page"` per route.
  - Desktop 1280 px: the same five in the header, bottom bar `display: none`; icon-only header
    controls have accessible names.
  - Icon consistency: every `svg.icon` on four representative routes has `viewBox="0 0 24 24"`,
    `stroke-width="1.75"`, `stroke="currentColor"`, and is decorative or named.
  - You hub: privacy statement present; no account/sign-in/avatar/notification/auto-download
    claims; fresh browser shows 0 / 0 / 0, "Nothing downloaded yet" and a real empty state; no
    pack state is written on load.
  - You activity: one submitted 2025 paper + one bookmark + one note shows 1 attempt
    ("1 submitted"), 82 queued review items and 2 saved items, and the same after reload.
  - Theme: You switch and header button drive one stored value; reload persists it; the operating
    system theme is followed before a choice exists; a stored choice outranks it.
  - Storage denied: the hub states that local storage is blocked and that nothing will be saved;
    counts read "—"; the empty state is not shown (an unavailable store is not an empty one); the
    theme still changes for the page.
  - Light/dark token contrast (computed from the built stylesheet): ink/paper ≥ 7, muted/card ≥ 4.5,
    teal/card ≥ 3, focus/paper ≥ 3 in both themes.
  - Keyboard: the skip link is the first Tab stop and focuses `#main`; a keyboard-focused icon
    control draws a solid ≥ 2 px ring; the footer is not covered by the fixed tab bar.
  - 320 CSS px at 200 % text: no page-wide overflow on Today, You, Learn, lesson, Practice, paper
    reader, practice runner, Review, Syllabus, Search or a practice card.
  - Offline: `/you/` is precached and opens with the network off, with its privacy heading intact;
    the existing pack download/removal and study-record checks still pass.
  - No exam data, scoring rule, key tier, storage schema, pack protocol or export/import contract
    changed — the diff touches no `src/data/`, `editorial/` or archive file.
- **Python/build/Chromium:** commands and results in the table below. Chromium is the bundled
  headless build reported by the suite; viewports 320×700, 390×844 and 1280×900; both themes.
- **Screenshots:** 25 captures in [`screenshots/`](screenshots/) — Today, You, Learn, Practice and
  Papers at 390×844 and 1280×900 in light and dark, plus 320×700 light. Agent-generated browser
  renders, not physical-device evidence.
- **Honest comparison with the references:** the shell matches the concepts' five-tab structure,
  teal accent, rounded grouped cards, line-icon language and icon+text status. It does **not**
  match the concepts' bezel/status-bar chrome (deliberately absent), their illustrated avatars,
  notification bell, focus timer, or the sample counts and percentages (no such state exists).
  The You hub is a foundation version with real local data; its visual refinement against
  `01-settings.png` is Phase 15's work. No claim of pixel identity is made.
- **Residual physical gate:** **ANDROID CHECK NEEDED** — the owner should open the built preview
  on a real Android phone and check: bottom tabs above the device gesture area, tap accuracy,
  system dark mode before any choice is stored, 200 % text zoom, keyboard/TalkBack reading of the
  tab bar and You switch, and that the You hub reports the same local counts the pages do. Emulation
  is not a physical pass.
- **Not tested / not claimed:** physical Android browsers, TalkBack or VoiceOver announcements,
  iOS Safari, Firefox, an axe/Lighthouse audit, an independent accessibility review, an
  independent visual review, and a real reduced-motion device setting (the site's existing
  `prefers-reduced-motion` rule is unchanged and was not re-verified beyond the stylesheet).
- **Privacy, accessibility, cost, editorial and rollback:** no new service, request, dependency,
  account or upload; no analytics; no editorial, scoring or archive change. The site remains a
  free static build. UI and docs changes revert cleanly with no data migration.
- **Blockers, unresolved risks, next action and decision needed:** owner visual review of this
  foundation is the gate. On approval, Phase 15 may refine `/you/` against `01-settings.png`.
  Until then no screen phase should start.
- **Roadmap updated:** Phase 14 row and next-action note in `docs/ROADMAP.md`, 2026-11-21.

## Validation commands and results

| Command | Result |
|---|---|
| `npm ci --no-audit --no-fund` | 305 packages installed; no manifest or lock change |
| `npm run check` (`astro check`) | **0 errors, 0 warnings, 0 hints** across 114 files |
| `npm run build` | **63 static pages**, 10 offline packs (26,486 KB declared), `dist/` ≈ 18 MB |
| `npm test` | **287 passed, 0 failed** across the 11 configured subcommands: key-safety 20, rules 22, figures 39, phase05 27, phase06 12, phase07 22, phase08 22, mock 36, remediation 8, quiz 6, browser **73** |
| `python3 docs/phases/01-evidence/check_inventory.py` | `PASS: 42 rows, unique IDs and all required fields; 89 local link targets` |
| Markdown link check over the changed docs | all local links resolve (temporary stdlib script; not committed) |
| `git diff --check` | no whitespace errors |

**Environment:** the sandbox's system Node is v22.22.3, below the repository's pinned
`>=22.23.4`, so the compatible `node-linux-x64@22.23.4` binary was installed under the ignored
`node_modules/` (no `package.json` or lockfile change) and used for every command:
`PATH="$PWD/node_modules/node-linux-x64/bin:$PATH" npm run check`, `… npm test`. The pack manifest
was regenerated by the build, as in previous phases, because the shared stylesheet changed the
published byte sizes. This is a local sandbox limitation, not a repository change.
