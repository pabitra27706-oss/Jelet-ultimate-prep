# 12 runbook · release only the checked boundary

All tasks are pending. Deployment needs explicit owner authorisation after the evidence is presented.

| Task | Work | Acceptance evidence |
|---|---|---|
| 12.1 Freeze candidate | Pin candidate revision and item/mode manifest; document rights and scoring/display approvals. | No implied approval of unreviewed items; known holds listed |
| 12.2 Automated release checks | Run current build/tests, content validation and pack checks. Test candidate under its deployment base path. | Exact commands and outputs; failures block release |
| 12.3 Browser checks | Check mobile width, 200% zoom, keyboard/focus, screen-reader labels, maths, answer reveal and hold explanations. | Device/browser, steps, expected/actual; record untested cases |
| 12.4 Physical Android/offline | Install/update packs; open approved paper without network; check labels, figures, holds, cache version consistency, removal and reconnect. | ANDROID CHECK NEEDED until owner supplies actual device evidence; never substitute desktop emulation |
| 12.5 Exercise correction route | Use an explicitly synthetic report to test item/revision tracing, dispute/hold, correction notice, future totals and preservation of old attempts. | Evidence of the workflow; no invented real user report or production answer change |
| 12.6 Approve and release | Present manifest, remaining unknowns, rollback and test record. Deploy only after owner authorisation. | Published revision and actual release result, not a plan described as shipped |
| 12.7 Practice follow-up | Review owner reports against evidence; correct through authorised records; update status truthfully. | Dated correction log or explicit report of no observations, never inferred success |

## Rollback contract

Before release, name the prior known-good revision and compatible offline-pack versions. If a wrong answer, missing provenance, weak-tier scoring or mixed cache version appears, disable the affected new aid/scored subset and follow the established release procedure. Do not delete learner data or rewrite attempts. Verify rollback using the same affected journeys.

## Handoff record

Record: source and release revisions; years/streams/items; provisional/verified/held counts; approved modes; rights decision; automated/browser/Android results; unresolved evidence; correction-route result; rollback target; owner release decision. Keep private notes out of the published log.

A failed or unavailable physical check remains pending. A read-only release does not complete Phase 09's source-based verification, and this phase cannot remove that blocker by changing a status label.
