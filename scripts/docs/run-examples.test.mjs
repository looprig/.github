import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  buildGoMod,
  executeReleasedGoModule,
  loadManifest,
  planExample,
  validateAgainstSchema,
  validateProgressiveManifest,
  withTemporaryDirectory,
} from './run-examples.mjs';

const repositoryRoot = join(import.meta.dirname, '../..');
const schema = JSON.parse(readFileSync(join(repositoryRoot, 'docs/_schema/examples.schema.json'), 'utf8'));

function fixture(overrides = {}) {
  return {
    id: 'stage-01-inference',
    stage: 1,
    owner: 'inference',
    ecosystem: 'go',
    sourcePath: 'examples/go/progressive/stage01_inference',
    availability: 'released',
    versions: {
      'github.com/looprig/core': 'v0.5.1',
      'github.com/looprig/inference': 'v0.10.0',
    },
    offlineCommand: 'node scripts/docs/run-examples.mjs --stage 1',
    assertion: 'prints a deterministic response',
    workflowPath: '.github/workflows/docs-examples.yml',
    jobId: 'docs-examples',
    cleanup: 'runner removes its temporary module',
    proofIds: ['progressive:stage-01'],
    ...overrides,
  };
}

test('loadManifest rejects missing progressive stages before execution', () => {
  const root = mkdtempSync(join(tmpdir(), 'looprig-progressive-manifest-'));
  const path = join(root, 'examples.json');
  writeFileSync(path, JSON.stringify({ progressive: true, examples: [fixture()] }));

  assert.throws(
    () => loadManifest(path),
    /missing progressive stages: 2, 3, 4/i,
  );
});

test('validateProgressiveManifest rejects mutable and replacement versions', () => {
  const mutable = fixture({ versions: { 'github.com/looprig/inference': 'latest' } });
  const replacement = fixture({ versions: { 'github.com/looprig/inference': '../inference' } });

  assert.match(validateProgressiveManifest({ progressive: true, examples: [mutable] }, { requireAll: false }).join('\n'), /immutable semantic version/i);
  assert.match(validateProgressiveManifest({ progressive: true, examples: [replacement] }, { requireAll: false }).join('\n'), /immutable semantic version|replace/i);
});

test('the checked schema requires normalized central execution fields', () => {
  const manifest = { progressive: true, examples: [fixture()] };
  assert.deepEqual(validateAgainstSchema(manifest, schema), []);
  for (const field of ['stage', 'ecosystem', 'sourcePath', 'availability']) {
    const incomplete = structuredClone(manifest);
    delete incomplete.examples[0][field];
    assert.match(validateAgainstSchema(incomplete, schema).join('\n'), new RegExp(field, 'i'));
  }
});

test('stage range, ecosystem, availability, and source marker consistency are explicit', () => {
  assert.match(validateProgressiveManifest({ progressive: true, examples: [fixture({ stage: 24 })] }, { requireAll: false }).join('\n'), /stage.*1 through 23/i);
  assert.match(validateProgressiveManifest({ progressive: true, examples: [fixture({ ecosystem: 'python' })] }, { requireAll: false }).join('\n'), /go ecosystem/i);
  assert.match(validateProgressiveManifest({ progressive: true, examples: [fixture({ availability: 'source-workspace' })] }, { requireAll: false }).join('\n'), /source-workspace.*stage/i);

  const mixedSource = fixture({
    stage: 18,
    owner: 'workflows',
    availability: 'source-workspace',
    versions: {
      'github.com/looprig/workflows': 'source-workspace',
      'github.com/looprig/core': 'v0.5.1',
    },
  });
  assert.deepEqual(validateProgressiveManifest({ progressive: true, examples: [mixedSource] }, { requireAll: false }), []);
  mixedSource.versions['github.com/looprig/workflows'] = 'v0.1.0';
  assert.match(validateProgressiveManifest({ progressive: true, examples: [mixedSource] }, { requireAll: false }).join('\n'), /requires a source-workspace version marker/i);
});

test('central source paths are safe and released source paths resolve', () => {
  const unsafe = fixture({ sourcePath: '../inference/main.go' });
  assert.match(validateProgressiveManifest({ progressive: true, examples: [unsafe] }, { requireAll: false }).join('\n'), /safe repository-relative path/i);
  assert.throws(() => planExample(fixture(), { repositoryRoot }), /source directory.*not found/i);
});

test('buildGoMod contains only immutable requirements and no replace directive', () => {
  const goMod = buildGoMod(fixture());

  assert.match(goMod, /^module github\.com\/looprig\/\.github\/examples\/go\/progressive$/m);
  assert.match(goMod, /github\.com\/looprig\/inference v0\.10\.0/);
  assert.doesNotMatch(goMod, /^replace\b/m);
});

test('released stages require a directory before a clean-module run is planned', () => {
  const root = mkdtempSync(join(tmpdir(), 'looprig-progressive-source-'));

  assert.throws(() => planExample(fixture(), { repositoryRoot: root }), /source directory.*not found/i);
  mkdirSync(join(root, 'examples/go/progressive/stage01_inference'), { recursive: true });
  writeFileSync(join(root, 'examples/go/progressive/stage01_inference/main.go'), 'package main\n');
  assert.equal(planExample(fixture(), { repositoryRoot: root }).kind, 'released-go');
});

test('source-workspace stages are delegated and never planned as clean modules', () => {
  for (const [stage, owner, ecosystem] of [[18, 'workflows', 'go'], [20, 'client', 'typescript']]) {
    const example = fixture({
      id: `stage-${stage}`,
      stage,
      owner,
      ecosystem,
      sourcePath: `${owner}/examples/docs/stage${stage}`,
      availability: 'source-workspace',
      versions: { [owner]: 'source-workspace' },
    });
    const plan = planExample(example, { repositoryRoot: '/does/not/matter' });
    assert.deepEqual(plan, { kind: 'source-workspace', example });
  }
});

test('source-workspace hooks stay bound to their owning repository and ecosystem', () => {
  const wrongOwner = fixture({
    stage: 18,
    owner: 'client',
    availability: 'source-workspace',
    versions: { client: 'source-workspace' },
  });
  const wrongEcosystem = fixture({
    stage: 20,
    owner: 'client',
    ecosystem: 'go',
    availability: 'source-workspace',
    versions: { client: 'source-workspace' },
  });
  assert.match(validateProgressiveManifest({ progressive: true, examples: [wrongOwner] }, { requireAll: false }).join('\n'), /stage 18.*workflows/i);
  assert.match(validateProgressiveManifest({ progressive: true, examples: [wrongEcosystem] }, { requireAll: false }).join('\n'), /stage 20.*npm/i);
});

test('temporary lifecycle creates and cleans up once with bounded retry options', () => {
  const creations = [];
  const removals = [];
  const result = withTemporaryDirectory('stage-', () => 'finished', {
    temporaryRoot: '/virtual-root',
    makeTemporaryDirectory: (prefix) => {
      creations.push(prefix);
      return '/virtual/stage-one';
    },
    removeTemporaryDirectory: (path, options) => removals.push({ path, options }),
  });

  assert.equal(result, 'finished');
  assert.deepEqual(creations, ['/virtual-root/stage-']);
  assert.deepEqual(removals, [{
    path: '/virtual/stage-one',
    options: { recursive: true, force: true, maxRetries: 5, retryDelay: 100 },
  }]);
});

test('temporary lifecycle rethrows the same primary error after successful cleanup', () => {
  const primary = new Error('stage failed');
  let caught;
  try {
    withTemporaryDirectory('stage-', () => { throw primary; }, {
      makeTemporaryDirectory: () => '/virtual/stage-two',
      removeTemporaryDirectory: () => {},
    });
  } catch (error) {
    caught = error;
  }
  assert.strictEqual(caught, primary);
  assert.equal(Object.hasOwn(caught, 'cleanupError'), false);
});

test('temporary lifecycle retains the primary error and attaches cleanup diagnostics', () => {
  const primary = new Error('stage failed');
  const cleanup = new Error('cleanup failed');
  let caught;
  try {
    withTemporaryDirectory('stage-', () => { throw primary; }, {
      makeTemporaryDirectory: () => '/virtual/stage-three',
      removeTemporaryDirectory: () => { throw cleanup; },
    });
  } catch (error) {
    caught = error;
  }
  assert.strictEqual(caught, primary);
  assert.strictEqual(caught.cleanupError, cleanup);
  assert.equal(caught.message, 'stage failed');
});

test('temporary lifecycle surfaces cleanup failure when the body succeeds', () => {
  const cleanup = new Error('cleanup only');
  assert.throws(
    () => withTemporaryDirectory('stage-', () => 'finished', {
      makeTemporaryDirectory: () => '/virtual/stage-four',
      removeTemporaryDirectory: () => { throw cleanup; },
    }),
    (error) => error === cleanup,
  );
});

test('temporary lifecycle removes a real non-empty temporary directory', () => {
  let created;
  withTemporaryDirectory('looprig-runner-lifecycle-', (directory) => {
    created = directory;
    writeFileSync(join(directory, 'proof.txt'), 'temporary');
    assert.equal(existsSync(directory), true);
  });
  assert.equal(existsSync(created), false);
});

test('released Go execution downloads all, verifies, then runs readonly with a neutral environment', () => {
  withTemporaryDirectory('looprig-go-command-plan-', (directory) => {
    const goMod = buildGoMod(fixture());
    writeFileSync(join(directory, 'go.mod'), goMod);
    const calls = [];
    executeReleasedGoModule(directory, {
      baseEnvironment: {
        PATH: '/bin',
        GOPROXY: 'https://proxy.example.test,direct',
        GOSUMDB: 'sum.example.test',
        GOPRIVATE: 'private.example.test',
        GONOSUMDB: 'nosum.example.test',
        GOWORK: '/untrusted/go.work',
        GOENV: '/untrusted/goenv',
        GOFLAGS: '-mod=vendor',
        GOTOOLCHAIN: 'auto',
      },
      executeCommand: (command, args, cwd, environment) => calls.push({ command, args, cwd, environment }),
    });

    assert.deepEqual(calls.map(({ command, args }) => [command, args]), [
      ['go', ['mod', 'download', 'all']],
      ['go', ['mod', 'verify']],
      ['go', ['run', '-mod=readonly', '.']],
    ]);
    assert.equal(calls.length, 3);
    for (const { cwd, environment } of calls) {
      assert.equal(cwd, directory);
      assert.equal(environment.GOWORK, 'off');
      assert.equal(environment.GOMODCACHE, join(directory, '.gomodcache'));
      assert.equal(environment.GOCACHE, join(directory, '.gocache'));
      assert.equal(environment.GOTOOLCHAIN, 'local');
      assert.equal(environment.GOENV, 'off');
      assert.equal(environment.GOFLAGS, '');
      assert.equal(environment.GOPROXY, 'https://proxy.example.test,direct');
      assert.equal(environment.GOSUMDB, 'sum.example.test');
      assert.equal(environment.GOPRIVATE, 'private.example.test');
      assert.equal(environment.GONOSUMDB, 'nosum.example.test');
    }
    assert.equal(readFileSync(join(directory, 'go.mod'), 'utf8'), goMod);
    assert.doesNotMatch(goMod, /^replace\b/m);
  });
});

test('released Go execution rejects command mutation of go.mod before continuing', () => {
  withTemporaryDirectory('looprig-go-mod-immutability-', (directory) => {
    const goModPath = join(directory, 'go.mod');
    writeFileSync(goModPath, buildGoMod(fixture()));
    let calls = 0;
    assert.throws(
      () => executeReleasedGoModule(directory, {
        executeCommand: () => {
          calls += 1;
          writeFileSync(goModPath, `${readFileSync(goModPath, 'utf8')}\nreplace example.com/changed => ../changed\n`);
        },
      }),
      /go\.mod.*changed|replace directive/i,
    );
    assert.equal(calls, 1);
  });
});
