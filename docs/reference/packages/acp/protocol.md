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
  functions: release-github-com-looprig-acp
  methods: release-github-com-looprig-acp
  types: release-github-com-looprig-acp
  constants: release-github-com-looprig-acp
  variables: release-github-com-looprig-acp
  ownership-and-errors: release-github-com-looprig-acp
  source-and-runnable-proof: release-github-com-looprig-acp
---

# protocol package · protocol

Import path: `github.com/looprig/acp/protocol`. The source is pinned to github.com/looprig/acp@v0.2.2.

## Package role {#package-role}

acp.go is the typed protocol surface over Conn: it binds the generated method-name constants in methods_gen.go to the generated request/response types in types_gen.go, one Go method per ACP RPC.

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

```go
type AgentConn struct {
	// contains filtered or unexported fields
}
```

```go
type ClientConn struct {
	// contains filtered or unexported fields
}
```

```go
type TerminalHandle struct {
	// contains filtered or unexported fields
}
```

```go
type HandlerFunc func(ctx context.Context, method string, params json.RawMessage) (any, error)
```

```go
type NotifyFunc func(ctx context.Context, method string, params json.RawMessage)
```

```go
type NotifyWithSequenceFunc func(ctx context.Context, method string, params json.RawMessage, receiveSequence uint64)
```

```go
type ConnOptions struct {
	ExtIDBase int64
}
```

```go
type ConnClosedError struct {
	// contains filtered or unexported fields
}
```

```go
type CallResult struct {
	WriteAdmitted    bool
	ResponseSequence uint64
	ReceiveSequence  uint64
}
```

```go
type AsyncCallResult struct {
	Facts CallResult
	Err   error
}
```

```go
type CallHandle struct {
	// contains filtered or unexported fields
}
```

```go
type ReceiveSequenceOverflowError struct{}
```

```go
type Conn struct {
	// contains filtered or unexported fields
}
```

```go
type Error struct {
	Code ErrorCode `json:"code"`

	Message string `json:"message"`

	Data json.RawMessage `json:"data,omitempty"`
}
```

```go
type Fault struct {
	Code    ErrorCode
	Message string
	Data    json.RawMessage
	// contains filtered or unexported fields
}
```

```go
type FrameTooLargeError struct {
	Limit int
}
```

```go
type TruncatedFrameError struct {
	Read int
}
```

```go
type InvalidFrameError struct {
	Reason string
}
```

```go
type FrameReader struct {
	// contains filtered or unexported fields
}
```

```go
type WriterClosedError struct {
	// contains filtered or unexported fields
}
```

```go
type WriteResult struct {
	WriteAdmitted bool
}
```

```go
type SendResult = WriteResult
```

```go
type Writer struct {
	// contains filtered or unexported fields
}
```

```go
type Kind uint8
```

```go
type ID struct {
	// contains filtered or unexported fields
}
```

```go
type Request struct {
	ID     ID
	Method string
	Params json.RawMessage
}
```

```go
type Response struct {
	ID     ID
	Result json.RawMessage
	Error  *Error

	ReceiveSequence uint64
}
```

```go
type Notification struct {
	Method string
	Params json.RawMessage

	ReceiveSequence uint64
}
```

```go
type Envelope struct {
	Request      *Request
	Response     *Response
	Notification *Notification
}
```

```go
type IssueKind string
```

```go
type Issue struct {
	Kind IssueKind
}
```

```go
type ValidationError struct {
	Issues []Issue
}
```

```go
type Method string
```

```go
type AgentAuthCapabilities struct {
	Logout *LogoutCapabilities `json:"logout,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type AgentCapabilities struct {
	Auth *AgentAuthCapabilities `json:"auth,omitempty"`

	LoadSession bool `json:"loadSession,omitempty"`

	McpCapabilities *McpCapabilities `json:"mcpCapabilities,omitempty"`

	PromptCapabilities *PromptCapabilities `json:"promptCapabilities,omitempty"`

	SessionCapabilities *SessionCapabilities `json:"sessionCapabilities,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type Annotations struct {
	Audience []Role `json:"audience,omitempty"`

	LastModified *string `json:"lastModified,omitempty"`

	Priority *float64 `json:"priority,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type AudioContent struct {
	Annotations *Annotations `json:"annotations,omitempty"`

	Data string `json:"data"`

	MimeType string `json:"mimeType"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type AuthMethod = AuthMethodAgent
```

```go
type AuthMethodAgent struct {
	Description *string `json:"description,omitempty"`

	ID AuthMethodID `json:"id"`

	Name string `json:"name"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type AuthMethodID string
```

```go
type AuthenticateRequest struct {
	MethodID AuthMethodID `json:"methodId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type AuthenticateResponse struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type AvailableCommand struct {
	Description string `json:"description"`

	Input *AvailableCommandInput `json:"input,omitempty"`

	Name string `json:"name"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type AvailableCommandInput = UnstructuredCommandInput
```

```go
type AvailableCommandsUpdate struct {
	AvailableCommands []AvailableCommand `json:"availableCommands"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type BlobResourceContents struct {
	Blob string `json:"blob"`

	MimeType *string `json:"mimeType,omitempty"`

	URI string `json:"uri"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type BooleanConfigOptionCapabilities struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type CancelNotification struct {
	SessionID SessionID `json:"sessionId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ClientCapabilities struct {
	Fs *FileSystemCapabilities `json:"fs,omitempty"`

	Session *ClientSessionCapabilities `json:"session,omitempty"`

	Terminal bool `json:"terminal,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ClientSessionCapabilities struct {
	ConfigOptions *SessionConfigOptionsCapabilities `json:"configOptions,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type CloseSessionRequest struct {
	SessionID SessionID `json:"sessionId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type CloseSessionResponse struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ConfigOptionUpdate struct {
	ConfigOptions []SessionConfigOption `json:"configOptions"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type Content struct {
	Content ContentBlock `json:"content"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ContentBlock struct {
	Text *TextContent `json:"-"`

	Image *ImageContent `json:"-"`

	Audio *AudioContent `json:"-"`

	ResourceLink *ResourceLink `json:"-"`

	Resource *EmbeddedResource `json:"-"`
}
```

```go
type ContentChunk struct {
	Content ContentBlock `json:"content"`

	MessageID *MessageID `json:"messageId,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type Cost struct {
	Amount float64 `json:"amount"`

	Currency string `json:"currency"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type CreateTerminalRequest struct {
	Args []string `json:"args,omitempty"`

	Command string `json:"command"`

	Cwd *string `json:"cwd,omitempty"`

	Env []EnvVariable `json:"env,omitempty"`

	OutputByteLimit *uint64 `json:"outputByteLimit,omitempty"`

	SessionID SessionID `json:"sessionId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type CreateTerminalResponse struct {
	TerminalID TerminalID `json:"terminalId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type CurrentModeUpdate struct {
	CurrentModeID SessionModeID `json:"currentModeId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type DeleteSessionRequest struct {
	SessionID SessionID `json:"sessionId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type DeleteSessionResponse struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type Diff struct {
	NewText string `json:"newText"`

	OldText *string `json:"oldText,omitempty"`

	Path string `json:"path"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type EmbeddedResource struct {
	Annotations *Annotations `json:"annotations,omitempty"`

	Resource EmbeddedResourceResource `json:"resource"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type EmbeddedResourceResource struct {
	TextResourceContents *TextResourceContents `json:"-"`

	BlobResourceContents *BlobResourceContents `json:"-"`
}
```

```go
type EnvVariable struct {
	Name string `json:"name"`

	Value string `json:"value"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ErrorCode int32
```

```go
type FileSystemCapabilities struct {
	ReadTextFile bool `json:"readTextFile,omitempty"`

	WriteTextFile bool `json:"writeTextFile,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type HTTPHeader struct {
	Name string `json:"name"`

	Value string `json:"value"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ImageContent struct {
	Annotations *Annotations `json:"annotations,omitempty"`

	Data string `json:"data"`

	MimeType string `json:"mimeType"`

	URI *string `json:"uri,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type Implementation struct {
	Name string `json:"name"`

	Title *string `json:"title,omitempty"`

	Version string `json:"version"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type InitializeRequest struct {
	ClientCapabilities *ClientCapabilities `json:"clientCapabilities,omitempty"`

	ClientInfo *Implementation `json:"clientInfo,omitempty"`

	ProtocolVersion ProtocolVersion `json:"protocolVersion"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type InitializeResponse struct {
	AgentCapabilities *AgentCapabilities `json:"agentCapabilities,omitempty"`

	AgentInfo *Implementation `json:"agentInfo,omitempty"`

	AuthMethods []AuthMethod `json:"authMethods,omitempty"`

	ProtocolVersion ProtocolVersion `json:"protocolVersion"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type KillTerminalRequest struct {
	SessionID SessionID `json:"sessionId"`

	TerminalID TerminalID `json:"terminalId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type KillTerminalResponse struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ListSessionsRequest struct {
	Cursor *string `json:"cursor,omitempty"`

	Cwd *string `json:"cwd,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ListSessionsResponse struct {
	NextCursor *string `json:"nextCursor,omitempty"`

	Sessions []SessionInfo `json:"sessions"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type LoadSessionRequest struct {
	AdditionalDirectories []string `json:"additionalDirectories,omitempty"`

	Cwd string `json:"cwd"`

	McpServers []McpServer `json:"mcpServers"`

	SessionID SessionID `json:"sessionId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type LoadSessionResponse struct {
	ConfigOptions []SessionConfigOption `json:"configOptions,omitempty"`

	Modes *SessionModeState `json:"modes,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type LogoutCapabilities struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type LogoutRequest struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type LogoutResponse struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type McpCapabilities struct {
	HTTP bool `json:"http,omitempty"`

	Sse bool `json:"sse,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type McpServer struct {
	HTTP *McpServerHTTP `json:"-"`

	Sse *McpServerSse `json:"-"`

	Stdio *McpServerStdio `json:"-"`
}
```

```go
type McpServerHTTP struct {
	Headers []HTTPHeader `json:"headers"`

	Name string `json:"name"`

	URL string `json:"url"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type McpServerSse struct {
	Headers []HTTPHeader `json:"headers"`

	Name string `json:"name"`

	URL string `json:"url"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type McpServerStdio struct {
	Args []string `json:"args"`

	Command string `json:"command"`

	Env []EnvVariable `json:"env"`

	Name string `json:"name"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type MessageID string
```

```go
type NewSessionRequest struct {
	AdditionalDirectories []string `json:"additionalDirectories,omitempty"`

	Cwd string `json:"cwd"`

	McpServers []McpServer `json:"mcpServers"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type NewSessionResponse struct {
	ConfigOptions []SessionConfigOption `json:"configOptions,omitempty"`

	Modes *SessionModeState `json:"modes,omitempty"`

	SessionID SessionID `json:"sessionId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type PermissionOption struct {
	Kind PermissionOptionKind `json:"kind"`

	Name string `json:"name"`

	OptionID PermissionOptionID `json:"optionId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type PermissionOptionID string
```

```go
type PermissionOptionKind string
```

```go
type Plan struct {
	Entries []PlanEntry `json:"entries"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type PlanEntry struct {
	Content string `json:"content"`

	Priority PlanEntryPriority `json:"priority"`

	Status PlanEntryStatus `json:"status"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type PlanEntryPriority string
```

```go
type PlanEntryStatus string
```

```go
type PromptCapabilities struct {
	Audio bool `json:"audio,omitempty"`

	EmbeddedContext bool `json:"embeddedContext,omitempty"`

	Image bool `json:"image,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type PromptRequest struct {
	Prompt []ContentBlock `json:"prompt"`

	SessionID SessionID `json:"sessionId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type PromptResponse struct {
	StopReason StopReason `json:"stopReason"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ProtocolVersion uint16
```

```go
type ReadTextFileRequest struct {
	Limit *uint32 `json:"limit,omitempty"`

	Line *uint32 `json:"line,omitempty"`

	Path string `json:"path"`

	SessionID SessionID `json:"sessionId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ReadTextFileResponse struct {
	Content string `json:"content"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ReleaseTerminalRequest struct {
	SessionID SessionID `json:"sessionId"`

	TerminalID TerminalID `json:"terminalId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ReleaseTerminalResponse struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type RequestPermissionOutcome struct {
	Cancelled *struct{} `json:"-"`

	Selected *SelectedPermissionOutcome `json:"-"`
}
```

```go
type RequestPermissionRequest struct {
	Options []PermissionOption `json:"options"`

	SessionID SessionID `json:"sessionId"`

	ToolCall ToolCallUpdate `json:"toolCall"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type RequestPermissionResponse struct {
	Outcome RequestPermissionOutcome `json:"outcome"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ResourceLink struct {
	Annotations *Annotations `json:"annotations,omitempty"`

	Description *string `json:"description,omitempty"`

	MimeType *string `json:"mimeType,omitempty"`

	Name string `json:"name"`

	Size *int64 `json:"size,omitempty"`

	Title *string `json:"title,omitempty"`

	URI string `json:"uri"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ResumeSessionRequest struct {
	AdditionalDirectories []string `json:"additionalDirectories,omitempty"`

	Cwd string `json:"cwd"`

	McpServers []McpServer `json:"mcpServers,omitempty"`

	SessionID SessionID `json:"sessionId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ResumeSessionResponse struct {
	ConfigOptions []SessionConfigOption `json:"configOptions,omitempty"`

	Modes *SessionModeState `json:"modes,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type Role string
```

```go
type SelectedPermissionOutcome struct {
	OptionID PermissionOptionID `json:"optionId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionAdditionalDirectoriesCapabilities struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionCapabilities struct {
	AdditionalDirectories *SessionAdditionalDirectoriesCapabilities `json:"additionalDirectories,omitempty"`

	Close *SessionCloseCapabilities `json:"close,omitempty"`

	Delete *SessionDeleteCapabilities `json:"delete,omitempty"`

	List *SessionListCapabilities `json:"list,omitempty"`

	Resume *SessionResumeCapabilities `json:"resume,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionCloseCapabilities struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionConfigBoolean struct {
	CurrentValue bool `json:"currentValue"`
}
```

```go
type SessionConfigGroupID string
```

```go
type SessionConfigID string
```

```go
type SessionConfigOption struct {
	Category *SessionConfigOptionCategory `json:"category,omitempty"`

	Description *string `json:"description,omitempty"`

	ID SessionConfigID `json:"id"`

	Name string `json:"name"`

	Meta json.RawMessage `json:"_meta,omitempty"`

	Select *SessionConfigSelect `json:"-"`

	Boolean *SessionConfigBoolean `json:"-"`
}
```

```go
type SessionConfigOptionCategory string
```

```go
type SessionConfigOptionsCapabilities struct {
	Boolean *BooleanConfigOptionCapabilities `json:"boolean,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionConfigSelect struct {
	CurrentValue SessionConfigValueID `json:"currentValue"`

	Options SessionConfigSelectOptions `json:"options"`
}
```

```go
type SessionConfigSelectGroup struct {
	Group SessionConfigGroupID `json:"group"`

	Name string `json:"name"`

	Options []SessionConfigSelectOption `json:"options"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionConfigSelectOption struct {
	Description *string `json:"description,omitempty"`

	Name string `json:"name"`

	Value SessionConfigValueID `json:"value"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionConfigSelectOptions struct {
	Ungrouped []SessionConfigSelectOption `json:"-"`

	Grouped []SessionConfigSelectGroup `json:"-"`
}
```

```go
type SessionConfigValueID string
```

```go
type SessionDeleteCapabilities struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionID string
```

```go
type SessionInfo struct {
	AdditionalDirectories []string `json:"additionalDirectories,omitempty"`

	Cwd string `json:"cwd"`

	SessionID SessionID `json:"sessionId"`

	Title *string `json:"title,omitempty"`

	UpdatedAt *string `json:"updatedAt,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionInfoUpdate struct {
	Title *string `json:"title,omitempty"`

	UpdatedAt *string `json:"updatedAt,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionListCapabilities struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionMode struct {
	Description *string `json:"description,omitempty"`

	ID SessionModeID `json:"id"`

	Name string `json:"name"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionModeID string
```

```go
type SessionModeState struct {
	AvailableModes []SessionMode `json:"availableModes"`

	CurrentModeID SessionModeID `json:"currentModeId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionNotification struct {
	SessionID SessionID `json:"sessionId"`

	Update SessionUpdate `json:"update"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionResumeCapabilities struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SessionUpdate struct {
	UserMessageChunk *ContentChunk `json:"-"`

	AgentMessageChunk *ContentChunk `json:"-"`

	AgentThoughtChunk *ContentChunk `json:"-"`

	ToolCall *ToolCall `json:"-"`

	ToolCallUpdate *ToolCallUpdate `json:"-"`

	Plan *Plan `json:"-"`

	AvailableCommandsUpdate *AvailableCommandsUpdate `json:"-"`

	CurrentModeUpdate *CurrentModeUpdate `json:"-"`

	ConfigOptionUpdate *ConfigOptionUpdate `json:"-"`

	SessionInfoUpdate *SessionInfoUpdate `json:"-"`

	UsageUpdate *UsageUpdate `json:"-"`
}
```

```go
type SetSessionConfigOptionRequest struct {
	ConfigID SessionConfigID `json:"configId"`

	SessionID SessionID `json:"sessionId"`

	Meta json.RawMessage `json:"_meta,omitempty"`

	Boolean *bool `json:"-"`

	ValueID *SessionConfigValueID `json:"-"`
}
```

```go
type SetSessionConfigOptionResponse struct {
	ConfigOptions []SessionConfigOption `json:"configOptions"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SetSessionModeRequest struct {
	ModeID SessionModeID `json:"modeId"`

	SessionID SessionID `json:"sessionId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type SetSessionModeResponse struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type StopReason string
```

```go
type Terminal struct {
	TerminalID TerminalID `json:"terminalId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type TerminalExitStatus struct {
	ExitCode *uint32 `json:"exitCode,omitempty"`

	Signal *string `json:"signal,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type TerminalID string
```

```go
type TerminalOutputRequest struct {
	SessionID SessionID `json:"sessionId"`

	TerminalID TerminalID `json:"terminalId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type TerminalOutputResponse struct {
	ExitStatus *TerminalExitStatus `json:"exitStatus,omitempty"`

	Output string `json:"output"`

	Truncated bool `json:"truncated"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type TextContent struct {
	Annotations *Annotations `json:"annotations,omitempty"`

	Text string `json:"text"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type TextResourceContents struct {
	MimeType *string `json:"mimeType,omitempty"`

	Text string `json:"text"`

	URI string `json:"uri"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ToolCall struct {
	Content []ToolCallContent `json:"content,omitempty"`

	Kind *ToolKind `json:"kind,omitempty"`

	Locations []ToolCallLocation `json:"locations,omitempty"`

	RawInput json.RawMessage `json:"rawInput,omitempty"`

	RawOutput json.RawMessage `json:"rawOutput,omitempty"`

	Status *ToolCallStatus `json:"status,omitempty"`

	Title string `json:"title"`

	ToolCallID ToolCallID `json:"toolCallId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ToolCallContent struct {
	Content *Content `json:"-"`

	Diff *Diff `json:"-"`

	Terminal *Terminal `json:"-"`
}
```

```go
type ToolCallID string
```

```go
type ToolCallLocation struct {
	Line *uint32 `json:"line,omitempty"`

	Path string `json:"path"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ToolCallStatus string
```

```go
type ToolCallUpdate struct {
	Content []ToolCallContent `json:"content,omitempty"`

	Kind *ToolKind `json:"kind,omitempty"`

	Locations []ToolCallLocation `json:"locations,omitempty"`

	RawInput json.RawMessage `json:"rawInput,omitempty"`

	RawOutput json.RawMessage `json:"rawOutput,omitempty"`

	Status *ToolCallStatus `json:"status,omitempty"`

	Title *string `json:"title,omitempty"`

	ToolCallID ToolCallID `json:"toolCallId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type ToolKind string
```

```go
type UnstructuredCommandInput struct {
	Hint string `json:"hint"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type UsageUpdate struct {
	Cost *Cost `json:"cost,omitempty"`

	Size uint64 `json:"size"`

	Used uint64 `json:"used"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type WaitForTerminalExitRequest struct {
	SessionID SessionID `json:"sessionId"`

	TerminalID TerminalID `json:"terminalId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type WaitForTerminalExitResponse struct {
	ExitCode *uint32 `json:"exitCode,omitempty"`

	Signal *string `json:"signal,omitempty"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type WriteTextFileRequest struct {
	Content string `json:"content"`

	Path string `json:"path"`

	SessionID SessionID `json:"sessionId"`

	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

```go
type WriteTextFileResponse struct {
	Meta json.RawMessage `json:"_meta,omitempty"`
}
```

### Constants {#constants}

`MaxInFlightHandlers`, `NotifyBufferDepth`, `SendQueueDepth`, `MaxMessageBytes`, `MaxNestingDepth`, `KindRequest`, `KindResponse`, `KindNotification`, `IssueOversizedPayload`, `IssueExcessiveNesting`, `IssueMalformedJSON`, `IssueNotAnObject`, `IssueTrailingData`, `IssueDuplicateField`, `IssueUnknownField`, `IssueWrongVersion`, `IssueInvalidIDType`, `IssueMissingID`, `IssueInvalidMethodType`, `IssueMalformedErrorObj`, `IssueBothResultAndError`, `IssueAmbiguousShape`, `MethodAuthenticate`, `MethodInitialize`, `MethodLogout`, `MethodSessionCancel`, `MethodSessionClose`, `MethodSessionDelete`, `MethodSessionList`, `MethodSessionLoad`, `MethodSessionNew`, `MethodSessionPrompt`, `MethodSessionResume`, `MethodSessionSetConfigOption`, `MethodSessionSetMode`, `MethodFsReadTextFile`, `MethodFsWriteTextFile`, `MethodSessionRequestPermission`, `MethodSessionUpdate`, `MethodTerminalCreate`, `MethodTerminalKill`, `MethodTerminalOutput`, `MethodTerminalRelease`, `MethodTerminalWaitForExit`, `MethodCancelRequest`, `CurrentProtocolVersion`, `ErrorCodeParseError`, `ErrorCodeInvalidRequest`, `ErrorCodeMethodNotFound`, `ErrorCodeInvalidParams`, `ErrorCodeInternalError`, `ErrorCodeRequestCancelled`, `ErrorCodeAuthenticationRequired`, `ErrorCodeResourceNotFound`, `PermissionOptionKindAllowOnce`, `PermissionOptionKindAllowAlways`, `PermissionOptionKindRejectOnce`, `PermissionOptionKindRejectAlways`, `PlanEntryPriorityHigh`, `PlanEntryPriorityMedium`, `PlanEntryPriorityLow`, `PlanEntryStatusPending`, `PlanEntryStatusInProgress`, `PlanEntryStatusCompleted`, `RoleAssistant`, `RoleUser`, `SessionConfigOptionCategoryMode`, `SessionConfigOptionCategoryModel`, `SessionConfigOptionCategoryModelConfig`, `SessionConfigOptionCategoryThoughtLevel`, `StopReasonEndTurn`, `StopReasonMaxTokens`, `StopReasonMaxTurnRequests`, `StopReasonRefusal`, `StopReasonCancelled`, `ToolCallStatusPending`, `ToolCallStatusInProgress`, `ToolCallStatusCompleted`, `ToolCallStatusFailed`, `ToolKindRead`, `ToolKindEdit`, `ToolKindDelete`, `ToolKindMove`, `ToolKindSearch`, `ToolKindExecute`, `ToolKindThink`, `ToolKindFetch`, `ToolKindSwitchMode`, `ToolKindOther`

### Variables {#variables}

`AgentMethods`, `ClientMethods`, `ProtocolMethods`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ConnClosedError`, `Error`, `Fault`, `FrameTooLargeError`, `InvalidFrameError`, `ReceiveSequenceOverflowError`, `TruncatedFrameError`, `ValidationError`, `WriterClosedError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

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

Run `go test ./...` from a checkout of the `acp` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
