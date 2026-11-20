# 09 · Derived answer keys for the four unkeyed Paper-I years

**Entry:** the official WBJEEB booklets for 2017, 2018, 2019 and 2021 are retrieved and
readable, and the owner has accepted that these four years have **no board key we can locate** and must
be solved from the paper itself.

**Exit:** each year has a published, evidence-backed derived key in the editorial
collection, with a per-item tier, a machine-check record, an independent cross-check
record, an explicit list of what was held and why, and an owner practice-verification
loop that can trace every published answer back to the page it came from.

**Status · 2026-11-20, third entry — the authorised slice is complete for all four
years.** The owner authorised a text-layer-only subset, to be solved as
`derived-provisional`, for every year. That work is **done and committed**:

| Year | Solved (`derived-provisional`) | Machine-checked | Unsolved, with a reason | Slice size |
|---|---:|---:|---:|---:|
| 2017 | 83 | 23 | 17 | 85 |
| 2018 | 83 | 19 | 17 | 84 |
| 2019 | 79 | 19 | 21 | 82 |
| 2021 | 76 | 25 | 24 | 80 |
| **Total** | **321 of 400** | **86** | **79** | **331** |

Each year has a key file (`<year>/<year>-keys.json`), a re-runnable check script under
`<year>/checks/`, and a generated record `<year>/<year>-slice-record.md`. The record is
produced from the key file by `scripts/render-slice-record.py`, so the prose and the
JSON cannot drift apart.

**Nothing here is a key.** There are **zero `derived-verified` entries**, `eligibleCount`
is 0 in all four files, and nothing may be scored. The slice is a labelled substitute for a
page-based adjudication, not a replacement for it. Every excluded item names its own reason,
in the `note` field and in the year record.

**Policy is decided; evidence is not.** On 2026-11-20 the owner accepted ADR-0003's tiered
model — see [DECISION-adr-0003-accepted.md](DECISION-adr-0003-accepted.md). The archive's
ADR-0003 file still reads `PROPOSED` because `archive/` is immutable; the acceptance record
is the operative decision. It changes **nothing** about these four years, because acceptance
of a policy does not verify an answer: the tier that may score is still empty.

**Every doubt in this phase is kept in one place:** [OPEN-DOUBTS.md](OPEN-DOUBTS.md) — the
ten items held inside the slice, the pattern doubts that a page image would *not* fix, the
corpus defects shared by all four years, and the results of the 2026-11-20 second pass
(321 items re-derived, 48 disagreements, **all 48 resolved in favour of the recorded
answer** — so no key changed).

**Status · 2026-11-20, first entry:** phase designed; **pre-flight has run for all four
years**. Every booklet was read through and every section map corrected, but no page image
could be captured, so page-based solving stops at step 09.2 for every year. See the
pre-flight records for
[2017](../../../editorial/derived-keys/2017/2017-preflight.md),
[2018](../../../editorial/derived-keys/2018/2018-preflight.md),
[2019](../../../editorial/derived-keys/2019/2019-preflight.md) and
[2021](../../../editorial/derived-keys/2021/2021-preflight.md).

> **Correction, 2026-11-20.** The previous version of this status block still said
> "pre-flight has run for 2017 and 2018, and only those two". That was true when it was
> written and false when it was left standing; it is corrected here.

---

## What this phase is, and what it is not

This is a **documentation-only** phase. It defines the procedure, the artifacts, the
gates and the records for deriving answer keys from official question booklets when
the board never published a key.

It is **not** an application change. Nothing in `src/`, `scripts/`, `tests/`,
`public/` or `src/data/` is written by this phase. The keys it produces are editorial
records that live in [`editorial/`](../../../editorial/derived-keys/README.md), not in
the published corpus.

It is **not** a publication decision. Producing a derived key does not put a paper
into the practice pool. Scoring a derived key is a separate owner decision, taken
after the key exists and after the two integration gates below are cleared.

It is **not** a rights clearance. See [PUBLICATION.md](../../../docs/CONTENT.md).

---

## The four years at a glance

All four are JELET Diploma Engineering & Technology, Paper I, 100 marks, 100
questions. The board published **no** model or final key for any of them: the
[WBJEEB JELET archive](https://wbjeeb.nic.in/archive-jelet/) lists key notices for
2023, 2024, 2025 and 2026 only. Every key this phase produces is therefore *derived*
and is labelled as such everywhere it appears.

| | 2017 | 2018 | 2019 | 2021 |
|---|---|---|---|---|
| Booklet number | `80116361` | not printed in the text layer | Set A | `1091007537` |
| Source PDF | `2023111594.pdf` | `2023111538-1.pdf` | `2023111582-1.pdf` | `2023111536-1.pdf` |
| Set label on paper | `JELET-2017/DIP. ENGG.&TECH.` | `Engg & Tech/JT3` | `JELET-2019` | `JELET-2021` |
| Questions in the corpus | 100 | 100 | **98** | 100 |
| Items carrying a figure | 10 | 11 | 6 | 15 |
| Items with incomplete options | 3 | 2 | 4 | 2 |
| Complete-option, figure-free ceiling | 89 | 89 | 91 | 85 |
| Alternate stream sets present | Yes | Yes | **No** (pre-flight) | Yes |
| Year package | [years/2017.md](years/2017.md) | [years/2018.md](years/2018.md) | [years/2019.md](years/2019.md) | [years/2021.md](years/2021.md) |

**Ceiling, not a promise.** 354 is the sum of the four *corpus-filter* ceilings — the number of items
that *could* score if every one of them were solved and cross-checked. The real number
will be lower: an item is scored only if it is also complete and figure-free, and a
complete, readable, independently cross-checked item is rare in the Strength of
Materials and Engineering Mechanics sections where most figures sit. Do not quote 354
as a coverage claim, and it is a property of the corpus flags, not a measurement of the
printed papers — the page images could move every one of these numbers in either direction.

### The official section map (main stream set)

| Range | 2017 | 2018 | 2019 | 2021 |
|---|---|---|---|---|
| Q1–20 | Mathematics | Mathematics | Mathematics | Mathematics |
| Q21–35 | Electrical Technology | Electrical Technology | Electrical Technology | Electrical Technology |
| Q36–55 | Computer Application | Computer Application | Computer Application | Computer Application |
| Q56–70 | Environmental Engineering | Environmental Engineering | Environmental Engineering | Environmental Engineering |
| Q71–85 | Engineering Mechanics | Engineering Mechanics | Engineering Mechanics | Engineering Mechanics |
| Q86–100 | Strength of Materials | Strength of Materials | Strength of Materials | Strength of Materials |

**All four rows were verified on 2026-11-20** from each booklet's own printed headings.
This table previously claimed Q1–35 Electrical for every year, which contradicted the
corpus and omitted the whole Mathematics section; 2019 additionally called its Electrical
section "Electrical & Electronics", which the booklet does not. Sources:
[2017](../../../editorial/derived-keys/2017/2017-preflight.md),
[2018](../../../editorial/derived-keys/2018/2018-preflight.md),
[2019](../../../editorial/derived-keys/2019/2019-preflight.md),
[2021](../../../editorial/derived-keys/2021/2021-preflight.md).

**The corpus disagrees with this map.** `scripts/build-content.mjs` labels Q36–100 of
every target year as `Computer & IT` / `Computer Application`. That label is wrong for
**45** questions in 2017, 2018 and 2021, and for **43** in 2019, whose corpus holds 98
questions. Filtering, topic mapping and search must not use the corpus subject for
these years until the corpus is rebuilt from the official booklets. This is a fact the
phase must carry, not fix.

**Alternate stream sets are out of scope.** The 2017, 2018 and 2021 booklets print a
second and sometimes third Q71–100 section for other streams — Printing Technology
"Basic Engineering" (2017, 2018, 2021) and Agricultural Engineering (2017, 2021). The
corpus carries only the main Engineering & Technology set, and the derived key covers
only that set. An alternate set is a different paper, not a variant of this one.

---

## Why these four years are derived-only

The board published keys for 2023–2026. It published none for 2017, 2018, 2019 or
2021, and it has not since. Two different things are therefore true at once, and the
phase keeps them apart:

1. **The questions are official.** The booklet is a board document; the question text,
   the options and the marking scheme are the board's.
2. **The answers are ours.** Where the board is silent, the answer is a derivation
   from the printed paper, and it is only as good as its evidence.

A derived key must never be labelled `official`, must never claim board endorsement,
and must never be silently upgraded because it is convenient. This is rule 2 of the
[editorial collection rules](../../../editorial/README.md) and it is not negotiable
inside a phase.

---

## Two independent axes: trust and eligibility

The most common failure in a derived key is collapsing two different questions into
one: *how much do we trust this answer?* and *may this item contribute to a score?*
They are separate, and an item can fail either one alone.

**Axis 1 — tier: how much do we trust the answer?**

| Tier | Meaning | Who may set it | Scores? |
|---|---|---|---|
| `official` | The board published this answer. Carries a board document reference and a set/mapping. | Only the board, by us quoting a published document. | Yes |
| `derived-verified` | One solver pass with written reasoning, **independently cross-checked** by a second solver who did not see the first answer, every disagreement re-adjudicated against the official page, and — where the answer is computable — a machine check that reproduces it. | A solving session, after the cross-check and adjudication steps | Only with explicit owner approval |
| `derived-provisional` | Solved with written reasoning but **not yet** independently cross-checked, or cross-checked but with no machine check where one was expected. | A solving session, before the cross-check lands | **Never** |
| `disputed` | More than one option is defensible, or an input cannot be read, or two competent readings of the page conflict and the page does not settle it. | A solving session, on the record | **Never** |

`official` is a **paper-level** determination. It applies to a whole paper whose key
came from a board notice. It is **not available as an item tier** for 2017, 2018,
2019 or 2021, because no board notice exists for any of them. A solver working on
these years may never write `official` into an item's tier field.

**Axis 2 — eligibility: may this item contribute to a score?**

An item is `eligible` only if it is complete (all options reproduced and readable),
figure-free, carries a tier that ADR-0003 permits to score, and the paper it belongs
to has been approved for scoring. Otherwise it is `held`, with a reason:
`figure-not-reproduced`, `options-not-reproduced`, `input-unreadable`,
`ambiguous-input`, or `no-approved-tier`.

A `derived-verified` item can still be **held** — the answer may be right while the
*paper* is unreproducible. A `derived-provisional` item is never eligible. A
`disputed` item is never eligible and is never board-awarded.

Held items stay visible and searchable, keep their reason on the page, and are
excluded from every scored pool **and from the denominator of every total**. This is
already how the site treats unreproduced figures; the phase reuses that rule rather
than inventing a second one.

---

## Two gates that must be cleared before any of this can be scored

Both are **future application work**. Neither is done by this phase. Both are listed
here because a phase that cannot say "this cannot be integrated yet" is not a phase,
it is a wish.

**Gate A — the disputed-items defect.** `scripts/build-content.mjs` currently maps a
derived key's `tier === 'disputed'` into the same bucket as a board-voided question.
A voided question that is still presentable becomes `boardAwarded` — marks handed to
every candidate. So under today's code a disputed item would be **awarded marks it
does not have**. Until that mapping is corrected, **no target-year derived key may be
integrated at all**, at any tier. Disputed items must be excluded from scoring and
from awards, and the exclusion must be visible in the published counts.

**Gate B — one set per year.** The application model holds one paper record and one
key per year, and the keyed-paper invariant requires an answer for every question.
The official booklets print a different Q71–100 for different streams. The corpus
carries only the main set, so the derived key covers only the main set — but the
integration must state, in the paper's own metadata, which set was solved, or a
reader will assume the booklet's other sections were also keyed. If the owner later
wants the alternate sets, that is a model extension and a separate decision.

**Gate C — ADR-0003 is accepted (2026-11-20), and still unenforced outside this phase.**
The tiered model is now adopted ([decision record](DECISION-adr-0003-accepted.md)), and it
requires that provisional answers do not score. Phase 09's four files enforce that in the
validator. The 2022 generator does not: 13 of 2022's 87 scoreable questions are
`derived-provisional`. Accepting the policy therefore creates a **concrete, dated defect in
2022** that this phase does not fix, because 2022 is outside its scope. It is recorded here
rather than repaired silently, and the repair belongs to whichever phase owns 2022.

---

## Boundaries

| | In scope of this phase | Out of scope |
|---|---|---|
| **Solving** | Retrieve the booklet; capture page images; read the paper; solve; cross-check; machine-check; adjudicate; publish `<year>-keys.json`, `<year>.md`, `<year>-crosscheck.md` into `editorial/derived-keys/<year>/`; log every difference against the corpus | Any change to the published corpus, the key loader, the practice surface or the site |
| **Future application integration** *(separate, owner-authorised, later)* | Rebuild the corpus from `editorial/`; add the key source to `scripts/build-content.mjs`; fix Gate A; state the solved set in the paper metadata; label the paper's tier in the library and the mock; add these years to the offline packs | Deciding *whether* to integrate; shipping it; adding an item-level tier UI |
| **Owner review** *(separate, ongoing)* | Choose which stream set to publish; approve or refuse scoring; practise on the site; report discrepancies; approve or refuse each correction | Building the key; adjudicating disputes alone; publishing anything |

The order matters: **solve → owner approves → integrate → owner practises → owner
reports → correct.** A key that is integrated before the owner has approved it has
skipped the only review that matters.

---

## The audience hierarchy

The site is for the **owner first**, for **friends second**, and for **anybody who
finds it online third**. The order is not a ranking of importance — it is the order
in which a change is allowed to complicate things.

- **Owner.** Needs the answer to be right and needs to know how much to trust it. A
  derived key is more useful to the owner with its caveats visible than without them.
- **Friends.** Need a paper to practise on and a key that does not embarrass them.
  "Derived, not official, and here is exactly what is uncertain" is more useful than
  a confident wrong key.
- **Whoever finds it online.** Need the site to be honest, clear and fast. A paper
  that silently behaves like an official-keyed paper is the worst outcome available,
  because a stranger has no way to know it is not one.

### UI constraints, if UI work is later authorised

These are **constraints, not a design**. No UI work is authorised by this phase.

1. The paper-level tier label must appear wherever the paper can be mistaken for an
   official-keyed paper — the library row, the mock header, the practice header. The
   existing chip vocabulary (`official` / `derived` / read-only) is the right size;
   do not invent a second one.
2. Item-level tier is a **detail**, not a headline. It belongs in the answer and
   review surface where the reasoning already lives, never on the question card a
   learner is trying to answer.
3. Never use colour alone. A tier or hold state must be readable as text.
4. Held and disputed items need one plain sentence of explanation. Not a code, not a
   tooltip-only notice, not an empty answer.
5. Every held item states its reason where it is displayed. A learner who cannot see
   a question's diagram must be told that the question is held *because* the diagram
   was not reproduced.
6. Do not add a tier picker, a trust slider, a confidence widget or a settings screen
   for this. The audience hierarchy argues against feature density.
7. Adding these years must not slow the library or the search index down, and must
   not require the offline packs to grow past their current budget without a
   separate decision.

---

## Where the work is

| File | What it holds |
|---|---|
| [RUNBOOK.md](RUNBOOK.md) | The ordered, executable procedure every year follows |
| [SCHEMA.md](SCHEMA.md) | The exact shape of the key file, the cross-check record, the dispute record and the practice report |
| [STOP-CONDITIONS.md](STOP-CONDITIONS.md) | When to stop, what to record instead, and who decides |
| [OWNER-PRACTICE-LOOP.md](OWNER-PRACTICE-LOOP.md) | How the owner practises, reports, and how a report traces back to evidence |
| [EVIDENCE.md](EVIDENCE.md) | The phase evidence and handoff record |
| [years/](years/) | One self-contained package per year, each executable in a fresh chat |
| [editorial/derived-keys/](../../../editorial/derived-keys/README.md) | Where the produced artifacts live and the rules they obey |

**Execute:** [ordered tasks and acceptance checks](RUNBOOK.md). Use the
[reusable session prompt](../../../prompt.md) and the [roadmap](../../ROADMAP.md) for
authorisation and status. One year per chat: the packages in `years/` are written to
be executed independently and in any order.
