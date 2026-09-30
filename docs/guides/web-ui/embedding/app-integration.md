---
id: guides/web-ui/embedding/app-integration
title: Application integration
description: Compose Factory with your UI handler, CSRF configuration, and a public session-journal resolver, then feature-detect and pair versions from the browser.
audience: developer
section: guides
order: 15
publication: released
proofs:
  compose-factory-with-your-ui: [release-npm-looprig-client]
  public-journals-make-own-commands-matchable: [release-npm-looprig-client, release-npm-looprig-react]
  csrf-and-your-own-requests: [release-npm-looprig-client]
  feature-detection: [release-npm-looprig-client]
  check-versions: [release-npm-looprig-client, release-npm-looprig-react]
  source: [release-npm-looprig-client]
  proof: [release-npm-looprig-client]
---

# Application integration

This page connects the [static bundle](/docs/guides/web-ui/embedding/static-bundle) to a running Factory. The server owns authentication, origin and CSRF checks, and journal projection; the browser owns feature detection and uses only what the deployment advertises.

## Compose Factory with your UI

The UI-related options sit next to the rest of your Factory composition. The fragment below omits the credential verifier, stores, and Host options that every Factory also needs; see the [Factory module](/docs/modules/factory) for those.

```go
journals := host.NewPublicJournals(0)

opts := []factory.Option{
	factory.WithUIHandler(webui.Handler()),
	factory.WithCSRF(identity.CSRFConfig{
		SharedKey:      csrfKey, // at least 32 bytes, identical on every replica
		TokenTTL:       time.Hour,
		TrustedOrigins: []string{"https://agents.example.com"},
	}),
	// Reads a Host session's runtime journal and projects runtime ids to public ones.
	factory.WithSessionJournalResolver(func(ctx context.Context, tenant sessionwire.TenantID,
		session sessionwire.SessionID, binding sessionstore.SessionBinding) (factory.JournalReader, error) {
		store, err := runtimeStore(ctx, tenant, binding) // your lookup; refuse unknown bindings
		if err != nil {
			return nil, err
		}
		return journals.Reader(store, tenant, session, binding)
	}),
}
```

`TrustedOrigins` holds bare origins and must include the origin users load the app from; Factory also checks the request host against it. Set `TrustForwardedHeaders` only behind a proxy that overwrites `X-Forwarded-Host`.

## Public journals make own commands matchable

A Host-owned session's journal lives in the Host runtime's store, not in the store Factory reads by default. Without a journal resolver, `/journal` for such a session is empty at tip 0 and live-tail repair cannot reset viewers. `WithSessionJournalResolver` is required alongside `WithPublicCreates` or `WithPendingCommands`, and supplying it together with the older `WithJournalResolver` fails with `ErrConflictingJournalResolvers`.

Projection through `host.NewPublicJournals` also rewrites each event's `cause.command_id` to the public id the browser minted. That is what lets a UI mark its own messages: the `commandId` in a `CommandResult` is the join key.

```ts
import type { PublicJournalEvent } from "@looprig/client";

/** The public command id an event names as its cause, or "". */
export function causeCommandId(event: PublicJournalEvent): string {
  const body = event.body as { cause?: { command_id?: unknown } } | null;
  const id = body?.cause?.command_id;
  return typeof id === "string" ? id : "";
}
```

## CSRF and your own requests

The packages need no CSRF token. Their REST calls are all `GET`s, and commands travel as RPCs over the ClientLink, whose upgrade Factory accepts only with a trusted `Origin`. If your app adds its own state-changing request, such as a `POST` to a `/ui/` route mounted with `WithUIRoutes`, fetch a token from `GET /v1/csrf-token` (`{ "csrf_token", "expires_at" }`) and echo it in the `X-CSRF-Token` header. A 403 with code `csrf_token_expired` means fetch a fresh token and retry. Requests authenticated with a bearer credential are exempt only from the rules that require an `Origin` header and a CSRF token. Factory still checks every request's `Host` against the deployment's trusted hosts, and still rejects a request whose `Origin`, when supplied, is not trusted, before the bearer exemption applies.

## Feature detection

`GET /v1/capabilities` returns the launchable agents plus two deployment flags. Factory v0.12.0 and later always report `message_metadata: true`; `command_principal` is true when the deployment stamps the verified principal on commands. The client does not read this route itself, so check it before offering metadata.

```ts
import { validateFactory } from "@looprig/client";

export async function readCapabilities(signal?: AbortSignal) {
  const response = await fetch("/v1/capabilities", { cache: "no-store", signal });
  if (!response.ok) throw new Error(`capabilities: HTTP ${response.status}`);
  const body: unknown = await response.json();
  // Validates the agents list; the flags are extra members the schema allows.
  const summary = validateFactory("department_capability_summary", body);
  const flags = body as { message_metadata?: unknown; command_principal?: unknown };
  return {
    agents: summary.agents,
    messageMetadata: flags.message_metadata === true,
    commandPrincipal: flags.command_principal === true,
  };
}
```

## Check versions

| Piece | Requirement |
| --- | --- |
| `@looprig/client`, `@looprig/react` | Same exact version, 0.3.0; React and React DOM 19 |
| Wire contract | Core `sessionwire/v1` as of Core v0.12.0, validated in the client |
| Metadata on create or input | A Factory whose capabilities report `message_metadata` |
| Reasoning previews | A Host that publishes reasoning; otherwise `liveReasoning` stays empty |

Carbon v0.32.2 is a released example of this combination: it pins both packages at 0.3.0 and composes `WithUIHandler` and `WithSessionJournalResolver` on Factory v0.15.0.

## Source

Factory's options are in [`options.go`](https://github.com/looprig/factory/blob/v0.15.0/options.go) and [`journal.go`](https://github.com/looprig/factory/blob/v0.15.0/journal.go), the guard and token route in [`internal/httpapi/guard.go`](https://github.com/looprig/factory/blob/v0.15.0/internal/httpapi/guard.go), and the capabilities flags in [`internal/httpapi/reads.go`](https://github.com/looprig/factory/blob/v0.15.0/internal/httpapi/reads.go). On the browser side, `validateFactory` is in [`packages/client/src/validate.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/validate.ts) and the GET-only reads in [`packages/client/src/factory-rest.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/factory-rest.ts). Carbon's composition is [`browser/factory.go`](https://github.com/looprig/carbon/blob/v0.32.2/browser/factory.go) and its matching is [`web/src/lib/own-commands.ts`](https://github.com/looprig/carbon/blob/v0.32.2/web/src/lib/own-commands.ts).

## Proof

[`packages/client/test/factory-rest.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/factory-rest.test.ts) covers the REST reads, and [`packages/client/test/contract.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/contract.test.ts) checks the vendored Core schemas and fixtures. Carbon v0.32.2 composes the options shown here in a released product. For the command contract behind `commandId`, read [Commands and gates](/docs/guides/web-ui/client-sdk/commands).
