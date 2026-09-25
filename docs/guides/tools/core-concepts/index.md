---
id: guides/tools/core-concepts/index
title: Tool Definitions, Preparation, and Results
description: Understand the common lifecycle shared by Looprig Tools.
audience: developer
section: guides
order: 3
publication: released
proofs:
  definitions-are-construction-blueprints: [release-github-com-looprig-tools]
  preparation-happens-before-effect: [release-github-com-looprig-tools]
  result-shapes: [release-github-com-looprig-tools]
  large-results-and-capture: [release-github-com-looprig-tools]
  fresh-instances-and-shared-state: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# Tool Definitions, Preparation, and Results

The Tools package separates construction from invocation. This is the central rule for composing an effectful operation safely: a consumer builds a tool from a definition, prepares one call, lets the gate evaluate the resulting request, and invokes only the approved artifact. Mutating tools such as `WriteFile`, `EditFile`, and `ProcessInput` are subject to the same prepare-before-effect boundary.

## Definitions Are Construction Blueprints

`tool.Definition` is the root package's composition seam. A definition has a stable name, a bitmask of requirements such as `tool.RequiresWorkspace` or `tool.RequiresProcessServices`, and a build function. `Build` receives `tool.Bindings`, which carry the session and loop identities plus the workspace or process services declared by that definition.

The root builders keep dependencies explicit:

```go
func ReadFileDefinition(
	readGuard loop.ReadGuard,
	options ...readfile.ReadFileOption,
) tool.Definition

func FetchDefinition(client *http.Client) tool.Definition

func BashDefinition(
	resolver AsyncProcessRunnerResolver,
	options ...bash.BashOption,
) tool.Definition
```

`ReadFileDefinition` and the other workspace definitions reject a missing read guard at build time. `FetchDefinition` rejects a missing HTTP client. `BashDefinition` resolves its async runner once with the validated `bindings.LoopID`, then builds a tool that requires both workspace and process services. These failures are `DefinitionBuildError` values rather than partially built tools.

`TaskDefinitions` is a bundle definition. One build produces four tools, `TaskCreate`, `TaskUpdate`, `TaskGet`, and `TaskList`, over one loop-local store. `AskUserDefinition` is pure and needs no workspace binding.

## Preparation Happens Before Effect

Every standard effectful tool is a `tool.CallPreparer`. `PrepareCall` owns the untrusted argument boundary:

1. Decode and validate JSON once.
2. Normalize the target, command, URL, skill identity, or process handle.
3. Build a `tool.Request` with the exact requirements and reusable candidates.
4. Freeze all execution inputs into a typed `tool.PreparedArtifact`.

Preparation is not a grant. A Bash access declaration requests a filesystem or network delta, but an omitted delta remains subject to the sandbox at execution. A direct file or network tool carries an empty grant pair because the tool itself enforces the approved target. In either case, the gate decides before the effect runs.

At invocation, `InvokableRun` reads the prepared call from context. It does not trust a second parse of `argsJSON`. The tests deliberately prepare an approved path or command, then invoke with changed raw JSON, and verify that the changed value is ignored. Missing or wrong artifacts produce a tool-result error and no effect.

```go
// Prepare freezes the command and its request before any runner call.
request, artifact, err := bashTool.PrepareCall(ctx, executionID, `{"command":"printf prepared"}`)
if err != nil {
	panic(err)
}

prepared := loop.WithPreparedCall(ctx, tool.PreparedCall{
	ExecutionID: executionID,
	Request:     request,
	Artifact:    artifact,
})

// The raw JSON says "changed", but the prepared artifact still runs
// "printf prepared".
result, err := bashTool.InvokableRun(prepared, `{"command":"printf changed"}`)
```

The full runnable version is [the prepared Bash example](https://github.com/looprig/tools/blob/main/examples/preparation/example_test.go). Connect this lifecycle to Harness's [tool calls and results](/docs/guides/harness/step/tool-calls-and-results) and Inference's [tool-result content](/docs/guides/inference/content-blocks/tool-result).

## Result Shapes

The common return type is `*tool.ToolResult`. Individual tools choose a bounded shape that keeps useful recovery information while avoiding secrets and host details:

- `Bash` returns combined output, bounded to a 32 KiB head and tail, and an exit code. A non-zero exit is still a normal result.
- `ReadFile` returns line-numbered text and a truncation notice when the guard cap is exceeded.
- `WriteFile` returns a short success message, while `EditFile` returns a compact unified diff of the change.
- `Fetch` returns status, a bounded header summary, and a capped body.
- `Glob` and `Grep` return sorted or line-oriented matches with explicit truncation notices.
- `ProcessOutput`, `ProcessInput`, and `ProcessStop` return JSON objects with opaque process IDs, cursors, status, and stable error codes.
- `read_tool_result` returns one page of a retained result with a footer naming its byte range.

Errors from execution are model-facing strings or fields. They do not expose file contents, request bodies, full URLs, process paths, OS PIDs, or another owner's process details.

## Large results and capture

A build log or a test run can be far larger than the model should read at once. Harness can retain a tool result in full while the conversation receives only a shaped preview. That retention is wired by the composition root with Harness's `rig.WithToolResultObjects`. The model then pages through the retained bytes with [read_tool_result](/docs/guides/tools/built-in-tools/readtoolresult).

Two Harness capabilities connect a tool to that retention:

| Capability | Where it lives | What it means |
| --- | --- | --- |
| `tool.CapturingInvokableTool` | the built tool | `InvokableRunCaptured` streams the complete raw result into a write-only sink and returns the bounded preview separately. |
| `tool.CaptureSafetyDeclarer` | the definition | `DeclaredCaptureSafety()` reports `Streaming` and `HighOutput` before any session is bound. |

Every definition exported by the Tools root declares its capture safety, so Harness's `tool.ProjectCaptureSafety` reflects what each tool actually does:

| Declaration | Definitions |
| --- | --- |
| Streaming, high output | `Bash` and `BashDefinition` with no injected runner |
| Materialized, high output | `Bash` and `BashDefinition` with a runner, `ReadFile`, `Grep`, `ProcessOutput`, `ProcessInput` |
| Small output | `AskUser`, `Tasks`, `WebSearch`, `Fetch`, `Glob`, `WriteFile`, `EditFile`, `ProcessStop`, `read_tool_result` |

A materialized result is resident in memory before the loop can bound it. A descriptor is safe only when every high-output definition streams or the runtime declares a finite materialized maximum. With a runner injected, including a confined sandbox executor, Bash is materialized because `tool.CommandRunner` returns the whole output as one byte slice. Also set a finite `ToolLimits.ResultBytes` on the loop so the model-facing text stays bounded. See Harness's [tools and tool limits](/docs/guides/harness/loop/tools-and-tool-limits).

`ProcessOutput` and `ProcessInput` accept a caller-supplied `limit_bytes` with no upper bound in this release, which is why they are declared materialized and high output.

## Fresh Instances and Shared State

Definition builds are fresh. Concurrent builds must not return the same mutable tool instance. The exception is deliberate shared state inside a bundle or session resource: the four task tools share one task graph, and supervised process definitions resolve one session-scoped `SupervisorResourceKey` entry. Read the [registration guide](/docs/guides/tools/core-concepts/registration) before adding a definition to a composition root.

## Source

- [Definition builders and errors](https://github.com/looprig/tools/blob/main/definitions.go)
- [Prepared-call boundary in Bash](https://github.com/looprig/tools/blob/main/bash/prepare.go)
- [Bash result capture](https://github.com/looprig/tools/blob/main/bash/capture.go)

## Proof

- [Definition lifecycle tests](https://github.com/looprig/tools/blob/main/definitions_test.go)
- [Prepared-call examples contract](https://github.com/looprig/tools/blob/main/docs_examples_test.go)
- [Executable preparation fixture](https://github.com/looprig/tools/blob/main/examples/preparation/example_test.go)
- [Capture-safety contract tests](https://github.com/looprig/tools/blob/main/capture_contract_test.go)
- [Tool-result retention tests](https://github.com/looprig/tools/blob/main/tool_result_retention_test.go)
