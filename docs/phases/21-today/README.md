# Phase 21 — Today dashboard

**Reference:** [`07-today-dashboard.png`](../../references/ui-concepts/07-today-dashboard.png) · [reference notes](../../references/ui-concepts/README.md)

**Gate:** begin after Phase 20 review. The earlier dashboard work is a draft/prototype; this phase owns the final Today image and may replace that markup/styles while preserving behavior.

## Goal

Deliver the owner’s final Today design: an inviting home dashboard that resumes real local learning, makes useful study routes visible, summarizes real review/subject activity and keeps the first-run path understandable.

## State mapping to real product data

- Returning learner: resume an in-progress lesson or supported attempt using its exact saved route/section; submitted attempts link to review, not a fictitious timer.
- First-time learner: offer the actual Parallel Circuits lesson or a real subject drill, clearly labelled as a starting point rather than pretending a chapter is already in progress.
- Quick actions: link to real Learn, Papers, Practice/Mock destinations. The screenshot’s AI doubt solver, formula sheet and daily challenge are not functional features in the current product and must not appear as live actions.
- Review card: use the actual due-item queue; distinguish due today from items scheduled later.
- Subject cards: use per-subject unique answered-question coverage over the exact eligible question IDs/denominator, with a label that says “questions answered,” not “mastered” or generic lesson completion. No sample percentages.
- Bottom navigation: Today, Learn, Practice, Papers, You, with working routes from Phase 14/15.

## Target composition

1. Small brand lockup and “Smarter Study. Brighter Tomorrow.” tagline.
2. One full-width featured continue/start panel with real current activity, one clear action and a truthful secondary description.
3. A row of three compact, accessible quick actions.
4. A local review-queue tile with the actual due count.
5. Four subject cards in a two-column phone grid (wider grid on desktop), with subject identity, question-answer coverage, one small progress meter and route.
6. A modest plan/reminder card only if it leads to the existing plan and makes no streak/efficacy promise.

## Visual and behavior work

- Compare the whole visible first screen, card order, typography, whitespace, teal feature panel, line icons, chips and bottom navigation to `07-today-dashboard.png` at a documented viewport.
- Keep first-fold content concise enough that quick routes are visible on a common phone viewport; verify the fixed tab bar does not block a focused/active control.
- Keep paper totals, provenance and the longer scoring/privacy explanation available lower on the page or in a deliberate disclosure, rather than removing essential trust information.
- Make layout differ appropriately between true first-run and real returning-user states without fake seeded data.

## Tests and visual review

- Fresh device, a saved lesson section, an in-progress paper, a submitted result, due/overdue queue, no queue, storage denied and offline states.
- Subject coverage counts only distinct non-empty answered IDs from the matching eligible drill; submitting an otherwise blank paper must not mark every question “answered.”
- Resume action reaches the exact saved lesson section/attempt; secondary routes work; browser Back and tab navigation work.
- Chromium screenshots at 390×844 and a larger phone, plus 320 CSS px/200% text, desktop, light/dark and safe-area/tabbar overlap.
- Compare directly with the supplied Today image and list every intentional difference caused by unsupported reference features. Request owner visual review and Android check; do not start another redesign phase until the owner approves this screen.
