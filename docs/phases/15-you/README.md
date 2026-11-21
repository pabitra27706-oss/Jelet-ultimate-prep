# Phase 15 — You / local settings

**Reference:** [`01-settings.png`](../../references/ui-concepts/01-settings.png) · [reference notes](../../references/ui-concepts/README.md)

**Gate:** implement this image only after Phase 14 shared foundation is owner-reviewed. This phase must not redesign other page families.

## Goal

Create the real local-only “You” destination suggested by the settings concept: a calm privacy statement, supported preferences, visible personal study activity, offline-pack management, backup and source information. It is a local study hub, **not an account or sign-in page**.

## Current product surfaces to reuse

- `src/pages/workspace/` and its subroutes for bookmarks, notes, local records and backup/import.
- `src/pages/offline/` for opt-in pack installation, update and removal.
- Existing local theme preference and `Site.astro` theme control.
- `src/pages/coverage/`, `src/pages/review/`, attempts, bookmark and progress stores for factual local activity.

Audit these APIs and schemas before adding UI. Keep the existing `/workspace/` and `/offline/` routes working and linked.

## Target composition

1. A compact, readable privacy card: “Your study data stays on this device.” Explain no account/upload, and link to the full privacy/source explanation.
2. A Preferences group with the existing theme setting. It must display the actual light/dark state and toggle the existing stored preference; do not create a second setting store.
3. Local activity cards. Show a real bookmark count from the bookmark store and a factual recent-study summary derived from saved attempts/lesson progress. Do not call visits “recently viewed” unless a deliberate, privacy-reviewed history feature is approved and actually implemented.
4. A “Manage offline packs” row linked to the existing user-controlled offline page. Do not add auto-download: downloads remain explicit.
5. An “Export backup” row that invokes or links to the actual workspace backup flow and keeps the existing schema/restore semantics.
6. An “About & sources” row to provenance, paper/key tiers, correction/accuracy notes and the independent-site statement.
7. Empty and unavailable states for a fresh browser, no bookmarks, no packs and blocked local storage.

## Visual and behavior work

- Match the reference’s grouped white cards, thin separators, calm teal line icons, generous row height and compact section headings.
- Use the Phase 14 Icon component and common shell; do not draw a fake person/profile avatar or notification indicator.
- Make full rows actionable links/buttons, preserve keyboard focus and 44px+ targets, and label switch state for screen readers.
- State clearly that clearing browser data can remove local study data. Do not imply persistence across devices.
- Keep the screen useful offline; all same-site settings and backup navigation must work without an external service.

## Tests and visual review

- Fresh profile: zero bookmarks/activity shown honestly; no invented `24`/`18` counts.
- Seeded local records: bookmark count and recent attempt/lesson summary match storage; reload persists them.
- Theme toggle updates the shared app theme and survives reload; storage denied leaves the page usable with a clear limitation note.
- Pack management and export links reach the existing pages/functions; no automatic download request on page load.
- Verify 320 CSS px, 200% text, tablet/desktop, light/dark, keyboard navigation, safe-area/fixed tabs and offline operation with Chromium.
- Capture the You screen at a documented viewport beside `01-settings.png`, list visual differences, and request owner review. Do not proceed to Phase 16 until review.

## Non-goals

No login, cloud sync, account creation, user avatar, analytics, notifications, automatic pack downloads, social features or newly invented activity counters.
