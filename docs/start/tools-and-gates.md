---
id: start/tools-and-gates
title: Add tools and gates
description: Expose application actions to a Loop, prepare effectful calls before execution, and authorize their declared requirements.
audience: developer
section: start
order: 4
publication: released
proofs:
  tools:
    - release-github-com-looprig-tools
  gates:
    - release-github-com-looprig-harness
---

# Add tools and gates

Tools let the model request application actions. Pure tools can run directly. Effectful tools must prepare and freeze the operation before a gate evaluates its requirements.

## Bind tools to a Loop {#tools}

```go
assistant, err := loop.Define(
	loop.WithName("assistant"),
	loop.WithInference(client, selectedModel),
	loop.WithTools(readTool, searchTool, bashTool),
)
```

The model requests a tool with `ToolUseBlock{ID, Name, Input}`. Harness invokes the matching definition and returns a correlated `ToolResultMessage`.

## Authorize prepared effects {#gates}

```go
request, artifact, err := effectfulTool.PrepareCall(ctx, executionID, inputJSON)
if err != nil { return err }

resolution, err := evaluator.Authorize(ctx, request)
if err != nil { return err }
if !resolution.Approved { return errors.New("operation denied") }

// Execute the exact artifact that the gate evaluated, not new input.
ctx = loop.WithPreparedCall(ctx, tool.PreparedCall{
	ExecutionID: executionID,
	Request: request,
	Artifact: artifact,
})
result, err := effectfulTool.InvokableRun(ctx, inputJSON)
```

Expected lifecycle:

```text
prepare → authorize requirements → execute prepared artifact → return tool result
```

Gates make application-policy decisions. They are separate from Sandbox, which enforces process authority at the operating-system boundary. Continue with [sessions](/docs/start/sessions).
