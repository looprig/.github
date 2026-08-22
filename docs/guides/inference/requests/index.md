---
id: guides/inference/requests/index
title: Overview
description: Assemble a provider-neutral request and validate optional features before encoding.
audience: developer
section: guides
order: 32
publication: released
proofs:
  request-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Requests overview

`inference.Request` is the complete provider-neutral input to `Client.Invoke` or `Client.Stream`. It keeps model identity, per-agent instructions, ordered messages, tools, structured output, tool choice, and per-call sampling in one value.

## Request surface

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
```

| Field | Ownership and behavior |
| --- | --- |
| `Model` | Secret-free descriptor; validate before use |
| `System` | Per-call system instruction, separate from message history |
| `Messages` | Ordered sealed conversation turns |
| `Tools` | Tool definitions exposed to the model |
| `Output` | Optional portable JSON object contract |
| `TransientMessages` | Count of trailing messages excluded from cache breakpoints |
| `ToolChoice` | Automatic, required, or named tool behavior |
| `Override` | Optional per-call replacement for model sampling |

```go
request := inference.Request{
	Model: model.CustomModel(model.ProviderName("acme"), model.APIFormatOpenAI, "https://api.example.test", "chat-1"),
	System: "Answer with evidence.",
	Messages: content.AgenticMessages{&content.UserMessage{Message: content.Message{
		Role: content.RoleUser,
		Blocks: []content.Block{&content.TextBlock{Text: "What changed?"}},
	}}},
}
if err := inference.ValidateRequestFeatures(request); err != nil {
	panic(err)
}
```

The Harness [model request step](/docs/guides/harness/step/model-request) is the canonical consumer path when a request is produced inside a Harness loop.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/main/client.go), [`inference/output.go`](https://github.com/looprig/inference/blob/main/output.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/main/client_test.go)

Related: [Model selection](/docs/guides/inference/requests/model-selection), [Conversation input](/docs/guides/inference/requests/messages), [Feature validation](/docs/guides/inference/requests/feature-validation).
