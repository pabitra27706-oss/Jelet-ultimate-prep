# Legacy data archive · 19 November 2026

Source: `pabitra27706-oss/Jelet-prep`; default branch `main` at `863458f0c0d5aa29adbf67fcac91c6193b249c62`. Treat this directory as a read-only baseline. Correct material in the new editorial collection, retaining a pointer to the old item; do not silently rewrite this evidence.

| Preserved material | Location |
|---|---|
| Seven question-paper transcriptions: 2017, 2018, 2019, 2021, 2022, 2024, 2025 | [pyq-md](data/pyq-md/) |
| Raw syllabus and the site's topic-group representation | [syllabus](data/syllabus.md), [topic groups](data/src/syllabus-data.ts) |
| Paper I key transcriptions labelled official (2023–26), set mappings, withdrawals; separately derived 2022 answers and cross-check | [official keys](data/docs/official-keys/), [derived keys](data/docs/derived-keys/) |
| Figure manifest and pilot redraws, audits, evidence, editorial and licensing decisions | [figures](data/docs/figures/), [audits](data/docs/audits/), [documentation](data/docs/) |
| Complete tracked source, including legacy HTML with embedded material, reader, tests, workflows and history reachable from **all seven branch heads**; no tags advertised | `source.bundle` |

The 50 browsable files are byte-for-byte extracts from `main`, not an endorsement of their contents. Prefer the dated verification records over stale README summaries. A key without the corresponding paper does not make a mock test. In particular, do not promote a derived key to a board key, assume the 2019 year label is right, or grade a question missing its diagram. The original booklet PDFs referenced in the audit were not tracked in the snapshot. Preservation does not confer publication rights; keep this archive outside the deployed site.

## Recover without the original GitHub repository

From this directory, with Git and SHA-256 tools available:

```
sha256sum -c SHA256SUMS
git clone -b main source.bundle recovered-jelet-prep
git -C recovered-jelet-prep rev-parse HEAD
git -C recovered-jelet-prep branch -r
git -C recovered-jelet-prep fsck --full
```

The expected HEAD is printed above. At capture a fresh bare clone restored every branch at the original commit, passed `fsck`, and all 50 extracts matched their original Git blobs. The checksum manifest covers the bundle and those extracts.

## Before retiring the old site

1. Save an independent copy of this archive outside both repositories and repeat the recovery check there. Recheck the source heads if deletion is not immediate.
2. Export notes, bookmarks and progress **from each browser/profile that used the old site** using Backup & settings. Store these JSON files privately, not in Git. The bundle cannot contain browser storage. Do not promise migration until a sample export can be imported and checked in the new site.
3. Keep private originals, separately obtained PDFs and permissions separately. The bundle is Git history, not an export of GitHub issues, PR discussions, external links, deployment settings or user devices.
4. If possible, keep the old URL read-only with a migration notice until students have had time to export. This project does not change or delete the old site.
