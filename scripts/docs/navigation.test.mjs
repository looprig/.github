import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const navigationFile = path.join(root, "docs/_data/navigation.json");
const providersDirectory = path.join(root, "docs/guides/inference/providers");

const tools = [
  "index",
  "core-concepts/index",
  "core-concepts/registration",
  "safety/index",
  "safety/permissions",
  "processes/index",
  "processes/lifecycle",
  "processes/tools",
  "built-in-tools/index",
  "built-in-tools/askuser",
  "built-in-tools/bash",
  "built-in-tools/editfile",
  "built-in-tools/fetch",
  "built-in-tools/glob",
  "built-in-tools/grep",
  "built-in-tools/readfile",
  "built-in-tools/skill",
  "built-in-tools/task",
  "built-in-tools/websearch",
  "built-in-tools/writefile",
].map((page) => `guides/tools/${page}.md`);

const workflows = [
  "index",
  "workflow-runtime/index",
  "workflow-runtime/definitions",
  "workflow-runtime/runtime",
  "workflow-runtime/state-and-history",
  "workflow-runtime/interruption-and-resume",
  "workflow-runtime/lifecycle",
  "flow/index",
  "workflow-tools/index",
  "workflow-tools/harness-integration",
].map((page) => `guides/workflows/${page}.md`);

const sandboxing = [
  "index",
  "profiles/index",
  "profiles/restriction",
  "enforcement/index",
  "enforcement/platforms",
  "enforcement/reports",
  "enforcement/filesystem",
  "enforcement/network",
  "runtime/index",
  "runtime/executors",
  "runtime/argv-and-confinement",
  "runtime/processes",
  "runtime/errors",
  "integration/index",
].map((page) => `guides/sandboxing/${page}.md`);

const evals = [
  "index",
  "cases-and-runs/index",
  "cases-and-runs/cases-and-suites",
  "cases-and-runs/runs-and-results",
  "evaluators/index",
  "evaluators/exact",
  "evaluators/judge",
  "reporting/index",
  "integration/index",
  "integration/composition-and-testing",
  "integration/pluto",
].map((page) => `guides/evals/${page}.md`);

const protocols = [
  "index",
  "acp/index",
  "acp/serve",
  "acp/client",
  "acp/host-agent",
  "acp/stdio",
  "acp/sessions",
  "acp/auth-and-config",
  "acp/gateway-launch",
  "mcp/index",
  "mcp/serve",
  "mcp/client",
  "mcp/transports",
  "mcp/auth",
  "mcp/harness-adoption",
  "mcp/sampling-and-reconfiguration",
  "mcp/acp-passthrough",
].map((page) => `guides/protocols/${page}.md`);

const tui = [
  "index",
  "getting-started/index",
  "getting-started/create",
  "getting-started/run",
  "runtime/index",
  "runtime/events",
  "runtime/commands",
  "runtime/restore",
  "runtime/lifecycle",
  "runtime/session-adapter",
  "components/index",
  "components/input",
  "components/completion",
  "components/sessions",
  "styling/index",
  "styling/styles",
  "styling/markdown",
  "integration/index",
  "integration/harness",
  "integration/workspaces",
  "integration/session-stores",
].map((page) => `guides/tui/${page}.md`);

const webUi = [
  "index",
  "client-sdk/index",
  "client-sdk/session-client",
  "client-sdk/events",
  "client-sdk/commands",
  "client-sdk/fold",
  "client-sdk/validation",
  "client-sdk/ownership",
  "framework-adapters/index",
  "framework-adapters/vanilla",
  "framework-adapters/svelte",
  "embedding/index",
  "embedding/static-bundle",
  "embedding/go-webui",
  "embedding/app-integration",
  "sessions/index",
  "sessions/binding",
  "sessions/reconnect",
  "sessions/restore",
].map((page) => `guides/web-ui/${page}.md`);

function navigation() {
  return JSON.parse(fs.readFileSync(navigationFile, "utf8"));
}

function pathsUnder(prefix) {
  return navigation().pages
    .map(({ path: pagePath }) => pagePath)
    .filter((pagePath) => pagePath.startsWith(prefix));
}

test("navigation includes the provider page inventory with index first", () => {
  const providerPages = fs.readdirSync(providersDirectory)
    .filter((file) => file.endsWith(".md") && file !== "index.md")
    .sort()
    .map((file) => `guides/inference/providers/${file}`);
  const expected = ["guides/inference/providers/index.md", ...providerPages];

  assert.deepEqual(pathsUnder("guides/inference/providers/"), expected);
  for (const pagePath of expected) {
    assert.equal(fs.existsSync(path.join(root, "docs", pagePath)), true, `missing ${pagePath}`);
  }
});

test("navigation includes the tools hierarchy and removes the legacy page", () => {
  const manifest = navigation();

  assert.deepEqual(pathsUnder("guides/tools/"), tools);
  for (const pagePath of tools) {
    assert.equal(fs.existsSync(path.join(root, "docs", pagePath)), true, `missing ${pagePath}`);
  }
  assert.equal(manifest.pages.some(({ path: pagePath }) => pagePath === "guides/tools.md"), false);
});

test("navigation includes the workflows hierarchy and removes the legacy page", () => {
  const manifest = navigation();

  assert.deepEqual(pathsUnder("guides/workflows/"), workflows);
  for (const pagePath of workflows) {
    assert.equal(fs.existsSync(path.join(root, "docs", pagePath)), true, `missing ${pagePath}`);
  }
  assert.equal(manifest.pages.some(({ path: pagePath }) => pagePath === "guides/workflows.md"), false);
});

test("navigation includes the sandboxing hierarchy and removes the legacy page", () => {
  const manifest = navigation();

  assert.deepEqual(pathsUnder("guides/sandboxing/"), sandboxing);
  for (const pagePath of sandboxing) {
    assert.equal(fs.existsSync(path.join(root, "docs", pagePath)), true, `missing ${pagePath}`);
  }
  assert.equal(manifest.pages.some(({ path: pagePath }) => pagePath === "guides/sandboxing.md"), false);
});

test("navigation includes the evals hierarchy and removes the legacy page", () => {
  const manifest = navigation();

  assert.deepEqual(pathsUnder("guides/evals/"), evals);
  for (const pagePath of evals) {
    assert.equal(fs.existsSync(path.join(root, "docs", pagePath)), true, `missing ${pagePath}`);
  }
  assert.equal(manifest.pages.some(({ path: pagePath }) => pagePath === "guides/evals.md"), false);
});

test("navigation includes the protocols hierarchy and removes the legacy page", () => {
  const manifest = navigation();

  assert.deepEqual(pathsUnder("guides/protocols/"), protocols);
  for (const pagePath of protocols) {
    assert.equal(fs.existsSync(path.join(root, "docs", pagePath)), true, `missing ${pagePath}`);
  }
  assert.equal(manifest.pages.some(({ path: pagePath }) => pagePath === "guides/protocols.md"), false);
});

test("navigation includes the TUI hierarchy and removes the legacy page", () => {
  const manifest = navigation();

  assert.deepEqual(pathsUnder("guides/tui/"), tui);
  for (const pagePath of tui) {
    assert.equal(fs.existsSync(path.join(root, "docs", pagePath)), true, `missing ${pagePath}`);
  }
  assert.equal(manifest.pages.some(({ path: pagePath }) => pagePath === "guides/tui.md"), false);
});

test("navigation includes the Web UI hierarchy and removes the legacy page", () => {
  const manifest = navigation();

  assert.deepEqual(pathsUnder("guides/web-ui/"), webUi);
  for (const pagePath of webUi) {
    assert.equal(fs.existsSync(path.join(root, "docs", pagePath)), true, `missing ${pagePath}`);
  }
  assert.equal(manifest.pages.some(({ path: pagePath }) => pagePath === "guides/web-ui.md"), false);
});

test("navigation JSON has an existing, unique page inventory", () => {
  const manifest = navigation();
  const pagePaths = manifest.pages.map(({ path: pagePath }) => pagePath);

  assert.equal(manifest.schemaVersion, 1);
  assert.equal(new Set(pagePaths).size, pagePaths.length, "navigation contains duplicate paths");
  for (const pagePath of pagePaths) {
    assert.equal(fs.existsSync(path.join(root, "docs", pagePath)), true, `missing ${pagePath}`);
  }
});
