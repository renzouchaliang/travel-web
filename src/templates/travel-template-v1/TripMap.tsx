import { useCallback, useEffect, useRef, useState } from "react";
import type { Coordinate, Day, RouteResult, Trip } from "../../types/travel";
import type { MapAdapter, RouteRequest } from "../../maps/MapAdapter";
import { routeCacheKey } from "../../maps/MapAdapter";
import type { TripSelection } from "./useTripSelection";
import { useModal } from "./accessibility";
import { MapControls, MapStatus, PlacePreview, RoutePanel } from "./MapParts";
export type AdapterFactory = () => MapAdapter;
export function TripMap({
  trip,
  day,
  selection,
  createAdapter,
  onItinerary,
}: {
  trip: Trip;
  day: Day;
  selection: TripSelection;
  createAdapter: AdapterFactory;
  onItinerary: (id: string) => void;
}) {
  const canvas = useRef<HTMLDivElement>(null),
    panel = useRef<HTMLElement>(null),
    adapter = useRef<MapAdapter | undefined>(undefined);
  const current = useRef({ day, selection });
  current.current = { day, selection };
  const [status, setStatus] = useState("loading"),
    [attempt, setAttempt] = useState(0),
    [routeAttempt, setRouteAttempt] = useState(0),
    [collapsed, setCollapsed] = useState(false);
  const [results, setResults] = useState<Record<string, RouteResult>>({});
  const cache = useRef(
    new Map<string, { result: RouteResult; expires: number }>(),
  );
  const close = useCallback(
    () => selection.setMapExpanded(false),
    [selection.setMapExpanded],
  );
  useModal(selection.mapExpanded, panel, close);
  useEffect(() => {
    const instance = createAdapter();
    adapter.current = instance;
    let disposed = false;
    setStatus("loading");
    instance
      .mount(canvas.current!, {
        select: (id) =>
          current.current.selection.selectPlace(id, current.current.day, false),
        drag: () => current.current.selection.userDrag(),
      })
      .then(() => {
        if (!disposed) setStatus("ready");
      })
      .catch((error) => {
        if (!disposed)
          setStatus(error instanceof Error ? error.message : "sdk-error");
      });
    return () => {
      disposed = true;
      instance.destroy();
      adapter.current = undefined;
    };
  }, [createAdapter, attempt]);
  const {
    selectedLegId,
    activeDayId,
    visibleLayers,
    selectedPlaceId,
    viewportIntent,
    mapExpanded,
    mapInteractionEnabled,
  } = selection;
  useEffect(() => {
    setResults({});
    if (status !== "ready") return;
    const controller = new AbortController();
    let valid = true;
    const instance = adapter.current!;
    const legs = selectedLegId
      ? day.legs.filter((l) => l.id === selectedLegId)
      : day.legs.filter((l) => l.includeInOverview);
    for (const leg of legs) {
      const from =
          trip.places[day.stops.find((s) => s.id === leg.fromStopId)!.placeId],
        to = trip.places[day.stops.find((s) => s.id === leg.toStopId)!.placeId];
      if (day.stops.find((s) => s.id === leg.toStopId)?.role === "free-time")
        continue;
      if (!from.coordinate || !to.coordinate) {
        setResults((v) => ({
          ...v,
          [leg.id]: {
            legId: leg.id,
            status: "error",
            segments: [],
            provider: instance.provider,
            errorKind: "missing-coordinates",
          },
        }));
        continue;
      }
      const request: RouteRequest = {
        leg,
        from,
        to,
        via: (leg.viaPlaceIds ?? []).map((id) => trip.places[id]),
      };
      const key = routeCacheKey(instance.provider, request),
        cached = cache.current.get(key);
      if (cached && cached.expires > Date.now()) {
        setResults((v) => ({
          ...v,
          [leg.id]: { ...cached.result, legId: leg.id },
        }));
        continue;
      }
      setResults((v) => ({
        ...v,
        [leg.id]: {
          legId: leg.id,
          status: "loading",
          segments: [],
          provider: instance.provider,
        },
      }));
      instance
        .route(request, controller.signal)
        .then((result) => {
          if (!valid || controller.signal.aborted) return;
          if (result.status === "ready" || result.status === "partial")
            cache.current.set(key, {
              result,
              expires: Date.now() + (instance.cacheTtlMs ?? 0),
            });
          setResults((v) => ({ ...v, [leg.id]: result }));
        })
        .catch(() => {
          if (valid)
            setResults((v) => ({
              ...v,
              [leg.id]: {
                legId: leg.id,
                status: "error",
                segments: [],
                provider: instance.provider,
                errorKind: "route-error",
              },
            }));
        });
    }
    return () => {
      valid = false;
      controller.abort();
    };
  }, [activeDayId, selectedLegId, status, routeAttempt, day, trip]);
  const mainIds = day.stops
    .filter((s) => s.role === "main" || s.role === "free-time")
    .map((s) => s.placeId);
  const visibleIds = new Set([
    ...mainIds,
    ...(selectedLegId
      ? day.legs
          .filter((l) => l.id === selectedLegId)
          .flatMap((l) => [
            day.stops.find((s) => s.id === l.fromStopId)!.placeId,
            day.stops.find((s) => s.id === l.toStopId)!.placeId,
          ])
      : []),
    ...(visibleLayers.restaurants
      ? day.restaurantGroups.flatMap((g) => g.candidates.map((c) => c.placeId))
      : []),
    ...(visibleLayers.nearby ? day.nearbyPlaceIds : []),
    ...(selectedPlaceId ? [selectedPlaceId] : []),
  ]);
  const visiblePlaces = [...visibleIds].map((id) => trip.places[id]);
  const visibleKey = [...visibleIds].join("|");
  useEffect(() => {
    if (status === "ready")
      adapter.current?.render(
        visiblePlaces,
        Object.values(results).filter((r) =>
          day.legs.some((l) => l.id === r.legId),
        ),
        selectedPlaceId,
      );
  }, [status, visibleKey, results, selectedPlaceId, trip]);
  useEffect(() => {
    if (status !== "ready" || viewportIntent.kind === "user") return;
    let ids = mainIds;
    if (viewportIntent.kind === "place" && viewportIntent.id)
      ids = [viewportIntent.id];
    if (viewportIntent.kind === "leg") {
      const l = day.legs.find((l) => l.id === viewportIntent.id);
      if (l)
        ids = [
          day.stops.find((s) => s.id === l.fromStopId)!.placeId,
          day.stops.find((s) => s.id === l.toStopId)!.placeId,
          ...(l.viaPlaceIds ?? []),
        ];
    }
    adapter.current?.fit(
      ids
        .map((id) => trip.places[id].coordinate)
        .filter((c): c is Coordinate => !!c),
    );
    // Late geometry only updates overlays, never the user's viewport.
  }, [viewportIntent, status, day, trip]);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const apply = () =>
      adapter.current?.interaction(
        query.matches || mapExpanded || mapInteractionEnabled,
      );
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [status, mapExpanded, mapInteractionEnabled]);
  useEffect(() => {
    const observer = new ResizeObserver(() => adapter.current?.resize());
    if (canvas.current) observer.observe(canvas.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      id="trip-map"
      ref={panel}
      className={`map-panel travel-card ${mapExpanded ? "map-expanded" : ""}`}
      role={mapExpanded ? "dialog" : undefined}
      aria-modal={mapExpanded ? true : undefined}
      aria-label="当天地图"
    >
      <h2>当天地图 · {day.title}</h2>
      <MapControls
        selection={selection}
        collapsed={collapsed}
        onCollapse={() => setCollapsed((v) => !v)}
      />
      <div
        className={`map-canvas-wrap ${collapsed && !mapExpanded ? "map-collapsed" : ""} ${mapInteractionEnabled || mapExpanded ? "interactive" : ""}`}
      >
        <div
          ref={canvas}
          className="map-canvas"
          aria-label="地图，可使用下方地点列表获取等效信息"
        />
        {status !== "ready" && (
          <MapStatus status={status} onRetry={() => setAttempt((v) => v + 1)} />
        )}
      </div>
      {collapsed && !mapExpanded && (
        <p>当天路线：{mainIds.map((id) => trip.places[id].name).join(" → ")}</p>
      )}
      {visiblePlaces.some(
        (p) => p.coordinate && p.coordinate.crs !== "GCJ02",
      ) && (
        <p>当前高德适配器只接受 GCJ02；其他坐标系需经确认转换后才能展示。</p>
      )}
      {!visiblePlaces.some((p) => p.coordinate) && (
        <p>当天暂无已核查坐标，不生成假地图点。</p>
      )}
      <details className="map-equivalent">
        <summary>地图地点的等效文字列表</summary>
        {visiblePlaces.map((p) => (
          <button
            key={p.id}
            onClick={() => selection.selectPlace(p.id, day, false)}
          >
            {p.name}
            {!p.coordinate ? " · 暂无坐标" : ""}
          </button>
        ))}
      </details>
      <PlacePreview
        trip={trip}
        day={day}
        selection={selection}
        onItinerary={onItinerary}
      />
      <RoutePanel
        trip={trip}
        day={day}
        selection={selection}
        results={results}
        onRetry={(id) => {
          const leg = day.legs.find((l) => l.id === id)!;
          const from =
              trip.places[
                day.stops.find((s) => s.id === leg.fromStopId)!.placeId
              ],
            to =
              trip.places[
                day.stops.find((s) => s.id === leg.toStopId)!.placeId
              ];
          cache.current.delete(
            routeCacheKey(adapter.current!.provider, {
              leg,
              from,
              to,
              via: (leg.viaPlaceIds ?? []).map((id) => trip.places[id]),
            }),
          );
          setRouteAttempt((v) => v + 1);
        }}
      />
    </section>
  );
}
