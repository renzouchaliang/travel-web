import type { Coordinate, Day, Trip } from "../types/travel";
import type { MapScene } from "./MapAdapter";

/** An ordered schematic, never a road/transit result or inferred coordinate. */
export function dayMapScene(
  trip: Trip,
  day: Day,
  selectedLegId?: string,
): MapScene {
  const visits: MapScene["visits"] = {};
  for (const stop of day.stops) {
    const place = trip.places[stop.placeId];
    (visits[stop.placeId] ??= []).push({
      stopId: stop.id,
      time:
        stop.startTime || stop.endTime
          ? `${stop.startTime ?? "未定"}–${stop.endTime ?? "未定"}（计划）`
          : "时间未确认",
      description: stop.note ?? place.summary ?? "",
    });
  }
  const leg = day.legs.find((item) => item.id === selectedLegId);
  const stops = leg
    ? [
        day.stops.find((s) => s.id === leg.fromStopId)!,
        day.stops.find((s) => s.id === leg.toStopId)!,
      ]
    : day.stops;
  const sequence: MapScene["sequence"] = [];
  let path: Coordinate[] = [];
  const flush = () => {
    if (path.length > 1) sequence.push({ crs: path[0].crs, path });
    path = [];
  };
  for (const stop of stops) {
    const coordinate = trip.places[stop.placeId].coordinate;
    // Free-time areas and unknown locations are points/gaps, not a fixed tour.
    if (!coordinate || stop.role === "free-time") {
      flush();
      continue;
    }
    if (path.length && path[0].crs !== coordinate.crs) flush();
    path.push(coordinate);
  }
  flush();
  return { sequence, visits };
}
