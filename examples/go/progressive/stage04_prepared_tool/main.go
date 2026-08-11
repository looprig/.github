package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/core/content"
	"github.com/looprig/core/uuid"
	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/harness/pkg/tool"
)

type preparedTool struct{}

func (preparedTool) Info(context.Context) (*tool.ToolInfo, error) {
	return &tool.ToolInfo{Name: "status", Desc: "Return readiness", Schema: json.RawMessage(`{"type":"object"}`)}, nil
}

func (preparedTool) PrepareCall(_ context.Context, executionID uuid.UUID, _ string) (tool.Request, tool.PreparedArtifact, error) {
	return tool.Request{ToolName: "status", Summary: "Read local status"}, tool.TokenArtifact{Token: executionID.String()}, nil
}

func (preparedTool) InvokableRun(context.Context, string) (*tool.ToolResult, error) {
	return tool.TextResult("prepared call"), nil
}

func run(output io.Writer) error {
	ctx := context.Background()
	executionID, err := uuid.New()
	if err != nil {
		return err
	}
	implementation := preparedTool{}
	request, artifact, err := implementation.PrepareCall(ctx, executionID, `{}`)
	if err != nil {
		return err
	}
	evaluator, err := gate.NewHeadlessEvaluator(nil, nil, nil)
	if err != nil {
		return err
	}
	resolution, err := evaluator.Authorize(ctx, request)
	if err != nil {
		return err
	}
	assertoutput.MustEqual("approved", resolution.Approved, true)
	assertoutput.MustEqual("artifact token", artifact.(tool.TokenArtifact).Token, executionID.String())
	result, err := implementation.InvokableRun(ctx, `{}`)
	if err != nil {
		return err
	}
	text := result.Content[0].(*content.TextBlock).Text
	_, err = fmt.Fprintf(output, "gate: approved %s\n", text)
	return err
}

func main() { assertoutput.MustSucceed(run(os.Stdout)) }
