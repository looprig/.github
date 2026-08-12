---
id: guides/inference/structured-output/with-tools
title: Structured output with tools
description: Combine ordinary tools with structured output only when the model advertises both.
audience: developer
section: guides
order: 61
publication: released
proofs:
  request-gate: [release-github-com-looprig-inference]
  response-representations: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Structured output with tools

Structured output and ordinary tool calls are separate representations. A request that exposes both must use a model with `Caps.StructuredOutputWithTools`; the capability implies `Caps.Tools` and `Caps.StructuredOutput`.

## Request gate

```go
request := inference.Request{
	Model: model.CustomModel(
		model.ProviderName("acme"), model.APIFormatOpenAI,
		"https://api.example.test", "agent",
		model.WithTools(),
		model.WithStructuredOutputWithTools(),
	),
	Tools: []inference.Tool{{Name: "lookup", Description: "Read a record."}},
	Output: &inference.OutputSchema{
		Name: "final_answer",
		Schema: json.RawMessage(`{"type":"object","properties":{"answer":{"type":"string"}},"required":["answer"],"additionalProperties":false}`),
	},
}
if err := inference.ValidateRequestFeatures(request); err != nil {
	panic(err)
}
```

`StructuredOutputToolName` is reserved for the internal terminal representation. An ordinary tool with that name returns `StructuredOutputConflictError`. Duplicate ordinary tool names also fail when output is requested.

## Response representations

With `FinishReasonToolUse`, structured extraction requires exactly one `ToolUseBlock` named `_looprig_final_output` and may include thinking blocks only. An ordinary tool call, natural-language text, or a mixture is a contradiction. With `FinishReasonStop`, extraction requires text and rejects any tool call.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/main/client.go), [`inference/structured_result.go`](https://github.com/looprig/inference/blob/main/structured_result.go), [`inference/output.go`](https://github.com/looprig/inference/blob/main/output.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/main/client_test.go), [`inference/structured_result_test.go`](https://github.com/looprig/inference/blob/main/structured_result_test.go)

Related: [Tool definitions](/docs/guides/inference/requests/tools/), [Tool-call deltas](/docs/guides/inference/streaming/tool-call-deltas/), [Tool choice](/docs/guides/inference/requests/tool-choice/).
