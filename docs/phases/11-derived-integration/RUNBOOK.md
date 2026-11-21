# 11 runbook · fail closed, display separately from scoring

Every task is pending. Application changes require a new implementation task, not this planning record.

| Task | Work | Acceptance evidence |
|---|---|---|
| 11.1 Source handoff | Bring only reviewed/approved editorial records and operative decisions into the current working branch through an authorised integration task; record revision and dispositions. | Exact file/item scope; rights reference; no accidental overwriting of newer local work |
| 11.2 Model and loader | Separate answer state, trust tier, hold reasons, source fidelity, stream and board-void authority. Correct disputed-to-awarded mapping. | Unit fixtures for every tier/state and rejection of unknown values |
| 11.3 Corpus reconciliation | Fix audited subject/option/stem defects in editorial inputs or generator logic; regenerate using established tooling. | Before/after per-item ledger; both-direction identity accounting; no invented options |
| 11.4 Read-only display | Add labelled provisional answer aids and visible unresolved reasons only for approved items. Keep answer reveal deliberate. | Reader/library/search/quiz/review show consistent labels; no grading or denominator change |
| 11.5 Optional scoring gate | Only if a separately approved verified subset exists: enable precisely those items. Address 2022 policy migration separately. | Per-item eligibility proof and recalculated totals; no target provisional item scores |
| 11.6 Regression and handoff | Test application consumers, offline packs and historical attempt preservation. | Test commands/results, changed counts, release candidate revision; no automatic deployment |

## Required regression matrix

- Provisional answer with a passing machine check: readable only if approved, still unscored.
- Disputed answer with complete options: held, never board-awarded.
- Unsolved/unknown tier: cannot enter scored pools; unknown schema fails validation.
- Verified but missing required source/figure/options or approval: held.
- Genuine board-voided fixture: requires publisher provenance and follows that paper's rules; never created from a derived dispute.
- Different stream sharing question numbers: cannot join to the wrong answer record.
- Missing/duplicate question identities and mismatched aggregates: fail validation.
- Held item: excluded consistently from score totals, timed mocks, drills and correctness-derived progress.
- Corrected answer/key revision: existing submitted attempt stays immutable.
- Offline stale data: old cache cannot combine a new question with an old answer or tier.

Use existing tests and [TESTING.md](../../TESTING.md); discover exact commands from the current package/configuration rather than assuming this plan names working scripts. Add focused regressions before changing the relevant loader. Record existing failures separately.

## Stop

No release if any consumer can score a weak tier, a derived dispute can receive board awards, the stream identity is ambiguous, the evidence disposition is incomplete, or rights are untraced. Hand the bounded candidate to Phase 12 rather than deploying from this phase.
