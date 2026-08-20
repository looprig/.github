import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const topics = ["rig", "loop", "turn", "step", "hustles", "compaction"];

function assertSemanticParagraph(markdown, patterns, message) {
  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim());
  assert.ok(
    paragraphs.some((paragraph) => patterns.every((pattern) => pattern.test(paragraph))),
    message,
  );
}

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

test("AgentTools runtime selection failures name the rejected field and value", () => {
  const guide = fs.readFileSync(path.join(root, "docs/guides/harness/delegation/start-and-message.md"), "utf8");

  assertSemanticParagraph(guide, [
    /runtime selectors?/i,
    /\binvalid\b/i,
    /\bunavailable\b/i,
    /\breject\w*\b/i,
    /\bfield\b/i,
    /\bvalue\b/i,
  ], "runtime selector errors must identify the rejected field and value");
});

test("failed AgentTools calls return error-marked tool results to model history", () => {
  const delegation = fs.readFileSync(path.join(root, "docs/guides/harness/delegation/start-and-message.md"), "utf8");
  const results = fs.readFileSync(path.join(root, "docs/guides/harness/step/tool-calls-and-results.md"), "utf8");

  assertSemanticParagraph(`${delegation}\n\n${results}`, [
    /\bAgentTools\b/,
    /\bfail\w*\b/i,
    /\btool[- ]results?\b|\bToolResultMessage\b/i,
    /\berror-marked\b|\bIsError\b/i,
    /\bmodel history\b|\bnext model request\b/i,
  ], "failed AgentTools calls must become error-marked results in model history");
});

test("child failure causes survive foreground, background, foreign, ACP, and restore paths", () => {
  const guide = fs.readFileSync(path.join(root, "docs/guides/harness/delegation/start-and-message.md"), "utf8");

  assertSemanticParagraph(guide, [
    /\bchild\b/i,
    /\b(?:failure )?(?:cause|reason|detail)s?\b/i,
    /\bforeground\b/i,
    /\bbackground\b/i,
    /\bforeign\b/i,
    /\bACP\b/,
    /\brestor\w*\b/i,
    /\b(?:surviv|preserv)\w*\b/i,
  ], "child failure causes must survive every documented delivery and restore path");
});

test("failure details are bounded, UTF-8 normalized, and not classification-filtered", () => {
  const delegation = fs.readFileSync(path.join(root, "docs/guides/harness/delegation/start-and-message.md"), "utf8");
  const results = fs.readFileSync(path.join(root, "docs/guides/harness/step/tool-calls-and-results.md"), "utf8");
  const guides = `${delegation}\n\n${results}`;

  assertSemanticParagraph(guides, [
    /\b(?:detail|cause|reason)s?\b/i,
    /\bbound\w*\b/i,
    /UTF-?8/i,
    /\bnormaliz\w*\b/i,
  ], "failure details must be bounded and UTF-8 normalized");
  assertSemanticParagraph(guides, [
    /\b(?:detail|cause|reason)s?\b/i,
    /\bcredential\w*\b/i,
    /\bmodel-facing\b/i,
    /\b(?:not|never|without|rather than)\b/i,
    /\b(?:filter|classif)\w*\b/i,
  ], "failure details must not depend on credential or model-facing classification");
});
