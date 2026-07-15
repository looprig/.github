# Session: run and control a Rig

A Session is one live execution created by a [Rig](rig.md). It owns the runtime
state that should not be shared between executions:

- live Loop actors;
- active turns and tool calls;
- durable event history;
- permission gates;
- security-ceiling state;
- the resolved workspace and its checkpoints.

The Rig is reusable. The Session is the running thing.

## Create or restore

```go
session, err := assembly.NewSession(ctx)
```

`NewSession` returns a `session.SessionController` with a newly generated session
identifier.

```go
session, err := assembly.RestoreSession(ctx, sessionID)
```

`RestoreSession` rebuilds live runtime state from the durable journal. It does
not create a second history. It resumes the existing session identity after
checking that the current Rig is compatible with the stored configuration.

The caller owns the returned controller and must shut it down:

```go
defer func() {
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = session.Shutdown(shutdownCtx)
}()
```

## Subscribe before submitting

Attach an event consumer before starting work so you do not miss live streaming
events:

```go
stream, err := session.SubscribeEvents(event.EventFilter{
	Ephemeral: event.LoopScope{All: true},
	Enduring:  event.LoopScope{All: true},
})
if err != nil {
	return err
}
defer stream.Close()
```

An event filter has separate scopes for two classes:

- **Ephemeral events** report live progress such as token deltas and tool-call
  lifecycle. They are not journaled.
- **Enduring events** report accepted input, turns, steps, gates, configuration
  changes, workspace transitions, and terminal outcomes. They survive restore.

`event.LoopScope{All: true}` selects every Loop. To follow only specific Loops,
populate the `Loops` map with their identifiers.

Consume the channel continuously. A subscription is bounded so one stalled
consumer cannot block the Session. After the channel closes, call `stream.Err()`
to distinguish an intentional close from a forced loss.

## Submit input

Send human-authored input to the active primer:

```go
inputID, err := session.Submit(ctx, []content.Block{
	&content.TextBlock{Text: "Plan my week around these three goals."},
})
```

`Submit` is fire-and-forget. A nil error means the input was sent to the Loop,
not that the turn succeeded. The returned `inputID` is the correlation ID carried
by the resulting reply events.

The event stream reports whether the input was queued, started, folded into
other input, rejected, cancelled, completed, failed, or interrupted.

To address a specific live Loop instead of the active primer:

```go
inputID, err := session.SubmitToLoop(ctx, loopID, blocks)
```

This is useful for interfaces that focus different agents within one Session.
It does not change which primer is active.

## Content blocks

Input is an ordered slice of `content.Block` values. The shared `core/content`
package defines:

- `TextBlock`;
- `ImageBlock`;
- `AudioBlock`;
- `DocumentBlock`;
- `ThinkingBlock`;
- `ToolUseBlock`;
- `ToolResultBlock`.

Ordinary user input usually contains text, images, audio, or documents. Declare
matching model capabilities with `inference.WithImages` and other model options
where appropriate. Provider codecs reject unsupported shapes rather than
silently dropping them.

## Read events

```go
for delivery := range stream.Events() {
	switch ev := delivery.Event.(type) {
	case event.TokenDelta:
		if text, ok := ev.Chunk.(*content.TextChunk); ok {
			fmt.Print(text.Text)
		}
	case event.GateOpened:
		// Present ev.Gate to a person or a policy resolver.
	case event.TurnDone:
		// ev.Message is the complete assistant response.
	case event.TurnFailed:
		// ev.Err is the typed live failure cause when available.
	case event.TurnInterrupted:
		// The turn ended through cancellation.
	}
}
if err := stream.Err(); err != nil {
	return err
}
```

Each `event.Delivery` contains:

- `Event`, a member of the sealed event union;
- `JournalSeq`, which is zero for ephemeral events and the durable sequence for
  enduring events.

Use concrete event types rather than parsing event names or error strings.

## Answer permission gates

A permission checker may decide that a tool call needs human approval. The
Session emits `event.GateOpened` and pauses the affected work without blocking
the rest of the process.

Approve a permission request at an explicit scope:

```go
scopeValue, ok := tool.ApprovalScopeValue(tool.ScopeOnce)
if !ok {
	return errors.New("unsupported approval scope")
}
rawScope, err := json.Marshal(scopeValue)
if err != nil {
	return err
}
err = session.RespondGate(ctx, gate.GateResponse{
	GateID: opened.Gate.ID,
	Action: "approve",
	Values: map[string]json.RawMessage{"scope": rawScope},
	Source: gate.ResponseSource{Kind: gate.ResponseFromUser},
})
```

Deny it:

```go
err := session.RespondGate(ctx, gate.GateResponse{
	GateID: opened.Gate.ID,
	Action: "deny",
	Source: gate.ResponseSource{Kind: gate.ResponseFromUser},
})
```

The scope vocabulary is `tool.ScopeOnce`, `tool.ScopeSession`, and
`tool.ScopeWorkspace`, but each gate advertises the scopes valid for that
request. Use `tool.ApprovalScopeValue` as shown instead of hardcoding response
strings in application logic.

Gates are durable. A restorable gate can remain open across process restart and
be answered after `RestoreSession` reconstructs it.

## Interrupt work

```go
interrupted, err := session.Interrupt(ctx)
```

This requests cancellation of every in-flight turn in the Session and reports
whether any running work was actually interrupted. The durable event stream
reports the resulting terminal outcomes.

For one Loop subtree, obtain its trusted controller and call `Interrupt`:

```go
controller, ok := session.LoopController(loopID)
if ok {
	err = controller.Interrupt(ctx)
}
```

## Select and change Loops

Inspect the current primer:

```go
active := session.ActiveLoop()
fmt.Println(active.ID(), active.Mode(), active.Model().Name)
```

Switch the active primer by live Loop identifier:

```go
err := session.SetActiveLoop(ctx, anotherPrimerID)
```

Change one Loop's declared mode:

```go
controller, ok := session.LoopController(loopID)
if !ok {
	return errors.New("loop not found")
}
err := controller.SetMode(ctx, "deep-review")
```

Or change its model and effort atomically:

```go
err := controller.Change(
	ctx,
	loop.ChangeModel(newModel),
	loop.ChangeEffort(inference.EffortHigh),
)
```

Changes apply at a turn boundary and produce enduring events.

## Compact context

Request manual compaction on the active Loop:

```go
compactID, err := session.Compact(ctx)
```

Or target one Loop:

```go
compactID, err := session.CompactToLoop(ctx, loopID)
```

The returned ID correlates durable compaction outcomes. Compaction is supported
only for native Loops configured with an explicit compaction policy and a
compatible Hustle registered on the Rig.

## Checkpoint and restore the workspace

Create an explicit content-addressed snapshot:

```go
ref, err := session.CheckpointWorkspace(ctx)
```

Restore the current Session workspace to an earlier reference:

```go
err := session.RestoreWorkspace(ctx, ref)
```

Both operations require a configured workspace placement. Workspace restoration
is a control-plane action and should be exposed only to trusted callers.

## Change the security ceiling

```go
err := session.SetSecurityCeiling(ctx, ceiling.Level(2))
```

The value is clamped by the Session's ceiling state. The harness journals the
effective change. Your application owns the mapping from ordinal levels to
permission and sandbox postures.

## Public interfaces

The ordinary data plane is:

```go
type Session interface {
	SessionID() uuid.UUID
	ActiveLoop() loop.Handle
	Loop(uuid.UUID) (loop.Handle, bool)
	Submit(context.Context, []content.Block) (uuid.UUID, error)
	SubmitToLoop(context.Context, uuid.UUID, []content.Block) (uuid.UUID, error)
	Compact(context.Context) (uuid.UUID, error)
	CompactToLoop(context.Context, uuid.UUID) (uuid.UUID, error)
	SubscribeEvents(event.EventFilter) (event.Subscription, error)
	RespondGate(context.Context, gate.GateResponse) error
	Interrupt(context.Context) (bool, error)
}
```

The trusted control plane adds:

```go
type SessionController interface {
	Session
	SetActiveLoop(context.Context, uuid.UUID) error
	LoopController(uuid.UUID) (loop.Controller, bool)
	SetSecurityCeiling(context.Context, ceiling.Level) error
	CheckpointWorkspace(context.Context) (workspacestore.Ref, error)
	RestoreWorkspace(context.Context, workspacestore.Ref) error
	Shutdown(context.Context) error
}
```

Prefer the narrower `session.Session` interface in code that does not need
trusted policy or lifecycle operations.

Next, [add persistence, tools, multiple agents, and deployment surfaces](larger-systems.md).
