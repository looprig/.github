---
id: reference/packages/sandbox/pkg/sandboxtest
title: sandboxtest package · pkg/sandboxtest
description: Reference for the sandboxtest package at github.com/looprig/sandbox/pkg/sandboxtest, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 83
publication: released
examples:
  - stage-11-sandbox-process
proofs:
  package-role: release-github-com-looprig-sandbox
  exported-surface: release-github-com-looprig-sandbox
  functions: release-github-com-looprig-sandbox
  methods: release-github-com-looprig-sandbox
  types: release-github-com-looprig-sandbox
  constants: release-github-com-looprig-sandbox
  variables: release-github-com-looprig-sandbox
  ownership-and-errors: release-github-com-looprig-sandbox
  source-and-runnable-proof: release-github-com-looprig-sandbox
---

# sandboxtest package · pkg/sandboxtest

Import path: `github.com/looprig/sandbox/pkg/sandboxtest`. The source is pinned to github.com/looprig/sandbox@v0.8.1.

## Package role {#package-role}

Package sandboxtest is a reusable conformance suite for sandbox executors, modelled on the storekit `storetest` pattern: a consumer supplies a factory that builds an executor, and RunSuite asserts the core sandbox invariants hold against it.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func CheckClaimedImplications(t *testing.T, sut SUT, probes ImplicationProbes)`
- `func RequireLiveGate(t testing.TB, gate LiveGate)`
- `func RunSuite(t *testing.T, name string, newSUT Factory)`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type SUT interface {
	// RunCommand runs a shell command string in dir under the executor's policy
	// and returns combined output, the process exit code, and an error that is
	// non-nil only when the process did not complete normally (spawn/setup
	// failure, signal, or context cancellation), a ran-but-nonzero command
	// returns a nil error and the real code.
	RunCommand(ctx context.Context, dir, command string) ([]byte, int, error)
	// Level reports the achieved isolation level (LevelNone..LevelFull).
	Level() uint8
	// GuaranteeBits reports the per-property guarantee bitmask.
	GuaranteeBits() uint64
}
```

```go
type ArgvSUT interface {
	RunArgv(ctx context.Context, dir string, argv []string) ([]byte, int, error)
}
```

```go
type ImplicationResult struct {
	PositiveControl bool
	GuaranteeHeld   bool
	Detail          string
}
```

```go
type ImplicationProbe func(context.Context, SUT) (ImplicationResult, error)
```

```go
type ImplicationProbes struct {
	Read           ImplicationProbe
	Process        ImplicationProbe
	Network        ImplicationProbe
	AddressNetwork ImplicationProbe
	TargetNetwork  ImplicationProbe
	Resource       ImplicationProbe
}
```

```go
type Factory func(t *testing.T, workspace string) SUT
```

```go
type LiveGate struct {
	OptInEnv    string
	Description string
	Supported   func() (bool, string)
	Evidence    func() (bool, string)
}
```

### Constants {#constants}

`GuaranteeProcessBoundary`, `GuaranteeWriteBoundary`, `GuaranteeReadBoundary`, `GuaranteeEnvScrub`, `GuaranteeNetworkBoundary`, `GuaranteeAddressNetwork`, `GuaranteeResourceLimits`, `GuaranteeTargetNetwork`, `LevelNone`, `LevelDegraded`, `LevelFull`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/sandboxtest/sandboxtest.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/sandboxtest/sandboxtest.go)
- [pkg/sandboxtest/shell_unix.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/sandboxtest/shell_unix.go)
- [pkg/sandboxtest/shell_windows.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/sandboxtest/shell_windows.go)

Adjacent tests at the same commit:

- [pkg/sandboxtest/fixture_windows_test.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/sandboxtest/fixture_windows_test.go)
- [pkg/sandboxtest/live_platform_other_test.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/sandboxtest/live_platform_other_test.go)
- [pkg/sandboxtest/live_platform_windows_test.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/sandboxtest/live_platform_windows_test.go)
- [pkg/sandboxtest/sandboxtest_test.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/sandboxtest/sandboxtest_test.go)
- [pkg/sandboxtest/shell_windows_test.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/sandboxtest/shell_windows_test.go)

Run `go test ./...` from a checkout of the `sandbox` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
