---
id: integrations/mcp/harness-adoption
title: Adopt MCP tools into Harness
description: Bind a discovered MCP catalog to selected loops with stable identity, scope, status, and gate return paths.
audience: developer
section: integrations
order: 323
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  binding: release-github-com-looprig-mcp
  adoption: release-github-com-looprig-mcp
  authorization: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# Adopt MCP tools into Harness

`harness.Manager` owns MCP client bindings and `harness.Adopter` installs discovered tools as a loop `ExternalToolset`. A `Binding` records server definition, scope, visibility, required startup, and stable identity.

## Binding {#binding}

Choose a scope such as all loops, selected loops, or a named loop and assign a stable source identity. Keep required startup explicit: a required binding can stop composition, while an optional failure is reported through status and notices.

## Adoption {#adoption}

Start the manager, discover the catalog, then start adoption. The adopter maps MCP tool schema and invocation to a protocol-neutral external tool. Disable or remove a binding to stop future definitions; the manager does not rewrite an already-started call.

## Authorization {#authorization}

An adopted invocation returns to Harness preparation and gate evaluation. The MCP client performs the protocol call only after that decision, and the selected Sandbox or transport policy can still reject the effect. MCP discovery and classifier evidence cannot raise parent authority.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned Harness adapter](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/). `stage-16-mcp-adoption` asserts one deterministic external definition and then disables its binding.
