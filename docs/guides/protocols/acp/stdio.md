---
id: guides/protocols/acp/stdio
title: ACP stdio framing
description: Understand ACP newline-delimited framing, JSON-RPC dispatch, size limits, and supervised process streams.
audience: developer
section: guides
order: 13
publication: released
proofs:
  two-wire-layers:
    - release-github-com-looprig-acp
  ndjson-frame-boundary:
    - release-github-com-looprig-acp
  connection-dispatch:
    - release-github-com-looprig-acp
  process-supervision:
    - release-github-com-looprig-acp
  source-and-proof:
    - release-github-com-looprig-acp
---

# ACP stdio framing

ACP stdio carries one bidirectional `protocol.Conn` over a child process's stdin and stdout. It has two wire layers: newline-delimited JSON frames, then JSON-RPC 2.0 envelopes. The transport does not interpret ACP method names. The typed protocol layer does not own process groups.

## Two wire layers

`protocol.FrameReader` turns an `io.Reader` into bounded frames. `protocol.Writer` serializes concurrent sends into newline-terminated frames on an `io.Writer`. `protocol.ParseEnvelope` validates message size and nesting depth before decoding a request, response, or notification. The ACP generated types and method constants sit above that pure JSON-RPC layer.

```go
// The same Conn shape is used by an agent or a client transport.
conn := protocol.NewConn(reader, writer, protocol.ConnOptions{})
agent := protocol.NewAgentConn(conn)
response, err := agent.Initialize(ctx, protocol.InitializeRequest{
	ProtocolVersion: protocol.CurrentProtocolVersion,
})
if err != nil {
	panic(err)
}
_ = response
```

`NewAgentConn` and `NewClientConn` are facades over the same connection. They do not add framing behavior. Notifications such as `session/cancel` and `session/update` have no response; requests use the connection's pending-call table and a response ID.

## NDJSON frame boundary

The framing contract is deliberately small: one JSON document per line, with the trailing newline written by `Writer`. Untrusted bytes are checked before JSON decoding. The release sets `MaxMessageBytes` to 4 MiB and `MaxNestingDepth` to 128. A frame that is too large, truncated, invalid, or missing its newline is rejected as a transport or parse failure, not guessed into an ACP value.

The connection also bounds handler concurrency with `MaxInFlightHandlers` and buffers a finite number of notifications for methods that are registered after traffic begins. A single reader and single writer prevent competing goroutines from corrupting the stream.

## Connection dispatch

`protocol.Conn` routes an incoming envelope in one read loop. Requests go to a method handler and receive a JSON-RPC response. Notifications go to a notification handler and never receive a response. Responses resolve a pending outgoing call by ID. A handler error becomes a typed wire fault when it wraps `*protocol.Fault`; other errors are classified as internal errors while the original cause stays local.

Close fails all in-flight calls with `ConnClosedError`, closes the writer, and unblocks the read loop. A peer disconnect is a connection event, not an ACP method error. Use `Conn.Done()` and `Conn.Close()` from the typed facade when a host needs to coordinate shutdown.

## Process supervision

`transport/stdio.Spawn` starts a validated `stdio.Command` as a process-group leader. Its stdin and stdout are the ACP streams. Stderr is drained into a bounded ring and surfaced in an `ExitError` when the child exits abnormally. Context cancellation performs the same interrupt, grace-period, and process-group kill sequence as explicit teardown.

```go
// The client side owns the child and must close the Proc after the Conn.
proc, err := stdio.Spawn(ctx, stdio.Command{
	Path: "/absolute/path/to/agent",
	Args: []string{"--stdio"},
})
if err != nil {
	panic(err)
}
conn := protocol.NewConn(proc.Stdout, proc.Stdin, protocol.ConnOptions{})
defer func() {
	_ = conn.Close()
	_ = proc.Wait()
}()
_ = conn
```

On the agent side, `stdio.Serve` wires context cancellation to the streams and closes the connection. This is why protocol shutdown and process shutdown remain separate calls with a clear order.

Once a frame becomes a Harness event, follow the [Harness events guide](/docs/guides/harness/events/) and [Harness session guide](/docs/guides/harness/session-runtime/). If the frame carries a tool call, use the [Tools result guide](/docs/guides/tools/core-concepts/) and the [Inference streaming guide](/docs/guides/inference/streaming/) for the model-facing content boundary.

## Source and proof

The wire implementation is in [framing.go](https://github.com/looprig/acp/blob/main/protocol/framing.go), [jsonrpc.go](https://github.com/looprig/acp/blob/main/protocol/jsonrpc.go), [conn.go](https://github.com/looprig/acp/blob/main/protocol/conn.go), and [acp.go](https://github.com/looprig/acp/blob/main/protocol/acp.go). Process behavior is in [stdio/spawn.go](https://github.com/looprig/acp/blob/main/transport/stdio/spawn.go) and [stdio/serve.go](https://github.com/looprig/acp/blob/main/transport/stdio/serve.go), with coverage in [framing tests](https://github.com/looprig/acp/blob/main/protocol/framing_test.go) and [stdio tests](https://github.com/looprig/acp/blob/main/transport/stdio/stdio_test.go).
