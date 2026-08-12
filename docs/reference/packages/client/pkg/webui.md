---
id: reference/packages/client/pkg/webui
title: Client webui package
description: Embedded SPA asset handler for serving the released client web UI with path containment and fallback behavior.
audience: [developer, operator]
section: reference
order: 230
publication: released
examples:
  - stage-20-web-client
proofs:
  package-role: release-github-com-looprig-client
  exported-surface: release-github-com-looprig-client
  functions: release-github-com-looprig-client
  methods: release-github-com-looprig-client
  types: release-github-com-looprig-client
  constants: release-github-com-looprig-client
  variables: release-github-com-looprig-client
  ownership-and-errors: release-github-com-looprig-client
  source-and-runnable-proof: release-github-com-looprig-client
---

# `github.com/looprig/client/pkg/webui`

Go web asset package in [client v0.1.0](https://github.com/looprig/client/tree/9941c8da1308d0a01562f17bdbbec963ce2a26ca/pkg/webui).

## Package role {#package-role}

`webui` serves the built browser application through `net/http`. It is the asset boundary only; transport, event folding, and framework bindings live in the private SDK source workspace.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Handler() http.Handler`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

No exported types are declared in this package.

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

`FS`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/webui/webui.go](https://github.com/looprig/client/blob/9941c8da1308d0a01562f17bdbbec963ce2a26ca/pkg/webui/webui.go)

Adjacent tests at the same commit:

- [pkg/webui/webui_test.go](https://github.com/looprig/client/blob/9941c8da1308d0a01562f17bdbbec963ce2a26ca/pkg/webui/webui_test.go)

Run `GOWORK=off go test ./...` from the `client` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
