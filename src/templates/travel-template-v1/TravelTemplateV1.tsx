import { useEffect, type CSSProperties } from "react";
import type { Day, TemplateConfig, Trip } from "../../types/travel";
import { validateTrip } from "../../types/validateTrip";
import { AMapAdapter } from "../../maps/AMapAdapter";
import { DayTabs } from "./DayTabs";
import { useTripSelection } from "./useTripSelection";
import { TripMap, type AdapterFactory } from "./TripMap";
import { ItineraryTimeline } from "./ItineraryTimeline";
import { RestaurantList } from "./RestaurantList";
import { PlaceCard } from "./PlaceCard";
import { safeUrl } from "./ExternalLinks";
import { defaultConfig, themeVariables } from "./theme";
import { scrollToSection } from "./accessibility";
import "./template.css";
const createAMap: AdapterFactory = () =>
  new AMapAdapter({
    publicKey: import.meta.env.VITE_AMAP_PUBLIC_KEY,
    serviceHost: import.meta.env.VITE_AMAP_SERVICE_HOST,
  });
const unavailableMap: AdapterFactory = () => ({
  provider: "unconfigured",
  mount: async () => {
    throw new Error("unconfigured");
  },
  render: () => {},
  fit: () => {},
  interaction: () => {},
  resize: () => {},
  route: async (request) => ({
    legId: request.leg.id,
    status: "error",
    provider: "unconfigured",
    segments: [],
    errorKind: "unsupported-provider",
  }),
  destroy: () => {},
});
export function TripHeader({ trip, day }: { trip: Trip; day: Day }) {
  return (
    <header className="trip-header">
      <h1>{trip.title}</h1>
      <p>
        {trip.days.length} 天 · {trip.timezone}
        {day.date && ` · ${day.date}`}
      </p>
      <p className="main-route">
        {day.stops
          .filter((s) => s.role !== "optional")
          .map((s) => trip.places[s.placeId].name)
          .join(" → ")}
      </p>
    </header>
  );
}
export function DaySummary({ trip, day }: { trip: Trip; day: Day }) {
  return (
    <section className="travel-card day-summary">
      <h2>当天快速概览</h2>
      <p>
        {day.stops
          .filter((s) => s.role !== "optional")
          .map((s) => trip.places[s.placeId].name)
          .join(" → ")}
      </p>
      <p>{day.directionSummary}</p>
      {day.alerts.map((a, i) => (
        <p className="alert" key={i}>
          {a}
        </p>
      ))}
    </section>
  );
}
export function NearbyPlaces({
  trip,
  day,
  onMap,
}: {
  trip: Trip;
  day: Day;
  onMap: (id: string) => void;
}) {
  return (
    <section id="nearby">
      <h2>可选周边</h2>
      <p>顺路可选或需要绕行，均非当天必经节点。</p>
      {day.nearbyPlaceIds.length === 0 && <p>暂无可选周边。</p>}
      {day.nearbyPlaceIds.map((id) => (
        <PlaceCard
          key={id}
          place={trip.places[id]}
          trip={trip}
          onMap={() => onMap(id)}
        />
      ))}
    </section>
  );
}
export function MobileQuickNav({
  trip,
  day,
  onReturn,
}: {
  trip: Trip;
  day: Day;
  onReturn: () => void;
}) {
  const target = day.returnPlaceId && trip.places[day.returnPlaceId];
  return (
    <nav className="mobile-quick-nav" aria-label="手机快捷导航">
      <button onClick={() => scrollToSection("trip-map")}>地图</button>
      <button onClick={() => scrollToSection("itinerary")}>行程</button>
      <button onClick={() => scrollToSection("dining")}>吃饭</button>
      {target && (
        <button onClick={onReturn}>
          {target.kind === "hotel" ? "回酒店" : "去终点"}
        </button>
      )}
    </nav>
  );
}
export function TravelTemplateV1({
  trip,
  config = defaultConfig,
  createAdapter,
}: {
  trip: Trip;
  config?: TemplateConfig;
  createAdapter?: AdapterFactory;
}) {
  const selection = useTripSelection(
    config.initialDayId && trip.days.some((d) => d.id === config.initialDayId)
      ? config.initialDayId
      : (trip.days[0]?.id ?? ""),
  );
  useEffect(() => {
    document.title = trip.title;
    const before = () =>
      document
        .querySelectorAll<HTMLDetailsElement>(".travel-template details")
        .forEach((el) => {
          el.dataset.printWasOpen = String(el.open);
          el.open = true;
        });
    const after = () =>
      document
        .querySelectorAll<HTMLDetailsElement>(".travel-template details")
        .forEach((el) => {
          el.open = el.dataset.printWasOpen === "true";
          delete el.dataset.printWasOpen;
        });
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, [trip.title]);
  const errors = validateTrip(trip);
  if (errors.length)
    return (
      <main className="travel-template">
        <h1>旅行数据需要修正</h1>
        <ul>
          {errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      </main>
    );
  const day =
    trip.days.find((d) => d.id === selection.activeDayId) ?? trip.days[0];
  const onMap = (id: string, stopId?: string) => {
    selection.selectPlace(id, day, true, stopId);
    scrollToSection("trip-map");
  };
  const onLeg = (id: string) => {
    selection.selectLeg(id);
    scrollToSection("trip-map");
  };
  const onItinerary = (id: string) => {
    selection.selectStop(id);
    selection.setMapExpanded(false);
    requestAnimationFrame(() => scrollToSection(`stop-${id}`));
  };
  return (
    <main
      className={`travel-template layout-${config.desktopLayout} map-${config.mapSide}`}
      style={
        themeVariables({
          ...defaultConfig.theme,
          ...config.theme,
        }) as CSSProperties
      }
    >
      <TripHeader trip={trip} day={day} />
      <DayTabs
        days={trip.days}
        active={day.id}
        onSelect={selection.switchDay}
      />
      <div
        id="day-content"
        role={trip.days.length > 1 ? "tabpanel" : undefined}
        aria-labelledby={trip.days.length > 1 ? `tab-${day.id}` : undefined}
      >
        <DaySummary trip={trip} day={day} />
        <div className="map-itinerary">
          <TripMap
            trip={trip}
            day={day}
            selection={selection}
            createAdapter={
              createAdapter ??
              (config.mapProvider === "amap" ? createAMap : unavailableMap)
            }
            onItinerary={onItinerary}
          />
          <ItineraryTimeline
            trip={trip}
            day={day}
            selection={selection}
            onMap={onMap}
            onLeg={onLeg}
          />
        </div>
        <RestaurantList trip={trip} day={day} onMap={onMap} />
        <NearbyPlaces trip={trip} day={day} onMap={onMap} />
        <details className="travel-card sources">
          <summary>来源与更新信息</summary>
          {trip.sources.length === 0 ? (
            <p>演示数据尚未核查，无真实评分、时长或图片授权声明。</p>
          ) : (
            trip.sources.map((s) => (
              <p key={s.id}>
                {safeUrl(s.url) ? (
                  <a
                    href={safeUrl(s.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.title} ↗
                  </a>
                ) : (
                  s.title
                )}{" "}
                · {s.checkedAt ?? "未核查"}
              </p>
            ))
          )}
          {Object.values(trip.places).flatMap((p) =>
            p.photos.map((photo) => (
              <p key={`${p.id}:${photo.id}`}>
                {p.name}：{photo.author ?? "作者未知"} · 权利：{photo.rights}{" "}
                {safeUrl(photo.sourceUrl) && (
                  <a
                    href={safeUrl(photo.sourceUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    图片来源 ↗
                  </a>
                )}
              </p>
            )),
          )}
        </details>
      </div>
      <MobileQuickNav
        trip={trip}
        day={day}
        onReturn={() => {
          if (day.returnPlaceId) {
            const leg = day.legs.find(
              (l) =>
                trip.places[day.stops.find((s) => s.id === l.toStopId)!.placeId]
                  .id === day.returnPlaceId && !l.includeInOverview,
            );
            if (leg) onLeg(leg.id);
            else onMap(day.returnPlaceId);
          }
        }}
      />
    </main>
  );
}
