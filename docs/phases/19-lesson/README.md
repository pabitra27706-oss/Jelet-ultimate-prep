# Phase 19 — Lesson reading screen

**Reference:** [`05-lesson.png`](../../references/ui-concepts/05-lesson.png) · [reference notes](../../references/ui-concepts/README.md)

**Gate:** begin after Phase 18 review. Scope this image’s lesson-reading experience; do not expand lesson content beyond reviewed material in a visual-only change.

## Goal

Make the existing lesson page feel like a focused mobile learning surface: readable explanation, clear section progress, worked example and a direct practice route, as in the reference.

## Source of truth

Use the existing authored/open lesson collection (currently the parallel-circuits pilot), its declared section anchors, prerequisites, examples, hints and `src/progress.ts` local resume state. Use the topic map for any PYQ backlinks. Do not imply that every syllabus topic has a written lesson.

## Target composition

1. Compact lesson header with back-to-Learn, actual lesson name, subject/topic, real time estimate and section position only if derived from actual saved reading location.
2. A clear section progress indicator that says “reading position/sections visited,” not mastery or course completion.
3. Bounded readable prose and equations with a clean display-math surface; long formulas scroll inside their own region.
4. Prediction prompt, explanation and worked example with progressive reveal/hints respecting current answer-leak rules.
5. A persistent contextual “Practise this topic” action that routes to a real mapped question/card or honestly says no reviewed PYQ match exists.
6. Audio/alternate format controls only if the resource exists and is available offline; otherwise omit them.

## Reference-only features to reject for now

The AC lesson, 311 V/50 Ω numerical example, “Explain this step” AI button and “Listen to Audio” control are illustrative. Use the actual reviewed parallel-circuits content; do not copy their claim/calculation into JELET content or create fake AI/audio affordances.

## Tests and visual review

- Correct topic/backlinks and all section anchors; browser Back returns to source question when opened from a PYQ.
- Resume lands on the exact saved section; fresh lesson has no false completion; storage blocked still permits reading.
- Hint/answer reveal and independent practice preserve existing privacy and anti-answer-leak behavior.
- Equations, SVG diagram text equivalents, dark mode, 320px, 200% text, keyboard, offline and safe-area controls.
- Chromium screenshot at the reference’s lesson viewport; compare title, paragraph width, equation panel, worked-example card and bottom action placement. Owner review before Phase 20.
