---
id: reference/packages/harness/command
title: command package · command
description: Reference for Harness command envelopes, acknowledgements, and validation.
audience: developer
section: reference
order: 140
publication: released
examples:
  - stage-14-delegation
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

# command package · command

Import path: `github.com/looprig/harness/pkg/command`. The source is pinned to github.com/looprig/harness@v0.24.2.

## Package role {#package-role}

Commands carry a header, command name, route, and typed payload into a session's serialized control path. The package keeps command validation separate from event validation so an acknowledgement cannot be mistaken for a durable event.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func MarshalCommand(cmd Command) ([]byte, error)`
- `func UnmarshalCommand(data []byte) (Command, error)`
- `func ValidateCommand(cmd Command) error`

### Methods {#methods}

- `func (c ApproveToolCall) GateToolExecutionID() uuid.UUID`
- `func (c CancelDelegateRequest) Validate() error`
- `func (e *InvalidCommandError) Error() string`
- `func (c DenyToolCall) GateToolExecutionID() uuid.UUID`
- `func (h Header) CommandHeader() Header`
- `func (c Interrupt) Validate() error`
- `func (c SetLoopMode) Validate() error`
- `func (c ChangeLoopInference) Validate() error`
- `func (e *UnbufferedAckError) Error() string`
- `func (c ReplaceLoopExternalTools) Validate() error`
- `func (e *UnknownCommandTypeError) Error() string`
- `func (e *CommandEncodeError) Error() string`
- `func (e *CommandEncodeError) Unwrap() error`
- `func (e *CommandDecodeError) Error() string`
- `func (e *CommandDecodeError) Unwrap() error`
- `func (e *CommandLimitError) Error() string`
- `func (c ProvideUserInput) GateToolExecutionID() uuid.UUID`
- `func (c Shutdown) Validate() error`
- `func (e *LoopTerminatedError) Error() string`
- `func (e *LoopTerminatedError) Unwrap() error`
- `func (p DelegateDeliveryPhase) Valid() bool`
- `func (e *CommandValidationError) Error() string`

### Types {#types}

```go
type ApproveToolCall struct {
	Header

	GateRoute

	Action gate.ApprovalAction `json:"action"`
}
```

```go
type DelegateCancelResult uint8
```

```go
type CancelDelegateRequest struct {
	Header
	identity.Coordinates
	TargetCommandID uuid.UUID                   `json:"target_command_id,omitzero"`
	Ack             chan<- DelegateCancelResult `json:"-"`
}
```

```go
type CancelQueuedInput struct {
	Header
	identity.Coordinates
	TargetCommandID uuid.UUID `json:"target_command_id,omitzero"`
}
```

```go
type Command interface {
	isCommand()
	CommandHeader() Header
}
```

```go
type CommandName string
```

```go
type CommandField string
```

```go
type InvalidCommandError struct {
	Command CommandName
	Field   CommandField
}
```

```go
type Compact struct {
	Header
	identity.Coordinates
}
```

```go
type DenyToolCall struct {
	Header

	GateRoute
}
```

```go
type Header struct {
	CommandID uuid.UUID       `json:"command_id,omitzero"`
	Cause     identity.Cause  `json:"cause,omitzero"`
	Agency    identity.Agency `json:"agency,omitzero"`

	CreatedAt time.Time `json:"created_at,omitzero"`
}
```

```go
type Interrupt struct {
	Header
	Ack chan<- bool `json:"-"`
}
```

```go
type LoopChangeResult struct {
	Err    error
	Mode   string
	Model  model.Model
	Effort model.Effort
}
```

```go
type SetLoopMode struct {
	Header
	Mode string                  `json:"mode,omitzero"`
	Ack  chan<- LoopChangeResult `json:"-"`
}
```

```go
type ChangeLoopInference struct {
	Header
	Model     model.Model             `json:"model,omitzero"`
	Effort    model.Effort            `json:"effort,omitzero"`
	SetModel  bool                    `json:"set_model,omitzero"`
	SetEffort bool                    `json:"set_effort,omitzero"`
	Ack       chan<- LoopChangeResult `json:"-"`
}
```

```go
type UnbufferedAckError struct {
	Command CommandName
	Field   CommandField
}
```

```go
type LoopToolsResult struct {
	Err        error
	Generation string
	Installed  int
}
```

```go
type ReplaceLoopExternalTools struct {
	Header
	Source     string                       `json:"source,omitzero"`
	Generation string                       `json:"generation,omitzero"`
	Tools      []tool.InvokableTool         `json:"-"`
	Identities []event.ExternalToolIdentity `json:"-"`
	Ack        chan<- LoopToolsResult       `json:"-"`
}
```

```go
type UnknownCommandTypeError struct{ Type CommandName }
```

```go
type CommandEncodeError struct {
	Type  CommandName
	Cause error
}
```

```go
type CommandDecodeError struct {
	Type  CommandName
	Cause error
}
```

```go
type CommandLimitError struct {
	Got int
	Max int
}
```

```go
type ProcessNotificationResult uint8
```

```go
type ProcessNotification struct {
	Header
	Notification tool.ProcessCompletionNotification `json:"notification"`

	Result chan<- ProcessNotificationResult `json:"-"`
}
```

```go
type ProvideUserInput struct {
	Header

	GateRoute
	Answer string `json:"answer,omitempty"`
}
```

```go
type GateRoute struct {
	identity.Coordinates
	GateID          uuid.UUID `json:"gate_id,omitzero"`
	ToolExecutionID uuid.UUID `json:"tool_execution_id,omitzero"`
}
```

```go
type Shutdown struct {
	Header
	Ack chan<- error `json:"-"`
}
```

```go
type LoopTerminatedError struct{ Cause error }
```

```go
type DelegateDeliveryPhase string
```

```go
type UserInput struct {
	Header
	Blocks []content.Block `json:"blocks,omitempty"`

	NoFold bool `json:"no_fold,omitzero"`

	TargetLoopID uuid.UUID `json:"target_loop_id,omitzero"`

	BackgroundHandBack bool `json:"background_hand_back,omitzero"`

	DelegateDeliveryPhase DelegateDeliveryPhase `json:"delegate_delivery_phase,omitzero"`

	Accepted chan error `json:"-"`
}
```

```go
type SubagentResult struct {
	Header
	identity.Coordinates
	Blocks []content.Block `json:"blocks,omitempty"`
}
```

```go
type Rule string
```

```go
type CommandValidationError struct {
	Command CommandName
	Field   CommandField
	Rule    Rule
}
```

### Constants {#constants}

`CommandCancelDelegateRequest`, `CancelDelegateRequestAck`, `DelegateCancelNoop`, `DelegateCancelQueued`, `DelegateCancelActive`, `CommandInterrupt`, `InterruptAck`, `CommandSetLoopMode`, `CommandChangeLoopInference`, `SetLoopModeAck`, `ChangeLoopInferenceAck`, `CommandReplaceLoopExternalTools`, `ReplaceLoopExternalToolsAck`, `ReplaceLoopExternalToolsSource`, `ReplaceLoopExternalToolsTools`, `ProcessNotificationAccepted`, `ProcessNotificationDuplicate`, `ProcessNotificationCollision`, `ProcessNotificationStopped`, `CommandProcessNotification`, `FieldNotification`, `CommandShutdown`, `ShutdownAck`, `DelegateDeliveryPhaseIntent`, `DelegateDeliveryPhaseFallbackQueued`, `RuleRequired`, `RuleInvalid`, `CommandUserInput`, `CommandSubagentResult`, `CommandCancelQueuedInput`, `CommandApproveToolCall`, `CommandDenyToolCall`, `CommandProvideUserInput`, `CommandCompact`, `CommandUnknown`, `FieldCommandID`, `FieldSessionID`, `FieldLoopID`, `FieldTargetCommandID`, `FieldTargetLoopID`, `FieldBackgroundHandBack`, `FieldDelegateDeliveryPhase`, `FieldToolExecutionID`, `FieldAgency`, `FieldAction`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `CommandDecodeError`, `CommandEncodeError`, `CommandLimitError`, `CommandValidationError`, `InvalidCommandError`, `LoopTerminatedError`, `UnbufferedAckError`, `UnknownCommandTypeError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/command/approve.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/approve.go)
- [pkg/command/cancel_delegate_request.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/cancel_delegate_request.go)
- [pkg/command/cancel_queued_input.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/cancel_queued_input.go)
- [pkg/command/command.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/command.go)
- [pkg/command/compact.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/compact.go)
- [pkg/command/deny.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/deny.go)
- [pkg/command/header.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/header.go)
- [pkg/command/interrupt.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/interrupt.go)
- [pkg/command/loop_change.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/loop_change.go)
- [pkg/command/loop_tools.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/loop_tools.go)
- [pkg/command/marshal.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/marshal.go)
- [pkg/command/process_notification.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/process_notification.go)
- [pkg/command/provide_user_input.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/provide_user_input.go)
- [pkg/command/route.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/route.go)
- [pkg/command/shutdown.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/shutdown.go)
- [pkg/command/submit.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/submit.go)
- [pkg/command/validate.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/validate.go)

Adjacent tests at the same commit:

- [pkg/command/approve_action_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/approve_action_test.go)
- [pkg/command/cancel_delegate_request_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/cancel_delegate_request_test.go)
- [pkg/command/cancel_queued_input_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/cancel_queued_input_test.go)
- [pkg/command/compact_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/compact_test.go)
- [pkg/command/control_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/control_test.go)
- [pkg/command/header_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/header_test.go)
- [pkg/command/interrupt_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/interrupt_test.go)
- [pkg/command/loop_change_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/loop_change_test.go)
- [pkg/command/marshal_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/marshal_test.go)
- [pkg/command/process_notification_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/process_notification_test.go)
- [pkg/command/shutdown_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/shutdown_test.go)
- [pkg/command/submit_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/submit_test.go)
- [pkg/command/validate_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/validate_test.go)

Run `GOWORK=off go test ./...` from the `harness` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
