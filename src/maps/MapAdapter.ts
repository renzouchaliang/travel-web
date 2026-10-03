import type { Coordinate, Place, RouteLeg, RouteResult } from "../types/travel";
export type MapFailure = "unconfigured" | "sdk-error" | "basemap-timeout";
export interface RouteRequest {
  leg: RouteLeg;
  from: Place;
  to: Place;
  via: Place[];
}
export interface MapAdapter {
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
  ): void;
  fit(coordinates: Coordinate[]): void;
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
  ]);
}
