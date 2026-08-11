package main

import (
	"context"
	"fmt"
	"io"
	"os"
	"time"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/.github/examples/go/progressive/internal/fakeinference"
	"github.com/looprig/core/content"
	"github.com/looprig/harness/pkg/event"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/inference/model"
	"github.com/looprig/storage/memstore"
)

func run(output io.Writer) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	definition, err := loop.Define(
		loop.WithName("assistant"),
		loop.WithInference(fakeinference.New(fakeinference.TextStream("ready")), model.CustomModel("offline", model.APIFormatOpenAI, "http://localhost", "fixture")),
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
	live, err := harness.NewSession(ctx)
	if err != nil {
		return err
	}
	defer live.Shutdown(context.Background())
	subscription, err := live.SubscribeEvents(event.EventFilter{Enduring: event.LoopScope{All: true}})
	if err != nil {
		return err
	}
	defer subscription.Close()
	if _, err := live.Submit(ctx, []content.Block{&content.TextBlock{Text: "Report status."}}); err != nil {
		return err
	}
	for delivery := range subscription.Events() {
		if done, ok := delivery.Event.(event.TurnDone); ok {
			text := done.Message.Blocks[0].(*content.TextBlock).Text
			assertoutput.MustEqual("assistant text", text, "ready")
			_, err = fmt.Fprintf(output, "event: turn done with %s\n", text)
			return err
		}
	}
	return fmt.Errorf("session event subscription closed before TurnDone: %v", subscription.Err())
}

func main() { assertoutput.MustSucceed(run(os.Stdout)) }
