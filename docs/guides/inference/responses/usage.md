---
id: guides/inference/responses/usage
title: Response usage
description: Read normalized token usage and preserve absent versus zero metadata.
audience: developer
section: guides
order: 44
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  message-level-usage: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Response usage

`Response.Usage` is an optional pointer to `core/content.Usage`. It normalizes provider-specific counters and keeps absent usage distinct from a present zero value.

## API surface

```go
type Usage struct {
	InputTokens         TokenCount
	OutputTokens        TokenCount
	CacheReadTokens     TokenCount
	CacheCreationTokens TokenCount
	ReasoningTokens     TokenCount
}

func (u Usage) Validate() error
func (u Usage) ContextTokens() (TokenCount, error)
func (u Usage) TotalTokens() (TokenCount, error)
func (u Usage) Add(other Usage) (Usage, error)
```

```go
if response.Usage != nil {
	contextTokens, err := response.Usage.ContextTokens()
	if err != nil {
		return err
	}
	total, err := response.Usage.TotalTokens()
	if err != nil {
		return err
	}
	fmt.Println(contextTokens, total)
}
```

`ReasoningTokens` cannot exceed `OutputTokens`. Derived additions return typed `*UsageOverflowError` on overflow. Codec and stream paths validate usage before authorizing it as terminal metadata.

## Message-level usage

`AIMessage.Usage` is the same normalized shape at message scope. The top-level response field is the preferred response accounting value; do not assume both pointers are present or identical when adapting a provider.

## Proof

- Source: [`core/content/usage.go`](https://github.com/looprig/core/blob/v0.11.0/content/usage.go), [`inference/client.go`](https://github.com/looprig/inference/blob/v0.13.0/client.go)
- Tests: [`core/content/usage_test.go`](https://github.com/looprig/core/blob/v0.11.0/content/usage_test.go), [`inference/stream/stream_test.go`](https://github.com/looprig/inference/blob/v0.13.0/stream/stream_test.go)

Related: [Terminal stream results](/docs/guides/inference/streaming/terminal-results), [AIMessage](/docs/guides/inference/messages/message-types/ai-message).
