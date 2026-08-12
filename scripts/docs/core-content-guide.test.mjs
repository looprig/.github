import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const guide = readFileSync(
  path.resolve(import.meta.dirname, '../../docs/modules/core.md'),
  'utf8',
);

test('Core guide constructs and explains every conversation message type', () => {
  for (const symbol of ['UserMessage', 'SystemMessage', 'AIMessage', 'ToolResultMessage', 'AgenticMessages']) {
    assert.match(guide, new RegExp(`type ${symbol}|content\\.${symbol}`));
  }
  assert.match(guide, /AIMessage[\s\S]+ThinkingBlock[\s\S]+ToolUseBlock/);
  assert.match(guide, /ToolResultMessage[\s\S]+ToolUseID[\s\S]+IsError/);
  assert.match(guide, /```go[\s\S]+RoleAssistant[\s\S]+ReasoningTokens[\s\S]+```/);
});

test('Core guide enumerates blocks, chunks, codecs, and type-safe consumption', () => {
  for (const symbol of [
    'TextBlock', 'ImageBlock', 'AudioBlock', 'DocumentBlock', 'ThinkingBlock',
    'ToolUseBlock', 'ToolResultBlock', 'TextChunk', 'ThinkingChunk', 'ToolUseChunk',
    'MarshalBlock', 'UnmarshalBlock', 'ReplayableAs',
  ]) {
    assert.match(guide, new RegExp(symbol));
  }
  assert.match(guide, /switch block := block\.\(type\)/);
  assert.match(guide, /streamaccumulator\.ToolUses/);
  assert.match(guide, /github\.com\/looprig\/core\/tree\/v0\.5\.1\/examples\/content/);
});
