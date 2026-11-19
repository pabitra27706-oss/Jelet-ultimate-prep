# 03 field guide · from a shared question to its teaching paragraph and back

Use [UI routing and privacy contract](../../UI_REFERENCE.md) and [storage contract](../../ARCHITECTURE.md). Take one approved question through the complete path before bulk import.

| Task | Build slice | Counterexample to test |
|---|---|---|
| 03.1 Identity/reader | Stable public ID distinct from printed number. Show source, year, paper, set, category, figure and answer status. Generate lesson backlinks from reviewed forward links. Restore location/filters on Back. | Two streams reuse Q72: links must not collide. If no relevant section exists, display “not mapped” instead of opening a generic chapter. |
| 03.2 Search/share | Build local index; group lessons, questions and sheets. Default share has no spoiler; explicit reviewed-solution variant. Support system share, clipboard and selectable-text fallback. | Fresh device, direct project-subpath URL, no account. Shared payload contains no bookmark, note or choice. |
| 03.3 Photo discovery | Explain Lens outside the site → copy text → paste → confirm candidate using year/number. Offer filter search; no file upload or AI key. | OCR confuses an exponent or graph has no useful text: return alternatives or no match, not an asserted answer. |
| 03.4 Workspace | Bookmark, note, resume, export; validate version, IDs and types before import preview. Confirm merge/replace/reset; report partial or failed persistence. | Bad file, cancel, storage denied and same export twice: no silent overwrite or duplicate. Do not claim legacy migration without an approved sample. |
| 03.5 Release check | Check actual deep links, reader on narrow screen and answer-free share text; verify every mapping target exists and review sample relevance. | Build passes but a pasted URL returns 404: release gate fails. No deployment without explicit authorization. |

**Evidence:** ID/mapping checks, candidate-search outcomes and export/restore result using synthetic data; redacted phone checks and release status. No copied user backups or Lens images in the report.
