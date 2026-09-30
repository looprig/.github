package main

// app.go composes Factory (the public API and browser realtime link), one
// in-process pooled Host (which runs the agent) and their storage into one
// process. Factory still reaches the Host over a loopback HostLink WebSocket:
// the two talk only through Core records and SessionStore, exactly as they
// would across machines, so moving the Host out later changes this file and
// nothing else.

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"time"

	sessionwire "github.com/looprig/core/sessionwire/v1"
	"github.com/looprig/factory"
	"github.com/looprig/factory/identity"
	"github.com/looprig/fsstore"
	"github.com/looprig/harness/pkg/rig"
	harnessstore "github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/host"
	"github.com/looprig/host/department"
	"github.com/looprig/inference"
	"github.com/looprig/inference/model"
	"github.com/looprig/sessionstore"
	"github.com/looprig/storage"
)

const (
	// agentID is what a browser names in a create request.
	agentID sessionwire.AgentID = "assistant"
	// compatibilityID names this agent build. Host refuses to restore a
	// session written by a different id, so change it when a new build
	// cannot safely replay an old journal.
	compatibilityID department.CompatibilityID = "browser-app/assistant/v1"
	// The journal binding every session is created with. Factory stores it
	// in the session's immutable catalog entry; the journal resolver below
	// refuses any other.
	bindingID      = "local-journal"
	bindingVersion = "v1"
)

// Config is everything main reads from the environment.
type Config struct {
	DataDir  string               // absolute; holds control/ and journal/
	Tenant   sessionwire.TenantID // the one tenant this process serves
	DevToken string               // shared dev password; see devauth.go
	Origins  []string             // browser origins allowed through CSRF
	Client   inference.Client
	Model    model.Model
	Logger   *slog.Logger
}

// App is the running composition.
type App struct {
	handler http.Handler

	factory    *factory.Server
	hostSvc    *host.Service
	hostServer *http.Server
	closers    []func() error // storage, closed last in reverse order
}

// Handler serves /v1 (Factory), the SPA and the dev login routes.
func (a *App) Handler() http.Handler { return a.handler }

// Start opens storage, starts the Host, then starts Factory. On error it
// releases whatever it opened.
func Start(ctx context.Context, cfg Config) (_ *App, err error) {
	a := &App{}
	defer func() {
		if err != nil {
			_ = a.Stop(context.Background())
		}
	}()

	// --- storage -----------------------------------------------------------
	// Two fsstore roots. control/ holds Factory and Host's SessionStore
	// (catalog, command inbox, host registry). journal/<tenant>/ holds the
	// harness journal: harness's legacy layout admits one tenant per backend.
	control, err := a.openFS(filepath.Join(cfg.DataDir, "control"))
	if err != nil {
		return nil, err
	}
	journal, err := a.openFS(filepath.Join(cfg.DataDir, "journal", string(cfg.Tenant)))
	if err != nil {
		return nil, err
	}
	// SessionStore retains its Open context for its whole life; it must
	// outlive a cancelled startup context, and we close it explicitly.
	controlStore, err := sessionstore.Open(context.WithoutCancel(ctx), control)
	if err != nil {
		return nil, fmt.Errorf("open control store: %w", err)
	}
	a.closers = append(a.closers, func() error { return controlStore.Close(context.Background()) })

	// The harness journal the agent writes...
	journalStore, err := harnessstore.Open(journal, harnessstore.WithTenant(cfg.Tenant))
	if err != nil {
		return nil, fmt.Errorf("open harness journal: %w", err)
	}
	// ...and the read side Factory serves /journal from: a plain SessionStore
	// over the same backend, opened the way harness writes it.
	journalRead, err := sessionstore.Open(context.WithoutCancel(ctx), journal, sessionstore.WithLegacySingleTenant(cfg.Tenant))
	if err != nil {
		return nil, fmt.Errorf("open journal reader: %w", err)
	}
	a.closers = append(a.closers, func() error { return journalRead.Close(context.Background()) })

	// --- Host ----------------------------------------------------------------
	agentRig, err := defineRig(cfg.Client, cfg.Model, journalStore)
	if err != nil {
		return nil, fmt.Errorf("define agent: %w", err)
	}
	hostToken, err := randomToken()
	if err != nil {
		return nil, err
	}
	hostListener, err := net.Listen("tcp", "127.0.0.1:0") // HostLink stays on loopback
	if err != nil {
		return nil, err
	}
	target, err := department.NewRigTarget(&hostRig{rigs: map[sessionwire.TenantID]*rig.Rig{cfg.Tenant: agentRig}}, compatibilityID, department.Capabilities{
		SupportsPooled:  true,
		AdmissionWeight: 1,
		// current_time returns a few bytes; a tool with large output would
		// declare how it bounds it.
		CaptureSafety: department.CaptureSafetyStreaming,
	})
	if err != nil {
		_ = hostListener.Close()
		return nil, err
	}
	a.hostSvc, err = host.Compose(ctx, host.Composition{
		Options: host.Options{
			HostID: "local",
			// A BARE base: Factory derives each tenant's HostLink address.
			InternalEndpoint: sessionwire.InternalEndpoint("ws://" + hostListener.Addr().String()),
			// Factory never places onto a tenant_exclusive pooled Host.
			IsolationClass:    sessionwire.HostIsolationClassCrossTenantIsolated,
			Placement:         sessionwire.HostPlacementPooled,
			Capacity:          16,
			WarmTTL:           10 * time.Minute,
			RegistryHeartbeat: 2 * time.Second,
			RegistryExpiry:    10 * time.Second,
			ClaimTTL:          5 * time.Second,
			ApplyDeadline:     60 * time.Second,
			CommandQueueSize:  16,
			ReconcileInterval: time.Second,
			ReconcileBatch:    32,
		},
		// A Host generation must increase every time this HostID restarts;
		// the clock is enough for one process on one machine.
		Generation:           uint64(time.Now().UnixNano()),
		Link:                 host.LinkOptions{MaxBindingsPerLink: 64, MaxBindings: 256, MaxTenantLinks: 4},
		Drain:                host.DrainOptions{Grace: 10 * time.Second, IdleBoundary: 5 * time.Second, PublishBound: 2 * time.Second},
		CompatibilityTimeout: 20 * time.Second,
		WorkPoll:             time.Second,
		// Stream text, reasoning and tool steps to every viewer.
		LiveText: &host.LiveTextOptions{IncludeReasoning: true, IncludeToolSteps: true},
		Collaborators: host.Collaborators{
			Backend: control,
			// Settlement evidence: where each binding's journal lives. It must
			// be the harness store the rig writes, or commands never settle.
			JournalStores: map[host.EvidenceKey]sessionstore.DispositionEvidenceReader{
				{TenantID: cfg.Tenant, StorageBindingID: bindingID}: journalStore,
			},
			Registrar: host.RegistrarFunc(func(context.Context) ([]department.Registration, error) {
				return []department.Registration{{AgentID: agentID, Target: target}}, nil
			}),
			Checkpointer:    noCheckpoint{}, // the agent has no workspace to snapshot
			Auth:            hostLinkAuth{tenant: cfg.Tenant, token: hostToken},
			Workspaces:      scratchWorkspaces{root: filepath.Join(cfg.DataDir, "workspaces")},
			NamespaceLayout: func(t sessionwire.TenantID, s sessionwire.SessionID) string { return string(t) + "/" + string(s) },
			Logger:          cfg.Logger,
		},
	})
	if err != nil {
		_ = hostListener.Close()
		return nil, fmt.Errorf("compose host: %w", err)
	}
	if err := a.hostSvc.Start(ctx); err != nil {
		_ = hostListener.Close()
		return nil, fmt.Errorf("start host: %w", err)
	}
	a.hostServer = &http.Server{Handler: a.hostSvc.Routes(), ReadHeaderTimeout: 5 * time.Second}
	go func() { _ = a.hostServer.Serve(hostListener) }()

	// --- Factory -------------------------------------------------------------
	service, err := identity.NewPrincipal(cfg.Tenant, "factory-sweeper", identity.KindService)
	if err != nil {
		return nil, err
	}
	directory, err := factory.NewStoreDirectory(controlStore, factory.DefaultDirectoryLimits())
	if err != nil {
		return nil, err
	}
	csrfKey := make([]byte, identity.MinCSRFSharedKeyBytes)
	if _, err := rand.Read(csrfKey); err != nil {
		return nil, err
	}
	publicJournals := host.NewPublicJournals(0)
	a.factory, err = factory.New(
		factory.WithCredentialVerifier(devVerifier{tenant: cfg.Tenant, token: cfg.DevToken}),
		factory.WithAuthorizer(devAuthorizer{tenant: cfg.Tenant}),
		factory.WithSessionCookieName(devCookie),
		factory.WithDefaultTenant(cfg.Tenant),
		// One process, so a per-process key is enough. Every replica of a
		// real deployment must share one key.
		factory.WithCSRF(identity.CSRFConfig{SharedKey: csrfKey, TokenTTL: 12 * time.Hour, TrustedOrigins: cfg.Origins}),
		factory.WithSessionReader(controlStore),
		factory.WithCommands(controlStore),
		factory.WithCatalog(controlStore),
		factory.WithGates(controlStore),
		factory.WithHostTargets(controlStore),
		factory.WithDirectory(directory),
		factory.WithPublicCreates(controlStore),
		// Without this nothing is ever placed on the Host.
		factory.WithPendingCommands(controlStore),
		factory.WithDepartment(factory.LaunchTemplate{Key: sessionstore.HostTargetKey{
			AgentID: agentID, RuntimeCompatibilityID: string(compatibilityID), Placement: sessionwire.HostPlacementPooled,
		}}),
		factory.WithSessionBinding(bindingID, bindingVersion),
		// A Host session's journal is the runtime's, not the control store's.
		// Wrap it in host's public projection so no runtime id reaches a browser.
		factory.WithSessionJournalResolver(func(_ context.Context, tenant sessionwire.TenantID, s sessionwire.SessionID, b sessionstore.SessionBinding) (factory.JournalReader, error) {
			if tenant != cfg.Tenant || b.StorageBindingID != bindingID || b.BindingVersion != bindingVersion {
				return nil, fmt.Errorf("unknown journal binding %q/%q for tenant %q", b.StorageBindingID, b.BindingVersion, tenant)
			}
			return publicJournals.Reader(journalRead, tenant, s, b)
		}),
		// This agent retains no tool-result objects, so the object route has
		// nothing to serve (and with no ObjectPolicy it answers 503).
		factory.WithSessionObjectStoreResolver(func(context.Context, sessionwire.TenantID, sessionwire.SessionID, sessionstore.SessionBinding) (factory.ObjectReader, error) {
			return nil, errors.New("this app serves no session objects")
		}),
		factory.WithHostLinkCredential(staticToken(hostToken)),
		factory.WithServiceIdentity(service),
		factory.WithReplicaID("local"),
		factory.WithUIHandler(spaHandler()),
		factory.WithLogger(cfg.Logger),
	)
	if err != nil {
		return nil, fmt.Errorf("compose factory: %w", err)
	}
	if err := a.factory.Start(ctx); err != nil {
		return nil, fmt.Errorf("start factory: %w", err)
	}

	mux := http.NewServeMux()
	registerDevAuth(mux, cfg.Tenant, cfg.DevToken)
	mux.Handle("/", a.factory.Handler())
	a.handler = mux
	return a, nil
}

// Stop shuts down in the order Factory documents for a shared process:
// fence new commands, drain the Host while its HostLink is still up, stop
// Factory, then close storage.
func (a *App) Stop(ctx context.Context) error {
	var errs []error
	if a.factory != nil {
		errs = append(errs, a.factory.Quiesce(ctx))
	}
	if a.hostSvc != nil {
		report, err := a.hostSvc.Stop(ctx)
		errs = append(errs, err)
		if len(report.Failures) > 0 {
			errs = append(errs, fmt.Errorf("host drain incomplete: %d failures", len(report.Failures)))
		}
	}
	if a.factory != nil {
		errs = append(errs, a.factory.Stop(ctx))
	}
	if a.hostServer != nil {
		errs = append(errs, a.hostServer.Close())
	}
	for i := len(a.closers) - 1; i >= 0; i-- {
		errs = append(errs, a.closers[i]())
	}
	a.factory, a.hostSvc, a.hostServer, a.closers = nil, nil, nil, nil
	return errors.Join(errs...)
}

// openFS opens one fsstore root and adapts its Blobs so SessionStore accepts
// it. fsstore refuses on its own; storage.WithBoundedBlobReaders is the
// explicit single-host opt-in (a stuck read is abandoned, not cancelled).
func (a *App) openFS(root string) (*storage.Composite, error) {
	fs, err := fsstore.Open(fsstore.Options{Root: root})
	if errors.Is(err, fsstore.ErrLegacyLayout) {
		// A root written before fsstore v0.6.0. There is no migration, and
		// retrying cannot help: the operator must move or delete it.
		return nil, fmt.Errorf("%s uses a pre-v0.6.0 fsstore layout; move or delete it: %w", root, err)
	}
	if err != nil {
		return nil, err
	}
	a.closers = append(a.closers, fs.Close)
	return fs.Backend().WithBoundedBlobReaders()
}

func randomToken() (string, error) {
	b := make([]byte, 24)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

// staticToken is the service credential Factory presents on every HostLink dial.
type staticToken string

func (t staticToken) ServiceToken(context.Context) (string, error) { return string(t), nil }

// hostLinkAuth is the Host's check of that credential.
type hostLinkAuth struct {
	tenant sessionwire.TenantID
	token  string
}

func (h hostLinkAuth) VerifyTenant(_ context.Context, tenant sessionwire.TenantID, token string) error {
	if tenant != h.tenant || !constantTimeEqual(token, h.token) {
		return errors.New("HostLink credential refused")
	}
	return nil
}

// scratchWorkspaces gives each session an empty directory. The agent's only
// tool never touches it; a file-editing agent would put its workspace here.
type scratchWorkspaces struct{ root string }

func (w scratchWorkspaces) EnsureWorkspace(_ context.Context, t sessionwire.TenantID, s sessionwire.SessionID) (string, error) {
	dir := filepath.Join(w.root, string(t), string(s))
	return dir, os.MkdirAll(dir, 0o700)
}

func (scratchWorkspaces) ReleaseWorkspace(context.Context, sessionwire.TenantID, sessionwire.SessionID) error {
	return nil
}

type noCheckpoint struct{}

func (noCheckpoint) Checkpoint(context.Context, sessionwire.TenantID, sessionwire.SessionID) error {
	return nil
}
