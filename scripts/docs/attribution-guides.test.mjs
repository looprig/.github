import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const workspace = path.resolve(root, "../../..");
const page = "guides/harness/commands/message-presenter.md";

test("message presenter guide is published with source-backed safety rules", () => {
  const navigation = JSON.parse(readFileSync(path.join(root, "docs/_data/navigation.json"), "utf8"));
  assert.equal(navigation.pages.filter(({ path: entry }) => entry === page).length, 1);

  const markdown = readFileSync(path.join(root, "docs", page), "utf8");
  assert.match(markdown, /^id: guides\/harness\/commands\/message-presenter$/m);
  assert.match(markdown, /^## Household example$/m);
  assert.match(markdown, /nil principal/i);
  assert.match(markdown, /in\.Principal\.Tenant/);
  assert.match(markdown, /deterministic/i);
  assert.match(markdown, /once/i);
  assert.match(markdown, /refused/i);

  for (const source of [
    "harness/pkg/present/present.go",
    "harness/pkg/rig/presenter.go",
    "harness/internal/sessionruntime/present_refusal_test.go",
  ]) {
    assert.equal(existsSync(path.join(workspace, source)), true, `${source} is missing`);
    assert.match(markdown, new RegExp(`https://github.com/looprig/harness/blob/v0\\.41\\.0/${source.slice("harness/".length).replaceAll("/", "\\/")}`));
  }
});

test("owning guides describe released unbounded execution and browser attribution", () => {
  const read = (relative) => readFileSync(path.join(root, "docs", relative), "utf8");
  assert.match(read("guides/harness/loop/tools-and-tool-limits.md"), /loop\.Unlimited/);
  assert.match(read("guides/harness/hustles/define-a-hustle.md"), /WithTimeout\(0\)/);
  assert.match(read("guides/inference/client/invoke.md"), /WithoutExecutionTimeout/);
  const wui = read("guides/web-ui/embedding/wui.md");
  for (const claim of [/v0\.4\.0/, /43 schemas/, /presenter frame/, /principal/]) {
    assert.match(wui, claim);
  }
});

test("integration evidence names the released attribution and unbounded lanes", () => {
  const evidence = JSON.parse(readFileSync(path.join(root, "docs/_data/evidence.json"), "utf8"));
  for (const [id, source] of [
    ["tests-principal-presenter", "principal_presenter_integration_test.go"],
    ["tests-old-host-capability", "old_host_probe_integration_test.go"],
    ["tests-unbounded-execution", "unbounded_execution_integration_test.go"],
    ["tests-oldhostlane-pins", "oldhostlane/go.mod"],
  ]) {
    const proof = evidence.proofs.find((candidate) => candidate.id === id);
    assert.ok(proof, `${id} is missing`);
    assert.equal(proof.repository, "tests");
    assert.equal(proof.path, source);
    assert.equal(proof.commit, "2496241522a83dbcaa2a1054657131da00a3e124");
    assert.equal(existsSync(path.join(workspace, "tests", source)), true);
  }
});

test("host-admitted command guide includes the adapter copy obligation", () => {
  const guide = readFileSync(path.join(root, "docs/guides/harness/commands/index.md"), "utf8");
  assert.match(guide, /Principal\s+\*sessionwire\.Principal/);
  assert.match(guide, /Metadata\s+sessionwire\.MessageMetadata/);
  assert.match(guide, /copy both `Principal` and `Metadata`/);
  assert.match(guide, /message-presenter/);
});

test("attribution and audit guide publishes the guarded cross-module flow", () => {
  const page = "guides/harness/commands/attribution-and-audit.md";
  const navigation = JSON.parse(readFileSync(path.join(root, "docs/_data/navigation.json"), "utf8"));
  assert.equal(navigation.pages.filter(({ path: entry }) => entry === page).length, 1);
  const markdown = readFileSync(path.join(root, "docs", page), "utf8");
  for (const claim of [
    /WithPrincipalStamping/, /hostlink\.attribution\.principal/,
    /AuditAuthorizer/, /\/v1\/sessions\/\{sid\}\/commands\/\{cid\}/,
    /sessionstore v0\.14\.0/, /harness\s+v0\.41\.0/i, /every Host.*Factory/s,
    /Metadata.*not identity/s,
  ]) assert.match(markdown, claim);
});
