#!/usr/bin/env node
/**
 * Build the public study dataset from the preserved archive.
 *
 * Source of truth (read-only):
 *   archive/jelet-prep/data/pyq-md/*.md          seven question-paper transcriptions
 *   editorial/pyq-md/*.md                        transcriptions made after the capture
 *   archive/jelet-prep/data/docs/official-keys/*  WBJEEB final answer-key notices (official tier)
 *   archive/jelet-prep/data/docs/derived-keys/*   independently solved 2022 answers (derived tier)
 *   archive/jelet-prep/data/syllabus.md           2026 syllabus (bulletin of 18 March 2026)
 *
 * Outputs (committed, deterministic):
 *   src/data/papers.json   parsed papers, subjects, categories, gaps, provenance
 *   src/data/keys.json     per-year answer keys with tier, board reference and booklet identity
 *   src/data/syllabus.json subject/topic tree parsed from the bulletin syllabus
 *
 * The archive is never modified and never published. Nothing here invents a key,
 * a subject or a syllabus match: every value is either read from the archive or
 * derived from a heading/label that the archive itself states. Where a statement
 * cannot be made from the archive the item is flagged, not guessed.
 *
 * Usage: node scripts/build-content.mjs [--check]
 *   --check  regenerate in memory and fail if the committed files differ
 */
import { createHash } from 'node:crypto';
import { attachProvisionalAids } from './provisional-aids.mjs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const archive = join(root, 'archive/jelet-prep/data');
const outDir = join(root, 'src/data');
const checkOnly = process.argv.includes('--check');

/**
 * Where a transcription comes from.
 *
 * The preserved archive is a read-only baseline and holds the seven papers it
 * was captured with. A paper transcribed after that capture lives in the
 * editorial collection, beside its provenance record, and the archive is left
 * exactly as it was. Both are read the same way; only the root differs, and
 * the source file recorded in the dataset says which collection a paper came
 * from.
 */
const COLLECTIONS = [
  { root: join(root, 'editorial'), label: 'editorial' },
  { root: archive, label: 'archive' },
];

/**
 * Read one paper transcription, newest collection first.
 *
 * @param {number} year
 * @returns {Promise<{raw: string, sourceFile: string}>}
 */
async function readTranscription(year) {
  const relative = join('pyq-md', `${year}.md`);
  for (const collection of COLLECTIONS) {
    let raw;
    try {
      raw = await readFile(join(collection.root, relative), 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    return {
      raw,
      sourceFile: collection.label === 'archive' ? relative : join(collection.label, relative),
    };
  }
  throw new Error(`No transcription for ${year} in ${COLLECTIONS.map((c) => c.label).join(' or ')}`);
}

/** Subject keys used across the site. Order follows the 2026 Paper I pattern. */
const SUBJECT_KEYS = {
  Mathematics: 'mathematics',
  Physics: 'physics',
  Chemistry: 'chemistry',
  'Electrical & Electronics': 'electrical',
  'Electrical / Electronics': 'electrical',
  'Electrical Technology': 'electrical',
  'Computer & IT': 'computer',
  'Computer Application': 'computer',
};

const sha256 = (text) => createHash('sha256').update(text).digest('hex');

/* ------------------------------------------------------------------ *
 * 1. Papers
 * ------------------------------------------------------------------ */

/**
 * Section layout per paper era, read from the headings that each transcription
 * states. `legacy` papers (2017-2021) used three subjects and 100 one-mark
 * questions; `modern` papers (2022+) use the four-subject 120-mark pattern.
 * Declared ranges that the transcription itself contradicts are corrected here
 * and the correction is recorded in `notes` (see the archived content audit:
 * "COMPUTER & IT (Q36-55) declares 36-55 but holds question(s) ... 100").
 */
const LAYOUT = {
  2017: { pattern: 'legacy', maxMarks: 100, durationMinutes: 120, subjects: [
    { subject: 'Mathematics', from: 1, to: 20, categories: [{ category: 'I', from: 1, to: 20 }] },
    { subject: 'Electrical Technology', from: 21, to: 35, categories: [{ category: 'I', from: 21, to: 35 }] },
    { subject: 'Computer & IT', from: 36, to: 100, categories: [{ category: 'I', from: 36, to: 100 }] },
  ], notes: ['Section heading declares "COMPUTER & IT (Q36-55)" but holds Q36-100; range corrected from the transcription.'] },
  2018: { pattern: 'legacy', maxMarks: 100, durationMinutes: 120, subjects: [
    { subject: 'Mathematics', from: 1, to: 20, categories: [{ category: 'I', from: 1, to: 20 }] },
    { subject: 'Electrical Technology', from: 21, to: 35, categories: [{ category: 'I', from: 21, to: 35 }] },
    { subject: 'Computer Application', from: 36, to: 100, categories: [{ category: 'I', from: 36, to: 100 }] },
  ], notes: ['Section heading declares "COMPUTER APPLICATION (Q36-55)" but holds Q36-100; range corrected from the transcription.'] },
  2019: { pattern: 'legacy', maxMarks: 100, durationMinutes: 120, subjects: [
    { subject: 'Mathematics', from: 1, to: 20, categories: [{ category: 'I', from: 1, to: 20 }] },
    { subject: 'Electrical Technology', from: 21, to: 35, categories: [{ category: 'I', from: 21, to: 35 }] },
    { subject: 'Computer Application', from: 36, to: 100, categories: [{ category: 'I', from: 36, to: 100 }] },
  ], notes: [
    'Section heading declares "COMPUTER APPLICATION (Q36-55)" but holds Q36-100; range corrected from the transcription.',
    'File title says JELET-2018; the file is filed as 2019 and the year conflict is unresolved in the archive.',
  ] },
  2021: { pattern: 'legacy', maxMarks: 100, durationMinutes: 120, subjects: [
    { subject: 'Mathematics', from: 1, to: 20, categories: [{ category: 'I', from: 1, to: 20 }] },
    { subject: 'Electrical Technology', from: 21, to: 35, categories: [{ category: 'I', from: 21, to: 35 }] },
    { subject: 'Computer Application', from: 36, to: 100, categories: [{ category: 'I', from: 36, to: 100 }] },
  ], notes: ['Section heading declares "COMPUTER APPLICATION (Q36-55)" but holds Q36-100; range corrected from the transcription.'] },
  2022: { pattern: 'modern', maxMarks: 120, durationMinutes: 120, subjects: [
    { subject: 'Mathematics', from: 1, to: 40, categories: [{ category: 'I', from: 1, to: 30 }, { category: 'II', from: 31, to: 40 }] },
    { subject: 'Physics', from: 41, to: 70, categories: [{ category: 'I', from: 41, to: 65 }, { category: 'II', from: 66, to: 70 }] },
    { subject: 'Chemistry', from: 71, to: 90, categories: [{ category: 'I', from: 71, to: 85 }, { category: 'II', from: 86, to: 90 }] },
    { subject: 'Electrical & Electronics', from: 91, to: 100, categories: [{ category: 'I', from: 91, to: 100 }] },
  ], notes: ['The transcription states one combined heading for Q1-85; the subject split comes from the archived derived key, which records a subject for every question.'] },
  2023: { pattern: 'modern', maxMarks: 120, durationMinutes: 120, subjects: [
    { subject: 'Mathematics', from: 1, to: 40, categories: [{ category: 'I', from: 1, to: 30 }, { category: 'II', from: 31, to: 40 }] },
    { subject: 'Physics', from: 41, to: 70, categories: [{ category: 'I', from: 41, to: 65 }, { category: 'II', from: 66, to: 70 }] },
    { subject: 'Chemistry', from: 71, to: 90, categories: [{ category: 'I', from: 71, to: 85 }, { category: 'II', from: 86, to: 90 }] },
    { subject: 'Electrical & Electronics', from: 91, to: 100, categories: [{ category: 'I', from: 91, to: 100 }] },
  ], notes: [
    'Transcribed from the official WBJEEB booklet for Paper I, Set A; see editorial/provenance/2023-paper1.md.',
    'The subject and category ranges are the section headings the booklet itself prints.',
    'Ten items depend on a figure the transcription does not reproduce; they are held and are not marked.',
    'Q6, Q46, Q88 and Q94 are voided by the board: no option is keyed and the marks go to every candidate.',
    'Q34 as printed is satisfied by two options; the board keyed (D).',
  ] },
  2024: { pattern: 'modern', maxMarks: 120, durationMinutes: 120, subjects: [
    { subject: 'Mathematics', from: 1, to: 40, categories: [{ category: 'I', from: 1, to: 30 }, { category: 'II', from: 31, to: 40 }] },
    { subject: 'Physics', from: 41, to: 70, categories: [{ category: 'I', from: 41, to: 65 }, { category: 'II', from: 66, to: 70 }] },
    { subject: 'Chemistry', from: 71, to: 90, categories: [{ category: 'I', from: 71, to: 85 }, { category: 'II', from: 86, to: 90 }] },
    { subject: 'Electrical & Electronics', from: 91, to: 100, categories: [{ category: 'I', from: 91, to: 100 }] },
  ], notes: ['Category-II questions are marked inline in the transcription ("(Category-II)") and the 2024 key confirms multi-option items only inside Q31-40, Q66-70 and Q86-90.'] },
  2025: { pattern: 'modern', maxMarks: 120, durationMinutes: 120, subjects: [
    { subject: 'Mathematics', from: 1, to: 40, categories: [{ category: 'I', from: 1, to: 30 }, { category: 'II', from: 31, to: 40 }] },
    { subject: 'Physics', from: 41, to: 70, categories: [{ category: 'I', from: 41, to: 65 }, { category: 'II', from: 66, to: 70 }] },
    { subject: 'Chemistry', from: 71, to: 90, categories: [{ category: 'I', from: 71, to: 85 }, { category: 'II', from: 86, to: 90 }] },
    { subject: 'Electrical & Electronics', from: 91, to: 100, categories: [{ category: 'I', from: 91, to: 100 }] },
  ], notes: ['Category-II ranges are printed in the transcription headings and confirmed by the 2025 key.'] },
};

const QUESTION_START = /^\s*(?:\*\*)?(\d{1,3})\.(?:\*\*)?\s*/;
/**
 * An option marker is "(A)" that starts a line or follows the corpus's own
 * separators (an em space between inline options, or the two trailing spaces
 * before a line break). The "(A)" inside "adj(A)" or "Both (A) and (B)" is
 * therefore never mistaken for an option.
 */
const OPTION_MARK = /(?:^|(?<=[\u2003])|(?<=  ))\(([A-D])\)(?=\s|$)/;

const FIGURE_WORDS = [
  /\[Diagram[^\]]*\]/i,
  /\[Graph[^\]]*\]/i,
  /\[Image[^\]]*\]/i,
  /\bnot reproduced\b/i,
  /\bdiagram based\b/i,
  /\(Diagram\)/i,
  /\(diagram\)/i,
  /\bdiagrams are not\b/i,
];

/** Split one question block into stem + labelled options, keeping line structure. */
function parseBlock(text) {
  const notes = [];
  const source = text
    .replace(/\r/g, '')
    .split('\n')
    .filter((line) => {
      if (/^\s*---\s*$/.test(line)) return false;
      if (/^\s*\*?\*?End of Question Paper[^*]*\*?\*?\s*$/i.test(line)) return false;
      const editorial = line.match(/^\s*\[(.+)\]\s*$/);
      if (editorial) { notes.push(editorial[1].trim()); return false; }
      return true;
    })
    .join('\n');
  const markers = [...source.matchAll(new RegExp(OPTION_MARK.source, 'gm'))];
  if (markers.length === 0) {
    return { stem: source.replace(/\s+/g, ' ').trim(), options: [], notes };
  }
  const stem = source.slice(0, markers[0].index).replace(/\s+/g, ' ').trim();
  const options = markers.map((marker, index) => {
    const start = marker.index + marker[0].length;
    const end = index + 1 < markers.length ? markers[index + 1].index : source.length;
    return { label: marker[1], text: source.slice(start, end).replace(/\s+/g, ' ').trim() };
  });
  return { stem, options, notes };
}

function detectFigure(text) {
  for (const pattern of FIGURE_WORDS) {
    if (pattern.test(text)) return true;
  }
  return false;
}

async function parsePaper(year) {
  const { raw, sourceFile } = await readTranscription(year);
  const lines = raw.split('\n');
  const layout = LAYOUT[year];
  if (!layout) throw new Error(`No layout recorded for ${year}`);

  const titleLine = lines.find((line) => line.startsWith('# ')) ?? `# JELET ${year}`;
  const instructions = [];
  for (const line of lines) {
    if (/^\*\*Instructions/i.test(line)) continue;
    const instruction = line.match(/^[-–]\s+(Category.*|Answer on OMR.*|Each question has four options.*|No answer.*)$/);
    if (instruction && instructions.length < 6) instructions.push(instruction[1].trim());
    if (/^##\s+MATHEMATICS/.test(line)) break;
  }
  const durationLine = lines.find((line) => /\*\*Duration|\*\*Time/.test(line)) ?? '';
  const durationMatch = durationLine.match(/(\d+)\s*hours?/i);
  const durationMinutes = durationMatch ? Number(durationMatch[1]) * 60 : layout.durationMinutes;

  /** @type {Map<number, {n:number, text:string, line:number}>} */
  const blocks = new Map();
  let current = null;
  lines.forEach((line, index) => {
    // A heading closes the previous question: the section title that follows
    // the last item of a block belongs to the block, not to the item.
    if (/^#{1,6}\s/.test(line)) {
      current = null;
      return;
    }
    const match = line.match(QUESTION_START);
    if (match) {
      const n = Number(match[1]);
      if (n >= 1 && n <= 100) {
        current = { n, text: line.slice(match[0].length), line: index + 1 };
        blocks.set(n, current);
        return;
      }
    }
    if (current) current.text += `\n${line}`;
  });

  const questions = [];
  for (const block of [...blocks.values()].sort((a, b) => a.n - b.n)) {
    const { stem, options, notes } = parseBlock(block.text);
    const subject = layout.subjects.find((entry) => block.n >= entry.from && block.n <= entry.to);
    if (!subject) throw new Error(`Question ${year}#${block.n} falls outside every subject range`);
    const categoryBlock = subject.categories.find((entry) => block.n >= entry.from && block.n <= entry.to);
    const inlineCategory = block.text.match(/\(\s*Category\s*[-‑–]?\s*II\s*\)/i);
    const category = inlineCategory ? 'II' : categoryBlock.category;
    const marks = category === 'II' ? 2 : 1;
    const figure = detectFigure(block.text);
    const hasAllOptions = options.length === 4 && options.every((option) => option.text.length > 0);
    const holdReason = !hasAllOptions
      ? (figure ? 'The transcription does not reproduce the options (diagram options).' : 'The transcription does not reproduce the options of this item.')
      : figure
        ? 'The item depends on a diagram the transcription does not reproduce.'
        : null;
    questions.push({
      id: `jelet-et-p1-${year}:q${block.n}`,
      n: block.n,
      subject: subject.subject,
      subjectKey: SUBJECT_KEYS[subject.subject] ?? 'other',
      category,
      marks,
      stem,
      options,
      figure,
      figureNote: figure ? 'This item depends on a diagram that the preserved transcription does not reproduce.' : null,
      /** The figure layer entry for this item, when the collection has one. */
      figureAsset: null,
      transcriptionNote: notes.length > 0 ? notes.join(' ') : null,
      optionsComplete: hasAllOptions,
      scorable: hasAllOptions && !figure,
      holdReason,
      sourceLine: block.line,
    });
  }

  const present = new Set(questions.map((question) => question.n));
  const gaps = [];
  for (let n = 1; n <= 100; n += 1) if (!present.has(n)) gaps.push(n);

  return {
    id: `jelet-et-p1-${year}`,
    year,
    hasKey: false,
    keyTier: null,
    scoreableQuestions: 0,
    scoreableMarks: 0,
    boardAwardedQuestions: 0,
    boardAwardedMarks: 0,
    heldQuestions: 0,
    voidedQuestions: [],
    rehearsableQuestions: 0,
    rehearsableMarks: 0,
    title: titleLine.replace(/^#\s*/, '').trim(),
    label: `JELET ${year} · Paper I`,
    pattern: layout.pattern,
    durationMinutes,
    maxMarks: layout.maxMarks,
    questionCount: questions.length,
    instructions,
    subjects: layout.subjects.map((subject) => ({
      subject: subject.subject,
      subjectKey: SUBJECT_KEYS[subject.subject] ?? 'other',
      from: subject.from,
      to: subject.to,
      categories: subject.categories,
    })),
    notes: layout.notes ?? [],
    gaps,
    questions,
    sourceFile,
    sourceSha256: sha256(raw),
  };
}

/* ------------------------------------------------------------------ *
 * 2. Answer keys
 * ------------------------------------------------------------------ */

async function buildKeys(papers) {
  const keys = [];
  const years = [2023, 2024, 2025, 2026];
  for (const year of years) {
    const file = join(archive, 'docs/official-keys', `${year}-paper1.json`);
    const data = JSON.parse(await readFile(file, 'utf8'));
    const answers = {};
    const voided = [];
    for (const entry of data.entries) {
      if (entry.answer === 'W') voided.push(entry.q);
      answers[entry.q] = entry.answer;
    }
    const hasPaper = papers.some((paper) => paper.year === year);
    keys.push({
      year,
      paperId: `jelet-et-p1-${year}`,
      tier: 'official',
      documentRef: data.documentRef,
      documentDate: data.documentDate,
      sourceTable: data.sourceTable,
      provenance: data.provenance,
      hostedBy: data.hostedBy,
      tableSemantics: data.tableSemantics,
      booklet: data.booklet ?? null,
      hasPaper,
      usableForScoring: hasPaper && data.booklet?.mapping === 'identity',
      voided,
      answers,
      sourceFile: join('docs/official-keys', `${year}-paper1.json`),
    });
  }

  const derived = JSON.parse(await readFile(join(archive, 'docs/derived-keys/2022-keys.json'), 'utf8'));
  const answers = {};
  const reasoning = {};
  const tiers = {};
  const voided = [];
  for (const entry of derived.entries) {
    answers[entry.q] = entry.answer.join('');
    tiers[entry.q] = entry.tier;
    if (entry.reasoning) reasoning[entry.q] = entry.reasoning;
    if (entry.tier === 'disputed') voided.push(entry.q);
  }
  keys.push({
    year: 2022,
    paperId: 'jelet-et-p1-2022',
    tier: 'derived',
    documentRef: null,
    documentDate: derived.date,
    sourceTable: derived.paperLabel,
    provenance: `${derived.solvedBy} · ${derived.markingRule}`,
    hostedBy: null,
    tableSemantics: 'Booklet question order, Set A.',
    booklet: { mapping: 'identity', set: 'A', bookletNumber: derived.booklet, sourceFile: derived.sourceFile, determination: 'Derived answers were produced from the booklet pages; no board key exists for 2022.' },
    hasPaper: true,
    usableForScoring: true,
    voided,
    answers,
    tiers,
    reasoning,
    sourceFile: join('docs/derived-keys/2022-keys.json'),
  });

  return keys;
}

/* ------------------------------------------------------------------ *
 * 3. Syllabus
 * ------------------------------------------------------------------ */

async function buildSyllabus() {
  const raw = await readFile(join(archive, 'syllabus.md'), 'utf8');
  const lines = raw.split('\n');
  const subjects = [];
  let subject = null;
  let topic = null;

  const subjectKeyFor = (name) => {
    const upper = name.toUpperCase();
    if (upper.startsWith('MATHEMATICS')) return 'mathematics';
    if (upper.startsWith('PHYSICS')) return 'physics';
    if (upper.startsWith('CHEMISTRY')) return 'chemistry';
    if (upper.startsWith('FUNDAMENTALS')) return 'electrical';
    return 'other';
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const heading = line.match(/^###\s+\d+\.\s+(.+)$/);
    if (heading) {
      const name = heading[1].trim();
      const id = subjectKeyFor(name);
      if (id === 'other') { subject = null; topic = null; continue; }
      subject = { id, name, topics: [] };
      subjects.push(subject);
      topic = null;
      continue;
    }
    // Style A — mathematics and chemistry: "**A. Topic name**" then a detail paragraph.
    const bold = line.match(/^\*\*([A-Z])\.\s*(.+?)\*\*\s*$/);
    if (bold && subject) {
      topic = { id: `${subject.id}-t${bold[1].toLowerCase()}`, code: bold[1], name: bold[2].trim(), detail: '' };
      subject.topics.push(topic);
      const next = (lines[index + 1] ?? '').trim();
      if (next && !next.startsWith('**') && !next.startsWith('-') && !next.startsWith('#')) {
        topic.detail = next;
        index += 1;
      }
      continue;
    }
    // Style B — physics and electrical: "- **Topic:** detail".
    const bullet = line.match(/^-\s+\*\*(.+?):\*\*\s*(.*)$/);
    if (bullet && subject) {
      subject.topics.push({
        id: `${subject.id}-t${String(subject.topics.length + 1).padStart(2, '0')}`,
        code: String.fromCharCode(65 + subject.topics.length),
        name: bullet[1].trim(),
        detail: bullet[2].trim(),
      });
      topic = null;
      continue;
    }
  }

  const pattern = raw.match(/### Paper‑I[\s\S]*?\|\s*\*\*Total\*\*\s*\|[^|]*\|[^|]*\|[^|]*\|\s*\*\*120\*\*\s*\|/);
  return {
    edition: 'JELET-2026 Syllabus & Essential Information',
    bulletinDate: '2026-03-18',
    examDate: '2026-06-13',
    examDurationMinutes: 120,
    pattern: {
      categoryI: { marks: 1, negative: -0.25 },
      categoryII: { marks: 2, negative: 0 },
      totalQuestions: 100,
      totalMarks: 120,
    },
    subjects,
    sourceFile: 'syllabus.md',
    sourceSha256: sha256(raw),
    patternTableFound: Boolean(pattern),
  };
}

/* ------------------------------------------------------------------ *
 * 4. Emit
 * ------------------------------------------------------------------ */

const papers = [];
for (const year of [2017, 2018, 2019, 2021, 2022, 2023, 2024, 2025]) papers.push(await parsePaper(year));
const keys = await buildKeys(papers);
const syllabus = await buildSyllabus();

/* ---- attach key facts to each question and derive the scoring gate ---- */
for (const paper of papers) {
  const key = keys.find((entry) => entry.year === paper.year) ?? null;
  const answerMap = key?.answers ?? {};
  const voided = new Set(key?.voided ?? []);
  for (const question of paper.questions) {
    const answer = answerMap[question.n];
    question.keyAnswer = answer ?? null;
    question.voided = voided.has(question.n);
    question.hasKey = Boolean(answer);
    // The transcription reproduces this item's options. A voided item needs
    // no diagram to be answered — the board keyed nothing — but it does need
    // its options present so it can be shown as a paper number.
    const presentable = question.optionsComplete;
    question.scorable = question.scorable && question.hasKey && !question.voided;
    /**
     * The board voided this question: it published "W", so no option is keyed
     * and the marks go to every candidate. It is not a held item — nothing the
     * learner could do changes the outcome — it is a board-awarded one, and its
     * marks belong in the rehearsal's total.
     *
     * This holds even for an item whose diagram the transcription does not
     * reproduce: the board voided it precisely so that no answer was needed.
     * Holding it would understate the paper, because the board awarded the
     * mark to every candidate who sat it.
     */
    question.boardAwarded = question.voided && presentable;
    if (!question.hasKey && key) {
      question.holdReason = question.holdReason ?? 'The preserved key does not cover this item.';
    }
    if (question.voided) {
      question.holdReason = question.boardAwarded
        ? null
        : 'The board voided this question in its final answer-key notice, and the preserved transcription does not reproduce the item, so it is held and its marks are not in this rehearsal\'s total.';
      question.voidNote = question.boardAwarded
        ? 'The board voided this question in its final answer-key notice: no option was keyed, so the marks go to every candidate.'
        : null;
    }
  }
  paper.hasKey = Boolean(key);
  paper.keyTier = key?.tier ?? null;
  paper.scoreableQuestions = paper.questions.filter((question) => question.scorable).length;
  paper.scoreableMarks = paper.questions.filter((question) => question.scorable).reduce((sum, question) => sum + question.marks, 0);
  paper.boardAwardedQuestions = paper.questions.filter((question) => question.boardAwarded).length;
  paper.boardAwardedMarks = paper.questions.filter((question) => question.boardAwarded).reduce((sum, question) => sum + question.marks, 0);
  paper.heldQuestions = paper.questions.filter((question) => !question.scorable && !question.boardAwarded).length;
  paper.voidedQuestions = paper.questions.filter((question) => question.voided).map((question) => question.n);
  paper.rehearsableQuestions = paper.scoreableQuestions + paper.boardAwardedQuestions;
  paper.rehearsableMarks = paper.scoreableMarks + paper.boardAwardedMarks;
}

/* ---- attach the figure layer ---- */
/**
 * A question whose stem points at a diagram is a dead end unless the diagram
 * is there. The figure layer is a separate asset set, referenced by question
 * id, and it never touches the scoring gate: ADR-0002 is explicit that a
 * redrawn figure does not verify a question and does not unblock scoring.
 * The notes below change; `scorable`, `boardAwarded` and `holdReason`'s
 * presence do not.
 */
for (const paper of papers) {
  const path = join(root, 'editorial/figures', String(paper.year), 'manifest.json');
  let manifest = null;
  try {
    manifest = JSON.parse(await readFile(path, 'utf8'));
  } catch {
    manifest = null;
  }
  if (!manifest) continue;
  const byQuestion = new Map(manifest.entries.map((entry) => [entry.question, entry]));
  for (const question of paper.questions) {
    const entry = byQuestion.get(question.n);
    if (!entry) continue;
    question.figureAsset = {
      id: entry.id,
      svg: entry.svg,
      url: join('figures', String(paper.year), entry.svg),
      kind: entry.figureKind,
      status: entry.status,
      fidelity: entry.fidelity,
      alt: entry.alt,
      description: entry.description,
      deviations: entry.deviations,
      reviewed: entry.kindReviewed === true,
    };
    question.figureNote = 'Reconstructed figure. It is drawn from the values printed in the booklet and is not the official artwork.';
    if (!question.scorable && !question.boardAwarded) {
      question.holdReason = question.optionsComplete
        ? 'The item depends on a diagram. The reconstruction shows the printed values, but a redraw does not verify an item, so it is not marked.'
        : 'The transcription does not reproduce the options of this item, and a reconstructed diagram does not supply them, so the item is not marked.';
    }
  }
}

// Import only a sanitised, read-only study aid, never a scored key.
const auditLines = (await readFile(join(root, 'docs/audits/2026-11-21-jelet-2017-2022-reconciliation-7903a34.tsv'), 'utf8')).trim().split('\n');
const auditFields = auditLines.shift().split('\t');
const aidVerdicts = new Map();
for (const line of auditLines) {
  const row = Object.fromEntries(line.split('\t').map((value, i) => [auditFields[i], value]));
  const id = `${row.year}:${row.q}`;
  if (aidVerdicts.has(id)) throw new Error('Duplicate provisional audit row');
  aidVerdicts.set(id, { stored: row.stored_answer, status: row.source_verdict });
}
for (const paper of papers.filter(p => [2017,2018,2019,2021].includes(p.year))) {
  const record = JSON.parse(await readFile(join(root, `editorial/derived-keys/${paper.year}/${paper.year}-keys.json`), 'utf8'));
  attachProvisionalAids(paper, record, aidVerdicts);
}

/* ---- invariants: fail loudly rather than publish a wrong dataset ---- */
for (const paper of papers) {
  const numbers = paper.questions.map((question) => question.n);
  if (new Set(numbers).size !== numbers.length) throw new Error(`${paper.id}: duplicate question numbers`);
  for (const question of paper.questions) {
    if (question.options.length !== 4) {
      question.optionsDetected = question.options.length;
    }
  }
}
for (const key of keys) {
  if (!key.hasPaper) continue;
  const paper = papers.find((entry) => entry.year === key.year);
  for (const question of paper.questions) {
    const answer = key.answers[question.n];
    if (!answer) throw new Error(`${paper.id} Q${question.n} has no key entry`);
    const letters = answer.split('').filter((letter) => 'ABCD'.includes(letter));
    if (letters.length > 1 && question.category !== 'II') {
      throw new Error(`${paper.id} Q${question.n} has a multi-option key but is Category ${question.category}`);
    }
    if (letters.length === 1 && question.category === 'II' && key.tier === 'official') {
      // A Category-II item may legitimately have exactly one correct option.
    }
  }
}

const outputs = [
  ['papers.json', { schema: 1, generatedFrom: 'archive/jelet-prep/data', papers }],
  ['keys.json', { schema: 1, keys }],
  ['syllabus.json', { schema: 1, syllabus }],
];

let changed = false;
for (const [name, payload] of outputs) {
  const text = `${JSON.stringify(payload, null, 2)}\n`;
  const target = join(outDir, name);
  let current = null;
  try { current = await readFile(target, 'utf8'); } catch { /* new file */ }
  if (current === text) continue;
  changed = true;
  if (checkOnly) {
    console.error(`[content] ${name} is out of date. Run: npm run build:content`);
    process.exitCode = 1;
  } else {
    await mkdir(outDir, { recursive: true });
    await writeFile(target, text);
    console.log(`[content] wrote src/data/${name}`);
  }
}
if (!changed && !checkOnly) console.log('[content] dataset already up to date');
