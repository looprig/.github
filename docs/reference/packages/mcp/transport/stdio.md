---
id: reference/packages/mcp/transport/stdio
title: transport/stdio package · stdio
description: Reference for supervised MCP child processes over stdio.
audience: developer
section: reference
order: 216
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  package-role: release-github-com-looprig-mcp
  exported-surface: release-github-com-looprig-mcp
  functions: release-github-com-looprig-mcp
  methods: release-github-com-looprig-mcp
  types: release-github-com-looprig-mcp
  constants: release-github-com-looprig-mcp
  variables: release-github-com-looprig-mcp
  ownership-and-errors: release-github-com-looprig-mcp
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# transport/stdio package · stdio

Import path: `github.com/looprig/mcp/pkg/transport/stdio`. The source is pinned to github.com/looprig/mcp@v0.6.2.

## Package role {#package-role}

`New` returns a transport factory that owns process grouping, environment allowlists, bounded stderr, graceful close, termination, and reaping. It intentionally does not use the SDK command transport because the caller needs a confinement seam.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(cfg Config) (client.TransportFactory, error)`

### Methods {#methods}

- `func (s ExitStatus) String() string`

### Types {#types}

```go
type ProcessSpec struct {
	Path string

	Args []string

	Dir string

	Env []string

	Stdin  *os.File
	Stdout *os.File
	Stderr *os.File
}
```

```go
type ExitStatus struct {
	Code int

	Signal string
}
```

```go
type Process interface {
	Pid() int

	Terminate() error

	Kill() error

	Wait() (ExitStatus, error)
}
```

```go
type ProcessLauncher interface {
	Start(ctx context.Context, spec ProcessSpec) (Process, error)
}
```

```go
type Var struct {
	Name string

	Value string
}
```

```go
type EnvAllowlist struct {
	Vars []Var

	PassThrough []string
}
```

```go
type Config struct {
	Command string

	Args []string

	Dir string

	Env EnvAllowlist

	Launcher ProcessLauncher

	StderrLimit int
}
```

### Constants {#constants}

`DefaultStderrLimit`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/transport/stdio/process.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/stdio/process.go)
- [pkg/transport/stdio/process_other.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/stdio/process_other.go)
- [pkg/transport/stdio/process_unix.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/stdio/process_unix.go)
- [pkg/transport/stdio/stderr.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/stdio/stderr.go)
- [pkg/transport/stdio/stdio.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/stdio/stdio.go)

Adjacent tests at the same commit:

- [pkg/transport/stdio/stderr_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/stdio/stderr_test.go)
- [pkg/transport/stdio/stdio_integration_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/stdio/stdio_integration_test.go)
- [pkg/transport/stdio/stdio_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/transport/stdio/stdio_test.go)

Run `GOWORK=off go test ./...` from the `mcp` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
