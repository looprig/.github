import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const modulesRoot = path.join(root, "docs/modules");
const inventory = JSON.parse(readFileSync(path.join(root, "docs/_data/modules.json"), "utf8"));

const names = new Map([
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
  ["acp", "ACP is useful on its own when a Go application needs to drive an Agent Client Protocol process or expose its own host through ACP. Within Looprig, it connects [Foreign Loops](/docs/modules/foreignloops) and [Harness](/docs/modules/harness) to editors, coding agents, and other ACP-compatible clients. ACP owns the protocol and process boundary; the host still owns sessions, permissions, and model access."],
  ["classifiers", "Classifiers are useful on their own when an application needs deterministic command-safety evidence. Within Looprig, they support permission decisions around [Harness](/docs/modules/harness) and prepared [Tools](/docs/modules/tools). A classifier reports bounded evidence; it does not grant authority or replace the gate that makes the final decision."],
  ["client", "Client is useful on its own when a browser or Go web application needs a typed session transport, event folding, and live updates. Within Looprig, it adapts [Harness](/docs/modules/harness) sessions for framework-neutral web clients and the optional Svelte layer. Client presents runtime state; it does not own the agent loop or durable storage policy."],
  ["core", "Core is the foundation for applications that need provider-neutral messages, content blocks, streaming chunks, usage values, logging, or UUIDs. Within Looprig, those types are shared by [Inference](/docs/modules/inference), [Harness](/docs/modules/harness), tools, stores, and user interfaces. Core defines common values without owning model transport or runtime lifecycle."],
  ["credentials", "Credentials are useful on their own when an application needs explicit credential selection, acquisition, refresh, and invalidation without embedding secret values in configuration. Within Looprig, [Inference](/docs/modules/inference) and [LLM](/docs/modules/llm) use them to obtain provider authentication from [Secrets](/docs/modules/secrets). Credentials manage leases and refresh; provider clients decide how credentials are sent."],
  ["eval", "Eval is useful on its own when an application needs to run cases against a target, score observations, and write redacted reports. Within Looprig, it evaluates [Inference](/docs/modules/inference) targets and can observe [Harness](/docs/modules/harness) behavior. Eval defines the evaluation domain; Pluto packages that domain into a complete qualification product."],
  ["flow", "Flow is useful on its own when a Go application needs compiled graphs, typed interruption, checkpointing, and resumable execution. Within Looprig, [Workflows](/docs/modules/workflows) builds durable workflow services on Flow, while [Flow Store](/docs/modules/flow-store) persists checkpoints. Flow owns graph execution, not agent sessions or the backing storage engine."],
  ["flow-store", "Flow Store is useful on its own when a Flow application needs to persist checkpoints through Looprig's neutral storage contracts. Within Looprig, it joins [Flow](/docs/modules/flow) to [FSStore](/docs/modules/fsstore) and [Storage](/docs/modules/storage). It adapts checkpoint records; it does not execute graphs or choose the storage location."],
  ["foreignloops", "Foreign Loops is useful on its own when an application needs to supervise and restore an external agent process behind a neutral backend. Within Looprig, it adapts ACP, Claude, and Codex processes to [Harness](/docs/modules/harness) by using [ACP](/docs/modules/acp) and shared inference types. Foreign Loops owns the adapter lifecycle; the external process keeps its native behavior."],
  ["fsstore", "FSStore is useful on its own when a Go application needs durable ledgers, key-value records, and blobs in an owner-controlled local directory. Within Looprig, it implements [Storage](/docs/modules/storage) for [Harness](/docs/modules/harness), [Flow Store](/docs/modules/flow-store), and local client deployments. FSStore chooses the filesystem backend; callers retain ownership of record meaning and retention policy."],
  ["harness", "Harness is useful on its own when an application needs to turn model calls and tools into a session-oriented agent runtime. Within Looprig, it composes [Inference](/docs/modules/inference), [Storage](/docs/modules/storage), gates, workspaces, delegation, and tools behind Loops and Rigs. Harness owns runtime coordination; applications still choose models, authority, persistence, and interfaces."],
  ["inference", "Inference is useful on its own when a Go application needs provider-neutral model requests, streaming, codecs, retries, routing, or a local model gateway. Within Looprig, it supplies the model boundary for [Harness](/docs/modules/harness), [Eval](/docs/modules/eval), [Tools](/docs/modules/tools), and [Workflows](/docs/modules/workflows). Inference moves model data; it does not own agent sessions or provider credential catalogs."],
  ["llm", "LLM is useful on its own when an application wants ready provider clients backed by explicit model descriptors and credentials. Within Looprig, it turns [Inference](/docs/modules/inference) contracts and [Credentials](/docs/modules/credentials) into clients that [Harness](/docs/modules/harness) applications can select. LLM owns provider construction; Inference retains the neutral request and response model."],
  ["mcp", "MCP is useful on its own when an application needs to consume or publish Model Context Protocol tools over supported transports. Within Looprig, it adopts remote tools into [Harness](/docs/modules/harness) and can expose prepared [Tools](/docs/modules/tools) to MCP clients. MCP owns protocol transport and discovery; the surrounding application owns authentication, authority, and lifecycle policy."],
  ["natsstore", "NATSStore is useful on its own when a distributed Go application needs Looprig's storage contracts on NATS JetStream. Within Looprig, it provides a shared [Storage](/docs/modules/storage) backend for the [Client](/docs/modules/client) and other multi-process deployments. NATSStore owns JetStream mapping and optional embedded startup; callers own data semantics and server operations."],
  ["rclonestore", "RcloneStore is useful on its own when an application needs immutable blob storage through an existing rclone remote. Within Looprig, it provides the blob portion of [Storage](/docs/modules/storage) for runtimes that keep large objects outside their ledger or metadata backend. RcloneStore owns bounded subprocess calls; deployment configuration owns the remote and credentials."],
  ["sandbox", "Sandbox is useful on its own. Use it whenever a Go application needs to run a process with explicit filesystem, network, environment, and operating-system restrictions. The process does not need to be an agent or use any other Looprig module.\n\nWithin Looprig, Sandbox integrates with [Harness](/docs/modules/harness) and [Tools](/docs/modules/tools). Harness can apply a sandbox profile to session-owned processes, while process-based tools use the resulting executor to enforce the permitted access at the operating-system boundary. Sandbox defines the confinement boundary; Harness decides when work may run, gates decide whether it should run, and tools describe the requested operation."],
  ["secrets", "Secrets are useful on their own when an application needs opaque references, redaction-safe values, and a replaceable secret store. Within Looprig, [Credentials](/docs/modules/credentials), [Inference](/docs/modules/inference), and [LLM](/docs/modules/llm) pass references instead of copying secret material into model configuration. Secrets protect representation and lookup boundaries; callers still control authorization and rotation policy."],
  ["storage", "Storage is useful on its own. Use it when a Go application needs stable interfaces for append-only records, leases, revisioned key-value data, and immutable blobs without committing to a particular backend.\n\nWithin Looprig, Storage provides the persistence contracts used by [Harness](/docs/modules/harness), [Workflows](/docs/modules/workflows), [Client](/docs/modules/client), and [Flow Store](/docs/modules/flow-store). Backend modules such as [FSStore](/docs/modules/fsstore), [NATSStore](/docs/modules/natsstore), and [RcloneStore](/docs/modules/rclonestore) implement selected parts of those contracts. Storage defines durable operations; higher-level runtimes decide what to persist."],
  ["tools", "Tools are useful on their own when an application needs prepared file, process, network, interaction, task, or skill operations with validation before effect. Within Looprig, [Harness](/docs/modules/harness) exposes them to loops, while [Sandbox](/docs/modules/sandbox) and gates can constrain process execution and sensitive effects. Tools describe and perform operations; the runtime owns admission, authority, and cleanup."],
  ["tui", "TUI is useful on its own when a terminal application needs reusable session views, event rendering, input, completion, restore decisions, and teardown coordination. Within Looprig, it presents [Harness](/docs/modules/harness) sessions and [Inference](/docs/modules/inference) content in a ready terminal interface. TUI owns presentation and interaction; the runtime remains the source of session state."],
  ["workflows", "Workflows are useful on their own when an application needs typed, durable workflow definitions with interruption, recovery, supervision, and tool-facing controls. Within Looprig, the module combines [Flow](/docs/modules/flow), [Harness](/docs/modules/harness), [Inference](/docs/modules/inference), and [Storage](/docs/modules/storage). Workflows coordinate long-running business processes; Harness continues to own agent sessions and Flow continues to execute graphs."],
]);

const pages = readdirSync(modulesRoot).filter((name) => name.endsWith(".md")).sort();
const slugs = pages.map((name) => name.slice(0, -3));
const repositoryBySlug = new Map(slugs.map((slug) => [slug, slug === "flow-store" ? "flow/store" : slug]));
const recordBySlug = new Map(slugs.map((slug) => [
  slug,
  inventory.modules.find((record) => record.repository === repositoryBySlug.get(slug)),
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
