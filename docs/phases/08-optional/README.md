# 08 · Optional services and separate tracks

**Entry:** explicit owner decision and evidence of unmet need. A well-functioning site can finish with none of these services.

**Status · 2026-11-19:** the three decisions have been taken and recorded in
[DECISIONS.md](DECISIONS.md). **Login/private sync: no-go. Live AI tutor:
no-go. Pharmacy: pending owner.** The two no-go decisions rest on the
provider's own terms and on the site's static deployment, and each stands on
a fallback that was built and tested. Nothing was provisioned: no account,
no key, no endpoint, no vendor commitment. **Pharmacy needs owner-held
material** — the Paper II syllabus, the booklets, the rights and the edition
rules — none of which is in this repository.

| Candidate | Gate before pilot | Reject or disable if… |
|---|---|---|
| Login and private sync | Students actually need multiple devices; provider supports ₹0 with hard limits; test account isolation, guest conflict merge, export and deletion, provider outage | Billing exposure, required signup, unsafe records or lost guest history |
| Live AI tutor | Reviewed hints insufficient; secret stays server-side, consent and minimal context, no personal notes, opt-out, limits and strict ₹0 ceiling | Requires paid usage, invents authority, changes grading or interrupts guest study |
| Pharmacy | Separate owner scope, syllabus, rights-cleared papers/keys and rules; repeat evidence and learning pilots | Would reuse Paper I rules or imply unverified coverage |

**Exit:** dated go/no-go decision, free fallback, quota-change and shutdown procedure, and evidence that all core journeys work with the service off. Copyable AI prompts and manual backup remain alternatives without a live integration.

**Execute:** [ordered tasks and acceptance checks](RUNBOOK.md). Use the [reusable session prompt](../../../prompt.md) and [roadmap](../../ROADMAP.md) for authorization and status.
