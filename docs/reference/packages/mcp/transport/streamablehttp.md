---
id: reference/packages/mcp/transport/streamablehttp
title: transport/streamablehttp package · streamablehttp
description: Reference for MCP Streamable HTTP with origin pinning, bounded streams, and safe resumption.
audience: developer
section: reference
order: 217
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  package-role: release-github-com-looprig-mcp
  exported-surface: release-github-com-looprig-mcp
  functions-and-methods: release-github-com-looprig-mcp
  types: release-github-com-looprig-mcp
  constants-and-variables: release-github-com-looprig-mcp
  ownership-and-errors: release-github-com-looprig-mcp
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# transport/streamablehttp package · streamablehttp

Import path: `github.com/looprig/mcp/pkg/transport/streamablehttp`. The source is pinned to github.com/looprig/mcp@v0.6.2.

## Package role {#package-role}

`New` configures an SDK transport with a caller-owned HTTP client, auth RoundTripper, TLS, body, stream, timeout, redirect, and session controls. It leaves OAuthHandler replay disabled so a 401 cannot resend a tool call.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(cfg Config) (client.TransportFactory, error)`

### Methods {#methods}

- `func (f *factory) Kind() string`
- `func (f *factory) RedactedOrigin() string`
- `func (f *factory) Connect(ctx context.Context, cfg protocol.ConnectConfig) (protocol.Conn, error)`

### Types {#types}

`Config`, `Timeouts`

### Constants {#constants}

`DefaultDialTimeout`, `DefaultTLSHandshakeTimeout`, `DefaultResponseHeaderTimeout`, `DefaultFrameTimeout`, `DefaultIdleConnTimeout`, `DefaultRequestTimeout`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/transport/streamablehttp/streamablehttp.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/streamablehttp/streamablehttp.go)

Adjacent tests at the same commit:

- [pkg/transport/streamablehttp/stateless_integration_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/streamablehttp/stateless_integration_test.go)
- [pkg/transport/streamablehttp/streamablehttp_integration_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/streamablehttp/streamablehttp_integration_test.go)
- [pkg/transport/streamablehttp/streamablehttp_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/streamablehttp/streamablehttp_test.go)

Run `GOWORK=off go test ./...` from the `mcp` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
