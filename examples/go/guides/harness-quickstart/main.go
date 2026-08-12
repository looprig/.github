package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"
	"time"

	"github.com/looprig/core/content"
	"github.com/looprig/harness/pkg/event"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/inference"
	"github.com/looprig/inference/model"
	"github.com/looprig/inference/stream"
	"github.com/looprig/storage/memstore"
)

type offlineModel struct{}

func (offlineModel) Invoke(context.Context, inference.Request) (*inference.Response, error) {
	return nil, errors.New("this example uses streaming")
}

func (offlineModel) Stream(context.Context, inference.Request) (*stream.StreamReader[content.Chunk], error) {
	sent := false
	return stream.NewStreamReader(func() (content.Chunk, error) {
		if sent {
			return nil, io.EOF
		}
		sent = true
		return &content.TextChunk{Text: "ready"}, nil
	}, nil), nil
}

func run(ctx context.Context, output io.Writer) error {
	agent, err := loop.Define(
		loop.WithName("assistant"),
		loop.WithInference(offlineModel{}, model.CustomModel(
			"offline", model.APIFormatOpenAI, "http://localhost", "fixture",
		)),
	)
	if err != nil {
		return fmt.Errorf("define loop: %w", err)
	}

	store, err := sessionstore.Open(memstore.New())
	if err != nil {
		return fmt.Errorf("open session store: %w", err)
	}
	runtime, err := rig.Define(
		rig.WithLoops(agent),
		rig.WithPrimers("assistant"),
		rig.WithSessionStore(store),
	)
	if err != nil {
		return fmt.Errorf("define rig: %w", err)
	}

	session, err := runtime.NewSession(ctx)
	if err != nil {
		return fmt.Errorf("new session: %w", err)
	}
	defer session.Shutdown(context.Background())

	events, err := session.SubscribeEvents(event.EventFilter{
		Enduring: event.LoopScope{All: true},
	})
	if err != nil {
		return fmt.Errorf("subscribe: %w", err)
	}
	defer events.Close()

	if _, err := session.Submit(ctx, []content.Block{
		&content.TextBlock{Text: "Report status."},
	}); err != nil {
		return fmt.Errorf("submit: %w", err)
	}

	for delivery := range events.Events() {
		if done, ok := delivery.Event.(event.TurnDone); ok {
			text := done.Message.Blocks[0].(*content.TextBlock).Text
			_, err := fmt.Fprintln(output, text)
			return err
		}
	}
	return fmt.Errorf("events closed before TurnDone: %w", events.Err())
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := run(ctx, os.Stdout); err != nil {
		panic(err)
	}
}
