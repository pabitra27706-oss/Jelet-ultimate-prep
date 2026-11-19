# Parallel circuits: same voltage, split current

**Phase 01.3 lesson outline · revision 1 · 2026-11-19.** Lesson ID: `parallel-circuits`. Subject: Fundamentals of Electrical & Electronics Engineering. Chapter: DC sources and circuits (`jelet-syllabus:electrical-and-electronics:t04`). [JELET 2026 Appendix 5, p. 28](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2026/03/20260318287108702.pdf#page=28) includes finding branch current and voltage in passive circuits; parallel resistors are our teaching example, not a new Board heading. This is a **draft outline for review**, not a published chapter.

**Learning objective:** Given two resistors across an ideal DC source, identify the two shared nodes, find each branch current and the source current, and explain which quantities change when just one branch is opened.

## Prerequisite

Before attempting the prediction, be able to use `I = V/R` (amperes = volts ÷ ohms) and identify wires joined at a node. Check: a single 4 Ω resistor across 8 V carries 2 A. If the calculation is unfamiliar, divide 8 volts by the 4-ohm resistance; if the nodes are unclear, trace each wire until you meet a component. In this model all points joined only by ideal wire are the same node. Return to [Predict](#predict) after the check. These are editorial prerequisites, not Board teaching order.

## Predict

**Original worked case (project-brief example, not a PYQ).** A 12 V ideal DC source holds node P at +12 V relative to N. There are two 6 Ω branches. Before doing any arithmetic, predict whether opening branch 2 will increase, decrease, or leave unchanged (a) current in branch 1 and (b) total source current. Write your reasons before revealing the calculation.

```text
P o---+--[ R1: 6 Ω ]--+---o N
      |               |
      +--[ R2: 6 Ω ]--+
```

**Text alternative:** The source, not drawn, is connected between P (positive, +12 V) and N (negative reference, 0 V). R1 and R2 each connect directly between P and N; neither lies on the other’s path. Conventional branch currents run from P to N. Opening R2 breaks only the lower path. Use this description alongside the drawing; the prompt does not depend on colour, line position, or a video.

## Worked example

1. Both resistors connect between the same two nodes, so each has `V(P) − V(N) = 12 V` across it. The voltage does not split between branches.
2. By Ohm’s law, each current is `12 V / 6 Ω = 2 A`.
3. By current conservation at the junction, the source supplies the sum: `2 A + 2 A = 4 A`. As a cross-check, `12 V / 4 A = 3 Ω`, less than either branch resistance.
4. Open R2 only. Its current becomes 0 A; the ideal source still holds 12 V across R1, so R1 stays at 2 A. The source now supplies 2 A. The two predictions should be **unchanged** and **decreases**, respectively.

## Guided practice

**Original guided case (`parallel-guided-v1`).** A 12 V ideal source feeds a 4 Ω and a 12 Ω branch in parallel. Find the two currents and total. If the 12 Ω branch opens, what does the source current become?

Reveal one hint at a time, then stop as soon as you can continue:

1. **Trace the nodes.** Which two terminals does each resistor connect to? Decide what that means for its voltage before comparing the currents.
2. **Choose the relationship.** Use `I = V/R` for each branch, then sum currents at the split. Opening a branch removes just that contribution.
3. **Start the arithmetic.** The 4 Ω branch carries `12 ÷ 4 = 3 A`. Use the same voltage for the other branch, not the same current.

**Guided check:** 3 A and 1 A; total 4 A with both connected. Opening the 12 Ω branch changes the total to 3 A and leaves the 4 Ω current at 3 A.

## Independent practice

**Original independent case (`parallel-independent-v1`).** A 9 V ideal source feeds 6 Ω and 3 Ω branches in parallel. Find both branch currents and the total. Then open the **3 Ω** branch. Which branch current remains, and what does the source now supply? Explain why the remaining current did not change. Try without consulting the guided steps.

**Check after attempting:** 1.5 A through 6 Ω and 3 A through 3 Ω; total 4.5 A. After opening 3 Ω, that branch carries 0 A; the source supplies 1.5 A and the 6 Ω branch still has 9 V across it. Use exact equivalent values in amperes; no rounding tolerance or automatic grading is specified. In the eventual notebook view, keep this check out of the initial attempt. This Markdown outline shows it for review.

## Misconception feedback

“Two paths means the voltage divides in half” would predict 1 A in each 6 Ω branch of the worked case. That would put 6 V across each resistor, even though each is connected directly to terminals fixed 12 V apart. Re-trace the endpoints: **voltage is across two nodes; current adds at a node**. Equal currents in the worked case come from equal resistance, not from a rule that a junction splits current equally. The unequal guided case is the counterexample.

## Revision sheet

- **Rules:** `V₁ = V₂ = Vsource`; `Ibranch = Vbranch/Rbranch`; `Isource = I₁ + I₂`; for two connected branches, `1/Req = 1/R₁ + 1/R₂`. Use volts (V), amperes (A), and ohms (Ω).
- **Assumptions:** ideal fixed-voltage DC source, ideal wiring, steady state, finite positive resistances when connected; an open path contributes zero current. Do not generalise the unchanged voltage result to a real supply with internal resistance or a network with series resistance before the split.
- **Counterexample:** 4 Ω and 12 Ω across 12 V carry 3 A and 1 A, not equal current. Equal **voltage** follows from the shared pair of nodes.

## PYQ mapping and return path

**Primary PYQ IDs: none. Secondary PYQ IDs: none.** The [2025 audit](audit-2025.md) includes an AC phase question (Q95), not a DC parallel-resistance check. Its figure and rights are unresolved. The [syllabus inventory](inventory.md#fundamentals-of-electrical--electronics-engineering) flags 2024 Q94 as a node-voltage lead, but the local copy lacks its circuit. Do not assume shared supply nodes or link it as a lesson exercise. If a future permitted item demonstrably needs same-node voltage and current conservation, review it against [Worked example](#worked-example) and record the item-specific rationale and reverse link. No held question gets a public practice route.

## Phone flow sketches

| Entry | Proposed path | Return / fallback |
| --- | --- | --- |
| New learner from Today | Today → Learn → DC sources and circuits → [Predict](#predict). Offer [Prerequisite](#prerequisite) before arithmetic. | Prerequisite → Predict; keep the prediction before the answer, with a text equivalent for the circuit. |
| Learner resuming | Today resumes the last exact section, e.g. [Guided practice](#guided-practice), rather than jumping to a solution. | Restore the last revealed hint and distinguish “used a hint” from an independent try. If no local state exists, start at Predict. No account. |
| Learner opening a shared PYQ | Future, **permitted and mapped items only**: open the public item with provenance, jump to the exact concept section, and offer Back to question. | Restore the item and its place; an unmapped/held item gets no public lesson jump. At this phase the available stand-in is the [original independent exercise](#independent-practice), labelled as original. |

## Later transfer check

**Original facilitator case (`parallel-transfer-v1`); do not show before the transfer attempt.** On a later day, ideally the next day, give an 8 V ideal supply with two parallel branches. One branch is 4 Ω and the source initially supplies 3 A. Ask for the unknown resistance and the source current after the known 4 Ω branch is opened. Ask the learner to explain the node voltages aloud or in writing without a hint.

**Reviewer check:** The known branch takes 2 A; the unknown branch takes 1 A, so its resistance is 8 Ω. When the known branch opens, the unknown still sees 8 V and the source supplies 1 A. Record unaided transfer only if both results and the same-node explanation are correct. Record hint use separately; keep only consented anonymized observations. No transfer test has been conducted.

**Provenance and review:** Worked case adapted from the internal [product brief](../../PRODUCT.md); other cases, diagram and wording authored for this outline by the Arena agent on 2026-11-19, not copied from a Board paper. Fixed draft versions and values only; no question generator. Agent checked units, topology and calculations; independent subject review and owner approval of the original-content scope are pending. No external video or Bengali explanation is included; the English text and diagram are the full path. No exam reproduction rights are asserted. See the [review packet](review-packet.md).
