---
id: reference/packages/rclonestore/rclonestore
title: rclonestore package
description: Reference for the rclonestore package at github.com/looprig/rclonestore, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 54
publication: released
proofs:
  package-role: release-github-com-looprig-rclonestore
  exported-surface: release-github-com-looprig-rclonestore
  functions-and-methods: release-github-com-looprig-rclonestore
  types: release-github-com-looprig-rclonestore
  constants-and-variables: release-github-com-looprig-rclonestore
  ownership-and-errors: release-github-com-looprig-rclonestore
  source-and-runnable-proof: release-github-com-looprig-rclonestore
---

# rclonestore package

Import path: `github.com/looprig/rclonestore`. The source is pinned to github.com/looprig/rclonestore@v0.3.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.2; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func New(opts Options) (*Store, error)`

### Methods {#methods}

- `func (b *blobStore) StoragePaths() []string`
- `func (e *PutSourceError) Error() string`
- `func (e *PutSourceError) Unwrap() error`
- `func (b *blobStore) Put(ctx context.Context, key string, r io.Reader) error`
- `func (b *blobStore) Get(ctx context.Context, key string) (io.ReadCloser, error)`
- `func (b *blobStore) Delete(ctx context.Context, key string) error`
- `func (b *blobStore) List(ctx context.Context, prefix string) ([]string, error)`
- `func (e *PersistencePathError) Error() string`
- `func (e *PersistencePathError) Unwrap() error`
- `func (e *RcloneError) Error() string`
- `func (e *RcloneError) Unwrap() error`
- `func (s *Store) Close() error`
- `func (e *OptionsError) Error() string`
- `func (e *BinaryError) Error() string`
- `func (e *BinaryError) Unwrap() error`
- `func (e *ProbeError) Error() string`
- `func (e *ProbeError) Unwrap() error`
- `func (w *tailWriter) Write(p []byte) (int, error)`

### Types {#types}

`PutSourceError`, `PersistencePathError`, `RcloneError`, `Options`, `Store`, `OptionsError`, `BinaryError`, `ProbeError`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `PutSourceError`, `PersistencePathError`, `RcloneError`, `OptionsError`, `BinaryError`, `ProbeError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [blobs.go](https://github.com/looprig/rclonestore/blob/994e14f9184726b57798df4049b7b731fde608f9/blobs.go)
- [errors.go](https://github.com/looprig/rclonestore/blob/994e14f9184726b57798df4049b7b731fde608f9/errors.go)
- [rclonestore.go](https://github.com/looprig/rclonestore/blob/994e14f9184726b57798df4049b7b731fde608f9/rclonestore.go)
- [runner.go](https://github.com/looprig/rclonestore/blob/994e14f9184726b57798df4049b7b731fde608f9/runner.go)

Adjacent tests at the same commit:

- [blobs_test.go](https://github.com/looprig/rclonestore/blob/994e14f9184726b57798df4049b7b731fde608f9/blobs_test.go)
- [conformance_integration_test.go](https://github.com/looprig/rclonestore/blob/994e14f9184726b57798df4049b7b731fde608f9/conformance_integration_test.go)
- [rclonestore_test.go](https://github.com/looprig/rclonestore/blob/994e14f9184726b57798df4049b7b731fde608f9/rclonestore_test.go)
- [runner_test.go](https://github.com/looprig/rclonestore/blob/994e14f9184726b57798df4049b7b731fde608f9/runner_test.go)
- [symlink_capability_unix_test.go](https://github.com/looprig/rclonestore/blob/994e14f9184726b57798df4049b7b731fde608f9/symlink_capability_unix_test.go)
- [symlink_capability_windows_test.go](https://github.com/looprig/rclonestore/blob/994e14f9184726b57798df4049b7b731fde608f9/symlink_capability_windows_test.go)

Run `GOWORK=off go test ./...` from the `rclonestore` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
