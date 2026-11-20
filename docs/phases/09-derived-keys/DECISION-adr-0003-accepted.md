# ADR-0003-A — owner acceptance of derived answer keys (2026-11-20)

**Instrument:** an acceptance record, not a rewrite. [`archive/jelet-prep/data/docs/decisions/ADR-0003-derived-answer-keys.md`](../../../archive/jelet-prep/data/docs/decisions/ADR-0003-derived-answer-keys.md)
stays `PROPOSED` **and byte-identical**, because `archive/` is immutable and its status line
is a historical statement about what was known on 2026-11-02. This file records that the
owner has now decided, and what was actually accepted.

- **Decision owner:** repository owner. Stated in session, 2026-11-20: *"ADR: Accept"*.
- **Effect:** ADR-0003's **tiered evidence model is adopted**, in the narrow form below. The
  archive file is not edited; this record is the operative decision.
- **Supersedes:** the earlier planning line *"Publish 2017/2018/2019/2021 as read only — no
  key, no scoring, no drill"* is **retained for scoring** and **narrowed for display**: those
  papers may now be *shown* with their `derived-provisional` answers as a labelled,
  explicitly unverified aid. They still may not be scored, ranked or counted in any total.
- **Related:** [OPEN-DOUBTS.md](OPEN-DOUBTS.md) (the uncertainty this rests on),
  [SCHEMA.md](SCHEMA.md), [09 phase README](README.md), `docs/DECISIONS.md` (row added).

---

## What was accepted

The four-tier model from ADR-0003 §"Proposal", unchanged in meaning:

| Tier | Meaning | Scoreable |
|---|---|---|
| `official` | Publisher-issued key | Reserved. **None exists for 2017/2018/2019/2021** |
| `derived-verified` | Machine-verified, **or** two independent solvers agree | Yes, labelled *solved by this project, not a WBJEEB key* |
| `derived-provisional` | One solver, not cross-checked | **No** |
| `disputed` | Solvers disagree, or the input is unresolved | **No** |

Plus the three safety properties ADR-0003 attached, which are the reason this is safe to
accept rather than a shortcut:

1. `official` stays empty and **visibly** empty. Nothing is ever relabelled official.
2. The weak tiers cannot score — enforced in the validator, not in prose: every entry
   carries `scoringEligibility`, and `eligibleCount` is currently **0 in all four files**.
3. Every key record carries its evidence: tier, method, the check that reproduces it, and
   the date. A key without evidence is `derived-provisional` by definition.

## What this acceptance does *not* do

Stated plainly, because an acceptance record that overstates itself is worse than none:

- **It creates no `derived-verified` entry.** There are **zero** today. The 321 solved items
  are all `derived-provisional`; the second pass of 2026-11-20 was the same solver, so it
  satisfies neither branch of the verification test ([OPEN-DOUBTS §How the second pass was
  run](OPEN-DOUBTS.md#how-the-second-pass-was-run-and-why-it-is-not-independent)).
- **It unblocks nothing that needs a score.** A scaled score, a rank, a percentile, a
  drill denominator or a "you passed" verdict on these four papers remains impossible until
  items reach `derived-verified`. That is a property of the evidence, not of this decision;
  accepting the policy is what makes the *policy* legal, not what makes the *answers* true.
- **It grants no rights.** Publication permission for the corpus was decided separately on
  2026-11-19. This ADR is about verification status only.
- **It does not retire the derived work if a board key appears.** S14 still applies: a
  published WBJEEB key replaces the derived key and this work becomes the audit trail.
- **It does not accept the accuracy liability silently.** ADR-0003's cost is real and is
  accepted with it: a wrong derived key is our error, not the publisher's. The correction
  route below is therefore mandatory, not optional.

## The correction route (mandatory per ADR-0003)

A wrong key must be correctable without rewriting anyone's history:

1. **A student can report a wrong answer** against a specific question. Reports land in the
   key file's `practiceReports` array — the schema already has the field and it is empty
   today, so nothing here is speculative.
2. **A report can change the key.** The entry moves to `disputed` (not silently to another
   letter), with the report and the reason attached.
3. **Past scores are never rewritten.** Because no paper in this set is scoreable today,
   this is currently satisfied trivially — which is exactly why it must be written down
   *before* anything becomes scoreable.
4. **The word "verified" in the UI means our verification, with the method stated.** It never
   implies WBJEEB endorsement.

## What would make the owner withdraw this

The same triggers ADR-0003 named, still live: a derived key found wrong in a way the process
could not catch; a rights objection to reproduced booklet content; or a board key appearing
for one of these years, which makes the derived key unnecessary rather than wrong.

## Status of the underlying phase

Accepting the policy does **not** complete phase 09. Full 09.2 adjudication still needs page
images; 79 items remain unsolved with a named reason each, and the ten items held inside the
slice (2017 Q2/Q17, 2018 Q31, 2019 Q19/Q81/Q92, 2021 Q2/Q21/Q78/Q80) are one image away
from resolution. See [OPEN-DOUBTS.md](OPEN-DOUBTS.md) §A.
