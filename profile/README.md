## What is looprig?

looprig is an agent harness ecosystem, a set of Go modules for building production-grade autonomous agents that are durable across crashes, confined by the OS, gated by humans, and transparent to operators.

The name is a dual pun. A **rig** is the harness-and-tackle that makes a thing operational (an oil rig, a sailing rig, a test rig). A **loop** is the agent loop. So a *looprig* is **the rig that runs the loop**: the harness, plumbing, confinement, storage, and presentation layer around the model-inference-turn that turns an LLM into a deployable agent.

I build looprig as a set of small, independently versioned, stdlib-first Go modules. Each module is the embodiment of a design **spec**; collectively they form the rig.

```
─── the rig ───────────────────────────────────────────────────────────────────
    ┌────────────────────────────────────────────────────────────────────────┐
    │                          harness is the heart                          │
    │     agent loop · session · gates · journal · tools · transcript        │
    │ pkg/serve HTTP/SSE session API (the backend stability point)           │
    └───────────────┬───────────────────────────────────────┬────────────────┘
                 │ versioned /v1 HTTP/SSE wire contract  │ in-process SDK
                 ▼                                       ▼
    ┌─────────────────────────────────┐    ┌─────────────────────────────────────────────┐
    │ client (planned module)         │    │ in-process consumers (swe, embeds, ...)     │
    │ one Go binary: BFF + embedded   │    │ compose harness + storage + sandbox         │
    │ SPA + framework-neutral SDK     │    │ directly into a single binary               │
    │ · read:  serve.NewReader        │    └─────────────────────────────────────────────┘
    │ · live:  SSE reverse-proxy      │
    │ · ctrl:  POST reverse-proxy     │
    └───────┬─────────────────┬───────┘
    ┌────────────────────────────────────────────────────────────────────────┐
    │   user-facing surfaces the rig, as the human sees it                   │
    ├───────────────┬────────────────────────────────────────────────────────┤
    │ cli (TUI)     │ @looprig/client core: DTO/zod + transports +           │
    │ Bubble Tea    │ state machine + exact history→live join;               │
    │ v2 (today)    │ consumed by thin framework adapters:                   │
    │               │ svelte (ref) · react · vue · angular · solid           │
    │               │ · plain TS · Tauri v2 (desktop + mobile)               │
    └───────────────┴────────────────────────────────────────────────────────┘
    ┌────────────────────────────────────────────────────────────────────────┐
    │ serve projects these primitives over HTTP/SSE invents none:            │
    │ submit · gate-response · interrupt · live events (enduring+ephem)      │
    │ · cold journal · status · session listing · idempotent create          │
    └────────────────────────────────────────────────────────────────────────┘


─── harness rig partners ───────────────────────────────────────────────────────────────────
    ┌──────────────┐        ┌──────────────────┐          ┌───────────────────────┐
    │  inference   │        │       llm        │          │        storage        │
    │  the neutral │◄───────│  provider policy │          │   the contract hub    │
    │   contract   │        │  & batteries     │          │   (ledger/lease/kv/   │
    └──────┬───────┘        └──────────────────┘          │    blobs + tests)     │
           │                                              └───────────┬───────────┘
           ▼                                                          │ implemented by
    ┌──────────────┐                                                  ▼
    │    core      │                                    ┌──────────┬────────────┬──────────────┐
    │ content/uuid/│                                    │ fsstore  │ natsstore  │ rclonestore  │
    │   logging    │                                    │  (disk)  │ (JetStream)│   (rclone)   │
    └──────────────┘                                    └──────────┴────────────┴──────────────┘
                                                         durable    scalable     cloud
                                                         single-host  hybrid       blobs


─── more rig components ───────────────────────────────────────────────────────────────────

    ┌──────────────┐  OS confinement: Seatbelt · namespaces · Landlock · seccomp · nft · cgroups
    │    sandbox   │  (structurally coupled no import; harness never imports sandbox)
    └──────────────┘
    ┌──────────────┐
    │    flow      │  sibling durable-workflow engine (Pregel-style): agent tasks as flow kinds
    └──────────────┘
    ┌──────────────┐
    │     tests    │  cross-repo e2e: harness durability proven against a real fsstore backend
    └──────────────┘
```

<br/>

## The heart: harness

At the center sits [harness](https://github.com/looprig/harness), the multi-agent runtime SDK.

- The **actor-based engine** that owns agent loops, turns, tool execution, permission gates, sessions, and durable event history.
- It drives the model-inference loop, dispatches tool calls, enforces human-in-the-loop approval, persists everything, and exposes hooks/events for embedders.
- It depends only on `core` + `inference` + `storage`, **never** on `llm`. It is the contract consumer; concrete providers are wired at the composition root.

Every other repo in the tree is either a foundation the harness stands on (`core`, `inference`, `storage`, `fsstore`, `natsstore`, `rclonestore`), a sibling engine with which it composes (`flow`), a capability it depends on (`llm`, `sandbox`), a presentation layer over it (`cli`), or a product built from it (`swe`). Cross-repo durability is proven externally by `tests`.

<br/>

## The rig: capability pillars and the repos that deliver them

| Pillar | What it gives you | Repos |
| --- | --- | --- |
| **Foundational vocabulary** | Shared typed content blocks, UUIDs, structured logging: one canonical definition, zero dependencies. | [core](https://github.com/looprig/core) |
| **Agent runtime (the heart)** | Loop, session, tool contracts, bundled tools, gate, journal, transcript, ceiling, optional HTTP API. | [harness](https://github.com/looprig/harness) |
| **Model inference contract** | Provider-neutral `Client`/`Request`/`Response`/`Tool`/`Usage`, streaming, codecs, sampling knobs. No provider policy. | [inference](https://github.com/looprig/inference) |
| **Provider batteries** | Known-provider registry, truth tables, SigV4 + API key + attestation auth, `auto.New` composition root, fail-closed model validation. | [llm](https://github.com/looprig/llm) |
| **OS confinement** | Seatbelt (macOS) + namespaces/Landlock/seccomp/nftables/cgroups (Linux). Unforgeable HMAC grant tokens; honest per-property guarantees. | [sandbox](https://github.com/looprig/sandbox) |
| **Durable storage contracts** | `Ledger`/`Leaser`/`KV`/`Blobs` interfaces, typed errors, name grammar, `AppendDefinite` ambiguity resolver, in-memory oracle + conformance suites. | [storage](https://github.com/looprig/storage) |
| **Storage backends** | Concrete implementations of the storage contracts: single-host disk, NATS JetStream (embedded or remote), and a cloud-agnostic rclone-driven blobs adapter. | [fsstore](https://github.com/looprig/fsstore), [natsstore](https://github.com/looprig/natsstore), [rclonestore](https://github.com/looprig/rclonestore) |
| **User-facing surfaces** | One `pkg/serve` `/v1` contract, many UI runtimes. Terminal TUI today (`cli`/Bubble Tea v2); a planned `client` module brings a BFF + embedded SPA + framework-neutral TS SDK (`@looprig/client`) to the browser, desktop (Tauri v2), and mobile, with thin adapters for Svelte (reference)/React/Vue/Angular/Solid. | [cli](https://github.com/looprig/cli), [bubbletea-fork](https://github.com/looprig/bubbletea-fork), `client` *(planned)* |
| **Durable workflows** | Pregel-style resumable workflow engine. Events, approvals, external systems: agents become first-class task kinds. | [flow](https://github.com/looprig/flow) |
| **Reference product** | The SWE-Swarm: a depth-1 multi-agent software-engineering team assembled entirely from the above. The rig, demonstrated. | [swe](https://github.com/looprig/swe) |
| **External proof** | Cross-repo integration suite that drives the harness's public durability APIs against a *new* fsstore instance, proving a genuine process-death/resume. | [tests](https://github.com/looprig/tests) |

<br/>

## Repository catalog

### Foundation

- **[core](https://github.com/looprig/core)** - Shared primitives. `content` (sealed `Block` interface over Text/Image/Audio/Document/Thinking/ToolUse/ToolResult; `Message`/`Conversation`/`Chunk` streaming deltas; JSON codec), `uuid` (crypto/rand v4), `logging` (injected `*slog.Logger`, no globals). Stdlib only. Nothing depends downward from it.

### The heart

- **[harness](https://github.com/looprig/harness)** - The runtime SDK. Key packages: `loop` (the single-flight actor: `StartTurn`/`Interrupt`/`Shutdown`), `session` (multi-loop orchestration with depth/quota caps and restore), `hub` (session pub/sub with federated quiescence / headless `WaitIdle`), `command`/`event` (the typed command protocol and event stream), `identity` (attribution), `gate` (durable human/policy approval gates surviving restore), `tool`/`tools` (tool contracts + bundled `bash`/`fetch`/`glob`/`grep`/`websearch`/`writefile`/`skill`/`subagent`), `journal`/`sessionstore`/`workspacestore` (persistence facades over `storage` contracts), `foreignloop` (+`claude`) adapters driving external engines as loops, `transcript` (`html`/`journalsource`), `eval`, `ceiling`, and an optional `api` HTTP server.

### Inference

- **[inference](https://github.com/looprig/inference)** - The neutral model-call contract: `Client` (`Invoke`/`Stream`), secret-free `Model`, `Request`/`Response`/`Tool`/`Usage`, `APIFormat` (open-label: `openai`/`anthropic`/`gemini`), sampling/effort/mode knobs, codec (`openaiapi`/`anthropicapi`/`geminiapi`), `transport`, `wire` (jsonbody/ndjson/sse). No provider constants. Fail-safe-by-design.
- **[llm](https://github.com/looprig/llm)** - Provider **policy** layered on `inference`: known-provider registry (LMStudio/Phala/Chutes/OpenRouter/Bedrock/Google), `Provider↔APIFormat` truth tables, `RequiredAuth` (`AuthNone`/`AuthAPIKey`/`AuthSigV4`), `ValidateModel` (fail-closed), `auto.New` composition root, and concrete per-provider clients. TDX-guest attestation crypto for Phala/TEE; SigV4 for Bedrock. `inference never imports llm`.

### Storage

- **[storage](https://github.com/looprig/storage)** - The neutral contract hub. Four primitive contracts: `Ledger` (append-only, CAS-on-tip), `Leaser` (single-writer epoch-fenced ownership), `KV` (per-key revision-CAS), `Blobs` (content-addressed immutable bytes), plus a typed error taxonomy, `ValidateName`, `AppendDefinite` (turns any `Append` into a definite outcome on lost ack / lossy networks), `memstore` reference oracle, and `storetest` conformance suites called from each backend's tests.
- **[fsstore](https://github.com/looprig/fsstore)** - Filesystem backend. Length-prefixed CRC-32C frame log with torn-tail self-healing on reopen; `flock`+epoch-file leases; atomic-rename per-key KV; content-addressed disk blobs. Single-host durable default.
- **[natsstore](https://github.com/looprig/natsstore)** - JetStream backend, embedded **or** remote. The *only* module sanctioned to depend on NATS. Lease reclaim via KV TTL; cross-process flock on the embedded engine; secure-by-default dial; credentials redacted from all errors.
- **[rclonestore](https://github.com/looprig/rclonestore)** - Blobs-only backend over the external `rclone` binary. Cloud-agnostic reach (S3, GCS, Azure, local, ...) via argv-only exec, no cgo, no librclone linkage. Config referenced by path only; credentials never in errors/logs.

### OS confinement

- **[sandbox](https://github.com/looprig/sandbox)** - Real OS enforcement of what a spawned command can touch: Seatbelt on macOS, namespaces + Landlock + seccomp + nftables + cgroups on Linux. Security-mode ladder (`ZeroTrust < ReadOnly < Write < Trusted < Unconfined`), zero-value-most-restrictive, rung-1 vs rung-2 Linux probe, re-exec stage-2 helper, unforgeable HMAC grant tokens (`lrsx1.<payload>.<sig>`) for capability escalation, metadata-endpoint hard-deny. Coupling to the harness is **structural only**: the seams use stdlib types, so sandbox satisfies them without an import; `harness` must never import `sandbox`.

### Presentation & clients

- **[cli](https://github.com/looprig/cli)** - The terminal-UI (TUI) and CLI presentation layer, today's human-facing surface. Extracted into its own module so the core SDK can shed the heavy `charm.land/*` (Bubble Tea v2) stack. Shared `cli.run` plumbing (structured logging to `~/.looprig/looprig.log`, signal-driven shutdown, stdout/stderr capture so third-party libs can't corrupt scrollback) plus a ~50-file `tui/` transcript rendering (Glamour markdown to ANSI), scrollback, prompt, statusline, interaction (permission-gate UI), restore, export, and slash/file completion. Strictly one-directional: `cli` imports `harness`, never the reverse; the TUI never imports an agent package, observing sessions only through an `Agent`/`EventStream` seam.
- **`client` *(planned)*** - A future standalone module that brings the same session experience to the browser, desktop, and mobile. One Go binary = a backend-for-frontend (BFF) + embedded static SPA + a framework-neutral TypeScript SDK (`@looprig/client`). Three planes over the same `pkg/serve` `/v1` contract: a **read plane** (mounts `serve.NewReader` over `sessionstore`: list sessions, cold journal, transcript; works with no host), a **live plane** (SSE reverse-proxy of the host's `.../events` for token-by-token streaming), and a **control plane** (POST reverse-proxy for input/gate-response/interrupt/create/restore). The TS core parses the generated `serve` wire schema (JSON Schema to zod), folds cold history + live `enduring`/`ephemeral` frames into one session state machine, and performs the exact sequence join for lossless resume. Thin framework adapters wrap one core: `@looprig/svelte` (the first-party reference app), then `@looprig/react`, vue, angular, solid, plain TS; desktop + iOS/Android via Tauri v2 wrapping the same SPA. The client hosts **no agent**: it never imports `swe`; it browses history from the store and drives running sessions by proxying to a host. Same-origin by design: the SPA never holds the remote token or hits the host directly; no CORS surface. (`cli` and `client` are sibling consumers of `harness`; `swe` may embed the client's BFF + SPA for an all-in-one local dev binary.)
- **[bubbletea-fork](https://github.com/looprig/bubbletea-fork)** - A narrow, load-bearing fork of `charm.land/bubbletea/v2` (v2.0.7 baseline) for one fix: paging `insertAbove` so that streaming log/progress lines printed *above* the live TUI never corrupt output when a chunk is taller than the screen. Drops in via `replace` directive. Only four commits beyond the vendored baseline.

### Sibling engines

- **[flow](https://github.com/looprig/flow)** - A durable, Pregel-style (Bulk Synchronous Parallel) workflow engine as a Go library, for long-running workflows that pause for a human, ticket, approval, or external event and resume from a checkpoint without losing the execution frontier. Deterministic replay from append-only checkpoints, idempotency keys, resumable interrupts. The engine itself is *not* an agent framework; agents are intended to be bound later as task kinds on this core. In-process `Mem` control plane by default; Tier-C distributed via a separate JetStream-backed nested module (`pkg/nats`).

### Reference product

- **[swe](https://github.com/looprig/swe)** - The **SWE-Swarm**: a multi-agent software-engineering team built on the rig. The single topmost consumer permitted to import both `harness` and `sandbox`. A depth-1 agent tree (primary operator spawns non-spawning leafs), enforced *structurally* (leaves carry no `Subagent` tool) with a session depth-2 cap and spawn quota (64) backstop. Mutating/network tools default to human `Ask`; sandbox posture escalation gated on `GuaranteeBits()` (fail-closed to `Ask` on an unenforcing platform). Fsstore-backed `sessionstore`; workspace snapshots checkpointed at quiescence; config-fingerprint binding so a session can't silently resume under a different swarm/repo. Ships with an `operator_eval_...` golden-set reference corpus as the swarm's own quality gate.

### External proof

- **[tests](https://github.com/looprig/tests)** - A standalone cross-repo integration suite in its own repo, deliberately outside the harness so it can't reach into internals. It drives the harness's public durability APIs (suspend → durable record → resume on a *new* fsstore instance across a closed-and-reopened store, simulating process death) and asserts content-addressed tree equality including file modes and symlink targets. `GOWORK=off`-pinned to the `go.mod` versions: a credible e2e/acceptance gate, not a unit test.

<br/>

## Module dependency rules (enforced by spec)

```
core            ← no deps
inference       ← core                     (never llm)
storage         ← stdlib only              (no third-party)
harness         ← core, inference, storage (never llm; never sandbox)
llm             ← core, inference          (provides provider policy)
fsstore         ← storage
natsstore       ← storage, nats-io/*
rclonestore     ← storage                  (blobs only)
sandbox         ← stdlib + x/sys + vetted  (no looprig imports)
cli             ← harness, core, inference, bubbletea-fork
client (planned) ← harness (serve, sessionstore), one storage backend, stdlib net/http (no swe)
flow            ← core                     (bundled nats in nested module)
swe             ← harness, cli, inference, llm, fsstore, sandbox, core
tests           ← harness, inference, core, fsstore, storage (no swe)
```

<br/>

---

<p align="center"><sub>looprig: the rig that runs the loop.</sub></p>
