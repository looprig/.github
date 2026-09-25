---
id: guides/harness/compaction/summary-validation
title: Summary Validation
description: Describe validation of a compaction summary before commit.
audience: developer
section: guides
order: 21
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  input-and-output-types: [release-github-com-looprig-harness]
  transcript-validation: [release-github-com-looprig-harness]
  summary-xml-grammar: [release-github-com-looprig-harness]
  typed-invalid-summary-reasons: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Summary Validation

Summary validation has a typed input/output boundary before the replacement can
be committed. Identity checks happen before content checks, and all rejection
reasons are bounded.

## Input and output types

```go
// package loop
type CompactionInput struct {
	Basis              event.ContextBasis
	Model              model.ModelKey
	RequestFingerprint [32]byte
	Transcript         content.AgenticMessages
	MaxSummaryTokens   content.TokenCount
}

type CompactionOutput struct {
	Basis              event.ContextBasis
	Model              model.ModelKey
	RequestFingerprint [32]byte
	Summary            *content.UserMessage
}

func (CompactionInput) Validate() error
func (CompactionOutput) Validate() error
```

Input requires a nonzero basis revision and ThroughEventID, valid model key,
nonzero fingerprint, nonempty supported transcript, and positive summary token
budget. Output must match identity fields and contain exactly one nonempty user
text block.

Proof: [compaction input/output contracts](https://github.com/looprig/harness/blob/main/pkg/loop/compaction.go) and [contract tests](https://github.com/looprig/harness/blob/main/pkg/loop/compaction_test.go).

## Transcript validation

Supported messages are User, AI, System, and ToolResult with matching roles.
Supported leaf blocks are Text, Refusal, Image, Audio, Document, Thinking, and
ToolUse;
ToolResult content may nest to a maximum depth of 128. Typed nil messages or
blocks, unsupported block types, malformed JSON, and an empty transcript are
rejected before adapter serialization.

Proof: [transcript validator](https://github.com/looprig/harness/blob/main/pkg/loop/compaction.go) and [fuzz/contract tests](https://github.com/looprig/harness/blob/main/pkg/loop/compaction_test.go).

## Summary XML grammar

The internal parser accepts exactly one unnamespaced root
`<conversation_summary>` with no attributes, comments, directives, processing
instructions, CDATA, or extra text. Its child order is exactly:

```xml
<conversation_summary>
  <goal>...</goal>
  <constraints>...</constraints>
  <decisions>...</decisions>
  <state>...</state>
  <open_items>...</open_items>
</conversation_summary>
```

`goal` and `state` must contain nonblank text. The parser preserves the raw
escaped XML in one `content.TextBlock`; it does not turn XML sections into
separate conversation blocks.

Proof: [strict summary parser](https://github.com/looprig/harness/blob/main/internal/loopruntime/compaction.go) and [parser tests](https://github.com/looprig/harness/blob/main/internal/loopruntime/compaction_test.go).

## Typed invalid-summary reasons

`loop.InvalidSummaryError.Reason` is one of `InvalidSummaryWire`,
`InvalidSummaryIdentity`, `InvalidSummaryOutputShape`,
`InvalidSummaryByteLimit`, `InvalidSummaryTokenUsage`,
`InvalidSummaryTokenLimit`, `InvalidSummaryXMLSyntax`,
`InvalidSummaryXMLRoot`, `InvalidSummaryXMLStructure`, or
`InvalidSummaryXMLContent`. A post-replacement complete-request count that
exceeds its limit is `*loop.SummaryTooLargeError`.

Proof: [invalid summary errors](https://github.com/looprig/harness/blob/main/pkg/loop/compaction.go) and [adapter validation tests](https://github.com/looprig/harness/blob/main/internal/sessionruntime/compaction_adapter_test.go).

## Source and proof

- [Compaction domain types](https://github.com/looprig/harness/blob/main/pkg/loop/compaction.go)
- [XML parser](https://github.com/looprig/harness/blob/main/internal/loopruntime/compaction.go)
- [Validation proof](https://github.com/looprig/harness/blob/main/internal/sessionruntime/compaction_adapter_test.go)
