# Phase 03 planning index · 2026-11-19

**Status:** plans drafted for every runbook task. On 2026-11-19 the owner successively accepted `Task: 03.1`, `03.2`, then “Continue 3.3 and 3.4” under `Mode: IMPLEMENT`, so [preview-only 03.1](2026-11-19-03.1-implementation.md), [03.2](2026-11-19-03.2-implementation.md), [03.3](2026-11-19-03.3-implementation.md) and [03.4](2026-11-19-03.4-implementation.md) slices using approved original content have been implemented and verified. No PYQ reader, real Lens service, cloud sync, deployment or release exists. Stay on this phase; do not start Phase 04.

**Branch:** `arena/4ad06920-jelet-ultimate-prep` at `affd290b0b3a2910ca73585d4dfbaad0ea0f0f67`. Owner/reviewer sign-off: none recorded for these plans.

## Task records and one-sentence scope

| Task | Plan | Input → output → exit check (summary) | Current gate |
|---|---|---|---|
| 03.1 Identity/reader | [plan](2026-11-19-phase-03-plan.md) · [implementation record](2026-11-19-03.1-implementation.md) | Approved pilot + contracts → stable public ID and honest reader design → direct subpath link reaches exact anchor and filtered return without private state. | Preview slice implemented for the original item (10/10 browser checks); PYQ reader and phase gate still blocked. |
| 03.2 Search/share | [plan](2026-11-19-03.2-plan.md) · [implementation record](2026-11-19-03.2-implementation.md) | UI contract + 03.1 IDs → local grouped index and spoiler-free share fallbacks → fresh-device link works with no answer or personal state. | Preview slice implemented for approved original items (15/15 browser checks); no PYQ or solution variant. |
| 03.3 Photo discovery | [plan](2026-11-19-03.3-plan.md) · [implementation record](2026-11-19-03.3-implementation.md) | UI photo contract + 03.2 index → outside-site Lens copy/paste steps, candidate confirmation and manual filters → noisy text finds candidates or honest no-match, never an asserted answer. | Preview slice implemented; paste-only, no upload/AI/service; live Lens untested. |
| 03.4 Workspace | [plan](2026-11-19-03.4-plan.md) · [implementation record](2026-11-19-03.4-implementation.md) | Local data contract + 03.1 IDs → bookmarks/notes/resume and validated export/import preview → close/reopen and restore compare with bad-file, cancel and denied-storage safety. | Preview slice implemented; 19/19 browser checks; real-device persistence still untested. |
| 03.5 Release check | [2026-11-19-03.5-plan.md](2026-11-19-03.5-plan.md) | Built 03.1–03.4 artifact + operations/testing contracts → gate-by-gate audit → pasted links, mapping relevance, share privacy and narrow-screen checks pass before any release decision. | Planned; not executed; no deployment authorized. |

## Dependency and gate order

`Phase 02 learner-transfer decision` → `03.1 IDs/reader` → `03.2 search/share` → `03.3 photo discovery` and `03.4 workspace` → `03.5 release audit` → separate owner release decision. The [runbook](RUNBOOK.md) is the minimum; [TESTING.md](../../TESTING.md) requires the ordinary, boundary and failure cases in each task record. The Phase 02 Android pass is owner-reported for the existing pilot only; no new build has a device result.

## Smallest decision/evidence register

| # | Needed from owner/reviewer | Why it blocks | Smallest acceptable answer |
|---|---|---|---|
| 1 | Phase 02 learner-transfer outcome, or an explicit written acceptance that it stays untested in preview. | Prompt gate: no bypass to next phase. | **Answered 2026-11-19:** owner said it is acceptable to leave untested and asked that this be written down; recorded in [DECISIONS.md](../../DECISIONS.md). Preview work may continue with the claim labelled untested; no efficacy claim or automatic release follows. |
| 2 | Scope of public question data. | All ten 2025 items are held; no cleared public record exists. | “Synthetic preview fixtures only” or a named, permission-reviewed record with source page and review date. |
| 3 | Explicit task/mode for 03.5. | Earlier implementation authorization does not extend to a release audit or deployment. | `Task: 03.5`, `Mode: VERIFY` (or another named task) in the next chat. |
| 4 | Named editorial/accessibility reviewer and release decision for 03.5. | Agent checks cannot replace content review or publication authorization. | Reviewer name/date and “release” / “no release” after evidence, never before. |

No question is currently approved for republication; the 03.1–03.4 previews use only the approved original case. No clouds, accounts, API keys, trials, cards, paid models, always-on phone or external AI are part of the proposed path.

## Actual checks run in this phase so far

- Python 3.11.2: `check_inventory.py` → pass (42 rows, 42 local link targets); stdlib scans resolved all local doc links/anchors and verified the required record fields. The built index parsed as JSON with no private field keys or answer values.
- Build/logic: pinned Node 22.23.4 (registry tarball extracted outside the repo), `npm ci` (0 known vulnerabilities), latest `npm run check` (21 files, 0 errors/warnings/hints), `npm run build` (7 pages, 15 files, 55,359 raw bytes). Temporary duplicate-ID and missing-anchor fixtures failed the build as intended, then were removed and the good build restored.
- Headless Chromium: latest `npm run test:browser` → **19/19 passed** with Chromium 153.0.8010.0 at 390×844 touch, 320×700 at 200% text and 1280×800 no-JS/keyboard, covering 03.1–03.4 plus earlier regressions. Details in the four linked implementation records.
- `git diff --check`, archive diff and `sha256sum -c` → pass; archive immutable.
- Owner phone check → after the pushed branch and tracked ZIP were fetched in Termux, the owner replied “All passed” to the nine-item on-phone checklist; recorded as owner-reported PASS in the [03.5 release record](2026-11-19-03.5-release.md). No device/browser version was supplied. Live Lens, TalkBack, cold launch, a second device and learner transfer remain untested; the agent's mocked share/clipboard and browser reload are not physical passes.
- CI/build size/published URL → none; PR-only checks from Phase 02, no deployment.

**Rollback:** revert the source/test/doc files listed in the implementation records; archive and pilot remain untouched. **Roadmap updated by/date:** agent, 2026-11-19, to show the 03.1–03.4 preview slices implemented and the Phase 03 gate still open.
