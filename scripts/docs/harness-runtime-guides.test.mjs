import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const topics = ["rig", "loop", "turn", "step", "hustles", "compaction"];

test("Harness runtime concepts have dedicated consumer guides", () => {
  const landing = fs.readFileSync(path.join(root, "docs/guides/harness.md"), "utf8");

  for (const topic of topics) {
    const page = path.join(root, `docs/guides/harness/${topic}/index.md`);
    assert.equal(fs.existsSync(page), true, `${topic} guide must exist`);
    assert.match(landing, new RegExp(`/docs/guides/harness/${topic}`));
  }
});

test("Harness runtime guides explain APIs with source-backed Go examples", () => {
  for (const topic of topics) {
    const guide = fs.readFileSync(path.join(root, `docs/guides/harness/${topic}/index.md`), "utf8");
    assert.match(guide, /```go[\s\S]+?```/, `${topic} needs a Go example`);
    assert.match(guide, /^## (How it works|Lifecycle|Configure|Run|Observe|When to use)/m, `${topic} needs an operational section`);
    assert.doesNotMatch(guide, /GOWORK=off|source-workspace|proof ID|workflow job/i);
  }
});

test("Turn and Step explain their different execution boundaries", () => {
  const turn = fs.readFileSync(path.join(root, "docs/guides/harness/turn/index.md"), "utf8");
  const step = fs.readFileSync(path.join(root, "docs/guides/harness/step/index.md"), "utf8");

  assert.match(turn, /one user input/i);
  assert.match(turn, /one or more steps/i);
  assert.match(step, /model request/i);
  assert.match(step, /tool call/i);
  assert.match(step, /StepDone/);
});

test("Hustles and compaction stay inside the Harness hierarchy", () => {
  const hustles = fs.readFileSync(path.join(root, "docs/guides/harness/hustles/index.md"), "utf8");
  const compaction = fs.readFileSync(path.join(root, "docs/guides/harness/compaction/index.md"), "utf8");

  assert.match(hustles, /hustle\.Define/);
  assert.match(hustles, /rig\.WithHustles/);
  assert.match(compaction, /loop\.WithCompaction/);
  assert.match(compaction, /context counter/i);
});
