import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const modulesRoot = path.join(root, "docs/modules");
const inventory = JSON.parse(readFileSync(path.join(root, "docs/_data/modules.json"), "utf8"));
const pages = readdirSync(modulesRoot).filter((name) => name.endsWith(".md")).sort();

const repositoryBySlug = new Map(pages.map((name) => {
  const slug = name.slice(0, -3);
  return [slug, slug === "flow-store" ? "flow/store" : slug];
}));
const slugByModule = new Map([...repositoryBySlug].map(([slug, repository]) => [
  inventory.modules.find((record) => record.repository === repository)?.module,
  slug,
]));

function recordFor(slug) {
  const repository = repositoryBySlug.get(slug);
  return inventory.modules.find((record) => record.repository === repository);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function directDependencies(record) {
  return [...new Set((record.edges ?? [])
    .filter((edge) => edge.kind === "direct-require" && slugByModule.has(edge.to))
    .map((edge) => slugByModule.get(edge.to)))].sort();
}

function directDependents(record) {
  return pages.map((name) => name.slice(0, -3))
    .filter((slug) => directDependencies(recordFor(slug)).includes(slugByModule.get(record.module)))
    .sort();
}

test("every Module page contains the compact repository and ecosystem sections", () => {
  assert.equal(pages.length, 22);
  for (const name of pages) {
    const slug = name.slice(0, -3);
    const page = readFileSync(path.join(modulesRoot, name), "utf8");
    const body = page.split("---\n").slice(2).join("---\n");
    const headings = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1]);

    assert.deepEqual(headings, ["Repository", "Description", "Where it fits", "Dependencies", "Dependents"], slug);
    assert.doesNotMatch(body, /^### /m, slug);
    assert.doesNotMatch(body, /```|\bgo get\b|runnable|example:/i, slug);
  }
});

test("every Where it fits section explains standalone use and linked Looprig integration", () => {
  for (const name of pages) {
    const slug = name.slice(0, -3);
    const page = readFileSync(path.join(modulesRoot, name), "utf8");
    const section = page.match(/^## Where it fits\n\n([\s\S]*?)(?=\n## Dependencies$)/m)?.[1] ?? "";
    assert.match(section, /useful on its own|within Looprig|Looprig's|foundation for/i, slug);
    assert.match(section, /\/docs\/modules\//, `${slug} must link an ecosystem neighbor`);
  }
});

test("Module page versions and graph links match the checked code inventory", () => {
  for (const name of pages) {
    const slug = name.slice(0, -3);
    const record = recordFor(slug);
    const page = readFileSync(path.join(modulesRoot, name), "utf8");
    assert.ok(record, `missing inventory record for ${slug}`);
    assert.match(page, new RegExp("\\| Repository \\| `" + escapeRegExp(record.module) + "` \\|"));
    assert.match(page, new RegExp("\\| Version \\| `" + escapeRegExp(record.publication.tag ?? "Not released") + "` \\|"));

    for (const dependency of directDependencies(record)) {
      assert.match(page, new RegExp(`\\[[^\\]]+\\]\\(\\/docs\\/modules\\/${dependency}\\/?\\)`), `${slug} must link dependency ${dependency}`);
    }
    for (const dependent of directDependents(record)) {
      assert.match(page, new RegExp(`\\[[^\\]]+\\]\\(\\/docs\\/modules\\/${dependent}\\/?\\)`), `${slug} must link dependent ${dependent}`);
    }
  }
});
