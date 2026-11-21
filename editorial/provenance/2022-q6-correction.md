# JELET 2022 Q6 — determinant transcription correction

## Authorisation and source

Continuation of the owner's requested question-paper corrections. Owner supplied `Screenshot_20261121_013702_Drive.jpg`, identifying **2022 Q6, printed page 4**. The image shows the complete determinant, equation and four numeric options.

Screenshot SHA-256: `a792fe0fa2df7345f6c1223d6bebcaf363bc35b0b0f983a6537d8b067033914b`.

The private source is not published. No remote retrieval or OCR was needed. The previously supplied PDF is `2023111591-3.pdf`; its intake hash is recorded in the upload manifest. Page attribution is supplied by the owner and agrees with the earlier PDF inspection. Screenshot filenames are not used to infer the date.

## Exact correction

`editorial/pyq-md/2022.md` copies the immutable archived 2022 transcription, replacing only Q6's `[Equation given as image]` placeholder with the equation:

\[
\begin{vmatrix}
a^2 & -ab & -ac\\
-ab & b^2 & -bc\\
ca & bc & -c^2
\end{vmatrix}=Ka^2b^2c^2.
\]

The third-row first two entries are **positive ca and bc**, as printed. The determinant is rendered as accessible typeset mathematics, not an SVG or screenshot. Options remain A: 1, B: 2, C: 3, D: 4.

## Safety and verification

- All 792 existing records compared before/after: only Q6's stem changed; all options, keys, figure flags, option completeness, scoring eligibility and board awards remain unchanged. Q6's obsolete missing-equation note is cleared.
- Q6 was already scoreable with derived key label D. This correction does not promote a key, supply an official answer key or independently verify the answer. The missing-stem defect is resolved; the existing derived-key tier and its limits remain.
- Archive untouched; no changes to other questions' wording.
- Astro check/build passed, 58 pages. Final full test suite: 260 passed, including 54 browser tests. Separate 2023 regression suite: 22 passed.
- Regression tests preserve every signed matrix entry and verify the rendered matrix, absence of a KaTeX error or missing-image note, existing scoreability and phone-width overflow.
- No independent second content review, physical Android test or new rights determination. Owner-authorised source correction; inherited content-rights uncertainty remains unresolved.

No commit, push, merge or deployment. Other recorded transcription issues remain separate.
