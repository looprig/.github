---
id: guides/protocols/acp/serve
title: ACP Serve
description: Expose a Harness-backed ACP agent through the agent facade, capability advertisement, sessions, and client callbacks.
audience: developer
section: guides
order: 10
publication: released
proofs:
  agent-facade-and-registration:
    - release-github-com-looprig-acp
  capability-advertisement-is-configuration:
    - release-github-com-looprig-acp
  serve-a-connection:
    - release-github-com-looprig-acp
  client-served-callbacks:
    - release-github-com-looprig-acp
  source-and-proof:
    - release-github-com-looprig-acp
---

# ACP Serve

ACP Serve is the agent-side path. Your process owns an `agent.Agent`, provides a `SessionHost`, and registers typed handlers on one `protocol.Conn`. The facade translates ACP requests into the host's narrow session interfaces. It does not expose Harness internals or let a peer bypass the session boundary.

## Agent facade and registration

`agent.New` validates the capability options. `Host` is required. Optional interfaces such as `Replayer`, `Catalog`, `Authenticator`, `Logout`, and the runtime configuration interfaces determine which capabilities are advertised and which methods are registered. A nil optional interface means that feature is not supported.

```go
package main

import (
	"context"
	"os"

	"github.com/looprig/acp/agent"
	"github.com/looprig/acp/protocol"
	"github.com/looprig/acp/transport/stdio"
)

// host implements agent.SessionHost in the product layer. It owns the
// Harness runtime and returns only the LiveSession data plane ACP needs.
type host struct{}

func (host) NewSession(context.Context, agent.Setup) (agent.LiveSession, error) { return nil, nil }
func (host) LoadSession(context.Context, agent.SessionID, agent.Setup) (agent.LoadedSession, error) {
	return agent.LoadedSession{}, nil
}
func (host) ResumeSession(context.Context, agent.SessionID, agent.Setup) (agent.LiveSession, error) {
	return nil, nil
}

func main() {
	// The facade owns ACP method registration, while the host owns sessions.
	facade, err := agent.New(agent.Options{Host: host{}})
	if err != nil {
		panic(err)
	}
	conn := protocol.NewConn(os.Stdin, os.Stdout, protocol.ConnOptions{})
	facade.Register(conn)
	// Serve closes the streams when ctx is cancelled and waits for Conn to end.
	if err := stdio.Serve(context.Background(), os.Stdin, os.Stdout, conn); err != nil {
		panic(err)
	}
}
```

The example shows the ownership split, not a fake in-process Harness. A real `SessionHost` must return a live session for each accepted setup and must keep secrets out of errors because host errors can become ACP fault messages.

The released Go module is `go:github.com/looprig/acp`; the package import paths used in examples are `github.com/looprig/acp/agent`, `github.com/looprig/acp/protocol`, and `github.com/looprig/acp/transport/stdio`.

## Capability advertisement is configuration

The facade computes `protocol.AgentCapabilities` from `agent.Options`. Session creation is gated by `AuthorizeSessionCreation` when an authenticator is configured. MCP setup is also explicit: a `Setup` carrying `MCPServers` is accepted only when the host advertised acceptance. This prevents a client from believing that a server descriptor was installed when the host silently dropped it.

The core agent methods are typed on `protocol.AgentConn`: `Initialize`, `Authenticate`, `NewSession`, `LoadSession`, `ResumeSession`, `ListSessions`, `CloseSession`, `DeleteSession`, `Prompt`, `Cancel`, and runtime config calls. They all use one underlying `Conn`, so request correlation and framing remain in the protocol package.

## Serve a connection

`transport/stdio.Serve` is the agent-side process loop. Build the `protocol.Conn` over the process's standard input and output, register the facade, then pass the same streams to `Serve`. Cancellation closes the transport to unblock a read or write. A peer disconnect ends the connection normally; context cancellation returns the context error.

Do not write logs to stdout after serving starts. Stdout carries ACP frames. Diagnostics belong on stderr or in a product-owned logger that does not share the protocol writer.

## Client-served callbacks

An agent can call back through `protocol.ClientConn` for `session/request_permission`, `fs/read_text_file`, `fs/write_text_file`, `terminal/create`, and terminal operations. `session/update` is a notification in the opposite direction. A Harness-backed host normally implements those callbacks with permission gates, workspace file APIs, and terminal ownership.

The [ACP Client](/docs/guides/protocols/acp/client/) page shows the host side that answers these calls. For the runtime meaning of a tool call or gate, follow [Harness step tool calls](/docs/guides/harness/step/tool-calls-and-results/) and [Tools safety and gates](/docs/guides/tools/safety/).

## Source and proof

Read the [agent facade source](https://github.com/looprig/acp/blob/main/agent/agent.go), [host contracts](https://github.com/looprig/acp/blob/main/agent/host.go), [setup validation](https://github.com/looprig/acp/blob/main/agent/setup.go), and [agent tests](https://github.com/looprig/acp/tree/main/agent) for the behavior described here.
