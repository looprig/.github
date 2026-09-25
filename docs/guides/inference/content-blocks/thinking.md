---
id: guides/inference/content-blocks/thinking
title: ThinkingBlock
description: Preserve reasoning text, signatures, and same-dialect replay state.
audience: developer
section: guides
order: 6
publication: released
proofs:
  api-surface: [release-github-com-looprig-core]
  example: [release-github-com-looprig-core]
  proof: [release-github-com-looprig-core]
---

# ThinkingBlock

`ThinkingBlock` carries model reasoning text and the terminal signature or opaque provider state needed for replay. Thinking text can arrive before its signature during streaming.

## API surface

```go
type ThinkingBlock struct {
	Thinking            string
	Signature           string
	ProviderState       json.RawMessage
	ProviderStateFormat string
}

func NewThinkingBlock(thinking, signature string, providerState json.RawMessage, providerStateFormat string) *ThinkingBlock
func (b *ThinkingBlock) ReplayableAs(format string) bool
```

| Field | Contract |
| --- | --- |
| `Thinking` | Reasoning text accumulated from deltas |
| `Signature` | Empty while streaming; provider signature on a complete block |
| `ProviderState` | Opaque JSON state for replay, never interpreted by core |
| `ProviderStateFormat` | Exact dialect label that owns `ProviderState` |

`NewThinkingBlock` defensively copies the raw provider state. `ReplayableAs` returns false for a nil receiver, empty state, or a format mismatch. A codec must treat false as absent state; bytes from one provider must not be translated into another provider's wire field.

## Example

```go
package main

import (
	"encoding/json"
	"fmt"

	"github.com/looprig/core/content"
)

func main() {
	state := json.RawMessage(`{"signature":"opaque"}`)
	block := content.NewThinkingBlock("check the facts", "sig", state, "gemini")
	fmt.Println(block.ReplayableAs("gemini"), block.ReplayableAs("openai-responses"))
}
```

The zero signature is not an error during streaming. Use [Thinking deltas](/docs/guides/inference/streaming/thinking-deltas) and the core stream accumulator to produce a completed block.

## Proof

- Source: [`core/content/block.go`](https://github.com/looprig/core/blob/v0.12.0/content/block.go)
- Tests: [`core/content/block_test.go`](https://github.com/looprig/core/blob/v0.12.0/content/block_test.go), [`core/content/block_json_test.go`](https://github.com/looprig/core/blob/v0.12.0/content/block_json_test.go)

Related: [Thinking deltas](/docs/guides/inference/streaming/thinking-deltas), [AIMessage](/docs/guides/inference/messages/message-types/ai-message).
