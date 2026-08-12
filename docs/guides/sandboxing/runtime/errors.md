---
id: guides/sandboxing/runtime/errors
title: Typed Errors and Recovery
description: Classify policy, setup, grant, lifecycle, process, and network errors with errors.Is and errors.As.
audience: developer
section: guides
order: 12
publication: released
proofs:
  common-categories: [release-github-com-looprig-sandbox]
  match-sentinels-and-typed-details: [release-github-com-looprig-sandbox]
  fail-closed-on-ambiguity: [release-github-com-looprig-sandbox]
  source: [release-github-com-looprig-sandbox]
  proof: [release-github-com-looprig-sandbox]
  facade-errors: [release-github-com-looprig-sandbox]
  error-contract: [release-github-com-looprig-sandbox]
  source-and-proof: [release-github-com-looprig-sandbox]
---

# Typed Errors and Recovery

Sandbox errors are part of the control flow. Sentinel values are re-exported by the root package so callers can use `errors.Is` without importing internal packages. Some failures carry typed details through `errors.As`. Treat the category as the recovery decision, not the text string.

## Common categories

| Category | Examples | Usual response |
| --- | --- | --- |
| Profile/configuration | `ErrInvalidProfile` | Fix the profile or route before retrying. |
| Host capability | `ErrSandboxUnavailable`, `ErrWindowsSetupRequired`, `ErrWindowsSetupStale` | Inspect setup status or choose an explicitly acknowledged unconfined policy only when that is acceptable. |
| Admission | `ErrGrantDenied`, `ErrGrantRequired`, `ErrExecutorClosed`, `ErrExecutorSetClosed` | Do not spawn. Ask the gate or recreate the owner as appropriate. |
| Grant binding | `ErrGrantBadMAC`, `ErrGrantExpired`, `ErrGrantReplay`, `ErrGrantWrongCommand`, `ErrGrantTargetChanged`, `ErrGrantGuaranteeMismatch` | Discard the token and prepare/issue a fresh one after validating the operation. |
| Process setup | `ErrProcessTTYUnsupported`, `ErrProcessConPTYUnavailable`, `ErrOutputLimit` | Change the request or report a bounded failure. No silent fallback. |
| Network | `ErrEgressRouteDenied`, `ErrNetworkTargetDenied` | Keep the denial visible; a normal process exit does not erase a proxy denial. |

## Match sentinels and typed details

```go
package example

import (
	"errors"
	"fmt"

	"github.com/looprig/sandbox"
)

func classify(err error) string {
	switch {
	case err == nil:
		return "ok"
	case errors.Is(err, sandbox.ErrGrantRequired):
		return "ask the gate for an approval grant"
	case errors.Is(err, sandbox.ErrGrantReplay):
		return "discard the single-use grant"
	case errors.Is(err, sandbox.ErrNetworkTargetDenied):
		var denied *sandbox.NetworkTargetDeniedError
		if errors.As(err, &denied) {
			return fmt.Sprintf("target denied after exit %d", denied.ExitCode)
		}
		return "network target denied"
	case errors.Is(err, sandbox.ErrSandboxUnavailable):
		return "required OS confinement is unavailable"
	default:
		return err.Error()
	}
}
```

The returned exit code from a normal process is not an error category. A process can return a non-zero exit with `err == nil`; a signal, cancellation, or proof failure returns an error and `-1`. A `TargetDeniedError` preserves the completed exit code while wrapping `ErrNetworkTargetDenied`.

## Fail closed on ambiguity

If a platform cannot compile a required profile guarantee, `NewExecutorSet` or `For` fails. If an exact grant target changes identity, redemption fails. If process-tree zero proof is uncertain, the reservation capsule moves to quarantine for retry rather than releasing authority early. These are deliberate safety outcomes. Retrying the same token or treating an unknown status as success defeats the contract.

## Source

- [Root error aliases and public error surface](https://github.com/looprig/sandbox/blob/main/sandbox.go)
- [Grant and executor error sentinels](https://github.com/looprig/sandbox/blob/main/internal/exec/grant.go)

## Proof

- [Facade error and sentinel tests](https://github.com/looprig/sandbox/blob/main/facade_test.go)
