import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { assertClaim, fencedBlocks, negated, refuteClaim, section } from "./claims.mjs";

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

function effortConstants() {
  const page = fs.readFileSync(path.join(root, "docs/guides/inference/models/reasoning-effort.md"), "utf8");
  const api = section(page, "API surface");
  assert.ok(api, "reasoning effort needs an API surface section");

  const declarations = new Map();
  for (const block of fencedBlocks(api, "go")) {
    for (const group of block.matchAll(/\bconst\s*\(([\s\S]*?)^\)/gm)) {
      let grouped = null;
      for (const line of group[1].split("\n")) {
        if (line.trim() === "" || line.trim().startsWith("//")) continue;
        // Strip a trailing line comment only outside the value's quotes.
        const declaration = line.replace(/(^(?:[^"`]|"[^"]*"|`[^`]*`)*?)\s*\/\/.*$/, "$1").trim();
        if (declaration === "") continue;
        const parsed = declaration.match(/^([A-Za-z_]\w*)(?:\s+([A-Za-z_][\w.]*))?\s*=\s*(.+?)\s*$/);
        assert.ok(parsed, `reasoning effort has an unparsable const declaration: ${declaration}`);
        grouped = parsed[2] ?? grouped;
        assert.ok(grouped, `reasoning effort declares ${parsed[1]} without a type`);
        assert.equal(declarations.has(parsed[1]), false, `reasoning effort redeclares ${parsed[1]}`);
        declarations.set(parsed[1], `${parsed[1]} ${grouped} = ${parsed[3]}`);
      }
    }
  }
  assert.ok(declarations.size > 0, "reasoning effort needs a Go const block");
  return declarations;
}

test("Reasoning effort declares the complete released Effort range", () => {
  const declarations = effortConstants();

  assert.deepEqual([...declarations.values()], [
    'EffortNone Effort = ""',
    'EffortMinimal Effort = "minimal"',
    'EffortLow Effort = "low"',
    'EffortMedium Effort = "medium"',
    'EffortHigh Effort = "high"',
    'EffortXHigh Effort = "xhigh"',
    'EffortMax Effort = "max"',
  ]);
});

test("Reasoning effort warns that support varies by provider and model", () => {
  const page = fs.readFileSync(path.join(root, "docs/guides/inference/models/reasoning-effort.md"), "utf8");

  assertClaim(page, {
    all: [
      /\bproviders?\b/i,
      /\bmodels?\b/i,
      /\b(?:effort|level|value)s?\b/i,
      /\bnot\b[^.;!?]{0,40}\bevery\b|\bvar(?:y|ies)\b|\bdiffer\w*\b|\bdepends?\b|\bsubset\b|\bunsupported\b|\breject\w*\b/i,
    ],
    none: [negated("vary", "varies", "differ", "depend", "reject"), /\bnothing differs\b|\bthe same effort\b/i],
  }, "reasoning effort needs a provider/model support caveat");

  refuteClaim(page, {
    all: [
      /\b(?:every|all|any|each|both)\b/i,
      /\bproviders?\b|\bmodels?\b/i,
      /\b(?:support|accept|allow|implement|expose|carr)\w*\b/i,
      /\b(?:complete|full|whole|entire|every|all|any)\b/i,
    ],
    none: [
      negated("support", "accept", "allow", "implement", "expose", "carr"),
      /\bnot every\b|\bnot all\b|\bonly some\b|\bsome\b|\bno provider\b|\bno model\b/i,
    ],
  }, "reasoning effort must not claim universal provider support");
});
