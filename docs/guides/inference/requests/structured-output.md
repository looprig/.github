---
id: guides/inference/requests/structured-output
title: Structured output requests
description: Attach a portable OutputSchema contract to a request and gate model support.
audience: developer
section: guides
order: 38
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Structured output requests

Set `Request.Output` when the assistant must produce exactly one JSON object that can later be extracted or decoded into a concrete struct.

## API surface

```go
request := inference.Request{
	Model: model.CustomModel(
		model.ProviderName("acme"), model.APIFormatOpenAI,
		"https://api.example.test", "chat-1",
		model.WithStructuredOutput(),
	),
	Output: &inference.OutputSchema{
		Name: "answer",
		Description: "The concise answer.",
		Schema: json.RawMessage(`{
			"type":"object",
			"properties":{"answer":{"type":"string"}},
			"required":["answer"],
			"additionalProperties":false
		}`),
		Strict: true,
	},
}
if err := inference.ValidateRequestFeatures(request); err != nil {
	panic(err)
}
```

Validation runs `ValidateOutputSchema` first. The model must advertise `Caps.StructuredOutput`; if ordinary tools are also present it must additionally advertise `Caps.StructuredOutputWithTools`. The reserved internal tool name `_looprig_final_output` cannot be supplied as an ordinary tool name.

`Strict` is part of the provider-neutral contract and is passed to codecs that support a strict response format. Extraction still checks the response representation and finish reason; a valid request does not guarantee valid model output.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/v0.14.0/client.go), [`inference/output.go`](https://github.com/looprig/inference/blob/v0.14.0/output.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/v0.14.0/client_test.go), [`inference/output_test.go`](https://github.com/looprig/inference/blob/v0.14.0/output_test.go)

Related: [OutputSchema](/docs/guides/inference/structured-output/output-schema), [Structured output with tools](/docs/guides/inference/structured-output/with-tools).
