---
id: guides/inference/context-counting/exact-provider
title: Exact provider counters
description: Integrate an endpoint-owned exact counter without weakening trust metadata.
audience: developer
section: guides
order: 85
publication: released
proofs:
  adapter: [release-github-com-looprig-inference]
  trust: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Exact Provider Counters

An exact provider counter is an implementation of `ContextCounter` whose
`CountContext` result has `CountQualityExactProvider`. The interface does not
prescribe a provider endpoint or wire shape; the adapter owns those details.

## Adapter

```go
type providerCounter struct {
	capability contextcount.CounterCapability
}

func (c providerCounter) CountContext(ctx context.Context, req inference.Request) (contextcount.ContextCount, error) {
	// Send the provider's complete count request and normalize its response.
	return contextcount.ContextCount{
		Model: req.Model.Key(), Quality: contextcount.CountQualityExactProvider,
		InputTokens: 123,
	}, nil
}

func (c providerCounter) CounterCapability() contextcount.CounterCapability { return c.capability }
```

The placeholder value above is a shape example only; a real adapter must map
the provider response and return its actual count. `ContextCounterFunc` can
wrap the function and enforce model and quality consistency.

## Trust

Declare whether counting uses the same endpoint or a separate endpoint, the
provider identity, security identity, retention posture, tokenizer revision,
and exact quality. `CompatibleCounter` rejects provider, identity, transport,
or retention downgrades before policy uses the result.

## Source and proof

- [`contextcount/contracts.go`](https://github.com/looprig/inference/blob/v0.13.0/contextcount/contracts.go)
- [`contextcount/contracts_errors.go`](https://github.com/looprig/inference/blob/v0.13.0/contextcount/contracts_errors.go)
- [`contextcount/contracts_test.go`](https://github.com/looprig/inference/blob/v0.13.0/contextcount/contracts_test.go)

Run `go test ./contextcount`.
