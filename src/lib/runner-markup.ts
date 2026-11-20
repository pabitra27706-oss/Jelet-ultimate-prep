/**
 * The runner's own markup.
 *
 * The foot of a question pane and the note that explains a board-voided
 * question are the same in a full-paper rehearsal and in a composed mock.
 * They live here so the server-rendered page and the browser-built mock
 * cannot drift apart.
 *
 * Nothing in this module imports the corpus, so the browser can use it.
 */

/** Everything the runner needs to know about one item of a set. */
export type PaneMeta = {
  /** The corpus question id. It is unique across the whole corpus. */
  id: string;
  /** The number the learner sees on this item. */
  number: number;
  /** The position of this item in the set, counting from one. */
  position: number;
  /** How many items the set holds. */
  total: number;
  /** Which category the board set it in. */
  category: 'I' | 'II';
  /** What it is worth. */
  marks: number;
  /** The subject's name, as the paper writes it. */
  subject: string;
  /** The subject's key. */
  subjectKey: string;
  /** True when the board voided it and awarded the marks to everyone. */
  voided: boolean;
  /** The paper it came from. */
  sourcePaper: string;
  /** The year of that paper. */
  sourceYear: number;
  /** The number it has in that paper. */
  sourceN: number;
};

/**
 * The attributes of a question pane.
 *
 * The runner reads the category, the marks, the subject and the disposition
 * from these, and the review queue uses the source to link back to the paper
 * the question actually came from. A composed mock draws from several papers,
 * so the source is recorded per question.
 *
 * The same object is used by the server-rendered pane and by the pane the
 * browser builds for a mock, so the runner never has to guess.
 */
export function paneAttributes(meta: PaneMeta): Record<string, string> {
  return {
    'data-question': meta.id,
    'data-n': String(meta.number),
    'data-position': String(meta.position),
    'data-category': meta.category,
    'data-marks': String(meta.marks),
    'data-subject': meta.subject,
    'data-subject-key': meta.subjectKey,
    'data-voided': meta.voided ? 'true' : 'false',
    'data-source-paper': meta.sourcePaper,
    'data-source-year': String(meta.sourceYear),
    'data-source-n': String(meta.sourceN),
  };
}

/**
 * The foot of a question pane: previous, the position, next.
 *
 * `position` is one-based; the learner sees one-based numbers.
 */
export function runnerFooterHtml(position: number, total: number): string {
  const previous = position <= 1 ? ' disabled' : '';
  const next = position >= total ? ' disabled' : '';
  return [
    '<div class="runner-foot no-print">',
    `<button class="btn small ghost" type="button" data-jump="prev"${previous}>← Previous</button>`,
    `<span class="micro" data-pane-counter>Question ${position} of ${total}</span>`,
    `<button class="btn small" type="button" data-jump="next"${next}>Next →</button>`,
    '</div>',
  ].join('');
}

/**
 * The note that explains a question the board voided.
 *
 * The board published "W" for these, so no option was keyed and the marks
 * go to every candidate. The learner is not asked to answer them.
 */
export function voidNoticeHtml(marks: number): string {
  return [
    '<p class="notice notice-void" data-void-notice>',
    'The board voided this question in its final answer-key notice: no option was keyed, so the ',
    `${marks} mark${marks === 1 ? ' goes' : 's go'} to every candidate. You do not need to answer it.`,
    '</p>',
  ].join('');
}

/**
 * A chip that says where a question came from.
 *
 * A composed mock draws from several previous-year papers, so the learner is
 * told which paper each question belongs to. A full paper has only one
 * source, so it does not need the chip.
 */
export function sourceChipHtml(year: number, n: number): string {
  return `<span class="chip source" data-source-chip>${year} · Q${n}</span>`;
}
