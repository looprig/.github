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
  functions-and-methods: release-github-com-looprig-sandbox
  types: release-github-com-looprig-sandbox
  constants-and-variables: release-github-com-looprig-sandbox
  ownership-and-errors: release-github-com-looprig-sandbox
  source-and-runnable-proof: release-github-com-looprig-sandbox
---

# sandboxtest package · pkg/sandboxtest

Import path: `github.com/looprig/sandbox/pkg/sandboxtest`. Package sandboxtest is a reusable conformance suite for sandbox executors, modelled on the storekit `storetest` pattern: a consumer supplies a factory that builds an executor, and RunSuite asserts the core sandbox invariants hold against it. It is the executor

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Sandbox `v0.8.1` separates profile construction and achieved guarantees from executor and network details. It does not decide whether a tool call is allowed; it enforces the authority the caller has already chosen.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`CheckClaimedImplications`, `RequireLiveGate`, `RunSuite`

### Types {#types}

`ArgvSUT`, `Factory`, `ImplicationProbe`, `ImplicationProbes`, `ImplicationResult`, `LiveGate`, `SUT`

### Constants and variables {#constants-and-variables}

`GuaranteeProcessBoundary`, `LevelNone`

## Ownership and errors {#ownership-and-errors}

The sandboxtest package exposes `CheckClaimedImplications`, `RequireLiveGate`, `RunSuite` as its main operations. Use `RunSuite` as the package construction entry point when creating that value. No package-specific error type is exported here; use the owning contract or helper return error rather than parsing diagnostic text. A requested sandbox guarantee is not silently replaced by an unconfined fallback.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/sandbox/tree/v0.8.1/pkg/sandboxtest/) and adjacent tests. Progressive entry `stage-11-sandbox-process` constructs a profile, runs a confined `echo` command, and asserts a non-none enforcement level; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-sandbox`.
