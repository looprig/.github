import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const read = (relative) => readFileSync(path.join(root, "docs", relative), "utf8");
const navigation = () => JSON.parse(readFileSync(path.join(root, "docs/_data/navigation.json"), "utf8"));

const overview = [
  ["overview/architecture.md", "Architecture", 2],
  ["overview/which-modules.md", "Which modules do I need?", 3],
  ["overview/comparison.md", "How Looprig compares", 4],
  ["overview/glossary.md", "Glossary", 5],
];

function slug(heading) {
  return heading.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

test("the Overview section publishes the adoption pages after the documentation home", () => {
  const pages = navigation().pages;
  const paths = pages.map(({ path: pagePath }) => pagePath);
  assert.deepEqual(paths.slice(0, 5), ["index.md", ...overview.map(([file]) => file)]);
  for (const [file, title, order] of overview) {
    const page = read(file);
    assert.match(page, new RegExp(`^id: ${file.slice(0, -3)}$`, "m"));
    assert.match(page, new RegExp(`^title: ${title.replace(/[?]/g, "\\?")}$`, "m"));
    assert.match(page, new RegExp(`^order: ${order}$`, "m"));
    assert.equal(pages.find(({ path: pagePath }) => pagePath === file).order, order);
  }
});

test("every h2 on the new pages has a proof mapping", () => {
  for (const file of [...overview.map(([name]) => name), "start/quickstart.md"]) {
    const page = read(file);
    const frontmatter = page.split(/^---$/m)[1];
    const body = page.replace(/```[\s\S]*?```/g, "");
    for (const [, heading] of body.matchAll(/^## (.+)$/gm)) {
      assert.match(frontmatter, new RegExp(`^  ${slug(heading)}: \\[`, "m"), `${file} lacks a proof for "${heading}"`);
    }
  }
});

test("the retired GLOSSARY.md and consumers quickstart are not left behind as legacy pages", () => {
  const legacy = (navigation().legacyPages ?? []).map(({ path: pagePath }) => pagePath);
  assert.equal(legacy.includes("GLOSSARY.md"), false);
  assert.equal(legacy.includes("consumers/quickstart.md"), false);
});

test("the quickstart's event loop cannot wait forever", () => {
  const page = read("start/quickstart.md");
  const code = page.match(/```go\n([\s\S]*?)```/)[1];
  // A subscription is not closed when a turn ends or a session shuts down, so
  // ranging over it without a cancellation arm can block forever.
  assert.doesNotMatch(code, /for [^\n]*range [^\n]*\.Events\(\)/);
  assert.match(code, /case <-ctx\.Done\(\):/);
  assert.match(code, /case delivery, ok := <-events:/);
  assert.match(code, /if !ok \{/);
  for (const terminal of ["event.TurnDone", "event.TurnFailed", "event.TurnInterrupted"]) {
    assert.match(code, new RegExp(`case ${terminal.replace(".", "\\.")}:`), `quickstart must handle ${terminal}`);
  }
  // A credential-free path exists and the durable path does not use raw fsstore.
  assert.match(page, /LOOPRIG_SCRIPTED=1 go run \./);
  assert.match(page, /natsstore\.Options\{EmbeddedDir: dir\}/);
  assert.match(page, /missing BlobReaderLifecycle/);
});

test("the glossary defines the serving vocabulary and disambiguates overloaded names", () => {
  const page = read("overview/glossary.md");
  for (const term of [
    "Factory", "Host", "Department", "HostLink", "ClientLink", "Residency", "Tenant",
    "Controller", "SessionStore", "Rig", "Loop", "Hustle", "Gate", "Capture",
  ]) {
    assert.match(page, new RegExp(`^\\*\\*${term}\\.\\*\\*`, "m"), `glossary lacks ${term}`);
  }
  assert.match(page, /`github\.com\/looprig\/sessionstore`/);
  assert.match(page, /`github\.com\/looprig\/harness\/pkg\/sessionstore`/);
  assert.match(page, /Kubernetes workload controller/);
  assert.doesNotMatch(page, /\*\*Planned\.\*\*|all four `storage`/);
});

test("the architecture page draws the hosted system in dark-theme Mermaid", () => {
  const page = read("overview/architecture.md");
  const diagrams = [...page.matchAll(/```mermaid\n([\s\S]*?)```/g)].map((match) => match[1]);
  assert.ok(diagrams.length >= 2);
  for (const body of diagrams) assert.match(body, /^%%\{init:\s*\{"theme"\s*:\s*"dark"\}\}%%$/m);
  for (const part of ["Browser", "Factory", "SessionStore", "Host", "Harness", "Inference", "Tools", "Sandbox", "Department", "HostLink", "ClientLink"]) {
    assert.match(diagrams[0], new RegExp(part), `architecture diagram omits ${part}`);
  }
  assert.match(page, /^## How a message flows$/m);
});

test("the module decision guide names exact released versions", () => {
  const page = read("overview/which-modules.md");
  for (const pin of [
    "core@v0.13.1", "inference@v0.14.1", "llm@v0.15.1", "harness@v0.42.1", "storage@v0.8.0",
    "tools@v0.15.0", "sandbox@v0.9.3", "natsstore@v0.5.4", "factory@v0.15.0", "host@v0.15.1",
    "sessionstore@v0.14.0", "@looprig/client@0.3.0", "@looprig/react@0.3.0", "controller@v0.2.1",
  ]) assert.match(page, new RegExp(pin.replace(/[.@/]/g, "\\$&")), `which-modules omits ${pin}`);
  assert.match(page, /ErrLegacyLayout/);
  assert.match(page, /deprecated and frozen/);
});

test("the comparison cites official sources and states what Looprig is not for", () => {
  const page = read("overview/comparison.md");
  for (const name of ["LangGraph", "OpenAI Agents SDK", "Claude Agent SDK", "Mastra", "Pydantic AI", "Eino", "Google ADK"]) {
    assert.match(page, new RegExp(`### Compared with (the )?${name}`), `comparison omits ${name}`);
  }
  assert.match(page, /^## What Looprig is not for$/m);
  assert.match(page, /^## Sources$/m);
  assert.match(page, /2026-09-29/);
});
