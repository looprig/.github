---
id: reference/packages/tools/grep
title: grep package · grep
description: Reference for bounded recursive text search with direct argv execution.
audience: developer
section: reference
order: 166
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

# grep package · grep

Import path: `github.com/looprig/tools/grep`. The source is pinned to github.com/looprig/tools@v0.10.0.

## Package role {#package-role}

`NewGrep` binds a root, read guard, and optional argv runner. `WithHostReads` changes the read boundary; `WithArgvRunner` injects a deterministic runner for tests or an approved rg binary.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithArgvRunner(r tool.ArgvRunner) GrepOption`
- `func WithHostReads() GrepOption`
- `func NewGrep(root string, guard loop.ReadGuard, opts ...GrepOption) *Grep`

### Methods {#methods}

- `func (g *Grep) Info(context.Context) (*tool.ToolInfo, error)`
- `func (g *Grep) AuditSummary(argsJSON string) string`
- `func (g *Grep) PrepareCall(_ context.Context, executionID uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error)`
- `func (g *Grep) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error)`

### Types {#types}

```go
type Grep struct {
	// contains filtered or unexported fields
}
```

```go
type GrepOption func(*Grep)
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [grep/grep.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/grep/grep.go)

Adjacent tests at the same commit:

- [grep/grep_hostreads_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/grep/grep_hostreads_test.go)
- [grep/grep_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/grep/grep_test.go)
- [grep/preparecall_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/grep/preparecall_test.go)
- [grep/readtools_test_helpers_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/grep/readtools_test_helpers_test.go)
- [grep/runner_injection_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/grep/runner_injection_test.go)

Run `GOWORK=off go test ./...` from the `tools` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
