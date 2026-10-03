import type { Coordinate, Place, RouteLeg, RouteResult } from "../types/travel";
export type MapFailure = "unconfigured" | "sdk-error" | "basemap-timeout";
export interface RouteRequest {
  leg: RouteLeg;
  from: Place;
  to: Place;
  via: Place[];
}
export interface MapScene {
  sequence: { crs: Coordinate["crs"]; path: Coordinate[] }[];
  visits: Record<
    string,
    { stopId: string; time: string; description: string }[]
  >;
}
export interface MapAdapter {
  readonly displayMode?: "sequence" | "planned";
  readonly provider: string;
  readonly cacheTtlMs?: number; // Only enable within confirmed provider terms.
  mount(
    container: HTMLElement,
    events: { select: (placeId: string) => void; drag: () => void },
  ): Promise<void>;
  render(
    places: Place[],
    results: RouteResult[],
    selectedPlaceId?: string,
    scene?: MapScene,
  ): void;
  fit(coordinates: Coordinate[], pointZoom?: number): void;
  zoomBy?(delta: number): void;
  interaction(enabled: boolean): void;
  resize(): void;
  route(request: RouteRequest, signal: AbortSignal): Promise<RouteResult>;
  destroy(): void;
}
export function routeCacheKey(provider: string, request: RouteRequest) {
  return JSON.stringify([
    provider,
    request.from.coordinate,
    request.to.coordinate,
    request.leg.mode,
    request.via.map((p) => p.coordinate),
    request.leg.routePolicy,
    request.leg.preferredLine,
  ]);
}
