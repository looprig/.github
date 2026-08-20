---
id: guides/inference/errors-and-cancellation/cancellation
title: Context cancellation
description: Propagate caller cancellation through authorization, HTTP setup, body reads, and streams.
audience: developer
section: guides
order: 104
publication: released
proofs:
  invoke: [release-github-com-looprig-inference]
  stream: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Context Cancellation

The caller's context is the cancellation authority. The transport binds it to
the request before authorization and HTTP execution; stream consumption stays
bound to the same request context.

## Invoke

`InvokeWithAuth` checks binding, model validity, authorizer presence, route and
encoding, call-scoped authorization, HTTP, and bounded body reads in order.
Cancellation during a call-scoped authorizer returns the credentials/httpauth
typed cancellation; the legacy `Invoke` wrapper preserves its historical
`NetworkError` conversion for compatibility.

```go
ctx, cancel := context.WithCancel(context.Background())
defer cancel()
response, err := client.Invoke(ctx, req)
if errors.Is(err, context.Canceled) {
	return err
}
_ = response
```

## Stream

`Stream` cancellation can stop connection setup or a later `Next` call. Once a
reader is returned, the retry decorator does not re-establish it after a
mid-stream cancellation or provider error. Call `Close` to release the body;
it is safe even when cancellation already interrupted a read.

## Source and proof

- [`transport/client.go`](https://github.com/looprig/inference/blob/v0.12.0/transport/client.go)
- [`credentials/httpauth/httpauth.go`](https://github.com/looprig/credentials/blob/v0.2.0/httpauth/httpauth.go)
- [`stream/stream.go`](https://github.com/looprig/inference/blob/v0.12.0/stream/stream.go)

Run `go test ./transport ./stream`.
