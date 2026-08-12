---
id: reference/packages/sandbox/pkg/profile
title: profile package · pkg/profile
description: Reference for the profile package at github.com/looprig/sandbox/pkg/profile, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 82
publication: released
examples:
  - stage-11-sandbox-process
proofs:
  package-role: release-github-com-looprig-sandbox
  exported-surface: release-github-com-looprig-sandbox
  functions: release-github-com-looprig-sandbox
  methods: release-github-com-looprig-sandbox
  types: release-github-com-looprig-sandbox
  constants: release-github-com-looprig-sandbox
  variables: release-github-com-looprig-sandbox
  ownership-and-errors: release-github-com-looprig-sandbox
  source-and-runnable-proof: release-github-com-looprig-sandbox
---

# profile package · pkg/profile

Import path: `github.com/looprig/sandbox/pkg/profile`. The source is pinned to github.com/looprig/sandbox@v0.8.1.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Sandbox `v0.8.1` separates profile construction and achieved guarantees from executor and network details. It does not decide whether a tool call is allowed; it enforces the authority the caller has already chosen.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func CanonicalRoot(path string) (string, error)`
- `func CanonicalRoot(path string) (string, error)`
- `func NewProfile(config ProfileConfig) (*Profile, error)`
- `func PathWithin(path, root string) bool`
- `func Restrict(base, ceiling *Profile) (*Profile, error)`
- `func GuaranteesFromBits(bits uint64) Guarantees`

### Methods {#methods}

- `func (p *Profile) Validate() error`
- `func (p *Profile) AccessVersion() uint16`
- `func (p *Profile) AccessFor(kind, scope string) (uint8, error)`
- `func (p *Profile) Fingerprint() string`
- `func (g Guarantees) Bits() uint64`
- `func (p *Profile) Settings() Settings`

### Types {#types}

```go
type Access uint8
```

```go
type Home uint8
```

```go
type Isolation uint8
```

```go
type RootAccess struct {
	Path  string
	Read  Access
	Write Access
}
```

```go
type ProfileConfig struct {
	WorkspaceRoot   string
	WorkspaceRead   Access
	WorkspaceWrite  Access
	HostRead        Access
	HostWrite       Access
	Network         Access
	Command         Access
	Home            Home
	Isolation       Isolation
	AdditionalRoots []RootAccess
	AckUnconfined   bool
}
```

```go
type Profile struct {
	// contains filtered or unexported fields
}
```

```go
type ReportEntry struct {
	Feature string
	Status  string
	Detail  string
}
```

```go
type CompileReport struct {
	Entries []ReportEntry
}
```

```go
type Guarantees struct {
	ProcessBoundary bool
	WriteBoundary   bool
	ReadBoundary    bool
	EnvScrub        bool
	NetworkBoundary bool
	AddressNetwork  bool
	ResourceLimits  bool
	TargetNetwork   bool
}
```

```go
type Settings struct {
	Version            uint16
	WorkspaceRoot      string
	WorkspaceRead      Access
	WorkspaceWrite     Access
	HostRead           Access
	HostWrite          Access
	Network            Access
	Command            Access
	Home               Home
	Isolation          Isolation
	AdditionalRoots    []RootAccess
	AckUnconfined      bool
	RequiredGuarantees uint64
	Fingerprint        string
}
```

### Constants {#constants}

`Deny`, `Gated`, `Allow`, `IsolatedHome`, `RealHome`, `Sandboxed`, `Unconfined`, `LevelNone`, `LevelDegraded`, `LevelFull`, `GuaranteeProcessBoundary`, `GuaranteeWriteBoundary`, `GuaranteeReadBoundary`, `GuaranteeEnvScrub`, `GuaranteeNetworkBoundary`, `GuaranteeAddressNetwork`, `GuaranteeResourceLimits`, `GuaranteeTargetNetwork`

### Variables {#variables}

`ErrInvalidProfile`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/profile/canonical_unix.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/profile/canonical_unix.go)
- [pkg/profile/canonical_windows.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/profile/canonical_windows.go)
- [pkg/profile/profile.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/profile/profile.go)
- [pkg/profile/report.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/profile/report.go)
- [pkg/profile/settings.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/profile/settings.go)

Adjacent tests at the same commit:

- [pkg/profile/canonical_windows_test.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/profile/canonical_windows_test.go)
- [pkg/profile/equivalent_root_unix_test.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/profile/equivalent_root_unix_test.go)
- [pkg/profile/equivalent_root_windows_test.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/profile/equivalent_root_windows_test.go)
- [pkg/profile/profile_test.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/profile/profile_test.go)

Run `GOWORK=off go test ./...` from the `sandbox` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
