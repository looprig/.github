---
id: guides/web-ui/client-sdk/factory-rest
title: Factory REST client
description: Read the caller's tenant, agents, recent sessions, status, public journal pages, gates, and retained objects through validated Factory REST calls.
audience: developer
section: guides
order: 2
publication: released
proofs:
  read-routes: [release-npm-looprig-client]
  page-through-sessions-and-agents: [release-npm-looprig-client]
  journal-positions: [release-npm-looprig-client]
  retained-objects: [release-npm-looprig-client]
  verified-tool-captures: [release-npm-looprig-client]
  failures: [release-npm-looprig-client]
  source: [release-npm-looprig-client]
  proof: [release-npm-looprig-client]
---

# Factory REST client

REST is the cold-read and repair plane. Use it to render a session list, draw a session before the live link is authorized, and fill any gap the WebSocket could not deliver. `FactoryRestReads` implements the `FactoryReads` interface and is available as `client.reads` on a [Factory client](/docs/guides/web-ui/client-sdk). Every JSON response is checked against its Core schema before the promise resolves, so a caller never handles an unvalidated body.

## Read routes

| Method | Route | Result |
| --- | --- | --- |
| `readBootstrap()` | `GET /v1/bootstrap` | `FactoryBootstrap`, exactly `{ tenant_id }` |
| `listAgents(options?)` | `GET /v1/agents` | `DepartmentCapabilitySummary` |
| `listRecentSessions(options?)` | `GET /v1/sessions` | `RecentSessionPage` |
| `readStatus(sessionId)` | `GET /v1/sessions/{sid}/status` | `FactorySessionStatus` |
| `readJournal(sessionId, options?)` | `GET /v1/sessions/{sid}/journal` | `PublicJournalPage` |
| `listGates(sessionId, options?)` | `GET /v1/sessions/{sid}/gates` | `PublicGatePage` |
| `readObjectMetadata(sessionId, objectId)` | `GET /v1/sessions/{sid}/objects/{oid}/metadata` | `ObjectMetadata` |
| `readObjectRange(sessionId, objectId, range)` | `GET /v1/sessions/{sid}/objects/{oid}` with `Range` | `ObjectRange` |

Path segments are URI-encoded, and every method accepts an `AbortSignal` through its options. The bootstrap reply is stricter than a schema: it must be an object with the single member `tenant_id`, a non-empty string of at most 256 UTF-8 bytes. Anything else is a `MalformedResponseError`. The tenant it returns is the one a ClientLink subscription names.

## Page through sessions and agents

List reads take `FactoryPageOptions`, which is `{ cursor?, limit?, signal? }`. Cursors are opaque strings copied from a previous page.

```ts
import { FactoryRestReads, type RecentSessionPage } from "@looprig/client";

const reads = new FactoryRestReads({ baseUrl: "https://factory.example" });

const { tenant_id } = await reads.readBootstrap();
const agents = await reads.listAgents();
console.log(tenant_id, agents.agents.map((agent) => agent.agent_id));

let page: RecentSessionPage = await reads.listRecentSessions({ limit: 25 });
for (const session of page.sessions) {
  console.log(session.session_id, session.state, session.title);
}
if (page.next_cursor !== undefined) {
  page = await reads.listRecentSessions({ cursor: page.next_cursor, limit: 25 });
}
```

When no `fetch` is supplied, the reads use `globalThis.fetch` bound to `globalThis`. That binding matters in a browser, where an unbound `Window.fetch` throws "Illegal invocation" before a request leaves.

## Journal positions

A public journal page carries `events`, `journal_tip`, `covered_through`, and optional `next_cursor` and `previous_cursor`. `FactoryJournalOptions` selects where a read starts, and the three position options are mutually exclusive.

| Option | Sent as | Use it for |
| --- | --- | --- |
| `tail` | `tail` | A bounded tail-first read of the newest events. |
| `fromSeq` | `from_seq` | A forward read from a committed sequence, used to resume a view. |
| `cursor` | `cursor` | Continuing the capture that issued the cursor. |

Combining them throws a `RangeError` before any request, and `fromSeq` must be a non-negative safe integer. A forward page captures the tip at read time, and its `next_cursor` continues that one capture.

```ts
import { isRejectedJournalCursor, type FactoryReads } from "@looprig/client";

async function nextPage(reads: FactoryReads, sessionId: string, cursor: string, committed: number) {
  try {
    return await reads.readJournal(sessionId, { cursor, limit: 128 });
  } catch (cause) {
    // Factory answers 400 invalid_request for a cursor it no longer honours,
    // for example one minted before an upgrade or a re-placement. Drop the
    // cursor and restart the walk from a position the view still trusts.
    if (!isRejectedJournalCursor(cause)) throw cause;
    return reads.readJournal(sessionId, { fromSeq: committed + 1, limit: 128 });
  }
}
```

`isRejectedJournalCursor` is meaningful only for a read that sent a cursor, because every other parameter is validated before it leaves. The [reconnect guide](/docs/guides/web-ui/sessions/reconnect) shows how the join combines these reads with live publications.

## Retained objects

Large tool results and other retained objects are read in explicit byte ranges. `start` and `end` are inclusive, so the response must contain exactly `end - start + 1` bytes.

```ts
import type { FactoryReads } from "@looprig/client";

async function firstKilobyte(reads: FactoryReads, sessionId: string, objectId: string) {
  const metadata = await reads.readObjectMetadata(sessionId, objectId);
  if (metadata.size_bytes === 0) return undefined; // an empty range is not requestable
  const end = Math.min(metadata.size_bytes, 1024) - 1;
  // The client never reads past the requested range, even from a server
  // that sends more.
  const range = await reads.readObjectRange(sessionId, objectId, { start: 0, end });
  return { bytes: range.bytes, mediaType: range.mediaType, contentRange: range.contentRange };
}
```

The response must be `206` with a `Content-Range` of `bytes start-end/total`, and a `Content-Length`, when present, must equal the range size. A `200` answer, mismatched bounds, a short body, or an oversized chunk is a `MalformedResponseError`, and the body is cancelled before it is consumed further. Factory answers a missing object and a denied one identically, so the client cannot tell them apart either.

## Verified tool captures

When Harness retained a large tool result, the folded [tool row](/docs/guides/web-ui/client-sdk/fold) carries a `capture` summary but no bytes. `readToolCapturePages` loads that object on an explicit user action, in bounded range requests, and verifies it before returning anything.

```ts
function readToolCapturePages(
  reads: FactoryReads,
  sessionId: string,
  capture: ToolResultCaptureSummary,
  options: { pageBytes: number; ceilingBytes: number; signal?: AbortSignal },
): Promise<ToolCaptureContent>; // { metadata, pages, bytes }
```

The read runs in a fixed order:

1. `ceilingBytes` must be a non-negative safe integer and `pageBytes` a positive safe integer no larger than it, or the call throws `RangeError`. A capture larger than `ceilingBytes` throws `ToolCaptureTooLargeError`, and one without an object id throws `ToolCaptureUnavailableError`, both before any request.
2. It reads the object metadata, which must name the same object and size and carry a `sha256:` digest.
3. It requests `pageBytes`-sized ranges and checks each `Content-Range` and length exactly.
4. It computes SHA-256 over the whole assembled object and compares it with the metadata digest.

Any mismatch throws `ToolCaptureIntegrityError`, and nothing is returned until the whole object verifies. `pages` records the ranges that were issued; each entry's `bytes` is a view into the single verified `bytes` buffer, not an incremental delivery.

```ts
import {
  ToolCaptureError,
  readToolCapturePages,
  type FactoryReads,
  type ToolRow,
} from "@looprig/client";

async function loadFullResult(reads: FactoryReads, sessionId: string, row: ToolRow, signal?: AbortSignal) {
  if (row.capture === undefined) return row.result; // only the inline preview exists
  try {
    const content = await readToolCapturePages(reads, sessionId, row.capture, {
      pageBytes: 256 * 1024, // bytes per range request
      ceilingBytes: 8 * 1024 * 1024, // refuse larger captures before any request
      signal,
    });
    return row.capture.encoding === "utf-8" ? new TextDecoder().decode(content.bytes) : content.bytes;
  } catch (cause) {
    // Too large, unavailable, or failed verification: keep showing the preview.
    if (cause instanceof ToolCaptureError) return row.result;
    throw cause;
  }
}
```

## Failures

A non-2xx response is decoded as a Core error envelope and thrown as the matching `CoreProtocolError` subclass, for example `CoreSessionNotFoundError` or `CoreInvalidRequestError`. A rejected `fetch` becomes `NetworkError`, an aborted signal becomes `RequestAbortedError`, and a body that is not JSON becomes `MalformedResponseError`. Schema mismatches throw `ContractValidationError`. [Validation and errors](/docs/guides/web-ui/client-sdk/validation) covers each class.

## Source

The reads, journal options, cursor classifier, and bounded range reader are in [`packages/client/src/factory-rest.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/factory-rest.ts). The verified capture reader is in [`packages/client/src/tool-capture.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/tool-capture.ts). Error classes are in [`packages/client/src/errors.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/errors.ts), and the response validators are in [`packages/client/src/validate.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/src/validate.ts).

## Proof

[`packages/client/test/factory-rest.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/factory-rest.test.ts) covers the exact bootstrap route and shape, `from_seq` exclusivity, the restartable cursor refusal, every range-response rejection, abort and reader-failure classification, identical handling of missing and denied objects, and the bound default `fetch`. [`packages/client/test/toolsummary.test.ts`](https://github.com/looprig/client/blob/v0.3.0/packages/client/test/toolsummary.test.ts) covers `readToolCapturePages` bounds, ceiling refusal before I/O, and digest verification. Continue with [ClientLink and live streams](/docs/guides/web-ui/client-sdk/clientlink).
