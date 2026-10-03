import type { Place } from "../types/travel";

/** Labels are presentation fields; the full branch/address remain in the data. */
export function mapLabel(place: Place, hotelCount = 1): string {
  if (place.mapLabel) return place.mapLabel;
  if (place.kind === "hotel" && hotelCount === 1) return "酒店";
  if (place.kind === "restaurant")
    return place.name.replace(/[（(].*?[）)]/g, "").trim();
  return place.name;
}
