import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const acpProof = "release-github-com-looprig-acp";
const mcpProof = "release-github-com-looprig-mcp";

const pages = [
  ["guides/protocols/index", "Overview", [acpProof, mcpProof]],
  ["guides/protocols/acp/index", "ACP", [acpProof]],
  ["guides/protocols/acp/serve", "ACP Serve", [acpProof]],
  ["guides/protocols/acp/client", "ACP Client", [acpProof]],
  ["guides/protocols/acp/host-agent", "ACP host and agent facades", [acpProof]],
  ["guides/protocols/acp/stdio", "ACP stdio framing", [acpProof]],
  ["guides/protocols/acp/sessions", "ACP sessions and lifecycle", [acpProof]],
  ["guides/protocols/acp/auth-and-config", "ACP authentication and runtime config", [acpProof]],
  ["guides/protocols/acp/gateway-launch", "ACP gateways and launch proxy", [acpProof]],
  ["guides/protocols/mcp/index", "MCP", [mcpProof]],
  ["guides/protocols/mcp/serve", "MCP Serve", [mcpProof]],
  ["guides/protocols/mcp/client", "MCP Client", [mcpProof]],
  ["guides/protocols/mcp/transports", "MCP transports", [mcpProof]],
  ["guides/protocols/mcp/auth", "MCP authentication", [mcpProof]],
  ["guides/protocols/mcp/harness-adoption", "MCP discovery and Harness adoption", [mcpProof]],
  ["guides/protocols/mcp/sampling-and-reconfiguration", "MCP sampling and reconfiguration", [mcpProof]],
  ["guides/protocols/mcp/acp-passthrough", "MCP ACP pass-through", [mcpProof, acpProof]],
];

function pageFile(id) {
  return path.join(root, "docs", `${id}.md`);
}

function page(id) {
  return fs.readFileSync(pageFile(id), "utf8");
}

function frontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, "missing YAML frontmatter");
  return match[1];
}

function proofKeys(content) {
  const yaml = frontmatter(content);
  const start = yaml.indexOf("proofs:\n");
  assert.notEqual(start, -1, "missing proofs mapping");
  const block = yaml.slice(start + "proofs:\n".length);
  return new Map([...block.matchAll(/^  ([a-z0-9][a-z0-9-]*):\n((?:    - .+(?:\n|$))+)/gm)].map((match) => [
    match[1],
    [...match[2].matchAll(/^    - (.+)$/gm)].map((item) => item[1]),
  ]));
}

function headingSlug(heading) {
  return heading
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

test("Protocols inventory has a released page for each protocol path", () => {
  const orders = [];
  for (const [id, title, proofIds] of pages) {
    assert.equal(fs.existsSync(pageFile(id)), true, `missing ${id}.md`);
    const content = page(id);
    assert.match(content, new RegExp(`^id: ${id.replaceAll("/", "\\/")}$`, "m"));
    assert.match(content, new RegExp(`^title: ${title.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, "m"));
    assert.match(content, /^audience: developer$/m);
    assert.match(content, /^section: guides$/m);
    assert.match(content, /^publication: released$/m);
    const order = Number(content.match(/^order: (\d+)$/m)?.[1]);
    assert.ok(Number.isInteger(order), `${id} has no integer order`);
    orders.push(order);
    for (const proofId of proofIds) assert.match(content, new RegExp(`    - ${proofId}$`, "m"));
    assert.doesNotMatch(content, /scaffold|templated|planned developer guide|GOWORK=off|—/i, `${id} contains forbidden filler`);
  }
  assert.deepEqual(orders, [...orders].sort((a, b) => a - b), "protocol pages are not in sequential order");
  assert.equal(new Set(orders).size, orders.length, "protocol pages reuse an order");
});

test("Every H2-H6 heading has release evidence in frontmatter", () => {
  for (const [id] of pages) {
    const content = page(id);
    const keys = proofKeys(content);
    for (const match of content.matchAll(/^(#{2,6})\s+(.+)$/gm)) {
      const slug = headingSlug(match[2]);
      assert.ok(keys.has(slug), `${id} heading ${match[2]} lacks proofs.${slug}`);
      assert.ok(keys.get(slug).some((proof) => [acpProof, mcpProof].includes(proof)), `${id} heading ${match[2]} has no release proof`);
    }
  }
});

test("Overview makes ACP Serve, ACP Client, MCP Serve, and MCP Client distinct paths", () => {
  const content = page("guides/protocols/index");
  for (const pathName of [
    "/docs/guides/protocols/acp/serve/",
    "/docs/guides/protocols/acp/client/",
    "/docs/guides/protocols/mcp/serve/",
    "/docs/guides/protocols/mcp/client/",
  ]) assert.match(content, new RegExp(pathName.replaceAll("/", "\\/")), `overview omits ${pathName}`);
  for (const phrase of ["ACP Serve", "ACP Client", "MCP Serve", "MCP Client", "Harness", "Tools", "Inference"]) {
    assert.match(content, new RegExp(phrase, "i"), `overview omits ${phrase}`);
  }
  assert.match(content, /```mermaid[\s\S]*theme["']?\s*:\s*["']dark["']/i);
  assert.match(content, /\/docs\/guides\/protocols\/acp\//);
  assert.match(content, /\/docs\/guides\/protocols\/mcp\//);
});

test("ACP and MCP each have a real overview page", () => {
  const acp = page("guides/protocols/acp/index");
  const mcp = page("guides/protocols/mcp/index");
  for (const [content, label, children] of [
    [acp, "ACP", ["serve", "client", "host-agent", "sessions", "stdio", "auth-and-config", "gateway-launch"]],
    [mcp, "MCP", ["serve", "client", "transports", "auth", "harness-adoption", "sampling-and-reconfiguration", "acp-passthrough"]],
  ]) {
    assert.match(content, new RegExp(`^# ${label}$`, "m"));
    for (const child of children) assert.match(content, new RegExp(`/docs/guides/protocols/${label.toLowerCase()}/${child}/`));
    assert.match(content, /\/docs\/guides\/(?:harness|tools|inference)\//);
  }
});

test("ACP pages describe both facades, the process boundary, and lifecycle", () => {
  const serve = page("guides/protocols/acp/serve");
  const client = page("guides/protocols/acp/client");
  const host = page("guides/protocols/acp/host-agent");
  const stdio = page("guides/protocols/acp/stdio");
  const sessions = page("guides/protocols/acp/sessions");
  for (const phrase of ["Agent", "AgentConn", "ClientConn", "Initialize", "Authenticate", "NewSession", "session/update", "go:github.com/looprig/acp"]) {
    assert.match(serve, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `ACP Serve omits ${phrase}`);
  }
  for (const phrase of ["client.Dial", "stdio.Command", "Session", "Prompt", "Cancel", "Updates", "permission", "filesystem", "terminal"]) {
    assert.match(client, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `ACP Client omits ${phrase}`);
  }
  for (const phrase of ["host", "agent", "facade", "SessionHost", "NewSetup", "Capabilities", "MCPServers"]) {
    assert.match(host, new RegExp(phrase, "i"), `ACP host page omits ${phrase}`);
  }
  for (const phrase of ["NDJSON", "FrameReader", "Writer", "NewConn", "newline", "MaxMessageBytes", "Serve", "Spawn"]) {
    assert.match(stdio, new RegExp(phrase, "i"), `ACP stdio page omits ${phrase}`);
  }
  for (const phrase of ["session/new", "session/load", "session/resume", "session/close", "session/delete", "session/prompt", "session/cancel", "TurnStarted", "TurnDone"]) {
    assert.match(sessions, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `ACP sessions page omits ${phrase}`);
  }
  for (const id of ["guides/protocols/acp/serve", "guides/protocols/acp/client", "guides/protocols/acp/host-agent", "guides/protocols/acp/stdio", "guides/protocols/acp/sessions"]) {
    assert.match(page(id), /```go[\s\S]*```/);
  }
});

test("MCP pages cover server authoring, client consumption, transports, and adoption", () => {
  const serve = page("guides/protocols/mcp/serve");
  const client = page("guides/protocols/mcp/client");
  const transports = page("guides/protocols/mcp/transports");
  const auth = page("guides/protocols/mcp/auth");
  const adoption = page("guides/protocols/mcp/harness-adoption");
  for (const phrase of ["server.New", "server.Config", "RegisterTool", "Tool", "Handler", "Serve", "tools/call", "InputSchema", "OutputSchema"]) {
    assert.match(serve, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `MCP Serve omits ${phrase}`);
  }
  for (const phrase of ["client.Connect", "Definition", "Handlers", "CallTool", "Catalog", "ToolFilter", "ReadResource", "GetPrompt", "Close"]) {
    assert.match(client, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `MCP Client omits ${phrase}`);
  }
  for (const phrase of ["stdio", "Streamable HTTP", "SSE", "legacy", "Last-Event-ID", "Mcp-Session-Id", "TLS", "origin"]) {
    assert.match(transports, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `MCP transports omits ${phrase}`);
  }
  for (const phrase of ["HeaderProvider", "OAuthProvider", "TokenStore", "PKCE", "discovery", "Authorization", "redact", "per request"]) {
    assert.match(auth, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `MCP auth omits ${phrase}`);
  }
  for (const phrase of ["Catalog", "generation", "Candidate", "Adopt", "Harness", "Binding", "Reconfigure", "mcp__", "permission"]) {
    assert.match(adoption, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `MCP adoption omits ${phrase}`);
  }
  for (const id of ["guides/protocols/mcp/serve", "guides/protocols/mcp/client", "guides/protocols/mcp/transports", "guides/protocols/mcp/auth", "guides/protocols/mcp/harness-adoption"]) {
    assert.match(page(id), /```go[\s\S]*```/);
  }
});

test("Protocol pages interlink to canonical Harness, Tools, and Inference guides", () => {
  const destinations = [
    "/docs/guides/harness/",
    "/docs/guides/harness/step/model-request/",
    "/docs/guides/harness/step/tool-calls-and-results/",
    "/docs/guides/tools/",
    "/docs/guides/tools/core-concepts/",
    "/docs/guides/inference/",
    "/docs/guides/inference/requests/model-selection/",
    "/docs/guides/inference/requests/tools/",
  ];
  for (const [id] of pages) {
    const content = page(id);
    assert.ok(destinations.some((destination) => content.includes(destination)), `${id} lacks a canonical runtime interlink`);
  }
});
