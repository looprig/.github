---
id: start/sandbox-and-interfaces
title: Confine processes and attach an interface
description: Compile a Sandbox profile for process tools, then present Harness sessions through a browser client or terminal UI.
audience: developer
section: start
order: 6
publication: released
proofs:
  sandbox:
    - release-github-com-looprig-sandbox
  interfaces:
    - release-github-com-looprig-tui
    - release-github-com-looprig-client
---

# Confine processes and attach an interface

Add Sandbox when an approved tool launches a process or needs filesystem and network boundaries. A gate decides whether the operation is allowed; Sandbox compiles and enforces the selected profile.

## Run through Sandbox {#sandbox}

```go
profile, err := sandbox.NewProfile(sandbox.ProfileConfig{
	WorkspaceRoot: workspace,
	WorkspaceRead: sandbox.Allow,
	WorkspaceWrite: sandbox.Allow,
	HostWrite: sandbox.Deny,
	Network: sandbox.Deny,
	Command: sandbox.Allow,
	Home: sandbox.IsolatedHome,
	Isolation: sandbox.Sandboxed,
})
if err != nil { return err }

executors, err := sandbox.NewExecutorSet(profile)
if err != nil { return err }
defer executors.Close()
executor, err := executors.For("session-worker")
```

Inspect `executor.Guarantees()` and its compile report. Do not assume every operating system supplies identical isolation features.

## Choose an interface {#interfaces}

Harness sessions publish events independently of presentation:

```go
// Terminal application
adapter := sessionadapter.NewWithReplay(session)
app, err := tui.New(adapter)

// Browser application
// Serve the Harness read/event plane, then bind it with the framework-neutral
// TypeScript SessionClient. React, Vue, Svelte, or vanilla DOM can consume it.
```

Choose TUI for a ready terminal experience. Choose Client for browser applications and keep the frontend framework as an application decision. Both consume the same session lifecycle and event concepts.
