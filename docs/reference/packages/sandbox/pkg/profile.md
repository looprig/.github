---
id: reference/packages/sandbox/pkg/profile
title: profile package · pkg/profile
description: Reference for the profile package at github.com/looprig/sandbox/pkg/profile, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 82
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

# profile package · pkg/profile

Import path: `github.com/looprig/sandbox/pkg/profile`. This public package defines one part of the sandbox API.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Sandbox `v0.8.1` separates profile construction and achieved guarantees from executor and network details. It does not decide whether a tool call is allowed; it enforces the authority the caller has already chosen.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`AccessFor`, `AccessVersion`, `Bits`, `CanonicalRoot`, `Fingerprint`, `PathWithin`, `Settings`, `Validate`

### Types {#types}

`Access`, `CompileReport`, `Guarantees`, `Home`, `Isolation`, `Profile`, `ProfileConfig`, `ReportEntry`, `RootAccess`, `Settings`

### Constants and variables {#constants-and-variables}

`GuaranteeProcessBoundary`, `LevelNone`, `ErrInvalidProfile`

## Ownership and errors {#ownership-and-errors}

The profile package exposes `AccessFor`, `AccessVersion`, `Bits`, `CanonicalRoot` as its main operations. The principal handle or value is `Profile`; retain it according to its declaration before calling a terminal method. Its exported typed failures include `ErrInvalidProfile`; classify them with errors.Is or errors.As. A requested sandbox guarantee is not silently replaced by an unconfined fallback.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/sandbox/tree/v0.8.1/pkg/profile/) and adjacent tests. Progressive entry `stage-11-sandbox-process` constructs a profile, runs a confined `echo` command, and asserts a non-none enforcement level; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-sandbox`.
