---
id: overview/comparison
title: How Looprig compares
description: A factual comparison of Looprig with LangGraph, the OpenAI Agents SDK, the Claude Agent SDK, Mastra, Pydantic AI, Eino, and Google ADK across language, scope, durability, serving, sandboxing, and providers.
audience: developer
section: overview
order: 4
publication: released
proofs:
  what-looprig-is: [release-github-com-looprig-harness, release-github-com-looprig-inference, release-github-com-looprig-llm, release-github-com-looprig-sandbox, release-github-com-looprig-factory, release-github-com-looprig-host, release-github-com-looprig-sessionstore, release-npm-looprig-client, release-npm-looprig-react]
  at-a-glance: [release-github-com-looprig-harness, release-github-com-looprig-sessionstore, release-github-com-looprig-storage, release-github-com-looprig-factory, release-github-com-looprig-host, release-github-com-looprig-sandbox, release-github-com-looprig-llm]
  framework-by-framework: [release-github-com-looprig-harness, release-github-com-looprig-flow, release-github-com-looprig-sandbox, release-github-com-looprig-factory, release-github-com-looprig-host, release-github-com-looprig-sessionstore, release-github-com-looprig-controller, release-github-com-looprig-llm, release-github-com-looprig-inference, release-github-com-looprig-mcp, release-github-com-looprig-acp, release-github-com-looprig-eval]
  compared-with-langgraph: [release-github-com-looprig-harness, release-github-com-looprig-flow, release-github-com-looprig-sandbox, release-github-com-looprig-factory, release-github-com-looprig-host, release-github-com-looprig-sessionstore, release-github-com-looprig-controller, release-github-com-looprig-llm, release-github-com-looprig-inference, release-github-com-looprig-mcp, release-github-com-looprig-acp, release-github-com-looprig-eval]
  compared-with-the-openai-agents-sdk: [release-github-com-looprig-harness, release-github-com-looprig-flow, release-github-com-looprig-sandbox, release-github-com-looprig-factory, release-github-com-looprig-host, release-github-com-looprig-sessionstore, release-github-com-looprig-controller, release-github-com-looprig-llm, release-github-com-looprig-inference, release-github-com-looprig-mcp, release-github-com-looprig-acp, release-github-com-looprig-eval]
  compared-with-the-claude-agent-sdk: [release-github-com-looprig-harness, release-github-com-looprig-flow, release-github-com-looprig-sandbox, release-github-com-looprig-factory, release-github-com-looprig-host, release-github-com-looprig-sessionstore, release-github-com-looprig-controller, release-github-com-looprig-llm, release-github-com-looprig-inference, release-github-com-looprig-mcp, release-github-com-looprig-acp, release-github-com-looprig-eval]
  compared-with-mastra: [release-github-com-looprig-harness, release-github-com-looprig-flow, release-github-com-looprig-sandbox, release-github-com-looprig-factory, release-github-com-looprig-host, release-github-com-looprig-sessionstore, release-github-com-looprig-controller, release-github-com-looprig-llm, release-github-com-looprig-inference, release-github-com-looprig-mcp, release-github-com-looprig-acp, release-github-com-looprig-eval]
  compared-with-pydantic-ai: [release-github-com-looprig-harness, release-github-com-looprig-flow, release-github-com-looprig-sandbox, release-github-com-looprig-factory, release-github-com-looprig-host, release-github-com-looprig-sessionstore, release-github-com-looprig-controller, release-github-com-looprig-llm, release-github-com-looprig-inference, release-github-com-looprig-mcp, release-github-com-looprig-acp, release-github-com-looprig-eval]
  compared-with-eino: [release-github-com-looprig-harness, release-github-com-looprig-flow, release-github-com-looprig-sandbox, release-github-com-looprig-factory, release-github-com-looprig-host, release-github-com-looprig-sessionstore, release-github-com-looprig-controller, release-github-com-looprig-llm, release-github-com-looprig-inference, release-github-com-looprig-mcp, release-github-com-looprig-acp, release-github-com-looprig-eval]
  compared-with-google-adk: [release-github-com-looprig-harness, release-github-com-looprig-flow, release-github-com-looprig-sandbox, release-github-com-looprig-factory, release-github-com-looprig-host, release-github-com-looprig-sessionstore, release-github-com-looprig-controller, release-github-com-looprig-llm, release-github-com-looprig-inference, release-github-com-looprig-mcp, release-github-com-looprig-acp, release-github-com-looprig-eval]
  what-looprig-is-not-for: [release-github-com-looprig-harness, release-github-com-looprig-factory, release-github-com-looprig-llm, release-github-com-looprig-tools]
  when-to-choose-which: [release-github-com-looprig-harness, release-github-com-looprig-factory, release-github-com-looprig-host, release-github-com-looprig-sandbox]
  sources: [release-github-com-looprig-harness]
---

# How Looprig compares

This page places Looprig next to seven other agent frameworks and SDKs: LangGraph, the OpenAI Agents SDK, the Claude Agent SDK, Mastra, Pydantic AI, Eino, and Google's Agent Development Kit (ADK). It compares them on six points: implementation language, scope, durability, multi-user serving, sandboxing, and provider neutrality.

Every competitor statement below was checked against that project's official documentation or repository on **2026-09-29** (the sandboxing and serving claims were rechecked on 2026-09-30), and each one links to the page it came from. These projects change quickly, so treat the page as a dated snapshot and follow the links before you decide. Where we could not find something, the table says "not found" and the prose names the documentation we searched. That means only that we found no official page for it in those sources, not that the capability is absent or impossible. The recommendations under "When to choose which" are our editorial judgments, not measured results.

## What Looprig is

Looprig is a set of Apache-2.0 Go modules targeting Go 1.26.9, plus two npm browser packages, `@looprig/client` and `@looprig/react` (0.3.0). It is a library, not a hosted service: there is no Looprig account or hosted API, and model calls go from your process to the provider you configure. Every module is pre-1.0 (`v0.x`), so minor releases can still change APIs.

The modules most relevant to this comparison are:

- [Harness](/docs/modules/harness), the agent runtime: Loops, Rigs, Sessions, tools, approval gates, delegation, and a durable session journal that can be restored. See [session persistence](/docs/guides/harness/session-persistence).
- [Storage](/docs/modules/storage) contracts with interchangeable backends: the in-memory memstore, [FSStore](/docs/modules/fsstore), [NATSStore](/docs/modules/natsstore), and [PGStore](/docs/modules/pgstore) paired with [S3Store](/docs/modules/s3store) for blobs.
- [Sandbox](/docs/modules/sandbox), which confines child processes at the operating-system boundary on Linux, macOS, and Windows and reports which guarantees the host actually enforced.
- [Factory](/docs/modules/factory), [Host](/docs/modules/host), and [SessionStore](/docs/modules/sessionstore), which together serve durable sessions to many users on pooled or dedicated Hosts. The optional [Controller](/docs/modules/controller) runs one Host Pod per session on Kubernetes.
- [Inference](/docs/modules/inference) and [LLM](/docs/modules/llm): one provider-neutral request contract and 52 documented [providers](/docs/guides/inference/providers).
- [Flow](/docs/modules/flow) for compiled graphs with checkpoints, and [MCP](/docs/modules/mcp), [ACP](/docs/modules/acp), and [Eval](/docs/modules/eval) for protocols and evaluation.

The cost of this design is assembly. You choose the modules, the storage backend, the identity and authorization policy, and the deployment platform, and you wire them together yourself. [Which modules do I need?](/docs/overview/which-modules) and the [architecture overview](/docs/overview/architecture) help with that choice.

## At a glance

| | Language | Scope | Durable, resumable state | Multi-user serving | Process sandboxing | Providers |
| --- | --- | --- | --- | --- | --- | --- |
| **Looprig** | Go; browser client in TypeScript | Modular agent runtime, serving, and sandbox libraries | Append-only session journal on pluggable Storage backends; restore after a crash | Factory, Host, and SessionStore libraries that you deploy | OS confinement on Linux, macOS, Windows with reported guarantees | 52 documented providers behind one contract |
| **LangGraph** | Python, JavaScript | Low-level graph orchestration and runtime | Checkpointers (in-memory, SQLite, Postgres); durable execution | LangSmith Deployment (cloud, hybrid, self-hosted, standalone Agent Server) | Not in LangGraph itself; Deep Agents runs commands in remote provider sandboxes | Not tied to one provider |
| **OpenAI Agents SDK** | Python, TypeScript | Lightweight agent SDK | Sessions (SQLite, SQLAlchemy, Redis, MongoDB); Temporal, Restate, DBOS integrations | Not found in the SDK docs | Sandbox agents over local, Docker, or hosted clients | OpenAI by default; LiteLLM, Any-LLM, compatible endpoints |
| **Claude Agent SDK** | Python, TypeScript | Claude Code's agent loop as a library | Resumable sessions; `SessionStore` adapter mirrors transcripts | Self-host in containers; Managed Agents is Anthropic's hosted option | Sandbox mode for Bash (bubblewrap, sandbox-exec); container guidance | Claude models via Anthropic, Bedrock, Google Cloud, Microsoft Foundry |
| **Mastra** | TypeScript | Full-stack agent and workflow framework | Workflow snapshots in configured storage survive restarts | Hono-based server; Mastra platform for managed deployment | Workspace sandboxes; LocalSandbox with optional Seatbelt or bubblewrap | Model router listing over 200 providers |
| **Pydantic AI** | Python | Typed agent loop | Temporal, DBOS, Prefect, Restate, AWS Lambda, and other integrations | Dev-only web chat UI; AG-UI and Vercel AI adapters for your own server | Monty sandboxed Python interpreter | Many providers through one API |
| **Eino** | Go | LLM application framework with graph orchestration | Interrupt and resume through a `CheckPointStore` you implement | Not found in the Eino docs | Docker command sandbox and a remote Volcengine sandbox in eino-ext | OpenAI, Claude, Gemini, Ark, Ollama, and more in eino-ext |
| **Google ADK** | Python, TypeScript, Go, Java, Kotlin | Agent development framework | Session services (in-memory, database, Vertex AI) | Agent Runtime on Google Cloud, Cloud Run, GKE, or containers | Code executors, including GKE with gVisor | Gemini-optimized; LiteLLM, Claude, Ollama, vLLM, and others |

## Framework by framework

### Compared with LangGraph

[LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) calls itself "a low-level orchestration framework and runtime for building, managing, and deploying long-running, stateful agents", with Python and [JavaScript](https://docs.langchain.com/oss/javascript/langgraph/overview) editions. Its [persistence layer](https://docs.langchain.com/oss/python/langgraph/persistence) offers in-memory, SQLite, and Postgres checkpointers that support fault tolerance, human-in-the-loop interruption, and time travel over prior states, and it states you do not need LangChain to use it. Serving goes through [LangSmith Deployment](https://docs.langchain.com/langsmith/deployment), which offers managed cloud (Plus plan or above), hybrid, self-hosted (Enterprise plan), and a standalone Agent Server that needs your own PostgreSQL, Redis, and a LangSmith license.

Looprig's closest equivalents are Flow, for compiled graphs with append-only checkpoints, and Harness, for sessions with a durable journal. The difference is mostly in serving: Factory, Host, and SessionStore are Apache-2.0 libraries you run yourself, with no control plane or license to buy, but you also get no managed console. LangGraph itself does not confine tool processes. Deep Agents, LangChain's agent harness built on LangGraph, runs commands in [sandboxes](https://docs.langchain.com/oss/python/deepagents/sandboxes) from remote providers such as LangSmith, Daytona, E2B, and Modal, reached through their APIs; we did not find local OS-level confinement on that page or in the LangGraph docs as of 2026-09.

### Compared with the OpenAI Agents SDK

The [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) aims for "very few abstractions": agents, handoffs or agents-as-tools, and guardrails, in Python and [TypeScript](https://openai.github.io/openai-agents-js/). Sessions persist working context to SQLAlchemy, SQLite, Redis, or MongoDB, runs can resume from `RunState`, and the SDK ships [Temporal, Restate, and DBOS integrations](https://openai.github.io/openai-agents-python/running_agents/) for durable, long-running work. It defaults to OpenAI's Responses API and supports [other providers](https://openai.github.io/openai-agents-python/models/) through LiteLLM, Any-LLM, or any OpenAI-compatible endpoint.

Its [sandbox agents](https://openai.github.io/openai-agents-python/sandbox_agents/) give a model a persistent workspace through local, Docker, or hosted sandbox clients. The docs are explicit that the Unix-local client "adds no OS-level confinement" on Linux and applies filesystem restrictions through `sandbox-exec` on macOS without network isolation, and they recommend Docker or hosted sandboxes for untrusted commands. Looprig's Sandbox module instead confines the child process natively on each platform and reports the guarantees achieved. We did not find a multi-user server in the SDK's Python or TypeScript documentation as of 2026-09; the SDK leaves serving to your application.

### Compared with the Claude Agent SDK

The [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) exposes the tools, agent loop, and context management that power Claude Code, in Python and TypeScript. It runs the Claude Code binary as a subprocess. Its [permission system](https://code.claude.com/docs/en/agent-sdk/permissions) is detailed: hooks, deny and ask rules, allow rules, a `canUseTool` callback, and six permission modes (`default`, `dontAsk`, `acceptEdits`, `bypassPermissions`, `plan`, `auto`). Sessions can be resumed or forked, and a `SessionStore` adapter mirrors transcripts to durable storage. The [hosting guide](https://code.claude.com/docs/en/agent-sdk/hosting) notes that the mirror is best-effort and covers transcripts only.

For isolation, [secure deployment](https://code.claude.com/docs/en/agent-sdk/secure-deployment) describes a sandbox mode for Bash built on sandbox-runtime (bubblewrap on Linux, `sandbox-exec` on macOS), and guidance for Docker, gVisor, and Firecracker. You host it yourself, one subprocess per session, or use Anthropic's Managed Agents. It works with Claude models through the Anthropic API, Amazon Bedrock, Claude Platform on AWS, Google Cloud's Agent Platform, and Microsoft Foundry ([quickstart](https://code.claude.com/docs/en/agent-sdk/quickstart)).

Looprig's approval gates play a similar role to permission callbacks, and Harness is provider-neutral where the Claude Agent SDK is Claude-specific. The Claude Agent SDK gives you a complete coding agent immediately. With Looprig you build the agent yourself, or start from the [Carbon](/docs/products/carbon) product.

### Compared with Mastra

[Mastra](https://mastra.ai/docs) is "a TypeScript framework for building AI agents and applications", with agents, tools, memory, and workflows. Its [workflows suspend and resume](https://mastra.ai/docs/workflows/suspend-and-resume) from snapshots that "persist across deployments and application restarts." It ships a Hono-based server and deployers for several clouds, plus a Mastra platform for managed deployment ([deployment overview](https://mastra.ai/docs/deployment/overview)). Its [model router](https://mastra.ai/models) lists thousands of models from over 200 providers. It includes [RAG](https://mastra.ai/docs/rag/overview) with chunking, embedding, and vector stores such as pgvector, Pinecone, and Qdrant. [Workspace sandboxes](https://mastra.ai/docs/workspace/sandbox) cover many remote providers, and LocalSandbox can opt into Seatbelt on macOS or bubblewrap on Linux.

Mastra covers more of the product surface in one TypeScript framework, including retrieval. Looprig covers less of that surface, is written in Go, and puts more weight on durable command settlement, Host placement, and cross-platform process confinement with reported guarantees.

### Compared with Pydantic AI

[Pydantic AI](https://pydantic.dev/docs/ai/overview/) describes itself as "the Python AI SDK: a typed, extensible agent loop with every model a string swap away." It supports OpenAI, Anthropic, Google, Bedrock, Azure AI Foundry, Groq, Mistral, xAI, Ollama, and more. Its durability comes from [integrations](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/) with Temporal, DBOS, Prefect, Restate, AWS Lambda, Kitaru, and Airflow, several co-maintained with those vendors. It also offers Monty, a sandboxed Python interpreter for model-written code. Its built-in [web chat UI](https://pydantic.dev/docs/ai/guides/web/) is documented as "meant for local development and debugging"; for production it points to UI event stream integrations such as [AG-UI](https://pydantic.dev/docs/ai/integrations/ui/ag-ui/) that you serve from your own application. We did not find a built-in multi-user session server in those pages as of 2026-09.

Pydantic AI delegates durability to an external engine you already run. Looprig keeps it in-process: the Harness journal and SessionStore records sit on a Storage backend you choose.

### Compared with Eino

[Eino](https://www.cloudwego.io/docs/eino/overview/) from CloudWeGo is the most direct peer in language: an Apache-2.0 Go framework for LLM applications. It has component abstractions (ChatModel, Tool, Retriever, and others), Chain, Graph, and Workflow orchestration, and an ADK with ReAct, supervisor, and plan-execute patterns. It supports [interrupt and resume](https://www.cloudwego.io/docs/eino/core_modules/chain_and_graph_orchestration/checkpoint_interrupt/) through a `CheckPointStore`, and its docs state that it provides no default implementation, so you supply the storage. [eino-ext](https://github.com/cloudwego/eino-ext) provides chat models for OpenAI, Claude, Gemini, Ark, Ollama, and others, plus retrievers, indexers, and embedders such as Elasticsearch and VikingDB.

For isolation, eino-ext has a [Docker command sandbox](https://pkg.go.dev/github.com/cloudwego/eino-ext/components/tool/commandline/sandbox) and an [Ark Agentkit sandbox backend](https://www.cloudwego.io/docs/eino/core_modules/eino_adk/eino_adk_chatmodelagentmiddleware/filesystem_backend/backend_ark_agentkit_sandbox/) that runs file and command operations remotely in Volcengine's service.

Eino has retrieval components that Looprig does not. Looprig ships storage backends that pass its Storage conformance suite, a multi-user serving layer, and native OS confinement of child processes; we did not find equivalents of the first two in the Eino overview, the checkpoint documentation, or the eino-ext repository as of 2026-09.

### Compared with Google ADK

[Google ADK](https://adk.dev/) is "the open-source agent development framework that lets you build, debug, and deploy reliable AI agents at enterprise scale", available in Python, TypeScript, Go, Java, and Kotlin. [ADK for Go](https://github.com/google/adk-go) is Apache-2.0 and described as model-agnostic and optimized for Gemini. Its [session services](https://adk.dev/sessions/session/) range from in-memory to a database-backed service and a Vertex AI service whose data "survives application restarts." Its [deploy guide](https://adk.dev/deploy/) covers Agent Runtime on Google Cloud, Cloud Run, GKE, and any container platform. Non-Gemini [models](https://adk.dev/agents/models/) are available through LiteLLM, Claude, Ollama, vLLM, and LiteRT-LM connectors, and its code executors include a [GKE executor](https://google.github.io/adk-docs/integrations/gke-code-executor/) that isolates code with gVisor.

On Google Cloud, ADK has a documented deployment path to managed targets. Looprig has no managed target. Its Factory and Host run wherever you deploy them, and its Controller is its Kubernetes path.

## What Looprig is not for

- **A Python- or TypeScript-native server framework.** The runtime, serving, and sandbox modules are Go. Other languages integrate over Factory's HTTP and WebSocket surface, and browsers use `@looprig/client` or `@looprig/react`, but there is no Python or server-side TypeScript SDK.
- **A managed agent platform.** There is no hosted service, account, console, or model hosting. You operate Factory, Hosts, storage, and the platform they run on.
- **No-code or visual builders.** Agents are defined in Go code.
- **Retrieval-augmented generation.** No Looprig module provides embeddings, vector stores, chunking, or retrievers. Pair Looprig with a retrieval library, or pick Mastra, Eino, or LangChain.
- **Stable 1.0 API guarantees.** Every module is `v0.x`. Some releases are one-way data upgrades, as the release notes of FSStore and SessionStore describe.
- **Quick prototypes that do not need its boundaries.** Durable journals, fenced command settlement, and native confinement add concepts. For a single-user script, a smaller SDK is often the better fit.

## When to choose which

- **Choose Looprig** when you want to own a Go agent runtime end to end: durable, restorable sessions on storage you pick, OS-level confinement of tool processes, one contract over many providers, and a self-hosted multi-user serving layer with no licensed control plane. Expect to assemble it. Start with [Harness](/docs/modules/harness), [Sandbox](/docs/guides/sandboxing), and [Which modules do I need?](/docs/overview/which-modules).
- **Choose LangGraph** for fine-grained graph control and built-in checkpointing in Python or JavaScript, especially if a LangSmith deployment option suits you.
- **Choose the OpenAI Agents SDK** for a small Python or TypeScript API centered on OpenAI models, with durability available through Temporal, Restate, or DBOS.
- **Choose the Claude Agent SDK** when you want Claude Code's agent, tools, and permission model in your own Python or TypeScript app, and Claude is your model.
- **Choose Mastra** for a single TypeScript framework covering agents, workflows, RAG, and deployment, with a wide model router.
- **Choose Pydantic AI** for a typed Python agent loop, particularly if you already run Temporal, DBOS, Prefect, or Restate.
- **Choose Eino** for a Go framework with graph orchestration and retrieval components, and bring your own storage and serving.
- **Choose Google ADK** for a multi-language framework with a direct path to Google Cloud deployment.

## Sources

All pages were accessed on 2026-09-29 unless marked otherwise.

- LangGraph overview: https://docs.langchain.com/oss/python/langgraph/overview
- LangGraph for JavaScript: https://docs.langchain.com/oss/javascript/langgraph/overview
- LangGraph persistence: https://docs.langchain.com/oss/python/langgraph/persistence
- LangSmith Deployment: https://docs.langchain.com/langsmith/deployment
- Deep Agents sandboxes: https://docs.langchain.com/oss/python/deepagents/sandboxes (accessed 2026-09-30)
- OpenAI Agents SDK (Python): https://openai.github.io/openai-agents-python/
- OpenAI Agents SDK (TypeScript): https://openai.github.io/openai-agents-js/
- OpenAI Agents SDK, running agents: https://openai.github.io/openai-agents-python/running_agents/
- OpenAI Agents SDK, models: https://openai.github.io/openai-agents-python/models/
- OpenAI Agents SDK, sandbox agents: https://openai.github.io/openai-agents-python/sandbox_agents/
- Claude Agent SDK overview: https://code.claude.com/docs/en/agent-sdk/overview
- Claude Agent SDK permissions: https://code.claude.com/docs/en/agent-sdk/permissions
- Claude Agent SDK hosting: https://code.claude.com/docs/en/agent-sdk/hosting
- Claude Agent SDK secure deployment: https://code.claude.com/docs/en/agent-sdk/secure-deployment
- Claude Agent SDK quickstart: https://code.claude.com/docs/en/agent-sdk/quickstart
- Mastra docs: https://mastra.ai/docs
- Mastra suspend and resume: https://mastra.ai/docs/workflows/suspend-and-resume
- Mastra deployment: https://mastra.ai/docs/deployment/overview
- Mastra models: https://mastra.ai/models
- Mastra RAG: https://mastra.ai/docs/rag/overview
- Mastra workspace sandboxes: https://mastra.ai/docs/workspace/sandbox
- Pydantic AI overview: https://pydantic.dev/docs/ai/overview/
- Pydantic AI durable execution: https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/ (accessed 2026-09-30)
- Pydantic AI web chat UI: https://pydantic.dev/docs/ai/guides/web/ (accessed 2026-09-30)
- Pydantic AI AG-UI: https://pydantic.dev/docs/ai/integrations/ui/ag-ui/ (accessed 2026-09-30)
- Eino overview: https://www.cloudwego.io/docs/eino/overview/
- Eino checkpoint and interrupt: https://www.cloudwego.io/docs/eino/core_modules/chain_and_graph_orchestration/checkpoint_interrupt/
- eino-ext repository: https://github.com/cloudwego/eino-ext
- eino-ext Docker command sandbox: https://pkg.go.dev/github.com/cloudwego/eino-ext/components/tool/commandline/sandbox (accessed 2026-09-30)
- Eino Ark Agentkit sandbox backend: https://www.cloudwego.io/docs/eino/core_modules/eino_adk/eino_adk_chatmodelagentmiddleware/filesystem_backend/backend_ark_agentkit_sandbox/ (accessed 2026-09-30)
- Google ADK: https://adk.dev/
- ADK for Go repository: https://github.com/google/adk-go
- ADK deployment: https://adk.dev/deploy/
- ADK sessions: https://adk.dev/sessions/session/
- ADK models: https://adk.dev/agents/models/
- ADK GKE code executor: https://google.github.io/adk-docs/integrations/gke-code-executor/
