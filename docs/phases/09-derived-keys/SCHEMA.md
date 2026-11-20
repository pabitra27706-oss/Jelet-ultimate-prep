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
    "markingRule": "Category-I only: +1 correct; -1/4 for a wrong answer or more than one marked. As printed in all four booklets. 100 questions x 1 mark = Full Marks 100, so no two-mark category can exist in these papers.",
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
    { "from": 1,  "to": 20,  "subject": "Mathematics",               "streamSet": "main" },
    { "from": 21, "to": 35,  "subject": "Electrical Technology",     "streamSet": "main" },
    { "from": 36, "to": 55,  "subject": "Computer Application",     "streamSet": "main" },
    { "from": 56, "to": 70,  "subject": "Environmental Engineering","streamSet": "main" },
    { "from": 71, "to": 85,  "subject": "Engineering Mechanics",    "streamSet": "main" },
    { "from": 86, "to": 100, "subject": "Strength of Materials",    "streamSet": "main" }
  ],

  "outOfScopeSets": [
    { "label": "Question Nos. 71-100 for Printing Technology Candidates - Basic Engineering",
      "reason": "A different paper for a different stream. Not carried in the corpus; not keyed here." },
    { "label": "Question Nos. 71-100 for Agricultural Engineering Candidates - Farm Machinery & Power onwards",
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
- `booklet.documentRef` is `null` for these four years: no answer-key notice for them
  was found in the Board's key archive. `null` records that **absence of a located
  reference**, and nothing more — it is not proof that the Board never published a key,
  and it must never be cited as such. If a notice is later found, the field takes its
  document reference and the tier question reopens.
- `booklet.checksum` is the SHA-256 of the downloaded PDF, or `null` if the file
  could not be hashed in the session. Record it when you can.
- `sectionMap` is transcribed from the booklet's own printed headings, one row per
  heading, including a Mathematics row where the booklet has one. It is never copied
  from another year or from the corpus: every year's map is read at pre-flight.
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
  "officialText": "A man and a boy carry a concentrated weight of 300 N by means of a uniform pole of 2 m length and weight of 100 N. They carry the pole on their shoulders at the ends of the pole. Where the weight must be placed (distance from the man end) so that the man may bear twice of that the boy has to carry? (A) 0·356 m approx (B) 0·456 m approx (C) 0·556 m approx (D) 0·656 m approx",

  "optionFidelity": "verbatim",
  "figure": "none",
  "figureNote": null,

  "answer": ["C"],
  "tier": "derived-verified",
  "confidence": "high",

  "reasoning": "Total load carried is the 300 N weight plus the pole's own 100 N = 400 N, shared man:boy = 2:1, so the boy carries 400/3 N and the man 800/3 N. The pole's weight acts at its midpoint, 1 m from each end. Moments about the boy's end, with x the load's distance from the man's end: (man's reaction) x 2 = weight x (2 - x) + (pole weight) x 1.",
  "verification": "(800/3)(2) = 300(2 - x) + 100(1) -> 1600/3 = 700 - 300x -> 300x = 500/3 -> x = 5/9 = 0.5556 m from the man's end, i.e. option C (0.556 m approx). Counter-check about the man's end: (400/3)(2) = 800/3 = 300x + 100 -> 300x = 500/3, same x. Distances close to the pole's length: 0.5556 + 1.4444 = 2 m.",

  "machineCheck": {
    "method": "closed-form moment balance",
    "command": "python3 checks/q72_moment.py",
    "expected": "5/9 m = 0.5555555556 m from the man's end (option C)",
    "observed": "0.5555555556 m",
    "pass": true
  },

  "crossCheck": {
    "solver": "<second solver>",
    "verdict": "agree",
    "note": "Agreed on A after independent re-derivation from the page image."
  },

  "scoringEligibility": "held",
  "holdReason": "no-approved-tier",
  "disputeId": null,
  "note": "Illustrative record. The answer is solved and verified, but the top-level scoring policy has ownerApprovedForScoring = false, so the item is held with no-approved-tier: a held item is still an answered item.",
  "practiceReports": []
}
```

Three things this example is deliberately demonstrating, because a schema example is read
as the truth about shape:

- **The pole's own weight counts.** A solver who ignores the 100 N of pole gets boy 100 /
  man 200 and then cannot make the numbers close; the error this example was written to
  catch is exactly that one.
- **`machineCheck` agrees with `verification`.** An `expected` of 0·6667 m beside a
  `pass: true` would be a false pass. Expected and observed are both 5/9 m.
- **Verified is not the same as scoreable.** The entry is `derived-verified` *and*
  `held`, which is the normal shape while ADR-0003 is still `PROPOSED`.

The page number and image path above are placeholders: they must point at the capture the
answer was actually read from, and 2018's page map comes from the booklet, not from this
document.

### Enumerations

| Field | Allowed values |
|---|---|
| `category` | `"I"`, `"II"`, `null` (not determinable from the booklet). **`"II"` is unreachable for these four years**: each booklet prints one marking rule (+1 / −¼) and 100 questions totalling Full Marks 100, so a two-mark rule would break the paper's own arithmetic. The value is kept for any future year that prints one |
| `optionFidelity` | `"verbatim"` — read straight off the page image; `"text-layer"` — taken from the PDF text layer and confirmed against the image; `"corpus-text-unverified"` — taken from the corpus copy and **not** checked against any page image (the only fidelity available to a text-layer session); `"figure-based"` — the options are images (a real option set, but figure-dependent); `"unreproduced"` — the options could not be read; `"transcription-conflict"` — the corpus copy and the booklet disagree and the entry follows the booklet |
| `figure` | `"none"`, `"unverified"`, `"read-from-image"`, `"unreadable"`, `"not-present"` — `"unverified"` means the corpus says figure-free but no page image has confirmed it |
| `answer` | an array of option letters (`["A"]`, `["A","C"]`), or `[]` when no answer was determined, or `null` when the item was refused |
| `tier` | `"official"`, `"derived-verified"`, `"derived-provisional"`, `"disputed"`, `"unsolved"` — `official` is unavailable for these four years; `unsolved` means no answer was attempted (see Amendment 1.1.0) |
| `confidence` | `"high"`, `"medium"`, `"low"` |
| `crossCheck.verdict` | `"agree"`, `"disagree"`, `"undetermined"` |
| `scoringEligibility` | `"eligible"`, `"held"` |
| `holdReason` | `null`, `"figure-not-reproduced"`, `"options-not-reproduced"`, `"input-unreadable"`, `"ambiguous-input"`, `"no-approved-tier"`, `"category-undetermined"`, `"corpus-defect"`, `"not-yet-solved"`, `"absent-from-corpus"`, `"outside-authorized-subset"` |
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
  "id": "D-2019-090",
  "q": 90,
  "candidates": [],
  "reason": "Both the stem and all four options are printed as drawings. The answer can be reasoned out, but the item cannot be presented to a reader without re-drawing the figure, so it is held rather than scored.",
  "raisedBy": "first-pass solver",
  "status": "open",
  "resolution": null,
  "evidence": ["pages/p20.png", "2019-crosscheck.md#q90"],
  "resolvedOn": null
}
```

`status` is `"open"` or `"resolved"`. A dispute is closed only when a specific
person re-read the page and wrote down what the page says.

> **Corrected example (2026-11-20).** This slot used to show `D-2019-077` with the
> reason "the printed stem is blank in the official booklet". That reason is false: the
> 2019 booklet prints Q77 in full, and the blank field is a *corpus* record, not a
> printed page. A dispute raised on a claim that turned out to be a transcription
> artefact is exactly the kind of thing this record exists to prevent, so the example is
> now a real held item with a real reason. A majority of solvers
does not close a dispute; a page does.

---

## 5 · `Reconciliation` — official against the corpus

```jsonc
{
  "corpusCompared": "src/data/papers.json",
  "corpusYear": 2019,
  "bookletQuestionCount": 100,
  "corpusQuestionCount": 98,
  "matched": 98,
  "missingInCorpus": [
    { "q": 78, "section": "Engineering Mechanics", "note": "Present in the booklet, absent from the corpus." },
    { "q": 79, "section": "Engineering Mechanics", "note": "Present in the booklet, absent from the corpus." }
  ],
  "extraInCorpus": [],
  "stemDifferences": [
    { "q": 41, "corpus": "The equivalent binary number of (0.875)10", "booklet": "The equivalent binary number of (0.6975)10", "resolution": "booklet wins; the corpus stem was substituted" },
    { "q": 77, "corpus": "empty record: no stem, no options", "booklet": "a numbered figure item about a block toppling before it slips", "resolution": "booklet wins; the corpus record is a placeholder" }
  ],
  "optionDifferences": [
    { "q": 73, "corpus": "(B) and (D) both (P1+P2)/2cos θ", "booklet": "(B) (P1+P2)cos θ/2, (D) (P1+P2)/2cos θ", "resolution": "booklet wins; one printed option was lost and another duplicated" },
    { "q": 87, "corpus": "1:2, 5:8, 7:12, 3:4", "booklet": "1:2, 2:3, 5:8, 7:12", "resolution": "booklet wins; a printed option was dropped and an unprinted one invented" }
  ],
  "subjectLabelConflicts": [ { "q": 60, "corpus": "Computer & IT", "booklet": "Environmental Engineering", "resolution": "booklet wins" } ]
}
```

The counts must add up **two ways**, because the booklet and the corpus are two
different sets:

```
matched + |missingInCorpus| = bookletQuestionCount      (booklet accounting)
matched + |extraInCorpus|   = corpusQuestionCount       (corpus accounting)
```

`extraInCorpus` are questions the corpus has and the booklet does not; they cannot belong
to the booklet's total. Writing one equation over both sets is the mistake to avoid.
For the example above: 98 + 2 = 100 booklet items, and 98 + 0 = 98 corpus records.

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
  "observationCount": 1,
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
  "tierCounts": { "official": 0, "derived-verified": 68, "derived-provisional": 20, "disputed": 12 },
  "eligibleCount": 0,
  "heldCount": 100,
  "heldReasons": { "figure-not-reproduced": 8, "options-not-reproduced": 2, "input-unreadable": 2, "ambiguous-input": 4, "no-approved-tier": 84 },
  "disputedCount": 12,
  "openDisputes": 4,
  "machineCheckedCount": 61,
  "crossCheckedCount": 100,
  "unresolved": [ { "q": 90, "why": "options are printed drawings; held until the page can be reproduced" } ],
  "readyForOwnerReview": true
}
```

Three invariants a `Status` block must satisfy, and the ones the earlier example broke:

```
official + derived-verified + derived-provisional + disputed + unsolved = questionCount
eligibleCount + heldCount                                    = questionCount
eligibleCount <= derived-verified      (only verified may ever be eligible)
sum(heldReasons) = heldCount
```

While `scoring.ownerApprovedForScoring` is `false`, **`eligibleCount` is 0** — every item
is held, most of them for `no-approved-tier`. The previous version of this example showed
79 eligible out of 78 verified, which is impossible under these rules, and 21 holds
against 14 provisional + 8 disputed = 22 items that could never be eligible.

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

---

## Amendment 1.1.0 — 2026-11-20 · the authorised text-layer slice

**Why.** No page image can be produced in this sandbox: the Board's CDN refuses a direct
download and the reader returns text only. On 2026-11-20 the owner authorised a
**text-layer-only subset, solved as `derived-provisional`, for all four years** — the same
decision the phase had been waiting for since its first pre-flight. This amendment records
what that authorisation needed from the schema, and nothing else.

**Added values, each with its meaning pinned down:**

| Field | New value | Means | Does **not** mean |
|---|---|---|---|
| `tier` | `"unsolved"` | no answer attempted in this session: outside the slice, figure-dependent, or a documented corpus defect | "the answer is unknowable" |
| `optionFidelity` | `"corpus-text-unverified"` | the text came from `src/data/papers.json` and was not checked against a page | that the corpus is right |
| `figure` | `"unverified"` | the corpus says figure-free; no page has confirmed it | that the printed item has no figure |
| `holdReason` | `"corpus-defect"` | the corpus copy is known or suspected to be wrong for this item | that the printed item is defective |
| `holdReason` | `"not-yet-solved"` | inside the authorised slice, batch not yet run | that it will be solved |
| `holdReason` | `"absent-from-corpus"` | the booklet prints it; the corpus has no record (2019 Q78, Q79) | that it cannot be solved |
| `holdReason` | `"outside-authorized-subset"` | excluded by `scripts/derived-key-subset.mjs` for a reason given in the entry's `note` | a blanket excuse |

**Hard limits that the authorisation does not lift:**

1. **`derived-verified` remains impossible without a page image.** A text-layer session
   cannot produce it, and no entry may be promoted by asserting that the corpus "looks
   right".
2. **`scoringEligibility` stays `held` for every entry**, because the scoring policy still
   requires owner approval of a verified tier. `eligibleCount` is therefore 0.
3. **The subset is computed, not chosen.** `scripts/derived-key-subset.mjs` derives it from
   the corpus plus each year's documented defect list; an item cannot be added to the slice
   by argument at solve time, only by changing the script in a reviewable commit.
4. **The validator is the gate.** `node scripts/validate-keys.mjs` must pass; it enforces
   the enums above, the tier↔answer and eligibility couplings, the two reconciliation
   equations, and the `Status` invariants.

With `unsolved` added, the tier identity becomes
`official + derived-verified + derived-provisional + disputed + unsolved = questionCount`,
and `eligibleCount + heldCount = questionCount` is unaffected.
