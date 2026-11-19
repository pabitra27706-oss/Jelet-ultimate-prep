# Phone-maintained release and maintenance playbook

**Planned workflow:** owner edits one lesson or reviews an agent's PR on Android in GitHub; Termux is optional for Git and local checks. PR shows affected pages, content changes, automated results and outstanding human checks. Merge only after review. Standard public Linux Actions build/type-check/static-test and deploy the approved artifact via Pages on the publish branch. No workflow or deployment is installed by these docs. Use the provided domain and locked dependencies; no custom domain, paid runners, paid APIs, prolonged artifact retention or private student uploads.

### Release checklist

- Verify edition, rights, IDs/anchors, backlinks, figures, readiness and score fixtures. Compare sampled pages to originals; manually review explanation and topic relevance. Generated variants must be solvable, units correct, and distractors distinct across reproducible seeds.
- Walk Today → Learn → PYQ → exact lesson section → Back; test a copied link on a fresh browser, Android share/copy fallback, long equations, a zoomed diagram, Lens paste/no match, and video return. Keyboard-only navigation, visible focus, text resizing, accessible names, contrast and no colour-only information. Record device/browser; emulator evidence isn't a phone pass.
- Test blank/partial/invalid/withdrawn/old-set scoring, interrupted timer and resume, duplicate submission, private/storage-denied mode, restore preview/cancel and unsupported backups. No notes, choices, tokens or user photos in public links/logs.
- Deploy only the public build. Check subpath refresh and not-found pages, cache version changes, offline pack removal and direct question links on the deployed URL. A green build does not prove deployment. Record date, commit, CI run, URL and user task in the [phase record](templates/phase-record.md).
- Roll back a bad release by reverting the change and redeploying the last known good public content. Test cached clients on old and new pack versions. For a bad key, immediately suspend affected scoring; preserve historical results and publish a dated correction, not a silent rewrite.

### ₹0 and maintenance review

At release and quarterly, recheck [provider limits](RESEARCH.md). Baseline Pages site cap 1 GB, soft bandwidth 100 GB/month; not an unlimited host. Check build size, major downloads and Actions/storage use; trim assets and stale artifacts before reaching limits. Disable optional services if quota or free terms change. Do not enable billing as an automatic fallback.

Each exam cycle: check new bulletin, syllabus, paper sets and final notices; add a new edition, never overwrite old rules. Monthly: inspect broken video/source links, missing figures, student issue reports and dependencies. Report form should carry only public item ID/version; remind users not to include personal info. Triage wrong keys, missing diagrams and broken section links ahead of cosmetic issues. Record resolution in [Corrections](CORRECTIONS.md).
