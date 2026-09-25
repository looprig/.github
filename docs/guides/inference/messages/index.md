---
id: guides/inference/messages/index
title: Overview
description: Build ordered conversation turns from sealed message and content types.
audience: developer
section: guides
order: 9
publication: released
proofs:
  message-family: [release-github-com-looprig-core]
  build-a-thread: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# Messages overview

Messages are typed conversation turns from `github.com/looprig/core/content`. Each turn embeds a `Message` value containing a role and ordered content blocks. `AgenticMessages` then preserves the turn order passed to an inference request.

## Message family

| Type | Role constant | Extra state |
| --- | --- | --- |
| `SystemMessage` | `RoleSystem` | none |
| `UserMessage` | `RoleUser` | none |
| `AIMessage` | `RoleAssistant` | optional `*Usage` |
| `ToolResultMessage` | `RoleTool` | `ToolUseID`, `IsError` |

```go
type Message struct {
	Role   Role
	Blocks []Block
}

type UserMessage struct{ Message }
type SystemMessage struct{ Message }
type AIMessage struct {
	Message
	Usage *Usage
}
type ToolResultMessage struct {
	Message
	ToolUseID string
	IsError   bool
}
```

Use pointers to the concrete types in a `Conversation` slice. The interface is sealed, so a type switch is exhaustive over these four variants.

## Build a thread

```go
package main

import "github.com/looprig/core/content"

func main() {
	thread := content.AgenticMessages{
		&content.SystemMessage{Message: content.Message{Role: content.RoleSystem, Blocks: []content.Block{
			&content.TextBlock{Text: "Be concise."},
		}}},
		&content.UserMessage{Message: content.Message{Role: content.RoleUser, Blocks: []content.Block{
			&content.TextBlock{Text: "Summarize the report."},
		}}},
	}
	_ = thread
}
```

The zero value of `AgenticMessages` is a valid empty thread. A nil `Blocks` slice means no blocks; an explicitly empty slice remains distinguishable in memory even though the message JSON codec omits empty blocks.

## Proof

- Source: [`core/content/message.go`](https://github.com/looprig/core/blob/v0.12.0/content/message.go)
- Tests: [`core/content/message_test.go`](https://github.com/looprig/core/blob/v0.12.0/content/message_test.go), [`core/content/message_json_test.go`](https://github.com/looprig/core/blob/v0.12.0/content/message_json_test.go)
- Example: [`core/examples/content/example_test.go`](https://github.com/looprig/core/blob/v0.12.0/examples/content/example_test.go)

Related: [Conversation](/docs/guides/inference/messages/conversation), [AgenticMessages](/docs/guides/inference/messages/agentic-messages), [Request messages](/docs/guides/inference/requests/messages).
