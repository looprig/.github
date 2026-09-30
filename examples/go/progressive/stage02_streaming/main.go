package main

import (
	"context"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/core/content"
	"github.com/looprig/inference"
	"github.com/looprig/inference/inferencetest"
)

func run(output io.Writer) error {
	client := inferencetest.New(inferencetest.Text("Hello, Looprig!"))
	reader, err := client.Stream(context.Background(), inference.Request{Model: inferencetest.Model()})
	if err != nil {
		return err
	}
	defer reader.Close()

	var text strings.Builder
	for {
		chunk, nextErr := reader.Next()
		if nextErr == io.EOF {
			break
		}
		if nextErr != nil {
			return nextErr
		}
		text.WriteString(chunk.(*content.TextChunk).Text)
	}
	result, ok := reader.Result()
	assertoutput.MustEqual("terminal result available", ok, true)
	assertoutput.MustEqual("streamed text", text.String(), "Hello, Looprig!")
	_, err = fmt.Fprintf(output, "stream: %s (%s)\n", text.String(), result.FinishReason)
	return err
}

func main() { assertoutput.MustSucceed(run(os.Stdout)) }
