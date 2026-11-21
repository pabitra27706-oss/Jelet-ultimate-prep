# Original-paper access — 2026-11-20

Owner requested direct question-bank access because generated ZIP downloads were unusable. This bounded UI change adds an Original paper & diagrams panel to all eight library paper readers, linking to the board-hosted PDFs and the board's index. It does not attach individual crops, copy private PDFs into public assets, change keys, promote held items, or complete the answer audit. The 2023 SVG reconstruction layer is unchanged.

References use the official index URLs preserved during the preceding intake. Remote PDFs were not fetched or availability-tested in this turn: the sandbox outbound allowlist does not include their host. Browser behaviour may be an external PDF viewer or a download; the component explicitly says this and provides the index fallback. There is no external request until the user chooses a link. External originals require internet and are not included in offline packs.

Changed: OriginalPaper.astro, original-papers.mjs, library/[paper].astro, mapping tests, library browser regression, package test wiring, regenerated packs metadata. User-supplied scans remain excluded from publication. No new runtime dependency or cost.

Observed checks:
- Three mapping tests, nineteen rules tests and sixteen safety tests passed (38 total).
- Astro check: zero errors/warnings/hints; build: 58 pages, success. Default Node 22.22.3 was rejected by Astro, so check/build ran with temporary npm-provided Node 22.23.4; project dependencies unchanged.
- Full browser suite: 51 passed on Chromium 153.0.8010.0, including all eight original-paper panels at 390px width, correct external href/target, no embedded scan and no horizontal overflow.
- No physical Android/external PDF navigation check or deployment performed. These are source references, not verified question-level image mappings.

No commit, push or merge. This does not advance phase 10 answer-audit completion or authorise phase 11 key integration.
