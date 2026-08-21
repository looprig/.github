---
id: guides/inference/codecs/usage
title: Usage translation
description: Normalize provider usage fields and cache subsets into Usage.
audience: developer
section: guides
order: 72
publication: released
proofs:
  fields: [release-github-com-looprig-inference]
  invariants: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Usage Translation

The normalized alias is intentionally small:

```go
type Usage struct {
	InputTokens         content.TokenCount
	OutputTokens        content.TokenCount
	CacheReadTokens     content.TokenCount
	CacheCreationTokens content.TokenCount
	ReasoningTokens     content.TokenCount
}
```

## Fields

| Provider field | Normalized field | Rule |
| --- | --- | --- |
| OpenAI `prompt_tokens` | input plus cache subsets | subtract `cached_tokens` and `cache_write_tokens` |
| Responses `input_tokens` | input plus cache read and cache write | subtract `input_tokens_details.cached_tokens` and `cache_write_tokens` |
| Anthropic `input_tokens` | input | cache fields are separate |
| Gemini `promptTokenCount` | input | subtract `cachedContentTokenCount`, then add `toolUsePromptTokenCount` |
| Bedrock `inputTokens` | input | cache fields are separate |

Output and reasoning are normalized similarly. Gemini adds candidate and thought
counts for `OutputTokens`; its `totalTokenCount` is validated as a well-formed
count but is deliberately not reconciled against those components. Missing usage remains `nil`, not a fabricated zero measurement.

## Invariants

`usagenorm` rejects negative, null-invalid, fractional, or out-of-range counts.
Cache subsets cannot exceed the provider's gross input count, and addition uses
checked arithmetic. Reasoning greater than output is not an invariant: it is
reported as received and observable through
`content.Usage.ReasoningWithinOutput`.

```go
u := content.Usage{InputTokens: 10, CacheReadTokens: 2, OutputTokens: 4}
contextTokens, err := u.ContextTokens() // 12
if err != nil {
	return err
}
_ = contextTokens
```

## Source and proof

- [`usage/usage.go`](https://github.com/looprig/inference/blob/v0.12.0/usage/usage.go)
- [`usage/errors.go`](https://github.com/looprig/inference/blob/v0.12.0/usage/errors.go)
- [`core/content/usage.go`](https://github.com/looprig/core/blob/v0.6.0/content/usage.go)
- [`internal/usagenorm`](https://github.com/looprig/inference/tree/v0.12.0/internal/usagenorm)

Run `go test ./usage ./codec/...`.
