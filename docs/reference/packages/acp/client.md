---
id: reference/packages/acp/client
title: client package · client
description: Reference for driving ACP child sessions and handling their callbacks.
audience: developer
section: reference
order: 191
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-acp
  exported-surface: release-github-com-looprig-acp
  functions: release-github-com-looprig-acp
  methods: release-github-com-looprig-acp
  types: release-github-com-looprig-acp
  constants: release-github-com-looprig-acp
  variables: release-github-com-looprig-acp
  ownership-and-errors: release-github-com-looprig-acp
  source-and-runnable-proof: release-github-com-looprig-acp
---

# client package · client

Import path: `github.com/looprig/acp/client`. The source is pinned to github.com/looprig/acp@v0.2.2.

## Package role {#package-role}

`New` creates a lazy client; `Dial` starts the supplied stdio command and shares one start attempt among concurrent callers. The client handles child-to-host session updates, permission requests, filesystem, and terminal operations when handlers are configured.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(cmd stdio.Command, opts Options) *Client`
- `func Dial(ctx context.Context, cmd stdio.Command, opts Options) (*Client, error)`
- `func DecodeUpdateMeta(raw json.RawMessage) UpdateMeta`

### Methods {#methods}

- `func (c *Client) Dial(ctx context.Context) error`
- `func (c *Client) Done() <-chan struct{}`
- `func (c *Client) Close(ctx context.Context) error`
- `func (c *Client) DroppedUpdates() uint64`
- `func (c *Client) ProveSetModelCapability(key string) (proof SetModelCapability, ok bool)`
- `func (e *ClosedError) Error() string`
- `func (e *ClosedError) Unwrap() error`
- `func (e *NotDialedError) Error() string`
- `func (e *DuplicateSessionError) Error() string`
- `func (e *LoadTimeoutError) Error() string`
- `func (e *SetModelUnsupportedError) Error() string`
- `func (c *Client) InitializeMetadata() (InitializeMetadata, error)`
- `func (s *Session) Prompt(ctx context.Context, blocks []protocol.ContentBlock) (*PromptResult, error)`
- `func (s *Session) Cancel(ctx context.Context) error`
- `func (s *Session) ID() protocol.SessionID`
- `func (s *Session) ConfigOptions() []protocol.SessionConfigOption`
- `func (s *Session) Modes() *protocol.SessionModeState`
- `func (s *Session) Updates() <-chan Update`
- `func (s *Session) DroppedUpdates() uint64`
- `func (s *Session) WaitForUpdates(ctx context.Context) error`
- `func (s *Session) WaitForUpdatesThrough(ctx context.Context, sequence uint64) error`
- `func (c *Client) NewSession(ctx context.Context, p NewSessionParams) (*Session, error)`
- `func (c *Client) LoadSession(ctx context.Context, p LoadSessionParams) (*Session, error)`
- `func (c *Client) ResumeSession(ctx context.Context, p ResumeSessionParams) (*Session, error)`
- `func (s *Session) SetConfigOption(ctx context.Context, configID protocol.SessionConfigID, valueID protocol.SessionConfigValueID) error`
- `func (s *Session) SetMode(ctx context.Context, modeID protocol.SessionModeID) error`
- `func (s *Session) SetModel(ctx context.Context, proof SetModelCapability, modelID string) error`
- `func (h *SteerHandle) Admission() <-chan bool`
- `func (h *SteerHandle) Result() <-chan SteerCompletion`
- `func (h *SteerHandle) Cancel()`
- `func (e *SteeringError) Error() string`
- `func (e *SteeringError) Unwrap() error`
- `func (s *Session) StartSteer(ctx context.Context, p SteerParams) *SteerHandle`
- `func (s *Session) Steer(ctx context.Context, p SteerParams) (SteerResult, error)`

### Types {#types}

```go
type Client struct {
	// contains filtered or unexported fields
}
```

```go
type SetModelCapability struct {
	// contains filtered or unexported fields
}
```

```go
type ClosedError struct {
	Cause error
}
```

```go
type NotDialedError struct{}
```

```go
type DuplicateSessionError struct {
	SessionID protocol.SessionID
}
```

```go
type LoadTimeoutError struct {
	SessionID protocol.SessionID
	Timeout   time.Duration
}
```

```go
type SetModelUnsupportedError struct{}
```

```go
type InitializeMetadata struct {
	AgentInfo *protocol.Implementation
	Meta      json.RawMessage
}
```

```go
type FSHandler interface {
	ReadTextFile(ctx context.Context, req protocol.ReadTextFileRequest) (protocol.ReadTextFileResponse, error)
	WriteTextFile(ctx context.Context, req protocol.WriteTextFileRequest) (protocol.WriteTextFileResponse, error)
}
```

```go
type TerminalHandler interface {
	CreateTerminal(ctx context.Context, req protocol.CreateTerminalRequest) (protocol.CreateTerminalResponse, error)
	TerminalOutput(ctx context.Context, req protocol.TerminalOutputRequest) (protocol.TerminalOutputResponse, error)
	WaitForTerminalExit(ctx context.Context, req protocol.WaitForTerminalExitRequest) (protocol.WaitForTerminalExitResponse, error)
	KillTerminal(ctx context.Context, req protocol.KillTerminalRequest) (protocol.KillTerminalResponse, error)
	ReleaseTerminal(ctx context.Context, req protocol.ReleaseTerminalRequest) (protocol.ReleaseTerminalResponse, error)
}
```

```go
type PermissionHandler interface {
	RequestPermission(ctx context.Context, req protocol.RequestPermissionRequest) (protocol.RequestPermissionResponse, error)
}
```

```go
type Options struct {
	FS FSHandler

	Terminal TerminalHandler

	Permissions PermissionHandler

	ClientInfo *protocol.Implementation

	LoadTimeout time.Duration
}
```

```go
type PromptResult struct {
	StopReason protocol.StopReason

	ReceiveSequence uint64

	ResponseSequence uint64

	WriteAdmitted bool
}
```

```go
type NewSessionParams struct {
	Cwd string

	AdditionalDirectories []string

	McpServers []protocol.McpServer
}
```

```go
type LoadSessionParams struct {
	SessionID             protocol.SessionID
	Cwd                   string
	AdditionalDirectories []string
	McpServers            []protocol.McpServer
}
```

```go
type ResumeSessionParams struct {
	SessionID             protocol.SessionID
	Cwd                   string
	AdditionalDirectories []string
	McpServers            []protocol.McpServer
}
```

```go
type Session struct {
	// contains filtered or unexported fields
}
```

```go
type SteerParams struct {
	SessionID protocol.SessionID      `json:"sessionId"`
	Prompt    []protocol.ContentBlock `json:"prompt"`
	Meta      json.RawMessage         `json:"_meta,omitempty"`
}
```

```go
type SteerOutcome string
```

```go
type SteerResult struct {
	Outcome SteerOutcome
	Reason  string

	WriteAdmitted    bool
	ReceiveSequence  uint64
	ResponseSequence uint64
}
```

```go
type SteerCompletion struct {
	Result SteerResult
	Err    error
}
```

```go
type SteerHandle struct {
	// contains filtered or unexported fields
}
```

```go
type SteeringError struct {
	Code             protocol.ErrorCode
	Message          string
	WriteAdmitted    bool
	ReceiveSequence  uint64
	ResponseSequence uint64
	// contains filtered or unexported fields
}
```

```go
type UpdateMeta struct {
	EventID  string
	PromptID string
	IsReplay bool
}
```

```go
type Update struct {
	SessionUpdate protocol.SessionUpdate

	Meta UpdateMeta

	ReceiveSequence uint64
}
```

### Constants {#constants}

`LoadTimeout`, `UpdateQueueDepth`, `EventDedupWindowDepth`, `SteerOutcomeInjected`, `SteerOutcomePromptRequired`, `SteerOutcomeStartedNewTurn`, `SteerOutcomeFailed`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ClosedError`, `DuplicateSessionError`, `LoadTimeoutError`, `NotDialedError`, `SetModelUnsupportedError`, `SteeringError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [client/client.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/client.go)
- [client/dispatch.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/dispatch.go)
- [client/errors.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/errors.go)
- [client/initialize.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/initialize.go)
- [client/options.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/options.go)
- [client/prompt.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/prompt.go)
- [client/session.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/session.go)
- [client/steering.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/steering.go)
- [client/updates.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/updates.go)

Adjacent tests at the same commit:

- [client/capabilities_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/capabilities_internal_test.go)
- [client/client_integration_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/client_integration_test.go)
- [client/config_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/config_internal_test.go)
- [client/death_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/death_internal_test.go)
- [client/dial_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/dial_internal_test.go)
- [client/dispatch_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/dispatch_internal_test.go)
- [client/fakeagent_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/fakeagent_internal_test.go)
- [client/interop_integration_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/interop_integration_test.go)
- [client/leak_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/leak_internal_test.go)
- [client/prompt_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/prompt_internal_test.go)
- [client/session_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/session_internal_test.go)
- [client/steering_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/steering_internal_test.go)
- [client/updates_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/updates_internal_test.go)

Run `GOWORK=off go test ./...` from the `acp` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
