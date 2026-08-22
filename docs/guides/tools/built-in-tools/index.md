---
id: guides/tools/built-in-tools/index
title: Built-in tools
description: Choose the standard Looprig tools for user input, files, network access, shell commands, and tasks.
audience: developer
section: guides
order: 10
publication: released
proofs:
  choose-a-built-in-tool: [release-github-com-looprig-tools]
  prepare-before-effect: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# Built-in tools

The built-in tools are ready-made `tool.Definition` constructors for common
agent effects. They all share the same prepare, gate, and result boundary, but
their authority is different. Choose the smallest tool that expresses the
operation and keep the composition root responsible for its bindings.

## Choose a built-in tool

| Need | Tool | Authority boundary |
| --- | --- | --- |
| Ask a person for a decision | [AskUser](/docs/guides/tools/built-in-tools/askuser) | Uses the loop input seam and no filesystem or network access. |
| Run a bounded shell command | [Bash](/docs/guides/tools/built-in-tools/bash) | Requires an approved command and workspace, with an optional supervised process. |
| Change one exact text region | [EditFile](/docs/guides/tools/built-in-tools/editfile) | Requires a complete prior observation and an exact contained write target. |
| Make one HTTP request | [Fetch](/docs/guides/tools/built-in-tools/fetch) | Uses an injected client and one declared host and port. |
| Find workspace paths | [Glob](/docs/guides/tools/built-in-tools/glob) | Walks only an approved, denied-path-filtered tree. |
| Search file contents | [Grep](/docs/guides/tools/built-in-tools/grep) | Uses bounded ripgrep or a standard-library fallback under one read grant. |
| Read a bounded text view | [ReadFile](/docs/guides/tools/built-in-tools/readfile) | Records a full-file observation before displaying selected lines. |
| Load an approved skill | [Skill](/docs/guides/tools/built-in-tools/skill) | Uses an agent-scoped loader and a TOCTOU-safe workspace snapshot. |
| Track loop-local work | [Task tools](/docs/guides/tools/built-in-tools/task) | Keeps one in-memory dependency graph per definition bundle. |
| Search through a declared provider | [WebSearch](/docs/guides/tools/built-in-tools/websearch) | Emits network requirements for the provider's declared endpoints. |
| Replace a complete file | [WriteFile](/docs/guides/tools/built-in-tools/writefile) | Uses a same-directory temporary file, sync, and atomic rename. |

## Prepare before effect

Every built-in follows the common [definition and preparation contract](/docs/guides/tools/core-concepts).
Preparation validates arguments, resolves paths or endpoints, and returns the
requirements and artifact that a Harness gate can inspect. The direct run path
must use that approved artifact rather than reconstructing untrusted input.

```go
defs := tool.TaskDefinitions()
task := defs[0]
prepared, err := task.PrepareCall(ctx, []byte(`{"subject":"review"}`))
if err != nil {
	return err
}
// A Harness gate evaluates prepared.Requirements before Invoke uses its artifact.
_ = prepared
```

For the shared permission and grant boundary, read [Safety, Permissions, and
Gates](/docs/guides/tools/safety). For long-running shell work, continue to
[Process Supervision](/docs/guides/tools/processes).

## Source

The standard definition constructors are rooted in
[`definitions.go`](https://github.com/looprig/tools/blob/main/definitions.go),
with concrete implementations in
[`askuser/askuser.go`](https://github.com/looprig/tools/blob/main/askuser/askuser.go)
and the other linked tool pages.

## Proof

The definition lifecycle is exercised by
[`definitions_test.go`](https://github.com/looprig/tools/blob/main/definitions_test.go)
and the Bash implementation proof by
[`bash/bash_test.go`](https://github.com/looprig/tools/blob/main/bash/bash_test.go).
