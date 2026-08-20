import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const pages = [
  "content-blocks/index",
  "content-blocks/text",
  "content-blocks/image",
  "content-blocks/audio",
  "content-blocks/document",
  "content-blocks/thinking",
  "content-blocks/tool-use",
  "content-blocks/tool-result",
  "messages/index",
  "messages/message-types/system-message",
  "messages/message-types/user-message",
  "messages/message-types/ai-message",
  "messages/message-types/tool-result-message",
  "messages/conversation",
  "messages/agentic-messages",
  "messages/construct",
  "messages/traverse",
  "messages/codecs",
  "models/index",
  "models/model",
  "models/identity",
  "models/capabilities",
  "models/context-limits",
  "models/sampling",
  "models/reasoning-effort",
  "models/custom-models",
  "models/validation",
  "client/index",
  "client/invoke",
  "client/stream",
  "client/ownership",
  "requests/index",
  "requests/model-selection",
  "requests/system-instructions",
  "requests/messages",
  "requests/tools",
  "requests/tool-choice",
  "requests/structured-output",
  "requests/sampling-overrides",
  "requests/feature-validation",
  "responses/index",
  "responses/assistant-message",
  "responses/finish-reasons",
  "responses/usage",
  "responses/resolved-model",
  "responses/attempts",
  "streaming/index",
  "streaming/stream-reader",
  "streaming/chunks",
  "streaming/text-deltas",
  "streaming/thinking-deltas",
  "streaming/tool-call-deltas",
  "streaming/accumulation",
  "streaming/terminal-results",
  "streaming/close",
  "streaming/errors",
  "structured-output/index",
  "structured-output/output-schema",
  "structured-output/portable-json-schema",
  "structured-output/validation",
  "structured-output/with-tools",
  "structured-output/decoding",
  "structured-output/errors",
  "codecs/index",
  "codecs/architecture",
  "codecs/request",
  "codecs/response",
  "codecs/streaming",
  "codecs/content",
  "codecs/tools",
  "codecs/thinking",
  "codecs/usage",
  "codecs/custom",
  "api-formats/index",
  "api-formats/comparison",
  "api-formats/openai-chat",
  "api-formats/openai-responses",
  "api-formats/anthropic",
  "api-formats/gemini",
  "api-formats/bedrock-converse",
  "api-formats/custom",
  "context-counting/index",
  "context-counting/complete-requests",
  "context-counting/counter-capabilities",
  "context-counting/exact-provider",
  "context-counting/exact-local",
  "context-counting/conservative-estimates",
  "context-counting/api-format-estimators",
  "context-counting/compatibility",
  "context-counting/fail-closed",
  "context-counting/errors",
  "usage/index",
  "usage/response",
  "usage/streaming",
  "usage/validation",
  "usage/aggregation",
  "errors-and-cancellation/index",
  "errors-and-cancellation/typed-errors",
  "errors-and-cancellation/request-validation",
  "errors-and-cancellation/capabilities",
  "errors-and-cancellation/codec-errors",
  "errors-and-cancellation/transport-errors",
  "errors-and-cancellation/stream-errors",
  "errors-and-cancellation/cancellation",
  "errors-and-cancellation/deadlines",
];

test("Inference guides contain every approved page with finished content", () => {
  for (const relative of pages) {
    const file = path.join(root, "docs/guides/inference", `${relative}.md`);
    assert.equal(fs.existsSync(file), true, `missing ${relative}`);
    const markdown = fs.readFileSync(file, "utf8");
    assert.match(markdown, new RegExp(`^id: guides/inference/${relative.replace(/\\/g, "/")}$`, "m"));
    assert.doesNotMatch(markdown, /<!-- scaffold: inference -->|planned developer guide|content pass/i);
    assert.match(markdown, /^## (?:Proof|Source and proof)$/m, `missing proof section in ${relative}`);
    assert.match(markdown, /```(?:go|mermaid)\n|^\| .+ \|$/m, `missing technical example, diagram, or comparison in ${relative}`);
  }
});

test("Content blocks precede messages in the checked navigation manifest", () => {
  const navigation = JSON.parse(fs.readFileSync(path.join(root, "docs/_data/navigation.json"), "utf8"));
  const paths = navigation.pages.map((page) => page.path);
  const blocks = paths.indexOf("guides/inference/content-blocks/index.md");
  const messages = paths.indexOf("guides/inference/messages/index.md");

  assert.notEqual(blocks, -1);
  assert.notEqual(messages, -1);
  assert.ok(blocks < messages);
});

test("Reasoning effort documents the complete released API range", () => {
  const page = fs.readFileSync(path.join(root, "docs/guides/inference/models/reasoning-effort.md"), "utf8");
  const apiSection = page.split(/^## API surface\n/m)[1]?.split(/^## /m)[0];
  assert.ok(apiSection, "reasoning effort needs an API surface section");
  const goBlocks = [...apiSection.matchAll(/```go\n([\s\S]*?)```/g)].map((match) => match[1]).join("\n");

  assert.match(goBlocks, /\bEffortMinimal\b/, "reasoning effort API omits EffortMinimal");
  assert.match(goBlocks, /\bEffortXHigh\b/, "reasoning effort API omits EffortXHigh");
});

test("Reasoning effort warns that support varies by provider and model", () => {
  const page = fs.readFileSync(path.join(root, "docs/guides/inference/models/reasoning-effort.md"), "utf8");
  const paragraphs = page.split(/\n\s*\n/).map((paragraph) => paragraph.replace(/\s+/g, " "));

  assert.ok(paragraphs.some((paragraph) => [
    /\bproviders?\b/i,
    /\bmodels?\b/i,
    /\bsupport\w*\b/i,
    /\b(?:specific|var|differ|only|unsupported)\w*\b/i,
  ].every((pattern) => pattern.test(paragraph))), "reasoning effort needs a provider/model support caveat");
});
