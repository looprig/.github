---
id: guides/tools/core-concepts/registration
title: Registering Tools With Harness
description: Compose standard Tools definitions with validated Harness bindings.
audience: developer
section: guides
order: 4
publication: released
proofs:
  choose-the-definition-that-matches-the-runtime: [release-github-com-looprig-tools]
  build-with-validated-bindings: [release-github-com-looprig-tools]
  register-the-result-reader-with-capture: [release-github-com-looprig-tools]
  add-tools-to-a-turn: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# Registering Tools With Harness

The Tools root package is intentionally a composition layer, not an application registry. A product chooses which definitions to expose, supplies their narrow dependencies, and lets Harness build fresh invokable tools for each loop.

## Choose the Definition That Matches the Runtime

The root constructors have distinct ownership boundaries:

| Definition | Built tools | Required bindings | Main dependency |
| --- | --- | --- | --- |
| `AskUserDefinition` | `AskUser` | none | Harness loop user-input seam |
| `TaskDefinitions` | `TaskCreate`, `TaskUpdate`, `TaskGet`, `TaskList` | none | one bundle-local graph |
| `ReadFileDefinition` | `ReadFile` | workspace | `loop.ReadGuard` |
| `GlobDefinition` | `Glob` | workspace | `loop.ReadGuard` |
| `GrepDefinition` | `Grep` | workspace | `loop.ReadGuard` |
| `WriteFileDefinition` | `WriteFile` | workspace | session coordinator injected by Build |
| `EditFileDefinition` | `EditFile` | workspace | session coordinator injected by Build |
| `Bash` | foreground `Bash` | workspace | optional command runner |
| `BashDefinition` | supervised `Bash` | workspace and process services | `AsyncProcessRunnerResolver` |
| `FetchDefinition` | `Fetch` | none | injected `*http.Client` |
| `WebSearchDefinition` | `WebSearch` | none | injected `SearchProvider` |
| `ProcessOutputDefinition` | `ProcessOutput` | process services | shared supervisor registry |
| `ProcessInputDefinition` | `ProcessInput` | process services | shared supervisor registry |
| `ProcessStopDefinition` | `ProcessStop` | process services | shared supervisor registry |
| `ReadToolResultDefinition` | `read_tool_result` | tool-result reader | Harness `rig.WithToolResultObjects` |

Use `Bash` when a consumer explicitly wants the legacy foreground path. Use `BashDefinition` when background execution or `yield_time_ms` must be supervised. The latter resolves the runner at build time, before a call can be invoked, and never chooses a runner from invocation-time provenance.

## Build With Validated Bindings

The build call should happen after Harness has validated the bindings. The definition's requirement bitmask is the contract that tells Harness which binding groups must be present.

```go
// The resolver receives the validated LoopID exactly once at Build.
supervised := standardtools.BashDefinition(func(ctx context.Context, loopID uuid.UUID) (tool.AsyncProcessRunner, error) {
	return runners.ForLoop(ctx, loopID)
})

built, err := supervised.Build(ctx, tool.Bindings{
	SessionID: sessionID,
	LoopID:    loopID,
	Workspace: workspaceBinding,
	Process:   processBinding,
})
if err != nil {
	return err
}
```

`WriteFileDefinition` and `EditFileDefinition` prepend the session-bound mutation coordinator to their options. Do not pass a caller-owned mutation coordinator through those definitions. The factory already owns the binding that enforces path permits and lease health.

The three process companion definitions are workspace-free. Their build closure obtains `process.SupervisorResourceKey` from `bindings.Process.Registry`, then binds the resulting supervisor to the current `SessionID` and `LoopID`. Build them against the same session registry to share one supervisor; separate registries represent separate sessions.

## Register the result reader with capture

`ReadToolResultDefinition` declares `tool.RequiresToolResultReader`. Harness binds it a reader scoped to the calling loop's own retained results, so register it only in a rig that wires `rig.WithToolResultObjects`. A rig that registers it without readable tool-result objects fails its definition with `tool_result_reader_without_objects`.

```go
// The rig retains large results; read_tool_result lets the model page them.
// Both must be present together, or the rig definition is refused. store is
// the Harness *sessionstore.Store the session journals into; spillBase is an
// absolute local directory outside the workspace region.
options := []rig.Option{
	rig.WithToolResultObjects(store.ToolResultObjects(), spillBase),
}
loopTools := []tool.Definition{
	standardtools.BashDefinition(resolver),
	standardtools.ReadToolResultDefinition(),
}
```

Also set a finite `ToolLimits.ResultBytes`. With it zero the model preview is unbounded, so nothing is elided and no object is ever written for `read_tool_result` to read. Harness documents the retention knobs in [tools and tool limits](/docs/guides/harness/loop/tools-and-tool-limits). The capture-safety declarations that every standard definition carries are described in [Large results and capture](/docs/guides/tools/core-concepts#large-results-and-capture).

## Add Tools to a Turn

After Build, register the resulting `tool.InvokableTool` values with the Harness loop that will execute model tool calls. The tool list belongs in the model request, while tool-call and tool-result content belongs in the call lifecycle. Inference documents the [tool request format](/docs/guides/inference/requests/tools), [model selection](/docs/guides/inference/requests/model-selection), and [tool-use blocks](/docs/guides/inference/content-blocks/tool-use). Harness documents the [model request step](/docs/guides/harness/step/model-request) and [tool-call/result step](/docs/guides/harness/step/tool-calls-and-results).

Keep this registration boundary explicit. The Tools package does not discover a model, construct a network client, choose a sandbox profile, or create a process runner. Those choices remain in the product composition root.

## Source

- [Definition registration surface](https://github.com/looprig/tools/blob/main/definitions.go)

## Proof

- [Definition blueprint and dependency tests](https://github.com/looprig/tools/blob/main/definitions_test.go)
- [Process companion definition tests](https://github.com/looprig/tools/blob/main/process/definitions_test.go)
- [Tool-result retention tests](https://github.com/looprig/tools/blob/main/tool_result_retention_test.go)
- [Definition fixture](https://github.com/looprig/tools/blob/main/examples/definitions/example_test.go)
