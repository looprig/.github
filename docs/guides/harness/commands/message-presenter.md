---
id: guides/harness/commands/message-presenter
title: Message presenter
description: Add trusted context around a user's message without changing its blocks or losing attribution on restore.
audience: developer
section: guides
order: 15
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  household-example: [release-github-com-looprig-harness]
  rendering-and-recovery: [release-github-com-looprig-harness]
  failure-boundary: [release-github-com-looprig-harness]
  source: [release-github-com-looprig-harness]
  proof: [release-github-com-looprig-harness]
---

# Message presenter

A product can add trusted, model-visible context before or after a human's
message with `rig.WithMessagePresenter`. Harness gives the presenter the
original blocks, the session and Loop identities, and the optional sender
`Principal` and client `MessageMetadata`. The product returns a `present.Frame`;
Harness keeps the original blocks between its prefix and suffix. This is a
presentation hook, not an authorization or identity-verification hook. Factory
stamps the verified `Principal` after authentication, while `Metadata` remains
client-defined. See [Attribution and audit](/docs/guides/harness/commands/attribution-and-audit)
for the Host capability gate, guarded status read, and one-way rollout.

## Household example

Suppose a shared household agent should read a message as `from Alex: ...`.
Build a fixed tenant-and-subject-to-display-name mapping from the product's trusted member
directory and keep that mapping stable for the session. Do not take the name
from the message text or from client-supplied metadata. The example leaves a
nil principal unlabelled, which is necessary for direct Harness submissions
and older commands that carry no sender. An unknown verified subject returns
an error instead of silently assigning someone else's name.

```go
package household

import (
    "context"
    "fmt"

    "github.com/looprig/core/content"
    sessionwire "github.com/looprig/core/sessionwire/v1"
    "github.com/looprig/harness/pkg/present"
)

type memberKey struct {
    tenant sessionwire.TenantID
    subject sessionwire.SubjectID
}

type Presenter struct {
    // Fill once from a trusted member directory; do not mutate during a session.
    Names map[memberKey]string
}

func (p Presenter) Present(_ context.Context, in present.Input) (present.Frame, error) {
    if in.Principal == nil {
        return present.Frame{}, nil // no verified sender to name
    }
    if in.Principal.Kind != sessionwire.PrincipalKindActor {
        return present.Frame{}, nil // service commands do not claim a person
    }
    name, ok := p.Names[memberKey{in.Principal.Tenant, in.Principal.Subject}]
    if !ok || name == "" {
        return present.Frame{}, fmt.Errorf("unknown household member")
    }
    return present.Frame{Prefix: []content.Block{
        &content.TextBlock{Text: "from " + name + ":\n"},
    }}, nil
}
```

Install this presenter with `rig.WithMessagePresenter(presenter)` when defining
the Rig. `Present` may also inspect `Input.SessionID`, `LoopID`, `AgentName`,
`Kind`, and cloned original `Blocks`. Keep it deterministic for the same input:
an admitted command may be redelivered before its durable application prefix
and then presented again. If display names may change, freeze the mapping for
the session or use a stable revision chosen before admission. Do not perform an
unbounded remote lookup from `Present`.

## Rendering and recovery

The frame contains at most eight nonempty UTF-8 text blocks across `Prefix`
and `Suffix`, and their combined text is at most 8192 bytes. The presenter
cannot replace, reorder, or edit the user's blocks. Harness passes defensive
copies and validates and copies the returned frame. The hook applies to
human-originated input, including a create command with an initial message;
machine-originated input bypasses it.

Harness journals the selected frame with the command. After that durable
prefix, restore and duplicate delivery reuse the recorded rendering exactly
once rather than calling the presenter again. The `Principal` and `Metadata`
are separate attribution on the journal record; adding a visible prefix does
not turn either into user-authored text. See [Submit input](/docs/guides/harness/commands/submit-input)
for the ordinary command path and [Session restore](/docs/guides/harness/session-persistence/session-store/restore)
for the durable boundary.

## Failure boundary

A presenter error or panic becomes `*present.Error` with
`ErrorPresenterFailed`; an invalid frame becomes `ErrorFrameInvalid`. Harness
refuses the admitted message before writing its command intent or sending it
to the model. A disposition-backed attempt records a durable refused prefix,
so redelivery returns that refusal without invoking the presenter again.
Without disposition evidence, a failure returns no disposition and writes no
intent. The hook receives a five-second context, but product code must honor
it: Harness cannot forcibly stop a presenter that ignores cancellation.

## Source

- [`present.Input`, `Frame`, limits, and `Run`](https://github.com/looprig/harness/blob/v0.41.0/pkg/present/present.go)
- [`rig.WithMessagePresenter`](https://github.com/looprig/harness/blob/v0.41.0/pkg/rig/presenter.go)
- [`presentUserInput` and its deadline](https://github.com/looprig/harness/blob/v0.41.0/internal/sessionruntime/present.go)

## Proof

- [Restore does not re-render](https://github.com/looprig/harness/blob/v0.41.0/internal/sessionruntime/presented_restore_test.go)
- [Failure refuses before intent](https://github.com/looprig/harness/blob/v0.41.0/internal/sessionruntime/present_refusal_test.go)
- [Frame validation and copying](https://github.com/looprig/harness/blob/v0.41.0/pkg/present/present_test.go)
