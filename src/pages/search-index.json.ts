import { buildLibraryIndex } from '../library';
import type { IndexEntry } from '../search';

/**
 * The local search index.
 *
 * The corpus is large enough that verbose keys cost real data on a phone, so
 * the payload uses short keys and the browser expands them again.
 */
export async function GET() {
  const entries = await buildLibraryIndex();
  const compact = entries.map((entry: IndexEntry) => ({
    i: entry.id,
    t: entry.title,
    s: entry.summary,
    y: entry.year,
    p: entry.paper,
    c: entry.category,
    r: entry.readiness,
    d: entry.identity,
    f: entry.figure,
    u: entry.url,
    a: entry.anchor,
    x: entry.terms,
  }));
  return new Response(JSON.stringify({ version: 2, entries: compact }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
