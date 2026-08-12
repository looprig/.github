---
id: modules/tools
title: Standard prepared tools
description: Use the released Tools module for read, write, process, network, task, and skill capabilities with preparation before effect.
audience: developer
section: modules
order: 15
publication: released
examples:
  - stage-03-pure-tool
  - stage-04-prepared-tool
proofs:
  repository: release-github-com-looprig-tools
  boundary:
    - release-github-com-looprig-tools
    - release-github-com-looprig-harness
  preparation:
    - release-github-com-looprig-tools
    - release-github-com-looprig-harness
  lifecycle:
    - release-github-com-looprig-tools
  errors-and-limits:
    - release-github-com-looprig-tools
  runnable-proof:
    - release-github-com-looprig-tools
---

# Standard prepared tools

## Repository

Source, package documentation, tests, and examples are available in the [`looprig/tools` repository](https://github.com/looprig/tools).

Tools `v0.10.0` provides independent implementations for common capabilities. Install `github.com/looprig/tools@v0.10.0` and compose only the definitions a loop should see. The module implements Harness contracts; it does not own the gate policy, Sandbox backend, model, or durable session store.

## Boundary {#boundary}

The root package exposes definition builders such as `Bash`, `ReadFileDefinition`, `WriteFileDefinition`, `EditFileDefinition`, `GlobDefinition`, `GrepDefinition`, `FetchDefinition`, `WebSearchDefinition`, `TaskDefinitions`, `AskUserDefinition`, and the process input, output, and stop definitions. Focused packages expose concrete constructors such as `bash.NewBash`, `readfile.NewReadFile`, `process.NewSupervisor`, `skill.NewSkill`, and `websearch.NewWebSearch`.

## Preparation {#preparation}

Effectful definitions implement `tool.CallPreparer`. Preparation decodes and validates JSON, normalizes paths, commands, URLs, process selectors, or task identifiers, resolves canonical identities, and returns a typed request plus an opaque artifact. Harness calls it once before gate evaluation. A definition without preparation is treated as an unprepared effectful tool and fails closed. Pure tools return an empty requirement set and can execute without a gate.

The common `tool.Requirement` and `tool.Requirements` values describe capabilities such as workspace read, path mutation, command start, network target, and process control. The gate chooses the decision; Sandbox or a session resource enforces the resulting grant. A tool cannot use a classifier recommendation or an untrusted argument to bypass either boundary.

## Lifecycle {#lifecycle}

Definitions are immutable factories. Harness builds them with session and loop bindings, including workspace observations, mutation coordinators, process resources, and delegation controllers. A Bash or process definition may share a session supervisor; file tools use workspace permits and freshness observations. Close process resources and supervisors with the session, then release any workspace lease.

## Errors and limits {#errors-and-limits}

Use typed definition, preparation, stale-file, lease-health, permission, process, fetch, skill, and task errors. Read and write tools bound path depth, file sizes, output, and replacement sizes. Bash requires an explicit command grant and may report lifetime containment unavailability for supervised execution. `WithHostWrites` and `WithHostReads` are explicit authority changes, not defaults.

## Runnable proof {#runnable-proof}

`stage-03-pure-tool` and `stage-04-prepared-tool` show the distinction between a pure definition and a prepared request. Component examples under `tools/examples/definitions`, `tools/examples/preparation`, `tools/examples/processes`, `tools/examples/permissions`, `tools/examples/skills`, and `tools/examples/tasks` provide deterministic package paths. Run the progressive pair with `node scripts/docs/run-examples.mjs` and inspect the [pinned root definitions](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/definitions.go) and [file mutation seam](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/internal/filemutation/).
