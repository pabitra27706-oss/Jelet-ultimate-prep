# JELET 2026 Paper I syllabus inventory

**Checked 2026-11-19 · Phase 01, task 01.1.** Primary source: WBJEEB’s [JELET-2026 Information Bulletin, Appendix 5](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2026/03/20260318287108702.pdf#page=23), released 18 March 2026 and linked from the [Board’s JELET current-events page](https://wbjeeb.nic.in/current-events-jelet/). Section 2.2 (p. 6) identifies the four Paper I subjects; §2.3 (p. 7) points to Appendix 5. Page numbers below are **bulletin pages**, not PYQ pages. Pages 23–28 cover Paper I; the Pharmacy entry on p. 29 is out of scope. See the [dated evidence record](2026-11-19-01.1.md) for extraction limits and checks.

## How to read the crosswalk

- **Official row and heading** follow the Board’s lettering and order under each subject; terminal heading colons are omitted. Page ranges include continuations. This is a topic-group index, not a full transcription.
- **Working IDs** reuse the legacy app’s identifiers for the corresponding groups. The [preserved syllabus](../../../archive/jelet-prep/data/syllabus.md) has a one-to-one group match, but its summaries are not official wording. The [preserved TypeScript adapter](../../../archive/jelet-prep/data/src/syllabus-data.ts) parses that same Markdown, so it is not independent corroboration. The legacy parser generates positional IDs; treat the IDs below as fixed assignments, not values to regenerate when rows move or headings change. Record changes to later editions explicitly.
- **Legacy summary** names the corresponding heading and gives selected examples of wording/scope differences, not an exhaustive subtopic diff. A legacy topic heading is not a lesson.
- **M — matching material found:** a specific relevant asset was located, possibly incomplete. **G — confirmed gap:** the named asset type was absent in the checked scope. **N — not yet checked:** no match established and the search was not exhaustive. Status applies to its column only, not to overall topic readiness.
- **Lesson scope:** the browsable archive and the bundled legacy `main` snapshot were checked for standalone instruction; `G` does not mean that private or external lessons do not exist. The archived [derived 2022 answer notes](../../../archive/jelet-prep/data/docs/derived-keys/2022.md) contain item-specific reasoning, not standalone lessons. No original chapter practice set was found in the checked snapshot.
- **Practice scope:** candidates below are local transcription numbers in [2024](../../../archive/jelet-prep/data/pyq-md/2024.md), [2022](../../../archive/jelet-prep/data/pyq-md/2022.md) or [2017](../../../archive/jelet-prep/data/pyq-md/2017.md), not authenticated booklet mappings. A candidate can match part of a group without covering it or being usable as-is. No options, keys, scoring, or publication rights were verified for these candidates. **Figures** below are practice assets, not teaching illustrations. The [figure manifest](../../../archive/jelet-prep/data/docs/figures/manifest.json) has three pilot SVGs; its unreviewed auto-tags cannot establish a topic mapping for the other entries. `N` does not imply that a figure is required or missing for the whole topic group.

## Mathematics

| Official row | Official heading | Bulletin page | Working topic ID | Legacy summary and selected differences | Lessons | Figures | Practice |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | Matrices up to order 3 | 23 | `jelet-syllabus:mathematics:t01` | Matrices (up to order 3); the Board specifies applying the named theorem to find an inverse. | G | N | M — 2022 Q3, diagonalizability. |
| B | Determinant up to order 3 | 23 | `jelet-syllabus:mathematics:t02` | Determinants (up to order 3); Board explicitly limits matrix rank to order 3 here. | G | N | M — 2024 Q2, matrix rank. |
| C | Complex Number | 23 | `jelet-syllabus:mathematics:t03` | Complex Numbers; “algebra” condenses the Board’s explicit list of operations. | G | N | M — 2024 Q7, exponential form. |
| D | Co-ordinate Geometry(2D) | 23 | `jelet-syllabus:mathematics:t04` | Co‑ordinate Geometry (2D); same group, with shortened conic scope. | G | N | M — 2022 Q9, hyperbola eccentricity. |
| E | Vector Algebra | 23 | `jelet-syllabus:mathematics:t05` | Vector Algebra; Board also specifies geometrical interpretations of triple products. | G | N | M — 2024 Q13, dot product and work. |
| F | Differential Calculus | 23–24 | `jelet-syllabus:mathematics:t06` | Differential Calculus; Board also specifies types of functions including periodic ones. | G | N | M — 2024 Q16, continuity. |
| G | Application of Derivative | 24 | `jelet-syllabus:mathematics:t07` | Application of Derivative; same group, single-variable extrema. | G | N | M — 2024 Q19, constrained maximum reducible to one variable. |
| H | Partial Differentiation | 24 | `jelet-syllabus:mathematics:t08` | Partial Differentiation; Board explicitly specifies first-order Euler’s theorem for two variables. | G | N | M — 2024 Q20, evaluating partial derivatives. |
| I | Integral Calculus | 24 | `jelet-syllabus:mathematics:t09` | Integral Calculus; Board specifies sum/difference/scalar-multiple rules and area of a bounded region. | G | N | M — 2024 Q25, area bounded by an ellipse in one quadrant. |
| J | Ordinary Differential Equation | 24 | `jelet-syllabus:mathematics:t10` | Ordinary Differential Equations; summary drops the condition printed with the exponential-times-function particular integral. Do not use the summary to reconstruct that condition. | G | N | M — 2022 Q28, second-order linear equation with constant coefficients. |
| K | Probability | 24 | `jelet-syllabus:mathematics:t11` | Probability; Board lists examples of event types, while legacy summary just says “events.” | G | N | M — 2024 Q29, sample space for two tosses. |

## Physics

| Official row | Official heading | Bulletin page | Working topic ID | Legacy summary and selected differences | Lessons | Figures | Practice |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | Units, dimension, and measurement | 25 | `jelet-syllabus:physics:t01` | Units & dimensions; Board also names accuracy, precision, and resolution. | G | N | M — 2024 Q41, dimensions. |
| B | Kinematics | 25 | `jelet-syllabus:physics:t02` | Kinematics; Board explicitly includes position/velocity-time graphs and vector operations. | G | G — Q46 graph not preserved. | M — 2024 Q46, acceleration graph to velocity. |
| C | Laws of motion | 25 | `jelet-syllabus:physics:t03` | Laws of motion; Board explicitly includes static/dynamic friction and angle of repose. | G | M — [2017 Q72 bar and cord](../../../archive/jelet-prep/data/docs/figures/pilot/2017-q72-bar-cord.svg) and [2017 Q81 force–time graph](../../../archive/jelet-prep/data/docs/figures/pilot/2017-q81-force-time.svg), both pilot redraws. | M — 2017 Q72 (equilibrium), Q81 (impulse). |
| D | Work, power, energy | 25 | `jelet-syllabus:physics:t04` | Work, power, energy; Board explicitly includes measures and units. | G | N | M — 2022 Q47, work against a retarding force. |
| E | Gravitation | 25 | `jelet-syllabus:physics:t05` | Gravitation; Board specifies variation of gravity on/above/below Earth’s surface and includes vertical linear motion. | G | N | M — 2024 Q58, variation of gravity with height. |
| F | Elasticity | 25 | `jelet-syllabus:physics:t06` | Elasticity; Board also names deforming/restoring forces, elastic/plastic bodies, and relationships among elastic constants. | G | N | M — 2024 Q44, tensile stress. |
| G | Surface tension | 25 | `jelet-syllabus:physics:t07` | Surface tension; Board explicitly includes dimensions/units and capillary meniscus shape. | G | N | M — 2024 Q69, surface energy of coalescing drops. |
| H | Fluid mechanics/ Hydrostatics | 25 | `jelet-syllabus:physics:t08` | Fluid mechanics; Board also includes floating equilibrium, critical velocity and temperature dependence of viscosity. | G | N | M — 2022 Q52, viscous flow and terminal velocity. |
| I | Thermal expansion of solid | 25 | `jelet-syllabus:physics:t09` | Thermal expansion; summary title drops the “of solid” qualifier. | G | N | M — 2022 Q65, solid rod expansion with an elasticity component. |
| J | Transmission of heat | 25 | `jelet-syllabus:physics:t10` | Heat transfer; Board specifies formula, dimensions and SI unit of thermal conductivity. | G | N | M — 2024 Q51, thermal conductivity. |
| K | Thermodynamics | 25 | `jelet-syllabus:physics:t11` | Thermodynamics; Board includes relations and ratio of gas specific heats. | G | N | M — 2024 Q53, first law. |
| L | Reflection of Light | 25 | `jelet-syllabus:physics:t12` | Reflection of light; same plane mirror and image-formation scope. | G | N | M — 2022 Q69, plane-mirror image combined with a lens. |
| M | Refraction of light | 25 | `jelet-syllabus:physics:t13` | Refraction of light; Board specifies a plane surface and the index–speed relation. | G | M — [2024 Q43 refraction](../../../archive/jelet-prep/data/docs/figures/pilot/2024-q43-refraction.svg), pilot redraw. | M — 2024 Q43, refraction across a boundary; the transcription alone omits the diagram. |
| N | Lens | 25 | `jelet-syllabus:physics:t14` | Lens; Board explicitly includes power in different media. | G | N | M — 2022 Q69, convex-lens image combined with a plane mirror. |
| O | Photoelectricity | 26 | `jelet-syllabus:physics:t15` | Photoelectricity; Board specifies the working principle and uses of a solar photovoltaic cell. | G | G — Q55 plot not preserved. | M — 2024 Q55, stopping potential and work function. |

## Chemistry

| Official row | Official heading | Bulletin page | Working topic ID | Legacy summary and selected differences | Lessons | Figures | Practice |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | Atomic Structure | 27 | `jelet-syllabus:chemistry:t01` | Atomic Structure; Board also names orbits/orbitals and atomic/mass number. | G | N | M — 2024 Q73, Bohr orbit radius. |
| B | Chemical Bonding | 27 | `jelet-syllabus:chemistry:t02` | Chemical Bonding; Board specifies H-bond examples and structure–property relations for crystalline solids. | G | N | M — 2024 Q74, ionic crystal geometry. |
| C | Acids, Bases & Salts | 27 | `jelet-syllabus:chemistry:t03` | Acids, Bases & Salts; Board also specifies percentage strength, primary/secondary standards and acidimetry/alkalimetry. | G | N | M — 2024 Q81, solubility product. |
| D | Oxidation, Reduction, Electrochemistry | 27 | `jelet-syllabus:chemistry:t04` | Oxidation, Reduction, Electrochemistry; Board distinguishes Pt and Cu electrodes in CuSO₄ electrolysis and includes electrotyping. | G | N | M — 2024 Q75, current and charge in electrolysis. |
| E | Chemical Equilibrium | 27 | `jelet-syllabus:chemistry:t05` | Chemical Equilibrium; Board also names exothermic/endothermic reactions. | G | N | N |
| F | Metallurgy | 27 | `jelet-syllabus:chemistry:t06` | Metallurgy; the Board gives a longer named alloy list and includes sponge iron and uses of different alloy steels. | G | N | N |
| G | Water | 27 | `jelet-syllabus:chemistry:t07` | Water; Board explicitly includes the action of soap on water. | G | N | N |
| H | Organic Chemistry | 27–28 | `jelet-syllabus:chemistry:t08` | Organic Chemistry; summary narrows the wording “Nomenclature” to “IUPAC nomenclature”; use the bulletin for scope. | G | N | M — 2022 Q82, isomerism. |

## Fundamentals of Electrical & Electronics Engineering

| Official row | Official heading | Bulletin page | Working topic ID | Legacy summary and selected differences | Lessons | Figures | Practice |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | Electrical components, measuring instruments | 28 | `jelet-syllabus:electrical-and-electronics:t01` | Components & instruments; Board explicitly names voltage/current measurement principles. | G | N | M — 2024 Q91, PMMC instrument. |
| B | Transformers | 28 | `jelet-syllabus:electrical-and-electronics:t02` | Transformers; same group, condensed wording. | G | N | M — 2024 Q92, leakage flux. |
| C | Electrical machines | 28 | `jelet-syllabus:electrical-and-electronics:t03` | Electrical machines; Board explicitly includes applications of motor types. | G | N | M — 2024 Q100, speed and torque of a DC motor. |
| D | DC sources and circuits | 28 | `jelet-syllabus:electrical-and-electronics:t04` | DC circuits; Board explicitly mentions equivalence and finding branch current/voltage in passive circuits. | G | G — Q94 circuit not preserved. | M — 2024 Q94, node voltage; DC source details not checked. |
| E | AC sources and circuits | 28 | `jelet-syllabus:electrical-and-electronics:t05` | AC circuits; Board includes period and exponential, complex, and phasor representations. | G | N | M — 2024 Q95, steady-state current in an inductor. |
| F | Basic semiconductor devices | 28 | `jelet-syllabus:electrical-and-electronics:t06` | Semiconductor devices; Board explicitly specifies energy-level diagrams for insulator, conductor, and semiconductor. | G | G — Q96 circuit not preserved. | M — 2024 Q96, ideal diode. |
| G | Analog Circuits | 28 | `jelet-syllabus:electrical-and-electronics:t07` | Analog circuits; same group, condensed wording. | G | G — Q97 circuit not preserved. | M — 2022 Q97, comparator as related analog practice; exact op-amp configuration/syllabus fit not verified. |
| H | Digital Electronics | 28 | `jelet-syllabus:electrical-and-electronics:t08` | Digital electronics; same list of gates, truth tables, symbols and combinations. | G | G — Q98 circuit not preserved. | M — 2024 Q98, logic-gate combination. |

## Suggested prerequisites and teaching order — editorial, not WBJEEB

| Subject | Helpful prerequisites or bridges | Suggested sequence for a beginner |
| --- | --- | --- |
| Mathematics | Signed arithmetic, algebraic rearrangement, quadratics, trigonometry, plotting functions. | Matrix notation and operations → determinants → inverse and systems; functions and limits → derivatives → applications and partials; integrals before differential equations. Teach probability as a separate strand. |
| Physics | SI conversions, graph slopes and areas, vector components, force diagrams. | Measurement → kinematics → forces → energy and gravity. Then use force/energy ideas in materials and fluids; keep heat and optics as separate strands. Teach reflection before refraction and lenses. |
| Chemistry | Chemical formulae, balanced equations, moles and ratios, powers of ten and logarithms. | Atomic structure → bonding; mole/concentration work and equilibrium concepts before buffers/solubility; oxidation numbers before electrolysis. Treat water, metallurgy and organic as separate strands with relevant bridges. |
| Fundamentals of Electrical & Electronics Engineering | Units, Ohm’s law, series/parallel resistance and simultaneous equations; complex numbers and sinusoids for AC. | Components and measurement → simple DC networks → AC/phasors → transformers and machines. Teach semiconductor basics before analog circuits; truth tables before gate combinations. |

**Coverage:** 42 official groups indexed and crosswalked: 11 Mathematics, 15 Physics, 8 Chemistry, 8 Fundamentals of Electrical & Electronics Engineering. Standalone lessons: 42 confirmed gaps **in the checked snapshot**. Practice: 39 groups with candidates (including incomplete transcriptions), 3 not yet checked exhaustively. Figures: 3 pilot redraws across 2 groups; 6 groups have a named missing practice figure (not a claim about all their figures), and 34 groups are not yet checked for figures. No material is marked approved for publication or scoring by this inventory.
