package main

import (
	"fmt"
	"io"
	"os"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/inference/inferencetest"
)

func run(output io.Writer) error {
	definition, err := loop.Define(
		loop.WithName("assistant"),
		loop.WithSystem("Be concise."),
		loop.WithInference(inferencetest.New(), inferencetest.Model()),
	)
	if err != nil {
		return err
	}
	modelName := definition.FingerprintInitial().Model.Name
	assertoutput.MustEqual("loop name", string(definition.Name()), "assistant")
	assertoutput.MustEqual("model name", modelName, inferencetest.ModelName)
	_, err = fmt.Fprintf(output, "loop: %s uses %s\n", definition.Name(), modelName)
	return err
}

func main() { assertoutput.MustSucceed(run(os.Stdout)) }
