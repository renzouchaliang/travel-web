import test from "node:test";
import assert from "node:assert/strict";
import { dayMapScene } from "../src/maps/sequence.ts";
import { changshaTrip } from "../src/trips/changsha-2026/adapter.ts";

test("day sequence uses original coordinates, never bridges a missing/free-time stop", () => {
  const scene = dayMapScene(changshaTrip, changshaTrip.days[0]);
  assert.equal(scene.sequence.length, 1);
  assert.deepEqual(
    scene.sequence[0].path,
    ["south", "hotel", "academy", "square"].map(
      (id) => changshaTrip.places[id].coordinate,
    ),
  );
  assert.equal(scene.visits.hotel.length, 2);
  assert.match(scene.visits.south[0].time, /13:00/);
});
test("day changes discard old sequence and use visit-specific station information", () => {
  const day4 = dayMapScene(changshaTrip, changshaTrip.days[3]);
  assert.equal(day4.sequence.length, 0);
  assert.equal(day4.visits.hotel, undefined);
  assert.equal(day4.visits.south[0].time, "时间未确认");
  assert.match(day4.visits.south[0].description, /20:40/);
  assert.doesNotMatch(day4.visits.south[0].description, /13:00/);
  assert.deepEqual(dayMapScene(changshaTrip, changshaTrip.days[2]), {
    sequence: [],
    visits: {},
  });
});
test("selected leg schematic only includes its endpoints, never dining candidate coordinates", () => {
  const scene = dayMapScene(changshaTrip, changshaTrip.days[0], "d1-l2");
  assert.deepEqual(
    scene.sequence[0].path,
    ["hotel", "academy"].map((id) => changshaTrip.places[id].coordinate),
  );
  assert.equal(
    dayMapScene(changshaTrip, changshaTrip.days[0], "d1-l4").sequence.length,
    0,
  );
});
