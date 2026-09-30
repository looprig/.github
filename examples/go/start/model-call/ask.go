package main

import (
	"context"
	"strings"

	"github.com/looprig/core/content"
	"github.com/looprig/inference"
	"github.com/looprig/inference/model"
)

// askOnce sends one question to the model and returns its complete reply.
func askOnce(ctx context.Context, client inference.Client, selected model.Model, question string) (*inference.Response, error) {
	request := inference.Request{
		Model:  selected,
		System: "You are a concise coding assistant. State uncertainty clearly.",
		Messages: content.AgenticMessages{
			&content.UserMessage{Message: content.Message{
				Role: content.RoleUser,
				Blocks: []content.Block{
					// TextBlock is provider-neutral. The client's codec owns the wire format.
					&content.TextBlock{Text: question},
				},
			}},
		},
	}
	return client.Invoke(ctx, request)
}

// responseText joins the reply's text blocks. A reply can also carry
// reasoning or tool calls, so never assume the first block is text.
func responseText(response *inference.Response) string {
	var output strings.Builder
	for _, block := range response.Message.Blocks {
		if text, ok := block.(*content.TextBlock); ok {
			output.WriteString(text.Text)
		}
	}
	return output.String()
}
