---
id: guides/harness/session-persistence/session-store/index
title: Overview
description: Open durable Session journals and discover stored Sessions.
audience: developer
section: guides
order: 16
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  backend-contract: [release-github-com-looprig-harness]
  open-and-options: [release-github-com-looprig-harness]
  persistence-roots: [release-github-com-looprig-harness]
  journal-entry-points: [release-github-com-looprig-harness]
  host-facing-seams: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Session store overview

`sessionstore.Store` is the storage-backed facade for one tenant's session
ledgers, leases, catalog KV, and object bodies. It is constructed once from a
validated `storage.Composite`; per-session lease and journal objects are opened
from it. Underneath, it opens a [SessionStore](/docs/modules/sessionstore)
store in its legacy single-tenant layout, so every journal frame uses
SessionStore's envelope and every offloaded body is a SessionStore object. A
counterparty such as a Host can read the same backend by opening SessionStore
the same way, without importing Harness.

## Backend contract

```go
type Store struct { /* backend and options are package-private */ }

func Open(*storage.Composite, ...Option) (*Store, error)
```

`Open` checks the backend before any provider I/O:

| Missing or unsupported | Error |
| --- | --- |
| nil composite, `Ledger`, `Leaser`, `KV`, or `Blobs` | `*sessionstore.InvalidBackendError` with `Missing` naming the field |
| nil `OrderedIndex` | SessionStore's `*InvalidBackendError` with `Component: "OrderedIndex"` |
| Blobs without `storage.BlobReaderLifecycle` | SessionStore's `*InvalidBackendError` with `Component: "BlobReaderLifecycle"` |

The bounded reader lifecycle lets the store cancel a blocked blob read. The
[filesystem store](/docs/modules/fsstore) deliberately does not implement it,
so an fsstore Blobs provider is refused at `Open`. The storage module's
in-memory store implements all five primitives and the lifecycle, which is why
examples use it:

```go
store, err := sessionstore.Open(memstore.New())
if err != nil {
	return err
}
```

`storage.NewComposite` leaves `OrderedIndex` nil, so a composite assembled from
it must set that field before `Open`. `Open` also reads or creates the
SessionStore layout marker. Every KV call the store makes, including that one,
is bounded by a five-second timeout.

The store does not own a session lease merely because it exists. A caller must
call `AcquireLease` for a session before opening a writer journal or object GC.

## Open and options

The exact configuration surface is:

```go
type Options struct {
	OffloadThreshold int
	TenantID         coresessionwire.TenantID
}

type Option func(*Options)

func WithOffloadThreshold(n int) Option
func WithTenant(tenant coresessionwire.TenantID) Option
```

The default offload threshold is 512 KiB and a non-positive override is
ignored. SessionStore's inline body ceiling is also 512 KiB, so a larger
threshold still offloads any body above that ceiling. A body above the
threshold is written as a SessionStore object before the frame that references
it is appended. A runtime body larger than 16 MiB is refused at append with
`*journal.RecordTooLargeError`, because replay could never read it back.

`WithTenant` names the tenant every record is filed under; the default is
`"local"`. The tenant is stored in the backend's layout marker and compared at
every `Open`, so reopening a backend under a different tenant fails instead of
misreading data. An empty or malformed tenant fails `Open` with SessionStore's
`*InvalidOptionError`. One `Store` serves one tenant for its whole life; it does
not make Harness multi-tenant.

```go
store, err := sessionstore.Open(memstore.New(),
	sessionstore.WithOffloadThreshold(256*1024),
	sessionstore.WithTenant("acme"),
)
if err != nil {
	return err
}
```

## Persistence roots

```go
func (s *Store) PersistencePaths() ([]string, error)
```

This reports canonical local roots from primitives implementing
`storage.PathReporter`, including the ordered index. Providers without that
optional capability contribute no path. Ambiguous or unresolvable reports
return a typed `*sessionstore.PersistencePathError`; remote providers can
legitimately return an empty list.

The canonical logical names are:

| Resource | Name |
| --- | --- |
| session ledger and lease | `sessions/<uuid>` |
| catalog entry | KV key `sessions/<uuid>` |
| object metadata | KV keys under `sessions/<uuid>/object-metadata/` |
| object bodies | blobs under `sessions/<uuid>/blobs/v1/<kind>/` |
| legacy offload blobs | `sessions/<uuid>/blobs/<sha256>` (written by older releases, still readable) |

Object kinds Harness writes are `journal-public` and `journal-runtime` for
offloaded journal bodies and `tool-result` for
[captured tool results](/docs/guides/harness/loop/tool-result-capture). Because
object metadata keys extend the catalog key, every KV provider must keep a key
and its `/`-extended descendants distinct, as storage's conformance suite
requires.

## Journal entry points

The store's per-session methods are:

```go
func (s *Store) AcquireLease(context.Context, uuid.UUID) (journal.Lease, error)
func (s *Store) OpenJournal(context.Context, uuid.UUID, journal.Lease) (journal.SessionJournal, error)
func (s *Store) OpenJournalWithOpeningAppend(context.Context, uuid.UUID, journal.Lease, journal.AppendMiddleware) (journal.SessionJournal, error)
func (s *Store) OpenEventReplayer(uuid.UUID, ReplayRequest) (journal.EventReplayer, error)
func (s *Store) OpenInternalEventReplayer(uuid.UUID, ReplayRequest) (journal.EventReplayer, error)
func (s *Store) OpenInternalRecordReplayer(uuid.UUID, ReplayRequest) (journal.RecordReplayer, error)
func (s *Store) OpenCatalog(...CatalogOption) *Catalog
func (s *Store) OpenObjectGC(uuid.UUID, journal.Lease) (*ObjectGC, error)
```

Construction of a replayer is cheap and performs no read. The context is used
when its `Open` method binds a ledger cursor. The internal methods are for
restore and maintenance; product readers should use the public event replayer.

The journal returned by `OpenJournal` also satisfies `journal.IdempotentJournal`
and `journal.CommittedPublicJournal`. The second reports the exact canonical
public body stored for a public event, which a consumer joining durable
history to a live stream should use instead of projecting the event again.

## Host-facing seams

A Host that places a Harness runtime uses a few more methods. Application code
running a Rig directly does not need them.

| Method | Purpose |
| --- | --- |
| `OpenRuntimeCommandLog(id, journal)` | append and read the private application and disposition records for admitted runtime commands |
| `ReadCommandApplicationAt(ctx, id, seq)` | read one application record by sequence |
| `ScanCommandEffect(ctx, id, commandID, runtimeID)` | find whether a command's effect or disposition is durable |
| `ReadDispositionEvidence(ctx, req)` | answer SessionStore's disposition-evidence reader for a disposition-protocol binding in this tenant |
| `ToolResultObjects()` | the object store for `rig.WithToolResultObjects` |
| `LookupToolResultCapture(ctx, runtimeSession, ref)` | prove a tool-result object is referenced by a committed step |

`ReadDispositionEvidence` routes by the binding's `RuntimeSessionID`, not by
`StorageBindingID`, and refuses another tenant, a legacy-protocol binding, or a
non-UUID runtime session ID with `*DispositionBindingError`. A deployment with
several journal stores must select the right one itself.

## Source and proof

- [`Store.Open`, options, and paths](https://github.com/looprig/harness/blob/main/pkg/sessionstore/sessionstore.go)
- [`storage.Composite`](https://github.com/looprig/storage/blob/main/storage.go)
- [SessionStore `Open` backend checks](https://github.com/looprig/sessionstore/blob/main/store.go)
- [`sessionstore construction tests`](https://github.com/looprig/harness/blob/main/pkg/sessionstore/sessionstore_test.go)
