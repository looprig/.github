---
id: guides/protocols/acp/host-agent
title: ACP host and agent facades
description: Map ACP host, agent, protocol, and Harness boundaries without leaking product configuration into the wire layer.
audience: developer
section: guides
order: 12
publication: released
proofs:
  three-boundaries:
    - release-github-com-looprig-acp
  sessionhost-and-livesession:
    - release-github-com-looprig-acp
  setup-is-negotiated-input:
    - release-github-com-looprig-acp
  facade-to-harness-mapping:
    - release-github-com-looprig-acp
  source-and-proof:
    - release-github-com-looprig-acp
---

# ACP host and agent facades

The ACP bridge is easiest to reason about as three layers:

| Layer | Public type | Owns |
| --- | --- | --- |
| wire | `protocol.Conn`, `AgentConn`, `ClientConn` | framing, JSON-RPC correlation, typed method names and values |
| agent facade | `agent.Agent`, `agent.SessionHost` | advertised agent capabilities and session method translation |
| client facade | `client.Client`, `client.Session` | foreign process lifecycle, client callbacks, prompts, and updates |

The facades are intentionally consumer-owned adapters. Neither imports Harness. The product integrates them by implementing the narrow interfaces and mapping Harness events, tools, gates, and storage at the edge.

## Three boundaries

`protocol` is a pure wire package. `Conn` routes JSON-RPC requests, notifications, and responses without knowing whether the method is `session/prompt` or `terminal/output`. `AgentConn` exposes methods the client calls on the agent. `ClientConn` exposes methods the agent calls on the client.

`agent` is the server-side facade. It calls `SessionHost` and optional capability interfaces, validates setup and IDs, and translates live events into `session/update`. `client` is the host-side facade. It launches a process through stdio, drives the agent methods, and dispatches callbacks into host-provided handlers.

## SessionHost and LiveSession

`SessionHost` has exactly three session-establishment methods:

```go
// A product adapter implements this interface around its Harness runtime.
type SessionHost interface {
	NewSession(context.Context, agent.Setup) (agent.LiveSession, error)
	LoadSession(context.Context, agent.SessionID, agent.Setup) (agent.LoadedSession, error)
	ResumeSession(context.Context, agent.SessionID, agent.Setup) (agent.LiveSession, error)
}
```

The returned `LiveSession` is the data plane ACP needs: `SessionID`, `Submit`, `SubscribeEvents`, `RespondGate`, and `Interrupt`. A full Harness session may expose more methods, but the ACP facade does not receive a broad runtime object. `LoadedSession` adds the durable replay anchor used by `session/load`.

The [Harness session guide](/docs/guides/harness/session-runtime/) explains the runtime that can satisfy this seam. The [Harness turn guide](/docs/guides/harness/turn/) explains why `Submit` is asynchronous while ACP `session/prompt` waits for a terminal response.

## Setup is negotiated input

`agent.NewSetup` validates an absolute, canonical cwd, applies defaults to `protocol.ClientCapabilities`, and rejects MCP server descriptors unless the host accepted MCP setup. The `Setup` value contains negotiated client capabilities and `MCPServers` descriptors, not a `rig.SessionOption` or a product configuration object.

```go
// Validate before handing untrusted wire input to the host.
setup, err := agent.NewSetup(
	"/workspace",
	nil, // use protocol.DefaultClientCapabilities
	[]protocol.McpServer{},
	false, // no MCP descriptors are being accepted here
)
if err != nil {
	panic(err)
}
_ = setup.ClientCapabilities
```

The setup boundary is why ACP can link to MCP without making ACP own MCP. The agent accepts descriptors as negotiated session input; an MCP client or server still owns the MCP handshake and transport.

## Facade-to-Harness mapping

Use the mapping below when integrating a product:

| ACP concern | Facade seam | Typical Harness owner |
| --- | --- | --- |
| `session/prompt` | `LiveSession.Submit` and event subscription | Loop and Session runtime |
| `session/request_permission` | `LiveSession.RespondGate` and `ClientConn.RequestPermission` | Tools permissions and gates |
| `session/update` | `ClientConn.SessionUpdate` | event translation and UI/client stream |
| `fs/*` | client `FSHandler` | workspace and sandbox boundary |
| `terminal/*` | client `TerminalHandler` | process supervisor and session ownership |
| model or mode selection | `RuntimeConfigCatalog` and `RuntimeConfigController` | loop controller and inference model selection |

The [Tools registration guide](/docs/guides/tools/core-concepts/registration/) and [Inference model selection guide](/docs/guides/inference/requests/model-selection/) describe the runtime contracts that these adapters should preserve.

## Source and proof

The layer split is implemented in [protocol/acp.go](https://github.com/looprig/acp/blob/main/protocol/acp.go), [protocol/conn.go](https://github.com/looprig/acp/blob/main/protocol/conn.go), [agent/host.go](https://github.com/looprig/acp/blob/main/agent/host.go), [agent/setup.go](https://github.com/looprig/acp/blob/main/agent/setup.go), and [client/client.go](https://github.com/looprig/acp/blob/main/client/client.go). Contract tests live beside those packages, including [setup tests](https://github.com/looprig/acp/blob/main/agent/setup_test.go) and [client dispatch tests](https://github.com/looprig/acp/blob/main/client/dispatch_internal_test.go).
