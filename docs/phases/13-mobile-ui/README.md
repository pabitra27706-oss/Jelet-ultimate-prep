# Phase 13 — mobile-first UI refresh (first batch)

**Status:** first implementation in review; not a whole-site redesign or release authorization.

## Goal

Start a scoped, measurable UI refresh with the Today dashboard, using the selected concept image as direction and the account's Diploma Study Hub projects for interaction research. Keep JELET-specific content, truthful scoring, existing navigation/deep links, no-account privacy, offline behavior and the existing low-cost static stack intact.

## Sources and scope

- Research notes and source links: [`docs/UI_REFRESH_RESEARCH.md`](../../UI_REFRESH_RESEARCH.md).
- Selected visual reference: [`docs/ui-refresh-reference.png`](../../ui-refresh-reference.png) (generated illustration, never a site screenshot or shipped page asset).
- Product journey: [`docs/PRODUCT.md`](../../PRODUCT.md).
- Shared mobile, accessibility and deep-link contract: [`docs/UI_REFERENCE.md`](../../UI_REFERENCE.md).
- Testing gates: [`docs/TESTING.md`](../../TESTING.md).

This batch may change the Today markup and the `.today-*`/bottom-navigation styles needed for that page. It must not change question data, scoring, URLs, local-record semantics, exam-mode controls, or routes. Other page families (practice, quizzes, library/readers, lessons) remain untouched pending separate reviewable work.

## Acceptance checks

- One clear primary action; existing full-paper/custom-mock links remain usable.
- Four local statistics retain correct definitions and honest empty values; no invented countdown, study result or recommendation.
- Fresh-device state and actual resume state both have a clear path onward.
- Phone-first layout stays within 320 CSS px and survives 200% text; buttons/navigation remain usable, and desktop reflow remains intact.
- Light/dark theme, working offline shell, all existing route/data tests, static build and Astro check pass.
- No new runtime dependency, network request, remote font, personal-data collection, content change or publication.

## Evidence and handoff

Implementation and evidence are recorded in [`record.md`](record.md). Owner should inspect the live preview on a real phone, especially 200% text, dark theme, the fixed bar/safe area, and first-visit/returning states. Browser emulation is not physical Android acceptance. Do not redesign another family or deploy until the screen is reviewed and the next bounded scope is chosen.
