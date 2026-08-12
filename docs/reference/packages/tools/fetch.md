---
id: reference/packages/tools/fetch
title: fetch package · fetch
description: Reference for bounded HTTP fetches.
audience: developer
section: reference
order: 164
publication: released
examples:
  - stage-04-prepared-tool
proofs:
  package-role: release-github-com-looprig-tools
  exported-surface: release-github-com-looprig-tools
  functions-and-methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants-and-variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# fetch package · fetch

Import path: `github.com/looprig/tools/fetch`. The source is pinned to github.com/looprig/tools@v0.10.0.

## Package role {#package-role}

`NewFetch` binds the HTTP client. The tool validates URL, method, headers, and body limits before the request, while the gate and network enforcement owner decide whether the destination is permitted.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewFetch(client *http.Client) *Fetch`

### Methods {#methods}

- `func (f *Fetch) Info(context.Context) (*tool.ToolInfo, error)`
- `func (f *Fetch) AuditSummary(argsJSON string) string`
- `func (f *Fetch) PrepareCall(_ context.Context, executionID uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error)`
- `func (f *Fetch) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error)`
- `func (e *redirectBlockedError) Error() string`
- `func (e *fetchError) Error() string`
- `func (e *fetchError) Unwrap() error`

### Types {#types}

`Fetch`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [fetch/fetch.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/fetch/fetch.go)

Adjacent tests at the same commit:

- [fetch/fetch_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/fetch/fetch_test.go)
- [fetch/preparecall_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/fetch/preparecall_test.go)

Run `GOWORK=off go test ./...` from the `tools` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
