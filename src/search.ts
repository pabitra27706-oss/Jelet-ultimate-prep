export type IndexEntry = {
  id: string;
  type: 'lesson' | 'practice' | 'question' | 'sheet';
  title: string;
  summary: string;
  topic: string;
  year: string | null;
  paper: string | null;
  set: string | null;
  category: string | null;
  readiness: string;
  status: string;
  identity: string;
  figure: string;
  url: string;
  anchor: string | null;
  terms: string;
};

/** Preserve signs, exponents, subscripts and units; only fold case/space and a leading option prefix. */
export function normalizeQuery(value: string): string {
  return value.toLowerCase().trim().replace(/^\(?[a-d][\).:]\s*/, '').replace(/\s+/g, ' ');
}

export function matches(entry: IndexEntry, query: string, type: string, readiness: string): boolean {
  if (type !== 'all' && entry.type !== type) return false;
  if (readiness !== 'all' && entry.readiness !== readiness) return false;
  const tokens = normalizeQuery(query).split(' ').filter((token) => token.length > 0 && /[\p{L}\p{N}]/u.test(token));
  if (tokens.length === 0) return true;
  const haystack = normalizeQuery(`${entry.title} ${entry.summary} ${entry.topic} ${entry.terms}`);
  return tokens.every((token) => haystack.includes(token));
}
