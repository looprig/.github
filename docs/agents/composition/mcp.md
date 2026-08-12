---
id: agents/composition/mcp
title: Publish and consume MCP tools
description: Wire MCP transports, clients, servers, catalog adoption, and Harness integration.
audience: agent
section: agents/composition
order: 7
publication: released
proofs:
  mcp:
    - release-github-com-looprig-mcp
---
# MCP

Server side: build `server.New(server.Config{...})`, register typed tool handlers, and serve with the stdio server adapter or an HTTP transport. Client side: select a transport factory with `transport/stdio.New`, `transport/sse.New`, or `transport/streamablehttp.New`, construct `client.Definition{Name, Transport, Capabilities, ...}`, then call `client.Connect(ctx, definition, handlers)`.

The client owns one binding lifecycle. It performs initialization, lists tools and resources, and exposes typed calls. Catalog refresh produces an immutable candidate generation. The caller chooses a safe boundary and calls `Client.Adopt(generation)`; refresh never silently changes the catalog already used by a model. `Close` stops refresh, transport, and callbacks.

Harness integration belongs in `mcp/pkg/harness`: configure bindings and manager dependencies, then let the Harness tool definition expose the adopted MCP catalog. Sampling, elicitation, roots, and list-change notifications require explicit handlers and limits. Authentication belongs to the selected transport or caller policy.

Invariants: definition fields validate before connect; a failed connect returns no client; catalog adoption is atomic; stale or superseded generations are rejected; calls use the adopted catalog; callbacks do not run under the client lock. Failures are typed by `FailureClass`, including invalid config, auth, server protocol, transport closed, remote HTTP, catalog stale, sampling denied, and shutdown.

Proofs: [`mcp/pkg/client/client.go`](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/client.go), [`mcp/pkg/client/refresh.go`](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/refresh.go), [`mcp/pkg/transport/streamablehttp/streamablehttp.go`](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/streamablehttp/streamablehttp.go).
