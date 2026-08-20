import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const read = (name) => readFileSync(path.join(root, "docs/products", name), "utf8");

function assertSemanticParagraph(markdown, patterns, message) {
  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim());
  assert.ok(
    paragraphs.some((paragraph) => patterns.every((pattern) => pattern.test(paragraph))),
    message,
  );
}

test("Products contains only Overview, Carbon, and Pluto", () => {
  const navigation = JSON.parse(readFileSync(path.join(root, "docs/_data/navigation.json"), "utf8"));
  assert.deepEqual(
    navigation.pages.filter(({ path: page }) => page.startsWith("products/")).map(({ path: page }) => page),
    ["products/index.md", "products/carbon.md", "products/pluto.md"],
  );
});

test("Carbon is one practical coding-agent page with concise feature coverage", () => {
  const page = read("carbon.md");
  assert.match(page, /Carbon is a coding agent/i);
  assert.match(page, /```json[\s\S]*"models"[\s\S]*```/);
  for (const feature of ["Coding tools", "Permission gates and classifiers", "Subagents", "Claude Code and Codex through ACP", "MCP", "Compaction", "Sessions and restore", "Workspaces", "Model proxy", "TUI and browser clients"]) {
    assert.match(page, new RegExp(`^### ${feature}`, "m"), `Carbon omits ${feature}`);
  }
});

test("Carbon installation pins v0.23.0", () => {
  const page = read("carbon.md");
  assert.ok(
    /go install github\.com\/looprig\/carbon\/cmd\/carbon@v0\.23\.0/.test(page),
    "Carbon install must pin github.com/looprig/carbon/cmd/carbon@v0.23.0",
  );
});

test("Carbon documents ACP launcher resolution precedence", () => {
  const page = read("carbon.md");
  const environmentOverride = page.search(/(?:\bnon-?empty\b[\s\S]{0,100}(?:harness(?:-specific)? environment override|[A-Z][A-Z0-9_]*_ACP_EXECUTABLE)|(?:harness(?:-specific)? environment override|[A-Z][A-Z0-9_]*_ACP_EXECUTABLE)[\s\S]{0,100}\bnon-?empty\b)/i);
  const configuredLauncher = page.search(/(?:\bconfigured\b[\s\S]{0,100}\bacp_launchers\b|\bacp_launchers\b[\s\S]{0,100}\bconfigured\b)/i);
  const pathDiscovery = page.search(/\bPATH\b/);

  assert.notEqual(environmentOverride, -1, "Carbon must document a nonempty harness environment override");
  assert.notEqual(configuredLauncher, -1, "Carbon must document configured acp_launchers");
  assert.notEqual(pathDiscovery, -1, "Carbon must document PATH discovery");
  assert.ok(
    environmentOverride < configuredLauncher && configuredLauncher < pathDiscovery,
    "Carbon launcher precedence must be environment override, configured acp_launchers, then PATH",
  );
});

test("Carbon documents strict ACP executable verification", () => {
  const page = read("carbon.md");

  assertSemanticParagraph(page, [
    /\bclean(?:ed)?\b/i,
    /\babsolute\b/i,
    /\bregular\b/i,
    /\bexecutable\b/i,
    /\b(?:verif|require|admit)\w*\b/i,
  ], "Carbon must verify a clean absolute regular executable");
  assertSemanticParagraph(page, [
    /\bsymlinks?\b/i,
    /\b(?:reject|refus)\w*\b/i,
  ], "Carbon must document symlink rejection");
});

test("Carbon requires restart or reopen after launcher changes", () => {
  const page = read("carbon.md");

  assertSemanticParagraph(page, [
    /\b(?:restart|reopen)\w*\b/i,
    /\b(?:configuration|launcher)\b/i,
    /\bchang\w*\b/i,
  ], "Carbon must be restarted or reopened after launcher configuration changes");
});

test("Carbon launcher examples use a neutral absolute-path placeholder", () => {
  const page = read("carbon.md");

  assert.ok(/<absolute-path-to-launcher>/.test(page), "Carbon needs a neutral launcher path placeholder");
});

test("Carbon launcher guidance contains no personal machine details", () => {
  const page = read("carbon.md");
  const forbidden = [
    ["macOS home directory", /\/Users\//i],
    ["observed username", /\bipotter\b/i],
    ["UUID session ID", /\b[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}\b/i],
    ["named session ID", /\bsession[_-](?:id[_-])?[a-z0-9][a-z0-9_-]{7,}\b/i],
    ["concrete nvm version path", /\.nvm\/versions\/(?:node\/)?v?\d+(?:\.\d+){0,2}(?:\/|$)/i],
  ];

  for (const [label, pattern] of forbidden) {
    assert.doesNotMatch(page, pattern, `Carbon exposes a ${label}`);
  }
});

test("Pluto is one practical evaluation-product page", () => {
  const page = read("pluto.md");
  assert.match(page, /evaluation and qualification/i);
  assert.match(page, /go install github\.com\/looprig\/pluto\/cmd\/pluto@v0\.1\.2/);
  for (const feature of ["Capability packs", "Evaluation runs", "Qualification profiles", "Pricing and comparison", "Reports", "CI qualification"]) {
    assert.match(page, new RegExp(`^### ${feature}`, "m"), `Pluto omits ${feature}`);
  }
});
