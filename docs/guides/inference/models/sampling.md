---
id: guides/inference/models/sampling
title: Sampling
description: Carry dialect-neutral temperature, nucleus, token, stop, and effort intent.
audience: developer
section: guides
order: 24
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Sampling

`Sampling` expresses provider-neutral generation intent. A codec maps these fields to its own wire vocabulary and applies dialect-specific constraints.

## API surface

```go
type Sampling struct {
	Temperature *float64
	TopP        *float64
	MaxTokens   *int
	Stop        []string
	Effort      Effort
}

func (s Sampling) Clone() Sampling
```

| Field | Zero value | Ownership |
| --- | --- | --- |
| `Temperature` | nil, unset | Pointer is copied by `Clone` |
| `TopP` | nil, unset | Pointer is copied by `Clone` |
| `MaxTokens` | nil, unset | Pointer is copied by `Clone` |
| `Stop` | nil, unset | Slice is copied by `Clone` |
| `Effort` | `EffortNone` | OpenAI and Anthropic codecs map it differently |

The model package does not validate numeric ranges or provider-specific combinations. For example, an Anthropic thinking request may have a temperature rule that belongs in the Anthropic codec.

```go
temperature := 0.2
maxTokens := 512
defaults := model.Sampling{
	Temperature: &temperature,
	MaxTokens: &maxTokens,
	Stop: []string{"END"},
	Effort: model.EffortMedium,
}
copy := defaults.Clone()
*copy.Temperature = 0.7
copy.Stop[0] = "DONE"
// defaults still contains 0.2 and "END".
```

Use `WithSampling(defaults)` for model defaults and `Request.Override` for a per-call replacement.

## Proof

- Source: [`inference/model/sampling.go`](https://github.com/looprig/inference/blob/main/model/sampling.go)
- Tests: [`inference/model/sampling_test.go`](https://github.com/looprig/inference/blob/main/model/sampling_test.go), [`inference/model/model_test.go`](https://github.com/looprig/inference/blob/main/model/model_test.go)

Related: [Reasoning effort](/docs/guides/inference/models/reasoning-effort), [Sampling overrides](/docs/guides/inference/requests/sampling-overrides).
