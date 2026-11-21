# 10 · Independent derived-answer audit and policy reconciliation

**Status · 2026-11-20:** structural inventory recorded for all 400 items; validator safety hardening implemented and tested. Atomic claim inventory and answer audit remain incomplete. See [EVIDENCE.md](EVIDENCE.md), [INVENTORY.json](INVENTORY.json) and the interim [SAFETY-PROFILE.md](SAFETY-PROFILE.md). This does not certify phase 09.
**Entry:** identify a fixed phase-09 revision and inventory its actual records.
**Exit:** every answer record and factual claim has a verdict, reproducible evidence and a disposition; unknowns remain explicit holds. No silent skips.

## Why this phase exists

The local phase-09 design is older than the linked working branch. The earlier chat audit reviewed this local design only and explicitly failed exhaustive coverage. It is not an audit of the later 400 records. See [SOURCE-REVIEW.md](SOURCE-REVIEW.md) for the pinned external revision and independently recounted structural totals.

This phase is verification, not another solver pass that defends its own answers. A same-solver second pass does not establish independence. A passing computation cannot authenticate a transcribed stem or an option letter.

## Scope and boundaries

- Audit all 400 records, including the 79 unsolved records and every reason for withholding an answer.
- Audit every unique factual claim in pre-flights, schema examples, year packages, decisions, open doubts and crosscheck records; record every repeat location.
- Recompute totals from records, not from summaries. Separately count answer state, trust tier, presentation completeness and scoring eligibility.
- Reconcile schema and policy conflicts before any loader or UI relies on them.
- Do not fetch, parse, OCR, render or reconstruct question papers in this task. Use already-preserved evidence; if insufficient, report the precise missing evidence. A future evidence-acquisition task needs separate scope and rights review.
- Do not import keys into the application, alter scoring, promote tiers, or overwrite historical archive files.

## Required policy reconciliation

The linked acceptance record describes verification as machine verification **or** independent solver agreement, while its own schema/runbook requires a stronger combination including source-image evidence. The linked schema amendment 1.1.0 explicitly permits `unsolved` as a tier and held text-only records; the older local schema does not reflect this amendment. Do not misreport that authorised exception as absent.

The interim safety profile implements the stricter rule without rewriting the original acceptance record. Permanent promotion-policy reconciliation, display fidelity and per-paper scoring approval remain separate work. Provisional, disputed, unsolved and source-unverified items remain unscored. No local null reference proves a board key never existed.

## Deliverables when executed

A revision-pinned audit ledger, claim occurrence index, arithmetic report, correction proposals, unresolved-evidence register and owner disposition. Keep the audit in chat if its execution request requires chat-only output; otherwise use a dated phase record. This planning authorisation is not authorisation to rewrite source evidence.

**Next:** [RUNBOOK.md](RUNBOOK.md). Phase 11 depends on an explicit, bounded disposition from this phase; full scoring is not required for a safe read-only release.
