package main

import (
	"fmt"
	"io"
	"os"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/.github/examples/go/progressive/internal/fakeinference"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/inference/model"
	"github.com/looprig/storage/memstore"
)

func run(output io.Writer) error {
	definition, err := loop.Define(
		loop.WithName("assistant"),
		loop.WithInference(fakeinference.New(), model.CustomModel("offline", model.APIFormatOpenAI, "http://localhost", "fixture")),
	)
	if err != nil {
		return err
	}
	store, err := sessionstore.Open(memstore.New())
	if err != nil {
		return err
	}
	harness, err := rig.Define(rig.WithLoops(definition), rig.WithPrimers("assistant"), rig.WithSessionStore(store))
	if err != nil {
		return err
	}
	assertoutput.MustEqual("rig constructed", harness != nil, true)
	_, err = fmt.Fprintln(output, "rig: assembled assistant with durable sessions")
	return err
}

func main() { assertoutput.MustSucceed(run(os.Stdout)) }
