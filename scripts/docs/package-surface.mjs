#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const cwd = path.resolve(import.meta.dirname, "../..");

export function resolveWorkspaceRoot(repoRoot = cwd, { env = process.env } = {}) {
  const configured = typeof env?.LOOPRIG_WORKSPACE_ROOT === "string"
    ? env.LOOPRIG_WORKSPACE_ROOT.trim()
    : "";
  if (configured) return path.resolve(configured);

  let current = path.resolve(repoRoot);
  while (true) {
    if (path.basename(current) === ".github") return path.dirname(current);
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  throw new Error(
    `unable to locate the outer Looprig workspace from ${path.resolve(repoRoot)}; ` +
    "set LOOPRIG_WORKSPACE_ROOT for a standalone .github checkout",
  );
}

const modules = JSON.parse(fs.readFileSync(path.join(cwd, "docs/_data/modules.json"), "utf8")).modules;
const packages = JSON.parse(fs.readFileSync(path.join(cwd, "docs/_data/packages.json"), "utf8")).packages;

function git(repo, args) {
  return execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" });
}

function moduleFor(item) {
  return modules.find((candidate) => candidate.repository === item.repository && candidate.module === item.module);
}

function relativePackagePath(item) {
  if (item.ecosystem === "npm") return item.path;
  if (item.path === item.module) return "";
  const prefix = `${item.module}/`;
  if (!item.path.startsWith(prefix)) throw new Error(`package path ${item.path} is not under ${item.module}`);
  return item.path.slice(prefix.length);
}

function packageFiles(item, workspace) {
  const module = moduleFor(item);
  if (!module) throw new Error(`no module record for ${item.repository}:${item.path}`);
  const repo = path.join(workspace, item.repository);
  const rel = relativePackagePath(item);
  const names = git(repo, ["ls-tree", "-r", "--name-only", module.commit, "--", rel || "."]).trim();
  if (!names) return [];
  return names.split(/\r?\n/).filter((name) => name.endsWith(".go") && !name.endsWith("_test.go") && path.posix.dirname(name) === (rel || "."));
}

function packageTests(item, workspace) {
  const module = moduleFor(item);
  const repo = path.join(workspace, item.repository);
  const rel = relativePackagePath(item);
  const names = git(repo, ["ls-tree", "-r", "--name-only", module.commit, "--", rel || "."]).trim();
  if (!names) return [];
  return names.split(/\r?\n/).filter((name) => name.endsWith("_test.go") && path.posix.dirname(name) === (rel || "."));
}

function show(repo, commit, file) {
  return git(repo, ["show", `${commit}:${file}`]);
}

function analyzePackages(items) {
  const input = JSON.stringify({
    packages: items.map((item) => ({
      id: item.id,
      files: item.sources.map((source) => ({ name: source.name, source: source.content })),
    })),
  });
  const output = execFileSync("go", ["run", path.join(cwd, "scripts/docs/package-surface-go/main.go")], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, GOWORK: "off" },
    input,
    maxBuffer: 128 * 1024 * 1024,
  });
  return new Map(JSON.parse(output).packages.map((item) => [item.id, item]));
}

export function inventory({ workspaceRoot } = {}) {
  const workspace = workspaceRoot ? path.resolve(workspaceRoot) : resolveWorkspaceRoot();
  const pending = [];
  for (const item of packages) {
    if (item.ecosystem === "npm") continue;
    const module = moduleFor(item);
    const repo = path.join(workspace, item.repository);
    const files = packageFiles(item, workspace);
    pending.push({
      id: `${item.repository}:${item.path}`,
      repository: item.repository,
      module: item.module,
      importPath: item.path,
      relativePath: relativePackagePath(item),
      commit: module.commit,
      tag: module.publication?.tag || null,
      files,
      tests: packageTests(item, workspace),
      sources: files.map((file) => ({ name: file, content: show(repo, module.commit, file) })),
    });
  }
  const surfaces = analyzePackages(pending);
  return pending.map(({ id, sources, ...item }) => {
    const surface = surfaces.get(id);
    if (!surface) throw new Error(`Go surface analyzer returned no result for ${id}`);
    return {
      ...item,
      ...surface,
      types: surface.types.map((type) => ({ ...type, error: surface.errors.includes(type.name) })),
    };
  });
}

if (import.meta.url === `file://${process.argv[1]}`) process.stdout.write(`${JSON.stringify(inventory(), null, 2)}\n`);
