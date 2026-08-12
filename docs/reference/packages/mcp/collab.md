---
id: reference/packages/mcp/collab
title: collab package · collab
description: Reference for the bounded collaboration framing used by injected agent tools.
audience: developer
section: reference
order: 212
publication: released
examples:
  - stage-14-delegation
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

# collab package · collab

Import path: `github.com/looprig/mcp/pkg/collab`. The source is pinned to github.com/looprig/mcp@v0.6.2.

## Package role {#package-role}

Package collab contains the deliberately small collaboration boundary used by the injected MessageAgent MCP process.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewClient(cfg ClientConfig) (*Client, error)`
- `func New(cfg ClientConfig) (*Client, error)`
- `func NewClientWithDialer(cfg ClientConfig, dial DialFunc) (*Client, error)`
- `func WriteFrameLimit(w io.Writer, payload []byte, max int) error`
- `func ConfigFromEnv(lookup func(string) (string, bool)) (ClientConfig, error)`
- `func DecodeCapabilityToken(encoded string) ([]byte, error)`
- `func EncodeCapabilityToken(capability []byte) (string, error)`
- `func DecodeMessageAgent(raw []byte) (MessageAgentRequest, error)`
- `func ValidateMessageAgent(raw []byte) (MessageAgentRequest, error)`
- `func DecodeDelegateResult(raw []byte) (DelegateResult, error)`
- `func WriteHandshake(w io.Writer, capability []byte) error`
- `func ReadHandshake(r io.Reader) ([]byte, error)`
- `func WriteFrame(w io.Writer, payload []byte) error`
- `func ReadFrame(r io.Reader) ([]byte, error)`

### Methods {#methods}

- `func (c *Client) Config() ClientConfig`
- `func (c *Client) Call(ctx context.Context, request MessageAgentRequest) (DelegateResult, error)`
- `func (c *Client) MessageAgent(ctx context.Context, request MessageAgentRequest) (DelegateResult, error)`
- `func (c *Client) Send(ctx context.Context, request MessageAgentRequest) (DelegateResult, error)`
- `func (c *Client) CallJSON(ctx context.Context, request MessageAgentRequest) (json.RawMessage, error)`
- `func (c *Client) CallRaw(ctx context.Context, request MessageAgentRequest) (json.RawMessage, error)`

### Types {#types}

```go
type DialFunc func(context.Context, string) (net.Conn, error)
```

```go
type Client struct {
	// contains filtered or unexported fields
}
```

```go
type MessageAgentRequest struct {
	AgentID         string `json:"agent_id"`
	Message         string `json:"message"`
	WaitForResponse bool   `json:"wait_for_response"`
	TimeoutSeconds  *int   `json:"timeout_seconds,omitempty"`
}
```

```go
type PreparedMessageAgent = MessageAgentRequest
```

```go
type DelegateResult struct {
	AgentID        string `json:"agent_id"`
	Name           string `json:"name"`
	State          string `json:"state"`
	DeliveryStatus string `json:"delivery_status,omitempty"`
	ResponseStatus string `json:"response_status,omitempty"`
	Response       string `json:"response,omitempty"`
}
```

```go
type ClientConfig struct {
	Endpoint   string
	Capability []byte
	Token      []byte

	ConnectTimeout   time.Duration
	AdmissionTimeout time.Duration
	MaxFrameBytes    int
}
```

```go
type Config = ClientConfig
```

### Constants {#constants}

`EndpointEnv`, `TokenEnv`, `EndpointEnvName`, `TokenEnvName`, `BrokerEndpointEnv`, `BrokerTokenEnv`, `ToolName`, `CapabilityBytes`, `MaxCapabilityBytes`, `MaxMessageBytes`, `MaxArgumentBytes`, `MaxFrameBytes`, `MaxEndpointBytes`, `MaxTimeoutSeconds`

### Variables {#variables}

`ErrInvalidRequest`, `ErrInvalidArguments`, `ErrInputLimit`, `ErrInvalidCapability`, `ErrInvalidConfig`, `ErrFrameLimit`, `ErrFrameTooLarge`, `ErrFrame`, `ErrAuthentication`, `ErrAuth`, `ErrConnection`, `ErrAdmission`, `ErrResponse`, `ErrDeadline`, `ErrUnsupportedPlatform`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/collab/client.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/collab/client.go)
- [pkg/collab/client_other.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/collab/client_other.go)
- [pkg/collab/client_unix.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/collab/client_unix.go)
- [pkg/collab/protocol.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/collab/protocol.go)

Adjacent tests at the same commit:

- [pkg/collab/client_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/collab/client_test.go)

Run `go test ./...` from a checkout of the `mcp` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
