import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { resolveWorkspaceRoot } from "./package-surface.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const workspaceRoot = resolveWorkspaceRoot(root);
const sandboxRoot = path.join(workspaceRoot, "sandbox");

const pages = [
  ["guides/sandboxing/index", "Sandboxing"],
  ["guides/sandboxing/profiles/index", "Profiles and Access Dimensions"],
  ["guides/sandboxing/profiles/restriction", "Restriction and Least Authority"],
  ["guides/sandboxing/enforcement/index", "Enforcement"],
  ["guides/sandboxing/enforcement/platforms", "Platform Levels and Guarantees"],
  ["guides/sandboxing/enforcement/reports", "Compilation Reports"],
  ["guides/sandboxing/enforcement/filesystem", "Filesystem, HOME, and Environment"],
  ["guides/sandboxing/enforcement/network", "Network Routes and Target Grants"],
  ["guides/sandboxing/runtime/index", "Runtime"],
  ["guides/sandboxing/runtime/executors", "Executors and Executor Sets"],
  ["guides/sandboxing/runtime/argv-and-confinement", "RunArgv and Confinement"],
  ["guides/sandboxing/runtime/processes", "Prepared Processes and Lifetime"],
  ["guides/sandboxing/runtime/errors", "Typed Errors and Recovery"],
  ["guides/sandboxing/integration/index", "Harness Gates and Prepared Tools"],
  ["guides/sandboxing/deployment-environments", "Docker, MicroVMs, and VMs"],
];

const sourceProof = {
  "guides/sandboxing/index": ["sandbox.go", "examples/policy-enforcement/example_test.go"],
  "guides/sandboxing/profiles/index": ["pkg/profile/profile.go", "pkg/profile/profile_test.go"],
  "guides/sandboxing/profiles/restriction": ["pkg/profile/profile.go", "pkg/profile/profile_test.go"],
  "guides/sandboxing/enforcement/index": ["sandbox.go", "examples/policy-enforcement/example_test.go"],
  "guides/sandboxing/enforcement/platforms": ["internal/linux/select.go", "internal/platform/platform_linux_test.go"],
  "guides/sandboxing/enforcement/reports": ["pkg/profile/report.go", "examples/policy-enforcement/example_test.go"],
  "guides/sandboxing/enforcement/filesystem": ["internal/policy/effective.go", "internal/policy/effective_test.go"],
  "guides/sandboxing/enforcement/network": ["pkg/network/proxy.go", "pkg/network/proxy_test.go"],
  "guides/sandboxing/runtime/index": ["sandbox.go", "examples/policy-enforcement/example_test.go"],
  "guides/sandboxing/runtime/executors": ["internal/exec/executor_set.go", "internal/exec/executor_set_test.go"],
  "guides/sandboxing/runtime/argv-and-confinement": ["internal/exec/executor.go", "internal/exec/portable_command_test.go"],
  "guides/sandboxing/runtime/processes": ["internal/exec/process.go", "internal/exec/process_lifecycle_test.go"],
  "guides/sandboxing/runtime/errors": ["sandbox.go", "facade_test.go"],
  "guides/sandboxing/integration/index": ["examples/policy-enforcement/example_test.go", "examples/contract_test.go"],
  "guides/sandboxing/deployment-environments": ["init_linux.go", "internal/exec/executor.go"],
};

function pageMarkdown(id) {
  return fs.readFileSync(path.join(root, "docs", `${id}.md`), "utf8");
}

function sourceUrl(relative) {
  return `https://github.com/looprig/sandbox/blob/main/${relative}`;
}

function headingSlug(heading) {
  return heading
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

test("Sandboxing guide inventory is complete and ordered", () => {
  let previousOrder = -1;
  for (const [id, title] of pages) {
    const file = path.join(root, "docs", `${id}.md`);
    assert.equal(fs.existsSync(file), true, `missing ${id}.md`);
    const content = fs.readFileSync(file, "utf8");
    assert.match(content, new RegExp(`^id: ${id.replaceAll("/", "\\/")}$`, "m"));
    assert.match(content, new RegExp(`^title: ${title.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, "m"));
    const order = Number(content.match(/^order: (\d+)$/m)?.[1]);
    assert.equal(order, previousOrder + 1, `${id} must have the next order value`);
    previousOrder = order;
    assert.doesNotMatch(content, /scaffold|templated|GOWORK=off|source-workspace|em dash|—/i, `${id} contains forbidden filler prose`);
    assert.match(content, /```go[\s\S]+?```/, `${id} needs a Go example`);
    assert.match(content, /^## Source$/m, `${id} needs a Source section`);
    assert.match(content, /^## Proof$/m, `${id} needs a Proof section`);
    const frontmatter = content.split("---", 3)[1] ?? "";
    for (const heading of content.match(/^#{2,6} (.+)$/gm) ?? []) {
      const slug = headingSlug(heading.replace(/^#{2,6} /, ""));
      assert.match(frontmatter, new RegExp(`^  ${slug}:`, "m"), `${id} lacks proof mapping for ${heading}`);
    }
    for (const match of content.matchAll(/\]\(([^)]+)\)/g)) {
      const destination = match[1];
      assert.doesNotMatch(destination, /\s/, `${id} link contains whitespace: ${destination}`);
      if (destination.startsWith("/")) assert.match(destination, /^\/docs\//, `${id} has a non-canonical internal link`);
    }
  }
});

test("Every Sandboxing page links to real sandbox source and proof files", () => {
  for (const [id, [source, proof]] of Object.entries(sourceProof)) {
    const content = pageMarkdown(id);
    assert.match(content, new RegExp(sourceUrl(source).replaceAll("/", "\\/")), `${id} source link`);
    assert.match(content, new RegExp(sourceUrl(proof).replaceAll("/", "\\/")), `${id} proof link`);
    assert.equal(fs.existsSync(path.join(sandboxRoot, source)), true, `missing source ${source}`);
    assert.equal(fs.existsSync(path.join(sandboxRoot, proof)), true, `missing proof ${proof}`);
  }
});

test("Sandboxing overview and pages cover the public authority boundaries", () => {
  const overview = pageMarkdown("guides/sandboxing/index");
  for (const phrase of ["ProfileConfig", "Restrict", "NewExecutorSet", "RunArgv", "Gated", "CompileReport", "Guarantees", "Harness", "Tools"]) {
    assert.match(overview, new RegExp(phrase, "i"), `overview omits ${phrase}`);
  }
  for (const destination of [
    "/docs/guides/sandboxing/profiles/",
    "/docs/guides/sandboxing/profiles/restriction/",
    "/docs/guides/sandboxing/enforcement/",
    "/docs/guides/sandboxing/enforcement/platforms/",
    "/docs/guides/sandboxing/runtime/",
    "/docs/guides/sandboxing/runtime/executors/",
    "/docs/guides/sandboxing/runtime/processes/",
    "/docs/guides/tools/safety/",
    "/docs/guides/harness/step/tool-calls-and-results/",
  ]) {
    assert.match(overview, new RegExp(destination.replaceAll("/", "\\/")), `overview omits ${destination}`);
  }
  assert.match(overview, /```mermaid[\s\S]*theme["']?\s*:\s*["']dark["']/i);
});

test("Sandboxing pages explain platform truth, gates, and lifecycle distinctions", () => {
  const profiles = pageMarkdown("guides/sandboxing/profiles/index");
  for (const phrase of ["Deny", "Gated", "Allow", "WorkspaceRoot", "AdditionalRoots", "IsolatedHome", "Sandboxed", "AccessFor"]) {
    assert.match(profiles, new RegExp(phrase, "i"), `profiles omits ${phrase}`);
  }
  const platforms = pageMarkdown("guides/sandboxing/enforcement/platforms");
  for (const phrase of ["LevelNone", "LevelDegraded", "LevelFull", "GuaranteeReadBoundary", "Rung 1", "Rung 2", "Seatbelt", "Windows"]) {
    assert.match(platforms, new RegExp(phrase.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"), "i"), `platforms omits ${phrase}`);
  }
  const executors = pageMarkdown("guides/sandboxing/runtime/executors");
  for (const phrase of ["For", "memo", "WithMaxExecutors", "WithGrantTTL", "ErrExecutorLimit", "Close", "HOME", "TMPDIR"]) {
    assert.match(executors, new RegExp(phrase, "i"), `executors omits ${phrase}`);
  }
  const processes = pageMarkdown("guides/sandboxing/runtime/processes");
  for (const phrase of ["PrepareProcess", "PreparedProcess", "Start", "Wait", "Stdout", "Stderr", "LifetimeContainment", "TTY"]) {
    assert.match(processes, new RegExp(phrase, "i"), `processes omits ${phrase}`);
  }
  const integration = pageMarkdown("guides/sandboxing/integration/index");
  for (const phrase of ["Harness", "Tools", "requirement", "PreparedArtifact", "Gated", "pre-spawn", "OS enforcement"]) {
    assert.match(integration, new RegExp(phrase, "i"), `integration omits ${phrase}`);
  }
});

test("deployment environments compose an outer boundary with truthful native guarantees", () => {
  const deployment = pageMarkdown("guides/sandboxing/deployment-environments");
  for (const phrase of [
    "Docker",
    "container",
    "microVM",
    "virtual machine",
    "sandbox.Init",
    "application binary",
    "CompileReport",
    "Guarantees",
    "Executor.Report",
    "Executor.Guarantees",
    "defense in depth",
  ]) assert.match(deployment, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `deployment page omits ${phrase}`);
  assert.match(deployment, /```dockerfile[\s\S]+go build[\s\S]+ENTRYPOINT[\s\S]+```/i);
  assert.match(deployment, /\| Environment \| Outer boundary \| Native Sandbox considerations \|/);
  assert.doesNotMatch(deployment, /sandbox (?:generates|builds|emits) (?:a |the )?binary/i);
});
