---
id: guides/inference/client/invoke
title: Complete inference
description: Invoke a client and consume one authoritative provider-neutral response.
audience: developer
section: guides
order: 29
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  error-and-cancellation-ownership: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Complete inference

`Client.Invoke` performs one request and returns a complete `*inference.Response`. The client resolves the model, encodes the request, drains the response, and returns normalized assistant content and terminal metadata.

## API surface

```go
type Client interface {
	Invoke(ctx context.Context, req Request) (*Response, error)
}
```

```go
ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()

response, err := client.Invoke(ctx, inference.Request{
	Model: model.CustomModel(
		model.ProviderName("acme"), model.APIFormatOpenAI,
		"https://api.example.test", "chat-1",
	),
	Messages: content.AgenticMessages{
		&content.UserMessage{Message: content.Message{
			Role: content.RoleUser,
			Blocks: []content.Block{&content.TextBlock{Text: "Hello"}},
		}},
	},
})
if err != nil {
	// Inspect typed errors with errors.As where a retry or user message is needed.
	return err
}
if response.Message != nil {
	// Response.Message is the assistant turn, not a provider JSON envelope.
	_ = response.Message.Blocks
}
```

`Request.Model` is secret-free; authentication is supplied by the configured client. `Request.System` is per-call instruction text, while the message thread is preserved separately. A successful response may have nil `Usage` or an unknown zero `FinishReason` when the provider did not report metadata.

## Error and cancellation ownership

The caller owns the context and decides whether an error is retryable. The client owns transport response bodies and closes them before returning. A cancelled context should stop work and return its cancellation error or a wrapped transport error; callers should not retry a request after the context is done.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/main/client.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/main/client_test.go), [`inference/transport/client_test.go`](https://github.com/looprig/inference/blob/main/transport/client_test.go)
- Example: [`inference/examples/invoke/main.go`](https://github.com/looprig/inference/blob/main/examples/invoke/main.go)

Related: [Responses](/docs/guides/inference/responses), [Request feature validation](/docs/guides/inference/requests/feature-validation).
