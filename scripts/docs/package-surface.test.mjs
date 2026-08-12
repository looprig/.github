import assert from 'node:assert/strict';
import { join } from 'node:path';
import test from 'node:test';

import { resolveWorkspaceRoot } from './package-surface.mjs';

test('resolves the outer workspace from the main .github checkout', () => {
  const workspace = '/workspace/looprig';

  assert.equal(resolveWorkspaceRoot(join(workspace, '.github')), workspace);
});

test('resolves the outer workspace from a .github worktree checkout', () => {
  const workspace = '/workspace/looprig';

  assert.equal(
    resolveWorkspaceRoot(join(workspace, '.github', '.worktrees', 'docs-reference')),
    workspace,
  );
});

test('allows a workspace root to be injected for standalone checkouts', () => {
  const workspace = '/workspace/looprig';
  const checkout = '/tmp/standalone/github-docs';

  assert.equal(
    resolveWorkspaceRoot(checkout, { env: { LOOPRIG_WORKSPACE_ROOT: workspace } }),
    workspace,
  );
});
