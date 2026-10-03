# Reusable travel-web publishing workspace

This repository is a reusable workspace for building and publishing interactive travel-guide websites. Each trip may have its own layout, content model, and visual identity. The original demo verifies frontend setup. `travel-template-v1` is an optional layout with its own specification and documentation; its rules do not constrain unrelated trip layouts.

- Use the existing checkout. Cloud tasks are isolated; do not create a Git worktree unless explicitly requested.
- Use React, TypeScript, Vite, and plain CSS. Add dependencies only for concrete requirements.
- Keep `travel-template-v1` optional. Read its local README and `docs/travel-template-v1-spec.md` when working on it. Do not impose its design or map provider on other templates; do not add UI kits, routers, or CMS dependencies without concrete requirements.
- Keep real trip data separate from presentation. Create shared components for actual reuse and let each trip compose its own layout.
- Support accessible itinerary navigation, maps and route alternatives, place cards, galleries, long-form notes, external links, and mobile/desktop layouts as requested. Use optional template components where appropriate; demo content is not a verified travel guide.
- Keep future map-provider integrations behind a small adapter. Preserve a readable itinerary for users who cannot use a map.
- Never commit credentials. Vite client variables are public; privileged operations need a separately designed server-side service.
- Run `npm ci` and `npm run build`, then verify changed interactions in a browser. The build includes strict TypeScript checking.
- Deploy `dist/` assets and `worker/index.ts` together to the existing Cloudflare Worker using `wrangler.jsonc`. Keep AMap security credentials in Worker secrets only. Obtain authorization before publishing or modifying a live deployment.
