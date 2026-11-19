export const sections = ['prerequisite', 'predict', 'worked-example', 'guided-practice', 'independent-practice', 'revision-sheet'] as const;
export type Section = typeof sections[number];
const storageKey = 'jelet:parallel-circuits:v1';
export type Progress = { section: Section; guidedHints: string[]; independentRevealed: boolean };
export const validHints: readonly string[] = ['hint-one', 'hint-two', 'hint-three'];

export function isSection(value: unknown): value is Section {
  return typeof value === 'string' && sections.some((section) => section === value);
}

export function readProgress(): { progress?: Progress; available: boolean } {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && isSection(parsed.section) && Array.isArray(parsed.guidedHints)
            && typeof parsed.independentRevealed === 'boolean') {
          return { available: true, progress: {
            section: parsed.section,
            guidedHints: [...new Set<string>((parsed.guidedHints as unknown[]).filter((hint): hint is string =>
              typeof hint === 'string' && validHints.includes(hint)))],
            independentRevealed: parsed.independentRevealed,
          } };
        }
      } catch { /* Ignore old or damaged data; never interpolate it into a URL. */ }
    }
    return { available: true };
  } catch {
    return { available: false };
  }
}

export function saveProgress(progress: Progress) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
