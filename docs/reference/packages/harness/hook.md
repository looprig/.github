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

Import path: `github.com/looprig/harness/pkg/hook`. The source is pinned to github.com/looprig/harness@v0.25.0.

## Package role {#package-role}

Package hook defines the in-process interception contracts for bounded Harness runtime operations.

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
- `func (r *Runner) Start(ctx context.Context, call Call) (context.Context, FinishFunc, error)`
- `func (r *Runner) Handles(operation Operation) bool`

### Types {#types}

```go
type Call struct {
	Operation Operation

	StartedAt time.Time

	Coordinates identity.Coordinates

	AgentName identity.AgentName

	Cause identity.Cause

	Turn          *TurnData
	Step          *StepData
	Inference     *InferenceData
	Compaction    *CompactionData
	ToolCall      *ToolCallData
	GateWait      *GateWaitData
	ToolExecution *ToolExecutionData
	JournalAppend *JournalAppendData
}
```

```go
type Result struct {
	Call

	EndedAt time.Time

	Outcome Outcome

	Err error
}
```

```go
type TurnData struct {
	Index event.TurnIndex

	Input *content.UserMessage
}
```

```go
type StepData struct {
	Index StepIndex
}
```

```go
type InferenceData struct {
	Request *inference.Request

	AIMessage *content.AIMessage

	StreamResult *stream.StreamResult
}
```

```go
type CompactionData struct {
	AttemptID event.CompactAttemptID

	Input *loop.CompactionInput

	Output *loop.CompactionOutput
}
```

```go
type ToolCallData struct {
	ToolExecutionID uuid.UUID

	ToolUseID string

	ToolName string

	Summary string

	ArgsJSON json.RawMessage

	PermissionEffect event.PermissionDecisionEffect

	PermissionReason string

	Result *tool.ToolResult

	ResultPreview string

	IsError bool
}
```

```go
type GateWaitData struct {
	GateID gate.ID

	Kind gate.Kind

	Resolver gate.ResolverKind

	Blocks gate.Blocks

	Effect gate.Effect

	Answer *gate.Answer
}
```

```go
type ToolExecutionData struct {
	ToolExecutionID uuid.UUID

	ToolUseID string

	ToolName string

	ArgsJSON json.RawMessage

	Result *tool.ToolResult

	ResultPreview string

	IsError bool
}
```

```go
type JournalAppendData struct {
	Family RecordFamily

	RecordID string
}
```

```go
type ConfigErrorKind string
```

```go
type ConfigError struct {
	Kind      ConfigErrorKind
	Operation Operation
	Index     int
	Field     string
}
```

```go
type CallErrorKind string
```

```go
type CallError struct {
	Kind      CallErrorKind
	Operation Operation
}
```

```go
type GuardError struct {
	Operation Operation
	Index     int
	Cause     error
}
```

```go
type CloneErrorKind string
```

```go
type CloneError struct {
	Kind      CloneErrorKind
	ValueType string
}
```

```go
type Denial struct {
	Code   string
	Reason string
}
```

```go
type Operation uint8
```

```go
type Outcome uint8
```

```go
type StepIndex uint64
```

```go
type RecordFamily string
```

```go
type GuardFunc func(context.Context, Call) error
```

```go
type BeginFunc func(context.Context, Call) (context.Context, FinishFunc)
```

```go
type FinishFunc func(Result)
```

```go
type Guard struct {
	Operation Operation
	Check     GuardFunc
}
```

```go
type Around struct {
	Operation Operation
	Begin     BeginFunc
}
```

```go
type Set struct {
	PolicyRevision string

	Guards []Guard

	Around []Around
}
```

```go
type Runner struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

`ConfigUnknownOperation`, `ConfigOperationNotGuardable`, `ConfigNilGuard`, `ConfigNilAround`, `ConfigMissingPolicyRevision`, `ConfigUnexpectedPolicyRevision`, `ConfigInvalidPolicyRevision`, `ConfigInvalidDenial`, `CallUnknownOperation`, `CallInvalidPayload`, `CloneUnknownConversation`, `CloneUnknownBlock`, `OperationTurn`, `OperationStep`, `OperationInference`, `OperationCompaction`, `OperationToolCall`, `OperationGateWait`, `OperationToolExecution`, `OperationJournalAppend`, `OutcomeCompleted`, `OutcomeDenied`, `OutcomeFailed`, `OutcomeCanceled`, `RecordEvent`, `RecordCommand`, `RecordGatePrepared`, `RecordFence`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `CallError`, `CloneError`, `ConfigError`, `Denial`, `GuardError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/hook/clone.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hook/clone.go)
- [pkg/hook/data.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hook/data.go)
- [pkg/hook/errors.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hook/errors.go)
- [pkg/hook/hook.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hook/hook.go)
- [pkg/hook/runner.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hook/runner.go)

Adjacent tests at the same commit:

- [pkg/hook/hook_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hook/hook_test.go)
- [pkg/hook/runner_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/hook/runner_test.go)

Run `go test ./...` from a checkout of the `harness` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
