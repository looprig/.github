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
  session-identity: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Feature validation

`ValidateRequestFeatures` is the shared pre-codec gate for optional request features. It checks combinations that provider codecs should not have to rediscover, while leaving dialect-specific validation to the codec.

## Validation order

1. `TransientMessages` must fall within the message slice.
2. `SessionID`, when non-empty, must be sendable verbatim as an HTTP header value.
3. `ToolChoice` must be a value built by `ToolAuto`, `ToolRequired`, or `ToolNamed`; a required choice needs at least one tool, and a named choice must name a declared tool.
4. If the message thread contains images, `Model.Caps.AcceptsImages` must be true. The scan descends into `ToolResultBlock.Content`.
5. If `Output` is nil, validation ends successfully here.
6. The output schema is validated.
7. Tool names must be unique and must not use `StructuredOutputToolName`.
8. The model must advertise structured output, and structured output with tools when tools are present.

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
| `*InvalidTransientMessagesError` | `TransientMessages` is negative or exceeds the message count |
| `*InvalidSessionIDError` | `SessionID` cannot be sent unaltered as a header value |
| `*StructuredOutputConflictError` | Invalid tool choice, duplicate name, or reserved output tool |
| `*ImageInputUnsupportedError` | Image present but model lacks `AcceptsImages` |
| `*SchemaValidationError` | `OutputSchema` is malformed or outside the portable subset |
| `*StructuredOutputUnsupportedError` | Model lacks native structured output |
| `*StructuredOutputWithToolsUnsupportedError` | Model lacks structured output with ordinary tools |

Errors intentionally carry bounded classifications, not raw schema or tool payloads.

## Session identity

The `SessionID` check runs for every provider, including those that never forward the value, so a request that is valid for one provider stays valid after a conversation switches to another. An empty value means absent and always passes. A non-empty value is checked in a fixed order, and exactly one reason is reported:

| `Reason` | Refused value | `Index` |
| --- | --- | --- |
| `SessionIDTooLong` (`too_long`) | More than `MaxSessionIDBytes` (256) bytes | `MaxSessionIDBytes` |
| `SessionIDUnsendableByte` (`unsendable_byte`) | A C0 control byte other than HTAB (including CR, LF, and NUL), or DEL | Offset of the first such byte |
| `SessionIDSurroundingWhitespace` (`surrounding_whitespace`) | A leading or trailing space or tab, which HTTP clients and recipients trim | 0 or the last offset |

Visible ASCII, interior spaces and tabs, and bytes 0x80 through 0xFF are accepted. The error message names the reason and byte offset but never echoes the value.

A refusal fails the whole request, not only the header. If the identifier comes from somewhere you do not control, such as a session id from another system, check it once and omit it when it is refused:

```go
func sendableSessionID(id string) string {
	err := inference.ValidateRequestFeatures(inference.Request{SessionID: id})
	var invalid *inference.InvalidSessionIDError
	if errors.As(err, &invalid) {
		log.Printf("omitting conversation identity: %s at byte %d", invalid.Reason, invalid.Index)
		return ""
	}
	return id
}
```

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/v0.13.0/client.go), [`inference/session_id.go`](https://github.com/looprig/inference/blob/v0.13.0/session_id.go), [`inference/structured_errors.go`](https://github.com/looprig/inference/blob/v0.13.0/structured_errors.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/v0.13.0/client_test.go) covers ordering, nested images, duplicates, reserved names, and bounded diagnostics. [`inference/session_id_test.go`](https://github.com/looprig/inference/blob/v0.13.0/session_id_test.go) covers each session-identity reason.

Related: [Structured output requests](/docs/guides/inference/requests/structured-output), [Model capabilities](/docs/guides/inference/models/capabilities).
