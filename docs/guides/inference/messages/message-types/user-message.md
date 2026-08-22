---
id: guides/inference/messages/message-types/user-message
title: UserMessage
description: Add a human-authored turn to an AgenticMessages thread.
audience: developer
section: guides
order: 11
publication: released
proofs:
  api-surface: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# UserMessage

`UserMessage` is a human-authored conversation turn. It embeds `Message`, so its role and ordered blocks are directly accessible.

## API surface

```go
type UserMessage struct{ Message }
```

The embedded value should normally use `RoleUser`:

```go
message := &content.UserMessage{Message: content.Message{
	Role: content.RoleUser,
	Blocks: []content.Block{
		&content.TextBlock{Text: "Summarize this."},
		&content.DocumentBlock{
			MediaType: content.MediaTypeDocumentText,
			Name: "notes.txt", Text: "A short note.",
		},
	},
}}
```

`Blocks` may contain multimodal input when the selected model advertises the capability. `UserMessage` has no usage or tool-correlation fields; those belong to assistant and tool-result turns.

## Proof

- Source: [`core/content/message.go`](https://github.com/looprig/core/blob/main/content/message.go)
- Tests: [`core/content/message_test.go`](https://github.com/looprig/core/blob/main/content/message_test.go), [`core/content/message_json_test.go`](https://github.com/looprig/core/blob/main/content/message_json_test.go)
- Example: [`core/examples/content/example_test.go`](https://github.com/looprig/core/blob/main/examples/content/example_test.go)

Related: [SystemMessage](/docs/guides/inference/messages/message-types/system-message), [Conversation input](/docs/guides/inference/requests/messages).
