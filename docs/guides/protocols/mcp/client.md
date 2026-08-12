---
id: guides/protocols/mcp/client
title: MCP Client
description: Connect to one MCP server, complete the handshake, adopt a catalog, call tools, consume resources and prompts, and close cleanly.
audience: developer
section: guides
order: 19
publication: released
proofs:
  definition-is-binding-policy:
    - release-github-com-looprig-mcp
  connect-and-adopt:
    - release-github-com-looprig-mcp
  consume-tools-resources-and-prompts:
    - release-github-com-looprig-mcp
  close-the-binding:
    - release-github-com-looprig-mcp
  source-and-proof:
    - release-github-com-looprig-mcp
---

# MCP Client

MCP Client is the consumer-side path. `client.Definition` describes one named binding, `client.Handlers` supplies callbacks for capabilities the host can actually serve, and `client.Connect` validates the definition, opens the transport, performs the handshake, discovers the server catalog, and returns a ready `*client.Client`.

## Definition is binding policy

`client.Definition` contains a binding name, a required `TransportFactory`, startup and request timeouts, resource limits, optional client capabilities, a `ToolFilter`, parallel-call policy, compatibility profile, reconnect policy, refresh retry policy, and log level. Treat it as immutable after validation. The definition is the host's policy, not a copy of the server's instructions.

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/looprig/mcp/pkg/client"
	"github.com/looprig/mcp/pkg/transport/stdio"
)

func main() {
	// New resolves the executable but does not start it.
	transport, err := stdio.New(stdio.Config{Command: "/absolute/path/to/mcp-server"})
	if err != nil {
		panic(err)
	}
	c, err := client.Connect(context.Background(), client.Definition{
		Name:      "docs",
		Transport: transport,
		ToolFilter: client.ToolFilter{Deny: []string{"dangerous"}},
	}, client.Handlers{})
	if err != nil {
		panic(err)
	}
	defer c.Close(context.Background())
	result, err := c.CallTool(context.Background(), "sum", json.RawMessage(`{"a":20,"b":22}`), client.CallOpts{})
	if err != nil {
		panic(err)
	}
	fmt.Println("content blocks:", len(result.Content))
}
```

The filter is exact and case-sensitive. A non-empty allow list is the complete permitted set; deny always wins. `CallTool` checks the filter again, so a caller cannot bypass policy by naming a tool that was omitted from the model-facing catalog.

## Connect and adopt

`Connect` bounds startup with `Definition.Timeouts.Startup` and the caller context. A failed startup returns a typed client error and closes any transport it opened. The successful path negotiates a protocol version and server identity, lists the server's tool, prompt, resource, and resource-template families, validates them, computes a canonical digest, and adopts one immutable catalog generation before returning.

`Catalog()` returns the host-facing projection. Each `ToolSpec` has the server's `RawName`, a deterministic model-facing `ModelName`, input and optional output schemas, schema digests, annotations, and tolerated warnings. Use `Catalog.ToolByRawName` or `ToolByModelName`; model names are sanitized and lossy, so do not parse them to recover raw names.

## Consume tools, resources, and prompts

`CallTool` sends bounded JSON arguments and returns `ToolResult`, with optional progress notifications supplied through `CallOpts.Progress`. `ReadResource` accepts an opaque MCP URI. `GetPrompt` returns external prompt messages and does not promote them into host instructions automatically.

```go
// A server's prompt is content, not authority. Decide explicitly whether a
// product promotes any returned text into an instruction or model request.
prompt, err := c.GetPrompt(ctx, "review", map[string]string{"path": "main.go"})
if err != nil {
	panic(err)
}
_ = prompt.Messages
resource, err := c.ReadResource(ctx, "docs://main.go")
if err != nil {
	panic(err)
}
_ = resource.Contents
```

When a tool becomes a model-visible Harness tool, follow the [Tools registration guide](/docs/guides/tools/core-concepts/registration/) and [Inference tools request guide](/docs/guides/inference/requests/tools/). Those pages describe preparation, model selection, and result content above the MCP client.

## Close the binding

`Client.Close` is idempotent and owns the returned client's lifetime. It stops refresh and reconnect workers, closes the active connection, and releases the transport. Cancelling the context passed to `Connect` after success has no effect. Use a separate close context so shutdown is bounded but not accidentally tied to an already-finished startup context.

The client keeps the last adopted catalog after close for diagnosis. `Status()` tells whether the binding is usable, degraded, reconnecting, or closed. A catalog snapshot is not an authorization grant; the call path still checks state and filters.

## Source and proof

The client lifecycle is in [pkg/client/client.go](https://github.com/looprig/mcp/blob/main/pkg/client/client.go), [definition.go](https://github.com/looprig/mcp/blob/main/pkg/client/definition.go), [calls.go](https://github.com/looprig/mcp/blob/main/pkg/client/calls.go), and [catalog.go](https://github.com/looprig/mcp/blob/main/pkg/client/catalog.go). The [client integration tests](https://github.com/looprig/mcp/blob/main/pkg/client/client_integration_test.go), [catalog tests](https://github.com/looprig/mcp/blob/main/pkg/client/catalog_test.go), and [call tests](https://github.com/looprig/mcp/blob/main/pkg/client/calls_test.go) prove the sequence.
