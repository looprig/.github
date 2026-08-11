package main

import (
	"fmt"
	"io"
	"os"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/.github/examples/go/progressive/internal/fakeinference"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/inference/model"
)

func offlineModel() model.Model {
	return model.CustomModel("offline", model.APIFormatOpenAI, "http://localhost", "fixture")
}

func run(output io.Writer) error {
	definition, err := loop.Define(
		loop.WithName("assistant"),
		loop.WithSystem("Be concise."),
		loop.WithInference(fakeinference.New(), offlineModel()),
	)
	if err != nil {
		return err
	}
	modelName := definition.FingerprintInitial().Model.Name
	assertoutput.MustEqual("loop name", string(definition.Name()), "assistant")
	assertoutput.MustEqual("model name", modelName, "fixture")
	_, err = fmt.Fprintf(output, "loop: %s uses %s\n", definition.Name(), modelName)
	return err
}

func main() { assertoutput.MustSucceed(run(os.Stdout)) }
