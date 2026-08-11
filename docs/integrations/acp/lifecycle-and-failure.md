---
id: integrations/acp/lifecycle-and-failure
title: ACP lifecycle and failures
description: Close ACP sessions, connections, children, and proxies in order while preserving typed failure categories.
audience: developer
section: integrations
order: 305
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  lifecycle: release-github-com-looprig-acp
  failures: release-github-com-looprig-acp
  limits: release-github-com-looprig-acp
  source-and-runnable-proof: release-github-com-looprig-acp
---

# ACP lifecycle and failures

Treat ACP as a sequence of owned resources: protocol connection, child transport, client session, host callbacks, and optional model proxy. Close in the reverse order of successful construction.

## Lifecycle {#lifecycle}

Stop accepting new prompts, cancel pending work, drain updates and gates, close ACP sessions, close the client connection, then let stdio or the proxy terminate and reap its child. A host agent removes a live session only after its close work is complete. A restored session is a new ownership path, not a reference to a dead process.

## Failures {#failures}

Keep frame-too-large, invalid or truncated frame, closed connection, handler, authentication, session, load-timeout, child command, platform, and exit failures distinct. The caller can then choose whether to reconnect, report, or abandon a session without replaying an unsafe effect.

## Limits {#limits}

ACP bounds frames, nesting, handler concurrency, notification queues, update deduplication, live sessions, and load time. These bounds protect the bridge; they do not guarantee a provider responds. Do not retry a non-idempotent prompt solely because transport state changed.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned protocol and stdio packages](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/). ACP tests cover close and fault paths; `stage-15-acp-foreign` covers live and restored builder registration.
