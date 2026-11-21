/**
 * The shared icon set.
 *
 * Every icon here stands for a real destination or a real status in this
 * site. There is no decorative icon, no notification bell and no account
 * avatar, because the product has no notifications and no accounts.
 *
 * The geometry is a 24-unit viewBox drawn with one stroke weight
 * (`--icon-stroke`), rounded caps and `currentColor`, so an icon follows the
 * page theme instead of carrying its own palette. `.astro` code renders them
 * through `src/components/Icon.astro`; nothing here fetches an icon font or
 * an external sprite.
 *
 * Accessibility contract:
 *
 * - an icon inside text or a labelled control is decorative: the component
 *   sets `aria-hidden="true"` unless a `label` is supplied;
 * - an icon-only control must carry its own accessible name on the button or
 *   link, never only the glyph;
 * - status must always have a text label beside the icon, and may not depend
 *   on colour alone.
 */

export const ICON_NAMES = [
  // The five global destinations.
  'home',
  'book',
  'target',
  'papers',
  'user',
  // Navigation and disclosure.
  'search',
  'bookmark',
  'history',
  'refresh',
  'chevron-right',
  'chevron-down',
  'arrow-left',
  'close',
  'external',
  // Device, backup and provenance.
  'download',
  'upload',
  'info',
  // Theme.
  'sun',
  'moon',
  // Meaningful status.
  'check-circle',
  'alert-triangle',
  'lock',
  'offline',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/**
 * The inner geometry of each icon. Only `svg` children belong here; the
 * component owns the viewBox, stroke and colour.
 */
export const ICONS: Record<IconName, string> = {
  home: '<path d="M3.8 10.7 12 4l8.2 6.7"/><path d="M5.6 9.6V19a1 1 0 0 0 1 1H10v-5.2h4V20h3.4a1 1 0 0 0 1-1V9.6"/>',
  book: '<path d="M12 6.2C9.8 4.7 7.4 4 4.5 4v14.2c3 0 5.5.7 7.5 2.2 2-1.5 4.5-2.2 7.5-2.2V4c-2.9 0-5.3.7-7.5 2.2Z"/><path d="M12 6.5v13.7"/>',
  target: '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r=".9" fill="currentColor" stroke="none"/>',
  papers: '<path d="M6.2 3.6h7.6l4 4V20.4H6.2z"/><path d="M13.8 3.6v4.2h4M9 12h6M9 15.6h6"/>',
  user: '<circle cx="12" cy="8.2" r="3.6"/><path d="M5 20.2c0-3.3 3.1-5.7 7-5.7s7 2.4 7 5.7"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m15.6 15.6 4.4 4.4"/>',
  bookmark: '<path d="M6.6 4.2h10.8v16l-5.4-3.9-5.4 3.9z"/>',
  history: '<path d="M4.2 12a7.8 7.8 0 1 0 2.4-5.6"/><path d="M4 4.4v4.2h4.2"/><path d="M12 8.2V12l2.8 1.8"/>',
  refresh: '<path d="M19.6 12a7.6 7.6 0 1 1-2.2-5.4"/><path d="M19.8 4.4v4.2h-4.2"/>',
  'chevron-right': '<path d="m9.5 5.2 6.9 6.8-6.9 6.8"/>',
  'chevron-down': '<path d="m5.2 9.5 6.8 6.9 6.8-6.9"/>',
  'arrow-left': '<path d="M19.2 12H5"/><path d="m11 5.8-6.2 6.2 6.2 6.2"/>',
  close: '<path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6"/>',
  external: '<path d="M13.6 4.4h6v6"/><path d="m19.4 4.6-8.6 8.6"/><path d="M17.4 13.8v5a1 1 0 0 1-1 1H5.4a1 1 0 0 1-1-1V7.8a1 1 0 0 1 1-1h5"/>',
  download: '<path d="M12 4.2v10.6"/><path d="m7.4 10.6 4.6 4.6 4.6-4.6"/><path d="M5 19.8h14"/>',
  upload: '<path d="M12 15.8V4.2"/><path d="m7.4 8.8 4.6-4.6 4.6 4.6"/><path d="M5 19.8h14"/>',
  info: '<circle cx="12" cy="12" r="8.2"/><path d="M12 11.2v5"/><circle cx="12" cy="7.9" r=".9" fill="currentColor" stroke="none"/>',
  sun: '<circle cx="12" cy="12" r="4.1"/><path d="M12 2.6v2.2M12 19.2v2.2M4.6 12H2.4M21.6 12h-2.2M6.7 6.7 5.2 5.2M18.8 18.8l-1.5-1.5M17.3 6.7l1.5-1.5M5.2 18.8l1.5-1.5"/>',
  moon: '<path d="M20.4 13.7A8.5 8.5 0 0 1 10.3 3.6a8.6 8.6 0 1 0 10.1 10.1Z"/>',
  'check-circle': '<circle cx="12" cy="12" r="8.2"/><path d="m8.2 12.3 2.7 2.7 4.9-5.1"/>',
  'alert-triangle': '<path d="M12 4.4 3.6 19.4h16.8z"/><path d="M12 9.6v4.2"/><circle cx="12" cy="16.7" r=".9" fill="currentColor" stroke="none"/>',
  lock: '<rect x="4.8" y="10.4" width="14.4" height="9.8" rx="2.4"/><path d="M8.4 10.4V8a3.6 3.6 0 0 1 7.2 0v2.4"/><circle cx="12" cy="15.3" r="1.1" fill="currentColor" stroke="none"/>',
  offline: '<path d="M7.4 17.8a3.8 3.8 0 0 1-.5-7.6 5.6 5.6 0 0 1 10.7-.6 3.9 3.9 0 0 1 1 7.4"/><path d="M4 3.4 20.4 20"/>',
};
