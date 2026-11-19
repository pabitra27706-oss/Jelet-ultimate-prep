# Legacy recovery · shelf before scoring

**Why the current library feels empty:** the old site was archived, not migrated. The present `src/content/practice/` exposes one *original* card. The raw [audit JSON](../../../archive/jelet-prep/data/docs/audits/content-audit.json) has 690 parser-detected numbers in seven files; that is not 690 verified, complete, distinct or publishable questions. We should restore discovery without leaking uncleared stems or teaching from a wrong key.

| Source transcription | Detected numbers | Figure placeholders | Public PYQ pages now | Reconciliation priority |
|---|---:|---:|---:|---|
| [2017](../../../archive/jelet-prep/data/pyq-md/2017.md) | 100 | 10 | 0 | Separate historical stream blocks before assigning IDs. |
| [2018](../../../archive/jelet-prep/data/pyq-md/2018.md) | 100 | 10 | 0 | Same number in different streams cannot become the same item. |
| [2019](../../../archive/jelet-prep/data/pyq-md/2019.md) | 98 | 5 | 0 | Title conflict; don't infer year from filename; resolve Q78–79. |
| [2021](../../../archive/jelet-prep/data/pyq-md/2021.md) | 100 | 12 | 0 | Establish stream and figure choices; no current-pattern mock. |
| [2022](../../../archive/jelet-prep/data/pyq-md/2022.md) | 95 | 4 | 0 | Q86–90 missing from transcription. Derived answers ≠ board key. |
| [2024](../../../archive/jelet-prep/data/pyq-md/2024.md) | 97 | 18 | 0 | Q60–62 parser flag is not proof of a short booklet; compare [later verification](../../../archive/jelet-prep/data/docs/audits/OFFICIAL-PAPER-VERIFICATION.md). |
| [2025](../../../archive/jelet-prep/data/pyq-md/2025.md) | 100 | 13 | 0 | Ten individually audited, all held. Other 90 are **not assessed by that review**. |

The [metadata ledger](legacy-index.csv) enumerates these detected records and links ten to the existing audit by identity. Internal locators identify a file and parser number; they are NOT public IDs, verified booklet identities or editorial clearance. `not-item-reviewed-here` means precisely that. The original HTML/other branch data, undetected numbers and repeated historical sections remain comparison sources. Add reconciliation rows when page evidence changes a count; never change the frozen archive to make the totals fit.

### Trace a real item without pretending it shipped

**2025 reference Set A, Q44 →** [printed booklet p.11](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2025/12/202512161802442791.pdf#page=11) (use printed page labels if viewer offsets differ) → [ten-item audit, Q44](../01-evidence/audit-2025.md) → graphical choices missing from transcription → notice records C but no visual/rights sign-off → **held; no student question URL, no grade, no confirmed section link**. A valid key letter is not a valid rendering. Contrast the actual original card `orig-parallel-independent-v1` → `#independent-practice`, not a PYQ and not a replacement for Q44.

### Implementation contract

1. Use the ledger for internal triage. Build a public year shelf from **reviewed bibliographic metadata** and official booklet links, not by publishing the ledger, raw markdown, screenshots, key JSON or archive bundle. Label “Official booklet link; interactive questions not available yet.” No placeholder answer buttons or fake archives.
2. Before a reader page, establish `(year, paper, set, printed section, number)`, stable public ID, permitted text/figure scope and source. Rights-held/missing evidence → source link only when appropriate. Permitted but insufficient key → read-only. Fully checked key, categories and withdrawals → scoreable **only through Phase 04**. Show coverage counts per state; unmatched source records are never silently dropped.
3. Fingerprint stem/options/figure to flag aliases for human review; do not deduplicate solely by year/number or similar OCR. Validate two-way link to the *exact* lesson anchor or label unmapped. Generate share links without answers, selections or private notes. Test both a shared current original and a link-only historical record; never manufacture a cleared PYQ for a screenshot.
