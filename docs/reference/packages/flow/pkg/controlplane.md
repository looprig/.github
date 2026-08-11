---
id: reference/packages/flow/pkg/controlplane
title: controlplane package · pkg/controlplane
description: Reference for the controlplane package at github.com/looprig/flow/pkg/controlplane, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 50
publication: released
examples:
  - stage-17-flow
proofs:
  package-role: release-github-com-looprig-flow
  exported-surface: release-github-com-looprig-flow
  functions-and-methods: release-github-com-looprig-flow
  types: release-github-com-looprig-flow
  constants-and-variables: release-github-com-looprig-flow
  ownership-and-errors: release-github-com-looprig-flow
  source-and-runnable-proof: release-github-com-looprig-flow
---

# controlplane package · pkg/controlplane

Import path: `github.com/looprig/flow/pkg/controlplane`. Package controlplane coordinates flow execution. md §18.5.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Close`, `Consume`, `Error`, `Submit`

### Types {#types}

`ClosedError`, `MemControlPlane`, `MemOption`

### Constants and variables {#constants-and-variables}

`DefaultNackBackoff`

## Ownership and errors {#ownership-and-errors}

The controlplane package exposes `Close`, `Consume`, `Submit` as its main operations. Its exported typed failures include `ClosedError`; classify them with errors.Is or errors.As. Registry and ingress are not tenant isolation or authorization systems.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/flow/tree/v0.3.0/pkg/controlplane/) and adjacent tests. The progressive manifest entry `stage-17-flow` exercises this area; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-flow`.
