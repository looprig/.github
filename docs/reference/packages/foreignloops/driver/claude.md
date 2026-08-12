---
id: reference/packages/foreignloops/driver/claude
title: driver/claude package · claude
description: Reference for the Claude CLI foreign-agent driver.
audience: developer
section: reference
order: 203
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-foreignloops
  exported-surface: release-github-com-looprig-foreignloops
  functions: release-github-com-looprig-foreignloops
  methods: release-github-com-looprig-foreignloops
  types: release-github-com-looprig-foreignloops
  constants: release-github-com-looprig-foreignloops
  variables: release-github-com-looprig-foreignloops
  ownership-and-errors: release-github-com-looprig-foreignloops
  source-and-runnable-proof: release-github-com-looprig-foreignloops
---

# driver/claude package · claude

Import path: `github.com/looprig/foreignloops/driver/claude`. The source is pinned to github.com/looprig/foreignloops@v0.2.3.

## Package role {#package-role}

`NewAgent` resolves provider configuration and a parent environment. Per-turn cwd, prompt, posture, and session selection remain in `driver.Turn`; transcript paths stay private to the driver.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewAgent(parentEnv []string, cfg Config) (driver.Agent, error)`

### Methods {#methods}

- `func (e *WrapError) Error() string`
- `func (e *WrapError) Unwrap() error`
- `func (e *ConfigError) Error() string`
- `func (e *SpawnConfigError) Error() string`
- `func (e *PlatformError) Error() string`
- `func (e *PathError) Error() string`

### Types {#types}

```go
type WrapError struct{ Cause error }
```

```go
type CommandWrapper func(*exec.Cmd) (*exec.Cmd, error)
```

```go
type Config struct {
	ExecPath   string
	Home       string
	Model      string
	EnvAllow   []string
	Credential map[string]string
	Wrap       CommandWrapper
}
```

```go
type ConfigError struct{ Field, Reason string }
```

```go
type SpawnConfigError struct{ Field, Reason string }
```

```go
type PlatformError struct{ GOOS string }
```

```go
type PathError struct{ Reason string }
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ConfigError`, `PathError`, `PlatformError`, `SpawnConfigError`, `WrapError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [driver/claude/args.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/args.go)
- [driver/claude/claude.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/claude.go)
- [driver/claude/config.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/config.go)
- [driver/claude/decode_stream.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/decode_stream.go)
- [driver/claude/decode_transcript.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/decode_transcript.go)
- [driver/claude/doc.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/doc.go)
- [driver/claude/env.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/env.go)
- [driver/claude/history.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/history.go)
- [driver/claude/process_darwin.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/process_darwin.go)
- [driver/claude/process_linux.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/process_linux.go)
- [driver/claude/process_linux_pidfd_generic.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/process_linux_pidfd_generic.go)
- [driver/claude/process_linux_pidfd_legacy32.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/process_linux_pidfd_legacy32.go)
- [driver/claude/process_linux_pidfd_legacy64.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/process_linux_pidfd_legacy64.go)
- [driver/claude/process_unix.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/process_unix.go)
- [driver/claude/process_unsupported.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/process_unsupported.go)
- [driver/claude/transcript.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/transcript.go)

Adjacent tests at the same commit:

- [driver/claude/args_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/args_test.go)
- [driver/claude/claude_integration_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/claude_integration_test.go)
- [driver/claude/claude_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/claude_test.go)
- [driver/claude/claude_unix_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/claude_unix_test.go)
- [driver/claude/claude_unsupported_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/claude_unsupported_test.go)
- [driver/claude/config_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/config_test.go)
- [driver/claude/decode_fuzz_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/decode_fuzz_test.go)
- [driver/claude/decode_stream_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/decode_stream_test.go)
- [driver/claude/decode_transcript_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/decode_transcript_test.go)
- [driver/claude/deps_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/deps_test.go)
- [driver/claude/env_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/env_test.go)
- [driver/claude/history_stream_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/history_stream_test.go)
- [driver/claude/transcript_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/transcript_test.go)
- [driver/claude/wrap_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/claude/wrap_test.go)

Run `GOWORK=off go test ./...` from the `foreignloops` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
