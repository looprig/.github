import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const diagramPath = path.join(root, "docs/assets/diagrams/harness-runtime.svg");

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
