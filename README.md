# travel-web

A lightweight workspace for publishing interactive travel guides with React, TypeScript, Vite, and plain CSS. Different trips can use different layouts and visual identities. The optional `travel-template-v1` uses an isolated AMap adapter; other trips remain free to choose another layout or provider. No router, CMS, or UI library is required.

The original setup demo remains at `/`. Select `/?template=travel-template-v1` for the optional, clearly labeled travel-template demo, or add `&fixture=multi-day` for the independent two-day development fixture. See [template documentation](src/templates/travel-template-v1/README.md) for component structure, trip data, themes, map prerequisites, responsive behavior, and validation. Real travel information and a live map are not configured.

## Development

Use Node.js 24 (see `.node-version`) and npm:

```sh
npm ci
npm run dev
```

The development server uses port 5173 by default. In a cloud workspace with a restricted home directory, use `npm ci --cache /tmp/travel-web-npm-cache`.

```sh
npm run typecheck
npm run build
npm run preview
```

`build` runs strict TypeScript checking and produces `dist/`. `preview` serves production output on port 4173 by default, for local validation. The optional template has a browser integration fixture and verification script; see its documentation for test prerequisites.

## Project structure

```text
src/main.tsx       React entry point
src/App.tsx        Minimal setup demo; replace or compose for a real guide
src/styles.css    Minimal responsive CSS
public/           Files copied into the build, including Cloudflare headers
index.html        Document metadata and application root
vite.config.ts    Frontend build configuration
AGENTS.md         Guidance for future work
src/templates/    Optional travel-template components and scoped themes
src/trips/        Independent travel data and clearly labeled demo fixtures
src/types/        Travel contracts and reference validation
src/maps/         Provider adapters
tests/            Development-only integration harness and browser checks
docs/             Attached travel-template-v1 specification
```

For real trips, introduce `src/trips/<trip>/` for trip-specific data and layouts, and `src/components/` for components genuinely shared across guides. These are suggestions, not a fixed template. Typed data or JSON can hold itinerary days, places, coordinates, routes, captions, notes, and external links. React components can compose that content in any layout. Long-form notes can initially use ordinary React markup; add Markdown tooling only if the authoring workflow requires it.

Put bundled photos in `src/assets/` for hashed build filenames, or public assets in `public/`. Use responsive images, useful alt text, and lazy loading for galleries. Map selection and route visualization remain open; separate future provider integration from trip data.

## Publishing to the existing Cloudflare Worker

Production uses `travel-web` at https://travel-web.renzouchaliang.workers.dev. Keep the existing Git-connected Worker and production branch `main`; do not create a separate Pages project. `wrangler.jsonc` deploys the Vite `dist/` assets and `worker/index.ts` together. Only `/_AMapService` requests run through the Worker first; other requests retain static asset serving and SPA fallback.

In the existing Worker's Cloudflare settings configure:

| Setting | Type / location | Value |
| --- | --- | --- |
| `AMAP_SECURITY_JS_CODE` | Runtime **Secret**, Settings → Variables and Secrets | The security code paired with your AMap JS API key |
| `VITE_AMAP_PUBLIC_KEY` | Build variable, Settings → Builds → Variables and secrets | Your browser-visible AMap JS API key |
| `VITE_AMAP_SERVICE_HOST` | Build variable, Settings → Builds → Variables and secrets | `https://travel-web.renzouchaliang.workers.dev/_AMapService` |

Keep the build command `npm run build`; the deploy command is `npx wrangler deploy`. Use the repository root and Node 24. A change to either `VITE_` variable requires a new build/deployment. Add the production hostname to the key's AMap domain allowlist. Never create a `VITE_AMAP_SECURITY_JS_CODE` variable or put the security code in build configuration. Wrangler reads the runtime secret binding; no secret value belongs in this repository.

The existing frontend adapter passes the public service-host URL to `window._AMapSecurityConfig.serviceHost` before loading the SDK. The server proxy adds `jscode` only to fixed AMap upstream requests: `/v4/map/styles` uses `webapi.amap.com`, `/v3/vectormap` uses `fmap01.amap.com`, and other versioned services use `restapi.amap.com`. Client cookies and authorization headers are not forwarded. Redirects and upstream errors return a generic error without upstream URLs. Missing runtime configuration returns HTTP 503. This does not enable driving/transit routing; the template continues drawing simple stop-sequence polylines.

For local Worker verification, build with the public variables (copy `.env.example` to `.env.local`, using a localhost service host for local testing), put the runtime secret in ignored `.dev.vars`, and run `npx wrangler dev`. `npm run dev` and `npm run preview` serve only the frontend, not the proxy. Never commit `.dev.vars` or `.env.local`.

Validation:

```sh
npm ci
npm run typecheck
npm run build
node --experimental-strip-types --test tests/amap-proxy.test.ts
npx wrangler deploy --dry-run
```

After pushing, check the existing Cloudflare build/deployment status and open the Changsha page. Verify map loading and day switching after configuring both the runtime secret and build variables. No Cloudflare credential is needed to build locally; deployment uses the existing Cloudflare integration.
