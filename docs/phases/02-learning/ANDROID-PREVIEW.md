# Run the Phase 02 pilot on your own Android phone

Use this fallback if the temporary Arena URL returns **502 / Sandbox not found**. It runs the same static build on your own phone, with no Arena connection, Node.js, npm, repo clone, account or deployment. You need internet for the ZIP download and first-time Termux package setup, not to use the extracted lesson. Termux is only for this test; students will not need it for a public release.

1. Download `jelet-android-preview.zip` from the Arena file viewer into your phone’s **Downloads** folder. Keep the filename unchanged.
2. Open [Termux](https://github.com/termux/termux-app#installation). Run the following. When Android asks for file access, allow it before running the `unzip` line.

   ```sh
   pkg install -y python unzip
   termux-setup-storage
   mkdir -p ~/jelet-preview
   unzip -o ~/storage/downloads/jelet-android-preview.zip -d ~/jelet-preview
   python -m http.server 8080 --bind 127.0.0.1 --directory "$HOME/jelet-preview"
   ```

3. Leave Termux running and open `http://127.0.0.1:8080/Jelet-ultimate-prep/` in a browser **on that phone**. No other device or network can connect to this loopback-only server. Stop it with **Ctrl+C** in Termux when finished. If Android stops Termux when the screen locks, rerun only the last command and report that the local server stopped; do not count it as a lesson failure or a backgrounding pass.

## Device check

- Enter the lesson at **Predict**. Open **Open full-size diagram**, pinch to zoom, then use **Back**; expect to return to **Predict**.
- Open a hint in **Guided practice**, lock the phone, then unlock and return to the browser. Expect the same place and open hint, with the answer still closed.
- Report PASS or FAIL, what happened, and browser/version. Report learner transfer separately; do not send personal details.

## Regenerate from the checkout

Build using the [repository instructions](../../../README.md), then run `python scripts/package-android-preview.py`. The output under `downloads/` is a generated download, ignored by Git. It contains only allowlisted files from `dist/` under `Jelet-ultimate-prep/`; it does not include source, `node_modules`, held questions or the legacy archive. Serve it only for your local test, not as a deployment.

## If Arena does not show the ZIP: fetch it with Git

Termux can fetch the [same prebuilt ZIP](device-test/jelet-android-preview.zip) directly from this working branch. Everything stays inside Termux’s home folder, so skip `termux-setup-storage` and the file viewer:

```sh
pkg install -y git python unzip
git clone --depth 1 --single-branch -b arena/28f91d3a-jelet-ultimate-prep https://github.com/pabitra27706-oss/Jelet-ultimate-prep.git "$HOME/jelet-pilot"
mkdir -p "$HOME/jelet-preview"
unzip -o "$HOME/jelet-pilot/docs/phases/02-learning/device-test/jelet-android-preview.zip" -d "$HOME/jelet-preview"
python -m http.server 8080 --bind 127.0.0.1 --directory "$HOME/jelet-preview"
```

Then open `http://127.0.0.1:8080/Jelet-ultimate-prep/` on the same phone. This copy is a fixed Phase 02 device-test snapshot, not a release. The Git checkout and its legacy archive are **not** the served directory. The single small ZIP is intentionally tracked to make the test possible when Arena downloads are inaccessible and an Android npm build is impractical; regular generated builds and downloads remain ignored. To refresh this snapshot deliberately, regenerate the ZIP as above, verify its contents, and copy it to `device-test/` alongside an updated evidence record.
