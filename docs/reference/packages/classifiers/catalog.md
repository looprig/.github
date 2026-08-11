---
id: reference/packages/classifiers/catalog
title: catalog package · catalog
description: Reference for the optional classifier catalog scaffold.
audience: developer
section: reference
order: 180
publication: released
examples:
  - stage-13-classifier
proofs:
  package-role: release-github-com-looprig-classifiers
  exported-surface: release-github-com-looprig-classifiers
  functions-and-methods: release-github-com-looprig-classifiers
  types: release-github-com-looprig-classifiers
  constants-and-variables: release-github-com-looprig-classifiers
  ownership-and-errors: release-github-com-looprig-classifiers
  source-and-runnable-proof: release-github-com-looprig-classifiers
---

# catalog package · catalog

Import path: `github.com/looprig/classifiers/pkg/catalog`. Catalog is a public scaffold reserved for explicit classifier discovery and construction.

## Package role {#package-role}

The package currently has no exported construction API. It performs no implicit global registration and does not make a classifier available to a Rig by import alone.

## Exported surface {#exported-surface}

No exported functions, types, constants, or variables are present in the released package. Consumers construct `pkg/commandsafety.Classifier` and register it explicitly with Harness.

### Functions and methods {#functions-and-methods}

None in `v0.1.4`.

### Types {#types}

None in `v0.1.4`.

### Constants and variables {#constants-and-variables}

None in `v0.1.4`.

## Ownership and errors {#ownership-and-errors}

Do not rely on package import side effects or assume a future catalog API exists. Registration, policy, lifecycle, and shutdown remain owned by the application and Harness.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned catalog package](https://github.com/looprig/classifiers/tree/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/catalog/). `stage-13-classifier` uses the explicit commandsafety constructor instead.
