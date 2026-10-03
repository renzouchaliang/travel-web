import assert from 'node:assert/strict';
import { test } from 'node:test';
import worker from '../worker/index.ts';

const secret = 'server-only-test-code';
const env = { ASSETS: { fetch: async () => new Response('static asset') }, AMAP_SECURITY_JS_CODE: secret };
const request = (path: string, method = 'GET') => new Request(`https://travel-web.renzouchaliang.workers.dev${path}`, { method });

test('non-proxy routes preserve static assets and SPA handling', async () => {
  assert.equal(await (await worker.fetch(request('/trips/changsha-2026-10/'), env)).text(), 'static asset');
});
test('missing secret, invalid paths and methods fail without an upstream request', async () => {
  assert.equal((await worker.fetch(request('/_AMapService/v3/vectormap'), { ...env, AMAP_SECURITY_JS_CODE: undefined })).status, 503);
  for (const path of ['/_AMapService', '/_AMapService//evil.example/x', '/_AMapService/v3/%2f%2fevil.example']) {
    assert.equal((await worker.fetch(request(path), env)).status, 404);
  }
  assert.equal((await worker.fetch(request('/_AMapService/v3/vectormap', 'POST'), env)).status, 405);
});
test('AMap service mapping injects the server secret and strips upstream headers', async () => {
  const original = globalThis.fetch;
  try {
    for (const [path, host] of [['/v4/map/styles', 'webapi.amap.com'], ['/v3/vectormap', 'fmap01.amap.com'], ['/v3/config/district', 'restapi.amap.com']]) {
      globalThis.fetch = async (input, init) => {
        const url = new URL(String(input));
        assert.equal(url.hostname, host);
        assert.equal(url.pathname, path);
        assert.equal(url.searchParams.get('jscode'), secret);
        assert.equal(url.searchParams.getAll('jscode').length, 1);
        assert.equal(url.searchParams.get('key'), 'public-key');
        assert.equal(init?.redirect, 'manual');
        assert.equal(new Headers(init?.headers).has('cookie'), false);
        return new Response('map payload', { headers: { 'Content-Type': 'application/octet-stream', 'Set-Cookie': 'private', 'Location': `https://example.com/?jscode=${secret}` } });
      };
      const response = await worker.fetch(request(`/_AMapService${path}?key=public-key&jscode=client-value&jscode=another`), env);
      assert.equal(await response.text(), 'map payload');
      assert.equal(response.headers.get('Cache-Control'), 'no-store');
      assert.equal(response.headers.has('Set-Cookie'), false);
      assert.equal(response.headers.has('Location'), false);
    }
  } finally { globalThis.fetch = original; }
});
test('redirects and upstream failures never disclose upstream details', async () => {
  const original = globalThis.fetch;
  try {
    for (const status of [302, 403, 500]) {
      globalThis.fetch = async () => new Response(secret, { status, headers: { Location: `https://example.com/${secret}` } });
      const response = await worker.fetch(request('/_AMapService/v3/vectormap'), env);
      assert.equal(response.status, 502);
      assert.equal((await response.text()).includes(secret), false);
      assert.equal(response.headers.has('Location'), false);
    }
    globalThis.fetch = async () => { throw new Error(secret); };
    assert.equal(await (await worker.fetch(request('/_AMapService/v3/vectormap'), env)).text(), 'Map service unavailable');
  } finally { globalThis.fetch = original; }
});
