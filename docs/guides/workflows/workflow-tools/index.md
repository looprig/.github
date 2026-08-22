---
id: guides/workflows/workflow-tools/index
title: Workflow Tools
description: Expose definitions and session-owned workflow runs through strict, bounded invokable tools.
audience: developer
section: guides
order: 8
publication: released
proofs:
  bundle-configuration: [central-workflows-typed-definition-source]
  the-seven-tools: [central-workflows-artifacts-contract-test]
  start-is-an-acknowledgement-boundary: [central-workflows-stage18-output-test]
  resume-cancel-and-history-rules: [central-workflows-recovery-test]
  direct-invocation-in-a-test-or-adapter: [central-workflows-artifacts-contract-test]
  source: [central-workflows-typed-definition-source]
  proof: [central-workflows-artifacts-contract-test]
---

# Workflow tools

The `github.com/looprig/workflows/tools` package is the Workflows-facing tool surface. It returns `[]tool.InvokableTool`, so Harness can register the bundle with the same `tool.BaseTool` and `tool.InvokableTool` contracts used by other tools. The bundle is session-bound. Every run lookup includes the configured session ID, and a caller cannot use a run ID from another session through these tools.

For the caller-side lifecycle, see [Harness tool calls and results](/docs/guides/harness/step/tool-calls-and-results). For how tool definitions become model request tools, see [Inference tool requests](/docs/guides/inference/requests/tools) and [Harness model requests](/docs/guides/harness/step/model-request).

## Bundle configuration

```go
bundle, err := workflowtools.NewBundle(workflowtools.Config{
	SessionID:  sessionID,
	Catalog:    catalog,
	Registry:   registry,
	Inputs:     inputs,
	Supervisor: supervisor,
	Now:        time.Now,
	// NewID defaults to uuid.New. PrepareRun can fill only the artifact
	// namespace descriptors before the registry record is created.
	PrepareRun: bindArtifactNamespace,
})
if err != nil {
	return err
}
```

The `Supervisor` must provide the session-owned `Start` controller and projected `History` controller in addition to `Resume` and `Cancel`. `NewBundle` fails closed when either required capability is absent. `PrepareRun` may set `ArtifactSessionID`, `ArtifactRunID`, and the parent artifact input descriptor. It cannot rewrite session identity, definition identity, IDs, input, status, timestamps, ledger locator, or other protected run fields.

## The seven tools

| Tool | Arguments | Behavior and result |
| --- | --- | --- |
| `workflow_definition_list` | `{}` | Lists up to 100 definitions with name, version, description, strict input schema, and `resume_supported` |
| `workflow_run_start` | `definition_name`, `definition_version`, `input`, optional `parent_run_id` | Validates and canonicalizes the input, stores it by digest, creates a pending run, starts it, and returns after the durable seed acknowledgement |
| `workflow_run_get` | `run_id` | Returns safe bounded run metadata and lifecycle status |
| `workflow_run_list` | optional `after`, `limit` from 1 to 100 | Returns a session page of safe run metadata and the next run ID cursor |
| `workflow_run_resume` | `run_id`, `resume` object | Requires `interrupted`, validates the exact definition's resume schema, and continues the run |
| `workflow_run_cancel` | `run_id`, optional reason up to 512 bytes | Requests cancellation through the supervisor, or returns an idempotent result for an already cancelled run |
| `workflow_run_history` | `run_id`, optional `after_revision`, `after_event_id`, `limit` from 1 to 100 | Returns projected activity entries and revision or event cursors |

All seven argument schemas are closed objects. Unknown fields are rejected by a decoder that disallows unknown fields and trailing JSON values. IDs must be nonzero UUIDs. Inputs and resume payloads must be one JSON object, and the input tool path canonicalizes map keys before hashing.

## Start is an acknowledgement boundary

`workflow_run_start` does not wait for a completed graph. It waits until `Supervisor.Start` observes the Flow run's durable seed checkpoint, then it reads the registry and returns `run_id`, definition identity, status, summary, checkpoint revision, activity cursor, parent ID, artifact descriptors, and timestamps. A model can use `workflow_run_get` or `workflow_run_history` later to observe progress.

The input path is intentionally ordered:

```mermaid
%%{init: {"theme": "dark"}}%%
flowchart LR
    J["JSON arguments"] --> D["strict decode\nclosed object"]
    D --> V["Catalog.Resolve\nValidateInput"]
    V --> N["canonical object\nSHA-256 input"]
    N --> R["RunRegistry.Create\npending"]
    R --> S["Supervisor.Start"]
    S --> A["durable seed ack"]
    A --> O["safe run result"]
    classDef input fill:#302038,stroke:#d7a8ff,color:#fff4ff;
    classDef durable fill:#202b1e,stroke:#8bd17c,color:#efffec;
    classDef action fill:#152238,stroke:#79c2ff,color:#eef6ff;
    class J,D,V,N input;
    class R,A durable;
    class S,O action;
```

If input validation, input storage, run creation, or seed scheduling fails, the tool returns an error instead of a misleading success result. The safe result deliberately omits the raw `input` field, Flow state, policy text, and model output.

## Resume, cancel, and history rules

`workflow_run_resume` canonicalizes the resume object, resolves the definition recorded on the run, and calls `ValidateResume` before `Supervisor.Resume`. It rejects a run in any status other than `interrupted`.

`workflow_run_cancel` trims an empty reason to `cancel requested`, bounds the reason to 512 bytes, and rejects completed or failed runs. An already cancelled run returns `{idempotent:true}` without calling Flow.

`workflow_run_history` defaults to 50 entries and accepts `after_revision` plus an optional `after_event_id`. When a checkpoint revision contains more activities than the page limit, `next_revision` stays on that revision and `next_event_id` identifies the last returned event. Use both cursors for a lossless reader.

## Direct invocation in a test or adapter

```go
// Harness normally invokes the tool through its runner. A direct call is
// useful for an adapter test because the contract is just JSON in and a
// bounded ToolResult out.
start := bundle[1] // definition list is index 0; run start is index 1
result, err := start.InvokableRun(ctx, `{
  "definition_name":"counter_flow",
  "definition_version":"v1",
  "input":{"count":1}
}`)
if err != nil {
	return err
}
_ = result
```

Prefer looking up a tool by its `ToolInfo.Name` in production rather than relying on the bundle order. The order is stable in the current implementation, but the name is the public contract.

## Source

- [tools/bundle.go](https://github.com/looprig/workflows/blob/main/tools/bundle.go)

## Proof

- [tools/tools_test.go](https://github.com/looprig/workflows/blob/main/tools/tools_test.go)
