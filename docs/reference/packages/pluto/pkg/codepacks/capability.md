---
id: reference/packages/pluto/pkg/codepacks/capability
title: Pluto capability codepack
description: Built-in v1 capability pack constructor for Pluto qualification runs.
audience: developer
section: reference
order: 251
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/codepacks/capability`

Capability pack in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/codepacks/capability).

## Package role {#package-role}

The pack describes capability qualification tables. It supplies declarative eval inputs; it does not invoke a model or persist a report.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func V1() qual.Pack`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

No exported types are declared in this package.

### Constants {#constants}

`Revision`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/codepacks/capability/v1.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/codepacks/capability/v1.go)

Adjacent tests at the same commit:

- [pkg/codepacks/capability/v1_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/codepacks/capability/v1_test.go)

Run `GOWORK=off go test ./...` from the `pluto` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
