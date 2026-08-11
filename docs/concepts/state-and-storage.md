---
id: concepts/state-and-storage
title: State, revisions, and durable ownership
description: Choose the storage primitive that matches the state transition you need to protect.
audience: human
section: concepts
order: 3
publication: released
examples:
  - stage-08-session-store
  - stage-10-workspace
proofs:
  primitives:
    - release-github-com-looprig-storage
  local-durability:
    - release-github-com-looprig-fsstore
  workspace:
    - release-github-com-looprig-storage
---

# State, revisions, and durable ownership

State is easier to reason about when the write contract says what can conflict. Storage provides an append-only Ledger for history, a Leaser for one writer, revision-CAS KV for mutable metadata, and immutable Blobs for content-addressed bytes.

## Primitives {#primitives}

Use Ledger when order and history matter. Use Leaser when a process must own a single-writer operation. Use KV when the latest value is enough and a revision protects replacement. Use Blobs for files, snapshots, and large immutable payloads, retaining only a safe key in KV or Ledger. `AppendDefinite` resolves ambiguous appends by replaying the same payload and comparing the committed record.

## Local durability {#local-durability}

Fsstore puts all four primitives under one explicit owner-only root. It distinguishes a torn final frame, which can be truncated to the previous complete frame, from present-but-corrupt bytes, which must stop the store. `stage-08-session-store` proves path configuration; `stage-09-restore` proves restore against that backend.

## Workspace {#workspace}

Workspace snapshots use Blobs, not ad hoc copies in a ledger record. `stage-10-workspace` snapshots a source directory into `memstore.Blobs`, materializes it elsewhere, and asserts exact file contents. The same boundary scales to a durable backend, but the caller still owns retention, cleanup, and the meaning of a snapshot reference.
