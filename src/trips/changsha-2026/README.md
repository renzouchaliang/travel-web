# Changsha · 2026-10-02–2026-10-05

This is the first real data-backed trip using the existing `TravelTemplateV1`. The page is not a declaration that every practical detail or the live map has been verified.

## Source and page selection

- `trip-changsha-2026.json`: uploaded, machine-readable source of truth. Bytes and all null values are preserved.
- `trip-changsha-2026.md`: unchanged human-readable companion, used only for cross-checking.
- `adapter.ts`: deterministic, trip-local conversion into the existing `Trip` view model.
- Repository contracts: `docs/Travel-Data-Export-Standard-v1.md` and `docs/travel-template-v1-spec.md`.
- Hosting-independent entry: `/?trip=changsha-2026-10`.
- Clean path: `/trips/changsha-2026-10/` (requires the existing host's SPA fallback).
- The original `/` setup demo and `?template=travel-template-v1` demonstration remain available.

The user supplied the production origin `https://travel-web.renzouchaliang.workers.dev`. Use `https://travel-web.renzouchaliang.workers.dev/?trip=changsha-2026-10` on a host without a confirmed SPA fallback. No Worker, Cloudflare configuration, build command, output directory, dependency, reusable component, map adapter, or template theme is changed by this integration.

## Data audit before implementation

The export covers **four natural days**, not three: October 2–5, 2026, with three hotel nights. There are 10 stop references, 5 Day 1 route legs, 3 dining groups, 12 candidate restaurants, 4 source records, 258 null values, and 274 author-supplied missing-data entries.

- October 2: 13:00 arrival at Changsha South, hotel, Yuelu Academy, Dongfanghong Square/Hunan University, independent Lushan South Road dining, return to the same hotel. Hotel arrival/departure and later attraction times retain their V5 estimate basis.
- October 3: confirmed morning Yuelu Mountain reservation, then Wuyi Square. Precise reservation period, mountain entrance/path, connecting transport and arrival times remain unknown.
- October 4: explicitly unconfirmed and empty. It must not receive a previous alternative plan.
- October 5: confirmed morning Orange Isle reservation and 20:40 rail departure. Station arrival time, train number, destination, hotel baggage arrangements and connecting transport remain unknown. **20:40 is not a station arrival time.**

Time caveats remain visible without rescheduling: 13:00 + 60–90 minutes may reach the hotel after 14:00; 15:20 + 35–50 minutes may reach the academy after 16:00; a 90-minute academy visit starting 16:00 conflicts with the 17:15 square visit even before the unknown walking time. Day 1's route references and order are consistent; the incomplete other days cannot receive a full time/route clearance.

Four stop locations lack coordinates: Lushan South Road, Yuelu Mountain, Wuyi Square, Orange Isle. Eight restaurants lack coordinates; four have the original GCJ02 values. Five candidate distances retain their kind (walking or straight), origin and basis. All restaurant ratings and operating status remain unknown. All 12 are candidates, not confirmed meals.

There are no authorized publishable photos. Two `imageReference` records retain credits and source URLs, with unknown rights; the existing gallery displays a source link/fallback and never requests their image URLs. No image, coordinate, entrance, time, route or link is researched or invented during this import. Existing external URLs are retained, not asserted to have been checked online.

## Schema adaptation (no template changes)

- Extract physical `Place` records by `placeId`; preserve each visit's original stop ID/order/time and move visit-specific descriptions into `Stop.note`. This prevents the South Station arrival instructions from leaking into the return visit.
- Scope top-level `routeLegs` by day without changing IDs/endpoints/order. `metro` maps to the template's `transit` enum. The known trip city supplies `providerIds.amapCity`; no new coordinate or route geometry is created.
- Preserve duration ranges as ranges, not averages. Retain the given estimate basis; confirmed route choice does not mean a verified travel duration.
- `transport` stops in this data are the named railway station; `shopping` uses `other`. Explicit free dining uses `free-time`; the return hotel stop uses the template's return/optional presentation. Neither free dining nor the separate return leg is added to the overview route.
- A source null maps only to absent optional view fields or empty render collections; the stored export remains unchanged. Day 3 receives a UI status label, not an invented itinerary title. Its alerts explicitly state that it is unconfirmed.
- Hotel dates/nights and source notes appear in the shared hotel information. The separately exported return departure appears in Day 4 alerts and the specific return stop note, never in its unknown arrival/departure fields.
- Null source URLs become empty, non-clickable view strings because `Source.url` is required by the existing template. `accessedDate` is displayed as a source access date, never silently converted into `checkedAt`.
- Link identities are deterministic and scoped by place; duplicate URLs on the same place are deduplicated without losing destinations. POI detail URLs are labeled “地图位置”, not navigation from a fabricated origin.
- Distance origins get named, coordinate-free reference records. These are measurement anchors only, not added itinerary stops or map points. Origin text and the original basis are displayed with the distance.
- Restaurant-specific caveats are preserved in summaries and group descriptions using the template's existing fields. Null rating, meal choice and business state remain unknown.
- The full export, including reservations, missingData, validation and source metadata unsupported by the view model, remains available for future edits in its original form.

## Validation

```sh
python3 scripts/validate-changsha.py
node --experimental-strip-types --test tests/changsha-data.test.ts
npm run typecheck
npm exec -- tsc --project tsconfig.tests.json --noEmit
npm run build
npm run preview -- --port 4173 --strictPort
# Separate terminal; external Python Playwright and Chromium installation required:
python3 tests/verify_changsha.py
```

Source validation checks duplicate JSON keys/stop IDs, dates, coordinates/CRS, source references, next-stop/next-leg order, URL syntax and all 1,612 scalar occurrences against the companion. It does not substitute for external verification. Adapter tests check source immutability, IDs/times, unknown fields, shared station visits, dining, links and template references.

Production browser checks cover 390/820/1440px layouts, all four tabs, independent dining expansion, time-conflict notices, blank Day 3, 20:40 departure semantics, unauthorized-photo exclusion, fullscreen map state, the trip URL and both existing demos. Screenshots are under `/tmp/changsha-verification` in the validation environment.

Actual map configuration and image licensing remain as supplied/unknown. Local checks do not prove a successful Cloudflare deployment; confirm the production build after pushing. The environment currently requires allowing the production hostname before it can perform that live check.
