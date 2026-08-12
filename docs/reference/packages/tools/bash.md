---
id: reference/packages/tools/bash
title: bash package · bash
description: Reference for prepared shell and supervised Bash execution.
audience: developer
section: reference
order: 162
publication: released
examples:
  - stage-04-prepared-tool
proofs:
  package-role: release-github-com-looprig-tools
  exported-surface: release-github-com-looprig-tools
  functions: release-github-com-looprig-tools
  methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants: release-github-com-looprig-tools
  variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# bash package · bash

Import path: `github.com/looprig/tools/bash`. The source is pinned to github.com/looprig/tools@v0.10.0.

## Package role {#package-role}

`NewBash` binds a root and optional command runner, workspace coordinator, observations, and family catalog. `NewFactory` and `NewSupervisedFactory` build definitions for normal and background calls.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithRunner(r tool.CommandRunner) BashOption`
- `func WithWorkspaceCoordinator(coord tool.WorkspaceCoordinator) BashOption`
- `func WithFamilyCatalog(eligible permission.FamilyEligibility) BashOption`
- `func WithObservations(obs tool.WorkspaceObservations) BashOption`
- `func NewBash(root string, opts ...BashOption) *BashTool`
- `func NewFactory(options ...BashOption) (Factory, error)`
- `func NewSupervisedFactory(options ...BashOption) (SupervisedFactory, error)`

### Methods {#methods}

- `func (noPermit) Release()`
- `func (b *BashTool) Info(context.Context) (*tool.ToolInfo, error)`
- `func (b *BashTool) AuditSummary(argsJSON string) string`
- `func (b *BashTool) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error)`
- `func (c *cappedBuffer) Write(p []byte) (int, error)`
- `func (e *bashPrepareError) Error() string`
- `func (b *BashTool) PrepareCall(_ context.Context, executionID uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error)`
- `func (l leaseFromPermit) Release() error`

### Types {#types}

`BashTool`, `BashOption`, `Factory`, `SupervisedFactory`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [bash/bash.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/bash/bash.go)
- [bash/prepare.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/bash/prepare.go)
- [bash/result.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/bash/result.go)
- [bash/supervised.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/bash/supervised.go)

Adjacent tests at the same commit:

- [bash/bash_grants_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/bash/bash_grants_test.go)
- [bash/bash_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/bash/bash_test.go)
- [bash/integration_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/bash/integration_test.go)
- [bash/preparecall_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/bash/preparecall_test.go)
- [bash/result_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/bash/result_test.go)
- [bash/runner_injection_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/bash/runner_injection_test.go)
- [bash/supervised_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/bash/supervised_test.go)
- [bash/supervision_args_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/bash/supervision_args_test.go)

Run `GOWORK=off go test ./...` from the `tools` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
