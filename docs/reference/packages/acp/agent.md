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

`New` validates `Options` and registers only the handlers and capabilities the host supplies. It does not construct a Harness session or persist history itself.

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
- `func (t *gateTracker) CancelSession(sessionID SessionID)`
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
- `func (t *liveTranslator) Translate(ev event.Event) (protocol.SessionNotification, bool)`

### Types {#types}

`Options`, `Agent`, `UnofferedPermissionOptionError`, `SessionID`, `SessionHost`, `LiveSession`, `LoadedSession`, `SessionCloser`, `EventReplayer`, `SessionCatalogEntry`, `SessionCatalog`, `RuntimeConfigValue`, `RuntimeConfigOption`, `RuntimeConfigCatalog`, `RuntimeConfigChange`, `RuntimeConfigController`, `Compactor`, `SessionDeleter`, `Authenticator`, `LogoutHandler`, `CursorErrorReason`, `InvalidCursorError`, `SessionMetaObservationError`, `UnsupportedContentBlockError`, `TooManyLiveSessionsError`, `SessionIDReason`, `SessionIDError`, `Setup`, `CwdErrorReason`, `CwdError`, `MCPNotAcceptedError`

### Constants {#constants}

`ModeConfigOptionID`, `MaxPageSize`, `CursorReasonMalformed`, `CursorReasonTampered`, `CursorReasonInvalidPayload`, `MaxLiveSessions`, `SessionIDReasonEmpty`, `SessionIDReasonMalformed`, `SessionIDReasonWrongVariant`, `CwdReasonEmpty`, `CwdReasonNotAbsolute`, `CwdReasonTraversal`, `CwdReasonNotCanonical`

### Variables {#variables}

`ErrMissingHost`, `ErrAuthenticatorWithoutMethods`, `ErrCompactSubscriptionClosed`, `ErrCompactorNotImplemented`, `ErrUnknownConfigOption`, `ErrSessionStillLive`, `ErrAgentNotRegistered`, `ErrPromptAlreadyInFlight`, `ErrSubscriptionClosed`, `ErrSessionClosing`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `UnofferedPermissionOptionError`, `InvalidCursorError`, `SessionMetaObservationError`, `UnsupportedContentBlockError`, `TooManyLiveSessionsError`, `SessionIDError`, `CwdError`, `MCPNotAcceptedError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

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

Run `GOWORK=off go test ./...` from the `acp` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
