# travel-web

A lightweight workspace for publishing interactive travel guides with React, TypeScript, Vite, and plain CSS. Different trips can use different layouts and visual identities. No map provider, fixed template, router, CMS, or UI library has been selected.

The demo contains only a two-day selector to verify rendering and interaction. Maps, routes, place cards, galleries, and real travel content will be added when a guide is defined.

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

`build` runs strict TypeScript checking and produces `dist/`. `preview` serves production output on port 4173 by default, for local validation. There is no committed automated test suite yet; verify the demo buttons in a browser.

## Project structure

```text
src/main.tsx       React entry point
src/App.tsx        Minimal setup demo; replace or compose for a real guide
src/styles.css    Minimal responsive CSS
public/           Files copied into the build, including Cloudflare headers
index.html        Document metadata and application root
vite.config.ts    Frontend build configuration
AGENTS.md         Guidance for future work
```

For real trips, introduce `src/trips/<trip>/` for trip-specific data and layouts, and `src/components/` for components genuinely shared across guides. These are suggestions, not a fixed template. Typed data or JSON can hold itinerary days, places, coordinates, routes, captions, notes, and external links. React components can compose that content in any layout. Long-form notes can initially use ordinary React markup; add Markdown tooling only if the authoring workflow requires it.

Put bundled photos in `src/assets/` for hashed build filenames, or public assets in `public/`. Use responsive images, useful alt text, and lazy loading for galleries. Map selection and route visualization remain open; separate future provider integration from trip data.

## Publishing to Cloudflare Pages

This is a static site. No Worker, database, or Cloudflare credential is required to develop or build it.

1. Commit and push the project, including `package-lock.json`, to GitHub.
2. Create a Cloudflare Pages project connected to `renzouchaliang/travel-web`.
3. Use `main` as the production branch, the repository root as the root directory, `npm run build` as the build command, and `dist` as the output directory. Use the React/Vite preset or enter these settings manually.
4. Set the build environment variable `NODE_VERSION` to `24` if the selected Cloudflare build image does not already use Node 24. Keep npm lockfile installation enabled.
5. Deploy, then verify the day selector and mobile layout on the published site. Later production-branch pushes rebuild the site; pull requests can receive preview deployments.

The default Pages SPA fallback supports client-side navigation when no top-level `404.html` exists. This demo has no router; define routing, per-guide URLs, and search-engine requirements before adding one. `public/_headers` supplies basic response headers without restricting an undecided map or image provider.

For manual publishing, run `npm ci && npm run build`, then use Cloudflare Pages Direct Upload for `dist/`. Choose Git integration or Direct Upload when creating the project; Cloudflare treats these as separate project modes.

Publishing requires a Cloudflare account and deployment authorization. This setup does not create or publish a Cloudflare project. Variables prefixed with `VITE_` are embedded in public JavaScript and must never contain private credentials. Private API keys need a separate server-side design.
