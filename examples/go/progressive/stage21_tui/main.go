package main

import (
	"context"
	"errors"
	"fmt"
	"os"
	"sync"

	"github.com/looprig/core/content"
	"github.com/looprig/core/uuid"
	"github.com/looprig/harness/pkg/event"
	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/workspacestore"
	"github.com/looprig/inference/model"
	"github.com/looprig/tui"
	"github.com/looprig/tui/runtime"
	"github.com/looprig/tui/sessionadapter"
)

func main() {
	output, err := run()
	if err != nil {
		panic(err)
	}
	fmt.Print(output)
}

func run() (string, error) {
	sessionID := uuid.MustParse("10000000-0000-4000-8000-000000000001")
	loopID := uuid.MustParse("20000000-0000-4000-8000-000000000002")
	inner := &fakeSubscription{events: make(chan event.Delivery, 1)}
	controller := &fakeController{
		sessionID: sessionID,
		active: fakeLoop{
			id:    loopID,
			model: model.Model{Caps: model.Capabilities{AcceptsImages: true}},
		},
		sub: inner,
	}

	agent := sessionadapter.New(controller)
	stream, err := agent.Subscribe(tui.AllLoopsEventFilter())
	if err != nil {
		return "", err
	}
	defer func() { _ = stream.Close() }()
	inner.events <- event.Delivery{
		Event:      event.SessionActive{Header: event.Header{}},
		JournalSeq: 7,
	}
	delivery, ok := <-stream.Events()
	if !ok {
		return "", errors.New("session adapter subscription closed before event")
	}
	_, active := delivery.Event.(event.SessionActive)
	if !active {
		return "", fmt.Errorf("session adapter event type = %T, want SessionActive", delivery.Event)
	}
	if err := agent.Close(context.Background()); err != nil {
		return "", err
	}
	if err := agent.Close(context.Background()); err != nil {
		return "", err
	}

	runtimeExit, err := runHeadlessRuntime()
	if err != nil {
		return "", err
	}
	return fmt.Sprintf(
		"session=%s images=%t event=active:%d shutdowns=%d runtime-exit=%d\n",
		agent.SessionID(), agent.AcceptsImages(loopID), delivery.JournalSeq,
		controller.shutdowns, runtimeExit,
	), nil
}

func runHeadlessRuntime() (int, error) {
	home, err := os.MkdirTemp("", "looprig-stage21-home-")
	if err != nil {
		return 0, err
	}
	defer os.RemoveAll(home)
	oldHome, hadHome := os.LookupEnv("HOME")
	if err := os.Setenv("HOME", home); err != nil {
		return 0, err
	}
	defer func() {
		if hadHome {
			_ = os.Setenv("HOME", oldHome)
		} else {
			_ = os.Unsetenv("HOME")
		}
	}()

	return runtime.Run(
		context.Background(),
		func(context.Context) (tui.Agent, error) {
			return nil, errors.New("headless runtime probe")
		},
		runtime.Banner{Name: "progressive TUI"},
	), nil
}

type fakeLoop struct {
	id    uuid.UUID
	model model.Model
}

func (l fakeLoop) ID() uuid.UUID       { return l.id }
func (l fakeLoop) Mode() loop.ModeName { return "chat" }
func (l fakeLoop) Model() model.Model  { return l.model }

type fakeSubscription struct {
	events chan event.Delivery
	once   sync.Once
}

func (s *fakeSubscription) Events() <-chan event.Delivery { return s.events }
func (s *fakeSubscription) Err() error                    { return nil }
func (s *fakeSubscription) Close() error {
	s.once.Do(func() { close(s.events) })
	return nil
}

type fakeController struct {
	sessionID uuid.UUID
	active    fakeLoop
	sub       *fakeSubscription
	shutdowns int
}

func (c *fakeController) SessionID() uuid.UUID    { return c.sessionID }
func (c *fakeController) ActiveLoop() loop.Handle { return c.active }
func (c *fakeController) Loop(id uuid.UUID) (loop.Handle, bool) {
	return c.active, id == c.active.id
}
func (c *fakeController) Submit(context.Context, []content.Block) (uuid.UUID, error) {
	return uuid.UUID{}, nil
}
func (c *fakeController) SubmitToLoop(context.Context, uuid.UUID, []content.Block) (uuid.UUID, error) {
	return uuid.UUID{}, nil
}
func (c *fakeController) Compact(context.Context) (uuid.UUID, error) {
	return uuid.UUID{}, nil
}
func (c *fakeController) CompactToLoop(context.Context, uuid.UUID) (uuid.UUID, error) {
	return uuid.UUID{}, nil
}
func (c *fakeController) SubscribeEvents(event.EventFilter) (event.Subscription, error) {
	return c.sub, nil
}
func (c *fakeController) RespondGate(context.Context, gate.GateResponse) error { return nil }
func (c *fakeController) Interrupt(context.Context) (bool, error)              { return false, nil }
func (c *fakeController) SetActiveLoop(context.Context, uuid.UUID) error       { return nil }
func (c *fakeController) LoopController(uuid.UUID) (loop.Controller, bool)     { return nil, false }
func (c *fakeController) CheckpointWorkspace(context.Context) (workspacestore.Ref, error) {
	return "", nil
}
func (c *fakeController) RestoreWorkspace(context.Context, workspacestore.Ref) error {
	return nil
}
func (c *fakeController) Shutdown(context.Context) error {
	c.shutdowns++
	return nil
}
