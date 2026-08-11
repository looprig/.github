---
id: integrations/acp/drive-child
title: Drive an ACP child
description: Configure a typed ACP client, supervised child transport, and optional host callbacks.
audience: developer
section: integrations
order: 301
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  configure: release-github-com-looprig-acp
  callbacks: release-github-com-looprig-acp
  lifecycle: release-github-com-looprig-acp
  source-and-runnable-proof: release-github-com-looprig-acp
---

# Drive an ACP child

Build `stdio.Command` and `client.Options`, then construct a lazy `client.Client`. `Dial` owns the connection and child after the start succeeds. A session is created or loaded through the typed client rather than by sending ad hoc JSON-RPC frames.

## Configure {#configure}

Supply only the filesystem, terminal, permission, update, steering, and authentication handlers the host intends to expose. `launch.Config` or `launch.NativeConfig` can build adapter command and environment shape; credentials and model policy stay with the caller. A foreign ACP driver can carry these values into a neutral Harness builder.

## Callbacks {#callbacks}

Child requests are callbacks into host-owned resources. Validate session IDs and resource identifiers before calling a workspace or terminal handler. A gate decision belongs immediately before the effectful callback; an ACP prompt or update is not itself proof that the effect is allowed.

## Lifecycle {#lifecycle}

The client starts lazily and shares one start attempt among concurrent callers. Admit one prompt per ACP session, consume updates, cancel pending work explicitly, close sessions, and then close the client. Stdio reaps the child; the caller should not kill a process behind the transport's lifecycle.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned client](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/) and [stdio transport](https://github.com/looprig/acp/tree/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/). `stage-15-acp-foreign` exercises configuration without requiring a provider binary.
