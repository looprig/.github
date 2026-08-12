---
id: reference/packages/acp/agent
title: agent package · agent
description: Reference for the ACP host facade that exposes Harness-backed sessions.
audience: developer
section: reference
order: 190
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

# agent package · agent

Import path: `github.com/looprig/acp/agent`. The source is pinned to github.com/looprig/acp@v0.2.2.

## Package role {#package-role}

agent.go defines the Agent facade: the struct that binds Options to real ACP wire methods over a *protocol.Conn (see conn.go's Handle/HandleNotify).

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(opts Options) (*Agent, error)`
- `func ParseSessionID(id protocol.SessionID) (SessionID, error)`
- `func NewSetup(cwd string, capabilities *protocol.ClientCapabilities, mcpServers []protocol.McpServer, acceptMCP bool) (Setup, error)`

### Methods {#methods}

- `func (a *Agent) Register(conn *protocol.Conn)`
- `func (a *Agent) AuthorizeSessionCreation() error`
- `func (e *UnofferedPermissionOptionError) Error() string`
- `func (e *InvalidCursorError) Error() string`
- `func (e *InvalidCursorError) Unwrap() error`
- `func (e *SessionMetaObservationError) Error() string`
- `func (a *Agent) ObserveSessionMeta(ctx context.Context, meta sessionstore.SessionMeta) error`
- `func (e *UnsupportedContentBlockError) Error() string`
- `func (e *TooManyLiveSessionsError) Error() string`
- `func (e *SessionIDError) Error() string`
- `func (e *SessionIDError) Unwrap() error`
- `func (e *CwdError) Error() string`
- `func (e *MCPNotAcceptedError) Error() string`

### Types {#types}

```go
type Options struct {
	Host SessionHost

	Replayer EventReplayer

	Catalog SessionCatalog

	ConfigCatalog RuntimeConfigCatalog

	ConfigController RuntimeConfigController

	Compactor Compactor

	Deleter SessionDeleter

	Authenticator Authenticator

	AuthMethods []protocol.AuthMethod

	Logout LogoutHandler
}
```

```go
type Agent struct {
	// contains filtered or unexported fields
}
```

```go
type UnofferedPermissionOptionError struct {
	GateID   gate.ID
	OptionID protocol.PermissionOptionID
}
```

```go
type SessionID = uuid.UUID
```

```go
type SessionHost interface {
	NewSession(context.Context, Setup) (LiveSession, error)
	LoadSession(context.Context, SessionID, Setup) (LoadedSession, error)
	ResumeSession(context.Context, SessionID, Setup) (LiveSession, error)
}
```

```go
type LiveSession interface {
	SessionID() uuid.UUID
	Submit(context.Context, []content.Block) (uuid.UUID, error)
	SubscribeEvents(event.EventFilter) (event.Subscription, error)
	RespondGate(context.Context, gate.GateResponse) error
	Interrupt(context.Context) (bool, error)
}
```

```go
type LoadedSession struct {
	Live LiveSession

	ReplayedThrough event.TurnIndex
}
```

```go
type SessionCloser interface {
	Shutdown(context.Context) error
}
```

```go
type EventReplayer interface {
	OpenEventReplayer(SessionID) (journal.EventReplayer, error)
}
```

```go
type SessionCatalogEntry struct {
	Meta sessionstore.SessionMeta

	Cwd string
}
```

```go
type SessionCatalog interface {
	ListSessions(context.Context) ([]SessionCatalogEntry, error)
}
```

```go
type RuntimeConfigValue struct {
	ID          protocol.SessionConfigValueID
	Name        string
	Description string
}
```

```go
type RuntimeConfigOption struct {
	ID           protocol.SessionConfigID
	Category     protocol.SessionConfigOptionCategory
	Name         string
	Description  string
	Values       []RuntimeConfigValue
	CurrentValue protocol.SessionConfigValueID
}
```

```go
type RuntimeConfigCatalog interface {
	RuntimeConfigOptions(context.Context, SessionID) ([]RuntimeConfigOption, error)
}
```

```go
type RuntimeConfigChange struct {
	OptionID protocol.SessionConfigID
	ValueID  protocol.SessionConfigValueID
}
```

```go
type RuntimeConfigController interface {
	SetRuntimeConfigOption(context.Context, SessionID, RuntimeConfigChange) ([]RuntimeConfigOption, error)
}
```

```go
type Compactor interface {
	Compact(context.Context) (uuid.UUID, error)
}
```

```go
type SessionDeleter interface {
	DeleteSession(context.Context, SessionID) error
}
```

```go
type Authenticator interface {
	Authenticate(context.Context, protocol.AuthMethodID) error
}
```

```go
type LogoutHandler interface {
	Logout(context.Context) error
}
```

```go
type CursorErrorReason string
```

```go
type InvalidCursorError struct {
	Reason CursorErrorReason
	// contains filtered or unexported fields
}
```

```go
type SessionMetaObservationError struct {
	Reason string
}
```

```go
type UnsupportedContentBlockError struct {
	Index int
}
```

```go
type TooManyLiveSessionsError struct {
	Max int
}
```

```go
type SessionIDReason string
```

```go
type SessionIDError struct {
	Input  string
	Reason SessionIDReason
	// contains filtered or unexported fields
}
```

```go
type Setup struct {
	Cwd string

	ClientCapabilities protocol.ClientCapabilities

	MCPServers []protocol.McpServer
}
```

```go
type CwdErrorReason string
```

```go
type CwdError struct {
	Cwd    string
	Reason CwdErrorReason
}
```

```go
type MCPNotAcceptedError struct {
	Count int
}
```

### Constants {#constants}

`ModeConfigOptionID`, `MaxPageSize`, `CursorReasonMalformed`, `CursorReasonTampered`, `CursorReasonInvalidPayload`, `MaxLiveSessions`, `SessionIDReasonEmpty`, `SessionIDReasonMalformed`, `SessionIDReasonWrongVariant`, `CwdReasonEmpty`, `CwdReasonNotAbsolute`, `CwdReasonTraversal`, `CwdReasonNotCanonical`

### Variables {#variables}

`ErrMissingHost`, `ErrAuthenticatorWithoutMethods`, `ErrCompactSubscriptionClosed`, `ErrCompactorNotImplemented`, `ErrUnknownConfigOption`, `ErrSessionStillLive`, `ErrAgentNotRegistered`, `ErrPromptAlreadyInFlight`, `ErrSubscriptionClosed`, `ErrSessionClosing`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `CwdError`, `InvalidCursorError`, `MCPNotAcceptedError`, `SessionIDError`, `SessionMetaObservationError`, `TooManyLiveSessionsError`, `UnofferedPermissionOptionError`, `UnsupportedContentBlockError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [agent/agent.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/agent.go)
- [agent/capabilities.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/capabilities.go)
- [agent/close.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/close.go)
- [agent/compact.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/compact.go)
- [agent/config.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/config.go)
- [agent/delete.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/delete.go)
- [agent/gates.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/gates.go)
- [agent/host.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/host.go)
- [agent/list.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/list.go)
- [agent/prompt.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/prompt.go)
- [agent/registry.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/registry.go)
- [agent/replay.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/replay.go)
- [agent/resume.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/resume.go)
- [agent/session.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/session.go)
- [agent/setup.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/setup.go)
- [agent/translate.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/translate.go)

Adjacent tests at the same commit:

- [agent/capabilities_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/capabilities_test.go)
- [agent/close_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/close_test.go)
- [agent/compact_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/compact_internal_test.go)
- [agent/compact_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/compact_test.go)
- [agent/config_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/config_test.go)
- [agent/delete_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/delete_test.go)
- [agent/e2e_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/e2e_test.go)
- [agent/gates_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/gates_internal_test.go)
- [agent/gates_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/gates_test.go)
- [agent/list_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/list_internal_test.go)
- [agent/list_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/list_test.go)
- [agent/meta_roundtrip_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/meta_roundtrip_test.go)
- [agent/prompt_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/prompt_internal_test.go)
- [agent/prompt_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/prompt_test.go)
- [agent/registry_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/registry_test.go)
- [agent/replay_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/replay_test.go)
- [agent/resolve_session_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/resolve_session_test.go)
- [agent/resume_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/resume_test.go)
- [agent/session_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/session_test.go)
- [agent/setup_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/setup_test.go)
- [agent/translate_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/translate_test.go)

Run `go test ./...` from a checkout of the `acp` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
