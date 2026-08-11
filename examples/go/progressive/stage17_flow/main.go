package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"

	"github.com/looprig/core/uuid"
	"github.com/looprig/flow/pkg/flow"
)

type reviewState struct {
	Change     string
	ApprovedBy string
	Attempts   int
}

type decision struct {
	Approver string
	Attempt  int
}

func main() {
	if err := run(os.Stdout); err != nil {
		panic(err)
	}
}

func run(output io.Writer) error {
	ctx := context.Background()
	graphID := flow.GraphID(uuid.MustParse("40000000-0000-4000-8000-000000000001"))
	reviewID := flow.VertexID(uuid.MustParse("40000000-0000-4000-8000-000000000002"))
	store := flow.NewMemStore()
	graph := flow.NewGraph[reviewState](graphID)

	err := flow.AddVertex(
		graph,
		reviewID,
		flow.NewFuncTask(func(ctx context.Context, change string) (decision, error) {
			attempt, resuming := flow.InterruptState[int](ctx)
			if !resuming {
				return decision{}, flow.StatefulInterrupt(ctx, "approve "+change, 1)
			}
			approver, ok := flow.ResumePayload[string](ctx)
			if !ok {
				return decision{}, errors.New("resume payload must name an approver")
			}
			return decision{Approver: approver, Attempt: attempt + 1}, nil
		}),
		func(state reviewState) string { return state.Change },
		func(state *reviewState, approved decision) error {
			state.ApprovedBy = approved.Approver
			state.Attempts = approved.Attempt
			return nil
		},
	)
	if err != nil {
		return err
	}
	runner, err := graph.Compile(reviewID, reviewID, flow.WithStore(store))
	if err != nil {
		return err
	}

	paused, err := runner.Run(ctx, reviewState{Change: "change-7"})
	if err != nil {
		return err
	}
	before, err := store.History(ctx, paused.Run.GraphRunID)
	if err != nil {
		return err
	}
	if len(paused.Interrupts) != 1 {
		return fmt.Errorf("interrupts = %d, want 1", len(paused.Interrupts))
	}
	if _, err := fmt.Fprintf(output, "paused=%s awaiting=%t checkpoints=%d\n",
		paused.Run.Status, paused.Interrupts[0].Kind == flow.Awaiting, len(before)); err != nil {
		return err
	}

	completed, err := runner.Resume(ctx, paused.Run.GraphRunID, "alice")
	if err != nil {
		return err
	}
	after, err := store.History(ctx, paused.Run.GraphRunID)
	if err != nil {
		return err
	}
	_, err = fmt.Fprintf(output, "resumed=%s approver=%s attempts=%d history-grew=%t\n",
		completed.Run.Status, completed.State.ApprovedBy, completed.State.Attempts, len(after) > len(before))
	return err
}
