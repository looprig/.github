---
id: start/first-run
title: Build an agent with Harness
description: Bind an inference client to a Loop, assemble a Rig, create a Session, submit input, consume events, and shut down cleanly.
audience: developer
section: start
order: 3
publication: released
examples:
  - stage-05-loop
  - stage-06-rig
  - stage-07-session-events
proofs:
  agent:
    - release-github-com-looprig-harness
---

# Build an agent with Harness

Harness turns a model client into a stateful runtime. A Loop is immutable agent configuration, a Rig combines Loops with runtime services, and a Session owns live turns and resources.

## Assemble and run {#agent}

```go
assistant, err := loop.Define(
	loop.WithName("assistant"),
	loop.WithInference(client, selectedModel),
)
if err != nil { return err }

store, err := sessionstore.Open(memstore.New())
if err != nil { return err }

runtime, err := rig.Define(
	rig.WithLoops(assistant),
	rig.WithPrimers("assistant"),
	rig.WithSessionStore(store),
)
if err != nil { return err }

session, err := runtime.NewSession(ctx)
if err != nil { return err }
defer session.Shutdown(context.Background())

events, err := session.SubscribeEvents(event.EventFilter{
	Enduring: event.LoopScope{All: true},
})
if err != nil { return err }
defer events.Close()

_, err = session.Submit(ctx, []content.Block{
	&content.TextBlock{Text: "Report status."},
})
```

Subscribe before submitting so a fast terminal event cannot pass before the consumer is ready. `Submit` returns a correlation ID; assistant output and terminal status arrive through events.

Run the [complete commented Harness quickstart](/docs/modules/harness), which prints:

```text
ready
```

Next, [add tools and gates](/docs/start/tools-and-gates).
