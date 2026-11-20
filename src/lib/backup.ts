/**
 * The full study-record backup.
 *
 * Phase 08's decision on login and private sync is **no-go**. The reason is
 * architectural: this site is a static build on GitHub Pages with no server,
 * no database and no runtime secret store, so a sign-in flow cannot be
 * hosted here without changing the privacy position the site is built on.
 *
 * That decision only holds if the free fallback is actually good enough to
 * stand in. The workspace file already moves bookmarks, notes and resume
 * points, but it does **not** move the study record: the attempts and the
 * review queue live in separate storage and were left behind.
 *
 * This module closes that gap. One file carries the whole record:
 *
 * - the workspace (bookmarks, notes, resume points)
 * - every attempt, with its responses and its results
 * - the review queue, with its Leitner boxes and due dates
 *
 * The rules are the same ones the app already follows:
 *
 * - **A submitted result is final.** Importing never rewrites a submitted
 *   attempt's responses or results, and never replaces a submitted attempt
 *   with an unsubmitted one. The same rule that stops a second tab from
 *   overwriting the first submission stops a stale file from doing it.
 * - **An import is validated before anything is written.** A file that is
 *   too large, from another app, of an unknown version, or of the wrong
 *   shape changes nothing at all.
 * - **The learner chooses merge or replace**, and sees a preview of both
 *   before choosing.
 *
 * Nothing here uploads anything. The file is produced by the browser and
 * read by the browser.
 */
import { readAttempts, writeAttempts, type Attempt } from './attempts.ts';
import { readQueue, writeQueue, type ReviewItem } from './review.ts';
import {
  emptyWorkspace,
  mergeWorkspace,
  readWorkspace,
  writeWorkspace,
  validateImport as validateWorkspace,
  type WorkspaceData,
} from '../workspace.ts';

export const BACKUP_SCHEMA = 1;
export const BACKUP_APP_ID = 'jelet-ultimate-prep';
/**
 * The cap on an imported file.
 *
 * The record is small — a few hundred kilobytes for a heavy learner — so a
 * generous cap still rejects a file that is obviously not a backup.
 */
export const MAX_BACKUP_BYTES = 2_000_000;

export type FullBackup = {
  schemaVersion: typeof BACKUP_SCHEMA;
  appId: typeof BACKUP_APP_ID;
  kind: 'jelet-full-backup';
  exportedAt: string;
  workspace: WorkspaceData;
  attempts: Attempt[];
  review: ReviewItem[];
};

export type BackupSummary = {
  workspaceBookmarks: number;
  workspaceNotes: number;
  workspaceResume: number;
  attempts: number;
  submittedAttempts: number;
  reviewItems: number;
  /** Review items that are due now or overdue. */
  reviewDue: number;
};

export type ImportPreview = {
  /** What the file holds. */
  incoming: BackupSummary;
  /** What the device holds now. */
  current: BackupSummary;
  /** What a merge would add, by count. */
  mergeAdds: BackupSummary;
  /** Whether a merge would change any submitted result. */
  mergePreservesSubmitted: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** A loose check for an attempt: the fields the app relies on must be there. */
function isAttempt(value: unknown): value is Attempt {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.paperId === 'string'
    && typeof value.startedAt === 'number'
    && Array.isArray(value.questionIds);
}

/** A loose check for a review item: the fields the app relies on must be there. */
function isReviewItem(value: unknown): value is ReviewItem {
  return isRecord(value)
    && typeof value.questionId === 'string'
    && typeof value.paperId === 'string'
    && typeof value.box === 'number'
    && typeof value.due === 'number';
}

/**
 * Read the whole study record from this device.
 *
 * Each part is read independently, so a device where one store is
 * unavailable still produces a valid backup of the rest rather than nothing.
 */
export async function readFullBackup(): Promise<FullBackup> {
  let workspace = emptyWorkspace();
  try {
    workspace = await readWorkspace();
  } catch {
    // Storage blocked or the database is unavailable. The rest still counts.
  }
  return {
    schemaVersion: BACKUP_SCHEMA,
    appId: BACKUP_APP_ID,
    kind: 'jelet-full-backup',
    exportedAt: new Date().toISOString(),
    workspace,
    attempts: readAttempts(),
    review: readQueue(),
  };
}

/** The counts a learner can check before they import anything. */
export function summarise(backup: FullBackup, now = Date.now()): BackupSummary {
  return {
    workspaceBookmarks: backup.workspace.items.bookmarks.length,
    workspaceNotes: backup.workspace.items.notes.length,
    workspaceResume: backup.workspace.items.resume.length,
    attempts: backup.attempts.length,
    submittedAttempts: backup.attempts.filter((attempt) => attempt.submittedAt !== null).length,
    reviewItems: backup.review.length,
    reviewDue: backup.review.filter((item) => item.due <= now).length,
  };
}

/**
 * Validate an imported file.
 *
 * Nothing is written until this passes. Every failure returns a message
 * that says plainly that nothing changed.
 */
export function validateBackup(raw: unknown, size = 0): { ok: true; data: FullBackup } | { ok: false; error: string } {
  if (size > MAX_BACKUP_BYTES) {
    return { ok: false, error: 'File is too large to be a backup. Nothing changed.' };
  }
  if (!isRecord(raw)) {
    return { ok: false, error: 'Not a backup file. Nothing changed.' };
  }
  if (raw.kind !== 'jelet-full-backup') {
    return { ok: false, error: 'Not a JELET backup file. Nothing changed.' };
  }
  if (raw.schemaVersion !== BACKUP_SCHEMA) {
    return { ok: false, error: 'Unsupported backup version. Nothing changed.' };
  }
  if (raw.appId !== BACKUP_APP_ID) {
    return { ok: false, error: 'This backup belongs to another app. Nothing changed.' };
  }

  const workspace = validateWorkspace(raw.workspace);
  if (!workspace.ok) {
    return { ok: false, error: `The workspace part is not readable. ${workspace.error}` };
  }
  if (!Array.isArray(raw.attempts) || !raw.attempts.every(isAttempt)) {
    return { ok: false, error: 'The attempts part is not readable. Nothing changed.' };
  }
  if (!Array.isArray(raw.review) || !raw.review.every(isReviewItem)) {
    return { ok: false, error: 'The review part is not readable. Nothing changed.' };
  }

  return {
    ok: true,
    data: {
      schemaVersion: BACKUP_SCHEMA,
      appId: BACKUP_APP_ID,
      kind: 'jelet-full-backup',
      exportedAt: typeof raw.exportedAt === 'string' ? raw.exportedAt : '',
      workspace: workspace.data,
      attempts: raw.attempts as Attempt[],
      review: raw.review as ReviewItem[],
    },
  };
}

/**
 * Merge an incoming backup with what the device holds.
 *
 * The rules, in order of importance:
 *
 * 1. **A submitted attempt is never overwritten.** If the device holds a
 *    submitted attempt for the same id, the incoming one is dropped — even
 *    if it is newer. The first submission of a paper is the one that
 *    stands.
 * 2. **A live attempt merges field by field**, so an answer the incoming
 *    file has and the device does not survives, and the newest answer wins
 *    where both have one.
 * 3. **The workspace merges by stable id**, never overwriting a local item.
 * 4. **The review queue merges by question id**, keeping the item that is
 *    further along the Leitner ladder, so a merge never sends a learner
 *    back to box 0.
 */
export function mergeBackup(current: FullBackup, incoming: FullBackup): FullBackup {
  const currentAttempts = new Map(current.attempts.map((attempt) => [attempt.id, attempt]));
  const mergedAttempts: Attempt[] = [];

  for (const attempt of incoming.attempts) {
    const existing = currentAttempts.get(attempt.id);
    if (!existing) {
      mergedAttempts.push(attempt);
      continue;
    }
    // A submitted result is final. The device's submission wins.
    if (existing.submittedAt !== null) {
      mergedAttempts.push(existing);
      continue;
    }
    if (attempt.submittedAt !== null) {
      // The incoming file has the submission. It is the only submission.
      mergedAttempts.push(attempt);
      continue;
    }
    // Both are live. Merge them the way two tabs would.
    mergedAttempts.push(mergeLiveAttempt(existing, attempt));
  }

  // Keep the device's own attempts that the file does not mention.
  for (const attempt of current.attempts) {
    if (!mergedAttempts.some((entry) => entry.id === attempt.id)) {
      mergedAttempts.push(attempt);
    }
  }

  const currentReview = new Map(current.review.map((item) => [item.questionId, item]));
  const mergedReview: ReviewItem[] = [];
  for (const item of incoming.review) {
    const existing = currentReview.get(item.questionId);
    if (!existing) {
      mergedReview.push(item);
      continue;
    }
    // The further-along item wins, so a merge never unlearns anything.
    mergedReview.push(
      existing.box > item.box
        ? existing
        : item.box > existing.box
          ? item
          : existing.lastAt >= item.lastAt ? existing : item,
    );
  }
  for (const item of current.review) {
    if (!mergedReview.some((entry) => entry.questionId === item.questionId)) {
      mergedReview.push(item);
    }
  }

  return {
    ...current,
    exportedAt: current.exportedAt,
    workspace: mergeWorkspace(current.workspace, incoming.workspace),
    attempts: mergedAttempts,
    review: mergedReview,
  };
}

/**
 * Merge two live attempts.
 *
 * The earliest start wins, so the deadline cannot be pushed back. For each
 * question, the answer with the newer timestamp wins, and an answer only
 * one side has survives.
 */
function mergeLiveAttempt(existing: Attempt, incoming: Attempt): Attempt {
  const responses: Record<string, string[]> = { ...existing.responses };
  const responseTimes: Record<string, number> = { ...existing.responseTimes };
  for (const [questionId, letters] of Object.entries(incoming.responses ?? {})) {
    const held = responseTimes[questionId];
    const at = incoming.responseTimes?.[questionId] ?? incoming.updatedAt;
    if (held === undefined || at >= held) {
      responses[questionId] = letters;
      responseTimes[questionId] = at;
    }
  }
  const results = new Map<string, Attempt['results'] extends (infer R)[] | undefined ? R : never>();
  for (const entry of existing.results ?? []) results.set(entry.questionId, entry);
  for (const entry of incoming.results ?? []) {
    const held = results.get(entry.questionId);
    if (!held) results.set(entry.questionId, entry);
  }
  return {
    ...existing,
    startedAt: Math.min(existing.startedAt, incoming.startedAt),
    updatedAt: Math.max(existing.updatedAt, incoming.updatedAt),
    responses,
    responseTimes,
    marked: [...new Set([...(existing.marked ?? []), ...(incoming.marked ?? [])])],
    visited: [...new Set([...(existing.visited ?? []), ...(incoming.visited ?? [])])],
    assisted: [...new Set([...(existing.assisted ?? []), ...(incoming.assisted ?? [])])],
    results: [...results.values()],
  };
}

/** What a merge or a replace would do, before the learner chooses. */
export function previewImport(current: FullBackup, incoming: FullBackup, now = Date.now()): ImportPreview {
  const merged = mergeBackup(current, incoming);
  const preserves = current.attempts
    .filter((attempt) => attempt.submittedAt !== null)
    .every((attempt) => {
      const after = merged.attempts.find((entry) => entry.id === attempt.id);
      return after?.submittedAt === attempt.submittedAt
        && JSON.stringify(after?.results ?? []) === JSON.stringify(attempt.results ?? []);
    });
  return {
    incoming: summarise(incoming, now),
    current: summarise(current, now),
    mergeAdds: {
      workspaceBookmarks: merged.workspace.items.bookmarks.length - current.workspace.items.bookmarks.length,
      workspaceNotes: merged.workspace.items.notes.length - current.workspace.items.notes.length,
      workspaceResume: merged.workspace.items.resume.length - current.workspace.items.resume.length,
      attempts: merged.attempts.length - current.attempts.length,
      submittedAttempts: merged.attempts.filter((attempt) => attempt.submittedAt !== null).length
        - current.attempts.filter((attempt) => attempt.submittedAt !== null).length,
      reviewItems: merged.review.length - current.review.length,
      reviewDue: merged.review.filter((item) => item.due <= now).length
        - current.review.filter((item) => item.due <= now).length,
    },
    mergePreservesSubmitted: preserves,
  };
}

/**
 * Write a backup to the device.
 *
 * A replace clears what is there first. A merge adds to it. Either way, the
 * parts are written independently, so a failure in one does not lose the
 * others.
 */
export async function applyBackup(
  backup: FullBackup,
  mode: 'merge' | 'replace',
  current?: FullBackup,
): Promise<{ applied: boolean; errors: string[] }> {
  const errors: string[] = [];
  const target = mode === 'merge' && current ? mergeBackup(current, backup) : backup;

  try {
    await writeWorkspace(target.workspace);
  } catch {
    errors.push('The workspace could not be written. Everything else was restored.');
  }
  if (!writeAttempts(target.attempts)) {
    errors.push('The attempts could not be written. Everything else was restored.');
  }
  if (!writeQueue(target.review)) {
    errors.push('The review queue could not be written. Everything else was restored.');
  }
  return { applied: errors.length === 0, errors };
}

/** The file name a browser should suggest. */
export function backupFileName(exportedAt: string): string {
  const stamp = exportedAt.replace(/[:.]/g, '-').slice(0, 19);
  return `jelet-record-${stamp}.json`;
}
