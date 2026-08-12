---
id: reference/packages/tools/readfile
title: readfile package · readfile
description: Reference for bounded workspace file reads.
audience: developer
section: reference
order: 169
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

# readfile package · readfile

Import path: `github.com/looprig/tools/readfile`. The source is pinned to github.com/looprig/tools@v0.10.1.

## Package role {#package-role}

Package readfile implements the ReadFile tool: a workspace-contained, denied-path-aware, symlink-rejecting file reader returning line-numbered text capped by the injected ReadGuard.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithHostReads() ReadFileOption`
- `func NewReadFile(root string, guard loop.ReadGuard, obs tool.WorkspaceObservations, opts ...ReadFileOption) *ReadFile`

### Methods {#methods}

- `func (r *ReadFile) Info(context.Context) (*tool.ToolInfo, error)`
- `func (r *ReadFile) AuditSummary(argsJSON string) string`
- `func (r *ReadFile) PrepareCall(_ context.Context, executionID uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error)`
- `func (r *ReadFile) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error)`

### Types {#types}

```go
type ReadFile struct {
	// contains filtered or unexported fields
}
```

```go
type ReadFileOption func(*ReadFile)
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

- [readfile/readfile.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/readfile/readfile.go)

Adjacent tests at the same commit:

- [readfile/preparecall_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/readfile/preparecall_test.go)
- [readfile/readfile_hostreads_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/readfile/readfile_hostreads_test.go)
- [readfile/readfile_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/readfile/readfile_test.go)
- [readfile/readtools_test_helpers_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/readfile/readtools_test_helpers_test.go)

Run `go test ./...` from a checkout of the `tools` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
