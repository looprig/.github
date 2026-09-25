---
id: guides/inference/client/index
title: Overview
description: Start with the provider-neutral Invoke and Stream client contract.
audience: developer
section: guides
order: 28
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  choosing-a-method: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Client overview

`inference.Client` is the provider-neutral seam above codecs, routes, transports, and authentication. It exposes one complete-response method and one pull-based streaming method.

## API surface

```go
type Client interface {
	Invoke(ctx context.Context, req Request) (*Response, error)
	Stream(ctx context.Context, req Request) (*stream.StreamReader[content.Chunk], error)
}
```

The request and response types are also provider-neutral:

```go
type Request struct {
	Model             model.Model
	System            string
	Messages          content.AgenticMessages
	TransientMessages int
	Tools             []Tool
	Output            *OutputSchema
	ToolChoice        ToolChoice
	Override          *model.Sampling
}

type Tool struct {
	Name        string
	Description string
	Schema      json.RawMessage
}
```

Implementations own HTTP resources and should accept a caller's context for cancellation and deadlines. A client is not required to expose provider-specific methods; those belong below this interface.

## Choosing a method

Use `Invoke` when the caller needs one `*Response` and does not need incremental display. Use `Stream` for latency-sensitive UI or when the caller needs `content.Chunk` deltas. Both paths validate request feature combinations before codec encoding.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/v0.13.0/client.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/v0.13.0/client_test.go) includes a compile-time client implementation and request field coverage.

Related: [Complete inference](/docs/guides/inference/client/invoke), [Streaming inference](/docs/guides/inference/client/stream), [Requests](/docs/guides/inference/requests), and the Harness [models and inference loop guide](/docs/guides/harness/loop/models-and-inference).
