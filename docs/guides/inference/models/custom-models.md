---
id: guides/inference/models/custom-models
title: Custom models
description: Build a fail-safe user-asserted model with explicit capability options.
audience: developer
section: guides
order: 26
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  endpoint-safety: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Custom models

`CustomModel` is the convenience constructor for a user-asserted descriptor. It sets only the four wire-relevant values and starts every optional capability and limit at a conservative zero value.

## API surface

```go
func CustomModel(
	p ProviderName, f APIFormat, baseURL, name string,
	opts ...ModelOption,
) Model

type ModelOption func(*Model)

func WithContextLimits(limits ContextLimits) ModelOption
func WithTools() ModelOption
func WithImages() ModelOption
func WithThinking() ModelOption
func WithPromptCaching() ModelOption
func WithStructuredOutput() ModelOption
func WithStructuredOutputWithTools() ModelOption
func WithSampling(s Sampling) ModelOption
```

```go
temperature := 0.1
descriptor := model.CustomModel(
	model.ProviderName("local"), model.APIFormatOpenAI,
	"http://127.0.0.1:8080", "my-model",
	model.WithTools(),
	model.WithImages(),
	model.WithStructuredOutputWithTools(),
	model.WithSampling(model.Sampling{Temperature: &temperature}),
)
if err := descriptor.Validate(); err != nil {
	panic(err)
}
```

`WithStructuredOutputWithTools` opts in all three related booleans: tools, structured output, and structured output with tools. `WithSampling` deep-copies its argument. `Origin` remains `OriginCustom`, and `Limits` remains unknown unless explicitly configured.

## Endpoint safety

An HTTPS base URL is accepted. Plain HTTP is accepted only for `127.0.0.1`, `localhost`, or `::1`; userinfo credentials and hostless URLs are rejected. An empty base URL is a wildcard for a later trust boundary, not a usable endpoint by itself.

## Proof

- Source: [`inference/model/model.go`](https://github.com/looprig/inference/blob/v0.13.0/model/model.go)
- Tests: [`inference/model/model_test.go`](https://github.com/looprig/inference/blob/v0.13.0/model/model_test.go) covers defaults, options, deep-copy sampling, and endpoint rules.

Related: [Model](/docs/guides/inference/models/model), [Model validation](/docs/guides/inference/models/validation).
