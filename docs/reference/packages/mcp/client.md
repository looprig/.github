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

`Progress`, `CallOpts`, `ToolResult`, `Prompt`, `PromptMessage`, `Resource`, `ResourceContent`, `ServerCapabilities`, `ToolAnnotations`, `ToolSpec`, `PromptSpec`, `PromptArg`, `ResourceSpec`, `ResourceTemplateSpec`, `Catalog`, `Client`, `Tolerance`, `Profile`, `Content`, `Text`, `Image`, `Audio`, `EmbeddedResource`, `Unsupported`, `Name`, `ClientCapabilities`, `ToolFilter`, `TransportFactory`, `Definition`, `FailureClass`, `Error`, `CatalogStale`, `ResourceUpdated`, `CatalogCandidate`, `CatalogRefreshed`, `CatalogAdopted`, `CatalogRejected`, `ConnectionLost`, `ConnectionRestored`, `ServerLog`, `RequestProgress`, `ElicitationRequested`, `ElicitationResolved`, `ElicitAction`, `ElicitMode`, `ElicitRequest`, `ElicitResult`, `ElicitationHandler`, `SampleRole`, `SampleMessage`, `SampleRequest`, `SampleResult`, `SamplingHandler`, `Root`, `RootsProvider`, `LogLevel`, `LogMessage`, `LogHandler`, `Event`, `StateChanged`, `EventHandler`, `Handlers`, `Timeouts`, `Limits`, `RetryPolicy`, `ReconnectPolicy`, `SampleOutcome`, `SamplingRequested`, `SamplingResolved`, `State`, `ServerIdentity`, `Failure`, `Status`

### Constants {#constants}

`ClientName`, `ClientVersion`, `ClientTitle`, `TolerateInvalidOutputSchema`, `TolerateLegacySSE`, `TolerateDisplayNameNormalization`, `MaxProfileNameBytes`, `KindText`, `KindImage`, `KindAudio`, `KindResource`, `KindResourceLink`, `KindToolUse`, `KindToolResult`, `KindUnknown`, `MaxNameBytes`, `DefaultLogLevel`, `FailureInvalidConfig`, `FailureUnsupportedProtocol`, `FailureStartupTimeout`, `FailureAuthRequired`, `FailureAuthDenied`, `FailureAuthExpired`, `FailureAuthFailed`, `FailureTransportClosed`, `FailureFraming`, `FailureRemoteHTTP`, `FailureServerProtocol`, `FailureDeadline`, `FailureCancelled`, `FailureCatalogInvalid`, `FailureCatalogStale`, `FailureCatalogOverLimit`, `FailureNotFound`, `FailureToolUnavailable`, `FailureToolSchemaChanged`, `FailureRemoteToolError`, `FailureLimitExceeded`, `FailureElicitationDeclined`, `FailureElicitationCancelled`, `FailureElicitationInvalid`, `FailureElicitationTimeout`, `FailureSamplingDenied`, `FailureSamplingOverBudget`, `FailureIndeterminate`, `FailureShutdown`, `MaxMessageBytes`, `ElicitAccept`, `ElicitDecline`, `ElicitCancel`, `ElicitModeForm`, `ElicitModeURL`, `SampleRoleUser`, `SampleRoleAssistant`, `LogDebug`, `LogInfo`, `LogNotice`, `LogWarning`, `LogError`, `LogCritical`, `LogAlert`, `LogEmergency`, `DefaultStartupTimeout`, `DefaultRequestTimeout`, `DefaultElicitationTimeout`, `DefaultRetryAttempts`, `DefaultRetryBaseDelay`, `DefaultRetryMaxDelay`, `DefaultRetryMaxTotal`, `MaxRetryAttempts`, `SampleCompleted`, `SampleDenied`, `SampleFailed`, `StateConfigured`

### Variables {#variables}

`ProfileStrict`, `ProfileDefault`, `Nam`, `Versio`, `Tolerance`, `TolerateInvalidOutputSchem`, `TolerateDisplayNameNormalizatio`, `ProfileLegacy`, `TolerateLegacySS`

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
