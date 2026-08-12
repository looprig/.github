---
id: reference/packages/tools/tools
title: tools package · tools
description: Reference for standard Looprig tool definition builders.
audience: developer
section: reference
order: 160
publication: released
examples:
  - stage-03-pure-tool
  - stage-04-prepared-tool
proofs:
  package-role: release-github-com-looprig-tools
  exported-surface: release-github-com-looprig-tools
  functions: release-github-com-looprig-tools
  methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants: release-github-com-looprig-tools
  variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# tools package · tools

Import path: `github.com/looprig/tools`. The source is pinned to github.com/looprig/tools@v0.10.0.

## Package role {#package-role}

Root builders are declarative. They return `tool.Definition` values that Harness binds to a session, so process runners, workspace coordinators, observations, and mutation permits are supplied only at build time.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func GlobDefinition(readGuard loop.ReadGuard, options ...glob.GlobOption) tool.Definition`
- `func GrepDefinition(readGuard loop.ReadGuard, options ...grep.GrepOption) tool.Definition`
- `func TaskDefinitions() tool.Definition`
- `func AskUserDefinition() tool.Definition`
- `func WebSearchDefinition(provider websearch.SearchProvider) tool.Definition`
- `func FetchDefinition(client *http.Client) tool.Definition`
- `func ReadFileDefinition(readGuard loop.ReadGuard, options ...readfile.ReadFileOption) tool.Definition`
- `func WriteFileDefinition(options ...writefile.Option) tool.Definition`
- `func EditFileDefinition(options ...editfile.Option) tool.Definition`
- `func Bash(options ...bash.BashOption) tool.Definition`
- `func BashDefinition(resolver AsyncProcessRunnerResolver, options ...bash.BashOption) tool.Definition`
- `func ProcessOutputDefinition() tool.Definition`
- `func ProcessInputDefinition() tool.Definition`
- `func ProcessStopDefinition() tool.Definition`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type DefinitionBuildError = definition.BuildError
```

```go
type AsyncProcessRunnerResolver func(context.Context, uuid.UUID) (tool.AsyncProcessRunner, error)
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [definitions.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/definitions.go)

Adjacent tests at the same commit:

- [definitions_hostreads_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/definitions_hostreads_test.go)
- [definitions_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/definitions_test.go)
- [dependency_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/dependency_test.go)
- [example_readme_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/example_readme_test.go)
- [integration_helpers_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/integration_helpers_test.go)
- [task_bundle_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/task_bundle_test.go)

Run `GOWORK=off go test ./...` from the `tools` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
