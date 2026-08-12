---
id: modules/mcp
title: MCP clients, servers, transports, and Harness adoption
description: Consume, publish, and adopt MCP tools with explicit authentication, bounded failure handling, lifecycle, sampling, and reconfiguration.
audience: developer
section: modules
order: 19
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  repository: release-github-com-looprig-mcp
  boundary:
    - release-github-com-looprig-mcp
  composition:
    - release-github-com-looprig-mcp
    - release-github-com-looprig-harness
  lifecycle:
    - release-github-com-looprig-mcp
  errors-and-limits:
    - release-github-com-looprig-mcp
  runnable-proof:
    - release-github-com-looprig-mcp
---

# MCP clients, servers, transports, and Harness adoption

## Repository

Source, package documentation, tests, and examples are available in the [`looprig/mcp` repository](https://github.com/looprig/mcp).

MCP `v0.6.2` supplies typed clients and servers, auth seams, stdio, Streamable HTTP and legacy SSE transports, collaboration framing, and a Harness adapter. The module speaks MCP below the adoption boundary and exposes protocol-neutral tool definitions above it.

## Boundary {#boundary}

`pkg/client` owns discovery, tool/resource/prompt calls, sampling, elicitation, roots, reconnection, and catalog events. `pkg/server` owns product-registered tool handlers and bounded wire results. `pkg/auth` keeps bearer and OAuth material behind explicit accessors. `pkg/harness` maps a client catalog to scoped Harness external tools without leaking MCP wire DTOs into loops.

## Composition {#composition}

Choose `transport/stdio` for a locally supervised child, `transport/streamablehttp` for a remote server, or `transport/sse` only when a legacy endpoint is explicitly selected. Connect and inspect the catalog before binding it. A binding declares scope, visibility, required startup, and a stable identity. Every adopted invocation returns to Harness preparation and gate evaluation.

Sampling and elicitation are host decisions. The MCP client reports requests to injected handlers; it does not silently call a model or prompt a user. An ACP child can receive MCP server definitions through its own protocol session, which is separate from adopting those servers into the parent loop.

## Lifecycle {#lifecycle}

Start managers before adopters, drain calls before closing transports, and close stdio children only after the protocol session ends. `Manager.Reconfigure` applies explicit add, replace, enable, disable, and remove operations. A disabled binding stops future definitions; it does not retroactively approve an in-flight call. HTTP session termination and stdio process reaping remain transport-owned.

## Errors and limits {#errors-and-limits}

Classify invalid configuration, auth, connection, discovery, schema, tool, sampling, startup, and reconfiguration failures with typed `client.Error`, `harness.StartupError`, and binding errors. MCP bounds names, schemas, frames, message bodies, stderr, queues, stream frames, and timeouts. Calls are not retried; stream resumption only reads an already committed response. Tokens, client secrets, and credentials never enter events, catalogs, fingerprints, or logs.

## Runnable proof {#runnable-proof}

`stage-16-mcp-adoption` publishes a child server, consumes it over stdio, installs one tool into a session-scoped binding, and disables that binding. Run it with `node scripts/docs/run-examples.mjs`. Read the [pinned client](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/), [server](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/server/), [auth](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/), and [Harness adapter](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/).
