import { getCollection } from 'astro:content';
import { validatePractice, type PracticeData } from './practice';
import type { IndexEntry } from './search';
import { papers, answerLetters, keyFor } from './lib/content';
import { stripMath } from './lib/math';

/** Build-time index of approved public material: lessons, original cards and the paper corpus. */
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
      url: `${base}cards/${data.publicId}/`,
      anchor: data.primarySectionAnchor,
      terms: `${data.source} ${plainBody}`,
    });
  }

  for (const paper of papers) {
    const key = keyFor(paper);
    for (const question of paper.questions) {
      const plain = stripMath(question.stem);
      const options = question.options.map((option) => stripMath(option.text).slice(0, 90)).join(' ');
      const letters = answerLetters(paper, question);
      entries.push({
        id: `question:${question.id}`,
        type: 'question',
        title: `JELET ${paper.year} · Q${question.n} · ${question.subject}`,
        summary: plain.slice(0, 180),
        topic: question.subjectKey,
        year: String(paper.year),
        paper: `Paper I · ${question.subject}`,
        set: key?.booklet?.set ?? null,
        category: question.category,
        readiness: question.scorable
          ? (key?.tier === 'official' ? 'official' : 'derived')
          : question.boardAwarded
            ? 'board-voided'
            : 'read-only',
        status: question.scorable
          ? `${question.category === 'II' ? 'Category II' : 'Category I'} · ${question.marks} mark${question.marks === 1 ? '' : 's'}`
          : question.boardAwarded
            ? `Voided by the board · ${question.marks} mark${question.marks === 1 ? '' : 's'} awarded to every candidate`
            : 'Read only · not markable',
        identity: `${paper.label} · Q${question.n} · ${question.subject} · ${question.category === 'II' ? 'Category II' : 'Category I'}`,
        figure: question.figure ? 'Diagram not reproduced' : 'No figure',
        url: `${base}library/${paper.id}/#q${question.n}`,
        anchor: `q${question.n}`,
        terms: `${plain} ${options} ${question.subject} ${paper.year} ${letters.join(' ')}`,
      });
    }
  }
  return entries;
}
