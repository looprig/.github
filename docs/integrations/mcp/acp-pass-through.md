---
id: integrations/mcp/acp-pass-through
title: Pass MCP definitions through ACP
description: Forward child-facing MCP server definitions without mistaking pass-through for parent Harness adoption.
audience: developer
section: integrations
order: 324
publication: released
examples:
  - stage-15-acp-foreign
  - stage-16-mcp-adoption
proofs:
  forwarding: release-github-com-looprig-foreignloops
  separation: release-github-com-looprig-acp
  parent-boundary:
    - release-github-com-looprig-mcp
    - release-github-com-looprig-harness
  source-and-runnable-proof:
    - release-github-com-looprig-foreignloops
    - release-github-com-looprig-acp
---

# Pass MCP definitions through ACP

`foreignloops/driver/acp.Config.McpServers` carries child-facing MCP server definitions into an ACP launch. The child may then consume them through its own protocol session. This path does not install the definitions into the parent Harness loop.

## Forwarding {#forwarding}

Validate the server descriptor, executable or endpoint, credentials, and intended child posture before building the foreign runtime. Preserve the child-facing list on restore; do not derive a parent adoption binding from it implicitly.

## Separation {#separation}

ACP protocol and launch own forwarding and child lifecycle. MCP client and transport own a child or remote server connection. Foreignloops owns the neutral live/restored builder. Each layer can reject its own configuration and none claims the next layer's authority.

## Parent boundary {#parent-boundary}

If the parent also needs the server's tools, create a separate MCP manager binding and run adoption through Harness preparation and gates. A classifier can record risk for either path but cannot expand the parent gate or Sandbox ceiling.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned ACP driver](https://github.com/looprig/foreignloops/tree/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/) and [ACP protocol](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/protocol/). `stage-15-acp-foreign` forwards one deterministic MCP server without starting a provider.
