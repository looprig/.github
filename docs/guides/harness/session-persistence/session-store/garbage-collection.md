---
id: guides/harness/session-persistence/session-store/garbage-collection
title: Garbage collection
description: Collect expired Session data under explicit retention rules.
audience: developer
section: guides
order: 20
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  object-gc-contract: [release-github-com-looprig-harness]
  live-set-sweep: [release-github-com-looprig-harness]
  lease-and-shutdown: [release-github-com-looprig-harness]
  workspace-reference-scan: [release-github-com-looprig-harness]
  gc-example: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Garbage collection

Sessionstore GC reclaims only orphaned legacy offload blobs, the
`sessions/<uuid>/blobs/<sha256>` shape older releases wrote. It is not a
journal compaction operation and it never deletes ledger history. Because an
upload is durable before its ledger pointer, a crash can leave an unreferenced
blob; GC scans the ledger for live pointers and sweeps the remainder.

Current releases store offloaded journal bodies and captured tool results as
SessionStore objects. GC never deletes those, because SessionStore exposes no
public enumeration or deletion API for them yet, and it counts them in
`GCResult.Unreclaimable` instead. An orphaned SessionStore object stays until
such an API exists.

## Object GC contract

The exact public types are:

```go
type GCResult struct {
	Scanned       int // legacy blobs considered
	Referenced    int
	Deleted       int
	DeletedKeys   []string
	Unreclaimable int // other keys under the blob prefix, live or orphaned
}

func (s *Store) OpenObjectGC(
	id uuid.UUID, lease journal.Lease,
) (*ObjectGC, error)

func (g *ObjectGC) GC(context.Context) (GCResult, error)
```

`OpenObjectGC` rejects a nil lease with `*sessionstore.NilLeaseError`. The GC
does not acquire or release ownership; the composition root supplies the lease
and remains responsible for its lifetime.

## Live-set sweep

One pass performs these steps:

1. Check `lease.Valid()` and `lease.Lost()`; otherwise return
   `*GCLeaseNotHeldError` and delete nothing.
2. Read every ledger frame under `sessions/<uuid>`. Validate each SessionStore
   envelope's object references and collect blob keys from legacy `blobptr`
   frames.
3. List `sessions/<uuid>/blobs/` and keep only legacy keys, one lowercase
   SHA-256 leaf directly under the prefix. Count every other key as
   unreclaimable.
4. Delete legacy keys absent from the complete live set, in sorted order.
5. Recheck lease ownership before each delete. A loss stops the sweep.

```mermaid
%%{init: {"theme":"dark"}}%%
flowchart TD
    A[GC(ctx)] --> B{lease still held?}
    B -- no --> X[GCLeaseNotHeldError, no deletes]
    B -- yes --> C[scan every ledger frame]
    C -->|scan/decode error| Y[GCScanError, no deletes]
    C --> D[list blob prefix]
    D -->|list error| Z[GCListError, no deletes]
    D --> E[set difference: listed minus referenced]
    E --> F{lease before each delete?}
    F -- no --> Q[stop with GCLeaseNotHeldError]
    F -- yes --> G[delete orphan]
    G --> H[GCResult]
```

On a successful pass `Scanned == Referenced + Deleted`. Read it together with
`Unreclaimable`: a pass over a session whose prefix holds only SessionStore
objects reports zeros for the first three and a nonzero `Unreclaimable`.
`GCScanError` and `GCListError` fail closed because an incomplete live set is
unsafe. A delete failure returns `*GCDeleteError` with the blob key; previous
deletes are not rolled back, so operators can run another pass.

## Lease and shutdown

Storage has no per-blob modification time, so this GC has no grace period. The
lease guard alone is not enough if an active append can upload between the scan
and sweep. The caller must serialize GC with every journal append, normally by
using the runtime's offload-GC admission wrapper while the session is idle or
owned by the same writer.

The session runtime stops and joins its offload-GC runner before appending
`SessionStopped` and releasing the session lease. Do not run a standalone GC
against a live session while the runtime can still offload frames.

## Workspace reference scan

Sessionstore also exposes operator-facing workspace discovery:

```go
func (s *Store) WorkspaceLiveRefs(
	context.Context, []uuid.UUID,
) (map[workspacestore.Ref]struct{}, error)
func (s *Store) WorkspaceCheckpointBySeq(
	context.Context, uuid.UUID, uint64,
) (CheckpointSummary, bool, error)
func (s *Store) WorkspaceCheckpointByTurn(
	context.Context, uuid.UUID, uuid.UUID,
) (CheckpointSummary, bool, error)
```

`WorkspaceLiveRefs` scans every retained session's public event history and
keeps refs from both `WorkspaceCheckpointed` and `WorkspaceRestored`. It only
discovers the live set; actual workspace collection remains an explicit
operator action serialized against snapshot writers. Incomplete scans return
`*WorkspaceJournalScanError` and no set is returned.

## GC example

```go
lease, err := store.AcquireLease(ctx, id)
if err != nil {
	return err
}
defer lease.Release(context.Background())

gc, err := store.OpenObjectGC(id, lease)
if err != nil {
	return err
}
result, err := gc.GC(ctx)
if err != nil {
	var notHeld *sessionstore.GCLeaseNotHeldError
	if errors.As(err, &notHeld) {
		return fmt.Errorf("ownership changed; retry after reopening: %w", err)
	}
	return err
}
log.Printf("scanned=%d kept=%d deleted=%d unreclaimable=%d",
	result.Scanned, result.Referenced, result.Deleted, result.Unreclaimable)
```

The runtime normally owns the lease release, so a caller using
`Rig.NewSession` or `RestoreSession` should not acquire a second lease just to
run the configured GC runner.

## Source and proof

- [`ObjectGC`, `GCResult`, and workspace scans](https://github.com/looprig/harness/blob/main/pkg/sessionstore/gc.go)
- [`session journal offload order`](https://github.com/looprig/harness/blob/main/pkg/sessionstore/journal.go)
- [`offload GC tests`](https://github.com/looprig/harness/blob/main/pkg/sessionstore/gc_test.go)
- [`lifecycle GC wiring`](https://github.com/looprig/harness/blob/main/internal/sessionruntime/lifecycle.go)
