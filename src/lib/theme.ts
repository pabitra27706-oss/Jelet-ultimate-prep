/**
 * The theme preference.
 *
 * There is exactly one stored theme (`jelet:theme`, as it has always been)
 * and every theme control on a page drives it. The shell draws a sun/moon
 * button; the You hub draws a labelled switch. Both use the same store, so
 * changing one changes the other and a reload keeps the choice.
 *
 * Storage is optional. A browser that blocks it still gets a working toggle
 * for the current page, and the control says so instead of pretending the
 * choice was saved.
 */

export type Theme = 'light' | 'dark';

export const THEME_KEY = 'jelet:theme';

/** Whether this browser is actually keeping local state. */
export function storageAvailable(): boolean {
  try {
    const probe = '__jelet_theme_probe__';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** The stored choice, then the document, then the operating-system preference. */
export function resolveTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    /* Storage is blocked. The document still carries the pre-paint theme. */
  }
  const declared = document.documentElement.dataset.theme;
  if (declared === 'dark' || declared === 'light') return declared;
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/** Whether the learner has made an explicit choice in this browser. */
export function hasStoredChoice(): boolean {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'dark' || stored === 'light';
  } catch {
    return false;
  }
}

/** Paint every theme control to match the current theme. */
export function paintThemeControls(theme: Theme, saved = true, chosen = true): void {
  const dark = theme === 'dark';
  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((control) => {
    if (control.getAttribute('role') === 'switch') control.setAttribute('aria-checked', String(dark));
    else control.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    control.dataset.themeCurrent = theme;
    control.querySelectorAll<HTMLElement>('[data-theme-state]').forEach((node) => {
      node.textContent = dark ? 'On' : 'Off';
    });
  });
  document.querySelectorAll<HTMLElement>('[data-theme-status]').forEach((node) => {
    if (!saved) node.textContent = 'Your browser is not saving this choice; it lasts until you close the page.';
    else if (chosen) node.textContent = 'Saved in this browser.';
    else node.textContent = 'Following this device’s setting until you choose.';
  });
}

/**
 * Apply a theme and remember it when the browser allows it.
 * Returns whether the choice was stored.
 */
export function applyTheme(theme: Theme): boolean {
  document.documentElement.dataset.theme = theme;
  let saved = true;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    saved = false;
  }
  paintThemeControls(theme, saved);
  return saved;
}

/**
 * Wire up every theme control on the page.
 *
 * Controls are marked with `[data-theme-toggle]`. Pressing one flips the
 * theme; every other control is repainted from the same source.
 */
export function initTheme(): void {
  const theme = resolveTheme();
  paintThemeControls(theme, storageAvailable(), hasStoredChoice());
  document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((control) => {
    if (control.dataset.themeBound === 'true') return;
    control.dataset.themeBound = 'true';
    control.addEventListener('click', () => {
      const next: Theme = resolveTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });
}
