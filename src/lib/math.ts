/**
 * Build-time maths rendering.
 *
 * The corpus writes mathematics as LaTeX inside `\( … \)` (inline) and
 * `\[ … \]` (display). KaTeX renders it on the server while the site is
 * built, so a phone downloads plain HTML and CSS instead of a maths library,
 * and a question still reads correctly with JavaScript switched off.
 */
import katex from 'katex';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

type Segment = { kind: 'text' | 'inline' | 'display'; value: string };

/** Split a string into plain text, inline maths and display maths. */
export function splitMath(source: string): Segment[] {
  const segments: Segment[] = [];
  const pattern = /\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) !== null) {
    if (match.index > cursor) segments.push({ kind: 'text', value: source.slice(cursor, match.index) });
    const raw = match[0];
    if (raw.startsWith('\\[')) segments.push({ kind: 'display', value: raw.slice(2, -2) });
    else segments.push({ kind: 'inline', value: raw.slice(2, -2) });
    cursor = match.index + raw.length;
  }
  if (cursor < source.length) segments.push({ kind: 'text', value: source.slice(cursor) });
  return segments;
}

/** Render one LaTeX fragment, falling back to the source text if KaTeX fails. */
export function renderLatex(latex: string, displayMode: boolean): { html: string; error: boolean } {
  try {
    const html = katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
      trust: false,
      output: 'html',
      macros: { '\\RR': '\\mathbb{R}', '\\NN': '\\mathbb{N}' },
    });
    return { html, error: false };
  } catch {
    return { html: escapeHtml(latex), error: true };
  }
}

/** Render a whole passage: text is escaped, maths is typeset. */
export function renderMath(source: string): string {
  if (!source) return '';
  return splitMath(source)
    .map((segment) => {
      if (segment.kind === 'text') return escapeHtml(segment.value);
      const { html, error } = renderLatex(segment.value, segment.kind === 'display');
      return error ? `<span class="math-error" title="Maths could not be typeset">${escapeHtml(segment.value)}</span>` : html;
    })
    .join('');
}

/** Plain-text version used by the search index. */
export function stripMath(source: string): string {
  return splitMath(source)
    .map((segment) => (segment.kind === 'text' ? segment.value : ' '))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
