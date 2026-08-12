---
id: guides/inference/api-formats/custom
title: Custom API formats
description: Add a provider-neutral custom dialect with explicit codec, route, and stream seams.
audience: developer
section: guides
order: 81
publication: released
proofs:
  open-label: [release-github-com-looprig-inference]
  implementation: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Custom API Formats

`model.APIFormat` is deliberately open. A custom label is valid when the
composition root supplies a matching codec and router; the model package does
not pretend to know provider policy for an unknown string.

## Open label

```go
model := model.CustomModel(
	"acme", model.APIFormat("acme-json"),
	"https://api.acme.example/v1", "acme-small",
)
if err := model.Validate(); err != nil {
	return err
}
```

`Model.Validate` still enforces a non-empty name, safe HTTPS or loopback HTTP
base URL, context-limit relationships, and capability relationships. It does
not add a provider/format allowlist.

## Implementation

Implement `codec.RequestEncoder` and `codec.ResponseDecoder`; add
`codec.StreamDecoder` only if the target streams. Supply a `route.Router` that
owns method, URL, and route headers. If a custom stream body is not SSE, use a
custom framer behind `StreamDecoder`; do not make the generic transport parse
the dialect. Add tests for request bytes, response normalization, body close
on decoder failure, and typed unsupported-feature errors.

```go
var _ codec.Codec = acmeCodec{}
var _ route.Router = acmeRouter{}
```

## Source and proof

- [`model/apiformat.go`](https://github.com/looprig/inference/blob/v0.9.2/model/apiformat.go)
- [`codec/contracts.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/contracts.go)
- [`route/contracts.go`](https://github.com/looprig/inference/blob/v0.9.2/route/contracts.go)
- [`transport/client.go`](https://github.com/looprig/inference/blob/v0.9.2/transport/client.go)

Run the custom package's tests together with `go test ./model ./codec ./route ./transport`.
