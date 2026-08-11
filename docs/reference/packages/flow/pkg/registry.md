---
id: reference/packages/flow/pkg/registry
title: registry package · pkg/registry
description: Reference for the registry package at github.com/looprig/flow/pkg/registry, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 53
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

# registry package · pkg/registry

Import path: `github.com/looprig/flow/pkg/registry`. Package registry holds flow and node registrations. md §18.1.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Add`, `Error`, `Keys`, `Manifest`, `Resolve`

### Types {#types}

`DuplicateRegistrationError`, `GraphManifest`, `Registry`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The registry package exposes `Add`, `Keys`, `Manifest`, `Resolve` as its main operations. The principal handle or value is `GraphManifest`; retain it according to its declaration before calling a terminal method. Its exported typed failures include `DuplicateRegistrationError`; classify them with errors.Is or errors.As. Registry and ingress are not tenant isolation or authorization systems.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/flow/tree/v0.3.0/pkg/registry/) and adjacent tests. The progressive manifest entry `stage-17-flow` exercises this area; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-flow`.
