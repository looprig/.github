---
id: reference/packages/mcp/client
title: client package · client
description: Reference for MCP discovery, calls, sampling, elicitation, resources, prompts, and reconnect events.
audience: developer
section: reference
order: 211
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

# client package · client

Import path: `github.com/looprig/mcp/pkg/client`. Client consumes an MCP server through a transport definition and typed callbacks.

## Package role {#package-role}

`Connect` initializes, discovers, and maintains a server catalog. `Definition` names the server and transport; `Handlers` receives sampling, elicitation, roots, progress, logs, and events. Tool calls, resources, prompts, and completion are represented as bounded values.

## Exported surface {#exported-surface}

The package exports `Client`, `Definition`, `Handlers`, `Profile`, `Limits`, `Timeouts`, `ReconnectPolicy`, `RetryPolicy`, `ToolSpec`, `ToolResult`, resource/prompt/content values, sampling and elicitation requests/results, catalog events, state/status values, and `Error`/`Failure`. `Connect`, `DefaultLimits`, and `NewError` are the principal constructors.

### Functions and methods {#functions-and-methods}

Client methods discover and call tools, read resources, get prompts, complete arguments, and expose catalog/state events. Sampling and elicitation always call injected handlers.

### Types {#types}

`FailureClass` separates invalid config, connection, protocol, auth, discovery, schema, tool, sampling, and cancellation failures. `ConnectionLost` and `ConnectionRestored` describe transport state without replaying calls.

### Constants and variables {#constants-and-variables}

Message, name, profile, retry, startup, and queue bounds are exported limits. `ProfileStrict` is an explicit policy value, not an implicit server trust decision.

## Ownership and errors {#ownership-and-errors}

The client owns its transport connection and catalog snapshot; handlers own host resources and model/user decisions. Do not retry a non-idempotent call because the connection state changed.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned MCP client](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/). `stage-16-mcp-adoption` discovers and adopts a deterministic tool.
