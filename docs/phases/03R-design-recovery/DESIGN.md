# Art direction · study the behaviour, not the brand

**Do not use Diploma 3rd Sem as the UI reference.** These directly inspectable sources serve different jobs. No package adoption or blanket licence to copy follows from a link.

| Direct source | What to examine | JELET translation; what not to copy |
|---|---|---|
| [Astro Starlight · mobile table of contents](https://github.com/withastro/starlight/blob/dc7451c127bbf1dc195a2c1ab2c3670fc00dd84c/packages/starlight/src/components/MobileTableOfContents.astro) | A labelled `details`/`summary` navigation can expose section anchors without occupying the whole phone screen. | Collapse “In this lesson” on mobile; restore the exact anchor when returning from practice. Don't install a documentation theme to accomplish this. |
| [Primer Octicons · bookmark at 24px](https://github.com/primer/octicons/blob/68ec2de8d0ddfcbb7497da01d0b7d98eb5593020/icons/bookmark-24.svg) | Simple silhouette, one purpose, legible at small size. | Pair a locally drawn mark with **Save question** and an explicit saved state; don't replace labels with cryptic icons. |
| [PhET · Circuit Construction Kit DC repository](https://github.com/phetsims/circuit-construction-kit-dc/tree/2e4d5c19572fa4205b0fced784c0009d9203ad49) | Reference category for a circuit-manipulation learning tool. Repo README marks it no longer maintained. | Design a single-variable prediction/switch/reveal case, not a bundled simulator or reused PhET artwork. Keep a text-equivalent table. |
| [Jelet-prep · preserved reader source](https://github.com/pabitra27706-oss/Jelet-prep/blob/863458f0c0d5aa29adbf67fcac91c6193b249c62/src/Reader.tsx) and [AppFlow · documentation system](https://github.com/pabi277/AppFlow/tree/1da317a446ffa36d347eba7fb3dd009b0c864bd3/templates/docs-system) | Original project and handoff evidence, respectively. | Recover reader/data behaviour and version evidence, not their visual composition. [Local fallback if the old repo is retired](../../../archive/jelet-prep/README.md). |

## A · Field notebook — design tokens and rhythm

Use cream `#FBF6E9`, dark ink `#1B322E`, forest action `#214B3E`, rust annotation `#9D381F`. Local serif display for section questions, system sans for stems and controls, monospace only for units and item identity. A 4/8/16/24/32 spacing rhythm; target 60–72 characters per prose line. Typeset units next to values and give graphs a visible scale and accessible description. One main action per state. Put provenance in a disclosure **after** the stem, while keeping content class visible **before** it. On desktop allow a quiet navigator outside the reading column.

## B · Circuit bench — interaction specification

Use night `#101D27`, panel `#1C3442`, signal `#B9ED94`. A learner predicts the effect of opening the 3 Ω branch on the 6 Ω current. Then they toggle, observe current through each path and explain the result. For an ideal 9 V source: closed currents 1.5 A and 3 A, total 4.5 A; after opening the 3 Ω path: 1.5 A and 0 A, total 1.5 A. Sign/state must be expressed in text as well as colour. Provide undo, keyboard controls, reduced motion and written equivalent; controls in the illustration are proposed, not functional. Never draw an open circuit while reporting both currents as flowing.

## Common shell and sign-off

- Learn: keep step/diagram prominent; put one prediction ahead of the reveal. Practice: no invented marks; show held status rather than an empty answer control. Review: distinguish mark calculation from concept explanation. Catalogue: year → stream/set → printed section/number, with count definitions.
- Phone: baseline 390×844 plus 320px and 200% text. Desktop: 1280×800 plus keyboard-only. Aim for 44px touch targets and ≥4.5:1 contrast for body text. Visible focus and labels, not just colour. Test deny-storage and no-JS paths; no remote fonts, trackers or API calls required.
- Generate comparisons, original SVG diagrams, failure fixtures and alternative copy with AI as needed. Verify the electrical states, math, unit labels and semantic mappings independently; do not substitute a generated screenshot for browser evidence. Show both candidates with the same problem and the measured baseline first. Log selected direction and reason before a site-wide rollout.
