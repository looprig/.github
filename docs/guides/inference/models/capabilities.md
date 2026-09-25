---
id: guides/inference/models/capabilities
title: Capabilities
description: Gate optional request features with secret-free model capabilities.
audience: developer
section: guides
order: 22
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Capabilities

`Capabilities` is local gating and informational metadata. It is never serialized onto the provider wire. A custom model starts with every capability off; options explicitly opt features in.

## API surface

```go
type Capabilities struct {
	AcceptsImages             bool
	Tools                     bool
	Thinking                  bool
	StructuredOutput          bool
	StructuredOutputWithTools bool
	PromptCaching             bool
}
```

| Capability | Used by |
| --- | --- |
| `AcceptsImages` | Request validation when any message contains an image, including nested tool-result blocks |
| `Tools` | Tool request admission and model catalogue metadata |
| `Thinking` | Extended-thinking request policy |
| `StructuredOutput` | `OutputSchema` admission |
| `StructuredOutputWithTools` | Structured output when ordinary tools are also exposed; implies `Tools` and `StructuredOutput` |
| `PromptCaching` | Codec opt-in for explicit `cache_control` breakpoints |

```go
descriptor := model.CustomModel(
	model.ProviderName("acme"), model.APIFormatAnthropic,
	"https://api.example.test", "reasoner",
	model.WithThinking(), model.WithPromptCaching(),
)
if !descriptor.Caps.Thinking {
	panic("the option was not applied")
}
```

`Model.Validate` rejects `StructuredOutputWithTools` unless both prerequisite booleans are true. It does not decide whether a provider really supports a label; that policy belongs to the integration layer.

## Proof

- Source: [`inference/model/capabilities.go`](https://github.com/looprig/inference/blob/v0.13.0/model/capabilities.go), [`inference/model/model.go`](https://github.com/looprig/inference/blob/v0.13.0/model/model.go)
- Tests: [`inference/model/model_test.go`](https://github.com/looprig/inference/blob/v0.13.0/model/model_test.go) verifies fail-safe defaults and each option.

Related: [Feature validation](/docs/guides/inference/requests/feature-validation), [Structured output requests](/docs/guides/inference/requests/structured-output).
