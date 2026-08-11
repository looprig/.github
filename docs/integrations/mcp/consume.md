---
id: integrations/mcp/consume
title: Consume an MCP server
description: Connect, discover, and call an MCP server through an explicit transport and injected host callbacks.
audience: developer
section: integrations
order: 321
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  connect-and-discover: release-github-com-looprig-mcp
  transports: release-github-com-looprig-mcp
  calls: release-github-com-looprig-mcp
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# Consume an MCP server

Create a `client.Definition` with a server identity and one explicit transport factory, then call `client.Connect`. Initialization and discovery produce a bounded catalog of tools, resources, prompts, and completions.

## Connect and discover {#connect-and-discover}

Inspect the catalog before exposing definitions to a loop. Keep server name, endpoint, schema, and discovered tool identity in the binding that owns them. The client does not assume a discovered server is safe to call.

## Transports {#transports}

Choose stdio for a supervised local child, Streamable HTTP for a remote server, or legacy SSE only when its endpoint contract requires it. Transport selection is explicit. A dropped stream does not justify replaying a non-idempotent call.

## Calls {#calls}

Client methods call tools, read resources, get prompts, and complete arguments under bounded request and response limits. Sampling, elicitation, roots, progress, logs, and events flow to injected handlers. Those handlers own model, user, and host decisions; the client does not silently perform them.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned MCP client](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/client/) and [transport packages](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/). `stage-16-mcp-adoption` consumes a deterministic stdio child.
