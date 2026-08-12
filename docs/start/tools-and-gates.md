---
id: start/tools-and-gates
title: Add read-only tools and gates
description: Register workspace-aware inspection tools, understand model ToolUseBlock requests, and keep effectful execution behind prepare-before-effect gate decisions.
audience: developer
section: start
order: 5
publication: released
proofs:
  register-read-only-tools: [release-github-com-looprig-tools, release-github-com-looprig-harness]
  understand-the-tool-cycle: [release-github-com-looprig-core, release-github-com-looprig-harness]
  gate-effectful-tools: [release-github-com-looprig-harness, release-github-com-looprig-tools]
  runnable-checkpoint: [release-github-com-looprig-harness]
---

# Add read-only tools and gates

The coding assistant can answer general questions without tools, but it needs evidence to discuss a repository. Start with read-only file inspection. Add mutation and process tools only after the application has an explicit approval and confinement policy.

## Register read-only tools

Tools exposes definitions that bind to each Session workspace. Add them to `defineAssistant`:

```go
func defineAssistant(client inference.Client, selected model.Model, reads loop.ReadGuard) (loop.Definition, error) {
	return loop.Define(
		loop.WithName("coding-assistant"),
		loop.WithSystem("Use ReadFile, Glob, and Grep for repository evidence. Cite the paths you inspected."),
		loop.WithInference(client, selected),
		loop.WithTools(
			// These definitions bind to the workspace supplied by the Rig.
			tools.ReadFileDefinition(reads),
			tools.GlobDefinition(reads),
			tools.GrepDefinition(reads),
		),
	)
}
```

`loop.ReadGuard` is the narrow policy interface used by read tools. It decides whether a canonical path is denied and caps bytes read per file. Keep secret patterns and size limits in one application-owned implementation.

## Understand the tool cycle

The model does not call Go functions directly. It returns a `ToolUseBlock` containing a call ID, registered name, and JSON input. Harness validates and executes the matching definition, then appends a correlated tool result before the next model Step.

```go
// A provider codec decodes its wire format into this provider-neutral block.
call := &content.ToolUseBlock{
	ID:    "call-1",
	Name:  "ReadFile",
	Input: json.RawMessage(`{"path":"README.md"}`),
}
```

You normally do not construct this block yourself. It is shown here to make the model-to-tool boundary explicit. See [tool calls and results](/docs/guides/harness/step/tool-calls-and-results/) and the [built-in tool catalog](/docs/guides/tools/built-in-tools/).

## Gate effectful tools

An effectful tool implements `PrepareCall`. Preparation validates input and seals a `PreparedArtifact` before the gate evaluates the declared requirements:

```go
request, artifact, err := effectful.PrepareCall(ctx, executionID, inputJSON)
if err != nil {
	return err
}

resolution, err := evaluator.Authorize(ctx, request)
if err != nil {
	return err
}
if !resolution.Approved {
	return errors.New("tool request denied")
}

// Execute the exact artifact reviewed by the gate. Do not parse new input here.
prepared := tool.PreparedCall{
	ExecutionID: executionID,
	Request:     request,
	Artifact:    artifact,
	Grants:      resolution.Grants,
}
_, err = effectful.InvokableRun(loop.WithPreparedCall(ctx, prepared), inputJSON)
return err
```

The application chooses interactive approval, saved rules, or a headless fail-closed evaluator. A gate answers whether a prepared effect is authorized. [Sandboxing](/docs/guides/sandboxing/) separately constrains a process at the operating-system boundary.

## Runnable checkpoint

The [prepared tool example](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage04_prepared_tool/main.go) runs `PrepareCall`, authorizes the request, preserves the artifact, and returns the exact result. Compare it with the [pure tool checkpoint](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage03_pure_tool/main.go), which needs no external authority.

Continue to [persist and restore sessions](/docs/start/sessions/).
