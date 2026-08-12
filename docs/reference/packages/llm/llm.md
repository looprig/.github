---
id: reference/packages/llm/llm
title: llm package · llm
description: Reference for the llm package at github.com/looprig/llm, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 200
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

# llm package · llm

Import path: `github.com/looprig/llm`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

Package llm is the batteries-included provider SDK layered on the neutral github.com/looprig/inference model-call contract.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func AuthPolicyForModel(selected model.Model) (AuthPolicy, error)`
- `func ValidateModel(m model.Model) error`

### Methods {#methods}

- `func (b AuthBinding) Descriptor() (credentials.Descriptor, error)`
- `func (b AuthBinding) Valid() bool`
- `func (p AuthPolicy) Validate() error`
- `func (p AuthPolicy) Accepts(descriptor credentials.Descriptor) bool`
- `func (p AuthPolicy) Match(descriptor credentials.Descriptor) error`
- `func (e *InvalidAuthPolicyError) Error() string`
- `func (e *InvalidAuthPolicyError) Unwrap() error`
- `func (e *AuthPolicyMismatchError) Error() string`
- `func (e *AttestationError) Error() string`
- `func (e *AttestationError) Unwrap() error`
- `func (e *AuthRequiredError) Error() string`
- `func (e *CounterSupportError) Error() string`
- `func (e *CounterDirectConstructionError) Error() string`
- `func (p Provider) RequiresKey() (bool, error)`
- `func (p Provider) RequiredAuth() (auth.AuthKind, error)`
- `func (p Provider) AuthPolicy(format model.APIFormat) (AuthPolicy, error)`

### Types {#types}

```go
type AuthBinding struct {
	Provider  string
	Transport string
	Scheme    credentials.Scheme
	Usage     credentials.UsageClass
	Issuer    string
	Audience  string
}
```

```go
type AuthPolicy struct {
	Accepted []AuthBinding
}
```

```go
type InvalidAuthPolicyError struct {
	Reason string
	Err    error
}
```

```go
type AuthPolicyMismatchError struct{ Reason string }
```

```go
type AttestationError struct {
	Reason string
	Err    error
}
```

```go
type AuthRequiredError struct {
	Provider Provider
	Kind     auth.AuthKind
}
```

```go
type CounterSupportReason string
```

```go
type CounterSupportError struct {
	Provider  Provider
	Reason    CounterSupportReason
	APIFormat model.APIFormat
}
```

```go
type CounterDirectConstructionReason string
```

```go
type CounterConstructor string
```

```go
type CounterDirectConstructionError struct {
	Provider Provider
	Reason   CounterDirectConstructionReason
	Use      CounterConstructor
}
```

```go
type Provider string
```

### Constants {#constants}

`APIFormatBedrockConverse`, `AuthSigV4`, `AuthOAuth`, `AuthGCP`, `AuthServiceKey`, `AuthToken`, `CounterSupportExactUnavailable`, `CounterSupportAPIFormatUnavailable`, `CounterDirectConstructionNeedsSigV4`, `CounterConstructorBedrock`, `ProviderLMStudio`, `ProviderPhala`, `ProviderChutes`, `ProviderOpenRouter`, `ProviderOpenAI`, `ProviderAzure`, `ProviderAzureCognitiveServices`, `ProviderAnthropic`, `ProviderXAI`, `ProviderBedrock`, `Provider302AI`, `ProviderAtomicChat`, `ProviderBaseten`, `ProviderCerebras`, `ProviderCloudflareAIGateway`, `ProviderCloudflareWorkersAI`, `ProviderCortecs`, `ProviderDeepSeek`, `ProviderDeepInfra`, `ProviderDigitalOcean`, `ProviderFrogBot`, `ProviderFireworks`, `ProviderGitLab`, `ProviderGitHubCopilot`, `ProviderGMICloud`, `ProviderGoogleVertex`, `ProviderGoogleVertexAnthropic`, `ProviderGroq`, `ProviderHuggingFace`, `ProviderHelicone`, `ProviderLlama`, `ProviderLlamaCPP`, `ProviderIONet`, `ProviderMoonshot`, `ProviderMiniMax`, `ProviderNVIDIA`, `ProviderNebius`, `ProviderOllama`, `ProviderOllamaCloud`, `ProviderOpenCode`, `ProviderOpenCodeGo`, `ProviderLLMGateway`, `ProviderSAP`, `ProviderSTACKIT`, `ProviderOVHCloud`, `ProviderScaleway`, `ProviderSnowflakeCortex`, `ProviderSynthetic`, `ProviderTogetherAI`, `ProviderVenice`, `ProviderVercel`, `ProviderZAI`, `ProviderZenMux`, `ProviderGoogle`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `AttestationError`, `AuthPolicyMismatchError`, `AuthRequiredError`, `CounterDirectConstructionError`, `CounterSupportError`, `InvalidAuthPolicyError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [apiformat.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/apiformat.go)
- [authpolicy.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/authpolicy.go)
- [errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/errors.go)
- [llm.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/llm.go)
- [provider.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/provider.go)
- [validate.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/validate.go)

Adjacent tests at the same commit:

- [apiformat_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/apiformat_test.go)
- [authpolicy_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/authpolicy_test.go)
- [errors_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/errors_test.go)
- [provider_internal_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/provider_internal_test.go)
- [provider_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/provider_test.go)
- [validate_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/validate_test.go)

Run `go test ./...` from a checkout of the `llm` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
