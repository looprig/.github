import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join } from 'node:path';
import test from 'node:test';

import {
  buildGoMod,
  executeReleasedGoModule,
  formatRunnerFailure,
  loadManifest,
  planExample,
  validateAgainstSchema,
  validateProgressiveManifest,
  withTemporaryRoots,
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
  assert.throws(
    () => planExample(fixture({ sourcePath: 'examples/go/progressive/missing-stage' }), { repositoryRoot }),
    /source directory.*not found/i,
  );
  assert.equal(planExample(fixture(), { repositoryRoot }).kind, 'released-go');
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

test('temporary lifecycle creates distinct module and cache roots and cleans in fixed order', () => {
  const creations = [];
  const removals = [];
  const roots = ['/virtual/stage-module', '/virtual/stage-cache'];
  const result = withTemporaryRoots('stage-', (moduleRoot, cacheRoot) => ({ moduleRoot, cacheRoot }), {
    temporaryRoot: '/virtual-root',
    makeTemporaryDirectory: (prefix) => {
      creations.push(prefix);
      return roots[creations.length - 1];
    },
    removeTemporaryPath: (path, options) => removals.push({ path, options }),
  });

  assert.deepEqual(result, { moduleRoot: roots[0], cacheRoot: roots[1] });
  assert.deepEqual(creations, ['/virtual-root/stage-module-', '/virtual-root/stage-cache-']);
  assert.deepEqual(removals.map(({ path }) => path), [
    roots[0],
    join(roots[1], 'gobuild'),
    join(roots[1], 'gomod'),
    roots[1],
  ]);
  for (const { options } of removals) {
    assert.deepEqual(options, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
});

test('temporary lifecycle rethrows the same primary error after all cleanup succeeds', () => {
  const primary = new Error('stage failed');
  let caught;
  try {
    let creation = 0;
    withTemporaryRoots('stage-', () => { throw primary; }, {
      makeTemporaryDirectory: () => `/virtual/stage-${creation++}`,
      removeTemporaryPath: () => {},
    });
  } catch (error) {
    caught = error;
  }
  assert.strictEqual(caught, primary);
  assert.equal(Object.hasOwn(caught, 'cleanupError'), false);
});

test('temporary lifecycle retains the primary and aggregates cleanup failures in call order', () => {
  const primary = new Error('stage failed');
  const moduleCleanup = new Error('module cleanup failed');
  const gomodCleanup = new Error('gomod cleanup failed');
  const removals = [];
  let caught;
  try {
    const roots = ['/virtual/stage-module', '/virtual/stage-cache'];
    let creation = 0;
    withTemporaryRoots('stage-', () => { throw primary; }, {
      makeTemporaryDirectory: () => roots[creation++],
      removeTemporaryPath: (path) => {
        removals.push(path);
        if (path === roots[0]) throw moduleCleanup;
        if (path === join(roots[1], 'gomod')) throw gomodCleanup;
      },
    });
  } catch (error) {
    caught = error;
  }
  assert.strictEqual(caught, primary);
  assert.ok(caught.cleanupError instanceof AggregateError);
  assert.deepEqual(caught.cleanupError.errors, [moduleCleanup, gomodCleanup]);
  assert.deepEqual(removals, [
    '/virtual/stage-module',
    '/virtual/stage-cache/gobuild',
    '/virtual/stage-cache/gomod',
    '/virtual/stage-cache',
  ]);
  assert.equal(caught.message, 'stage failed');
  assert.deepEqual(formatRunnerFailure(caught), [
    'docs examples: stage failed',
    'docs examples cleanup: module cleanup failed',
    'docs examples cleanup: gomod cleanup failed',
  ]);
});

test('temporary lifecycle surfaces a cleanup failure when the body succeeds', () => {
  const cleanup = new Error('cleanup only');
  let creation = 0;
  assert.throws(
    () => withTemporaryRoots('stage-', () => 'finished', {
      makeTemporaryDirectory: () => `/virtual/stage-${creation++}`,
      removeTemporaryPath: (path) => {
        if (path.endsWith('/gobuild')) throw cleanup;
      },
    }),
    (error) => error === cleanup,
  );
});

test('temporary lifecycle removes real non-empty module and cache roots', () => {
  let moduleRoot;
  let cacheRoot;
  withTemporaryRoots('looprig-runner-lifecycle-', (module, cache) => {
    moduleRoot = module;
    cacheRoot = cache;
    writeFileSync(join(module, 'proof.txt'), 'temporary module');
    mkdirSync(join(cache, 'gomod'), { recursive: true });
    mkdirSync(join(cache, 'gobuild'), { recursive: true });
    writeFileSync(join(cache, 'gomod/module.zip'), 'temporary module cache');
    writeFileSync(join(cache, 'gobuild/object.a'), 'temporary build cache');
    assert.notEqual(module, cache);
  });
  assert.equal(existsSync(moduleRoot), false);
  assert.equal(existsSync(cacheRoot), false);
});

test('cache recreation during gomod cleanup cannot recreate the removed module root', () => {
  let moduleRoot;
  let cacheRoot;
  withTemporaryRoots('looprig-runner-recreation-', (module, cache) => {
    moduleRoot = module;
    cacheRoot = cache;
    mkdirSync(join(cache, 'gomod'), { recursive: true });
    writeFileSync(join(module, 'main.go'), 'package main\n');
  }, {
    removeTemporaryPath: (path, options) => {
      rmSync(path, options);
      if (path === join(cacheRoot, 'gomod')) {
        mkdirSync(join(cacheRoot, 'gomod'), { recursive: true });
        writeFileSync(join(cacheRoot, 'gomod/recreated'), 'late cache write');
      }
    },
  });
  assert.equal(existsSync(moduleRoot), false);
  assert.equal(existsSync(cacheRoot), false);
});

test('released Go execution downloads all, verifies, then runs readonly with a neutral environment', () => {
  withTemporaryRoots('looprig-go-command-plan-', (moduleRoot, cacheRoot) => {
    const goMod = buildGoMod(fixture());
    writeFileSync(join(moduleRoot, 'go.mod'), goMod);
    const calls = [];
    executeReleasedGoModule(moduleRoot, cacheRoot, {
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
      assert.equal(cwd, moduleRoot);
      assert.equal(environment.GOWORK, 'off');
      assert.equal(environment.GOMODCACHE, join(cacheRoot, 'gomod'));
      assert.equal(environment.GOCACHE, join(cacheRoot, 'gobuild'));
      assert.equal(isAbsolute(environment.GOMODCACHE), true);
      assert.equal(isAbsolute(environment.GOCACHE), true);
      assert.equal(environment.GOMODCACHE.startsWith(moduleRoot), false);
      assert.equal(environment.GOCACHE.startsWith(moduleRoot), false);
      assert.equal(environment.GOTOOLCHAIN, 'local');
      assert.equal(environment.GOENV, 'off');
      assert.equal(environment.GOFLAGS, '');
      assert.equal(environment.GOPROXY, 'https://proxy.example.test,direct');
      assert.equal(environment.GOSUMDB, 'sum.example.test');
      assert.equal(environment.GOPRIVATE, 'private.example.test');
      assert.equal(environment.GONOSUMDB, 'nosum.example.test');
    }
    assert.equal(readFileSync(join(moduleRoot, 'go.mod'), 'utf8'), goMod);
    assert.doesNotMatch(goMod, /^replace\b/m);
  });
});

test('released Go execution rejects command mutation of go.mod before continuing', () => {
  withTemporaryRoots('looprig-go-mod-immutability-', (moduleRoot, cacheRoot) => {
    const goModPath = join(moduleRoot, 'go.mod');
    writeFileSync(goModPath, buildGoMod(fixture()));
    let calls = 0;
    assert.throws(
      () => executeReleasedGoModule(moduleRoot, cacheRoot, {
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
