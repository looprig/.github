---
id: guides/inference/models/model
title: Model
description: Use the complete secret-free model descriptor and its copy semantics.
audience: developer
section: guides
order: 20
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Model

`Model` is the value passed on each `inference.Request`. It deliberately contains no API key and no system prompt. Call `Validate` at the trust boundary before handing it to a client.

## API surface

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

func (m Model) Validate() error
func (m Model) Key() ModelKey
func (m Model) Clone() Model
```

| Field | Sent on provider wire? | Contract |
| --- | --- | --- |
| `Provider` | consumer-defined | Opaque backend namespace |
| `APIFormat` | codec selection | Open string label |
| `BaseURL` | route input | Empty wildcard or safe HTTPS/loopback HTTP URL |
| `Name` | provider model ID | Must be non-empty |
| `Origin` | no | Zero value is fail-safe `OriginCustom` |
| `Caps` | no | Local gating only |
| `Limits` | no | Known context capacity; zero means unknown |
| `Sampling` | codec-dependent | Dialect-neutral defaults |

```go
descriptor := model.Model{
	Provider: model.ProviderName("acme"),
	APIFormat: model.APIFormat("acme-json"),
	BaseURL: "https://api.example.test/v1",
	Name: "chat-1",
}
if err := descriptor.Validate(); err != nil {
	panic(err)
}
stable := descriptor.Key()
```

`Clone` deep-copies `Sampling` pointers and the stop slice. Copy the descriptor before giving it to code that may mutate sampling metadata.

## Proof

- Source: [`inference/model/model.go`](https://github.com/looprig/inference/blob/v0.13.0/model/model.go)
- Tests: [`inference/model/model_test.go`](https://github.com/looprig/inference/blob/v0.13.0/model/model_test.go) covers field validation, options, cloning, and non-aliasing.

Related: [Custom models](/docs/guides/inference/models/custom-models), [Sampling](/docs/guides/inference/models/sampling).
