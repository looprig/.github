---
id: reference/packages/inference/route
title: route package · route
description: Reference for the route package at github.com/looprig/inference/route, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 114
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
  - stage-22-model-gateway
proofs:
  package-role: release-github-com-looprig-inference
  exported-surface: release-github-com-looprig-inference
  functions: release-github-com-looprig-inference
  methods: release-github-com-looprig-inference
  types: release-github-com-looprig-inference
  constants: release-github-com-looprig-inference
  variables: release-github-com-looprig-inference
  ownership-and-errors: release-github-com-looprig-inference
  source-and-runnable-proof: release-github-com-looprig-inference
---

# route package · route

Import path: `github.com/looprig/inference/route`. The source is pinned to github.com/looprig/inference@v0.10.0.

## Package role {#package-role}

Package route holds concrete route.Router builders for the bundled wire APIs: a static chat route (OpenAI/Anthropic style) and Gemini's mode-aware model-in-path route.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func StaticChat(path string) Router`
- `func GeminiGenerateContent() Router`

### Methods {#methods}

- `func (e *MissingModelError) Error() string`

### Types {#types}

```go
type Route struct {
	Method string
	URL    string
	Header http.Header
}
```

```go
type Router interface {
	BuildRoute(baseURL string, req inference.Request, mode codec.RequestMode) (Route, error)
}
```

```go
type MissingModelError struct{}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `MissingModelError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [route/contracts.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/route/contracts.go)
- [route/route.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/route/route.go)

Adjacent tests at the same commit:

- [route/contracts_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/route/contracts_test.go)
- [route/route_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/route/route_test.go)

Run `go test ./...` from a checkout of the `inference` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
