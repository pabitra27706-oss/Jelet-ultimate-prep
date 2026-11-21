# JELET 2025 Q95 — current-label transcription correction

## Source and page attribution

Owner supplied `Screenshot_20261121_014545_Drive.jpg`, identifying 2025 Q95 and describing PDF viewer page 24, the penultimate page. No resend is required. The screenshot has no page footer. Previous inspection of the supplied 25-sheet PDF `202512161802442791.pdf` recorded Q95 on PDF sheet 24 / printed page 25; those two identifiers remain separate. The screenshot alone does not verify the printed footer.

Screenshot SHA-256: `6a94344d1e9a1dc78fbbbc073061b6d0dee590fefa41ddfd5680c1c50d883511`.

## Correction and limits

`editorial/pyq-md/2025.md` copies the immutable archived paper and changes only Q95's block. Restores the complete source stem naming currents I, I1 and I2, asking when I1, I2 and I are in phase, with frequency 50 Hz. Removes the erroneous I3. Option D's abbreviated “None” is restored to “None of these”. Mathematical options A–C are unchanged. The explicit diagram marker is retained for parser safety.

The previously reconstructed circuit already matches the source labels and topology: total I splits into I1 through R1/L1 and I2 through R2/L2. No visual changes to it were needed; only its provenance note now records the stem correction as completed. Official pixels are not published.

All 792 records compared before/after: keys, scoring eligibility, board awards, figure flags and option completeness unchanged. Only Q95 stem/D wording changed; all other questions' stems/options unchanged. Existing key B is retained, and Q95 remains unscored. This is not an answer-key verification or scoring promotion.

The fuller source wording causes the existing topic classifier to recognise Q95: mapped count 349 → 350, unmapped 183 → 182, outside syllabus 260. Coverage delta regenerated; no held question was unlocked and covered topics remain 40/42.

## Verification

- Astro check/build passed, 58 pages.
- Full suite: 264 passed; separate 2023 regression suite: 22 passed.
- Unit regression verifies exact stem, no I3, option D, key/hold, circuit attachment and separate page identifiers.
- Browser regression verifies visible corrected text, math without KaTeX errors, circuit attachment and continued scoring hold.
- Initial full-suite run identified a stale coverage-delta count; regenerated the report and reran the full suite successfully.
- Content, figure and topic freshness checks and Git whitespace checks passed; archive unchanged.
- No independent second content review, physical Android test or new rights determination. Residual publication-rights uncertainty remains.

All seven specifically recorded question-transcription issues are now corrected locally. This is not exhaustive whole-paper certification; broader 2019 page-provenance review and release requirements remain separate. No commit, push, merge or deployment.
