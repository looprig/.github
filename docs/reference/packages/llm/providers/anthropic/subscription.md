---
id: reference/packages/llm/providers/anthropic/subscription
title: subscription package · providers/anthropic/subscription
description: Reference for the subscription package at github.com/looprig/llm/providers/anthropic/subscription, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 261
publication: released
proofs:
  package-role: release-github-com-looprig-llm
  exported-surface: release-github-com-looprig-llm
  functions: release-github-com-looprig-llm
  methods: release-github-com-looprig-llm
  types: release-github-com-looprig-llm
  constants: release-github-com-looprig-llm
  variables: release-github-com-looprig-llm
  ownership-and-errors: release-github-com-looprig-llm
  source-and-runnable-proof: release-github-com-looprig-llm
---

# subscription package · providers/anthropic/subscription

Import path: `github.com/looprig/llm/providers/anthropic/subscription`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func AnthropicRegistration() RegistrationGate`

### Methods {#methods}

- `func (e *UnsupportedRegistrationError) Error() string`
- `func (e *UnsupportedRegistrationError) Format(state fmt.State, verb rune)`
- `func (e *UnsupportedRegistrationError) LogValue() slog.Value`
- `func (g RegistrationGate) Status() Status`
- `func (g RegistrationGate) Provider() llm.Provider`
- `func (g RegistrationGate) ReviewedAt() time.Time`
- `func (g RegistrationGate) ReviewedDate() string`
- `func (g RegistrationGate) EvidenceURLs() []string`
- `func (g RegistrationGate) Format(state fmt.State, verb rune)`
- `func (g RegistrationGate) LogValue() slog.Value`
- `func (g RegistrationGate) Require() error`

### Types {#types}

`UnsupportedRegistrationError`, `Status`, `RegistrationGate`

### Constants {#constants}

`StatusUnavailable`, `StatusBlocked`, `RegistrationStatusUnavailable`, `RegistrationStatusBlocked`, `ReviewedAtDate`, `EvidenceAuthenticationURL`, `EvidenceLegalURL`, `EvidenceAgentOverviewURL`, `EvidenceAgentQuickstartURL`, `EvidenceThirdPartyUsageURL`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `UnsupportedRegistrationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [providers/anthropic/subscription/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/anthropic/subscription/errors.go)
- [providers/anthropic/subscription/registration.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/anthropic/subscription/registration.go)

Adjacent tests at the same commit:

- [providers/anthropic/subscription/registration_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/anthropic/subscription/registration_test.go)

Run `GOWORK=off go test ./...` from the `llm` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
