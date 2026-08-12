---
id: reference/packages/acp/protocol
title: protocol package · protocol
description: Reference for ACP JSON-RPC framing, typed methods, capabilities, sessions, tools, terminals, and faults.
audience: developer
section: reference
order: 193
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-acp
  exported-surface: release-github-com-looprig-acp
  functions-and-methods: release-github-com-looprig-acp
  types: release-github-com-looprig-acp
  constants-and-variables: release-github-com-looprig-acp
  ownership-and-errors: release-github-com-looprig-acp
  source-and-runnable-proof: release-github-com-looprig-acp
---

# protocol package · protocol

Import path: `github.com/looprig/acp/protocol`. The source is pinned to github.com/looprig/acp@v0.2.2.

## Package role {#package-role}

`Conn` reads bounded newline-delimited frames, parses JSON-RPC envelopes, dispatches registered handlers, and serializes writes. `AgentConn` and `ClientConn` provide typed ACP calls over that connection. Generated types and methods encode the pinned schema vocabulary.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewAgentConn(conn *Conn) *AgentConn`
- `func NewClientConn(conn *Conn) *ClientConn`
- `func NewConn(r io.Reader, w io.Writer, opts ConnOptions) *Conn`
- `func ParseError(message string, cause error) *Fault`
- `func InvalidRequest(message string, cause error) *Fault`
- `func MethodNotFound(message string, cause error) *Fault`
- `func InvalidParams(message string, cause error) *Fault`
- `func InternalError(message string, cause error) *Fault`
- `func AuthRequired(message string, cause error) *Fault`
- `func ResourceNotFound(message string, cause error) *Fault`
- `func ToWireError(f *Fault) *Error`
- `func FromWireError(w *Error) *Fault`
- `func NewFrameReader(r io.Reader) *FrameReader`
- `func NewWriter(w io.Writer) *Writer`
- `func NewStringID(s string) ID`
- `func NewNumberID(n int64) ID`
- `func ParseEnvelope(data []byte) (*Envelope, error)`
- `func DefaultAgentCapabilities() AgentCapabilities`
- `func DefaultClientCapabilities() ClientCapabilities`
- `func DefaultFileSystemCapabilities() FileSystemCapabilities`
- `func DefaultMcpCapabilities() McpCapabilities`
- `func DefaultPromptCapabilities() PromptCapabilities`

### Methods {#methods}

- `func (a *AgentConn) Conn() *Conn`
- `func (a *AgentConn) CallExtensionWithResult(ctx context.Context, method string, params, result any) (CallResult, error)`
- `func (a *AgentConn) StartExtensionCall(ctx context.Context, method string, params, result any) (*CallHandle, error)`
- `func (a *AgentConn) Initialize(ctx context.Context, req InitializeRequest) (*InitializeResponse, error)`
- `func (a *AgentConn) Authenticate(ctx context.Context, req AuthenticateRequest) (*AuthenticateResponse, error)`
- `func (a *AgentConn) NewSession(ctx context.Context, req NewSessionRequest) (*NewSessionResponse, error)`
- `func (a *AgentConn) LoadSession(ctx context.Context, req LoadSessionRequest) (*LoadSessionResponse, error)`
- `func (a *AgentConn) ResumeSession(ctx context.Context, req ResumeSessionRequest) (*ResumeSessionResponse, error)`
- `func (a *AgentConn) ListSessions(ctx context.Context, req ListSessionsRequest) (*ListSessionsResponse, error)`
- `func (a *AgentConn) CloseSession(ctx context.Context, req CloseSessionRequest) (*CloseSessionResponse, error)`
- `func (a *AgentConn) DeleteSession(ctx context.Context, req DeleteSessionRequest) (*DeleteSessionResponse, error)`
- `func (a *AgentConn) Prompt(ctx context.Context, req PromptRequest) (*PromptResponse, error)`
- `func (a *AgentConn) PromptWithResult(ctx context.Context, req PromptRequest) (*PromptResponse, CallResult, error)`
- `func (a *AgentConn) Cancel(ctx context.Context, n CancelNotification) error`
- `func (a *AgentConn) SetConfigOption(ctx context.Context, req SetSessionConfigOptionRequest) (*SetSessionConfigOptionResponse, error)`
- `func (a *AgentConn) SetMode(ctx context.Context, req SetSessionModeRequest) (*SetSessionModeResponse, error)`
- `func (c *ClientConn) Conn() *Conn`
- `func (c *ClientConn) RequestPermission(ctx context.Context, req RequestPermissionRequest) (*RequestPermissionResponse, error)`
- `func (c *ClientConn) ReadTextFile(ctx context.Context, req ReadTextFileRequest) (*ReadTextFileResponse, error)`
- `func (c *ClientConn) WriteTextFile(ctx context.Context, req WriteTextFileRequest) (*WriteTextFileResponse, error)`
- `func (c *ClientConn) CreateTerminal(ctx context.Context, req CreateTerminalRequest) (*TerminalHandle, error)`
- `func (c *ClientConn) SessionUpdate(ctx context.Context, n SessionNotification) error`
- `func (t *TerminalHandle) ID() TerminalID`
- `func (t *TerminalHandle) Output(ctx context.Context) (*TerminalOutputResponse, error)`
- `func (t *TerminalHandle) WaitForExit(ctx context.Context) (*WaitForTerminalExitResponse, error)`
- `func (t *TerminalHandle) Kill(ctx context.Context) (*KillTerminalResponse, error)`
- `func (t *TerminalHandle) Release(ctx context.Context) (*ReleaseTerminalResponse, error)`
- `func (e *ConnClosedError) Error() string`
- `func (e *ConnClosedError) Unwrap() error`
- `func (h *CallHandle) Admission() <-chan bool`
- `func (h *CallHandle) Result() <-chan AsyncCallResult`
- `func (h *CallHandle) Cancel()`
- `func (e *ReceiveSequenceOverflowError) Error() string`
- `func (c *Conn) Done() <-chan struct{}`
- `func (c *Conn) DroppedNotifications() uint64`
- `func (c *Conn) WaitForNotifications(ctx context.Context) error`
- `func (c *Conn) WaitForNotificationsThrough(ctx context.Context, receiveSequence uint64) error`
- `func (c *Conn) WaitForReceiveSequence(ctx context.Context, receiveSequence uint64) error`
- `func (c *Conn) Handle(method string, h HandlerFunc)`
- `func (c *Conn) HandleNotify(method string, h NotifyFunc)`
- `func (c *Conn) HandleNotifyWithSequence(method string, h NotifyWithSequenceFunc)`
- `func (c *Conn) HandleUnknownRequest(h HandlerFunc)`
- `func (c *Conn) HandleUnknownNotify(h NotifyFunc)`
- `func (c *Conn) HandleUnknownNotifyWithSequence(h NotifyWithSequenceFunc)`
- `func (c *Conn) Call(ctx context.Context, method string, params, result any) error`
- `func (c *Conn) CallWithResult(ctx context.Context, method string, params, result any) (CallResult, error)`
- `func (c *Conn) StartCall(ctx context.Context, method string, params, result any) (*CallHandle, error)`
- `func (c *Conn) Notify(ctx context.Context, method string, params any) error`
- `func (c *Conn) NotifyWithResult(ctx context.Context, method string, params any) (WriteResult, error)`
- `func (c *Conn) Close() error`
- `func (e *Error) Error() string`
- `func (f *Fault) Error() string`
- `func (f *Fault) Unwrap() error`
- `func (f *Fault) WithData(v any) *Fault`
- `func (e *FrameTooLargeError) Error() string`
- `func (e *TruncatedFrameError) Error() string`
- `func (e *InvalidFrameError) Error() string`
- `func (fr *FrameReader) ReadFrame() ([]byte, error)`
- `func (e *WriterClosedError) Error() string`
- `func (e *WriterClosedError) Unwrap() error`
- `func (wr *Writer) Send(msg any) error`
- `func (wr *Writer) SendContext(ctx context.Context, msg any) error`
- `func (wr *Writer) SendContextResult(ctx context.Context, msg any) (WriteResult, error)`
- `func (wr *Writer) Close() error`
- `func (k Kind) String() string`
- `func (id ID) String() (string, bool)`
- `func (id ID) Number() (int64, bool)`
- `func (id ID) IsZero() bool`
- `func (id ID) MarshalJSON() ([]byte, error)`
- `func (r *Request) MarshalJSON() ([]byte, error)`
- `func (r *Response) MarshalJSON() ([]byte, error)`
- `func (n *Notification) MarshalJSON() ([]byte, error)`
- `func (e *Envelope) Kind() Kind`
- `func (e *ValidationError) Error() string`
- `func (e *ValidationError) AsFault() *Fault`
- `func (v ContentBlock) MarshalJSON() ([]byte, error)`
- `func (v *ContentBlock) UnmarshalJSON(data []byte) error`
- `func (v EmbeddedResourceResource) MarshalJSON() ([]byte, error)`
- `func (v *EmbeddedResourceResource) UnmarshalJSON(data []byte) error`
- `func (v McpServer) MarshalJSON() ([]byte, error)`
- `func (v *McpServer) UnmarshalJSON(data []byte) error`
- `func (v *PermissionOptionKind) UnmarshalJSON(data []byte) error`
- `func (v *PlanEntryPriority) UnmarshalJSON(data []byte) error`
- `func (v *PlanEntryStatus) UnmarshalJSON(data []byte) error`
- `func (v RequestPermissionOutcome) MarshalJSON() ([]byte, error)`
- `func (v *RequestPermissionOutcome) UnmarshalJSON(data []byte) error`
- `func (v *Role) UnmarshalJSON(data []byte) error`
- `func (v SessionConfigOption) MarshalJSON() ([]byte, error)`
- `func (v *SessionConfigOption) UnmarshalJSON(data []byte) error`
- `func (v SessionConfigSelectOptions) MarshalJSON() ([]byte, error)`
- `func (v *SessionConfigSelectOptions) UnmarshalJSON(data []byte) error`
- `func (v SessionUpdate) MarshalJSON() ([]byte, error)`
- `func (v *SessionUpdate) UnmarshalJSON(data []byte) error`
- `func (v SetSessionConfigOptionRequest) MarshalJSON() ([]byte, error)`
- `func (v *SetSessionConfigOptionRequest) UnmarshalJSON(data []byte) error`
- `func (v *StopReason) UnmarshalJSON(data []byte) error`
- `func (v ToolCallContent) MarshalJSON() ([]byte, error)`
- `func (v *ToolCallContent) UnmarshalJSON(data []byte) error`
- `func (v *ToolCallStatus) UnmarshalJSON(data []byte) error`
- `func (v *ToolKind) UnmarshalJSON(data []byte) error`

### Types {#types}

`AgentConn`, `ClientConn`, `TerminalHandle`, `HandlerFunc`, `NotifyFunc`, `NotifyWithSequenceFunc`, `ConnOptions`, `ConnClosedError`, `CallResult`, `AsyncCallResult`, `CallHandle`, `ReceiveSequenceOverflowError`, `Conn`, `Error`, `Fault`, `FrameTooLargeError`, `TruncatedFrameError`, `InvalidFrameError`, `FrameReader`, `WriterClosedError`, `WriteResult`, `SendResult`, `Writer`, `Kind`, `ID`, `Request`, `Response`, `Notification`, `Envelope`, `IssueKind`, `Issue`, `ValidationError`, `Method`, `AgentAuthCapabilities`, `AgentCapabilities`, `Annotations`, `AudioContent`, `AuthMethod`, `AuthMethodAgent`, `AuthMethodID`, `AuthenticateRequest`, `AuthenticateResponse`, `AvailableCommand`, `AvailableCommandInput`, `AvailableCommandsUpdate`, `BlobResourceContents`, `BooleanConfigOptionCapabilities`, `CancelNotification`, `ClientCapabilities`, `ClientSessionCapabilities`, `CloseSessionRequest`, `CloseSessionResponse`, `ConfigOptionUpdate`, `Content`, `ContentBlock`, `ContentChunk`, `Cost`, `CreateTerminalRequest`, `CreateTerminalResponse`, `CurrentModeUpdate`, `DeleteSessionRequest`, `DeleteSessionResponse`, `Diff`, `EmbeddedResource`, `EmbeddedResourceResource`, `EnvVariable`, `ErrorCode`, `FileSystemCapabilities`, `HTTPHeader`, `ImageContent`, `Implementation`, `InitializeRequest`, `InitializeResponse`, `KillTerminalRequest`, `KillTerminalResponse`, `ListSessionsRequest`, `ListSessionsResponse`, `LoadSessionRequest`, `LoadSessionResponse`, `LogoutCapabilities`, `LogoutRequest`, `LogoutResponse`, `McpCapabilities`, `McpServer`, `McpServerHTTP`, `McpServerSse`, `McpServerStdio`, `MessageID`, `NewSessionRequest`, `NewSessionResponse`, `PermissionOption`, `PermissionOptionID`, `PermissionOptionKind`, `Plan`, `PlanEntry`, `PlanEntryPriority`, `PlanEntryStatus`, `PromptCapabilities`, `PromptRequest`, `PromptResponse`, `ProtocolVersion`, `ReadTextFileRequest`, `ReadTextFileResponse`, `ReleaseTerminalRequest`, `ReleaseTerminalResponse`, `RequestPermissionOutcome`, `RequestPermissionRequest`, `RequestPermissionResponse`, `ResourceLink`, `ResumeSessionRequest`, `ResumeSessionResponse`, `Role`, `SelectedPermissionOutcome`, `SessionAdditionalDirectoriesCapabilities`, `SessionCapabilities`, `SessionCloseCapabilities`, `SessionConfigBoolean`, `SessionConfigGroupID`, `SessionConfigID`, `SessionConfigOption`, `SessionConfigOptionCategory`, `SessionConfigOptionsCapabilities`, `SessionConfigSelect`, `SessionConfigSelectGroup`, `SessionConfigSelectOption`, `SessionConfigSelectOptions`, `SessionConfigValueID`, `SessionDeleteCapabilities`, `SessionID`, `SessionInfo`, `SessionInfoUpdate`, `SessionListCapabilities`, `SessionMode`, `SessionModeID`, `SessionModeState`, `SessionNotification`, `SessionResumeCapabilities`, `SessionUpdate`, `SetSessionConfigOptionRequest`, `SetSessionConfigOptionResponse`, `SetSessionModeRequest`, `SetSessionModeResponse`, `StopReason`, `Terminal`, `TerminalExitStatus`, `TerminalID`, `TerminalOutputRequest`, `TerminalOutputResponse`, `TextContent`, `TextResourceContents`, `ToolCall`, `ToolCallContent`, `ToolCallID`, `ToolCallLocation`, `ToolCallStatus`, `ToolCallUpdate`, `ToolKind`, `UnstructuredCommandInput`, `UsageUpdate`, `WaitForTerminalExitRequest`, `WaitForTerminalExitResponse`, `WriteTextFileRequest`, `WriteTextFileResponse`

### Constants {#constants}

`MaxInFlightHandlers`, `NotifyBufferDepth`, `SendQueueDepth`, `MaxMessageBytes`, `MaxNestingDepth`, `KindRequest`, `KindResponse`, `KindNotification`, `IssueOversizedPayload`, `IssueExcessiveNesting`, `IssueMalformedJSON`, `IssueNotAnObject`, `IssueTrailingData`, `IssueDuplicateField`, `IssueUnknownField`, `IssueWrongVersion`, `IssueInvalidIDType`, `IssueMissingID`, `IssueInvalidMethodType`, `IssueMalformedErrorObj`, `IssueBothResultAndError`, `IssueAmbiguousShape`, `MethodAuthenticate`, `MethodInitialize`, `MethodLogout`, `MethodSessionCancel`, `MethodSessionClose`, `MethodSessionDelete`, `MethodSessionList`, `MethodSessionLoad`, `MethodSessionNew`, `MethodSessionPrompt`, `MethodSessionResume`, `MethodSessionSetConfigOption`, `MethodSessionSetMode`, `MethodFsReadTextFile`, `MethodFsWriteTextFile`, `MethodSessionRequestPermission`, `MethodSessionUpdate`, `MethodTerminalCreate`, `MethodTerminalKill`, `MethodTerminalOutput`, `MethodTerminalRelease`, `MethodTerminalWaitForExit`, `MethodCancelRequest`, `CurrentProtocolVersion`, `ErrorCodeParseError`, `ErrorCodeInvalidRequest`, `ErrorCodeMethodNotFound`, `ErrorCodeInvalidParams`, `ErrorCodeInternalError`, `ErrorCodeRequestCancelled`, `ErrorCodeAuthenticationRequired`, `ErrorCodeResourceNotFound`, `PermissionOptionKindAllowOnce`, `PermissionOptionKindAllowAlways`, `PermissionOptionKindRejectOnce`, `PermissionOptionKindRejectAlways`, `PlanEntryPriorityHigh`, `PlanEntryPriorityMedium`, `PlanEntryPriorityLow`, `PlanEntryStatusPending`, `PlanEntryStatusInProgress`, `PlanEntryStatusCompleted`, `RoleAssistant`, `RoleUser`, `SessionConfigOptionCategoryMode`, `SessionConfigOptionCategoryModel`, `SessionConfigOptionCategoryModelConfig`, `SessionConfigOptionCategoryThoughtLevel`, `StopReasonEndTurn`, `StopReasonMaxTokens`, `StopReasonMaxTurnRequests`, `StopReasonRefusal`, `StopReasonCancelled`, `ToolCallStatusPending`, `ToolCallStatusInProgress`, `ToolCallStatusCompleted`, `ToolCallStatusFailed`, `ToolKindRead`, `ToolKindEdit`, `ToolKindDelete`, `ToolKindMove`, `ToolKindSearch`, `ToolKindExecute`, `ToolKindThink`, `ToolKindFetch`, `ToolKindSwitchMode`, `ToolKindOther`

### Variables {#variables}

`AgentMethods`, `ClientMethods`, `ProtocolMethods`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ConnClosedError`, `ReceiveSequenceOverflowError`, `Error`, `Fault`, `FrameTooLargeError`, `TruncatedFrameError`, `InvalidFrameError`, `WriterClosedError`, `ValidationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [protocol/acp.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/acp.go)
- [protocol/conn.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/conn.go)
- [protocol/doc.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/doc.go)
- [protocol/errors.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/errors.go)
- [protocol/framing.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/framing.go)
- [protocol/jsonrpc.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/jsonrpc.go)
- [protocol/methods_gen.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/methods_gen.go)
- [protocol/types_gen.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/types_gen.go)

Adjacent tests at the same commit:

- [protocol/acp_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/acp_test.go)
- [protocol/conn_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/conn_internal_test.go)
- [protocol/conn_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/conn_test.go)
- [protocol/errors_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/errors_test.go)
- [protocol/framing_internal_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/framing_internal_test.go)
- [protocol/framing_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/framing_test.go)
- [protocol/fuzz_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/fuzz_test.go)
- [protocol/gen_stale_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/gen_stale_test.go)
- [protocol/jsonrpc_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/jsonrpc_test.go)

Run `GOWORK=off go test ./...` from the `acp` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
