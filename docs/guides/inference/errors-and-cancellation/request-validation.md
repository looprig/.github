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

The function rejects a transient-message count outside the message slice, a
`SessionID` that cannot be sent verbatim as an HTTP header value, a
named tool choice whose name matches no declared tool, required tool choice
with no tools, image blocks when
`Caps.AcceptsImages` is false, invalid output schemas, duplicate tool names,
the reserved structured-output tool name, structured output without
`Caps.StructuredOutput`, and structured output with tools without
`Caps.StructuredOutputWithTools`. It does not validate provider policy or wire
JSON; those checks remain in each codec.

The `SessionID` rule applies to every provider, whether or not it forwards the
identity, and a refusal fails the whole request. When the identifier comes from
another system, pre-check it with a request that carries only the identity and
omit it on refusal rather than failing every turn.

```go
var invalid *inference.InvalidSessionIDError
if errors.As(inference.ValidateRequestFeatures(inference.Request{SessionID: id}), &invalid) {
	// invalid.Reason is too_long, unsendable_byte, or surrounding_whitespace.
	id = ""
}
```

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

Errors are `InvalidTransientMessagesError`, `InvalidSessionIDError`, `StructuredOutputConflictError`,
`ImageInputUnsupportedError`, `StructuredOutputUnsupportedError`,
`StructuredOutputWithToolsUnsupportedError`, and `SchemaValidationError`. Model diagnostics are bounded; schema bytes,
tool payloads, and raw model names beyond the documented bound are not retained.
`InvalidSessionIDError` carries a `Reason` and a byte `Index`
(`MaxSessionIDBytes`, 256, for `too_long`) and never echoes the identifier.

## Source and proof

- [`client.go`](https://github.com/looprig/inference/blob/v0.13.0/client.go)
- [`session_id.go`](https://github.com/looprig/inference/blob/v0.13.0/session_id.go)
- [`structured_errors.go`](https://github.com/looprig/inference/blob/v0.13.0/structured_errors.go)
- [`structured_result.go`](https://github.com/looprig/inference/blob/v0.13.0/structured_result.go)

Run `go test ./...`.
