# Quickstart: build one agent

This guide builds a small personal assistant that accepts one request and
streams its answer to the terminal.

You will create:

- one provider client;
- one Loop named `assistant`;
- one in-memory session store;
- one Rig;
- one live Session.

The example uses OpenRouter because its client can be constructed from a model
and API key. looprig also supports local and directly constructed providers.
Those choices are covered in [Loop](loop.md).

## Prerequisites

- Go 1.26.4 or later for the current harness and provider modules
- an OpenRouter API key
- an OpenRouter model identifier chosen by you

The model identifier is configuration, not a looprig default. This keeps the
agent under your control and avoids silently changing models when a provider's
catalog changes.

## Create the module

```sh
mkdir my-agent
cd my-agent
go mod init example.com/my-agent
go get github.com/looprig/core \
  github.com/looprig/harness \
  github.com/looprig/inference \
  github.com/looprig/llm \
  github.com/looprig/storage
```

Set your provider configuration:

```sh
export OPENROUTER_API_KEY="your-key"
export OPENROUTER_MODEL="your-provider-model-id"
```

The API key is passed to the provider client. It is never stored on the model,
Loop, Rig, or session history.

## Write the agent

Create `main.go`:

```go
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
	"github.com/looprig/llm"
	"github.com/looprig/llm/auto"
	"github.com/looprig/storage/memstore"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	// Bound the complete agent run so provider or network failures cannot hang
	// this example forever.
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	// Credentials and model choice belong to the application. They are not
	// compiled into looprig or stored in session history.
	apiKey := os.Getenv("OPENROUTER_API_KEY")
	modelName := os.Getenv("OPENROUTER_MODEL")
	if apiKey == "" || modelName == "" {
		return errors.New("set OPENROUTER_API_KEY and OPENROUTER_MODEL")
	}

	// Model is a secret-free description of what to call and how to speak to it.
	model := inference.CustomModel(
		inference.ProviderName(llm.ProviderOpenRouter),
		inference.APIFormatOpenAI,
		"https://openrouter.ai/api/v1",
		modelName,
	)
	// The client owns the credential boundary. auto.New validates the declared
	// provider and constructs the matching inference.Client.
	client, err := auto.New(model, auth.APIKey(apiKey))
	if err != nil {
		return err
	}

	// A Loop is one immutable agent definition: identity, inference, and behavior.
	assistant, err := loop.Define(
		loop.WithName("assistant"),
		loop.WithInference(client, model),
		loop.WithSystem("You are a concise personal assistant."),
	)
	if err != nil {
		return err
	}

	// The in-memory backend keeps the first example small. Swap memstore for
	// fsstore when session history must survive a process restart.
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
	defer func() { _ = session.Shutdown(ctx) }()

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
	_, err = session.Submit(ctx, []content.Block{
		&content.TextBlock{Text: "Give me three practical ways to organize my week."},
	})
	if err != nil {
		return err
	}

	// Keep consuming until this turn reaches a terminal event.
	for delivery := range stream.Events() {
		switch ev := delivery.Event.(type) {
		case event.TokenDelta:
			// TokenDelta is live-only. Here we print text while the model streams.
			if chunk, ok := ev.Chunk.(*content.TextChunk); ok {
				fmt.Print(chunk.Text)
			}
		case event.TurnDone:
			// TurnDone is the durable successful terminal event.
			fmt.Println()
			return nil
		case event.TurnFailed:
			// Live failures retain their typed provider or runtime cause.
			if ev.Err != nil {
				return ev.Err
			}
			return errors.New("agent turn failed")
		case event.TurnInterrupted:
			// Interruption is distinct from provider or model failure.
			return errors.New("agent turn was interrupted")
		}
	}
	if err := stream.Err(); err != nil {
		return err
	}
	return errors.New("event stream closed before the turn completed")
}
```

Run it:

```sh
go run .
```

## What happened

The program assembled the system in the same order looprig uses at every scale:

1. `inference.Model` described the provider, wire format, endpoint, and model
   without carrying a secret.
2. `auto.New` validated that model and bound the API key to an
   `inference.Client`.
3. `loop.Define` froze the agent's identity, client, model, and instructions.
4. `sessionstore.Open(memstore.New())` created an in-memory durable-state
   contract for this process.
5. `rig.Define` validated the complete agent topology and storage dependency.
6. `NewSession` created one live execution.
7. `SubscribeEvents` attached a consumer before work was submitted.
8. `Submit` queued the request, while `TokenDelta` and terminal events reported
   its progress and outcome.

The in-memory backend is intentional for the first run. It does not survive a
process restart. Replace it with `fsstore` when you want session history to
persist on disk.

## Next steps

- Customize the agent in [Loop](loop.md).
- Persist and restore it with [Rig](rig.md).
- Learn the live API in [Session](session.md).
- Add tools, workspaces, sandboxing, or more agents in
  [Build larger systems](larger-systems.md).
