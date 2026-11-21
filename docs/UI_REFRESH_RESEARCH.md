# UI refresh research and first implementation

**Reviewed:** 2026-11-21 · **Scope of this increment:** Today/home dashboard only. The attached/generated reference image is concept art, not a screenshot or a content specification.

## Source review

This was a source-level review of two public projects on the same GitHub account, rather than a claim of competitor-wide usability testing or a live device audit:

- [Diploma-3rd-sem](https://github.com/pabitra27706-oss/Diploma-3rd-sem): reviewed the home dashboard source ([`index.html`](https://github.com/pabitra27706-oss/Diploma-3rd-sem/blob/main/index.html)), the device-local Today page ([`today.html`](https://github.com/pabitra27706-oss/Diploma-3rd-sem/blob/main/today.html)), the design record ([`docs/DESIGN.md`](https://github.com/pabitra27706-oss/Diploma-3rd-sem/blob/main/docs/DESIGN.md)), and its project overview ([README](https://github.com/pabitra27706-oss/Diploma-3rd-sem#readme)). The code organizes the entry screen around a study-focus widget, local study summaries, subject cards, quick access and bottom navigation; the separate Today view includes a locally computed next action, goal, activity streak, daily question and weak-area information. Its design notes call for a quiet revision desk, readable text, restrained decoration and thumb/keyboard reach, while explicitly recording states and physical checks that remain unverified.
- [Diploma-2nd-sem](https://github.com/pabitra27706-oss/Diploma-2nd-sem): reviewed its [README and feature/flow description](https://github.com/pabitra27706-oss/Diploma-2nd-sem#readme). It describes a single dashboard, subject → content type → item navigation, subject cards, quick study shortcuts, and a continue-learning shortcut backed by local storage. The README also lists a countdown and dynamic totals; those are ideas to treat cautiously, not automatically copy.
- The existing JELET [UI reference and deep-link contract](UI_REFERENCE.md), [product journeys](PRODUCT.md), [site design tokens](../src/styles/site.css), and [roadmap/testing constraints](ROADMAP.md) remain the authority for this site. The JELET product is Paper I preparation, not a diploma-semester portal.

**Research limits:** source/README review only. I did not claim to run the two reference sites, inspect their current deployed rendering, test them on a phone, or establish that every listed feature is currently functional. The shared-account projects are inspiration for interaction patterns, not authority for JELET exam rules, content, styling, code or assets.

## Findings applied to JELET Today

1. **One obvious starting action.** Turn the old three-button hero into a single high-emphasis “Make today’s plan” action. Keep the full-paper and custom-mock routes available as quieter alternatives, so their functionality is not lost.
2. **A useful return path.** Keep “Pick up where you stopped” conditional on actual local attempt/lesson state. For a fresh device, show an honest empty state with a direct route to the paper library instead of a fake progress widget.
3. **Stats remain truthful and local.** Keep the existing four locally-derived values and their definitions/denominators. An empty accuracy remains an em dash; the visual refresh must not invent a score, streak, countdown or recommended topic.
4. **Content remains close to the start.** Give subject drills a clear, full-width tap target and keep every year’s paper list, provenance/read-only status and site accuracy caveats. No card should imply that a derived answer is official.
5. **Keep established mobile navigation.** Preserve the five labelled bottom destinations and desktop links; this is already a strong mobile pattern. Search remains reachable through its existing route and footer, not a sixth compressed bottom tab.
6. **Use the current JELET system, not another project's skin.** Retain the existing tokenized paper/ink/teal palette, light/dark support, system fonts and no-network static architecture. Use a local serif display face only on the Today headline and action title. The new UI adds no library, font request, image payload or backend.
7. **Make the small screen the baseline.** Stack the hero and next-step card, keep CTA and rows comfortably tappable, use a two-column stat layout on phones and four columns when there is room, allow text to wrap, retain safe-area padding and check for horizontal overflow. Reflow rather than shrinking essential labels.

## Reference image and implementation boundary

[`ui-refresh-reference.png`](ui-refresh-reference.png) is an AI-generated visual direction: warm paper, quiet serif/sans typography, one forest-green action surface, honest empty values, subject rows and a fixed five-item mobile bar. It is not a rendering of this repository and is not copied into the live page. The site implementation uses JELET's existing theme tokens and source-derived counts, and keeps the real local-record/resume logic. This first increment deliberately refreshes the Today dashboard, not every practice, quiz, paper-reader or lesson screen. Those need separate page-family audits and before/after review so a broad CSS change does not disrupt exam workflows.

## Next reviewable work

Inspect this screen in the running site at phone and desktop widths and in both themes. If the direction is accepted, choose the next isolated page family (practice runner, quiz, paper library/reader, or Learn) and test its complete states before generalizing shared components. Physical Android readability, tap accuracy and safe-area behavior still need an owner device pass; browser emulation alone is not that evidence.
