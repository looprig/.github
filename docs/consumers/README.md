# Build with looprig

looprig is an agent harness for building agents you own and can change. You
choose the models, instructions, tools, permissions, storage, interface, and
where the system runs.

The core mental model is small:

- A **Loop** defines one agent.
- A **Rig** assembles one or more Loops with storage and lifecycle policy.
- A **Session** is one running instance of that Rig.

## Start here

1. [Quickstart](quickstart.md) builds and runs one useful agent from an empty Go
   module.
2. [Loop](loop.md) explains how to define an agent's model, instructions, tools,
   permissions, modes, and delegates.
3. [Rig](rig.md) explains how to assemble Loops with storage, workspaces,
   snapshots, gates, and execution policy.
4. [Session](session.md) explains how to submit work, observe events, answer
   gates, interrupt work, compact context, and restore prior sessions.
5. [Build larger systems](larger-systems.md) adds durable storage, files and
   commands, OS confinement, multiple agents, HTTP serving, and durable
   workflows.
6. [Package overview](packages.md) maps the looprig modules and helps you choose
   what to import.

## Choose your path

| What you want to build | Begin with | Add next |
| --- | --- | --- |
| A personal agent | [Quickstart](quickstart.md) | Filesystem storage and your own instructions |
| An agent that edits files or runs commands | [Loop](loop.md) | Tools, permissions, a workspace, and sandboxing |
| A team of agents | [Rig](rig.md) | Delegates, delegation limits, and per-agent tools |
| A service or application | [Session](session.md) | HTTP serving and durable storage |
| A long-running workflow | [Build larger systems](larger-systems.md) | The `flow` module and durable checkpoints |

## Ownership is part of the design

looprig does not give you one fixed agent. It gives you composable parts. Your
application remains the composition root, so you decide:

- which model providers to trust;
- what each agent knows and can do;
- which actions happen automatically and which require approval;
- where session history and workspace snapshots are stored;
- whether the system runs on a laptop, server, or distributed backend;
- whether people use it through a terminal, an HTTP API, or an interface you
  build yourself.

Start with one useful task. Add machinery only when the task needs it.
