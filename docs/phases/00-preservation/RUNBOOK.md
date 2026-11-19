# 00 field guide · recover without the upstream

Use the [capture manifest and restore commands](../../../archive/jelet-prep/README.md); do not rebuild or overwrite the captured bundle as a test. This is a preservation drill, not a site migration or deletion ticket.

| Task | Procedure | Evidence to retain |
|---|---|---|
| 00.1 Verify | From the archive directory check the supplied SHA-256 manifest. Compare main SHA and ref list to the capture notes. On mismatch stop using that copy. | Date, manifest result, expected vs observed commit/ref count. |
| 00.2 Restore | In a new temporary destination restore from the local bundle, without a remote fetch; inspect branches and Git object integrity. Open one transcription, a key and a figure from restored main. | Restore path class (temporary), command results and sampled file IDs, not another archive in Git. |
| 00.3 Owner handoff | Ask owner to save an independent copy, recover it, retain any originals and export personal study data from each relevant browser. If the source changed since capture, propose a separate dated capture. | Confirmed / pending for each owner step; no personal files or IDs. |

**Decision:** a successful local restore demonstrates capture integrity, not ownership of PDFs or recovery of browser data. If device exports or the second copy are missing, keep retirement pending. Never delete or rename the source repository as part of this phase.
