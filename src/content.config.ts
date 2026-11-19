import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content' }),
  schema: z.object({
    title: z.string().min(1),
    topic: z.literal('jelet-syllabus:electrical-and-electronics:t04'),
    revision: z.literal(1),
    provenance: z.literal('original'),
    minutes: z.number().int().positive(),
    sections: z.array(z.string().regex(/^[a-z]+(?:-[a-z]+)*$/)).min(1)
      .refine((sections) => new Set(sections).size === sections.length, 'Duplicate section IDs'),
  }),
});

const practice = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/practice' }),
  schema: z.object({
    publicId: z.string().regex(/^orig-[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    topic: z.literal('jelet-syllabus:electrical-and-electronics:t04'),
    revision: z.literal(1),
    provenance: z.literal('original'),
    readiness: z.literal('original-practice'),
    primarySectionAnchor: z.string().regex(/^[a-z]+(?:-[a-z]+)*$/),
    source: z.string().min(1),
    answerStatus: z.string().min(1),
    summary: z.string().min(1),
  }),
});

export const collections = { lessons, practice };
