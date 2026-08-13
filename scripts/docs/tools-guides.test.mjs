import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { resolveWorkspaceRoot } from "./package-surface.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const workspaceRoot = resolveWorkspaceRoot(root);

const pages = [
  ["guides/tools/index", "Tools"],
  ["guides/tools/core-concepts/index", "Tool Definitions, Preparation, and Results"],
  ["guides/tools/core-concepts/registration", "Registering Tools With Harness"],
  ["guides/tools/safety/index", "Safety, Permissions, and Gates"],
  ["guides/tools/safety/permissions", "Permission Rules and Stores"],
  ["guides/tools/processes/index", "Process Supervision"],
  ["guides/tools/processes/lifecycle", "Process Lifecycle, Storage, and Restore"],
  ["guides/tools/processes/tools", "Process Output, Input, and Stop Tools"],
  ["guides/tools/built-in-tools/index", "Built-in tools"],
  ["guides/tools/built-in-tools/askuser", "AskUser"],
  ["guides/tools/built-in-tools/bash", "Bash"],
  ["guides/tools/built-in-tools/editfile", "EditFile"],
  ["guides/tools/built-in-tools/fetch", "Fetch"],
  ["guides/tools/built-in-tools/glob", "Glob"],
  ["guides/tools/built-in-tools/grep", "Grep"],
  ["guides/tools/built-in-tools/readfile", "ReadFile"],
  ["guides/tools/built-in-tools/skill", "Skill"],
  ["guides/tools/built-in-tools/task", "Task Tools"],
  ["guides/tools/built-in-tools/websearch", "WebSearch"],
  ["guides/tools/built-in-tools/writefile", "WriteFile"],
];

const sourceProof = {
  "guides/tools/index": ["definitions.go", "definitions_test.go"],
  "guides/tools/core-concepts/index": ["definitions.go", "docs_examples_test.go"],
  "guides/tools/core-concepts/registration": ["definitions.go", "definitions_test.go"],
  "guides/tools/safety/index": ["bash/prepare.go", "bash/preparecall_test.go"],
  "guides/tools/safety/permissions": ["permission/store.go", "permission/store_test.go"],
  "guides/tools/processes/index": ["process/supervisor.go", "process/supervisor_test.go"],
  "guides/tools/processes/lifecycle": ["process/restore.go", "process/restore_test.go"],
  "guides/tools/processes/tools": ["process/output_tool.go", "process/output_tool_test.go"],
  "guides/tools/built-in-tools/index": ["askuser/askuser.go", "bash/bash_test.go"],
  "guides/tools/built-in-tools/askuser": ["askuser/askuser.go", "askuser/askuser_test.go"],
  "guides/tools/built-in-tools/bash": ["bash/bash.go", "bash/bash_test.go"],
  "guides/tools/built-in-tools/editfile": ["editfile/editfile.go", "internal/filemutation/editfile_test.go"],
  "guides/tools/built-in-tools/fetch": ["fetch/fetch.go", "fetch/fetch_test.go"],
  "guides/tools/built-in-tools/glob": ["glob/glob.go", "glob/glob_test.go"],
  "guides/tools/built-in-tools/grep": ["grep/grep.go", "grep/grep_test.go"],
  "guides/tools/built-in-tools/readfile": ["readfile/readfile.go", "readfile/readfile_test.go"],
  "guides/tools/built-in-tools/skill": ["skill/skill.go", "skill/skill_test.go"],
  "guides/tools/built-in-tools/task": ["task/tool.go", "task/tool_test.go"],
  "guides/tools/built-in-tools/websearch": ["websearch/websearch.go", "websearch/websearch_test.go"],
  "guides/tools/built-in-tools/writefile": ["writefile/writefile.go", "internal/filemutation/writefile_test.go"],
};

function markdown(relative) {
  return fs.readFileSync(path.join(root, "docs", relative.replace(/^docs\//, ""), ".md"), "utf8");
}

function pageMarkdown(id) {
  return fs.readFileSync(path.join(root, "docs", `${id}.md`), "utf8");
}

function sourceUrl(relative) {
  return `https://github.com/looprig/tools/blob/main/${relative}`;
}

function testUrl(relative) {
  return `https://github.com/looprig/tools/blob/main/${relative}`;
}

test("Tools guide inventory is complete and ordered", () => {
  for (const [id, title] of pages) {
    const file = path.join(root, "docs", `${id}.md`);
    assert.equal(fs.existsSync(file), true, `missing ${id}.md`);
    const content = fs.readFileSync(file, "utf8");
    assert.match(content, new RegExp(`^id: ${id.replaceAll("/", "\\/")}$`, "m"));
    assert.match(content, new RegExp(`^title: ${title.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, "m"));
    assert.doesNotMatch(content, /scaffold|templated|GOWORK=off|em dash|—/i, `${id} contains forbidden scaffold prose`);
  }
});

test("Tools overview explains composition and links canonical guides", () => {
  const content = pageMarkdown("guides/tools/index");
  for (const name of ["AskUser", "Bash", "EditFile", "Fetch", "Glob", "Grep", "ReadFile", "Skill", "Task", "WebSearch", "WriteFile", "ProcessOutput", "ProcessInput", "ProcessStop"]) {
    assert.match(content, new RegExp(`\\b${name}\\b`), `overview omits ${name}`);
  }
  for (const phrase of ["Definition", "PrepareCall", "PreparedArtifact", "ToolResult", "Harness", "Inference", "Sandboxing", "permission", "process"]) {
    assert.match(content, new RegExp(phrase, "i"), `overview omits ${phrase}`);
  }
  for (const destination of [
    "/docs/guides/harness/step/tool-calls-and-results/",
    "/docs/guides/inference/requests/tools/",
    "/docs/guides/inference/content-blocks/tool-use/",
    "/docs/start/sandbox-and-interfaces/",
  ]) {
    assert.match(content, new RegExp(destination.replaceAll("/", "\\/")), `overview omits ${destination}`);
  }
  assert.match(content, /```mermaid[\s\S]*theme["']?\s*:\s*["']dark["']/i);
  assert.match(content, /```go[\s\S]*TaskDefinitions[\s\S]*Bash/);
});

test("Concept and safety pages cover prepare-before-effect and gates", () => {
  const concepts = pageMarkdown("guides/tools/core-concepts/index");
  for (const phrase of ["tool.Definition", "Build", "PrepareCall", "PreparedArtifact", "InvokableRun", "ToolResult", "fresh", "mutat"]) {
    assert.match(concepts, new RegExp(phrase, "i"), `concepts omits ${phrase}`);
  }
  assert.match(concepts, /examples\/preparation\/example_test\.go/);
  const safety = pageMarkdown("guides/tools/safety/index");
  for (const phrase of ["Deny", "Gated", "Allow", "requirement", "candidate", "grant", "symlink", "lease", "read-only"]) {
    assert.match(safety, new RegExp(phrase, "i"), `safety omits ${phrase}`);
  }
  assert.match(safety, /\/docs\/start\/sandbox-and-interfaces\//);
  assert.match(safety, /\/docs\/guides\/harness\/gates\//);
});

test("Every Tools page has source and proof links to real Tools files", () => {
  for (const [id, [source, proof]] of Object.entries(sourceProof)) {
    const content = pageMarkdown(id);
    assert.match(content, new RegExp(sourceUrl(source).replaceAll("/", "\\/")), `${id} source link`);
    assert.match(content, new RegExp(testUrl(proof).replaceAll("/", "\\/")), `${id} proof link`);
    assert.match(content, /## Source/);
    assert.match(content, /## Proof/);
    assert.equal(fs.existsSync(path.join(workspaceRoot, "tools", source)), true, `missing source ${source}`);
    assert.equal(fs.existsSync(path.join(workspaceRoot, "tools", proof)), true, `missing proof ${proof}`);
  }
});

test("Tool pages describe their public contract and runnable proof", () => {
  const contracts = {
    "guides/tools/built-in-tools/askuser": ["question", "choices", "loop.RequestUserInput"],
    "guides/tools/built-in-tools/bash": ["sh -c", "30 seconds", "120 seconds", "background", "yield_time_ms", "access"],
    "guides/tools/built-in-tools/editfile": ["old", "new", "replace_all", "unique", "diff", "StaleFileError"],
    "guides/tools/built-in-tools/fetch": ["GET", "POST", "http://", "https://", "64 KiB", "redirect"],
    "guides/tools/built-in-tools/glob": ["**", "500", "DeniedRead", "tree"],
    "guides/tools/built-in-tools/grep": ["regular expression", "ripgrep", "fallback", "200", "context_lines"],
    "guides/tools/built-in-tools/readfile": ["line-numbered", "start_line", "end_line", "ReadGuard", "symlink"],
    "guides/tools/built-in-tools/skill": ["embedded", "workspace", "agent", "TOCTOU", "context.load"],
    "guides/tools/built-in-tools/task": ["TaskCreate", "TaskUpdate", "TaskGet", "TaskList", "Loop-local", "blockedBy"],
    "guides/tools/built-in-tools/websearch": ["SearchProvider", "Endpoints", "DuckDuckGo", "10", "redirect"],
    "guides/tools/built-in-tools/writefile": ["atomic", "content", "WriteTarget", "observation", "WithHostWrites"],
  };
  for (const [id, phrases] of Object.entries(contracts)) {
    const content = pageMarkdown(id);
    for (const phrase of phrases) assert.match(content, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `${id} omits ${phrase}`);
    assert.match(content, /```go[\s\S]*```/);
  }
});

test("Process pages cover ownership, cursor output, shutdown, and restore", () => {
  const overview = pageMarkdown("guides/tools/processes/index");
  for (const phrase of ["Handle", "Owner", "SessionID", "LoopID", "quota", "SupervisorResourceKey", "BashDefinition", "ProcessOutputDefinition"]) {
    assert.match(overview, new RegExp(phrase, "i"), `process overview omits ${phrase}`);
  }
  const lifecycle = pageMarkdown("guides/tools/processes/lifecycle");
  for (const phrase of ["starting", "running", "exited", "lost_on_restore", "manifest", "spool", "stable", "Shutdown", "lease"]) {
    assert.match(lifecycle, new RegExp(phrase, "i"), `lifecycle omits ${phrase}`);
  }
  const tools = pageMarkdown("guides/tools/processes/tools");
  for (const phrase of ["ProcessOutput", "ProcessInput", "ProcessStop", "cursor", "safe_text", "base64", "interrupt", "terminate", "kill", "not_found"]) {
    assert.match(tools, new RegExp(phrase, "i"), `process tools omits ${phrase}`);
  }
  for (const page of [overview, lifecycle, tools]) assert.match(page, /```go[\s\S]*```/);
  assert.match(overview, /examples\/processes\/example_test\.go/);
});

test("Permission page explains strict rules, stores, and candidate matches", () => {
  const content = pageMarkdown("guides/tools/safety/permissions");
  for (const phrase of ["SchemaVersion", "NormalizationVersion", "EffectAllow", "EffectDeny", "command.invoke", "network.target", "filesystem.path", "filesystem.tree", "NewWorkspaceStore", "NewReadOnlyStore", "WriteRules", "atomic", "0o600", "Deny-before-allow"]) {
    assert.match(content, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `permissions omits ${phrase}`);
  }
  assert.match(content, /examples\/permissions\/example_test\.go/);
  assert.match(content, /\/docs\/start\/sandbox-and-interfaces\//);
});

test("Cross-guide interlinks use canonical Harness and Inference destinations", () => {
  const pagesToCheck = [
    "guides/tools/index",
    "guides/tools/core-concepts/index",
    "guides/tools/core-concepts/registration",
    "guides/tools/safety/index",
    "guides/tools/built-in-tools/bash",
    "guides/tools/built-in-tools/fetch",
    "guides/tools/built-in-tools/websearch",
    "guides/tools/processes/index",
    "guides/tools/processes/tools",
  ];
  const destinations = [
    "/docs/guides/harness/step/model-request/",
    "/docs/guides/harness/step/tool-calls-and-results/",
    "/docs/guides/inference/requests/model-selection/",
    "/docs/guides/inference/requests/tools/",
    "/docs/guides/inference/content-blocks/tool-result/",
    "/docs/guides/inference/streaming/tool-call-deltas/",
  ];
  for (const id of pagesToCheck) {
    const content = pageMarkdown(id);
    assert.ok(destinations.some((destination) => content.includes(destination)), `${id} has no Harness/Inference interlink`);
  }
});
