---
id: reference/packages/pluto/pkg/reportjson
title: Pluto report JSON package
description: Strict, size-capped, versioned JSON encoding for redacted Pluto scorecard reports.
audience: developer
section: reference
order: 265
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/reportjson`

Qualification report wire package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/reportjson).

## Package role {#package-role}

The package persists a redacted scorecard/result artifact with an explicit version. It is not a session event stream, checkpoint, or source model context.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Encode(card qual.Scorecard, result *profile.Result) ([]byte, error)`
- `func Decode(data []byte) (Decoded, error)`

### Methods {#methods}

- `func (e *UnknownVersionError) Error() string`
- `func (e *ReportTooLargeError) Error() string`
- `func (e *MalformedReportError) Error() string`
- `func (e *InvalidReportError) Error() string`
- `func (e *InvalidReportError) Unwrap() error`
- `func (e *EncodeError) Error() string`
- `func (e *EncodeError) Unwrap() error`

### Types {#types}

`Decoded`, `DecodedTable`, `UnknownVersionError`, `ReportTooLargeError`, `MalformedReportError`, `InvalidReportError`, `EncodeError`

### Constants {#constants}

`Version`, `MaxReportBytes`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `UnknownVersionError`, `ReportTooLargeError`, `MalformedReportError`, `InvalidReportError`, `EncodeError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/reportjson/codec.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/reportjson/codec.go)
- [pkg/reportjson/errors.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/reportjson/errors.go)

Adjacent tests at the same commit:

- [pkg/reportjson/codec_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/reportjson/codec_test.go)

Run `GOWORK=off go test ./...` from the `pluto` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
