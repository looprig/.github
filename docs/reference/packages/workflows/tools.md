---
id: reference/packages/workflows/tools
title: Workflows tools package
description: Tool bundle that exposes workflow start, lookup, history, resume, and cancellation operations through injected session resources.
audience: developer
section: reference
order: 211
publication: source-workspace
examples:
  - stage-18-workflows
proofs:
  package-role: module-workflows
  exported-surface: central-workflows-catalog-source
  functions: central-workflows-catalog-source
  methods: central-workflows-catalog-source
  types: central-workflows-catalog-source
  constants: central-workflows-catalog-source
  variables: central-workflows-catalog-source
  ownership-and-errors: central-workflows-catalog-source
  source-and-runnable-proof: central-workflows-stage18-output-test
---

# `github.com/looprig/workflows/tools`

The tools package is a source-workspace companion to the workflows root package. It builds invokable tools from caller-supplied session resources; it does not locate a global catalog or supervisor.

## Package role {#package-role}

The bundle is the model-facing control surface for workflow orchestration. It translates tool calls into the typed catalog, run registry, input store, and session-owned supervisor. Workflow event history and run records remain durable projections outside the tool implementation.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewBundle(config Config) ([]tool.InvokableTool, error)`

### Methods {#methods}

- `func (e *PrepareRunIntegrityError) Error() string`

### Types {#types}

```go
type Config struct {
	SessionID  uuid.UUID
	Catalog    *workflows.Catalog
	Registry   runRegistry
	Inputs     inputStore
	Supervisor supervisorControl
	Now        func() time.Time
	NewID      func() (uuid.UUID, error)

	PrepareRun func(context.Context, workflows.Run) (workflows.Run, error)
}
```

```go
type PrepareRunIntegrityError struct {
	Field string
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `PrepareRunIntegrityError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [tools/bundle.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/tools/bundle.go)
- [tools/definition_list.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/tools/definition_list.go)
- [tools/results.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/tools/results.go)
- [tools/run_cancel.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/tools/run_cancel.go)
- [tools/run_get.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/tools/run_get.go)
- [tools/run_history.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/tools/run_history.go)
- [tools/run_list.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/tools/run_list.go)
- [tools/run_resume.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/tools/run_resume.go)
- [tools/run_start.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/tools/run_start.go)

Adjacent tests at the same commit:

- [tools/cancel_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/tools/cancel_test.go)
- [tools/prepare_run_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/tools/prepare_run_test.go)
- [tools/tools_test.go](https://github.com/looprig/workflows/blob/852dd8dd80305f57a7224570c906f73f2646820d/tools/tools_test.go)

Run `GOWORK=off go test ./...` from the `workflows` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
