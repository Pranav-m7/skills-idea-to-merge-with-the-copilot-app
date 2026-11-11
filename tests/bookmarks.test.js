import assert from 'node:assert/strict';
import test from 'node:test';
import { formatBookmark, loadBookmarks, normalizeUrl } from '../src/lib/bookmarks.js';

test('normalizes URLs with and without https:// to the same value', () => {
  assert.equal(
    normalizeUrl('example.com/reading'),
    normalizeUrl('https://example.com/reading'),
  );
  assert.equal(normalizeUrl('example.com/reading'), 'https://example.com/reading');
});

test('recovers gracefully from empty, corrupted, legacy, and non-array storage values', () => {
  const invalidValues = [
    null,
    '',
    '   ',
    '{not-json',
    JSON.stringify({ url: 'https://example.com', slug: 'mona-7fk2' }),
    JSON.stringify(['https://example.com']),
    JSON.stringify([{ url: 'https://example.com', slug: 'old-slug' }]),
    JSON.stringify([{ url: 'javascript:alert(1)', slug: 'mona-7fk2' }]),
  ];

  for (const value of invalidValues) {
    assert.doesNotThrow(() => loadBookmarks(value));
    assert.deepEqual(loadBookmarks(value), []);
  }
});

test('drops malformed entries while retaining valid bookmarks from storage', () => {
  const stored = JSON.stringify([
    { url: 'example.com', slug: 'mona-7fk2' },
    { url: 'https://example.com', slug: 42 },
    null,
  ]);
  assert.deepEqual(loadBookmarks(stored), [
    { url: 'https://example.com/', slug: 'mona-7fk2' },
  ]);
});

test('formats a bookmark with the exact visible separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});
