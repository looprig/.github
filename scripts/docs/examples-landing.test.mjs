import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const repositoryRoot = join(import.meta.dirname, '../..');
const landingPage = readFileSync(join(repositoryRoot, 'docs/examples/index.md'), 'utf8');

function escaped(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('Examples landing page presents small source-backed recipes', () => {
  assert.match(landingPage, /^title: Build a small agent$/m);
  assert.match(landingPage, /^description: .+source-backed.+$/m);
  assert.match(landingPage, /^# Build a small agent$/m);
  assert.match(landingPage, /Start with a small task/);

  for (const heading of [
    'The hello agent',
    'The full session assistant',
    'The safe shell boundary',
    'The durable approval workflow',
  ]) {
    assert.match(landingPage, new RegExp(`^### ${escaped(heading)}$`, 'm'));
  }
  assert.doesNotMatch(landingPage, /Reviewed examples|progressive example manifest|^Stage 1[789]:/im);
});

test('Each recipe links to the exact runnable source and a canonical guide', () => {
  const sourcePaths = [
    'examples/go/progressive/stage01_inference/main.go',
    'examples/go/guides/harness-quickstart/main.go',
    'examples/go/progressive/stage11_sandbox_process/main.go',
    'examples/go/progressive/stage17_flow/main.go',
  ];
  for (const sourcePath of sourcePaths) {
    assert.match(landingPage, new RegExp(`https://github\\.com/looprig/\\.github/blob/main/${escaped(sourcePath)}`));
  }

  for (const guidePath of [
    '/docs/start/model-call/',
    '/docs/start/first-run/',
    '/docs/build/11-sandbox/',
    '/docs/build/06-flows/',
  ]) {
    assert.match(landingPage, new RegExp(`\\]\\(${escaped(guidePath)}\\)`));
  }
});

test('Code excerpts are comments plus lines copied from the linked sources', () => {
  for (const snippet of [
    'fakeinference.New(fakeinference.Text("Hello from Looprig."))',
    'loop.Define(',
    'WorkspaceRoot: workspace',
    'flow.StatefulInterrupt(ctx, "approve "+change, 1)',
  ]) {
    assert.match(landingPage, new RegExp(escaped(snippet)));
  }
  const goFences = [...landingPage.matchAll(/```go\n([\s\S]*?)```/g)].map((match) => match[1]);
  assert.equal(goFences.length, 4, 'each recipe should have one Go excerpt');
  for (const excerpt of goFences) assert.match(excerpt, /\/\//, 'each excerpt should explain itself with a comment');
});

test('Runnable commands identify the checked fixture for every recipe', () => {
  for (const command of [
    'node scripts/docs/run-examples.mjs --stage 1',
    'cd examples/go/guides/harness-quickstart && GOWORK=off go test ./...',
    'node scripts/docs/run-examples.mjs --stage 11',
    'node scripts/docs/run-examples.mjs --stage 17',
  ]) {
    assert.match(landingPage, new RegExp(escaped(command)));
  }
});
