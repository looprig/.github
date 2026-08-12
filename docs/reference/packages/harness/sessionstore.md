---
id: reference/packages/harness/sessionstore
title: sessionstore package · sessionstore
description: Reference for durable session catalogs, journal projection, blob offload, replay, and garbage collection.
audience: developer
section: reference
order: 154
publication: released
examples:
  - stage-08-session-store
  - stage-09-restore
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions: release-github-com-looprig-harness
  methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants: release-github-com-looprig-harness
  variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# sessionstore package · sessionstore

Import path: `github.com/looprig/harness/pkg/sessionstore`. The source is pinned to github.com/looprig/harness@v0.24.2.

## Package role {#package-role}

`Store` opens over a `storage.Composite`, owns catalog and journal projections, and exposes session metadata, status, replay, checkpoint, usage, and object-GC operations. `Catalog` can be configured with a clock, logger, and replay opener. Offload thresholds separate journal envelopes from large blobs.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithCatalogClock(now CatalogClock) CatalogOption`
- `func WithCatalogLogger(log CatalogLogger) CatalogOption`
- `func WithCatalogReplayer(opener EventReplayerOpener) CatalogOption`
- `func WithOffloadThreshold(n int) Option`
- `func Open(b *storage.Composite, opts ...Option) (*Store, error)`

### Methods {#methods}

- `func (e *CatalogReadError) Error() string`
- `func (e *CatalogReadError) Unwrap() error`
- `func (e *CatalogWriteError) Error() string`
- `func (e *CatalogWriteError) Unwrap() error`
- `func (e *CatalogEncodeError) Error() string`
- `func (e *CatalogEncodeError) Unwrap() error`
- `func (e *CatalogDecodeError) Error() string`
- `func (e *CatalogDecodeError) Unwrap() error`
- `func (e *CatalogDuplicateFieldError) Error() string`
- `func (e *CatalogMetaValidationError) Error() string`
- `func (e *CatalogMetaValidationError) Unwrap() error`
- `func (e *CatalogUsageError) Error() string`
- `func (e *CatalogUsageError) Unwrap() error`
- `func (e *CatalogHustleError) Error() string`
- `func (e *CatalogHustleError) Unwrap() error`
- `func (e *CatalogHustleMetaValidationError) Error() string`
- `func (e *CatalogHustleMetaValidationError) Unwrap() error`
- `func (e *CatalogCompactionError) Error() string`
- `func (e *CatalogOrderingError) Error() string`
- `func (e *CatalogConflictError) Error() string`
- `func (e *EmptySessionError) Error() string`
- `func (e *EmptySessionError) Unwrap() error`
- `func (nopCatalogLogger) CatalogUpdateFailed(error)`
- `func (s *Store) OpenCatalog(opts ...CatalogOption) *Catalog`
- `func (c *Catalog) UpdateOnEvent(ctx context.Context, ev event.Event, seq uint64) error`
- `func (c *Catalog) ListSessions(ctx context.Context) ([]SessionMeta, error)`
- `func (c *Catalog) ReadMeta(ctx context.Context, id uuid.UUID) (SessionMeta, bool, error)`
- `func (c *Catalog) RepairCatalog(ctx context.Context, sessionID uuid.UUID) (SessionMeta, error)`
- `func (e *EnvelopeError) Error() string`
- `func (e *EnvelopeError) Unwrap() error`
- `func (e *GCLeaseNotHeldError) Error() string`
- `func (e *GCLeaseNotHeldError) Unwrap() error`
- `func (e *GCScanError) Error() string`
- `func (e *GCScanError) Unwrap() error`
- `func (e *GCListError) Error() string`
- `func (e *GCListError) Unwrap() error`
- `func (e *GCDeleteError) Error() string`
- `func (e *GCDeleteError) Unwrap() error`
- `func (e *WorkspaceJournalScanError) Error() string`
- `func (e *WorkspaceJournalScanError) Unwrap() error`
- `func (s *Store) WorkspaceLiveRefs(ctx context.Context, retainedSessionIDs []uuid.UUID) (map[workspacestore.Ref]struct{}, error)`
- `func (s *Store) WorkspaceCheckpointBySeq(ctx context.Context, id uuid.UUID, seq uint64) (CheckpointSummary, bool, error)`
- `func (s *Store) WorkspaceCheckpointByTurn(ctx context.Context, id, turnID uuid.UUID) (CheckpointSummary, bool, error)`
- `func (s *Store) OpenObjectGC(id uuid.UUID, lease journal.Lease) (*ObjectGC, error)`
- `func (g *ObjectGC) GC(ctx context.Context) (GCResult, error)`
- `func (e *NilLeaseError) Error() string`
- `func (s *Store) OpenJournal(ctx context.Context, id uuid.UUID, lease journal.Lease) (journal.SessionJournal, error)`
- `func (s *Store) OpenJournalWithOpeningAppend( ctx context.Context, id uuid.UUID, lease journal.Lease, middleware journal.AppendMiddleware,) (journal.SessionJournal, error)`
- `func (b *sessionJournal) Append(ctx context.Context, rec journal.JournalRecord) (uint64, error)`
- `func (b *sessionJournal) AppendIdempotent(ctx context.Context, rec journal.JournalRecord) (journal.AppendResult, error)`
- `func (l *sessionLease) Epoch() uint64`
- `func (l *sessionLease) Lost() <-chan struct{}`
- `func (l *sessionLease) SessionID() uuid.UUID`
- `func (l *sessionLease) Release(ctx context.Context) error`
- `func (l *sessionLease) Valid() bool`
- `func (s *Store) AcquireLease(ctx context.Context, id uuid.UUID) (journal.Lease, error)`
- `func (e *BlobIntegrityError) Error() string`
- `func (e *BlobPointerIDMismatchError) Error() string`
- `func (e *BlobUnavailableError) Error() string`
- `func (e *BlobUnavailableError) Unwrap() error`
- `func (e *ReplayDecodeError) Error() string`
- `func (e *ReplayDecodeError) Unwrap() error`
- `func (e *ReplayReadError) Error() string`
- `func (e *ReplayReadError) Unwrap() error`
- `func (s *Store) OpenEventReplayer(id uuid.UUID, req ReplayRequest) (journal.EventReplayer, error)`
- `func (s *Store) OpenInternalEventReplayer(id uuid.UUID, req ReplayRequest) (journal.EventReplayer, error)`
- `func (s *Store) OpenInternalRecordReplayer(id uuid.UUID, req ReplayRequest) (journal.RecordReplayer, error)`
- `func (r *eventReplayer) Open(ctx context.Context, req journal.ReplayRequest) (journal.EventCursor, error)`
- `func (r *recordReplayer) Open(ctx context.Context, req journal.ReplayRequest) (journal.RecordCursor, error)`
- `func (c *eventCursor) Next(ctx context.Context) (event.Event, uint64, error)`
- `func (c *eventCursor) Close() error`
- `func (c *recordCursor) Next(ctx context.Context) (journal.JournalRecord, uint64, error)`
- `func (c *recordCursor) Close() error`
- `func (e *InvalidBackendError) Error() string`
- `func (s *Store) PersistencePaths() ([]string, error)`
- `func (e *PersistencePathError) Error() string`
- `func (e *PersistencePathError) Unwrap() error`

### Types {#types}

`SessionStatus`, `SessionState`, `SessionMeta`, `HustleUsageAggregate`, `LoopUsageMeta`, `WorkspacePointerSource`, `WorkspacePointer`, `CheckpointSummary`, `CatalogReadError`, `CatalogWriteError`, `CatalogEncodeError`, `CatalogDecodeError`, `CatalogDuplicateFieldError`, `CatalogMetaField`, `CatalogMetaRule`, `CatalogMetaValidationError`, `CatalogConflictError`, `CatalogUsageError`, `CatalogHustleErrorKind`, `CatalogHustleError`, `CatalogHustleMetaValidationError`, `CatalogCompactionErrorKind`, `CatalogCompactionError`, `CatalogOrderingError`, `EmptySessionError`, `CatalogClock`, `CatalogLogger`, `EventReplayerOpener`, `CatalogOption`, `Catalog`, `EnvelopeError`, `GCLeaseNotHeldError`, `GCScanError`, `GCListError`, `GCDeleteError`, `GCResult`, `WorkspaceJournalScanError`, `ObjectGC`, `NilLeaseError`, `ReplayRequest`, `BlobIntegrityError`, `BlobPointerIDMismatchError`, `BlobUnavailableError`, `ReplayDecodeError`, `ReplayReadError`, `Options`, `Option`, `InvalidBackendError`, `Store`, `PersistencePathError`

### Constants {#constants}

`StatusActive`, `StatusStopped`, `StateRunning`, `StateWaitingOnGate`, `StateIdle`, `StateFailed`, `StateInterrupted`, `StateStopped`, `WorkspacePointerSourceUnknown`, `WorkspacePointerSourceCheckpoint`, `WorkspacePointerSourceRestore`, `CatalogMetaFieldLoopID`, `CatalogMetaFieldLoopOrder`, `CatalogMetaFieldRuntime`, `CatalogMetaFieldRuntimeSeq`, `CatalogMetaFieldCumulativeUsage`, `CatalogMetaFieldCurrentContext`, `CatalogMetaFieldContextSeq`, `CatalogMetaFieldContextValueSeq`, `CatalogMetaRuleRequired`, `CatalogMetaRuleSortedUnique`, `CatalogMetaRuleInvalid`, `CatalogMetaRuleExceedsRuntime`, `CatalogMetaRuleLegacyValue`, `CatalogMetaRuleExceedsContext`, `CatalogMetaRuleNotAfterRuntime`, `CatalogMetaRuleContextAbsent`, `CatalogMetaRuleContextCurrent`, `CatalogHustleDuplicateStart`, `CatalogHustleTerminalWithoutStart`, `CatalogHustleAttributionMismatch`, `CatalogHustleInvalidLifecycle`, `CatalogHustleRuntimeMismatch`, `CatalogHustleUsageOverflow`, `CatalogHustleRunCountOverflow`, `CatalogCompactionDuplicateTerminal`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `CatalogReadError`, `CatalogWriteError`, `CatalogEncodeError`, `CatalogDecodeError`, `CatalogDuplicateFieldError`, `CatalogMetaValidationError`, `CatalogUsageError`, `CatalogHustleError`, `CatalogHustleMetaValidationError`, `CatalogCompactionError`, `CatalogOrderingError`, `CatalogConflictError`, `EmptySessionError`, `EnvelopeError`, `GCLeaseNotHeldError`, `GCScanError`, `GCListError`, `GCDeleteError`, `WorkspaceJournalScanError`, `NilLeaseError`, `BlobIntegrityError`, `BlobPointerIDMismatchError`, `BlobUnavailableError`, `ReplayDecodeError`, `ReplayReadError`, `InvalidBackendError`, `PersistencePathError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/sessionstore/catalog.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/catalog.go)
- [pkg/sessionstore/envelope.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/envelope.go)
- [pkg/sessionstore/gc.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/gc.go)
- [pkg/sessionstore/journal.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/journal.go)
- [pkg/sessionstore/lease.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/lease.go)
- [pkg/sessionstore/replay.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/replay.go)
- [pkg/sessionstore/sessionstore.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/sessionstore.go)

Adjacent tests at the same commit:

- [pkg/sessionstore/catalog_context_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/catalog_context_test.go)
- [pkg/sessionstore/catalog_hustle_usage_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/catalog_hustle_usage_test.go)
- [pkg/sessionstore/catalog_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/catalog_test.go)
- [pkg/sessionstore/catalog_usage_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/catalog_usage_test.go)
- [pkg/sessionstore/catalog_validation_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/catalog_validation_test.go)
- [pkg/sessionstore/delivery_transition_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/delivery_transition_test.go)
- [pkg/sessionstore/envelope_fuzz_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/envelope_fuzz_test.go)
- [pkg/sessionstore/envelope_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/envelope_test.go)
- [pkg/sessionstore/gc_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/gc_test.go)
- [pkg/sessionstore/hustle_visibility_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/hustle_visibility_test.go)
- [pkg/sessionstore/journal_hook_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/journal_hook_test.go)
- [pkg/sessionstore/journal_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/journal_test.go)
- [pkg/sessionstore/lease_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/lease_test.go)
- [pkg/sessionstore/replay_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/replay_test.go)
- [pkg/sessionstore/sessionstore_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/sessionstore/sessionstore_test.go)

Run `GOWORK=off go test ./...` from the `harness` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
