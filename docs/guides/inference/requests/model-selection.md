---
id: guides/inference/requests/model-selection
title: Model selection
description: Select a secret-free Model descriptor without mixing routing or authentication policy.
audience: developer
section: guides
order: 33
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  stable-identity: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Model selection

`Request.Model` is a complete descriptor, not a string model name. It lets a client select provider namespace, API dialect, endpoint, model ID, capability gates, limits, and defaults without carrying a secret.

## API surface

```go
request := inference.Request{
	Model: model.CustomModel(
		model.ProviderName("acme"),
		model.APIFormatOpenAI,
		"https://api.example.test/v1",
		"chat-1",
		model.WithTools(),
	),
}
if err := request.Model.Validate(); err != nil {
	panic(err)
}
```

`Model.BaseURL` may be empty as a wildcard for a later trust boundary. A non-empty URL must be HTTPS, or HTTP to loopback only. The client or integration layer resolves any catalogue policy and applies authentication separately.

## Stable identity

Use `request.Model.Key()` when caching or attributing results. `ModelKey` contains `Provider` and `Model` only, so it remains stable if an endpoint or codec route changes. Call `Key().Validate()` when an empty provider or name would be unsafe.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/main/client.go), [`inference/model/model.go`](https://github.com/looprig/inference/blob/main/model/model.go)
- Tests: [`inference/model/model_test.go`](https://github.com/looprig/inference/blob/main/model/model_test.go), [`inference/model/modelkey_test.go`](https://github.com/looprig/inference/blob/main/model/modelkey_test.go)

Related: [Model](/docs/guides/inference/models/model/), [Model identity](/docs/guides/inference/models/identity/).
