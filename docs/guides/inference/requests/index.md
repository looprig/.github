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
  conversation-identity: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Requests overview

`inference.Request` is the complete provider-neutral input to `Client.Invoke` or `Client.Stream`. It keeps model identity, per-agent instructions, ordered messages, tools, structured output, tool choice, per-call sampling, and an optional conversation identity in one value.

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
	SessionID         string
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
| `SessionID` | Optional stable conversation identity; empty means absent |

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

## Conversation identity

Some providers apply per-conversation optimizations, such as prompt-cache affinity or routing, only when every request in one conversation carries the same identifier in a documented header. Set `SessionID` to a stable identifier you own for the conversation, and reuse it on every turn. Do not derive it from the message thread: compaction rewrites the thread mid-conversation, so a thread-derived value would change exactly when the cached prefix is rebuilt.

```go
request.SessionID = conversationID // the same value on every turn of this conversation

// A refused SessionID fails the whole request, not just the header.
// Pre-check an identifier you did not mint and omit it rather than fail every turn.
if err := inference.ValidateRequestFeatures(inference.Request{SessionID: conversationID}); err != nil {
	request.SessionID = ""
}
```

| Behavior | Detail |
| --- | --- |
| Empty value | Means absent. No neutral codec encodes it, so requests without it are byte-identical to requests built before the field existed. |
| Forwarding | Only providers that document a per-conversation header send it, verbatim. Every other provider ignores it. See [OpenCode Zen](/docs/guides/inference/providers/opencode) and [OpenCode Go](/docs/guides/inference/providers/opencode-go). |
| Validation | Checked for every provider by `ValidateRequestFeatures`, so a request valid for one provider stays valid after switching to another. See [Feature validation](/docs/guides/inference/requests/feature-validation). |
| Privacy | It is an identifier, not a secret, but it is caller data: the module never logs it or echoes it in an error. |

The Harness [model request step](/docs/guides/harness/step/model-request) is the canonical consumer path when a request is produced inside a Harness loop.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/v0.14.0/client.go), [`inference/session_id.go`](https://github.com/looprig/inference/blob/v0.14.0/session_id.go), [`inference/output.go`](https://github.com/looprig/inference/blob/v0.14.0/output.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/v0.14.0/client_test.go), [`inference/session_id_test.go`](https://github.com/looprig/inference/blob/v0.14.0/session_id_test.go), [`inference/codec/session_id_test.go`](https://github.com/looprig/inference/blob/v0.14.0/codec/session_id_test.go)

Related: [Model selection](/docs/guides/inference/requests/model-selection), [Conversation input](/docs/guides/inference/requests/messages), [Feature validation](/docs/guides/inference/requests/feature-validation).
