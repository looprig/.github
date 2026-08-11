---
id: build/17-mcp-transport
title: Build 17: MCP transports
description: Consume or publish MCP over supervised stdio, Streamable HTTP, or explicitly selected legacy SSE with bounded trust and failure handling.
audience: developer
section: build
order: 17
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  boundary:
    - release-github-com-looprig-mcp
  transports:
    - release-github-com-looprig-mcp
  auth-and-failures:
    - release-github-com-looprig-mcp
  lifecycle:
    - release-github-com-looprig-mcp
  runnable-proof:
    - release-github-com-looprig-mcp
---

# Build 17: MCP transports

MCP clients consume a server definition and transport factory; MCP servers publish bounded tools and results. Choose the transport explicitly. A child process is supervised and receives an environment allowlist; a remote Streamable HTTP server is authenticated and origin-pinned; legacy SSE is compatibility-only and never selected as fallback.

## Boundary {#boundary}

`client.Definition` names the server, profile, limits, and transport. `client.Connect` returns a client that discovers tools, resources, prompts, sampling, elicitation, and roots through typed handlers. `server.New` creates a publisher-side registry; `Server.RegisterTool` exposes a handler whose input and result remain JSON bounded by the server boundary.

## Transports {#transports}

`transport/stdio.New` starts and owns a child process, groups it for teardown, and keeps stderr bounded. `transport/streamablehttp.New` uses the SDK's HTTP transport while supplying Looprig's auth, TLS, body, stream, timeout, redirect, and non-replay policy. `transport/sse.New` is an opt-in path for servers that still require the 2024-11-05 HTTP plus SSE shape; it shares the same origin and credential guards and does not upgrade or downgrade automatically.

## Auth and failures {#auth-and-failures}

The `auth` package keeps tokens and client secrets behind explicit accessors and refuses implicit JSON or gob marshaling. Remote transports attach credentials only after origin validation. Classify failures with `client.FailureClass` and `client.Error`, then decide whether a connection may retry. Tool calls are not retried; Streamable HTTP may resume a dropped response stream with `Last-Event-ID`, which reads a committed reply rather than issuing the call again.

## Lifecycle {#lifecycle}

Connect once, discover and fingerprint the catalog, then close the client after in-flight calls and subscriptions drain. Stdio closes the MCP stream before terminating and reaping the child. HTTP transports end their MCP session with the protocol DELETE. A dropped remote stream is a connection event for the client, not permission to replay a non-idempotent tool call.

## Runnable proof {#runnable-proof}

`stage-16-mcp-adoption` starts a deterministic stdio server, discovers one tool, installs it into a Harness loop, disables its binding, and asserts the generated `mcp__docs__lookup` model name and disabled status. Run it with `node scripts/docs/run-examples.mjs`. Read the [pinned stdio transport](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/stdio/), [Streamable HTTP transport](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/streamablehttp/), and [client](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/).
