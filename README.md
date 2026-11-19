# JELET Ultimate Prep

An independent JELET learning and exam-practice website, starting with Paper I. Goal: **learn a concept → practise a verified question → understand the marks → retry independently**. Guest first; ₹0 required operating cost; maintainable from Android.

**Current state:** a static parallel-circuits learning pilot plus Phase 03 previews for a stable-ID original practice card, local search/share, paste-only photo discovery and a local workspace are **published** at https://pabitra27706-oss.github.io/Jelet-ultimate-prep/ ([release evidence](docs/phases/03-library/2026-11-19-03.5-release.md)). No login, PYQ reader, scoring or live tutor. The owner accepted on 2026-11-19 that learner transfer stays untested for labelled preview work ([decision](docs/DECISIONS.md)); independent content/accessibility and physical-device reviews remain.

- [Design studio: current screens, two illustrated directions and legacy-data reconciliation](docs/phases/03R-design-recovery/README.md)
- [Handbook and document map](docs/README.md) · [Phase roadmap and current handoff](docs/ROADMAP.md)
- [Reusable agent prompt — copy for each new chat](prompt.md)
- [Rules for contributors and coding agents](AGENTS.md)
- [Preserved source and recovery guide](archive/jelet-prep/README.md) — read before retiring the old site.

## Run the learning pilot

Use Node 22.23.4 (see `.nvmrc`) and the lockfile. From the repository root:

```sh
export ASTRO_TELEMETRY_DISABLED=1
npm ci
npm run check
npm run build
npm run preview
```

Open `/Jelet-ultimate-prep/` on the preview server. `npm run test:browser` checks the built artifact on x64 Linux (see the [pilot record](docs/phases/02-learning/2026-11-19-phase-02.md) if the system lacks Chromium libraries). Only `dist/` is intended for eventual publication after release approval; never serve or publish the legacy archive with it. The existing Pages workflow is not triggered by this documentation branch.

If the Arena preview link expires, use the [on-phone Termux preview instructions](docs/phases/02-learning/ANDROID-PREVIEW.md).
