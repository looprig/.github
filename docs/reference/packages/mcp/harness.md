---
id: reference/packages/mcp/harness
title: harness package · mcpharness
description: Reference for MCP binding, adoption, sampling, reconfiguration, and Harness tool identity.
audience: developer
section: reference
order: 213
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

# harness package · mcpharness

Import path: `github.com/looprig/mcp/pkg/harness`. This package is the only MCP-to-Harness vocabulary adapter.

## Package role {#package-role}

`Manager` owns bindings, connection startup, status, notices, and reconfiguration. `Adopter` installs discovered tools into selected loop controllers as a `loop.ExternalToolset`. `Binding` declares name, server definition, scope, visibility, and required startup.

## Exported surface {#exported-surface}

The package exports `Manager`, `Adopter`, `Binding`, `BindingOp`, `BindingStatus`, `BindingFailure`, `BindingIdentity`, `Deps`, `GateRequest`, `GateResponse`, `LoopSelector`, `SamplingPolicy`, `Reporter`, `EventSource`, `EventPublisher`, and `ToolIdentity`. Constructors include `NewManager`, `AllLoops`, `Loops`, `Named`, `AddBinding`, `ReplaceBinding`, `EnableBinding`, `DisableBinding`, `RemoveBinding`, and `ToolInvokeIdentity`.

### Functions and methods {#functions-and-methods}

Manager methods start and close bindings, bind sessions, start adoption, reconfigure, report status, and expose notices. Adopter methods install or remove definitions for a loop.

### Types {#types}

Scope and notice enums, startup errors, duplicate model names, and binding failures preserve lifecycle and catalog identity. Sampling requests are routed to a host policy and never call a model implicitly.

### Constants and variables {#constants-and-variables}

Tool and integration source labels, capability strings, elicitation and retirement timeouts, and `ErrSamplingDenied` are exported contracts.

## Ownership and errors {#ownership-and-errors}

Manager owns the MCP clients; Harness controllers own the installed external toolset. Required startup failures can stop composition, while optional failures are reported. Disabling a binding affects future builds and status, not an already authorized call.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned MCP Harness adapter](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/). `stage-16-mcp-adoption` proves install and disable reconfiguration.
