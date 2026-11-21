# Owner-supplied JELET mobile UI concepts

**Purpose:** visual references for the requested whole-site mobile UI redesign. The owner supplied these seven images in this conversation on 2026-11-21 and asked that they be kept in the public repository as references. They are concept mockups—not screenshots of this website, product specifications, verified exam data, or evidence that the depicted features exist.

## Reference screens

| Screen | Image | Visual direction to study | Must remain true in JELET |
|---|---|---|---|
| Settings / You | [`01-settings.png`](01-settings.png) | Privacy reassurance, preference rows, activity cards, backup/offline/source links, selected bottom tab | Show only settings and activity the app actually supports. Preserve local-first storage and voluntary offline downloads; do not imply auto-download or activity counts without working behavior. |
| Papers library | [`02-papers-library.png`](02-papers-library.png) | Search, compact filters, readable paper cards, bookmark affordance and clear answer-key status | Use the real JELET corpus and its real year/paper/booklet identity and key tier. Do not invent exam sessions, full keys, or bookmarks. |
| Practice results | [`03-practice-results.png`](03-practice-results.png) | At-a-glance outcome, item-by-item status, clear next actions and independent retry | Never copy the mock score or topic results. Use the actual submitted attempt, eligible items and applicable scoring rules; identify held, read-only, provisional and board-awarded cases honestly. No AI-generated diagnosis. |
| Practice choices | [`04-practice-options.png`](04-practice-options.png) | Distinct, easy-to-scan practice modes and an explicit independent/assisted distinction | Link only to modes that exist. Do not present a live study room or unsupported mode as functional. |
| Lesson | [`05-lesson.png`](05-lesson.png) | Calm reading measure, strong heading hierarchy, legible equation/example panel and a contextual practice action | Teach JELET-relevant content with reviewed explanations. Do not copy the mock's AC-circuit claims into unrelated lessons or promise audio/AI help unless those features are actually built and reviewed. |
| Learn subjects | [`06-learn-subjects.png`](06-learn-subjects.png) | Subject discovery, search, subject identity, visible progress and a clear browse path | Show the actual Paper I subjects and measured lesson availability. Never fabricate completion percentages, audio coverage, an AI tutor or chapter counts. |
| Today dashboard | [`07-today-dashboard.png`](07-today-dashboard.png) | Resume-first hero, quick routes, spaced-review entry point, compact subject progress and a reassuring study prompt | Resume only real local work; keep the first-visit path useful; surface real practice and learning destinations. No invented streaks, focus timer, progress or notifications. |

## Shared visual language

Use the images to guide the inner mobile web interface: bright neutral surfaces, dark readable type, a restrained teal/green action color, rounded cards, clear status chips with both text and icon, generous touch targets, consistent bottom navigation, and obvious hierarchy between the main action and supporting routes. Keep the screens visually related while letting a lesson, paper list, practice runner and result page serve their distinct tasks.

The phone bezel, notch, operating-system status bar and home indicator are presentation mockup chrome, not part of the website. Recreate the app content area, not an iPhone frame. Match the reference as closely as practical at comparable viewport sizes while preserving fluid behavior on real Android browsers, desktop, zoom and assistive technology; browser/font rendering means literal pixel identity on every device is not a realistic acceptance condition.

## Product, content and safety constraints

- The visual reference does not authorize new product claims or invented data. Values and names inside these concept screens are illustrative only.
- Preserve existing routes, direct links, keyboard access, reduced-motion support, dark mode, offline behavior, scoring, paper order, source/provenance labels and device-local privacy semantics.
- Maintain an honest distinction between official keys, derived/provisional material, read-only papers, board-awarded questions and held items.
- Do not add a backend, login, analytics, live AI, audio, automatic downloading or social/live-study service just because a mockup depicts it. A new capability needs its own product decision and verification.
- The images are user-supplied. Their original creator and a separate reuse licence were not provided; retain them only as the requested project reference set and do not present them as JELET board assets.

## Next implementation work

See [Phase 14: whole-site visual rebuild](../../phases/14-ui-rebuild/README.md) for the staged plan and acceptance gates. This reference set supports visual direction; it does not replace page-specific design review, browser tests, or the required physical-phone check.