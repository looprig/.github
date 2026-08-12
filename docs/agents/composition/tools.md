---
id: agents/composition/tools
title: Define and bind tools
description: Tool metadata, immutable definitions, prepared effects, and standard tool bindings.
audience: agent
section: agents/composition
order: 2
publication: released
proofs:
  contracts:
    - release-github-com-looprig-harness
    - release-github-com-looprig-tools
---
# Tools

An invokable tool implements `tool.BaseTool.Info(context.Context)` and `InvokableTool.InvokableRun(context.Context, string)`. Return a `tool.ToolInfo` with a stable name and strict JSON Schema. Wrap the implementation in `tool.NewDefinition(name, requirements, factory)`. The factory receives attenuated `tool.Bindings`, so it sees only declared capabilities such as workspace, delegate controller, or process services. Build a fresh concrete tool per binding when it carries mutable state.

For effects, implement `tool.CallPreparer`. `PrepareCall` decodes and normalizes untrusted JSON once, returns a `tool.Request` with typed capability requirements plus a prepared artifact, and `InvokableRun` consumes that artifact. Implement `tool.Auditable` for a bounded, redacted summary. The tool describes requirements; the gate decides allow, gate, or deny.

Standard definitions live in `github.com/looprig/tools`: `ReadFileDefinition`, `WriteFileDefinition`, `Bash`, `Fetch`, `Glob`, `Grep`, `ProcessOutputDefinition`, `ProcessInputDefinition`, and `ProcessStopDefinition`. A command tool must receive the sandbox executor selected by the composition root. Never grant filesystem or process access merely because a tool was selected.

Lifecycle: definition immutable; factory bind per session or Loop; prepared artifact valid for one call; context cancellation reaches execution. Invariants: definition name equals `ToolInfo.Name`, schemas are bounded, requirements are normalized, and missing bindings fail before the factory runs. Failures include malformed arguments, `MissingBindingError`, preparation errors, cancellation, and redaction violations.

Proofs: [`harness/pkg/tool/definition.go`](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/definition.go), [`tools/definitions_test.go`](https://github.com/looprig/tools/blob/9439c2a89b87559874fce3f71889b695013a1f1c/definitions_test.go).
