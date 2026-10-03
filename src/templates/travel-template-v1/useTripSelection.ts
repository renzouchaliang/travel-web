import { useState } from "react";
import type { Day } from "../../types/travel";
export type ViewportIntent = {
  kind: "day" | "leg" | "place" | "user";
  id?: string;
  revision: number;
};
export function useTripSelection(initialDayId: string) {
  const [activeDayId, setActiveDayId] = useState(initialDayId);
  const [selectedStopId, setStop] = useState<string>();
  const [selectedPlaceId, setPlace] = useState<string>();
  const [selectedLegId, setLeg] = useState<string>();
  const [visibleLayers, setLayers] = useState({
    restaurants: false,
    nearby: false,
  });
  const [mapExpanded, setMapExpanded] = useState(false);
  const [mapInteractionEnabled, setMapInteractionEnabled] = useState(false);
  const [viewportIntent, setIntent] = useState<ViewportIntent>({
    kind: "day",
    revision: 0,
  });
  const intent = (kind: ViewportIntent["kind"], id?: string) =>
    setIntent((v) => ({ kind, id, revision: v.revision + 1 }));
  return {
    activeDayId,
    selectedStopId,
    selectedPlaceId,
    selectedLegId,
    visibleLayers,
    mapExpanded,
    mapInteractionEnabled,
    viewportIntent,
    setMapExpanded,
    setMapInteractionEnabled,
    switchDay: (id: string) => {
      setActiveDayId(id);
      setStop(undefined);
      setPlace(undefined);
      setLeg(undefined);
      intent("day");
    },
    selectPlace: (id: string, day: Day, focus = true, stopId?: string) => {
      setPlace(id);
      setStop(stopId ?? day.stops.find((s) => s.placeId === id)?.id);
      setLeg(undefined);
      if (
        day.restaurantGroups.some((g) =>
          g.candidates.some((c) => c.placeId === id),
        )
      )
        setLayers((v) => ({ ...v, restaurants: true }));
      if (day.nearbyPlaceIds.includes(id))
        setLayers((v) => ({ ...v, nearby: true }));
      if (focus) intent("place", id);
    },
    selectStop: (id: string) => setStop(id),
    selectLeg: (id: string) => {
      setLeg(id);
      setPlace(undefined);
      setStop(undefined);
      intent("leg", id);
    },
    overview: () => {
      setLeg(undefined);
      setPlace(undefined);
      setStop(undefined);
      intent("day");
    },
    userDrag: () => intent("user"),
    toggleLayer: (layer: "restaurants" | "nearby") =>
      setLayers((v) => ({ ...v, [layer]: !v[layer] })),
  };
}
export type TripSelection = ReturnType<typeof useTripSelection>;
