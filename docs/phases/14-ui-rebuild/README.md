# Phase 14 — whole-site visual rebuild

**Status:** in progress; seven references are captured in Git, the shared light/dark teal palette is updated, and the Today dashboard's first visual rebuild is underway. The remaining page families, owner visual review, physical-device check and deployment are not complete or claimed.

## Owner request and target

On 2026-11-21, the owner supplied seven mobile screen concepts and requested that they be added to GitHub as references, then used to guide a much more modern and engaging UI throughout the site. The stated goal is a very close visual match, with effort and time not being the limiting factor.

The canonical reference set and screen-by-screen interpretation is [`docs/references/ui-concepts/README.md`](../../references/ui-concepts/README.md). Treat it as the visual direction—not a source of exam facts or authorization to pretend that illustrative features in the images already exist. The target is the website content within the device frame, not the phone hardware/OS chrome. Pixel-identical rendering cannot be guaranteed across browsers, installed fonts, device sizes and OS controls; compare at specified viewport sizes and aim for high fidelity while preserving robust responsive behavior.

## Screens in scope

1. Today dashboard — first-visit entry, real resume state and discovery routes.
2. Learn catalog — Paper I subjects, honest lesson availability and search.
3. Lesson page — readable explanations, equations/examples, progress and relevant practice links.
4. Practice chooser and practice runner — actual supported practice modes, clear independent/assisted states, preserved exam behavior.
5. Practice result/review — actual attempt values, accurate scoring and transparent item statuses.
6. Papers library/readers — real paper identities, search/filter/browse, provenance, key readiness and bookmark behavior only if supported.
7. You/settings/workspace — real preferences, local activity, offline-pack controls, backup and source/about information.

## Non-negotiable constraints

- Follow [`AGENTS.md`](../../../AGENTS.md), [`docs/PRODUCT.md`](../../PRODUCT.md), [`docs/UI_REFERENCE.md`](../../UI_REFERENCE.md), [`docs/TESTING.md`](../../TESTING.md), and the active roadmap. Work in bounded screen families with review checkpoints; keep the public study path static, free to operate, accountless and private by default.
- Preserve all existing content, behavior, route/deep-link contracts, per-year scoring, key tiers, provenance and uncertainty. No visual refactor may silently change a learner's marks or imply that a held/read-only item is gradeable.
- Do not fabricate the example scores, 2023 shifts, key completeness, subject completion values or activity counts in the concepts. Use the site's real data.
- The mockups depict AI analyses/tutors, live study rooms, audio, auto-download, focus timers and notification/profile ideas. Do not ship these as working affordances unless the capability exists and is separately approved, privacy-safe and tested. A visual placeholder must not masquerade as functionality.
- Phone-first; keyboard, screen-reader, high-zoom, reduced-motion, contrast, touch target, offline and desktop behavior remain acceptance requirements.
- No new runtime service/dependency or deployment is authorized by this reference request.

## Staged approach

### 14.1 — Shared visual system and navigation

Document reference-derived visual tokens and component states, then converge global type scale, spacing, surfaces, cards, buttons, status labels, disclosures, bottom navigation and light/dark treatments. Validate these changes across representative existing routes before applying page-specific styling. Do not remove warnings that carry essential accuracy or provenance information; reduce repetition and improve presentation instead.

**Complete for the first pass:** the shared light/dark palette now uses the references' cool neutral surfaces and teal/green accents, including the browser theme color. Global component refinement and full visual review remain outstanding.

### 14.2 — Today dashboard

Rebuild the first-visit and returning-student home view around an honest resume card, real quick routes, the local review queue and available subject drills. Keep all counts derived from actual paper and device data; keep the full paper library, local record and source/scoring explanation discoverable. Verify 320px/200% text, light/dark, empty and returning states.

**In progress:** the home now has reference-inspired quick-action cards, a review-queue card backed by actual due items, and subject cards backed by the real 2025 keyed drills. The redundant first-visit privacy banner was removed from the home fold; the local-first promise remains in the site copy and detailed trust disclosure. Astro check, static build and the complete 64-test suite pass; focused tests cover new routes, actual review counts, lesson resume, offline use and 320px/200% layout. This screen is not yet owner-reviewed or Android-tested.

**Current render snapshots:** [390 × 844 mobile](today-current-mobile.png) and [1280 × 900 desktop](today-current-desktop.png), captured from the built static output in bundled headless Chromium. These show the implementation for comparison; they are not physical Android screenshots, a final visual match, or owner acceptance.

### 14.3 — Learn and lesson family

Bring the Learn catalog and lesson reading experience toward their references using only existing lesson/topic data. Verify correct subject names, visible availability, resume behavior, equation overflow and useful return paths.

### 14.4 — Practice, runner and results family

Align the practice-mode discovery, question runner and result/review screens. Exercise each scoring category, blanks, partial credit, held items, board awards, assistance labels, retries and offline behavior. Use real local attempts in every visual fixture; never hard-code the concept image's sample outcome.

### 14.5 — Papers and You/settings family

Refresh paper discovery, paper readers, local settings, workspace, offline management and backup. Validate actual library keys/source statuses and preserve export/import compatibility, route targets and storage-denied states.

### 14.6 — Whole-site consistency and release evidence

Review all routes in light and dark themes at narrow-phone, large-phone, tablet and desktop widths; test keyboard/high zoom, 320 CSS px, 200% text, safe-area/fixed navigation, offline, fresh and returning local states. Capture comparable screenshots against the seven references and run the complete verification contract. Request the owner's real Android review on the live preview. Update the phase record and roadmap with evidence and unresolved differences; no release/deployment without its separate approval.

## Visual review method

For each screen family, record (a) the reference image, (b) a matching viewport and state, (c) the implementation screenshot, (d) a short list of visible differences and (e) the tested behavior behind each control. Judge hierarchy, alignment, spacing, typography, color, borders, card proportions, icon meaning and navigation consistency. Do not optimize a screenshot at the cost of fluid layout, accessible reflow, truthful data or real interactions.

## Acceptance gates

A screen family is not complete merely because it builds or resembles a static mock. It must:

- render actual JELET content and reachable working actions;
- maintain route, content, privacy, scoring and offline contracts;
- pass the relevant Astro check, automated tests, screenshot/viewport checks and `git diff --check`;
- receive owner visual review for that family; and
- remain explicitly marked as not physically tested until the owner checks it on Android.

No later stage is assumed complete by planning this one. No deployment is authorized by this document.
