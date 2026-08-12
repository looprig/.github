---
id: guides/inference/messages/construct
title: Construct messages
description: Construct message values with explicit roles and ordered blocks.
audience: developer
section: guides
order: 16
publication: released
proofs:
  api-surface: [release-github-com-looprig-core]
  role-and-type-must-agree: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# Construct messages

There are no message constructors in `core/content`. Construction is deliberately visible: embed a `Message` and set the matching `Role` constant, then add non-nil block pointers in order.

## API surface

```go
type Role string

const (
	RoleUser      Role = "user"
	RoleAssistant Role = "assistant"
	RoleSystem    Role = "system"
	RoleTool      Role = "tool"
)
```

```go
package main

import "github.com/looprig/core/content"

func main() {
	user := &content.UserMessage{Message: content.Message{
		Role: content.RoleUser,
		Blocks: []content.Block{
			&content.TextBlock{Text: "What changed?"},
			&content.ImageBlock{
				MediaType: content.MediaTypeImagePNG,
				Source: content.ImageSource{URL: "https://example.test/diff.png"},
			},
		},
	}}
	_ = user
}
```

Embedded fields are promoted, so `user.Role` and `user.Blocks` work after construction. A nil block interface or typed-nil payload is not a valid value for JSON encoding; `MarshalBlock` fails closed instead of emitting a misleading empty block.

## Role and type must agree

The message codecs preserve the `Role` field exactly; they do not infer it from the Go type. Set `RoleAssistant` on `AIMessage`, `RoleTool` on `ToolResultMessage`, and so on. Tests exercise mixed messages and empty or nil block slices.

## Proof

- Source: [`core/content/message.go`](https://github.com/looprig/core/blob/main/content/message.go), [`core/content/block.go`](https://github.com/looprig/core/blob/main/content/block.go)
- Tests: [`core/content/message_test.go`](https://github.com/looprig/core/blob/main/content/message_test.go), [`core/content/block_json_test.go`](https://github.com/looprig/core/blob/main/content/block_json_test.go)

Related: [UserMessage](/docs/guides/inference/messages/message-types/user-message/), [Content blocks](/docs/guides/inference/content-blocks/).
