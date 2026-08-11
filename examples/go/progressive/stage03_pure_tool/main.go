package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/core/content"
	"github.com/looprig/harness/pkg/tool"
)

type addTool struct{}

func (addTool) Info(context.Context) (*tool.ToolInfo, error) {
	return &tool.ToolInfo{Name: "add", Desc: "Add two integers", Schema: json.RawMessage(`{"type":"object","properties":{"a":{"type":"integer"},"b":{"type":"integer"}},"required":["a","b"]}`)}, nil
}

func (addTool) InvokableRun(_ context.Context, arguments string) (*tool.ToolResult, error) {
	var input struct{ A, B int }
	if err := json.Unmarshal([]byte(arguments), &input); err != nil {
		return nil, err
	}
	return tool.TextResult(fmt.Sprintf("%d", input.A+input.B)), nil
}

func run(output io.Writer) error {
	result, err := (addTool{}).InvokableRun(context.Background(), `{"a":20,"b":22}`)
	if err != nil {
		return err
	}
	answer := result.Content[0].(*content.TextBlock).Text
	assertoutput.MustEqual("sum", answer, "42")
	_, err = fmt.Fprintf(output, "tool: add(20, 22) = %s\n", answer)
	return err
}

func main() { assertoutput.MustSucceed(run(os.Stdout)) }
