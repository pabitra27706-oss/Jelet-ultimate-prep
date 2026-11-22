/**
 * The learner's place in a lesson.
 *
 * The teaching sequence is fixed for every lesson: a learner meets the
 * prerequisite, predicts, sees the worked example, tries it with help, tries
 * it alone and revises. A lesson may leave a step out, but it may not invent
 * one, because the progress of every lesson is stored against the same
 * anchors.
 *
 * The place is kept per lesson and on this device only.
 */
export const sections = ['prerequisite', 'predict', 'worked-example', 'guided-practice', 'independent-practice', 'revision-sheet'] as const;
export type Section = typeof sections[number];
const storagePrefix = 'jelet:';
const storageVersion = 'v1';
const validHints: readonly string[] = ['hint-one', 'hint-two', 'hint-three'];

export { validHints };

/**
 * Check a lesson's own section list against the teaching sequence.
 *
 * The lesson's sections must be known, must not repeat, and must appear in
 * the order they are taught.
 */
export function validateSections(lessonId: string, declared: readonly string[]): void {
  const positions = declared.map((section) => sections.indexOf(section as Section));
  if (positions.some((position) => position === -1)) {
    throw new Error(`Lesson ${lessonId} uses a section that is not part of the teaching sequence`);
  }
  if (new Set(declared).size !== declared.length) {
    throw new Error(`Lesson ${lessonId} repeats a section`);
  }
  for (let index = 1; index < positions.length; index += 1) {
    if (positions[index]! <= positions[index - 1]!) {
      throw new Error(`Lesson ${lessonId} lists its sections out of teaching order`);
    }
  }
}

/**
 * What one lesson remembers on this device.
 *
 * `visited` is the honest record of which sections have been on screen. It is
 * a reading position, never a mark: a section can be visited and not
 * understood, and nothing here is ever reported as mastery or completion.
 */
export type Progress = {
  section: Section;
  guidedHints: string[];
  independentRevealed: boolean;
  visited: Section[];
};

/** Add a section to the visit list, keeping the teaching order. */
export function recordVisit(progress: Progress, section: Section): Progress {
  if (progress.visited.includes(section)) return progress;
  const visited = sections.filter((entry) => progress.visited.includes(entry) || entry === section);
  return { ...progress, visited: [...visited] };
}

/** The storage key for one lesson's place. */
export const progressKey = (lessonId: string): string => `${storagePrefix}${lessonId}:${storageVersion}`;

export function isSection(value: unknown): value is Section {
  return typeof value === 'string' && sections.some((section) => section === value);
}

export function readProgress(lessonId: string): { progress?: Progress; available: boolean } {
  try {
    const raw = localStorage.getItem(progressKey(lessonId));
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
            // Records written before the visit list existed simply have none;
            // nothing is invented for them.
            visited: Array.isArray(parsed.visited)
              ? sections.filter((entry) => (parsed.visited as unknown[]).includes(entry))
              : [],
          } };
        }
      } catch { /* Ignore old or damaged data; never interpolate it into a URL. */ }
    }
    return { available: true };
  } catch {
    return { available: false };
  }
}

export function saveProgress(lessonId: string, progress: Progress) {
  try {
    localStorage.setItem(progressKey(lessonId), JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
