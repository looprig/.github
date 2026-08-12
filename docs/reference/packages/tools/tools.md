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

Import path: `github.com/looprig/tools`. The source is pinned to github.com/looprig/tools@v0.10.1.

## Package role {#package-role}

Package tools provides independent definition builders for Looprig's standard tools.

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

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [definitions.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/definitions.go)

Adjacent tests at the same commit:

- [definitions_hostreads_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/definitions_hostreads_test.go)
- [definitions_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/definitions_test.go)
- [dependency_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/dependency_test.go)
- [example_readme_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/example_readme_test.go)
- [integration_helpers_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/integration_helpers_test.go)
- [task_bundle_test.go](https://github.com/looprig/tools/blob/1a1c57c7ae8b1e59c37c89d38e9a4145c32dd62a/task_bundle_test.go)

Run `go test ./...` from a checkout of the `tools` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
