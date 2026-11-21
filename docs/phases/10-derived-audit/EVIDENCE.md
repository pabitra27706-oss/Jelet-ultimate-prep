# Phase 10 evidence and handoff · 2026-11-20

## Scope and status

**Implemented:** structural inventory and validator safety hardening on `arena/a05b85e3-jelet-ultimate-prep`.
**Not completed:** atomic deduplicated claim inventory, answer correctness audit, source-fidelity audit, independent adjudication, application integration or release.

PR #9 source is pinned at `6a14ac1d6b0e4ac0774ba1934b3e534244e5eaf9`. The PR was open at inspection. No merge, branch switch, source-paper download, OCR or render occurred.

## Inventory

[INVENTORY.json](INVENTORY.json) contains 31 phase/editorial source paths and 400 per-question audit rows. Each row identifies the remote record, its recorded tier/hold and whether it declares a machine check. No answer letters were copied; every answer audit is explicitly `pending`.

| Year | Unique Q1–100 records | Provisional | Unsolved | Held | Declared machine checks |
|---|---:|---:|---:|---:|---:|
| 2017 | 100 | 83 | 17 | 100 | 23 |
| 2018 | 100 | 83 | 17 | 100 | 19 |
| 2019 | 100 | 79 | 21 | 100 | 19 |
| 2021 | 100 | 76 | 24 | 100 | 25 |
| Total | 400 | 321 | 79 | 400 | 86 |

All 400 carry unverified corpus fidelity; all lack source images and per-item cross-checks. Zero are verified or eligible. Recomputed authorised subsets: 85, 84, 82, 80 (331); exclusions: 15, 16, 18, 20 (69). Therefore 79 unsolved = 69 exclusions + 10 unresolved in-slice items. The 48 second-pass adjudication records are not an independent cross-check.

## Defects reproduced before hardening

Using PR #9's validator in memory, a synthetic clone of 2017 Q4 was promoted to verified without any image, machine check or cross-check. After updating totals, the validator returned no errors. Marking that clone eligible, removing owner approval and retaining Gate A=false also returned no errors. No saved source answer was altered.

## Changes made

- Imported only `scripts/validate-keys.mjs` from the pinned PR; added source confinement/existence, strict approval/gates, verification and presentation checks, guarded malformed entry handling and restricted check-script references.
- Added `tests/derived-key-safety.test.mjs`: 16 offline synthetic regression tests, including the two reproduced failure paths.
- Added `test:key-safety` to `npm test`, plus the `validate:keys` command.
- Recorded the conservative interim [safety profile](SAFETY-PROFILE.md); this is not a claim that the original ADR was amended by its owner.

## Validation run

| Check | Result |
|---|---|
| `npm run test:key-safety` | 16 passed, 0 failed |
| `npm run test:rules` | 19 passed, 0 failed |
| Hardened `validateKeyFile` on all four pinned remote JSONs, with the pinned corpus | 0 errors and 0 warnings for each year |
| Full application/build/browser suite | Not run; no UI/build/corpus integration changed |

Remote compatibility check fetched JSON and five numeric script files through the GitHub API. Keys and corpus stayed in memory. Scripts were placed in a temporary evidence root, used only for existence/confinement checks, and deleted on exit. No numeric script was run. Compatibility is structural, not a certification of 86 calculations or 321 answers.

## Remaining policy/documentation corrections

1. The acceptance's machine-check OR independent-agreement formulation conflicts with the stricter README/schema/runbook. SAFETY-PROFILE.md prevents weakening while that remains unresolved.
2. Schema amendment 1.1.0 already authorises unsolved and held text-only records; older unconditional no-image stop wording needs an explicit exception reference.
3. Reconciliation arrays currently cover numbering only; empty defect arrays must not imply source fidelity.
4. Editorial stream metadata is not proof that the application Gate B is complete.
5. The schema's Q72 example says answer C but cross-check note A; its relative image path disagrees with validator format.
6. No-located-board-key wording must replace unsupported historical nonpublication claims.
7. Rights clearance, owner publication approval and the actual manual report route need distinct evidence.
8. Existing 2022 provisional scoring and the application's disputed-to-awarded loader path remain separate integration defects. This change does not fix or enable either.

## Next executable work — no new planning decision needed

Finish the atomic claim occurrence ledger against the fixed revision, then independently audit answer/unsolved records and all 48 second-pass adjudications. Start with input fidelity and the ten unresolved in-slice items, but do not present that priority sample as exhaustive coverage. Do not fetch/render question papers; report missing evidence precisely. Keep all target answers held and PR #9 open while review is incomplete.
