package main

import (
	"github.com/looprig/inference"
	"github.com/looprig/inference/inferencetest"
)

// scriptedClient stands in for a hosted model. It answers every request with
// the same reply, streamed in small chunks like a real provider.
func scriptedClient() inference.Client {
	return inferencetest.New(
		inferencetest.Text("I can read this repository once you give me tools. " +
			"For now I can only answer from what you tell me.").Repeat(),
	)
}
