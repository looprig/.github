---
id: guides/protocols/acp/index
title: ACP
description: Choose the ACP Serve or ACP Client path, then follow framing, session, authentication, and launch boundaries.
audience: developer
section: guides
order: 9
publication: released
proofs:
  choose-an-acp-side:
    - release-github-com-looprig-acp
  serve-or-connect:
    - release-github-com-looprig-acp
  follow-the-acp-boundary:
    - release-github-com-looprig-acp
  source-and-proof:
    - release-github-com-looprig-acp
---

# ACP

ACP is the agent-process boundary. The side that serves ACP owns an agent facade and sessions. The side that connects owns a client facade and the foreign process lifecycle. The [Protocols overview](/docs/guides/protocols/) explains why ACP and MCP remain distinct paths.

## Choose an ACP side

| Path | You own | First page |
| --- | --- | --- |
| ACP Serve | `agent.Agent`, `SessionHost`, and an agent-side `protocol.Conn` | [ACP Serve](/docs/guides/protocols/acp/serve/) |
| ACP Client | `client.Client`, `Session`, and the supervised child process | [ACP Client](/docs/guides/protocols/acp/client/) |

Both sides share the pure [protocol package](https://github.com/looprig/acp/tree/main/protocol). `AgentConn` is the typed surface a client calls on an agent. `ClientConn` is the typed surface an agent calls on a client.

## Serve or connect

Use [ACP Serve](/docs/guides/protocols/acp/serve/) when your product has a Harness-backed session and needs to expose it to another ACP client. Use [ACP Client](/docs/guides/protocols/acp/client/) when your host launches an existing ACP agent and needs prompts, updates, permission requests, filesystem access, or terminals.

Both flows usually run over [ACP stdio framing](/docs/guides/protocols/acp/stdio/). A product integrating Harness should read [ACP host and agent facades](/docs/guides/protocols/acp/host-agent/) before implementing an adapter. The facade is intentionally narrower than a Harness session, so the product retains ownership of loops, storage, workspaces, and policy.

## Follow the ACP boundary

After choosing a side, continue in this order:

1. [ACP sessions and lifecycle](/docs/guides/protocols/acp/sessions/) for new, load, resume, prompt, cancel, close, and delete.
2. [ACP authentication and runtime config](/docs/guides/protocols/acp/auth-and-config/) for optional authentication and fresh config catalogs.
3. [ACP gateways and launch proxy](/docs/guides/protocols/acp/gateway-launch/) for owned, shared, and native launch postures.

When an ACP prompt becomes a Harness turn, follow [Harness steps](/docs/guides/harness/step/) and [Inference model requests](/docs/guides/inference/requests/). When an agent callback invokes a tool, follow [Tools concepts](/docs/guides/tools/core-concepts/) and [Harness gates](/docs/guides/harness/gates/).

## Source and proof

The ACP module is released at [github.com/looprig/acp](https://github.com/looprig/acp), with the typed wire surface in [protocol](https://github.com/looprig/acp/tree/main/protocol), the agent facade in [agent](https://github.com/looprig/acp/tree/main/agent), and the client facade in [client](https://github.com/looprig/acp/tree/main/client). Their package tests prove the boundaries linked from this overview.
