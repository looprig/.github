---
id: guides/inference/errors-and-cancellation/typed-errors
title: Typed errors
description: Inspect bounded typed failures without retaining provider bodies or caller secrets.
audience: developer
section: guides
order: 98
publication: released
proofs:
  families: [release-github-com-looprig-inference]
  inspection: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Typed Errors

The public error types carry a bounded classification and unwrap only safe
causes. Provider response bodies, authorization headers, and arbitrary model
output are not retained in the shared failure values.

## Families

| Family | Types |
| --- | --- |
| request | `ModelMismatchError`, `InvalidTransientMessagesError`, structured-output validation/conflict errors |
| transport | `RequestBuildError`, `NetworkError`, `APIError`, `ResponseBodyTooLargeError` |
| codec | `UnsupportedBlockError`, `UnsupportedConversationError`, dialect decode errors |
| stream | `StreamReaderError`, `StreamResultError`, dialect `StreamAPIError` |
| gateway | route, authentication, concurrency, and upstream invocation errors |

`failure.APIError` retains only a valid status, a bounded gateway-owned status
text, an allowlisted provider code, a bounded request ID, and an
integer-second retry delay. `NetworkError` wraps the
underlying network cause. Gateway HTTP writers classify recognized gateway
errors and pass native codec errors to the codec that produced them.

## Inspection

```go
var apiErr *failure.APIError
if errors.As(err, &apiErr) {
	fmt.Println(apiErr.Status, apiErr.Code, apiErr.RetryAfter)
}
if errors.Is(err, context.Canceled) {
	return err
}
```

## Source and proof

- [`failure/errors.go`](https://github.com/looprig/inference/blob/v0.12.0/failure/errors.go)
- [`gateway/http_errors.go`](https://github.com/looprig/inference/blob/v0.12.0/gateway/http_errors.go)
- [`structured_errors.go`](https://github.com/looprig/inference/blob/v0.12.0/structured_errors.go)

Run `go test ./failure ./gateway`.
