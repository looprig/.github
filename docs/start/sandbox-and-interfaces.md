---
id: start/sandbox-and-interfaces
title: Sandbox process tools
description: Call sandbox.Init, define the coding assistant process authority, create an ExecutorSet, bind Bash to an executor, and verify achieved native guarantees.
audience: developer
section: start
order: 8
publication: released
proofs:
  initialize-the-application: [release-github-com-looprig-sandbox]
  define-process-authority: [release-github-com-looprig-sandbox]
  bind-the-process-runner: [release-github-com-looprig-sandbox, release-github-com-looprig-tools]
  verify-achieved-enforcement: [release-github-com-looprig-sandbox]
  runnable-checkpoint: [release-github-com-looprig-sandbox]
---

# Sandbox process tools

Read-only in-process tools already stay inside their bound workspace. Add Sandbox when the coding assistant can launch Bash or another child process. The gate decides whether a prepared command is authorized. Sandbox decides what authority the operating system gives the child.

## Initialize the application

On Linux, `sandbox.Init()` must be the first line of `main`, before goroutines, file descriptors, or other application state:

```go
func main() {
	// This dispatches a reserved Linux re-exec child and returns in the parent.
	sandbox.Init()

	if err := run(context.Background()); err != nil {
		log.Fatal(err)
	}
}
```

The application is still built with the normal Go toolchain. Sandbox compiles an in-memory enforcement specification at runtime; it does not create a second application binary.

## Define process authority

Create the least-authority profile needed by the coding assistant:

```go
profile, err := sandbox.NewProfile(sandbox.ProfileConfig{
	WorkspaceRoot:  workspaceRoot,
	WorkspaceRead:  sandbox.Allow,
	WorkspaceWrite: sandbox.Deny,
	HostRead:       sandbox.Deny,
	HostWrite:      sandbox.Deny,
	Network:        sandbox.Deny,
	Command:        sandbox.Gated,
	Home:           sandbox.IsolatedHome,
	Isolation:      sandbox.Sandboxed,
})
if err != nil {
	return err
}

executors, err := sandbox.NewExecutorSet(
	profile,
	sandbox.WithScratchRoot("./agent-data/sandbox"),
	sandbox.WithMaxExecutors(1),
)
```

`Restrict` can intersect a requested profile with an application security ceiling. It never expands authority.

## Bind the process runner

An Executor satisfies the command-runner boundary consumed by the Bash tool:

```go
executor, err := executors.For("coding-assistant")
if err != nil {
	return err
}

assistant, err := loop.Define(
	loop.WithName("coding-assistant"),
	loop.WithInference(client, selected),
	loop.WithTools(
		// Bash still uses prepare-before-effect and the Loop access gate.
		tools.Bash(bash.WithRunner(executor)),
	),
)
```

For multiple live Loops, resolve one executor per validated Loop identity rather than sharing a mutable global runner. Supervised process tools add a process registry and lifecycle services; see [Tools process ownership](/docs/guides/tools/processes/).

## Verify achieved enforcement

Requested policy and achieved native enforcement are different facts:

```go
report := executor.Report()             // CompileReport entries explain each feature.
guarantees := executor.Guarantees()     // Fail-closed booleans for enforced properties.
level := executor.Level()               // None, degraded, or full.

if !guarantees.ProcessBoundary || !guarantees.WriteBoundary {
	return fmt.Errorf("required sandbox guarantees unavailable: level=%d report=%+v", level, report)
}
```

The concrete type returned by `Executor.Report` is `CompileReport`; `Executor.Guarantees` returns `Guarantees`. Verify them on the deployed host. Docker, a microVM, a virtual machine, and a managed sandbox form an outer boundary but do not prove which inner features succeeded. See [deployment environments](/docs/guides/sandboxing/deployment-environments/).

## Runnable checkpoint

The [sandboxed process checkpoint](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage11_sandbox_process/main.go) calls `sandbox.Init`, constructs a profile and ExecutorSet, runs a real confined command, checks the exit code, and rejects `LevelNone`.

Continue to [run the coding assistant CLI](/docs/start/run-cli/).
