---
id: reference/packages/mcp/server
title: server package · server
description: Reference for publishing bounded MCP tools and results.
audience: developer
section: reference
order: 214
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

# server package · server

Import path: `github.com/looprig/mcp/pkg/server`. Server publishes product-owned tools through MCP framing and wire-error classification.

## Package role {#package-role}

`New` validates server identity and limits. `RegisterTool` adds a name, description, input schema, and handler. `Run` serves requests until context cancellation or transport closure.

## Exported surface {#exported-surface}

The API is `Config`, `Server`, `Tool`, `Handler`, `Result`, `Content`, and aliases `ServerConfig`, `ToolHandler`, and `ToolResult`; constructors are `New` and `NewServer`.

### Functions and methods {#functions-and-methods}

`RegisterTool` validates and stores a definition. `Run` handles initialize, list, and call operations while bounding request and result payloads.

### Types {#types}

`Result` and `Content` support text and resource values; invalid argument, unknown tool, handler, and protocol failures are returned as typed wire errors.

### Constants and variables {#constants-and-variables}

Default server identity and maximum message size are explicit values. No product handler or credential is global.

## Ownership and errors {#ownership-and-errors}

The application owns handlers and any effectful resources. The server owns protocol registration and must not claim a successful tool result when the handler returned an error.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned server package](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/server/). `stage-16-mcp-adoption` runs a deterministic server child.
