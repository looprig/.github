---
id: guides/inference/models/reasoning-effort
title: Reasoning effort
description: Express low-to-maximum reasoning intent without binding to one provider.
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

The OpenAI codec maps effort to `reasoning_effort`; the Anthropic codec maps it to its adaptive-thinking and effort fields. Not every provider and model supports every effort level, and an unsupported level is rejected with a typed error or omitted from the request rather than remapped to a nearby level.

## Proof

- Source: [`inference/model/effort.go`](https://github.com/looprig/inference/blob/main/model/effort.go), [`inference/model/sampling.go`](https://github.com/looprig/inference/blob/main/model/sampling.go)
- Tests: [`inference/model/effort_test.go`](https://github.com/looprig/inference/blob/main/model/effort_test.go)

Related: [Sampling](/docs/guides/inference/models/sampling/), [Capabilities](/docs/guides/inference/models/capabilities/).
