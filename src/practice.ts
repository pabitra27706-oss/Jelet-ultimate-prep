/**
 * The teaching material's own contracts.
 *
 * The guard itself lives in `content-check.ts`, because it is a build-time
 * check and not a runtime helper. This module is the small surface the pages
 * use.
 */
import { validateContent, type LessonData, type PracticeData } from './content-check.ts';

export { validateContent };
export type { LessonData, PracticeData };

/** Where an original practice card lives. */
export const practiceHref = (base: string, id: string): string => `${base}cards/${id}/`;

/** Where a section of a lesson lives. */
export const lessonHref = (base: string, lessonId: string, anchor: string): string => `${base}learn/${lessonId}/#${anchor}`;
