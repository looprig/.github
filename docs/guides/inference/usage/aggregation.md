---
id: guides/inference/usage/aggregation
title: Aggregate usage
description: Add independent usage observations with overflow and validation checks.
audience: developer
section: guides
order: 96
publication: released
proofs:
  add: [release-github-com-looprig-inference]
  overflow: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Aggregate Usage

`content.Usage.Add` combines token fields without mutating either operand. It
validates both inputs first and uses checked addition for every field.

## Add

```go
total, err := first.Add(second)
if err != nil {
	var validation *content.UsageValidationError
	if errors.As(err, &validation) {
		return validation
	}
	return err
}
contextTokens, err := total.ContextTokens()
if err != nil {
	return err
}
fmt.Println(contextTokens)
```

The fields added are input, output, cache read, cache creation, and reasoning.
Derived context and total values are computed on demand rather than stored,
which keeps aggregation unambiguous when cache fields are absent.

## Overflow

An addition that exceeds `content.TokenCount` returns
`*content.UsageOverflowError` naming the field and both operands. A failed
aggregation returns the zero usage value and does not expose a wrapped partial
sum.

## Source and proof

- [`core/content/usage.go`](https://github.com/looprig/core/blob/v0.6.0/content/usage.go)
- [`core/content/usage_test.go`](https://github.com/looprig/core/blob/v0.6.0/content/usage_test.go)
- [`usage/usage_test.go`](https://github.com/looprig/inference/blob/v0.12.0/usage/usage_test.go)

Run `go test ./usage` and `go test` in the core module.
