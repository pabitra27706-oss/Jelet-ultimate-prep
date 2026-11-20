# 09 output schema · the key file, the cross-check, the dispute, the report

This is the normative shape of everything phase 09 produces. A key file that does
not validate against it is not publishable.

The schema extends the [2022 derived key](../../../archive/jelet-prep/data/docs/derived-keys/2022-keys.json)
and fixes three gaps in it: the 2022 file defines only two of the four tiers, it has
no field that distinguishes *computed* from *checked another way*, and it has no
per-item record of how faithfully the options were transcribed.

---

## 1 · The key file — `editorial/derived-keys/<year>/<year>-keys.json`

```jsonc
{
  "schemaVersion": "1.0.0",

  "paper": {
    "id": "jelet-et-p1-2017",
    "year": 2017,
    "paperLabel": "JELET-2017 Paper-I (Dip. Engg. & Tech.)",
    "session": "JELET",
    "paperNumber": "Paper I",
    "examBoard": "West Bengal Joint Entrance Examinations Board (WBJEEB)"
  },

  "booklet": {
    "bookletNumber": "80116361",
    "set": null,
    "setSymbol": null,
    "streamSet": "JELET-2017/DIP. ENGG.&TECH.",
    "documentRef": null,
    "sourceUrl": "https://cdnbbsr.s3waas.gov.in/.../2023111594.pdf",
    "sourceFile": "2023111594.pdf",
    "retrievedOn": "2026-11-19",
    "checksum": null
  },

  "provenance": {
    "solvedBy": "<the session that produced this file>",
    "solverModel": "<model name and version, as the solver states it>",
    "date": "2026-11-19",
    "protocol": "docs/phases/09-derived-keys/RUNBOOK.md",
    "decision": "archive/jelet-prep/data/docs/decisions/ADR-0003-derived-answer-keys.md",
    "precedent": "archive/jelet-prep/data/docs/derived-keys/2022-keys.json",
    "markingRule": "Category-I: +1 correct, -1/4 wrong or multi-marked. Category-II: 2 x marked-correct / actual-correct, subset only, no negative.",
    "questionCount": 100,
    "marks": 100
  },

  "tierDefinitions": {
    "official": "Published by the board in a notice, with a document reference and a set/mapping. NOT AVAILABLE for 2017, 2018, 2019 or 2021.",
    "derived-verified": "One solver pass with written reasoning, independently cross-checked by a second solver with no access to the first answer, every disagreement re-adjudicated against the official page, and either machine-checked or explicitly checked by a non-computational method.",
    "derived-provisional": "Solved with written reasoning but not yet independently cross-checked, or cross-checked but missing an expected machine check. Never scores.",
    "disputed": "More than one option is defensible, or an input cannot be read, or two competent readings of the page conflict and the page does not settle it. Never scores and is never board-awarded."
  },

  "scoring": {
    "policy": "ADR-0003: only derived-verified may be scored, and only after explicit owner approval. derived-provisional and disputed never score.",
    "ownerApprovedForScoring": false,
    "integrationGates": {
      "gateA_disputedMappingFixed": false,
      "gateB_setStatedInMetadata": true
    }
  },

  "sectionMap": [
    { "from": 1,  "to": 35,  "subject": "Electrical Technology",     "streamSet": "main" },
    { "from": 36, "to": 55,  "subject": "Computer Application",     "streamSet": "main" },
    { "from": 56, "to": 70,  "subject": "Environmental Engineering","streamSet": "main" },
    { "from": 71, "to": 85,  "subject": "Engineering Mechanics",    "streamSet": "main" },
    { "from": 86, "to": 100, "subject": "Strength of Materials",    "streamSet": "main" }
  ],

  "outOfScopeSets": [
    { "label": "Question Nos. 71-100 for Printing Technology Candidates - Basic Engineering",
      "reason": "A different paper for a different stream. Not carried in the corpus; not keyed here." }
  ],

  "entries": [ /* Entry[], section 2 */ ],
  "crossChecks": [ /* CrossCheck[], section 3 */ ],
  "disputes": [ /* Dispute[], section 4 */ ],
  "reconciliation": { /* Reconciliation, section 5 */ },
  "practiceReports": [ /* PracticeReportRef[], section 6 */ ],
  "status": { /* Status, section 7 */ }
}
```

### Field rules

- `paper.id` matches the corpus paper id for that year. The corpus ids are
  `jelet-et-p1-<year>`; check `src/data/papers.json` rather than assuming.
- `booklet.documentRef` is `null` for these four years. It is not a placeholder to be
  filled in later — it is the proof that no board key exists.
- `booklet.checksum` is the SHA-256 of the downloaded PDF, or `null` if the file
  could not be hashed in the session. Record it when you can.
- `booklet.streamSet` names **the set this key covers**, in the booklet's own words.
  It is the field that stops a reader assuming the alternate stream sections were
  also keyed.
- `provenance.solverModel` is what the solver says it is. Do not guess it, and do not
  write "AI" or a vendor name the solver did not state.
- `scoring.ownerApprovedForScoring` starts `false` and only the owner changes it.
- `scoring.integrationGates.gateA_disputedMappingFixed` stays `false` until the
  loader defect described in [README.md](README.md#two-gates-that-must-be-cleared-before-any-of-this-can-be-scored)
  is fixed in the application. It is not a gate on the key; it is a gate on
  integration, and it is recorded here so that nobody integrates the key without
  seeing it.

---

## 2 · `Entry` — one per question in the booklet

Every question in the booklet has exactly one entry, including the ones that were
held, refused or are missing from the corpus. An entry with no answer is a valid
entry; a missing entry is not.

```jsonc
{
  "q": 72,
  "category": "I",
  "section": "Engineering Mechanics",
  "streamSet": "Engg & Tech/JT3",
  "sourcePage": 15,
  "sourceImage": "pages/p15.png",
  "officialText": "A man and a boy carry a concentrated weight of 300 N ... (A) 0·356 m approx ...",

  "optionFidelity": "verbatim",
  "figure": "none",
  "figureNote": null,

  "answer": ["A"],
  "tier": "derived-verified",
  "confidence": "high",

  "reasoning": "Man bears 200 N, boy 100 N. Taking moments about the boy's shoulder ...",
  "verification": "Moment balance about the boy's end: 300x + 100(1) = 200(2) -> x = 0.6667 m from the man's end; the option that matches the man's share is 0·456 m from the man, i.e. 0·544 m from the boy. Checked against the printed stem's wording, not from memory.",

  "machineCheck": {
    "method": "closed-form moment balance",
    "command": "python3 checks/q72_moment.py",
    "expected": "0.6667 m from the man's end",
    "observed": "0.6666666667 m",
    "pass": true
  },

  "crossCheck": {
    "solver": "<second solver>",
    "verdict": "agree",
    "note": "Agreed on A after independent re-derivation from the page image."
  },

  "scoringEligibility": "eligible",
  "holdReason": null,
  "disputeId": null,
  "note": null,
  "practiceReports": []
}
```

### Enumerations

| Field | Allowed values |
|---|---|
| `category` | `"I"`, `"II"`, `null` (not determinable from the booklet) |
| `optionFidelity` | `"verbatim"` — read straight off the page image; `"text-layer"` — taken from the PDF text layer and confirmed against the image; `"figure-based"` — the options are images (a real option set, but figure-dependent); `"unreproduced"` — the options could not be read; `"transcription-conflict"` — the corpus copy and the booklet disagree and the entry follows the booklet |
| `figure` | `"none"`, `"read-from-image"`, `"unreadable"`, `"not-present"` |
| `answer` | an array of option letters (`["A"]`, `["A","C"]`), or `[]` when no answer was determined, or `null` when the item was refused |
| `tier` | `"official"`, `"derived-verified"`, `"derived-provisional"`, `"disputed"` — `official` is unavailable for these four years |
| `confidence` | `"high"`, `"medium"`, `"low"` |
| `crossCheck.verdict` | `"agree"`, `"disagree"`, `"undetermined"` |
| `scoringEligibility` | `"eligible"`, `"held"` |
| `holdReason` | `null`, `"figure-not-reproduced"`, `"options-not-reproduced"`, `"input-unreadable"`, `"ambiguous-input"`, `"no-approved-tier"`, `"category-undetermined"` |
| `machineCheck` | an object, or `null` |

### Rules

- **`answer` and `tier` travel together.** A `disputed` entry may carry an
  `answer` array (the candidates that were considered) but must also name the
  `disputeId`. A `derived-verified` entry always carries a non-empty `answer`.
- **A held item is still answered.** `scoringEligibility: "held"` with a reason is
  the normal shape for a figure item whose answer was solved but whose figure cannot
  be reproduced for a reader. The answer is kept; the scoring is withheld.
- **`machineCheck.pass` is a fact about the run**, not an opinion. If the script
  printed a different number than `expected`, `pass` is `false` and the entry is
  `disputed` until a human reads the page.
- **`officialText` is the printed text**, copied verbatim, with the mathematics kept
  in the booklet's own notation. It is not a paraphrase and it is not a repair.
- **`sourceImage` is a path inside `editorial/derived-keys/<year>/pages/`**, so a
  reviewer can open the exact page the answer was read from.

---

## 3 · `CrossCheck` — one per independent solver

```jsonc
{
  "solver": "<model name and version>",
  "date": "2026-11-19",
  "input": "page images",
  "method": "Independent re-solve of every item with no access to the first pass's answers.",
  "agreed": 74,
  "disagreed": 26,
  "undetermined": 0,
  "records": [
    {
      "q": 9,
      "firstPass": ["A"],
      "secondPass": ["C"],
      "adjudication": "page-decides",
      "resolution": "e = c/a = 3/2. The first pass computed 3/2 correctly and then recorded the option letter 2.",
      "resolvedOn": "2026-11-19"
    },
    {
      "q": 77,
      "firstPass": [],
      "secondPass": ["B"],
      "adjudication": "page-unreadable",
      "resolution": "The printed stem is blank in the booklet. No answer is defensible; the item is disputed and held.",
      "resolvedOn": "2026-11-19"
    }
  ]
}
```

`adjudication` is one of `"page-decides"`, `"page-unreadable"`, `"solver-wrong"`,
`"first-pass-wrong"`, or `"unresolved"`. An unresolved adjudication is a dispute,
and it must also appear in `disputes`.

---

## 4 · `Dispute` — one per contested item

```jsonc
{
  "id": "D-2019-077",
  "q": 77,
  "candidates": [],
  "reason": "The printed stem is blank in the official booklet. No question is visible to answer.",
  "raisedBy": "first-pass solver",
  "status": "open",
  "resolution": null,
  "evidence": ["pages/p22.png", "<year>-crosscheck.md#q77"],
  "resolvedOn": null
}
```

`status` is `"open"` or `"resolved"`. A dispute is closed only when a specific
person re-read the page and wrote down what the page says. A majority of solvers
does not close a dispute; a page does.

---

## 5 · `Reconciliation` — official against the corpus

```jsonc
{
  "corpusCompared": "src/data/papers.json",
  "corpusYear": 2019,
  "bookletQuestionCount": 100,
  "corpusQuestionCount": 98,
  "matched": 94,
  "missingInCorpus": [ { "q": 78, "section": "Engineering Mechanics", "note": "Present in the booklet, absent from the corpus." } ],
  "extraInCorpus": [],
  "stemDifferences": [ { "q": 12, "corpus": "...", "booklet": "...", "resolution": "booklet wins" } ],
  "optionDifferences": [ { "q": 83, "corpus": "<the transcriber's placeholder>", "booklet": "e^(μ/θ), e^(θ/μ), e^(1/(μθ)), e^(μθ)", "resolution": "booklet wins; the corpus copy is unusable" } ],
  "subjectLabelConflicts": [ { "q": 60, "corpus": "Computer & IT", "booklet": "Environmental Engineering", "resolution": "booklet wins" } ]
}
```

The counts must add up: `matched + missingInCorpus + extraInCorpus =
bookletQuestionCount`.

---

## 6 · `PracticeReportRef` and the report file

Reports are written by the owner, by hand, during practice. They live in
`editorial/derived-keys/<year>/practice-reports/` — one file per report. **No
in-app report button, no account, no server, no telemetry.** See
[OWNER-PRACTICE-LOOP.md](OWNER-PRACTICE-LOOP.md).

```jsonc
{
  "id": "2019-2026-11-24-01",
  "file": "practice-reports/2019-2026-11-24-01.json",
  "reportedBy": "owner",
  "reportedOn": "2026-11-24",
  "observationCount": 2,
  "adjudicationStatus": "pending"
}
```

The report file itself:

```jsonc
{
  "id": "2019-2026-11-24-01",
  "paper": "jelet-et-p1-2019",
  "reportedBy": "owner",
  "reportedOn": "2026-11-24",
  "channel": "owner practice on the live site",
  "keyVersionAtReport": "<the key file's status.checksum or revision>",
  "observations": [
    {
      "q": 84,
      "type": "answer-mismatch",
      "ownerSaid": "The site marked B but my working gives A, and the page figure shows the load on the right.",
      "keyTierAtTime": "derived-verified",
      "expectedFromKey": ["A"],
      "evidenceRefs": ["2019-keys.json#entries[q=84]", "2019-crosscheck.md#q84", "pages/p23.png"],
      "adjudication": "pending"
    }
  ],
  "adjudicationSummary": null
}
```

**Traceability requirement.** Every observation carries the question number, the tier
the key held **at the time of the report**, and at least one `evidenceRefs` pointer
into the key file, the cross-check record or the page images. That is what makes a
report traceable back to the evidence that justified the answer it disputes.

`type` is one of `"answer-mismatch"`, `"stem-wrong"`, `"option-wrong"`,
`"figure-wrong"`, `"missing-question"`, `"scoring-anomaly"`, `"other"`.

---

## 7 · `Status` — the summary the owner reads first

```jsonc
{
  "tierCounts": { "official": 0, "derived-verified": 78, "derived-provisional": 14, "disputed": 8 },
  "eligibleCount": 79,
  "heldCount": 21,
  "heldReasons": { "figure-not-reproduced": 9, "options-not-reproduced": 1, "input-unreadable": 3, "ambiguous-input": 4, "no-approved-tier": 4 },
  "disputedCount": 8,
  "openDisputes": 3,
  "machineCheckedCount": 61,
  "crossCheckedCount": 100,
  "unresolved": [ { "q": 77, "why": "blank printed stem" } ],
  "readyForOwnerReview": true
}
```

`readyForOwnerReview` is `true` when every question has a tier, every entry has an
eligibility, and the counts match. It is **not** a claim that the key is correct —
it says the key is complete and honest about itself.

---

## 8 · Validation

The key file must satisfy, at minimum:

1. It is valid JSON.
2. `paper.year` matches the directory name and `booklet.sourceUrl` points at the
   booklet named in the year package.
3. `tierDefinitions` defines all four tiers.
4. Every entry's `q` is unique and within the booklet's question range.
5. Every entry has a tier from the allowed set, and `official` never appears.
6. Every entry has a `scoringEligibility`, and every `held` entry has a
   `holdReason` other than `null`.
7. Every `disputed` entry names a `disputeId` that exists in `disputes`.
8. Every `derived-verified` entry has a non-empty `answer` and a `crossCheck`.
9. Every `machineCheck` with `pass: true` names a script that exists under
   `checks/`.
10. `status.tierCounts` sums to the number of entries.
11. `reconciliation` counts add up to the booklet's question count.
12. Every `practiceReports` entry names a file that exists.

Write this as a throwaway script inside the year's own folder when you produce the
key. It is evidence, not application code, and it does not belong in `scripts/`.
