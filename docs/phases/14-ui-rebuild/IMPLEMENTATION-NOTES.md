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
