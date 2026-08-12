---
id: examples/index
title: Build a small agent
description: Four source-backed examples that show how a small agent grows from a model call into a session, a safe command boundary, and a durable approval workflow.
audience: [human, developer]
section: examples
order: 400
publication: released
examples:
  - stage-01-inference
  - stage-11-sandbox-process
  - stage-17-flow
  - stage-23-eval
proofs:
  hello-agent: [release-github-com-looprig-core, release-github-com-looprig-inference]
  session-assistant: [release-github-com-looprig-harness, release-github-com-looprig-inference, release-github-com-looprig-storage]
  safe-shell: release-github-com-looprig-sandbox
  durable-approval: release-github-com-looprig-flow
  evaluation: [release-github-com-looprig-eval, release-github-com-looprig-pluto]
---

# Build a small agent

Start with a small task and add one boundary at a time. The examples below are
real, runnable fixtures from this repository. They use deterministic clients
where possible, so you can read the control flow without first configuring a
provider. A weather or research helper can start with the same first two
examples and add its own provider and tools.

## Start with a small task

### The hello agent

This is the smallest useful model boundary: send one user message and receive
one assistant message. The fixture uses a fake client that returns a stable
greeting, so it runs without credentials or network access.

```go
// Keep the first model call deterministic while learning the request shape.
client := fakeinference.New(fakeinference.Text("Hello from Looprig."))
response, err := client.Invoke(context.Background(), inference.Request{
	System: "Answer briefly.",
	Messages: content.AgenticMessages{&content.UserMessage{Message: content.Message{
		Role: content.RoleUser, Blocks: []content.Block{&content.TextBlock{Text: "Say hello."}},
	}}},
})
```

[Open the runnable source](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage01_inference/main.go) and [its exact-output test](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage01_inference/main_test.go). Read [Model call](/docs/start/model-call/) for the provider-neutral request contract.

Run it from the repository root:

```sh
node scripts/docs/run-examples.mjs --stage 1
```

### The full session assistant

When the model call needs memory, events, and clean shutdown, put it in a
`Loop`, assemble a `Rig`, and create a `Session`. This complete quickstart
submits `Report status.` to an offline model and waits for `TurnDone` before it
exits.

```go
// The Loop defines the agent; the Rig supplies storage and session lifecycle.
agent, err := loop.Define(
	loop.WithName("assistant"),
	loop.WithInference(deterministicModelStub{}, model.CustomModel(
		"fixture", model.APIFormatOpenAI, "http://localhost", "fixture-model",
	)),
)
runtime, err := rig.Define(
	rig.WithLoops(agent),
	rig.WithPrimers("assistant"),
	rig.WithSessionStore(store),
)
```

[Open the complete quickstart](https://github.com/looprig/.github/blob/main/examples/go/guides/harness-quickstart/main.go) and [its exact-output test](https://github.com/looprig/.github/blob/main/examples/go/guides/harness-quickstart/main_test.go). Continue with [Run the agent with Harness](/docs/start/first-run/) to add a real model client and submit live work.

Run its checked fixture directly:

```sh
cd examples/go/guides/harness-quickstart && GOWORK=off go test ./...
```

## Add a boundary when the task needs it

### The safe shell boundary

An agent that can run commands needs a policy boundary before it needs a clever
prompt. This fixture creates an isolated home, denies network and host writes,
then runs one confined command. It demonstrates the sandbox boundary itself;
your application still decides which tool requests reach it.

```go
// Deny the dangerous defaults before exposing a command to an agent.
profile, err := sandbox.NewProfile(sandbox.ProfileConfig{
	WorkspaceRoot: workspace, WorkspaceRead: sandbox.Allow, WorkspaceWrite: sandbox.Deny,
	HostRead: sandbox.Allow, HostWrite: sandbox.Deny, Network: sandbox.Deny,
	Command: sandbox.Allow, Home: sandbox.IsolatedHome, Isolation: sandbox.Sandboxed,
})
result, code, err := executor.RunCommand(context.Background(), workspace, "echo confined")
```

[Open the runnable source](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage11_sandbox_process/main.go) and [its exact-output test](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage11_sandbox_process/main_test.go). Read [Sandbox](/docs/build/11-sandbox/) before connecting this boundary to a tool.

```sh
node scripts/docs/run-examples.mjs --stage 11
```

### The durable approval workflow

Some work must stop and wait for a person. This Flow fixture pauses at an
approval interrupt, records checkpoint history, and resumes with `alice`. The
approval state survives the pause as workflow state rather than an in-memory
callback.

```go
// Pause at the approval point and continue later with the approver identity.
return decision{}, flow.StatefulInterrupt(ctx, "approve "+change, 1)

completed, err := runner.Resume(ctx, paused.Run.GraphRunID, "alice")
```

[Open the runnable source](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage17_flow/main.go) and [its exact-output test](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage17_flow/main_test.go). Read [Durable flows](/docs/build/06-flows/) for graph definitions, interruption, and resume.

```sh
node scripts/docs/run-examples.mjs --stage 17
```

## Before you ship

Once an agent has a useful behavior, test it against a stable suite. The
[evaluation checkpoint](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage23_eval/main.go) runs Eval and Pluto together: Eval produces a deterministic report, while Pluto is the qualification and evaluation framework for release decisions. It is the next example to read when a local prototype needs a repeatable “is this ready?” check.
