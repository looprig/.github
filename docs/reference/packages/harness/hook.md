---
id: reference/packages/harness/hook
title: hook package · hook
description: Reference for bounded Harness runtime hooks around calls, turns, tools, gates, inference, and persistence.
audience: developer
section: reference
order: 144
publication: released
examples:
  - stage-07-session-events
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

# hook package · hook

Import path: `github.com/looprig/harness/pkg/hook`. The source is pinned to github.com/looprig/harness@v0.24.2.

## Package role {#package-role}

Hooks surround an operation with a `BeginFunc` and `FinishFunc`, carrying typed call data rather than raw mutable runtime state. They are useful for tracing, policy observation, and deterministic instrumentation without making the hook package own execution.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func CloneCall(call Call) Call`
- `func CloneResult(result Result) Result`
- `func ValidateCall(call Call) error`
- `func Deny(code, reason string) error`
- `func AsDenial(err error) (*Denial, bool)`
- `func ValidateSet(set Set) error`
- `func Compile(set Set) (*Runner, error)`

### Methods {#methods}

- `func (e *ConfigError) Error() string`
- `func (e *CallError) Error() string`
- `func (e *GuardError) Error() string`
- `func (e *GuardError) Unwrap() error`
- `func (e *CloneError) Error() string`
- `func (e *Denial) Error() string`
- `func (o Operation) Valid() bool`
- `func (o Operation) Guardable() bool`
- `func (o Outcome) Valid() bool`
- `func (c *isolatedObserverContext) Deadline() (time.Time, bool)`
- `func (c *isolatedObserverContext) Done() <-chan struct{}`
- `func (c *isolatedObserverContext) Err() error`
- `func (c *isolatedObserverContext) Value(key any) any`
- `func (c *parentPreservingContext) Done() <-chan struct{}`
- `func (c *parentPreservingContext) Err() error`
- `func (r *Runner) Start( ctx context.Context, call Call,) (context.Context, FinishFunc, error)`
- `func (r *Runner) Handles(operation Operation) bool`

### Types {#types}

`Call`, `Result`, `TurnData`, `StepData`, `InferenceData`, `CompactionData`, `ToolCallData`, `GateWaitData`, `ToolExecutionData`, `JournalAppendData`, `ConfigErrorKind`, `ConfigError`, `CallErrorKind`, `CallError`, `GuardError`, `CloneErrorKind`, `CloneError`, `Denial`, `Operation`, `Outcome`, `StepIndex`, `RecordFamily`, `GuardFunc`, `BeginFunc`, `FinishFunc`, `Guard`, `Around`, `Set`, `Runner`

### Constants {#constants}

`ConfigUnknownOperation`, `ConfigOperationNotGuardable`, `ConfigNilGuard`, `ConfigNilAround`, `ConfigMissingPolicyRevision`, `ConfigUnexpectedPolicyRevision`, `ConfigInvalidPolicyRevision`, `ConfigInvalidDenial`, `CallUnknownOperation`, `CallInvalidPayload`, `CloneUnknownConversation`, `CloneUnknownBlock`, `OperationTurn`, `OperationStep`, `OperationInference`, `OperationCompaction`, `OperationToolCall`, `OperationGateWait`, `OperationToolExecution`, `OperationJournalAppend`, `OutcomeCompleted`, `OutcomeDenied`, `OutcomeFailed`, `OutcomeCanceled`, `RecordEvent`, `RecordCommand`, `RecordGatePrepared`, `RecordFence`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ConfigError`, `CallError`, `GuardError`, `CloneError`, `Denial`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/hook/clone.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hook/clone.go)
- [pkg/hook/data.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hook/data.go)
- [pkg/hook/errors.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hook/errors.go)
- [pkg/hook/hook.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hook/hook.go)
- [pkg/hook/runner.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hook/runner.go)

Adjacent tests at the same commit:

- [pkg/hook/hook_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hook/hook_test.go)
- [pkg/hook/runner_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hook/runner_test.go)

Run `GOWORK=off go test ./...` from the `harness` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
