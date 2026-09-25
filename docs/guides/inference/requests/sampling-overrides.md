---
id: guides/inference/requests/sampling-overrides
title: Sampling overrides
description: Replace model defaults for one request without mutating the model descriptor.
audience: developer
section: guides
order: 39
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Sampling overrides

`Request.Override` is an optional pointer to per-call `model.Sampling`. A nil pointer means the codec should use `Request.Model.Sampling`; a non-nil value replaces those defaults for this request.

## API surface

```go
temperature := 0.2
request := inference.Request{
	Model: model.CustomModel(
		model.ProviderName("acme"), model.APIFormatOpenAI,
		"https://api.example.test", "chat-1",
		model.WithSampling(model.Sampling{MaxTokens: intPtr(1024)}),
	),
	Override: &model.Sampling{Temperature: &temperature},
}
```

The request owns the pointer value for the duration of encoding, so do not mutate it concurrently. `CustomModel` and `WithSampling` deep-copy model defaults; use `Sampling.Clone` if a caller needs an independent override before changing pointer or slice fields.

```go
func intPtr(value int) *int { return &value }
```

Numeric ranges, stop-sequence limits, and provider-specific combinations are codec policy. The model package only supplies the shape and copy behavior.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/v0.14.0/client.go), [`inference/model/sampling.go`](https://github.com/looprig/inference/blob/v0.14.0/model/sampling.go), [`inference/model/model.go`](https://github.com/looprig/inference/blob/v0.14.0/model/model.go)
- Tests: [`inference/model/sampling_test.go`](https://github.com/looprig/inference/blob/v0.14.0/model/sampling_test.go), [`inference/model/model_test.go`](https://github.com/looprig/inference/blob/v0.14.0/model/model_test.go)

Related: [Sampling](/docs/guides/inference/models/sampling), [Model selection](/docs/guides/inference/requests/model-selection).
