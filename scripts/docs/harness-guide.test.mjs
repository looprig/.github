import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const guidePath = path.join(root, "docs/modules/harness.md");
const fixturePath = path.join(root, "examples/go/guides/harness-quickstart/main.go");
const diagramPath = path.join(root, "docs/assets/diagrams/harness-runtime.svg");

test("Harness guide links the runnable design and provider choices", () => {
  const guide = fs.readFileSync(guidePath, "utf8");
  const fixture = fs.readFileSync(fixturePath, "utf8");

  assert.match(guide, /\/docs\/assets\/diagrams\/harness-runtime\.svg/);
  assert.match(guide, /textual fallback/i);
  assert.doesNotMatch(guide, /immutable configuration\s+live runtime[\s\S]*┌/);
  assert.match(guide, /OpenAI GPT/i);
  assert.match(guide, /Anthropic Claude/i);
  assert.match(guide, /Ollama/i);
  assert.match(guide, /OpenAI-compatible/i);
  assert.doesNotMatch(guide, /GOWORK=off|outside the Looprig workspace|without the Looprig workspace/);
  assert.doesNotMatch(guide, /offlineModel|offline model/i);

  assert.match(fixture, /type deterministicModelStub struct\{\}/);
  assert.doesNotMatch(fixture, /offlineModel/);
  assert.doesNotMatch(fixture, /offline/i);
  assert.match(fixture, /deterministicModelStub.*deterministic|deterministic.*deterministicModelStub/is);
});

test("Harness runtime diagram is accessible and self-contained", () => {
  const diagram = fs.readFileSync(diagramPath, "utf8");

  assert.match(diagram, /^<svg\b[^>]*viewBox=/);
  assert.match(diagram, /<title\b[^>]*>[^<]+<\/title>/);
  assert.match(diagram, /<desc\b[^>]*>[^<]+<\/desc>/);
  assert.doesNotMatch(
    diagram,
    /<script\b|<foreignObject\b|<iframe\b|(?:href|xlink:href|src)=["']https?:\/\/|url\(https?:\/\//i,
  );
  assert.match(diagram, /marker-end=/);
  assert.match(diagram, /vector-effect="non-scaling-stroke"/);
});
