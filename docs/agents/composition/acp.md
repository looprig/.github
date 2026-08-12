---
id: agents/composition/acp
title: Expose or drive agents with ACP
description: Compose ACP agent, client, launch, and stdio transport boundaries.
audience: agent
section: agents/composition
order: 6
publication: released
proofs:
  acp:
    - release-github-com-looprig-acp
  foreign:
    - release-github-com-looprig-foreignloops
---
# ACP

To expose a native or adapted Loop, construct `agent.New(agent.Options{Host, ...})`, register each `*protocol.Conn` with `Agent.Register`, and serve the connection with `transport/stdio.Serve(ctx, reader, writer, conn)` or another protocol transport. `agent.NewSetup` validates cwd, client capabilities, MCP descriptors, and the accept-MCP flag before a session is created.

To drive an external ACP agent, create `client.New(stdio.Command, client.Options{...})` or call `client.Dial(ctx, command, options)`. For managed native launches, `launch.Dial` and `launch.DialNative` select a connector from `launch.Config`. Keep process ownership in the launch or stdio layer; keep session identity and event translation in the ACP adapter.

Lifecycle: initialize and negotiate capabilities, authenticate if configured, create or resume a session, stream notifications and permission requests, then close the client or agent before releasing the process. A live session must be closed before deletion. Preserve both Looprig and foreign session IDs when adapting resume.

Invariants: host is non-nil, advertised auth methods match the authenticator, protocol IDs are validated, and transport EOF becomes a typed lifecycle result. Never expose secrets in protocol diagnostics. Treat remote process death, protocol errors, auth failures, unsupported capabilities, and `ErrSessionStillLive` as separate outcomes.

Proofs: [`acp/agent/agent.go`](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/agent.go), [`acp/client/client.go`](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/client.go), [`acp/transport/stdio/serve.go`](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/serve.go).
