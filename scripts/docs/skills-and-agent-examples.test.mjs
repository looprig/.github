import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "../..");
const read = (relative) => readFileSync(path.join(root, relative), "utf8");

const skillPages = [
  "index",
  "skill-md-format",
  "embedded-skills",
  "workspace-skills",
  "catalog-and-runtime-context",
  "registering-the-skill-tool",
  "gates-and-trust-boundaries",
  "errors-and-auditing",
].map((name) => `guides/harness/skills/${name}`);

const examplePages = ["examples/index", "examples/weather-assistant", "examples/research-assistant"];

test("Harness publishes the complete Skills guide in order", () => {
  const navigation = JSON.parse(read("docs/_data/navigation.json"));
  const actual = navigation.pages
    .map(({ path: pagePath }) => pagePath.replace(/\.md$/, ""))
    .filter((id) => id.startsWith("guides/harness/skills/"));

  assert.deepEqual(actual, skillPages);
  for (const id of skillPages) {
    const file = `docs/${id}.md`;
    assert.equal(existsSync(path.join(root, file)), true, `missing ${file}`);
    const markdown = read(file);
    assert.match(markdown, /```(?:go|text|yaml|mermaid)[\s\S]+?```/, `${id} needs technical material`);
    assert.match(markdown, /github\.com\/looprig\/tools/, `${id} needs a source link`);
  }
});

test("Examples publishes two complete agent applications", () => {
  const navigation = JSON.parse(read("docs/_data/navigation.json"));
  const actual = navigation.pages
    .map(({ path: pagePath }) => pagePath.replace(/\.md$/, ""))
    .filter((id) => id.startsWith("examples/"));
  assert.deepEqual(actual, examplePages);

  for (const name of ["weather-assistant", "research-assistant"]) {
    const page = read(`docs/examples/${name}.md`);
    assert.match(page, /^## What you will build$/m);
    assert.match(page, /^## Architecture$/m);
    assert.match(page, /```mermaid[\s\S]+?```/);
    assert.match(page, /^## Project structure$/m);
    assert.match(page, /```text[\s\S]+?```/);
    assert.match(page, /^## Run it$/m);
    assert.match(page, /GOWORK=off go test -race \.\/\.\.\./);
    assert.match(page, /GOWORK=off go run \./);
    assert.match(page, /^## Expected interaction$/m);
    assert.match(page, /^## Use a live model$/m);
    assert.match(page, /^## Try next$/m);
  }
});

test("each agent example is a standalone released-version Go module", () => {
  for (const name of ["weather-assistant", "research-assistant"]) {
    const directory = `examples/go/agents/${name}`;
    for (const relative of ["go.mod", "main.go", "main_test.go", "skills"]) {
      assert.equal(existsSync(path.join(root, directory, relative)), true, `missing ${directory}/${relative}`);
    }
    const goMod = read(`${directory}/go.mod`);
    assert.doesNotMatch(goMod, /^replace\s/m);
    assert.match(goMod, /github\.com\/looprig\/harness v\d+\.\d+\.\d+/);
    assert.match(goMod, /github\.com\/looprig\/tools v\d+\.\d+\.\d+/);
    const source = read(`${directory}/main.go`);
    assert.match(source, /go:embed skills\/\*\/SKILL\.md/);
    assert.match(source, /skill\.NewEmbeddedSkillLoader/);
    assert.match(source, /skill\.NewSkill/);
    assert.match(source, /loop\.WithTools/);
    assert.match(source, /rig\.Define/);
    assert.match(source, /SubscribeEvents/);
    assert.match(source, /Shutdown/);
  }
});

test("the examples document optional live integrations without requiring them", () => {
  const weather = read("docs/examples/weather-assistant.md");
  assert.match(weather, /OpenAI|Anthropic|Ollama/);
  assert.match(weather, /hosted or local model/i);

  const research = read("docs/examples/research-assistant.md");
  assert.match(research, /MCP/);
  assert.match(research, /delegat/i);
  assert.match(research, /citation/i);
  assert.match(research, /workspace/i);
});
