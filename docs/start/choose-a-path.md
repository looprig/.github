---
id: start/choose-a-path
title: Start building with Looprig
description: Follow the consumer path from one model call to a durable, tool-using agent with confined effects and your choice of interface.
audience: developer
section: start
order: 1
publication: released
proofs:
  path:
    - release-github-com-looprig-inference
    - release-github-com-looprig-harness
---

# Start building with Looprig

Looprig is a set of composable Go modules. You can stop after Inference if your application only needs model calls, or continue into Harness when you need sessions, events, tools, gates, workspaces, delegation, and controlled shutdown.

## Recommended path {#path}

1. **[Use Inference](/docs/start/installation).** Construct provider-neutral messages and call an `inference.Client`.
2. **[Build an agent with Harness](/docs/start/first-run).** Bind the client to a Loop, assemble a Rig, and run a Session.
3. **[Add tools and gates](/docs/start/tools-and-gates).** Expose application actions and authorize prepared effects.
4. **[Persist sessions](/docs/start/sessions).** Replace memory storage and restore a session by ID.
5. **[Add a workspace](/docs/start/workspaces).** Manage session-owned files and snapshots independently from history.
6. **[Confine processes and attach an interface](/docs/start/sandbox-and-interfaces).** Add Sandbox for effectful process tools, then connect a browser client or TUI.

You do not need every module. Add a boundary only when your application needs the responsibility it owns.
