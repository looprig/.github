---
id: reference/packages/pluto/pkg/ratelimit
title: Pluto rate-limit package
description: Bounded retry and concurrency decorator for inference clients.
audience: [developer, operator]
section: reference
order: 264
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

# `github.com/looprig/pluto/pkg/ratelimit`

Inference rate-limit decorator in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/ratelimit).

## Package role {#package-role}

Package ratelimit decorates an inference.Client with client-side rate limiting: a requests-per-minute pacing limiter, an in-flight concurrency cap, and automatic retry with exponential backoff on rate-limit (HTTP 429) and transient server (5xx) / network failures.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(inner inference.Client, cfg Config) inference.Client`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type Config struct {
	MaxRPM int

	MaxConcurrent int

	MaxRetries int

	BaseBackoff time.Duration

	MaxBackoff time.Duration
}
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

- [pkg/ratelimit/ratelimit.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/ratelimit/ratelimit.go)

Adjacent tests at the same commit:

- [pkg/ratelimit/ratelimit_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/ratelimit/ratelimit_test.go)

Run `go test ./...` from a checkout of the `pluto` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
