---
id: guides/inference/requests/tools
title: Tool definitions
description: Declare callable tools with a name, description, and raw JSON schema.
audience: developer
section: guides
order: 36
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Tool definitions

`Tool` describes one callable function exposed to the model. The inference package carries the schema as raw JSON; the tool implementation owns semantic validation and execution.

## API surface

```go
type Tool struct {
	Name        string
	Description string
	Schema      json.RawMessage
}
```

```go
tool := inference.Tool{
	Name: "weather",
	Description: "Look up the current weather for a city.",
	Schema: json.RawMessage(`{
		"type":"object",
		"properties":{"city":{"type":"string"}},
		"required":["city"],
		"additionalProperties":false
	}`),
}
request := inference.Request{Tools: []inference.Tool{tool}}
```

`Name` is the uniqueness key. When structured output is also requested, `_looprig_final_output` is reserved and duplicate tool names are rejected. A nil or malformed tool schema is preserved as input to the codec; `ValidateRequestFeatures` validates the structured output schema, not ordinary tool schemas.

The Harness [tool calls and results guide](/docs/guides/harness/step/tool-calls-and-results/) shows the consumer lifecycle: expose a definition, inspect returned `ToolUseBlock` values, execute the selected tool, and append a correlated result.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/main/client.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/main/client_test.go) covers raw schema preservation and feature conflicts.

Related: [ToolUseBlock](/docs/guides/inference/content-blocks/tool-use/), [Tool choice](/docs/guides/inference/requests/tool-choice/), [Structured output with tools](/docs/guides/inference/structured-output/with-tools/).
