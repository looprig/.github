---
id: guides/harness/session-persistence/session-store/catalog
title: Session catalog
description: List and inspect stored Session identities and metadata.
audience: developer
section: guides
order: 17
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  catalog-contract: [release-github-com-looprig-harness]
  session-meta-fields: [release-github-com-looprig-harness]
  projection-and-cas: [release-github-com-looprig-harness]
  read-and-repair: [release-github-com-looprig-harness]
  catalog-example: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Session catalog

The catalog is a replay-free KV projection for session pickers and status
readers. It is derived from the event ledger and can be rebuilt at any time.
The appender updates it after a successful durable event append; readers never
need to open a ledger cursor for the common list or one-session lookup.

## Catalog contract

The exact public types and methods are:

```go
type CatalogOption func(*catalogOptions)

func WithCatalogClock(CatalogClock) CatalogOption
func WithCatalogLogger(CatalogLogger) CatalogOption
func WithCatalogReplayer(EventReplayerOpener) CatalogOption

type CatalogClock func() time.Time

type CatalogLogger interface {
	CatalogUpdateFailed(error)
}

type EventReplayerOpener interface {
	OpenInternalEventReplayer(uuid.UUID, ReplayRequest) (journal.EventReplayer, error)
}

func (s *Store) OpenCatalog(...CatalogOption) *Catalog
func (c *Catalog) UpdateOnEvent(context.Context, event.Event, uint64) error
func (c *Catalog) ListSessions(context.Context) ([]SessionMeta, error)
func (c *Catalog) ReadMeta(context.Context, uuid.UUID) (SessionMeta, bool, error)
func (c *Catalog) RepairCatalog(context.Context, uuid.UUID) (SessionMeta, error)
```

`UpdateOnEvent` always returns nil by contract. A KV failure is sent to the
optional logger and repaired later. `ListSessions` and `ReadMeta` surface typed
read/decode errors. `RepairCatalog` surfaces failures because repair was an
explicit request.

## Session meta fields

The exact JSON-backed projection is:

```go
type SessionMeta struct {
	SessionID         uuid.UUID
	Title             string
	CreatedAt         time.Time
	LastActiveAt      time.Time
	Status            SessionStatus
	AgentKind         string
	LoopCount         int
	ConfigFingerprint event.ConfigFingerprint
	Residency         SessionResidency
	State             SessionState
	LastJournalSeq    uint64
	ActiveTurnID      uuid.UUID
	WaitingGateID     uuid.UUID
	LastCheckpoint    CheckpointSummary
	CurrentWorkspace  WorkspacePointer
	Loops             []LoopUsageMeta
	Hustles           []HustleUsageAggregate
	// LastTurn and LastStep are codec-safe private eventSummary pointers.
}
```

The source adds JSON tags and private `LastTurn`/`LastStep` summaries. Their
wire form stores the journal sequence plus marshaled event bytes, not a bare
interface value.

`SessionStatus` has `StatusActive` and `StatusStopped`. `SessionState` has
`StateRunning`, `StateWaitingOnGate`, `StateIdle`, `StateFailed`,
`StateInterrupted`, and `StateStopped`. `StateStopped` wins over every later
projection and survives on disk.

`SessionResidency` records whether some process currently holds the session's
runtime, independently of its state. `ResidencyResident` is set by
`SessionStarted` and `RestoreDone`; `ResidencyCold` is set by both
`SessionResidencyReleased` and `SessionStopped`. Residency alone therefore
never tells a released session from a stopped one; read `Status` or `State`
for that. An entry written before the field existed has an empty residency.

The bounded loop projection is:

```go
type LoopUsageMeta struct {
	LoopID          uuid.UUID
	Runtime         event.ModelRuntime
	RuntimeSeq      uint64
	RuntimeValueSeq uint64
	CumulativeUsage content.Usage
	ContextSeq      uint64
	ContextValueSeq uint64
	CurrentContext  event.ContextMeasurement
}

type WorkspacePointer struct {
	Ref     workspacestore.Ref
	EventID uuid.UUID
	Seq     uint64
	Source  WorkspacePointerSource
}

type CheckpointSummary struct {
	Ref         workspacestore.Ref
	EventID     uuid.UUID
	Seq         uint64
	Consistency event.SnapshotConsistency
}
```

`Loops` is sorted by loop ID and folds authoritative StepDone usage exactly
once. Context and runtime watermarks prevent delayed lifecycle events from
regressing the projection.

## Projection and CAS

`applyEvent` maps only catalog-relevant events. `SessionStarted` seeds identity
and the primary loop. Turn start, fold, and terminal events, gate open and
resolve, `StepDone`, `RestoreDone`, loop lifecycle and runtime changes, context
measurement, compaction commits, workspace checkpoints and restores, Hustle
lifecycle, `SessionResidencyReleased`, and `SessionStopped` update bounded
fields. Every changed event advances `LastJournalSeq` by max,
never by blind assignment.

The online path is a read-modify-write under storage KV revision CAS. It retries
conflicts up to eight times; exhaustion returns `*CatalogConflictError` to
repair logic, while the best-effort appender path logs and swallows it.

```mermaid
%%{init: {"theme":"dark"}}%%
sequenceDiagram
    participant A as Event appender
    participant C as Catalog
    participant K as KV
    participant L as Ledger

    A->>L: durable append event
    A->>C: UpdateOnEvent(event, seq)
    C->>K: Get sessions/UUID, revision
    C->>C: applyEvent(meta, event, seq)
    C->>K: Put(expected revision)
    alt CAS conflict
        C->>K: re-read and retry, up to 8
    end
    Note over L,K: KV is a cache; RepairCatalog folds L when needed
```

## Read and repair

`ListSessions` reads keys under `sessions/` and then their values, in the order
the KV provider returns keys; sort the result yourself if a picker needs a
stable order. Only exact-depth catalog keys (`sessions/<uuid>`) are read. Keys
nested beneath a catalog entry, such as the object metadata written for
offloaded journal bodies and captured tool results, are skipped rather than
reported as corrupt entries. A key deleted between the key listing and its
read is skipped. `ReadMeta` makes
one KV load and returns `(zero, false, nil)` for absence.

`RepairCatalog` opens privileged event replay, requires a `SessionStarted`,
folds from the beginning, and writes under CAS. If a newer cached
`LastJournalSeq` appears while scanning, it rescans rather than overwriting a
newer projection. Missing starts return `*EmptySessionError`; corrupt cache
data is replaceable by repair.

## Catalog example

```go
catalog := store.OpenCatalog()
meta, found, err := catalog.ReadMeta(ctx, id)
if err != nil {
	var read *sessionstore.CatalogReadError
	if errors.As(err, &read) {
		meta, err = catalog.RepairCatalog(ctx, id)
		found = err == nil
	}
}
if err != nil {
	return err
}
if found {
	fmt.Printf("%s %s %s\n", meta.SessionID, meta.State, meta.Title)
}
```

Do not use `SessionMeta` as authorization or restore truth. It contains bounded
derived summaries; the journal contains the authoritative event and command
history.

## Source and proof

- [`SessionMeta` and catalog types](https://github.com/looprig/harness/blob/main/pkg/sessionstore/catalog.go)
- [`catalog options and methods`](https://github.com/looprig/harness/blob/main/pkg/sessionstore/catalog.go)
- [`catalog fold and CAS tests`](https://github.com/looprig/harness/blob/main/pkg/sessionstore/catalog_test.go)
- [`projection validation tests`](https://github.com/looprig/harness/blob/main/pkg/sessionstore/catalog_validation_test.go)
- [`usage and context projection tests`](https://github.com/looprig/harness/blob/main/pkg/sessionstore/catalog_usage_test.go)
