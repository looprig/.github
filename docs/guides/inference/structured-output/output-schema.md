---
id: guides/inference/structured-output/output-schema
title: OutputSchema
description: Define the name, description, JSON schema, and strictness of a result contract.
audience: developer
section: guides
order: 58
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# OutputSchema

`OutputSchema` is the provider-neutral request for one schema-constrained JSON object.

## API surface

```go
const (
	StructuredOutputToolName = "_looprig_final_output"
	StructuredOutputRevision = "structured-output/v1"
)

type OutputSchema struct {
	Name        string
	Description string
	Schema      json.RawMessage
	Strict      bool
}

func (o OutputSchema) Clone() OutputSchema
func ValidateOutputSchema(output OutputSchema) error
```

| Field | Constraint |
| --- | --- |
| `Name` | ASCII identifier, 1 to 64 bytes, not the reserved tool name |
| `Description` | Valid UTF-8, at most 4096 bytes |
| `Schema` | Valid UTF-8 JSON object in the portable subset, at most 1 MiB |
| `Strict` | Provider-neutral strictness request passed to supporting codecs |

```go
output := inference.OutputSchema{
	Name: "answer",
	Description: "A concise answer with a confidence score.",
	Schema: json.RawMessage(`{
		"type":"object",
		"properties":{
			"answer":{"type":"string"},
			"confidence":{"type":"number"}
		},
		"required":["answer","confidence"],
		"additionalProperties":false
	}`),
	Strict: true,
}
if err := inference.ValidateOutputSchema(output); err != nil {
	panic(err)
}
```

`Clone` copies `Schema` into independent storage, preserving nil versus non-nil empty raw messages. The reserved name is used internally when a provider represents structured output as a terminal tool call and cannot collide with an ordinary tool.

## Proof

- Source: [`inference/output.go`](https://github.com/looprig/inference/blob/main/output.go)
- Tests: [`inference/output_test.go`](https://github.com/looprig/inference/blob/main/output_test.go) covers clone non-aliasing, metadata bounds, and portable schema acceptance.

Related: [Portable JSON Schema](/docs/guides/inference/structured-output/portable-json-schema/), [Structured output requests](/docs/guides/inference/requests/structured-output/).
