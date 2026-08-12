---
id: guides/inference/context-counting/errors
title: Counting errors
description: Inspect typed count, model, encoding, capability, and compatibility failures.
audience: developer
section: guides
order: 91
publication: released
proofs:
  types: [release-github-com-looprig-inference]
  inspection: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Counting Errors

Count failures preserve bounded classifications without retaining request bytes.
Inspect them with `errors.As` and `errors.Is`.

## Types

| Error | Meaning |
| --- | --- |
| `EstimatorStateError` | nil estimator or nil context |
| `ModelIdentityError` | invalid model key or identity |
| `UnsupportedAPIFormatError` | no bundled estimator encoder |
| `RequestEncodingError` | selected codec rejected the request |
| `ContextCountError` | callback missing, canceled, model/quality mismatch, or wrapped cause |
| `CapabilityValidationError` | malformed capability metadata |
| `CounterCompatibilityError` | counter weakens inference trust posture |

`ContextCountError.Unwrap` exposes the safe cause. The errors do not include
raw request bodies or provider response content.

## Inspection

```go
var unsupported *contextcount.UnsupportedAPIFormatError
var encoding *contextcount.RequestEncodingError
switch {
case errors.As(err, &unsupported):
	// choose an exact provider counter or reject admission
case errors.As(err, &encoding):
	// fix the request or use a dialect that represents it
}
```

## Source and proof

- [`contextcount/errors.go`](https://github.com/looprig/inference/blob/v0.9.2/contextcount/errors.go)
- [`contextcount/contracts_errors.go`](https://github.com/looprig/inference/blob/v0.9.2/contextcount/contracts_errors.go)
- [`contextcount/estimator_test.go`](https://github.com/looprig/inference/blob/v0.9.2/contextcount/estimator_test.go)

Run `go test ./contextcount`.
