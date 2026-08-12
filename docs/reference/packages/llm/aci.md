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

Package aci implements a client for the Dstack private-ai-gateway "aci/1" confidential-inference protocol.

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

- `func (e *NonFiniteFloatError) Error() string`
- `func (e *FloatOutOfDomainError) Error() string`
- `func (c *Client) Invoke(ctx context.Context, req inference.Request) (*inference.Response, error)`
- `func (c *Client) Stream(ctx context.Context, req inference.Request) (*stream.StreamReader[content.Chunk], error)`
- `func (e *UnpinnedPolicyError) Error() string`
- `func (o *Object) Set(key string, val Value) *Object`
- `func (o *Object) Len() int`
- `func (o *Object) KeyAt(i int) string`
- `func (o *Object) ValueAt(i int) Value`
- `func (e *FloatNotAllowedError) Error() string`
- `func (e *InvalidUTF8Error) Error() string`
- `func (p Policy) IsPinned() bool`

### Types {#types}

```go
type NonFiniteFloatError struct {
	Repr string
}
```

```go
type FloatOutOfDomainError struct {
	Value string
}
```

```go
type Client struct {
	// contains filtered or unexported fields
}
```

```go
type Option func(*Client)
```

```go
type UnpinnedPolicyError struct{}
```

```go
type Value interface {
	// contains filtered or unexported methods
}
```

```go
type String string
```

```go
type Int int64
```

```go
type Uint uint64
```

```go
type Number json.Number
```

```go
type Float float64
```

```go
type Bool bool
```

```go
type Null struct{}
```

```go
type Array []Value
```

```go
type Object struct {
	// contains filtered or unexported fields
}
```

```go
type FloatNotAllowedError struct {
	Literal string
}
```

```go
type InvalidUTF8Error struct {
	Where string
}
```

```go
type Policy struct {
	AcceptedWorkloadIDs map[string]struct{}

	AcceptedSourceProvenance map[ProvenanceKey]struct{}

	AcceptedAppIDs map[string]struct{}

	AcceptedKMSRootPubKeys map[string]struct{}
	// contains filtered or unexported fields
}
```

```go
type Receipt struct {
	APIVersion           string           `json:"api_version"`
	ReceiptID            string           `json:"receipt_id"`
	ChatID               *string          `json:"chat_id"`
	WorkloadID           string           `json:"workload_id"`
	WorkloadKeysetDigest string           `json:"workload_keyset_digest"`
	Endpoint             string           `json:"endpoint"`
	Method               string           `json:"method"`
	ServedAt             uint64           `json:"served_at"`
	EventLog             []ReceiptEvent   `json:"event_log"`
	Signature            ReceiptSignature `json:"signature"`
}
```

```go
type ReceiptEvent struct {
	Seq       uint64          `json:"seq"`
	EventType string          `json:"type"`
	Fields    json.RawMessage `json:"-"`
}
```

```go
type ReceiptSignature struct {
	Algo     string `json:"algo"`
	KeyID    string `json:"key_id"`
	ValueHex string `json:"value"`
}
```

```go
type ReceiptExpect struct {
	Endpoint          string
	Method            string
	Vendor            string
	ModelID           string
	ReqBody           []byte
	RespBodyCleartext []byte
	RespWireBytes     []byte
}
```

```go
type Report struct {
	APIVersion           string              `json:"api_version"`
	WorkloadID           string              `json:"workload_id"`
	WorkloadKeysetDigest string              `json:"workload_keyset_digest"`
	Attestation          Attestation         `json:"attestation"`
	ServiceCapabilities  ServiceCapabilities `json:"service_capabilities"`
}
```

```go
type Attestation struct {
	Vendor            string            `json:"vendor"`
	TEEType           string            `json:"tee_type"`
	Keyset            Keyset            `json:"workload_keyset"`
	ReportDataHex     string            `json:"report_data"`
	KeysetEndorsement KeysetEndorsement `json:"keyset_endorsement"`
	SourceProvenance  SourceProvenance  `json:"source_provenance"`
	Freshness         Freshness         `json:"freshness"`
	Evidence          Evidence          `json:"evidence"`
}
```

```go
type Keyset struct {
	Identity           WorkloadIdentity `json:"workload_identity"`
	Epoch              KeysetEpoch      `json:"keyset_epoch"`
	ReceiptSigningKeys []KeyEntry       `json:"receipt_signing_keys"`
	E2EEPublicKeys     []KeyEntry       `json:"e2ee_public_keys"`
	TLSPublicKeys      []TLSBinding     `json:"tls_public_keys"`
}
```

```go
type WorkloadIdentity struct {
	PublicKey PublicKey `json:"public_key"`
	Subject   *string   `json:"subject"`
}
```

```go
type PublicKey struct {
	Algo         string `json:"algo"`
	PublicKeyHex string `json:"public_key"`
}
```

```go
type KeysetEpoch struct {
	Version  uint64 `json:"version"`
	NotAfter uint64 `json:"not_after"`
}
```

```go
type KeyEntry struct {
	KeyID        string `json:"key_id"`
	Algo         string `json:"algo"`
	PublicKeyHex string `json:"public_key"`
}
```

```go
type TLSBinding struct {
	Domain        string `json:"domain"`
	SPKISHA256Hex string `json:"spki_sha256"`
}
```

```go
type KeysetEndorsement struct {
	Algo     string `json:"algo"`
	ValueHex string `json:"value"`
}
```

```go
type SourceProvenance struct {
	RepoURL         string  `json:"repo_url"`
	RepoCommit      string  `json:"repo_commit"`
	ImageDigest     *string `json:"image_digest"`
	ImageProvenance *string `json:"image_provenance"`
}
```

```go
type Freshness struct {
	FetchedAt  int64 `json:"fetched_at"`
	StaleAfter int64 `json:"stale_after"`
}
```

```go
type Evidence struct {
	Quote                string     `json:"quote"`
	QuoteReportData      string     `json:"quote_report_data"`
	EventLog             string     `json:"event_log"`
	VMConfig             string     `json:"vm_config"`
	KeyCustody           KeyCustody `json:"key_custody"`
	DownstreamTLSBinding TLSBinding `json:"downstream_tls_binding"`
}
```

```go
type KeyCustody struct {
	Provider string            `json:"provider"`
	Keys     []KeyCustodyEntry `json:"keys"`
}
```

```go
type KeyCustodyEntry struct {
	Role           string   `json:"role"`
	Path           string   `json:"path"`
	Purpose        string   `json:"purpose"`
	Algo           string   `json:"algo"`
	PublicKeyHex   string   `json:"public_key"`
	SignatureChain []string `json:"signature_chain"`
}
```

```go
type ServiceCapabilities struct {
	SupportedE2EEVersions []string `json:"supported_e2ee_versions"`
}
```

```go
type EventLogEntry struct {
	IMR          uint32 `json:"imr"`
	EventType    uint32 `json:"event_type"`
	Digest       string `json:"digest"`
	Event        string `json:"event"`
	EventPayload string `json:"event_payload"`
}
```

```go
type ProvenanceKey struct {
	RepoURL    string
	RepoCommit string
}
```

```go
type VerifiedReport struct {
	WorkloadID string

	WorkloadKeysetDigest string

	Keyset Keyset
}
```

### Constants {#constants}

`SupportedAPIVersion`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `FloatNotAllowedError`, `FloatOutOfDomainError`, `InvalidUTF8Error`, `NonFiniteFloatError`, `UnpinnedPolicyError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

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

Run `go test ./...` from a checkout of the `llm` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
