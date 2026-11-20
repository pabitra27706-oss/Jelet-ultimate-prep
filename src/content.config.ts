import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * The teaching material.
 *
 * The schema is deliberately general: a lesson may teach any topic of the
 * syllabus, in any subject, and may be revised. What it may not do is claim a
 * provenance it does not have, point at a topic that does not exist, or use a
 * section id that is not a stable anchor.
 *
 * The topic reference is checked against the syllabus itself at build time by
 * `src/content-check.ts`, so a typo cannot reach a page.
 */

const topicReference = z.string().regex(/^jelet-syllabus:[a-z]+:t\d{2}$/, 'A topic reference names a syllabus topic');
const subject = z.enum(['mathematics', 'physics', 'chemistry', 'electrical']);
const sectionId = z.string().regex(/^[a-z]+(?:-[a-z]+)*$/, 'A section id is lowercase words joined by hyphens');

const lessons = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content' }),
  schema: z.object({
    title: z.string().min(1),
    /** One line, shown in the catalog and in search. */
    summary: z.string().min(1),
    /** The subject the lesson belongs to. */
    subject,
    /** The syllabus topic the lesson teaches. */
    topic: topicReference,
    /** The revision of the lesson. It only ever goes up. */
    revision: z.number().int().positive(),
    /** Every lesson on this site is written for it. Nothing is copied. */
    provenance: z.literal('original'),
    /** `planned` marks a lesson that is written but not yet published. */
    status: z.enum(['open', 'planned']).default('open'),
    minutes: z.number().int().positive(),
    /** What the learner must already know. */
    prerequisites: z.array(z.string()).default([]),
    /** What the learner can do afterwards. */
    objective: z.string().min(1),
    sections: z.array(sectionId).min(1)
      .refine((sections) => new Set(sections).size === sections.length, 'Duplicate section IDs'),
  }),
});

const practice = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/practice' }),
  schema: z.object({
    publicId: z.string().regex(/^orig-[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    subject,
    topic: topicReference,
    revision: z.number().int().positive(),
    provenance: z.literal('original'),
    /** `original-practice` is a notebook check; `original-check` marks an answer. */
    readiness: z.enum(['original-practice', 'original-check']),
    /** The lesson section that carries the check. */
    primarySectionAnchor: sectionId,
    source: z.string().min(1),
    answerStatus: z.string().min(1),
    summary: z.string().min(1),
  }),
});

export const collections = { lessons, practice };
