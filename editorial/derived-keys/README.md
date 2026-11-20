# Derived keys

Derived answer keys for the JELET Paper-I years the board never published a key for:
**2017, 2018, 2019 and 2021**.

These records are produced by [phase 09](../../docs/phases/09-derived-keys/README.md).
They are editorial evidence, not published content. Nothing here is in the site's
corpus, and nothing here is scored.

---

## What belongs here

```
editorial/derived-keys/<year>/
  <year>-preflight.md       the pre-flight record — booklet identity, section map, page map, capture gaps
  <year>-keys.json          the machine artifact — key + evidence ledger
  <year>.md                 the human-readable key table
  <year>-crosscheck.md      the cross-check narrative, disputes and holds
  <year>-reconciliation.md  the official-versus-corpus differences
  checks/                   small deterministic check scripts
  pages/                    captured booklet page images
  practice-reports/         the owner's own practice reports
```

The exact shape of every file is fixed by the
[phase 09 schema](../../docs/phases/09-derived-keys/SCHEMA.md). A file that does not
validate against it is not published.

## What does not belong here

- **A board key.** Official keys live in the archive's `docs/official-keys/` and are
  quoted, never copied. A derived key may never be labelled `official`.
- **Application code.** The `checks/` scripts are evidence — one-file computations
  that reproduce a recorded answer. They must not import from `src/` or `scripts/`,
  must not touch the corpus, and must not be wired into any build.
- **Answers without evidence.** An entry with no reasoning, no verification and no
  page image is not a derived key; it is a guess with a JSON shape.
- **Personal data.** The owner's practice reports contain the owner's own notes
  about the owner's own work. They are kept because they are the audit trail of a
  correction, and they are never published, never sent anywhere and never linked
  from the site.

## The rules these records obey

They are the [editorial collection rules](../README.md), restated for the key work:

1. **Provenance first.** Every record names the booklet, the URL, the retrieval date
   and the page each answer came from.
2. **The key is the board's, not ours.** For these four years the board published
   none, so every answer is *derived* and labelled so. The tier travels with the
   answer everywhere it appears.
3. **A figure that is not reproduced holds the item.** It stays readable and
   searchable, keeps its reason, and is excluded from every scored pool and from
   every denominator.
4. **Nothing is invented.** No option, no figure, no category, no subject, no
   scoreable status.
5. **Publication rights are checked separately.** Technical verification does not
   clear rights. A record may exist here while the paper it describes stays
   unpublished.

## Records

| File | What it is |
|---|---|
| `<year>/<year>-keys.json` | The year's derived key: 100 entries, every one with a tier and a reason |
| `<year>/<year>-slice-record.md` | Generated from the key file by `scripts/render-slice-record.py`; never hand-edited |
| `<year>/checks/computable-<year>.py` | The numbers behind every machine check, re-runnable per question |
| [`second-pass-2026-11-20.json`](second-pass-2026-11-20.json) | The blind second pass: 321 items re-answered, 48 disagreements, every one adjudicated. **Not independent** — see below |

The second pass is a consistency check, not corroboration: the same solver and the same
corpus produced both answers, so agreement proves only that the reasoning was reproducible.
It moved no entry out of `derived-provisional`. Its purpose is that a disagreement is a
genuine signal, and all 48 were resolved in favour of the recorded answer, one of them after
an incorrect claim of a key error that had to be retracted.

## Status

**Four batches exist (2026-11-20).** Under the owner's authorisation of a text-layer-only
slice, every year now has a key file covering the whole paper:

| Year | Key file | Solved | Machine-checked | Unsolved with a reason | Record |
|---|---|---:|---:|---:|---|
| 2017 | [`2017-keys.json`](2017/2017-keys.json) | 83 | 23 | 17 | [record](2017/2017-slice-record.md) |
| 2018 | [`2018-keys.json`](2018/2018-keys.json) | 83 | 19 | 17 | [record](2018/2018-slice-record.md) |
| 2019 | [`2019-keys.json`](2019/2019-keys.json) | 79 | 19 | 21 | [record](2019/2019-slice-record.md) |
| 2021 | [`2021-keys.json`](2021/2021-keys.json) | 76 | 25 | 24 | [record](2021/2021-slice-record.md) |

**321 of 400 questions carry a `derived-provisional` answer and 86 of those
are machine-checked.** This is **not a key**: nothing is `derived-verified`,
`eligibleCount` is 0 in every file, and nothing may be scored.

Every unsolved item states why it is unsolved: a figure that exists only as an image, an
option set the corpus does not reproduce, a stem the transcription damaged, or a puzzle
whose own options contradict the arithmetic. Items held *inside* the slice are held for
that last reason rather than forced onto the nearest option.

The pre-flights that precede it are
[2017](2017/2017-preflight.md), [2018](2018/2018-preflight.md),
[2019](2019/2019-preflight.md) and [2021](2021/2021-preflight.md). Phase 09 has run its **pre-flight for all
four**: each booklet was read through, its section map corrected and its text-layer
defects catalogued — [2017](2017/2017-preflight.md), [2018](2018/2018-preflight.md),
[2019](2019/2019-preflight.md) and [2021](2021/2021-preflight.md). Solving stopped at
step 09.2 every time because no page image of the booklet could be produced, and the
phase allows no entry without one. See the
[phase folder](../../docs/phases/09-derived-keys/) for the procedure and the per-year
packages.
