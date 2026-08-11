---
id: build/19-mcp
title: Build 19: MCP support boundary
description: Compose MCP, ACP, classifiers, gates, and Carbon-facing support without confusing protocol reachability with product authorization.
audience: developer
section: build
order: 19
publication: released
examples:
  - stage-15-acp-foreign
  - stage-16-mcp-adoption
proofs:
  composition:
    - release-github-com-looprig-mcp
    - release-github-com-looprig-acp
    - release-github-com-looprig-harness
  pass-through:
    - release-github-com-looprig-mcp
    - release-github-com-looprig-acp
  support-posture:
    - release-github-com-looprig-mcp
  lifecycle:
    - release-github-com-looprig-mcp
    - release-github-com-looprig-acp
  errors-and-limits:
    - release-github-com-looprig-mcp
  runnable-proof:
    - release-github-com-looprig-mcp
    - release-github-com-looprig-acp
---

# Build 19: MCP support boundary

Treat MCP support as a composition contract. A product may consume an MCP server, publish a server, adopt tools into Harness, or pass server definitions through to an ACP child. Each path has a distinct owner for authentication, lifecycle, gates, and failure reporting.

## Composition {#composition}

The safe order is configure credentials and transport, connect and inspect the server catalog, bind the catalog to a session, then build loop tool definitions. For an ACP child, the application owns the `protocol.McpServer` configuration and the ACP launch layer forwards it during child session creation or reload. For a published server, `server.Server` owns protocol handling while the product owns the handler's domain effects.

## Pass-through {#pass-through}

`foreignloops/driver/acp.Config.McpServers` carries child-facing MCP definitions; it does not adopt those tools into the parent Harness session. Parent adoption uses `mcp/pkg/harness.Manager` and installs protocol-neutral external tools. A classifier may observe an MCP-backed command or network requirement, but classifier evidence cannot expand the parent gate or Sandbox ceiling.

## Support posture {#support-posture}

The reusable MCP module supplies client, server, auth, transports, collaboration framing, and Harness adoption. Carbon can compose those packages, but product configuration, credential names, deployed endpoints, and support policy belong to Carbon's own release. The library does not claim that every remote MCP server, OAuth provider, ACP child, or native product integration is supported.

## Lifecycle {#lifecycle}

Construct dependencies before managers, start managers before adopters, and close adopters before managers. Close ACP sessions before child processes and proxies. On shutdown, stop accepting new tool calls, drain in-flight calls and gate responses, retire adopted definitions, close MCP transports, then close the owning Harness session and stores.

## Errors and limits {#errors-and-limits}

Classify transport, authentication, discovery, schema, tool invocation, sampling, and reconfiguration failures separately. Do not retry a non-idempotent MCP call because a stream failed. Bound names, schemas, bodies, frames, stderr, event queues, and sampling inputs. A protocol success only means the protocol operation completed; it does not prove that the product's effect was authorized or that a remote service is trustworthy.

## Runnable proof {#runnable-proof}

The deterministic `stage-16-mcp-adoption` proof covers publish, stdio consumption, Harness adoption, and disable reconfiguration. `stage-15-acp-foreign` covers ACP child configuration with one forwarded MCP server and live/restored builders. Run both with `node scripts/docs/run-examples.mjs`. Source is pinned in the [MCP module](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/), [ACP protocol](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/), and [foreign ACP driver](https://github.com/looprig/foreignloops/tree/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/).
