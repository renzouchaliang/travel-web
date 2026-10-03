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

AMap's default `displayMode` is now `sequence`. The provider-neutral `dayMapScene` builds dashed stop-order segments from existing coordinates only. Missing coordinates, CRS changes and free-time areas break the line; dining layers never add stops to it. This is a schematic, explicitly labeled as such, not a road or transit result. The production AMap path makes **no driving, transit, cycling or walking planner requests**. The older isolated planner method remains dormant for a future routing task.

`MapScene` also carries each day's visit-specific time and description separately from physical places. The AMap adapter renders these in a safe DOM-based info window on selection, and the template supplies equivalent text outside the map. A shared hotel/station can show multiple visits without using another day's details. Every render removes the previous overlays and popup before adding the current day's markers and schematic; the same map instance survives tab changes and fullscreen.

For a live AMap connection, configure the following in `.env.local` for local work and in the existing Cloudflare **build environment**, then rebuild. Vite reads these values at build time; changing only runtime Worker variables will not update a built static frontend. `.env.example` documents the names without credentials:

- `VITE_AMAP_PUBLIC_KEY`: the browser-visible JS API key, restricted to intended domains.
- `VITE_AMAP_SERVICE_HOST`: the URL of an **existing** HTTPS security proxy configured per AMap's JS API security instructions. This public URL is not a security key.
- Server-side security credentials in that proxy, never in `VITE_*`, client code, or version control.
- Existing GCJ02 coordinates and access to AMap SDK/tile hosts. Unknown coordinates stay absent. No routing metadata or planner service is required for sequence mode.

The repository currently has no security proxy. This task does not create a backend, provision credentials, or modify Cloudflare deployment settings. Without both public key and service host, visitors see a clear no-configuration state and the complete text guide. They never see a key entry form.

**Live-provider limitation:** this environment denied access to the official AMap documentation and has no AMap credentials. SDK callback loading was checked against the published official `@amap/amap-jsapi-loader` package (1.0.1). Proxy configuration and actual basemap/marker/touch behavior must still be reviewed against current official documentation and tested before enabling production maps. Adapter fixture tests are not a live AMap verification. No claim is made that previous mobile/in-app-browser failures are resolved.

Official review references:

- https://lbs.amap.com/api/javascript-api-v2/guide/abc/load
- https://lbs.amap.com/api/javascript-api-v2/guide/services/navigation
- https://lbs.amap.com/api/uri-api/guide/travel/route

## Responsive and accessible behavior

These are template-wide defaults for every trip rendered with `TravelTemplateV1`; no trip-specific CSS override or opt-in is required.

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

Sequence-mode checks:

```sh
node --experimental-strip-types --test tests/map-sequence.test.ts
npm run dev -- --port 5173 --strictPort
# Separate terminal, with Python Playwright + Chromium:
python3 tests/verify_amap_sequence.py
```

The SDK simulation drives the actual `AMapAdapter`: marker clicks, visit times/descriptions, day changes, missing-coordinate gaps, restaurant layers, fullscreen reuse and zero planner calls. It is not a successful live AMap connection. The current managed environment had neither required map variable at implementation time; their names were saved to its configuration draft. Enter the real values through environment settings, keep the security code on the existing proxy, and rebuild before live verification. No private key is embedded or requested through the visitor UI.
