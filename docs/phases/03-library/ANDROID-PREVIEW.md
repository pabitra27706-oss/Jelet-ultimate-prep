# Run the Phase 03 preview from GitHub on your Android phone

Use this when the temporary Arena preview link is unreachable. It fetches a **fixed static snapshot** from the assigned Git branch and serves it only on the phone. No Arena link, Node/npm in Termux, account, paid service or public deployment is needed. Students would not need Termux for a real Pages release.

**Snapshot:** `device-test/jelet-phase03-preview.zip` — 24,333 bytes, SHA-256 `77ced888133a8c4288f828466f2ba08bde209ef601a0a9dd242177b8713c448e`. It contains the 15 allowlisted files from the Phase 03 build under `Jelet-ultimate-prep/`; no source, `node_modules`, archive, held question, private note or student data is included. It is a test snapshot, not a release.

## Termux steps

```sh
pkg install -y git python unzip
git clone --depth 1 --single-branch -b arena/4ad06920-jelet-ultimate-prep https://github.com/pabitra27706-oss/Jelet-ultimate-prep.git "$HOME/jelet-phase03"
mkdir -p "$HOME/jelet-phase03-preview"
unzip -o "$HOME/jelet-phase03/docs/phases/03-library/device-test/jelet-phase03-preview.zip" -d "$HOME/jelet-phase03-preview"
python -m http.server 8080 --bind 127.0.0.1 --directory "$HOME/jelet-phase03-preview"
```

Leave Termux open and visit `http://127.0.0.1:8080/Jelet-ultimate-prep/` in a browser **on the same phone**. The server is loopback-only; other devices cannot reach it. Stop with **Ctrl+C**. If Android stops Termux on lock, report that the local server stopped rather than treating it as a lesson failure.

## What to check

- Today → Learn → Parallel circuits → **Take the independent check** → practice card.
- On the card, confirm the original-ID label, no answer, **Learn this concept**, **Back to lesson section**, and **Share this card**.
- Open **Search**, paste `A 9 V source feeds 6 Ω and 3 Ω branches in parallel`, and confirm the original practice card is found; paste text about a graph with no readable words and expect “No match yet”.
- Open **Workspace**, save a bookmark and note, reload, then confirm Today shows **Continue saved item**. Export and re-import the file if you want to check backup; keep the export private.
- Report PASS/FAIL with phone/browser/version. Native share sheet, real Lens app switching, TalkBack and cold-launch persistence remain separate owner checks; agent Chromium checks do not replace them.

## GitHub Pages

The static output is suitable for GitHub Pages and the project already uses the `/Jelet-ultimate-prep/` subpath. However, adding a deployment workflow or publishing is a **separate go/no-go decision**: it needs the 03.5 release audit, rights/accessibility review and an explicit owner instruction. This snapshot is only a local device-test copy. See [OPERATIONS.md](../../OPERATIONS.md) for the release checklist.
