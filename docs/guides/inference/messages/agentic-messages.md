---
id: guides/inference/messages/agentic-messages
title: AgenticMessages
description: Preserve an ordered, mixed conversation thread for inference requests.
audience: developer
section: guides
order: 15
publication: released
proofs:
  api-surface: [release-github-com-looprig-core]
  lifecycle: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# AgenticMessages

`AgenticMessages` is a named slice of sealed conversation turns. Its zero value is an empty thread, so a caller can build a request incrementally without a constructor.

## API surface

```go
type AgenticMessages []Conversation
```

```go
thread := content.AgenticMessages{}
thread = append(thread,
	&content.UserMessage{Message: content.Message{
		Role: content.RoleUser,
		Blocks: []content.Block{&content.TextBlock{Text: "Hello"}},
	}},
	&content.AIMessage{Message: content.Message{
		Role: content.RoleAssistant,
		Blocks: []content.Block{&content.TextBlock{Text: "Hi"}},
	}},
)
```

The slice preserves every turn's concrete type and block order. It does not expose append, truncation, token counting, or role validation helpers; callers own thread policy and should run request feature validation before invoking a client.

## Lifecycle

1. Append system, user, and prior assistant turns in provider-neutral order.
2. Invoke with `inference.Request.Messages`.
3. Append the returned `AIMessage` if another turn is needed.
4. For a tool call, append a matching `ToolResultMessage` before the next assistant invocation.

Do not mutate a thread concurrently with a client that is encoding it. The slice and its blocks are ordinary Go values with no synchronization.

## Proof

- Source: [`core/content/message.go`](https://github.com/looprig/core/blob/main/content/message.go)
- Tests: [`core/content/message_test.go`](https://github.com/looprig/core/blob/main/content/message_test.go) covers nil, empty, and mixed four-type threads.
- Example: [`core/examples/content/example_test.go`](https://github.com/looprig/core/blob/main/examples/content/example_test.go)

Related: [Conversation](/docs/guides/inference/messages/conversation/), [Request messages](/docs/guides/inference/requests/messages/).
