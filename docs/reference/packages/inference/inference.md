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

Import path: `github.com/looprig/inference`. The source is pinned to github.com/looprig/inference@v0.9.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

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

- `func (o OutputSchema) Clone() OutputSchema`
- `func (v *schemaStringValue) UnmarshalJSON(raw []byte) error`
- `func (v *schemaPropertiesValue) UnmarshalJSON(raw []byte) error`
- `func (v *schemaRawValue) UnmarshalJSON(raw []byte) error`
- `func (v *schemaEnumValue) UnmarshalJSON(raw []byte) error`
- `func (v *schemaStringsValue) UnmarshalJSON(raw []byte) error`
- `func (v *schemaBoolValue) UnmarshalJSON(raw []byte) error`
- `func (e *SchemaValidationError) Error() string`
- `func (e *StructuredOutputUnsupportedError) Error() string`
- `func (e *StructuredOutputWithToolsUnsupportedError) Error() string`
- `func (e *ImageInputUnsupportedError) Error() string`
- `func (e *StructuredOutputConflictError) Error() string`
- `func (e *MalformedStructuredOutputError) Error() string`
- `func (e *StructuredOutputFinishError) Error() string`

### Types {#types}

`Client`, `ToolChoice`, `Request`, `Response`, `Tool`, `OutputSchema`, `SchemaValidationField`, `SchemaValidationReason`, `SchemaValidationError`, `StructuredOutputUnsupportedError`, `StructuredOutputWithToolsUnsupportedError`, `ImageInputUnsupportedError`, `StructuredOutputConflictError`, `MalformedStructuredOutputReason`, `MalformedStructuredOutputError`, `StructuredOutputFinishError`

### Constants {#constants}

`ToolChoiceAuto`, `ToolChoiceRequired`, `StructuredOutputToolName`, `StructuredOutputRevision`, `MaxStructuredOutputDiagnosticBytes`, `MaxStructuredResultBytes`, `StructuredOutputFinishReasonOther`, `SchemaFieldName`, `SchemaFieldDescription`, `SchemaFieldSchema`, `SchemaFieldKeyword`, `SchemaFieldType`, `SchemaFieldProperties`, `SchemaFieldItems`, `SchemaFieldEnum`, `SchemaFieldRequired`, `SchemaFieldAdditionalProperties`, `SchemaFieldOutput`, `SchemaReasonEmpty`, `SchemaReasonInvalid`, `SchemaReasonReserved`, `SchemaReasonTooLong`, `SchemaReasonInvalidUTF8`, `SchemaReasonMalformed`, `SchemaReasonTooLarge`, `SchemaReasonRootNotObject`, `SchemaReasonUnknownKeyword`, `SchemaReasonMissing`, `SchemaReasonUnsupported`, `SchemaReasonMustBeFalse`, `SchemaReasonDuplicate`, `SchemaReasonUnknownProperty`, `SchemaReasonTypeMismatch`, `SchemaReasonTooDeep`, `SchemaReasonTooManyProperties`, `SchemaReasonInvalidTarget`, `SchemaReasonDecodeFailed`, `MalformedReasonNilResponse`, `MalformedReasonNilMessage`, `MalformedReasonWrongRole`, `MalformedReasonEmpty`, `MalformedReasonMalformedJSON`, `MalformedReasonRootNotObject`, `MalformedReasonInvalidRepresentation`, `MalformedReasonAmbiguous`, `MalformedReasonInvalidBlock`, `MalformedReasonNilBlock`, `MalformedReasonTooLarge`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `SchemaValidationError`, `StructuredOutputUnsupportedError`, `StructuredOutputWithToolsUnsupportedError`, `ImageInputUnsupportedError`, `StructuredOutputConflictError`, `MalformedStructuredOutputError`, `StructuredOutputFinishError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [client.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/client.go)
- [json_unique.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/json_unique.go)
- [output.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/output.go)
- [structured_errors.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/structured_errors.go)
- [structured_result.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/structured_result.go)

Adjacent tests at the same commit:

- [client_images_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/client_images_test.go)
- [client_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/client_test.go)
- [output_fuzz_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/output_fuzz_test.go)
- [output_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/output_test.go)
- [structured_result_internal_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/structured_result_internal_test.go)
- [structured_result_test.go](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/structured_result_test.go)

Run `GOWORK=off go test ./...` from the `inference` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
