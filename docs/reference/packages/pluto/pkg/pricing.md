---
id: reference/packages/pluto/pkg/pricing
title: Pluto pricing package
description: Pricing snapshot parsing and bounded preflight cost estimates for evaluation runs.
audience: [developer, operator]
section: reference
order: 260
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

# `github.com/looprig/pluto/pkg/pricing`

Pricing preflight package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/pricing).

## Package role {#package-role}

Package pricing implements list-price estimation for qualification runs.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Cost(u Usage, r Rates) Amount`
- `func Preflight(ctx context.Context, plans []qual.TablePlan, cfg eval.RunConfig, rates Rates, counter Counter, templates map[eval.Name]inference.Request) (Plan, error)`
- `func ParseSnapshot(raw []byte, sourceURL string, fetchedAt time.Time) (Snapshot, error)`
- `func FetchSnapshot(ctx context.Context, client *http.Client, rawURL string) (Snapshot, error)`

### Methods {#methods}

No exported methods are declared in this package.

### Types {#types}

```go
type Usage struct {
	Input, Output, Reasoning, CacheRead, CacheWrite int
	Complete                                        bool
}
```

```go
type Amount struct {
	USD    float64
	Known  bool
	Reason string
}
```

```go
type Counter interface {
	Count(ctx context.Context, req inference.Request) (tokens int, quality string, err error)
}
```

```go
type Plan struct {
	TargetCalls, JudgeCalls int
	InputTokens             [2]int
	OutputTokens            [2]int
	Expected, Max           Amount
	CounterQuality          string
	Unknowns                []string
}
```

```go
type Snapshot struct {
	SourceURL string
	FetchedAt time.Time
	Digest    string
	Rows      map[string]Rates
}
```

```go
type Rates struct {
	Input, Output, Reasoning, CacheRead, CacheWrite *float64
}
```

### Constants {#constants}

`MaxSnapshotBytes`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/pricing/cost.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/pricing/cost.go)
- [pkg/pricing/doc.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/pricing/doc.go)
- [pkg/pricing/preflight.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/pricing/preflight.go)
- [pkg/pricing/snapshot.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/pricing/snapshot.go)

Adjacent tests at the same commit:

- [pkg/pricing/cost_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/pricing/cost_test.go)
- [pkg/pricing/preflight_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/pricing/preflight_test.go)
- [pkg/pricing/snapshot_test.go](https://github.com/looprig/pluto/blob/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/pricing/snapshot_test.go)

Run `go test ./...` from a checkout of the `pluto` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
