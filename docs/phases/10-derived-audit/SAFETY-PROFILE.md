# Interim validation safety profile · 2026-11-20

## Authority and scope

The owner delegated the next progress steps in chat after the 10.1–10.2 findings. This record documents the agent's conservative implementation choice on the current branch. It does **not** rewrite the original ADR acceptance, certify an answer, grant publication rights, or approve any paper for scoring.

Until the conflicting phase-09 promotion rules are reconciled, the validator uses the stricter intersection of the existing page-based runbook and schema. A weaker rule cannot silently win because a field was absent. This profile applies to the four target-year editorial records, not the application's existing official-key pipeline.

## Effective rules for this validator

1. Schema 1.1.0's authorised exception is recognised: `unsolved` and `corpus-text-unverified` records may exist as held evidence. No images are required merely to preserve that provisional work.
2. `derived-verified` requires an existing source-image reference confined to the year's page directory, positive source page, page-checked option fidelity, nonempty reasoning/source text, verification note, and a named cross-check explicitly declaring independent agreement. A present failed machine check blocks verification.
3. Eligibility additionally requires explicit boolean owner approval, both integration gates explicitly true, matching stream metadata, figure-free presentation, Category I and a single answer. Absent, null, numeric or string approval is not approval.
4. A passing machine-check record must identify an existing script under that year's checks directory. Commands are restricted to interpreter + script + optional matching question argument; no shell operators. The validator does not execute commands.
5. Source paths are checked for existence and real-path confinement, including symlink escape. Source-image references are repository-relative, e.g. `editorial/derived-keys/2017/pages/p03.png`, not `pages/p03.png`.
6. No publisher key is established for these inputs. A null reference is not proof of historical nonpublication; the derived-work validator cannot create an official tier.

## What validation cannot establish

File presence is not image authenticity or legibility. A solver declaring independence does not prove independence. A command naming a real script does not prove the script calculates the right quantity. The validator cannot decide whether a question is computable and therefore requires a machine check; the item audit must make and record that determination. It does not adjudicate the equivalence of expected/observed prose or numeric tolerances. All these remain audit work.

Tests use explicitly synthetic evidence placeholders to exercise filesystem checks; they are not question-paper images and are not published evidence.

## Integration boundary

Only the validator was imported from PR #9's fixed revision and hardened here. No target-year answer keys, check scripts, source images or corpus changes were imported into the application. The five remote numeric scripts were temporarily materialised solely to check file references and then removed; they were not executed. Gate A's application loader defect remains unfixed. This validator is not wired into that loader and cannot make an unintegrated paper safe to score by itself.

`npm run validate:keys` reports “no key files found” on this branch; that is not a successful audit of PR #9. The recorded remote-input validation in EVIDENCE.md is the evidence for compatibility with the current provisional records.

## Later reconciliation

Keep this stricter profile until a reviewed policy update resolves the acceptance/runbook difference and adds corresponding positive and negative tests. Do not change the profile just to make a proposed promotion pass. Display approval remains distinct from scoring approval; neither is granted by this document.
