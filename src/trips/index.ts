import { changshaTrip } from "./changsha-2026/adapter";
import type { Trip } from "../types/travel";

// Page selection stays outside reusable templates; new trips can choose another UI.
export const publishedTrips: Record<string, Trip> = {
  [changshaTrip.id]: changshaTrip,
};
export function resolvePublishedTrip(
  pathname: string,
  params: URLSearchParams,
): Trip | undefined {
  const match = pathname.match(/^\/trips\/([^/]+)\/?$/);
  const id = match?.[1] ?? params.get("trip");
  return id ? publishedTrips[id] : undefined;
}
