# Reusable whole-phase prompt

From Android, copy this block. Change the phase for a later run. **One start instruction covers the entire named phase.** No task number required.

```text
Start phase 03R-design-recovery. Mode: IMPLEMENT, from the phase brief through verification. Resume if partially complete.

Read AGENTS.md, docs/ROADMAP.md, this phase's README, RUNBOOK and latest evidence. Reconcile the checklist with the actual branch and earlier owner decisions. Work through every eligible task in order; checkpoints are notes, not permission requests. Do not stop after x.1, a passing test, or writing a plan. Continue in this session without asking me to say “next”. Earlier dated task-by-task handoffs are history, not current instructions.

If one item is blocked, log its exact dependency, take the safe fallback and continue independent tasks in this phase. When a genuine owner decision is the only way forward, ask once with the evidence, alternatives, recommendation, and consequences. Preserve completed work; resume from that gate when answered. At phase completion summarize outcomes and remaining limitations; don't silently begin another phase.

Use AI extensively for exploration, illustration, source comparisons, audits, implementation and tests. Treat generated media as concept art, never an official diagram or proof. Guest study must still cost ₹0 to operate. Never treat “start” as permission to deploy, merge, delete, publish uncleared content, enable billing, or disclose private data. Run all feasible tests per docs/TESTING.md. Ask for ANDROID CHECK NEEDED only for residual physical evidence; keep doing other work meanwhile.

Maintain one dated phase record with completed, pending and blocked tasks, artifacts and actual checks. At handoff give the smallest decision needed or a phase summary, not another subtask prompt. If interrupted by a session limit, record the next unchecked step so “resume phase” needs no further planning.
```

**Other modes:** `RESEARCH` runs the whole research scope without application edits; `PLAN` produces the whole phase's design/specification, not a deployment; `VERIFY` checks already-built outputs and records gaps. An explicitly requested single-task review stays narrow. Never widen a docs-only request into an implementation run.
