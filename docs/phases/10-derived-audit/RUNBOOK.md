# 10 runbook · audit before integration

All tasks below are planned, not complete. Use [TESTING](../../TESTING.md) and the [phase record template](../../templates/phase-record.md). Do not treat checklist presence as execution evidence.

| Task | Work | Acceptance evidence |
|---|---|---|
| 10.1 Pin and inventory | Record source SHA; enumerate keys, preflights, claims and repeated locations. Distinguish remote evidence from local files. | Exact record/claim inventory; missing files listed; start status |
| 10.2 Reconcile policy | Compare acceptance, schema, runbook and archive history. Resolve verification criteria, unsolved representation and display/scoring permission. | Dated decision or explicit blocker; never rewrite archive history |
| 10.3 Independent answer review | Re-derive each item before comparing its recorded answer; review every unsolved reason. Check source fidelity and obtain public corroboration where available. | 400 item rows; evidence references; confirmed/wrong/ambiguous/not-checkable verdicts; no invented letters |
| 10.4 Claim review | Review every factual assertion once and index repetitions. Re-test local audit findings against the pinned revision. | One verdict per unique claim; page-dependent unknowns not inferred from corpus |
| 10.5 Arithmetic and checks | Recount totals and inspect each script before any execution. Run only authorised, isolated checks without corpus writes or network effects. | Command, input, output and tolerances; failures preserved; counts agree with entries |
| 10.6 Disposition | Separate independently supported results from unresolved inputs and policy gaps. Specify corrections without silently changing evidence. | Coverage expected/reviewed/skipped with reasons; owner-facing release boundary; end status |

## Audit contract

- Reuse the preceding review's answer/claim/count verdict vocabulary; do not collapse “unverifiable” into “correct”.
- Every external citation must be fetched in that session and support the adjacent claim. Search with different wording before reporting no source found.
- Never download or re-render a question paper under this runbook. Missing source evidence remains a blocker, with one precise evidence request per item.
- Give source identity, section maps, marking rules, option fidelity and figure-dependent claims priority, but do not stop at a sample.
- Distinguish corpus-filter ceilings from verified booklet counts. Count unions, not sums that double-count figure/option holds.
- For reconciliation, define B as booklet item identities and C as corpus identities: |B|=|B∩C|+|B\C|; |C|=|B∩C|+|C\B|. Text equality is a separate field.
- Check that eligible items are a subset of policy-permitted tiers with explicit approval and sufficient source/presentation fidelity. Correct marginal totals are insufficient.
- Promotion is a separate authorised correction after audit, not an automatic consequence of agreement or passing code.

## Stops

Stop integration on incomplete coverage, unresolved identity, unsupported marking rules, schema/policy conflict, untraced rights, or missing source evidence for the proposed release subset. An audit can finish with unknowns; it cannot declare those unknowns safe to score.

## Copyable next task

> Execute Phase 10.1 and 10.2 only against source commit 6a14ac1d6b0e4ac0774ba1934b3e534244e5eaf9. Read SOURCE-REVIEW.md. Inventory all 400 records and all unique factual claims, compare operative decisions and schemas, and report policy conflicts. Do not switch branches, import keys, fetch/render papers, modify the archive, promote answers or change application behaviour. Finish with the inventory, unresolved decisions and a bounded plan for exhaustive review. Do not claim that this inventory completes the audit.
