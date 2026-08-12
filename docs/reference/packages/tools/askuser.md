---
id: reference/packages/tools/askuser
title: askuser package · askuser
description: Reference for the user-question tool.
audience: developer
section: reference
order: 161
publication: released
examples:
  - stage-03-pure-tool
proofs:
  package-role: release-github-com-looprig-tools
  exported-surface: release-github-com-looprig-tools
  functions-and-methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants-and-variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# askuser package · askuser

Import path: `github.com/looprig/tools/askuser`. The source is pinned to github.com/looprig/tools@v0.10.0.

## Package role {#package-role}

`NewAskUser` returns a tool with no filesystem, process, or network authority. The runtime supplies the requester through loop context; the tool does not open a UI or call a model.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewAskUser() *AskUser`

### Methods {#methods}

- `func (a *AskUser) Info(context.Context) (*tool.ToolInfo, error)`
- `func (a *AskUser) AuditSummary(argsJSON string) string`
- `func (a *AskUser) InvokableRun(ctx context.Context, argsJSON string) (*tool.ToolResult, error)`
- `func (a *AskUser) PrepareCall(context.Context, uuid.UUID, string) (tool.Request, tool.PreparedArtifact, error)`

### Types {#types}

`AskUser`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [askuser/askuser.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/askuser/askuser.go)

Adjacent tests at the same commit:

- [askuser/askuser_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/askuser/askuser_test.go)
- [askuser/preparecall_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/askuser/preparecall_test.go)
- [askuser/result_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/askuser/result_test.go)

Run `GOWORK=off go test ./...` from the `tools` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
