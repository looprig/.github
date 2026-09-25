---
id: guides/inference/responses/assistant-message
title: Assistant messages
description: Consume the AIMessage returned by an invocation without parsing provider JSON.
audience: developer
section: guides
order: 42
publication: released
proofs:
  read-variants: [release-github-com-looprig-inference]
  tool-call-continuation: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Assistant messages

`Response.Message` is a pointer to `content.AIMessage`. The pointer is nil when a serving path has no assistant representation; when present, its `Blocks` slice is the authoritative ordered output.

## Read variants

```go
func render(message *content.AIMessage) {
	if message == nil {
		return
	}
	for _, block := range message.Blocks {
		switch typed := block.(type) {
		case *content.TextBlock:
			fmt.Print(typed.Text)
		case *content.ThinkingBlock:
			// Apply the product's reasoning-visibility policy.
		case *content.ToolUseBlock:
			// Validate typed.Input before executing typed.Name.
		}
	}
}
```

Thinking and tool-use blocks are not folded into text automatically. Preserve the block order, and use `Usage` on the AI message only when the message-level result carries it. The top-level `Response.Usage` is the response-level normalized metadata.

## Tool-call continuation

When a `ToolUseBlock` appears, correlate its `ID` and append a `ToolResultMessage` to the next request. A response with `FinishReasonToolUse` is not a final natural-language answer by itself.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/v0.13.0/client.go), [`core/content/message.go`](https://github.com/looprig/core/blob/v0.11.0/content/message.go)
- Tests: [`core/content/message_json_test.go`](https://github.com/looprig/core/blob/v0.11.0/content/message_json_test.go), [`inference/structured_result_test.go`](https://github.com/looprig/inference/blob/v0.13.0/structured_result_test.go)

Related: [AIMessage](/docs/guides/inference/messages/message-types/ai-message), [Tool-call deltas](/docs/guides/inference/streaming/tool-call-deltas).
