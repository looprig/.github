---
id: guides/harness/loop/output-schema
title: Output Schema
description: Describe structured output schema configuration for a Loop.
audience: developer
section: guides
order: 10
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  schema-option: [release-github-com-looprig-harness]
  schema-ownership: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Output Schema

`WithOutputSchema` freezes one optional provider-neutral final-output policy. See [Structured Output](/docs/guides/inference/structured-output) for the portable schema contract, request behavior, decoding, and validation:

```go
func WithOutputSchema(output inference.OutputSchema) Option
```

The option clones the schema immediately and `Define` validates it with the
inference package's output-schema validator. Invalid JSON, unsupported schema
shape, or an invalid structured-output policy is returned as
`*loop.DefinitionError{Kind: loop.DefinitionInvalidOutputSchema}`. Error text
does not echo raw schema bytes.

## Schema ownership

The definition owns the schema. `BoundDefinition.OutputSchema()` returns
`(*inference.OutputSchema, bool)`; the pointer is a fresh clone. A caller can
edit that returned value for local inspection without changing the definition,
the runtime request policy, or the Rig fingerprint.

The schema is a final-output contract. It does not add a callable model-facing
tool, does not appear in `BoundDefinition.Tools()`, and does not change
`Definition.ToolRequirements()`. The runtime may use the provider-neutral
structured-output control path internally, but the public definition still
rejects a declared tool whose produced name is the reserved structured-output
control name.

```go
bound, err := definition.Bind(ctx, bindings)
if err != nil {
	return err
}
schema, configured := bound.OutputSchema()
if configured {
	log.Printf("final output policy %q", schema.Name)
	// schema is owned by this caller; mutating it cannot mutate bound.
}
```

The policy identity is a compact-schema SHA-256 projection plus the schema name
and the inference structured-output revision. Whitespace-only JSON formatting
does not create a different identity; changing schema meaning, name, strictness,
or implementation revision does.

## Source and proof

- [Output option, validation, cloning, and policy identity](https://github.com/looprig/harness/blob/main/pkg/loop/definition.go)
- [Reserved output-tool name rule](https://github.com/looprig/harness/blob/main/pkg/loop/definition.go)
- [Schema validation and ownership tests](https://github.com/looprig/harness/blob/main/pkg/loop/definition_test.go)
