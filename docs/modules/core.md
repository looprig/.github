---
id: modules/core
title: Messages, content blocks, and shared values
description: Construct user, system, assistant, and tool-result messages; carry text, media, reasoning, and tool calls; consume streaming chunks; and serialize the closed content model.
audience: developer
section: modules
order: 1
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
proofs:
  boundary:
    - release-github-com-looprig-core
  composition:
    - release-github-com-looprig-core
  user-and-system-messages:
    - release-github-com-looprig-core
  assistant-messages-with-thinking-and-tool-calls:
    - release-github-com-looprig-core
  tool-results:
    - release-github-com-looprig-core
  consume-blocks-safely:
    - release-github-com-looprig-core
  lifecycle:
    - release-github-com-looprig-core
  errors-and-limits:
    - release-github-com-looprig-core
  runnable-proof:
    - release-github-com-looprig-core
---

# Messages, content blocks, and shared values

Core `v0.5.1` defines the provider-neutral values passed between applications, model clients, Harness, stores, and UIs. Most consumers begin with `github.com/looprig/core/content`.

```sh
go get github.com/looprig/core@v0.5.1
```

Core separates a conversation into two levels:

1. A **message** identifies who authored one turn.
2. An ordered list of **blocks** carries the text, media, reasoning, tool calls, or tool results inside that turn.

Both unions are closed Go interfaces. Consumers handle the known concrete types with type switches instead of inventing provider-specific variants.

## Message types {#boundary}

All message types embed the same base value:

```go
type Message struct {
	Role   Role
	Blocks []Block // order is meaningful
}
```

| Message | Required role | Use it for | Additional fields |
| --- | --- | --- | --- |
| `UserMessage` | `RoleUser` | Human input, including text, images, audio, or documents. | Embedded `Message`. |
| `SystemMessage` | `RoleSystem` | Instructions that shape model behavior. | Embedded `Message`. |
| `AIMessage` | `RoleAssistant` | A completed model turn. It may contain text, thinking, and one or more tool calls. | `Usage *Usage`. |
| `ToolResultMessage` | `RoleTool` | The result returned for a previous tool call. | `ToolUseID string`, `IsError bool`. |

There are no convenience constructors for these messages. Construct the typed value and set its role explicitly.

### User and system messages

```go
system := &content.SystemMessage{Message: content.Message{
	Role: content.RoleSystem,
	Blocks: []content.Block{
		&content.TextBlock{Text: "Answer from the supplied documents."},
	},
}}

user := &content.UserMessage{Message: content.Message{
	Role: content.RoleUser,
	Blocks: []content.Block{
		&content.TextBlock{Text: "Summarize the report."},
		&content.DocumentBlock{
			MediaType: content.MediaTypeDocumentText,
			Name:      "report.txt",
			Text:      "Revenue increased.",
		},
	},
}}
```

Blocks remain in the order supplied. That lets a user turn interleave instructions and media when a provider supports it.

### Assistant messages with thinking and tool calls

`AIMessage` is the model-authored message type. Its `Blocks` may mix visible response text, reasoning, and tool calls:

```go
assistant := &content.AIMessage{
	Message: content.Message{
		Role: content.RoleAssistant,
		Blocks: []content.Block{
			content.NewThinkingBlock(
				"Need the latest total.", // reasoning text
				"sig-1",                 // optional provider signature
				nil,                     // optional opaque provider state
				"",                      // state format, empty when state is nil
			),
			&content.TextBlock{Text: "I will check the ledger."},
			&content.ToolUseBlock{
				ID:    "call-1",
				Name:  "ledger_total",
				Input: json.RawMessage(`{"period":"Q4"}`),
			},
		},
	},
	Usage: &content.Usage{
		InputTokens:     20,
		OutputTokens:    8,
		ReasoningTokens: 3,
	},
}
```

`Usage` is optional. When present, `ReasoningTokens` must not exceed `OutputTokens`; JSON encoding and `Usage.Validate` reject an invalid relationship.

Thinking requires extra care. `Thinking` is reasoning text and `Signature` is a provider-issued signature when available. `ProviderState` is opaque replay state. Use `NewThinkingBlock` when supplying provider state because it copies the bytes. Only replay that state to the same provider dialect:

```go
if thinking.ReplayableAs("openai-responses") {
	// The state was issued in this dialect and may be sent back to that codec.
}
```

If `ReplayableAs` returns false, treat the opaque state as absent. Do not translate or forward it to another provider format.

### Tool results

The tool call ID is the correlation boundary. Return the same ID in the message and result block:

```go
result := &content.ToolResultMessage{
	Message: content.Message{
		Role: content.RoleTool,
		Blocks: []content.Block{
			&content.ToolResultBlock{
				ToolUseID: "call-1",
				Content: []content.Block{
					&content.TextBlock{Text: "$42"},
				},
				IsError: false,
			},
		},
	},
	ToolUseID: "call-1",
	IsError:   false,
}
```

`IsError` means the tool executed and reported an error result. It is not a Go transport error. The result can still carry structured text or media that explains the failure to the model and UI.

Use `AgenticMessages` for an ordered conversation:

```go
thread := content.AgenticMessages{system, user, assistant, result}
```

## Content block types {#composition}

`content.Block` is a sealed interface. The concrete pointer type is the in-memory discriminator.

| Block | Important fields | Typical use |
| --- | --- | --- |
| `TextBlock` | `Text string` | Prompts, visible assistant output, and textual tool results. |
| `ImageBlock` | `MediaType`, `ImageSource{URL, Data}` | A remote image URL or inline image bytes. Set one source. |
| `AudioBlock` | `MediaType`, `Data` | Inline MP3, WAV, OGG, FLAC, AAC, MP4, or WebM audio. |
| `DocumentBlock` | `MediaType`, `Name`, `Data`, `Text` | Binary documents or extracted text such as PDF, Markdown, CSV, DOCX, or XLSX. |
| `ThinkingBlock` | `Thinking`, `Signature`, `ProviderState`, `ProviderStateFormat` | Reasoning plus same-dialect replay metadata. |
| `ToolUseBlock` | `ID`, `Name`, `Input json.RawMessage` | A model-requested tool invocation. |
| `ToolResultBlock` | `ToolUseID`, `Content []Block`, `IsError` | Nested result content correlated to a tool call. |

Media examples:

```go
blocks := []content.Block{
	&content.ImageBlock{
		MediaType: content.MediaTypeImagePNG,
		Source:    content.ImageSource{URL: "https://example.com/chart.png"},
	},
	&content.AudioBlock{
		MediaType: content.MediaTypeAudioWAV,
		Data:      wavBytes,
	},
	&content.DocumentBlock{
		MediaType: content.MediaTypeDocumentPDF,
		Name:      "report.pdf",
		Data:      pdfBytes,
	},
}
```

Provider support is a separate concern. Core can represent these blocks even when a particular model or codec does not accept every media type.

### Consume blocks safely

Do not inspect JSON tags or add a `Type` field. Use a type switch:

```go
for _, block := range assistant.Blocks {
	switch block := block.(type) {
	case *content.TextBlock:
		fmt.Println("text:", block.Text)
	case *content.ThinkingBlock:
		fmt.Println("thinking signature:", block.Signature)
	case *content.ToolUseBlock:
		fmt.Printf("tool %s id=%s input=%s\n", block.Name, block.ID, block.Input)
	case *content.ImageBlock, *content.AudioBlock, *content.DocumentBlock:
		fmt.Printf("media block %T\n", block)
	case *content.ToolResultBlock:
		fmt.Printf("tool result id=%s error=%t\n", block.ToolUseID, block.IsError)
	}
}
```

## Streaming chunks {#lifecycle}

Chunks are deltas, not complete blocks, and they are never serialized:

| Chunk | Fields | Accumulator |
| --- | --- | --- |
| `TextChunk` | `Text` | `streamaccumulator.Text` |
| `ThinkingChunk` | `Thinking`, `Signature` | `streamaccumulator.Thinking` |
| `ToolUseChunk` | `Index`, `ID`, `Name`, `InputJSON` | `streamaccumulator.ToolUses` |

```go
var text streamaccumulator.Text
text.Add(&content.TextChunk{Text: "Revenue "})
text.Add(&content.TextChunk{Text: "increased."})
complete := text.Block() // &content.TextBlock{Text: "Revenue increased."}

var calls streamaccumulator.ToolUses
calls.Add(&content.ToolUseChunk{
	Index: 0,
	ID: "call-1", Name: "ledger_total",
	InputJSON: `{"period":`,
})
calls.Add(&content.ToolUseChunk{Index: 0, InputJSON: `"Q4"}`})
toolBlocks := calls.Blocks() // ordered by Index; Input is the concatenated JSON
```

The accumulator joins fragments. It does not authorize a tool, validate its input schema, execute it, or decide whether a turn succeeded.

## JSON codecs and failure boundaries {#errors-and-limits}

Use Core's tagged codec when a value is held as the `Block` interface:

```go
wire, err := content.MarshalBlock(&content.TextBlock{Text: "hello"})
if err != nil {
	return err
}

decoded, err := content.UnmarshalBlock(wire)
if err != nil {
	var limit *content.BlockLimitError
	if errors.As(err, &limit) {
		return fmt.Errorf("content exceeds %s limit: %w", limit.Limit, err)
	}
	return err
}
text := decoded.(*content.TextBlock)
```

`MarshalBlocks` and `UnmarshalBlocks` handle slices. The decoder rejects unknown tags, malformed payloads, typed-nil blocks, oversized input, excessive block counts, and excessive nested tool-result depth. Prefer `errors.As` with `BlockDecodeError`, `BlockEncodeError`, `BlockLimitError`, `UnknownBlockTypeError`, and `NilBlockError`; error text is not a stable API.

## Run the complete example {#runnable-proof}

The checked example constructs all four message types, an assistant turn with thinking and a tool call, the correlated tool result, token usage, and a text stream accumulator.

```sh
cd examples/go/guides/core-content
go test ./...
go run .
```

Expected output:

```text
messages=4 assistant-blocks=3 tool=call-1
Revenue increased.
```

- [Open the complete runnable source](https://github.com/looprig/.github/blob/main/examples/go/guides/core-content/main.go)
- [Open its exact-output test](https://github.com/looprig/.github/blob/main/examples/go/guides/core-content/main_test.go)
- [Open Core's package-level content example](https://github.com/looprig/core/tree/v0.5.1/examples/content)
- [Inspect the released content structs](https://github.com/looprig/core/tree/v0.5.1/content)
