---
id: reference/packages/llm/aci
title: aci package · aci
description: Reference for the aci package at github.com/looprig/llm/aci, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 201
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

# aci package · aci

Import path: `github.com/looprig/llm/aci`. The source is pinned to github.com/looprig/llm@v0.13.3.

## Package role {#package-role}

This package defines attested-client interfaces, canonical values, receipts, and reports. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; API keys, OAuth tokens, and signing credentials are injected through the credential boundary rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func CompactJSON(v Value) ([]byte, error)`
- `func Sha256HexBytes(b []byte) (string, error)`
- `func ParseBodyValue(data []byte) (Value, error)`
- `func WithHTTPDoer(d httpDoer) Option`
- `func WithNow(now func() time.Time) Option`
- `func WithQuoteVerifier(v quoteVerifier) Option`
- `func WithAttestFunc(attest attestFunc) Option`
- `func WithNonceFunc(newNonce func() string) Option`
- `func New(baseURL, apiKey string, policy Policy, opts ...Option) (inference.Client, error)`
- `func NewObject() *Object`
- `func Canonicalize(v Value) ([]byte, error)`
- `func Sha256Raw(v Value) ([32]byte, error)`
- `func Sha256Hex(v Value) (string, error)`
- `func ParseValue(data []byte) (Value, error)`
- `func UnpinnedPolicy() Policy`
- `func ParseReceipt(data []byte) (*Receipt, error)`
- `func VerifyReceipt(receiptJSON []byte, verified *VerifiedReport, expect ReceiptExpect) error`
- `func ParseReport(data []byte) (*Report, error)`
- `func VerifyReport(reportJSON []byte, nonce *string, now time.Time, policy Policy) (*VerifiedReport, error)`

### Methods {#methods}

- `func (e *reportDataMismatchError) Error() string`
- `func (e *NonFiniteFloatError) Error() string`
- `func (e *FloatOutOfDomainError) Error() string`
- `func (c *Client) Invoke(ctx context.Context, req inference.Request) (*inference.Response, error)`
- `func (c *Client) Stream(ctx context.Context, req inference.Request) (*stream.StreamReader[content.Chunk], error)`
- `func (e *encodeError) Error() string`
- `func (e *encodeError) Unwrap() error`
- `func (e *decodeError) Error() string`
- `func (e *decodeError) Unwrap() error`
- `func (e *bodyShapeError) Error() string`
- `func (e *receiptFetchError) Error() string`
- `func (e *attestNonceError) Error() string`
- `func (e *invalidURLError) Error() string`
- `func (e *invalidURLError) Unwrap() error`
- `func (e *responseTooLargeError) Error() string`
- `func (e *streamParseError) Error() string`
- `func (e *streamParseError) Unwrap() error`
- `func (e *e2eeSealError) Error() string`
- `func (e *e2eeSealError) Unwrap() error`
- `func (e *e2eeOpenError) Error() string`
- `func (e *e2eeOpenError) Unwrap() error`
- `func (e *e2eeLengthError) Error() string`
- `func (e *e2eeNoModelKeyError) Error() string`
- `func (e *e2eeAmbiguityError) Error() string`
- `func (e *e2eeModelFieldError) Error() string`
- `func (e *e2eePubKeyParseError) Error() string`
- `func (e *e2eePubKeyParseError) Unwrap() error`
- `func (e *e2eeReplayError) Error() string`
- `func (e *e2eeBodyShapeError) Error() string`
- `func (e *apiVersionMismatchError) Error() string`
- `func (e *UnpinnedPolicyError) Error() string`
- `func (e *digestMismatchError) Error() string`
- `func (o *Object) Set(key string, val Value) *Object`
- `func (o *Object) Len() int`
- `func (o *Object) KeyAt(i int) string`
- `func (o *Object) ValueAt(i int) Value`
- `func (e *FloatNotAllowedError) Error() string`
- `func (e *nilValueError) Error() string`
- `func (e *InvalidUTF8Error) Error() string`
- `func (e *parseError) Error() string`
- `func (e *parseError) Unwrap() error`
- `func (e *trailingDataError) Error() string`
- `func (e *malformedTokenError) Error() string`
- `func (e *endorsementError) Error() string`
- `func (e *endorsementError) Unwrap() error`
- `func (e *kmsCustodyError) Error() string`
- `func (e *kmsCustodyError) Unwrap() error`
- `func (p Policy) IsPinned() bool`
- `func (e *receiptParseError) Error() string`
- `func (e *receiptParseError) Unwrap() error`
- `func (e *receiptEventFieldsError) Error() string`
- `func (e *receiptVerifyError) Error() string`
- `func (e *receiptVerifyError) Unwrap() error`
- `func (e *upstreamUnverifiedError) Error() string`
- `func (e *reportParseError) Error() string`
- `func (e *reportParseError) Unwrap() error`
- `func (e *eventLogParseError) Error() string`
- `func (e *eventLogParseError) Unwrap() error`
- `func (e *digestDecodeError) Error() string`
- `func (e *digestDecodeError) Unwrap() error`
- `func (e *appIDDecodeError) Error() string`
- `func (e *appIDDecodeError) Unwrap() error`
- `func (e *missingAppIDError) Error() string`
- `func (e *rtmr3MismatchError) Error() string`
- `func (e *appIDRejectedError) Error() string`
- `func (e *provenanceRejectedError) Error() string`
- `func (e *teeTypeError) Error() string`
- `func (e *quoteDecodeError) Error() string`
- `func (e *quoteDecodeError) Unwrap() error`
- `func (e *reportDataPlacementError) Error() string`
- `func (e *freshnessError) Error() string`
- `func (e *workloadIDRejectedError) Error() string`

### Types {#types}

`NonFiniteFloatError`, `FloatOutOfDomainError`, `Client`, `Option`, `UnpinnedPolicyError`, `Value`, `String`, `Int`, `Uint`, `Number`, `Float`, `Bool`, `Null`, `Array`, `Object`, `FloatNotAllowedError`, `InvalidUTF8Error`, `Policy`, `Receipt`, `ReceiptEvent`, `ReceiptSignature`, `ReceiptExpect`, `Report`, `Attestation`, `Keyset`, `WorkloadIdentity`, `PublicKey`, `KeysetEpoch`, `KeyEntry`, `TLSBinding`, `KeysetEndorsement`, `SourceProvenance`, `Freshness`, `Evidence`, `KeyCustody`, `KeyCustodyEntry`, `ServiceCapabilities`, `EventLogEntry`, `ProvenanceKey`, `VerifiedReport`

### Constants {#constants}

`SupportedAPIVersion`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `NonFiniteFloatError`, `FloatOutOfDomainError`, `UnpinnedPolicyError`, `FloatNotAllowedError`, `InvalidUTF8Error`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [aci/binding.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/binding.go)
- [aci/body.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/body.go)
- [aci/client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/client.go)
- [aci/e2ee.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/e2ee.go)
- [aci/errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/errors.go)
- [aci/identity.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/identity.go)
- [aci/jcs.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/jcs.go)
- [aci/keys.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/keys.go)
- [aci/policy.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/policy.go)
- [aci/receipt.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/receipt.go)
- [aci/report.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/report.go)
- [aci/rtmr.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/rtmr.go)
- [aci/session.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/session.go)
- [aci/verify.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/verify.go)

Adjacent tests at the same commit:

- [aci/binding_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/binding_test.go)
- [aci/body_fuzz_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/body_fuzz_test.go)
- [aci/body_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/body_test.go)
- [aci/client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/client_test.go)
- [aci/e2ee_fuzz_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/e2ee_fuzz_test.go)
- [aci/e2ee_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/e2ee_test.go)
- [aci/errors_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/errors_test.go)
- [aci/identity_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/identity_test.go)
- [aci/jcs_fuzz_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/jcs_fuzz_test.go)
- [aci/jcs_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/jcs_test.go)
- [aci/keys_fuzz_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/keys_fuzz_test.go)
- [aci/keys_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/keys_test.go)
- [aci/live_integration_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/live_integration_test.go)
- [aci/policy_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/policy_test.go)
- [aci/receipt_fuzz_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/receipt_fuzz_test.go)
- [aci/receipt_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/receipt_test.go)
- [aci/report_fuzz_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/report_fuzz_test.go)
- [aci/report_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/report_test.go)
- [aci/rtmr_fuzz_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/rtmr_fuzz_test.go)
- [aci/rtmr_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/rtmr_test.go)
- [aci/session_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/session_test.go)
- [aci/verify_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/verify_test.go)
- [aci/verifyreport_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/aci/verifyreport_test.go)

Run `GOWORK=off go test ./...` from the `llm` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
