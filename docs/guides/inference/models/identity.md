---
id: guides/inference/models/identity
title: Model identity
description: Keep stable provider and model identity separate from endpoints and codecs.
audience: developer
section: guides
order: 21
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Model identity

`ModelKey` is the stable identity of a resolved model. It contains only the provider namespace and provider model ID, so changing a base URL or API format does not silently change the model's identity.

## API surface

```go
type ProviderName string

type ModelKey struct {
	Provider ProviderName
	Model    string
}

func (k ModelKey) Validate() error
```

`Model.Key()` returns `ModelKey{Provider: m.Provider, Model: m.Name}`. Validation returns `*ModelKeyValidationError` with `Field` set to `ModelKeyFieldProvider` or `ModelKeyFieldModel` and `Reason` set to `ModelKeyValidationReasonEmpty`.

```go
descriptor := model.CustomModel(
	model.ProviderName("acme"), model.APIFormatOpenAI,
	"https://api.example.test", "chat-1",
)
key := descriptor.Key()
if err := key.Validate(); err != nil {
	panic(err)
}
```

`ProviderName` is opaque and has no provider policy. An empty provider is a wildcard in the descriptor, but a fully resolved `ModelKey` must validate both fields.

## Proof

- Source: [`inference/model/modelkey.go`](https://github.com/looprig/inference/blob/main/model/modelkey.go), [`inference/model/provider.go`](https://github.com/looprig/inference/blob/main/model/provider.go), [`inference/model/model.go`](https://github.com/looprig/inference/blob/main/model/model.go)
- Tests: [`inference/model/modelkey_test.go`](https://github.com/looprig/inference/blob/main/model/modelkey_test.go)

Related: [Model](/docs/guides/inference/models/model/), [Resolved model](/docs/guides/inference/responses/resolved-model/).
