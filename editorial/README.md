# Editorial collection

New editorial records, created after the preserved archive was captured.

`archive/jelet-prep/` is a read-only baseline: byte-for-byte extracts from the legacy repository,
checked by `SHA256SUMS`. It is never edited and never published. When a paper, key or figure has
to be corrected or added, the correction lands **here**, with a pointer back to the old item, and
the archive is left exactly as it was.

| Record | What it is | Provenance |
|---|---|---|
| [pyq-md/2023.md](pyq-md/2023.md) | JELET-2023 Paper I, Set A — 100 questions transcribed from the official WBJEEB booklet | [provenance/2023-paper1.md](provenance/2023-paper1.md) |
| [figures/2023/](figures/2023/) | Eleven reconstructed SVG drawings for the 2023 items whose stems point at a diagram | [figures/2023/manifest.json](figures/2023/manifest.json) |

## Rules for a record in this collection

1. **Provenance first.** Every record names its source document, the URL it came from, the date it
   was retrieved and how it was checked. A record without a provenance file is not published.
2. **The key is the board's, not ours.** A key is used only when the board published one, and it is
   labelled with its tier and document reference. A missing option is never filled in by guesswork.
3. **A figure that is not reproduced holds the item.** The item stays readable and searchable, keeps
   its reason on the page, and is excluded from every total.
4. **Nothing is invented.** A stem, an option, a subject, a category, a topic match or a scoreable
   status is either read from the source or derived from a heading the source itself states.
5. **Publication rights are checked separately from technical verification.** A public document is
   not necessarily licensed for republication. An unresolved rights question holds reproduction and
   links to the official source instead.

## The figure collection

`figures/<year>/` holds the reconstructed drawings and the manifest that describes them. The
manifest is the record: it names the source paper and question, the drawing's kind, how faithful it
is to the printed values, an alt text, a long text equivalent, and — the part that matters most —
how the redraw differs from the official artwork.

The rules these drawings follow are in
[ADR-0002](../archive/jelet-prep/data/docs/decisions/ADR-0002-figure-reconstruction.md). In short:

- **Original primitives only.** A drawing is hand-authored SVG. No pixel data from the booklet is
  stored, embedded, linked or traced, and the assets are self-contained.
- **Provenance in the file.** Every asset carries a comment naming its source paper, the booklet
  reference and the retrieval date, alongside an accessible `<title>` and `<desc>`.
- **A text equivalent always.** The manifest's description and alt text are published beside the
  drawing, so the content survives without the image.
- **A redraw never unblocks scoring.** A drawing shows the printed values; it does not verify an
  item. An item that was held stays held with its drawing on the page.

`scripts/build-figures.mjs` validates the collection against these rules and publishes it to
`public/figures/<year>/`. `tests/figures.test.mjs` checks the published result, including the rule
that the figure layer must not move the set of scoreable questions.
