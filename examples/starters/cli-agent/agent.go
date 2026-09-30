package main

import (
	"context"
	"errors"
	"fmt"
	"io"

	"github.com/looprig/core/content"
	"github.com/looprig/core/uuid"
	"github.com/looprig/harness/pkg/event"
	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/session"
	"github.com/looprig/inference"
	"github.com/looprig/inference/model"
	"github.com/looprig/tools"
)

const agentName = "assistant"

const systemPrompt = `You are a coding assistant working in one repository.
Use Glob, Grep and ReadFile to inspect it before answering. Paths are relative
to the repository root. When asked to change a file, use EditFile or WriteFile;
the user approves each write unless they chose "always" for a matching write
earlier in this run.`

type agentConfig struct {
	Root     string // the repository the agent works in (shared workspace)
	ReadOnly bool   // omit the write tools and use loop.WithReadOnlyAccess
	Client   inference.Client
	Model    model.Model
	Stores   *stores
}

// defineRig assembles the design-time rig: one loop with the standard file
// tools, its access gate, and the durable stores.
func defineRig(cfg agentConfig) (*rig.Rig, error) {
	readTools := []loop.Option{loop.WithTools(
		tools.GlobDefinition(readGuard{}),
		tools.GrepDefinition(readGuard{}),
		tools.ReadFileDefinition(readGuard{}),
	)}
	var access []loop.Option
	if cfg.ReadOnly {
		// One option: reads inside Root run, everything else is denied.
		access = []loop.Option{loop.WithReadOnlyAccess(cfg.Root)}
	} else {
		evaluator, err := newWriteGate(cfg.Root)
		if err != nil {
			return nil, err
		}
		access = []loop.Option{
			loop.WithTools(tools.EditFileDefinition(), tools.WriteFileDefinition()),
			loop.WithAccessGate(evaluator),
			// An explicit gate is an opaque policy collaborator, so the loop
			// needs a revision that changes whenever the policy does (a
			// restored session compares it). Bump it when you change the gate.
			loop.WithPolicyRevision("cli-agent-write-gate-v1:" + cfg.Root),
		}
	}
	options := []loop.Option{
		loop.WithName(agentName),
		loop.WithSystem(systemPrompt),
		loop.WithInference(cfg.Client, cfg.Model),
	}
	options = append(options, readTools...)
	options = append(options, access...)
	agent, err := loop.Define(options...)
	if err != nil {
		return nil, fmt.Errorf("define loop: %w", err)
	}
	return rig.Define(
		rig.WithLoops(agent),
		rig.WithPrimers(agentName),
		rig.WithSessionStore(cfg.Stores.sessions),
		// The file tools need a workspace. A shared workspace is an existing
		// directory (your repo) that humans and other tools also touch, so the
		// rig takes no exclusive lease on it. The rig requires a snapshot
		// policy; manual means it never copies the repo on its own.
		rig.WithSharedWorkspace(cfg.Stores.workspaces, cfg.Root),
		rig.WithSnapshots(rig.SnapshotPolicy{Trigger: rig.SnapshotManual}),
	)
}

// openSession creates a new session, or restores resumeID from the journal.
func openSession(ctx context.Context, r *rig.Rig, resumeID string) (session.SessionController, error) {
	if resumeID == "" {
		return r.NewSession(ctx)
	}
	id, err := uuid.Parse(resumeID)
	if err != nil {
		return nil, fmt.Errorf("--resume: %w", err)
	}
	return r.RestoreSession(ctx, id)
}

// ui is what a turn needs from the terminal: somewhere to stream output and a
// way to ask the human to approve a write.
type ui struct {
	out     io.Writer
	approve func(ctx context.Context, prompt gate.Prompt) gate.ApprovalAction
}

// runTurn submits one user message and streams the turn to u.out until it
// ends. It answers permission gates through u.approve. A failed turn is
// returned as an error; the session stays usable.
func runTurn(ctx context.Context, live session.SessionController, text string, u ui) error {
	events, err := live.SubscribeEvents(event.EventFilter{
		Ephemeral: event.LoopScope{All: true}, // token deltas and tool lifecycle
		Enduring:  event.LoopScope{All: true}, // gates and turn terminals
	})
	if err != nil {
		return err
	}
	defer func() { _ = events.Close() }()
	if _, err := live.Submit(ctx, []content.Block{&content.TextBlock{Text: text}}); err != nil {
		return err
	}
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case delivery, ok := <-events.Events():
			if !ok {
				return errors.Join(errors.New("event stream closed before the turn ended"), events.Err())
			}
			switch e := delivery.Event.(type) {
			case event.TokenDelta:
				if chunk, ok := e.Chunk.(*content.TextChunk); ok {
					fmt.Fprint(u.out, chunk.Text)
				}
			case event.ToolCallStarted:
				fmt.Fprintf(u.out, "\n[tool] %s %s\n", e.ToolName, e.Summary)
			case event.ToolCallCompleted:
				status := "ok"
				if e.IsError {
					status = firstLine(e.ResultPreview)
				}
				fmt.Fprintf(u.out, "[tool] %s %s\n", e.ToolName, status)
			case event.GateOpened:
				if e.Gate.Kind != gate.KindPermission {
					continue
				}
				action := u.approve(ctx, e.Gate.Prompt)
				if err := live.RespondGate(ctx, gate.GateResponse{
					GateID: e.Gate.ID,
					Action: string(action),
					Source: gate.ResponseSource{Kind: gate.ResponseFromUser},
				}); err != nil {
					return fmt.Errorf("answer gate: %w", err)
				}
			case event.TurnDone:
				fmt.Fprintln(u.out)
				return nil
			case event.TurnFailed:
				fmt.Fprintln(u.out)
				return fmt.Errorf("turn failed: %w", e.Err)
			case event.TurnInterrupted, event.TurnRejected:
				fmt.Fprintln(u.out)
				return fmt.Errorf("turn ended: %T", e)
			}
		}
	}
}

func firstLine(s string) string {
	for i, r := range s {
		if r == '\n' {
			return s[:i]
		}
	}
	return s
}
