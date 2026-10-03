import type {
  Coordinate,
  Place,
  RouteResult,
  RouteSegment,
  TravelMode,
} from "../types/travel";
import { mapLabel } from "./labels";
import type { MapAdapter, MapScene, RouteRequest } from "./MapAdapter";
// Supplier objects are confined to this boundary. No security key is accepted here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SDK = Record<string, any>;
declare global {
  interface Window {
    AMap?: SDK;
    _AMapSecurityConfig?: { serviceHost: string };
    travelAMapReady?: () => void;
  }
}
export interface AMapConfig {
  publicKey?: string;
  serviceHost?: string;
  cacheTtlMs?: number;
}
let sdkPromise: Promise<SDK> | undefined;
function loadSDK(config: AMapConfig): Promise<SDK> {
  if (!config.publicKey || !config.serviceHost)
    return Promise.reject(new Error("unconfigured"));
  try {
    if (new URL(config.serviceHost).protocol !== "https:")
      return Promise.reject(new Error("unconfigured"));
  } catch {
    return Promise.reject(new Error("unconfigured"));
  }
  if (window.AMap) return Promise.resolve(window.AMap);
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    window._AMapSecurityConfig = { serviceHost: config.serviceHost! };
    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?callback=travelAMapReady&v=2.0&key=${encodeURIComponent(config.publicKey!)}`;
    const timer = setTimeout(() => fail(), 15000);
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      delete window.travelAMapReady;
      sdkPromise = undefined;
      reject(new Error("sdk-error"));
    };
    script.onerror = fail;
    window.travelAMapReady = () => {
      clearTimeout(timer);
      delete window.travelAMapReady;
      if (window.AMap) resolve(window.AMap);
      else fail();
    };
    document.head.append(script);
  });
  return sdkPromise;
}
const gcj = (c?: Coordinate) => {
  if (!c || c.crs !== "GCJ02") throw new Error("coordinate-system");
  return [c.lng, c.lat];
};
export class AMapAdapter implements MapAdapter {
  readonly provider = "amap";
  readonly displayMode = "planned" as const;
  private popup?: SDK;
  get cacheTtlMs() {
    return this.config.cacheTtlMs ?? 0;
  }
  private cancelMount?: () => void;
  private overlayCleanup: (() => void)[] = [];
  private sdk?: SDK;
  private map?: SDK;
  private overlays: SDK[] = [];
  private planners = new Set<SDK>();
  private disposed = false;
  private routeColors = { walk: "", transit: "" };
  private select?: (id: string) => void;
  private diningMarkers: { marker: SDK; element: HTMLElement; selected: boolean }[] = [];
  private zoomChanged = () => {
    const zoom = this.map?.getZoom?.() ?? 12;
    for (const { marker, element, selected } of this.diningMarkers) {
      const visible = zoom >= 15 || selected;
      if (visible) marker.show?.(); else marker.hide?.();
      element.hidden = !visible;
      element.classList.toggle("show-name", zoom >= 17 || selected);
    }
  };
  constructor(private config: AMapConfig) {}
  async mount(
    container: HTMLElement,
    events: { select: (id: string) => void; drag: () => void },
  ) {
    const sdk = await loadSDK(this.config);
    if (this.disposed) throw new Error("disposed");
    this.sdk = sdk;
    const theme = getComputedStyle(container);
    this.routeColors = {
      walk: theme.getPropertyValue("--travel-walk").trim(),
      transit: theme.getPropertyValue("--travel-transit").trim(),
    };
    this.select = events.select;
    this.map = new sdk.Map(container, {
      zoom: 12,
      scrollWheel: false,
      dragEnable: false,
      touchZoom: false,
    });
    this.map!.on("dragstart", events.drag);
    this.map!.on("zoomend", this.zoomChanged);
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("basemap-timeout")),
        15000,
      );
      this.cancelMount = () => {
        clearTimeout(timer);
        reject(new Error("disposed"));
      };
      this.map!.on("complete", () => {
        clearTimeout(timer);
        this.cancelMount = undefined;
        resolve();
      });
    });
  }
  render(
    places: Place[],
    results: RouteResult[],
    selectedPlaceId?: string,
    scene?: MapScene,
  ) {
    if (!this.map || !this.sdk || this.disposed) return;
    this.popup?.close();
    this.map.remove(this.overlays);
    this.overlayCleanup.forEach((cleanup) => cleanup());
    this.overlayCleanup = [];
    this.overlays = [];
    this.diningMarkers = [];
    const hotelCount = places.filter((p) => p.kind === "hotel").length;
    places.forEach((p, index) => {
      if (p.coordinate?.crs !== "GCJ02") return;
      const dining = p.kind === "restaurant";
      const selected = p.id === selectedPlaceId;
      const element = document.createElement("button");
      element.type = "button";
      element.className = dining ? "travel-map-dining" : "travel-map-pin";
      element.classList.toggle("active", selected);
      element.setAttribute("aria-label", p.name);
      const dot = document.createElement("span");
      dot.className = "travel-map-dot";
      if (!dining) dot.textContent = ["station", "airport"].includes(p.kind) ? "站" : p.kind === "hotel" ? "宿" : String(places.slice(0, index + 1).filter((place) => !["station", "airport", "restaurant"].includes(place.kind)).length);
      const label = document.createElement("span");
      label.className = "travel-map-label";
      label.textContent = p.kind === "hotel" && hotelCount > 1 && !p.mapLabel ? `酒店${places.filter((place) => place.kind === "hotel").findIndex((place) => place.id === p.id) + 1}` : mapLabel(p, hotelCount);
      element.append(dot, label);
      const marker = new this.sdk!.Marker({
        position: gcj(p.coordinate), content: element, anchor: "bottom-center",
        zIndex: dining ? 80 : selected ? 220 : 150,
      });
      const select = () => this.select?.(p.id);
      // DOM click supports keyboard activation of the button as well as touch.
      element.addEventListener("click", select);
      this.overlayCleanup.push(() => element.removeEventListener("click", select));
      if (dining) this.diningMarkers.push({ marker, element, selected });
      this.overlays.push(marker);
    });
    for (const result of results) {
      for (const segment of result.segments) {
        if (segment.crs !== "GCJ02" || segment.path.length < 2) continue;
        this.overlays.push(new this.sdk.Polyline({
          path: segment.path.map(gcj),
          strokeColor: segment.mode === "walk" ? this.routeColors.walk : this.routeColors.transit,
          strokeWeight: 5, strokeStyle: segment.mode === "walk" ? "dashed" : "solid",
          strokeDasharray: [8, 6], isOutline: true, outlineColor: "#fff", borderWeight: 2,
        }));
      }
    }
    this.map.add(this.overlays);
    this.zoomChanged();
    const selected = places.find(
      (p) => p.id === selectedPlaceId && p.coordinate?.crs === "GCJ02",
    );
    if (selected) {
      // Build popup text with DOM APIs: trip text must never become supplier HTML.
      const content = document.createElement("div");
      content.className = "map-place-popup";
      const heading = document.createElement("strong");
      heading.textContent = selected.name;
      content.append(heading);
      const visits = scene?.visits[selected.id] ?? [];
      for (const visit of visits) {
        const time = document.createElement("p");
        time.textContent = visit.time;
        const description = document.createElement("p");
        description.textContent =
          visit.description.length > 180
            ? visit.description.slice(0, 180) + "…"
            : visit.description;
        if (visit.time) content.append(time);
        if (description.textContent) content.append(description);
      }
      if (!visits.length) {
        const description = document.createElement("p");
        description.textContent =
          selected.kind === "restaurant" ? [selected.foodTags?.join(" / "), selected.address].filter(Boolean).join(" · ") : selected.summary ?? "";
        content.append(description);
      }
      this.popup ??= new this.sdk.InfoWindow({ autoMove: false });
      this.popup!.setContent(content);
      this.popup!.open(this.map, gcj(selected.coordinate));
    }
  }
  fit(coordinates: Coordinate[]) {
    if (!this.map || !this.sdk) return;
    const c = coordinates.filter((c) => c.crs === "GCJ02");
    if (c.length === 1) this.map.setZoomAndCenter(15, gcj(c[0]));
    else if (c.length > 1) {
      const markers = c.map((p) => new this.sdk!.Marker({ position: gcj(p) }));
      this.map.setFitView(markers, false, [50, 50, 50, 50]);
    }
  }
  interaction(enabled: boolean) {
    this.map?.setStatus({
      dragEnable: enabled,
      zoomEnable: enabled,
      touchZoom: enabled,
      scrollWheel: false,
    });
  }
  resize() {
    this.map?.resize();
  }
  async route(
    request: RouteRequest,
    signal: AbortSignal,
  ): Promise<RouteResult> {
    const { leg, from, to, via } = request;
    const result: RouteResult = {
      legId: leg.id,
      status: "error",
      segments: [],
      provider: this.provider,
      errorKind: "route-error",
    };
    if (!this.sdk || signal.aborted) return result;
    try {
      gcj(from.coordinate);
      gcj(to.coordinate);
      via.forEach((p) => gcj(p.coordinate));
    } catch {
      return { ...result, errorKind: "coordinate-system" };
    }
    if (via.length && !["drive", "taxi"].includes(leg.mode))
      return { ...result, errorKind: "unsupported-via" };
    const plugin =
      leg.mode === "walk"
        ? "Walking"
        : leg.mode === "cycle"
          ? "Riding"
          : leg.mode === "transit"
            ? "Transfer"
            : "Driving";
    const policy = leg.routePolicy
      ? this.sdk[`${plugin}Policy`]?.[leg.routePolicy]
      : undefined;
    if (leg.routePolicy && policy === undefined)
      return { ...result, errorKind: "unsupported-policy" };
    if (plugin === "Transfer" && !from.providerIds?.amapCity)
      return { ...result, errorKind: "missing-transit-city" };
    return new Promise((resolve) => {
      let settled = false;
      let planner: SDK | undefined;
      const finish = (r: RouteResult) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        signal.removeEventListener("abort", abort);
        planner?.clear?.();
        if (planner) this.planners.delete(planner);
        resolve(r);
      };
      const abort = () => finish({ ...result, errorKind: "cancelled" });
      const timer = setTimeout(
        () => finish({ ...result, errorKind: "route-timeout" }),
        15000,
      );
      signal.addEventListener("abort", abort, { once: true });
      this.sdk!.plugin(`AMap.${plugin}`, () => {
        if (signal.aborted || this.disposed || settled) return abort();
        try {
          planner = new this.sdk![plugin]({
            city: from.providerIds?.amapCity,
            policy,
            extensions: "all",
            hideMarkers: true,
          });
          this.planners.add(planner!);
          const callback = (status: string, data: SDK) => {
            if (status !== "complete") return finish(result);
            const plans = data.plans ?? [];
            const matches = (plan: SDK) => {
              const transit = (plan.segments ?? []).filter((s: SDK) => s.transit_mode !== "WALK");
              return transit.length > 0 && transit.every((s: SDK) => s.transit_mode === "SUBWAY" && (s.transit?.lines ?? []).some((line: SDK) => (String(line.name).match(/\d+号线/)?.[0] === leg.preferredLine || String(line.name) === leg.preferredLine)));
            };
            const preferred = leg.preferredLine ? plans.find(matches) : undefined;
            const route = data.routes?.[0] ?? preferred ?? plans[0];
            if (!route) return finish(result);
            const segments: RouteSegment[] = [];
            let missing = false;
            const add = (path: SDK[] | undefined, mode: TravelMode) => {
              if (!path?.length) {
                missing = true;
                return;
              }
              const normalized = path.map((p) => ({
                lng: Number(Array.isArray(p) ? p[0] : p.lng ?? p.getLng?.()),
                lat: Number(Array.isArray(p) ? p[1] : p.lat ?? p.getLat?.()),
                crs: "GCJ02" as const,
              }));
              if (
                normalized.some(
                  (p) => !Number.isFinite(p.lng) || !Number.isFinite(p.lat),
                )
              ) {
                missing = true;
                return;
              }
              segments.push({ mode, crs: "GCJ02", path: normalized });
            };
            if (plugin === "Transfer") {
              route.segments?.forEach((s: SDK) => {
                if (s.transit_mode === "WALK") {
                  if (s.transit?.path?.length > 1) add(s.transit.path, "walk");
                  else if (s.transit?.steps?.length) s.transit.steps.forEach((step: SDK) => add(step.path, "walk"));
                  else missing = true;
                } else if (s.transit) add(s.transit.path, "transit");
                else if (s.walking) s.walking.steps?.forEach((step: SDK) => add(step.path, "walk"));
                else if (s.railway) add(s.railway.path, "transit");
                else missing = true;
              });
            } else (route.steps ?? route.rides)?.forEach((step: SDK) => add(step.path, leg.mode));
            finish({
              ...result,
              status: segments.length
                ? missing
                  ? "partial"
                  : "ready"
                : "partial",
              segments,
              distanceMeters: route.distance,
              durationSeconds: route.time,
              fetchedAt: new Date().toISOString(),
              routeLabel: plugin === "Transfer" ? [...new Set((route.segments ?? []).flatMap((s: SDK) => (s.transit?.lines ?? []).map((line: SDK) => line.name)))].join(" / ") : "高德步行路线",
              planMismatch: !!leg.preferredLine && !preferred,
              errorKind: missing ? "missing-geometry" : undefined,
            });
          };
          if (via.length)
            planner!.search(
              gcj(from.coordinate),
              gcj(to.coordinate),
              { waypoints: via.map((p) => gcj(p.coordinate)) },
              callback,
            );
          else
            planner!.search(gcj(from.coordinate), gcj(to.coordinate), callback);
        } catch {
          finish({ ...result, errorKind: "route-error" });
        }
      });
    });
  }
  destroy() {
    this.disposed = true;
    this.cancelMount?.();
    this.overlayCleanup.forEach((cleanup) => cleanup());
    this.overlayCleanup = [];
    this.planners.forEach((p) => p.clear?.());
    this.planners.clear();
    this.overlays = [];
    this.popup?.close();
    this.popup = undefined;
    this.map?.off?.("zoomend", this.zoomChanged);
    this.diningMarkers = [];
    this.map?.destroy();
    this.map = undefined;
  }
}
