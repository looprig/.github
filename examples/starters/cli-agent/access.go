package main

import (
	"context"
	"fmt"
	"path/filepath"
	"strings"
	"sync"

	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/tool"
)

// Every tool call passes through the loop's access gate; a loop with no gate
// fails every call closed (the model just sees "permission denied"). This
// file builds the gate for the default read+gated-write mode. The --read-only
// mode needs none of it: loop.WithReadOnlyAccess(root) is the whole gate.

// newWriteGate returns an interactive evaluator: reads inside root run,
// writes inside root open a durable permission gate that a human answers
// (see answerGate in main.go), and everything else - reads or writes outside
// root, command execution, network - is denied.
func newWriteGate(root string) (*gate.Evaluator, error) {
	reads, err := gate.NewReadOnlyAccess(root)
	if err != nil {
		return nil, err
	}
	writes := &gatedWrites{root: reads.Roots()[0]}
	rules := &sessionRules{}
	// Route each capability kind to exactly one source. ReadOnlyAccess
	// allows filesystem.read inside root and denies command/network; the
	// write kind is routed to gatedWrites instead of ReadOnlyAccess's deny.
	bindings := []gate.AccessBinding{
		{Kind: "filesystem.read", Source: reads},
		{Kind: "filesystem.write", Source: writes},
		{Kind: tool.CapabilityCommandExecute, Source: reads},
		{Kind: "network", Source: reads},
	}
	// loop.GateApprover routes the approval through the loop's own durable
	// permission gate: the session emits event.GateOpened and the turn parks
	// until Session.RespondGate answers it. The rule writer backs "Approve
	// always"; here it lasts for the process only. Persist it (for example
	// with github.com/looprig/tools/permission) if approvals should survive.
	// No GrantIssuer: the file tools need no execution-bound grant tokens.
	return gate.NewInteractiveEvaluator(bindings, rules, loop.GateApprover(), rules, nil)
}

// gatedWrites answers Gated for a filesystem.write whose canonical scope is
// inside root, and Deny otherwise. Like ReadOnlyAccess it judges the scope
// lexically; the standard write tools resolve symlinks before preparing and
// write through a root-bound handle, so the scope is where the write lands.
type gatedWrites struct{ root string }

func (*gatedWrites) AccessVersion() uint16 { return gate.CurrentAccessVersion }

func (w *gatedWrites) AccessFor(kind, scope string) (uint8, error) {
	if kind != "filesystem.write" {
		return gate.AccessDeny, fmt.Errorf("gatedWrites does not know kind %q", kind)
	}
	path := strings.TrimPrefix(scope, "tree:")
	if !filepath.IsAbs(path) || filepath.Clean(path) != path {
		return gate.AccessDeny, fmt.Errorf("malformed filesystem scope %q", scope)
	}
	if path == w.root || strings.HasPrefix(path, w.root+string(filepath.Separator)) {
		return gate.AccessGated, nil
	}
	return gate.AccessDeny, nil
}

// sessionRules is an in-memory rule store: "Approve always" remembers the
// exact rule candidates the prompt displayed, and later calls matching one
// run without a prompt. It never stores a deny rule.
type sessionRules struct {
	mu    sync.Mutex
	allow map[string]bool
}

func (*sessionRules) MatchesDeny(context.Context, tool.Requirement) (bool, error) { return false, nil }

func (r *sessionRules) MatchesAllow(_ context.Context, req tool.Requirement) (bool, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	for _, c := range req.Candidates {
		if r.allow[c.Kind+"\x00"+c.Match] {
			return true, nil
		}
	}
	return false, nil
}

func (r *sessionRules) WriteRules(_ context.Context, candidates []tool.RuleCandidate) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.allow == nil {
		r.allow = map[string]bool{}
	}
	for _, c := range candidates {
		r.allow[c.Kind+"\x00"+c.Match] = true
	}
	return nil
}

// readGuard is the read-side policy the standard read tools enforce
// themselves: it hides secret-looking files from Glob/Grep/ReadFile and caps
// per-file reads. Paths arrive canonical (absolute, symlink-resolved).
type readGuard struct{}

func (readGuard) DeniedRead(absPath string) bool {
	base := filepath.Base(absPath)
	return base == ".env" || strings.HasPrefix(base, ".env.") ||
		strings.Contains(absPath, string(filepath.Separator)+".git"+string(filepath.Separator))
}

func (readGuard) MaxReadBytes() int64 { return 1 << 20 }
