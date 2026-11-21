# Visual and product analysis of the seven owner references

The images are mobile app-style mockups, not current JELET screenshots. Shared patterns and page-specific content are separated here so an implementation can match composition without importing invented features or exam records.

## Shared visual system

- Light cool-white canvas and white card surfaces, dark navy/near-black text, restrained teal/green primary accent, occasional blue/amber/violet secondary accents, soft rounded cards and low-contrast shadows.
- A compact top brand row, large readable page title, prominent first action, cards aligned to a consistent spacing grid and five-item bottom navigation.
- Line icons with consistent stroke and circular/soft-tint backgrounds; status chips combine color with icon and text.
- Major pages use one strong visual focal point; supporting routes are compact but discoverable. Mobile is the reference size, but the actual website must reflow rather than reproduce a fixed iPhone canvas.

## Image-by-image inventory

### 01 — You / settings

Visual pieces: local-data/privacy assurance panel; Preferences with dark-mode and offline controls; two activity cards; grouped manage-offline/export/about rows; You selected in the tab bar.

JELET mapping: reuse the current theme preference, bookmark/workspace and backup, offline-pack management and provenance pages. “Recently viewed” is not currently a guaranteed feature; prefer a factual recent-study summary from saved attempts/lesson progress. Do not add sign-in, auto-download or a synthetic profile.

### 02 — Papers

Visual pieces: large Papers heading; search-inside-papers field; year and Bookmarked chips; vertically spaced cards; saved/bookmark control; readable key-status pill.

JELET mapping: current corpus records and permanent reader URLs. Badges must communicate official, derived/provisional or read-only status and actual scoring readiness. The screenshot’s multiple 2023 sessions and simplified key labels are not JELET data.

### 03 — Practice result

Visual pieces: score hero; per-question outcome list; explicit next actions; small status chips including unresolved/unverified; retry independently.

JELET mapping: actual immutable attempt, actual denominator and scoring rules, source/key tier, board awards, held items and assistance. The example score/topic data and AI analysis are illustrative only; no AI assessment is added.

### 04 — Practice choices

Visual pieces: Independent/With assistance selector; large Topic Drill, Single Question and Exam-Style Paper cards; bottom navigation.

JELET mapping: offer only existing guided/original checks, real subject drills, verified/provisional paper rehearsal with status labels and actual custom-mock flow. Live Study Room is not part of this product.

### 05 — Lesson

Visual pieces: lesson title and position, progress line, clear explanation, equation panel, step explanation button, worked example and sticky practice/audio actions.

JELET mapping: use the actual parallel-circuits pilot with its authored example, hint ladder, independent check, SVG figure and saved section. The screenshot’s AC example, AI step tutor and audio do not describe current content/capabilities; omit them unless separately built/reviewed.

### 06 — Learn subjects

Visual pieces: Learn title/subtitle; search/filter; four subject cards, per-subject progress and chapter availability; encouragement banner; Learn selected.

JELET mapping: actual four Paper I subjects, actual syllabus/topic map and open lesson inventory. Only existing lessons and honest local question coverage are shown; do not copy fictional chapter counts/completion percentages, audio or AI tutor.

### 07 — Today dashboard

Visual pieces: brand/tagline; resume lesson hero with a progress element and focus timer; three quick-action tiles; spaced-review card; subject grid with progress; small encouragement card.

JELET mapping: exact resume route/section from local state; actual start lesson/drill for first-run; quick links to real Learn/Papers/Mock routes; actual queue due count; unique answered-ID coverage by eligible subject set. No fabricated progress, focus timer, notifications, AI solver, streak or recommendation.

## Fidelity target

Match all visual details that are genuinely UI—relative type scale, hierarchy, card order, widths, spacing, corner radii, colors, icon language and navigation—at recorded viewport sizes. Phone OS chrome/bezel is not web UI. Functionality and truthful data override any decorative sample values. The owner reviews each screen before the next image phase starts; screenshot differences must be recorded rather than silently called “100% identical.”
