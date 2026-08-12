---
id: reference/packages/inference/model
title: model package · model
description: Reference for the model package at github.com/looprig/inference/model, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 112
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
  - stage-22-model-gateway
proofs:
  package-role: release-github-com-looprig-inference
  exported-surface: release-github-com-looprig-inference
  functions: release-github-com-looprig-inference
  methods: release-github-com-looprig-inference
  types: release-github-com-looprig-inference
  constants: release-github-com-looprig-inference
  variables: release-github-com-looprig-inference
  ownership-and-errors: release-github-com-looprig-inference
  source-and-runnable-proof: release-github-com-looprig-inference
---

# model package · model

Import path: `github.com/looprig/inference/model`. The source is pinned to github.com/looprig/inference@v0.9.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func CustomModel(p ProviderName, f APIFormat, baseURL, name string, opts ...ModelOption) Model`
- `func WithContextLimits(limits ContextLimits) ModelOption`
- `func WithTools() ModelOption`
- `func WithImages() ModelOption`
- `func WithThinking() ModelOption`
- `func WithPromptCaching() ModelOption`
- `func WithStructuredOutput() ModelOption`
- `func WithStructuredOutputWithTools() ModelOption`
- `func WithSampling(s Sampling) ModelOption`

### Methods {#methods}

- `func (e *ContextLimitsValidationError) Error() string`
- `func (l ContextLimits) Validate() error`
- `func (e Effort) Valid() bool`
- `func (e *ValidationError) Error() string`
- `func (m Model) Validate() error`
- `func (m Model) Key() ModelKey`
- `func (m Model) Clone() Model`
- `func (e *ModelKeyValidationError) Error() string`
- `func (k ModelKey) Validate() error`
- `func (o Origin) String() string`
- `func (s Sampling) Clone() Sampling`

### Types {#types}

```go
type APIFormat string
```

```go
type Capabilities struct {
	AcceptsImages             bool
	Tools                     bool
	Thinking                  bool
	StructuredOutput          bool
	StructuredOutputWithTools bool

	PromptCaching bool
}
```

```go
type ContextLimits struct {
	WindowTokens    content.TokenCount
	MaxInputTokens  content.TokenCount
	MaxOutputTokens content.TokenCount
}
```

```go
type ContextLimitField string
```

```go
type ContextLimitValidationReason string
```

```go
type ContextLimitsValidationError struct {
	Field        ContextLimitField
	Reason       ContextLimitValidationReason
	Value        content.TokenCount
	WindowTokens content.TokenCount
}
```

```go
type Effort string
```

```go
type ValidationError struct {
	Field  string
	Reason string
}
```

```go
type Model struct {
	Provider  ProviderName
	APIFormat APIFormat
	BaseURL   string
	Name      string
	Origin    Origin
	Caps      Capabilities
	Limits    ContextLimits
	Sampling  Sampling
}
```

```go
type ModelOption func(*Model)
```

```go
type ModelKey struct {
	Provider ProviderName
	Model    string
}
```

```go
type ModelKeyField string
```

```go
type ModelKeyValidationReason string
```

```go
type ModelKeyValidationError struct {
	Field  ModelKeyField
	Reason ModelKeyValidationReason
}
```

```go
type Origin uint8
```

```go
type ProviderName string
```

```go
type Sampling struct {
	Temperature *float64
	TopP        *float64
	MaxTokens   *int
	Stop        []string
	Effort      Effort
}
```

### Constants {#constants}

`APIFormatOpenAI`, `APIFormatAnthropic`, `APIFormatGemini`, `APIFormatOpenAIResponses`, `APIFormatBedrockConverse`, `ContextLimitFieldMaxInputTokens`, `ContextLimitFieldMaxOutputTokens`, `ContextLimitValidationReasonExceedsWindow`, `EffortNone`, `EffortLow`, `EffortMedium`, `EffortHigh`, `EffortMax`, `ModelKeyFieldProvider`, `ModelKeyFieldModel`, `ModelKeyValidationReasonEmpty`, `OriginCustom`, `OriginCatalog`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ContextLimitsValidationError`, `ModelKeyValidationError`, `ValidationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [model/apiformat.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/apiformat.go)
- [model/capabilities.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/capabilities.go)
- [model/contextlimits.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/contextlimits.go)
- [model/effort.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/effort.go)
- [model/errors.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/errors.go)
- [model/model.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/model.go)
- [model/modelkey.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/modelkey.go)
- [model/origin.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/origin.go)
- [model/provider.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/provider.go)
- [model/sampling.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/sampling.go)

Adjacent tests at the same commit:

- [model/apiformat_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/apiformat_test.go)
- [model/contextlimits_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/contextlimits_test.go)
- [model/effort_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/effort_test.go)
- [model/model_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/model_test.go)
- [model/modelkey_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/modelkey_test.go)
- [model/origin_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/origin_test.go)
- [model/sampling_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/sampling_test.go)

Run `GOWORK=off go test ./...` from the `inference` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
