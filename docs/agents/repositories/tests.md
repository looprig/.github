---
id: agents/repositories/tests
title: Cross-module integration tests
description: Exercise dependency boundaries and composed runtime behavior from the workspace integration module.
audience: agent
section: agents/repositories
order: 22
publication: source-workspace
proofs:
  module:
    - module-tests
---
# tests

`github.com/looprig/tests` is a source-workspace integration module with no released consumer package. It imports the released lower-tier modules and checks root layout, dependency boundaries, Harness lifecycle and restore behavior, sandbox integration, MCP adapters, credentials, and foreign loops.

Use it as a compatibility gate for a composed product, not as a runtime dependency. Run it from the workspace with its own module file and without local replacement directives that hide release-version mistakes. Individual tests identify the contract being checked, so route failures to the owning module.

Proofs: [`dependency_boundary_test.go`](https://github.com/looprig/tests/blob/db8982cc36f15c5da6285b2a160b6c772b1f82d8/dependency_boundary_test.go), [`rig_lifecycle_test.go`](https://github.com/looprig/tests/blob/db8982cc36f15c5da6285b2a160b6c772b1f82d8/rig_lifecycle_test.go), [`mcp_adapter_test.go`](https://github.com/looprig/tests/blob/db8982cc36f15c5da6285b2a160b6c772b1f82d8/mcp_adapter_test.go), [`sandbox_integration_test.go`](https://github.com/looprig/tests/blob/db8982cc36f15c5da6285b2a160b6c772b1f82d8/sandbox_integration_test.go).
