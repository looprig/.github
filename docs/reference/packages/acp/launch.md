---
id: reference/packages/acp/launch
title: launch package · launch
description: Reference for ACP adapter configuration, native and proxy launch, and Codex preflight.
audience: developer
section: reference
order: 192
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-acp
  exported-surface: release-github-com-looprig-acp
  functions: release-github-com-looprig-acp
  methods: release-github-com-looprig-acp
  types: release-github-com-looprig-acp
  constants: release-github-com-looprig-acp
  variables: release-github-com-looprig-acp
  ownership-and-errors: release-github-com-looprig-acp
  source-and-runnable-proof: release-github-com-looprig-acp
---

# launch package · launch

Import path: `github.com/looprig/acp/launch`. The source is pinned to github.com/looprig/acp@v0.2.2.

## Package role {#package-role}

`Codex`, `ClaudeCode`, and `Gemini` construct adapter values. `Dial` uses a proxy-backed config; `DialNative` uses a native harness config. The package supplies command and environment shape, not provider credentials or model policy.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func ClaudeCode(models ClaudeModels) *ClaudeConnector`
- `func Codex(model string) *CodexConnector`
- `func Gemini(model string) *GeminiAdapter`
- `func Dial(ctx context.Context, cfg Config) (*ManagedClient, error)`
- `func DialNative(ctx context.Context, cfg NativeConfig) (*ManagedClient, error)`
- `func ProbeCodexVersion(ctx context.Context, path string, timeout time.Duration, runner CodexVersionRunner) (CodexVersionResult, error)`

### Methods {#methods}

- `func (c *ClaudeConnector) SelectDefaultModel(ctx context.Context, sess *client.Session) error`
- `func (c *ClaudeConnector) SelectSmallModel(ctx context.Context, sess *client.Session) error`
- `func (c *ClaudeConnector) SelectEffort(ctx context.Context, sess *client.Session) error`
- `func (c *ClaudeConnector) ApplyPermissionMode(ctx context.Context, sess *client.Session, modeID protocol.SessionModeID) error`
- `func (e *EffortAliasError) Error() string`
- `func (c *ClaudeConnector) Configure(cmd stdio.Command, binding ProxyBinding) (stdio.Command, error)`
- `func (c *ClaudeConnector) ConfigureNative(cmd stdio.Command) (stdio.Command, error)`
- `func (c *CodexConnector) Configure(cmd stdio.Command, binding ProxyBinding) (stdio.Command, error)`
- `func (c *CodexConnector) ConfigureNative(cmd stdio.Command) (stdio.Command, error)`
- `func (c *CodexConnector) WithModel(model string) *CodexConnector`
- `func (c *CodexConnector) WithModelEffort(model, effort string) *CodexConnector`
- `func (c *CodexConnector) SelectModel(ctx context.Context, sess *client.Session) error`
- `func (c *CodexConnector) SelectEffort(ctx context.Context, sess *client.Session) error`
- `func (e *ConfigError) Error() string`
- `func (e *ProxyNotReadyError) Error() string`
- `func (e *PathError) Error() string`
- `func (e *ConflictingEnvError) Error() string`
- `func (e *ModelAliasError) Error() string`
- `func (e *CodexVersionError) Error() string`
- `func (g *GeminiAdapter) Configure(cmd stdio.Command, binding ProxyBinding) (stdio.Command, error)`
- `func (m *ManagedClient) Client() *client.Client`
- `func (m *ManagedClient) Close(ctx context.Context) error`
- `func (v CodexVersion) String() string`
- `func (v CodexVersion) Less(other CodexVersion) bool`
- `func (c CodexVersionClass) String() string`

### Types {#types}

`ClaudeModels`, `ClaudeConnector`, `EffortAliasError`, `EffortSelectionError`, `CodexPosture`, `CodexConnector`, `ProxyBinding`, `ModelProxy`, `HarnessAdapter`, `NativeHarnessAdapter`, `Config`, `NativeConfig`, `ConfigError`, `ProxyNotReadyError`, `PathError`, `ConflictingEnvError`, `ModelAliasError`, `CodexVersionError`, `GeminiAdapter`, `ManagedClient`, `CodexVersion`, `CodexVersionClass`, `CodexVersionResult`, `CodexVersionRunner`

### Constants {#constants}

`DefaultCodexVersionProbeTimeout`, `CodexVersionUnknown`, `CodexVersionModern`, `CodexVersionBelowMinimum`, `CodexVersionLegacyNoVersion`, `CodexVersionUnparseable`, `CodexVersionNonzeroExit`, `CodexVersionTimeout`

### Variables {#variables}

`MinCodexVersion`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `EffortAliasError`, `ConfigError`, `ProxyNotReadyError`, `PathError`, `ConflictingEnvError`, `ModelAliasError`, `CodexVersionError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [launch/claude_connector.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/claude_connector.go)
- [launch/claudecode.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/claudecode.go)
- [launch/codex.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/codex.go)
- [launch/codex_connector.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/codex_connector.go)
- [launch/contracts.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/contracts.go)
- [launch/env.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/env.go)
- [launch/errors.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/errors.go)
- [launch/gemini.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/gemini.go)
- [launch/managed.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/managed.go)
- [launch/version.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/version.go)

Adjacent tests at the same commit:

- [launch/claude_connector_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/claude_connector_test.go)
- [launch/claudecode_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/claudecode_test.go)
- [launch/codex_connector_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/codex_connector_test.go)
- [launch/codex_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/codex_test.go)
- [launch/env_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/env_test.go)
- [launch/gemini_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/gemini_test.go)
- [launch/managed_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/managed_test.go)
- [launch/version_integration_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/version_integration_test.go)
- [launch/version_test.go](https://github.com/looprig/acp/blob/07678cf987c022c8a4583a71d40c77dd4f35fb0f/launch/version_test.go)

Run `GOWORK=off go test ./...` from the `acp` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
