---
id: reference/packages/core/content
title: content package · content
description: Reference for the content package at github.com/looprig/core/content, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 1
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
proofs:
  package-role: release-github-com-looprig-core
  exported-surface: release-github-com-looprig-core
  functions: release-github-com-looprig-core
  methods: release-github-com-looprig-core
  types: release-github-com-looprig-core
  constants: release-github-com-looprig-core
  variables: release-github-com-looprig-core
  ownership-and-errors: release-github-com-looprig-core
  source-and-runnable-proof: release-github-com-looprig-core
---

# content package · content

Import path: `github.com/looprig/core/content`. The source is pinned to github.com/looprig/core@v0.5.1.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.5.1; pin that version in consumers and do not publish local workspace replacements.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewThinkingBlock(thinking, signature string, providerState json.RawMessage, providerStateFormat string) *ThinkingBlock`
- `func MarshalBlock(b Block) ([]byte, error)`
- `func UnmarshalBlock(data []byte) (Block, error)`
- `func MarshalBlocks(bs []Block) ([]byte, error)`
- `func UnmarshalBlocks(data []byte) ([]Block, error)`

### Methods {#methods}

- `func (b *ThinkingBlock) ReplayableAs(format string) bool`
- `func (t *ToolResultBlock) MarshalJSON() ([]byte, error)`
- `func (t *ToolResultBlock) UnmarshalJSON(data []byte) error`
- `func (e *UnknownBlockTypeError) Error() string`
- `func (e *NilBlockError) Error() string`
- `func (e *BlockEncodeError) Error() string`
- `func (e *BlockEncodeError) Unwrap() error`
- `func (e *BlockDecodeError) Error() string`
- `func (e *BlockDecodeError) Unwrap() error`
- `func (e *BlockLimitError) Error() string`
- `func (m Message) MarshalJSON() ([]byte, error)`
- `func (m *Message) UnmarshalJSON(data []byte) error`
- `func (m AIMessage) MarshalJSON() ([]byte, error)`
- `func (m *AIMessage) UnmarshalJSON(data []byte) error`
- `func (m ToolResultMessage) MarshalJSON() ([]byte, error)`
- `func (m *ToolResultMessage) UnmarshalJSON(data []byte) error`
- `func (e *UsageValidationError) Error() string`
- `func (e *UsageOverflowError) Error() string`
- `func (u Usage) Validate() error`
- `func (u Usage) ContextTokens() (TokenCount, error)`
- `func (u Usage) TotalTokens() (TokenCount, error)`
- `func (u Usage) Add(other Usage) (Usage, error)`

### Types {#types}

`BlockType`, `Block`, `TextBlock`, `ImageSource`, `ImageBlock`, `AudioBlock`, `DocumentBlock`, `ThinkingBlock`, `ToolUseBlock`, `ToolResultBlock`, `Chunk`, `TextChunk`, `ThinkingChunk`, `ToolUseChunk`, `UnknownBlockTypeError`, `NilBlockError`, `BlockEncodeError`, `BlockDecodeError`, `BlockLimitError`, `MediaType`, `Role`, `Message`, `UserMessage`, `AIMessage`, `SystemMessage`, `ToolResultMessage`, `Conversation`, `AgenticMessages`, `TokenCount`, `UsageField`, `UsageValidationReason`, `Usage`, `UsageValidationError`, `UsageOverflowError`

### Constants {#constants}

`TypeText`, `TypeImage`, `TypeAudio`, `TypeDocument`, `TypeThinking`, `TypeToolUse`, `TypeToolResult`, `MediaTypeImageJPEG`, `MediaTypeImagePNG`, `MediaTypeImageGIF`, `MediaTypeImageWebP`, `MediaTypeImageSVG`, `MediaTypeAudioMPEG`, `MediaTypeAudioWAV`, `MediaTypeAudioOGG`, `MediaTypeAudioFLAC`, `MediaTypeAudioAAC`, `MediaTypeAudioMP4`, `MediaTypeAudioWebM`, `MediaTypeDocumentPDF`, `MediaTypeDocumentText`, `MediaTypeDocumentHTML`, `MediaTypeDocumentCSV`, `MediaTypeDocumentMarkdown`, `MediaTypeDocumentDOCX`, `MediaTypeDocumentXLSX`, `RoleUser`, `RoleAssistant`, `RoleSystem`, `RoleTool`, `UsageFieldInputTokens`, `UsageFieldOutputTokens`, `UsageFieldCacheReadTokens`, `UsageFieldCacheCreationTokens`, `UsageFieldReasoningTokens`, `UsageFieldContextTokens`, `UsageFieldTotalTokens`, `UsageValidationReasonReasoningExceedsOutput`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `UnknownBlockTypeError`, `NilBlockError`, `BlockEncodeError`, `BlockDecodeError`, `BlockLimitError`, `UsageValidationError`, `UsageOverflowError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [content/block.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/block.go)
- [content/block_json.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/block_json.go)
- [content/chunk.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/chunk.go)
- [content/errors.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/errors.go)
- [content/media_type.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/media_type.go)
- [content/message.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/message.go)
- [content/usage.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/usage.go)

Adjacent tests at the same commit:

- [content/block_json_fuzz_test.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/block_json_fuzz_test.go)
- [content/block_json_test.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/block_json_test.go)
- [content/block_test.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/block_test.go)
- [content/chunk_test.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/chunk_test.go)
- [content/message_json_test.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/message_json_test.go)
- [content/message_test.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/message_test.go)
- [content/usage_test.go](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/usage_test.go)

Run `GOWORK=off go test ./...` from the `core` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
