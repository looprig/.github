---
id: guides/inference/structured-output/portable-json-schema
title: Portable JSON Schema
description: Use the bounded JSON Schema subset shared by provider codecs.
audience: developer
section: guides
order: 59
publication: released
proofs:
  supported-shapes: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Portable JSON Schema

`ValidateOutputSchema` accepts a deliberately small, deterministic JSON Schema subset so one `OutputSchema` can be encoded by multiple provider codecs.

## Supported shapes

| Shape | Allowed keywords |
| --- | --- |
| Root | `type: "object"` only |
| Object | `type`, `description`, `properties`, `required`, `additionalProperties: false` |
| Array | `type`, `description`, `items` containing one schema object |
| Scalar | `type`, `description`, optional type-matching `enum` |
| Scalar types | `string`, `boolean`, `number`, `integer` |

Objects with properties must list every property in `required`; required names must be known and unique. Arrays use one homogeneous `items` schema, not tuple arrays. `additionalProperties` is required on every object and must be false. Unknown keywords, `$ref`, composition, numeric constraints, and string constraints are rejected.

```json
{
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {"type": "string"}
    }
  },
  "required": ["items"],
  "additionalProperties": false
}
```

```go
schema := json.RawMessage(`{"type":"object","properties":{"answer":{"type":"string"}},"required":["answer"],"additionalProperties":false}`)
if err := inference.ValidateOutputSchema(inference.OutputSchema{
	Name: "answer", Schema: schema,
}); err != nil {
	panic(err)
}
```

The validator bounds schema bytes at 1 MiB, nesting depth at 64, and the total property count at 1024. Duplicate object members are detected after JSON string unescaping, including escaped duplicate property names.

## Proof

- Source: [`inference/output.go`](https://github.com/looprig/inference/blob/main/output.go)
- Tests: [`inference/output_test.go`](https://github.com/looprig/inference/blob/main/output_test.go) covers supported shapes, unknown keywords, duplicate members, depth, property count, and enum type matching.

Related: [Schema validation](/docs/guides/inference/structured-output/validation), [OutputSchema](/docs/guides/inference/structured-output/output-schema).
