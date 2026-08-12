---
id: reference/packages/tools/permission
title: permission package · permission
description: Reference for durable command and filesystem permission rules.
audience: developer
section: reference
order: 167
publication: released
examples:
  - stage-12-gate-rules
  - stage-13-classifier
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

# permission package · permission

Import path: `github.com/looprig/tools/permission`. The source is pinned to github.com/looprig/tools@v0.10.0.

## Package role {#package-role}

`Store` reads and writes normalized rules under a caller-selected configuration. It supplies match helpers for exact command, family, workspace tree, host access, broad egress, and network target. It does not decide the final gate resolution.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func ProposeCommandCandidate(command string, eligible FamilyEligibility) string`
- `func NetworkTargetMatch(transport, host string, port int) string`
- `func BroadEgressMatch(command, target string) string`
- `func HostAccessMatch(command string) string`
- `func TreeMatch(root string) string`
- `func NewWorkspaceStore(cfg Config) (*Store, []Diagnostic, error)`
- `func NewReadOnlyStore(cfg Config) (*Store, []Diagnostic, error)`

### Methods {#methods}

- `func (e *RuleError) Error() string`
- `func (e *FileError) Error() string`
- `func (e *FileError) Unwrap() error`
- `func (s *Store) MatchesDeny(ctx context.Context, requirement tool.Requirement) (bool, error)`
- `func (s *Store) MatchesAllow(ctx context.Context, requirement tool.Requirement) (bool, error)`
- `func (s *Store) Diagnostics() []Diagnostic`
- `func (s *Store) WriteRules(ctx context.Context, candidates []tool.RuleCandidate) error`

### Types {#types}

```go
type DiagnosticCode string
```

```go
type Diagnostic struct {
	Code      DiagnosticCode
	RuleIndex int
	Message   string
}
```

```go
type FamilyEligibility func(tokens []string) bool
```

```go
type Effect string
```

```go
type Rule struct {
	Effect     Effect
	Capability string
	Class      string

	Command string

	Tokens            []string
	TrailingArguments bool

	Transport string
	Host      string
	Port      int

	Target string

	Path string

	Root string
}
```

```go
type RuleError struct {
	Index  int
	Reason string
}
```

```go
type FileErrorReason string
```

```go
type FileError struct {
	Path   string
	Reason FileErrorReason
	Err    error
}
```

```go
type Config struct {
	Path string

	MaxFileBytes int64

	FamilyEligible FamilyEligibility
}
```

```go
type Store struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

`DiagnosticAllowFamilyOutOfCatalog`, `SchemaVersion`, `NormalizationVersion`, `EffectAllow`, `EffectDeny`, `CapabilityCommandExecute`, `CapabilityNetwork`, `CapabilityFilesystemRead`, `CapabilityFilesystemWrite`, `ClassCommandInvoke`, `ClassCommandInvokeWildcard`, `ClassCommandInvokeFamily`, `ClassNetworkTarget`, `ClassNetworkBroad`, `ClassFilesystemPathRead`, `ClassFilesystemPathWrite`, `ClassFilesystemTreeRead`, `ClassFilesystemTreeWrite`, `ClassFilesystemHostRead`, `ClassFilesystemHostWrite`, `GrantClassCommandStart`, `GrantClassNetworkProxyTarget`, `FileMalformed`, `FileVersionUnsupported`, `FileRuleInvalid`, `FileNotRegular`, `FileSymlink`, `FileOwnerUnexpected`, `FileModeUnexpected`, `FileLinkCount`, `FileTooLarge`, `FileMissing`, `FileIO`, `FileLock`, `FileReadOnly`, `FileCandidateInvalid`, `DefaultMaxFileBytes`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `FileError`, `RuleError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [permission/bashrule.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/bashrule.go)
- [permission/diagnostic.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/diagnostic.go)
- [permission/match.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/match.go)
- [permission/rule.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/rule.go)
- [permission/rule_json.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/rule_json.go)
- [permission/store.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/store.go)
- [permission/store_unix.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/store_unix.go)
- [permission/store_windows.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/store_windows.go)

Adjacent tests at the same commit:

- [permission/bashrule_fuzz_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/bashrule_fuzz_test.go)
- [permission/bashrule_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/bashrule_test.go)
- [permission/contract_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/contract_test.go)
- [permission/file_fuzz_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/file_fuzz_test.go)
- [permission/hardening_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/hardening_test.go)
- [permission/headless_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/headless_test.go)
- [permission/match_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/match_test.go)
- [permission/rule_json_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/rule_json_test.go)
- [permission/store_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/permission/store_test.go)

Run `GOWORK=off go test ./...` from the `tools` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
