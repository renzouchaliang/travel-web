// Development-only integration fixture. This is not a live map or published trip.
import { verifyAMapBoundary } from "./amapFixture";
import { createRoot } from "react-dom/client";
import { TravelTemplateV1 } from "../src/templates/travel-template-v1/TravelTemplateV1";
import { fixtureTrip } from "../src/trips/demo";
import { defaultConfig } from "../src/templates/travel-template-v1/theme";
import { validateTrip } from "../src/types/validateTrip";
import type { Coordinate, Place, RouteResult } from "../src/types/travel";
import type { MapAdapter, RouteRequest } from "../src/maps/MapAdapter";
import { sortedCandidates } from "../src/templates/travel-template-v1/RestaurantList";
import { safeUrl } from "../src/templates/travel-template-v1/ExternalLinks";
import { routeCacheKey } from "../src/maps/MapAdapter";
import "../src/styles.css";
const trip = structuredClone(fixtureTrip);
Object.values(trip.places).forEach(
  (p, i) =>
    (p.coordinate = { lng: 110 + i / 100, lat: 28 + i / 100, crs: "GCJ02" }),
);
trip.places.academy.photos = [
  {
    id: "test-photo",
    src: "/tests/photo.svg",
    alt: "开发示意图，不是真实景点",
    rights: "owned",
    author: "开发 fixture",
  },
  {
    id: "test-photo-2",
    src: "/tests/photo.svg",
    alt: "第二张开发示意图",
    rights: "owned",
  },
  {
    id: "unknown-photo",
    src: "/never-embed-unknown.jpg",
    alt: "未授权，不可嵌入",
    rights: "unknown",
  },
];
trip.places.academy.links = [
  {
    id: "test-guide",
    platform: "开发示例平台",
    action: "guide",
    label: "开发示例攻略",
    url: "https://example.com/",
    targetType: "detail",
  },
  {
    id: "test-search",
    platform: "开发示例平台",
    action: "search",
    label: "搜索",
    url: "https://example.com/?q=fixture",
    targetType: "search",
  },
  {
    id: "bad-link",
    platform: "禁止",
    action: "guide",
    label: "不安全链接",
    url: "javascript:alert(1)",
    targetType: "detail",
  },
];
function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}
assert(validateTrip(trip).length === 0, "fixture validates");
const invalid = structuredClone(trip);
invalid.days[1].stops[0].id = invalid.days[0].stops[0].id;
invalid.places.hotel.coordinate!.lat = 100;
invalid.days[0].legs[0].toStopId = "missing";
assert(
  validateTrip(invalid).length >= 3,
  "duplicate, coordinate and leg checks",
);
assert(!safeUrl("javascript:alert(1)"), "URL scheme filtering");
const req: RouteRequest = {
  leg: trip.days[0].legs[0],
  from: trip.places.station,
  to: trip.places.hotel,
  via: [],
};
assert(
  routeCacheKey("a", req) !== routeCacheKey("b", req),
  "cache provider identity",
);
assert(
  routeCacheKey("a", req) !==
    routeCacheKey("a", { ...req, via: [trip.places.academy] }),
  "cache via identity",
);
const group = trip.days[0].restaurantGroups[0];
const rating = (value: number, platform: string) => ({
  value,
  scale: 5,
  platform,
  checkedAt: "2030-01-01",
  sourceUrl: "https://example.com/",
});
trip.places.food1.rating = rating(4, "A");
trip.places.food2.rating = rating(5, "B");
trip.places.food3.rating = rating(4.5, "A");
assert(
  sortedCandidates(group, trip, "A")[0].placeId === "food3",
  "ratings compare within platform",
);
// Ratings above are clearly synthetic and only present on this development page.
const control = {
  mounted: 0,
  destroyed: 0,
  resizes: 0,
  fits: [] as Coordinate[][],
  renders: [] as { places: string[]; legs: string[]; selected?: string }[],
  requests: [] as string[],
  interaction: false,
  drag: () => {},
  select: (_id: string) => {},
  resolve: (_id: string, _error = false) => {},
  failMount: new URLSearchParams(location.search).get("fail") === "sdk",
};
(window as unknown as { fixture: typeof control }).fixture = control;
class TestAdapter implements MapAdapter {
  provider = "development-test";
  cacheTtlMs = 60000;
  async mount(
    el: HTMLElement,
    events: { select: (id: string) => void; drag: () => void },
  ) {
    control.mounted++;
    control.drag = events.drag;
    control.select = events.select;
    el.textContent = "开发测试地图（非高德线上地图）";
    if (control.failMount) throw new Error("sdk-error");
  }
  render(places: Place[], results: RouteResult[], selected?: string) {
    control.renders.push({
      places: places.map((p) => p.id),
      legs: results
        .filter((r) => r.status === "ready" || r.status === "partial")
        .map((r) => r.legId),
      selected,
    });
  }
  fit(c: Coordinate[]) {
    control.fits.push(c);
  }
  interaction(v: boolean) {
    control.interaction = v;
  }
  resize() {
    control.resizes++;
  }
  route(req: RouteRequest, _signal: AbortSignal) {
    control.requests.push(req.leg.id);
    return new Promise<RouteResult>((resolve) => {
      const previous = control.resolve;
      control.resolve = (id, error = false) => {
        if (id === req.leg.id)
          resolve({
            legId: id,
            status: error ? "error" : "partial",
            provider: this.provider,
            segments: [],
            errorKind: error ? "test-failure" : "missing-geometry",
          });
        else previous(id, error);
      };
    });
  }
  destroy() {
    control.destroyed++;
  }
}
const createAdapter = () => new TestAdapter();
createRoot(document.getElementById("root")!).render(
  <TravelTemplateV1
    trip={trip}
    config={defaultConfig}
    createAdapter={createAdapter}
  />,
);

verifyAMapBoundary(req).then((result) => {
  (window as unknown as { adapterTests: string }).adapterTests = result;
});
