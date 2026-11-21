# Phase 18 — Practice choices

**Reference:** [`04-practice-options.png`](../../references/ui-concepts/04-practice-options.png) · [reference notes](../../references/ui-concepts/README.md)

**Gate:** begin after Phase 17 review. This phase changes the Practice destination/entry surface; question runner controls and result rendering remain separately governed.

## Goal

Turn the current practice index into a clear, inviting choice of supported ways to work, inspired by the reference’s large mode cards and independent/assisted selector.

## Real destinations to inventory and expose

- Verified/eligible previous-paper rehearsal, labelled by year and key tier.
- Subject/topic drills with their actual counts and marks.
- Original single-question practice cards, explicitly distinguished from official PYQs.
- A custom mock builder only where the working `/mock/` flow is linked and its available content is explained.
- Review queue as a follow-on study option, with a real count if available.

“Independent” and “With assistance” may be shown only for modes whose existing behavior actually differs. Assistance must be labelled and must not count as independent correctness. Each card must lead to an existing, tested route.

## Visual work

- Match the reference with a concise Practice heading, short independent/assisted selector where applicable, vertically stacked high-touch cards, distinct line icons, descriptive subtext and an obvious right-side route affordance.
- Make the first available, recommended start visible but do not hide less common supported choices behind an unexplained menu.
- Use a dense/compact mode on small phones only when text and tap targets remain readable; preserve desktop grid behavior.

## Non-goals and guardrails

- No Live Study Room, matchmaking, chat, shared session, AI doubt solver, daily challenge or other unsupported service.
- No invented “mastery”, time-saving or score-prediction promise.
- This chooser must not alter paper content, attempt state, scoring, timer semantics, or irreversible OMR behavior.

## Tests and visual review

- Each visible card’s accessible name and link target correspond to a real working flow; no dead/fake cards.
- Independent/assisted labels lead to expected behavior and assistance state is preserved through result/review.
- Data-limited, no-eligible-paper and first-run states; direct URL/back behavior; offline availability.
- Chromium viewport, keyboard, 44px target, reduced motion, 320px/200% text and dark-mode screenshots.
- Compare one Practice chooser screenshot to the supplied image and obtain owner approval before Phase 19.
