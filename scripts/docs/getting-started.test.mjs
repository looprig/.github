import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const read = (name) => readFileSync(path.join(root, "docs/start", name), "utf8");

const inventory = [
  ["choose-a-path.md", "Build a coding assistant"],
  ["installation.md", "Create the Go project"],
  ["model-call.md", "Connect a model with Inference"],
  ["first-run.md", "Run the agent with Harness"],
  ["tools-and-gates.md", "Add read-only tools and gates"],
  ["sessions.md", "Persist and restore sessions"],
  ["workspaces.md", "Add a session workspace"],
  ["sandbox-and-interfaces.md", "Sandbox process tools"],
  ["run-cli.md", "Run the coding assistant CLI"],
  ["next-steps.md", "Choose an interface and extend the agent"],
];

const exampleSources = {
  "installation.md": "examples/go/progressive/stage01_inference/main.go",
  "model-call.md": "examples/go/progressive/stage01_inference/main.go",
  "first-run.md": "examples/go/guides/harness-quickstart/main.go",
  "tools-and-gates.md": "examples/go/progressive/stage04_prepared_tool/main.go",
  "sessions.md": "examples/go/progressive/stage09_restore/main.go",
  "workspaces.md": "examples/go/progressive/stage10_workspace/main.go",
  "sandbox-and-interfaces.md": "examples/go/progressive/stage11_sandbox_process/main.go",
  "run-cli.md": "examples/go/guides/harness-quickstart/main.go",
  "next-steps.md": "examples/go/progressive/stage23_eval/main.go",
};

test("Getting Started is one ordered coding-assistant tutorial", () => {
  const navigation = JSON.parse(readFileSync(path.join(root, "docs/_data/navigation.json"), "utf8"));
  const paths = navigation.pages
    .filter(({ path: pagePath }) => pagePath.startsWith("start/"))
    .map(({ path: pagePath }) => pagePath.slice("start/".length));
  assert.deepEqual(paths, inventory.map(([file]) => file));

  for (const [index, [file, title]] of inventory.entries()) {
    const page = read(file);
    assert.match(page, new RegExp(`^title: ${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"));
    assert.match(page, new RegExp(`^order: ${index + 1}$`, "m"));
    assert.match(page, /coding assistant/i, `${file} must stay on the shared project`);
  }
});

test("the tutorial crosses every runtime boundary in the approved order", () => {
  const corpus = inventory.map(([file]) => read(file)).join("\n");
  for (const term of [
    "go mod init", "OpenAI", "Anthropic", "local model", "content.UserMessage",
    "inference.Request", "Client.Invoke", "loop.Define", "rig.Define", "NewSession",
    "ToolUseBlock", "PrepareCall", "gate", "fsstore", "RestoreSession", "workspace",
    "sandbox.Init", "CompileReport", "CLI", "TUI", "Web UI", "ACP", "MCP",
    "Workflows", "evaluation",
  ]) assert.match(corpus, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `tutorial omits ${term}`);
});

test("every implementation page has commented code and a runnable checkpoint", () => {
  for (const [file, source] of Object.entries(exampleSources)) {
    const page = read(file);
    assert.match(page, /```(?:go|sh|text)[\s\S]+```/, `${file} needs an executable example`);
    if (page.includes("```go")) {
      assert.match(page, /```go[\s\S]*\/\/[\s\S]*```/, `${file} Go example needs explanatory comments`);
    }
    assert.match(page, /^## Runnable checkpoint$/m, `${file} must expose its proof as an example`);
    assert.match(page, new RegExp(`https://github.com/looprig/\\.github/blob/main/${source.replaceAll("/", "\\/")}`));
  }
});

test("Getting Started uses consumer commands and canonical deep-guide links", () => {
  const corpus = inventory.map(([file]) => read(file)).join("\n");
  assert.doesNotMatch(corpus, /GOWORK=off|source-workspace|proof IDs?|workflow job|release commit|replace directive|central manifest|@v\d/i);
  for (const destination of [
    "/docs/guides/inference/",
    "/docs/guides/harness/",
    "/docs/guides/tools/",
    "/docs/guides/sandboxing/",
    "/docs/guides/tui/",
    "/docs/guides/web-ui/",
    "/docs/modules/acp/",
    "/docs/modules/mcp/",
    "/docs/guides/workflows/",
    "/docs/guides/evals/",
  ]) assert.match(corpus, new RegExp(destination.replaceAll("/", "\\/")), `tutorial omits ${destination}`);
});

test("the Harness runtime sequence uses a Mermaid-safe Loop alias", () => {
  const page = read("first-run.md");
  assert.match(page, /participant L as Loop/);
  assert.doesNotMatch(page, /participant Loop\b/);
  assert.match(page, /Session->>L: start Turn/);
  assert.match(page, /L-->>Session: TurnDone/);
});
