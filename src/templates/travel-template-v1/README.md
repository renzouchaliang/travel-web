# travel-template-v1

An optional implementation of the attached v1 specification. It does not impose a layout on other trips or replace the original setup demo. No UI, routing, or state-management dependency was added.

## Select a page

- `/`: original setup demo, unchanged interaction.
- `/?template=travel-template-v1`: clearly labeled, unverified Changsha Day 1 demonstration.
- Add `&fixture=multi-day`: separate two-day development fixture, not a real Day 2/3 guide.
- Add `&layout=stacked` or `&mapSide=right`: desktop layout variations.

## Components and ownership

`TravelTemplateV1` assembles `TripHeader`, `DayTabs`, `DaySummary`, `TripMap`, `ItineraryTimeline`, `RestaurantList`, `NearbyPlaces`, sources, and `MobileQuickNav`. `TripMap` uses `MapControls`, `MapStatus`, `PlacePreview`, and `RoutePanel`. The timeline composes `PlaceCard` and `TransitLegCard`; place cards use `HotelCard`, `TransportCard`, `PhotoGallery`, and `ExternalLinks`. Restaurant groups use compact `RestaurantRow` components. `useTripSelection` owns the active day, selected stop/place/leg, layers, fullscreen, interaction mode, and viewport intent.

No component embeds a city's names, hotel, restaurant recommendations, coordinates, or route instructions. Data is in `src/trips/`, contracts and validation in `src/types/`, provider code in `src/maps/`, and the scoped theme and UI in this directory.

## Create a trip

1. Create `src/trips/my-trip.ts` exporting a `Trip`, using `src/types/travel.ts`.
2. Give each place a stable ID. Create separate stop IDs for every visit, including repeat visits to the same hotel. Route legs refer to stop IDs, not place IDs; stops and legs must preserve order.
3. Add dates, direction summaries, alerts, restaurant groups, optional places, and a return target to each day. Use one day for a single-day guide; the date tabs become a date strip automatically.
4. Provide only verified coordinates, including their CRS. Leave unknown fields absent, not fabricated or zero. Rating records need their platform, scale, checked date, and source. Distances retain their measurement type and origin.
5. Add practical facts with source IDs and verification status. Keep edited plan times independent from dynamic routing results. Mark free-time stops explicitly; they never become a fixed dining route.
6. Supply authorized photos with alt text and rights metadata. Unknown-rights images are not embedded. Hotel, station, airport, and restaurant cards do not get default scenery galleries.
7. Supply reviewed HTTP(S) external URLs. Search and home links are labeled as such. For navigation links, use `action: 'navigation'` and `navigationIntent: 'planned'` or `'current-location'`, with the corresponding verified provider URL. Planned URLs must specify the intended start/end; current-location URLs delegate navigation to the platform. The template does not invent navigation URLs, request geolocation, or ask visitors for keys. Without navigation URLs, copy-address and readable directions remain available.
8. Render `<TravelTemplateV1 trip={myTrip} config={myConfig} />` from an outer page selector (currently `src/main.tsx`). Other layouts may bypass this template entirely. Run `validateTrip` during editing; invalid references, duplicate IDs, backwards legs, and invalid coordinates display data errors.
9. Start from `defaultConfig` and override `desktopLayout: 'split' | 'stacked'`, `mapSide: 'left' | 'right'`, `initialDayId`, and allowed color variables. `themeVariables` only accepts the documented `--travel-*` color names. Check contrast when changing colors.

The included Changsha demo is based only on the route sequence in the specification. No V5 HTML was supplied. It deliberately has no invented dates, real merchant ratings, coordinate values, opening hours, travel durations, or licensed scenery photographs. Synthetic ratings/coordinates/images appear only in `tests/harness.html` and are not part of the production build.

## Map boundary and configuration

`MapAdapter` exposes mount, render, fit, gesture enablement, resize, route lookup, and destroy; normalized route segments each have their own real geometry and CRS. Inject `createAdapter` to switch providers without changing trip UI. The default is an isolated `AMapAdapter` using JS API 2.0. It rejects unsupported coordinate systems, via/policy combinations, and missing transit city metadata (`place.providerIds.amapCity`). It does not silently convert coordinates or join missing geometry with straight lines.

Only the current day's overview legs or explicitly selected leg are queried. Free-time destinations are not routed. Abort handling and effect cleanup reject stale day results. Late geometry never changes a user's manually chosen viewport. Cache identity includes provider, endpoints/CRS, mode, via points, and policy. AMap caching defaults to disabled until its applicable terms are confirmed; an injected adapter may supply a terms-compliant `cacheTtlMs`. Cache storage is memory-only and cleared with the component. The development adapter uses 60 seconds to exercise reuse. No permanent provider-result storage is introduced.

For a future live AMap connection, the creator must provide:

- `VITE_AMAP_PUBLIC_KEY`: the browser-visible JS API key, restricted to intended domains.
- `VITE_AMAP_SERVICE_HOST`: the URL of an **existing** HTTPS security proxy configured per AMap's JS API security instructions. This public URL is not a security key.
- Server-side security credentials in that proxy, never in `VITE_*`, client code, or version control.
- Verified GCJ02 coordinates, transit city metadata where applicable, reviewed navigation links, and any required SDK-host access.

The repository currently has no security proxy. This task does not create a backend, provision credentials, or modify Cloudflare deployment settings. Without both public key and service host, visitors see a clear no-configuration state and the complete text guide. They never see a key entry form.

**Live-provider limitation:** this environment denied access to the official AMap documentation and has no AMap credentials. SDK callback loading was checked against the published official `@amap/amap-jsapi-loader` package (1.0.1). Routing APIs, response normalization, proxy configuration, and actual basemap/routing/touch behavior must still be reviewed against current official documentation and tested before enabling production maps. Adapter fixture tests are not a live AMap verification. No claim is made that previous mobile/in-app-browser failures are resolved.

Official review references:

- https://lbs.amap.com/api/javascript-api-v2/guide/abc/load
- https://lbs.amap.com/api/javascript-api-v2/guide/services/navigation
- https://lbs.amap.com/api/uri-api/guide/travel/route

## Responsive and accessible behavior

Under 768px, the page is single-column with map height `clamp(220px, 34svh, 320px)` and a safe-area-aware fixed bottom bar. At 768–1023px it stays single-column with a 320–400px map. At 1024px and above it uses 56/44 map/timeline columns separated by 24px, up to 1320px wide, with a sticky map and whole-page timeline scrolling. Stacked/right-map variations are supported.

Normal phone/tablet map gestures are disabled through the adapter until “操作地图”; “完成” returns to page scrolling. There is no transparent gesture-catching overlay. Desktop dragging is enabled, wheel zoom disabled. Fullscreen expands the same container, triggers resize observation, traps keyboard focus, locks background scrolling, supports Escape, and restores focus/scroll position. A map text list remains available. On phones below 768px, multi-day tabs stack vertically with wrapping labels and Up/Down/Home/End keyboard navigation so every day is visible without swiping sideways. Tablet and desktop tabs remain horizontal with Left/Right/Home/End navigation and automatic horizontal visibility. Independent day/group dining state does not reset other groups.

Print CSS removes controls and the interactive map, keeps readable plan text and source links, and opens details for printing. Formal PDF export is out of scope.

## Verification

```sh
npm run typecheck
npm run build
npm exec -- tsc --project tsconfig.tests.json --noEmit
npm run dev -- --port 5173 --strictPort
# In another terminal, with Python Playwright and a Chromium executable installed:
python3 tests/verify_template.py
```

The browser script checks 320/390/820/1440px rendering, original demo, alternate layouts, independent dining expansion, no-config fallback, fullscreen focus, map/card selection, repeated hotel stops, stale responses, routing failure/retry, cache reuse, image rights, and safe links. Test tools are external to application dependencies. Screenshot artifacts are written under `/tmp/travel-template-verification`.

Actual AMap service, physical phones, in-app browsers, and the deployed Cloudflare site remain unverified. The existing `npm run build` → `dist/` Cloudflare Pages workflow is preserved.
