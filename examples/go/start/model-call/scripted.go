package main

import (
	"github.com/looprig/inference"
	"github.com/looprig/inference/inferencetest"
)

// scriptedClient stands in for a hosted model. It answers every request with
// the same reply, streamed in small chunks like a real provider.
func scriptedClient() inference.Client {
	return inferencetest.New(
		inferencetest.Text("A Go module is a versioned collection of packages described by go.mod. " +
			"Its path names the module, and its requirements pin the modules it depends on.").Repeat(),
	)
}
