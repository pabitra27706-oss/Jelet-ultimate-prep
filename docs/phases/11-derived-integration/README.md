# 11 · Safe derived-answer display and integration

**Status · 2026-11-20:** planned, not implemented or authorised for release.
**Entry:** Phase 10 disposition, reconciled policy/schema, exact source revision and an explicit owner-approved release scope. Trace the separate rights decision before reproducing content.
**Exit:** the approved subset is displayed with truthful provenance; no weak-tier item can score or receive board-awarded marks; automated and manual checks cover every consumer.

## Two independent delivery paths

### A — provisional answer aid, never scored

The linked phase-09 acceptance record permits labelled provisional display. After audit disposition and rights review, an owner may approve a bounded display release without waiting for verified scoring. Do not portray all provisional answers as correct. Confirmed-wrong answers must be corrected through an authorised evidence record or withheld; unresolved claims stay visible as uncertainty, not an answer letter guessed by the UI.

Use “Provisional — not independently verified; not a WBJEEB answer key.” Keep answers out of scores, ranks, drill denominators, correctness-based mastery and pass/fail feedback. An unsolved item displays its reason, not a blank pretending to be a key.

### B — verified scoring, separately gated

Only explicitly approved, independently supported, complete items may enter scored pools under the reconciled policy. No verified items existed in the inspected external revision. Path B is therefore blocked now. Never enable it merely because Path A ships.

## Scope

- Explicit paper/stream identity and provenance; correct reconciled subject labels and option boundaries through editorial sources, not edits to generated JSON.
- Loader separation between derived disputes, unresolved inputs and actual publisher-voided questions. Board awards require a publisher record, not a tier mapping.
- Reject unknown tiers and contradictory eligibility. Keep answer state distinct from trust and presentation status.
- Consistent library, reader, search, practice, quiz, mock, review and offline behaviour.
- Preserve submitted attempts and their key revision; corrections change future use, not historical results.

## Non-goals

No new accounts, backend, telemetry, live AI, paid service, alternate-stream support or lesson prose. Do not silently change the existing 2022 provisional-scoring behaviour: record a separate migration/owner decision, test its effect, and preserve old attempts.

**Execute:** [RUNBOOK.md](RUNBOOK.md). **Upstream:** [Phase 10](../10-derived-audit/README.md). **Downstream:** [Phase 12](../12-derived-release/README.md).

## Current implementation — owner-requested read-only integration

Implemented provisional study aids in the paper reader for the 400 imported 2017/2018/2019/2021 records. This is bounded Path A, not verified scoring or release approval. Further answer adjudication remains paused at the owner's request. Existing source/rights and transcription limitations remain open.

- 262 source-agreement records expose their imported labels only after opening a labelled provisional-answer panel. The label is explicitly not a verified answer and may not match corrupted current option text.
- 59 disputed/ambiguous/not-checkable answer records show a withholding explanation, not a candidate label.
- 79 unsolved records remain unanswered; the 73 proposed candidates have not been silently applied.
- The sanitized `provisionalAid` field is separate from `keyAnswer`, `hasKey`, keyed option styling, scored keys and eligibility. No imported reasoning, private evidence or source images are published.
- All 800 previous question fields compared unchanged except the added aid. Existing keys, scoring, pools, board awards and submitted-attempt behavior unchanged. 2022 policy is not migrated.
- Generated paper data and built reader pages/offline artifacts carry the aids; scored consumers cannot consume them as keys. Existing build/pack generation keeps revision hashes current.
- Import fails on paper/schema/tier/eligibility mismatches, invalid answers, duplicate/missing records or stale audit labels. It uses the pinned imported historical comparison, not new AI votes or mathematical research.
- Checks: Astro check/build, full suite (272 tests), separate 2023 suite (22 tests), four key validators, content freshness and whitespace checks passed. Tests cover state counts, invalid imports, deliberate reveal, no correct-option styling and no scored key/board award for all 400 aids.
- No independent content/rights/device certification; no commit, push, merge or deployment in this integration turn.

Remaining planned phases/tasks above are not all complete: verified scoring, full transcription reconciliation and release approval are separate. See the current roadmap for the owner pause on further answer research.

## Subsequent owner approval: provisional practice mode

The owner has now approved selectable-answer practice with **separate provisional comparison scores**, not a verified-tier promotion. See [decision, boundaries and verification](PROVISIONAL-PRACTICE.md). This extends the earlier read-only implementation for 262 available labels; ordinary scoring eligibility, normal attempt history and official/2022 flows are unchanged. Historical display-only descriptions above refer to the preceding release.
