---
id: reference/packages/pluto/pkg/cli
title: Pluto CLI package
description: Process boundary for Pluto commands, injected clients, environment lookup, output, and exit codes.
audience: [developer, operator]
section: reference
order: 250
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
  source-and-runnable-proof: release-github-com-looprig-pluto-cmd-pluto
---

# `github.com/looprig/pluto/pkg/cli`

CLI composition package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli).

## Package role {#package-role}

Package cli implements every pluto command against injected dependencies.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Main(args []string, app App) int`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type App struct {
	Registry       *packfile.Registry
	NewClient      func(model.Model) (inference.Client, error)
	NewCounter     func(model.Model) (pricing.Counter, error)
	LookupEnv      func(string) (string, bool)
	Stdout, Stderr io.Writer
	Now            func() time.Time

	RateLimit ratelimit.Config
}
```

```go
type LLMConfig struct {
	LLM struct {
		Provider  string `yaml:"provider"`
		Model     string `yaml:"model"`
		APIFormat string `yaml:"api-format"`
		BaseURL   string `yaml:"base-url"`
	} `yaml:"llm"`
}
```

### Constants {#constants}

`ExitOK`, `ExitCommandFailure`, `ExitUsage`, `ExitGateFailed`, `ExitPricing`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/cli/cli.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/cli.go)
- [pkg/cli/comparecmd.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/comparecmd.go)
- [pkg/cli/evaluators.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/evaluators.go)
- [pkg/cli/gencmd.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/gencmd.go)
- [pkg/cli/initcmd.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/initcmd.go)
- [pkg/cli/runcmd.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/runcmd.go)
- [pkg/cli/schema.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/schema.go)
- [pkg/cli/ui.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/ui.go)
- [pkg/cli/validate.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/validate.go)
- [pkg/cli/viewport.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/viewport.go)
- [pkg/cli/winsize_darwin.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/winsize_darwin.go)
- [pkg/cli/winsize_linux.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/winsize_linux.go)
- [pkg/cli/winsize_other.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/winsize_other.go)
- [pkg/cli/winsize_unix.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/winsize_unix.go)

Adjacent tests at the same commit:

- [pkg/cli/cli_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/cli_test.go)
- [pkg/cli/comparecmd_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/comparecmd_test.go)
- [pkg/cli/evaluators_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/evaluators_test.go)
- [pkg/cli/gencmd_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/gencmd_test.go)
- [pkg/cli/initcmd_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/initcmd_test.go)
- [pkg/cli/preflight_counter_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/preflight_counter_test.go)
- [pkg/cli/ratelimit_wiring_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/ratelimit_wiring_test.go)
- [pkg/cli/runcmd_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/runcmd_test.go)
- [pkg/cli/schema_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/schema_test.go)
- [pkg/cli/validate_judge_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/validate_judge_test.go)
- [pkg/cli/validate_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/validate_test.go)
- [pkg/cli/viewport_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/cli/viewport_test.go)

Run `go test ./...` from a checkout of the `pluto` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
