# Phase 08 · three separate decisions, not a feature bundle

**Date:** 2026-11-19
**Branch:** `arena/1e582bac-jelet-ultimate-prep`
**Status:** two decisions taken (no-go), one left with the owner (pending).
**Nothing was provisioned.** No account was created, no key was embedded, no
endpoint was called, no vendor commitment was made.

The phase brief is explicit: *"Not needed" is a successful decision*, and
*"No deployment, signup or vendor commitment belongs in the feasibility
report."* This document is the feasibility report. It contains three
decisions, each with its own evidence, and each is independent of the other
two.

---

## The fact that decides two of them

**This site is a static build on GitHub Pages.** `astro.config.mjs` declares
`output: 'static'`. There is no application server, no database, no runtime
secret store and no backend of any kind. Every file the site serves is
public, including its JavaScript.

This is not an argument against the candidates. It is a statement of what
the deployment can host, and it is checked in code rather than asserted:
`src/lib/optional-services.ts` reads `astro.config.mjs` and derives the
deployment shape from it. If the site ever becomes a server build, the gate
changes with it and `tests/phase08.test.mjs` fails until the decisions are
revisited.

---

## Decision 1 · Login and private sync

**Decision: NO-GO** · 2026-11-19

### The problem

A learner who studies on a phone and a laptop cannot move their attempts,
their review queue and their notes between the two. The study record lives
in one browser.

### Evidence of need

**None.** There is no report, no request, no issue and no measurement saying
a learner cannot study today. The gate's entry condition is *"explicit owner
decision and evidence of unmet need"*, and the need is not evidenced. This
decision rests on the absence of evidence, not on evidence of absence, and
that is stated as a risk below.

### The existing free workaround

The workspace exports a JSON file of bookmarks, notes and resume points, and
imports it with a preview and a merge-or-replace choice. Nothing is
uploaded.

### The gate

> Provider supports ₹0 with hard limits; test account isolation, guest
> conflict merge, export and deletion, provider outage. Reject if billing
> exposure, required signup, unsafe records or lost guest history.

### What the provider terms actually say

Checked against the provider's own pricing page on 2026-11-19:

| Limit | Free tier | What it means here |
|---|---|---|
| Active projects | 2 | Enough for a pilot. |
| Database | 500 MB per project | Ample for text records. |
| Egress | 5 GB | Ample. |
| Monthly active users | 50,000 | Ample. |
| **Inactivity** | **Project paused after 1 week of inactivity** | **A study site is used in bursts. A project that pauses when a learner is revising for a week is not reliably available when it is needed.** |
| **Automatic backups** | **None** | **The provider holds the only copy of a learner's record, with no backup of its own.** |
| Log retention | 1 day | Incident history is gone within a day. |

Pro is $25/month. A paid tier, a card on file, or a budget alert without a
hard stop all fail the project's rule, so the free tier is the only
admissible one — and the free tier pauses.

### Why no-go

1. **The deployment cannot host it.** A sign-in flow needs a place to hold a
   session and a place to keep a per-learner record. `canHost()` reports
   both as missing for this deployment. Adding a backend is not a small
   change; it changes the privacy position the whole site is built on.
2. **The free tier is unreliable for this use.** The provider pauses a
   project after a week of inactivity, and keeps no backups of the only copy
   of a learner's record.
3. **The need is not evidenced.** The gate requires it, and it is absent.

### The fallback, and what it now does

**The manual file, widened so it carries the whole study record.**

Before this phase the workspace file carried only bookmarks, notes and
resume points. The attempts and the review queue lived in separate storage
and were left behind, which made the fallback thinner than the gate
requires. `src/lib/backup.ts` now produces one file carrying the workspace,
every attempt with its responses and results, and the review queue with its
Leitner boxes and due dates.

The rules the import follows are the same ones the app already follows:

- **A submitted result is final.** Importing never rewrites a submitted
  attempt, and never replaces a submitted attempt with an unsubmitted one.
- **A merge is safe by default.** It adds to what is on the device, never
  overwrites a local item, and never sends a learner back down the review
  ladder.
- **Nothing is written until the file validates.** A file that is too large,
  from another app, of an unknown version or of the wrong shape changes
  nothing at all.
- **The learner sees a preview** of what the file holds and what the device
  holds, and chooses merge or replace.

### Maximum owner liability

**₹0.** Nothing is provisioned, so there is no bill, no card on file and no
record held by a third party. The cost of this decision is that the fallback
stays manual.

### Shutdown procedure

Not applicable — the service was never enabled. If it is ever enabled: stop
the sync client, delete the provider project, and tell every learner with an
account that their record is being deleted, with a final export window.

### Unresolved risks

- The manual file is only as good as the learner's discipline. A learner who
  loses the phone without exporting loses the record.
- There is no measurement of how many learners need two devices. The
  decision rests on the absence of evidence.
- Every candidate provider's free tier pauses after inactivity. A sync
  service built on one would not be reliably available on the day a learner
  needs it.

---

## Decision 2 · Live AI tutor

**Decision: NO-GO** · 2026-11-19

### The problem

A learner stuck on a question gets no help beyond the worked example in the
lesson and the answer key. A live tutor would ask for a hint without giving
the answer.

### Evidence of need

**Unmet, not refuted.** The gate's first condition is that reviewed hints
are insufficient. The site has a hint ladder, worked examples and a reasoned
review. Nothing has measured whether that is enough, in either direction.
The decision is taken because the gate is not *met*, not because the
opposite was proven — and that distinction is recorded as a risk.

### The existing free workaround

The lessons carry guided hints and worked examples, the library reader shows
the reasoning, and the review queue resurfaces the questions a learner got
wrong.

### The gate

> Reviewed hints insufficient; secret stays server-side, consent and minimal
> context, no personal notes, opt-out, limits and strict ₹0 ceiling. Reject
> if it requires paid usage, invents authority, changes grading or interrupts
> guest study.

### What the provider terms actually say

Checked 2026-11-19:

| Limit | What the provider's own pages say | What it means here |
|---|---|---|
| Request cap | "View your active rate limits in AI Studio." The limits are per project, and Google publishes no free-tier figure. | The gate requires a **strict ₹0 ceiling with a hard stop**. A cap that is neither published nor fixed is not a ceiling the owner can rely on. |
| Guarantees | "Specified rate limits are not guaranteed and actual capacity may vary." | A guarantee the provider disclaims is not a guarantee. |
| Grounding | 1,500 requests per day per project for Google Search grounding, on Gemini 3 and newer | A published number, but for one feature and one model family, and still not a ceiling for the whole service. |
| Spend limit | Tier 1 carries a $10 spend rate limit per 10 minutes. **Tier 1 requires "Set up and link an active billing account."** | The gate rejects a required billing card. The paid tier is therefore inadmissible, and the free tier is the only option. |
| Model availability | Pro models were removed from the free tier in 2026 | The free surface changes without notice. |
| Free-tier data | "When you use Unpaid Services… Google uses the content you submit to the Services and any generated responses to provide, improve, and develop Google products… **Do not submit sensitive, confidential, or personal information to the Unpaid Services.**" Human reviewers "may read, annotate, and process your API input and output." | The gate requires minimal context and no personal notes. The free tier's own terms tell you not to send personal information and confirm that people read it. This is the sharpest contradiction. |
| Age | "You must be 18 years of age or older… You also will not use the Services as part of a website, application, or other service… that is directed towards or is likely to be accessed by individuals under the age of 18." | **JELET is an entrance examination taken by school-leaving students, many of them under 18.** This use is excluded by the provider's terms outright, whatever the pricing. |
| Paid-tier data | Paid Services: "Google doesn't use your prompts… or responses to improve our products" | The privacy improvement only exists on the tier that requires a billing card. |

Source: the provider's rate-limits page and its Gemini API Additional Terms
of Service (effective 2026-03-23), both checked 2026-11-19.

### Why no-go

1. **The provider's terms exclude this use outright.** The API may not be
   used to build a service "likely to be accessed by individuals under the
   age of 18". JELET is an entrance examination for school-leaving students.
   This is not a pricing problem that a free tier solves; it is a use the
   provider does not permit, and no tier makes it permitted.
2. **The secret cannot stay server-side.** The gate requires it. This site
   is a static build: every file it serves is public. A model key in a
   static bundle is a key in every visitor's browser, where it can be read,
   copied and used against the owner's quota. There is no server here to hold
   it.
3. **The ₹0 ceiling cannot be guaranteed.** The gate requires a strict
   ceiling with a hard stop. The free tier's request cap is shown per
   project in a console rather than published, and the provider states its
   limits "are not guaranteed and actual capacity may vary". The paid tier
   that would fix both requires a billing account, which the gate forbids.
4. **The first condition is unmet.** There is no measurement showing the
   reviewed hints are insufficient.
5. **The free tier reads the learner's questions.** The provider's own terms
   say human reviewers may read the submitted content and tell you not to
   send personal information. The gate requires minimal context and no
   personal notes. The free tier does the opposite; the paid tier, which
   does not, needs a billing card.

### The fallback, and what it now does

**Reviewed hints only.** The lesson's hint ladder and the reasoned review
remain the answer, and no model is called. A learner may copy a question
into any tool they already have an account with; the site sends nothing.

### Maximum owner liability

**₹0, and no key exists to leak.** The exposure of a static build with an
embedded key would be unbounded and unbillable, which is the strongest
argument against the decision rather than a cost.

### Shutdown procedure

Not applicable — no key was created and no endpoint was called. If it is
ever enabled: remove the key from the provider, revoke it, remove the code
path, and publish that any hint shown while it was live may be wrong.

### Unresolved risks

- The gate's first condition is unmet rather than refuted. A measurement
  showing the reviewed hints are insufficient should reopen this.
- A learner may still use a model they pay for themselves. The site cannot
  prevent that and does not try to.
- No learner-facing copy has been tested against a model's typical output,
  so the "invents authority" risk is unmeasured.

---

## Decision 3 · Pharmacy (JELET Paper II)

**Decision: PENDING OWNER** · 2026-11-19

### The problem

A learner sitting JELET Paper II has no preparation material from this site,
because the site holds Paper I only.

### Evidence of need

**Not assessed.** The gate's entry condition is *"explicit owner decision
and evidence of unmet need"*. The owner's interest in Paper II is unknown.

### The existing free workaround

None. The site makes no Paper II content at all.

### The gate

> Separate owner scope, syllabus, rights-cleared papers and keys, and its
> own rules. Reject if it would reuse Paper I rules or imply unverified
> coverage.

### What is missing

Every input the gate names is owner-held and absent from this repository:

| Required | Present? |
|---|---|
| The Paper II syllabus | No |
| The Paper II booklets | No |
| The rights to reproduce them | No |
| The edition rules for Paper II | No |

None of it can be derived from the Paper I corpus.

### Why pending rather than no-go

The Paper I rules are specific: Category I and Category II with their exact
rational scoring, the booklet mapping, the held-item rule and the five board
awards. Applying them to Paper II would be **wrong in a way that looks
right**, which is exactly what the gate forbids. But that is an argument
against doing it *blindly*, not an argument that it should never be done.

So the decision is left with the owner, with the material list attached.

### The fallback, and what it now does

**The official Paper II syllabus and the board's own papers.** The site can
point at them without holding them, and it already publishes its provenance
rules for Paper I.

### Maximum owner liability

**₹0 while the decision is pending**, because nothing is published and
nothing is promised. Publishing Paper II content without rights-cleared
sources is the liability the gate guards against.

### Shutdown procedure

Not applicable — nothing is published. If it is ever published: unlist the
Paper II routes, remove the content from the build, and publish a dated
correction saying what was withdrawn and why.

### Unresolved risks

- The Paper II syllabus, the booklets and the rights have not been requested.
- The scope of the owner's interest is unknown; this brief may be answered
  with a clear no.
- The risk of a Paper II request being answered by rebranding Paper I is
  real. `tests/phase08.test.mjs` checks that no Paper II or Pharmacy
  content has entered the corpus, that every paper in the corpus is a
  Paper I, and that the read-only papers are still read-only and unscored.

---

## What was built, and what was not

**Built** — the fallbacks, so that the two no-go decisions actually hold:

- `src/lib/backup.ts` — the full study-record backup: workspace, attempts
  and review queue in one file, with the merge rules the app already
  follows, a validation gate, and an import preview.
- The workspace page's "Your whole study record" panel, which exports the
  record and imports it with a preview and a merge-or-replace choice.
- `src/lib/optional-services.ts` — the candidates, their gates, their
  decisions, and the deployment gate that reads the project's own
  configuration.

**Not built, deliberately** — anything that would have provisioned something:
no account, no API key, no server, no database, no third-party endpoint, no
Paper II content, and no signup.

## Verification

| Check | Result |
|---|---|
| `npm run check` | 67 files, 0 errors, 0 warnings, 0 hints |
| `npm run build` | 42 pages |
| `npm run test:rules` | 19 / 19 |
| `npm run test:phase05` | 27 / 27 |
| `npm run test:phase06` | 12 / 12 |
| `npm run test:phase07` | 22 / 22 |
| `npm run test:phase08` | 22 / 22 |
| `npm run test:browser` | 39 / 39 |
| **Total** | **141 / 141** |

The Phase 08 suite checks that each candidate has a decision, a gate, a
fallback, a fallback test, a ₹0 liability and a shutdown procedure; that
the deployment shape is read from `astro.config.mjs` rather than assumed;
that a candidate needing a server is correctly reported as unhostable; that
a backup round-trips and never overwrites a submitted result; that no built
file carries a key, a model endpoint or an unexpected origin; and that no
Paper II content has entered the corpus.

The browser suite checks that the record exports from a real submitted
attempt and imports back with the submission time and results unchanged,
that a foreign file writes nothing at all, and that the workspace explains
the no-account position.
