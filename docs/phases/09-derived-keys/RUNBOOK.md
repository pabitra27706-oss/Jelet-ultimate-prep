# 09 field guide · one booklet at a time, evidence before answers

The work is a **solving session**, not a coding session. Each task below ends in a
written artifact. If a task cannot produce its artifact, that is the answer — record
the gap and move on. A year with 60 honestly solved questions and 40 honestly held
items is a successful year; a year with 100 confident answers and no evidence is a
failure, however good the answers look.

Everything a session produces goes into
[`editorial/derived-keys/<year>/`](../../../editorial/derived-keys/README.md).
Nothing in `src/`, `scripts/`, `tests/` or `src/data/` is touched.

---

## 09.1 · Pre-flight — establish what is actually in the booklet

**Do:** fetch the official PDF named in the year package. Record the retrieval date,
the exact URL, the printed paper label, the booklet number if printed, the set
symbol, the total marks and the total questions. Then read the **whole** booklet
once, end to end, without solving anything, and record:

- the section map (which subject owns which question range, in the printed order);
- every alternate or stream-specific section that reuses the same question numbers;
- the direction lines that tell a candidate which section applies to them;
- the marking rules as printed (Category-I and Category-II rules, negative marking);
- the page number on which each section begins.

**Acceptance check:** the year package's recorded section map matches the booklet,
or the difference is written down. Every alternate set is listed and marked
out of scope.

**Stop if:** the URL is dead, the PDF is not the booklet named in the package, or
the booklet has no usable text layer. Direct PDF downloads fail with TLS errors in
this sandbox — use `fetch_page`, or ask the owner for rendered page images. Do not
substitute the legacy transcription for the booklet.

> **Trap.** The archived URL `2023111594-1.pdf` is *not* the 2017 booklet — it
> returns JENPAS(UG)-2022. Always take the canonical URL from the
> [WBJEEB old-paper index](https://wbjeeb.nic.in/jelet-old-question-papers/) and
> record the URL you actually fetched.

---

## 09.2 · Page capture and the page map

**Do:** capture one image per printed page and index them by printed page number.
Record, for every question, the printed page it sits on. The `page` field in the key
file is the **printed** page number, not the PDF sheet index.

**Acceptance check:** every question in the year has a page number, and every
captured page is accounted for.

**Note on the text layer.** The text layer is a convenience, never the authority. It
drops artwork, interleaves two-column option blocks with their own stems, and in the
2021 booklet it **omits visible question labels** around Q74, Q76 and Q81 even
though the questions are present. Never conclude that a question is missing because
its label is missing. Never conclude that a question has no options because the
options are images — graphical option sets are real options and they make the item
figure-dependent, not option-less.

---

## 09.3 · Corpus reconciliation — official against the current corpus

**Do:** compare the booklet, item by item, with the corresponding record in
`src/data/papers.json` for that year. Record, in the key file's `reconciliation`
block:

- questions present in the booklet but **absent** from the corpus;
- questions present in the corpus but **absent** from the booklet;
- stems whose wording differs from the corpus;
- options that differ from the corpus, or that the corpus collapsed, truncated or
  paraphrased;
- items whose corpus subject label contradicts the printed section.

**Acceptance check:** the reconciliation block accounts for every question in both
directions. `matched + missingInCorpus + extraInCorpus = 100` (or the booklet's real
count).

**The official page always wins.** Where they differ, the booklet is correct and the
corpus is wrong. Record the difference; **do not edit the corpus in this phase** and
do not edit `archive/jelet-prep/` — it is an immutable, checksum-locked baseline. The
correction lands in `editorial/`, and the corpus is rebuilt from `editorial/` during
the future integration phase.

> **Known trap — 2017 Q83.** The corpus holds a single option for this item whose
> text is the transcriber's own note:
> `(A) e^{\mu\theta} (B) e^{\mu\theta} (C) e^{\mu\theta} (D) e^{\mu\theta}
> (all options same in original? Assuming standard formula)`.
> The booklet's four options are distinct and legible: e^(μ/θ), e^(θ/μ),
> e^(1/(μθ)) and e^(μθ). An item whose options are all identical cannot be solved
> and cannot be scored; the corpus copy is unusable and the booklet copy is the
> real item.

> **Known trap — 2019 Q77 and Q78–79.** Official Q77's stem is blank in the
> booklet, and official Q78 and Q79 are **absent from the corpus**. A blank stem is
> not a solvable item; missing corpus records are not evidence that the booklet
> lacks the questions.

---

## 09.4 · First pass — solve every item from the page image

**Do:** follow [Prompt A of the existing solver protocol](../../../archive/jelet-prep/data/docs/derived-keys/SOLVER-PROMPT.md),
which is already written for this exact purpose and already encodes the right
refusals. Work from the **page image**. Never from the corpus text, and never from
memory of a similar paper.

For each item, record: the answer, the confidence, the reasoning that shows the
actual step, the verification method, and whether the item depends on a figure.

**Acceptance check:** every item in the booklet has a first-pass record, including
the items that came out `UNDETERMINED` or `AMBIGUOUS`. An unanswered item with no
record is a gap; an unanswered item with a recorded refusal is a result.

**Category-II items.** Adjudicate every option A, B, C and D individually. A missed
second correct option is the most common Category-II error in the 2022 precedent,
where it happened repeatedly. Where the booklet does not state the category, say so
and infer it from the printed section; where it cannot be inferred, hold the item.

---

## 09.5 · Attack pass — try to break your own answers

**Do:** follow [Prompt B of the solver protocol](../../../archive/jelet-prep/data/docs/derived-keys/SOLVER-PROMPT.md).
Re-solve every item whose confidence was `medium` or `low`, every Category-II item,
and every item whose reasoning leaned on a "standard result" without showing the
step. Look specifically for:

- a second option that also satisfies the question as printed;
- a unit or scale error that would still select the right letter for the wrong reason;
- a sign, branch or root error;
- a reading that depends on a figure that is not actually in the image;
- an option that is *nearly* right — the intended trap.

**Acceptance check:** every attacked item records what the attack tried and what it
found. An attack that changes nothing still records that it was run.

---

## 09.6 · Independent cross-check — a second solver that has not seen the answers

**Do:** give the same page images to a second, independent solver with **no access to
the first pass**. Record per solver: name, date, input type (page image vs text
layer), and the agree / disagree / undetermined counts.

**A text-layer cross-check is not a cross-check.** It is a disagreement generator. In
the 2022 precedent the text-layer solver was weakest of the three and was used only
that way. Every disagreement is then re-adjudicated by **re-reading the printed
page** — the page decides, never the vote. A majority rule would have made two
items in 2022 undetermined and one item wrong.

**Acceptance check:** every disagreement has an adjudication record naming the page
and the outcome, and every item has a second opinion recorded even when the two
solvers agreed.

**Stop if:** the two solvers disagree on more than about a third of the items. That
is not disagreement about physics — it means the input was not the page image, or
the booklet is not the one you think it is.

---

## 09.7 · Machine checks — compute it, do not assert it

**Do:** where the answer is computable, write a small deterministic script that
computes it, run it, and record the method, the command, the expected value and the
observed value. The script is committed under
`editorial/derived-keys/<year>/checks/` and the entry's `machineCheck.command` is the
exact command that reproduces the recorded `observed`.

The script is **evidence, not application code**. It must not import from `src/` or
`scripts/`, must not touch the corpus, and must not be wired into any build. A
one-file Python or Node script that prints a number is exactly right.

**Not everything can be machine-checked.** "The unit of intensity of sound is" is not
computable; it is checked against a dimensional argument and a standard value. Say so
in `verification` and leave `machineCheck` null. In the 2022 precedent `machineChecked`
was `true` for items where no computation had actually happened; this phase separates
*computed* from *checked another way* and does not let the word "machine" cover both.

**Acceptance check:** every entry has either a `machineCheck` with a committed
reproducible script, or a `verification` that names a check that is not a computation.

---

## 09.8 · Adjudication and tier assignment

**Do:** assign the tier to every item, using the definitions in
[README.md](README.md#two-independent-axes-trust-and-eligibility):

- `derived-verified` — cross-checked, adjudicated, and either machine-checked or
  explicitly checked another way.
- `derived-provisional` — solved with reasoning, but the cross-check has not landed,
  or an expected machine check is missing.
- `disputed` — two defensible options, or an input that cannot be read, or a conflict
  the page does not settle.
- `official` — **not available for these four years.** If a solver writes `official`,
  the record is wrong. Delete it.

Then assign eligibility independently: `eligible` or `held` with a `holdReason`.

**Acceptance check:** every item has a tier and an eligibility, the counts in
`status.tierCounts` match the entries, and no `disputed` item is marked eligible.

**A held item is not a failed item.** "The diagram was not reproduced", "the option
text was illegible", "the printed stem is blank" are all results. They are reported,
they are counted, and they are excluded from scoring and from the denominator of
every total.

---

## 09.9 · Publish the artifacts and hand off

**Do:** write, for the year:

| File | Contents |
|---|---|
| `editorial/derived-keys/<year>/<year>-keys.json` | The machine artifact — [schema](SCHEMA.md) |
| `editorial/derived-keys/<year>/<year>.md` | The human-readable key: a table of question, answer, tier, eligibility, one-line reason, and the page it came from |
| `editorial/derived-keys/<year>/<year>-crosscheck.md` | The cross-check narrative: solvers used, agreement counts, every disagreement and how the page settled it, the disputed list, the held list with reasons |
| `editorial/derived-keys/<year>/<year>-reconciliation.md` | The official-versus-corpus differences, item by item |
| `editorial/derived-keys/<year>/checks/` | The machine-check scripts, when any exist |

**Acceptance check:** the JSON parses, every entry validates against the schema, the
counts in `status` match the entries, the markdown agrees with the JSON, and the
three documents name the booklet, the retrieval date and the source URL.

**Then stop.** Publishing the key does not integrate it. Hand the owner the year
package's summary: how many items were verified, how many are provisional, how many
are held and why, and what the owner has to decide next.

---

## The standing rules

These come from the [editorial collection rules](../../../editorial/README.md) and
the [phase 01 evidence record](../../../docs/phases/01-evidence/README.md), and they
are not negotiable inside a solving session.

1. **The key is the board's, not ours.** A key is used only when the board published
   one. For these four years the board published none, so every answer here is
   labelled derived, with its evidence.
2. **A figure that is not reproduced holds the item.** The item stays readable and
   searchable, keeps its reason, and is excluded from every total.
3. **Nothing is invented.** A stem, an option, a subject, a category, a topic match
   or a scoreable status is either read from the source or derived from a heading the
   source itself states. "The standard answer is" is not a derivation.
4. **The archive is immutable.** Corrections land in `editorial/`, with a pointer back
   to the old item.
5. **Publication rights are separate.** Technical verification does not clear rights.
6. **Accuracy beats completeness.** Saying "I cannot determine this" is a correct
   answer, and it is a result, not a failure.
