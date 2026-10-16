import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { embeddedExamples, repositoryRoot, startPages, syncPage } from "./start-examples.mjs";

const root = repositoryRoot;
const startExamples = path.join(root, "examples/go/start");
const read = (relative) => readFileSync(path.join(root, relative), "utf8");

// The runnable module behind each Getting Started page.
const pageModules = {
  "quickstart.md": "quickstart",
  "model-call.md": "model-call",
  "first-run.md": "first-run",
  "tools-and-gates.md": "tools-and-gates",
  "sessions.md": "sessions",
  "workspaces.md": "workspaces",
  "sandbox-and-interfaces.md": "sandbox",
  "run-cli.md": "run-cli",
};

function requirements(goMod) {
  const pins = new Map();
  for (const [, module, version] of goMod.matchAll(/^\s*(github\.com\/looprig\/[^\s]+)\s+(v\S+)/gm)) pins.set(module, version);
  return pins;
}

test("every embedded example is byte-for-byte its source file", () => {
  for (const file of startPages(root)) {
    const page = readFileSync(file, "utf8");
    for (const { source } of embeddedExamples(page)) {
      assert.ok(source.startsWith("examples/go/start/"), `${source} is outside examples/go/start`);
      assert.ok(existsSync(path.join(root, source)), `${path.basename(file)} embeds missing ${source}`);
    }
    assert.equal(syncPage(page, read), page, `${path.basename(file)} drifted; run node scripts/docs/start-examples.mjs --write`);
  }
});

test("every Go block on a Getting Started page is an embedded, compiled example", () => {
  for (const file of startPages(root)) {
    const page = readFileSync(file, "utf8");
    const goBlocks = [...page.matchAll(/```go\n/g)].length;
    assert.equal(embeddedExamples(page).filter(({ language }) => language === "go").length, goBlocks,
      `${path.basename(file)} has a Go block that is not embedded from examples/go/start`);
  }
});

test("each implementation page shows its own step's module and links it", () => {
  for (const [page, module] of Object.entries(pageModules)) {
    const text = read(`docs/start/${page}`);
    const sources = embeddedExamples(text).map(({ source }) => source);
    assert.ok(sources.length > 0, `${page} embeds no example`);
    for (const source of sources) assert.ok(source.startsWith(`examples/go/start/${module}/`), `${page} embeds ${source}`);
    assert.match(text, new RegExp(`https://github\\.com/looprig/\\.github/(tree|blob)/main/examples/go/start/${module}`));
    assert.ok(existsSync(path.join(startExamples, module, "go.mod")), `${module} has no go.mod`);
    assert.ok(existsSync(path.join(startExamples, module, "main_test.go")), `${module} has no test`);
  }
});

test("the versions pages tell readers to install are the versions the examples are tested on", () => {
  const modules = readdirSync(startExamples).filter((name) => existsSync(path.join(startExamples, name, "go.mod")));
  const pinned = modules.map((name) => requirements(read(`examples/go/start/${name}/go.mod`)));
  for (const file of startPages(root)) {
    const page = readFileSync(file, "utf8");
    for (const [, module, version] of page.matchAll(/(github\.com\/looprig\/[a-z0-9-]+)@(v\d+\.\d+\.\d+)/g)) {
      const using = pinned.filter((pins) => pins.has(module));
      assert.ok(using.length > 0, `${path.basename(file)} installs ${module}, which no example uses`);
      for (const pins of using) assert.equal(pins.get(module), version, `${path.basename(file)} installs ${module}@${version}`);
    }
  }
});

test("example modules are standalone: no replace directives and no workspace files", () => {
  for (const name of readdirSync(startExamples)) {
    const directory = path.join(startExamples, name);
    assert.equal(existsSync(path.join(directory, "go.work")), false, `${name} has a go.work`);
    assert.doesNotMatch(read(`examples/go/start/${name}/go.mod`), /^\s*replace\b/m, `${name} has a replace directive`);
    assert.match(read(`examples/go/start/${name}/go.mod`), /^go 1\.26\.9$/m);
  }
});

test("the tutorial's event loops cannot wait forever and handle every terminal event", () => {
  for (const module of ["quickstart", "first-run", "tools-and-gates", "run-cli"]) {
    const source = ["main.go", "turn.go"].filter((name) => existsSync(path.join(startExamples, module, name)))
      .map((name) => read(`examples/go/start/${module}/${name}`)).join("\n");
    assert.doesNotMatch(source, /for [^\n]*range [^\n]*\.Events\(\)/, module);
    assert.match(source, /case <-ctx\.Done\(\):/, module);
    assert.match(source, /if !ok \{/, module);
    for (const terminal of ["TurnDone", "TurnFailed", "TurnInterrupted"]) {
      assert.match(source, new RegExp(`case event\\.${terminal}:`), `${module} must handle ${terminal}`);
    }
  }
});

test("the tutorial's composition choices are the ones that work on current releases", () => {
  const tools = read("examples/go/start/tools-and-gates/agent.go");
  assert.match(tools, /loop\.WithReadOnlyAccess\(repo\)/);
  assert.match(tools, /rig\.WithSharedWorkspace\(/);
  assert.match(tools, /rig\.WithSnapshots\(/);
  const stores = read("examples/go/start/sessions/stores.go");
  assert.match(stores, /\.WithBoundedBlobReaders\(\)/);
  assert.match(stores, /errors\.Is\(err, fsstore\.ErrLegacyLayout\)/);
  assert.match(read("examples/go/start/workspaces/agent.go"), /rig\.WithSnapshots\(/);
  assert.match(read("examples/go/start/sandbox/sandbox.go"), /os\.MkdirAll\(scratch/);
  const cli = read("examples/go/start/run-cli/main.go");
  // Cleanup is registered storage, then sandbox, then session, so it runs in reverse.
  const order = ["defer func() {\n\t\tif err := store.Close()", "defer func() {\n\t\tif err := executors.Close()", "live.Shutdown(shutdownCtx)"]
    .map((needle) => cli.indexOf(needle));
  assert.ok(order.every((index) => index > 0), "run-cli cleanup registrations not found");
  assert.deepEqual([...order].sort((a, b) => a - b), order, "run-cli must register cleanup storage, sandbox, session");
  assert.equal(readdirSync(path.join(startExamples, "run-cli")).filter((name) => name.endsWith(".go") && !name.endsWith("_test.go")).length, 1,
    "the finished assistant is one main.go");
});
