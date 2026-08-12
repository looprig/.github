import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const clientRoot = path.resolve(root, "../..", "client");

const pages = [
  ["guides/web-ui/index", "Web UI"],
  ["guides/web-ui/client-sdk/index", "Client SDK"],
  ["guides/web-ui/client-sdk/session-client", "SessionClient"],
  ["guides/web-ui/client-sdk/events", "Events and live streams"],
  ["guides/web-ui/client-sdk/commands", "Commands and gates"],
  ["guides/web-ui/client-sdk/fold", "Folding session state"],
  ["guides/web-ui/client-sdk/validation", "Validation and errors"],
  ["guides/web-ui/client-sdk/ownership", "Transport and ownership"],
  ["guides/web-ui/framework-adapters/index", "Framework adapters"],
  ["guides/web-ui/framework-adapters/vanilla", "Vanilla DOM"],
  ["guides/web-ui/framework-adapters/svelte", "Svelte 5"],
  ["guides/web-ui/embedding/index", "Embedding"],
  ["guides/web-ui/embedding/static-bundle", "Static bundle"],
  ["guides/web-ui/embedding/go-webui", "Go webui package"],
  ["guides/web-ui/embedding/app-integration", "Application integration"],
  ["guides/web-ui/sessions/index", "Session lifecycle"],
  ["guides/web-ui/sessions/binding", "Binding a session"],
  ["guides/web-ui/sessions/reconnect", "Reconnect and exact joins"],
  ["guides/web-ui/sessions/restore", "Restore a session"],
];

const sourceProof = {
  "guides/web-ui/index": ["sdk/core/src/index.ts", "sdk/core/examples/session-client.ts"],
  "guides/web-ui/client-sdk/index": ["sdk/core/src/client.ts", "sdk/core/src/transport.ts"],
  "guides/web-ui/client-sdk/session-client": ["sdk/core/examples/session-client.ts", "sdk/core/examples/session-client.test.ts"],
  "guides/web-ui/client-sdk/events": ["sdk/core/src/sse.ts", "sdk/core/test/sse.test.ts"],
  "guides/web-ui/client-sdk/commands": ["sdk/core/src/transport.ts", "sdk/core/test/conformance.test.ts"],
  "guides/web-ui/client-sdk/fold": ["sdk/core/src/fold.ts", "sdk/core/test/fold.test.ts"],
  "guides/web-ui/client-sdk/validation": ["sdk/core/src/validate.ts", "sdk/core/test/contract.test.ts"],
  "guides/web-ui/client-sdk/ownership": ["sdk/core/src/transport.ts", "sdk/core/test/serve-transport.test.ts"],
  "guides/web-ui/framework-adapters/index": ["sdk/core/examples/vanilla-session.ts", "sdk/svelte/src/index.ts"],
  "guides/web-ui/framework-adapters/vanilla": ["sdk/core/examples/vanilla-session.ts", "sdk/core/examples/session-client.test.ts"],
  "guides/web-ui/framework-adapters/svelte": ["sdk/svelte/src/live-session.svelte.ts", "sdk/svelte/test/live-session.test.ts"],
  "guides/web-ui/embedding/index": ["pkg/webui/webui.go", "app/vite.config.ts"],
  "guides/web-ui/embedding/static-bundle": ["app/vite.config.ts", "app/src/routes/+layout.ts"],
  "guides/web-ui/embedding/go-webui": ["pkg/webui/webui.go", "pkg/webui/webui_test.go"],
  "guides/web-ui/embedding/app-integration": ["internal/compose/handler.go", "internal/compose/handler_test.go"],
  "guides/web-ui/sessions/index": ["sdk/core/src/types.ts", "sdk/core/src/transport.ts"],
  "guides/web-ui/sessions/binding": ["sdk/core/examples/session-client.ts", "sdk/svelte/src/session.svelte.ts"],
  "guides/web-ui/sessions/reconnect": ["sdk/core/src/join.ts", "sdk/core/test/join.test.ts"],
  "guides/web-ui/sessions/restore": ["sdk/core/src/transport.ts", "sdk/core/test/conformance.test.ts"],
};

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

test("Web UI guides interlink SDK, adapters, embedding, sessions, and Harness", () => {
  const all = Object.fromEntries(pages.map(([id]) => [id, readPage(id)]));
  assert.match(all["guides/web-ui/index"], /\/docs\/guides\/web-ui\/client-sdk\//);
  assert.match(all["guides/web-ui/index"], /\/docs\/guides\/web-ui\/framework-adapters\//);
  assert.match(all["guides/web-ui/index"], /\/docs\/guides\/web-ui\/embedding\//);
  assert.match(all["guides/web-ui/index"], /\/docs\/guides\/web-ui\/sessions\//);
  assert.match(all["guides/web-ui/index"], /\/docs\/guides\/harness\//);
  assert.match(all["guides/web-ui/client-sdk/index"], /\/docs\/guides\/web-ui\/client-sdk\/session-client\//);
  assert.match(all["guides/web-ui/client-sdk/index"], /\/docs\/guides\/web-ui\/client-sdk\/events\//);
  assert.match(all["guides/web-ui/client-sdk/session-client"], /\/docs\/guides\/web-ui\/client-sdk\/commands\//);
  assert.match(all["guides/web-ui/client-sdk/events"], /\/docs\/guides\/web-ui\/client-sdk\/fold\//);
  assert.match(all["guides/web-ui/client-sdk/commands"], /\/docs\/guides\/web-ui\/client-sdk\/ownership\//);
  assert.match(all["guides/web-ui/framework-adapters/index"], /\/docs\/guides\/web-ui\/framework-adapters\/(vanilla|svelte)\//);
  assert.match(all["guides/web-ui/framework-adapters/svelte"], /\/docs\/guides\/web-ui\/client-sdk\//);
  assert.match(all["guides/web-ui/embedding/index"], /\/docs\/guides\/web-ui\/embedding\/static-bundle\//);
  assert.match(all["guides/web-ui/embedding/index"], /\/docs\/guides\/web-ui\/embedding\/go-webui\//);
  assert.match(all["guides/web-ui/embedding/app-integration"], /\/docs\/guides\/harness\//);
  assert.match(all["guides/web-ui/sessions/index"], /\/docs\/guides\/web-ui\/sessions\/(binding|reconnect|restore)\//);
  assert.match(all["guides/web-ui/sessions/reconnect"], /\/docs\/guides\/web-ui\/client-sdk\/events\//);
  assert.match(all["guides/web-ui/sessions/restore"], /\/docs\/guides\/web-ui\/client-sdk\/ownership\//);
});

test("Web UI guides link every proof claim to existing client source", () => {
  for (const [id, files] of Object.entries(sourceProof)) {
    const markdown = readPage(id);
    for (const file of files) {
      const url = `https://github.com/looprig/client/blob/main/${file}`;
      assert.match(markdown, new RegExp(regexEscape(url)), `${id} does not link ${file}`);
      assert.equal(fs.existsSync(path.join(clientRoot, file)), true, `missing client source ${file}`);
    }
  }
});

test("Web UI guides cover the public runtime contracts", () => {
  const all = pages.map(([id]) => readPage(id)).join("\n");
  for (const phrase of [
    "LooprigTransport",
    "createBFFClient",
    "ServeTransport",
    "SessionClient",
    "SseFrameParser",
    "joinSessionView",
    "SessionView",
    "ContractValidationError",
    "GATE_APPROVAL_ACTIONS",
    "autoReconnect",
    "restoreSession",
    "embed.FS",
    "adapter-static",
  ]) assert.match(all, new RegExp(phrase.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")), `missing contract phrase ${phrase}`);
  assert.match(all, /```mermaid[\s\S]*theme["']?\s*:\s*["']dark["']/i);
});
