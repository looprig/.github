import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const removedRoots = [
  "agents",
  "carbon",
  "concepts",
  "contributing",
  "integrations",
  "products",
  "guides/protocols",
];

test("internal and hidden sections are outside the published documentation tree", () => {
  for (const relative of removedRoots) {
    assert.equal(existsSync(path.join(root, "docs", relative)), false, `${relative} is still published`);
  }
});

test("navigation contains only retained public sections", () => {
  const navigation = JSON.parse(readFileSync(path.join(root, "docs/_data/navigation.json"), "utf8"));
  for (const { path: pagePath } of navigation.pages) {
    assert.equal(
      removedRoots.some((prefix) => pagePath === `${prefix}.md` || pagePath.startsWith(`${prefix}/`)),
      false,
      `${pagePath} belongs to a hidden section`,
    );
  }
});
