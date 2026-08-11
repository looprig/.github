---
id: reference/provider-matrix
title: Provider and target matrix
description: Map provider-neutral inference, llm adapters, evaluation targets, and qualification manifests to their stable boundaries.
audience: developer
section: reference
order: 301
publication: released
proofs:
  inference-contract: release-github-com-looprig-inference
  llm-adapters: release-github-com-looprig-llm
  evaluation-targets: release-github-com-looprig-eval
  qualification-targets: release-github-com-looprig-pluto
---

# Provider and target matrix

Provider choice is a model-access concern. Session event history, workflow state, workspace snapshots, artifacts, and model context cross different boundaries. The table below keeps those boundaries visible.

## Inference contract {#inference-contract}

| Layer | Stable boundary | What it owns | What it does not own |
| --- | --- | --- | --- |
| `inference` v0.9.2 | `inference.Client.Invoke` and `Stream` | Provider-neutral request/response, tools, images, structured output, usage, finish reason | Credentials, session persistence, qualification policy |
| `inference` codecs | Provider wire codecs under `codec/*` | Encode/decode provider request and stream formats | A provider-neutral retry or profile decision |
| `llm` v0.13.3 | Provider packages under `providers/*` and `llm.Client` | Provider construction and model configuration | Durable event history, checkpoints, artifacts |

The inference request carries a model descriptor, system prompt, message thread, tools, optional output schema, tool choice, and sampling override. Structured output is bounded at 1 MiB and validates a portable schema subset. Typed errors distinguish unsupported images/structured output, malformed output, schema failures, and conflicts.

## LLM adapters {#llm-adapters}

`llm` contains provider adapters for hosted, gateway, local, and enterprise endpoints, including the packages present in the pinned release tree such as Anthropic, Bedrock, Gemini, OpenAI, OpenRouter, Ollama, Phala, and other provider directories. The matrix is intentionally provider-neutral: inspect the specific adapter's constructor and release source before promising a capability. A provider name alone does not establish image, tool, streaming, or structured-output support.

## Evaluation targets {#evaluation-targets}

| Target | Boundary | Lifecycle and evidence |
| --- | --- | --- |
| `eval/target/inference` v0.1.2 | Builds an `eval.Target` from an `llm.Client` and request template | Appends scenario input, records model identity/timing/messages/tool calls/structured output, and returns typed inference or empty-response errors. |
| `eval/target` scripted fixtures | `eval.Target` with deterministic observations | Offline; revision and scenario identity must match; unscripted cases fail instead of becoming empty observations. |
| `pluto/pkg/qual/target` v0.1.2 | Pluto `qual.Target` and `Scripted` | Reproducible qualification evidence; no production provider call. |

An evaluation target produces an observation artifact. It does not persist session state or alter the model's context after the observation is recorded. Reports are redacted before JSON persistence.

## Qualification targets {#qualification-targets}

Pluto `qual.Manifest` records target ID, role, provider, model, API format, base URL, endpoint class, effort, revision, and declared capabilities. `run.Execute` selects exactly one target (or a per-table target), preserves skipped capability tables, and returns scorecards. `profile.Evaluate` decides the disposition; it does not infer missing provider capability from a passing unrelated table. See the [Pluto release tree](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4) for constructors and current provider-neutral target declarations.
