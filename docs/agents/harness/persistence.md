---
id: agents/harness/persistence
title: Harness persistence and workspace state
description: Wire journals, leases, session stores, replay, content-addressed workspace snapshots, and restore-safe cleanup.
audience: agent
section: agents/harness
order: 32
publication: released
proofs:
  ownership-graph:
    - release-github-com-looprig-harness
  journal-contracts:
    - release-github-com-looprig-harness
  session-store:
    - release-github-com-looprig-harness
  workspace-store:
    - release-github-com-looprig-harness
  restore-invariants:
    - release-github-com-looprig-harness
  human-routes:
    - release-github-com-looprig-harness
  source-tests-runnable-proof:
    - release-github-com-looprig-harness
  journal:
    - release-github-com-looprig-harness
  stores:
    - release-github-com-looprig-harness
---

# Persistence and workspace state

## Ownership graph

```text
storage.Composite -> sessionstore.Open -> lease + SessionJournal
                                       -> Catalog / event or record replayer
storage.Blobs    -> workspacestore.Open -> Snapshot / Materialize / GC
Rig              -> Session owns live journal, workspace permits, and replay
```

The composition root opens backends and closes them after the Session. A
session journal is single-writer and lease-fenced. A workspace snapshot is an
immutable content-addressed blob; the live workspace root is session-owned.

## Journal contracts

| Surface | Rule |
| --- | --- |
| `journal.SessionJournal.Append(ctx, JournalRecord)` | one serialized writer; returned sequences are strictly monotonic and gap-free |
| sealed `journal.JournalRecord` | only `EventRecord`, `CommandRecord`, and `FenceRecord`; each exposes a stable `IdempotencyID` |
| `journal.NewEventRecord`, `NewCommandRecord`, `NewFenceRecord` | wrap typed payloads; command records carry explicit session/loop route |
| `journal.Lease` | single-writer epoch; holder calls `Release`; journal refuses appends after loss |
| `EventCursor`, `RecordCursor` | ordered replay; `io.EOF` only after cold backlog; decode/read errors are typed and never skipped |
| `IdempotentJournal.AppendIdempotent` | identical retry de-duplicates with original seq; same ID plus different payload returns `*IdempotencyCollisionError` |
| appenders | `NewJournalEventAppender`, `NewJournalCommandAppender`, and gate/lease variants adapt narrow runtime seams |

Use `journal.WithHooks` or `HookMiddleware` only at the journal boundary. Treat
`*journal.LeaseLostError`, `*journal.JournalNotReadyError`,
`*journal.AppendError`, `*journal.AmbiguousAckError`, and collision errors as
typed state transitions, not retryable text.

## Session store

`sessionstore.Open(*storage.Composite, opts...)` requires the composite's ledger,
leaser, KV, and blobs. Use:

- `AcquireLease` then `OpenJournal` for live ownership;
- `OpenEventReplayer` for public event history and
  `OpenInternalRecordReplayer` only for privileged recovery;
- `OpenCatalog`/`Catalog.ListSessions`/`ReadMeta` for replay-free listings;
- `RepairCatalog` when the derived KV projection is missing or stale;
- `OpenObjectGC` and workspace live-ref helpers only under the session's
  serialization and lease policy.

`SessionMeta` is a cache/projection, never the source of truth. The ledger is
authoritative. `Options.OffloadThreshold` moves large event payloads to blobs;
blob pointers must pass integrity and ID checks. `GC` has no timestamp grace
from the storage contract, so the caller must provide single-writer/idle
serialization.

## Workspace store

`workspacestore.Open(storage.Blobs, opts...)` resolves archive limits and an
optional spool directory. `Snapshot(ctx, root)` returns an opaque
`Ref` in canonical form `v1:sha256:<64 lowercase hex>`; obtain refs from the
store or `ParseRef`, never construct them by concatenating strings.

`Materialize(ctx, ref, dest)` fails if destination state conflicts and enforces
entry/byte caps; `Delete` is idempotent; `GC(ctx, live)` deletes unreferenced
refs. `ArchiveLimitError`, `IntegrityError`, `DestNotEmptyError`,
`MaterializeError`, `InvalidRefError`, and `GCError` are typed boundaries.

Rig placement chooses exactly one of shared, session, or exclusive workspace
options. Session checkpoint/restore uses the configured snapshot policy and
workspace lease; do not treat a snapshot ref as a live workspace lease.

## Restore invariants

- Acquire the session lease before opening its journal or replaying state.
- Replay validated records in journal sequence. Never skip malformed records or
  treat a derived catalog row as durable history.
- Compare configuration fingerprint/manifest, runtime identity, tool schema,
  workspace placement, and policy revisions before admitting new work.
- Restore unresolved gates, compaction, delegation, and workspace records before
  new commands. Release the session, then the lease/store/backends.

## Human routes

[`/docs/guides/harness/session-persistence/journal`](/docs/guides/harness/session-persistence/journal),
[`/docs/guides/harness/session-persistence/session-store`](/docs/guides/harness/session-persistence/session-store),
and [`/docs/guides/harness/session-persistence/restore`](/docs/guides/harness/session-persistence/restore)
map journal and store operations. [`/docs/guides/harness/workspaces`](/docs/guides/harness/workspaces)
covers bindings, leases, materialization, snapshots, restore, and cleanup.

## Source, tests, runnable proof

- [`pkg/journal/journal.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/journal/journal.go), [`pkg/journal/record.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/journal/record.go), [`pkg/journal/lease.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/journal/lease.go), [`pkg/journal/idempotency.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/journal/idempotency.go), [`pkg/journal/idempotency_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/journal/idempotency_test.go).
- [`pkg/sessionstore/sessionstore.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/sessionstore/sessionstore.go), [`pkg/sessionstore/journal.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/sessionstore/journal.go), [`pkg/sessionstore/replay.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/sessionstore/replay.go), [`pkg/sessionstore/catalog.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/sessionstore/catalog.go), [`pkg/sessionstore/replay_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/sessionstore/replay_test.go).
- [`pkg/workspacestore/store.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/workspacestore/store.go), [`pkg/workspacestore/snapshot.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/workspacestore/snapshot.go), [`pkg/workspacestore/materialize.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/workspacestore/materialize.go), [`pkg/workspacestore/store_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/pkg/workspacestore/store_test.go).
- [`examples/persistence/example_test.go`](https://github.com/looprig/harness/blob/8b91dadbb8d52d6486e0e5808803881d9888b19b/examples/persistence/example_test.go).
