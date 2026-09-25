---
id: guides/inference/models/context-limits
title: Context limits
description: Describe known model context capacity and validate its relationships.
audience: developer
section: guides
order: 23
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Context limits

`ContextLimits` records capacity known to the caller. Zero fields are explicitly unknown; the type does not guess provider defaults.

## API surface

```go
type ContextLimits struct {
	WindowTokens    content.TokenCount
	MaxInputTokens  content.TokenCount
	MaxOutputTokens content.TokenCount
}

func (l ContextLimits) Validate() error
```

| Field | Meaning |
| --- | --- |
| `WindowTokens` | Shared context window; zero means unknown |
| `MaxInputTokens` | Optional input cap; zero means unknown |
| `MaxOutputTokens` | Optional output cap; zero means unknown |

When `WindowTokens` is known, each known max must be less than or equal to it. Independent maxima need not sum below the window because actual request admission accounts for combined use. A contradiction returns `*ContextLimitsValidationError` with `Field`, `Reason`, `Value`, and `WindowTokens`.

```go
limits := model.ContextLimits{
	WindowTokens: 128_000,
	MaxInputTokens: 100_000,
	MaxOutputTokens: 8_000,
}
if err := limits.Validate(); err != nil {
	panic(err)
}
```

Use `WithContextLimits(limits)` when constructing a custom model.

## Proof

- Source: [`inference/model/contextlimits.go`](https://github.com/looprig/inference/blob/v0.14.0/model/contextlimits.go)
- Tests: [`inference/model/contextlimits_test.go`](https://github.com/looprig/inference/blob/v0.14.0/model/contextlimits_test.go), [`inference/model/model_test.go`](https://github.com/looprig/inference/blob/v0.14.0/model/model_test.go)

Related: [Model](/docs/guides/inference/models/model), [Model validation](/docs/guides/inference/models/validation).
