---
id: guides/inference/context-counting/compatibility
title: Counter compatibility
description: Reject a counter that weakens the inference transport, identity, or retention posture.
audience: developer
section: guides
order: 89
publication: released
proofs:
  rules: [release-github-com-looprig-inference]
  errors: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Counter Compatibility

`CompatibleCounter` compares an `InferenceCapability` with a
`CounterCapability` before the count is used for admission.

## Rules

| Inference transport | Counter transport admitted |
| --- | --- |
| local | local with matching provider-neutral posture |
| TLS | local, same endpoint, or separate endpoint for the same provider, subject to identity and retention rules |
| attested TLS | local or same endpoint; separate endpoint is a downgrade |
| end-to-end encrypted | local or same endpoint; separate endpoint is a downgrade |

Same-endpoint counters must match provider and `SecurityIdentity`. Separate
endpoint counters must match provider and are admitted only for TLS inference.
Retention cannot be weaker than the inference retention claim, and an unknown
inference retention posture fails closed. A provider-neutral counter is exempt:
it is admitted before the transport, identity, and retention comparisons run, so
it is compatible with an unknown retention posture.

## Errors

Failures are `*CounterCompatibilityError` with one of invalid inference,
invalid counter, provider mismatch, security identity mismatch, transport
downgrade, or retention downgrade. Invalid metadata itself is reported as
`*CapabilityValidationError` and is wrapped as the cause where applicable.

```go
if err := contextcount.CompatibleCounter(inferenceCap, counterCap); err != nil {
	var incompatible *contextcount.CounterCompatibilityError
	if errors.As(err, &incompatible) {
		fmt.Println(incompatible.Reason)
	}
	return err
}
```

## Source and proof

- [`contextcount/contracts.go`](https://github.com/looprig/inference/blob/v0.13.0/contextcount/contracts.go)
- [`contextcount/contracts_errors.go`](https://github.com/looprig/inference/blob/v0.13.0/contextcount/contracts_errors.go)
- [`contextcount/contracts_test.go`](https://github.com/looprig/inference/blob/v0.13.0/contextcount/contracts_test.go)

Run `go test ./contextcount`.
