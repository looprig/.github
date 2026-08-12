---
id: reference/packages/foreignloops/driver/codex
title: driver/codex package · codex
description: Reference for the Codex CLI foreign-agent driver and explicit sandbox/approval posture.
audience: developer
section: reference
order: 204
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-foreignloops
  exported-surface: release-github-com-looprig-foreignloops
  functions-and-methods: release-github-com-looprig-foreignloops
  types: release-github-com-looprig-foreignloops
  constants-and-variables: release-github-com-looprig-foreignloops
  ownership-and-errors: release-github-com-looprig-foreignloops
  source-and-runnable-proof: release-github-com-looprig-foreignloops
---

# driver/codex package · codex

Import path: `github.com/looprig/foreignloops/driver/codex`. The source is pinned to github.com/looprig/foreignloops@v0.2.3.

## Package role {#package-role}

`NewAgent` validates executable, approval policy, sandbox mode, and environment configuration. Per-turn prompt, cwd, and session selection remain owned by `driver.Turn`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewAgent(parentEnv []string, cfg Config) (driver.Agent, error)`

### Methods {#methods}

- `func (a *agent) Spawn(ctx context.Context, turn driver.Turn) (driver.Stream, error)`
- `func (s *stream) Events() <-chan driver.Event`
- `func (s *stream) History() (driver.History, error)`
- `func (s *stream) Close() error`
- `func (e *ConfigError) Error() string`
- `func (e *SpawnConfigError) Error() string`
- `func (e *PlatformError) Error() string`

### Types {#types}

`SandboxMode`, `ApprovalPolicy`, `Config`, `ConfigError`, `SpawnConfigError`, `PlatformError`

### Constants {#constants}

`SandboxReadOnly`, `SandboxWorkspaceWrite`, `SandboxDangerFullAccess`, `ApprovalUntrusted`, `ApprovalOnRequest`, `ApprovalNever`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ConfigError`, `SpawnConfigError`, `PlatformError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [driver/codex/args.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/args.go)
- [driver/codex/codex.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/codex.go)
- [driver/codex/config.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/config.go)
- [driver/codex/decode.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/decode.go)
- [driver/codex/doc.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/doc.go)
- [driver/codex/env.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/env.go)
- [driver/codex/process_darwin.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/process_darwin.go)
- [driver/codex/process_linux.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/process_linux.go)
- [driver/codex/process_linux_pidfd_generic.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/process_linux_pidfd_generic.go)
- [driver/codex/process_linux_pidfd_legacy32.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/process_linux_pidfd_legacy32.go)
- [driver/codex/process_linux_pidfd_legacy64.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/process_linux_pidfd_legacy64.go)
- [driver/codex/process_unix.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/process_unix.go)
- [driver/codex/process_unsupported.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/process_unsupported.go)
- [driver/codex/session.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/session.go)

Adjacent tests at the same commit:

- [driver/codex/args_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/args_test.go)
- [driver/codex/codex_integration_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/codex_integration_test.go)
- [driver/codex/codex_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/codex_test.go)
- [driver/codex/codex_unix_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/codex_unix_test.go)
- [driver/codex/codex_unsupported_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/codex_unsupported_test.go)
- [driver/codex/config_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/config_test.go)
- [driver/codex/decode_fuzz_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/decode_fuzz_test.go)
- [driver/codex/decode_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/decode_test.go)
- [driver/codex/deps_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/deps_test.go)
- [driver/codex/env_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/codex/env_test.go)

Run `GOWORK=off go test ./...` from the `foreignloops` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
