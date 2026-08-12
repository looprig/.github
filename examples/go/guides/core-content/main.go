package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"

	"github.com/looprig/core/content"
	"github.com/looprig/core/content/streamaccumulator"
)

func run(output io.Writer) error {
	system := &content.SystemMessage{Message: content.Message{
		Role:   content.RoleSystem,
		Blocks: []content.Block{&content.TextBlock{Text: "Answer from supplied documents."}},
	}}
	user := &content.UserMessage{Message: content.Message{
		Role: content.RoleUser,
		Blocks: []content.Block{
			&content.TextBlock{Text: "Summarize the report."},
			&content.DocumentBlock{MediaType: content.MediaTypeDocumentText, Name: "report.txt", Text: "Revenue increased."},
		},
	}}

	// AIMessage can mix visible text, reasoning state, and tool calls in order.
	assistant := &content.AIMessage{
		Message: content.Message{
			Role: content.RoleAssistant,
			Blocks: []content.Block{
				content.NewThinkingBlock("Need the latest total.", "sig-1", nil, ""),
				&content.TextBlock{Text: "I will check the ledger."},
				&content.ToolUseBlock{ID: "call-1", Name: "ledger_total", Input: json.RawMessage(`{"period":"Q4"}`)},
			},
		},
		Usage: &content.Usage{InputTokens: 20, OutputTokens: 8, ReasoningTokens: 3},
	}

	// The result repeats the tool-call ID so the model can correlate it.
	toolResult := &content.ToolResultMessage{
		Message: content.Message{
			Role: content.RoleTool,
			Blocks: []content.Block{&content.ToolResultBlock{
				ToolUseID: "call-1",
				Content:   []content.Block{&content.TextBlock{Text: "$42"}},
			}},
		},
		ToolUseID: "call-1",
		IsError:   false,
	}

	thread := content.AgenticMessages{system, user, assistant, toolResult}
	fmt.Fprintf(output, "messages=%d assistant-blocks=%d tool=%s\n", len(thread), len(assistant.Blocks), toolResult.ToolUseID)

	// Streaming deltas are separate from complete blocks. Fold them explicitly.
	var text streamaccumulator.Text
	text.Add(&content.TextChunk{Text: "Revenue "})
	text.Add(&content.TextChunk{Text: "increased."})
	fmt.Fprintln(output, text.Block().Text)
	return nil
}

func main() {
	if err := run(os.Stdout); err != nil {
		panic(err)
	}
}
