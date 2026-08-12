---
id: reference/packages/flow/pkg/flow
title: flow package · pkg/flow
description: Reference for the flow package at github.com/looprig/flow/pkg/flow, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 51
publication: released
examples:
  - stage-17-flow
proofs:
  package-role: release-github-com-looprig-flow
  exported-surface: release-github-com-looprig-flow
  functions: release-github-com-looprig-flow
  methods: release-github-com-looprig-flow
  types: release-github-com-looprig-flow
  constants: release-github-com-looprig-flow
  variables: release-github-com-looprig-flow
  ownership-and-errors: release-github-com-looprig-flow
  source-and-runnable-proof: release-github-com-looprig-flow
---

# flow package · pkg/flow

Import path: `github.com/looprig/flow/pkg/flow`. The source is pinned to github.com/looprig/flow@v0.3.0.

## Package role {#package-role}

Package flow is the durable, pregel-style workflow engine.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithStore(s CheckpointStore) CompileOption`
- `func WithVersion(n uint64) GraphOption`
- `func NewGraph[S any](id GraphID, opts ...GraphOption) *Graph[S]`
- `func NewRunnerHandle[S any](r *Runner[S]) RunnerHandle`
- `func NewGraphRunID() (GraphRunID, error)`
- `func NewVertexRunID() (VertexRunID, error)`
- `func Interrupt(ctx context.Context, info any) error`
- `func StatefulInterrupt(ctx context.Context, info, continuation any) error`
- `func ResumePayload[T any](ctx context.Context) (T, bool)`
- `func InterruptState[T any](ctx context.Context) (T, bool)`
- `func Info(ctx context.Context) (RunInfo, bool)`
- `func Self(ctx context.Context) (VertexState, bool)`
- `func WithHooks(h Hooks) RunOption`
- `func WithConcurrency(n int) RunOption`
- `func WithMaxSteps(n int) RunOption`
- `func WithCheckpointEvery(g CheckpointGranularity) RunOption`
- `func WithGraphRunID(id GraphRunID) RunOption`
- `func Serve(ctx context.Context, reg Resolver, cp ControlPlane) error`
- `func NewMemStore() *MemStore`
- `func NewFuncTask[I, O any](fn TaskFunc[I, O]) *FuncTask[I, O]`
- `func WithRetry[S any](p RetryPolicy) VertexOption[S]`
- `func WithErrorRoute[S any](handler VertexID, record Reducer[S, error]) VertexOption[S]`
- `func WithErrorPause[S any]() VertexOption[S]`
- `func WithTimeout[S any](d time.Duration) VertexOption[S]`
- `func AddVertex[I, O, S any](g *Graph[S], id VertexID, task Task[I, O], selector Selector[S, I], reducer Reducer[S, O], opts ...VertexOption[S]) error`

### Methods {#methods}

- `func (g *Graph[S]) Compile(entry, finish VertexID, opts ...CompileOption) (*Runner[S], error)`
- `func (r *Runner[S]) Status(ctx context.Context, id GraphRunID) (GraphRunState, error)`
- `func (r *Runner[S]) Get(ctx context.Context, id GraphRunID) (*Result[S], error)`
- `func (r *Runner[S]) Cancel(ctx context.Context, id GraphRunID, reason string, opts ...RunOption) error`
- `func (o WorkOp) String() string`
- `func (e *DuplicateVertexError) Error() string`
- `func (e *DuplicateConditionalEdgeError) Error() string`
- `func (e *UnknownVertexError) Error() string`
- `func (e *UnreachableVertexError) Error() string`
- `func (e *AmbiguousRoutingError) Error() string`
- `func (e *MissingEntryError) Error() string`
- `func (e *BuildError) Error() string`
- `func (e *MaxStepsExceededError) Error() string`
- `func (e *UndeclaredTargetError) Error() string`
- `func (e *DeadEndError) Error() string`
- `func (e *ConditionError) Error() string`
- `func (e *ConditionError) Unwrap() error`
- `func (e *VertexError) Error() string`
- `func (e *VertexError) Unwrap() error`
- `func (e *CheckpointDecodeError) Error() string`
- `func (e *CheckpointDecodeError) Unwrap() error`
- `func (e *CheckpointNotFoundError) Error() string`
- `func (e *ResumeTerminalError) Error() string`
- `func (e *GraphMismatchError) Error() string`
- `func (e *GraphVersionMismatchError) Error() string`
- `func (e *GraphRunMismatchError) Error() string`
- `func (e *GraphRunExistsError) Error() string`
- `func (e *RevisionConflictError) Error() string`
- `func (e *StoreError) Error() string`
- `func (e *StoreError) Unwrap() error`
- `func (g *Graph[S]) AddEdge(from, to VertexID) error`
- `func (g *Graph[S]) AddConditionalEdge(from VertexID, c Condition[S]) error`
- `func (id GraphID) String() string`
- `func (id GraphID) MarshalText() ([]byte, error)`
- `func (id *GraphID) UnmarshalText(b []byte) error`
- `func (id VertexID) String() string`
- `func (id VertexID) MarshalText() ([]byte, error)`
- `func (id *VertexID) UnmarshalText(b []byte) error`
- `func (id GraphRunID) String() string`
- `func (id GraphRunID) MarshalText() ([]byte, error)`
- `func (id *GraphRunID) UnmarshalText(b []byte) error`
- `func (id VertexRunID) String() string`
- `func (id VertexRunID) MarshalText() ([]byte, error)`
- `func (id *VertexRunID) UnmarshalText(b []byte) error`
- `func (s StepID) String() string`
- `func (r *Runner[S]) Resume(ctx context.Context, id GraphRunID, payload any, opts ...RunOption) (*Result[S], error)`
- `func (r *Runner[S]) GraphID() GraphID`
- `func (r *Runner[S]) GraphVersion() string`
- `func (r *Runner[S]) Run(ctx context.Context, in S, opts ...RunOption) (*Result[S], error)`
- `func (e *UnknownWorkOpError) Error() string`
- `func (s RunStatus) String() string`
- `func (s VertexStatus) String() string`
- `func (i RunInfo) IdempotencyKey() IdempotencyKey`
- `func (s *MemStore) Append(ctx context.Context, cp *Checkpoint) error`
- `func (s *MemStore) Latest(ctx context.Context, id GraphRunID) (*Checkpoint, error)`
- `func (s *MemStore) History(ctx context.Context, id GraphRunID) ([]*Checkpoint, error)`
- `func (t *FuncTask[I, O]) Execute(ctx context.Context, in I) (O, error)`

### Types {#types}

```go
type StepPhase int
```

```go
type Checkpoint struct {
	Run        GraphRunState
	StepBase   json.RawMessage `json:",omitempty"`
	State      json.RawMessage `json:",omitempty"`
	Vertices   []VertexState
	Frontier   []VertexID
	Routes     []RouteRecord
	Phase      StepPhase
	Interrupts []InterruptRecord
	Halt       *HaltRecord
}
```

```go
type RouteRecord struct {
	From        VertexID
	To          []VertexID
	Conditional bool
}
```

```go
type InterruptKind int
```

```go
type InterruptRecord struct {
	Vertex       VertexID
	Kind         InterruptKind
	Info         json.RawMessage `json:",omitempty"`
	Cause        string
	Continuation json.RawMessage `json:",omitempty"`
}
```

```go
type HaltKind int
```

```go
type HaltRecord struct {
	Kind  HaltKind
	Step  StepID
	Cause string
}
```

```go
type CompileOption func(*compileConfig)
```

```go
type WorkOp uint8
```

```go
type GraphVersionKey struct {
	GraphID      GraphID
	GraphVersion string
}
```

```go
type Work struct {
	Key        GraphVersionKey
	GraphRunID GraphRunID
	Op         WorkOp
	Input      json.RawMessage
}
```

```go
type Delivery struct {
	Work Work
	Ack  func() error
	Nack func() error
}
```

```go
type ControlPlane interface {
	// Submit enqueues w for consumers serving w.Key. It honors ctx and must not
	// block unboundedly.
	Submit(ctx context.Context, w Work) error
	// Consume returns a channel delivering only Work whose Key is in serves. The
	// channel is closed when ctx is done (clean shutdown, no goroutine leak).
	Consume(ctx context.Context, serves []GraphVersionKey) (<-chan Delivery, error)
}
```

```go
type DuplicateVertexError struct{ VertexID VertexID }
```

```go
type DuplicateConditionalEdgeError struct{ From VertexID }
```

```go
type UnknownVertexError struct{ VertexID VertexID }
```

```go
type UnreachableVertexError struct{ VertexID VertexID }
```

```go
type AmbiguousRoutingError struct{ VertexID VertexID }
```

```go
type MissingEntryError struct {
	VertexID VertexID
	Role     string
}
```

```go
type BuildError struct {
	Op     string
	Detail string
}
```

```go
type MaxStepsExceededError struct {
	Max  int
	Step StepID
}
```

```go
type UndeclaredTargetError struct {
	From   VertexID
	Target VertexID
}
```

```go
type DeadEndError struct{ Step StepID }
```

```go
type ConditionError struct {
	From VertexID
	Err  error
}
```

```go
type VertexError struct {
	VertexID    VertexID
	VertexRunID VertexRunID
	Attempt     int
	Err         error
}
```

```go
type CheckpointDecodeError struct {
	Field string
	Err   error
}
```

```go
type CheckpointNotFoundError struct{ GraphRunID GraphRunID }
```

```go
type ResumeTerminalError struct{ Status RunStatus }
```

```go
type GraphMismatchError struct {
	Expected GraphID
	Actual   GraphID
}
```

```go
type GraphVersionMismatchError struct {
	Expected string
	Actual   string
}
```

```go
type GraphRunMismatchError struct {
	Requested GraphRunID
	Actual    GraphRunID
}
```

```go
type GraphRunExistsError struct{ GraphRunID GraphRunID }
```

```go
type RevisionConflictError struct {
	GraphRunID GraphRunID
	Expected   uint64
	Actual     uint64
}
```

```go
type StoreError struct {
	Op  string
	Err error
}
```

```go
type Condition[S any] struct {
	Targets []VertexID
	Pick    func(ctx context.Context, s S) ([]VertexID, error)
}
```

```go
type Graph[S any] struct {
	// contains filtered or unexported fields
}
```

```go
type GraphOption func(*graphConfig)
```

```go
type RunResult struct {
	Run        GraphRunState
	State      json.RawMessage
	Interrupts []Interruption
	Halt       *Halt
}
```

```go
type RunnerHandle interface {
	// GraphID returns the wrapped Runner's stable definition identity (§8.1).
	GraphID() GraphID
	// GraphVersion returns the wrapped Runner's compatibility fingerprint (§8.1).
	GraphVersion() string
	// Run decodes stateJSON into the graph state S and starts a run. A malformed
	// stateJSON is rejected at the decode boundary; an empty/nil stateJSON decodes
	// to the zero S.
	Run(ctx context.Context, stateJSON json.RawMessage, opts ...RunOption) (*RunResult, error)
	// Resume continues run id, passing payloadJSON to the run as the live Resume
	// payload (see the runnerHandle.Resume doc for the payload-typing nuance).
	Resume(ctx context.Context, id GraphRunID, payloadJSON json.RawMessage, opts ...RunOption) (*RunResult, error)
	// Status returns the latest GraphRunState for id without decoding S (§18.2).
	Status(ctx context.Context, id GraphRunID) (GraphRunState, error)
	// Get returns the latest run record with the marshaled current State (§18.2).
	Get(ctx context.Context, id GraphRunID) (*RunResult, error)
	// Cancel appends a terminal RunCancelled checkpoint for id (§18.2).
	Cancel(ctx context.Context, id GraphRunID, reason string, opts ...RunOption) error
}
```

```go
type Hooks struct {
	OnRunStart     func(ctx context.Context, ev GraphRunState)
	OnRunFinish    func(ctx context.Context, ev GraphRunState)
	OnVertexStart  func(ctx context.Context, ev VertexState)
	OnVertexFinish func(ctx context.Context, ev VertexState)
	OnEdge         func(ctx context.Context, from, to VertexID, run GraphRunState)
	OnStep         func(ctx context.Context, run GraphRunState, activated int)
	OnCheckpoint   func(ctx context.Context, id GraphRunID, rev uint64, step StepID)
	OnInterrupt    func(ctx context.Context, iv Interruption)
	OnHalt         func(ctx context.Context, h Halt)
}
```

```go
type GraphID uuid.UUID // stable definition id, pinned as a const by callers.
```

```go
type VertexID uuid.UUID // stable definition id, pinned as a const by callers.
```

```go
type GraphRunID uuid.UUID // runtime instance, minted per run via NewGraphRunID.
```

```go
type VertexRunID uuid.UUID // runtime instance, minted per vertex execution.
```

```go
type StepID int // super-step index within a run: 0, 1, 2, …
```

```go
type Interruption struct {
	GraphRunID GraphRunID
	Vertex     VertexID
	Kind       InterruptKind
	Info       any
	Cause      error
}
```

```go
type Halt struct {
	GraphRunID GraphRunID
	Kind       HaltKind
	Step       StepID
	Cause      error
}
```

```go
type RetryPolicy struct {
	MaxAttempts int

	Backoff func(attempt int) time.Duration

	Retryable func(err error) bool
}
```

```go
type Runner[S any] struct {
	// contains filtered or unexported fields
}
```

```go
type Result[S any] struct {
	Run        GraphRunState
	State      S
	Interrupts []Interruption
	Halt       *Halt
}
```

```go
type CheckpointGranularity int
```

```go
type RunOption func(*runConfig)
```

```go
type Resolver interface {
	// Resolve returns the handle registered under the exact (id, version) and true,
	// or (nil, false) if none is registered.
	Resolve(id GraphID, version string) (RunnerHandle, bool)
	// Keys returns one GraphVersionKey per registration, the exact set of versions
	// this worker serves, which Serve hands to Consume.
	Keys() []GraphVersionKey
}
```

```go
type UnknownWorkOpError struct{ Op WorkOp }
```

```go
type RunStatus int
```

```go
type GraphRunState struct {
	GraphRunID    GraphRunID
	GraphID       GraphID
	GraphVersion  string
	Status        RunStatus
	Step          StepID
	Revision      uint64
	CreatedAt     time.Time
	StartedAt     time.Time
	UpdatedAt     time.Time
	CompletedAt   time.Time
	InterruptedAt time.Time
	CancelledAt   time.Time
	CancelReason  string
}
```

```go
type VertexStatus int
```

```go
type VertexState struct {
	VertexID      VertexID
	VertexRunID   VertexRunID
	Step          StepID
	Status        VertexStatus
	Attempt       int
	CreatedAt     time.Time
	StartedAt     time.Time
	CompletedAt   time.Time
	InterruptedAt time.Time
	FailedAt      time.Time
	Err           string
}
```

```go
type RunInfo struct {
	GraphID     GraphID
	GraphRunID  GraphRunID
	VertexID    VertexID
	VertexRunID VertexRunID
	Step        StepID
}
```

```go
type IdempotencyKey string
```

```go
type CheckpointStore interface {
	// Append durably records cp iff cp.Run.Revision is the next revision in
	// sequence for cp.Run.GraphRunID (compare-and-append). Otherwise it returns a
	// *RevisionConflictError. A serialization failure is a *StoreError.
	Append(ctx context.Context, cp *Checkpoint) error
	// Latest returns the highest-revision checkpoint for id (the source of truth),
	// or a *CheckpointNotFoundError if the run has no checkpoints. It MUST return
	// the checkpoint with the HIGHEST Run.Revision for the run: the §10.4 resume
	// contract depends on the loaded checkpoint being genuinely the latest, and a
	// backend that returns a stale revision violates the contract (it would fork or
	// overwrite committed history on the next append).
	Latest(ctx context.Context, id GraphRunID) (*Checkpoint, error)
	// History returns every checkpoint for id ordered by revision (0,1,2,…), or a
	// *CheckpointNotFoundError if the run has no checkpoints.
	History(ctx context.Context, id GraphRunID) ([]*Checkpoint, error)
}
```

```go
type MemStore struct {
	// contains filtered or unexported fields
}
```

```go
type TaskFunc[I, O any] func(ctx context.Context, in I) (O, error)
```

```go
type Task[I, O any] interface {
	Execute(ctx context.Context, in I) (O, error)
}
```

```go
type FuncTask[I, O any] struct {
	// contains filtered or unexported fields
}
```

```go
type Selector[S, I any] func(s S) I
```

```go
type Reducer[S, O any] func(s *S, out O) error
```

```go
type VertexOption[S any] func(*vertexConfig[S])
```

### Constants {#constants}

`StepRunning`, `StepPaused`, `StepRouted`, `StepHalted`, `Awaiting`, `Errored`, `HaltCondition`, `HaltUndeclaredTarget`, `HaltDeadEnd`, `HaltMaxSteps`, `OpRun`, `OpResume`, `PerVertex`, `PerStep`, `RunRunning`, `RunCompleted`, `RunInterrupted`, `RunCancelled`, `VertexPending`, `VertexRunning`, `VertexDone`, `VertexInterrupted`, `VertexFailed`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `AmbiguousRoutingError`, `BuildError`, `CheckpointDecodeError`, `CheckpointNotFoundError`, `ConditionError`, `DeadEndError`, `DuplicateConditionalEdgeError`, `DuplicateVertexError`, `GraphMismatchError`, `GraphRunExistsError`, `GraphRunMismatchError`, `GraphVersionMismatchError`, `MaxStepsExceededError`, `MissingEntryError`, `ResumeTerminalError`, `RevisionConflictError`, `StoreError`, `UndeclaredTargetError`, `UnknownVertexError`, `UnknownWorkOpError`, `UnreachableVertexError`, `VertexError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/flow/checkpoint.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/checkpoint.go)
- [pkg/flow/clone.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/clone.go)
- [pkg/flow/compile.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/compile.go)
- [pkg/flow/control.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/control.go)
- [pkg/flow/controlplane.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/controlplane.go)
- [pkg/flow/doc.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/doc.go)
- [pkg/flow/engine.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/engine.go)
- [pkg/flow/errors.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/errors.go)
- [pkg/flow/graph.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/graph.go)
- [pkg/flow/handle.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/handle.go)
- [pkg/flow/hooks.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/hooks.go)
- [pkg/flow/ids.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/ids.go)
- [pkg/flow/interrupt.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/interrupt.go)
- [pkg/flow/resume.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/resume.go)
- [pkg/flow/retry.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/retry.go)
- [pkg/flow/runner.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/runner.go)
- [pkg/flow/serve.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/serve.go)
- [pkg/flow/state.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/state.go)
- [pkg/flow/store.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/store.go)
- [pkg/flow/task.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/task.go)
- [pkg/flow/version.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/version.go)
- [pkg/flow/vertex.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/vertex.go)

Adjacent tests at the same commit:

- [pkg/flow/checkpoint_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/checkpoint_test.go)
- [pkg/flow/clone_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/clone_test.go)
- [pkg/flow/compile_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/compile_test.go)
- [pkg/flow/control_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/control_test.go)
- [pkg/flow/engine_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/engine_test.go)
- [pkg/flow/errors_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/errors_test.go)
- [pkg/flow/example_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/example_test.go)
- [pkg/flow/graph_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/graph_test.go)
- [pkg/flow/handle_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/handle_test.go)
- [pkg/flow/hooks_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/hooks_test.go)
- [pkg/flow/ids_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/ids_test.go)
- [pkg/flow/interrupt_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/interrupt_test.go)
- [pkg/flow/resume_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/resume_test.go)
- [pkg/flow/retry_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/retry_test.go)
- [pkg/flow/runner_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/runner_test.go)
- [pkg/flow/serve_internal_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/serve_internal_test.go)
- [pkg/flow/serve_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/serve_test.go)
- [pkg/flow/state_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/state_test.go)
- [pkg/flow/store_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/store_test.go)
- [pkg/flow/task_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/task_test.go)
- [pkg/flow/version_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/version_test.go)
- [pkg/flow/vertex_test.go](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/vertex_test.go)

Run `go test ./...` from a checkout of the `flow` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
