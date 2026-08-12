---
id: guides/protocols/acp/sessions
title: ACP sessions and lifecycle
description: Follow ACP session establishment, prompt correlation, updates, replay, cancellation, close, and delete.
audience: developer
section: guides
order: 14
publication: released
proofs:
  establish-a-session:
    - release-github-com-looprig-acp
  prompt-is-a-terminal-operation:
    - release-github-com-looprig-acp
  replay-and-resume-are-different:
    - release-github-com-looprig-acp
  close-before-delete:
    - release-github-com-looprig-acp
  source-and-proof:
    - release-github-com-looprig-acp
---

# ACP sessions and lifecycle

ACP session methods have different promises. `session/new` creates a live session. `session/load` reconstructs durable history before handing control to a live session. `session/resume` restores a session without replaying previous messages. `session/prompt` waits for one correlated turn to reach a terminal event. `session/close` drains and shuts down live work. `session/delete` removes durable history only after the session is no longer live.

## Establish a session

The client sends `NewSessionParams` with an absolute cwd, additional directories, and a present MCP server list. The agent validates that input through `NewSetup`, applies capability defaults, and calls `SessionHost.NewSession`. The agent registers the returned `LiveSession` under the protocol session ID before the response is complete.

```go
// Establishing the session carries the MCP descriptors the agent accepted.
session, err := c.NewSession(ctx, client.NewSessionParams{
	Cwd: "/workspace",
	McpServers: []protocol.McpServer{},
})
if err != nil {
	panic(err)
}
fmt.Println("ACP session:", session.ID())
```

`session/load` uses `EventReplayer` and returns replayed user messages, assistant messages, completed tool calls, and the latest context measurement from durable events. `session/resume` calls `SessionHost.ResumeSession` and sends no replay updates. That difference is observable and is why a host should choose the method that matches its persistence contract.

## Prompt is a terminal operation

Harness `Submit` returns a command ID and emits turn events later. ACP `session/prompt` has a request/response shape, so the agent facade subscribes to events before submitting, matches `TurnStarted.Header.Cause.CommandID`, captures the loop and turn coordinates, and then ignores interleaved events from other turns. It completes only on the correlated `TurnDone`, `TurnFailed`, or `TurnInterrupted` event. `session/cancel` is the notification path for interrupting the in-flight prompt.

```go
// The client waits for the terminal prompt result while updates are delivered
// on the same session's update channel.
result, err := session.Prompt(ctx, []protocol.ContentBlock{
	{Text: &protocol.TextContent{Text: "Run the checks."}},
})
if err != nil {
	panic(err)
}
fmt.Println("stop reason:", result.StopReason)
```

Progress events are translated to `session/update`. Ephemeral token and tool-progress events are not durable, so load replay must not pretend to reproduce them. Public visibility is a security boundary: internal Harness events do not cross into ACP updates.

## Replay and resume are different

The replay path groups durable history into ACP messages and completed tool calls, then sends one final metadata update for context usage. It does not translate a `TurnDone.Message` a second time because that would duplicate content already reconstructed from `StepDone` events. Resume has no replay anchor and therefore responds with the live session's current state only.

The [Harness events guide](/docs/guides/harness/events/) explains event durability and visibility. The [Inference streaming guide](/docs/guides/inference/streaming/) explains why live deltas and terminal results are separate content streams.

## Close before delete

`session/close` is an orchestration, not a registry delete:

1. Mark the session closing and reject new prompts.
2. Interrupt in-flight work.
3. Resolve outstanding permission requests owned by the connection.
4. Wait for the current prompt to drain.
5. Call the optional `SessionCloser.Shutdown` with the close grace period.
6. Remove the live session from the registry.

`session/delete` is separate. It rejects a still-live session before calling `SessionDeleter`, protecting durable history from deletion underneath a running turn. A caller should close first, then delete when the product's authorization policy permits it.

## Source and proof

The lifecycle handlers are in [agent/session.go](https://github.com/looprig/acp/blob/main/agent/session.go), [agent/replay.go](https://github.com/looprig/acp/blob/main/agent/replay.go), [agent/resume.go](https://github.com/looprig/acp/blob/main/agent/resume.go), [agent/prompt.go](https://github.com/looprig/acp/blob/main/agent/prompt.go), [agent/close.go](https://github.com/looprig/acp/blob/main/agent/close.go), and [agent/delete.go](https://github.com/looprig/acp/blob/main/agent/delete.go). Coverage includes [session tests](https://github.com/looprig/acp/blob/main/agent/session_test.go), [prompt tests](https://github.com/looprig/acp/blob/main/agent/prompt_test.go), and [close tests](https://github.com/looprig/acp/blob/main/agent/close_test.go).
