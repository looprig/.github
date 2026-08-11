package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/.github/examples/go/progressive/internal/fakeinference"
	"github.com/looprig/core/uuid"
	"github.com/looprig/harness/pkg/identity"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/session"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/inference/model"
	"github.com/looprig/storage/memstore"
)

func run(output io.Writer) error {
	define := func(name string, delegates ...string) (loop.Definition, error) {
		options := []loop.Option{
			loop.WithName(identity.AgentName(name)),
			loop.WithInference(fakeinference.New(), model.CustomModel("offline", model.APIFormatOpenAI, "http://localhost", name)),
		}
		for _, delegate := range delegates {
			options = append(options, loop.WithDelegates(identity.AgentName(delegate)))
		}
		return loop.Define(options...)
	}
	worker, err := define("worker")
	if err != nil {
		return err
	}
	planner, err := define("planner", "worker")
	if err != nil {
		return err
	}
	store, err := sessionstore.Open(memstore.New())
	if err != nil {
		return err
	}
	harness, err := rig.Define(
		rig.WithLoops(planner, worker), rig.WithPrimers("planner"), rig.WithSessionStore(store),
		rig.WithDelegationLimits(rig.DelegationLimits{Depth: 2, Quota: 1}),
	)
	if err != nil {
		return err
	}
	live, err := harness.NewSession(context.Background())
	if err != nil {
		return err
	}
	defer live.Shutdown(context.Background())
	spawner := live.(interface {
		NewLoop(loop.Provenance, loop.Definition) (uuid.UUID, error)
	})
	parent := loop.Provenance{LoopID: live.ActiveLoop().ID()}
	if _, err := spawner.NewLoop(parent, worker); err != nil {
		return err
	}
	_, err = spawner.NewLoop(parent, worker)
	var sessionErr *session.SessionError
	if !errors.As(err, &sessionErr) {
		return fmt.Errorf("second delegate: %w", err)
	}
	assertoutput.MustEqual("delegation limit", sessionErr.Kind, session.SessionLoopQuotaExceeded)
	_, err = fmt.Fprintln(output, "delegation: worker admitted; quota enforced")
	return err
}

func main() { assertoutput.MustSucceed(run(os.Stdout)) }
