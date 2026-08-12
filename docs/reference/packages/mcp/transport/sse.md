---
id: reference/packages/mcp/transport/sse
title: transport/sse package · sse
description: Reference for explicitly selected legacy MCP HTTP plus SSE transport.
audience: developer
section: reference
order: 215
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

# transport/sse package · sse

Import path: `github.com/looprig/mcp/pkg/transport/sse`. The source is pinned to github.com/looprig/mcp@v0.6.2.

## Package role {#package-role}

`New` returns a client transport factory only when the caller explicitly chooses this package. It shares TLS, origin, credential, body, frame, timeout, cancellation, and no-replay safeguards with the modern HTTP path.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(cfg Config) (client.TransportFactory, error)`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type Config struct {
	Endpoint string

	Headers []auth.Header

	Auth auth.HeaderProvider

	HTTPClient *http.Client

	Timeouts Timeouts
}
```

```go
type Timeouts struct {
	Dial time.Duration

	TLSHandshake time.Duration

	ResponseHeader time.Duration

	Frame time.Duration

	IdleConn time.Duration

	Request time.Duration
}
```

### Constants {#constants}

`DefaultDialTimeout`, `DefaultTLSHandshakeTimeout`, `DefaultResponseHeaderTimeout`, `DefaultFrameTimeout`, `DefaultIdleConnTimeout`, `DefaultRequestTimeout`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/transport/sse/sse.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/sse/sse.go)
- [pkg/transport/sse/stream.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/sse/stream.go)

Adjacent tests at the same commit:

- [pkg/transport/sse/sse_integration_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/sse/sse_integration_test.go)
- [pkg/transport/sse/sse_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/sse/sse_test.go)

Run `GOWORK=off go test ./...` from the `mcp` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
