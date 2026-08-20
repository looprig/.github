import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const inventory = JSON.parse(fs.readFileSync(path.join(root, "docs/_data/modules.json"), "utf8"));

// Released tags per top-level repository. Nested modules keep their own tag and
// are addressed by module path, so they are not part of this map.
const releasedTags = new Map(inventory.modules
  .filter((record) => record.publication?.status === "released"
    && !record.module.replace("github.com/looprig/", "").includes("/"))
  .map((record) => [record.module.replace("github.com/looprig/", ""), record.publication.tag]));

function markdownFiles(...globs) {
  const files = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".md")) files.push(full);
    }
  };
  for (const relative of globs) walk(path.join(root, "docs", relative));
  return files.sort();
}

function page(relative) {
  return fs.readFileSync(path.join(root, "docs", relative), "utf8");
}

test("Build 01 names the released inference model contract", () => {
  const content = page("build/01-model-access.md");

  assert.match(content, /`model\.Model`/);
  assert.match(content, /github\.com\/looprig\/inference\/blob\/v0\.9\.2\/model\/model\.go/);
  assert.doesNotMatch(content, /`inference\.Model`/);
});

test("Build 08 describes counters as preflight ContextCounters", () => {
  const content = page("build/08-providers-and-counters.md");

  assert.match(content, /contextcount\.ContextCounter/);
  assert.match(content, /CountContext/);
  assert.match(content, /input-context tokens as a preflight operation/i);
  assert.match(content, /fail(?:s|ure)? closed/i);
  assert.match(content, /github\.com\/looprig\/llm\/blob\/v0\.13\.3\/auto\/counter\.go/);
  assert.doesNotMatch(content, /counter (?:wraps|is a wrapper)|usage-accounting wrapper/i);
});

test("guide, product, and module pages cite the current released tag of every module they link", () => {
  // Scope note: docs/build is deliberately excluded. Build pages cite the
  // versions their example stage pins in docs/_data/examples.json, which are
  // intentionally older than the current release, so sweeping them here would
  // report a legitimate pin as staleness. docs/build freshness is owned by the
  // example manifest, not by this test.
  const pattern = /https:\/\/github\.com\/looprig\/([a-z]+)\/(?:blob|tree)\/(v[0-9.]+)\//g;
  const stale = [];
  const unknown = [];

  for (const file of markdownFiles("guides", "products", "modules")) {
    for (const [, repository, tag] of fs.readFileSync(file, "utf8").matchAll(pattern)) {
      const released = releasedTags.get(repository);
      if (!released) {
        unknown.push(`${path.relative(root, file)}: ${repository} is not a released module in the inventory`);
        continue;
      }
      if (released === tag) continue;
      stale.push(`${path.relative(root, file)}: ${repository} ${tag} (released ${released})`);
    }
  }

  assert.deepEqual([...new Set(unknown)], [], "pages must only pin repositories the inventory records as released");
  assert.deepEqual([...new Set(stale)], [], "pages must cite the current released tag");
});
