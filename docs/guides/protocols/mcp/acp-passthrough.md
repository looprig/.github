---
id: guides/protocols/mcp/acp-passthrough
title: MCP ACP pass-through
description: Document the tested collaboration broker seam that forwards an authenticated MessageAgent request without inventing a generic MCP to ACP bridge.
audience: developer
section: guides
order: 24
publication: released
proofs:
  what-pass-through-means-here:
    - release-github-com-looprig-mcp
    - release-github-com-looprig-acp
  authenticate-before-forwarding:
    - release-github-com-looprig-mcp
  validate-before-dial:
    - release-github-com-looprig-mcp
  result-boundary:
    - release-github-com-looprig-mcp
  source-and-proof:
    - release-github-com-looprig-mcp
    - release-github-com-looprig-acp
---

# MCP ACP pass-through

The released MCP code proves one narrow pass-through path: the `collab` package's `MessageAgent` operation sends a validated agent message through an authenticated local broker. It is used by the MCP collaboration process. This is not a generic MCP transport that forwards arbitrary ACP JSON-RPC, and the package does not import ACP types.

## What pass-through means here

The example uses a Unix-domain socket broker and a fixed capability handshake. The client sends a 32-byte capability as a length-prefixed binary frame, then sends one length-prefixed JSON `MessageAgentRequest`. The broker returns a public `DelegateResult` with agent ID, display name, state, delivery status, response status, and response text. Internal request IDs and controller details are not exposed.

```go
// MessageAgent is a collaboration operation, not an arbitrary ACP method.
request := collab.MessageAgentRequest{
	AgentID:         "11111111-1111-4111-8111-111111111111",
	Message:         "Review this change.",
	WaitForResponse: true,
}
result, err := broker.MessageAgent(ctx, request)
if err != nil {
	panic(err)
}
fmt.Println(result.DeliveryStatus, result.Response)
```

The connection is per call, so mutable broker state is not shared between concurrent requests. The endpoint is an absolute local path. The capability is accepted from the fixed environment contract or explicit config, never from process arguments.

## Authenticate before forwarding

The handshake compares the supplied capability before the broker reads the request. An unauthenticated peer is closed without a diagnostic that could reveal broker state. The capability is not JSON and is not included in the public result. The broker may derive identity and correlation from the authenticated capability and runtime context instead of trusting fields in the model-visible request.

This local broker boundary is separate from the ACP `protocol.Conn` boundary described in [ACP stdio framing](/docs/guides/protocols/acp/stdio/). If a product needs ACP session methods, it must build an ACP client or agent facade explicitly. The pass-through example proves only the collaboration message contract.

## Validate before dial

`collab.Client.MessageAgent` validates the request before dialing. It rejects missing or malformed UUIDs, empty messages, unknown fields, invalid timeout bounds, and oversized argument JSON without opening the socket. The example test records this property as `invalid-rejected-before-dial=true`.

```go
// Invalid input is rejected locally. No broker connection is attempted.
_, err := broker.MessageAgent(ctx, collab.MessageAgentRequest{
	AgentID: "not-a-uuid",
	Message: "This must be rejected locally.",
})
if !errors.Is(err, collab.ErrInvalidRequest) {
	panic(err)
}
```

Admission and response reads are bounded by connect, admission, and caller deadlines. A canceled context closes the socket. Frames are bounded before decoding, and malformed delegate results are rejected rather than partially projected.

## Result boundary

`DelegateResult` deliberately contains no arbitrary ACP response, no internal correlation ID, and no controller handle. It is a public, correlation-free projection for the MCP tool result. Keep that narrow boundary when composing a collaboration tool into Harness. The model can ask to message an agent, but it cannot choose a broker endpoint, capability, internal request ID, or unrestricted session method.

The [Tools safety guide](/docs/guides/tools/safety/) explains why the MessageAgent tool still needs a permission policy. The [Harness delegation guide](/docs/guides/harness/delegation/) explains how an agent-to-agent request is represented above this broker seam.

## Source and proof

The broker DTOs, handshake, bounds, and client are in [pkg/collab/protocol.go](https://github.com/looprig/mcp/blob/main/pkg/collab/protocol.go) and [pkg/collab/client.go](https://github.com/looprig/mcp/blob/main/pkg/collab/client.go). The proof is the [ACP pass-through example](https://github.com/looprig/mcp/blob/main/examples/acp-passthrough/main.go) and its [example test](https://github.com/looprig/mcp/blob/main/examples/acp-passthrough/main_test.go).
