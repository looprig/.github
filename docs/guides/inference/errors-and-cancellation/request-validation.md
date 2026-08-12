---
id: guides/inference/errors-and-cancellation/request-validation
title: Request validation errors
description: Reject invalid feature combinations before a codec or transport performs I/O.
audience: developer
section: guides
order: 99
publication: released
proofs:
  rules: [release-github-com-looprig-inference]
  errors: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Request Validation Errors

`inference.ValidateRequestFeatures` is the common pre-codec gate. It validates
feature combinations against the model's declared capabilities.

## Rules

The function rejects required tool choice with no tools, image blocks when
`Caps.AcceptsImages` is false, invalid output schemas, duplicate tool names,
the reserved structured-output tool name, structured output without
`Caps.StructuredOutput`, and structured output with tools without
`Caps.StructuredOutputWithTools`. It does not validate provider policy or wire
JSON; those checks remain in each codec.

```go
if err := inference.ValidateRequestFeatures(req); err != nil {
	var conflict *inference.StructuredOutputConflictError
	if errors.As(err, &conflict) {
		fmt.Println(conflict.Feature)
	}
	return err
}
```

## Errors

Errors are `StructuredOutputConflictError`, `ImageInputUnsupportedError`,
`StructuredOutputUnsupportedError`, `StructuredOutputWithToolsUnsupportedError`,
and `SchemaValidationError`. Model diagnostics are bounded; schema bytes,
tool payloads, and raw model names beyond the documented bound are not retained.

## Source and proof

- [`client.go`](https://github.com/looprig/inference/blob/v0.9.2/client.go)
- [`structured_errors.go`](https://github.com/looprig/inference/blob/v0.9.2/structured_errors.go)
- [`structured_result.go`](https://github.com/looprig/inference/blob/v0.9.2/structured_result.go)

Run `go test ./...`.
