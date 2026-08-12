---
id: guides/inference/responses/attempts
title: Attempt metadata
description: Interpret retry establishment counts without treating them as token attempts.
audience: developer
section: guides
order: 46
publication: released
proofs:
  contract: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Attempt metadata

`Response.Attempts` reports how many attempts produced the response when a retrying decorator counts them. It is deliberately a small integer with explicit zero semantics.

## Contract

```go
type Response struct {
	// ...
	Attempts int
}
```

| Value | Meaning |
| --- | --- |
| `0` | Serving client does not count attempts |
| `1` | First attempt succeeded |
| `>1` | Retries were needed before success |

```go
response, err := client.Invoke(ctx, request)
if err != nil {
	return err
}
switch {
case response.Attempts == 0:
	// Do not infer retry behavior.
case response.Attempts == 1:
	// First attempt succeeded.
default:
	metrics.RetryCount("inference", response.Attempts-1)
}
```

Streaming exposes the same concept as `stream.StreamResult.Attempts`, where it counts establishment attempts before the stream opened. It is not a count of chunks, tool calls, or provider token generations.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/main/client.go), [`inference/stream/result.go`](https://github.com/looprig/inference/blob/main/stream/result.go)
- Tests: [`inference/stream/stream_test.go`](https://github.com/looprig/inference/blob/main/stream/stream_test.go), [`inference/retry/invoke_test.go`](https://github.com/looprig/inference/blob/main/retry/invoke_test.go)

Related: [Terminal stream results](/docs/guides/inference/streaming/terminal-results/), [Responses](/docs/guides/inference/responses/).
