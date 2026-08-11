---
id: reference/packages/flow/pkg/ingress
title: ingress package · pkg/ingress
description: Reference for the ingress package at github.com/looprig/flow/pkg/ingress, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 52
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

# ingress package · pkg/ingress

Import path: `github.com/looprig/flow/pkg/ingress`. Package ingress accepts inbound flow requests. md §18.3. Authorization model - NO cross-run tenancy. The ingress has NO notion of run ownership or tenant isolation: any caller that passes WithAuth (or any caller at all, when no authenticator is configured) may

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`New`, `Server`

### Types {#types}

`Option`, `ServerOption`

### Constants and variables {#constants-and-variables}

`DefaultMaxBodyBytes`

## Ownership and errors {#ownership-and-errors}

The ingress package exposes `New`, `Server` as its main operations. The principal handle or value is `ServerOption`; retain it according to its declaration before calling a terminal method. Use `New` as the package construction entry point when creating that value. No package-specific error type is exported here; use the owning contract or helper return error rather than parsing diagnostic text. Registry and ingress are not tenant isolation or authorization systems.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/flow/tree/v0.3.0/pkg/ingress/) and adjacent tests. The progressive manifest entry `stage-17-flow` exercises this area; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-flow`.
