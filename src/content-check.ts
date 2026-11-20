/**
 * The build-time guard on the teaching material.
 *
 * Every lesson and every practice card is checked before the site is built:
 * the topic must be a real topic of the published syllabus, the subject must
 * be the subject that topic belongs to, the teaching sequence must be
 * respected, and a practice card must point into a lesson that teaches its
 * topic.
 *
 * A mistake here fails the build rather than reaching a learner.
 */
import { validateSections } from './progress.ts';
import { parseTopicReference } from './lib/topics.ts';

export type LessonData = {
  title: string;
  summary: string;
  subject: string;
  topic: string;
  revision: number;
  provenance: 'original';
  status: 'open' | 'planned';
  minutes: number;
  prerequisites: string[];
  objective: string;
  sections: string[];
};

export type PracticeData = {
  publicId: string;
  title: string;
  subject: string;
  topic: string;
  revision: number;
  provenance: 'original';
  readiness: 'original-practice' | 'original-check';
  primarySectionAnchor: string;
  source: string;
  answerStatus: string;
  summary: string;
};

/**
 * Check the whole teaching collection.
 *
 * `lessons` is a list of `{ id, data }`; `practice` is a list of `{ id, data }`.
 */
export function validateContent(
  lessons: readonly { id: string; data: LessonData }[],
  practice: readonly { id: string; data: PracticeData }[],
): void {
  const seenLessons = new Set<string>();
  const anchorsByTopic = new Map<string, Set<string>>();

  for (const lesson of lessons) {
    if (seenLessons.has(lesson.id)) throw new Error(`Duplicate lesson id: ${lesson.id}`);
    seenLessons.add(lesson.id);

    const topic = parseTopicReference(lesson.data.topic);
    if (!topic) throw new Error(`Lesson ${lesson.id} points at a topic the syllabus does not hold: ${lesson.data.topic}`);
    if (topic.subject !== lesson.data.subject) {
      throw new Error(`Lesson ${lesson.id} says it is ${lesson.data.subject}, but ${topic.id} is a ${topic.subject} topic`);
    }
    if (lesson.data.provenance !== 'original') {
      throw new Error(`Lesson ${lesson.id} claims a provenance this site cannot publish`);
    }
    validateSections(lesson.id, lesson.data.sections);
    if (lesson.data.prerequisites.some((item) => !item.trim())) {
      throw new Error(`Lesson ${lesson.id} has an empty prerequisite`);
    }
    const anchors = anchorsByTopic.get(topic.id) ?? new Set<string>();
    for (const section of lesson.data.sections) anchors.add(section);
    anchorsByTopic.set(topic.id, anchors);
  }

  const seenPractice = new Set<string>();
  for (const card of practice) {
    if (!/^orig-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.data.publicId)) {
      throw new Error(`Invalid practice ID: ${card.data.publicId}`);
    }
    if (seenPractice.has(card.data.publicId)) throw new Error(`Duplicate practice ID: ${card.data.publicId}`);
    seenPractice.add(card.data.publicId);
    if (card.id !== card.data.publicId.replace(/^orig-/, '')) {
      throw new Error(`Practice ${card.data.publicId} is filed under the wrong id: ${card.id}`);
    }
    const topic = parseTopicReference(card.data.topic);
    if (!topic) throw new Error(`Practice ${card.data.publicId} points at a topic the syllabus does not hold: ${card.data.topic}`);
    if (topic.subject !== card.data.subject) {
      throw new Error(`Practice ${card.data.publicId} says it is ${card.data.subject}, but ${topic.id} is a ${topic.subject} topic`);
    }
    if (card.data.provenance !== 'original') {
      throw new Error(`Practice ${card.data.publicId} is not an approved original item`);
    }
    const anchors = anchorsByTopic.get(topic.id);
    if (!anchors || !anchors.has(card.data.primarySectionAnchor)) {
      throw new Error(`Practice ${card.data.publicId} points to a missing lesson anchor: ${card.data.primarySectionAnchor}`);
    }
  }
}
