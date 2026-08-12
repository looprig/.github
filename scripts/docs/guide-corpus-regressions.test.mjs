import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const clientRoot = path.resolve(root, "../..", "client");
const llmRoot = path.resolve(root, "../..", "llm");

const guideRoots = [
  "inference",
  "harness",
  "tools",
  "workflows",
  "sandboxing",
  "evals",
  "protocols",
  "tui",
  "web-ui",
];

function escapeRegex(value) {
  return value.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}

function markdownFiles(relativeRoot) {
  const directory = path.join(root, "docs/guides", relativeRoot);
  const files = [];
  const visit = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile() && entry.name.endsWith(".md")) files.push(absolute);
    }
  };
  visit(directory);
  return files;
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const canonicalReplacements = {
  "docs/guides/sandboxing/enforcement/filesystem.md": [
    ["/docs/guides/tools/permissions/", "/docs/guides/tools/safety/permissions/"],
  ],
  "docs/guides/protocols/acp/auth-and-config.md": [
    ["/docs/guides/tools/permissions/", "/docs/guides/tools/safety/permissions/"],
  ],
  "docs/guides/protocols/acp/client.md": [
    ["/docs/guides/tools/permissions/", "/docs/guides/tools/safety/permissions/"],
  ],
  "docs/guides/sandboxing/index.md": [
    ["/docs/guides/tools/safety-and-gates/", "/docs/guides/tools/safety/"],
  ],
  "docs/guides/sandboxing/integration/index.md": [
    ["/docs/guides/tools/safety-and-gates/", "/docs/guides/tools/safety/"],
  ],
  "docs/guides/sandboxing/profiles/restriction.md": [
    ["/docs/guides/tools/safety-and-gates/", "/docs/guides/tools/safety/"],
  ],
  "docs/guides/protocols/acp/serve.md": [
    ["/docs/guides/tools/safety-and-gates/", "/docs/guides/tools/safety/"],
  ],
  "docs/guides/protocols/mcp/acp-passthrough.md": [
    ["/docs/guides/tools/safety-and-gates/", "/docs/guides/tools/safety/"],
  ],
  "docs/guides/protocols/acp/gateway-launch.md": [
    ["/docs/guides/inference/gateways/", "/docs/reference/packages/inference/gateway/"],
  ],
  "docs/guides/protocols/acp/host-agent.md": [
    ["/docs/guides/tools/registration/", "/docs/guides/tools/core-concepts/registration/"],
  ],
  "docs/guides/protocols/mcp/client.md": [
    ["/docs/guides/tools/registration/", "/docs/guides/tools/core-concepts/registration/"],
  ],
  "docs/guides/protocols/mcp/harness-adoption.md": [
    ["/docs/guides/tools/registration/", "/docs/guides/tools/core-concepts/registration/"],
  ],
  "docs/guides/protocols/mcp/index.md": [
    ["/docs/guides/tools/registration/", "/docs/guides/tools/core-concepts/registration/"],
  ],
  "docs/guides/protocols/acp/index.md": [
    ["/docs/guides/tools/concepts/", "/docs/guides/tools/core-concepts/"],
  ],
  "docs/guides/protocols/acp/stdio.md": [
    ["/docs/guides/tools/concepts/", "/docs/guides/tools/core-concepts/"],
  ],
  "docs/guides/protocols/mcp/serve.md": [
    ["/docs/guides/tools/concepts/", "/docs/guides/tools/core-concepts/"],
  ],
  "docs/guides/protocols/mcp/transports.md": [
    ["/docs/guides/tools/concepts/", "/docs/guides/tools/core-concepts/"],
  ],
};

test("selected guide cross-links use the canonical hierarchy", () => {
  for (const [relativePath, replacements] of Object.entries(canonicalReplacements)) {
    const markdown = read(relativePath);
    for (const [stale, canonical] of replacements) {
      assert.doesNotMatch(markdown, new RegExp(escapeRegex(stale)), `${relativePath} retains ${stale}`);
      assert.match(markdown, new RegExp(escapeRegex(canonical)), `${relativePath} must use ${canonical}`);
    }
  }
});

test("the ACP gateway link targets the existing inference gateway reference", () => {
  assert.equal(fs.existsSync(path.join(root, "docs/reference/packages/inference/gateway.md")), true);
  const markdown = read("docs/guides/protocols/acp/gateway-launch.md");
  assert.doesNotMatch(markdown, /\/docs\/guides\/inference\/gateways\//);
  assert.match(markdown, /\/docs\/reference\/packages\/inference\/gateway\//);
});

test("every Harness Mermaid block opts into the dark theme", () => {
  const blocks = [];
  for (const file of markdownFiles("harness")) {
    const markdown = fs.readFileSync(file, "utf8");
    for (const match of markdown.matchAll(/```mermaid\n([\s\S]*?)```/g)) {
      blocks.push({ file, body: match[1] });
    }
  }
  assert.ok(blocks.length > 0, "Harness guide corpus must contain diagrams");
  for (const { file, body } of blocks) {
    assert.match(body, /^%%\{init:\s*\{"theme"\s*:\s*"dark"\}\}%%$/m, file);
  }
});

test("the framework-neutral Web UI examples use the public live-source API", () => {
  const overview = read("docs/guides/web-ui/index.md");
  const sessionClient = read("docs/guides/web-ui/client-sdk/session-client.md");
  const liveSource = fs.readFileSync(path.join(clientRoot, "sdk/core/src/live.ts"), "utf8");

  assert.doesNotMatch(overview, /createLiveSource/);
  assert.match(overview, /createFetchLiveFrameSource/);
  assert.doesNotMatch(sessionClient, /createFetchLiveFrameSource\([^\n]*\{\s*signal\s*\}/);
  assert.doesNotMatch(sessionClient, /createLiveSource/);
  assert.match(liveSource, /export function createFetchLiveFrameSource\(/);
  assert.match(liveSource, /export interface FetchLiveFrameSourceOptions[\s\S]*baseUrl\?: string;[\s\S]*fetch\?: FetchLike;/);
});

test("the Inference landing page is a source-backed developer overview", () => {
  const overview = read("docs/guides/inference.md");
  assert.doesNotMatch(overview, /\/docs\/build\//);
  assert.match(overview, /```go[\s\S]+?```/);
  assert.match(overview, /```mermaid[\s\S]*theme["']?\s*:\s*["']dark["']/i);
  for (const destination of [
    "/docs/guides/inference/content-blocks/",
    "/docs/guides/inference/models/",
    "/docs/guides/inference/requests/",
    "/docs/guides/inference/responses/",
    "/docs/guides/inference/streaming/",
    "/docs/guides/inference/providers/",
  ]) assert.match(overview, new RegExp(escapeRegex(destination)), destination);
  for (const phrase of ["inference.Client", "inference.Request", "ValidateRequestFeatures", "Stream"]) {
    assert.match(overview, new RegExp(escapeRegex(phrase)), phrase);
  }
  assert.match(overview, /^## Source$/m);
  assert.match(overview, /^## Proof$/m);
});

test("the Ollama guide documents its no-auth constructor without a fake secret", () => {
  const markdown = read("docs/guides/inference/providers/ollama.md");
  const source = fs.readFileSync(path.join(llmRoot, "providers/ollama/client.go"), "utf8");
  assert.match(source, /Authentication:\s*auth\.AuthNone/);
  assert.match(markdown, /Authentication\s*\|\s*none/i);
  assert.doesNotMatch(markdown, /OLLAMA_API_KEY/);
  assert.match(markdown, /ollama\.New\(selected,\s*""\)/);
  assert.match(markdown, /no credential|no authentication|empty key/i);
});

test("all selected guide trees are free of Policy53 and Kosa content", () => {
  const files = guideRoots.flatMap(markdownFiles);
  for (const file of files) {
    assert.doesNotMatch(fs.readFileSync(file, "utf8"), /\b(?:Policy53|Kosa)\b/i, file);
  }
});
