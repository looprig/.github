---
id: reference/packages/harness/identity
title: identity package · identity
description: Reference for Harness agent names, coordinates, provenance, and identity boundaries.
audience: developer
section: reference
order: 147
publication: released
examples:
  - stage-14-delegation
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions: release-github-com-looprig-harness
  methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants: release-github-com-looprig-harness
  variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# identity package · identity

Import path: `github.com/looprig/harness/pkg/identity`. The source is pinned to github.com/looprig/harness@v0.24.2.

## Package role {#package-role}

`Coordinates` groups session, loop, turn, and step IDs. `AgentName` is the stable definition and delegate key. The package keeps provenance and human-readable names separate from mutable runtime state.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

No exported functions are declared in this package.

### Methods {#methods}

- `func (a Agency) String() string`

### Types {#types}

`Coordinates`, `AgentName`, `Agency`, `Cause`

### Constants {#constants}

`AgencyMachine`, `AgencyUser`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/identity/identifier_types.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/identity/identifier_types.go)

Adjacent tests at the same commit:

- [pkg/identity/identifier_types_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/identity/identifier_types_test.go)

Run `GOWORK=off go test ./...` from the `harness` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
