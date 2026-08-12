---
id: reference/packages/mcp/harness
title: harness package · mcpharness
description: Reference for MCP binding, adoption, sampling, reconfiguration, and Harness tool identity.
audience: developer
section: reference
order: 213
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  package-role: release-github-com-looprig-mcp
  exported-surface: release-github-com-looprig-mcp
  functions: release-github-com-looprig-mcp
  methods: release-github-com-looprig-mcp
  types: release-github-com-looprig-mcp
  constants: release-github-com-looprig-mcp
  variables: release-github-com-looprig-mcp
  ownership-and-errors: release-github-com-looprig-mcp
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# harness package · mcpharness

Import path: `github.com/looprig/mcp/pkg/harness`. The source is pinned to github.com/looprig/mcp@v0.6.2.

## Package role {#package-role}

Package mcpharness binds MCP servers into a Harness Session.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewManager(bindings []Binding, deps Deps) (*Manager, error)`
- `func AddBinding(b Binding) BindingOp`
- `func RemoveBinding(name string) BindingOp`
- `func DisableBinding(name string) BindingOp`
- `func EnableBinding(name string) BindingOp`
- `func ReplaceBinding(b Binding) BindingOp`
- `func AllLoops() LoopSelector`
- `func Loops(ids ...uuid.UUID) LoopSelector`
- `func Named(names ...string) LoopSelector`
- `func ToolInvokeIdentity(binding, rawTool string) string`

### Methods {#methods}

- `func (m *Manager) StartAdoption(source EventSource, loops LoopControllers) (*Adopter, error)`
- `func (a *Adopter) Close() error`
- `func (a *Adopter) Install(ctx context.Context, loopID uuid.UUID, loopName string) error`
- `func (m *Manager) BindSession(sessionID uuid.UUID) error`
- `func (s Scope) String() string`
- `func (b Binding) Validate() error`
- `func (r SampleRole) String() string`
- `func (k NoticeKind) String() string`
- `func (m *Manager) ConfigIdentity() []BindingIdentity`
- `func (m *Manager) ConfigDigest() string`
- `func (e *StartupError) Error() string`
- `func (m *Manager) Start(ctx context.Context) error`
- `func (m *Manager) Status() []BindingStatus`
- `func (m *Manager) Close(ctx context.Context) error`
- `func (m *Manager) CloseLoop(ctx context.Context, loopID uuid.UUID) error`
- `func (e *DuplicateModelNameError) Error() string`
- `func (o BindingOp) FailClosed() BindingOp`
- `func (m *Manager) Reconfigure(ctx context.Context, ops []BindingOp) error`
- `func (s LoopSelector) Permits(loopID uuid.UUID, name string) bool`
- `func (s LoopSelector) String() string`
- `func (m *Manager) SessionTools(loopID uuid.UUID, loopName string) []tool.Definition`
- `func (m *Manager) LoopTools(loopID uuid.UUID) []tool.Definition`

### Types {#types}

```go
type EventSource interface {
	SubscribeEvents(event.EventFilter) (event.Subscription, error)
}
```

```go
type LoopControllers interface {
	LoopController(uuid.UUID) (loop.Controller, bool)
}
```

```go
type Adopter struct {
	// contains filtered or unexported fields
}
```

```go
type Scope uint8
```

```go
type Binding struct {
	Name string

	Server client.Definition

	Scope Scope

	Loop uuid.UUID

	Visibility LoopSelector

	Required bool
}
```

```go
type Clock interface {
	Now() time.Time
}
```

```go
type GateRequest struct {
	Kind gate.Kind

	Payload gate.Payload

	Prompt gate.Prompt

	Restorable bool

	Binding string

	LoopID uuid.UUID
}
```

```go
type GateResponse struct {
	Action string
	Values map[string]string
}
```

```go
type GateOpener interface {
	OpenGate(ctx context.Context, req GateRequest) (GateResponse, error)
}
```

```go
type SampleRole uint8
```

```go
type SampleMessage struct {
	Role SampleRole

	Text string
}
```

```go
type SampleRequest struct {
	Binding string

	LoopID uuid.UUID

	SystemPrompt string

	Messages []SampleMessage

	MaxTokens int
}
```

```go
type SampleResult struct {
	Model string

	Text string

	StopReason string
}
```

```go
type SamplingPolicy interface {
	Sample(ctx context.Context, req SampleRequest) (SampleResult, error)
}
```

```go
type EventPublisher interface {
	PublishEvent(ctx context.Context, ev event.Event) error
}
```

```go
type NoticeKind uint8
```

```go
type Notice struct {
	Kind NoticeKind

	Binding string

	LoopID uuid.UUID

	Generation uint64

	Message string
}
```

```go
type Reporter interface {
	Report(Notice)
}
```

```go
type Deps struct {
	SessionID uuid.UUID

	Gates GateOpener

	Events EventPublisher

	Sampling SamplingPolicy

	Reporter Reporter

	Clock Clock
}
```

```go
type ToolIdentity struct {
	RawName string

	ModelName string

	InputSchemaDigest string

	OutputSchemaDigest string
}
```

```go
type BindingIdentity struct {
	Name string

	Scope Scope

	Loop uuid.UUID

	SelectorDigest string

	TransportKind string

	RedactedOrigin string

	Required bool

	CapabilityDigest string

	FilterDigest string

	LimitsDigest string

	CompatDigest string

	Server client.ServerIdentity

	ProtocolVersion string

	CatalogGeneration uint64

	CatalogDigest string

	Tools []ToolIdentity

	Digest string
}
```

```go
type Manager struct {
	// contains filtered or unexported fields
}
```

```go
type BindingFailure struct {
	Binding string

	Class client.FailureClass

	Message string
}
```

```go
type StartupError struct {
	Failures []BindingFailure
}
```

```go
type BindingStatus struct {
	Name string

	Scope Scope

	Loop uuid.UUID

	Required bool

	Enabled bool

	Retiring bool

	Client client.Status
}
```

```go
type DuplicateModelNameError struct {
	ModelName string

	Binding string

	OtherBinding string
}
```

```go
type BindingOp struct {
	// contains filtered or unexported fields
}
```

```go
type LoopSelector struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

`ScopeSession`, `ScopeLoop`, `SampleRoleUser`, `SampleRoleAssistant`, `NoticeToolNameCollision`, `NoticeAdopted`, `NoticeAdoptionFailed`, `NoticeAdoptionUnsupported`, `NoticeEventRejected`, `NoticeElicitationDeclined`, `NoticeSamplingRequested`, `NoticeSamplingResolved`, `NoticeSamplingDenied`, `DefaultElicitationTimeout`, `IntegrationSource`, `DefaultRetirementTimeout`, `ToolSource`, `CapabilityToolInvoke`

### Variables {#variables}

`ErrAlreadyBound`, `ErrNotBound`, `ErrSamplingDenied`, `ErrManagerClosed`, `ErrAlreadyStarted`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `DuplicateModelNameError`, `StartupError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/harness/adoption.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/adoption.go)
- [pkg/harness/attach.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/attach.go)
- [pkg/harness/binding.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/binding.go)
- [pkg/harness/deps.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/deps.go)
- [pkg/harness/elicitation.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/elicitation.go)
- [pkg/harness/events.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/events.go)
- [pkg/harness/identity.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/identity.go)
- [pkg/harness/manager.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/manager.go)
- [pkg/harness/names.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/names.go)
- [pkg/harness/reconfigure.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/reconfigure.go)
- [pkg/harness/sampling.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/sampling.go)
- [pkg/harness/selector.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/selector.go)
- [pkg/harness/tools.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/tools.go)

Adjacent tests at the same commit:

- [pkg/harness/adoption_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/adoption_test.go)
- [pkg/harness/attach_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/attach_test.go)
- [pkg/harness/binding_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/binding_test.go)
- [pkg/harness/elicitation_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/elicitation_test.go)
- [pkg/harness/events_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/events_test.go)
- [pkg/harness/fake_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/fake_test.go)
- [pkg/harness/fakeconn_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/fakeconn_test.go)
- [pkg/harness/identity_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/identity_test.go)
- [pkg/harness/manager_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/manager_test.go)
- [pkg/harness/names_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/names_test.go)
- [pkg/harness/reconfigure_race_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/reconfigure_race_test.go)
- [pkg/harness/reconfigure_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/reconfigure_test.go)
- [pkg/harness/sampling_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/sampling_test.go)
- [pkg/harness/selector_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/selector_test.go)
- [pkg/harness/tools_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/tools_test.go)

Run `go test ./...` from a checkout of the `mcp` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
