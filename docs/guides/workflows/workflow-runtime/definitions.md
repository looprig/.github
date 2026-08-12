---
id: guides/workflows/workflow-runtime/definitions
title: Workflow Definitions and Schemas
description: Define versioned typed workflows, validate JSON boundaries, and register them in a catalog.
audience: developer
section: guides
order: 2
publication: released
proofs:
  public-definition-surface: [central-workflows-typed-definition-source]
  metadata-and-strict-json-boundaries: [central-workflows-typed-definition-source]
  a-complete-typed-definition: [central-workflows-stage18-lifecycle-fixture]
  source: [central-workflows-typed-definition-source]
  proof: [central-workflows-artifacts-contract-test]
---

# Workflow definitions and schemas

A Workflows definition is the stable contract used to find an executable graph after a process restart. The package's normal implementation is `TypedDefinition[S]`. It combines a `Metadata` value, a compiled `*flow.Runner[S]`, a checkpoint store, a state decoder, an optional resume decoder, and an optional status summarizer.

The important sequence is:

1. Build and compile the underlying Flow graph.
2. Create metadata with an immutable name and version.
3. Bind the runner and decoders with `NewTypedDefinition`.
4. Register the definition in a `Catalog`.
5. Resolve the registered copy before validating input or starting a run.

Registration is meaningful. `Catalog.Register` makes a registered copy, compiles the strict schemas, and rejects a duplicate `(name, version)` pair. A definition that has not been registered has no validation token owner and cannot start through the public interface.

## Public definition surface

| API | Purpose |
| --- | --- |
| `NewMetadata(name, version, description, inputSchema, resumeSchema, vertices)` | Validate and retain identity, JSON schemas, and vertex display metadata |
| `NewVertexMetadata(label)` | Attach a label when the graph has no stable vertex ID metadata |
| `NewVertexMetadataForID(id, label)` | Bind the label to a stable `flow.VertexID`, preserving progress labels when vertices finish out of order |
| `NewTypedDefinition` | Bind a typed Flow runner and JSON decoders |
| `StrictJSONDecoder[S]` | Decode one JSON value with unknown fields rejected and no trailing value |
| `TypedResumeDecoder[R]` | Adapt a typed resume decoder to `ResumeDecoder` |
| `Catalog.Register` / `Resolve` / `List` | Store, find, and enumerate immutable definitions |
| `Definition.ValidateInput` / `ValidateResume` | Produce definition-owned validation tokens |

The exported interface is intentionally narrow:

```go
type Definition interface {
	Metadata() Metadata
	ValidateInput(json.RawMessage) (ValidatedInput, error)
	ValidateResume(json.RawMessage) (ValidatedResume, error)
	Start(context.Context, ValidatedInput, ...flow.RunOption) (*Result, error)
	Resume(context.Context, flow.GraphRunID, ValidatedResume, ...flow.RunOption) (*Result, error)
	Get(context.Context, flow.GraphRunID) (*Result, error)
	History(context.Context, flow.GraphRunID) ([]flow.GraphRunState, error)
	Cancel(context.Context, flow.GraphRunID, string, ...flow.RunOption) error
}
```

`ValidatedInput` and `ValidatedResume` are opaque by design. Do not construct them with a struct literal. The token contains the registration owner, so passing a token produced by another definition returns an `InvalidInputError` before Flow runs a task.

## Metadata and strict JSON boundaries

`NewMetadata` checks the identity before the catalog sees it. Names match `[a-z][a-z0-9_]{2,63}`. Versions are non-empty, trimmed, control-free strings of at most 64 bytes. Descriptions are valid UTF-8 and at most 1024 bytes. Vertex labels are safe, non-empty text of at most 64 bytes, and nonzero vertex IDs may not repeat.

When a definition is registered, each schema is compiled with a closed-object policy. The root must be an object and set `additionalProperties` to `false`. Nested object schemas must also be closed. External references and `$id` are rejected. Schema documents are bounded to 64 KiB, 32 levels, and 1024 properties. Input documents are bounded separately to 256 KiB, 32 levels, and 4096 properties.

`StrictJSONDecoder` adds the Go type boundary. It rejects unknown Go fields and a second JSON value after the first one. A valid JSON shape is not enough if the target Go type cannot decode it.

## A complete typed definition

This example builds a one-vertex graph, binds it to a versioned input schema, registers it, and returns the registered copy. The comments call out the boundaries that matter in a real definition.

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/looprig/flow/pkg/flow"
	"github.com/looprig/workflows"
)

type counterState struct {
	Count int `json:"count"`
}

func buildCounterDefinition(store flow.CheckpointStore) workflows.Definition {
	graph := flow.NewGraph[counterState](flow.GraphID{1})
	vertexID := flow.VertexID{2}

	task := flow.NewFuncTask(func(_ context.Context, count int) (int, error) {
		return count + 1, nil
	})
	must(flow.AddVertex(
		graph,
		vertexID,
		task,
		func(state counterState) int { return state.Count },
		func(state *counterState, output int) error {
			state.Count = output
			return nil
		},
	))

	runner, err := graph.Compile(vertexID, vertexID, flow.WithStore(store))
	must(err)
	metadata, err := workflows.NewMetadata(
		"counter_flow",
		"v1",
		"Increment a counter once.",
		json.RawMessage(`{"type":"object","properties":{"count":{"type":"integer"}},"required":["count"],"additionalProperties":false}`),
		nil,
		[]workflows.VertexMetadata{
			workflows.NewVertexMetadataForID(vertexID, "increment"),
		},
	)
	must(err)
	typed, err := workflows.NewTypedDefinition(
		metadata,
		runner,
		store,
		workflows.StrictJSONDecoder[counterState],
		nil,
		func(state counterState) string { return fmt.Sprintf("count=%d", state.Count) },
	)
	must(err)

	catalog := workflows.NewCatalog()
	must(catalog.Register(typed))
	registered, err := catalog.Resolve("counter_flow", "v1")
	must(err)
	return registered
}

func must(err error) {
	if err != nil {
		panic(err)
	}
}
```

At a call site, validate first and then start with the returned token:

```go
input, err := definition.ValidateInput(json.RawMessage(`{"count": 1}`))
if err != nil {
	// InvalidSchemaError and InvalidInputError preserve the boundary that failed.
	panic(err)
}
result, err := definition.Start(context.Background(), input, flow.WithGraphRunID(flow.GraphRunID{3}))
if err != nil {
	panic(err)
}
fmt.Println(result.Run.Status, string(result.State), result.Summary)
```

The Flow graph remains reusable and immutable after `Compile`. Changing graph behavior requires a new compatible version strategy. Flow's graph fingerprint protects checkpoint resume; the Workflows name and version protect definition lookup. See [Flow graph composition](/docs/guides/workflows/flow/) for how those two identities fit together.

## Source

- [definition.go](https://github.com/looprig/workflows/blob/main/definition.go)

## Proof

- [definition_test.go](https://github.com/looprig/workflows/blob/main/definition_test.go)
