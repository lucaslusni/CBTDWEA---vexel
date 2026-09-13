import test from 'node:test';
import assert from 'node:assert/strict';
import { isApiUrl } from '../src/app/api-url.ts';

test('allows only the configured origin and API path', () => {
  const api = 'https://api.example.test/v1/';
  for (const path of ['/v1', '/v1/vehicles', '/v1/reports?year=2025']) {
    assert.equal(isApiUrl('https://api.example.test' + path, api), true);
  }
  for (const url of [
    'https://api.example.test.evil.test/v1/vehicles',
    'https://other.example.test/v1/vehicles',
    'http://api.example.test/v1/vehicles',
    'https://api.example.test:444/v1/vehicles',
    'https://api.example.test/v10/vehicles',
    'https://api.example.test/other',
    'https://user:password@api.example.test/v1/vehicles',
    '//api.example.test/v1/vehicles',
    '/v1/vehicles',
    'not-a-url',
  ]) assert.equal(isApiUrl(url, api), false, url);
});

test('supports the current local API configuration', () => {
  assert.equal(isApiUrl('http://localhost:3001/vehicles', 'http://localhost:3001'), true);
  assert.equal(isApiUrl('http://localhost:30010/vehicles', 'http://localhost:3001'), false);
  assert.equal(isApiUrl('http://localhost:3001/vehicles', 'not-a-url'), false);
});

