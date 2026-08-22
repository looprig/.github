---
id: guides/inference/requests/feature-validation
title: Feature validation
description: Validate request feature combinations and inspect bounded typed errors.
audience: developer
section: guides
order: 40
publication: released
proofs:
  validation-order: [release-github-com-looprig-inference]
  typed-failures: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Feature validation

`ValidateRequestFeatures` is the shared pre-codec gate for optional request features. It checks combinations that provider codecs should not have to rediscover, while leaving dialect-specific validation to the codec.

## Validation order

1. `TransientMessages` must fall within the message slice.
2. `ToolChoice` must be a value built by `ToolAuto`, `ToolRequired`, or `ToolNamed`; a required choice needs at least one tool, and a named choice must name a declared tool.
2. If the message thread contains images, `Model.Caps.AcceptsImages` must be true. The scan descends into `ToolResultBlock.Content`.
3. If `Output` is nil, validation ends successfully here.
4. The output schema is validated.
5. Tool names must be unique and must not use `StructuredOutputToolName`.
6. The model must advertise structured output, and structured output with tools when tools are present.

```go
err := inference.ValidateRequestFeatures(request)
var unsupported *inference.StructuredOutputUnsupportedError
if errors.As(err, &unsupported) {
	// Present a model-capability message without exposing schema bytes.
	log.Printf("model cannot produce structured output: %s", unsupported.Model)
}
```

## Typed failures

| Error | When |
| --- | --- |
| `*StructuredOutputConflictError` | Invalid tool choice, duplicate name, or reserved output tool |
| `*ImageInputUnsupportedError` | Image present but model lacks `AcceptsImages` |
| `*SchemaValidationError` | `OutputSchema` is malformed or outside the portable subset |
| `*StructuredOutputUnsupportedError` | Model lacks native structured output |
| `*StructuredOutputWithToolsUnsupportedError` | Model lacks structured output with ordinary tools |

Errors intentionally carry bounded classifications, not raw schema or tool payloads.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/main/client.go), [`inference/structured_errors.go`](https://github.com/looprig/inference/blob/main/structured_errors.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/main/client_test.go) covers ordering, nested images, duplicates, reserved names, and bounded diagnostics.

Related: [Structured output requests](/docs/guides/inference/requests/structured-output), [Model capabilities](/docs/guides/inference/models/capabilities).
