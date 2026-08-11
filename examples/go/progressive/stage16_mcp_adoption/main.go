package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"sync"
	"time"

	"github.com/looprig/core/uuid"
	"github.com/looprig/harness/pkg/event"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/inference/model"
	"github.com/looprig/mcp/pkg/client"
	mcpharness "github.com/looprig/mcp/pkg/harness"
	"github.com/looprig/mcp/pkg/server"
	"github.com/looprig/mcp/pkg/transport/stdio"
)

const childMode = "LOOPRIG_PROGRESSIVE_MCP_CHILD"

type gates struct{}

func (gates) OpenGate(context.Context, mcpharness.GateRequest) (mcpharness.GateResponse, error) {
	return mcpharness.GateResponse{}, nil
}

type events struct{}

func (events) PublishEvent(context.Context, event.Event) error { return nil }

type subscription struct{ deliveries chan event.Delivery }

func (s *subscription) Events() <-chan event.Delivery { return s.deliveries }
func (s *subscription) Close() error                  { return nil }
func (s *subscription) Err() error                    { return nil }

type source struct{ sub *subscription }

func (s source) SubscribeEvents(event.EventFilter) (event.Subscription, error) { return s.sub, nil }

type controller struct {
	id  uuid.UUID
	mu  sync.Mutex
	set loop.ExternalToolset
}

func (c *controller) ID() uuid.UUID                              { return c.id }
func (*controller) Mode() loop.ModeName                          { return "" }
func (*controller) Model() model.Model                           { return model.Model{} }
func (*controller) SetMode(context.Context, loop.ModeName) error { return nil }
func (*controller) Change(context.Context, ...loop.Change) error { return nil }
func (*controller) Interrupt(context.Context) error              { return nil }
func (c *controller) ReplaceExternalTools(_ context.Context, set loop.ExternalToolset) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.set = set
	return nil
}

type controllers struct{ controller *controller }

func (c controllers) LoopController(id uuid.UUID) (loop.Controller, bool) {
	return c.controller, id == c.controller.id
}

func main() {
	if os.Getenv(childMode) == "1" {
		serveChild()
		return
	}
	if err := run(os.Stdout); err != nil {
		panic(err)
	}
}

func serveChild() {
	s, err := server.New(server.Config{Name: "docs", Version: "1.0.0"})
	must(err)
	must(s.RegisterTool(server.Tool{
		Name:        "lookup",
		Description: "Look up a local documentation topic.",
		InputSchema: json.RawMessage(`{"type":"object","properties":{"topic":{"type":"string"}}}`),
		Handler: func(context.Context, json.RawMessage) (server.Result, error) {
			return server.Result{Content: []server.Content{{Text: "found"}}}, nil
		},
	}))
	must(s.Run(context.Background()))
}

func run(output io.Writer) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	executable, err := os.Executable()
	if err != nil {
		return err
	}
	transport, err := stdio.New(stdio.Config{
		Command: executable,
		Env:     stdio.EnvAllowlist{Vars: []stdio.Var{{Name: childMode, Value: "1"}}},
	})
	if err != nil {
		return err
	}
	binding := mcpharness.Binding{
		Name:       "docs",
		Server:     client.Definition{Name: "docs", Transport: transport},
		Scope:      mcpharness.ScopeSession,
		Visibility: mcpharness.AllLoops(),
		Required:   true,
	}
	manager, err := mcpharness.NewManager(
		[]mcpharness.Binding{binding},
		mcpharness.Deps{
			SessionID: uuid.MustParse("22222222-2222-4222-8222-222222222222"),
			Gates:     gates{},
			Events:    events{},
		},
	)
	if err != nil {
		return err
	}
	defer manager.Close(ctx)
	if err := manager.Start(ctx); err != nil {
		return err
	}

	loopID := uuid.MustParse("33333333-3333-4333-8333-333333333333")
	ctrl := &controller{id: loopID}
	adopter, err := manager.StartAdoption(
		source{sub: &subscription{deliveries: make(chan event.Delivery)}},
		controllers{controller: ctrl},
	)
	if err != nil {
		return err
	}
	defer adopter.Close()
	if err := adopter.Install(ctx, loopID, "writer"); err != nil {
		return err
	}

	ctrl.mu.Lock()
	set := ctrl.set
	ctrl.mu.Unlock()
	if set.Source != mcpharness.ToolSource || len(set.Definitions) != 1 {
		return fmt.Errorf("unexpected adopted toolset: source=%q definitions=%d", set.Source, len(set.Definitions))
	}
	name := set.Definitions[0].ProducedToolNames()[0]
	if err := manager.Reconfigure(ctx, []mcpharness.BindingOp{mcpharness.DisableBinding("docs")}); err != nil {
		return err
	}
	status := manager.Status()
	if len(status) != 1 {
		return fmt.Errorf("status entries = %d, want 1", len(status))
	}
	_, err = fmt.Fprintf(output, "source=%s definitions=%d model-tool=%s enabled-after-disable=%t\n",
		set.Source, len(set.Definitions), name, status[0].Enabled)
	return err
}

func must(err error) {
	if err != nil {
		panic(err)
	}
}
