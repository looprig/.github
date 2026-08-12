---
id: reference/packages/pluto/pkg/run
title: Pluto run package
description: Qualification execution orchestration with explicit target selection, progress, partial results, and table concurrency.
audience: developer
section: reference
order: 266
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  functions: release-github-com-looprig-pluto
  methods: release-github-com-looprig-pluto
  types: release-github-com-looprig-pluto
  constants: release-github-com-looprig-pluto
  variables: release-github-com-looprig-pluto
  ownership-and-errors: release-github-com-looprig-pluto
  source-and-runnable-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/run`

Qualification execution package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/run).

## Package role {#package-role}

`run` coordinates manifests, packs, targets, table evaluation, callbacks, and scorecard assembly. It creates evaluation artifacts and does not own session lifecycle or serving.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func ManifestModel(m qual.Manifest) model.Model`
- `func DecodeManifest(r io.Reader) (qual.Manifest, error)`
- `func DecodeProfile(r io.Reader) (profile.Profile, error)`
- `func Execute(ctx context.Context, s Spec) (Result, error)`
- `func BuildTarget(client inference.Client, m qual.Manifest, env *packfile.Environment, tableRevision eval.Revision) (eval.Target, error)`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

`Spec`, `Result`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/run/manifest.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/run/manifest.go)
- [pkg/run/run.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/run/run.go)

Adjacent tests at the same commit:

- [pkg/run/manifest_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/run/manifest_test.go)
- [pkg/run/run_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/run/run_test.go)

Run `GOWORK=off go test ./...` from the `pluto` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
