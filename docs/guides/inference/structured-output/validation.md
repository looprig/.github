---
id: guides/inference/structured-output/validation
title: Schema validation
description: Validate output metadata and portable schema with stable bounded classifications.
audience: developer
section: guides
order: 60
publication: released
proofs:
  validation-sequence: [release-github-com-looprig-inference]
  stable-classifications: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Schema validation

`ValidateOutputSchema` returns `*SchemaValidationError` with stable `Field` and `ReasonCode` values. It never includes raw schema bytes, property names, descriptions, or decoder text in the error.

## Validation sequence

1. Validate `Name` for emptiness, length, reserved name, and ASCII identifier syntax.
2. Validate description UTF-8 and its 4096-byte bound.
3. Validate schema size, UTF-8, JSON syntax, and object root.
4. Reject duplicate object members.
5. Recursively enforce allowed keywords, required properties, enum type matching, depth, and property count.

```go
err := inference.ValidateOutputSchema(output)
var schemaErr *inference.SchemaValidationError
if errors.As(err, &schemaErr) {
	fmt.Println(schemaErr.Field, schemaErr.ReasonCode)
}
```

## Stable classifications

`SchemaValidationField` includes `Name`, `Description`, `Schema`, `Keyword`, `Type`, `Properties`, `Items`, `Enum`, `Required`, `AdditionalProperties`, and `Output`. `SchemaValidationReason` includes `empty`, `invalid`, `reserved`, `too long`, `invalid UTF-8`, `malformed`, `too large`, `root is not an object schema`, `unknown keyword`, `missing`, `unsupported`, `must be false`, `duplicate`, `unknown property`, `type mismatch`, `too deep`, and `too many properties`.

Tests assert that caller-provided secret strings do not appear in validation errors. Log the bounded field and reason, not the original schema.

## Proof

- Source: [`inference/output.go`](https://github.com/looprig/inference/blob/main/output.go), [`inference/structured_errors.go`](https://github.com/looprig/inference/blob/main/structured_errors.go)
- Tests: [`inference/output_test.go`](https://github.com/looprig/inference/blob/main/output_test.go)

Related: [Portable JSON Schema](/docs/guides/inference/structured-output/portable-json-schema), [Structured-output errors](/docs/guides/inference/structured-output/errors).
