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
  functions-and-methods: release-github-com-looprig-sandbox
  types: release-github-com-looprig-sandbox
  constants-and-variables: release-github-com-looprig-sandbox
  ownership-and-errors: release-github-com-looprig-sandbox
  source-and-runnable-proof: release-github-com-looprig-sandbox
---

# sandbox package · sandbox

Import path: `github.com/looprig/sandbox`. Package sandbox provides standalone OS-level confinement for command execution under immutable, consumer-defined access profiles. Harness's permission gates answer "may this tool call run?". This module answers "what can it touch once it runs?". The two compos

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Sandbox `v0.8.1` separates profile construction and achieved guarantees from executor and network details. It does not decide whether a tool call is allowed; it enforces the authority the caller has already chosen.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Init`, `RemoveWindowsSandbox`, `SetupWindowsSandbox`

### Types {#types}

`Access`, `CompileReport`, `EgressRoute`, `EgressRouteResolver`, `Executor`, `ExecutorSet`, `ExecutorSetOption`, `Guarantees`, `Home`, `Isolation`, `LifetimeContainment`, `NetworkTarget`, `NetworkTargetDeniedError`, `PreparedProcess`, `Process`, `ProcessAccess`, `ProcessAccessKind`, `ProcessActivity`, `ProcessActivityKind`, `ProcessOptions`, `ProcessResult`, `ProcessSignal`, `ProcessStreamMode`, `Profile`, `ProfileConfig`, `ReportEntry`, `RootAccess`, `WindowsSandboxMode`, `WindowsSetupConfig`, `WindowsSetupProblem`, `WindowsSetupProblemCode`, `WindowsSetupStatus`

### Constants and variables {#constants-and-variables}

`Allow`, `Deny`, `Gated`, `GrantClassCommandStart`, `GrantClassFilesystemHostRead`, `GrantClassFilesystemHostWrite`, `GrantClassFilesystemPathRead`, `GrantClassFilesystemPathWrite`, `GrantClassFilesystemTreeRead`, `GrantClassFilesystemTreeWrite`, `GrantClassNetworkBroad`, `GrantClassNetworkProxyTarget`, `GuaranteeAddressNetwork`, `GuaranteeEnvScrub`, `GuaranteeNetworkBoundary`, `GuaranteeProcessBoundary`, `GuaranteeReadBoundary`, `GuaranteeResourceLimits`, `GuaranteeTargetNetwork`, `GuaranteeWriteBoundary`, `IsolatedHome`, `LevelDegraded`, `LevelFull`, `LevelNone`, `LifetimeContainmentBestEffort`, `LifetimeContainmentEnforced`, `LifetimeContainmentUnspecified`, `ProcessAccessBroadWrite`, `ProcessAccessReadOnly`, `ProcessAccessScopedWrite`, `ProcessActivityBroadWrite`, `ProcessActivityWrite`, `ProcessSignalInterrupt`, `ProcessSignalKill`, `ProcessSignalTerminate`, `ProcessStreamModePTY`, `ProcessStreamModePipes`, `RealHome`, `Sandboxed`, `Unconfined`, `WindowsAuto`, `WindowsElevated`, `WindowsRestrictedToken`, `WindowsSetupProblemAccountMissing`, `WindowsSetupProblemCredentialUnavailable`, `WindowsSetupProblemFirewallOverridden`, `WindowsSetupProblemFirewallRuleChanged`, `WindowsSetupProblemHostBinaryStale`, `WindowsSetupProblemLeaseRecoveryPending`, `WindowsSetupProblemManifestMissing`, `WindowsSetupProblemOwnerMismatch`, `WindowsSetupProblemPortInUse`, `WindowsSetupProblemProtocolMismatch`, `WindowsSetupProblemRuntimeBaselineGap`, `WindowsSetupProblemServiceUnavailable`, `WindowsSetupProblemUnknown`, `ErrEgressRouteDenied`, `ErrExecutorClosed`, `ErrExecutorLimit`, `ErrExecutorSetClosed`, `ErrGrantBadMAC`, `ErrGrantDenied`, `ErrGrantExpired`, `ErrGrantGuaranteeMismatch`, `ErrGrantMalformed`, `ErrGrantProfileMismatch`, `ErrGrantReplay`, `ErrGrantRequired`, `ErrGrantRouteMismatch`, `ErrGrantTargetChanged`, `ErrGrantUnsupported`, `ErrGrantWrongCommand`, `ErrGrantWrongExecution`, `ErrGrantWrongWorkingDirectory`, `ErrInvalidProfile`, `ErrLifetimeContainmentUnavailable`, `ErrNetworkTargetDenied`, `ErrOutputLimit`, `ErrProcessAlreadyStarted`, `ErrProcessClosed`, `ErrProcessConPTYUnavailable`, `ErrProcessStdinClosed`, `ErrProcessTTYUnsupported`, `ErrSandboxUnavailable`, `ErrWindowsElevationRequired`, `ErrWindowsSetupRequired`, `ErrWindowsSetupStale`

## Ownership and errors {#ownership-and-errors}

The sandbox package exposes `Init`, `RemoveWindowsSandbox`, `SetupWindowsSandbox` as its main operations. The principal handle or value is `Profile`; retain it according to its declaration before calling a terminal method. Use `Init` as the package construction entry point when creating that value. Its exported typed failures include `NetworkTargetDeniedError`, `GuaranteeResourceLimits`, `WindowsSetupProblemCredentialUnavailable`, `WindowsSetupProblemServiceUnavailable`; classify them with errors.Is or errors.As. A requested sandbox guarantee is not silently replaced by an unconfined fallback.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/sandbox/tree/v0.8.1/) and adjacent tests. Progressive entry `stage-11-sandbox-process` constructs a profile, runs a confined `echo` command, and asserts a non-none enforcement level; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-sandbox`.
