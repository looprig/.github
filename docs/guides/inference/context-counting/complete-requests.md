---
id: guides/inference/context-counting/complete-requests
title: Count complete requests
description: Include every request component in a deterministic preflight count.
audience: developer
section: guides
order: 83
publication: released
proofs:
  inputs: [release-github-com-looprig-inference]
  no-usage: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Count Complete Requests

The bundled estimator counts encoded request bytes for the complete request,
not just the latest user message. Adding any count-affecting request component
changes the encoded input and can change the estimate.

## Inputs

The count includes model identity as encoded by the dialect, `Request.System`,
all conversation turns, tools and schemas, structured-output schema, sampling
fields that the dialect emits, images/documents that the dialect supports, and
tool-result metadata that survives that dialect's encoding. Historical
`content.Usage` attached to messages is not encoded and does not affect the
count.

```go
count, err := contextcount.NewEstimator().CountContext(ctx, req)
if err != nil {
	return err
}
fmt.Printf("%s/%s: %d input tokens (%v)\n",
	count.Model.Provider, count.Model.Model, count.InputTokens, count.Quality)
```

## No usage

`ContextCounter` has no response argument and no output-token field. Use
`inference.Response.Usage` after a call for provider-reported consumption.
Combining those two roles would turn a preflight admission count into a
postflight accounting wrapper and would misstate the model's context window.

## Source and proof

- [`contextcount/estimator.go`](https://github.com/looprig/inference/blob/v0.13.0/contextcount/estimator.go)
- [`contextcount/estimator_test.go`](https://github.com/looprig/inference/blob/v0.13.0/contextcount/estimator_test.go)
- [`client.go`](https://github.com/looprig/inference/blob/v0.13.0/client.go)

Run `go test ./contextcount`.
