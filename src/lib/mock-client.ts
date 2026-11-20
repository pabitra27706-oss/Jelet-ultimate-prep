/**
 * The browser side of a composed mock.
 *
 * The builder and the mock itself both need the same three things: the pool
 * of questions a mock may draw, the composition of those questions into a
 * paper, and the panes the runner sits. They live here so the plan the
 * learner reads in the builder is the paper they are then given.
 *
 * Nothing here imports the corpus. The pool arrives as a published file.
 */
import { composeMock, type MockCandidate, type MockComposition, type MockSpec } from './mock.ts';
import { paneAttributes, runnerFooterHtml, sourceChipHtml, voidNoticeHtml, type PaneMeta } from './runner-markup.ts';

/** One question the mock may draw, with its rendered body. */
export type PoolItem = MockCandidate & { html: string };

/** The published pool of one subject. */
export type PoolFile = { schema: number; subject: string; items: PoolItem[] };

/**
 * Fetch the pool of one subject.
 *
 * The pool is published per subject, so a mock that only asks for physics
 * never downloads the mathematics.
 */
export async function fetchPool(base: string, subjectKey: string): Promise<PoolItem[]> {
  const response = await fetch(`${base}data/mock-pool/${subjectKey}.json`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`The ${subjectKey} pool could not be loaded (${response.status}).`);
  const data = (await response.json()) as PoolFile;
  return data.items ?? [];
}

/** Fetch every pool a specification needs. */
export async function fetchPools(base: string, subjects: readonly string[]): Promise<PoolItem[]> {
  const pools = await Promise.all(subjects.map((subject) => fetchPool(base, subject)));
  return pools.flat();
}

/**
 * Compose a specification into a paper.
 *
 * The same function the builder uses for its plan, so the plan is not an
 * estimate: it is the paper.
 */
export function composeFromPool(spec: MockSpec, pool: readonly PoolItem[], answeredIds: readonly string[] = []): MockComposition {
  return composeMock(spec, pool, spec.avoidSeen ? answeredIds : []);
}

/**
 * Build the pane of one item.
 *
 * The question itself was rendered on the server by the same component that
 * renders a paper, so the maths is typeset the way it is everywhere else.
 * The pane around it is built here, from the shared attributes, so the
 * runner reads the same thing whether the set is a paper or a mock.
 */
export function buildPane(item: PoolItem, position: number, total: number): HTMLElement {
  const meta: PaneMeta = {
    id: item.id,
    number: position,
    position,
    total,
    category: item.category,
    marks: item.marks,
    subject: item.subject,
    subjectKey: item.subjectKey,
    voided: item.voided,
    sourcePaper: item.paperId,
    sourceYear: item.year,
    sourceN: item.n,
  };
  const pane = document.createElement('div');
  pane.className = 'pane';
  for (const [key, value] of Object.entries(paneAttributes(meta))) pane.setAttribute(key, value);
  pane.innerHTML = item.html;

  // The rendered question carries the number it has in its own paper. A
  // composed mock numbers its own questions from one, so the learner reads
  // the same numbering as the paper they are given.
  const heading = pane.querySelector('.qnum');
  if (heading) heading.textContent = `Q${position}`;

  // A composed mock draws from several papers, so the learner is told which
  // paper each question came from.
  const head = pane.querySelector('.qhead');
  if (head) head.insertAdjacentHTML('beforeend', sourceChipHtml(item.year, item.n));

  if (item.voided) pane.insertAdjacentHTML('beforeend', voidNoticeHtml(item.marks));
  pane.insertAdjacentHTML('beforeend', runnerFooterHtml(position, total));
  return pane;
}

/** Build the navigator's button for one item. */
export function buildNavButton(item: PoolItem, position: number): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.nav = item.id;
  button.dataset.state = 'unanswered';
  button.textContent = String(position);
  return button;
}

/**
 * Put a composed paper on the page.
 *
 * The panes go into the runner's paper slot and the navigator's buttons go
 * into the navigator, in the order the composition decided.
 */
export function renderComposition(root: HTMLElement, composition: MockComposition, pool: readonly PoolItem[]): void {
  const paperNode = root.querySelector<HTMLElement>('[data-runner-paper]');
  const navigatorNode = root.querySelector<HTMLElement>('[data-runner-nav]');
  if (!paperNode || !navigatorNode) return;
  const byId = new Map(pool.map((item) => [item.id, item]));
  const fragment = document.createDocumentFragment();
  const buttons = document.createDocumentFragment();
  composition.items.forEach((candidate, index) => {
    const item = byId.get(candidate.id);
    if (!item) return;
    fragment.append(buildPane(item, index + 1, composition.items.length));
    buttons.append(buildNavButton(item, index + 1));
  });
  paperNode.replaceChildren(fragment);
  navigatorNode.replaceChildren(buttons);
}
