import type { Trip } from "./travel";
export function validateTrip(trip: Trip): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  const unique = (id: string) => {
    if (!id || seen.has(id)) errors.push(`Duplicate or empty ID: ${id}`);
    seen.add(id);
  };
  const place = (id: string) => {
    if (!trip.places[id]) errors.push(`Missing place: ${id}`);
  };
  const sources = new Set(trip.sources.map((s) => s.id));
  const refs = (ids: string[]) =>
    ids.forEach((id) => {
      if (!sources.has(id)) errors.push(`Missing source: ${id}`);
    });
  unique(trip.id);
  trip.sources.forEach((s) => unique(s.id));
  Object.entries(trip.places).forEach(([key, p]) => {
    unique(p.id);
    if (key !== p.id) errors.push(`Place key mismatch: ${key}`);
    const c = p.coordinate;
    if (
      c &&
      (!Number.isFinite(c.lng) ||
        !Number.isFinite(c.lat) ||
        Math.abs(c.lng) > 180 ||
        Math.abs(c.lat) > 90 ||
        !["GCJ02", "WGS84", "BD09"].includes(c.crs))
    )
      errors.push(`Invalid coordinate: ${key}`);
    [p.opening, p.ticket, p.booking].forEach((f) => {
      if (f) refs(f.sourceIds);
    });
    p.photos.forEach((photo) => unique(photo.id));
    p.links.forEach((link) => unique(link.id));
  });
  trip.days.forEach((d) => {
    unique(d.id);
    d.stops.forEach((s) => {
      unique(s.id);
      place(s.placeId);
    });
    d.legs.forEach((l) => {
      unique(l.id);
      refs(l.sourceIds);
      l.viaPlaceIds?.forEach(place);
      const a = d.stops.findIndex((s) => s.id === l.fromStopId),
        b = d.stops.findIndex((s) => s.id === l.toStopId);
      if (a < 0 || b < 0 || a >= b) errors.push(`Invalid leg order: ${l.id}`);
    });
    d.restaurantGroups.forEach((g) => {
      unique(g.id);
      place(g.anchorPlaceId);
      g.candidates.forEach((c) => {
        place(c.placeId);
        if (c.distance) {
          place(c.distance.originPlaceId);
          if (!Number.isFinite(c.distance.meters) || c.distance.meters < 0)
            errors.push(`Invalid distance: ${c.placeId}`);
        }
      });
    });
    d.nearbyPlaceIds.forEach(place);
    if (d.returnPlaceId) place(d.returnPlaceId);
  });
  if (!trip.days.length) errors.push("Trip needs at least one day");
  return errors;
}
