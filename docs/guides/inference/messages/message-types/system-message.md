---
id: guides/inference/messages/message-types/system-message
title: SystemMessage
description: Represent system instructions as a typed conversation turn.
audience: developer
section: guides
order: 10
publication: released
proofs:
  api-surface: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# SystemMessage

`SystemMessage` is the typed system turn. The provider-neutral `Request.System` field is a separate request-level instruction; use `SystemMessage` when the conversation itself needs a system turn.

## API surface

```go
type SystemMessage struct{ Message }
```

```go
system := &content.SystemMessage{Message: content.Message{
	Role: content.RoleSystem,
	Blocks: []content.Block{
		&content.TextBlock{Text: "Use short, factual answers."},
	},
}}
```

The type has no additional fields. A system turn can contain the same block slice as the other message types, although provider codecs may restrict which blocks they accept in a system position.

## Proof

- Source: [`core/content/message.go`](https://github.com/looprig/core/blob/v0.12.0/content/message.go)
- Tests: [`core/content/message_test.go`](https://github.com/looprig/core/blob/v0.12.0/content/message_test.go), [`core/content/message_json_test.go`](https://github.com/looprig/core/blob/v0.12.0/content/message_json_test.go)

Related: [System instructions](/docs/guides/inference/requests/system-instructions), [UserMessage](/docs/guides/inference/messages/message-types/user-message).
