---
id: integrations/acp/index
title: ACP integration
description: Choose the ACP boundary for driving a child agent or exposing a Harness host.
audience: developer
section: integrations
order: 300
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  choices: release-github-com-looprig-acp
  trust-boundary:
    - release-github-com-looprig-acp
    - release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-acp
---

# ACP integration

ACP is a protocol boundary with two directions. An application can drive a foreign child through `client` and `launch`, or expose a Harness-backed host through `agent`. `protocol` and `transport/stdio` supply the wire and process layers shared by both directions.

## Choices {#choices}

Choose child driving when the provider process owns the agent loop and the product needs typed prompts, updates, permissions, terminal access, or forwarded MCP configuration. Choose host exposure when an ACP client should discover and operate on sessions that the product already owns. `foreignloops` adds neutral driver and restore contracts around the child-facing direction.

## Trust boundary {#trust-boundary}

ACP capability advertisement describes the boundary exposed by the selected options; it is not a grant to a child or remote client. Harness gates, workspace guards, credentials, and Sandbox profiles remain product-owned decisions. Prepare and authorize each effect before invoking a handler, and validate every inbound identifier, path, option, and frame.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned ACP module](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/). `stage-15-acp-foreign` proves the child-facing foreign builder path with a deterministic forwarded MCP definition.
