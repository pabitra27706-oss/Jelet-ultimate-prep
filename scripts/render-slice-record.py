#!/usr/bin/env python3
"""Render editorial/derived-keys/<year>/<year>-slice-record.md from <year>-keys.json.

Everything in the record is derived from the key file, so the two cannot disagree.
Usage: python3 scripts/render-slice-record.py 2018
"""
import json
import sys
from collections import Counter
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SECTIONS = [
    (1, 20, 'Mathematics'),
    (21, 35, 'Electrical Technology'),
    (36, 55, 'Computer Application'),
    (56, 70, 'Environmental Engineering'),
    (71, 85, 'Engineering Mechanics'),
    (86, 100, 'Strength of Materials'),
]

WEAK = {
    2017: ["**Q42** (both examples qualify as batch work)", "**Q57** (albedo 0.31 rather than 0.21)",
           "**Q60** (N,P,K versus N,P)", "**Q63** (L10 18-hour index)", "**Q86** (bulk endurance strength)",
           "**Q93** (most conservative theory)"],
    2018: ["**Q60** (MIC as contaminant and pollutant)", "**Q64** (Indore is the aerobic method)",
           "**Q37** (which diskette/hard-disk claim is true)", "**Q77** (lift reading)",
           "**Q92** (isotropic plane stress)", "**Q97** (ordering of yield criteria)"],
    2019: ["**Q36** (first partition mapped to the local descriptor table, a textbook convention rather than a law)",
           "**Q44** (true-statement item: C is the only defensible option, but the wording of the others is loose)",
           "**Q56** (scope of an environmental audit, answered by elimination)",
           "**Q58** (stability expressed as 'dry adiabatic > ambient', which is one of two equivalent phrasings)",
           "**Q66** (composting and 'stable organic matter', where the option wording is doing the work)"],
    2021: ["**Q45**, **Q47** (protocol classification)", "**Q62** (organomercury)", "**Q63** (aircraft noise)"],
}


def render(year):
    path = REPO / f'editorial/derived-keys/{year}/{year}-keys.json'
    key = json.loads(path.read_text())
    E = {e['q']: e for e in key['entries']}
    st = key['status']
    solved = st['tierCounts']['derived-provisional']
    mc = st['machineCheckedCount']
    unsolved = st['tierCounts']['unsolved']

    coverage = []
    for a, b, name in SECTIONS:
        s = [q for q in range(a, b + 1) if E[q]['tier'] == 'derived-provisional']
        m = [q for q in s if E[q]['machineCheck']]
        u = [q for q in range(a, b + 1) if E[q]['tier'] != 'derived-provisional']
        coverage.append(f"| {name} | Q{a}–Q{b} | {len(s)} | {len(m)} | {len(u)} |")
    coverage.append(f"| **Total** | Q1–Q100 | **{solved}** | **{mc}** | **{unsolved}** |")

    grid = []
    for a, b, name in SECTIONS:
        cells = []
        for q in range(a, b + 1):
            e = E[q]
            if e['tier'] == 'derived-provisional':
                cells.append(f"**{q}** {e['answer'][0]}{'*' if e['machineCheck'] else ''}")
            else:
                cells.append(f"{q} —")
        rows = [' | '.join(cells[i:i + 7]) for i in range(0, len(cells), 7)]
        grid.append(f"**{name} (Q{a}–Q{b})**\n\n```\n" + '\n'.join(rows) + "\n```")

    held = []
    for q in range(1, 101):
        e = E[q]
        if e['tier'] != 'derived-provisional':
            note = (e['note'] or '').replace('|', '/')
            held.append(f"| {q} | `{e['holdReason']}` | {note[:190]} |")

    reasons = Counter(e['holdReason'] for e in key['entries'])
    reason_line = ' · '.join(f"`{k}` {v}" for k, v in reasons.most_common())
    weak = WEAK.get(year, [])
    weak_block = '\n'.join(f"{i + 1}. {w}" for i, w in enumerate(weak))

    doc = f"""# {year} · authorised text-layer slice

**Mode:** RESEARCH · **Date:** {key['provenance']['date']} ·
**Key file:** [`{year}-keys.json`]({year}-keys.json)

**Headline:** **{solved} of 100 solved** as `derived-provisional`, {mc} machine-checked;
**{unsolved} unsolved** — {reason_line}. **Nothing is `derived-verified`, `eligibleCount` is
0, and nothing here may be scored.**

This record is generated from the key file by `scripts/render-slice-record.py`, so the two
cannot drift apart.

---

## 1 · Coverage by section

| Section | Range | Solved | Machine-checked | Unsolved |
|---|---|---:|---:|---:|
{chr(10).join(coverage)}

An asterisk in the grid marks a machine-checked item.

---

## 2 · The answer grid

{chr(10).join(chr(10) + g for g in grid)}

---

## 3 · The {unsolved} unsolved items

| Q | Reason | Note |
|---|---|---|
{chr(10).join(held)}

---

## 4 · Reproducing every check

```
node scripts/validate-keys.mjs                                   # schema, all years
npm run test:keys                                                # test suite
python3 editorial/derived-keys/{year}/checks/{'computable-2018.py' if year == 2018 else 'math-q01-20.py and engg-q21-100.py'}
```

Each check returns `(observed, agree)` and the script exits non-zero if any item drifts
from what the key file claims. Items without a numeric check say why in `--list`; none
carries a fabricated `machineCheck`.

---

## 5 · Weakest answers, named

The input is the corpus text, never the printed page. Within that, these are the answers I
would re-check first against a page — recall-based items where a single wrong fact is not
detectable by any computation:

{weak_block if weak else '_none recorded for this year._'}

---

## 6 · What would upgrade this

1. A page image makes an item a *candidate* for `derived-verified` — it still needs a second
   independent pass, per the tier definition.
2. An image of any item currently `corpus-defect` closes something no amount of solving can.
3. A second solver over the same items is the cheapest quality signal available without
   images: disagreements point straight at §5.
"""
    out = REPO / f'editorial/derived-keys/{year}/{year}-slice-record.md'
    out.write_text(doc)
    print(f'wrote {out.relative_to(REPO)} ({len(doc)} bytes)')


if __name__ == '__main__':
    for y in sys.argv[1:] or ['2017']:
        render(int(y))
