# Screen-phase sequence and owner review rule

The seven reference screens are separate implementation phases; the shared UI foundation is Phase 14 and precedes all of them.

| Sequence | Phase | Reference | Main route/screen |
|---:|---|---|---|
| 0 | [14 — Shared UI foundation](README.md) | shared elements across all references | App shell, icons, nav, tokens and common controls |
| 1 | [15 — You/settings](../15-you/README.md) | 01-settings.png | Local study/settings hub |
| 2 | [16 — Papers](../16-papers/README.md) | 02-papers-library.png | Paper search/list/filter |
| 3 | [17 — Results](../17-results/README.md) | 03-practice-results.png | Submitted attempt result/review |
| 4 | [18 — Practice choices](../18-practice-choices/README.md) | 04-practice-options.png | Practice entry/mode choices |
| 5 | [19 — Lesson](../19-lesson/README.md) | 05-lesson.png | Lesson reading screen |
| 6 | [20 — Learn](../20-learn/README.md) | 06-learn-subjects.png | Subject/syllabus catalog |
| 7 | [21 — Today](../21-today/README.md) | 07-today-dashboard.png | Study home/dashboard |

## Review cadence

One phase means one target reference image. Implement only that screen family, run tests, capture its screenshot at the reference viewport, push the phase commit to the current Arena branch, and stop for owner review. Record requested changes and refine the same screen before advancing. Do not batch multiple reference images into one implementation or ask the owner to review several unfinished screens together.

The current Arena branch is fixed by the session. Phase boundaries are commits and review gates on that branch—not new Git branches. The owner can check each pushed commit from Termux using the same branch and build command.
