# Phase-09 branch inspection — planning evidence, 2026-11-20

## Revision and method

Current working branch: `arena/a05b85e3-jelet-ultimate-prep`, based on `b546c8b249b22ad5806f40e611f0362bd07959cb`.

Inspected external branch: `arena/f4180f76-jelet-ultimate-prep` at **`6a14ac1d6b0e4ac0774ba1934b3e534244e5eaf9`**.

[Fixed source tree](https://github.com/pabitra27706-oss/Jelet-ultimate-prep/tree/6a14ac1d6b0e4ac0774ba1934b3e534244e5eaf9).

Used `gh api` to read the branch SHA, recursive tree, phase README, acceptance record, open-doubts register, editorial README and four key JSON files. JSON was decoded and counted in memory. No branch switch, merge, key import, paper fetch or script execution occurred. Long documentation output was truncated; this was a targeted planning inspection, not a complete source review.

## Independently recounted structural facts

| Year | Entries | Nonempty answers, all provisional | Unsolved tier | Held | Eligible | Records declaring machineCheck.pass true |
|---|---:|---:|---:|---:|---:|---:|
| 2017 | 100 | 83 | 17 | 100 | 0 | 23 |
| 2018 | 100 | 83 | 17 | 100 | 0 | 19 |
| 2019 | 100 | 79 | 21 | 100 | 0 | 19 |
| 2021 | 100 | 76 | 24 | 100 | 0 | 25 |
| Total | 400 | 321 | 79 | 400 | 0 | 86 |

Source paths at the fixed revision: `editorial/derived-keys/<year>/<year>-keys.json`.

Recomputation: 83+83+79+76=321; 17+17+21+24=79; 321+79=400; 23+19+19+25=86. The 86 are recorded passing checks, **not checks independently rerun here**. All entries have scoringEligibility `held`; zero entries have tier `derived-verified` or `official`.

The tree contains four preflight files, four slice records, check scripts, and `editorial/derived-keys/second-pass-2026-11-20.json`. Presence is not correctness. The second-pass file was not independently audited.

## Decisions recorded there, not re-granted here

[Acceptance record](https://github.com/pabitra27706-oss/Jelet-ultimate-prep/blob/6a14ac1d6b0e4ac0774ba1934b3e534244e5eaf9/docs/phases/09-derived-keys/DECISION-adr-0003-accepted.md) records owner acceptance of the tiered model and permission for explicitly unverified provisional-answer display, not scoring. It reports a same-solver second pass and states that no verified entry was created.

This inspection establishes what that document records, not independent validation of the session transcript or publication rights. Its assertion that rights were decided separately must be traced to the actual rights decision before release.

## Planning risks

1. The current branch's phase-09 documents and the external branch are different evidence states. Do not claim local pre-flights or keys exist merely by linking them.
2. The local design and external acceptance record use different verification criteria. Resolve explicitly before promotion.
3. External JSON adds an `unsolved` tier; consumers must not silently interpret unknown tiers as valid or board-voided.
4. External summaries use both “key file” and “not a key”; UI should say “provisional answer aid”, not imply a certified key.
5. External repeated no-board-key assertions still require careful wording and publisher evidence. This inspection did not search for board notices.
6. Earlier local audit findings are a checklist to re-test at this revision, not findings automatically transferred to the external branch.

## Immediate next action

Execute Phase 10 against this pinned revision (or explicitly record a newer revision and recount). Independently review all records and claims before integration. No keys or source documents were copied into this branch by the planning task.
