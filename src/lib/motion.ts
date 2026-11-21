/**
 * The motion preference.
 *
 * Most learners never touch this: the operating system already says whether
 * animation should be reduced, and the site follows it. The You hub exposes
 * the same choice as a labelled switch for anyone whose device setting is
 * inconvenient to change, stored under one key (`jelet:motion:v1`).
 *
 * It is a real preference, not decoration: the CSS honours
 * `html[data-motion="reduce"]` by turning off transitions and smooth
 * scrolling everywhere, including inside the shared shell.
 *
 * Storage is optional. A browser that blocks it still gets a working switch
 * for the page in hand, and the control says the choice was not saved.
 */
import { storageAvailable } from './theme';

export type MotionSetting = 'full' | 'reduce';

export const MOTION_KEY = 'jelet:motion:v1';

/** The operating-system preference, if the browser exposes it. */
export function systemPrefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** Whether the learner has made an explicit choice in this browser. */
export function hasStoredMotionChoice(): boolean {
  try {
    const stored = localStorage.getItem(MOTION_KEY);
    return stored === 'reduce' || stored === 'full';
  } catch {
    return false;
  }
}

/** The stored choice, then the pre-paint document state, then the device. */
export function resolveMotion(): MotionSetting {
  try {
    const stored = localStorage.getItem(MOTION_KEY);
    if (stored === 'reduce' || stored === 'full') return stored;
  } catch {
    /* Storage is blocked. The document carries the pre-paint value. */
  }
  const declared = document.documentElement.dataset.motion;
  if (declared === 'reduce' || declared === 'full') return declared;
  return systemPrefersReducedMotion() ? 'reduce' : 'full';
}

/** Paint every motion control and its explanation to match the setting. */
export function paintMotionControls(motion: MotionSetting, saved = true, chosen = true): void {
  const reduce = motion === 'reduce';
  document.querySelectorAll<HTMLElement>('[data-motion-toggle]').forEach((control) => {
    control.setAttribute('aria-checked', String(reduce));
    control.dataset.motionCurrent = motion;
    control.querySelectorAll<HTMLElement>('[data-motion-state]').forEach((node) => {
      node.textContent = reduce ? 'On' : 'Off';
    });
  });
  document.querySelectorAll<HTMLElement>('[data-motion-status]').forEach((node) => {
    if (!saved) node.textContent = 'Your browser is not saving this choice; it lasts until you close the page.';
    else if (chosen) node.textContent = 'Saved in this browser.';
    else node.textContent = 'Following this device’s motion setting until you change it.';
  });
}

/** Apply a motion setting and remember it when the browser allows it. */
export function applyMotion(motion: MotionSetting): boolean {
  document.documentElement.dataset.motion = motion;
  let saved = true;
  try {
    localStorage.setItem(MOTION_KEY, motion);
  } catch {
    saved = false;
  }
  paintMotionControls(motion, saved);
  return saved;
}

/** Wire up every motion control on the page. */
export function initMotion(): void {
  const motion = resolveMotion();
  paintMotionControls(motion, storageAvailable(), hasStoredMotionChoice());
  document.querySelectorAll<HTMLElement>('[data-motion-toggle]').forEach((control) => {
    if (control.dataset.motionBound === 'true') return;
    control.dataset.motionBound = 'true';
    control.addEventListener('click', () => {
      applyMotion(resolveMotion() === 'reduce' ? 'full' : 'reduce');
    });
  });
}
