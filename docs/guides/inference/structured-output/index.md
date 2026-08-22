---
id: guides/inference/structured-output/index
title: Overview
description: Request, validate, extract, and strictly decode one JSON object from model output.
audience: developer
section: guides
order: 57
publication: released
proofs:
  end-to-end-path: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Structured output overview

Looprig structured output has three separate boundaries: request admission, response representation, and typed decoding. `OutputSchema` describes the request; `ValidateOutputSchema` checks the portable subset; `StructuredResult` extracts one JSON object; `DecodeOutput` strictly decodes it into a caller-owned struct.

## End-to-end path

```mermaid
%%{init: {"theme":"base","themeVariables":{"background":"#111827","primaryColor":"#1f2937","primaryTextColor":"#f8fafc","primaryBorderColor":"#64748b","lineColor":"#94a3b8","secondaryColor":"#0f172a","tertiaryColor":"#172033","fontFamily":"Inter, ui-sans-serif, system-ui, sans-serif"}}}%%
flowchart LR
    schema[OutputSchema] --> validate[ValidateOutputSchema]
    validate --> request[Request.Output]
    request --> response[Response + AIMessage]
    response --> extract[StructuredResult]
    extract --> decode[DecodeOutput into struct]
    classDef dark fill:#1f2937,stroke:#94a3b8,color:#f8fafc
    class schema,validate,request,response,extract,decode dark
```

No stage trusts provider JSON blindly. Request validation rejects unsupported schema features before encoding. Response extraction ignores thinking blocks but rejects ambiguous block representations and unsafe finish reasons. Decoding uses `DisallowUnknownFields`, rejects trailing JSON, and commits to the caller's target only after a complete successful decode.

```go
type Result struct {
	Answer string `json:"answer"`
}

var result Result
if err := inference.DecodeOutput(response, &result); err != nil {
	return err
}
fmt.Println(result.Answer)
```

## Proof

- Source: [`inference/output.go`](https://github.com/looprig/inference/blob/main/output.go), [`inference/structured_result.go`](https://github.com/looprig/inference/blob/main/structured_result.go), [`inference/structured_errors.go`](https://github.com/looprig/inference/blob/main/structured_errors.go)
- Tests: [`inference/output_test.go`](https://github.com/looprig/inference/blob/main/output_test.go), [`inference/structured_result_test.go`](https://github.com/looprig/inference/blob/main/structured_result_test.go)

Related: [OutputSchema](/docs/guides/inference/structured-output/output-schema), [Schema validation](/docs/guides/inference/structured-output/validation), [Typed decoding](/docs/guides/inference/structured-output/decoding).
