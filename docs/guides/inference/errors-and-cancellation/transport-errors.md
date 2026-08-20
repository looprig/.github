---
id: guides/inference/errors-and-cancellation/transport-errors
title: Transport errors
description: Distinguish request construction, network, bounded-body, and HTTP status failures.
audience: developer
section: guides
order: 102
publication: released
proofs:
  construction: [release-github-com-looprig-inference]
  status: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Transport Errors

`transport.Client` performs pre-I/O binding and model checks, builds a fresh
request, authorizes it, and maps the HTTP result. It never retries or replays a
single-shot body.

## Construction

`RequestBuildError` wraps router or `net/http` request construction failures.
`ModelMismatchError` rejects a non-empty request provider, base URL, or format
that conflicts with the bound endpoint. `UnsupportedStreamingError` is returned
before I/O when no stream decoder exists. These are not `NetworkError` values.

```go
response, err := client.Invoke(ctx, req)
if err != nil {
	var buildErr *transport.RequestBuildError
	if errors.As(err, &buildErr) {
		// Fix route or model binding; do not retry as a network failure.
	}
	return err
}
_ = response
```

## Status

Network failures become `*failure.NetworkError`. Non-2xx responses become
`*failure.APIError` after a bounded transient body prefix is parsed for an
allowlisted code and request ID; the body is closed and not retained.
`Retry-After` accepts integer seconds. Successful invoke bodies are bounded by
`MaxResponseBodyBytes`; oversized successful bodies return
`ResponseBodyTooLargeError`.

## Source and proof

- [`transport/client.go`](https://github.com/looprig/inference/blob/v0.12.0/transport/client.go)
- [`failure/errors.go`](https://github.com/looprig/inference/blob/v0.12.0/failure/errors.go)
- [`transport/client_test.go`](https://github.com/looprig/inference/blob/v0.12.0/transport/client_test.go)

Run `go test ./transport ./failure`.
