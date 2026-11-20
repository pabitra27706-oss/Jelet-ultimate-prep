/**
 * Syllabus topics.
 *
 * A topic is the unit everything else hangs off: the lesson that teaches it,
 * the practice card that checks it, the past questions that sit in it and the
 * notes that revise it. The syllabus is the only authority for what a topic
 * is, so this module reads it and refuses anything it does not recognise.
 *
 * The topic reference a lesson carries is written
 * `jelet-syllabus:<subject>:<topic code>`, for example
 * `jelet-syllabus:electrical:t04`. It is stable: the syllabus edition may
 * change, the reference does not.
 */
import { syllabus, type SubjectKey } from './content.ts';

/**
 * The shape of a topic reference.
 *
 * A topic's code inside its subject is either two digits (`t04`, as physics
 * and electrical are numbered) or one letter (`ta`, as mathematics and
 * chemistry are lettered). Both are accepted, because the syllabus is the
 * authority for which is which and a subject must not be excluded from
 * having a lesson because of how it is numbered.
 */
export const TOPIC_REFERENCE = /^jelet-syllabus:([a-z]+):t(\d{2}|[a-z])$/;

/** The subjects the syllabus holds, in the order the paper sets them. */
export const syllabusSubjects = syllabus.subjects;

export type TopicReference = {
  /** The subject the topic belongs to. */
  subject: SubjectKey;
  /** The topic's code inside its subject, such as `t04`. */
  code: string;
  /** The topic's id, such as `electrical-t04`. */
  id: string;
  /** The topic's name, as the bulletin writes it. */
  name: string;
  /** What the bulletin says the topic covers. */
  detail: string;
  /** The subject's name. */
  subjectName: string;
};

/**
 * Read a topic reference.
 *
 * A reference to a topic the syllabus does not hold is refused rather than
 * guessed at: a lesson that points at a topic that does not exist would
 * quietly teach the wrong thing.
 */
export function parseTopicReference(reference: string): TopicReference | null {
  const match = TOPIC_REFERENCE.exec(reference);
  if (!match) return null;
  const subject = match[1] as SubjectKey;
  const code = `t${match[2]}`;
  const id = `${subject}-${code}`;
  const group = syllabus.subjects.find((entry) => entry.id === subject);
  const topic = group?.topics.find((entry) => entry.id === id);
  if (!group || !topic) return null;
  return {
    subject,
    code,
    id,
    name: topic.name,
    detail: topic.detail,
    subjectName: group.name,
  };
}

/** The reference for a topic id, such as `electrical-t04`. */
export function topicReference(subject: SubjectKey, topicId: string): string {
  const code = topicId.slice(topicId.lastIndexOf('-') + 1);
  return `jelet-syllabus:${subject}:${code}`;
}

/** Every topic of one subject, in the bulletin's order. */
export function topicsOfSubject(subject: SubjectKey): TopicReference[] {
  const group = syllabus.subjects.find((entry) => entry.id === subject);
  if (!group) return [];
  return group.topics.map((topic) => ({
    subject,
    code: topic.id.slice(topic.id.lastIndexOf('-') + 1),
    id: topic.id,
    name: topic.name,
    detail: topic.detail,
    subjectName: group.name,
  }));
}

/** Every topic of the syllabus, in the bulletin's order. */
export function allTopics(): TopicReference[] {
  return syllabus.subjects.flatMap((group) => topicsOfSubject(group.id as SubjectKey));
}
