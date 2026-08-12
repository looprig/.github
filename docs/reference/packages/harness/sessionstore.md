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

Import path: `github.com/looprig/harness/pkg/sessionstore`. The source is pinned to github.com/looprig/harness@v0.25.0.

## Package role {#package-role}

Package sessionstore frames a session's ledger records for durable storage.

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
- `func (s *Store) OpenJournalWithOpeningAppend(ctx context.Context, id uuid.UUID, lease journal.Lease, middleware journal.AppendMiddleware) (journal.SessionJournal, error)`
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
- `func (e *InvalidBackendError) Error() string`
- `func (s *Store) PersistencePaths() ([]string, error)`
- `func (e *PersistencePathError) Error() string`
- `func (e *PersistencePathError) Unwrap() error`

### Types {#types}

```go
type SessionStatus string
```

```go
type SessionState string
```

```go
type SessionMeta struct {
	SessionID uuid.UUID `json:"session_id"`

	Title string `json:"title,omitempty"`

	CreatedAt time.Time `json:"created_at,omitzero"`

	LastActiveAt time.Time `json:"last_active_at,omitzero"`

	Status SessionStatus `json:"status,omitempty"`

	AgentKind string `json:"agent_kind,omitempty"`

	LoopCount int `json:"loop_count,omitempty"`

	ConfigFingerprint event.ConfigFingerprint `json:"config_fingerprint,omitzero"`

	State SessionState `json:"state,omitempty"`

	LastJournalSeq uint64 `json:"last_journal_seq,omitempty"`

	ActiveTurnID uuid.UUID `json:"active_turn_id,omitzero"`

	WaitingGateID uuid.UUID `json:"waiting_gate_id,omitzero"`

	LastTurn *eventSummary `json:"last_turn,omitempty"`

	LastStep         *eventSummary     `json:"last_step,omitempty"`
	LastCheckpoint   CheckpointSummary `json:"last_checkpoint,omitzero"`
	CurrentWorkspace WorkspacePointer  `json:"current_workspace,omitzero"`

	Loops []LoopUsageMeta `json:"loops,omitempty"`

	Hustles []HustleUsageAggregate `json:"hustles,omitempty"`
}
```

```go
type HustleUsageAggregate struct {
	Name            hustle.Name           `json:"name"`
	ModelSource     hustle.ModelSource    `json:"model_source"`
	NamedModelKey   model.ModelKey        `json:"named_model_key,omitzero"`
	Runtime         event.ModelRuntime    `json:"runtime,omitzero"`
	Status          hustle.TerminalStatus `json:"status"`
	Runs            uint64                `json:"runs"`
	CumulativeUsage content.Usage         `json:"cumulative_usage,omitzero"`
}
```

```go
type LoopUsageMeta struct {
	LoopID  uuid.UUID          `json:"loop_id"`
	Runtime event.ModelRuntime `json:"runtime,omitzero"`

	RuntimeSeq uint64 `json:"runtime_seq,omitempty"`

	RuntimeValueSeq uint64        `json:"runtime_value_seq,omitempty"`
	CumulativeUsage content.Usage `json:"cumulative_usage,omitzero"`

	ContextSeq      uint64                   `json:"context_seq,omitempty"`
	ContextValueSeq uint64                   `json:"context_value_seq,omitempty"`
	CurrentContext  event.ContextMeasurement `json:"current_context,omitzero"`
}
```

```go
type WorkspacePointerSource string
```

```go
type WorkspacePointer struct {
	Ref     workspacestore.Ref     `json:"ref"`
	EventID uuid.UUID              `json:"event_id"`
	Seq     uint64                 `json:"seq"`
	Source  WorkspacePointerSource `json:"source,omitempty"`
}
```

```go
type CheckpointSummary struct {
	Ref         workspacestore.Ref        `json:"ref"`
	EventID     uuid.UUID                 `json:"event_id"`
	Seq         uint64                    `json:"seq"`
	Consistency event.SnapshotConsistency `json:"consistency,omitempty"`
}
```

```go
type CatalogReadError struct {
	SessionID uuid.UUID
	Cause     error
}
```

```go
type CatalogWriteError struct {
	SessionID uuid.UUID
	Cause     error
}
```

```go
type CatalogEncodeError struct{ Cause error }
```

```go
type CatalogDecodeError struct{ Cause error }
```

```go
type CatalogDuplicateFieldError struct {
	Path  string
	Field string
}
```

```go
type CatalogMetaField string
```

```go
type CatalogMetaRule string
```

```go
type CatalogMetaValidationError struct {
	LoopIndex int
	Field     CatalogMetaField
	Rule      CatalogMetaRule
	Cause     error
}
```

```go
type CatalogConflictError struct {
	SessionID uuid.UUID
	Attempts  int
}
```

```go
type CatalogUsageError struct {
	LoopID uuid.UUID
	Cause  error
}
```

```go
type CatalogHustleErrorKind string
```

```go
type CatalogHustleError struct {
	Kind  CatalogHustleErrorKind
	RunID hustle.RunID
	Cause error
}
```

```go
type CatalogHustleMetaValidationError struct {
	Index int
	Rule  CatalogMetaRule
	Cause error
}
```

```go
type CatalogCompactionErrorKind string
```

```go
type CatalogCompactionError struct {
	Kind      CatalogCompactionErrorKind
	AttemptID event.CompactAttemptID
}
```

```go
type CatalogOrderingError struct {
	EventType string
	Sequence  uint64
	Last      uint64
}
```

```go
type EmptySessionError struct{ SessionID uuid.UUID }
```

```go
type CatalogClock func() time.Time
```

```go
type CatalogLogger interface {
	// CatalogUpdateFailed is called with the typed error when a best-effort catalog update
	// could not read or write its KV entry. The implementation must not panic and must not
	// re-raise, it is the end of the error's life.
	CatalogUpdateFailed(err error)
}
```

```go
type EventReplayerOpener interface {
	OpenInternalEventReplayer(id uuid.UUID, req ReplayRequest) (journal.EventReplayer, error)
}
```

```go
type CatalogOption func(*catalogOptions)
```

```go
type Catalog struct {
	// contains filtered or unexported fields
}
```

```go
type EnvelopeError struct {
	Reason string
	Cause  error
}
```

```go
type GCLeaseNotHeldError struct {
	SessionID uuid.UUID
	Epoch     uint64
}
```

```go
type GCScanError struct {
	Name  string
	Cause error
}
```

```go
type GCListError struct {
	Prefix string
	Cause  error
}
```

```go
type GCDeleteError struct {
	Key   string
	Cause error
}
```

```go
type GCResult struct {
	Scanned int

	Referenced int

	Deleted int

	DeletedKeys []string
}
```

```go
type WorkspaceJournalScanError struct {
	SessionID uuid.UUID
	Cause     error
}
```

```go
type ObjectGC struct {
	// contains filtered or unexported fields
}
```

```go
type NilLeaseError struct {
	SessionID uuid.UUID
}
```

```go
type ReplayRequest struct {
	FromSeq uint64
}
```

```go
type BlobIntegrityError struct {
	Seq  uint64
	Key  string
	Want string
	Got  string
}
```

```go
type BlobPointerIDMismatchError struct {
	Seq     uint64
	Key     string
	OuterID string
	InnerID string
}
```

```go
type BlobUnavailableError struct {
	Seq   uint64
	Key   string
	Cause error
}
```

```go
type ReplayDecodeError struct {
	Seq   uint64
	Cause error
}
```

```go
type ReplayReadError struct {
	Name  string
	Cause error
}
```

```go
type Options struct {
	OffloadThreshold int
}
```

```go
type Option func(*Options)
```

```go
type InvalidBackendError struct {
	Missing string
}
```

```go
type Store struct {
	// contains filtered or unexported fields
}
```

```go
type PersistencePathError struct {
	Path  string
	Cause error
}
```

### Constants {#constants}

`StatusActive`, `StatusStopped`, `StateRunning`, `StateWaitingOnGate`, `StateIdle`, `StateFailed`, `StateInterrupted`, `StateStopped`, `WorkspacePointerSourceUnknown`, `WorkspacePointerSourceCheckpoint`, `WorkspacePointerSourceRestore`, `CatalogMetaFieldLoopID`, `CatalogMetaFieldLoopOrder`, `CatalogMetaFieldRuntime`, `CatalogMetaFieldRuntimeSeq`, `CatalogMetaFieldCumulativeUsage`, `CatalogMetaFieldCurrentContext`, `CatalogMetaFieldContextSeq`, `CatalogMetaFieldContextValueSeq`, `CatalogMetaRuleRequired`, `CatalogMetaRuleSortedUnique`, `CatalogMetaRuleInvalid`, `CatalogMetaRuleExceedsRuntime`, `CatalogMetaRuleLegacyValue`, `CatalogMetaRuleExceedsContext`, `CatalogMetaRuleNotAfterRuntime`, `CatalogMetaRuleContextAbsent`, `CatalogMetaRuleContextCurrent`, `CatalogHustleDuplicateStart`, `CatalogHustleTerminalWithoutStart`, `CatalogHustleAttributionMismatch`, `CatalogHustleInvalidLifecycle`, `CatalogHustleRuntimeMismatch`, `CatalogHustleUsageOverflow`, `CatalogHustleRunCountOverflow`, `CatalogCompactionDuplicateTerminal`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `BlobIntegrityError`, `BlobPointerIDMismatchError`, `BlobUnavailableError`, `CatalogCompactionError`, `CatalogConflictError`, `CatalogDecodeError`, `CatalogDuplicateFieldError`, `CatalogEncodeError`, `CatalogHustleError`, `CatalogHustleMetaValidationError`, `CatalogMetaValidationError`, `CatalogOrderingError`, `CatalogReadError`, `CatalogUsageError`, `CatalogWriteError`, `EmptySessionError`, `EnvelopeError`, `GCDeleteError`, `GCLeaseNotHeldError`, `GCListError`, `GCScanError`, `InvalidBackendError`, `NilLeaseError`, `PersistencePathError`, `ReplayDecodeError`, `ReplayReadError`, `WorkspaceJournalScanError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/sessionstore/catalog.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/catalog.go)
- [pkg/sessionstore/envelope.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/envelope.go)
- [pkg/sessionstore/gc.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/gc.go)
- [pkg/sessionstore/journal.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/journal.go)
- [pkg/sessionstore/lease.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/lease.go)
- [pkg/sessionstore/replay.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/replay.go)
- [pkg/sessionstore/sessionstore.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/sessionstore.go)

Adjacent tests at the same commit:

- [pkg/sessionstore/catalog_context_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/catalog_context_test.go)
- [pkg/sessionstore/catalog_hustle_usage_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/catalog_hustle_usage_test.go)
- [pkg/sessionstore/catalog_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/catalog_test.go)
- [pkg/sessionstore/catalog_usage_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/catalog_usage_test.go)
- [pkg/sessionstore/catalog_validation_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/catalog_validation_test.go)
- [pkg/sessionstore/delivery_transition_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/delivery_transition_test.go)
- [pkg/sessionstore/envelope_fuzz_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/envelope_fuzz_test.go)
- [pkg/sessionstore/envelope_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/envelope_test.go)
- [pkg/sessionstore/gc_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/gc_test.go)
- [pkg/sessionstore/hustle_visibility_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/hustle_visibility_test.go)
- [pkg/sessionstore/journal_hook_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/journal_hook_test.go)
- [pkg/sessionstore/journal_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/journal_test.go)
- [pkg/sessionstore/lease_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/lease_test.go)
- [pkg/sessionstore/replay_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/replay_test.go)
- [pkg/sessionstore/sessionstore_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/sessionstore/sessionstore_test.go)

Run `go test ./...` from a checkout of the `harness` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
