import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { resolveWorkspaceRoot } from "./package-surface.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const workspace = resolveWorkspaceRoot(root);
const clientTag = "v0.3.0";

const pages = [
  ["guides/web-ui/index", "Web UI"],
  ["guides/web-ui/client-sdk/index", "Client SDK"],
  ["guides/web-ui/client-sdk/factory-rest", "Factory REST client"],
  ["guides/web-ui/client-sdk/clientlink", "ClientLink and live streams"],
  ["guides/web-ui/client-sdk/live-previews", "Live text and reasoning previews"],
  ["guides/web-ui/client-sdk/commands", "Commands and gates"],
  ["guides/web-ui/client-sdk/fold", "Folding session state"],
  ["guides/web-ui/client-sdk/validation", "Validation and errors"],
  ["guides/web-ui/client-sdk/auth", "Authentication and recovery"],
  ["guides/web-ui/react/index", "React"],
  ["guides/web-ui/react/link-and-identity", "Link and identity providers"],
  ["guides/web-ui/react/session-view", "Session views and lists"],
  ["guides/web-ui/react/controls", "Composer, gates, and interrupt"],
  ["guides/web-ui/embedding/index", "Embedding"],
  ["guides/web-ui/embedding/static-bundle", "Static bundle"],
  ["guides/web-ui/embedding/app-integration", "Application integration"],
  ["guides/web-ui/sessions/index", "Session lifecycle"],
  ["guides/web-ui/sessions/binding", "Binding a session"],
  ["guides/web-ui/sessions/reconnect", "Reconnect and exact joins"],
  ["guides/web-ui/sessions/restore", "Restore a session"],
];

// The browser packages are npm-only. Their released source is the client repository at the
// tag that published @looprig/client and @looprig/react 0.3.0.
function existsAtTag(repo, tag, file) {
  try {
    execFileSync("git", ["-C", path.join(workspace, repo), "cat-file", "-e", `${tag}:${file}`], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function readPage(id) {
  const file = path.join(root, "docs", `${id}.md`);
  assert.equal(fs.existsSync(file), true, `missing Web UI page ${id}`);
  return fs.readFileSync(file, "utf8");
}

function frontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, "Web UI page must have frontmatter");
  return match[1];
}

function slug(heading) {
  return heading
    .replaceAll("`", "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function regexEscape(value) {
  return value.replace(/[\^$.*+?()[\]{}|]/g, "\\$&");
}

test("Web UI guide inventory is complete, ordered, and fully evidenced", () => {
  let previousOrder = -1;
  for (const [id, title] of pages) {
    const markdown = readPage(id);
    assert.match(markdown, new RegExp(`^id: ${id.replaceAll("/", "\\/")}$`, "m"));
    assert.match(markdown, new RegExp(`^title: ${title.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, "m"));
    assert.match(markdown, /^description: .+$/m);
    assert.match(markdown, /^audience: developer$/m);
    assert.match(markdown, /^section: guides$/m);
    assert.match(markdown, /^order: \d+$/m);
    assert.match(markdown, /^publication: released$/m);
    assert.match(markdown, new RegExp(`^# ${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"), `${id} must start its body with the page title`);
    const order = Number(markdown.match(/^order: (\d+)$/m)?.[1]);
    assert.equal(order, previousOrder + 1, `${id} must have the next order value`);
    previousOrder = order;
    const fm = frontmatter(markdown);
    assert.match(fm, /^proofs:\n(?:  .+\n)+/m, `${id} missing proofs`);
    assert.match(markdown, /^## Source$/m, `${id} missing Source section`);
    assert.match(markdown, /^## Proof$/m, `${id} missing Proof section`);
    for (const heading of markdown.matchAll(/^#{2,6} (.+)$/gm)) {
      assert.match(fm, new RegExp(`^  ${slug(heading[1])}:`, "m"), `${id} missing proof mapping for ${heading[1]}`);
    }
    assert.match(markdown, /```(?:ts|go)\n|^\| .+ \|$/m, `${id} needs typed technical content`);
    assert.doesNotMatch(markdown, /README|plans|GOWORK|repository setup|workspace setup|—/i, `${id} contains prohibited prose`);
    assert.doesNotMatch(markdown, /\]\(\.\.?\//, `${id} uses a relative internal link`);
  }
});

test("Web UI guides interlink the client SDK, React, embedding, sessions, and Harness", () => {
  const all = Object.fromEntries(pages.map(([id]) => [id, readPage(id)]));
  const link = (id, target) => assert.match(all[id], new RegExp(target.replaceAll("/", "\\/")), `${id} must link ${target}`);
  for (const target of ["client-sdk", "react", "embedding", "sessions"]) link("guides/web-ui/index", `/docs/guides/web-ui/${target}`);
  link("guides/web-ui/index", "/docs/guides/harness");
  link("guides/web-ui/index", "/docs/products/carbon");
  link("guides/web-ui/client-sdk/index", "/docs/guides/web-ui/client-sdk/factory-rest");
  link("guides/web-ui/client-sdk/index", "/docs/guides/web-ui/client-sdk/clientlink");
  link("guides/web-ui/client-sdk/clientlink", "/docs/guides/web-ui/client-sdk/live-previews");
  link("guides/web-ui/react/index", "/docs/guides/web-ui/client-sdk");
  link("guides/web-ui/embedding/index", "/docs/guides/web-ui/embedding/static-bundle");
  link("guides/web-ui/embedding/index", "/docs/guides/web-ui/embedding/app-integration");
  link("guides/web-ui/sessions/index", "/docs/guides/web-ui/sessions/(binding|reconnect|restore)");
  link("guides/web-ui/sessions/reconnect", "/docs/guides/web-ui/client-sdk");
});

test("Web UI guides link real source at released tags and never a mutable branch", () => {
  const links = /https:\/\/github\.com\/looprig\/([a-z0-9.-]+)\/blob\/([^/\s)]+)\/([^\s)`]+)/g;
  let clientLinks = 0;
  for (const [id] of pages) {
    const markdown = readPage(id);
    assert.doesNotMatch(markdown, /github\.com\/looprig\/[a-z0-9.-]+\/blob\/main\//, `${id} links a mutable branch`);
    let own = 0;
    for (const [, repo, tag, file] of markdown.matchAll(links)) {
      assert.match(tag, /^v\d+\.\d+\.\d+$/, `${id} links ${repo} at a non-release ref ${tag}`);
      if (repo === "client") {
        own++;
        clientLinks++;
        assert.equal(tag, clientTag, `${id} must link the client source at ${clientTag}`);
      }
      if (fs.existsSync(path.join(workspace, repo, ".git"))) {
        assert.equal(existsAtTag(repo, tag, file), true, `${id} links missing ${repo}@${tag}:${file}`);
      }
    }
    if (id !== "guides/web-ui/index" && !id.endsWith("/index")) assert.ok(own > 0, `${id} must link client source`);
  }
  assert.ok(clientLinks > 20, "expected the guides to link the client source");
});

test("Web UI guides describe the npm packages and retire the Go client and wui", () => {
  const all = pages.map(([id]) => readPage(id)).join("\n");
  for (const phrase of [
    "@looprig/client",
    "@looprig/react",
    "npm install",
    "0.3.0",
    "createFactoryClient",
    "createClientLink",
    "useFactorySessionView",
    "FactoryLinkProvider",
    "decodeFactoryLiveDelta",
    "WithUIHandler",
  ]) assert.match(all, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `missing contract phrase ${phrase}`);
  assert.match(all, /```mermaid[\s\S]*theme["']?\s*:\s*["']dark["']/i);
  assert.doesNotMatch(all, /go get github\.com\/looprig\/(client|wui)/, "the browser packages are not Go modules");
  assert.doesNotMatch(all, /modules\/(client|wui)\b/, "the client and wui module pages are retired");
  assert.doesNotMatch(all, /createBFFClient|LooprigTransport|SseFrameParser|joinSessionView/, "the retired serve client API must not appear");
  assert.match(readPage("guides/web-ui/index"), /retired/i);
});

test("retired client and wui module pages, guides, and examples stay out of the corpus", () => {
  for (const retired of ["modules/client.md", "modules/wui.md", "guides/web-ui/embedding/wui.md", "build/23-client.md"]) {
    assert.equal(fs.existsSync(path.join(root, "docs", retired)), false, `${retired} must be removed`);
  }
  const examples = JSON.parse(fs.readFileSync(path.join(root, "docs/_data/examples.json"), "utf8"));
  assert.equal(examples.examples.some(({ id }) => id === "stage-20-web-client"), false);
  const modules = JSON.parse(fs.readFileSync(path.join(root, "docs/_data/modules.json"), "utf8"));
  assert.equal(modules.modules.some(({ repository }) => repository === "client" || repository === "wui"), false);
});
