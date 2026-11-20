/**
 * Subject names.
 *
 * These live in their own module so that a browser bundle can use them
 * without pulling in the corpus. `src/lib/content.ts` re-exports them, so
 * existing callers are unaffected.
 */
export type SubjectKey = 'mathematics' | 'physics' | 'chemistry' | 'electrical' | 'computer' | 'other';

export const subjectLabels: Record<SubjectKey, string> = {
  mathematics: 'Mathematics',
  physics: 'Physics',
  chemistry: 'Chemistry',
  electrical: 'Electrical & Electronics',
  computer: 'Computer & IT',
  other: 'Other',
};
