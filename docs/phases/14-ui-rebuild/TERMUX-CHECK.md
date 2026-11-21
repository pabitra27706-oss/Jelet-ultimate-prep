# Termux check for each pushed UI phase

All UI phase commits are pushed to the session’s fixed branch, `arena/14f27fdd-jelet-ultimate-prep`. Do not switch/create per-phase branches.

From the cloned repository, update first, then build the static site and run the preview:

```sh
cd ~/Jelet-ultimate-prep
git fetch origin
git pull --ff-only origin arena/14f27fdd-jelet-ultimate-prep
git rev-parse --short HEAD
npm run build
```

Stop an old preview with Ctrl+C, then:

```sh
npm run preview
```

Open `http://127.0.0.1:4321/Jelet-ultimate-prep/`. If `public/data/packs.json` is locally modified by a previous build and Git blocks the pull, preserve it first with `git stash push -m "before UI phase update" -- public/data/packs.json`, pull, and do not pop an obsolete generated file over the branch copy. Confirm `git rev-parse --short HEAD` matches the commit announced for that phase. If the browser still shows an earlier design, clear site data/service-worker cache for the local origin.
