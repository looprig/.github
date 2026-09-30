package main

// runtime.go adapts a harness rig to Host's department seam.
//
// Host does not ship a public Harness adapter: department declares what Host
// needs of a runtime in its own identities, and every product writes the
// small translation below itself (Carbon's internal/app/department.go and
// the tests lane's pooledSession are the other two copies). Each method is a
// forward to a harness capability; the comments mark the obligations that
// fail silently when you get them wrong.

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/looprig/core/content"
	sessionwire "github.com/looprig/core/sessionwire/v1"
	"github.com/looprig/core/uuid"
	"github.com/looprig/harness/pkg/event"
	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/runtimecommand"
	"github.com/looprig/harness/pkg/session"
	harnesswire "github.com/looprig/harness/pkg/sessionwire"
	"github.com/looprig/host/department"
)

// hostRig is the product's department.Rig: one harness rig per tenant.
type hostRig struct {
	rigs map[sessionwire.TenantID]*rig.Rig
}

var _ department.Rig = (*hostRig)(nil)

func (r *hostRig) NewSession(ctx context.Context, req department.RigCreateRequest) (department.RigSession, error) {
	target, ok := r.rigs[req.TenantID]
	if !ok {
		return nil, fmt.Errorf("no rig for tenant %q", req.TenantID)
	}
	// OBLIGATION: launch under the binding's runtime id. Host refuses a
	// session whose ID() differs, because its journal would live where the
	// durable binding does not point.
	var opts []rig.SessionOption
	if !req.RigSessionID.IsZero() {
		opts = append(opts, rig.WithSessionID(req.RigSessionID))
	}
	controller, err := target.NewSession(ctx, opts...)
	if err != nil {
		return nil, err
	}
	return newHostSession(controller, req.TenantID, req.SessionID)
}

func (r *hostRig) RestoreSession(ctx context.Context, id uuid.UUID, req department.RigRestoreRequest) (department.RigSession, error) {
	target, ok := r.rigs[req.TenantID]
	if !ok {
		return nil, fmt.Errorf("no rig for tenant %q", req.TenantID)
	}
	controller, err := target.RestoreSession(ctx, id)
	if err != nil {
		return nil, err
	}
	return newHostSession(controller, req.TenantID, req.SessionID)
}

// hostSession is one launched harness session as Host sees it.
type hostSession struct {
	controller session.SessionController
	tenant     sessionwire.TenantID
	session    sessionwire.SessionID // the PUBLIC id; the runtime's is controller.SessionID()
}

// Host discovers these by type assertion. The required six fail an attach
// loudly when missing; the optional three do not, which is why they are
// asserted here at compile time:
//   - AttemptCloser: without it a crash or pod eviction mid-command blocks
//     the session's whole command stream forever (no_attempt_closer).
//   - PersistenceFaults: without it a storage outage leaves a dead runtime
//     resident and wedged.
//   - LiveOptionsSubscriber: without it Host cannot stream tool steps, and
//     LiveText.IncludeToolSteps silently streams nothing.
var (
	_ department.RigSession            = (*hostSession)(nil)
	_ department.IdleWaiter            = (*hostSession)(nil)
	_ department.Liveness              = (*hostSession)(nil)
	_ department.Releaser              = (*hostSession)(nil)
	_ department.PublicationSubscriber = (*hostSession)(nil)
	_ department.CommandApplier        = (*hostSession)(nil)
	_ department.LeaseEpochReporter    = (*hostSession)(nil)
	_ department.AttemptCloser         = (*hostSession)(nil)
	_ department.PersistenceFaults     = (*hostSession)(nil)
	_ department.LiveOptionsSubscriber = (*hostSession)(nil)
)

// newHostSession refuses a controller missing a capability the methods below
// forward to, so a harness change surfaces at launch rather than as a panic.
func newHostSession(controller session.SessionController, tenant sessionwire.TenantID, id sessionwire.SessionID) (*hostSession, error) {
	var missing []string
	check := func(ok bool, name string) {
		if !ok {
			missing = append(missing, name)
		}
	}
	_, ok := controller.(session.IdleWaiter)
	check(ok, "IdleWaiter")
	_, ok = controller.(session.Liveness)
	check(ok, "Liveness")
	_, ok = controller.(session.Releaser)
	check(ok, "Releaser")
	_, ok = controller.(session.LeaseEpochReporter)
	check(ok, "LeaseEpochReporter")
	_, ok = controller.(session.PersistenceFaultReporter)
	check(ok, "PersistenceFaultReporter")
	_, ok = controller.(session.ResidencyAbandoner)
	check(ok, "ResidencyAbandoner")
	_, ok = controller.(session.CommittedPublicEventProvider)
	check(ok, "CommittedPublicEventProvider")
	_, ok = controller.(runtimecommand.Applier)
	check(ok, "runtimecommand.Applier")
	_, ok = controller.(runtimecommand.AttemptCloser)
	check(ok, "runtimecommand.AttemptCloser")
	if len(missing) > 0 {
		if abandoner, ok := controller.(session.ResidencyAbandoner); ok {
			_ = abandoner.AbandonResidency(context.Background())
		}
		return nil, fmt.Errorf("harness session lacks %v", missing)
	}
	return &hostSession{controller: controller, tenant: tenant, session: id}, nil
}

func (s *hostSession) ID() uuid.UUID { return s.controller.SessionID() }

func (s *hostSession) WaitIdle(ctx context.Context) error {
	return s.controller.(session.IdleWaiter).WaitIdle(ctx)
}

func (s *hostSession) Done() <-chan struct{} { return s.controller.(session.Liveness).Done() }

func (s *hostSession) ReleaseResidency(ctx context.Context) error {
	return s.controller.(session.Releaser).ReleaseResidency(ctx)
}

func (s *hostSession) LeaseEpoch() (uint64, bool) {
	return s.controller.(session.LeaseEpochReporter).LeaseEpoch()
}

func (s *hostSession) PersistenceFaulted() <-chan struct{} {
	return s.controller.(session.PersistenceFaultReporter).PersistenceFaulted()
}

func (s *hostSession) PersistenceFault() error {
	return s.controller.(session.PersistenceFaultReporter).PersistenceFault()
}

func (s *hostSession) AbandonResidency(ctx context.Context) error {
	return s.controller.(session.ResidencyAbandoner).AbandonResidency(ctx)
}

// SubscribeCommitted relays every committed public event. It is also what
// makes gates visible: Host folds gates from this stream.
func (s *hostSession) SubscribeCommitted(ctx context.Context, _ sessionwire.EventID) (<-chan sessionwire.EnduringPublication, error) {
	source, ok := s.controller.(session.CommittedPublicEventProvider).CommittedPublicEvents()
	if !ok {
		return nil, errors.New("the session's store cannot report committed public events")
	}
	// All loops: the zero filter selects none.
	sub, err := source.SubscribeCommittedPublicEvents(event.EventFilter{Enduring: event.LoopScope{All: true}})
	if err != nil {
		return nil, err
	}
	out := make(chan sessionwire.EnduringPublication)
	go func() {
		defer close(out)
		defer func() { _ = sub.Close() }()
		for delivery := range sub.Events() {
			if delivery.EventID == "" || len(delivery.PublicBody) == 0 {
				continue
			}
			select {
			case out <- s.enduring(delivery):
			case <-ctx.Done():
				return
			}
		}
	}()
	return out, nil
}

func (s *hostSession) enduring(d event.Delivery) sessionwire.EnduringPublication {
	return sessionwire.EnduringPublication{
		TenantID: s.tenant, SessionID: s.session,
		EventID: sessionwire.EventID(d.EventID), JournalSeq: d.JournalSeq,
		CoveredThrough: d.CoveredThrough, Body: json.RawMessage(d.PublicBody),
	}
}

// SubscribeLivePublicWith streams committed events plus the transient
// previews Host's LiveText relays: text deltas, reasoning deltas when asked,
// and tool steps (harness's redacted ToolCallStarted/Completed projections)
// when asked. Raw tool arguments are never forwarded.
func (s *hostSession) SubscribeLivePublicWith(ctx context.Context, options department.LiveOptions) (<-chan department.LivePublication, error) {
	sub, err := s.controller.SubscribeEvents(event.EventFilter{
		Enduring: event.LoopScope{All: true}, Ephemeral: event.LoopScope{All: true},
	})
	if err != nil {
		return nil, err
	}
	out := make(chan department.LivePublication)
	go func() {
		defer close(out)
		defer func() { _ = sub.Close() }()
		for {
			var delivery event.Delivery
			var open bool
			select {
			case <-ctx.Done():
				return
			case delivery, open = <-sub.Events():
			}
			if !open || delivery.Event == nil {
				return
			}
			var pub department.LivePublication
			if delivery.Event.Class() == event.Enduring {
				if !delivery.Committed() {
					return // never relay an enduring event the journal has not committed
				}
				enduring := s.enduring(delivery)
				pub.Enduring = &enduring
			} else if projectable := liveProjectable(delivery.Event, options); projectable != nil {
				projected, err := harnesswire.Project(s.tenant, s.session, projectable)
				if err != nil || projected.Class != harnesswire.PublicEphemeral {
					continue
				}
				pub.Ephemeral = &sessionwire.EphemeralPublication{TenantID: s.tenant, SessionID: s.session, Body: projected.Body}
			} else {
				continue
			}
			select {
			case out <- pub:
			case <-ctx.Done():
				return
			}
		}
	}()
	return out, nil
}

// liveProjectable picks the ephemeral events worth previewing.
func liveProjectable(e event.Event, options department.LiveOptions) event.Event {
	switch value := e.(type) {
	case event.TokenDelta:
		switch chunk := value.Chunk.(type) {
		case *content.TextChunk:
			if chunk != nil && chunk.Text != "" {
				return value
			}
		case *content.ThinkingChunk:
			if options.IncludeReasoning && chunk != nil && chunk.Thinking != "" {
				return value
			}
		}
	case event.ToolCallStarted, event.ToolCallCompleted:
		if options.IncludeToolSteps {
			return value
		}
	}
	return nil
}

// ApplyCommand hands one admitted command to harness's runtime-command seam,
// which writes the durable prefix and disposition the store settles from.
//
// OBLIGATION: copy Principal and Metadata. runtimecommand.Admitted is built
// field by field, so dropping either compiles and silently loses attribution.
func (s *hostSession) ApplyCommand(ctx context.Context, cmd department.RuntimeCommand) error {
	epoch, held := s.LeaseEpoch()
	if !held {
		return errors.New("the session holds no journal lease")
	}
	// Host resolves a >64 KiB body stored by reference (it advertises
	// hostlink.payload.reference) and hands verified bytes in Payload.
	if len(cmd.Payload) == 0 && cmd.PayloadRef != (sessionwire.ObjectReference{}) {
		return errors.New("command body arrived as an unresolved reference")
	}
	admitted := runtimecommand.Admitted{
		CommandID:        runtimecommand.CommandID(cmd.CommandID),
		RuntimeCommandID: cmd.RuntimeCommandID,
		LeaseEpoch:       epoch,
		AttemptID:        runtimecommand.AttemptID(cmd.AttemptID),
		Principal:        cmd.Principal,
	}
	switch cmd.Kind {
	case "create":
		// A create's body is Core's CreateRequest; its optional first message
		// must reach the model, or it is settled "applied" and lost.
		var blocks []content.Block
		if len(cmd.Payload) > 0 {
			var request sessionwire.CreateRequest
			if err := json.Unmarshal(cmd.Payload, &request); err != nil {
				return fmt.Errorf("create body: %w", err)
			}
			var err error
			if blocks, err = decodeBlocks(request.Blocks); err != nil {
				return err
			}
		}
		admitted.Kind, admitted.Blocks, admitted.Metadata = runtimecommand.KindCreate, blocks, cmd.Metadata
	case "input":
		var request sessionwire.InputRequest
		if err := json.Unmarshal(cmd.Payload, &request); err != nil {
			return fmt.Errorf("input body: %w", err)
		}
		blocks, err := decodeBlocks(request.Blocks)
		if err != nil {
			return err
		}
		admitted.Kind, admitted.Blocks, admitted.Metadata = runtimecommand.KindInput, blocks, cmd.Metadata
	case "restore":
		admitted.Kind = runtimecommand.KindRestore // carries no body
	case "interrupt":
		admitted.Kind = runtimecommand.KindInterrupt
	case "gate_response":
		var request sessionwire.GateResponseRequest
		if err := json.Unmarshal(cmd.Payload, &request); err != nil {
			return fmt.Errorf("gate response body: %w", err)
		}
		id, err := uuid.Parse(string(request.GateID))
		if err != nil {
			return fmt.Errorf("gate response names %q: %w", request.GateID, err)
		}
		admitted.Kind = runtimecommand.KindGateResponse
		admitted.GateResponse = &gate.GateResponse{
			GateID: gate.ID(id), Action: request.Action, Values: request.Values,
			Source: gate.ResponseSource{Kind: gate.ResponseFromUser},
		}
	default:
		// Refuse an unknown kind rather than guess: the record then waits
		// for a Host that understands it.
		return fmt.Errorf("unsupported command kind %q", cmd.Kind)
	}
	_, err := s.controller.(runtimecommand.Applier).ApplyRuntimeCommand(ctx, admitted)
	return err
}

func decodeBlocks(raw json.RawMessage) ([]content.Block, error) {
	if len(raw) == 0 {
		return nil, nil
	}
	blocks, err := content.UnmarshalBlocks(raw)
	if err != nil {
		return nil, fmt.Errorf("command blocks: %w", err)
	}
	return blocks, nil
}

// CloseAttempt lets this (successor) runtime close an attempt a crashed
// predecessor left in flight. Harness decides whether that is safe.
func (s *hostSession) CloseAttempt(ctx context.Context, command sessionwire.CommandID, runtimeCommand uuid.UUID, kind, attempt string, attemptJournalEpoch uint64) error {
	closure := runtimecommand.Closure{
		CommandID:           runtimecommand.CommandID(command),
		RuntimeCommandID:    runtimeCommand,
		Kind:                runtimecommand.Kind(kind),
		AttemptID:           runtimecommand.AttemptID(attempt),
		AttemptJournalEpoch: attemptJournalEpoch,
	}
	if err := closure.Validate(); err != nil {
		return err
	}
	_, err := s.controller.(runtimecommand.AttemptCloser).CloseAttempt(ctx, closure)
	return err
}
