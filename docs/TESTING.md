# Verification contract: agent first, owner only for the physical gap

Applies to every phase, including research and docs. The runbook gives the minimum cases, not a ceiling. For each changed behaviour and its affected neighbours, run all feasible relevant checks; include an ordinary case, a failure or boundary case, and regression coverage where applicable. Never hand the owner a build to debug a failure the agent can reproduce. If one tool is unavailable, record the blocker, use a suitable alternative and finish the independent checks.

| Evidence | Agent's job | What passing does **not** prove |
|---|---|---|
| Docs and content (Python) | Resolve local links, phase/task references and referenced files. When records exist, check IDs, required fields, set mapping, reverse links, points and generator boundaries against known fixtures. Compare sources separately. | A valid schema does not prove a key is official, a translation is correct or a lesson teaches the concept. |
| Build and logic | Discover the project's actual commands and run applicable build, type, unit and integration suites. For Python suites use the project's runner (e.g. `python -m unittest discover -s tests` or `python -m pytest` when configured); record test counts. Zero collected tests is not coverage. | A successful build does not prove the page works or was deployed. |
| Web flows (headless Chromium) | When a site exists, serve the built artifact at its intended subpath and drive Chromium, e.g. with Playwright. Use fresh and returning contexts at narrow touch and desktop sizes. Assert outcomes: direct PYQ link → exact lesson anchor → Back, keyboard focus, no page-wide overflow, reload persistence, wrong/blank input and console/page errors. Test timer expiry, offline reload, interrupted updates and share/copy fallbacks as those features land. | Simulated touch, offline mode, share mocks, accessibility trees and screenshots are **not** a physical Android, TalkBack, or live Lens pass. |
| Real Android (owner) | After automation, isolate only the remaining device-dependent claim: e.g. native share target, Lens app switch/return, TalkBack announcement, lock/background behaviour, installed pack after airplane-mode cold launch. | One model/browser does not certify every Android device. Keep content/expert and student review separate. |

Use project-pinned tooling or a compatible available Chromium; record its version, viewport and command. If the binary cannot run locally, try the approved free CI path when available, or record why blocked; do not move routine browser tests to the owner. Don't install an app stack just to validate a Markdown-only change. Keep private data out of fixtures, traces and screenshots.

## Handoff rule

Record commit/build, environment, command or steps, expected vs observed, result (pass / fail / blocked / not applicable) and safe evidence path. After a fix, rerun the failing case and affected regressions. An unrun required check stays pending. Continue other in-scope checks while awaiting the owner.

If physical evidence really is needed, send **this exact signal** in chat, filled out rather than just ticking a checklist:

> **ANDROID CHECK NEEDED** — [phase/task; tested build and phone-accessible URL]. Automated checks passed: [what]. Only you can check: [specific device behaviour]. On your Android: [short numbered steps]. Expected: [observable result]. Reply **PASS**, or **FAIL** with what happened and your browser/version. No private notes, backups, or account screenshots needed.

If the build is not accessible on the phone, report that blocker first; do not send a localhost link. Record the owner's reply as owner-reported on that build, not as agent-observed. If automation was sufficient, say so; do not request a physical check by default.
