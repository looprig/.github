---
id: guides/workflows/flow/index
title: Flow Graph Composition
description: Build the Flow graph that a Workflows TypedDefinition executes and resumes.
audience: developer
section: guides
order: 7
publication: released
proofs:
  the-two-identities-to-keep-stable: [central-workflows-typed-definition-source]
  build-bind-and-run-a-graph: [central-workflows-stage18-lifecycle-fixture]
  flow-options-and-outcomes: [central-workflows-stage18-lifecycle-fixture]
  checkpoint-and-resume-compatibility: [central-workflows-recovery-test]
  source: [central-workflows-stage18-lifecycle-fixture]
  proof: [central-workflows-stage18-output-test]
---

# Flow graph composition

Workflows does not add a second graph language. A `TypedDefinition[S]` wraps a compiled `*flow.Runner[S]`. Flow owns tasks, vertices, edges, routing, graph state, checkpoint phases, interrupts, and graph-level status. Workflows adds versioned JSON boundaries, catalog lookup, session-owned run records, activity projection, and tool controls around that runner.

## The two identities to keep stable

| Identity | Owner | Why it matters |
| --- | --- | --- |
| `flow.GraphID` | Flow graph definition | Identifies which compiled graph a checkpoint belongs to |
| `flow.GraphVersion` | Flow compile fingerprint | Rejects resume when topology or the explicit graph version changes |
| `flow.VertexID` | Flow vertex definition | Identifies a logical vertex in checkpoint records and activity labels |
| Workflows name and version | `workflows.Metadata` | Resolves the definition from a catalog and records the exact definition selected for a run |
| `flow.GraphRunID` | Flow runtime instance | Identifies one graph execution inside the Workflows `Run` |
| Workflows `Run.ID` | Session runtime | Identifies the user-visible session-owned run and tool target |

Use stable graph and vertex IDs in source code. `GraphRunID` and Workflows run IDs are minted per execution. When a vertex can finish out of declaration order, pass its ID to `NewVertexMetadataForID` so projected activity attaches the right label.

## Build, bind, and run a graph

The graph builder is mutable until `Compile`. A task stays graph-agnostic. `AddVertex` supplies the typed selector from shared state to task input and reducer from task output back into shared state.

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/looprig/flow/pkg/flow"
	"github.com/looprig/workflows"
)

type counter struct {
	Count int `json:"count"`
}

func main() {
	ctx := context.Background()
	store := flow.NewMemStore()
	graph := flow.NewGraph[counter](flow.GraphID{7}, flow.WithVersion(1))
	vertexID := flow.VertexID{8}

	task := flow.NewFuncTask(func(_ context.Context, count int) (int, error) {
		return count + 1, nil
	})
	must(flow.AddVertex(
		graph,
		vertexID,
		task,
		func(state counter) int { return state.Count },
		func(state *counter, output int) error {
			state.Count = output
			return nil
		},
	))

	runner, err := graph.Compile(vertexID, vertexID, flow.WithStore(store))
	must(err)
	result, err := runner.Run(ctx, counter{Count: 4}, flow.WithGraphRunID(flow.GraphRunID{9}))
	must(err)
	fmt.Println(result.Run.Status, result.State.Count)

	// The same runner can be bound to a Workflows definition. The definition's
	// state decoder is the JSON boundary around counter.
	metadata, err := workflows.NewMetadata(
		"counter_flow",
		"v1",
		"Increment a counter.",
		json.RawMessage(`{"type":"object","properties":{"count":{"type":"integer"}},"required":["count"],"additionalProperties":false}`),
		nil,
		[]workflows.VertexMetadata{workflows.NewVertexMetadataForID(vertexID, "increment")},
	)
	must(err)
	definition, err := workflows.NewTypedDefinition(
		metadata,
		runner,
		store,
		workflows.StrictJSONDecoder[counter],
		nil,
		nil,
	)
	must(err)
	_ = definition
}

func must(err error) {
	if err != nil {
		panic(err)
	}
}
```

In an actual Workflows run, call `Catalog.Register` with the typed definition and start through the registered `Definition` or the workflow tool bundle. The direct `runner.Run` call above is useful for understanding the Flow layer, but it bypasses the session registry and should not be used when a run must be visible to Harness.

## Flow options and outcomes

Flow accepts per-run options without mutating the compiled runner:

| Option | Effect |
| --- | --- |
| `WithGraphRunID(id)` | Use a caller-supplied runtime ID, rejecting an existing history |
| `WithHooks(hooks)` | Observe run, vertex, edge, step, checkpoint, interrupt, and halt events |
| `WithConcurrency(n)` | Bound vertex concurrency within a super-step |
| `WithMaxSteps(n)` | Bound super-step execution and surface a run-level max-step halt |
| `WithCheckpointEvery(granularity)` | Choose per-vertex or per-step checkpoint cadence |

`flow.Result[S]` contains `GraphRunState`, the typed state, `[]flow.Interruption`, and an optional `*flow.Halt`. A vertex pause is not the same as a run-level routing halt. A paused task reads a caller's typed continuation through `flow.ResumePayload[T]` with its context, or a persisted continuation through `flow.InterruptState[T]` with its context. Workflows serializes the typed state in its `Result.State` JSON field and maps the Flow run status to its own `RunStatus`.

## Checkpoint and resume compatibility

The `flow.CheckpointStore` is fixed when the graph is compiled. The same store must be supplied to the runner used after a process restart. `Resume` loads the latest checkpoint, validates run identity, graph identity, graph version, state decoding, vertex records, and phase before executing a task. This is the lower-level guarantee behind Workflows `Adopt` and `Resume`.

Flow's [module reference](/docs/modules/flow) covers graph routing and checkpoint internals. Workflows' [interruption and recovery guide](/docs/guides/workflows/workflow-runtime/interruption-and-resume) covers the additional JSON resume schema and session lifecycle. If a graph task needs a model, it can call the separate [Inference model selection contracts](/docs/guides/inference/requests/model-selection) rather than making Workflows itself a model client.

## Source

- [examples/docs/stage18_workflows/main.go](https://github.com/looprig/workflows/blob/main/examples/docs/stage18_workflows/main.go)

## Proof

- [examples/docs/stage18_workflows/main_test.go](https://github.com/looprig/workflows/blob/main/examples/docs/stage18_workflows/main_test.go)
