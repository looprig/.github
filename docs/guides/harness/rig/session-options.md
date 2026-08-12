---
id: guides/harness/rig/session-options
title: Session Options
description: Describe SessionOption values applied when rig.NewSession creates a Session.
audience: developer
section: guides
order: 15
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  seed-validation: [release-github-com-looprig-harness]
  ownership-and-failure: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Session Options

Per-call options belong only to `Rig.NewSession`:

```go
type SessionOption func(*sessionOptions) error

func (r *Rig) NewSession(
	ctx context.Context,
	opts ...SessionOption,
) (session.SessionController, error)

func WithSeedSnapshot(ref workspacestore.Ref) SessionOption
```

The type is variadic so future session-only knobs can be added without
changing `NewSession`. `SessionOption` is not a Rig option and cannot mutate
the reusable assembly.

## Seed validation

`WithSeedSnapshot` rejects an empty reference or a duplicate seed option. At
`NewSession`, the reference must resolve in the configured workspace store and
the placement must be a per-session root or an empty exclusive root. Shared
workspace placement cannot seed because concurrent owners do not provide a
stable empty target. The seed is materialized and committed before any loop
starts; the checkpoint is part of the durable session history.

```go
live, err := runtime.NewSession(ctx, rig.WithSeedSnapshot(seedRef))
if err != nil {
	var optionErr *rig.SessionOptionError
	if errors.As(err, &optionErr) {
		log.Println("session option refused", optionErr.Kind)
	}
	return err
}
defer live.Shutdown(context.Background())
```

The returned session owns the materialized workspace. A later
`CheckpointWorkspace` or `RestoreWorkspace` is a live
`session.SessionController` operation, not a second `SessionOption`.

## Ownership and failure

Options are resolved before the lifecycle allocates a session ID, lease, or
journal. A nil option returns `SessionOptionNil`; invalid or duplicate seeds
return `*rig.SessionOptionError`. If materialization, checkpoint append, or
loop construction fails, the lifecycle unwinds acquired resources and does not
return a partially live controller.

## Source and proof

- [SessionOption and seed option implementation](https://github.com/looprig/harness/blob/main/pkg/rig/session_options.go)
- [NewSession option resolution and lifecycle call](https://github.com/looprig/harness/blob/main/pkg/rig/lifecycle.go)
- [Seed checkpoint ordering and validation tests](https://github.com/looprig/harness/blob/main/pkg/rig/lifecycle_test.go)
