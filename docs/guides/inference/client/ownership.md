---
id: guides/inference/client/ownership
title: Ownership and concurrency
description: Understand which side owns requests, streams, bodies, and concurrent access.
audience: developer
section: guides
order: 31
publication: released
proofs:
  ownership-table: [release-github-com-looprig-inference]
  deep-copies-at-model-boundaries: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Ownership and concurrency

Inference keeps ownership explicit at each boundary. A caller owns request values and the context; a client owns transport resources; a returned stream owns its response body until `Close`.

## Ownership table

| Value or operation | Owner | Concurrency contract |
| --- | --- | --- |
| `Request` and `Messages` | Caller | Do not mutate while the client encodes it |
| `Model` | Caller or catalogue | `Clone` deep-copies sampling metadata |
| `context.Context` | Caller | Cancellation and deadline are caller-controlled |
| `Response` | Caller after `Invoke` returns | Ordinary Go values; no internal synchronization |
| `StreamReader.Next` | Reader | Calls are serialized internally |
| `StreamReader.Close` | Caller and reader | Idempotent; wrapped closer runs once |
| HTTP response body | Client/stream reader | Released by EOF cleanup or explicit `Close` |

```go
reader, err := client.Stream(ctx, req)
if err != nil {
	return err
}
defer func() {
	if closeErr := reader.Close(); closeErr != nil {
		log.Printf("stream close: %v", closeErr)
	}
}()
```

`Close` is deliberately not serialized behind a blocking `Next`, so it can interrupt I/O. The underlying next and close functions must tolerate that concurrency. Do not call `Next` concurrently to obtain parallel chunks; the reader will serialize it, not make the provider response parallel-safe.

## Deep copies at model boundaries

`Model.Clone`, `Sampling.Clone`, and `WithSampling` copy pointer and slice fields. Raw content byte slices created by ordinary struct literals are not automatically copied; copy caller-owned bytes before handing a request to asynchronous code.

## Proof

- Source: [`inference/stream/stream.go`](https://github.com/looprig/inference/blob/main/stream/stream.go), [`inference/model/model.go`](https://github.com/looprig/inference/blob/main/model/model.go), [`inference/model/sampling.go`](https://github.com/looprig/inference/blob/main/model/sampling.go)
- Tests: [`inference/stream/stream_test.go`](https://github.com/looprig/inference/blob/main/stream/stream_test.go), [`inference/model/sampling_test.go`](https://github.com/looprig/inference/blob/main/model/sampling_test.go), [`inference/model/model_test.go`](https://github.com/looprig/inference/blob/main/model/model_test.go)

Related: [Streaming inference](/docs/guides/inference/client/stream), [Close streams](/docs/guides/inference/streaming/close).
