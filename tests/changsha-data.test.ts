import test from "node:test";
import assert from "node:assert/strict";
import source from "../src/trips/changsha-2026/trip-changsha-2026.json" with { type: "json" };
import { adaptChangsha } from "../src/trips/changsha-2026/adapter.ts";
import { validateTrip } from "../src/types/validateTrip.ts";

const before = JSON.stringify(source);
const trip = adaptChangsha(source);

test("source is immutable and template references validate", () => {
  assert.equal(JSON.stringify(source), before);
  assert.deepEqual(validateTrip(trip), []);
  assert.equal(trip.title, source.trip.title);
  assert.equal(trip.days.length, 4);
});
test("every stop ID, date, order and known/unknown time is preserved", () => {
  source.trip.days.forEach((day, i) => {
    assert.equal(trip.days[i].date, day.date);
    assert.deepEqual(
      trip.days[i].stops.map((s) => s.id),
      (day.stops ?? []).map((s) => s.id),
    );
    (day.stops ?? []).forEach((stop, j) => {
      const mapped = trip.days[i].stops[j];
      assert.equal(mapped.startTime, stop.arrivalTime ?? undefined);
      assert.equal(mapped.endTime, stop.departureTime ?? undefined);
      assert.equal(mapped.placeId, stop.placeId);
      assert.ok(mapped.note?.includes(stop.description));
    });
  });
  assert.deepEqual(trip.days[2].stops, []);
  assert.ok(trip.days[2].alerts.some((a) => a.includes("留空")));
});
test("shared station never leaks arrival-day instructions into return day", () => {
  assert.equal(trip.places.south.summary, undefined);
  assert.ok(trip.days[0].stops[0].note?.includes("13:00"));
  const departure = trip.days[3].stops[1];
  assert.ok(departure.note?.includes("20:40"));
  assert.ok(!departure.note?.includes("先去酒店"));
  assert.equal(departure.startTime, undefined);
  assert.equal(departure.endTime, undefined);
});
test("no missing coordinate, route, image authorization or rating is fabricated", () => {
  for (const day of source.trip.days)
    for (const stop of day.stops ?? []) {
      const p = trip.places[stop.placeId];
      assert.equal(p.coordinate?.lat, stop.lat ?? undefined);
      assert.equal(p.coordinate?.lng, stop.lng ?? undefined);
      assert.ok(p.photos.every((photo) => photo.rights === "unknown"));
    }
  assert.deepEqual(
    trip.days.flatMap((d) => d.legs).map((l) => l.id),
    source.trip.routeLegs.map((l) => l.id),
  );
  assert.ok(trip.days.slice(1).every((d) => d.legs.length === 0));
  assert.equal(trip.days[0].legs[3].includeInOverview, false);
  assert.equal(trip.days[0].legs[4].includeInOverview, false);
});
test("dining candidates, distance origins/kinds, coordinates and links survive mapping", () => {
  for (const group of source.trip.days[0].dining ?? []) {
    const mapped = trip.days[0].restaurantGroups.find(
      (g) => g.id === group.id,
    )!;
    assert.deepEqual(
      mapped.candidates.map((c) => c.placeId),
      group.restaurants.map((r) => r.id),
    );
    for (const item of group.restaurants) {
      const p = trip.places[item.id];
      const distance = mapped.candidates.find(
        (c) => c.placeId === item.id,
      )!.distance;
      assert.equal(p.rating, undefined);
      assert.equal(p.coordinate?.lat, item.lat ?? undefined);
      if (item.distance) {
        assert.equal(distance?.meters, item.distance.meters);
        assert.equal(distance?.kind, item.distance.kind);
        assert.equal(
          trip.places[distance!.originPlaceId].name,
          item.distance.origin,
        );
      }
      for (const link of item.guideUrls)
        assert.ok(p.links.some((l) => l.url === link.url));
      for (const url of [item.mapUrl, item.reviewUrl, item.officialUrl])
        if (url) assert.ok(p.links.some((l) => l.url === url));
    }
  }
});
test("source access date is not mislabeled as verification; all stop links remain", () => {
  assert.deepEqual(
    trip.sources.map((s) => s.id),
    source.sources.map((s) => s.id),
  );
  assert.ok(trip.sources.every((s) => s.checkedAt === undefined));
  for (const day of source.trip.days)
    for (const stop of day.stops ?? []) {
      for (const link of stop.guideUrls)
        assert.ok(
          trip.places[stop.placeId].links.some((l) => l.url === link.url),
        );
      for (const url of [stop.mapUrl, stop.officialUrl])
        if (url)
          assert.ok(trip.places[stop.placeId].links.some((l) => l.url === url));
    }
});
