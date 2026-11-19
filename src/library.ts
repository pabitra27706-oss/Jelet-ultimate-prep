import { getCollection } from 'astro:content';
import { validatePractice, type PracticeData } from './practice';
import type { IndexEntry } from './search';

/** Build-time index of approved public material. No held question, private state or answer key is included. */
export async function buildLibraryIndex(): Promise<IndexEntry[]> {
  const base = import.meta.env.BASE_URL;
  const lessons = await getCollection('lessons');
  const practiceEntries = await getCollection('practice');
  validatePractice(practiceEntries.map((entry) => entry.data) as PracticeData[]);

  const entries: IndexEntry[] = [];
  for (const lesson of lessons) {
    entries.push({
      id: `lesson:${lesson.id}`,
      type: 'lesson',
      title: lesson.data.title,
      summary: 'Shared voltage, split current · worked example, guided hints and independent notebook check.',
      topic: lesson.data.topic,
      year: null,
      paper: null,
      set: null,
      category: null,
      readiness: 'original',
      status: 'Original lesson',
      identity: 'Original lesson · not a past exam question',
      figure: 'Circuit diagram with text description',
      url: `${base}learn/${lesson.id}/`,
      anchor: lesson.data.sections[0] ?? null,
      terms: [lesson.data.title, ...lesson.data.sections].join(' '),
    });
  }
  for (const entry of practiceEntries) {
    const data = entry.data;
    const plainBody = (entry.body ?? '').replace(/[*_`>#]/g, ' ').replace(/\s+/g, ' ').trim();
    entries.push({
      id: `practice:${data.publicId}`,
      type: 'practice',
      title: data.title,
      summary: data.summary,
      topic: data.topic,
      year: null,
      paper: 'Original',
      set: null,
      category: null,
      readiness: 'original',
      status: 'Original practice · check after attempt',
      identity: `Original practice · ${data.publicId} · not a past exam question`,
      figure: 'No figure',
      url: `${base}practice/${data.publicId}/`,
      anchor: data.primarySectionAnchor,
      terms: `${data.source} ${plainBody}`,
    });
  }
  return entries;
}
