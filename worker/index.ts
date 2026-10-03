/** Server-only AMap security proxy. Never import this module into src/. */
export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  AMAP_SECURITY_JS_CODE?: string;
}

const prefix = '/_AMapService';
const failure = (status: number, message: string) => new Response(message, {
  status, headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' },
});

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== prefix && !url.pathname.startsWith(`${prefix}/`)) {
      return env.ASSETS.fetch(request);
    }
    if (request.method !== 'GET') return failure(405, 'Method not allowed');
    if (!env.AMAP_SECURITY_JS_CODE) return failure(503, 'Map service is not configured');

    const path = url.pathname.slice(prefix.length);
    // Fixed upstreams from the AMap JS API security-proxy protocol.
    // Reject authority/path escapes; never accept a caller-provided target host.
    if (!/^\/v[345]\/[a-zA-Z0-9/_-]+$/.test(path)) return failure(404, 'Unknown map service');
    const host = path === '/v4/map/styles' || path.startsWith('/v4/map/styles/')
      ? 'webapi.amap.com'
      : path === '/v3/vectormap' || path.startsWith('/v3/vectormap/')
        ? 'fmap01.amap.com' : 'restapi.amap.com';
    const upstream = new URL(path, `https://${host}`);
    upstream.search = url.search;
    upstream.searchParams.set('jscode', env.AMAP_SECURITY_JS_CODE);

    try {
      const response = await fetch(upstream, {
        method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(15000),
        headers: { Accept: request.headers.get('Accept') ?? '*/*' },
      });
      // Do not forward redirects, upstream diagnostics, cookies, or request URLs.
      if (!response.ok) return failure(502, 'Map service unavailable');
      const headers = new Headers({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      const contentType = response.headers.get('Content-Type');
      if (contentType) headers.set('Content-Type', contentType);
      return new Response(response.body, { status: response.status, headers });
    } catch {
      return failure(502, 'Map service unavailable');
    }
  },
};
