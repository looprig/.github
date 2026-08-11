---
id: integrations/mcp/sampling
title: MCP sampling and elicitation
description: Route server requests for model sampling or user input to explicit host policies and handlers.
audience: developer
section: integrations
order: 327
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  callbacks: release-github-com-looprig-mcp
  policy: release-github-com-looprig-mcp
  boundary: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# MCP sampling and elicitation

MCP servers may request model sampling, elicitation, roots, progress, logs, or events. The client reports these requests to injected handlers; it does not silently call a model or ask a user.

## Callbacks {#callbacks}

Configure `client.Handlers` with the callbacks the host actually supports. Keep sampling and elicitation request values bounded and validate server-provided metadata before passing it to a model or user interface.

## Policy {#policy}

`harness.SamplingPolicy` and the host callback decide whether sampling is permitted and which model or limits apply. An MCP server's request cannot choose a parent model, credentials, or gate rule by including a larger budget or different provider name.

## Boundary {#boundary}

When an adopted tool triggers sampling, route it through the same session identity and authorization boundary as the original call. A classifier can attach evidence to the request but cannot authorize sampling, elicitation, or a follow-on effect.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned MCP client and Harness adapter](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/). Client and adoption tests cover injected callbacks and denied sampling paths.
