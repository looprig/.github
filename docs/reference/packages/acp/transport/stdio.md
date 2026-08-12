---
id: reference/packages/acp/transport/stdio
title: transport/stdio package · stdio
description: Reference for supervised ACP child processes over stdin and stdout.
audience: developer
section: reference
order: 194
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-acp
  exported-surface: release-github-com-looprig-acp
  functions: release-github-com-looprig-acp
  methods: release-github-com-looprig-acp
  types: release-github-com-looprig-acp
  constants: release-github-com-looprig-acp
  variables: release-github-com-looprig-acp
  ownership-and-errors: release-github-com-looprig-acp
  source-and-runnable-proof: release-github-com-looprig-acp
---

# transport/stdio package · stdio

Import path: `github.com/looprig/acp/transport/stdio`. The source is pinned to github.com/looprig/acp@v0.2.2.

## Package role {#package-role}

`Spawn` starts a validated `Command`, connects stdin/stdout to ACP, groups the child for teardown, and reaps it exactly once. `Serve` wires an agent process's own streams to a caller-created protocol connection.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Serve(ctx context.Context, r io.Reader, w io.Writer, conn *protocol.Conn) error`
- `func Spawn(ctx context.Context, cmd Command) (*Proc, error)`

### Methods {#methods}

- `func (e *CommandError) Error() string`
- `func (e *PlatformError) Error() string`
- `func (e *ExitError) Error() string`
- `func (e *ExitError) Unwrap() error`
- `func (p *Proc) Wait() error`
- `func (p *Proc) Signal(sig os.Signal) error`
- `func (p *Proc) Kill() error`
- `func (r *stderrRing) Write(p []byte) (int, error)`
- `func (r *stderrRing) Bytes() []byte`

### Types {#types}

`Command`, `CommandError`, `PlatformError`, `ExitError`, `Proc`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `CommandError`, `PlatformError`, `ExitError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [transport/stdio/doc.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/doc.go)
- [transport/stdio/process_darwin.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/process_darwin.go)
- [transport/stdio/process_linux.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/process_linux.go)
- [transport/stdio/process_linux_pidfd_generic.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/process_linux_pidfd_generic.go)
- [transport/stdio/process_linux_pidfd_legacy32.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/process_linux_pidfd_legacy32.go)
- [transport/stdio/process_linux_pidfd_legacy64.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/process_linux_pidfd_legacy64.go)
- [transport/stdio/process_unix.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/process_unix.go)
- [transport/stdio/process_unsupported.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/process_unsupported.go)
- [transport/stdio/serve.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/serve.go)
- [transport/stdio/spawn.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/spawn.go)
- [transport/stdio/stderr_ring.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/stderr_ring.go)

Adjacent tests at the same commit:

- [transport/stdio/spawn_integration_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/spawn_integration_test.go)
- [transport/stdio/spawn_unsupported_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/spawn_unsupported_test.go)
- [transport/stdio/stdio_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/transport/stdio/stdio_test.go)

Run `GOWORK=off go test ./...` from the `acp` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
