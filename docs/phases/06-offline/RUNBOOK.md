# 06 field guide · test on the phone after the connection disappears

| Task | Procedure | Expected outcome |
|---|---|---|
| 06.1 Pack manifest | Enumerate one pack's approved HTML, question data, fonts, maths, diagrams and hints by version and byte size. Mark external video/Lens as online-only. | User can see what is included before download; nothing from the raw archive. |
| 06.2 Failure-safe update | Start with a complete pack; interrupt download of its successor, try low space and remove/reinstall. Separate cached resources from IndexedDB attempts. | Old complete version still works, incomplete version isn't Ready, removal doesn't delete notes. |
| 06.3 Device walkthrough | Download, close tab, enable airplane mode, reopen a saved question, enlarge a figure, attempt, add a note and reload. Try an uncached URL. Repeat with keyboard, enlarged text and screen reader where available. | Local pack works end-to-end; unsupported/uncached paths explain limits. Record real device/browser, or explicitly not tested. |
| 06.4 Release rehearsal | Verify HTTPS, Pages subpath, direct links and cache update/rollback against current and prior release. Count deployed bytes; recheck free host quotas per [operations](../../OPERATIONS.md). | Release record names versions/URLs and observed faults; if rollback strands clients, hold release. |

**Evidence:** pack version/size/asset counts, failure-mode table and redacted device notes. Do not advertise “works offline” based on a previously open tab or a desktop network toggle alone.
