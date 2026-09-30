package main

import (
	"context"
	"errors"
	"fmt"
	"io"

	"github.com/looprig/core/content"
	"github.com/looprig/harness/pkg/event"
	"github.com/looprig/harness/pkg/session"
)

// runTurn submits one question to a live session and prints the answer as
// it streams. It returns when the turn ends, when ctx ends, or when the
// event stream closes, whichever happens first.
func runTurn(ctx context.Context, live session.Session, question string, out io.Writer) error {
	// Subscribe before submitting, so no event can pass before we listen.
	// Ephemeral events carry live progress such as token deltas; enduring
	// events are the durable record, including how the turn ended.
	stream, err := live.SubscribeEvents(event.EventFilter{
		Ephemeral: event.LoopScope{All: true},
		Enduring:  event.LoopScope{All: true},
	})
	if err != nil {
		return err
	}
	defer func() { _ = stream.Close() }()

	// Submit queues the question on the active Loop. The outcome arrives as
	// events, not as Submit's return value.
	if _, err := live.Submit(ctx, []content.Block{&content.TextBlock{Text: question}}); err != nil {
		return err
	}
	return waitForTurn(ctx, stream, out)
}

// waitForTurn prints streamed text until the turn reaches one of its three
// terminal events. A subscription stays open after a turn ends, so ranging
// over the channel alone could wait forever: always select on ctx as well.
func waitForTurn(ctx context.Context, stream event.Subscription, out io.Writer) error {
	events := stream.Events()
	for {
		select {
		case <-ctx.Done():
			return fmt.Errorf("waiting for the turn: %w", ctx.Err())
		case delivery, ok := <-events:
			if !ok {
				// The subscription closed, for example because this consumer
				// fell too far behind. Err reports why.
				if err := stream.Err(); err != nil {
					return err
				}
				return errors.New("event stream closed before the turn ended")
			}
			switch ev := delivery.Event.(type) {
			case event.TokenDelta:
				// Live model output. Print text as it arrives.
				if chunk, ok := ev.Chunk.(*content.TextChunk); ok {
					fmt.Fprint(out, chunk.Text)
				}
			case event.TurnDone:
				fmt.Fprintln(out)
				return nil
			case event.TurnFailed:
				// A failed turn carries its typed cause, such as a provider's
				// 401 or a rate limit.
				fmt.Fprintln(out)
				if ev.Err != nil {
					return fmt.Errorf("turn failed: %w", ev.Err)
				}
				return errors.New("turn failed")
			case event.TurnInterrupted:
				fmt.Fprintln(out)
				return errors.New("turn was interrupted")
			}
		}
	}
}
