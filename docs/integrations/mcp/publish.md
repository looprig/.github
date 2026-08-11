---
id: integrations/mcp/publish
title: Publish an MCP server
description: Register product-owned tools behind bounded MCP protocol handling and explicit handler ownership.
audience: developer
section: integrations
order: 322
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  server: release-github-com-looprig-mcp
  registration: release-github-com-looprig-mcp
  effect-boundary: release-github-com-looprig-mcp
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# Publish an MCP server

`server.New` validates identity and limits. `RegisterTool` stores a name, description, input schema, and application-owned handler. `Run` serves initialize, list, and call operations until context cancellation or transport closure.

## Server {#server}

The server owns protocol registration, framing, and bounded result encoding. It returns invalid-argument, unknown-tool, handler, and protocol failures as wire results rather than claiming success for a failed handler.

## Registration {#registration}

Register only handlers backed by resources the product intends to expose. Keep schemas bounded and validate arguments again in the handler. A published tool identity is not a parent Harness permission and does not automatically inherit the publisher's workspace or credential authority.

## Effect boundary {#effect-boundary}

The application owns the effectful resource and must perform its own preparation and authorization before the handler acts. Protocol success means the MCP operation completed; it does not prove that a remote caller was entitled to the underlying product effect.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned server package](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/server/). `stage-16-mcp-adoption` runs a deterministic published child server.
