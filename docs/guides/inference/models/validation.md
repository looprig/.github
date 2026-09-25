---
id: guides/inference/models/validation
title: Model validation
description: Apply structural model validation and inspect typed failures safely.
audience: developer
section: guides
order: 27
publication: released
proofs:
  validation-rules: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Model validation

`Model.Validate` is the structural boundary before a descriptor enters a client. It returns typed errors and intentionally leaves provider policy to the consumer that owns a catalogue or codec registry.

## Validation rules

| Rule | Failure |
| --- | --- |
| `Name` is non-empty | `*ValidationError{Field: "Name"}` |
| `StructuredOutputWithTools` implies `Tools` and `StructuredOutput` | `*ValidationError{Field: "Caps.StructuredOutputWithTools"}` |
| Known max input/output limits do not exceed `WindowTokens` | `*ContextLimitsValidationError` |
| Non-empty base URL has a host and no userinfo | `*ValidationError{Field: "BaseURL"}` |
| Scheme is HTTPS, or loopback HTTP | `*ValidationError{Field: "BaseURL"}` |

Unknown `ProviderName` and `APIFormat` values pass. `OriginCustom` and `OriginCatalog` validate identically; origin changes downstream trust and gating, not the structural rules.

```go
descriptor := model.Model{BaseURL: "http://example.test", Name: "chat"}
err := descriptor.Validate()
var validation *model.ValidationError
if errors.As(err, &validation) {
	fmt.Println(validation.Field, validation.Reason)
}
```

Always use `errors.As` instead of matching the human-readable error string. A caller that needs a fully resolved identity should also call `descriptor.Key().Validate()`.

## Proof

- Source: [`inference/model/model.go`](https://github.com/looprig/inference/blob/v0.14.0/model/model.go), [`inference/model/errors.go`](https://github.com/looprig/inference/blob/v0.14.0/model/errors.go), [`inference/model/contextlimits.go`](https://github.com/looprig/inference/blob/v0.14.0/model/contextlimits.go)
- Tests: [`inference/model/model_test.go`](https://github.com/looprig/inference/blob/v0.14.0/model/model_test.go), [`inference/model/contextlimits_test.go`](https://github.com/looprig/inference/blob/v0.14.0/model/contextlimits_test.go), [`inference/model/apiformat_test.go`](https://github.com/looprig/inference/blob/v0.14.0/model/apiformat_test.go)

Related: [Custom models](/docs/guides/inference/models/custom-models), [Model identity](/docs/guides/inference/models/identity).
