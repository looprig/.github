---
id: guides/web-ui/client-sdk/validation
title: Validation and errors
description: Validate Factory responses and publications against Core sessionwire/v1 schemas and handle the client's typed protocol, transport, and command errors.
audience: developer
section: guides
order: 7
publication: released
proofs:
  validate-at-the-boundary: [release-npm-looprig-client]
  checks-beyond-json-schema: [release-npm-looprig-client]
  core-error-envelopes: [release-npm-looprig-client]
  transport-and-client-errors: [release-npm-looprig-client]
  source: [release-npm-looprig-client]
  proof: [release-npm-looprig-client]
---

# Validation and errors

Every value `@looprig/client` accepts from Factory is validated before it reaches your code: REST reads, ClientLink publications, command statuses, and error envelopes. A payload that does not match Core's `sessionwire/v1` contract fails loudly with a typed error rather than being cast. The same validators are exported, so an application that reads Factory through its own transport can apply the same boundary.

## Validate at the boundary

`factorySchemas` holds literal mirrors of Core v0.12.0's schemas for the Factory subset, 21 in all. `validateFactory(name, data)` checks one value with a strict Ajv 2020-12 validator and returns it typed; each schema also has a named helper.

```ts
import { ContractValidationError, validateFactory, validatePublicJournalPage } from "@looprig/client";

const response = await fetch(`/v1/sessions/${encodeURIComponent(sessionId)}/journal`);
try {
  const page = validatePublicJournalPage(await response.json());
  // Equivalent: validateFactory("public_journal_page", data)
  render(page.events);
} catch (error) {
  if (error instanceof ContractValidationError) {
    // schemaName names the contract; errors holds Ajv's ErrorObject list.
    report(error.schemaName, error.errors);
  } else throw error;
}
```

| Group | `FactorySchemaName` values |
|---|---|
| Requests | `create_request`, `input_request`, `interrupt_request`, `restore_request`, `gate_response_request`, `principal` |
| Reads | `agent_capability_summary`, `department_capability_summary`, `recent_session_page`, `session_status`, `public_journal_page`, `public_gate_page`, `object_metadata` |
| Session channel | `enduring_publication`, `ephemeral_publication`, `journal_tip`, `session_reset` |
| Protocol | `version_negotiation_request`, `version_negotiation_response`, `command_status`, `error_envelope` |

The TypeScript types (`PublicJournalPage`, `FactorySessionStatus`, `CommandStatus`, and the rest) are derived from these same schemas, so the compile-time and runtime shapes cannot drift. Response schemas allow additional properties, so a newer Factory can add a field without breaking this client.

## Checks beyond JSON Schema

Some Core decoder rules cannot be written as JSON Schema. After schema validation, `validateFactory` enforces them and throws `ContractValidationError` with an empty `errors` list when one fails.

- Identities are at most 256 UTF-8 bytes, and `date-time` values must be real RFC 3339 dates.
- Journal coordinates must be safe integers, so two sequences can never collide as JavaScript numbers.
- A journal page's events ascend strictly and never exceed `covered_through`, which never exceeds `journal_tip`.
- An enduring publication has `covered_through === journal_seq`; an ephemeral one carries no sequence or event id.
- A `session.reset` has `last_contiguous <= journal_tip`.
- A `rejected` command status carries an `error`, and no other status does.
- A gate page's gates ascend by open sequence, fit within `open_gate_count`, and carry a bare `http` or `https` origin and non-blank controls.
- A recent-session page is ordered by non-increasing `last_active_at`.

## Core error envelopes

A non-2xx Factory reply is validated as an `error_envelope` and mapped by `errorFromCoreEnvelope` to a `CoreProtocolError` subclass. Every subclass exposes `code`, `retryable`, and the original `body`; an unrecognised code becomes a plain `CoreProtocolError`, so new codes still reach you.

| `code` | Class |
|---|---|
| `invalid_request` | `CoreInvalidRequestError` |
| `unsupported_version` | `CoreUnsupportedVersionError` |
| `session_not_found` | `CoreSessionNotFoundError` |
| `command_rejected` | `CoreCommandRejectedError` |
| `gate_resolved` | `CoreGateResolvedError` |
| `gate_not_resumable` | `CoreGateNotResumableError` |
| `gate_expired` | `CoreGateExpiredError` |
| `gate_response_invalid` | `CoreGateResponseInvalidError` |
| `runtime_unavailable` | `CoreRuntimeUnavailableError` |

`isRejectedJournalCursor(error)` is true for a `CoreInvalidRequestError` from a journal read that carried a cursor: Factory no longer honours that opaque cursor, so restart the walk from a sequence you still hold.

## Transport and client errors

These are decided in the browser and carry no server envelope.

| Error | Raised when |
|---|---|
| `NetworkError` | `fetch` rejected without a response; `path` names the route |
| `RequestAbortedError` | the caller's `AbortSignal` fired |
| `MalformedResponseError` | the body was not JSON, or an object range reply did not match the request; carries `status` |
| `RealtimeTransportError` | a ClientLink connect, subscription, or RPC failed; `transportCode` is the transport's code when known |
| `CommandIdentityError`, `CommandIdentityMismatchError`, `MessageMetadataError` | a command identity or metadata was invalid, or a reply named another command |
| `ToolCaptureTooLargeError`, `ToolCaptureIntegrityError`, `ToolCaptureUnavailableError` | a retained tool-result read was over its ceiling, failed verification, or had no object; all extend `ToolCaptureError` |

`PendingCommand.attempt()` uses this split directly: a `CoreProtocolError` is a definitive rejection, and anything else is an unknown outcome (see [Commands and gates](/docs/guides/web-ui/client-sdk/commands)).

## Source

Schema mirrors are in [`packages/client/src/schema.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/schema.ts), the validator and semantic checks in [`validate.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/validate.ts), error classes in [`errors.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/errors.ts), and `isRejectedJournalCursor` in [`factory-rest.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/factory-rest.ts).

## Proof

[`contract.test.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/test/contract.test.ts) checks that each mirror matches Core's schema and validates Core's own fixture, refuses malformed data, enforces the semantic invariants, and rejects unsafe journal coordinates. [`errors.test.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/test/errors.test.ts) maps the published Core error fixture and preserves unknown codes. See [Factory REST client](/docs/guides/web-ui/client-sdk/factory-rest) for the reads that return these values, and the [Core module](/docs/modules/core) for the contract owner.
