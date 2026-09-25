---
id: guides/inference/context-counting/counter-capabilities
title: Counter capabilities
description: Declare counter transport, retention, tokenizer revision, and quality.
audience: developer
section: guides
order: 84
publication: released
proofs:
  metadata: [release-github-com-looprig-inference]
  validation: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Counter Capabilities

`CounterCapability` is trust metadata returned without I/O. It tells policy
what the count means and where request bytes traveled.

## Metadata

```go
type CounterCapability struct {
	Provider         ProviderID
	Transport        CounterTransport
	SecurityIdentity SecurityIdentity
	Retention        RetentionPosture
	TokenizerRev     TokenizerRevision
	Quality          CountQuality
}
```

Transport values are `local`, `same endpoint`, and `separate endpoint`.
Retention values are `none`, `ephemeral`, and `logged`. Quality values are
`ExactProvider`, `ExactLocal`, or `HeuristicEstimate`; unknown is invalid.
`TokenizerRev` must be non-empty. Remote transports require provider and a
nonzero security identity. Local counters must leave the identity zero.

## Validation

`CounterCapability.Validate` returns `*CapabilityValidationError` with the
capability kind, field, and closed reason. `ContextCounterFunc` additionally
requires each returned count's model to equal `req.Model.Key()` and its quality
to equal the declared capability.

```go
capability := counter.CounterCapability()
if err := capability.Validate(); err != nil {
	var fieldErr *contextcount.CapabilityValidationError
	if errors.As(err, &fieldErr) {
		fmt.Println(fieldErr.Field, fieldErr.Reason)
	}
	return err
}
```

## Source and proof

- [`contextcount/contracts.go`](https://github.com/looprig/inference/blob/v0.14.0/contextcount/contracts.go)
- [`contextcount/contracts_errors.go`](https://github.com/looprig/inference/blob/v0.14.0/contextcount/contracts_errors.go)
- [`contextcount/contracts_test.go`](https://github.com/looprig/inference/blob/v0.14.0/contextcount/contracts_test.go)

Run `go test ./contextcount`.
