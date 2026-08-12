---
id: guides/protocols/mcp/serve
title: MCP Serve
description: Author a bounded MCP tool server with product-owned definitions, handlers, schemas, and a stdio-shaped serving loop.
audience: developer
section: guides
order: 18
publication: released
proofs:
  server-boundary:
    - release-github-com-looprig-mcp
  register-a-tool:
    - release-github-com-looprig-mcp
  bounded-results-and-errors:
    - release-github-com-looprig-mcp
  serve-over-stdio-shaped-streams:
    - release-github-com-looprig-mcp
  source-and-proof:
    - release-github-com-looprig-mcp
---

# MCP Serve

MCP Serve is the server-side path. `mcp/pkg/server` gives a product a small, SDK-independent surface: configure identity and bounds, register product-owned `Tool` values, then serve `tools/call` requests over reader and writer streams. The package owns MCP framing, capability advertisement, limits, and wire-error classification.

## Server boundary

`server.New` normalizes a `server.Config`. It gives every running server a non-empty name and version, bounded message, input, and output sizes, and a bounded request concurrency. Construction does not start I/O. Register tools before calling `Serve`, `ServeStdio`, or `Run`.

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/looprig/mcp/pkg/server"
)

func main() {
	// Identity and bounds are server policy, not SDK defaults hidden from the app.
	s, err := server.New(server.Config{Name: "docs-server", Version: "1.0.0"})
	if err != nil {
		panic(err)
	}
	if err := s.RegisterTool(server.Tool{
		Name:        "sum",
		Description: "Add two integers.",
		InputSchema: json.RawMessage(`{"type":"object","properties":{"a":{"type":"integer"},"b":{"type":"integer"}},"required":["a","b"]}`),
		Handler: func(_ context.Context, raw json.RawMessage) (server.Result, error) {
			var input struct{ A, B int }
			if err := json.Unmarshal(raw, &input); err != nil {
				return server.Result{}, server.ErrInvalidArgument
			}
			return server.Result{Content: []server.Content{{Text: fmt.Sprint(input.A + input.B)}}}, nil
		},
	}); err != nil {
		panic(err)
	}
	// Run binds the MCP stream to this process's stdin and stdout.
	if err := s.Run(context.Background()); err != nil {
		panic(err)
	}
}
```

The public API deliberately does not expose SDK server types. This keeps a product's tool definition, schema, and handler contract stable even when the underlying SDK changes.

## Register a tool

`server.Tool` has a name, title, description, `InputSchema`, optional `OutputSchema`, and a `Handler`. Names are bounded and limited to letters, digits, `_`, `-`, and `.`. An omitted input schema becomes an object schema. A name can be registered once; duplicates return `ErrDuplicateTool`.

The handler receives a defensive copy of bounded JSON arguments and returns `server.Result`. `Content` is text-only in this server boundary. `StructuredContent` carries valid JSON when the tool provides it. Set `IsError` when the tool result itself represents an error that the model should see as a result rather than a transport failure.

## Bounded results and errors

Arguments are checked against `MaxInputBytes` before the handler runs. The encoded result and content are checked against `MaxOutputBytes`; the surrounding JSON-RPC frame is checked against `MaxMessageBytes`. The default policy is 256 KiB for input and output and eight concurrent requests. A caller may select smaller bounds, but not larger than the package ceilings.

Return `server.ErrInvalidArgument` for invalid tool input. The wire class is JSON-RPC invalid params. Other handler errors become a generic internal error. The handler's error text is not a place to put secrets or unbounded diagnostics.

The [Tools guide](/docs/guides/tools/core-concepts/) covers the model-facing definition and result lifecycle after an MCP client adopts a tool. The [Harness tool-call guide](/docs/guides/harness/step/tool-calls-and-results/) covers permissions and execution around the call.

## Serve over stdio-shaped streams

`Server.Serve` accepts any `io.Reader` and `io.Writer`, which makes in-process tests and embedded hosts possible. `Run` is the executable convenience that uses `os.Stdin` and `os.Stdout`. On cancellation, closable streams are closed to release a blocked read. The [MCP transports guide](/docs/guides/protocols/mcp/transports/) covers the client-side process owner and network alternatives.

## Source and proof

The server surface is implemented in [pkg/server/server.go](https://github.com/looprig/mcp/blob/main/pkg/server/server.go), [pkg/server/tool.go](https://github.com/looprig/mcp/blob/main/pkg/server/tool.go), and [pkg/server/stdio.go](https://github.com/looprig/mcp/blob/main/pkg/server/stdio.go). The [server example](https://github.com/looprig/mcp/blob/main/examples/server/main.go) and [server tests](https://github.com/looprig/mcp/blob/main/pkg/server/server_test.go) exercise registration, bounds, and serving.
