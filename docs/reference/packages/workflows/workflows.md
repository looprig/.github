---
id: reference/packages/workflows/workflows
title: Workflows root package
description: Exported definitions, registries, input references, and session-owned supervision in the source-workspace workflows package.
audience: developer
section: reference
order: 210
publication: source-workspace
examples:
  - stage-18-workflows
proofs:
  package-role: module-workflows
  exported-surface: [central-workflows-catalog-source, central-workflows-typed-definition-source]
  lifecycle-and-errors: [central-workflows-recovery-test, central-workflows-artifacts-contract-test]
  source-proof: central-workflows-stage18-output-test
---

# `github.com/looprig/workflows`

This package is the typed orchestration layer above Flow. It is source-workspace at the reviewed [commit](https://github.com/looprig/workflows/tree/f241ecbd6299a00d52fc6755b5be946a41b3a73f), not a released import.

## Package role {#package-role}

The package owns workflow identity, typed validation, session-scoped run projections, immutable input references, and a supervisor lifecycle. A workflow run record is a bounded projection; Flow checkpoint history and Harness event history remain separate sources of truth.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewCatalog() *Catalog`
- `func NewVertexMetadata(label string) VertexMetadata`
- `func NewVertexMetadataForID(id flow.VertexID, label string) VertexMetadata`
- `func NewMetadata(name, version, description string, inputSchema, resumeSchema json.RawMessage, vertices []VertexMetadata) (Metadata, error)`
- `func NewHarnessCancellationConflictDefinition() (*HarnessCancellationConflictDefinition, error)`
- `func NewInputStore(blobs storage.Blobs) (*InputStore, error)`
- `func NewRunRegistry(kv storage.KV) (*RunRegistry, error)`
- `func NewSupervisor(config SupervisorConfig) (*Supervisor, error)`
- `func StrictJSONDecoder[S any](raw json.RawMessage) (S, error)`
- `func TypedResumeDecoder[R any](decoder StateDecoder[R]) ResumeDecoder`
- `func NewTypedDefinition[S any](metadata Metadata, runner *flow.Runner[S], store flow.CheckpointStore, stateDecoder StateDecoder[S], resumeDecoder ResumeDecoder, summarizer StatusSummarizer[S]) (*TypedDefinition[S], error)`

### Methods {#methods}

- `func (e *ActivityValidationError) Error() string`
- `func (e *ActivityValidationError) Unwrap() error`
- `func (e *ReconciliationError) Error() string`
- `func (e *ReconciliationError) Unwrap() error`
- `func (c *Catalog) Register(definition Definition) error`
- `func (c *Catalog) Resolve(name, version string) (Definition, error)`
- `func (c *Catalog) List() []Metadata`
- `func (m VertexMetadata) ID() flow.VertexID`
- `func (m VertexMetadata) Label() string`
- `func (m VertexMetadata) MarshalJSON() ([]byte, error)`
- `func (m Metadata) Name() string`
- `func (m Metadata) Version() string`
- `func (m Metadata) Description() string`
- `func (m Metadata) InputSchema() json.RawMessage`
- `func (m Metadata) ResumeSchema() json.RawMessage`
- `func (m Metadata) Vertices() []VertexMetadata`
- `func (m Metadata) MarshalJSON() ([]byte, error)`
- `func (e *UnknownDefinitionError) Error() string`
- `func (e *UnknownDefinitionError) Unwrap() error`
- `func (e *DuplicateDefinitionError) Error() string`
- `func (e *DuplicateDefinitionError) Unwrap() error`
- `func (e *InvalidSchemaError) Error() string`
- `func (e *InvalidSchemaError) Unwrap() error`
- `func (e *InvalidInputError) Error() string`
- `func (e *InvalidInputError) Unwrap() error`
- `func (d *HarnessCancellationConflictDefinition) Metadata() Metadata`
- `func (d *HarnessCancellationConflictDefinition) ValidateInput(json.RawMessage) (ValidatedInput, error)`
- `func (d *HarnessCancellationConflictDefinition) ValidateResume(json.RawMessage) (ValidatedResume, error)`
- `func (d *HarnessCancellationConflictDefinition) Start(ctx context.Context, input ValidatedInput, _ ...flow.RunOption) (*Result, error)`
- `func (d *HarnessCancellationConflictDefinition) Resume(context.Context, flow.GraphRunID, ValidatedResume, ...flow.RunOption) (*Result, error)`
- `func (d *HarnessCancellationConflictDefinition) Get(ctx context.Context, id flow.GraphRunID) (*Result, error)`
- `func (d *HarnessCancellationConflictDefinition) History(ctx context.Context, id flow.GraphRunID) ([]flow.GraphRunState, error)`
- `func (d *HarnessCancellationConflictDefinition) Cancel(ctx context.Context, id flow.GraphRunID, _ string, _ ...flow.RunOption) error`
- `func (d *HarnessCancellationConflictDefinition) CancelAttempts() int`
- `func (s *Supervisor) History(ctx context.Context, runID uuid.UUID, afterRevision uint64, afterEventID uuid.UUID, limit int) (ActivityHistoryPage, error)`
- `func (s *InputStore) Put(ctx context.Context, sessionID uuid.UUID, canonicalJSON []byte) (InputReference, error)`
- `func (s *InputStore) Get(ctx context.Context, sessionID uuid.UUID, ref InputReference) ([]byte, error)`
- `func (r *RunRegistry) Create(ctx context.Context, run Run) (*Run, error)`
- `func (r *RunRegistry) Get(ctx context.Context, sessionID, runID uuid.UUID) (*Run, error)`
- `func (r *RunRegistry) CompareAndSwap(ctx context.Context, expectedRevision uint64, next Run) (*Run, error)`
- `func (r *RunRegistry) List(ctx context.Context, sessionID uuid.UUID, request ListRunsRequest) (RunPage, error)`
- `func (e *NotFoundError) Error() string`
- `func (e *NotFoundError) Unwrap() error`
- `func (e *ConflictError) Error() string`
- `func (e *ConflictError) Unwrap() error`
- `func (e *CorruptRecordError) Error() string`
- `func (e *CorruptRecordError) Unwrap() error`
- `func (e *SessionOwnedError) Error() string`
- `func (e *SessionOwnedError) Unwrap() error`
- `func (e *AdoptionError) Error() string`
- `func (e *AdoptionError) Unwrap() error`
- `func (s *Supervisor) SessionID() uuid.UUID`
- `func (s *Supervisor) Activate(ctx context.Context, services tool.SessionResourceServices) error`
- `func (s *Supervisor) Start(ctx context.Context, runID uuid.UUID) (<-chan struct{}, <-chan error, error)`
- `func (s *Supervisor) Shutdown(ctx context.Context) error`
- `func (s *Supervisor) Resume(ctx context.Context, runID uuid.UUID, payload json.RawMessage) error`
- `func (s *Supervisor) Cancel(ctx context.Context, runID uuid.UUID, reason string) error`
- `func (s *Supervisor) WaitIdle(ctx context.Context) error`
- `func (s *Supervisor) LastError() error`
- `func (d *TypedDefinition[S]) Metadata() Metadata`
- `func (d *TypedDefinition[S]) ValidateInput(raw json.RawMessage) (ValidatedInput, error)`
- `func (d *TypedDefinition[S]) ValidateResume(raw json.RawMessage) (ValidatedResume, error)`
- `func (d *TypedDefinition[S]) Start(ctx context.Context, input ValidatedInput, opts ...flow.RunOption) (*Result, error)`
- `func (d *TypedDefinition[S]) Resume(ctx context.Context, id flow.GraphRunID, resume ValidatedResume, opts ...flow.RunOption) (*Result, error)`
- `func (d *TypedDefinition[S]) Adopt(ctx context.Context, id flow.GraphRunID, opts ...flow.RunOption) (*Result, error)`
- `func (d *TypedDefinition[S]) Get(ctx context.Context, id flow.GraphRunID) (*Result, error)`
- `func (d *TypedDefinition[S]) History(ctx context.Context, id flow.GraphRunID) ([]flow.GraphRunState, error)`
- `func (d *TypedDefinition[S]) Cancel(ctx context.Context, id flow.GraphRunID, reason string, opts ...flow.RunOption) error`

### Types {#types}

`ActivityValidationError`, `ReconciliationError`, `Catalog`, `VertexMetadata`, `Metadata`, `ValidatedInput`, `ValidatedResume`, `Result`, `Definition`, `UnknownDefinitionError`, `DuplicateDefinitionError`, `InvalidSchemaError`, `InvalidInputError`, `HarnessCancellationConflictDefinition`, `ActivityHistoryRecord`, `ActivityHistoryPage`, `InputStore`, `RunRegistry`, `ListRunsRequest`, `RunPage`, `NotFoundError`, `ConflictError`, `CorruptRecordError`, `InputReference`, `ArtifactReference`, `Run`, `RunStatus`, `SessionOwnedError`, `AdoptionError`, `SupervisorConfig`, `Supervisor`, `StateDecoder`, `ResumeDecoder`, `StatusSummarizer`, `TypedDefinition`

### Constants {#constants}

`MaxStatusSummaryBytes`, `MaxRunRecordBytes`, `MaxArtifactReferences`, `MaxRunPageSize`, `DefaultRunPageSize`, `MaxInputBytes`, `ArtifactInputBootstrap`, `ArtifactInputParent`, `RunPending`, `RunRunning`, `RunInterrupted`, `RunCompleted`, `RunCancelled`, `RunFailed`, `MaxSchemaBytes`, `MaxSchemaDepth`, `MaxSchemaProperties`, `MaxDocumentBytes`, `MaxDocumentDepth`, `MaxDocumentProperties`, `SupervisorResourceName`

### Variables {#variables}

`ErrActivityValidation`, `ErrUnknownDefinition`, `ErrNotFound`, `ErrSupervisorActive`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ActivityValidationError`, `ReconciliationError`, `UnknownDefinitionError`, `DuplicateDefinitionError`, `InvalidSchemaError`, `InvalidInputError`, `NotFoundError`, `ConflictError`, `CorruptRecordError`, `SessionOwnedError`, `AdoptionError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [activity.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/activity.go)
- [activity_id.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/activity_id.go)
- [adopt.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/adopt.go)
- [catalog.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/catalog.go)
- [definition.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/definition.go)
- [doc.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/doc.go)
- [errors.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/errors.go)
- [harness_integration_support.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/harness_integration_support.go)
- [history.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/history.go)
- [hooks.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/hooks.go)
- [input_store.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/input_store.go)
- [lease.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/lease.go)
- [reconcile.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/reconcile.go)
- [registry.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/registry.go)
- [registry_codec.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/registry_codec.go)
- [registry_keys.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/registry_keys.go)
- [run.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/run.go)
- [run_status.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/run_status.go)
- [schema.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/schema.go)
- [session_resource.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/session_resource.go)
- [supervisor.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/supervisor.go)
- [supervisor_run.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/supervisor_run.go)
- [typed_definition.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/typed_definition.go)

Adjacent tests at the same commit:

- [activity_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/activity_test.go)
- [adopt_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/adopt_test.go)
- [catalog_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/catalog_test.go)
- [definition_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/definition_test.go)
- [docs_check_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/docs_check_test.go)
- [harness_restore_integration_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/harness_restore_integration_test.go)
- [history_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/history_test.go)
- [input_store_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/input_store_test.go)
- [integration_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/integration_test.go)
- [reconcile_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/reconcile_test.go)
- [recovery_integration_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/recovery_integration_test.go)
- [registry_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/registry_test.go)
- [schema_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/schema_test.go)
- [session_resource_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/session_resource_test.go)
- [supervisor_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/supervisor_test.go)

Run `GOWORK=off go test ./...` from the `workflows` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
