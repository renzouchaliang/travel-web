import type { CSSProperties } from "react";
import type { Day, RouteLeg, Trip } from "../../types/travel";
import type { TripSelection } from "./useTripSelection";
import { PlaceCard } from "./PlaceCard";
export const modeLabel = {
  walk: "步行",
  transit: "公交 / 地铁",
  drive: "自驾",
  taxi: "出租车",
  cycle: "骑行",
};
export function TransitLegCard({
  leg,
  selected,
  onSelect,
  trip,
  day,
}: {
  leg: RouteLeg;
  selected: boolean;
  onSelect: () => void;
  trip: Trip;
  day: Day;
}) {
  const name = (id: string) =>
    trip.places[day.stops.find((s) => s.id === id)!.placeId].name;
  return (
    <article
      id={`leg-${leg.id}`}
      className={`transit-leg mode-${leg.mode} ${selected ? "selected" : ""}`}
    >
      <p className="transit-heading">{leg.preferredLine && <span className="line-badge" style={{ background: leg.lineColor } as CSSProperties}>{leg.preferredLine}</span>} {name(leg.fromStopId)} → {name(leg.toStopId)}</p>
      <p>{leg.summary}</p>
      {[
        leg.directionHint,
        leg.boarding && `上车：${leg.boarding}`,
        leg.alighting && `下车：${leg.alighting}`,
        leg.exitHint && `出口：${leg.exitHint}`,
      ]
        .filter(Boolean)
        .map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      {leg.plannedMinutes && (
        <p>
          计划用时 {leg.plannedMinutes.min}–{leg.plannedMinutes.max} 分钟（
          {leg.plannedMinutes.source === "estimate" ? "估算" : "已核实"}）
        </p>
      )}
      {leg.mapDisplay !== "text-only" && <button onClick={onSelect}>查看这一段</button>}
    </article>
  );
}
export function ItineraryTimeline({
  trip,
  day,
  selection,
  onMap,
  onLeg,
}: {
  trip: Trip;
  day: Day;
  selection: TripSelection;
  onMap: (placeId: string, stopId?: string) => void;
  onLeg: (id: string) => void;
}) {
  return (
    <section id="itinerary" className="itinerary">
      <h2>按这个顺序出发</h2>
      {!day.stops.length && <div className="empty-day"><p>这一天的行程待补充</p></div>}
      <div className="timeline">
        {day.stops.map((stop, i) => (
          <div key={stop.id}>
            <PlaceCard
              place={trip.places[stop.placeId]}
              stop={stop}
              number={["station", "airport"].includes(trip.places[stop.placeId].kind) || stop.role === "optional" ? undefined : day.stops.slice(0, i + 1).filter((s) => !["station", "airport"].includes(trip.places[s.placeId].kind) && s.role !== "optional").length}
              selected={selection.selectedStopId === stop.id}
              onMap={() => onMap(stop.placeId, stop.id)}
              trip={trip}
            />
            {day.legs
              .filter((l) => l.fromStopId === stop.id)
              .map((l) => (
                <TransitLegCard
                  key={l.id}
                  trip={trip}
                  day={day}
                  leg={l}
                  selected={selection.selectedLegId === l.id}
                  onSelect={() => onLeg(l.id)}
                />
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}
