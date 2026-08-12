---
id: guides/protocols/mcp/transports
title: MCP transports
description: Choose MCP stdio, Streamable HTTP, or explicit legacy SSE and understand their framing, ownership, security, and retry behavior.
audience: developer
section: guides
order: 20
publication: released
proofs:
  transport-choice:
    - release-github-com-looprig-mcp
  stdio-process-boundary:
    - release-github-com-looprig-mcp
  streamable-http:
    - release-github-com-looprig-mcp
  legacy-sse:
    - release-github-com-looprig-mcp
  source-and-proof:
    - release-github-com-looprig-mcp
---

# MCP transports

The MCP client depends on a `TransportFactory`. Looprig's three factories keep the protocol client independent from how bytes move:

| Transport | Connection shape | Choose it when | Retry posture |
| --- | --- | --- | --- |
| stdio | child stdin and stdout | you own or confine a local server process | reconnect rebuilds a process; the transport does not replay calls |
| Streamable HTTP | HTTP POST plus server-to-client SSE | a remote server supports the current streamable transport | a dropped stream resumes by `Last-Event-ID`; a tool POST is not retried |
| SSE | legacy HTTP GET stream plus server-chosen POST endpoint | an existing server only supports the 2024-11-05 compatibility transport | no stream resumption and no automatic fallback |

## Transport choice

The choice is made by constructing a named package type. Nothing silently falls back from Streamable HTTP to legacy SSE. A host should choose the modern transport for new deployments and import `sse` only when compatibility with a known legacy server is required.

```go
// TransportFactory is the only transport detail the MCP client needs.
stdioTransport, err := stdio.New(stdio.Config{
	Command: "/absolute/path/to/server",
	Env:     stdio.EnvAllowlist{PassThrough: []string{"PATH"}},
})
if err != nil {
	panic(err)
}
httpTransport, err := streamablehttp.New(streamablehttp.Config{
	Endpoint: "https://tools.example.test/mcp",
})
if err != nil {
	panic(err)
}
_ = stdioTransport
_ = httpTransport
```

## Stdio process boundary

`pkg/transport/stdio` owns the child process rather than delegating process start to the SDK. `Config.Command` is a bare executable name or absolute path; arguments are separate strings, never a shell command. `Dir` must be absolute when set. `EnvAllowlist` starts from an empty environment and names variables to pass through or explicit values to set. Stderr is bounded and diagnostics are never mixed with protocol stdout.

Close drains the MCP session before closing the child's stdin, then terminates and reaps the process group. The child is untrusted from start to finish: stdout is protocol input, stderr is bounded diagnostics, and exit status is a fact to report rather than a reason to trust the child.

## Streamable HTTP

`streamablehttp.Config` accepts an endpoint, static headers, an optional per-request `auth.HeaderProvider`, an HTTP client, and explicit network timeouts. The SDK handles `Mcp-Session-Id`, the protocol version header, the POST response stream, the standalone SSE stream, resumption with `Last-Event-ID`, and the session-ending DELETE.

TLS certificate verification is required, with TLS 1.2 as the default floor. Cleartext HTTP is limited to loopback. Response bodies are bounded per frame, and frame completion has a deadline. A cross-origin redirect is refused before credentials can be attached. The transport never reissues a tool call; only reading a dropped SSE stream can resume.

## Legacy SSE

`pkg/transport/sse` is an explicit compatibility choice. The client GETs an SSE stream, then the first server event names the POST endpoint. The transport pins that endpoint to the configured origin in its round tripper, not only in `http.Client.CheckRedirect`, because an endpoint event is a new request target rather than a standard redirect.

Legacy SSE shares TLS, origin, credential, body, and frame guards with Streamable HTTP. It has no `Last-Event-ID` resumption. A dropped stream ends the connection and lets the client-level reconnect policy decide whether to rebuild it.

Once a transport has yielded a catalog, the [Harness session guide](/docs/guides/harness/session-runtime/) owns connection lifecycle and the [Tools concepts guide](/docs/guides/tools/core-concepts/) owns the model-facing tool contract. The [Inference requests guide](/docs/guides/inference/requests/) is the next link when a catalog tool becomes a model request.

## Source and proof

The process boundary is in [stdio.go](https://github.com/looprig/mcp/blob/main/pkg/transport/stdio/stdio.go) and [process.go](https://github.com/looprig/mcp/blob/main/pkg/transport/stdio/process.go). Streamable HTTP is implemented in [streamablehttp.go](https://github.com/looprig/mcp/blob/main/pkg/transport/streamablehttp/streamablehttp.go), and legacy compatibility is in [sse.go](https://github.com/looprig/mcp/blob/main/pkg/transport/sse/sse.go). Evidence includes [stdio tests](https://github.com/looprig/mcp/blob/main/pkg/transport/stdio/stdio_test.go), [Streamable HTTP tests](https://github.com/looprig/mcp/blob/main/pkg/transport/streamablehttp/streamablehttp_test.go), and [SSE tests](https://github.com/looprig/mcp/blob/main/pkg/transport/sse/sse_test.go).
