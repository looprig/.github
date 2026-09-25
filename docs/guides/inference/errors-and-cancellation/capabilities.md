---
id: guides/inference/errors-and-cancellation/capabilities
title: Unsupported capabilities
description: Distinguish a model capability rejection from a malformed request or provider failure.
audience: developer
section: guides
order: 100
publication: released
proofs:
  model: [release-github-com-looprig-inference]
  behavior: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Unsupported Capabilities

Capabilities are local gating data on `model.Model`; they are not sent to a
provider. The request gate reports unsupported features before encoding. Dialect-specific
rejections stay in the codec: the Anthropic encoder returns
`UndeclaredThinkingDialectError` when a thinking-capable model declares no
`Caps.ThinkingDialect`.

## Model

```go
type Capabilities struct {
	AcceptsImages             bool
	Tools                     bool
	Thinking                  bool
	ThinkingDialect           ThinkingDialect
	StructuredOutput          bool
	StructuredOutputWithTools bool
	PromptCaching             bool
}
```

`StructuredOutputWithTools` requires both `StructuredOutput` and `Tools` in
`Model.Validate`, which also rejects an unknown `ThinkingDialect` and a declared
dialect on a model that is not `Thinking`-capable, both as a `ValidationError`
on field `Caps.ThinkingDialect`. `ThinkingDialect` is `""` when undeclared, or
`"adaptive"` or `"budget"`. `PromptCaching` is an opt-in hint used by the Anthropic
encoder only; other bundled encoders ignore it for request construction.

## Behavior

An unsupported capability is a typed client error, not an HTTP or retryable
provider error. The gateway classifies these feature errors as `400` when it
receives them from request validation. Choose another model or remove the
feature instead of retrying the same request.

## Source and proof

- [`model/capabilities.go`](https://github.com/looprig/inference/blob/v0.14.0/model/capabilities.go)
- [`model/model.go`](https://github.com/looprig/inference/blob/v0.14.0/model/model.go)
- [`gateway/http_errors.go`](https://github.com/looprig/inference/blob/v0.14.0/gateway/http_errors.go)

Run `go test ./model ./gateway`.
