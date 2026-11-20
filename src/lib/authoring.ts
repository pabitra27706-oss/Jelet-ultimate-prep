/**
 * The authoring and review library.
 *
 * This is the toolchain the Phase 07 brief asks for: a place where the
 * mapping and the original exercises can be inspected without running a
 * script by hand, and where a reviewer can check a claim against the
 * corpus.
 *
 * Two lists, two jobs:
 *
 * - The **original exercises** are generated at build time from declared
 *   templates and checked against an independent re-solve. Each one carries
 *   its equation, its ranges, its exclusions and its seed, so a reviewer can
 *   reproduce it exactly.
 * - The **review queue** is the set of decisions the mapper refused to make:
 *   a question two topics claim equally, a question no topic claims, and a
 *   topic with no markable coverage.
 *
 * No lesson prose is written here. The exercises are bare calculations with
 * a marked answer, not teaching material.
 */
import variantsData from '../data/variants.json' with { type: 'json' };
import { bandLabel, coverage, coverageSummary, reviewQueue, topicStatuses } from './coverage';

export type VariantTemplate = {
  id: string;
  topicId: string;
  title: string;
  equation: string;
  ranges: Record<string, [number, number]>;
  exclusions: string[];
  units: string;
};

export type VariantItem = {
  id: string;
  templateId: string;
  topicId: string;
  title: string;
  equation: string;
  units: string;
  seed: number;
  values: Record<string, number>;
  stem: string;
  options: { label: string; text: string }[];
  answer: string;
  verified: boolean;
  provenance: string;
};

export type VariantFile = {
  schema: number;
  version: string;
  provenance: string;
  templates: VariantTemplate[];
  items: VariantItem[];
  rejected: { templateId: string; seed: number; reason: string }[];
  checks: {
    independentResolves: number;
    uniqueOptions: number;
    singleAnswer: number;
    failed: number;
  };
};

export const variants = variantsData as unknown as VariantFile;
export const variantItems = variants.items;
export const variantTemplates = variants.templates;

/** The topic a template belongs to, as the coverage map knows it. */
export function topicFor(topicId: string) {
  return coverage.topics.find((topic) => topic.id === topicId) ?? null;
}

/**
 * The exercises grouped by template, with the topic each one belongs to.
 *
 * The grouping matters: a template that produces forty exercises still
 * covers one topic, and the coverage map counts topics, not exercises.
 */
export function variantsByTemplate(): { template: VariantTemplate; items: VariantItem[] }[] {
  return variantTemplates.map((template) => ({
    template,
    items: variantItems.filter((item) => item.templateId === template.id),
  }));
}

/** A summary of the toolchain, for the authoring page. */
export type ToolchainSummary = {
  templates: number;
  items: number;
  rejected: number;
  topicsReached: number;
  /** The topics the exercises reach that the corpus does not cover. */
  topicsOnlyHere: string[];
  checksPassed: number;
};

export function toolchainSummary(): ToolchainSummary {
  const reached = new Set(variantItems.map((item) => item.topicId));
  const covered = new Set(
    coverage.topics.filter((topic) => topic.coveredQuestions > 0).map((topic) => topic.id),
  );
  return {
    templates: variantTemplates.length,
    items: variantItems.length,
    rejected: variants.rejected.length,
    topicsReached: reached.size,
    topicsOnlyHere: [...reached].filter((id) => !covered.has(id)),
    checksPassed: variants.checks.independentResolves,
  };
}

/** The review queue, split by what it is asking for. */
export function queueByKind() {
  const queue = reviewQueue();
  return {
    conflicts: queue.filter((item) => item.kind === 'conflict'),
    gaps: queue.filter((item) => item.kind === 'uncovered-topic'),
    unmapped: queue.filter((item) => item.kind === 'unmapped'),
  };
}

export { coverageSummary, topicStatuses, bandLabel };
