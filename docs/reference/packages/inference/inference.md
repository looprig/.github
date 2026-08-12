---
id: reference/packages/inference/inference
title: inference package · inference
description: Reference for the inference package at github.com/looprig/inference, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 100
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
  - stage-22-model-gateway
proofs:
  package-role: release-github-com-looprig-inference
  exported-surface: release-github-com-looprig-inference
  functions: release-github-com-looprig-inference
  methods: release-github-com-looprig-inference
  types: release-github-com-looprig-inference
  constants: release-github-com-looprig-inference
  variables: release-github-com-looprig-inference
  ownership-and-errors: release-github-com-looprig-inference
  source-and-runnable-proof: release-github-com-looprig-inference
---

# inference package · inference

Import path: `github.com/looprig/inference`. The source is pinned to github.com/looprig/inference@v0.10.0.

## Package role {#package-role}

Package inference exposes the source-defined API.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func ValidateRequestFeatures(req Request) error`
- `func ValidateOutputSchema(output OutputSchema) error`
- `func StructuredResult(resp *Response) (json.RawMessage, error)`
- `func StructuredMessageResult(msg *content.AIMessage) (json.RawMessage, error)`
- `func DecodeOutput(resp *Response, out any) error`
- `func DecodeMessageOutput(msg *content.AIMessage, out any) error`

### Methods {#methods}

- `func (e *InvalidTransientMessagesError) Error() string`
- `func (o OutputSchema) Clone() OutputSchema`
- `func (e *SchemaValidationError) Error() string`
- `func (e *StructuredOutputUnsupportedError) Error() string`
- `func (e *StructuredOutputWithToolsUnsupportedError) Error() string`
- `func (e *ImageInputUnsupportedError) Error() string`
- `func (e *StructuredOutputConflictError) Error() string`
- `func (e *MalformedStructuredOutputError) Error() string`
- `func (e *StructuredOutputFinishError) Error() string`

### Types {#types}

```go
type Client interface {
	Invoke(ctx context.Context, req Request) (*Response, error)
	Stream(ctx context.Context, req Request) (*stream.StreamReader[content.Chunk], error)
}
```

```go
type ToolChoice uint8
```

```go
type Request struct {
	Model             model.Model
	System            string
	Messages          content.AgenticMessages
	TransientMessages int
	Tools             []Tool
	Output            *OutputSchema
	ToolChoice        ToolChoice
	Override          *model.Sampling
}
```

```go
type InvalidTransientMessagesError struct {
	Transient int
	Messages  int
}
```

```go
type Response struct {
	Message      *content.AIMessage
	Usage        *content.Usage
	Model        string
	FinishReason stream.FinishReason

	Attempts int
}
```

```go
type Tool struct {
	Name        string
	Description string
	Schema      json.RawMessage
}
```

```go
type OutputSchema struct {
	Name        string
	Description string
	Schema      json.RawMessage
	Strict      bool
}
```

```go
type SchemaValidationField string
```

```go
type SchemaValidationReason string
```

```go
type SchemaValidationError struct {
	Field      SchemaValidationField
	ReasonCode SchemaValidationReason
}
```

```go
type StructuredOutputUnsupportedError struct {
	Model string
}
```

```go
type StructuredOutputWithToolsUnsupportedError struct {
	Model string
}
```

```go
type ImageInputUnsupportedError struct {
	Model string
}
```

```go
type StructuredOutputConflictError struct {
	Feature string
}
```

```go
type MalformedStructuredOutputReason string
```

```go
type MalformedStructuredOutputError struct {
	ReasonCode MalformedStructuredOutputReason
	Length     int
	SHA256     [sha256.Size]byte
}
```

```go
type StructuredOutputFinishError struct {
	Reason stream.FinishReason
}
```

### Constants {#constants}

`ToolChoiceAuto`, `ToolChoiceRequired`, `StructuredOutputToolName`, `StructuredOutputRevision`, `MaxStructuredOutputDiagnosticBytes`, `MaxStructuredResultBytes`, `StructuredOutputFinishReasonOther`, `SchemaFieldName`, `SchemaFieldDescription`, `SchemaFieldSchema`, `SchemaFieldKeyword`, `SchemaFieldType`, `SchemaFieldProperties`, `SchemaFieldItems`, `SchemaFieldEnum`, `SchemaFieldRequired`, `SchemaFieldAdditionalProperties`, `SchemaFieldOutput`, `SchemaReasonEmpty`, `SchemaReasonInvalid`, `SchemaReasonReserved`, `SchemaReasonTooLong`, `SchemaReasonInvalidUTF8`, `SchemaReasonMalformed`, `SchemaReasonTooLarge`, `SchemaReasonRootNotObject`, `SchemaReasonUnknownKeyword`, `SchemaReasonMissing`, `SchemaReasonUnsupported`, `SchemaReasonMustBeFalse`, `SchemaReasonDuplicate`, `SchemaReasonUnknownProperty`, `SchemaReasonTypeMismatch`, `SchemaReasonTooDeep`, `SchemaReasonTooManyProperties`, `SchemaReasonInvalidTarget`, `SchemaReasonDecodeFailed`, `MalformedReasonNilResponse`, `MalformedReasonNilMessage`, `MalformedReasonWrongRole`, `MalformedReasonEmpty`, `MalformedReasonMalformedJSON`, `MalformedReasonRootNotObject`, `MalformedReasonInvalidRepresentation`, `MalformedReasonAmbiguous`, `MalformedReasonInvalidBlock`, `MalformedReasonNilBlock`, `MalformedReasonTooLarge`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ImageInputUnsupportedError`, `InvalidTransientMessagesError`, `MalformedStructuredOutputError`, `SchemaValidationError`, `StructuredOutputConflictError`, `StructuredOutputFinishError`, `StructuredOutputUnsupportedError`, `StructuredOutputWithToolsUnsupportedError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [client.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/client.go)
- [json_unique.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/json_unique.go)
- [output.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/output.go)
- [structured_errors.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/structured_errors.go)
- [structured_result.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/structured_result.go)

Adjacent tests at the same commit:

- [client_images_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/client_images_test.go)
- [client_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/client_test.go)
- [output_fuzz_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/output_fuzz_test.go)
- [output_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/output_test.go)
- [structured_result_internal_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/structured_result_internal_test.go)
- [structured_result_test.go](https://github.com/looprig/inference/blob/081186f1b724b3d5220c15eccbd3762e0a55468d/structured_result_test.go)

Run `go test ./...` from a checkout of the `inference` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
