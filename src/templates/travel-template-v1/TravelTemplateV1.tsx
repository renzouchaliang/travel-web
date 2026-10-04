import { useEffect, type CSSProperties } from "react";
import type { Day, TemplateConfig, Trip } from "../../types/travel";
import { validateTrip } from "../../types/validateTrip";
import { AMapAdapter } from "../../maps/AMapAdapter";
import { DayTabs } from "./DayTabs";
import { useTripSelection } from "./useTripSelection";
import { TripMap, type AdapterFactory } from "./TripMap";
import { ItineraryTimeline } from "./ItineraryTimeline";
import { NearbyPhoto } from "./NearbyPhoto";
import { RestaurantList } from "./RestaurantList";
import { dayAppearance } from "./dayAppearance";
import { ExternalLinks, safeUrl } from "./ExternalLinks";

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
function chineseDayCount(count: number): string {
  const digits = "零一二三四五六七八九";
  if (count < 10) return digits[count];
  if (count < 100) return `${count < 20 ? "" : digits[Math.floor(count / 10)]}十${count % 10 ? digits[count % 10] : ""}`;
  return String(count);
}
export function TripHeader({ trip, day }: { trip: Trip; day: Day }) {
  const appearance = dayAppearance(day, trip.days.findIndex((d) => d.id === day.id));
  const image = safeUrl(day.visual?.headerImage?.src);
  const focalPoint = day.visual?.headerImage?.focalPoint;
  const validFocus = focalPoint && [focalPoint.x, focalPoint.y].every((v) => Number.isFinite(v) && v >= 0 && v <= 100);
  const backgroundPosition = validFocus ? `${focalPoint.x}% ${focalPoint.y}%` : "center";
  const dates = trip.days.flatMap((d) => d.date ? [d.date] : []).sort();
  const start = dates[0], end = dates.at(-1);
  const formatDate = (date: string, year = true) => {
    const [y, m, d] = date.split("-").map(Number);
    return `${year ? `${y}年` : ""}${m}月${d}日`;
  };
  const dateRange = start ? `${formatDate(start)}${end && end !== start ? `—${formatDate(end, start.slice(0, 4) !== end.slice(0, 4))}` : ""}` : undefined;
  return (
    <header className="trip-header" style={{ backgroundColor: appearance.accent, color: image ? "#fff" : appearance.foreground, backgroundPosition, backgroundImage: image ? `linear-gradient(#0008, #0008), url(${JSON.stringify(image)})` : undefined }}>
      {image && <span className="sr-only">{day.visual?.headerImage?.alt}</span>}
      <h1>{trip.title}</h1>
      <p>{chineseDayCount(trip.days.length)}天{dateRange && ` · ${dateRange}`}</p>
      <div className="trip-poem" aria-label={day.visual?.poem?.lines.some((line) => line.trim()) ? "当日题诗" : undefined}>
        {day.visual?.poem?.lines.filter((line) => line.trim()).map((line, i) => <p key={i}>{line}</p>)}
      </div>
    </header>
  );
}
export function DaySummary({ trip, day }: { trip: Trip; day: Day }) {
  const route = day.stops.filter((s) => s.role !== "optional").map((s) => trip.places[s.placeId].name).join(" → ");
  return (
    <section className="travel-card day-summary">
      <h2>{day.title}</h2>
      {route && <p className="day-route">{route}</p>}
      <p>{day.directionSummary}</p>
      {day.alerts.map((a, i) => (
        <p className="alert" key={i}>
          {a}
        </p>
      ))}
    </section>
  );
}
export function NearbyPlaces({ trip, onMap }: { trip: Trip; onMap: (id: string) => void }) {
  const ids = [...new Set(trip.days.flatMap((d) => d.nearbyPlaceIds))];
  if (!ids.length) return null;
  return <section id="nearby" className="nearby-list"><h2>周边还有什么有趣的</h2><p>未列入固定行程，按兴趣和体力选择。</p>{ids.map((id) => {
    const place = trip.places[id];
    return <details className="nearby-row" key={id}><summary>{place.name}</summary><div className="nearby-detail"><div><p>{place.summary}</p>{place.address && <p>{place.address}</p>}{([ ["开放", place.opening], ["门票", place.ticket], ["预约", place.booking] ] as const).map(([label, fact]) => fact && <p className="nearby-fact" key={label}>{label}：{fact.text}</p>)}</div><NearbyPhoto photos={place.photos} /></div><div className="card-actions"><button className="compact-map-button" onClick={() => onMap(id)}>在地图看</button><ExternalLinks links={place.links} /></div></details>;
  })}</section>;
}
export function MobileQuickNav() {
  return (
    <nav className="mobile-quick-nav" aria-label="手机快捷导航">
      <button onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}>总览</button>
      <button onClick={() => scrollToSection("trip-map")}>地图</button>
      <button onClick={() => scrollToSection("itinerary")}>行程</button>
      <button onClick={() => scrollToSection("dining")}>吃饭</button>
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
        {!!day.stops.length && <div className="map-itinerary">
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
        </div>}
        {!day.stops.length && <div className="empty-day">这一天的行程待补充</div>}
        {!!day.restaurantGroups.length && <RestaurantList trip={trip} day={day} onMap={onMap} />}


      </div>
      <NearbyPlaces trip={trip} onMap={(id) => {
        const targetDay = trip.days.find((d) => d.nearbyPlaceIds.includes(id)) ?? day;
        if (targetDay.id !== day.id) selection.switchDay(targetDay.id);
        selection.selectPlace(id, targetDay, true);
        requestAnimationFrame(() => scrollToSection("trip-map"));
      }} />
      <MobileQuickNav />
    </main>
  );
}
