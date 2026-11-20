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

## Status

**One batch exists (2026-11-20).** Under the owner's authorisation of a text-layer-only
slice, [`2017/2017-keys.json`](2017/2017-keys.json) holds Mathematics Q1–Q20: 17
`derived-provisional` answers, 11 machine-checked, 2 items held for transcription doubt,
and 81 `unsolved` entries with named reasons. It is **not a key**: nothing is
`derived-verified` and nothing may be scored. Record:
[2017/2017-slice-record.md](2017/2017-slice-record.md). No key exists yet for 2018,
2019 or 2021.

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
