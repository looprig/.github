---
id: guides/inference/requests/messages
title: Conversation input
description: Supply ordered AgenticMessages as the conversation input to a request.
audience: developer
section: guides
order: 35
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  conversation-policy: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Conversation input

`Request.Messages` carries an ordered `content.AgenticMessages` thread. The request does not copy or normalize it, so the caller should finish construction before invoking the client and avoid concurrent mutation.

## API surface

```go
request := inference.Request{
	Messages: content.AgenticMessages{
		&content.SystemMessage{Message: content.Message{
			Role: content.RoleSystem,
			Blocks: []content.Block{&content.TextBlock{Text: "Be precise."}},
		}},
		&content.UserMessage{Message: content.Message{
			Role: content.RoleUser,
			Blocks: []content.Block{&content.TextBlock{Text: "Explain this chart."}},
		}},
	},
}
```

Messages may contain any sealed block variant. Before encoding, `ValidateRequestFeatures` recursively looks for `ImageBlock` values, including images inside `ToolResultBlock.Content`, and compares that usage with `Model.Caps.AcceptsImages`.

## Conversation policy

Keep the system prompt in `Request.System` when it is a per-agent instruction that should not become a history turn. Use a `SystemMessage` when the provider-neutral conversation itself needs that typed turn. Append returned `AIMessage` and matching `ToolResultMessage` values in order for an agentic loop.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/main/client.go), [`core/content/message.go`](https://github.com/looprig/core/blob/main/content/message.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/main/client_test.go), [`core/content/message_test.go`](https://github.com/looprig/core/blob/main/content/message_test.go)

Related: [AgenticMessages](/docs/guides/inference/messages/agentic-messages/), [System instructions](/docs/guides/inference/requests/system-instructions/), [ImageBlock](/docs/guides/inference/content-blocks/image/).
