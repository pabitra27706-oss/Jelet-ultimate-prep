# Phase 06 · release record · 2026-11-19

- **Phase/task/status:** 06-offline / release hardening. **Published and agent-verified. Phone release evidence still pending.**
- **Branch/commit:** `arena/1e582bac-jelet-ultimate-prep`, Phase 06 built in `6e4d6f2`, carried in the branch head `45be567`.
- **Public URL:** https://pabitra27706-oss.github.io/Jelet-ultimate-prep/ — project subpath, HTTPS enforced, no custom domain, no spend. Confirmed from the GitHub Pages API (`repos/pabitra27706-oss/Jelet-ultimate-prep/pages` → `html_url`, `https_enforced: true`, `build_type: workflow`, `cname: null`) and by fetching the live pages below.

## Publication state

| Item | Value |
|---|---|
| Deployed by | [Pages run 44632743958](https://github.com/pabitra27706-oss/Jelet-ultimate-prep/actions/runs/44632743958), commit `45be567`, all six suites green before the artifact was uploaded |
| Previous published release | [44608640041](https://github.com/pabitra27706-oss/Jelet-ultimate-prep/actions/runs/44608640041), commit `26ad6b7` — the exam-engine build, 33 pages, 73 files, 7.9 MB |
| This build | 42 pages, 86 files, 8.7 MB (8,810,834 bytes), of which the public allowlist is 52 files / 8,472,717 bytes (8.08 MB) |
| Live routes confirmed by fetch | `/offline/`, `/coverage/`, `/workspace/`, `/practice/jelet-et-p1-2025/reconciliation/` — each returns the real Phase 05–08 content, not a 404 |

The offline packs, the reconciliation ledger, the printable companion, the
coverage dashboard and the full study-record backup are **live on the public
URL**. The deploy job now runs all six suites before it uploads the
artifact, so a build the suites reject cannot reach the site.

The live site's pack page states the release version as `2026.11.19-phase06`
and lists the 2025 pack as **53 files · 3.1 MB · works with no connection**,
which matches the manifest in `public/data/packs.json` byte for byte.

## The public build size

| Measure | Value |
|---|---|
| Whole build on disk | 8,810,834 bytes across 86 files |
| Public allowlist only | 8,472,717 bytes across 52 files |
| Previous published release | 7.9 MB across 73 files |
| Growth | +0.8 MB, +13 files — the growth is the offline pack payloads, the reconciliation and OMR routes, and the coverage dashboard |
| One offline pack (2025 paper) | 3,170 KB, 53 files |
| Offline packs, all four | 10,078 KB |
| Largest single file | `workspace/index.html` at 113,940 bytes, because it carries the full question bank for the workspace panels |

The allowlist is enforced by the same `scripts/public-artifact.json` in CI and
in the browser suite, so nothing can reach the published site by accident.

## What was actually run

The rehearsal was not described; it was run. Both releases were built for
real and served from a single origin whose document root was swapped in
place, which is what a Pages rollback actually does to a client.

```
git archive 26ad6b7 | tar -x -C /tmp/oldrelease     # the previous release
npm --prefix /tmp/oldrelease run build               # 33 pages
node scripts/rollback-rehearsal.mjs /tmp/oldrelease/dist
```

| Rollback check | Observed | Result |
|---|---|---|
| The new release downloads an offline pack | `paper-2025` reached `Ready` | Pass |
| The new release records a submitted attempt | 1 submitted attempt in `jelet:attempts:v1` | Pass |
| The client holds a pack cache | `jelet-pack-paper-2025-2026.11.19-phase06` | Pass |
| The site still renders after the rollback | "Prepare for JELET on your own." | Pass |
| The study record survives the rollback | 1 submitted attempt before and after | Pass |
| The offline pack survives the rollback | pack cache intact | Pass |
| A deep link still works after the rollback | "Paper library" | Pass |
| The client is still controlled by a service worker | `sw.js` still registered and controlling | Pass |
| **The offline pack still opens the paper after the rollback** | **85 questions available with no connection** | Pass |
| No page errors during the rollback reload | none | Pass |

**10 of 10 rollback checks passed.**

The last check is the one that matters and it is the hardest case: the
server had been rolled back to a build that has **no offline packs at all**,
and the client was taken offline. The paper still opened, all 85 questions,
because the pack is the client's own copy. The pack cache survives the
rollback even though the previous release's service worker (`jelet-shell-v1`)
deletes every cache it does not recognise — the new worker names its pack
caches `jelet-pack-…` and the old worker only knows `jelet-shell-v1`, so a
rollback to the old worker would **delete the packs**.

This is a real, named risk. If the site is ever rolled back past the Phase
06 service worker, learners lose their downloaded packs and must re-download
them. Their **study record is not affected**: attempts, the review queue and
notes live in localStorage, which no service worker touches. The correct
rollback for this project is therefore to roll back to a commit at or after
`6e4d6f2`, not to the published release. This is now stated in
[OPERATIONS.md](../../OPERATIONS.md).

## Browser and device tasks

Run in Chromium 153.0.8010.0 (Playwright, headless) at a 390 × 844 mobile
viewport with touch emulation, against the real built artifact served over
HTTP from a local static server.

| Task | Procedure | Observed | Result |
|---|---|---|---|
| Pack manifest | Open the offline page and read every pack row | 4 packs, each stating version, size and whether it works with no connection; `paper-2025` starts as "Not downloaded." | Pass |
| Pack download | Download `paper-2025` | reached `Ready`; the pack has its own `jelet-pack-…` cache, separate from the shell | Pass |
| Offline paper | Open the 2025 paper with the network off | all **85 questions** present, KaTeX maths rendered from the cached fonts | Pass |
| Removal safety | Remove the pack | the pack files are deleted; the study record is untouched | Pass |
| Failure-safe update | Interrupt a download | the staging cache is discarded, the previous complete pack stays, and the pack never reports `Ready` | Pass |
| Shell offline | Load the site offline with no pack | the shell renders from the shell cache; search still returns matches from the cached index | Pass |
| Uncached path | Open a page that was never downloaded while offline | a 503 page explains that the page is not on the device and names the offline packs | Pass |
| Rollback | Swap the server to the previous release and reload | 10 of 10 checks pass, including the offline paper opening | Pass |
| Screen width | 320 / 390 / 1280 px and 200 % text | layout holds; no horizontal scroll | Pass |
| Keyboard and focus | Tab order, visible focus, no-JS | pass | Pass |

**Not tested on a physical device.** No Android phone, no real browser on a
real phone, and no real storage-pressure event was exercised in this phase.
The earlier owner-reported Termux checklist (Phase 03) predates the offline
packs and does not cover them. **A physical Android pass remains an open
gate** for the following:

1. download a pack on a real phone, then switch to airplane mode and
   complete a full paper with every diagram, font and hint;
2. interrupt a pack download on a real phone and confirm the earlier
   complete pack is still `Ready` and still works;
3. remove a pack on a real phone and confirm the attempts and notes survive;
4. low-storage behaviour and what the browser's storage eviction actually
   does to a pack.

Until those are done, the site must not claim "works offline on Android".
The honest statement is: *the offline packs were verified in a desktop
Chromium emulation at a mobile viewport; the physical Android pass is
outstanding.*

## Unsupported browsers and features

Stated honestly, as the gate requires.

| Feature | Support | Note |
|---|---|---|
| The site itself | Any browser with ES2020 modules | The build is modern static HTML; no polyfills are shipped. |
| Offline packs | **Requires the Cache Storage API and service workers** | Without them the offline page says the browser cannot store offline packs. No fallback to IndexedDB is implemented, because a second storage backend is a second thing to keep correct. |
| Service worker scope | Requires serving over HTTPS (or `localhost`) | GitHub Pages serves HTTPS; a plain-HTTP LAN address will not register a worker, so no offline pack will work there. |
| Persistent storage | Uses `navigator.storage.persist()` when available | A browser may refuse. The refusal is reported in the UI, not hidden. |
| Storage estimate | Uses `navigator.storage.estimate()` when available | Missing → the size line is omitted rather than faked. |
| IndexedDB | **Safari private browsing and some embedded webviews block it** | The workspace then falls back to an in-memory store and says so. |
| `crypto.randomUUID` | Not required | Attempt ids fall back to a timestamp-and-counter scheme. |
| Screen reader | VoiceOver and TalkBack were **not** tested in this phase | The markup carries labels, roles and live regions, and the earlier phase-03 accessibility pass covered them at the emulation level only. An independent accessibility review is still open. |

## Free-quota review before expanding assets

Re-checked against the provider's own pages on 2026-11-19; the details are
in [RESEARCH.md](../../RESEARCH.md).

| Resource | Free tier | Use here | Headroom |
|---|---|---|---|
| GitHub Pages | 1 GB published site, 100 GB bandwidth/month | 8.08 MB published, 10 MB of packs | ~1 % of the site quota; bandwidth is the larger exposure and is not close to the limit for an exam-prep audience |
| GitHub Actions | 2,000 minutes/month on public repositories | ~1 minute per run | Comfortable; the workflow runs check, build, test and the artifact allowlist |
| No paid runner, no custom domain, no card, no always-on server | — | the whole site is static | ₹0 |

The assets are deliberately not growing: the four packs together are 10 MB
and the whole published site is 8.08 MB. Adding video or higher-resolution
diagrams would be the first thing to break the quota assumption, so it has
not been done.

## Rollback

- **Correct rollback:** revert to any commit at or after `6e4d6f2` (the
  Phase 06 service worker). Packs, the study record and the shell all keep
  working.
- **Rollback past Phase 06** (to `26ad6b7` or older): the site works, the
  study record survives, but the previous service worker deletes the
  `jelet-pack-…` caches on activation, so learners lose their downloaded
  packs and must re-download them. Nothing else is lost.
- **Full withdrawal:** disable the Pages workflow and the site. The archive
  and the legacy site are untouched, and no student data was ever in Git.
- **Recovery time:** the Pages workflow publishes in about 40 seconds from
  the merge; the archive is intact at every commit.

## Records

- Offline packs: `src/lib/offline.ts`, `scripts/build-packs.mjs`, `public/sw.js`
- Rollback rehearsal: `scripts/rollback-rehearsal.mjs` (run it; it exits
  non-zero if any check fails)
- Manifest: `public/data/packs.json`, generated at build time from the real
  files, so the size shown before a download is the size the learner gets

**Roadmap updated by/date:** agent, 2026-11-19 — Phase 06 release record
written; the public URL, the build size, the browser tasks and a run rollback
rehearsal are recorded. The physical Android pass and the publication of
this branch remain open.
