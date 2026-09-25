---
id: guides/inference/messages/message-types/tool-result-message
title: ToolResultMessage
description: Return tool output to the model with stable call correlation.
audience: developer
section: guides
order: 13
publication: released
proofs:
  api-surface: [release-github-com-looprig-core]
  failure-results: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# ToolResultMessage

`ToolResultMessage` is the tool-authored turn that answers one assistant tool call. It embeds the normal role and blocks, then adds correlation and error metadata.

## API surface

```go
type ToolResultMessage struct {
	Message
	ToolUseID string
	IsError   bool
}
```

```go
result := &content.ToolResultMessage{
	Message: content.Message{
		Role: content.RoleTool,
		Blocks: []content.Block{&content.TextBlock{Text: "72 degrees"}},
	},
	ToolUseID: "call-1",
	IsError:   false,
}
```

`ToolUseID` must match the originating `ToolUseBlock.ID`. `IsError` is omitted from JSON when false and encoded as `"is_error":true` when true. The custom message codec is important: relying on the promoted `Message.MarshalJSON` would lose `ToolUseID`.

## Failure results

Set `IsError` when the tool execution failed, and put a useful, non-secret explanation in the blocks. The inference layer does not execute tools or validate the result payload; those policies belong to the caller.

## Proof

- Source: [`core/content/message.go`](https://github.com/looprig/core/blob/v0.12.0/content/message.go)
- Tests: [`core/content/message_test.go`](https://github.com/looprig/core/blob/v0.12.0/content/message_test.go), [`core/content/message_json_test.go`](https://github.com/looprig/core/blob/v0.12.0/content/message_json_test.go) pins the ID and error fields through a JSON round trip.

Related: [ToolResultBlock](/docs/guides/inference/content-blocks/tool-result), [Tool choice](/docs/guides/inference/requests/tool-choice).
