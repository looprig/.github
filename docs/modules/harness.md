---
id: modules/harness
title: Build and run agents with Harness
description: Define a loop, assemble a Rig, run a session, observe its events, and shut it down cleanly with the Harness runtime.
audience: developer
section: modules
order: 14
publication: released
examples:
  - stage-05-loop
  - stage-06-rig
  - stage-07-session-events
  - stage-12-gate-rules
  - stage-14-delegation
  - stage-19-http-serve
proofs:
  before-you-begin:
    - release-github-com-looprig-harness
  how-the-pieces-fit:
    - release-github-com-looprig-harness
  example-run-an-offline-session:
    - release-github-com-looprig-harness
  what-the-example-does:
    - release-github-com-looprig-harness
  ownership-and-shutdown:
    - release-github-com-looprig-harness
  handle-typed-errors:
    - release-github-com-looprig-harness
  choose-your-next-capability:
    - release-github-com-looprig-harness
  runnable-source-and-tests:
    - release-github-com-looprig-harness
---

# Build and run agents with Harness

Harness is the runtime for applications that need more than a single model call. It turns an immutable loop definition into a live session with events, tools, gates, persistence, workspaces, delegation, and controlled shutdown.

This guide builds the smallest useful Harness application. It runs entirely offline, so you can understand the runtime before adding provider credentials or external tools.

> **What you will build**
>
> A one-loop Rig that accepts an input, streams the deterministic response `ready`, publishes a terminal `TurnDone` event, and releases its session resources.

## Before you begin {#before-you-begin}

You need:

- [x] Go `1.26.4` or newer
- [x] A new directory outside the Looprig workspace
- [ ] Provider credentials. They are **not** required for this offline example.

Create the project:

```sh
mkdir harness-quickstart
cd harness-quickstart
go mod init example.com/harness-quickstart
```

Pin the released modules:

```sh
go get github.com/looprig/harness@v0.24.2 \
  github.com/looprig/core@v0.5.1 \
  github.com/looprig/inference@v0.9.2 \
  github.com/looprig/storage@v0.3.1
```

> **Why pin every direct module?** A standalone consumer build should resolve immutable releases without depending on Looprig's development workspace or a local `replace` directive.

Your project will contain two files:

```text
harness-quickstart/
├── go.mod       # immutable Looprig module versions
└── main.go      # model, loop, Rig, session, and event handling
```

## How the pieces fit {#how-the-pieces-fit}

```text
 immutable configuration                         live runtime

 ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
 │ model.Client │────▶│ loop.Define  │────▶│    rig.Define    │
 └──────────────┘     └──────────────┘     │ loops + storage  │
                                           └────────┬─────────┘
                                                    │ NewSession
                                           ┌────────▼─────────┐
 input ────────────────────────────────────▶│     Session      │
                                           │ Submit + events  │
                                           └────────┬─────────┘
                                                    │ Shutdown
                                           ┌────────▼─────────┐
                                           │ resources closed │
                                           └──────────────────┘
```

The layers have deliberately different jobs:

| Layer | Created by | Responsibility |
| --- | --- | --- |
| Model client | Your application or `llm` | Produce complete or streamed inference responses. |
| Loop definition | `loop.Define` | Freeze one agent's name, model, instructions, tools, and limits. |
| Rig | `rig.Define` | Assemble loops with stores, gates, workspaces, delegates, and runtime policy. |
| Session | `Rig.NewSession` | Own live turns, event subscriptions, tool resources, and shutdown. |

The Rig is reusable configuration. A Session is live state. Create the Rig once, then create or restore sessions from it.

## Example: run an offline session {#example-run-an-offline-session}

Create `main.go` with the complete program below.

```go
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
```

Run it without the Looprig workspace:

```sh
GOWORK=off go run .
```

Expected output:

```text
ready
```

> **Check:** If the program prints `ready`, the model streamed a content chunk, the loop completed a turn, and the session published the durable terminal event consumed by your application.

## What the example does {#what-the-example-does}

1. **Defines a model boundary.** `offlineModel` implements `inference.Client` without a network call.
2. **Freezes one loop.** `loop.Define` validates the name and model binding before runtime work begins.
3. **Adds session storage.** `sessionstore.Open(memstore.New())` supplies deterministic process-local persistence.
4. **Assembles a Rig.** `rig.Define` names `assistant` as the primer loop for new sessions.
5. **Subscribes before submitting.** This prevents a fast terminal event from passing before the consumer is ready.
6. **Waits for `TurnDone`.** `Submit` admits input; the event stream reports the turn's outcome.
7. **Closes in reverse order.** The subscription closes before the deferred session shutdown completes.

`Submit` returns an input correlation ID, not the assistant response. Applications observe results through the session's event stream. This separation allows one session to support streaming UI, persistence, control commands, and more than one live observer.

## Ownership and shutdown {#ownership-and-shutdown}

| Resource | Owner in this example | Release operation |
| --- | --- | --- |
| `offlineModel` | Application | None; it has no external resource. |
| `loop.Definition` | Application configuration | None; it is immutable. |
| `rig.Rig` | Application | None; live resources belong to sessions. |
| Event subscription | Calling consumer | `Close` when the consumer stops reading. |
| Session | Calling consumer | `Shutdown`, including error and cancellation paths. |

> **Warning:** Do not replace `Shutdown` with context cancellation. Cancellation stops the caller's wait. Shutdown stops admission, drains runtime work, records terminal state where configured, and releases session-owned resources.

For a long-running service, give shutdown its own bounded context instead of reusing a request context that may already be canceled.

## Handle typed errors {#handle-typed-errors}

Wrap errors with `%w`, then branch only where your application can make a useful decision:

```go
session, err := runtime.NewSession(ctx)
if err != nil {
	var lifecycle *rig.LifecycleError
	if errors.As(err, &lifecycle) {
		// Construction started but a runtime resource could not be acquired.
		return fmt.Errorf("session lifecycle %s: %w", lifecycle.Kind, err)
	}
	return err
}
```

Common boundaries include:

- `*loop.DefinitionError` for invalid immutable loop configuration;
- `*rig.DefinitionError` for an invalid composition;
- `*rig.LifecycleError` when session startup or teardown fails;
- `*session.SessionError` for live session operations;
- `Subscription.Err()` when event delivery ends unexpectedly.

Avoid matching error strings. The typed errors preserve stable classifications while wrapping the original cause.

## Choose your next capability {#choose-your-next-capability}

| If you need… | Add… | Continue with… |
| --- | --- | --- |
| A real provider | `llm` plus `credentials` | [Model access](/docs/build/01-model-access) |
| Files, shell, or application actions | `tool.Definition` values | [Tools and prepared effects](/docs/build/12-gates) |
| Human approval | `gate.Evaluator` and classifiers | [Gates](/docs/build/12-gates) |
| Durable local sessions | `fsstore` behind `sessionstore` | [Workspaces and stores](/docs/build/10-workspaces) |
| Confined commands | Sandbox-backed tools | [Sandbox](/docs/build/11-sandbox) |
| A terminal interface | `tui` | [TUI](/docs/build/24-tui) |
| A browser client | the framework-neutral client SDK | [Client](/docs/build/23-client) |

You do not need every module. Start with the boundaries your application owns, then add capabilities as composition options.

## Runnable source and tests {#runnable-source-and-tests}

- [View the runnable Harness quickstart](https://github.com/looprig/.github/tree/main/examples/go/guides/harness-quickstart)
- [View its exact-output test](https://github.com/looprig/.github/blob/main/examples/go/guides/harness-quickstart/main_test.go)
- [Inspect the released loop implementation](https://github.com/looprig/harness/tree/v0.24.2/pkg/loop)
- [Inspect the released Rig implementation](https://github.com/looprig/harness/tree/v0.24.2/pkg/rig)
- [Inspect the released session contract](https://github.com/looprig/harness/tree/v0.24.2/pkg/session)

Run the checked fixture directly:

```sh
cd examples/go/guides/harness-quickstart
GOWORK=off go test ./...
```

The fixture uses immutable releases and contains no local `replace` directive.
