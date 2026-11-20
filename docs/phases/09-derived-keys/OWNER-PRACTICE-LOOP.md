# 09 owner practice-verification loop · practise, report, trace, correct

The owner will solve these papers on the site. The loop exists so that what the owner
finds there can be traced back to the evidence that produced the answer, and so that a
correction is a recorded event rather than a quiet edit.

**No telemetry, no accounts, no report button, no feedback backend.** Nothing here
collects data about anyone. The owner writes a short note by hand; a session reads it
and adjudicates it. The owner's friends and any visitor are not measured, tracked or
profiled, and this loop does not create a mechanism for doing that later.

---

## The loop

```
  1  SOLVE            the year produces a key with evidence
        |
  2  OWNER APPROVES   the owner decides what may score, and for which year
        |
  3  INTEGRATE        a separate, later, owner-authorised application phase
        |
  4  OWNER PRACTISES  the owner works the paper on the site
        |
  5  OWNER REPORTS    the owner writes down what looked wrong
        |
  6  TRACE            each report is matched to the evidence for that item
        |
  7  ADJUDICATE       the page decides, the machine check re-runs, a person reads it
        |
  8  CORRECT          the key changes only through a logged correction
        |
  9  PUBLISH          the correction appears in the public log and on the site
```

Steps 4–9 repeat for as long as the owner practises. The loop is cheap because step 5
is a note, not a form.

---

## Step 5 · What the owner writes

A plain note is enough. A file under `editorial/derived-keys/<year>/practice-reports/`,
named `<year>-<date>-<nn>`, for example `2019-2026-11-24-01.md`:

```markdown
# Practice report — JELET 2019 Paper I

Date: 2026-11-24
Where: live site, 2019 paper, practice mode
Key version: the 2019 key published on 2026-11-22

## Q84
The site marked B. My working gives A, and the figure on the page has the load on the
right-hand side. I think the key is wrong.

## Q63
The diagram did not load at all on my phone, but the answer was still marked.

## Q77
Nothing is shown for this one — the page is blank, just an empty space.
```

Three kinds of observation, all legitimate:

- **answer-mismatch** — the key and the owner's working disagree;
- **stem / option / figure wrong** — the paper as published does not match the booklet;
- **scoring anomaly** — the site behaved oddly (an item marked when it should be
  held, a total that does not add up, a missing diagram).

"Everything looked fine" is also a report, and it is worth recording: it is the
evidence that the loop was actually exercised.

---

## Step 6 · Tracing a report to evidence

Every observation is matched against the record for that item:

| The question | The evidence it is checked against |
|---|---|
| Is the key's answer what the key file says? | `<year>-keys.json` → `entries[q = N]` |
| Why was that answer chosen? | `entries[q = N].reasoning`, `.verification`, `.machineCheck` |
| Who else solved it, and did they agree? | `entries[q = N].crossCheck` and the `crossChecks[].records` entry for that question |
| Is this a known dispute? | `disputes[]` — matching `q` |
| Does the booklet actually say this? | `entries[q = N].sourceImage` → the captured page image, and `officialText` |
| What did the site publish for this paper? | the published key's `tier`, `provenance` and `documentRef` |

If the trace cannot be completed for an observation — no entry, no page image, no
source — the observation is still recorded, and the missing trace is itself the
finding. The key is then not fit to be trusted on that item, regardless of what the
owner said.

---

## Step 7 · Adjudication — what actually happens

For each observation, one of five outcomes. Every outcome is written down.

| Outcome | What it means | What changes |
|---|---|---|
| **Owner misread** | The page supports the key | Nothing in the key. The report records the re-derivation so the same question is not re-raised |
| **Key wrong** | The page supports the owner | The item's tier drops to `disputed`, the key file is corrected, and a correction is logged in [`docs/CORRECTIONS.md`](../../../docs/CORRECTIONS.md) with the date, the item, the old value, the new value, the evidence and the tier change |
| **Corpus wrong** | The published question text does not match the booklet | The correction lands in `editorial/`, the future integration regenerates the corpus, and the key is unaffected |
| **Figure unreproduced** | The item's diagram did not reach the reader | The item is held. If it was being scored, it stops being scored and the totals are recomputed |
| **Site behaviour wrong** | The site, not the content, is at fault | A separate application fix, filed against the integration phase. The key is unaffected |

**The published key never changes silently.** Every change to a published key is a
logged correction with a date and an evidence pointer. This is the same convention
the site already follows for the official-keyed papers, and it applies to derived
keys with more force, not less: a derived key has no board behind it, so the record
of how it moved is the only thing that makes it trustworthy.

**A tier can go down as easily as up.** If a `derived-verified` item turns out to be
wrong, it becomes `disputed` and it stops scoring immediately. Nothing in the loop
protects a key from being corrected.

---

## Step 8–9 · Publishing the correction

- The correction is added to [`docs/CORRECTIONS.md`](../../../docs/CORRECTIONS.md),
  which is the public log.
- The key file is updated with a new `status` block and the affected entries. The
  previous version is kept — either by a dated copy in the year folder or by a line
  in the cross-check record naming the previous state. A key that has changed three
  times should be readable as a sequence, not just as its latest state.
- The site's own correction notice points at the same log. An uncertain key leaves
  the scored pool pending verification; it does not stay in it with a quiet label.
- If the correction changes an item's scoreability, the paper's totals and the
  paper's status change with it, and the change is visible.

---

## Why this loop and not something automated

The owner asked for a site he can practise on and correct. An automated feedback
system would answer a question the owner has not asked: who is using this, how often,
which questions they fail, what should the roadmap prioritise next. The project has
no accounts, no analytics and no backend, and this loop does not create a route to
any of them.

A hand-written report is also *better evidence* than a telemetry event. "The diagram
did not load on my phone and the answer was still marked" is a defect report. "12%
of users failed Q63" is a metric about an audience the project does not have and is
not trying to have.

If the owner later wants an in-app "report a problem" link, that is a **separate
decision** with its own gate, its own storage model and its own privacy review — and
it would still not need analytics. Until then, the loop runs on notes.

---

## What the owner gets from the loop

- Confidence that a wrong answer is caught rather than defended.
- A key that gets better the more he practises, with every change traceable.
- A public, honest correction log that shows the key was earned rather than asserted.
- Nothing collected, nothing stored about anyone else, and no feature the site does
  not need.

And the site stays clear, because none of this adds a control, a badge, a filter or
a score to the practice surface. It adds a line in a log.
