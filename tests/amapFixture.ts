// Pure supplier-boundary fixture: synthetic responses, no network or credentials.
import { AMapAdapter } from "../src/maps/AMapAdapter";
import type { RouteRequest } from "../src/maps/MapAdapter";
export async function verifyAMapBoundary(request: RouteRequest) {
  const assert = (ok: boolean, label: string) => {
    if (!ok) throw new Error(label);
  };
  const point = { lng: 110, lat: 28 };
  class MapStub {
    on(name: string, fn: () => void) {
      if (name === "complete") queueMicrotask(fn);
    }
    destroy() {}
    setStatus() {}
    resize() {}
    remove() {}
    add() {}
  }
  class Planner {
    clear() {}
    search(...args: unknown[]) {
      const callback = args.at(-1) as (status: string, result: unknown) => void;
      callback("complete", {
        routes: [
          {
            distance: 1000,
            time: 120,
            steps: [
              { path: [point, { lng: 110.01, lat: 28.01 }] },
              { path: undefined },
            ],
          },
        ],
      });
    }
  }
  window.AMap = {
    Map: MapStub,
    Walking: Planner,
    Driving: Planner,
    Riding: Planner,
    Transfer: Planner,
    plugin: (_name: string, fn: () => void) => queueMicrotask(fn),
  };
  const adapter = new AMapAdapter({
    publicKey: "fixture-not-real",
    serviceHost: "https://example.com/_AMapService",
  });
  await adapter.mount(document.createElement("div"), {
    select: () => {},
    drag: () => {},
  });
  const walk = { ...request, leg: { ...request.leg, mode: "walk" as const } };
  const result = await adapter.route(walk, new AbortController().signal);
  assert(
    result.status === "partial" && result.segments.length === 1,
    "Missing geometry remains partial, no connector added",
  );
  assert(
    result.segments[0].path.length === 2 && result.segments[0].crs === "GCJ02",
    "Geometry is normalized with CRS",
  );
  const bad = await adapter.route(
    {
      ...walk,
      from: { ...walk.from, coordinate: { lng: 110, lat: 28, crs: "WGS84" } },
    },
    new AbortController().signal,
  );
  assert(bad.errorKind === "coordinate-system", "CRS mismatch rejected");
  const transit = await adapter.route(
    { ...walk, leg: { ...walk.leg, mode: "transit" } },
    new AbortController().signal,
  );
  assert(
    transit.errorKind === "missing-transit-city",
    "Transit needs city metadata",
  );
  const controller = new AbortController();
  const pending = adapter.route(walk, controller.signal);
  controller.abort();
  assert(
    (await pending).errorKind === "cancelled",
    "Pending supplier call cancelled",
  );
  adapter.destroy();
  delete window.AMap;
  return "passed";
}
