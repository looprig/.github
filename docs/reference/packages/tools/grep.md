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

Import path: `github.com/looprig/tools/grep`. The source is pinned to github.com/looprig/tools@v0.10.1.

## Package role {#package-role}

Package grep implements the Grep tool: a workspace-contained content search that prefers ripgrep and falls back to a stdlib scan, with two-layer denied-path enforcement.

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

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [grep/grep.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/grep/grep.go)

Adjacent tests at the same commit:

- [grep/grep_hostreads_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/grep/grep_hostreads_test.go)
- [grep/grep_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/grep/grep_test.go)
- [grep/preparecall_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/grep/preparecall_test.go)
- [grep/readtools_test_helpers_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/grep/readtools_test_helpers_test.go)
- [grep/runner_injection_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/grep/runner_injection_test.go)

Run `go test ./...` from a checkout of the `tools` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
