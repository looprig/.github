import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const modulesRoot = path.join(root, "docs/modules");
const inventory = JSON.parse(readFileSync(path.join(root, "docs/_data/modules.json"), "utf8"));

const names = new Map([
  ["drain", "Drain"],
  ["pgstore", "PGStore"],
  ["s3store", "S3Store"],
  ["sessionstore", "SessionStore"],
  ["factory", "Factory"],
  ["host", "Host"],
  ["controller", "Controller"],
  ["wui", "WUI"],
  ["acp", "ACP"],
  ["classifiers", "Classifiers"],
  ["client", "Client"],
  ["core", "Core"],
  ["credentials", "Credentials"],
  ["eval", "Eval"],
  ["flow", "Flow"],
  ["flow-store", "Flow Store"],
  ["foreignloops", "Foreign Loops"],
  ["fsstore", "FSStore"],
  ["harness", "Harness"],
  ["inference", "Inference"],
  ["llm", "LLM"],
  ["mcp", "MCP"],
  ["natsstore", "NATSStore"],
  ["rclonestore", "RcloneStore"],
  ["sandbox", "Sandbox"],
  ["secrets", "Secrets"],
  ["storage", "Storage"],
  ["tools", "Tools"],
  ["tui", "TUI"],
  ["workflows", "Workflows"],
]);

const ecosystem = new Map([
  ["drain", "Drain is useful on its own when a long-lived Go process has to stop cleanly inside a platform deadline, such as a Kubernetes pod receiving SIGTERM, a systemd or Compose service, or a Job worker that should exit once idle. Each unit of in-flight work takes a hold for a named reason. A drain, started by a signal, by idleness, or by an explicit `Begin`, runs one sequence: quiesce, settle, close admission, wait per reason, abandon what will not finish, and return an `Outcome`. The whole sequence is bounded by a grace period that should sit below the platform's own, such as `terminationGracePeriodSeconds` or `TimeoutStopSec`. Admission is decided by the `ok` result of `Acquire`, because checking `Draining` first is a race. `Run` installs SIGTERM and SIGINT handling, while `Wait` installs nothing, so a process that already owns its signals, such as a terminal UI, calls `Begin` from its own handler. Enable `WithIdleTimeout` only where a clean exit is the intended lifecycle, because under a Deployment or StatefulSet an idle exit becomes a restart loop.\n\nWithin Looprig, Drain is a foundation module with no Looprig dependencies. It belongs at the composition root of a long-running process, for example one that embeds [Host](/docs/modules/host) or [Harness](/docs/modules/harness), where a hold per active turn or pending gate decides when exit is safe. The `drain/draintest` package supplies a manual clock so shutdown wiring can be tested without real sleeps. Drain owns the shutdown sequence, admission cutoff, per-reason deadlines, and the grace ceiling. Callers own what each reason means and what abandoning work implies, along with readiness probes, metrics, and persistence."],
  ["pgstore", "PGStore is useful on its own when a Go service already runs PostgreSQL and needs durable append-only ledgers, renewable epoch leases, revisioned key-value records, or an ordered index with bounded cursors, without operating a separate coordination service. It suits multi-replica deployments where replicas share one database. Leases use row transactions with epoch and holder fences, and `Lost()` closes when ownership can no longer be proved. `Open` requires a DSN with verified TLS, and plaintext is allowed only for an explicitly enabled loopback test database. `Options.Migrations` chooses whether `Open` validates the embedded schema, applies it under a transaction-scoped lock, or leaves an externally managed schema alone. PGStore keeps no session-scoped server state: timeouts are applied per transaction, advisory locks are transaction-scoped, and prepared-statement caching is disabled, so it works behind a transaction-mode pooler such as PgBouncer. The measured pooler settings are documented in the repository's `docs/OPERATIONS.md`.\n\nWithin Looprig, PGStore implements the structured primitives of [Storage](/docs/modules/storage) and deliberately does not implement Blobs. A cloud composition pairs it with [S3Store](/docs/modules/s3store), and together they supply every primitive [SessionStore](/docs/modules/sessionstore) requires, which makes the pair a server-side alternative to [FSStore](/docs/modules/fsstore) and [NATSStore](/docs/modules/natsstore) for [Harness](/docs/modules/harness) and [Host](/docs/modules/host) deployments. PGStore owns the schema, pooling behaviour, fencing, and lost-acknowledgement resolution, where an append it cannot prove surfaces as `storage.AmbiguousError`. Callers own record meaning, retention, and schema ownership across deployments."],
  ["s3store", "S3Store is useful on its own when a Go service needs immutable, content-verified blobs in AWS S3 or an S3-compatible service such as MinIO, for example session artifacts or large tool outputs in a cloud deployment. `Put` streams while hashing, checks the committed length and SHA-256, then publishes a small manifest with `If-None-Match: *`, so an identical retry is a no-op and different bytes under the same key are a `BlobConflictError`. Tenants can share one bucket, separated by a deployment prefix. Encryption must be chosen explicitly, and HTTPS is mandatory outside an explicit loopback test option. `Close` on a reader returned by `Get` never waits for an in-flight `Read`: it tears down a stalled network read within the declared `BlobReaderCloseBound` of five seconds, a ceiling measured on loopback rather than a latency guarantee. `Read` is not safe against a concurrent `Read`, and the stream lives only as long as the context passed to `Get`.\n\nWithin Looprig, S3Store implements the Blobs primitive of [Storage](/docs/modules/storage) together with its optional bounded reader lifecycle, and nothing else. A cloud composition pairs it with [PGStore](/docs/modules/pgstore) for the structured primitives. The reader lifecycle is what lets it sit under [SessionStore](/docs/modules/sessionstore), whose `Open` rejects a Blobs provider without it, so S3Store is the blob provider for SessionStore-backed [Harness](/docs/modules/harness) and [Host](/docs/modules/host) deployments. S3Store owns key encoding, verified publication, encryption headers, and reader teardown. Callers own retention and cleanup, because it performs no orphan or garbage collection."],
  ["sessionstore", "SessionStore is useful on its own when several processes must share one durable record of each agent session without calling each other. Typical cases are a multi-tenant hosted agent service whose front-end replicas and runtime hosts are deployed separately, and a system that places each session on a dedicated worker. It keeps a tenant-scoped catalog of sessions and their desired placement, fenced journals, and an immutable, ordered command inbox that runtimes claim and settle from recorded evidence, with a durable cursor for consumers. It also stores open approval gates, residency grants, a Host registry, and the recorded outcome when a placement's workload ends.\n\nWithin Looprig, SessionStore is the shared contract between [Factory](/docs/modules/factory) and [Host](/docs/modules/host). Factory writes catalog entries, admits commands, and reads gates and journals. A Host acquires residency, claims and settles commands, and publishes the gates its runtime opens. [Controller](/docs/modules/controller) reads desired placement and records how a workload ended, and [Harness](/docs/modules/harness) writes its runtime journal in SessionStore's envelope format. SessionStore is built only from [Core](/docs/modules/core) wire records and [Storage](/docs/modules/storage) primitives. The backend's Blobs provider must implement Storage's bounded reader lifecycle, so `Open` refuses [FSStore](/docs/modules/fsstore) Blobs, while [S3Store](/docs/modules/s3store), [NATSStore](/docs/modules/natsstore), and Storage's memory backend qualify.\n\nSessionStore owns fencing, ordering, and durable encoding. Callers own transport, authentication, the backend they open, and the decision about which records to write."],
  ["factory", "Factory is useful on its own when you are building the public front end of a hosted agent service. Typical cases are a multi-tenant service where browsers and API clients create sessions, send input, answer approval gates, and follow live output, and a deployment that spreads sessions across pooled Hosts or starts one dedicated Host per session. It is a library composed with `factory.New`, and it ships no binary and no UI. A product mounts its own interface with `WithUIFS`, `WithUIHandler`, or `WithUIRoutes`, and Factory serves it behind its authentication, origin, and CSRF guards. Authentication and authorization are seams you inject, such as `identity.Verifier` and an `Authorizer`; an authorizer that returns `identity.ErrUnauthorized` produces a 403.\n\nWithin Looprig, Factory imports neither [Host](/docs/modules/host) nor [Harness](/docs/modules/harness). It talks to Hosts only through [Core](/docs/modules/core) wire records and [SessionStore](/docs/modules/sessionstore) records. Factory admits commands into SessionStore and places sessions with open work on a live, compatible Host, attaching and binding them over HostLink with one link per Host and tenant, and relays each watched session's live output to its viewers. It sends a gate response only to a Host that advertises that capability. Dedicated placement goes through the platform-neutral `WorkloadController` seam, which [Controller](/docs/modules/controller) implements for Kubernetes, and [WUI](/docs/modules/wui) is a ready browser interface to mount. A Host advertises a bare HostLink base from which Factory derives each tenant's address, so Factory and Host releases should move together.\n\nFactory owns the client-facing protocol, admission, and placement decisions. Callers own identity, authorization policy, the UI, the storage backends, and the platform that runs Host workloads."],
  ["host", "Host is useful on its own when you need a long-lived process that keeps agent runtimes resident and applies durable commands to them. It restores a session under the same runtime identity instead of restarting it, publishes open approval gates, and settles each command only from the runtime's own evidence. You describe the agents it may launch as a Department of launch targets, compose it with `host.Compose`, and run it with `host.Run` or start and stop the returned `Service` yourself. `Stop` drains every resident session and returns a `DrainReport` listing anything an operator must reconcile.\n\nWithin Looprig, Host is the runtime side of [Factory](/docs/modules/factory). Factory dials each tenant's HostLink address, derived from the base endpoint Host advertises, to attach, bind, deliver commands, and drain, and it admits a gate response only when the Host advertises that capability. Host runs [Harness](/docs/modules/harness) rigs and records claims, attempts, gates, and residency through [SessionStore](/docs/modules/sessionstore) over a [Storage](/docs/modules/storage) backend, using wire types from [Core](/docs/modules/core) and requests from [Inference](/docs/modules/inference). [Controller](/docs/modules/controller) starts dedicated Host Pods and ends them drain-before-delete. A product runtime should implement `department.AttemptCloser`; without it, Host cannot close a predecessor's stranded attempt after a failover, and that session's command stream stays blocked.\n\nHost owns residency, command consumption, the HostLink surface, and drain. Callers own the Department, the storage backend, the harness journal stores used as settlement evidence, credential verification, and deployment."],
  ["controller", "Controller is useful on its own when a hosted agent service on Kubernetes wants a dedicated Pod per session and keeps its desired placement in SessionStore. It creates direct Pods, one for each dedicated session's desired generation, adopts an existing Pod only when every identity label and the recorded spec hash match, and deletes Pods with a UID precondition. Each Pod is built from a strictly decoded, versioned payload that references credentials but never carries them inline. The `cmd/controller` package refuses to start without a storage `Bootstrap` supplied by the product, because the module composes no storage backend itself.\n\nWithin Looprig, Controller implements [Factory](/docs/modules/factory)'s `WorkloadController` seam and its optional endpoint discovery. It lives in its own repository so that Kubernetes client libraries never enter Factory's dependency graph; Factory is a test-only requirement here. Its work loop reads desired state and the Host registry from [SessionStore](/docs/modules/sessionstore) under a reconciliation claim. When a workload is no longer wanted, it drains the [Host](/docs/modules/host) over its own HostLink client built from [Core](/docs/modules/core), clears the registry fence, deletes the Pod, and records the outcome. Each Pod gets a bare HostLink base, so it must run a Host image that serves that layout.\n\nController owns the Pod lifecycle and the drain-before-delete order. Factory still decides placement and attaches sessions, and the product owns storage, images, RBAC, and cluster operations."],
  ["wui", "WUI is useful on its own when a Go binary needs a ready browser interface for agent sessions without a Node toolchain at build time. The React SPA is committed as a static bundle and embedded with `//go:embed`, so importing the module is enough. It covers a session list, a live transcript, a message composer, interrupt, approval gates, and a viewer for captured tool output. `wui.Assets()` serves the bundle with a path-confined fallback to the SPA shell, `wui.Guard` adds a Host and Origin check, and `wui.BundleProtocolVersion()` reports which sessionwire version, Core version, and protocol build the embedded bundle speaks and whether it is a release build. A server should refuse a bundle whose marker is missing or not a release build.\n\nWithin Looprig, WUI is the browser counterpart to [TUI](/docs/modules/tui). A composition passes `wui.Assets()` to [Factory](/docs/modules/factory) through its UI handler option, and Factory then owns authentication, origin and CSRF checks, the REST and ClientLink API, and reaching sessions on a [Host](/docs/modules/host). WUI's only Looprig requirement is [Core](/docs/modules/core), used by a test that checks the vendored `sessionwire/v1` schemas against the pinned Core version. No compiled file imports Core, so `go mod tidy` would drop the requirement; update the pin explicitly instead. WUI owns the bundle, its self-description, and the browser guards. The serving application owns login, durable session state, and the API the bundle talks to."],
  ["acp", "ACP is useful on its own when a Go application needs to drive an Agent Client Protocol process or expose its own host through ACP. Within Looprig, it connects [Foreign Loops](/docs/modules/foreignloops) and [Harness](/docs/modules/harness) to editors, coding agents, and other ACP-compatible clients. ACP owns the protocol and process boundary; the host still owns sessions, permissions, and model access."],
  ["classifiers", "Classifiers are useful on their own when an application needs deterministic command-safety evidence. Within Looprig, they support permission decisions around [Harness](/docs/modules/harness) and prepared [Tools](/docs/modules/tools). A classifier reports bounded evidence; it does not grant authority or replace the gate that makes the final decision."],
  ["client", "Client is useful on its own when a browser or Go web application needs a typed session transport, event folding, and live updates. Within Looprig, it serves [Harness](/docs/modules/harness) sessions through Harness's older `pkg/serve` read contract to framework-neutral web clients and the reference Svelte app, storing data through [FSStore](/docs/modules/fsstore) or [NATSStore](/docs/modules/natsstore). A new [Factory](/docs/modules/factory) deployment should use [WUI](/docs/modules/wui) instead, because Client does not speak Factory's contract. Client presents runtime state; it does not own the agent loop or durable storage policy."],
  ["core", "Core is the foundation for applications that need provider-neutral messages, content blocks, streaming chunks, usage values, logging, or UUIDs. Within Looprig, those types are shared by [Inference](/docs/modules/inference), [Harness](/docs/modules/harness), [Tools](/docs/modules/tools), stores, and user interfaces.\n\nCore also owns `sessionwire/v1`, the transport-neutral session contract. It defines durable command requests, gate and publication records, and the HostLink records and framing that [Factory](/docs/modules/factory) and [Host](/docs/modules/host) exchange to attach, bind, drain, and deliver commands to resident sessions. [SessionStore](/docs/modules/sessionstore) persists those records, and [WUI](/docs/modules/wui) ships their JSON schemas to the browser. Core defines common values and wire shapes without owning model transport, runtime lifecycle, or network transport."],
  ["credentials", "Credentials are useful on their own when an application needs explicit credential selection, acquisition, refresh, and invalidation without embedding secret values in configuration. Within Looprig, [Inference](/docs/modules/inference) and [LLM](/docs/modules/llm) use them to obtain provider authentication from [Secrets](/docs/modules/secrets). Credentials manage leases and refresh; provider clients decide how credentials are sent."],
  ["eval", "Eval is useful on its own when an application needs to run cases against a target, score observations, and write redacted reports. Within Looprig, it evaluates [Inference](/docs/modules/inference) targets and can score message threads produced by a [Harness](/docs/modules/harness) application. Eval defines the evaluation domain; Pluto packages that domain into a complete qualification product."],
  ["flow", "Flow is useful on its own when a Go application needs compiled graphs, typed interruption, checkpointing, and resumable execution. Within Looprig, [Workflows](/docs/modules/workflows) builds durable workflow services on Flow, while [Flow Store](/docs/modules/flow-store) persists checkpoints. Flow owns graph execution, not agent sessions or the backing storage engine."],
  ["flow-store", "Flow Store is useful on its own when a Flow application needs to persist checkpoints through Looprig's neutral storage contracts. Within Looprig, it adapts any [Storage](/docs/modules/storage) Ledger to [Flow](/docs/modules/flow)'s checkpoint store, and [Workflows](/docs/modules/workflows) uses it for durable runs. The caller supplies the backend, such as [FSStore](/docs/modules/fsstore) on one host or [NATSStore](/docs/modules/natsstore) or [PGStore](/docs/modules/pgstore) when several processes share state. It adapts checkpoint records; it does not execute graphs or choose the storage location."],
  ["foreignloops", "Foreign Loops is useful on its own when an application needs to supervise and restore an external agent process behind a neutral backend. Within Looprig, it adapts ACP, Claude, and Codex processes to [Harness](/docs/modules/harness)'s foreign-backend contracts, using [ACP](/docs/modules/acp) for the protocol. Foreign Loops owns the adapter lifecycle; the external process keeps its native behavior."],
  ["fsstore", "FSStore is useful on its own when a Go application needs a durable ledger, leases, key-value records, blobs, and ordered indexes in one owner-controlled local directory. Within Looprig, it implements [Storage](/docs/modules/storage) for local [Client](/docs/modules/client) deployments and the Carbon coding agent. It is also the filesystem conformance backend in [Harness](/docs/modules/harness) and [Flow Store](/docs/modules/flow-store) tests.\n\nv0.6.0 changed the on-disk layout so a name and its \"/\" extension can coexist, and it ships no migration. `Open` refuses a root written by an earlier release with an error matching `ErrLegacyLayout`. Move or delete that directory rather than retrying, and never roll a v0.6.0 root back to an older release, which misreads it as empty. Its Blobs deliberately omit the bounded reader lifecycle, so [SessionStore](/docs/modules/sessionstore) refuses a plain FSStore composite. FSStore chooses the filesystem backend; callers retain ownership of record meaning and retention policy."],
  ["harness", "Harness is useful on its own when an application needs to turn model calls and tools into a session-oriented agent runtime. Within Looprig, it composes [Inference](/docs/modules/inference), [Storage](/docs/modules/storage), gates, workspaces, delegation, and tools behind Loops and Rigs. Its session journal and catalog are written in [SessionStore](/docs/modules/sessionstore)'s envelope and layout, so the backend needs every storage primitive plus bounded blob readers, as in [NATSStore](/docs/modules/natsstore) or [PGStore](/docs/modules/pgstore) with [S3Store](/docs/modules/s3store).\n\nA Rig wired with `rig.WithToolResultObjects` keeps every tool result larger than the preview budget as a session object beside the journal, and the model pages it back with `read_tool_result` from [Tools](/docs/modules/tools). [Host](/docs/modules/host) runs Harness sessions for [Factory](/docs/modules/factory), and the older `pkg/serve` HTTP surface is deprecated in favor of Factory. Harness owns runtime coordination; applications still choose models, authority, persistence, and interfaces."],
  ["inference", "Inference is useful on its own when a Go application needs provider-neutral model requests, streaming, codecs, retries, routing, or a local model gateway. Within Looprig, it supplies the model boundary for [Harness](/docs/modules/harness), [LLM](/docs/modules/llm), [Eval](/docs/modules/eval), [Classifiers](/docs/modules/classifiers), [TUI](/docs/modules/tui), and [Host](/docs/modules/host).\n\n`Request.SessionID` carries a stable conversation identity for providers that document a per-conversation header. It is validated for every provider, so an unsendable value fails the request locally instead of being altered in transit, and other providers ignore it. Inference moves model data; it does not own agent sessions or provider credential catalogs."],
  ["llm", "LLM is useful on its own when an application wants ready provider clients backed by explicit model descriptors and credentials. Within Looprig, it turns [Inference](/docs/modules/inference) contracts and [Credentials](/docs/modules/credentials) into clients that [Harness](/docs/modules/harness) applications can select. Both OpenCode gateways forward a request's session identity as the `x-opencode-session` header, so a conversation keeps the same upstream identity across turns and compaction. LLM owns provider construction; Inference retains the neutral request and response model."],
  ["mcp", "MCP is useful on its own when an application needs to consume Model Context Protocol servers over stdio, streamable HTTP, or the opt-in legacy SSE transport. Within Looprig, its optional adapter adopts remote tools into [Harness](/docs/modules/harness) Loops and turns server elicitation into Harness gates. A small server package lets a product publish its own tool handlers, such as a collaboration server injected into child agents. MCP owns protocol transport and discovery; the surrounding application owns authentication, authority, and lifecycle policy."],
  ["natsstore", "NATSStore is useful on its own when a distributed Go application needs Looprig's storage contracts on NATS JetStream. Within Looprig, it is a single backend that satisfies every [Storage](/docs/modules/storage) primitive and the bounded blob reader lifecycle, so it can back a [SessionStore](/docs/modules/sessionstore) and the [Harness](/docs/modules/harness) session store alone. It is also the shared backend for multi-process [Client](/docs/modules/client) deployments. NATSStore owns JetStream mapping and optional embedded startup; callers own data semantics and server operations."],
  ["rclonestore", "RcloneStore is useful on its own when an application needs immutable blob storage through an existing rclone remote. Within Looprig, it provides the Blobs portion of [Storage](/docs/modules/storage) for workspace data and other large objects kept outside a ledger or metadata backend. The v0.4.2 release still targets the storage v0.6 contract and does not implement the bounded blob reader lifecycle, so it cannot back a [SessionStore](/docs/modules/sessionstore). Use [S3Store](/docs/modules/s3store) for session objects in a cloud composition. RcloneStore owns bounded subprocess calls; deployment configuration owns the remote and credentials."],
  ["sandbox", "Sandbox is useful on its own. Use it whenever a Go application needs to run a process with explicit filesystem, network, environment, and operating-system restrictions. The process does not need to be an agent or use any other Looprig module.\n\nWithin Looprig, Sandbox integrates with [Harness](/docs/modules/harness) and [Tools](/docs/modules/tools). Harness can apply a sandbox profile to session-owned processes, while process-based tools use the resulting executor to enforce the permitted access at the operating-system boundary. Sandbox defines the confinement boundary; Harness decides when work may run, gates decide whether it should run, and tools describe the requested operation."],
  ["secrets", "Secrets are useful on their own when an application needs opaque references, redaction-safe values, and a replaceable secret store. Within Looprig, [Credentials](/docs/modules/credentials), [Inference](/docs/modules/inference), and [LLM](/docs/modules/llm) pass references instead of copying secret material into model configuration. Secrets protect representation and lookup boundaries; callers still control authorization and rotation policy."],
  ["storage", "Storage is useful on its own. Use it when a Go application needs stable interfaces for append-only ledgers, epoch leases, revisioned key-value data, immutable blobs, and ordered indexes without committing to a particular backend. The in-memory memstore and the storetest conformance suites let a new backend prove the same behavior before anyone depends on it.\n\nWithin Looprig, Storage provides the persistence contracts used by [SessionStore](/docs/modules/sessionstore), [Harness](/docs/modules/harness), [Workflows](/docs/modules/workflows), [Flow Store](/docs/modules/flow-store), [Factory](/docs/modules/factory), [Host](/docs/modules/host), and [Client](/docs/modules/client). [FSStore](/docs/modules/fsstore) and [NATSStore](/docs/modules/natsstore) implement all five primitives. [PGStore](/docs/modules/pgstore) supplies the structured ones on PostgreSQL, while [S3Store](/docs/modules/s3store) and [RcloneStore](/docs/modules/rclonestore) supply Blobs. SessionStore also requires the optional bounded blob reader lifecycle, which NATSStore and S3Store implement.\n\nSince v0.7.0, a name and a name that extends it with \"/\" are distinct and must coexist in KV and Blobs, and the conformance suites check this. Storage defines durable operations; higher-level runtimes decide what to persist."],
  ["tools", "Tools are useful on their own when an application needs prepared file, process, network, interaction, task, or skill operations with validation before effect. Within Looprig, [Harness](/docs/modules/harness) exposes them to Loops, while [Sandbox](/docs/modules/sandbox) and gates can constrain process execution and sensitive effects.\n\nThe `readtoolresult` package supplies `read_tool_result`, which lets a model page through a result that Harness retained in full after showing only a preview, such as a long build log from Bash. The model names only a capture id, and Harness decides what that Loop may read. Register the tool only on a Rig that wires tool-result retention. Tools describe and perform operations; the runtime owns admission, authority, and cleanup."],
  ["tui", "TUI is useful on its own when a terminal application needs reusable session views, event rendering, input, completion, restore decisions, and teardown coordination. Within Looprig, it presents [Harness](/docs/modules/harness) sessions and [Inference](/docs/modules/inference) content in a ready terminal interface. TUI owns presentation and interaction; the runtime remains the source of session state."],
  ["workflows", "Workflows are useful on their own when an application needs typed, durable workflow definitions with interruption, recovery, supervision, and tool-facing controls. Within Looprig, the module combines [Flow](/docs/modules/flow), [Harness](/docs/modules/harness), and [Storage](/docs/modules/storage), with [Flow Store](/docs/modules/flow-store) as the usual checkpoint adapter. A supervisor registered as a Harness session resource stops its runs when the session shuts down. Workflows coordinate long-running business processes; Harness continues to own agent sessions and Flow continues to execute graphs."],
]);

const pages = readdirSync(modulesRoot).filter((name) => name.endsWith(".md")).sort();
const slugs = pages.map((name) => name.slice(0, -3));
// Records are keyed by module path, not by repository: a nested module such as
// flow/store shares its parent repository, so `repository` is not unique.
const moduleBySlug = new Map(slugs.map((slug) => [
  slug,
  `github.com/looprig/${slug === "flow-store" ? "flow/store" : slug}`,
]));
const recordBySlug = new Map(slugs.map((slug) => [
  slug,
  inventory.modules.find((record) => record.module === moduleBySlug.get(slug)),
]));
const slugByModule = new Map([...recordBySlug].map(([slug, record]) => [record.module, slug]));

function frontmatterValue(source, key) {
  return source.match(new RegExp(`^${key}: (.+)$`, "m"))?.[1];
}

function proofId(source) {
  return source.match(/^  repository: (.+)$/m)?.[1];
}

function directDependencies(record) {
  return [...new Set((record.edges ?? [])
    .filter((edge) => edge.kind === "direct-require" && slugByModule.has(edge.to))
    .map((edge) => slugByModule.get(edge.to)))].sort((a, b) => names.get(a).localeCompare(names.get(b)));
}

function githubDetails(slug, record) {
  if (slug === "flow-store") {
    return { label: "looprig/flow", url: "https://github.com/looprig/flow" };
  }
  const repository = record.module.replace(/^github\.com\//, "");
  return { label: repository, url: `https://github.com/${repository}` };
}

function links(items) {
  if (items.length === 0) return "None.";
  return items.map((slug) => `- [${names.get(slug)}](/docs/modules/${slug})`).join("\n");
}

for (const file of pages) {
  const slug = file.slice(0, -3);
  const source = readFileSync(path.join(modulesRoot, file), "utf8");
  const record = recordBySlug.get(slug);
  if (!record) throw new Error(`No module inventory record for ${slug}`);

  const description = frontmatterValue(source, "description");
  const order = frontmatterValue(source, "order");
  const publication = frontmatterValue(source, "publication");
  const proof = proofId(source);
  if (!description || !order || !publication || !proof) {
    throw new Error(`Incomplete existing metadata for ${slug}`);
  }

  const dependencies = directDependencies(record);
  const dependents = slugs
    .filter((candidate) => directDependencies(recordBySlug.get(candidate)).includes(slug))
    .sort((a, b) => names.get(a).localeCompare(names.get(b)));
  const github = githubDetails(slug, record);
  const version = record.publication.tag ?? "Not released";

  const page = `---
id: modules/${slug}
title: ${names.get(slug)}
description: ${description}
audience: developer
section: modules
order: ${order}
publication: ${publication}
proofs:
  repository: ${proof}
  description: ${proof}
  dependencies: ${proof}
  dependents: ${proof}
  where-it-fits: ${proof}
---

# ${names.get(slug)}

## Repository

| Field | Value |
| --- | --- |
| Repository | \`${record.module}\` |
| Version | \`${version}\` |
| GitHub | [${github.label}](${github.url}) |

## Description

${description}

## Where it fits

${ecosystem.get(slug)}

## Dependencies

${links(dependencies)}

## Dependents

${links(dependents)}
`;

  writeFileSync(path.join(modulesRoot, file), page);
}
