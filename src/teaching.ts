/**
 * The teaching material, loaded and checked.
 *
 * Every page that shows a lesson, a practice card or the catalog goes
 * through here, so the material is validated the same way everywhere and a
 * mistake fails the build rather than reaching a learner.
 */
import { getCollection } from 'astro:content';
import { validateContent, type LessonData, type PracticeData } from './content-check.ts';
import { parseTopicReference } from './lib/topics.ts';

export type LessonEntry = { id: string; data: LessonData };
export type PracticeEntry = { id: string; data: PracticeData };

export type Teaching = {
  lessons: LessonEntry[];
  practice: PracticeEntry[];
};

/** Load and validate the whole teaching collection. */
export async function loadTeaching(): Promise<Teaching> {
  const lessons = (await getCollection('lessons')).map((entry) => ({
    id: entry.id,
    data: entry.data as unknown as LessonData,
  }));
  const practice = (await getCollection('practice')).map((entry) => ({
    id: entry.id,
    data: entry.data as unknown as PracticeData,
  }));
  validateContent(lessons, practice);
  return { lessons, practice };
}

/** The lesson that teaches a topic, if there is one. */
export function lessonForTopic(teaching: Teaching, topic: string): LessonEntry | undefined {
  const parsed = parseTopicReference(topic);
  if (!parsed) return undefined;
  return teaching.lessons.find((lesson) => {
    const lessonTopic = parseTopicReference(lesson.data.topic);
    return lessonTopic?.id === parsed.id && lesson.data.status === 'open';
  });
}

/** The open lessons of one subject, in teaching order. */
export function lessonsOfSubject(teaching: Teaching, subject: string): LessonEntry[] {
  return teaching.lessons.filter((lesson) => lesson.data.subject === subject && lesson.data.status === 'open');
}
