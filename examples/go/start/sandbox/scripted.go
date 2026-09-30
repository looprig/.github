package main

import (
	"github.com/looprig/inference"
	"github.com/looprig/inference/inferencetest"
)

// scriptedClient stands in for a hosted model. Its script reads go.mod, runs
// one command in the sandbox, then answers.
func scriptedClient() inference.Client {
	return inferencetest.New(
		inferencetest.Text("Let me look.").ToolCall("ReadFile", `{"path":"go.mod"}`),
		inferencetest.ToolCall("Bash", `{"command":"ls"}`),
		inferencetest.Text("This is the Go module example.com/looprig-coding-assistant; "+
			"its workspace holds the files ls listed.").Repeat(),
	)
}
