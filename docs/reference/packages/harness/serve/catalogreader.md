---
id: reference/packages/harness/serve/catalogreader
title: serve/catalogreader package · catalogreader
description: Reference for the concrete session-store reader behind Harness serve's read interface.
audience: developer
section: reference
order: 152
publication: released
examples:
  - stage-19-http-serve
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions: release-github-com-looprig-harness
  methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants: release-github-com-looprig-harness
  variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# serve/catalogreader package · catalogreader

Import path: `github.com/looprig/harness/pkg/serve/catalogreader`. The source is pinned to github.com/looprig/harness@v0.25.0.

## Package role {#package-role}

Package catalogreader is the concrete read-plane adapter behind serve.Reader.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(catalog *sessionstore.Catalog, store *sessionstore.Store) *Reader`

### Methods {#methods}

- `func (e *PrivateEventError) Error() string`
- `func (r *Reader) ListSessions(ctx context.Context, page serve.Page) (serve.SessionList, error)`
- `func (r *Reader) ReadStatus(ctx context.Context, id uuid.UUID) (serve.SessionStatus, error)`
- `func (r *Reader) ReadJournal(ctx context.Context, id uuid.UUID, page serve.JournalPage) (serve.EventJournalPage, error)`

### Types {#types}

```go
type Reader struct {
	// contains filtered or unexported fields
}
```

```go
type PrivateEventError struct{ Visibility event.EventVisibility }
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `PrivateEventError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/serve/catalogreader/reader.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/catalogreader/reader.go)

Adjacent tests at the same commit:

- [pkg/serve/catalogreader/reader_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/catalogreader/reader_test.go)
- [pkg/serve/catalogreader/reader_visibility_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/serve/catalogreader/reader_visibility_test.go)

Run `go test ./...` from a checkout of the `harness` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
