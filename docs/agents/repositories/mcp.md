---
id: agents/repositories/mcp
title: MCP client and server
description: Connect to bounded MCP servers or expose typed tools over stdio and HTTP transports.
audience: agent
section: agents/repositories
order: 14
publication: released
proofs:
  module:
    - release-github-com-looprig-mcp
---
# mcp

`github.com/looprig/mcp@v0.6.2` has `pkg/client`, `pkg/server`, `pkg/transport/stdio`, `pkg/transport/sse`, `pkg/transport/streamablehttp`, `pkg/auth`, `pkg/harness`, and collaboration packages.

For a client, build a validated `client.Definition`, select a transport factory such as `stdio.New`, `sse.New`, or `streamablehttp.New`, then call `client.Connect(ctx, definition, handlers)`. The returned client performs initialization and discovery, exposes tools and resources, and must be closed. For a server, call `server.New(config)`, register each tool once, and serve through the selected transport. `harness.NewManager` adapts MCP bindings to Harness services.

Definitions bound limits, capabilities, origins, credentials, and concurrency. Connect fails closed and returns no live client when validation, transport, handshake, or discovery fails. Duplicate tools, invalid schemas, auth, protocol, size, timeout, reconnect, and close errors are typed or wrapped at the package boundary. Proofs: [`pkg/client/client.go`](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/client.go), [`pkg/server/server.go`](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/server/server.go), [`pkg/transport/stdio/stdio.go`](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/stdio/stdio.go), [`pkg/client/client_test.go`](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/client_test.go).
