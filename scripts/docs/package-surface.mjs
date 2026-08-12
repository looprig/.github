#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const cwd = path.resolve(import.meta.dirname, "../..");
const workspace = path.resolve(cwd, "../../..");
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

function packageFiles(item) {
  const module = moduleFor(item);
  if (!module) throw new Error(`no module record for ${item.repository}:${item.path}`);
  const repo = path.join(workspace, item.repository);
  const rel = relativePackagePath(item);
  const names = git(repo, ["ls-tree", "-r", "--name-only", module.commit, "--", rel || "."]).trim();
  if (!names) return [];
  return names.split(/\r?\n/).filter((name) => name.endsWith(".go") && !name.endsWith("_test.go") && path.posix.dirname(name) === (rel || "."));
}

function packageTests(item) {
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

function stripComments(source) {
  let out = "";
  let state = "code";
  let quote = "";
  for (let i = 0; i < source.length; i += 1) {
    const c = source[i];
    const n = source[i + 1];
    if (state === "line") {
      if (c === "\n") { out += "\n"; state = "code"; } else out += " ";
      continue;
    }
    if (state === "block") {
      if (c === "*" && n === "/") { out += "  "; i += 1; state = "code"; } else out += c === "\n" ? "\n" : " ";
      continue;
    }
    if (state === "string" || state === "rune") {
      out += c;
      if (c === "\\") { out += n || ""; i += 1; continue; }
      if (c === quote) state = "code";
      continue;
    }
    if (c === "/" && n === "/") { out += "  "; i += 1; state = "line"; continue; }
    if (c === "/" && n === "*") { out += "  "; i += 1; state = "block"; continue; }
    if (c === '"' || c === "`") { state = "string"; quote = c; out += c; continue; }
    if (c === "'") { state = "rune"; quote = c; out += c; continue; }
    out += c;
  }
  return out;
}

function exported(name) { return /^[A-Z]/.test(name); }
function balancedEnd(source, start, open, close) {
  let depth = 0;
  let state = "code";
  let quote = "";
  for (let i = start; i < source.length; i += 1) {
    const c = source[i];
    if (state === "string" || state === "rune") {
      if (c === "\\") { i += 1; continue; }
      if (c === quote) state = "code";
      continue;
    }
    if (c === '"' || c === "`") { state = "string"; quote = c; continue; }
    if (c === "'") { state = "rune"; quote = c; continue; }
    if (c === open) depth += 1;
    if (c === close) { depth -= 1; if (depth === 0) return i + 1; }
  }
  return source.length;
}

function declarationEnd(source, start) {
  const brace = source.indexOf("{", start);
  const semi = source.indexOf(";", start);
  const newline = source.indexOf("\n", start);
  if (semi !== -1 && (newline === -1 || semi < newline) && (brace === -1 || semi < brace)) return semi + 1;
  if (brace === -1) return newline === -1 ? source.length : newline;
  return balancedEnd(source, brace, "{", "}");
}

function functionHeaderEnd(source, start) {
  let state = "code";
  let quote = "";
  for (let i = start; i < source.length; i += 1) {
    const c = source[i];
    if (state === "string" || state === "rune") {
      if (c === "\\") { i += 1; continue; }
      if (c === quote) state = "code";
      continue;
    }
    if (c === '"' || c === "`") { state = "string"; quote = c; continue; }
    if (c === "'") { state = "rune"; quote = c; continue; }
    if (c !== "{") continue;
    const prefix = source.slice(Math.max(start, i - 24), i);
    if (/\b(?:struct|interface)\s*$/.test(prefix)) { i = balancedEnd(source, i, "{", "}") - 1; continue; }
    return i;
  }
  return -1;
}

function cleanSignature(value) {
  return value.replace(/\s+/g, " ").replace(/\s+([,){}])/g, "$1").trim();
}

function parseSource(source, filename) {
  const code = stripComments(source);
  const functions = [];
  const methods = [];
  const types = [];
  const constants = [];
  const variables = [];
  const errors = new Set();
  const funcRe = /^func\s+(?:(\([^\n]*?\))\s*)?([A-Za-z_]\w*)\s*/gm;
  for (let match; (match = funcRe.exec(code));) {
    const name = match[2];
    if (!exported(name)) continue;
    const body = functionHeaderEnd(code, match.index);
    const signatureEnd = body === -1 ? code.indexOf("\n", match.index) : body;
    const signature = cleanSignature(code.slice(match.index, signatureEnd === -1 ? code.length : signatureEnd));
    if (match[1]) {
      const receiver = cleanSignature(match[1]);
      methods.push({ name, receiver, signature, file: filename });
      if (name === "Error" && /\(\s*\)\s*string\b/.test(signature)) {
        const receiverType = receiver.replace(/^\(/, "").replace(/\)$/, "").trim().split(/\s+/).at(-1)?.replace(/^\*/, "");
        if (receiverType) errors.add(receiverType);
      }
    } else functions.push({ name, signature, file: filename });
  }
  const typeRe = /^type\s+([A-Za-z_]\w*)\s*/gm;
  for (let match; (match = typeRe.exec(code));) {
    const name = match[1];
    if (!exported(name)) continue;
    types.push({ name, file: filename });
  }
  function addNames(chunk, target, file) {
    const match = chunk.match(/^\s*([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*)(?=\s*(?:=|$|[A-Za-z_*\[\]{}]))/);
    if (!match) return;
    for (const name of match[1].split(/\s*,\s*/)) if (exported(name)) target.push({ name, file });
  }
  for (const keyword of ["const", "var"]) {
    const re = new RegExp(`^${keyword}\\s*(\\([^]*?\\)|[^\\n;]+)`, "gm");
    for (let match; (match = re.exec(code));) {
      const chunk = match[1];
      const lines = chunk.startsWith("(") ? chunk.slice(1, -1).split("\n") : [chunk];
      for (const line of lines) addNames(line, keyword === "const" ? constants : variables, filename);
    }
  }
  const uniq = (values) => [...new Map(values.map((value) => [`${value.name}:${value.signature || ""}:${value.receiver || ""}`, value])).values()];
  return { functions: uniq(functions), methods: uniq(methods), types: uniq(types), constants: uniq(constants), variables: uniq(variables), errors: [...errors].filter(exported) };
}

export function inventory() {
  const result = [];
  for (const item of packages) {
    if (item.ecosystem === "npm") continue;
    const module = moduleFor(item);
    const repo = path.join(workspace, item.repository);
    const files = packageFiles(item);
    const surface = files.map((file) => parseSource(show(repo, module.commit, file), file));
    result.push({
      repository: item.repository,
      module: item.module,
      importPath: item.path,
      relativePath: relativePackagePath(item),
      commit: module.commit,
      tag: module.publication?.tag || null,
      files,
      tests: packageTests(item),
      functions: surface.flatMap((x) => x.functions),
      methods: surface.flatMap((x) => x.methods),
      types: surface.flatMap((x) => x.types).map((type) => ({ ...type, error: surface.some((x) => x.errors.includes(type.name)) })),
      constants: surface.flatMap((x) => x.constants),
      variables: surface.flatMap((x) => x.variables),
      errors: [...new Set(surface.flatMap((x) => x.errors))],
    });
  }
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) process.stdout.write(`${JSON.stringify(inventory(), null, 2)}\n`);
