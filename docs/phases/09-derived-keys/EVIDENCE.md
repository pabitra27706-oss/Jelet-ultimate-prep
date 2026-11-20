# 09 evidence and handoff record

Use [`docs/templates/phase-record.md`](../../templates/phase-record.md) for the record
of each solving session. This file holds the phase-level record and the standing
record of what has and has not been done.

---

## Phase record — 09 · design

- **Phase:** 09-derived-keys
- **Status:** designed; no solving session has run
- **Date:** 2026-11-19
- **Branch / commit:** `arena/2776b27f-jelet-ultimate-prep`, from `e2d6f09`
- **Owner / reviewer:** owner · to be named on the first solving session

### Inputs and pre-change evidence

Reused, unchanged and not forked:

| Reference | Reuse | Licence / status |
|---|---|---|
| `archive/jelet-prep/data/docs/derived-keys/2022-keys.json` | The 2022 derived key — the schema's precedent | Immutable archive, checksum-locked |
| `archive/jelet-prep/data/docs/derived-keys/SOLVER-PROMPT.md` | Prompts A, B and C — the solving, attack and cross-check protocol | Immutable archive |
| `archive/jelet-prep/data/docs/derived-keys/2022-crosscheck.md` | The cross-check narrative format | Immutable archive |
| `archive/jelet-prep/data/docs/decisions/ADR-0003-derived-answer-keys.md` | The tier model this phase implements | `PROPOSED` — owner decision still open |
| `archive/jelet-prep/data/docs/decisions/ADR-0002-figure-reconstruction.md` | The rule that a redraw never unblocks scoring | In force |
| `editorial/README.md` | The five collection rules | In force |
| `docs/phases/08-optional/` | The phase layout used here (README + RUNBOOK + records) | In force |

Rejected as a source: `archive/jelet-prep/data/pyq-md/{2017,2018,2019,2021}.md` —
evidence only. The section headings stop at Q55, the 2019 file is headed "JELET-2018",
and the corpus it feeds contains demonstrably fabricated option text (2017 Q83).

### Approved scope, delivered outputs, deliberate exclusions

**Delivered:** a documentation-only phase design — [README](README.md),
[RUNBOOK](RUNBOOK.md), [SCHEMA](SCHEMA.md), [STOP-CONDITIONS](STOP-CONDITIONS.md),
[OWNER-PRACTICE-LOOP](OWNER-PRACTICE-LOOP.md), and four self-contained year
packages in [years/](years/).

**Deliberately excluded:**

- Any change under `src/`, `scripts/`, `tests/`, `public/` or `src/data/`.
- Any change under `archive/`.
- Any derived key. No key exists for 2017, 2018, 2019 or 2021 yet.
- Any scoring, integration, pack inclusion or UI change.
- Any analytics, account, telemetry or feedback mechanism.

### Findings that shaped the design

| Finding | Effect on the phase |
|---|---|
| WBJEEB publishes key notices for JELET 2023–2026 and **none** for 2017, 2018, 2019 or 2021 | All four years are derived-key work; `official` is unavailable as an item tier |
| The corpus labels Q36–100 of every target year as Computer; the official booklets divide those ranges among five subjects and print extra stream-specific sets | A mandatory reconciliation step, and a hard rule that the corpus subject must not drive filtering |
| The 2021 text layer drops visible question labels around Q74, Q76 and Q81 | Numbering must come from the page images |
| Official 2019 Q78–79 are absent from the corpus and official 2019 Q77's stem is blank | Stop conditions S5 and S6; the highest-risk year package |
| The corpus's 2017 Q83 option text is a transcriber's placeholder, not the booklet's four distinct exponents | Stop condition S3; the strongest argument for reading page images only |
| `scripts/build-content.mjs` maps a derived `disputed` tier into the voided path, where a presentable item becomes `boardAwarded` | Integration Gate A: no target-year key may be integrated until this is fixed |
| The application holds one paper and one key per year; the booklets print several Q71–100 sets | Integration Gate B: the solved set must be named in the paper's metadata |
| The 2022 generator lets 13 provisional answers score, which ADR-0003 forbids | ADR-0003 stays `PROPOSED`; the phase does not resolve it by copying either behaviour |
| The 2026 syllabus has four subjects and no Computer, Environmental, Mechanics or Strength subject | Keying these years does not close the modern-syllabus coverage gap; no such claim is made |

### Gates

Not applicable to a documentation-only phase. The gates that a *solving* session must
clear are listed per year in [years/](years/) §10 and enforced by the
[runbook](RUNBOOK.md).

### Blockers, unresolved risks, next action

| Item | Status |
|---|---|
| ADR-0003 remains `PROPOSED` | **Owner decision required.** The phase produces keys that *can* enforce the rule; it does not decide whether they do |
| The `disputed → voided → boardAwarded` loader defect | **Owner decision + application work.** Not fixed here. It blocks integration of every target-year key |
| One paper and one key per year | **Owner decision** if the alternate stream sets are ever wanted |
| Publication rights for the four booklets | **Open**, and separate from technical verification. The [content standard](../../CONTENT.md) governs |
| Page images for the booklets | **Not yet captured.** They are the phase's most important input; without them no entry may be written |

**Next action:** the owner runs one year package in a fresh chat. Start with
[years/2017.md](years/2017.md) — it is the cleanest of the four — or with
[years/2019.md](years/2019.md) if the goal is to find out how the worst case behaves
first.

---

## Session records

One record per solving session, appended below. Use the phase-record template.

### 09-2017 · _not run_

### 09-2018 · _not run_

### 09-2019 · _not run_

### 09-2021 · _not run_
