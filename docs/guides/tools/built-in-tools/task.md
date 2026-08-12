---
id: guides/tools/built-in-tools/task
title: Task Tools
description: Maintain a bounded, loop-local dependency graph with four task tools.
audience: developer
section: guides
order: 19
publication: released
proofs:
  operations: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# Task Tools

`TaskDefinitions` returns one bundle containing `TaskCreate`, `TaskUpdate`, `TaskGet`, and `TaskList`. The bundle owns one in-memory task graph for one loop. Separate `NewTools` calls do not share state. All four tools are sequential and prepared, but they need no workspace or process binding.

## Operations

- `TaskCreate` requires `subject` and `description`, with optional `activeForm`, `blockedBy`, and JSON `metadata`.
- `TaskUpdate` patches fields, changes status, adds or removes blockers, replaces metadata, or uses the command-only `deleted` status to remove a task and its references.
- `TaskGet` returns one task by UUID.
- `TaskList` returns every task in deterministic ID order.

Preparation rejects duplicate or unknown JSON fields, malformed UUIDs, duplicate dependencies, oversized fields, invalid metadata, and missing required fields. The store caps the graph at 256 tasks, 128 dependencies per task, and a 2 MiB aggregate representation. It rejects self-dependencies and cycles. A task can become `in_progress` only when its blockers are completed.

Task results are JSON text blocks. Task operations use an opaque token artifact so execution never reparses the raw arguments. Audit summaries intentionally omit task content and IDs where the package defines a generic summary.

```go
// The four tools share the same loop-local graph because they came from one
// NewTools call.
bundle := task.NewTools()
created := invoke(bundle[0], executionID,
	`{"subject":"Document tools","description":"Add runnable examples"}`)
listed := invoke(bundle[3], executionID, `{}`)
fmt.Println(created, listed)
```

The [task bundle fixture](https://github.com/looprig/tools/blob/main/examples/tasks/example_test.go) creates a task through `TaskCreate` and lists it through the same bundle. Link its result into Harness's [tool-call/result step](/docs/guides/harness/step/tool-calls-and-results/) when documenting how task state appears in a turn.

## Source

- [Task tool bundle](https://github.com/looprig/tools/blob/main/task/tool.go)
- [Task creation and update](https://github.com/looprig/tools/blob/main/task/create.go)
- [Task graph store](https://github.com/looprig/tools/blob/main/task/store.go)

## Proof

- [Task tool tests](https://github.com/looprig/tools/blob/main/task/tool_test.go)
- [Task model and store tests](https://github.com/looprig/tools/blob/main/task/model_test.go)
- [Task bundle fixture](https://github.com/looprig/tools/blob/main/examples/tasks/example_test.go)
