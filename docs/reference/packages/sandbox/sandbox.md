---
id: reference/packages/sandbox/sandbox
title: sandbox package · sandbox
description: Reference for the sandbox package at github.com/looprig/sandbox, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 80
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

# sandbox package · sandbox

Import path: `github.com/looprig/sandbox`. The source is pinned to github.com/looprig/sandbox@v0.8.1.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Sandbox `v0.8.1` separates profile construction and achieved guarantees from executor and network details. It does not decide whether a tool call is allowed; it enforces the authority the caller has already chosen.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Init()`
- `func Init()`
- `func NewProfile(config ProfileConfig) (*Profile, error)`
- `func Restrict(base, ceiling *Profile) (*Profile, error)`
- `func ParseNetworkTarget(raw string) (NetworkTarget, error)`
- `func NewDirectEgressRoute() (EgressRoute, error)`
- `func NewUpstreamEgressRoute(rawURL string, trustedAddressGuarantee bool) (EgressRoute, error)`
- `func NewEgressRouteResolver(routes []EgressRoute, selector func(context.Context, NetworkTarget) string) (*EgressRouteResolver, error)`
- `func InspectWindowsSandbox(ctx context.Context, config WindowsSetupConfig) (WindowsSetupStatus, error)`
- `func SetupWindowsSandbox(ctx context.Context, config WindowsSetupConfig) error`
- `func RemoveWindowsSandbox(ctx context.Context, config WindowsSetupConfig) error`
- `func NewExecutorSet(p *Profile, options ...ExecutorSetOption) (*ExecutorSet, error)`
- `func WithScratchRoot(path string) ExecutorSetOption`
- `func WithMaxExecutors(max int) ExecutorSetOption`
- `func WithGrantTTL(duration time.Duration) ExecutorSetOption`
- `func WithEgressRoute(route EgressRoute) ExecutorSetOption`
- `func WithWindowsSandboxMode(mode WindowsSandboxMode) ExecutorSetOption`
- `func WithWindowsSandboxStateRoot(path string) ExecutorSetOption`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type Access = profile.Access
```

```go
type Home = profile.Home
```

```go
type Isolation = profile.Isolation
```

```go
type RootAccess = profile.RootAccess
```

```go
type ProfileConfig = profile.ProfileConfig
```

```go
type Profile = profile.Profile
```

```go
type ReportEntry = profile.ReportEntry
```

```go
type CompileReport = profile.CompileReport
```

```go
type Guarantees = profile.Guarantees
```

```go
type NetworkTarget = network.Target
```

```go
type EgressRoute = network.Route
```

```go
type EgressRouteResolver = network.RouteResolver
```

```go
type NetworkTargetDeniedError = network.TargetDeniedError
```

```go
type WindowsSandboxMode = windows.SandboxMode
```

```go
type WindowsSetupConfig = windows.SetupConfig
```

```go
type WindowsSetupProblemCode = windows.WindowsSetupProblemCode
```

```go
type WindowsSetupProblem = windows.SetupProblem
```

```go
type WindowsSetupStatus = windows.SetupStatus
```

```go
type Executor = exec.Executor
```

```go
type ExecutorSet = exec.ExecutorSet
```

```go
type ExecutorSetOption = exec.ExecutorSetOption
```

```go
type ProcessOptions = exec.ProcessOptions
```

```go
type PreparedProcess = exec.PreparedProcess
```

```go
type Process = exec.Process
```

```go
type ProcessResult = exec.ProcessResult
```

```go
type ProcessAccess = exec.ProcessAccess
```

```go
type ProcessAccessKind = exec.ProcessAccessKind
```

```go
type ProcessActivity = exec.ProcessActivity
```

```go
type ProcessActivityKind = exec.ProcessActivityKind
```

```go
type ProcessStreamMode = exec.ProcessStreamMode
```

```go
type ProcessSignal = exec.ProcessSignal
```

```go
type LifetimeContainment = exec.LifetimeContainment
```

### Constants {#constants}

`Deny`, `Gated`, `Allow`, `IsolatedHome`, `RealHome`, `Sandboxed`, `Unconfined`, `LevelNone`, `LevelDegraded`, `LevelFull`, `GuaranteeProcessBoundary`, `GuaranteeWriteBoundary`, `GuaranteeReadBoundary`, `GuaranteeEnvScrub`, `GuaranteeNetworkBoundary`, `GuaranteeAddressNetwork`, `GuaranteeResourceLimits`, `GuaranteeTargetNetwork`, `WindowsAuto`, `WindowsRestrictedToken`, `WindowsElevated`, `WindowsSetupProblemUnknown`, `WindowsSetupProblemManifestMissing`, `WindowsSetupProblemOwnerMismatch`, `WindowsSetupProblemHostBinaryStale`, `WindowsSetupProblemServiceUnavailable`, `WindowsSetupProblemAccountMissing`, `WindowsSetupProblemCredentialUnavailable`, `WindowsSetupProblemFirewallOverridden`, `WindowsSetupProblemFirewallRuleChanged`, `WindowsSetupProblemPortInUse`, `WindowsSetupProblemRuntimeBaselineGap`, `WindowsSetupProblemLeaseRecoveryPending`, `WindowsSetupProblemProtocolMismatch`, `GrantClassCommandStart`, `GrantClassNetworkProxyTarget`, `GrantClassNetworkBroad`, `GrantClassFilesystemPathRead`, `GrantClassFilesystemTreeRead`, `GrantClassFilesystemHostRead`, `GrantClassFilesystemPathWrite`, `GrantClassFilesystemTreeWrite`, `GrantClassFilesystemHostWrite`, `ProcessAccessReadOnly`, `ProcessAccessScopedWrite`, `ProcessAccessBroadWrite`, `ProcessActivityWrite`, `ProcessActivityBroadWrite`, `ProcessStreamModePipes`, `ProcessStreamModePTY`, `ProcessSignalInterrupt`, `ProcessSignalTerminate`, `ProcessSignalKill`, `LifetimeContainmentUnspecified`, `LifetimeContainmentEnforced`, `LifetimeContainmentBestEffort`

### Variables {#variables}

`ErrInvalidProfile`, `ErrEgressRouteDenied`, `ErrNetworkTargetDenied`, `ErrSandboxUnavailable`, `ErrWindowsSetupRequired`, `ErrWindowsSetupStale`, `ErrWindowsElevationRequired`, `ErrOutputLimit`, `ErrExecutorLimit`, `ErrExecutorSetClosed`, `ErrExecutorClosed`, `ErrGrantMalformed`, `ErrGrantBadMAC`, `ErrGrantExpired`, `ErrGrantWrongCommand`, `ErrGrantWrongExecution`, `ErrGrantWrongWorkingDirectory`, `ErrGrantProfileMismatch`, `ErrGrantGuaranteeMismatch`, `ErrGrantRouteMismatch`, `ErrGrantTargetChanged`, `ErrGrantReplay`, `ErrGrantRequired`, `ErrGrantDenied`, `ErrGrantUnsupported`, `ErrProcessClosed`, `ErrProcessAlreadyStarted`, `ErrProcessTTYUnsupported`, `ErrProcessConPTYUnavailable`, `ErrProcessStdinClosed`, `ErrLifetimeContainmentUnavailable`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [doc.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/doc.go)
- [init_linux.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/init_linux.go)
- [init_other.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/init_other.go)
- [sandbox.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/sandbox.go)

Adjacent tests at the same commit:

- [executor_set_external_test.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/executor_set_external_test.go)
- [facade_test.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/facade_test.go)
- [reexec_main_test.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/reexec_main_test.go)

Run `GOWORK=off go test ./...` from the `sandbox` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
