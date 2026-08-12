---
id: reference/packages/llm/providers/phala
title: phala package · providers/phala
description: Reference for the phala package at github.com/looprig/llm/providers/phala, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 335
publication: released
proofs:
  package-role: release-github-com-looprig-llm
  exported-surface: release-github-com-looprig-llm
  functions: release-github-com-looprig-llm
  methods: release-github-com-looprig-llm
  types: release-github-com-looprig-llm
  constants: release-github-com-looprig-llm
  variables: release-github-com-looprig-llm
  ownership-and-errors: release-github-com-looprig-llm
  source-and-runnable-proof: release-github-com-looprig-llm
---

# phala package · providers/phala

Import path: `github.com/looprig/llm/providers/phala`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

Package phala is the Phala confidential-inference provider: it owns the gateway base-URL default and a typed constructor (New) that wires the reusable, provider-agnostic aci attestation protocol into an attested inference.Client.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(baseURL string, key auth.APIKey, p aci.Policy) (inference.Client, error)`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

No exported types are declared in this package.

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/phala/phala.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/phala/phala.go)

Adjacent tests at the same commit:

- [providers/phala/policy_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/phala/policy_test.go)

Run `go test ./...` from a checkout of the `llm` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
