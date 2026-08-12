---
id: reference/packages/mcp/server
title: server package · server
description: Reference for publishing bounded MCP tools and results.
audience: developer
section: reference
order: 214
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

# server package · server

Import path: `github.com/looprig/mcp/pkg/server`. The source is pinned to github.com/looprig/mcp@v0.6.2.

## Package role {#package-role}

Package server provides the small MCP server surface used by a product's injected collaboration process.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(cfg Config) (*Server, error)`
- `func NewServer(cfg Config) (*Server, error)`

### Methods {#methods}

- `func (s *Server) Config() Config`
- `func (s *Server) RegisterTool(tool Tool) error`
- `func (s *Server) AddTool(tool Tool) error`
- `func (s *Server) Register(tool Tool) error`
- `func (s *Server) Serve(ctx context.Context, reader io.Reader, writer io.Writer) error`
- `func (s *Server) Run(ctx context.Context) error`
- `func (s *Server) ServeStdio(ctx context.Context, reader io.Reader, writer io.Writer) error`

### Types {#types}

```go
type Config struct {
	Name    string
	Version string

	MaxMessageBytes int

	MaxInputBytes int

	MaxOutputBytes        int
	MaxConcurrentRequests int
}
```

```go
type ServerConfig = Config
```

```go
type Server struct {
	// contains filtered or unexported fields
}
```

```go
type Handler func(context.Context, json.RawMessage) (Result, error)
```

```go
type ToolHandler = Handler
```

```go
type Tool struct {
	Name         string
	Title        string
	Description  string
	InputSchema  json.RawMessage
	OutputSchema json.RawMessage
	Handler      Handler
}
```

```go
type Content struct {
	Text string
}
```

```go
type Result struct {
	Content           []Content
	StructuredContent json.RawMessage
	IsError           bool
}
```

```go
type ToolResult = Result
```

### Constants {#constants}

`DefaultServerName`, `DefaultServerVersion`, `DefaultMaxInputBytes`, `DefaultMaxOutputBytes`, `MaxFrameOverheadBytes`, `MaxRequestIDBytes`, `DefaultMaxMessageBytes`, `DefaultMaxConcurrentRequests`, `MaxConcurrentRequests`, `MaxMessageBytes`, `MaxInputBytes`, `MaxOutputBytes`

### Variables {#variables}

`ErrInvalidArgument`, `ErrInternal`, `ErrInvalidToolName`, `ErrDuplicateTool`, `ErrInvalidToolSchema`, `ErrInvalidConfig`, `ErrInputLimit`, `ErrOutputLimit`, `ErrInputEnvelope`, `ErrBatchUnsupported`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/server/server.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/server/server.go)
- [pkg/server/stdio.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/server/stdio.go)
- [pkg/server/tool.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/server/tool.go)

Adjacent tests at the same commit:

- [pkg/server/server_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/server/server_test.go)
- [pkg/server/stdio_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/server/stdio_test.go)

Run `go test ./...` from a checkout of the `mcp` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
