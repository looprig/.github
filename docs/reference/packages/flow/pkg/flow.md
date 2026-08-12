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

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

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
- `func AddVertex[I, O, S any]( g *Graph[S], id VertexID, task Task[I, O], selector Selector[S, I], reducer Reducer[S, O], opts ...VertexOption[S],) error`

### Methods {#methods}

- `func (e *codecError) Error() string`
- `func (e *codecError) Unwrap() error`
- `func (g *Graph[S]) Compile(entry, finish VertexID, opts ...CompileOption) (*Runner[S], error)`
- `func (r *Runner[S]) Status(ctx context.Context, id GraphRunID) (GraphRunState, error)`
- `func (r *Runner[S]) Get(ctx context.Context, id GraphRunID) (*Result[S], error)`
- `func (r *Runner[S]) Cancel(ctx context.Context, id GraphRunID, reason string, opts ...RunOption) error`
- `func (o WorkOp) String() string`
- `func (e *errObservedCancellation) Error() string`
- `func (e *DuplicateVertexError) Error() string`
- `func (e *DuplicateConditionalEdgeError) Error() string`
- `func (e *UnknownVertexError) Error() string`
- `func (e *UnreachableVertexError) Error() string`
- `func (e *AmbiguousRoutingError) Error() string`
- `func (e *MissingEntryError) Error() string`
- `func (e *BuildError) Error() string`
- `func (e *internalTypeError) Error() string`
- `func (e *MaxStepsExceededError) Error() string`
- `func (e *UndeclaredTargetError) Error() string`
- `func (e *DeadEndError) Error() string`
- `func (e *ConditionError) Error() string`
- `func (e *ConditionError) Unwrap() error`
- `func (e *VertexError) Error() string`
- `func (e *VertexError) Unwrap() error`
- `func (e *CheckpointDecodeError) Error() string`
- `func (e *CheckpointDecodeError) Unwrap() error`
- `func (e *phaseComboError) Error() string`
- `func (e *CheckpointNotFoundError) Error() string`
- `func (e *ResumeTerminalError) Error() string`
- `func (e *GraphMismatchError) Error() string`
- `func (e *GraphVersionMismatchError) Error() string`
- `func (e *GraphRunMismatchError) Error() string`
- `func (e *GraphRunExistsError) Error() string`
- `func (e *RevisionConflictError) Error() string`
- `func (e *StoreError) Error() string`
- `func (e *StoreError) Unwrap() error`
- `func (e *interruptSignal) Error() string`
- `func (g *Graph[S]) AddEdge(from, to VertexID) error`
- `func (g *Graph[S]) AddConditionalEdge(from VertexID, c Condition[S]) error`
- `func (h *runnerHandle[S]) GraphID() GraphID`
- `func (h *runnerHandle[S]) GraphVersion() string`
- `func (h *runnerHandle[S]) Run(ctx context.Context, stateJSON json.RawMessage, opts ...RunOption) (*RunResult, error)`
- `func (h *runnerHandle[S]) Resume(ctx context.Context, id GraphRunID, payloadJSON json.RawMessage, opts ...RunOption) (*RunResult, error)`
- `func (h *runnerHandle[S]) Status(ctx context.Context, id GraphRunID) (GraphRunState, error)`
- `func (h *runnerHandle[S]) Get(ctx context.Context, id GraphRunID) (*RunResult, error)`
- `func (h *runnerHandle[S]) Cancel(ctx context.Context, id GraphRunID, reason string, opts ...RunOption) error`
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

`StepPhase`, `Checkpoint`, `RouteRecord`, `InterruptKind`, `InterruptRecord`, `HaltKind`, `HaltRecord`, `CompileOption`, `WorkOp`, `GraphVersionKey`, `Work`, `Delivery`, `ControlPlane`, `DuplicateVertexError`, `DuplicateConditionalEdgeError`, `UnknownVertexError`, `UnreachableVertexError`, `AmbiguousRoutingError`, `MissingEntryError`, `BuildError`, `MaxStepsExceededError`, `UndeclaredTargetError`, `DeadEndError`, `ConditionError`, `VertexError`, `CheckpointDecodeError`, `CheckpointNotFoundError`, `ResumeTerminalError`, `GraphMismatchError`, `GraphVersionMismatchError`, `GraphRunMismatchError`, `GraphRunExistsError`, `RevisionConflictError`, `StoreError`, `Condition`, `Graph`, `GraphOption`, `RunResult`, `RunnerHandle`, `Hooks`, `Interruption`, `Halt`, `RetryPolicy`, `Runner`, `Result`, `CheckpointGranularity`, `RunOption`, `Resolver`, `UnknownWorkOpError`, `RunStatus`, `GraphRunState`, `VertexStatus`, `VertexState`, `RunInfo`, `IdempotencyKey`, `CheckpointStore`, `MemStore`, `TaskFunc`, `Task`, `FuncTask`, `Selector`, `Reducer`, `VertexOption`

### Constants {#constants}

`StepRunning`, `StepPaused`, `StepRouted`, `StepHalted`, `Awaiting`, `Errored`, `HaltCondition`, `HaltUndeclaredTarget`, `HaltDeadEnd`, `HaltMaxSteps`, `OpRun`, `OpResume`, `PerVertex`, `PerStep`, `RunRunning`, `RunCompleted`, `RunInterrupted`, `RunCancelled`, `VertexPending`, `VertexRunning`, `VertexDone`, `VertexInterrupted`, `VertexFailed`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `DuplicateVertexError`, `DuplicateConditionalEdgeError`, `UnknownVertexError`, `UnreachableVertexError`, `AmbiguousRoutingError`, `MissingEntryError`, `BuildError`, `MaxStepsExceededError`, `UndeclaredTargetError`, `DeadEndError`, `ConditionError`, `VertexError`, `CheckpointDecodeError`, `CheckpointNotFoundError`, `ResumeTerminalError`, `GraphMismatchError`, `GraphVersionMismatchError`, `GraphRunMismatchError`, `GraphRunExistsError`, `RevisionConflictError`, `StoreError`, `UnknownWorkOpError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

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

Run `GOWORK=off go test ./...` from the `flow` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
