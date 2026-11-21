# Phase 14 implementation notes — tokens, icons, shell and routes

**Written:** 2026-11-21 · branch `arena/14f27fdd-jelet-ultimate-prep`

These notes define the API the seven screen phases (15–21) build on. They describe
what exists now, not what is planned.

## 1. Route map after the shell change

| Global destination | Route | `active` key | Icon |
|---|---|---|---|
| Today | `/` | `today` | `home` |
| Learn | `/learn/` | `learn` | `book` |
| Practice | `/practice/` | `practice` | `target` |
| Papers | `/library/` | `library` | `papers` |
| You | `/you/` | `you` | `user` |

Every other route is unchanged and still resolves. They are no longer primary
tabs, so they keep their own `active` key (which leaves no tab marked) and are
linked from the shared footer and from the You hub:

`/review/`, `/plan/`, `/search/`, `/syllabus/`, `/offline/`, `/coverage/`,
`/workspace/`, `/workspace/topics/`, `/notes/<subject>/`, `/cards/<id>/`,
`/mock/`, `/mock/run/`, `/quiz/`, `/learn/<lesson>/`, `/library/<paper>/`,
`/practice/<paper>/`, `/practice/<paper>/<subject>/`,
`/practice/<paper>/print/`, `/practice/<paper>/reconciliation/`, `/data/*`.

The `active` union accepts the previous keys (`review`, `search`, `workspace`,
`syllabus`, `offline`, `coverage`, `''`) plus `you`. No page's `active` value
changed, so the header/tab-bar current state is derived, not re-authored per
page.

## 2. Design tokens (additions to `src/styles/site.css`)

The existing semantic palette (`--paper`, `--card`, `--ink`, `--muted`, `--line`,
`--teal`, status colours, figure colours) is preserved because every existing
page reads it. Phase 14 adds the shape and rhythm layer:

| Group | Tokens | Notes |
|---|---|---|
| Space | `--space-1 … --space-6` | 4 / 8 / 12 / 16 / 24 / 32 px equivalents at the default size |
| Type | `--text-xs`, `--text-sm`, `--text-base`, `--text-md`, `--text-lg`, `--text-xl`, `--display` | Existing heading clamp kept; new names are aliases used by new components |
| Radii | `--radius-xs`, `--radius-sm`, `--radius`, `--radius-lg`, `--radius-pill` | 8 / 12 / 18 / 26 px |
| Elevation | `--shadow-sm`, `--shadow`, `--shadow-lg` | Two existing shadows kept, one hairline shadow added |
| Interaction | `--tap`, `--tap-lg`, `--icon-stroke` | 44 px minimum target, 48 px primary, one icon stroke |
| Shell | `--shell-h`, `--tabbar-h`, `--safe-bottom` | Header height, mobile bar height, `env(safe-area-inset-bottom)` |
| Layers | `--z-header`, `--z-tabbar`, `--z-toast` | 30 / 40 / 60 |
| Focus | `--focus` | Unchanged; token-level contrast is asserted in the browser suite in both themes |

Dark mode overrides only the semantic palette, as before; the new tokens are
theme-neutral.

## 3. Icon API

`src/lib/icons.ts` exports `ICON_NAMES`, `IconName` and the geometry map.
`src/components/Icon.astro` renders one icon:

```astro
<Icon name="you" size="md" />                  <!-- decorative -->
<Icon name="lock" size="lg" label="On-device" /> <!-- named, when the icon is the only meaning -->
```

- 24 × 24 viewBox, `stroke-width="1.75"`, rounded caps and joins,
  `stroke="currentColor"`, so light and dark themes need no per-icon work.
- Sizes: `sm` 16 px, `md` 20 px, `lg` 24 px, or a number.
- Decorative by default (`aria-hidden="true"`, `focusable="false"`). A `label`
  adds `role="img"` plus an accessible name.
- Icon-only buttons and links must carry their own `aria-label`; the icon inside
  stays decorative.
- Status meaning is always text plus icon; the `StatusBadge` component enforces
  that.

Names: `home`, `book`, `target`, `papers`, `user`, `search`, `bookmark`,
`history`, `refresh`, `chevron-right`, `chevron-down`, `arrow-left`, `close`,
`external`, `download`, `upload`, `info`, `sun`, `moon`, `check-circle`,
`alert-triangle`, `lock`, `offline`. No emoji, no icon font, no external sprite,
no new dependency.

## 4. Shared components and classes

| Primitive | Where | Contract |
|---|---|---|
| `Icon.astro` | `src/components/` | Decorative by default; named when it carries meaning |
| `StatusBadge.astro` | `src/components/` | `label` + `tone` (`neutral`, `official`, `derived`, `held`, `info`) + optional icon; reuses `.chip` tones |
| `EmptyState.astro` | `src/components/` | Icon, title, optional body and one real action; describes local truth |
| `.page-head` | CSS | Eyebrow, `h1`, `.lead`; constant spacing on every page |
| `.panel`, `.rowlist`, `.rowlist-row` | CSS | Grouped white card with hairline rows; rows wrap rather than overflow |
| `.action-tile`, `.tile-grid` | CSS | Large tappable destination: icon, title, one honest supporting line, value |
| `.privacy-note` | CSS | Compact local-data assurance; icon plus heading plus text |
| `.source-note` | CSS | Compact provenance statement with a hairline accent |
| `.switch` | CSS | Labelled switch: `role="switch"`, `aria-checked`, and a visible On/Off word |
| `.empty-state-card` | CSS | Shared empty/loading/denied container with icon and action |
| `details.panel` | CSS | Disclosure that reads as a row; used for "About, sources and limits" |

Existing `.card`, `.chip`, `.meter`, `.stat`, `.filters`, `.field`, `.btn`,
`.linkrow`, `.notice`, `.content-caution` are retained and unchanged; screen
phases should extend them rather than replace them.

## 5. Theme contract

- One key, `jelet:theme` (`light` | `dark`), unchanged from earlier releases.
- `src/lib/theme.ts` owns the choice: pre-paint inline script in `Site.astro`,
  `resolveTheme()`, `applyTheme()`, `paintThemeControls()`, `initTheme()`.
- Any element with `[data-theme-toggle]` is a control. The header draws a
  sun/moon icon button; the You hub draws a `role="switch"` row. Both drive the
  same store, and both repaint after a change.
- `[data-theme-status]` receives "Saved in this browser." or the
  storage-blocked explanation. `[data-theme-state]` receives On/Off.
- A browser that blocks storage still gets a working toggle for the page and an
  explicit statement that the choice is not saved.

## 6. Local state the You hub reads (read-only)

| Store | Key / database | Used for |
|---|---|---|
| Attempts | `localStorage` `jelet:attempts:v1` | Attempt count, submitted count |
| Review queue | `localStorage` `jelet:review:v1` | Queue size and due count |
| Offline packs | `localStorage` `jelet:packs:v1` | "Nothing downloaded yet" / packs ready |
| Workspace | IndexedDB `jelet-workspace` | Bookmark and note count |
| Theme | `localStorage` `jelet:theme` | Preference row |

No schema, key, export/import contract, pack protocol or scoring rule changed.
The You page only reads these stores; it writes nothing except the existing
theme preference and never starts a download.

## 7. Deliberate exclusions (for the later screen phases)

- No account, sign-in, password, avatar, profile or cloud sync.
- No notification bell or badge; no focus timer; no AI tutor/analysis; no audio;
  no live study room; no analytics.
- No automatic or background pack download. The offline flow stays explicit.
- No invented activity counts, streaks or percentages. "Nothing studied yet" is
  an observation about this device, not a measured zero.
- No screen-specific layout work from the seven references. Today, Papers,
  Results, Practice choices, Lesson and Learn remain for Phases 15–21 (You is
  the Phase 15 target and is deliberately only a working hub here).

## 8. Reproducing the screenshots

```sh
npm run build
node scripts/capture-screens.mjs \
  --out docs/phases/14-ui-rebuild/screenshots \
  --routes "/,you/,learn/,practice/,library/" \
  --themes light,dark --widths 390,1280
node scripts/capture-screens.mjs \
  --out docs/phases/14-ui-rebuild/screenshots \
  --routes "/,you/,learn/,practice/,library/" \
  --themes light --widths 320 --height 700
```

Each capture is a headless Chromium render of `dist/` at the site's real
subpath. The script fails on a console/page error or a non-200 response. The
phone bezel, OS status bar and home indicator are not part of the page, so they
do not appear.

## 9. Phase 15 — the You screen contract (for Phases 16–21)

Phase 15 refined `/you/` against `01-settings.png` without changing any route,
store key or export contract. Later screens should reuse this vocabulary rather
than invent a second settings style.

- **Layout:** `.you` is a 40 rem centred column; `.you-hero` is the tinted
  privacy card; `.you-heading` labels a group; `.settings-card` groups rows;
  `.settings-row` is one 62 px full-row link or control; `.settings-icon` is
  the teal 22 px glyph slot; `.settings-copy`, `.settings-label` and
  `.settings-sub` hold the text; `.settings-chevron` is decorative. The
  optional disclosure is `details.settings-disclosure` with `.settings-body`.
- **Activity:** `.you-activity` is a two-column grid above `22rem` and a single
  column below it; `.activity-card` is a link with `.activity-icon`,
  `.activity-label`, `.activity-value` and a decorative `.activity-go`
  chevron. Never populate `.activity-value` with a sample number.
- **Motion preference:** `src/lib/motion.ts` mirrors the theme contract. One key
  `jelet:motion:v1` (`full` | `reduce`); the pre-paint script in `Site.astro`
  sets `html[data-motion]`; the device's `prefers-reduced-motion` is the
  default; `[data-motion-toggle]` is the control; `[data-motion-state]` and
  `[data-motion-status]` are the word state and explanation;
  `html[data-motion="reduce"]` disables transitions and smooth scrolling.
  Storage-blocked browsers still get a working switch for the page.
- **Status text:** `.settings-sub.visually-hidden[data-blocked="true"]` becomes
  visible when storage is refused, so a limitation is never silent; otherwise
  the explanation is available to assistive technology through
  `aria-describedby` without adding a line the reference does not have.
- **Shell measurement:** the phone tab bar is 24 px icons / 11.5 px labels with
  no active pill, and `--tabbar-h` is 4.9 rem. Any page that scrolls to the
  bottom must keep the footer above it (the keyboard/geometry test enforces
  this).
- **Screenshots:** `docs/phases/15-you/screenshots/` holds the 390×844 and
  1280×900 light/dark captures, 320×700, 375×812 and the About-open state,
  produced with the same `scripts/capture-screens.mjs` command documented in
  §8.

## 10. Phase 16 — the Papers screen contract

- **Structure:** `.papers` is a 46 rem centred column; `.papers-title`,
  `.papers-search` (a real form with `#paper-search`, labelled), `.papers-chips`
  (a horizontally scrolling row of `.filter-chip` buttons with `aria-pressed`),
  `.papers-list` of `.paper-card` items, `.papers-empty` and two plain
  disclosures (`details.papers-more`, `details.papers-about`). The global
  `details` card treatment is deliberately overridden for those two.
- **Card:** `.paper-card` is positioned; `.paper-card-body` is the link (grid
  areas year/title/provider/status/meta/match) with `aria-label={paper.label}`;
  `.paper-bookmark` is a sibling 44 px button so a link never nests a button.
  Below 23 rem the card becomes one column.
- **URL state:** `q`, `year`, `key`, `subject` and `bookmarked` are mirrored
  with `history.replaceState`/`URLSearchParams`; the page restores them on load.
  Back from a reader therefore returns to the same filtered list.
- **Bookmarks:** the toggle writes the existing IndexedDB store through
  `readWorkspace`, `makeBookmark` and `writeWorkspace` using
  `itemId = "paper:<paperId>"`; it never touches the resume slot or notes. A
  blocked store disables the controls and leaves the links working.
- **Search:** `#papers-search[data-index-url]` fetches `dist/search-index.json`
  on the first two-character query only, expands the compact entries, and uses
  the shared `matches()` function with type `question`. Matching question counts
  are shown per card. While the index loads the list is left unfiltered and the
  status says so; when the fetch fails (offline, not cached) the page filters on
  paper identity only and says question search is unavailable.
- **Statuses:** `StatusBadge` with `tone="official" | "derived" | "neutral"` and
  the labels **Official key**, **Derived key**, **No published key**. Never
  “Full/Partial/No Key”, and never colour alone.
- **Accuracy caution:** the disclosure lives in `ContentCaution.astro`. The
  layout renders it under the header for Practice and Review, and Papers passes
  `caution="inline"` to render it itself after the chips and before the cards,
  so the title and search field open the screen.

## 11. Phase 17 — the practice result contract

- **Where it lives:** the result is rendered into `[data-runner-results]` by
  `renderResults()` in `src/lib/runner.ts` and replaces the question panes.
  Once a paper is marked, `focusResult()` hides the sitting bar, the navigator
  and the storage note, and the outcome scrolls into view; the page keeps its
  route, header and history.
- **Hero:** `.result-hero` holds a CSS-conic `.result-ring` (clamped 0–100,
  value in `--result-value`), the exact `<b>` score inside `.score-hero`, the
  written denominator, and the counts sentence as the **first `.micro`** —
  existing tests read that node.
- **Denominator:** `summarise()` runs over items whose status is not
  `unmarked`; unmarkable questions are counted separately and excluded from
  the maximum. Nothing is added to the maximum that could not be awarded.
- **Statuses:** `Correct`, `Partial`, `Wrong`, `Blank`, `Board-awarded`,
  `Not marked`, each with a glyph and a `.pill`; colour is never the only
  signal. The old “Voided” wording is gone from the result.
- **Rows:** `<details class="result-item" data-result-row="…">` keeps the row
  count and adds a disclosure. The body shows category and marks, marked
  option, key, `Marks awarded +1 of 1`, the explanation, the key tier and a
  link to `library/<paper>/<#subject-…>` for the paper that actually holds the
  question.
- **Recorded result:** `restoreRecordedResult()` runs when the stored attempt
  is already submitted. It renders the stored `results` and `responses`
  without recalculating, keeps the key text out (and says so), and shows a
  plain gap if the record has no saved result.
- **Actions:** `[data-retry-wrong]` (a new attempt, `?retry=<attemptId>`, wrong
  and blank only), a review-desk link, and a quiet back link. The original
  attempt is never written to again.
