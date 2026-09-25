---
id: guides/inference/messages/conversation
title: Conversation
description: Understand the sealed Conversation interface and its four legal turns.
audience: developer
section: guides
order: 14
publication: released
proofs:
  api-surface: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# Conversation

`Conversation` is the closed union accepted by `AgenticMessages`. The unexported marker prevents an external package from pretending that an unrelated value is a conversation turn.

## API surface

```go
type Conversation interface{ isMessage() }

func (*UserMessage) isMessage()
func (*AIMessage) isMessage()
func (*SystemMessage) isMessage()
func (*ToolResultMessage) isMessage()
```

The marker methods are intentionally not callable outside `content`; the declarations above show the complete set of variants. Handle them with a type switch:

```go
func blocksOf(m content.Conversation) []content.Block {
	switch typed := m.(type) {
	case *content.UserMessage:
		return typed.Blocks
	case *content.AIMessage:
		return typed.Blocks
	case *content.SystemMessage:
		return typed.Blocks
	case *content.ToolResultMessage:
		return typed.Blocks
	default:
		return nil
	}
}
```

Do not use the role string as the only discriminator. A role is a field and can be populated incorrectly; the concrete message type carries the package's closed-world guarantee.

## Proof

- Source: [`core/content/message.go`](https://github.com/looprig/core/blob/v0.11.0/content/message.go)
- Tests: [`core/content/message_test.go`](https://github.com/looprig/core/blob/v0.11.0/content/message_test.go) includes compile-time interface assertions for all four variants.

Related: [Messages](/docs/guides/inference/messages), [Traverse content safely](/docs/guides/inference/messages/traverse).
