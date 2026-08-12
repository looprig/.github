---
id: guides/inference/context-counting/exact-local
title: Exact local counters
description: Describe an in-process exact counter and its no-retention capability.
audience: developer
section: guides
order: 86
publication: released
proofs:
  definition: [release-github-com-looprig-inference]
  posture: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Exact Local Counters

An exact local counter runs in the same process as the caller and does not
send request bytes to a provider. It still has to declare its tokenizer
revision and quality; “local” describes transport, not accuracy.

## Definition

```go
counter := contextcount.ContextCounterFunc{
	Count: func(ctx context.Context, req inference.Request) (contextcount.ContextCount, error) {
		return contextcount.ContextCount{
			Model: req.Model.Key(), InputTokens: exact(req),
			Quality: contextcount.CountQualityExactLocal,
		}, nil
	},
	Capability: contextcount.CounterCapability{
		Transport: contextcount.CounterTransportLocal,
		Retention: contextcount.RetentionNone,
		TokenizerRev: "tokenizer-v1",
		Quality: contextcount.CountQualityExactLocal,
	},
}
```

The callback must honor context cancellation at its own boundaries and return
the request model key. `ContextCounterFunc` rejects a nil callback, invalid
quality, model mismatch, or quality mismatch.

## Posture

For a provider-neutral local counter, `Provider` and `SecurityIdentity` remain
zero, transport is `Local`, and retention is `None`. That combination is
recognized as provider-neutral by `CompatibleCounter` and does not weaken a
valid inference capability.

## Source and proof

- [`contextcount/contracts.go`](https://github.com/looprig/inference/blob/v0.9.2/contextcount/contracts.go)
- [`contextcount/contracts_errors.go`](https://github.com/looprig/inference/blob/v0.9.2/contextcount/contracts_errors.go)
- [`contextcount/contracts_test.go`](https://github.com/looprig/inference/blob/v0.9.2/contextcount/contracts_test.go)

Run `go test ./contextcount`.
