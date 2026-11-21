# Phase 14 — shared UI foundation

**Status:** planned before the per-image screen phases. The owner explicitly requested one shared, reusable foundation phase first, followed by one independently reviewable phase for each of the seven supplied images. Existing teal tokens and the in-progress Today prototype are exploratory inputs, not evidence that this phase or any screen is complete.

## Owner intent

Create the common visual and interaction system that all seven screen implementations can share, then stop after each screen phase so the owner can inspect that screen before the next begins. The owner is open to CSS, TypeScript and other fitting implementation techniques, and explicitly requests Chromium-based visual validation where useful.

The reference index and constraints are in [`docs/references/ui-concepts/README.md`](../../references/ui-concepts/README.md). Images are visual concepts, not verified JELET data or a feature list. See the [cross-image visual analysis](IMAGE-ANALYSIS.md), [exact screen sequence and review gate](PHASE-SEQUENCE.md), and [Termux check](TERMUX-CHECK.md).

## Foundation scope — shared by every page

### 1. Reference analysis and visual specification

- Record shared properties: white/cool-neutral canvas, teal primary actions, deep teal feature panels, rounded card groups, restrained shadows, high-contrast type, soft subject/status accents, consistent mobile bottom navigation and compact page headers.
- Record the per-image layout and interaction inventory before implementing the first screen. The image-specific acceptance criteria live in Phases 15–21.
- Specify design tokens for light/dark surfaces, text, line, brand, focus, status, spacing, type scale, radii, elevation, tap targets and safe-area spacing. Compare token choices against screenshots at fixed CSS viewport sizes.
- Use CSS and TypeScript already present in the static Astro project. Avoid adding a UI framework, font download, icon library, external request or runtime service when local CSS and inline SVG are sufficient.

### 2. Shared icon set

Add a small typed local SVG icon component or equivalent reusable implementation for only icons that have real destinations/meaning:

- Today/home, Learn/book, Practice/target, Papers/document, You/person;
- search, bookmark, recent activity/history, review/refresh, chevron/external link;
- download/manage offline, backup/export, source/about/info;
- sun/moon theme control, close/back, and clear semantic status icons.

Use consistent stroke weight, viewBox, size variants and current-color theming. Decorative icons are hidden from assistive technology; icon-only buttons need an accessible name and visible focus. Status meaning must also have text and may not depend on color alone. Avoid emoji as the shared icon system and do not draw a fake notification badge or fake account avatar.

### 3. Shared app shell and navigation

- Align mobile and desktop navigation around five destinations: Today, Learn, Practice, Papers, You. Preserve existing deep links and retain Review, Workspace, Search, Syllabus, Offline and Coverage as reachable destinations from relevant pages/You rather than deleting routes.
- Make each tab point to a real route. The You route is a local study/settings hub, not a sign-in screen. Do not create accounts, passwords, avatars, cloud sync or an account backend.
- Standardize the site header, brand lockup, theme control, page content width, footer, mobile bottom bar and safe-area padding. The browser/OS status bar, phone bezel and home indicator in the concepts are not part of the web page.
- Support active-route state, touch targets, keyboard focus and an accessible current-page indication. No decorative notification bell unless a real user-controlled notification capability is separately approved.

### 4. Shared interaction and content primitives

Review and refine reusable cards, action tiles, subject cards, status badges, search/filter controls, section headings, disclosures, meters, buttons, empty/loading/storage-denied/offline states and compact privacy/source notes. Keep light and dark mode readable. Keep long mathematical content scrollable inside its own container rather than widening the document.

### 5. Local state and product boundaries

- Keep progress, answers, bookmarks, theme and any supported preferences on-device. Preserve existing storage formats and backup compatibility.
- A local-only You hub is allowed; no cloud account or sync. The supplied “account” look is interpreted as a personal/settings destination, not an authentication feature.
- No auto-download switch: the established offline flow is explicit and user initiated. No notification badge, focus timer, AI tutor/analysis, audio service or live study room may appear as working behavior without a separate product decision and real implementation.
- Do not fabricate bookmarked/recent counts, scores, progress percentages, lesson availability, paper sessions, key coverage or analytics. If no equivalent state exists, provide a truthful empty state or omit the control.

## Implementation sequence inside Phase 14

1. Inventory all existing route, interaction and local-storage contracts touched by the shared shell.
2. Define the token and icon API in a short implementation note; select real route targets for all five tabs.
3. Implement icon primitives and shared app shell; refactor duplicated styling without changing page-specific information architecture yet.
4. Add route/keyboard/theme/contrast/safe-area tests. Verify a representative set of existing pages in both themes before moving to screen work.
5. Run Astro check, static build, the complete automated suite, Chromium route/viewport screenshots, offline checks and `git diff --check`.
6. Capture a shared-shell screenshot set and request the owner’s review. Do not start Phase 15 until the shared foundation is accepted.

## Acceptance gates

- All five global destinations resolve; old URLs and lower-level destinations remain usable.
- No false “account”, avatar, notification, automatic download, sync, tutor or activity claims.
- Icons are coherent, accessible and consistent in light/dark themes; icon-only controls have accessible names.
- No horizontal overflow at 320 CSS px or 200% text; focus, touch, safe-area and reduced-motion behavior remain valid.
- No changed exam data, scoring, key tier, privacy, offline storage protocol or existing export/import contract.
- Astro check/build and all test suites pass; Chromium checks cover representative routes, mobile/desktop widths, dark mode, offline and storage-denied states.
- Shared-shell screenshots are shown to the owner. This phase is not physically tested until the owner checks on Android.

## Handoff rule

Finish and push Phase 14 to the **current Arena branch**. Ask the owner to review it, then implement only Phase 15 (the You/settings reference). After each image phase, stop for the owner’s visual review before beginning the following image. See [`docs/phases/15-you/README.md`](../15-you/README.md) through [`docs/phases/21-today/README.md`](../21-today/README.md).
