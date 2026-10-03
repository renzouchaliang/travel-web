import type { Day, RouteLeg, Trip } from "../types/travel";

// Location links live on places; route links always use the itinerary endpoints.
// Specialized taxi/rail services must supply a verified navigationUrl in data.
export function routeNavigationUrl(trip: Trip, day: Day, leg: RouteLeg): string | undefined {
  if (leg.navigationUrl) return leg.navigationUrl;
  const modes = { walk: "walk", transit: "bus", drive: "car", cycle: "ride" };
  if (leg.mode === "taxi") return;
  const endpoint = (stopId: string, override?: string) => {
    const placeId = override ?? day.stops.find((s) => s.id === stopId)?.placeId;
    const place = placeId ? trip.places[placeId] : undefined;
    if (!place || place.coordinate?.crs !== "GCJ02") return;
    return `${place.coordinate.lng},${place.coordinate.lat},${place.name}`;
  };
  const from = endpoint(leg.fromStopId, leg.routingFromPlaceId);
  const to = endpoint(leg.toStopId, leg.routingToPlaceId);
  // Don't drop unknown endpoints and silently start from the user's location.
  if (!from || !to) return;
  const query = new URLSearchParams({ from, to, mode: modes[leg.mode], src: "travel_web", coordinate: "gaode", callnative: "1" });
  if (leg.viaPlaceIds?.length || leg.routePolicy) return; // Supply an authored URL for provider-specific policies/vias.
  return `https://uri.amap.com/navigation?${query}`;
}
