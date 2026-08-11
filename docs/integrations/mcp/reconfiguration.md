---
id: integrations/mcp/reconfiguration
title: Reconfigure MCP bindings
description: Apply explicit add, replace, enable, disable, and remove operations with status and in-flight call boundaries.
audience: developer
section: integrations
order: 328
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  operations: release-github-com-looprig-mcp
  lifecycle: release-github-com-looprig-mcp
  in-flight: release-github-com-looprig-mcp
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# Reconfigure MCP bindings

Use `Manager.Reconfigure` with explicit binding operations. Add and replace create or update a named binding; enable and disable change whether future definitions are installed; remove retires the binding and its client resources according to manager lifecycle.

## Operations {#operations}

Validate a binding identity, server definition, scope, visibility, startup requirement, and auth configuration before applying the operation. Duplicate names, invalid scope, transport, discovery, and startup errors remain attached to the binding status.

## Lifecycle {#lifecycle}

The manager owns clients and starts required bindings before an adopter exposes them. During replacement, drain or retire the old binding deliberately before publishing the new catalog. Close adopters before managers, and close managers before the session stores they report to.

## In-flight {#in-flight}

Disabling a binding prevents future tool definitions and calls admitted after the change. It does not retroactively make an already authorized call unauthorized or safely interrupt a non-idempotent operation. Report the transition and let the owning session decide how to handle remaining work.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned Harness adapter](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/). `stage-16-mcp-adoption` applies adoption and disable behavior to one deterministic server.
