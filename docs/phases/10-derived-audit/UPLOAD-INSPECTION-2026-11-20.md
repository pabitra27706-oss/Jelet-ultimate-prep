# Owner-supplied PDF intake — 2026-11-20

## Outcome

Seven files received, 32,230,561 bytes total. All opened without encryption and all **183 PDF sheets rendered successfully** using local PyMuPDF. Checksums are in [UPLOAD-MANIFEST-2026-11-20.json](UPLOAD-MANIFEST-2026-11-20.json). They identify the supplied bytes, not an independent match to publisher downloads.

The owner explicitly authorised inspection of the uploaded PDFs, superseding the earlier no-render restriction for these supplied files. No booklet was downloaded from the web, no OCR was run, and no diagram was reconstructed. Rendering displayed the existing pages.

## File checks

| Year | Filename | PDF sheets | Sheets yielding embedded text | Cover finding |
|---|---|---:|---:|---|
| 2017 | 2023111594.pdf | 32 | 0 | Engineering/Technology; booklet 80116361; 100 marks |
| 2018 | 2023111538-1.pdf | 32 | 0 | Engineering/Technology; **booklet 88115903**; 100 marks |
| 2019 | 2023111582-1.pdf | 22 | 0 | Engineering/Technology; 100 marks; OFFICE COPY watermark |
| 2021 | 2023111536-1.pdf | 24 | 0 | Engineering/Technology; booklet 1091007537; 100 marks |
| 2022 | 2023111591-3.pdf | 24 | 0 | Paper I; Series A; booklet 2091013057; 100 MCQs, 120 marks |
| 2024 | 2024120234.pdf | 24 | 0 | Paper I; booklet 4091010805; 100 MCQs, 120 marks |
| 2025 | 202512161802442791.pdf | 25 | 13 | Paper I; Series A; 100 MCQs, 120 marks |

All seven covers state two hours. Cover instructions distinguish the older single-correct 1-mark papers from the Category-I/Category-II rules printed on the 2022/2024/2025 covers. This intake does not independently recount every year's categories or certify every marking implementation.

## Visual findings and limits

- **2018 booklet number is visible.** Previous capture-based uncertainty is now resolvable: the supplied cover shows 88115903. Do not describe this upload as having no printed booklet number.
- **2019 and 2025 sheet index differs from printed pagination.** In both, PDF sheet 2 shows printed page 3. The final 2019 sheet (22) shows printed page 23/Q97–100; final 2025 sheet (25) shows printed page 26/Q96–100. Maintain separate sheet and printed-page fields; this difference alone does not prove a question is missing.
- 2018 PDF sheet 31 includes the Agricultural tail Q95–100; sheet 32 is rough work. The old 30-sheet capture limit is no longer a reason to omit this tail.
- 2021 sheet 23 shows the Agricultural tail through Q100; sheet 24 is rough work. It must not be confused with the main Engineering stream.
- 2022 and 2024 sheet 23 visibly includes Q96–100 and circuit diagrams.
- 2025 sheet 25 visibly includes Q96–100. Partial embedded text is not a full transcription; visual verification remains necessary.
- The complete 2017 PDF was visually inspected in the preceding turn. This intake visually inspected covers and selected early/late pages of the other six files; **rendering all 183 sheets is not the same as reading every question or every diagram**. Completeness and fine-symbol fidelity for the six other files remain item-audit work.
- No 2023 PDF was supplied in this batch.

## Temporary GitHub upload attempt

Used `gh release create --draft` to attempt removable asset storage, targeted at current HEAD b546c8b249b22ad5806f40e611f0362bd07959cb. No branch switched or pushed.

The draft was created as release 452876822, but uploads to `uploads.github.com` failed with EOF. A follow-up API inspection showed **zero assets**. The empty draft `audit-upload-2026-11-20-a05b85e3` was deleted with `gh release delete`; the subsequent release list was empty. **No PDF was uploaded to GitHub.** No permanent Git commit was substituted for the requested temporary storage.

## Local retention

Byte-identical copies are retained in `private-audit-inputs/2026-11-20/`, explicitly excluded by `.gitignore`. All seven SHA-256 hashes were checked again after copying. This is workspace storage, not a remote backup or a guarantee of indefinite retention. The owner should keep the originals. The PDFs and rendered pages are not website assets and are not to be committed or published by default.

Only this report, its metadata manifest and the ignore rule are repository changes for this intake. Answers, scoring, PR #9 and the published site were not changed. The next audit can use the local PDFs without needing individual screenshots.
