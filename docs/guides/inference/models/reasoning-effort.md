---
id: guides/inference/models/reasoning-effort
title: Reasoning effort
description: Express minimal-to-maximum reasoning intent without binding to one provider.
audience: developer
section: guides
order: 25
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Reasoning effort

`Effort` is a dialect-neutral hint for how much reasoning a model should spend. The value is carried by `Sampling` and translated by each codec.

## API surface

```go
type Effort string

const (
	EffortNone    Effort = ""
	EffortMinimal Effort = "minimal"
	EffortLow     Effort = "low"
	EffortMedium  Effort = "medium"
	EffortHigh    Effort = "high"
	EffortXHigh   Effort = "xhigh"
	EffortMax     Effort = "max"
)

func (e Effort) Valid() bool
```

`EffortNone` is a valid unset value. An arbitrary string is not valid according to `Valid` and should be rejected by a caller before it reaches a codec.

```go
sampling := model.Sampling{Effort: model.EffortHigh}
if !sampling.Effort.Valid() {
	panic("unknown effort")
}
```

Not every provider and model supports every effort level. The OpenAI Chat Completions codec maps effort to `reasoning_effort` and the Responses codec to `reasoning.effort`, and both preserve each level exactly, though Chat Completions sends the field whenever an effort is set while Responses emits it only for a model whose `Capabilities.Thinking` is set. The Anthropic codec picks between two request shapes from the model's declared `Capabilities.ThinkingDialect`, so effort alone is not enough there. Gemini rejects `xhigh` and `max` with `UnsupportedEffortError`, and Bedrock Converse rejects every non-empty level with the same error. A codec that gates on `Capabilities.Thinking` omits the reasoning request entirely for a model that does not advertise it, rather than reporting an error.

Effort alone is therefore not enough for a provider with more than one
reasoning request shape. An Anthropic-family model must also declare its
dialect with `model.WithThinkingDialect(...)`, which sets `Thinking` for you;
`model.WithThinking()` leaves the dialect undeclared, and the Anthropic codec
then fails closed rather than guessing.

## Proof

- Source: [`inference/model/effort.go`](https://github.com/looprig/inference/blob/v0.12.0/model/effort.go), [`inference/model/sampling.go`](https://github.com/looprig/inference/blob/v0.12.0/model/sampling.go)
- Tests: [`inference/model/effort_test.go`](https://github.com/looprig/inference/blob/v0.12.0/model/effort_test.go)

Related: [Sampling](/docs/guides/inference/models/sampling), [Capabilities](/docs/guides/inference/models/capabilities).
