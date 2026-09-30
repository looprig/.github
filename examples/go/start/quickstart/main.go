package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/looprig/core/content"
	"github.com/looprig/harness/pkg/event"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/inference"
	"github.com/looprig/inference/auth"
	"github.com/looprig/inference/inferencetest"
	"github.com/looprig/inference/model"
	"github.com/looprig/llm"
	"github.com/looprig/llm/auto"
	"github.com/looprig/storage/memstore"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

// newClient returns the model description and the client that calls it.
// Without OPENROUTER_API_KEY it returns a scripted client, so the program
// runs, and can be tested, with no account and no network.
func newClient() (model.Model, inference.Client, error) {
	apiKey := os.Getenv("OPENROUTER_API_KEY")
	if apiKey == "" {
		fmt.Fprintln(os.Stderr, "OPENROUTER_API_KEY is not set: using the scripted model")
		// inferencetest.New answers from a script, streaming in small chunks
		// like a real provider. Repeat answers every later call the same way.
		return inferencetest.Model(), inferencetest.New(
			inferencetest.Text("1. Plan Monday. 2. Batch errands. 3. Protect one focus block.").Repeat(),
		), nil
	}
	// Credentials and model choice belong to the application. They are not
	// compiled into Looprig or stored in session history.
	modelName := os.Getenv("OPENROUTER_MODEL")
	if modelName == "" {
		return model.Model{}, nil, errors.New("set OPENROUTER_MODEL to the model to use")
	}
	// Model is a secret-free description of what to call and how to speak to it.
	m := model.CustomModel(
		model.ProviderName(llm.ProviderOpenRouter),
		model.APIFormatOpenAI,
		"https://openrouter.ai/api/v1",
		modelName,
	)
	// The client owns the credential boundary. auto.New validates the declared
	// provider and constructs the matching inference.Client.
	client, err := auto.New(m, auth.APIKey(apiKey))
	if err != nil {
		return model.Model{}, nil, err
	}
	return m, client, nil
}

func run() error {
	// Bound the whole run. The event loop below watches this context, so a
	// provider that never answers cannot hang the program.
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	m, client, err := newClient()
	if err != nil {
		return err
	}

	// A Loop is one immutable agent definition: identity, inference, and behavior.
	assistant, err := loop.Define(
		loop.WithName("assistant"),
		loop.WithInference(client, m),
		loop.WithSystem("You are a concise personal assistant."),
	)
	if err != nil {
		return err
	}

	// The in-memory backend keeps the first example small. It disappears with
	// the process; "Keep history across restarts" below moves it to disk.
	store, err := sessionstore.Open(memstore.New())
	if err != nil {
		return err
	}
	// A Rig assembles one or more Loops with storage and lifecycle policy. With
	// one primer, that Loop becomes the active primer automatically.
	assembly, err := rig.Define(
		rig.WithLoops(assistant),
		rig.WithPrimers("assistant"),
		rig.WithSessionStore(store),
	)
	if err != nil {
		return err
	}

	// A Session is one live execution created from the reusable Rig.
	session, err := assembly.NewSession(ctx)
	if err != nil {
		return err
	}
	defer func() {
		// Shut down with a fresh deadline: ctx may already have expired, and
		// shutdown still needs time to write its final records.
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		_ = session.Shutdown(shutdownCtx)
	}()

	// Subscribe before submitting so live token deltas cannot be missed.
	// Ephemeral events stream progress; enduring events survive restoration.
	stream, err := session.SubscribeEvents(event.EventFilter{
		Ephemeral: event.LoopScope{All: true},
		Enduring:  event.LoopScope{All: true},
	})
	if err != nil {
		return err
	}
	defer func() { _ = stream.Close() }()

	// Submit queues human-authored content on the active primer. Completion and
	// failure arrive through the event stream, not from Submit itself.
	if _, err := session.Submit(ctx, []content.Block{
		&content.TextBlock{Text: "Give me three practical ways to organize my week."},
	}); err != nil {
		return err
	}

	return waitForTurn(ctx, stream)
}

// waitForTurn prints streamed text until the turn reaches one of its three
// terminal events. It also returns when ctx ends or the subscription closes:
// a subscription is not closed when a turn ends or a session shuts down, so
// ranging over the channel alone could wait forever.
func waitForTurn(ctx context.Context, stream event.Subscription) error {
	events := stream.Events()
	for {
		select {
		case <-ctx.Done():
			return fmt.Errorf("waiting for the turn: %w", ctx.Err())
		case delivery, ok := <-events:
			if !ok {
				// The subscription closed (for example, the consumer fell too
				// far behind). Err reports why, if there was a failure.
				if err := stream.Err(); err != nil {
					return err
				}
				return errors.New("event stream closed before the turn completed")
			}
			switch ev := delivery.Event.(type) {
			case event.TokenDelta:
				// TokenDelta is live-only. Print text while the model streams.
				if chunk, ok := ev.Chunk.(*content.TextChunk); ok {
					fmt.Print(chunk.Text)
				}
			case event.TurnDone:
				// TurnDone is the durable successful terminal event.
				fmt.Println()
				return nil
			case event.TurnFailed:
				// A live failure keeps its typed provider or runtime cause.
				if ev.Err != nil {
					return ev.Err
				}
				return errors.New("agent turn failed")
			case event.TurnInterrupted:
				// Interruption is distinct from a provider or model failure.
				return errors.New("agent turn was interrupted")
			}
		}
	}
}
