---
id: modules/acp
title: Agent Client Protocol bridge
description: Drive foreign ACP children or expose a Harness host through typed protocol, client, agent, launch, and stdio packages.
audience: developer
section: modules
order: 17
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  boundary:
    - release-github-com-looprig-acp
  composition:
    - release-github-com-looprig-acp
    - release-github-com-looprig-harness
  lifecycle:
    - release-github-com-looprig-acp
  errors-and-limits:
    - release-github-com-looprig-acp
  runnable-proof:
    - release-github-com-looprig-acp
---

# Agent Client Protocol bridge

ACP `v0.2.2` is a reusable bridge for the Agent Client Protocol. Its protocol and stdio packages are pure wire and process layers; client and launch drive a child; agent exposes a host. Install the immutable release `github.com/looprig/acp@v0.2.2` when a product needs that boundary.

## Boundary {#boundary}

`protocol.Conn` handles bounded JSON-RPC framing and dispatch. `protocol.AgentConn` and `ClientConn` add typed ACP method surfaces. `client.Client` owns a child-facing connection and live sessions. `agent.Agent` owns a host-facing connection and translates ACP requests to the supplied host interfaces. `transport/stdio` owns process spawn and reaping. No ACP package makes Harness or Core a wire dependency.

## Composition {#composition}

For a child, build `stdio.Command`, `client.Options`, and a session, then provide filesystem, terminal, permission, and update handlers only when the host intends to expose those capabilities. For a host, provide the session catalog and live-session interfaces to `agent.Options`; the agent advertises only the capabilities the options support. `launch` adds adapter-specific command and environment configuration and can pair the connection with a model proxy without importing a concrete proxy module.

## Lifecycle {#lifecycle}

Client startup is lazy and shared by concurrent callers; a failed start can be retried. One prompt is admitted per ACP session. Agent close drains prompts, cancels pending gates, invokes optional host shutdown, and only then removes the live session. Stdio closes the protocol stream before terminating and reaping the child. Native and proxy launch paths close their owned resources in reverse order.

## Errors and limits {#errors-and-limits}

Use bounded protocol frame and message errors, closed-connection errors, session state errors, authentication errors, handler errors, and process exit errors. Limits include 4 MiB messages, 128 nesting depth, bounded in-flight handlers, notify queues, live sessions, update queues, and a 90-second load timeout. Native integration support is adapter-specific; Gemini currently supplies environment wiring rather than an ACP connector.

## Runnable proof {#runnable-proof}

`stage-15-acp-foreign` verifies live and restored ACP builders with one forwarded MCP server without requiring a real child binary. Run it with `node scripts/docs/run-examples.mjs`. Read the [pinned protocol](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/), [client](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/), and [host agent](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/).
