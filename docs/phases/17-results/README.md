# Phase 17 — Practice result and review

**Reference:** [`03-practice-results.png`](../../references/ui-concepts/03-practice-results.png) · [reference notes](../../references/ui-concepts/README.md)

**Gate:** begin after the Papers screen review. Keep this phase to the submitted-result/review surface; the practice chooser is Phase 18.

**Status (2026-11-21):** built and agent-verified on branch
`arena/61a4f729-jelet-ultimate-prep` and awaiting the owner's visual review —
see the [evidence record](2026-11-21-phase-17-results.md) and
[screenshots](screenshots/). Phase 18 must not start until this is accepted.

## Goal

Present a real attempt’s outcome in the hierarchy of the reference—headline result, per-question status and clear next steps—while making JELET scoring/provenance more trustworthy than the illustrative mock.

## Use actual result sources

Trace the current result rendering in `src/components/RunnerFrame.astro`, runner/result libraries and the existing tests. Reuse the immutable saved attempt; do not recompute against a changed key without showing a correction/version notice. Preserve year-specific scoring, blank/wrong/partial outcomes, assistance labels, score denominator, board-awarded questions, held items and answer-source tier.

## Target composition

1. Result heading with actual score and denominator (and percentage only if its meaning and denominator are explicit).
2. Compact summary of answered, correct, wrong, partial, blank, assisted and board-awarded items using real attempt records. Unscorable/held items are clearly outside the scoring denominator.
3. A scrollable question list with question number, topic/subject where known, response outcome and truthful key/source status. Color is backed by icon and text.
4. Per-item disclosure to review the response, answer/key provenance, mark calculation and existing explanation/lesson link only when available.
5. Primary “Retry independently” action that builds the actual eligible set and does not overwrite the immutable submitted attempt; secondary “Review answers”/return-to-paper action.
6. Empty/corrupt/old attempt handling that never invents a score.

## Concept differences that must be adapted

- The sample “6 of 10”, “3 questions lacked a verified key” and sample topic names are fictional: never ship them as data.
- Do not add “AI Analysis” or infer weak topics from fabricated content. Use existing deterministic records and review guidance.
- Preserve official, derived/provisional, read-only, held and board-awarded distinctions. Keep accuracy caveats discoverable without repeating a warning on every row.

## Tests and visual review

- Category I correct/wrong/blank; Category II full/partial/wrong/blank; negative marks; board voids; held and missing-key items; assisted answers; denominators and rounding.
- Results remain stable after reload and after a source correction; retries are new attempts; retry excludes ineligible questions and does not mutate the original.
- Keyboard/screen-reader row expansion, no color-only status, offline result review, narrow screen and 200% text.
- Chromium screenshots for a real representative result fixture with intentionally seeded data clearly identified as test-only; compare to the image without storing its fake numbers in site content.
- Owner reviews this screen before Phase 18.
