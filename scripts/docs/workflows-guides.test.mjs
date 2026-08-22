import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { resolveWorkspaceRoot } from "./package-surface.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const workspaceRoot = resolveWorkspaceRoot(root);
const workflowsRoot = path.join(workspaceRoot, "workflows");

const pages = [
  ["guides/workflows/index", "Workflows"],
  ["guides/workflows/workflow-runtime/index", "Workflow Runtime"],
  ["guides/workflows/workflow-runtime/definitions", "Workflow Definitions and Schemas"],
  ["guides/workflows/workflow-runtime/runtime", "Workflow Runtime and Supervisors"],
  ["guides/workflows/workflow-runtime/state-and-history", "Workflow State, Checkpoints, and History"],
  ["guides/workflows/workflow-runtime/interruption-and-resume", "Interruption, Resume, and Recovery"],
  ["guides/workflows/workflow-runtime/lifecycle", "Statuses, Cancellation, and Failure"],
  ["guides/workflows/flow/index", "Flow Graph Composition"],
  ["guides/workflows/workflow-tools/index", "Workflow Tools"],
  ["guides/workflows/workflow-tools/harness-integration", "Harness Integration"],
];

const sourceProof = {
  "guides/workflows/index": ["doc.go", "examples/docs_contract_test.go"],
  "guides/workflows/workflow-runtime/index": ["supervisor.go", "supervisor_test.go"],
  "guides/workflows/workflow-runtime/definitions": ["definition.go", "definition_test.go"],
  "guides/workflows/workflow-runtime/runtime": ["supervisor.go", "supervisor_test.go"],
  "guides/workflows/workflow-runtime/state-and-history": ["history.go", "history_test.go"],
  "guides/workflows/workflow-runtime/interruption-and-resume": ["typed_definition.go", "examples/docs/stage18_workflows/main_test.go"],
  "guides/workflows/workflow-runtime/lifecycle": ["run.go", "reconcile_test.go"],
  "guides/workflows/flow/index": ["examples/docs/stage18_workflows/main.go", "examples/docs/stage18_workflows/main_test.go"],
  "guides/workflows/workflow-tools/index": ["tools/bundle.go", "tools/tools_test.go"],
  "guides/workflows/workflow-tools/harness-integration": ["session_resource.go", "harness_restore_integration_test.go"],
};

const legacyPageIds = [
  "guides/workflows/definitions",
  "guides/workflows/runtime",
  "guides/workflows/state-and-history",
  "guides/workflows/interruption-and-resume",
  "guides/workflows/lifecycle",
  "guides/workflows/tools",
  "guides/workflows/harness-integration",
  "guides/workflows/flow-composition",
];

function pageMarkdown(id) {
  return fs.readFileSync(path.join(root, "docs", `${id}.md`), "utf8");
}

function sourceUrl(relative) {
  return `https://github.com/looprig/workflows/blob/main/${relative}`;
}

function headingSlug(heading) {
  return heading
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

test("Workflows guide inventory is complete and ordered", () => {
  let previousOrder = -1;
  assert.equal(pages[0][0], "guides/workflows/index", "overview must be first");
  for (const [id, title] of pages) {
    const file = path.join(root, "docs", `${id}.md`);
    assert.equal(fs.existsSync(file), true, `missing ${id}.md`);
    const content = fs.readFileSync(file, "utf8");
    assert.match(content, new RegExp(`^id: ${id.replaceAll("/", "\\/")}$`, "m"));
    assert.match(content, new RegExp(`^title: ${title.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, "m"));
    const order = Number(content.match(/^order: (\d+)$/m)?.[1]);
    assert.equal(order, previousOrder + 1, `${id} must have the next order value`);
    previousOrder = order;
    assert.doesNotMatch(content, /scaffold|templated|GOWORK=off|policy53|Kosa|README|docs\/plans|—/i, `${id} contains forbidden prose`);
    assert.match(content, /^## (?:Source|Proof)$/m, `${id} needs source and proof sections`);
    assert.match(content, /```(?:go|mermaid)\n|^\| .+ \|$/m, `${id} needs a technical example, diagram, or table`);
    const frontmatter = content.split("---", 3)[1] ?? "";
    for (const heading of content.match(/^#{2,6} (.+)$/gm) ?? []) {
      const slug = headingSlug(heading.replace(/^#{2,6} /, ""));
      assert.match(frontmatter, new RegExp(`^  ${slug}:`, "m"), `${id} lacks proof mapping for ${heading}`);
    }
    for (const match of content.matchAll(/(?:^|[^\w.])\[[^\]]+\]\(([^)]+)\)/gm)) {
      const destination = match[1];
      assert.doesNotMatch(destination, /\s/, `${id} link contains whitespace: ${destination}`);
      if (destination.startsWith("/")) assert.match(destination, /^\/docs\//, `${id} has a non-canonical internal link`);
    }
  }
  for (const id of legacyPageIds) {
    assert.equal(fs.existsSync(path.join(root, "docs", `${id}.md`)), false, `legacy flat page remains: ${id}.md`);
  }
});

test("Every Workflows page links source and proof files that exist locally", () => {
  for (const [id, paths] of Object.entries(sourceProof)) {
    const content = pageMarkdown(id);
    assert.match(content, /## Source/);
    assert.match(content, /## Proof/);
    for (const relative of paths) {
      assert.equal(fs.existsSync(path.join(workflowsRoot, relative)), true, `missing Workflows path ${relative}`);
      assert.match(content, new RegExp(sourceUrl(relative).replaceAll("/", "\\/")), `${id} does not link ${relative}`);
    }
  }
});

test("Overview explains the Workflows boundary and contextual module links", () => {
  const content = pageMarkdown("guides/workflows/index");
  for (const phrase of ["definition", "Catalog", "Supervisor", "checkpoint", "Flow", "workflow tools", "Harness", "status", "resume", "cancel"]) {
    assert.match(content, new RegExp(phrase, "i"), `overview omits ${phrase}`);
  }
  for (const destination of [
    "/docs/modules/flow",
    "/docs/modules/harness",
    "/docs/modules/inference",
    "/docs/modules/tools",
  ]) {
    assert.match(content, new RegExp(destination.replaceAll("/", "\\/")), `overview omits ${destination}`);
  }
  assert.match(content, /```mermaid[\s\S]*theme["']?\s*:\s*["']dark["']/i);
});

test("Definitions and Flow composition describe the public seams", () => {
  const definitions = pageMarkdown("guides/workflows/workflow-runtime/definitions");
  for (const phrase of ["NewMetadata", "NewTypedDefinition", "StrictJSONDecoder", "TypedResumeDecoder", "Catalog.Register", "ValidateInput", "ValidateResume", "additionalProperties", "NewVertexMetadataForID"]) {
    assert.match(definitions, new RegExp(phrase.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"), "i"), `definitions omits ${phrase}`);
  }
  const flow = pageMarkdown("guides/workflows/flow/index");
  for (const phrase of ["NewGraph", "AddVertex", "Compile", "CheckpointStore", "GraphRunID", "Interrupt", "ResumePayload", "GraphVersion"]) {
    assert.match(flow, new RegExp(phrase.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"), "i"), `flow page omits ${phrase}`);
  }
});

test("Runtime, lifecycle, and recovery pages cover durable behavior", () => {
  const runtime = pageMarkdown("guides/workflows/workflow-runtime/runtime");
  for (const phrase of ["Activate", "Shutdown", "session lease", "Start", "seed", "WaitIdle", "adopt", "MaxWorkers"]) {
    assert.match(runtime, new RegExp(phrase.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"), "i"), `runtime omits ${phrase}`);
  }
  const lifecycle = pageMarkdown("guides/workflows/workflow-runtime/lifecycle");
  for (const phrase of ["pending", "running", "interrupted", "completed", "cancelled", "failed", "CompareAndSwap", "CancelRequested", "terminal"]) {
    assert.match(lifecycle, new RegExp(phrase.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"), "i"), `lifecycle omits ${phrase}`);
  }
  const recovery = pageMarkdown("guides/workflows/workflow-runtime/interruption-and-resume");
  for (const phrase of ["Adopt", "ValidateResume", "checkpoint", "GraphVersionMismatchError", "RunInterrupted", "flow.Interrupt", "StatefulInterrupt"]) {
    assert.match(recovery, new RegExp(phrase.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"), "i"), `recovery omits ${phrase}`);
  }
});

test("Workflow tools and Harness integration stay in the Workflows guide", () => {
  const tools = pageMarkdown("guides/workflows/workflow-tools/index");
  for (const name of ["workflow_definition_list", "workflow_run_start", "workflow_run_get", "workflow_run_list", "workflow_run_resume", "workflow_run_cancel", "workflow_run_history"]) {
    assert.match(tools, new RegExp(name), `tools page omits ${name}`);
  }
  for (const phrase of ["strict", "canonical", "durable seed", "parent_run_id", "after_revision", "after_event_id", "safe", "input"] ) {
    assert.match(tools, new RegExp(phrase, "i"), `tools page omits ${phrase}`);
  }
  const integration = pageMarkdown("guides/workflows/workflow-tools/harness-integration");
  for (const phrase of ["SessionResource", "SessionResourceServices", "WorkflowActivityPublisher", "run_started", "vertex_completed", "run_interrupted", "run_resumed", "run_completed", "run_cancelled", "run_failed", "ActivityCursor"]) {
    assert.match(integration, new RegExp(phrase.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"), "i"), `integration omits ${phrase}`);
  }
  assert.match(tools, /\/docs\/guides\/harness\/step\/tool-calls-and-results/);
  assert.match(integration, /\/docs\/guides\/harness\/events\/process-and-workflow/);
  assert.match(integration, /\/docs\/modules\/tools/);
});
