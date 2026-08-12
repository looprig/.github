---
id: agents/repositories/acp
title: ACP protocol and process bridge
description: Run ACP agents or connect to them over the typed JSON-RPC and stdio layers.
audience: agent
section: agents/repositories
order: 1
publication: released
proofs:
  module:
    - release-github-com-looprig-acp
---
# acp

`github.com/looprig/acp@v0.2.2` exposes five Go packages: `agent`, `client`, `launch`, `protocol`, and `transport/stdio`. It directly requires `core` and `harness`; the release record is the install boundary.

Use `agent.New(agent.Options{Host: host})`, then `Register(protocol.NewConn(...))` and `stdio.Serve` for an agent process. Use `client.New(stdio.Command, client.Options)` for a lazy foreign-agent client, or `client.Dial` for construct and connect in one call. `launch.Dial` and `launch.DialNative` select managed command configurations.

The client performs one initialize handshake, tracks sessions, delivers updates, and must be closed. `stdio.Serve` closes the connection when context ends. Missing host, invalid authentication configuration, failed initialize, process exit, protocol errors, and closed-client use are typed failures. Register only capabilities backed by non-nil handlers.

Proofs: [`agent/agent.go`](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/agent/agent.go), [`client/client.go`](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/client/client.go), [`launch/managed.go`](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/managed.go), [`transport/stdio/spawn_integration_test.go`](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/spawn_integration_test.go).
