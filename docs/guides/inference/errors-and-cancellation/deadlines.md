---
id: guides/inference/errors-and-cancellation/deadlines
title: Deadlines
description: Bound invoke completion and stream header setup without aborting long-lived bodies.
audience: developer
section: guides
order: 105
publication: released
proofs:
  invoke: [release-github-com-looprig-inference]
  stream: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Deadlines

The transport uses different timeout budgets for atomic invoke responses and
long-lived streams.

## Invoke

Invoke uses a whole-request timeout of five minutes by default, configurable
with `transport.WithInvokeTimeout` when the duration is positive. The response
is read completely before it is returned, so the whole-request limit does not
discard usable partial output. A context deadline still takes precedence.

## Stream

Stream has a 60-second response-header budget but no whole-request HTTP
timeout. Once headers arrive, the body can run until the caller context is
canceled or the reader closes. This prevents a valid long generation from
being aborted by a fixed body timer.

```go
client := transport.NewWithAuth(endpoint, router, codec, auth,
	transport.WithInvokeTimeout(2*time.Minute),
)
```

At the gateway boundary, an upstream context deadline is classified as `504`;
other upstream API status is preserved when valid, network failures become
`503`, and other provider failures become `502`.

## Source and proof

- [`transport/client.go`](https://github.com/looprig/inference/blob/v0.13.0/transport/client.go)
- [`gateway/http_errors.go`](https://github.com/looprig/inference/blob/v0.13.0/gateway/http_errors.go)
- [`gateway/handler_test.go`](https://github.com/looprig/inference/blob/v0.13.0/gateway/handler_test.go)

Run `go test ./transport ./gateway`.
