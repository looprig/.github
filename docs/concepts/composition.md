---
id: concepts/composition
title: Compose a Rig from owned modules
description: Assemble model access, a loop, session storage, and a live Harness session, then extend the same boundaries with tools, gates, workspaces, and UI clients.
audience: human
section: concepts
order: 1
publication: released
proofs:
  layers:
    - release-github-com-looprig-core
    - release-github-com-looprig-inference
    - release-github-com-looprig-storage
  example:
    - release-github-com-looprig-core
    - release-github-com-looprig-harness
    - release-github-com-looprig-inference
    - release-github-com-looprig-storage
  1-create-a-standalone-module:
    - release-github-com-looprig-harness
  2-assemble-the-immutable-and-live-layers:
    - release-github-com-looprig-harness
  3-run-the-checked-fixture:
    - release-github-com-looprig-harness
  ownership:
    - release-github-com-looprig-secrets
    - release-github-com-looprig-sandbox
---

# Compose a Rig from owned modules

Looprig is a set of modules that meet at explicit Go interfaces. Your application chooses the model client, storage backend, tools, gates, workspace policy, and user interface. Harness assembles those choices into reusable configuration and creates live sessions from it.

This page builds the smallest useful composition. It uses a deterministic model stub so the program runs without credentials. The surrounding Loop, Rig, Session, storage, and event code is the same when the stub is replaced with OpenAI GPT, Anthropic Claude, Ollama, or another OpenAI-compatible model client.

## Layers {#layers}

Start with four boundaries:

| Module | Value used here | What it owns |
| --- | --- | --- |
| Core | `content.Block` | Provider-neutral messages and streamed content values. |
| Inference | `inference.Client` | The complete and streaming model-call contract. |
| Storage | `memstore.New()` | Ledger, key-value, and blob primitives used by the session store. |
| Harness | `loop.Define`, `rig.Define`, `NewSession` | Agent configuration, runtime assembly, live turns, events, and shutdown. |

The dependency direction stays simple: your model client satisfies Inference, a Loop binds that client to agent configuration, a Rig combines the Loop with runtime services, and a Session owns live work.

## Build the composition {#example}

### 1. Create a standalone module

```sh
mkdir looprig-composition
cd looprig-composition
go mod init example.com/looprig-composition
go get github.com/looprig/harness@v0.24.2 \
  github.com/looprig/core@v0.5.1 \
  github.com/looprig/inference@v0.9.2 \
  github.com/looprig/storage@v0.3.1
```

These are immutable released versions. The runnable fixture contains no local filesystem replacements.

### 2. Assemble the immutable and live layers

The following is the center of the [complete runnable program](https://github.com/looprig/.github/blob/main/examples/go/guides/harness-quickstart/main.go). `deterministicModelStub` implements `inference.Client` and emits one `ready` chunk.

```go
// Freeze one agent's model binding and configuration into a Loop.
assistant, err := loop.Define(
	loop.WithName("assistant"),
	loop.WithInference(
		deterministicModelStub{},
		model.CustomModel("fixture-model", model.APIFormatOpenAI, "http://localhost", "fixture"),
	),
)
if err != nil {
	return fmt.Errorf("define loop: %w", err)
}

// Adapt Storage's in-memory composite to Harness's session-store contract.
store, err := sessionstore.Open(memstore.New())
if err != nil {
	return fmt.Errorf("open session store: %w", err)
}

// A Rig is reusable configuration. It does not represent a live conversation.
runtime, err := rig.Define(
	rig.WithLoops(assistant),
	rig.WithPrimers("assistant"),
	rig.WithSessionStore(store),
)
if err != nil {
	return fmt.Errorf("define rig: %w", err)
}

// A Session owns live turns, subscriptions, and runtime resources.
session, err := runtime.NewSession(ctx)
if err != nil {
	return fmt.Errorf("new session: %w", err)
}
defer session.Shutdown(context.Background())
```

The complete program subscribes to enduring events before it submits input. `Submit` returns an input correlation ID. The assistant response arrives through the session event stream:

```go
events, err := session.SubscribeEvents(event.EventFilter{
	Enduring: event.LoopScope{All: true},
})
if err != nil {
	return fmt.Errorf("subscribe: %w", err)
}
defer events.Close()

_, err = session.Submit(ctx, []content.Block{
	&content.TextBlock{Text: "Report status."},
})
if err != nil {
	return fmt.Errorf("submit: %w", err)
}

for delivery := range events.Events() {
	if done, ok := delivery.Event.(event.TurnDone); ok {
		fmt.Println(done.Message.Blocks[0].(*content.TextBlock).Text)
		break
	}
}
```

### 3. Run the checked fixture

After copying the complete example into the module created above, run:

```sh
go test ./...
go run .
```

Expected output:

```text
ready
```

- [Open the complete `main.go`](https://github.com/looprig/.github/blob/main/examples/go/guides/harness-quickstart/main.go)
- [Open the exact-output `main_test.go`](https://github.com/looprig/.github/blob/main/examples/go/guides/harness-quickstart/main_test.go)
- [Read the detailed Harness lifecycle guide](/docs/modules/harness)

## Extend without rewriting the application {#ownership}

Composition works because each addition replaces or supplies one boundary:

| Requirement | Compose this module or option | Code that remains unchanged |
| --- | --- | --- |
| Hosted OpenAI GPT or Anthropic Claude | Construct an `inference.Client` with LLM and Credentials. | Loop, Rig, Session, and event handling. |
| Local Ollama or another OpenAI-compatible server | Supply the compatible client and local endpoint. | Loop, Rig, Session, and event handling. |
| Durable files on one machine | Replace `memstore` with Fsstore. | Session-store and Harness contracts. |
| JetStream-backed state | Replace the Storage backend with Natsstore. | Session-store and Harness contracts. |
| Application actions | Add prepared Tool definitions to the Loop. | Model and storage boundaries. |
| Human or policy approval | Add Harness gates and Classifiers. | Tools still prepare effects before execution. |
| Confined processes | Execute approved process tools through Sandbox. | Gate decisions remain separate from OS enforcement. |
| Browser or terminal UI | Subscribe with Client or TUI adapters. | Sessions continue to publish the same event contract. |

Credentials owns credential acquisition and refresh. Secrets owns opaque values and references. Storage owns bytes and revisions, not the meaning of a session. Gates decide whether an operation may proceed. Sandbox enforces the authority already chosen by the caller. Keeping those responsibilities separate is what lets a consumer pick only the modules its product needs.
