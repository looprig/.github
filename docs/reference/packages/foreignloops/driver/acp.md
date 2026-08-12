---
id: reference/packages/foreignloops/driver/acp
title: driver/acp package · acp
description: Reference for adapting an ACP child to the foreign driver and Harness builder contracts.
audience: developer
section: reference
order: 202
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-foreignloops
  exported-surface: release-github-com-looprig-foreignloops
  functions: release-github-com-looprig-foreignloops
  methods: release-github-com-looprig-foreignloops
  types: release-github-com-looprig-foreignloops
  constants: release-github-com-looprig-foreignloops
  variables: release-github-com-looprig-foreignloops
  ownership-and-errors: release-github-com-looprig-foreignloops
  source-and-runnable-proof: release-github-com-looprig-foreignloops
---

# driver/acp package · acp

Import path: `github.com/looprig/foreignloops/driver/acp`. The source is pinned to github.com/looprig/foreignloops@v0.2.3.

## Package role {#package-role}

`Driver` owns ACP client session setup, updates, prompts, cancellation, and history mapping for one foreign runtime. `Config` describes harness selection, executable, credentials, posture, workspace, and child MCP server definitions.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func BuildWith(cfg Config) foreign.Builder`
- `func BuildWithServices(cfg Config) foreign.ServicesBuilder`
- `func BuildRestoredWith(cfg Config) foreign.RestoredBuilder`
- `func BuildRestoredWithServices(cfg Config) foreign.ServicesRestoredBuilder`
- `func New(ctx context.Context, cfg Config) (*Driver, error)`

### Methods {#methods}

- `func (a *initAgent) Spawn(ctx context.Context, turn driver.Turn) (driver.Stream, error)`
- `func (a *initAgent) Close() error`
- `func (a *initAgent) Steer(ctx context.Context, request driver.SteerRequest) (driver.SteerResult, error)`
- `func (s *initStream) Events() <-chan driver.Event`
- `func (s *initStream) Observations() <-chan driver.Observation`
- `func (s *orderedInitStream) Events() <-chan driver.Event`
- `func (s *orderedInitStream) Observations() <-chan driver.Observation`
- `func (s *orderedInitStream) History() (driver.History, error)`
- `func (s *orderedInitStream) Close() error`
- `func (s *legacyInitStream) Events() <-chan driver.Event`
- `func (s *legacyInitStream) History() (driver.History, error)`
- `func (s *legacyInitStream) Close() error`
- `func (s *initStream) History() (driver.History, error)`
- `func (s *initStream) Close() error`
- `func (e *ConfigError) Error() string`
- `func (a steerAdmission) String() string`
- `func (d *steerDispatcher) Events() <-chan dispatcherEvent`
- `func (d *Driver) AgentSessionID() string`
- `func (d *Driver) Steer(ctx context.Context, request driver.SteerRequest) (driver.SteerResult, error)`
- `func (d *Driver) Close() error`
- `func (c *realClient) InitializeMetadata() (client.InitializeMetadata, error)`
- `func (c *realClient) NewSession(ctx context.Context, p client.NewSessionParams) (session, error)`
- `func (c *realClient) LoadSession(ctx context.Context, p client.LoadSessionParams) (session, error)`
- `func (c *realCodexConnector) SelectModel(ctx context.Context, sess session) error`
- `func (c *realCodexConnector) SelectEffort(ctx context.Context, sess session) error`
- `func (c *realClaudeConnector) SelectDefaultModel(ctx context.Context, sess session) error`
- `func (c *realClaudeConnector) SelectSmallModel(ctx context.Context, sess session) error`
- `func (c *realClaudeConnector) SelectEffort(ctx context.Context, sess session) error`
- `func (c *realClaudeConnector) ApplyPermissionMode(ctx context.Context, sess session, modeID protocol.SessionModeID) error`
- `func (h *permissionHandler) RequestPermission(_ context.Context, req protocol.RequestPermissionRequest) (protocol.RequestPermissionResponse, error)`
- `func (s steerReservationStatus) String() string`
- `func (legacyTurnSession) WaitForUpdates(context.Context) error`
- `func (r steerSendResult) String() string`
- `func (s *stream) Events() <-chan driver.Event`
- `func (s *stream) History() (driver.History, error)`
- `func (s *stream) Close() error`
- `func (s *orderedStream) Events() <-chan driver.Event`
- `func (s *orderedStream) Observations() <-chan driver.Observation`
- `func (s *orderedStream) History() (driver.History, error)`
- `func (s *orderedStream) Close() error`
- `func (d *Driver) Spawn(ctx context.Context, turn driver.Turn) (driver.Stream, error)`

### Types {#types}

`Harness`, `Config`, `ConfigError`, `Driver`

### Constants {#constants}

`HarnessClaudeCode`, `HarnessCodex`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ConfigError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [driver/acp/acp.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/acp.go)
- [driver/acp/builder.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/builder.go)
- [driver/acp/config.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/config.go)
- [driver/acp/dispatcher.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/dispatcher.go)
- [driver/acp/driver.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/driver.go)
- [driver/acp/permissions.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/permissions.go)
- [driver/acp/projection.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/projection.go)
- [driver/acp/reservation.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/reservation.go)
- [driver/acp/steering.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/steering.go)
- [driver/acp/translate.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/translate.go)
- [driver/acp/turn.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/turn.go)

Adjacent tests at the same commit:

- [driver/acp/arbiter_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/arbiter_test.go)
- [driver/acp/builder_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/builder_test.go)
- [driver/acp/config_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/config_test.go)
- [driver/acp/driver_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/driver_test.go)
- [driver/acp/interrupt_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/interrupt_test.go)
- [driver/acp/permissions_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/permissions_test.go)
- [driver/acp/quality_findings_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/quality_findings_test.go)
- [driver/acp/steering_integration_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/steering_integration_test.go)
- [driver/acp/steering_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/steering_test.go)
- [driver/acp/turn_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/turn_test.go)

Run `GOWORK=off go test ./...` from the `foreignloops` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
