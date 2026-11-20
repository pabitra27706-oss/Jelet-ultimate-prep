import assert from 'node:assert/strict';
import { test } from 'node:test';

import { decodeSpec, encodeSpec, resolveTopics, withSpecId } from '../src/lib/mock.ts';

test('a topic named by its code is resolved inside every chosen subject', () => {
  const resolved = resolveTopics(['t04'], ['mathematics', 'physics']);
  assert.deepEqual(resolved.sort(), ['mathematics-t04', 'physics-t04']);
});

test('a topic named by its id is kept as it is', () => {
  assert.deepEqual(resolveTopics(['electrical-t04'], ['electrical']), ['electrical-t04']);
});

test('a topic that is neither a code nor an id is refused, not guessed at', () => {
  assert.deepEqual(resolveTopics(['probability'], ['mathematics']), []);
  assert.deepEqual(resolveTopics(['t4'], ['mathematics']), []);
  assert.deepEqual(resolveTopics([''], ['mathematics']), []);
});

test('a link that names a subject and a topic keeps both', () => {
  const spec = decodeSpec('s=mathematics&t=t04&n=2');
  assert.deepEqual(spec.subjects, ['mathematics']);
  assert.deepEqual(spec.topics, ['mathematics-t04']);
  assert.equal(spec.count, 2);
});

test('a link may name the category it wants', () => {
  assert.equal(decodeSpec('s=physics&cat=I').categories, 'I');
  assert.equal(decodeSpec('s=physics&cat=II').categories, 'II');
  assert.equal(decodeSpec('s=physics').categories, 'both');
  assert.equal(decodeSpec('s=physics&cat=nonsense').categories, 'both');
});

test('a specification travels in a link and comes back the same', () => {
  const spec = withSpecId({
    title: 'A quiz',
    subjects: ['chemistry'],
    topics: ['chemistry-t02'],
    count: 7,
    categoryMix: 'paper',
    categoryIShare: 0.85,
    categories: 'II',
    durationMinutes: 0,
    avoidSeen: false,
    includeAwarded: true,
    seed: 4242,
  });
  const decoded = decodeSpec(encodeSpec(spec));
  assert.deepEqual(decoded.subjects, spec.subjects);
  assert.deepEqual(decoded.topics, spec.topics);
  assert.equal(decoded.count, spec.count);
  assert.equal(decoded.categories, 'II');
  assert.equal(decoded.seed, spec.seed);
  assert.equal(decoded.id, spec.id, 'the same selection has the same identity');
});
