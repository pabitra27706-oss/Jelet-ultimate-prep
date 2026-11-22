# Phase 16 — Papers library

**Reference:** [`02-papers-library.png`](../../references/ui-concepts/02-papers-library.png) · [reference notes](../../references/ui-concepts/README.md)

**Gate:** start only after Phase 15 is visually reviewed. This phase covers the Papers landing/list only; question-reader layout is changed only where necessary to keep the listing-to-reader journey coherent and must be called out for review.

**Status (2026-11-21):** built, agent-verified and **accepted by the owner**
(the owner reported the device pass on 2026-11-21/22 and asked for the next
phase) on branch `arena/61a4f729-jelet-ultimate-prep` — see the
[evidence record](2026-11-21-phase-16-papers.md) and
[screenshots](screenshots/). The reader layout was not changed.

## Goal

Make the real JELET Paper I archive easy to find, filter and open, using the reference’s search field, year chips and clear paper cards without importing its fictional 2023 sessions or “Full/Partial/No Key” claims.

## Existing behavior and data to preserve

- `src/pages/library/index.astro`, generated `papers` metadata and existing search/filter controls.
- All existing permanent paper URLs, paper order, printed identity, booklet/set context, source labels, reconciliation gaps, scoreable/held/board-awarded counts and key tiers.
- Existing bookmarks and search index; `docs/CONTENT.md`, `docs/UI_REFERENCE.md`, and the editorial contract.

## Target composition

1. Page title “Papers” with one prominent in-corpus search field and concise helper text.
2. Filter chips for available years and a Bookmarked filter only if it reads the real bookmark store. Keep keyboard-accessible selected states and a clear-all route.
3. Paper cards containing the actual year/label, stream/booklet identity, question count and a truthful status badge: official key, derived/provisional, read-only/no published key, plus held/gap information when useful.
4. A real bookmark control on each card, labelled and stateful; preserve bookmark storage and workspace behavior.
5. Empty search/no-bookmarks states with useful filter-reset actions.
6. Paper-card activation opens the stable existing reader URL and retains search/filter context when Back is used where feasible.

## Visual work

- Match the reference’s bold title, rounded search field, pill filters, vertical card rhythm, aligned bookmark affordance and status chips with icon + text.
- On a narrow screen allow filter chips to scroll/wrap without page-wide overflow; card content remains readable when a year label or provenance note is long.
- Status colors are redundant with visible labels; do not use color alone.

## Prohibited substitutions

- Do not invent multiple JELET sessions/shifts or paper variants from the example screenshot.
- Do not simplify derived/provisional/read-only material into “partial key” if that hides provenance or uncertainty.
- Do not claim a complete key or scoreable paper where the corpus says otherwise.
- Do not change a key, paper transcription, scoring rule or stable question URL in this UI phase.

## Tests and visual review

- Existing library tests plus search by unique stem, filter by year/tier, bookmarked-only, clear filters, empty result, reader navigation and back-state.
- Bookmark a paper, reload, verify the icon/state and You/workspace count agree; storage denied shows graceful non-persistence.
- Confirm all papers in the corpus remain available and key tiers/counters match generated metadata.
- Chromium screenshots in light/dark at 320, 390, 430, tablet and desktop; 200% text; keyboard-only filters; offline and slow-data shell.
- Capture the Papers reference comparison and request owner visual review before Phase 17.
