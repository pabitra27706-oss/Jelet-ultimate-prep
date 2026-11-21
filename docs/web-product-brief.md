# Static JELET study site · product brief

> Initial discovery note. For the current scope and five destinations including Learn, see the [handbook](README.md).

Research baseline: 19 November 2026. This is a web adaptation of [AppFlow's research, UI-reference, decision, roadmap and phase-record templates](https://github.com/pabi277/AppFlow/tree/1da317a446ffa36d347eba7fb3dd009b0c864bd3/templates/docs-system). Recommendations below are not shipped features.

## UI reference → student task

Reviewed the Diploma Study Hub source at [06656a9](https://github.com/pabitra27706-oss/Diploma-3rd-sem/tree/06656a9c3166ed86f0d3e05e965dfda068ec5a6e), not a visual or device test. Use its interaction patterns, not its CST content or exam rules.

| Observed reference | JELET adaptation and acceptance example |
|---|---|
| Home's Today’s Focus and conditional Continue card (`index.html`, `today.html`) | One primary action. First visit: choose a subject and try a short practice set. Returning: “Resume Physics · question 4 of 10”. Never show invented streaks or scores. |
| Search, syllabus coverage and question-level links (`search.html`, `coverage.html`) | Browse by subject, topic, year, category, readiness. Share a specific question; Back restores filters. Show a topic with zero verified questions honestly. |
| Quiz history, exact retry, local mistake queue and Settings backup | Separate Learn, Rehearse and Review. After submission, show the selected options, key source, marks calculation and explanation; offer “Retry my mistakes”. If storage fails, distinguish “not saved” from “saved”. |

**Visual direction:** paper-like reading surface, dark ink, one blue primary action; restrained subject accents with text labels. Phone: bottom navigation for the five global destinations (Today, Learn, Practice, Papers, You), with Review, Plan, Search, Syllabus, Offline, Coverage and Workspace reachable from the footer and the local You hub (Phase 14), full-width equations and tap-to-enlarge figures. Desktop: use the extra width for an optional question navigator alongside a bounded reading column. Keep timer and feedback out of the reading area. Provide visible keyboard focus, large labelled answer targets, non-colour-only correctness states, dark mode and reduced motion. No forced name entry or account. Bengali navigation/glossary is a candidate for student testing; keep official stems in English and label explanatory translations separately.

## Static technology decision (proposed)

Use **TypeScript in strict mode, Astro for prebuilt content pages, Tailwind CSS for shared design tokens, and Vite via Astro**. Plain links and readable questions should work before JavaScript loads. Hydrate only interactive tools (answer sheet, search, revision queue); add a UI library only if those components justify it. Self-host math rendering assets; build a search index ahead of time and load it on demand. Deploy only built public assets under the GitHub Pages repository base path, never the archive or personal backups. Prefer generated page URLs over history routes needing a server rewrite.

Keep study state in IndexedDB with versioned export/import; no login or server dependency. Static delivery cannot hide client-side answer keys or provide proctored exams. An offline paper pack must cache the selected paper, formulas and figures together and show its version; do not call an uncached paper offline-ready.

## Evidence before features

1. **Content pilot:** verify 10 varied 2025 Paper I items against the booklet, set, page, options, figure, syllabus and final key. Include a withdrawn item. Classify as scoreable, read-only or held; publication permission is a separate gate. Use the [2026 bulletin, §§2.2–2.5](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2026/03/20260318287108702.pdf) as a dated rules reference, not a substitute for the rules of each paper.
2. **Reader and practice:** test one phone journey end-to-end: find a topic, attempt a multi-select item, explain the partial mark, bookmark it, close the tab, resume it. Validate long equations, graphs and keyboard use. Keep syllabus and source links available even when scoring is blocked.
3. **Rehearsal and review:** unlock a full timed mock only after the complete paper, booklet mapping, withdrawals and year-specific scoring pass review. Archive historical formats separately. Review by subject with attempt counts; never convert a small local sample into a rank prediction.
4. **Resilience:** test a real legacy backup with permission, interrupted import, storage denial, deep-link refresh on Pages and offline pack updates. Release evidence should name the URL, device/browser, task and observed result rather than an APK or store checklist.

Next owner decision: Paper I first is recommended given the preserved materials. Treat Pharmacy as a separate scope and verify its own syllabus, corpus and keys before promising coverage.
