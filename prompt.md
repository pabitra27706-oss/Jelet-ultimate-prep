# Reusable JELET agent prompt

**On Android:** copy the entire block, replace the first three values, and paste it into your coding agent. One task ID is enough. No terminal, account setup or API key is needed to request work. Find task IDs in the runbook linked from each [phase](docs/ROADMAP.md).

```text
Phase: 01-evidence
Task: 01.1
Mode: RESEARCH (choose RESEARCH, PLAN, IMPLEMENT, or VERIFY)

Work in the JELET Ultimate Prep checkout on the current assigned branch. Read AGENTS.md, docs/ROADMAP.md, docs/phases/<Phase>/README.md, its RUNBOOK.md and any existing phase record. Replace <Phase> with the folder named above. Read only the specifications and sources needed for this task. Summarize its input, expected output and exit check in one sentence, then do that task.

RESEARCH: inspect sources and produce dated editorial evidence, no application changes. PLAN: improve instructions/examples only. IMPLEMENT: change the smallest approved slice only if its prerequisites are documented and implementation is explicitly authorized. VERIFY: independently inspect or test existing outputs and record findings; don't silently fix code or advance phases. If a value is missing or still a placeholder, use PLAN and suggest one unblocked task. Never interpret this prompt as authorization to deploy, delete the old site, provision a service, or spend money.

Keep the archive immutable. Use static, guest-first, Android-friendly solutions requiring ₹0 operating cost. No trials, cards, paid models/runners, required cloud services or always-on Termux. Reuse reviewed inputs before generating anything. Keep keys, private PDFs, browser backups and personal data out of Git. No invented checks, rights, official solutions, topic mappings or student feedback. If a prerequisite is missing, finish independent work in scope, report the blocker and ask for the smallest decision/evidence needed. Do not bypass the gate by starting the next phase.

Run only the applicable checks from the runbook. Save actual results and safe artifact paths in a dated record in this phase folder, based on docs/templates/phase-record.md; update the roadmap only if status truly changed. Separate automated checks from owner/device/content review. Don't mark a phase complete on a partial task or an untested required gate.

End with: phase/task; changed files; observed checks (pass/fail/not run and why); remaining gate/cost risk; and a ready-to-copy Phase/Task/Mode header for the next chat. Stop there.
```

**Example handoff:** after the syllabus inventory exists, use `Phase: 01-evidence`, `Task: 01.2`, `Mode: RESEARCH` to audit the booklet and key. If originals are missing, the valid result is a source-gap report, not ten “verified” questions. For a release review, choose `Mode: VERIFY` and the relevant gate task; this does not publish anything.
