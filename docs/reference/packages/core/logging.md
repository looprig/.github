---
id: reference/packages/core/logging
title: logging package · logging
description: Reference for the logging package at github.com/looprig/core/logging, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 3
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
proofs:
  package-role: release-github-com-looprig-core
  exported-surface: release-github-com-looprig-core
  functions-and-methods: release-github-com-looprig-core
  types: release-github-com-looprig-core
  constants-and-variables: release-github-com-looprig-core
  ownership-and-errors: release-github-com-looprig-core
  source-and-runnable-proof: release-github-com-looprig-core
---

# logging package · logging

Import path: `github.com/looprig/core/logging`. Package logging builds the application's structured logger on top of the standard library's log/slog. The composition root constructs a *slog.Logger with New and injects it into the components that need it (dependency inversion: there is no package-level logge

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.5.1; pin that version in consumers and do not publish local workspace replacements.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Error`, `New`, `ParseLevel`

### Types {#types}

`Config`, `LevelError`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The logging package exposes `New`, `ParseLevel` as its main operations. Use `New` as the package construction entry point when creating that value. Its exported typed failures include `LevelError`; classify them with errors.Is or errors.As. It does not own network, credential, or storage resources.

## Source and runnable proof {#source-and-runnable-proof}

Read the implementation and adjacent tests in the [core source tree](https://github.com/looprig/core/tree/v0.5.1/logging/). The progressive entries `stage-01-inference` and `stage-02-streaming` exercise the content and streaming contracts; run them with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-core`.
