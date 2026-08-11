---
id: integrations/mcp/index
title: MCP integration
description: Select MCP consumption, publication, Harness adoption, and ACP pass-through paths with separate owners.
audience: developer
section: integrations
order: 320
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  paths: release-github-com-looprig-mcp
  trust-boundary:
    - release-github-com-looprig-mcp
    - release-github-com-looprig-harness
  lifecycle: release-github-com-looprig-mcp
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# MCP integration

MCP has four useful product paths: consume a server, publish product-owned tools, adopt a client catalog into Harness, or pass a server definition through to an ACP child. These paths share protocol and transport packages but do not share authority or lifecycle ownership.

## Paths {#paths}

Use `pkg/client` and a selected transport to consume. Use `pkg/server` to publish. Use `pkg/harness` to map a discovered catalog to session-scoped external tools. Use the ACP or foreign driver configuration to pass a child-facing `McpServer` definition without installing it in the parent loop.

## Trust boundary {#trust-boundary}

Connect and discovery establish protocol reachability, not product permission. Prepare an adopted tool call, evaluate the Harness gate, and then invoke the MCP client. A classifier may add risk evidence to that decision, but cannot enlarge the gate or Sandbox authority.

## Lifecycle {#lifecycle}

Construct auth and transport first, then the client, manager, and adopter. Drain calls before closing adopters and managers. A disabled binding stops future tool definitions; it does not retroactively cancel or authorize an in-flight call.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned MCP module](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/). `stage-16-mcp-adoption` covers publication, stdio consumption, adoption, and disable reconfiguration.
