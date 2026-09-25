---
id: guides/inference/requests/system-instructions
title: System instructions
description: Set per-call system instruction separately from conversation history.
audience: developer
section: guides
order: 34
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  separation-from-history: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# System instructions

`Request.System` is the per-agent system instruction string. It is separate from `Request.Messages`, so a caller can change the instruction for one invocation without rewriting the history thread.

## API surface

```go
request := inference.Request{
	System: "You are a careful release engineer. Cite evidence.",
	Messages: content.AgenticMessages{
		&content.UserMessage{Message: content.Message{
			Role: content.RoleUser,
			Blocks: []content.Block{&content.TextBlock{Text: "Review the change."}},
		}},
	},
}
```

The field is a plain string with no inference-layer constructor or validation beyond whatever provider codec policy applies. A system instruction is not automatically converted into a `SystemMessage`; choose the representation deliberately.

## Separation from history

Use `Request.System` for request-scoped behavior. Use [SystemMessage](/docs/guides/inference/messages/message-types/system-message) when a system turn is part of the ordered `AgenticMessages` conversation and must survive as history. This distinction matters for caching and provider codecs that treat system content specially.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/v0.13.0/client.go), [`core/content/message.go`](https://github.com/looprig/core/blob/v0.11.0/content/message.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/v0.13.0/client_test.go), [`core/content/message_test.go`](https://github.com/looprig/core/blob/v0.11.0/content/message_test.go)

Related: [Conversation input](/docs/guides/inference/requests/messages), [SystemMessage](/docs/guides/inference/messages/message-types/system-message).
