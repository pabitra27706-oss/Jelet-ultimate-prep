---
title: Parallel circuits
summary: Same voltage, split current - a worked example, guided hints and an independent notebook check.
subject: electrical
topic: jelet-syllabus:electrical:t04
revision: 1
provenance: original
status: open
minutes: 8
prerequisites: [Ohm's law, nodes and branches]
objective: By the end you can find the branch currents of a parallel circuit and explain what changes when one branch opens.
sections: [prerequisite, predict, worked-example, guided-practice, independent-practice, revision-sheet]
---

## Prerequisite

A single 4 Ω resistor across 8 V carries **2 A**: divide voltage by resistance (`I = V/R`). A **node** is a point or group of points joined by ideal wire. Trace each wire until you meet a component; a resistor separates its two end nodes.

[Back to the prediction](#predict)

## Predict

An ideal 12 V source supplies two 6 Ω branches. Imagine opening only the lower branch. Before calculating, predict what happens to **current in the upper branch** and to **total source current**. Do they both change?

<figure class="lesson-figure">
  <a href="../../parallel-circuit.svg" aria-label="Open the circuit diagram at full size"><img src="../../parallel-circuit.svg" width="680" height="300" alt="Two 6-ohm resistors, R1 and R2, connect in parallel between node P at positive 12 volts and node N at zero volts."></a>
  <figcaption>The ideal source is connected between P and N. Opening R2 breaks the lower path only. <a href="../../parallel-circuit.svg">Open full-size diagram</a> (use Back to return).</figcaption>
</figure>

[Need a refresher? Check the prerequisite](#prerequisite).

## Worked example

<details data-reveal="worked">
<summary>Show worked steps</summary>
<p class="micro">These steps are written for this site. Each one carries a short explanation — no AI is involved.</p>
<ol>
<li><strong>Find the branch voltage.</strong> Both resistors join P and N, so each sees the same 12 V.
<details data-explain="branch-voltage">
<summary>Explain this step</summary>
<p>A parallel branch never splits the supply voltage. Both resistors are wired to the same two nodes, P and N, so the potential difference across each one is the same 12 V of the source. Only the current divides.</p>
</details>
</li>
<li><strong>Find each current.</strong> By Ohm’s law, 12 V ÷ 6 Ω = 2 A through each branch.
<details data-explain="branch-current">
<summary>Explain this step</summary>
<p>Once the voltage across a branch is known, that branch is a one-resistor problem: I = V ÷ R = 12 V ÷ 6 Ω = 2 A. While the ideal source holds 12 V, changing the other branch does not change this one.</p>
</details>
</li>
<li><strong>Add at the junction.</strong> The source supplies 2 A + 2 A = 4 A. As a check, 12 V ÷ 4 A = 3 Ω, less than either branch.
<details data-explain="junction-current">
<summary>Explain this step</summary>
<p>Charge is not stored at node P, so everything that arrives from the source must leave through the branches: 2 A + 2 A = 4 A. Feeding the totals back into Ohm’s law gives the equivalent resistance, 12 V ÷ 4 A = 3 Ω, which is smaller than a single 6 Ω branch — the signature of a parallel path.</p>
</details>
</li>
<li><strong>Open the lower branch.</strong> Its current becomes 0 A, but the ideal supply still provides 12 V to the upper branch. Its current stays at 2 A, and total source current drops from 4 A to 2 A.</li>
</ol>
<p><strong>Common mistake:</strong> Splitting the voltage into 6 V per branch would give 1 A per branch, even though both ends are fixed 12 V apart. Equal resistance produces equal current here; a junction does not always split current equally.</p>
</details>

## Guided practice

An ideal 12 V source supplies a 4 Ω branch and a 12 Ω branch in parallel. Find both currents and their sum. What happens to source current if the 12 Ω branch opens?

<details data-reveal="hint-one">
<summary>Hint 1 · Trace the nodes</summary>
<p>Which two terminals does each resistor connect to? Decide what that means for its voltage first.</p>
</details>
<details data-reveal="hint-two">
<summary>Hint 2 · Choose a relationship</summary>
<p>Use I = V/R for each branch, then sum currents at the split. Opening a branch removes just that contribution.</p>
</details>
<details data-reveal="hint-three">
<summary>Hint 3 · Start the arithmetic</summary>
<p>The 4 Ω branch carries 12 ÷ 4 = 3 A. Use the same voltage for the other branch, not the same current.</p>
</details>
<details data-reveal="guided-check">
<summary>Check your guided work</summary>
<p>The branch currents are 3 A and 1 A; together they draw 4 A. Opening the 12 Ω branch drops the total to 3 A. The 4 Ω branch continues drawing 3 A.</p>
</details>

## Independent practice

**Original exercise · not a past exam question.** In your notebook, solve this before revealing the check:

An ideal 9 V source feeds 6 Ω and 3 Ω branches in parallel. Find both branch currents and the total. Open the **3 Ω** branch. What is the new source current, and why does the current through the 6 Ω branch stay the same?

<details data-reveal="independent-check">
<summary>Check after attempting</summary>
<p>The branch currents are 1.5 A through 6 Ω and 3 A through 3 Ω. The total is 4.5 A. After opening the 3 Ω branch, the source supplies 1.5 A. The remaining branch still sees 9 V across its original two nodes.</p>
<p>If you reveal this before solving, treat the attempt as assisted rather than independent. No answer or score is collected.</p>
</details>

## Revision sheet

- **Same voltage:** `V₁ = V₂ = Vsource`. Voltage is measured in volts (V), across two nodes.
- **Branch current:** `I = V/R`. Current is measured in amperes (A); resistance is measured in ohms (Ω).
- **Current adds:** `Isource = I₁ + I₂`. For two connected branches, `1/Req = 1/R₁ + 1/R₂`.
- **Assumptions:** Ideal fixed-voltage DC source and wires, steady state, finite positive resistances in connected branches. An open path carries zero current. A real supply with internal resistance may not keep the same terminal voltage.
- **Counterexample:** 4 Ω and 12 Ω across the same 12 V carry 3 A and 1 A. Equal voltage does not imply equal current.

[Retry the original independent exercise](#independent-practice).
