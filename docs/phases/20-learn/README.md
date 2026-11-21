# Phase 20 — Learn subjects and syllabus catalog

**Reference:** [`06-learn-subjects.png`](../../references/ui-concepts/06-learn-subjects.png) · [reference notes](../../references/ui-concepts/README.md)

**Gate:** begin after Phase 19 lesson review. Limit implementation to the Learn catalog and subject-discovery surface; Phase 19 owns detailed lesson reading.

## Goal

Make it easy to browse the real Paper I subject syllabus and find what can be studied now, taking visual direction from the reference’s search field, filter affordance and subject cards.

## Real content to use

- `src/lib/topics.ts`, `syllabusSubjects`, topic IDs, current open lesson collection and revision-note routes.
- The current lesson inventory and mapped questions, preserving “lesson available” versus “planned/missing” distinctions.
- Local question coverage only when its numerator/denominator are defined and testable. Prefer “questions answered of eligible set” over a generic completion percentage.

## Target composition

1. “Learn” title and short truthful subtitle.
2. Search across actual subjects/topics/lessons, with a useful zero-result state and clear action to reset.
3. Four Paper I subject cards: Mathematics, Physics, Chemistry and Fundamentals of Electrical & Electronics Engineering.
4. Each card shows current open lesson/topic availability and honest local activity where supported; it must not imply a full course exists when only one chapter is authored.
5. Subject selection expands or routes to ordered topics. Each topic clearly identifies an available lesson, revision notes/past questions, or “lesson not written yet.”
6. Search/filter controls retain keyboard access and meaningful labels; a clear all-subject route remains visible.

## Non-goals

No fabricated chapter totals or completion values, no AI tutor, no audio lesson claim, no external video/API dependency, no guessed lesson-to-question mapping and no changed syllabus evidence.

## Tests and visual review

- Search exact topic, subject and lesson names; no results/reset; unknown topic deep link and stable ID behavior.
- Subject card counts and availability match the actual topic/lesson collection, including one open pilot lesson and missing lessons.
- Search results preserve route links; keyboard and screen-reader labels; no overflow at 320px/200% text.
- Light/dark, offline catalog, direct link and return behavior; compare mobile and desktop Chromium screenshots with the reference.
- Owner approves this Learn screen before Phase 21.
