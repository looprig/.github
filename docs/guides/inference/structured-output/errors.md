---
id: guides/inference/structured-output/errors
title: Structured-output errors
description: Handle bounded schema, representation, finish, and decode errors with errors.As.
audience: developer
section: guides
order: 63
publication: released
proofs:
  error-families: [release-github-com-looprig-inference]
  malformed-reasons: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Structured-output errors

Structured-output errors are typed and bounded. Use `errors.As` to branch on the class and inspect stable fields; error strings intentionally do not retain raw schema or model output.

## Error families

| Type | Stable data |
| --- | --- |
| `*SchemaValidationError` | `Field`, `ReasonCode` |
| `*StructuredOutputUnsupportedError` | bounded `Model` |
| `*StructuredOutputWithToolsUnsupportedError` | bounded `Model` |
| `*ImageInputUnsupportedError` | bounded `Model` |
| `*StructuredOutputConflictError` | bounded `Feature` |
| `*MalformedStructuredOutputError` | `ReasonCode`, `Length`, SHA-256 digest |
| `*StructuredOutputFinishError` | `Reason` |

```go
raw, err := inference.StructuredResult(response)
if err != nil {
	var malformed *inference.MalformedStructuredOutputError
	var finish *inference.StructuredOutputFinishError
	switch {
	case errors.As(err, &malformed):
		log.Printf("model output rejected: %s (%d bytes)", malformed.ReasonCode, malformed.Length)
	case errors.As(err, &finish):
		log.Printf("finish reason cannot represent structured output: %s", finish.Reason)
	default:
		return err
	}
	return err
}
_ = raw
```

`MaxStructuredResultBytes` is 1 MiB. `MaxStructuredOutputDiagnosticBytes` bounds caller-controlled metadata retained by structured-output errors at 128 bytes. The SHA-256 digest supports correlation without exposing output bytes.

## Malformed reasons

The bounded `MalformedStructuredOutputReason` values include nil response/message, wrong role, empty, malformed JSON, non-object root, invalid representation, ambiguous blocks, invalid block, nil block, and too large. A finish mismatch is reported separately so callers can distinguish provider termination from malformed JSON.

## Proof

- Source: [`inference/structured_errors.go`](https://github.com/looprig/inference/blob/v0.13.0/structured_errors.go), [`inference/structured_result.go`](https://github.com/looprig/inference/blob/v0.13.0/structured_result.go)
- Tests: [`inference/structured_result_test.go`](https://github.com/looprig/inference/blob/v0.13.0/structured_result_test.go), [`inference/output_test.go`](https://github.com/looprig/inference/blob/v0.13.0/output_test.go)

Related: [Schema validation](/docs/guides/inference/structured-output/validation), [Typed decoding](/docs/guides/inference/structured-output/decoding), [Finish reasons](/docs/guides/inference/responses/finish-reasons).
