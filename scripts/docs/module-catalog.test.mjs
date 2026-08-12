import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const modulesDir = path.join(root, "docs/modules");

test("every retained module page links its source repository", () => {
  const files = readdirSync(modulesDir).filter((name) => name.endsWith(".md")).sort();
  assert.ok(files.length >= 20, "expected the complete module catalog");
  for (const file of files) {
    const page = readFileSync(path.join(modulesDir, file), "utf8");
    assert.match(page, /^## Repository$/m, `${file} needs a visible repository section`);
    assert.match(page, /https:\/\/github\.com\/looprig\/[a-z0-9.-]+/i, `${file} needs a GitHub repository link`);
  }
});

test("Pluto is not presented as a reusable module", () => {
  assert.equal(readdirSync(modulesDir).includes("pluto.md"), false);
});
