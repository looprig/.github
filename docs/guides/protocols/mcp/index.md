---
id: guides/protocols/mcp/index
title: MCP
description: Choose the MCP Serve or MCP Client path, then follow transports, authentication, catalog adoption, sampling, and ACP pass-through.
audience: developer
section: guides
order: 17
publication: released
proofs:
  choose-an-mcp-side:
    - release-github-com-looprig-mcp
  serve-or-consume:
    - release-github-com-looprig-mcp
  follow-the-mcp-boundary:
    - release-github-com-looprig-mcp
  source-and-proof:
    - release-github-com-looprig-mcp
---

# MCP

MCP is the capability boundary for tools, resources, and prompts. The side that serves MCP owns product tool definitions and handlers. The side that consumes MCP owns a named binding, transport, catalog policy, and call lifecycle. The [Protocols overview](/docs/guides/protocols/) shows this path beside ACP without conflating an MCP server with an ACP agent.

## Choose an MCP side

| Path | You own | First page |
| --- | --- | --- |
| MCP Serve | `server.Server`, tool schemas, handlers, and serving streams | [MCP Serve](/docs/guides/protocols/mcp/serve/) |
| MCP Client | `client.Definition`, transport, handlers, catalog, and close | [MCP Client](/docs/guides/protocols/mcp/client/) |

The server and client can be in the same process for tests, or separated by stdio, Streamable HTTP, or explicit legacy SSE. The transport is a byte-moving choice. The client and server remain MCP roles regardless of transport.

## Serve or consume

Use [MCP Serve](/docs/guides/protocols/mcp/serve/) when your product publishes a bounded tool surface. Use [MCP Client](/docs/guides/protocols/mcp/client/) when a host discovers a peer's catalog and decides what the model or Harness may see and call.

For a local child, read [MCP transports](/docs/guides/protocols/mcp/transports/) and then [MCP authentication](/docs/guides/protocols/mcp/auth/) for network credentials. A client does not automatically trust a server's instructions or annotations. They are reported inputs that the host must interpret.

## Follow the MCP boundary

After choosing a side, continue in this order:

1. [MCP transports](/docs/guides/protocols/mcp/transports/) for stdio, Streamable HTTP, and compatibility SSE.
2. [MCP authentication](/docs/guides/protocols/mcp/auth/) for per-request headers and OAuth discovery.
3. [MCP discovery and Harness adoption](/docs/guides/protocols/mcp/harness-adoption/) for candidate generations and idle-boundary toolset replacement.
4. [MCP sampling and reconfiguration](/docs/guides/protocols/mcp/sampling-and-reconfiguration/) for host policy and binding changes.
5. [MCP ACP pass-through](/docs/guides/protocols/mcp/acp-passthrough/) for the one tested collaboration broker seam.

When a catalog tool becomes a model-facing definition, follow [Tools registration](/docs/guides/tools/core-concepts/registration/), [Harness tool calls](/docs/guides/harness/step/tool-calls-and-results/), and [Inference tool requests](/docs/guides/inference/requests/tools/). Model selection remains an Inference concern, not a server instruction.

## Source and proof

The MCP module is released at [github.com/looprig/mcp](https://github.com/looprig/mcp), with server code in [pkg/server](https://github.com/looprig/mcp/tree/main/pkg/server), client code in [pkg/client](https://github.com/looprig/mcp/tree/main/pkg/client), transports in [pkg/transport](https://github.com/looprig/mcp/tree/main/pkg/transport), and Harness adoption in [pkg/harness](https://github.com/looprig/mcp/tree/main/pkg/harness). Their package and example tests prove the paths linked from this overview.
