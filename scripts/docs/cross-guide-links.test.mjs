import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");

const harnessToInference = [
  ["step/model-request", "/docs/guides/inference/requests/"],
  ["step/streaming-response", "/docs/guides/inference/streaming/"],
  ["step/tool-calls-and-results", "/docs/guides/inference/content-blocks/tool-use/"],
  ["loop/models-and-inference", "/docs/guides/inference/models/"],
  ["loop/context-limits", "/docs/guides/inference/context-counting/"],
  ["loop/output-schema", "/docs/guides/inference/structured-output/"],
  ["hustles/retries", "/docs/guides/inference/retries/"],
  ["compaction/context-thresholds", "/docs/guides/inference/context-counting/"],
];

test("Harness concepts link to their canonical Inference references", () => {
  for (const [source, destination] of harnessToInference) {
    const markdown = fs.readFileSync(
      path.join(root, "docs/guides/harness", `${source}.md`),
      "utf8",
    );
    assert.match(markdown, new RegExp(`\\]\\(${destination.replaceAll("/", "\\/")}\\)`), source);
  }
});

test("cross-guide destinations are published pages", () => {
  const navigation = JSON.parse(
    fs.readFileSync(path.join(root, "docs/_data/navigation.json"), "utf8"),
  );
  const published = new Set(
    navigation.pages.map(({ path: pagePath }) => `/docs/${pagePath.replace(/index\.md$/, "").replace(/\.md$/, "/")}`),
  );

  for (const [, destination] of harnessToInference) {
    assert.equal(published.has(destination), true, `unpublished destination ${destination}`);
  }
});
