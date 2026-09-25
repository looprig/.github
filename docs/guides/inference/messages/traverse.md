---
id: guides/inference/messages/traverse
title: Traverse content safely
description: Traverse sealed messages and recursively inspect nested blocks without panics.
audience: developer
section: guides
order: 17
publication: released
proofs:
  message-traversal: [release-github-com-looprig-core]
  block-traversal: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# Traverse content safely

The `Conversation` and `Block` interfaces are sealed, which makes explicit type switches the safe traversal pattern. Recursion is required for `ToolResultBlock.Content`, where images and other blocks may be nested inside a tool result.

## Message traversal

```go
func messageBlocks(m content.Conversation) []content.Block {
	switch typed := m.(type) {
	case *content.SystemMessage:
		return typed.Blocks
	case *content.UserMessage:
		return typed.Blocks
	case *content.AIMessage:
		return typed.Blocks
	case *content.ToolResultMessage:
		return typed.Blocks
	default:
		return nil
	}
}
```

The inference request validator uses this exhaustive enumeration to find image blocks. It also recursively descends into `ToolResultBlock.Content`; a shallow top-level scan would incorrectly admit an image nested in a tool result for a model that cannot process images.

## Block traversal

```go
func hasText(blocks []content.Block) bool {
	for _, block := range blocks {
		switch typed := block.(type) {
		case *content.TextBlock:
			if typed != nil && typed.Text != "" {
				return true
			}
		case *content.ToolResultBlock:
			if typed != nil && hasText(typed.Content) {
				return true
			}
		}
	}
	return false
}
```

Always guard typed pointers before dereferencing. A typed-nil payload can inhabit an interface and is rejected by `MarshalBlock`; traversal code should fail closed or skip it explicitly rather than panic.

## Proof

- Source: [`core/content/message.go`](https://github.com/looprig/core/blob/v0.12.0/content/message.go), [`core/content/block.go`](https://github.com/looprig/core/blob/v0.12.0/content/block.go), [`inference/client.go`](https://github.com/looprig/inference/blob/v0.14.0/client.go)
- Tests: [`core/content/message_test.go`](https://github.com/looprig/core/blob/v0.12.0/content/message_test.go), [`inference/client_test.go`](https://github.com/looprig/inference/blob/v0.14.0/client_test.go)

Related: [Conversation](/docs/guides/inference/messages/conversation), [ImageBlock](/docs/guides/inference/content-blocks/image), [Feature validation](/docs/guides/inference/requests/feature-validation).
