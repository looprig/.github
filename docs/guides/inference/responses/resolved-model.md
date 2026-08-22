---
id: guides/inference/responses/resolved-model
title: Resolved model
description: Attribute a response to the provider model selected by the serving path.
audience: developer
section: guides
order: 45
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Resolved model

`Response.Model` is the provider model name associated with the completed response. It is a string because the response may come from a resolver or retrying decorator that resolved a model name at invocation time.

## API surface

```go
type Response struct {
	// ...
	Model string
}
```

```go
response, err := client.Invoke(ctx, request)
if err != nil {
	return err
}
if response.Model != "" {
	log.Printf("served by %s", response.Model)
}
```

The request-side `Model` is the full descriptor and stable identity source. The response-side string is reporting metadata, not a new routing target. Do not use an untrusted response model string to override a configured endpoint or credentials.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/main/client.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/main/client_test.go), [`inference/stream/result.go`](https://github.com/looprig/inference/blob/main/stream/result.go)

Related: [Model identity](/docs/guides/inference/models/identity), [Model selection](/docs/guides/inference/requests/model-selection).
