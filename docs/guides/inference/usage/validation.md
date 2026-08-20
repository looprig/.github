---
id: guides/inference/usage/validation
title: Usage validation
description: Enforce count relationships, null handling, and checked arithmetic at the usage boundary.
audience: developer
section: guides
order: 95
publication: released
proofs:
  rules: [release-github-com-looprig-inference]
  errors: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Usage Validation

Usage normalization rejects invalid provider values before a response or
terminal stream result is published.

## Rules

`usagenorm.Count` accepts bounded nonnegative integer values and distinguishes
missing/null fields from zero. Normalization rejects negative, fractional,
out-of-range, and inconsistent values. Cache-read and cache-creation subsets
must not exceed gross input. `content.Usage.Validate` requires
`ReasoningTokens <= OutputTokens`; `ContextTokens`, `TotalTokens`, and `Add`
use checked addition.

## Errors

```go
var err error // set by a codec decoder
var normalizeErr *inferenceusage.UsageNormalizationError
if errors.As(err, &normalizeErr) {
	fmt.Println(normalizeErr.Field, normalizeErr.Reason)
}
var domainErr *content.UsageValidationError
if errors.As(err, &domainErr) {
	fmt.Println(domainErr.Field, domainErr.Reason)
}
```

No raw provider body or model output is stored in these errors. A decoder
returns the error and does not publish a partially normalized value.

## Source and proof

- [`internal/usagenorm/count.go`](https://github.com/looprig/inference/blob/v0.12.0/internal/usagenorm/count.go)
- [`internal/usagenorm/field.go`](https://github.com/looprig/inference/blob/v0.12.0/internal/usagenorm/field.go)
- [`usage/errors.go`](https://github.com/looprig/inference/blob/v0.12.0/usage/errors.go)
- [`core/content/usage.go`](https://github.com/looprig/core/blob/v0.6.0/content/usage.go)

Run `go test ./internal/usagenorm ./usage` and `go test` in the core module for domain validation.
