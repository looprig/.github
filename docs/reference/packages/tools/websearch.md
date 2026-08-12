---
id: reference/packages/tools/websearch
title: websearch package · websearch
description: Reference for provider-backed bounded web search.
audience: developer
section: reference
order: 172
publication: released
examples:
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

# websearch package · websearch

Import path: `github.com/looprig/tools/websearch`. The source is pinned to github.com/looprig/tools@v0.10.0.

## Package role {#package-role}

`SearchProvider` is the caller-owned network seam. `NewWebSearch` binds it; the tool validates query, result, and content limits before returning a model-facing result.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewDuckDuckGoProvider(client *http.Client) *DuckDuckGoProvider`
- `func NewWebSearch(provider SearchProvider) *WebSearch`

### Methods {#methods}

- `func (p *DuckDuckGoProvider) Endpoints() []Endpoint`
- `func (p *DuckDuckGoProvider) Search(ctx context.Context, query string, max int) ([]SearchResult, error)`
- `func (w *WebSearch) Info(context.Context) (*tool.ToolInfo, error)`
- `func (w *WebSearch) AuditSummary(argsJSON string) string`
- `func (w *WebSearch) PrepareCall(_ context.Context, executionID uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error)`
- `func (w *WebSearch) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error)`

### Types {#types}

```go
type DuckDuckGoProvider struct {
	// contains filtered or unexported fields
}
```

```go
type SearchResult struct {
	Title   string
	URL     string
	Snippet string
}
```

```go
type Endpoint struct {
	Host string
	Port int
}
```

```go
type SearchProvider interface {
	Search(ctx context.Context, query string, max int) ([]SearchResult, error)
	Endpoints() []Endpoint
}
```

```go
type WebSearch struct {
	// contains filtered or unexported fields
}
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

- [websearch/duckduckgo.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/websearch/duckduckgo.go)
- [websearch/websearch.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/websearch/websearch.go)

Adjacent tests at the same commit:

- [websearch/duckduckgo_fuzz_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/websearch/duckduckgo_fuzz_test.go)
- [websearch/preparecall_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/websearch/preparecall_test.go)
- [websearch/result_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/websearch/result_test.go)
- [websearch/web_integration_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/websearch/web_integration_test.go)
- [websearch/websearch_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/websearch/websearch_test.go)

Run `GOWORK=off go test ./...` from the `tools` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
