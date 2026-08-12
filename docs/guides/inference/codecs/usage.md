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
| Responses `input_tokens` | input plus cache read | subtract `input_tokens_details.cached_tokens` |
| Anthropic `input_tokens` | input | cache fields are separate |
| Gemini `promptTokenCount` | input | subtract `cachedContentTokenCount` |
| Bedrock `inputTokens` | input | cache fields are separate |

Output and reasoning are normalized similarly. Gemini adds candidate and thought
counts for `OutputTokens`; its reported total is checked against the gross
components. Missing usage remains `nil`, not a fabricated zero measurement.

## Invariants

`usagenorm` rejects negative, null-invalid, fractional, out-of-range, or
inconsistent counts. `content.Usage.Validate` rejects reasoning greater than
output. Cache subsets cannot exceed the provider's gross input count, and
addition uses checked arithmetic.

```go
u := content.Usage{InputTokens: 10, CacheReadTokens: 2, OutputTokens: 4}
contextTokens, err := u.ContextTokens() // 12
if err != nil {
	return err
}
_ = contextTokens
```

## Source and proof

- [`usage/usage.go`](https://github.com/looprig/inference/blob/v0.9.2/usage/usage.go)
- [`usage/errors.go`](https://github.com/looprig/inference/blob/v0.9.2/usage/errors.go)
- [`core/content/usage.go`](https://github.com/looprig/core/blob/v0.5.1/content/usage.go)
- [`internal/usagenorm`](https://github.com/looprig/inference/tree/v0.9.2/internal/usagenorm)

Run `go test ./usage ./codec/...`.
