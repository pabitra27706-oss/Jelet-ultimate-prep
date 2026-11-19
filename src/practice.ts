import { sections, type Section } from './progress';

export type PracticeData = {
  publicId: string;
  title: string;
  topic: string;
  revision: number;
  provenance: 'original';
  readiness: 'original-practice';
  primarySectionAnchor: Section;
  source: string;
  answerStatus: string;
  summary: string;
};

/** Build-time guard: stable IDs, reviewed provenance and existing lesson targets. */
export function validatePractice(items: readonly PracticeData[]): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (!/^orig-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.publicId)) {
      throw new Error(`Invalid practice ID: ${item.publicId}`);
    }
    if (seen.has(item.publicId)) throw new Error(`Duplicate practice ID: ${item.publicId}`);
    seen.add(item.publicId);
    if (!sections.includes(item.primarySectionAnchor)) {
      throw new Error(`Practice ${item.publicId} points to a missing lesson anchor`);
    }
    if (item.provenance !== 'original' || item.readiness !== 'original-practice') {
      throw new Error(`Practice ${item.publicId} is not an approved original item`);
    }
  }
}

export const practiceHref = (base: string, id: string) => `${base}practice/${id}/`;
export const lessonHref = (base: string, anchor: Section) => `${base}learn/parallel-circuits/#${anchor}`;
