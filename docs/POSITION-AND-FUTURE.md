# Where the project stands, and where it can go

**2026-11-19.** A description of the present and a considered view of the future.
Nothing here changes the site; it is a record of what the site currently *is* and of
the directions that are open. The authoritative status stays in the
[roadmap](ROADMAP.md) and the decisions in [DECISIONS.md](DECISIONS.md).

---

## Present

### What exists

A static site, published at
`https://pabitraw27706-oss.github.io/Jelet-ultimate-prep/`, carrying a corpus of
**790 previous-exam questions across eight JELET Paper-I papers**, with the live
sheets, a search index, a timed mock, a reconciliation ledger, a subject drill, a
mistake queue, versioned offline packs, a coverage dashboard and a full manual
backup of the learner's own study record.

| Paper | Key | State |
|---|---|---|
| 2022 | **derived** (2022 precedent: 82 verified, 18 provisional) | 95 questions, 87 scoreable — 13 of them provisional — 8 held |
| 2023 | **official** (board notice `JEEB/Reg-267/23`, Set A) | 86 scoreable, 4 board-awarded, 10 held, 90 rehearsable |
| 2024 | **official** (`WBE/Ex-71`) | 97 questions, 78 scoreable, 2 board-awarded, 17 held |
| 2025 | **official** (`JEEB/Reg-171/25`) | 100 questions, 82 scoreable, 3 board-awarded, 15 held |
| 2026 | **official** (`JEEB/Reg-96/26`) | Key published; the paper itself is not yet in the corpus |
| **2017, 2018, 2019, 2021** | **none published by the board** | Read only. No key, no scoring, no drill |

The board published model and final keys for JELET 2023 through 2026. It published
none for 2017, 2018, 2019 or 2021, and it has not since. Those four years are
therefore read-only in the site today, and the questions are the majority of what
makes the corpus useful for a reader who wants to practise.

Alongside the paper work there is a teaching path: the parallel-circuits chapter is
authored and published with original worked variants, the 2023 paper carries eleven
reconstructed SVG figures built to ADR-0002 (original vector primitives, explicit
provenance, text equivalents, and **no effect on scoring**), and the syllabus
coverage dashboard shows a measured gap rather than a claim — 40 of 42 topics
covered, 258 questions outside the current 2026 syllabus.

### What it is for, in order

1. **The owner.** This is a preparation tool for one person preparing for JELET
   Paper I. Everything is measured against that: is it right, is it fast on a
   mid-range Android phone, does it work on a patchy connection, does it cost
   nothing to run.
2. **Friends.** The same site, shared. It has to be good enough that a friend
   practises on it without the owner explaining it first, and honest enough that it
   does not embarrass them.
3. **Whoever finds it online.** A stranger with no context, at any hour, from a
   search engine. The site has to make sense on its own, work without an account,
   and never claim more than it can support.

The order is not a ranking of importance. It is the order in which a change is
allowed to complicate things: the owner's needs may add features; a friend's needs
may add clarity; a stranger's needs may add neither, but they may **remove**
something that would confuse.

### What is deliberately absent, and stays absent

There is no account system, no sign-in, no server-side database, no analytics, no
telemetry, no event tracking, no A/B testing, no feedback form, no comment system,
no notification service, no live tutor, no sync service, and no paid dependency of
any kind. The site is static; the running cost is zero; the learner needs no
account; the owner needs no server.

This is not an oversight awaiting a feature request. It is the design:

- **No analytics.** The project does not know who uses the site, how often, or which
  questions they fail, and it does not need to. Every roadmap priority so far came
  from the owner's own use and from a direct conversation, not from a funnel.
- **No accounts.** A login wall would cost a friend their first minute and an
  anonymous visitor their only one. [Phase 08](phases/08-optional/README.md) took
  two explicit no-go decisions — sync and a live AI tutor — on evidence, and both
  rest on a fallback that was built and tested: the manual study-record backup.
- **No feedback backend.** The owner's own practice reports are plain files the
  owner writes by hand. The moment a report button needs a server to receive it, the
  question is no longer "how do we collect feedback" but "do we want a service", and
  that is a separate decision with its own gate, cost ceiling and shutdown plan.
- **No invented features to fill a gap.** There is no streak, no rank, no predicted
  score, no mastery claim. The site's own home page says so, and the absence is a
  feature: a learner who cannot see a number is not misled by it.

### The three honest problems

**1. Four papers are readable but not markable.** 2017, 2018, 2019 and 2021 have no
board key, so a marked paper would be a claim the site cannot support. They are
published read-only: readable, searchable, and honestly labelled. The learning value
is real, but it is smaller than it would be with a key.

**2. ADR-0003 was accepted on 2026-11-20, which turns 2022 into a defect.** The tiered
model is adopted ([decision record](phases/09-derived-keys/DECISION-adr-0003-accepted.md)),
and it says provisional answers must not score. Phase 09's four files enforce that; the
2022 generator does not, so **13 of 2022's 87 scoreable questions rest on a
`derived-provisional` answer and are now non-compliant on the record**. Making them
compliant is a 2022 change, not a 09 change, and it removes or re-tiers 13 items from that
paper's scoreable pool — so it needs its own reviewed step rather than a silent edit here.

**3. The corpus's own subject labels are wrong for the four target years.**
`scripts/build-content.mjs` assigns Q36–100 of every target year to Computer, while
the official booklets divide those ranges among Computer Application, Environmental
Engineering, Engineering Mechanics and Strength of Materials, and print extra
stream-specific sections. The labels are wrong for 64 questions in each of three
full years, and one item (2017 Q83) carries a transcriber's placeholder in place of
its real options. The corpus is a working index, not a faithful transcript.

---

## Near future — the four derived keys

[Phase 09](phases/09-derived-keys/README.md) is designed and ready to run. It is a
**documentation-only** phase: it defines how a derived key is produced, what
evidence it must carry, and what stops a session. It writes no application code.

The plan, in one paragraph: each year is solved from the official WBJEEB booklet,
page by page, from page images; every answer is written down with the reasoning that
produced it; an independent second solver re-solves the paper without seeing the
first answers; every disagreement is settled by re-reading the printed page rather
than by a vote; computable answers get a committed script that reproduces them; and
every item ends up carrying one of three honest tiers — `derived-verified`,
`derived-provisional` or `disputed` — plus a separate statement of whether it may
ever contribute to a score.

**What it will change.** Four papers stop being read-only and become marked. The
owner gains four full papers to practise, which is most of the remaining corpus.

**What it will not change.** The site stays static, guest-first, account-free and
free. No new server, no new dependency, no new screen. The tier label appears where
a paper could be mistaken for an official-keyed one, and nowhere else.

**What has to be true before any of it ships.** Two things, both stated in the phase
design and both currently false:

- The derived-key loader must stop mapping a `disputed` item into the board-voided
  path, where a presentable item is awarded marks it does not have. Until that is
  fixed, **no** target-year key can be integrated at **any** tier.
- The paper's metadata must name the set that was solved, because the booklets print
  a different Q71–100 for different streams and the corpus carries only the main
  one.

**What could still go wrong.** The honest expectation is that these four papers come
out with more gaps than the official-keyed ones. 2021 carries fifteen figures; 2019
has a question the board printed without a stem and two the corpus never captured;
2017 has an item whose options the transcriber could not read. A year that ends with
80 verified, 10 provisional and 10 held is a *good* year, and the site should say so
in those terms rather than hiding the holes.

---

## Middle future — the choices that are already open

None of these need to happen. Each is a decision the owner can take or decline, and
the site is complete without any of them.

- **Rebuild the target years from the official booklets.** Corrects 64 wrong subject
  labels in three years, restores the two missing 2019 questions, and replaces the
  2017 placeholder. It also means the corpus stops being a transcription and starts
  being a faithful copy — with more page images and more work.
- **Reconstruct the missing figures.** The 2023 paper has eleven redrawn SVGs under
  ADR-0002. The target years have more figures than that, and redrawing them follows
  the same rule: original primitives, no official pixels, a text equivalent, a
  statement of how the redraw differs, and **no effect on scoring**. A redraw shows
  the printed values; it does not verify an item.
- **Make 2022 comply with the now-accepted ADR-0003.** The decision is made; the defect it
  exposes is not fixed. 13 of 2022's 87 scoreable questions are `derived-provisional` and
  must stop scoring, which shrinks that paper's scoreable pool and needs a reviewed step.
- **Close the syllabus gap honestly.** 258 of the questions sit outside the 2026
  syllabus, most of them in the four legacy sections that no longer exist in the
  bulletin. Keying those papers does not close that gap and must not be presented as
  though it did.
- **Publish the alternate stream sets.** The 2017, 2018 and 2021 booklets carry
  Printing Technology and Agricultural Engineering versions of Q71–100. These are
  different papers. Supporting them is a model change — one paper and one key per
  year today — not a content addition.

---

## Further out

The honest long-term shape of this project is not a platform. It is a **good
instrument that gets better the more it is used**, for one person first and then for
whoever else finds it.

Three things would make it better, in order of value per unit of effort:

1. **Correctness.** A wrong answer is worse than a missing one. Every correction
   that lands in [`docs/CORRECTIONS.md`](CORRECTIONS.md) makes the site more
   trustworthy than it was, and the log is public, so the improvement is visible
   rather than invisible.
2. **Coverage of what the owner is actually asked.** Not the whole 2026 bulletin —
   the parts that appear. The coverage dashboard measures the gap; closing it is
   chapter-sized work with a reviewer, not a bulk import.
3. **Clarity on a small screen, in a hurry.** The audience hierarchy says clarity
   beats feature density every time. A visitor on a phone with one bar of signal
   should reach an answer in three taps and understand what they are looking at.

What the project will not become, unless the owner takes a different decision on the
record: it will not acquire accounts, a backend, a vendor, a cost, a traffic
analysis dashboard or a marketing surface. None of those improve the thing the
owner actually wants, and each one takes something away — either the zero running
cost, the zero-friction first visit, or the honesty of what the site claims.

---

## Standing commitments

These do not change with a roadmap:

- **Static, guest-first, Android-friendly, ₹0 to run.** No server bill, no signup,
  no required cloud service, no always-on host.
- **The archive is immutable.** Corrections land in `editorial/`, with a pointer back
  to the old item.
- **The key is the board's, not ours.** A derived key is labelled derived, always,
  and the tier travels with it.
- **A figure that is not reproduced holds the item.** It stays visible, keeps its
  reason, and is excluded from every total.
- **Nothing is invented.** No option, no figure, no category, no subject, no topic
  match, no scoreable status, no learner feedback.
- **Publication rights are a separate review** from technical verification.
- **Accessibility is not deferred.** Every increment is checked for clarity,
  contrast, keyboard use, screen-reader output and 200 % text before it ships.
