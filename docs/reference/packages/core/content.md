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

Package content defines the unified content vocabulary shared across all internal packages.

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

```go
type BlockType string
```

```go
type Block interface {
	// contains filtered or unexported methods
}
```

```go
type TextBlock struct {
	Text string
}
```

```go
type ImageSource struct {
	URL  string
	Data []byte
}
```

```go
type ImageBlock struct {
	MediaType MediaType
	Source    ImageSource
}
```

```go
type AudioBlock struct {
	MediaType MediaType
	Data      []byte
}
```

```go
type DocumentBlock struct {
	MediaType MediaType
	Name      string
	Data      []byte
	Text      string
}
```

```go
type ThinkingBlock struct {
	Thinking            string
	Signature           string
	ProviderState       json.RawMessage `json:"ProviderState,omitempty"`
	ProviderStateFormat string          `json:"ProviderStateFormat,omitempty"`
}
```

```go
type ToolUseBlock struct {
	ID    string
	Name  string
	Input json.RawMessage
}
```

```go
type ToolResultBlock struct {
	ToolUseID string
	Content   []Block
	IsError   bool
}
```

```go
type Chunk interface {
	// contains filtered or unexported methods
}
```

```go
type TextChunk struct{ Text string }
```

```go
type ThinkingChunk struct {
	Thinking  string
	Signature string
}
```

```go
type ToolUseChunk struct {
	Index     int
	ID        string
	Name      string
	InputJSON string
}
```

```go
type UnknownBlockTypeError struct{ Type BlockType }
```

```go
type NilBlockError struct{ Type BlockType }
```

```go
type BlockEncodeError struct {
	Type  BlockType
	Cause error
}
```

```go
type BlockDecodeError struct{ Cause error }
```

```go
type BlockLimitError struct {
	Limit string
	Got   int
	Max   int
}
```

```go
type MediaType string
```

```go
type Role string
```

```go
type Message struct {
	Role   Role
	Blocks []Block
}
```

```go
type UserMessage struct{ Message }
```

```go
type AIMessage struct {
	Message
	Usage *Usage
}
```

```go
type SystemMessage struct{ Message }
```

```go
type ToolResultMessage struct {
	Message
	ToolUseID string
	IsError   bool
}
```

```go
type Conversation interface {
	// contains filtered or unexported methods
}
```

```go
type AgenticMessages []Conversation
```

```go
type TokenCount uint64
```

```go
type UsageField string
```

```go
type UsageValidationReason string
```

```go
type Usage struct {
	InputTokens         TokenCount
	OutputTokens        TokenCount
	CacheReadTokens     TokenCount
	CacheCreationTokens TokenCount
	ReasoningTokens     TokenCount
}
```

```go
type UsageValidationError struct {
	Field  UsageField
	Reason UsageValidationReason
}
```

```go
type UsageOverflowError struct {
	Field UsageField
	Left  TokenCount
	Right TokenCount
}
```

### Constants {#constants}

`TypeText`, `TypeImage`, `TypeAudio`, `TypeDocument`, `TypeThinking`, `TypeToolUse`, `TypeToolResult`, `MediaTypeImageJPEG`, `MediaTypeImagePNG`, `MediaTypeImageGIF`, `MediaTypeImageWebP`, `MediaTypeImageSVG`, `MediaTypeAudioMPEG`, `MediaTypeAudioWAV`, `MediaTypeAudioOGG`, `MediaTypeAudioFLAC`, `MediaTypeAudioAAC`, `MediaTypeAudioMP4`, `MediaTypeAudioWebM`, `MediaTypeDocumentPDF`, `MediaTypeDocumentText`, `MediaTypeDocumentHTML`, `MediaTypeDocumentCSV`, `MediaTypeDocumentMarkdown`, `MediaTypeDocumentDOCX`, `MediaTypeDocumentXLSX`, `RoleUser`, `RoleAssistant`, `RoleSystem`, `RoleTool`, `UsageFieldInputTokens`, `UsageFieldOutputTokens`, `UsageFieldCacheReadTokens`, `UsageFieldCacheCreationTokens`, `UsageFieldReasoningTokens`, `UsageFieldContextTokens`, `UsageFieldTotalTokens`, `UsageValidationReasonReasoningExceedsOutput`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `BlockDecodeError`, `BlockEncodeError`, `BlockLimitError`, `NilBlockError`, `UnknownBlockTypeError`, `UsageOverflowError`, `UsageValidationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

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

Run `go test ./...` from a checkout of the `core` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
