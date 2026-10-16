---
id: overview/which-modules
title: Which modules do I need?
description: Pick the Looprig modules and released versions for a model call, a CLI agent, a tool-using agent with approvals, durable sessions, a multi-user browser product on Stack or your own Factory and Host, or scaled Hosts on Kubernetes.
audience: developer
section: overview
order: 3
publication: released
proofs:
  start-from-what-you-are-building: [release-github-com-looprig-inference, release-github-com-looprig-harness, release-github-com-looprig-factory]
  call-a-model: [release-github-com-looprig-core, release-github-com-looprig-inference, release-github-com-looprig-llm]
  run-a-cli-agent: [release-github-com-looprig-harness, release-github-com-looprig-storage, release-github-com-looprig-tui]
  add-tools-and-approvals: [release-github-com-looprig-tools, release-github-com-looprig-sandbox, release-github-com-looprig-harness, release-github-com-looprig-classifiers, release-github-com-looprig-mcp]
  keep-durable-sessions: [release-github-com-looprig-natsstore, release-github-com-looprig-pgstore, release-github-com-looprig-s3store, release-github-com-looprig-fsstore, release-github-com-looprig-harness]
  serve-many-users-from-a-browser: [release-github-com-looprig-stack, release-github-com-looprig-factory, release-github-com-looprig-host, release-npm-looprig-client, release-npm-looprig-react]
  compose-factory-and-host-yourself: [release-github-com-looprig-factory, release-github-com-looprig-host, release-github-com-looprig-sessionstore, release-github-com-looprig-carbon]
  scale-hosts-on-kubernetes: [release-github-com-looprig-controller, release-github-com-looprig-factory, release-github-com-looprig-host]
  optional-additions: [release-github-com-looprig-flow, release-github-com-looprig-workflows, release-github-com-looprig-eval, release-github-com-looprig-acp, release-github-com-looprig-foreignloops, release-github-com-looprig-credentials]
---

# Which modules do I need?

Looprig is a set of independently versioned Go modules plus two npm packages. You never need all of them. Each row below adds to the one before it, so find the first row that describes what you are building and read down to it.

The versions are the current releases as of this documentation release. Every module is pre-1.0, so pin exact versions and read release notes before moving a minor version. `go get <module>@latest` resolves the same versions today.

## Start from what you are building

| You are building | Add these modules | Storage that works |
| --- | --- | --- |
| A program that calls a model | Core, Inference, LLM | None |
| A single-process CLI agent | + Harness, Storage | `memstore` (lost on exit) |
| An agent with tools and approvals | + Tools, Sandbox | `memstore` |
| An agent whose sessions survive restarts | + NATSStore, or PGStore with S3Store | Embedded NATS, NATS, or PostgreSQL plus S3 |
| A multi-user product in the browser | + Stack (Factory, an in-process Host, and SessionStore from one `stack.Options`), `@looprig/client` or `@looprig/react` | One machine: `stack/localdisk`. Hosts in other processes: NATS, or PostgreSQL plus S3 |
| The same product with your own Factory and Host composition | + Factory, Host, SessionStore in place of Stack | Shared: NATS, or PostgreSQL plus S3 |
| One dedicated Host Pod per session on Kubernetes | + Controller | Shared, as above |

The [Architecture](/docs/overview/architecture) page shows how the modules in the last four rows connect.

## Call a model

```sh
go get github.com/looprig/core@v0.13.2 \
  github.com/looprig/inference@v0.15.2 \
  github.com/looprig/llm@v0.16.1
```

[Inference](/docs/modules/inference) defines the provider-neutral `inference.Client` contract (`Invoke` and `Stream`), messages, codecs, and streaming. [LLM](/docs/modules/llm) supplies provider clients and defaults, such as OpenAI, Anthropic, OpenRouter, and Ollama. [Core](/docs/modules/core) holds the shared content types. Start with the [Inference guide](/docs/guides/inference) and the [provider list](/docs/guides/inference/providers). You can skip LLM if you construct an `inference.Client` yourself. To run and test without an API key, `inference/inferencetest` supplies a scripted client.

## Run a CLI agent

```sh
go get github.com/looprig/harness@v0.45.2 \
  github.com/looprig/storage@v0.9.1
```

[Harness](/docs/modules/harness) is the agent runtime: you define a Loop, assemble a Rig, and run Sessions that stream typed events. A Rig needs a session store; `harness/pkg/sessionstore` over Storage's in-memory `memstore` is enough for a process that does not need to resume. The [Quickstart](/docs/start/quickstart) is this row as a complete program.

For an interactive terminal interface, add [TUI](/docs/modules/tui) (`github.com/looprig/tui@v0.21.3`), which presents Harness sessions without owning their state. See the [TUI guide](/docs/guides/tui).

The [cli-agent starter](/docs/start/starters) is a complete, runnable version of this row and the next: copy it with `go run golang.org/x/tools/cmd/gonew@latest github.com/looprig/starters/cli-agent example.com/myapp`.

## Add tools and approvals

```sh
go get github.com/looprig/tools@v0.15.2 \
  github.com/looprig/sandbox@v0.9.4
```

[Tools](/docs/modules/tools) provides file, search, process, fetch, and interaction tools, and you can register your own. Tools run only behind an **access gate**: a Loop with no access gate refuses every prepared tool call, including file reads, and the model sees a permission error. For read-only tools, `loop.WithReadOnlyAccess(root)` is enough. For reads plus approved writes, `loop.WithWorkspaceAccess(loop.WorkspaceAccess{Roots: []string{root}})` asks before each write under the root, through the Loop's durable permission gate or an in-process `gate.ApproverFunc`, and denies commands and network. For anything wider, such as sandboxed commands, configure one with `loop.WithAccessGate`. See [Add read-only tools and gates](/docs/start/tools-and-gates) and [Access gates](/docs/guides/harness/gates/access-gates). Approval gates, which pause for a person, are part of Harness; see [Gates](/docs/guides/harness/gates).

[Sandbox](/docs/modules/sandbox) confines the processes that tools such as Bash start and reports which guarantees the current platform actually enforced. Add it whenever the agent can run commands; see the [Sandboxing guide](/docs/guides/sandboxing).

Optional: [Classifiers](/docs/modules/classifiers) (`v0.2.3`) adds deterministic command-safety review as evidence for gate policy, and [MCP](/docs/modules/mcp) (`v0.7.3`) consumes or publishes MCP tools.

## Keep durable sessions

A Harness session store needs every Storage primitive, and its Blobs provider must implement Storage's bounded reader lifecycle. The choices that satisfy it:

| Deployment | Modules | Notes |
| --- | --- | --- |
| One process on one machine, plain files | `github.com/looprig/fsstore@v0.6.2` and `github.com/looprig/storage@v0.9.1` | Open the session store over `fs.Backend().WithBoundedBlobReaders()`, an explicit single-host opt-in; see [Persist and restore sessions](/docs/start/sessions). |
| One process on one machine, embedded NATS | `github.com/looprig/natsstore@v0.5.5` | `natsstore.Open(ctx, natsstore.Options{EmbeddedDir: absPath})` runs JetStream inside your process. One process may open a directory at a time. |
| Several processes or machines | `natsstore@v0.5.5` with `Options.URL` | Connects to your NATS server. |
| PostgreSQL and object storage | `github.com/looprig/pgstore@v0.2.3` and `github.com/looprig/s3store@v0.2.3` | PGStore provides Ledger, Leaser, KV, and OrderedIndex; S3Store provides Blobs. |

A session store refuses raw [FSStore](/docs/modules/fsstore) Blobs with `sessionstore: invalid backend: missing BlobReaderLifecycle`; the `WithBoundedBlobReaders` opt-in in the first row is what makes FSStore usable. FSStore's v0.6.0 on-disk layout is one-way: `fsstore.Open` refuses an older directory with an error that matches `errors.Is(err, fsstore.ErrLegacyLayout)`. There is no migration, so move or delete that directory rather than retrying.

See [Session persistence](/docs/guides/harness/session-persistence) and [Create and restore](/docs/guides/harness/session-runtime/create-and-restore).

## Serve many users from a browser

```sh
go get github.com/looprig/stack@v0.1.2 \
  github.com/looprig/harness@v0.45.2 \
  github.com/looprig/tools@v0.15.2
npm install @looprig/client@0.3.0 @looprig/react@0.3.0
```

- [Stack](/docs/modules/stack) starts the hosted system in one process from one `stack.Options` value: [Factory](/docs/modules/factory) as the public HTTP API and ClientLink WebSocket, one in-process pooled [Host](/docs/modules/host) running your Harness agents through `host/harnessruntime`, and one storage profile. Each agent is a `Define` function that builds its Rig. `stack.Validate` reports configuration errors before any I/O, and `Stop` shuts everything down in the one safe order.
- `stack/localdisk` keeps state in FSStore directories on one machine, and `stack/devauth` is a development-only sign-in. In production you supply credential verification, authorization, and the UI.
- `@looprig/client` is a framework-neutral browser SDK for Factory, and `@looprig/react` adds React 19 hooks. See the [Web UI guide](/docs/guides/web-ui).

The [browser-app starter](/docs/start/starters) is this row as a complete program: `go run golang.org/x/tools/cmd/gonew@latest github.com/looprig/starters/browser-app example.com/myapp`. Stack v0.1.2 has no object policy, checkpointer, or dedicated placement, and exposes no workspace snapshot store: an agent that places a workspace opens its own, and it must be durable, such as a separate FSStore directory, because a session restored after a restart against an in-memory snapshot store fails with `materialize_failed`. To move Hosts into other processes, switch to `stack.RemoteHosts{}` with a shared backend (NATS, or PostgreSQL plus S3) and run `stack.ServeHost` in each Host process with the same agents.

The older `harness/pkg/serve` HTTP and SSE server is deprecated and frozen as a compatibility surface. Do not start new services on it.

## Compose Factory and Host yourself

```sh
go get github.com/looprig/factory@v0.16.1 \
  github.com/looprig/host@v0.18.1 \
  github.com/looprig/sessionstore@v0.15.1
```

Compose the pieces directly when Stack does not cover your deployment, for example separate Factory and Host fleets you release independently, an object policy, or dedicated placement:

- [Factory](/docs/modules/factory) is the public service: HTTP API, the ClientLink WebSocket, identity seams, command admission, and placement. It ships no binary and no UI.
- [Host](/docs/modules/host) keeps sessions resident and runs your Harness Rigs, described as a Department of launch targets. `harnessruntime.Target` builds a launch target from your Rigs with full recovery, which Host's default `RuntimeProfileDurable` requires.
- [SessionStore](/docs/modules/sessionstore) (`github.com/looprig/sessionstore`) holds the durable records Factory and Host share. It is a different package from `harness/pkg/sessionstore`, which Host's runtimes still use for their journals; see the [glossary](/docs/overview/glossary#serving-and-orchestration).

Factory and Host can run in one process or in separate deployments, and they need a shared storage backend from the durable-sessions row. You supply credential verification, authorization, the UI, and the Department. Move Factory and Host releases together, because each Factory feature is gated on capabilities the Host advertises. [Carbon](/docs/products/carbon) is the reference product that composes Factory, Host, Harness, and a browser UI this way, and its source is the most complete worked example.

## Scale Hosts on Kubernetes

Pooled Hosts need no extra module: run several Host replicas as an ordinary workload and Factory places sessions on live, compatible Hosts, one HostLink per Host and tenant.

For one dedicated Host Pod per session, add [Controller](/docs/modules/controller) (`github.com/looprig/controller@v0.2.4`). It implements Factory's `WorkloadController` seam, creates a Pod for each dedicated session, and drains the Host before deleting its Pod. It runs as its own process from `cmd/controller`, which refuses to start until your product supplies a storage `Bootstrap`, and it keeps Kubernetes client libraries out of Factory's dependency graph. Controller v0.2.1 was built against SessionStore v0.13.1 and Factory v0.11.1, so check its release notes against the Factory and Host versions you deploy.

## Optional additions

| Need | Module |
| --- | --- |
| Typed, checkpointed workflow graphs | [Flow](/docs/modules/flow) `v0.4.4`, with [Flow Store](/docs/modules/flow-store) `store/v0.1.3` |
| Durable workflows supervised inside a session, with workflow tools | [Workflows](/docs/modules/workflows) `v0.1.3` |
| Evaluations inside `go test` | [Eval](/docs/modules/eval) `v0.2.3` |
| Expose an agent to ACP clients, or drive ACP agents | [ACP](/docs/modules/acp) `v0.3.4` |
| Run Claude Code, Codex, or ACP processes as Loops | [Foreign Loops](/docs/modules/foreignloops) `v0.3.4` |
| OAuth and refreshing provider credentials | [Credentials](/docs/modules/credentials) `v0.2.1` |
