package main

import (
	"context"
	"fmt"
	"io"
	"os"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/core/content"
	"github.com/looprig/inference"
	"github.com/looprig/inference/inferencetest"
)

func run(output io.Writer) error {
	client := inferencetest.New(inferencetest.Text("Hello from Looprig."))
	response, err := client.Invoke(context.Background(), inference.Request{
		Model:  inferencetest.Model(),
		System: "Answer briefly.",
		Messages: content.AgenticMessages{&content.UserMessage{Message: content.Message{
			Role: content.RoleUser, Blocks: []content.Block{&content.TextBlock{Text: "Say hello."}},
		}}},
	})
	if err != nil {
		return err
	}
	text := response.Message.Blocks[0].(*content.TextBlock).Text
	assertoutput.MustEqual("recorded requests", len(client.Requests()), 1)
	assertoutput.MustEqual("assistant text", text, "Hello from Looprig.")
	_, err = fmt.Fprintf(output, "assistant: %s\n", text)
	return err
}

func main() { assertoutput.MustSucceed(run(os.Stdout)) }
