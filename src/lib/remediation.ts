/**
 * Where the mistakes are.
 *
 * A learner does not need a score; they need to know which part of the
 * syllabus keeps going wrong, so they can go back to it. This module turns
 * the learner's own record into that shape.
 *
 * Nothing here is a prediction and nothing is a grade. It counts what
 * happened and says where it happened.
 */
import { mistakeReasons, type MistakeReason, type ReviewItem } from './review.ts';

export type TopicIndex = {
  topics: Record<string, { id: string; name: string; subjectKey: string; subjectName: string }>;
  questions: Record<string, string[]>;
};

export type TopicMistakes = {
  topicId: string;
  /** The topic's code inside its subject, such as `t04`. */
  topicCode: string;
  topicName: string;
  subjectKey: string;
  subjectName: string;
  /** How many times the learner got one of its questions wrong. */
  wrong: number;
  /** How many times they left one blank. */
  blank: number;
  /** How many times they got a correct subset. */
  partial: number;
  /** How many of its questions are waiting for review. */
  due: number;
  /** The questions themselves, so a drill can be built from them. */
  questionIds: string[];
};

export type ReasonCount = { reason: MistakeReason; count: number };

export type Remediation = {
  /** The topics the mistakes concentrate in, worst first. */
  byTopic: TopicMistakes[];
  /** How the learner describes their own mistakes. */
  byReason: ReasonCount[];
  /** Questions in the queue that carry no topic. */
  untopiced: number;
  /** The whole queue. */
  total: number;
};

/**
 * Summarise the queue.
 *
 * A question is counted under every topic it was mapped to, because the
 * syllabus map is a judgement and a question can honestly belong to two.
 */
export function summariseMistakes(queue: readonly ReviewItem[], index: TopicIndex): Remediation {
  const byTopic = new Map<string, TopicMistakes>();
  const byReason = new Map<MistakeReason, number>();
  let untopiced = 0;

  for (const item of queue) {
    const topicIds = index.questions[item.questionId] ?? [];
    if (topicIds.length === 0) {
      untopiced += 1;
      continue;
    }
    if (item.reason && mistakeReasons.includes(item.reason)) {
      byReason.set(item.reason, (byReason.get(item.reason) ?? 0) + 1);
    }
    for (const topicId of topicIds) {
      const meta = index.topics[topicId];
      const entry = byTopic.get(topicId) ?? {
        topicId,
        topicCode: topicId.slice(topicId.lastIndexOf('-') + 1),
        topicName: meta?.name ?? topicId,
        subjectKey: meta?.subjectKey ?? 'other',
        subjectName: meta?.subjectName ?? 'Other',
        wrong: 0,
        blank: 0,
        partial: 0,
        due: 0,
        questionIds: [],
      };
      if (item.lastStatus === 'wrong') entry.wrong += 1;
      else if (item.lastStatus === 'blank') entry.blank += 1;
      else if (item.lastStatus === 'partial') entry.partial += 1;
      entry.due += 1;
      entry.questionIds.push(item.questionId);
      byTopic.set(topicId, entry);
    }
  }

  const topics = [...byTopic.values()].sort((a, b) => {
    const aWeight = a.wrong * 3 + a.blank * 2 + a.partial;
    const bWeight = b.wrong * 3 + b.blank * 2 + b.partial;
    if (bWeight !== aWeight) return bWeight - aWeight;
    if (b.due !== a.due) return b.due - a.due;
    return a.topicName.localeCompare(b.topicName);
  });

  return {
    byTopic: topics,
    byReason: mistakeReasons
      .map((reason) => ({ reason, count: byReason.get(reason) ?? 0 }))
      .filter((entry) => entry.count > 0),
    untopiced,
    total: queue.length,
  };
}

/**
 * The topics a learner should go back to.
 *
 * Only topics that actually hold markable questions are offered: a drill
 * cannot be built from a topic with nothing to draw.
 */
export function topicsToRemediate(remediation: Remediation, limit = 3): TopicMistakes[] {
  return remediation.byTopic
    .filter((topic) => topic.questionIds.length > 0)
    .slice(0, limit);
}
