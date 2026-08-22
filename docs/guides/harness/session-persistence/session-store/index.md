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
  source-and-proof: [release-github-com-looprig-harness]
---

# Session store overview

`sessionstore.Store` is the storage-backed facade for one session's ledger,
lease backend, catalog KV, and offload blob store. It is constructed once from a
validated `storage.Composite`; per-session lease and journal objects are opened
from it.

## Backend contract

The store requires all four composite primitives. A nil composite or nil
`Ledger`, `Leaser`, `KV`, or `Blobs` returns `*sessionstore.InvalidBackendError`
with the missing field instead of deferring a panic.

```go
type Store struct { /* backend and options are package-private */ }

func Open(*storage.Composite, ...Option) (*Store, error)
```

The store does not own a session lease merely because it exists. A caller must
call `AcquireLease` for a session before opening a writer journal or object GC.

## Open and options

The exact configuration surface is:

```go
type Options struct {
	OffloadThreshold int
}

type Option func(*Options)

func WithOffloadThreshold(n int) Option
```

The default threshold is 512 KiB. A non-positive override is ignored. Frames
above the threshold are uploaded to the session blob prefix before their
ledger pointer is appended.

```go
store, err := sessionstore.Open(memstore.New(),
	sessionstore.WithOffloadThreshold(256*1024),
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
`storage.PathReporter`. Providers without that optional capability contribute
no path. Ambiguous or unresolvable reports return a typed
`*sessionstore.PersistencePathError`; remote providers can legitimately return
an empty list.

The canonical logical names are:

| Resource | Name |
| --- | --- |
| session ledger | `sessions/<uuid>` |
| offload blobs | `sessions/<uuid>/blobs/<sha256>` |
| catalog entry | KV key `sessions/<uuid>` |

## Journal entry points

The store's per-session methods are:

```go
func (s *Store) AcquireLease(context.Context, uuid.UUID) (journal.Lease, error)
func (s *Store) OpenJournal(context.Context, uuid.UUID, journal.Lease) (journal.SessionJournal, error)
func (s *Store) OpenEventReplayer(uuid.UUID, ReplayRequest) (journal.EventReplayer, error)
func (s *Store) OpenInternalEventReplayer(uuid.UUID, ReplayRequest) (journal.EventReplayer, error)
func (s *Store) OpenInternalRecordReplayer(uuid.UUID, ReplayRequest) (journal.RecordReplayer, error)
func (s *Store) OpenCatalog(...CatalogOption) *Catalog
func (s *Store) OpenObjectGC(uuid.UUID, journal.Lease) (*ObjectGC, error)
```

Construction of a replayer is cheap and performs no read. The context is used
when its `Open` method binds a ledger cursor. The internal methods are for
restore and maintenance; product readers should use the public event replayer.

## Source and proof

- [`Store.Open`, options, and paths](https://github.com/looprig/harness/blob/main/pkg/sessionstore/sessionstore.go)
- [`storage.Composite`](https://github.com/looprig/storage/blob/main/storage.go)
- [`sessionstore construction tests`](https://github.com/looprig/harness/blob/main/pkg/sessionstore/sessionstore_test.go)
