---
id: start/quickstart
title: Quickstart
description: Build and run one streaming Looprig agent from an empty Go module in a few minutes, with a hosted model or a credential-free scripted client.
audience: developer
section: start
order: 0
publication: released
proofs:
  what-you-will-build: [release-github-com-looprig-harness, release-github-com-looprig-inference]
  prerequisites: [release-github-com-looprig-harness]
  create-the-module: [release-github-com-looprig-core, release-github-com-looprig-harness, release-github-com-looprig-inference, release-github-com-looprig-llm, release-github-com-looprig-storage]
  write-the-agent: [release-github-com-looprig-harness, release-github-com-looprig-inference, release-github-com-looprig-llm]
  run-it: [release-github-com-looprig-harness]
  what-happened: [release-github-com-looprig-harness]
  keep-history-across-restarts: [release-github-com-looprig-fsstore, release-github-com-looprig-storage, release-github-com-looprig-natsstore, release-github-com-looprig-harness]
  next-steps: [release-github-com-looprig-harness]
---

# Quickstart

This page builds a small personal assistant that accepts one request and streams its answer to the terminal. It is the shortest path to a working Looprig agent: one Go module, one file, one command.

## What you will build

The program creates:

- one provider client, or a scripted client from `inferencetest` when you have no API key;
- one Loop named `assistant`, the immutable definition of the agent;
- one in-memory session store;
- one Rig, which assembles Loops with storage and lifecycle policy;
- one live Session, which runs the Rig and reports progress as events.

The hosted path uses OpenRouter because its client can be constructed from a model name and an API key. Looprig supports many other hosted and local providers through the same `inference.Client` contract; see [Providers](/docs/guides/inference/providers).

## Prerequisites

- Go 1.26.9 or later.
- For the hosted path, an OpenRouter API key and a model identifier chosen by you. The scripted path needs neither.

The model identifier is configuration, not a Looprig default. That keeps the agent under your control and avoids a silent model change when a provider's catalog changes.

## Create the module

```sh
mkdir my-agent
cd my-agent
go mod init example.com/my-agent
go get github.com/looprig/core@v0.13.2 \
  github.com/looprig/harness@v0.45.2 \
  github.com/looprig/inference@v0.15.2 \
  github.com/looprig/llm@v0.16.1 \
  github.com/looprig/storage@v0.9.1
```

These are the released versions this page was verified against. `go get github.com/looprig/harness@latest` also works; Harness is pre-1.0, so read its release notes when you move to a new minor version.

For the hosted path, set your provider configuration:

```sh
export OPENROUTER_API_KEY="your-key"
export OPENROUTER_MODEL="your-provider-model-id"
```

The API key is passed to the provider client. It is never stored on the model, Loop, Rig, or session history.

## Write the agent

Create `main.go`:

<!-- example: examples/go/start/quickstart/main.go -->
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
```

Without `OPENROUTER_API_KEY`, `newClient` returns a scripted client from `github.com/looprig/inference/inferencetest`. It validates each request like a real client and streams its scripted reply in chunks, so you can run the program, and write tests for it, without a provider.

`waitForTurn` is the part most worth copying. A Session's event subscription stays open after a turn ends and after the Session shuts down, so a plain `for delivery := range stream.Events()` loop can block forever when something goes wrong. Always select on the context as well, handle all three terminal events (`TurnDone`, `TurnFailed`, and `TurnInterrupted`), and treat a closed channel as an error.

## Run it

Without an API key:

```sh
go run .
```

```text
OPENROUTER_API_KEY is not set: using the scripted model
1. Plan Monday. 2. Batch errands. 3. Protect one focus block.
```

With OpenRouter, run `go run .` after exporting the two variables. A wrong key fails fast with the provider's typed error, for example `inference: api error 401: Unauthorized`, because `TurnFailed` carries the cause.

## What happened

The program assembled the system in the same order Looprig uses at every scale:

1. `model.Model` described the provider, wire format, endpoint, and model without carrying a secret.
2. `auto.New` validated that model and bound the API key to an `inference.Client`.
3. `loop.Define` froze the agent's identity, client, model, and instructions.
4. `sessionstore.Open(memstore.New())` created an in-memory session store for this process. The package is `github.com/looprig/harness/pkg/sessionstore`, the Harness journal store. It is not the separate `github.com/looprig/sessionstore` module, which holds Factory and Host control records; see the [glossary](/docs/overview/glossary#serving-and-orchestration).
5. `rig.Define` validated the complete agent topology and its storage dependency.
6. `NewSession` created one live execution.
7. `SubscribeEvents` attached a consumer before any work was submitted.
8. `Submit` queued the request, while `TokenDelta` and the terminal events reported its progress and outcome.

## Keep history across restarts

`memstore` disappears with the process. To keep sessions on local disk, open an `fsstore` directory and opt its Blobs in to Storage's bounded blob readers with `WithBoundedBlobReaders`, which `sessionstore.Open` requires; raw `fsstore` Blobs are refused with `sessionstore: invalid backend: missing BlobReaderLifecycle`. Handle `fsstore.ErrLegacyLayout` with a "move or delete the directory" message, never a retry. [Persist and restore sessions](/docs/start/sessions) has the complete code, including printing `session.SessionID()` and continuing a conversation with `assembly.RestoreSession(ctx, id)`.

`natsstore` with `natsstore.Options{EmbeddedDir: dir}` is another local option: it runs an embedded NATS JetStream server inside your process. For shared deployments, use `natsstore` against a NATS server (`Options.URL`), or `pgstore` with `s3store` Blobs; see [Which modules do I need?](/docs/overview/which-modules).

## Next steps

- Start a project from a [starter template](/docs/start/starters) with `gonew`: a complete CLI coding agent, or a single-process multi-user browser app on [Stack](/docs/modules/stack).
- Choose the modules for what you are building in [Which modules do I need?](/docs/overview/which-modules), and see how they fit together in [Architecture](/docs/overview/architecture).
- Customize the agent in [Define a Loop](/docs/guides/harness/loop/define-a-loop), then add tools in [Tools and tool limits](/docs/guides/harness/loop/tools-and-tool-limits). Tools run only behind an access gate; see [Access gates](/docs/guides/harness/gates/access-gates).
- Learn how events and turns end in [Terminal outcomes](/docs/guides/harness/turn/terminal-outcomes) and [Subscriptions](/docs/guides/harness/session-runtime/subscriptions).
- Follow the longer [coding assistant tutorial](/docs/start/choose-a-path) to add tools, persistence, a workspace, and sandboxed processes. Each of its steps is a complete program under [`examples/go/start`](https://github.com/looprig/.github/tree/main/examples/go/start); this page's program is [`examples/go/start/quickstart`](https://github.com/looprig/.github/tree/main/examples/go/start/quickstart).
