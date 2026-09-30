package main

import (
	"github.com/looprig/inference"
	"github.com/looprig/inference/inferencetest"
)

// scriptedClient stands in for a hosted model. Its script calls the read
// tools the way a model would: list the Go files, read go.mod, then answer.
func scriptedClient() inference.Client {
	return inferencetest.New(
		inferencetest.Text("Let me look.").ToolCall("Glob", `{"pattern":"*.go"}`),
		inferencetest.ToolCall("ReadFile", `{"path":"go.mod"}`),
		inferencetest.Text("This is the Go module example.com/looprig-coding-assistant, "+
			"according to its go.mod.").Repeat(),
	)
}
