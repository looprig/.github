import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const read = (name) => readFileSync(path.join(root, "docs/products", name), "utf8");

test("Examples is not published and Products contains only Overview, Carbon, and Pluto", () => {
  assert.equal(existsSync(path.join(root, "docs/examples")), false);
  const navigation = JSON.parse(readFileSync(path.join(root, "docs/_data/navigation.json"), "utf8"));
  assert.deepEqual(
    navigation.pages.filter(({ path: page }) => page.startsWith("products/")).map(({ path: page }) => page),
    ["products/index.md", "products/carbon.md", "products/pluto.md"],
  );
  assert.equal(navigation.pages.some(({ path: page }) => page.startsWith("examples/")), false);
});

test("Carbon is one practical coding-agent page with concise feature coverage", () => {
  const page = read("carbon.md");
  assert.match(page, /Carbon is a coding agent/i);
  assert.match(page, /go install github\.com\/looprig\/carbon\/cmd\/carbon@v0\.19\.0/);
  assert.match(page, /```json[\s\S]*"models"[\s\S]*```/);
  for (const feature of ["Coding tools", "Permission gates and classifiers", "Subagents", "Claude Code and Codex through ACP", "MCP", "Compaction", "Sessions and restore", "Workspaces", "Model proxy", "TUI and browser clients"]) {
    assert.match(page, new RegExp(`^### ${feature}`, "m"), `Carbon omits ${feature}`);
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
