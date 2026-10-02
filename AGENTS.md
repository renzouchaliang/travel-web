# Reusable travel-web publishing workspace

This repository is a reusable workspace for building and publishing interactive travel-guide websites. Each trip may have its own layout, content model, and visual identity. The demo only verifies frontend setup.

- Use the existing checkout. Cloud tasks are isolated; do not create a Git worktree unless explicitly requested.
- Use React, TypeScript, Vite, and plain CSS. Add dependencies only for concrete requirements.
- Do not impose a fixed visual template, map provider, UI kit, router, or CMS before requirements are defined.
- Keep real trip data separate from presentation. Create shared components for actual reuse and let each trip compose its own layout.
- Support accessible itinerary navigation, maps and route alternatives, place cards, galleries, long-form notes, external links, and mobile/desktop layouts as requested. These are future features, not implemented by the demo.
- Keep future map-provider integrations behind a small adapter. Preserve a readable itinerary for users who cannot use a map.
- Never commit credentials. Vite client variables are public; privileged operations need a separately designed server-side service.
- Run `npm ci` and `npm run build`, then verify changed interactions in a browser. The build includes strict TypeScript checking.
- Deploy static output from `dist/` to Cloudflare Pages. Obtain authorization before publishing or modifying a live deployment.
