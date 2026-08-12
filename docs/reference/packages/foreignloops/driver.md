---
id: reference/packages/foreignloops/driver
title: driver package · driver
description: Reference for provider-neutral foreign agent turns, events, history, posture, and steering.
audience: developer
section: reference
order: 201
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-foreignloops
  exported-surface: release-github-com-looprig-foreignloops
  functions: release-github-com-looprig-foreignloops
  methods: release-github-com-looprig-foreignloops
  types: release-github-com-looprig-foreignloops
  constants: release-github-com-looprig-foreignloops
  variables: release-github-com-looprig-foreignloops
  ownership-and-errors: release-github-com-looprig-foreignloops
  source-and-runnable-proof: release-github-com-looprig-foreignloops
---

# driver package · driver

Import path: `github.com/looprig/foreignloops/driver`. The source is pinned to github.com/looprig/foreignloops@v0.2.3.

## Package role {#package-role}

Package driver defines provider-neutral contracts for foreign agents.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewSteerRequest(prompt []content.Block) (SteerRequest, error)`

### Methods {#methods}

- `func (*SteerAdmissionError) Error() string`
- `func (*SteerAdmissionError) Unwrap() error`
- `func (e *SpawnError) Error() string`
- `func (e *SpawnError) Unwrap() error`
- `func (e *ExitError) Error() string`
- `func (e *DecodeError) Error() string`
- `func (e *DecodeError) Unwrap() error`
- `func (e *HistoryError) Error() string`
- `func (e *HistoryError) Unwrap() error`
- `func (p Posture) Valid() bool`
- `func (r SteerRequest) Validate() error`
- `func (r SteerRequest) Prompt() []content.Block`
- `func (o SteerOutcome) Valid() bool`
- `func (o SteerOutcome) RetrySafe() bool`
- `func (r SteerResult) Validate() error`
- `func (k ObservationKind) Valid() bool`
- `func (PromptObservation) Kind() ObservationKind`
- `func (o PromptObservation) Sequence() uint64`
- `func (UpdateObservation) Kind() ObservationKind`
- `func (o UpdateObservation) Sequence() uint64`
- `func (SteerObservation) Kind() ObservationKind`
- `func (o SteerObservation) Sequence() uint64`

### Types {#types}

```go
type Agent interface {
	Spawn(context.Context, Turn) (Stream, error)
}
```

```go
type Steerer interface {
	Steer(context.Context, SteerRequest) (SteerResult, error)
}
```

```go
type Closer interface {
	Close() error
}
```

```go
type Turn struct {
	SystemPrompt string
	ForeignSID   string
	StartNew     bool
	Input        []content.Block
	Cwd          string
	Posture      PermissionPosture
}
```

```go
type Stream interface {
	Events() <-chan Event
	History() (History, error)
	Close() error
}
```

```go
type Kind uint8
```

```go
type Event struct {
	Kind          Kind
	SessionID     string
	Text          string
	ToolUseID     string
	ToolName      string
	IsError       bool
	ResultPreview string
	Message       *content.AIMessage
	ErrText       string
}
```

```go
type PermissionPosture uint8
```

```go
type SteerAdmissionError struct{}
```

```go
type SpawnError struct{ Cause error }
```

```go
type ExitError struct{ Code int }
```

```go
type DecodeError struct{ Cause error }
```

```go
type HistoryError struct{ Cause error }
```

```go
type History struct {
	Available bool
	Steps     []content.AgenticMessages
}
```

```go
type Posture string
```

```go
type SteerRequest struct {
	// contains filtered or unexported fields
}
```

```go
type SteerOutcome string
```

```go
type SteerResult struct {
	Outcome          SteerOutcome
	Reason           string
	WriteAdmitted    bool
	ReceiveSequence  uint64
	ResponseSequence uint64
	OrderSequence    uint64
}
```

```go
type ObservationKind uint8
```

```go
type Observation interface {
	Kind() ObservationKind
	Sequence() uint64
	// contains filtered or unexported methods
}
```

```go
type OrderedStream interface {
	// Observations returns the stream-owned ordered projection. A stream selects
	// exactly one projection before production starts: legacy Events or this
	// channel. The inactive projection is closed and carries no traffic.
	Observations() <-chan Observation
}
```

```go
type PromptObservation struct {
	StopReason string

	Message          *content.AIMessage
	WriteAdmitted    bool
	ReceiveSequence  uint64
	ResponseSequence uint64
	OrderSequence    uint64
	Err              error
}
```

```go
type UpdateObservation struct {
	Event           Event
	ReceiveSequence uint64
	OrderSequence   uint64
}
```

```go
type SteerObservation struct {
	SteerResult
	Err error
}
```

### Constants {#constants}

`KindInit`, `KindTextDelta`, `KindThinkingDelta`, `KindToolUse`, `KindToolResult`, `KindStepComplete`, `KindTerminalOK`, `KindTerminalError`, `KindModelFacingError`, `PostureDefault`, `PostureAcceptEdits`, `PostureReadOnly`, `PostureWorkspaceWrite`, `SteerOutcomeInjected`, `SteerOutcomeFallbackRequired`, `SteerOutcomeUnsupported`, `SteerOutcomeAdmissionUnknown`, `SteerOutcomeDeliveryUnknown`, `SteerOutcomeDeliveredUntrackable`, `ObservationPrompt`, `ObservationUpdate`, `ObservationSteer`

### Variables {#variables}

`ErrSteerAdmissionCapacity`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `DecodeError`, `ExitError`, `HistoryError`, `SpawnError`, `SteerAdmissionError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [driver/driver.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/driver.go)
- [driver/errors.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/errors.go)
- [driver/history.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/history.go)
- [driver/posture.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/posture.go)
- [driver/steering.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/steering.go)

Adjacent tests at the same commit:

- [driver/deps_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/deps_test.go)
- [driver/driver_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/driver_test.go)
- [driver/errors_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/errors_test.go)
- [driver/posture_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/posture_test.go)
- [driver/steering_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/steering_test.go)

Run `go test ./...` from a checkout of the `foreignloops` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
