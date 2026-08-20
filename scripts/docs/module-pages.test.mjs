import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const modulesRoot = path.join(root, "docs/modules");
const inventory = JSON.parse(readFileSync(path.join(root, "docs/_data/modules.json"), "utf8"));
const evidence = JSON.parse(readFileSync(path.join(root, "docs/_data/evidence.json"), "utf8"));
const pages = readdirSync(modulesRoot).filter((name) => name.endsWith(".md")).sort();

// Records are keyed by module path, not by repository: a nested module such as
// flow/store shares its parent repository, so `repository` is not unique.
const moduleBySlug = new Map(pages.map((name) => {
  const slug = name.slice(0, -3);
  return [slug, `github.com/looprig/${slug === "flow-store" ? "flow/store" : slug}`];
}));
const slugByModule = new Map([...moduleBySlug].map(([slug, module]) => [module, slug]));

function recordFor(slug) {
  return inventory.modules.find((record) => record.module === moduleBySlug.get(slug));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function repositoryFields(slug) {
  const page = readFileSync(path.join(modulesRoot, `${slug}.md`), "utf8");
  const section = page.match(/^## Repository\n([\s\S]*?)(?=^## )/m)?.[1];
  assert.ok(section, `${slug} is missing its Repository section`);
  const fields = new Map();
  for (const [, field, value] of section.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/gm)) {
    const key = field.trim();
    // Skip the header row and its delimiter so a second table reports a real
    // duplicate field rather than a repeated "---".
    if (key === "Field" || /^:?-{3,}:?$/.test(key)) continue;
    assert.equal(fields.has(key), false, `${slug} repeats the Repository row "${key}"`);
    fields.set(key, value.trim());
  }
  return fields;
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

for (const [repository, slug, title, version] of [
  ["harness", "harness", "Harness", "v0.28.0"],
  ["inference", "inference", "Inference", "v0.12.0"],
  ["tui", "tui", "TUI", "v0.16.1"],
]) {
  test(`${title} generated inventory and module page use ${version}`, () => {
    const record = inventory.modules.find((candidate) => candidate.repository === repository);
    assert.ok(record, `missing ${repository} inventory record`);
    assert.equal(record.module, `github.com/looprig/${repository}`);
    assert.equal(record.disposition, "reusable");
    assert.equal(record.publication?.status, "released");
    assert.equal(record.publication?.tag, version, `${repository} inventory release is stale`);

    assert.ok(pages.includes(`${slug}.md`), `missing generated page for ${repository}`);
    const fields = repositoryFields(slug);
    assert.equal(fields.get("Repository"), `\`github.com/looprig/${repository}\``);
    assert.equal(fields.get("Version"), `\`${version}\``, `${repository} module page release is stale`);
  });
}

test("Flow Store is released from the Flow repository at its own nested tag", () => {
  const record = inventory.modules.find((candidate) => candidate.module === "github.com/looprig/flow/store");
  assert.ok(record, "missing flow/store inventory record");
  assert.equal(record.repository, "flow", "flow/store is published from the Flow repository");
  assert.equal(record.nested, true);
  assert.deepEqual(record.publication, { status: "released", tag: "store/v0.1.0" });

  const flow = inventory.modules.find((candidate) => candidate.module === "github.com/looprig/flow");
  assert.deepEqual(flow.publication, { status: "released", tag: "v0.4.0" });
  assert.notEqual(record.commit, flow.commit, "a nested module releases on its own commit");

  const fields = repositoryFields("flow-store");
  assert.equal(fields.get("Repository"), "`github.com/looprig/flow/store`");
  assert.equal(fields.get("Version"), "`store/v0.1.0`");
});

test("Carbon v0.23.0 stays product-only in generated inventory and release evidence", () => {
  const record = inventory.modules.find((candidate) => candidate.repository === "carbon");
  assert.ok(record, "missing Carbon inventory record");
  assert.equal(record.module, "github.com/looprig/carbon");
  assert.equal(record.disposition, "product-only");
  assert.equal(record.publication?.status, "released");
  assert.equal(record.publication?.tag, "v0.23.0", "Carbon inventory release is stale");
  assert.equal(pages.includes("carbon.md"), false, "Carbon must not have a reusable module page");

  const proof = evidence.proofs.find((candidate) => candidate.id === "release-github-com-looprig-carbon");
  assert.ok(proof, "missing Carbon release evidence");
  assert.equal(proof.type, "release-record");
  assert.equal(proof.repository, "carbon");
  assert.equal(proof.tag, "v0.23.0", "Carbon release evidence is stale");
  assert.equal(proof.commit, record.commit, "Carbon inventory and release evidence commits differ");
});
