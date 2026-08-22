---
id: guides/inference/messages/message-types/ai-message
title: AIMessage
description: Represent assistant text, reasoning, tool calls, and normalized usage.
audience: developer
section: guides
order: 12
publication: released
proofs:
  api-surface: [release-github-com-looprig-core]
  ordering-and-tool-calls: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# AIMessage

`AIMessage` is the assistant turn returned by an inference client. Its blocks may contain text, thinking, and tool-use requests in the order the provider produced them. It optionally carries normalized token usage.

## API surface

```go
type AIMessage struct {
	Message
	Usage *Usage
}
```

```go
package main

import (
	"encoding/json"
	"github.com/looprig/core/content"
)

func main() {
	assistant := &content.AIMessage{Message: content.Message{
		Role: content.RoleAssistant,
		Blocks: []content.Block{
			&content.ThinkingBlock{Thinking: "check the source", Signature: "sig"},
			&content.TextBlock{Text: "Here is the answer."},
			&content.ToolUseBlock{ID: "call-1", Name: "search", Input: json.RawMessage(`{"q":"facts"}`)},
		},
	}}
	_ = assistant
}
```

`Usage` is optional. A non-nil usage value is validated on JSON marshal and unmarshal; in particular, `ReasoningTokens` cannot exceed `OutputTokens`. Thinking blocks are not text blocks, so structured-output extraction ignores them while preserving their position in the assistant message.

## Ordering and tool calls

Provider codecs may emit thinking before text and tool calls after text. Preserve the `Blocks` order. A tool runner should execute each `ToolUseBlock`, then append a [ToolResultMessage](/docs/guides/inference/messages/message-types/tool-result-message) that carries the matching ID.

## Proof

- Source: [`core/content/message.go`](https://github.com/looprig/core/blob/main/content/message.go), [`core/content/usage.go`](https://github.com/looprig/core/blob/main/content/usage.go)
- Tests: [`core/content/message_json_test.go`](https://github.com/looprig/core/blob/main/content/message_json_test.go), [`inference/structured_result_test.go`](https://github.com/looprig/inference/blob/main/structured_result_test.go)

Related: [ThinkingBlock](/docs/guides/inference/content-blocks/thinking), [ToolUseBlock](/docs/guides/inference/content-blocks/tool-use), [Assistant messages](/docs/guides/inference/responses/assistant-message).
