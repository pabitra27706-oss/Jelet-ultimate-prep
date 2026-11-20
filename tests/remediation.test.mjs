import assert from 'node:assert/strict';
import { test } from 'node:test';

import { mistakeReasons, tagReason } from '../src/lib/review.ts';
import { summariseMistakes, topicsToRemediate } from '../src/lib/remediation.ts';

const index = {
  topics: {
    'mathematics-ta': { id: 'mathematics-ta', name: 'Matrices', subjectKey: 'mathematics', subjectName: 'MATHEMATICS' },
    'mathematics-tb': { id: 'mathematics-tb', name: 'Determinants', subjectKey: 'mathematics', subjectName: 'MATHEMATICS' },
    'physics-t01': { id: 'physics-t01', name: 'Units & dimensions', subjectKey: 'physics', subjectName: 'PHYSICS' },
  },
  questions: {
    'p1:q1': ['mathematics-ta'],
    'p1:q2': ['mathematics-ta', 'mathematics-tb'],
    'p2:q1': ['physics-t01'],
    'p3:q1': [],
  },
};

const item = (over) => ({
  questionId: 'p1:q1',
  paperId: 'p1',
  paperYear: 2025,
  n: 1,
  subjectKey: 'mathematics',
  subjectLabel: 'Mathematics',
  stem: 'A question about matrices',
  box: 0,
  due: 0,
  seen: 1,
  correctStreak: 0,
  lastStatus: 'wrong',
  lastAt: 0,
  ...over,
});

test('the mistakes are counted under every topic the question was mapped to', () => {
  const queue = [item({ questionId: 'p1:q2', lastStatus: 'wrong' })];
  const summary = summariseMistakes(queue, index);
  const matrices = summary.byTopic.find((topic) => topic.topicId === 'mathematics-ta');
  const determinants = summary.byTopic.find((topic) => topic.topicId === 'mathematics-tb');
  assert.ok(matrices && determinants);
  assert.equal(matrices.wrong, 1);
  assert.equal(determinants.wrong, 1, 'a question in two topics counts under both');
  assert.equal(summary.total, 1);
});

test('a question that is mapped to no topic is counted separately, not lost', () => {
  const summary = summariseMistakes([item({ questionId: 'p3:q1' })], index);
  assert.equal(summary.untopiced, 1);
  assert.equal(summary.byTopic.length, 0);
  assert.equal(summary.total, 1);
});

test('the worst topic comes first, and a wrong answer counts more than a blank', () => {
  const queue = [
    item({ questionId: 'p2:q1', lastStatus: 'blank' }),
    item({ questionId: 'p1:q1', lastStatus: 'wrong' }),
  ];
  const summary = summariseMistakes(queue, index);
  assert.equal(summary.byTopic[0].topicId, 'mathematics-ta', 'a wrong answer outranks a blank');
});

test('the learner describes their own mistakes, and the description is optional', () => {
  const queue = [item({ reason: 'calculation' }), item({ questionId: 'p2:q1', reason: 'concept' })];
  const summary = summariseMistakes(queue, index);
  assert.equal(summary.byReason.length, 2);
  const calculation = summary.byReason.find((entry) => entry.reason === 'calculation');
  assert.equal(calculation?.count, 1);
  // A question with no tag simply is not counted in the reasons.
  const untagged = summariseMistakes([item({})], index);
  assert.equal(untagged.byReason.length, 0);
});

test('a tag can be given and taken back, and nothing else about the item changes', () => {
  const queue = [item({})];
  const tagged = tagReason(queue, 'p1:q1', 'method');
  assert.equal(tagged[0].reason, 'method');
  assert.equal(tagged[0].box, queue[0].box);
  assert.equal(tagged[0].due, queue[0].due);
  assert.equal(tagged[0].lastStatus, queue[0].lastStatus);
  const cleared = tagReason(tagged, 'p1:q1', null);
  assert.equal(cleared[0].reason, null);
});

test('every reason has a label the learner can read', () => {
  assert.equal(mistakeReasons.length, 4);
  for (const reason of mistakeReasons) {
    assert.equal(typeof reason, 'string');
  }
});

test('only topics that hold questions are offered as something to go back to', () => {
  const summary = summariseMistakes([item({ questionId: 'p3:q1' })], index);
  assert.deepEqual(topicsToRemediate(summary), [], 'a topic with nothing in it is not offered');
});

test('the topics to remediate are the worst ones, and there is a limit', () => {
  const queue = [
    item({ questionId: 'p1:q1', lastStatus: 'wrong' }),
    item({ questionId: 'p1:q2', lastStatus: 'wrong' }),
    item({ questionId: 'p2:q1', lastStatus: 'wrong' }),
  ];
  const summary = summariseMistakes(queue, index);
  const weak = topicsToRemediate(summary, 2);
  assert.equal(weak.length, 2);
  assert.equal(weak[0].topicId, 'mathematics-ta');
  assert.ok(weak[0].questionIds.length > 0, 'a drill can be built from the questions themselves');
});
