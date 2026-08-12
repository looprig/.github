---
id: reference/packages/tools/glob
title: glob package · glob
description: Reference for bounded workspace globbing.
audience: developer
section: reference
order: 165
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

# glob package · glob

Import path: `github.com/looprig/tools/glob`. The source is pinned to github.com/looprig/tools@v0.10.1.

## Package role {#package-role}

Package glob implements the Glob tool: a workspace-contained, denied-path-excluding filename search over WalkDir-discovered entries.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithHostReads() GlobOption`
- `func NewGlob(root string, guard loop.ReadGuard, opts ...GlobOption) *Glob`

### Methods {#methods}

- `func (g *Glob) Info(context.Context) (*tool.ToolInfo, error)`
- `func (g *Glob) AuditSummary(argsJSON string) string`
- `func (g *Glob) PrepareCall(_ context.Context, executionID uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error)`
- `func (g *Glob) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error)`

### Types {#types}

```go
type Glob struct {
	// contains filtered or unexported fields
}
```

```go
type GlobOption func(*Glob)
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

- [glob/glob.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/glob/glob.go)

Adjacent tests at the same commit:

- [glob/glob_hostreads_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/glob/glob_hostreads_test.go)
- [glob/glob_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/glob/glob_test.go)
- [glob/preparecall_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/glob/preparecall_test.go)
- [glob/readtools_test_helpers_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/glob/readtools_test_helpers_test.go)

Run `go test ./...` from a checkout of the `tools` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
