---
id: reference/packages/pluto/pkg/qual
title: Pluto qualification package
description: Manifests, packs, tables, scorecards, statistics, capabilities, and validation primitives for qualification.
audience: developer
section: reference
order: 262
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/qual`

Qualification domain package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual).

## Package role {#package-role}

`qual` is the stable domain vocabulary shared by pack definitions, targets, run results, comparisons, profiles, and reports. It records evaluation artifacts and target identity; it does not own model context or serving state.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Plan(p Pack, m Manifest) ([]TablePlan, error)`
- `func Summarize(values []float64, q float64) (StatSummary, error)`

### Methods {#methods}

- `func (r ModelRole) Validate() error`
- `func (c EndpointClass) Validate() error`
- `func (c Capability) Validate() error`
- `func (m Manifest) Validate() error`
- `func (m Manifest) Fingerprint() (string, error)`
- `func (e *ValidationError) Error() string`
- `func (t Table) Validate() error`
- `func (t Table) Suite() eval.Suite`
- `func (p Pack) Validate() error`
- `func (s Scorecard) Dimensions() ([]DimensionScore, error)`
- `func (s Scorecard) StatusRollup() (StatusRollup, error)`
- `func (s Scorecard) FindingCount(code eval.FindingCode) int`
- `func (s Scorecard) SeverityCount(severity eval.Severity) int`

### Types {#types}

`ModelRole`, `EndpointClass`, `Capability`, `Manifest`, `ValidationError`, `Table`, `Pack`, `TablePlan`, `TableResult`, `Scorecard`, `DimensionScore`, `StatusRollup`, `StatSummary`

### Constants {#constants}

`MaxManifestStringBytes`, `RoleCandidate`, `RoleIncumbent`, `EndpointRemote`, `EndpointLocal`, `EndpointProcess`, `CapabilityTools`, `CapabilityStructuredOutput`, `CapabilityImages`, `CapabilityThinking`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ValidationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/qual/doc.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/doc.go)
- [pkg/qual/manifest.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/manifest.go)
- [pkg/qual/pack.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/pack.go)
- [pkg/qual/scorecard.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/scorecard.go)
- [pkg/qual/stats.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/stats.go)

Adjacent tests at the same commit:

- [pkg/qual/manifest_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/manifest_test.go)
- [pkg/qual/pack_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/pack_test.go)
- [pkg/qual/scorecard_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/scorecard_test.go)
- [pkg/qual/stats_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual/stats_test.go)

Run `GOWORK=off go test ./...` from the `pluto` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
