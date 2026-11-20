/**
 * The optional-service gate.
 *
 * Phase 08 is three independent decisions — login and private sync, a live
 * AI tutor, and a Pharmacy track — and none of them is a feature bundle.
 * Each one gets its own brief, its own evidence, and its own go/no-go.
 *
 * This module holds the part that can be decided by evidence rather than by
 * opinion: **whether the deployment could host the service at all**, and
 * **what the free fallback actually does**.
 *
 * The site is a static build on GitHub Pages. There is no application
 * server, no runtime secret store, no database and no backend of any kind.
 * That single fact decides two of the three candidates, and this module
 * states it in code so the decision cannot quietly become wrong if the
 * deployment changes.
 *
 * Nothing here provisions anything. No account is created, no key is
 * embedded, no endpoint is called. The gate is a document that happens to be
 * executable.
 */

/**
 * What the deployment can host.
 *
 * These are read from the real project configuration rather than asserted,
 * so if the site ever becomes a server build the gate changes with it.
 */
export type Deployment = {
  /** The site's output mode. A static build has no request handler. */
  output: 'static' | 'server';
  /** Whether a request handler can hold a secret that never reaches a browser. */
  serverSideSecrets: boolean;
  /** Whether there is a place to keep a per-learner record that outlives a tab. */
  serverSideStorage: boolean;
  /** Whether there is a place to put a third-party API key. */
  serverSideProxy: boolean;
};

export type CandidateId = 'sync' | 'ai-tutor' | 'pharmacy';

export type Candidate = {
  id: CandidateId;
  title: string;
  /** The student problem this candidate would solve. */
  problem: string;
  /** What the site does today that already addresses it. */
  existingFreeWorkaround: string;
  /** What the candidate would need the deployment to be able to do. */
  requires: {
    serverSideSecrets: boolean;
    serverSideStorage: boolean;
    serverSideProxy: boolean;
  };
  /** The free fallback that stands in when the candidate is not built. */
  fallback: string;
  /** How the fallback is tested. */
  fallbackTest: string;
  /** The gate the candidate must pass, from the phase brief. */
  gate: string;
  /** What the decision is, and who made it. */
  decision: 'go' | 'no-go' | 'pending-owner';
  /** The reasoning behind the decision, in one paragraph. */
  reasoning: string;
  /** The most the owner could ever be liable for. */
  maximumOwnerLiability: string;
  /** What happens if the service is turned on and then has to be turned off. */
  shutdownProcedure: string;
  /** What is still unresolved. */
  unresolvedRisks: string[];
};

/**
 * Read the deployment shape from the project's own configuration.
 *
 * `astro.config.mjs` is the source of truth: if it says `output: 'static'`,
 * the site is static, and a static site cannot keep a secret.
 */
export function readDeployment(configText: string): Deployment {
  const staticOutput = /output:\s*['"]static['"]/.test(configText);
  const serverOutput = /output:\s*['"]server['"]/.test(configText);
  const isServer = serverOutput && !staticOutput;
  return {
    output: isServer ? 'server' : 'static',
    // A static build has no process that outlives a request.
    serverSideSecrets: isServer,
    serverSideStorage: isServer,
    serverSideProxy: isServer,
  };
}

/**
 * Can the deployment host this candidate?
 *
 * The answer is a property of the deployment, not of the candidate's merits.
 * A candidate that needs a server-side secret cannot run here, however good
 * it would be.
 */
export function canHost(deployment: Deployment, candidate: Candidate): {
  hostable: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  if (candidate.requires.serverSideSecrets && !deployment.serverSideSecrets) {
    missing.push('a server-side secret store');
  }
  if (candidate.requires.serverSideStorage && !deployment.serverSideStorage) {
    missing.push('server-side per-learner storage');
  }
  if (candidate.requires.serverSideProxy && !deployment.serverSideProxy) {
    missing.push('a server-side proxy to a third-party API');
  }
  return { hostable: missing.length === 0, missing };
}

/**
 * The candidates, with their decisions.
 *
 * Each decision is dated and reasoned. The reasoning is the evidence: it
 * names the provider terms, the caps, and the free fallback that stands in.
 */
export const candidates: Candidate[] = [
  {
    id: 'sync',
    title: 'Login and private sync',
    problem:
      'A learner who studies on a phone and a laptop has no way to move their attempts, review queue and notes between the two. Today the study record lives in one browser and a manual file is the only way across.',
    existingFreeWorkaround:
      'The workspace exports a JSON file of bookmarks, notes and resume points, and imports it with a preview and a merge-or-replace choice. Nothing is uploaded.',
    requires: {
      serverSideSecrets: true,
      serverSideStorage: true,
      serverSideProxy: false,
    },
    fallback:
      'The manual file, widened so it carries the whole study record — attempts, the review queue and the workspace — not just the workspace. A learner moves devices by exporting and importing one file they control.',
    fallbackTest:
      'tests/phase08.test.mjs checks that the full backup round-trips, that an import restores the attempts and the review queue, that a merge never overwrites a submitted result, and that an import of a foreign or oversized file changes nothing.',
    gate:
      'Provider supports ₹0 with hard limits; test account isolation, guest conflict merge, export and deletion, provider outage. Reject if billing exposure, required signup, unsafe records or lost guest history.',
    decision: 'no-go',
    reasoning:
      'The gate asks for a provider that supports ₹0 with hard limits. The cheapest credible provider does offer a ₹0 tier, but it is not compatible with this deployment: it pauses a project after a week of inactivity, has no automatic backups, and holds the learner\'s records on someone else\'s server. This site is a static build on GitHub Pages with no server, no database and no runtime secret store, so a sign-in flow cannot be hosted here without changing the deployment into something the privacy position does not allow. There is also no evidence of unmet need: no report, no request and no measurement says a learner cannot study today. The manual file already moves the record, and the decision is to make that file complete rather than to add a service.',
    maximumOwnerLiability:
      '₹0. Nothing is provisioned, so there is no bill, no card on file and no data held by a third party. The cost of this decision is that the fallback stays manual.',
    shutdownProcedure:
      'Not applicable — the service was never enabled. If it is ever enabled, the shutdown is: stop the sync client, delete the provider project, and tell every learner who had an account that their record is being deleted, with a final export window.',
    unresolvedRisks: [
      'The manual file is only as good as the learner\'s discipline. A learner who loses the phone without exporting loses the record.',
      'There is no measurement of how many learners actually need two devices. This decision rests on the absence of evidence, not on evidence of absence.',
      'The free tier of every candidate provider pauses after inactivity. A sync service built on one would not be reliably available on the day a learner needs it.',
    ],
  },
  {
    id: 'ai-tutor',
    title: 'Live AI tutor',
    problem:
      'A learner stuck on a question gets no help beyond the worked example in the lesson and the answer key. A live tutor would ask for a hint without giving the answer.',
    existingFreeWorkaround:
      'The lessons carry guided hints and worked examples, the library reader shows the reasoning, and the review queue resurfaces the questions a learner got wrong.',
    requires: {
      serverSideSecrets: true,
      serverSideStorage: false,
      serverSideProxy: true,
    },
    fallback:
      'Reviewed hints only. The lesson\'s hint ladder and the reasoned review stay the answer, and no model is called. The learner may copy the question into any tool they already have an account with; the site sends nothing.',
    fallbackTest:
      'tests/phase08.test.mjs checks that no built file contains an API key, a model endpoint or a fetch to a third-party origin, and that the offline pack path works with the network off.',
    gate:
      'Reviewed hints insufficient; secret stays server-side, consent and minimal context, no personal notes, opt-out, limits and strict ₹0 ceiling. Reject if it requires paid usage, invents authority, changes grading or interrupts guest study.',
    decision: 'no-go',
    reasoning:
      'The provider\'s own terms exclude this use outright, before any question of price. The Gemini API Additional Terms of Service (effective 2026-03-23) say the services may not be used to build a website or application "likely to be accessed by individuals under the age of 18". JELET is an entrance examination for school-leaving students, many of them under 18, so the provider\'s terms rule this out at every tier, including the free one. The gate also requires the secret to stay server-side. This site is a static build: every file it serves is public, including its JavaScript. A model key placed in a static bundle is a key in every visitor\'s browser, where it can be read, copied and used against the owner\'s quota. There is no server here to hold it, and adding one changes the privacy position the site is built on. The gate also requires a strict ₹0 ceiling with a hard stop; the free tier\'s request cap is shown per project in a console rather than published, and the provider states its limits "are not guaranteed and actual capacity may vary", while the paid tier that would fix that requires a billing account the gate forbids. The free tier reads what is submitted to it — the terms say human reviewers may read the input and output and tell you not to send personal information — while the gate requires minimal context and no personal notes. Finally, the gate\'s first condition is unmet: the hint ladder, the worked examples and the reasoned review have never been shown to be insufficient, and there is no measurement either way.',
    maximumOwnerLiability:
      '₹0, and no key exists to leak. The exposure of a static build with an embedded key would be unbounded and unbillable, which is the strongest argument against the decision rather than a cost.',
    shutdownProcedure:
      'Not applicable — no key was created and no endpoint was called. If it is ever enabled, the shutdown is: remove the key from the provider, revoke it, then remove the code path, and publish that any hint shown while it was live may be wrong.',
    unresolvedRisks: [
      'The gate\'s first condition is unmet rather than refuted. If a measurement later shows the reviewed hints are insufficient, this decision should be revisited.',
      'A learner may still use a model they pay for themselves. The site cannot prevent that and does not try to.',
      'No learner-facing copy has been tested against a model\'s typical output, so the "invents authority" risk is unmeasured.',
    ],
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy (JELET Paper II)',
    problem:
      'A learner sitting JELET Paper II has no preparation material from this site, because the site holds Paper I only.',
    existingFreeWorkaround:
      'None. The site makes no Paper II content at all.',
    requires: {
      serverSideSecrets: false,
      serverSideStorage: false,
      serverSideProxy: false,
    },
    fallback:
      'The official Paper II syllabus and the board\'s own papers. The site can point at them without holding them, and it already publishes its provenance rules for Paper I.',
    fallbackTest:
      'tests/phase08.test.mjs checks that no Paper II content, key or rule has entered the corpus, and that the Paper I rules have not been reused or rebranded for a second paper.',
    gate:
      'Separate owner scope, syllabus, rights-cleared papers and keys, and its own rules. Reject if it would reuse Paper I rules or imply unverified coverage.',
    decision: 'pending-owner',
    reasoning:
      'This decision needs material this repository does not have: the Paper II syllabus, the booklets, the rights to reproduce them, and the edition rules that say how Paper II is marked. None of it is present, and none of it can be derived from the Paper I corpus. The gate is explicit that Paper I rules must not be reused, and the Paper I rules are specific: Category I and Category II with their exact rational scoring, the booklet mapping, the held-item rule and the five board awards. Applying them to Paper II would be wrong in a way that looks right, which is exactly what the gate forbids. The decision is therefore left with the owner rather than taken here.',
    maximumOwnerLiability:
      '₹0 while the decision is pending, because nothing is published and nothing is promised. Publishing Paper II content without rights-cleared sources is the liability the gate is guarding against.',
    shutdownProcedure:
      'Not applicable — nothing is published. If it is ever published, the shutdown is: unlist the Paper II routes, remove the content from the build, and publish a dated correction saying what was withdrawn and why.',
    unresolvedRisks: [
      'The Paper II syllabus, the booklets and the rights are all owner-held and have not been requested.',
      'The scope of the owner\'s interest in Paper II is unknown, so this brief may be answered with a clear no.',
      'The risk of a Paper II request being answered by rebranding Paper I is real, and the corpus checks in this phase exist to catch it.',
    ],
  },
];

/** The candidate with this id. */
export function candidateById(id: CandidateId): Candidate {
  const found = candidates.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`No such candidate: ${id}`);
  return found;
}

/**
 * The whole phase at a glance.
 *
 * Every candidate has a decision, a dated brief, a fallback and a test.
 */
export type PhaseSummary = {
  candidates: number;
  go: number;
  'no-go': number;
  'pending-owner': number;
  /** Every candidate that has a fallback and a fallback test. */
  allHaveFallbacks: boolean;
  /** Every candidate that names its maximum owner liability. */
  allHaveLiability: boolean;
  /** Every candidate that names a shutdown procedure. */
  allHaveShutdown: boolean;
};

export function phaseSummary(): PhaseSummary {
  return {
    candidates: candidates.length,
    go: candidates.filter((candidate) => candidate.decision === 'go').length,
    'no-go': candidates.filter((candidate) => candidate.decision === 'no-go').length,
    'pending-owner': candidates.filter((candidate) => candidate.decision === 'pending-owner').length,
    allHaveFallbacks: candidates.every((candidate) => candidate.fallback.length > 0 && candidate.fallbackTest.length > 0),
    allHaveLiability: candidates.every((candidate) => candidate.maximumOwnerLiability.length > 0),
    allHaveShutdown: candidates.every((candidate) => candidate.shutdownProcedure.length > 0),
  };
}
