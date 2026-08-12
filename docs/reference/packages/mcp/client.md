---
id: reference/packages/mcp/client
title: client package · client
description: Reference for MCP discovery, calls, sampling, elicitation, resources, prompts, and reconnect events.
audience: developer
section: reference
order: 211
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

# client package · client

Import path: `github.com/looprig/mcp/pkg/client`. The source is pinned to github.com/looprig/mcp@v0.6.2.

## Package role {#package-role}

`Connect` initializes, discovers, and maintains a server catalog. `Definition` names the server and transport; `Handlers` receives sampling, elicitation, roots, progress, logs, and events. Tool calls, resources, prompts, and completion are represented as bounded values.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Connect(ctx context.Context, def Definition, h Handlers) (*Client, error)`
- `func NewError(class FailureClass, binding Name, op string, msg string, wrapped error) *Error`
- `func ClassOf(err error) (FailureClass, bool)`
- `func DefaultLimits() Limits`

### Methods {#methods}

- `func (c *Client) CallTool(ctx context.Context, rawName string, args json.RawMessage, opts CallOpts) (ToolResult, error)`
- `func (c *Client) GetPrompt(ctx context.Context, name string, args map[string]string) (Prompt, error)`
- `func (c *Client) ReadResource(ctx context.Context, uri string) (Resource, error)`
- `func (c *Client) Subscribe(ctx context.Context, uri string) error`
- `func (c *Client) Unsubscribe(ctx context.Context, uri string) error`
- `func (c Catalog) Valid() bool`
- `func (c Catalog) ToolByRawName(rawName string) (ToolSpec, bool)`
- `func (c Catalog) ToolByModelName(modelName string) (ToolSpec, bool)`
- `func (c *Client) Catalog() Catalog`
- `func (c *Client) Status() Status`
- `func (c *Client) Close(ctx context.Context) error`
- `func (t Tolerance) String() string`
- `func (p Profile) Permits(t Tolerance) bool`
- `func (p Profile) String() string`
- `func (p Profile) Digest() string`
- `func (n Name) Validate() error`
- `func (f ToolFilter) Permits(rawName string) bool`
- `func (d Definition) Validate() error`
- `func (c FailureClass) String() string`
- `func (e *Error) Error() string`
- `func (e *Error) Unwrap() error`
- `func (a ElicitAction) String() string`
- `func (m ElicitMode) String() string`
- `func (r SampleRole) String() string`
- `func (c *Client) Candidate() (Catalog, bool)`
- `func (c *Client) Adopt(generation uint64) error`
- `func (o SampleOutcome) String() string`
- `func (s State) String() string`

### Types {#types}

```go
type Progress struct {
	Binding Name

	Progress float64

	Total float64

	Message string
}
```

```go
type CallOpts struct {
	Progress func(Progress)

	Deadline time.Time
}
```

```go
type ToolResult struct {
	IsError bool

	Content []Content

	Structured json.RawMessage

	Warnings []string
}
```

```go
type Prompt struct {
	Description string
	Messages    []PromptMessage
}
```

```go
type PromptMessage struct {
	Role    string
	Content Content
}
```

```go
type Resource struct {
	Contents []ResourceContent
}
```

```go
type ResourceContent struct {
	URI       string
	MIMEType  string
	Text      string
	Data      []byte
	Truncated bool
}
```

```go
type ServerCapabilities struct {
	Tools bool

	Prompts bool

	Resources bool

	ResourcesSubscribe bool

	Logging bool

	Completions bool
}
```

```go
type ToolAnnotations struct {
	Title           string
	ReadOnlyHint    bool
	IdempotentHint  bool
	DestructiveHint *bool
	OpenWorldHint   *bool
}
```

```go
type ToolSpec struct {
	RawName string

	ModelName string

	Title       string
	Description string

	InputSchema json.RawMessage

	OutputSchema json.RawMessage

	InputSchemaDigest string

	OutputSchemaDigest string

	Annotations *ToolAnnotations

	Warnings []string
}
```

```go
type PromptSpec struct {
	Name        string
	Title       string
	Description string
	Arguments   []PromptArg
}
```

```go
type PromptArg struct {
	Name        string
	Title       string
	Description string
	Required    bool
}
```

```go
type ResourceSpec struct {
	URI         string
	Name        string
	Title       string
	Description string
	MIMEType    string
}
```

```go
type ResourceTemplateSpec struct {
	URITemplate string
	Name        string
	Title       string
	Description string
	MIMEType    string
}
```

```go
type Catalog struct {
	Binding Name

	Generation uint64

	Digest string

	ProtocolVersion string

	Server ServerIdentity

	Capabilities ServerCapabilities

	Instructions string

	Tools []ToolSpec

	Prompts []PromptSpec

	Resources []ResourceSpec

	ResourceTemplates []ResourceTemplateSpec

	Warnings []string

	AppliedTolerances []Tolerance
}
```

```go
type Client struct {
	// contains filtered or unexported fields
}
```

```go
type Tolerance uint8
```

```go
type Profile struct {
	Name string

	Version int

	Tolerances []Tolerance
}
```

```go
type Content interface {
	content()
}
```

```go
type Text struct {
	Text      string
	Truncated bool
}
```

```go
type Image struct {
	Data     []byte
	MIMEType string
}
```

```go
type Audio struct {
	Data     []byte
	MIMEType string
}
```

```go
type EmbeddedResource struct {
	URI       string
	MIMEType  string
	Text      string
	Data      []byte
	Truncated bool
}
```

```go
type Unsupported struct {
	Kind string

	Bytes int
}
```

```go
type Name string
```

```go
type ClientCapabilities struct {
	Elicitation bool

	Sampling bool

	Roots bool
}
```

```go
type ToolFilter struct {
	Allow []string

	Deny []string
}
```

```go
type TransportFactory interface {
	Kind() string

	RedactedOrigin() string

	Connect(ctx context.Context, cfg protocol.ConnectConfig) (protocol.Conn, error)
}
```

```go
type Definition struct {
	Name Name

	Transport TransportFactory

	Timeouts Timeouts

	Limits Limits

	Capabilities ClientCapabilities

	ToolFilter ToolFilter

	AllowParallelCalls bool

	Compat Profile

	Reconnect ReconnectPolicy

	Refresh RetryPolicy

	LogLevel LogLevel
}
```

```go
type FailureClass uint8
```

```go
type Error struct {
	Class FailureClass

	Binding Name

	Op string

	Msg string

	Err error
}
```

```go
type CatalogStale struct {
	Binding Name

	Family string

	At time.Time
}
```

```go
type ResourceUpdated struct {
	Binding Name

	URI string

	At time.Time
}
```

```go
type CatalogCandidate struct {
	Binding Name

	Generation uint64

	Digest string

	Adopted uint64

	At time.Time
}
```

```go
type CatalogRefreshed struct {
	Binding Name

	Generation uint64

	Digest string

	At time.Time
}
```

```go
type CatalogAdopted struct {
	Binding Name

	Generation uint64

	Digest string

	Previous uint64

	At time.Time
}
```

```go
type CatalogRejected struct {
	Binding Name

	Class FailureClass

	Message string

	Adopted uint64

	Retrying bool

	At time.Time
}
```

```go
type ConnectionLost struct {
	Binding Name

	Class FailureClass

	Message string

	Adopted uint64

	Retrying bool

	At time.Time
}
```

```go
type ConnectionRestored struct {
	Binding Name

	Server ServerIdentity

	Drift string

	Adopted uint64

	Generation uint64

	At time.Time
}
```

```go
type ServerLog struct {
	Binding Name

	Level LogLevel

	Logger string

	Text string

	At time.Time
}
```

```go
type RequestProgress struct {
	Binding Name

	Progress float64

	Total float64

	Message string

	At time.Time
}
```

```go
type ElicitationRequested struct {
	Binding Name

	Mode ElicitMode

	At time.Time
}
```

```go
type ElicitationResolved struct {
	Binding Name

	Mode ElicitMode

	Action ElicitAction

	Duration time.Duration

	At time.Time
}
```

```go
type ElicitAction uint8
```

```go
type ElicitMode uint8
```

```go
type ElicitRequest struct {
	Binding Name

	Mode ElicitMode

	Message string

	Schema json.RawMessage

	URL string

	ElicitationID string
}
```

```go
type ElicitResult struct {
	Action  ElicitAction
	Content json.RawMessage
}
```

```go
type ElicitationHandler interface {
	Elicit(ctx context.Context, req ElicitRequest) (ElicitResult, error)
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
	Binding Name

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
type SamplingHandler interface {
	Sample(ctx context.Context, req SampleRequest) (SampleResult, error)
}
```

```go
type Root struct {
	URI string

	Name string
}
```

```go
type RootsProvider interface {
	Roots(ctx context.Context) ([]Root, error)
}
```

```go
type LogLevel string
```

```go
type LogMessage struct {
	Binding Name

	Level LogLevel

	Logger string

	Text string
}
```

```go
type LogHandler func(LogMessage)
```

```go
type Event interface {
	event()
}
```

```go
type StateChanged struct {
	Binding Name

	From, To State

	At time.Time
}
```

```go
type EventHandler func(Event)
```

```go
type Handlers struct {
	Elicitation ElicitationHandler

	Sampling SamplingHandler

	Roots RootsProvider

	Log LogHandler

	Event EventHandler
}
```

```go
type Timeouts struct {
	Startup time.Duration

	Request time.Duration

	Elicitation time.Duration
}
```

```go
type Limits struct {
	MaxConcurrentRequests int

	MaxCatalogPages int

	MaxCatalogItems int

	MaxFrameBytes int

	MaxBodyBytes int

	MaxSchemaBytes int

	MaxSchemaDepth int

	MaxTextResultBytes int

	MaxStructuredBytes int

	MaxBinaryItemBytes int

	MaxBinaryItems int

	MaxLogMessageBytes int

	MaxElicitMessageBytes int

	MaxElicitSchemaBytes int

	MaxPromptCount int

	MaxResourceCount int

	MaxSamplingDepth int

	MaxSamplingConcurrency int

	MaxSamplingTokens int
}
```

```go
type RetryPolicy struct {
	Attempts int

	BaseDelay time.Duration

	MaxDelay time.Duration

	MaxTotal time.Duration
}
```

```go
type ReconnectPolicy struct {
	Disabled bool

	RetryPolicy
}
```

```go
type SampleOutcome uint8
```

```go
type SamplingRequested struct {
	Binding Name

	Messages int

	MaxTokens int

	Depth int

	At time.Time
}
```

```go
type SamplingResolved struct {
	Binding Name

	Outcome SampleOutcome

	Model string

	Duration time.Duration

	At time.Time
}
```

```go
type State uint8
```

```go
type ServerIdentity struct {
	Name    string
	Version string
	Title   string
}
```

```go
type Failure struct {
	Class FailureClass

	Message string
}
```

```go
type Status struct {
	Binding Name

	State State

	ProtocolVersion string

	Server ServerIdentity

	TransportKind string

	RedactedOrigin string

	Failure *Failure

	LastChange time.Time

	CatalogGeneration uint64

	CatalogDigest string

	CandidateGeneration uint64

	CandidateDigest string

	StaleFamilies []string

	CompatProfile string

	ReconnectAttempt int
}
```

### Constants {#constants}

`ClientName`, `ClientVersion`, `ClientTitle`, `TolerateInvalidOutputSchema`, `TolerateLegacySSE`, `TolerateDisplayNameNormalization`, `MaxProfileNameBytes`, `KindText`, `KindImage`, `KindAudio`, `KindResource`, `KindResourceLink`, `KindToolUse`, `KindToolResult`, `KindUnknown`, `MaxNameBytes`, `DefaultLogLevel`, `FailureInvalidConfig`, `FailureUnsupportedProtocol`, `FailureStartupTimeout`, `FailureAuthRequired`, `FailureAuthDenied`, `FailureAuthExpired`, `FailureAuthFailed`, `FailureTransportClosed`, `FailureFraming`, `FailureRemoteHTTP`, `FailureServerProtocol`, `FailureDeadline`, `FailureCancelled`, `FailureCatalogInvalid`, `FailureCatalogStale`, `FailureCatalogOverLimit`, `FailureNotFound`, `FailureToolUnavailable`, `FailureToolSchemaChanged`, `FailureRemoteToolError`, `FailureLimitExceeded`, `FailureElicitationDeclined`, `FailureElicitationCancelled`, `FailureElicitationInvalid`, `FailureElicitationTimeout`, `FailureSamplingDenied`, `FailureSamplingOverBudget`, `FailureIndeterminate`, `FailureShutdown`, `MaxMessageBytes`, `ElicitAccept`, `ElicitDecline`, `ElicitCancel`, `ElicitModeForm`, `ElicitModeURL`, `SampleRoleUser`, `SampleRoleAssistant`, `LogDebug`, `LogInfo`, `LogNotice`, `LogWarning`, `LogError`, `LogCritical`, `LogAlert`, `LogEmergency`, `DefaultStartupTimeout`, `DefaultRequestTimeout`, `DefaultElicitationTimeout`, `DefaultRetryAttempts`, `DefaultRetryBaseDelay`, `DefaultRetryMaxDelay`, `DefaultRetryMaxTotal`, `MaxRetryAttempts`, `SampleCompleted`, `SampleDenied`, `SampleFailed`, `StateConfigured`, `StateStarting`, `StateAuthenticating`, `StateDiscovering`, `StateReady`, `StateDegraded`, `StateReconnecting`, `StateFailed`, `StateClosing`, `StateClosed`

### Variables {#variables}

`ProfileStrict`, `ProfileDefault`, `ProfileLegacy`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `Error`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/client/calls.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/calls.go)
- [pkg/client/catalog.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/catalog.go)
- [pkg/client/client.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/client.go)
- [pkg/client/compat.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/compat.go)
- [pkg/client/content.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/content.go)
- [pkg/client/convert.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/convert.go)
- [pkg/client/definition.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/definition.go)
- [pkg/client/elicit.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/elicit.go)
- [pkg/client/errors.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/errors.go)
- [pkg/client/events.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/events.go)
- [pkg/client/handlers.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/handlers.go)
- [pkg/client/limits.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/limits.go)
- [pkg/client/reconnect.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/reconnect.go)
- [pkg/client/refresh.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/refresh.go)
- [pkg/client/retry.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/retry.go)
- [pkg/client/roots.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/roots.go)
- [pkg/client/sampling.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/sampling.go)
- [pkg/client/status.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/status.go)

Adjacent tests at the same commit:

- [pkg/client/calls_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/calls_test.go)
- [pkg/client/catalog_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/catalog_test.go)
- [pkg/client/client_integration_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/client_integration_test.go)
- [pkg/client/client_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/client_test.go)
- [pkg/client/compat_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/compat_test.go)
- [pkg/client/definition_fuzz_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/definition_fuzz_test.go)
- [pkg/client/definition_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/definition_test.go)
- [pkg/client/discovery_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/discovery_test.go)
- [pkg/client/elicit_integration_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/elicit_integration_test.go)
- [pkg/client/elicit_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/elicit_test.go)
- [pkg/client/errors_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/errors_test.go)
- [pkg/client/events_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/events_test.go)
- [pkg/client/fake_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/fake_test.go)
- [pkg/client/protocol_matrix_integration_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/protocol_matrix_integration_test.go)
- [pkg/client/reconnect_integration_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/reconnect_integration_test.go)
- [pkg/client/reconnect_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/reconnect_test.go)
- [pkg/client/refresh_integration_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/refresh_integration_test.go)
- [pkg/client/refresh_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/refresh_test.go)
- [pkg/client/roots_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/roots_test.go)
- [pkg/client/sampling_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/sampling_test.go)
- [pkg/client/scheduler_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/scheduler_test.go)
- [pkg/client/status_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/status_test.go)

Run `GOWORK=off go test ./...` from the `mcp` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
