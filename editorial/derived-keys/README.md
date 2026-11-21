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

Imported the owner's requested source-branch records: 400 entries across 2017,
2018, 2019 and 2021, including 321 candidate answers and 79 unsolved entries.
Source records retain their derived-provisional tiers and scoring holds. They are
not yet integrated into the public question bank. See [import provenance](IMPORT-2026-11-20.md).

### Subsequent read-only integration

The earlier import-only status is historical. Sanitized provisional study aids are now attached to the reader: 262 revealable source-agreement labels, 59 withheld disputed/ambiguous/uncheckable answers, 79 unsolved entries. Full records remain editorial; no imported item is scored. See [integration evidence](../../docs/phases/11-derived-integration/README.md).
