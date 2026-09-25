---
id: guides/inference/context-counting/fail-closed
title: Fail-closed counting
description: Keep unknown models, formats, quality, and capability metadata from becoming guesses.
audience: developer
section: guides
order: 90
publication: released
proofs:
  boundaries: [release-github-com-looprig-inference]
  behavior: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Fail-Closed Counting

Counting is a trust boundary. If the implementation cannot identify the model,
encode the selected format, or prove its count quality, it returns an error
instead of manufacturing a number.

## Boundaries

The estimator rejects a nil receiver, nil context, canceled context, invalid
model key, unsupported API format, and encoder failure. `ContextCounterFunc`
rejects missing callbacks, invalid quality, model mismatch, and capability
quality mismatch. Capability validation rejects unknown transport, retention,
quality, or tokenizer revision.

## Behavior

Do not replace a failed preflight count with a message-length guess. Surface the
typed error to the admission policy. A caller that intentionally allows a
heuristic must construct and validate a counter whose capability says so; that
choice is explicit and auditable.

```go
count, err := counter.CountContext(ctx, req)
if err != nil {
	// No invocation is authorized from this path.
	return err
}
if count.Quality == contextcount.CountQualityUnknown {
	return errors.New("counter returned unknown quality")
}
```

## Source and proof

- [`contextcount/estimator.go`](https://github.com/looprig/inference/blob/v0.13.0/contextcount/estimator.go)
- [`contextcount/contracts.go`](https://github.com/looprig/inference/blob/v0.13.0/contextcount/contracts.go)
- [`contextcount/estimator_test.go`](https://github.com/looprig/inference/blob/v0.13.0/contextcount/estimator_test.go)

Run `go test ./contextcount`.
