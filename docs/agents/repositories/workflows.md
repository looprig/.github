---
id: agents/repositories/workflows
title: Durable workflow supervisor
description: Register typed workflow definitions and supervise durable runs over Flow and Harness services.
audience: agent
section: agents/repositories
order: 25
publication: source-workspace
proofs:
  module:
    - module-workflows
  source:
    - central-workflows-typed-definition-source
    - central-workflows-catalog-source
    - central-workflows-stage18-lifecycle-fixture
    - central-workflows-stage18-output-test
---
# workflows

`github.com/looprig/workflows` is a source-workspace module pending a release boundary. It depends on `core`, `flow`, `harness`, `inference`, and `storage`. Define metadata with `NewMetadata`, construct a typed definition with `NewTypedDefinition`, register it in `NewCatalog`, and resolve by exact name and version.

`NewSupervisor` requires a session ID, catalog, run registry, input store, and lease. `Activate` acquires ownership, loads durable runs, and starts workers. Use the run and tool APIs for start, resume, cancel, history, and status. Release the supervisor so its lease and workers stop.

Names, versions, schemas, duplicate registrations, session ownership, lease loss, adoption, shutdown timeout, and invalid inputs are enforced in code. Use the stage18 fixture as the executable lifecycle example. Proofs: [`typed_definition.go`](https://github.com/looprig/workflows/blob/f241ecbd6299a00d52fc6755b5be946a41b3a73f/typed_definition.go), [`catalog.go`](https://github.com/looprig/workflows/blob/f241ecbd6299a00d52fc6755b5be946a41b3a73f/catalog.go), [`supervisor.go`](https://github.com/looprig/workflows/blob/f241ecbd6299a00d52fc6755b5be946a41b3a73f/supervisor.go), [`examples/docs/stage18_workflows/main.go`](https://github.com/looprig/workflows/blob/f241ecbd6299a00d52fc6755b5be946a41b3a73f/examples/docs/stage18_workflows/main.go), [`recovery_integration_test.go`](https://github.com/looprig/workflows/blob/f241ecbd6299a00d52fc6755b5be946a41b3a73f/recovery_integration_test.go).
