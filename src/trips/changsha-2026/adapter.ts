import source from "./trip-changsha-2026.json" with { type: "json" };
import type {
  Coordinate,
  Day,
  Distance,
  ExternalLink,
  Place,
  RouteLeg,
  Stop,
  Trip,
} from "../../types/travel";

// The uploaded export is immutable. These types describe its actual fields,
// including null; the view model uses undefined/empty collections only to render.
type RawExport = typeof source;
type RawStop = NonNullable<RawExport["trip"]["days"][number]["stops"]>[number];
type ExportStop = RawStop & {
  coordinateReference?: {
    lng: number;
    lat: number;
    crs: string;
    precisionNote: string;
  };
  durationRangeMinutes?: { min: number; max: number };
  imageReference?: {
    url: string;
    sourceUrl: string;
    credit: string;
    placeholder: string;
    reusePermission: null;
    publishableUrl: null;
  };
};
type ExportDay = Omit<RawExport["trip"]["days"][number], "stops"> & {
  stops: ExportStop[] | null;
};
export type ChangshaExport = Omit<RawExport, "trip"> & {
  trip: Omit<RawExport["trip"], "days"> & { days: ExportDay[] };
};
type DiningGroup = NonNullable<ExportDay["dining"]>[number];
type Restaurant = DiningGroup["restaurants"][number];
type Guide = { title: string; provider: string; url: string; type: string };
type LinkOwner = {
  officialUrl: string | null;
  mapUrl: string | null;
  guideUrls: Guide[];
  reviewUrl?: string | null;
};
const statusText: Record<string, string> = {
  confirmed: "已确认",
  tentative: "暂定",
  unknown: "未确认",
};
const join = (parts: (string | null | undefined)[]) =>
  parts.filter(Boolean).join("；");

function links(ownerId: string, value: LinkOwner): ExternalLink[] {
  const result: ExternalLink[] = [];
  const add = (
    url: string | null | undefined,
    platform: string,
    label: string,
    action: ExternalLink["action"],
  ) => {
    if (!url || result.some((link) => link.url === url)) return;
    result.push({
      id: `${ownerId}-link-${result.length + 1}`,
      platform,
      label,
      url,
      action,
      targetType: "detail",
    });
  };
  for (const link of value.guideUrls) {
    const action: ExternalLink["action"] =
      link.type === "review"
        ? "reviews"
        : link.type === "official"
          ? "official"
          : link.type === "booking"
            ? "booking"
            : "guide";
    // Map POI pages are location details, never mislabeled as turn-by-turn navigation.
    add(
      link.url,
      link.provider,
      `${link.provider} · ${link.type === "map" ? "地图位置" : link.title}`,
      action,
    );
  }
  add(value.officialUrl, "官方", "官方信息", "official");
  add(value.mapUrl, "高德", "高德 · 地图位置", "guide");
  add(value.reviewUrl, "大众点评", "大众点评", "reviews");
  return result;
}

function coordinate(value: {
  lng: number | null;
  lat: number | null;
  coordinateReference?: { lng: number; lat: number; crs: string };
}): Coordinate | undefined {
  if (value.lng === null || value.lat === null) return undefined;
  // The export's trip.notes explicitly identifies all supplied coordinates as GCJ02.
  if (value.coordinateReference && value.coordinateReference.crs !== "GCJ02")
    throw new Error("Unsupported exported coordinate system");
  return { lng: value.lng, lat: value.lat, crs: "GCJ02" };
}

export function adaptChangsha(input: ChangshaExport): Trip {
  if (input.schemaVersion !== "1.0")
    throw new Error("Unsupported travel export schema");
  const exported = input.trip;
  const places: Record<string, Place> = {};
  const allStops = exported.days.flatMap((day) => day.stops ?? []);
  for (const stop of allStops) {
    const existing = places[stop.placeId];
    if (existing) {
      // Sharing a physical POI must never overwrite visit-specific descriptions/times.
      for (const link of links(stop.placeId, stop))
        if (!existing.links.some((old) => old.url === link.url))
          existing.links.push({
            ...link,
            id: `${stop.placeId}-link-${existing.links.length + 1}`,
          });
      continue;
    }
    const kind: Place["kind"] =
      stop.type === "transport"
        ? "station"
        : stop.type === "shopping"
          ? "other"
          : stop.type === "hotel"
            ? "hotel"
            : stop.type === "attraction"
              ? "attraction"
              : "other";
    const image = stop.imageReference;
    places[stop.placeId] = {
      id: stop.placeId,
      name: stop.name,
      kind,
      address: stop.address ?? undefined,
      coordinate: coordinate(stop),
      providerIds: { amapCity: exported.city },
      links: links(stop.placeId, stop),
      // Unknown-rights reference images are never embedded by PhotoGallery.
      photos: image
        ? [
            {
              id: `${stop.placeId}-image-reference`,
              src: image.url,
              alt: image.credit,
              caption: image.placeholder,
              sourceUrl: image.sourceUrl,
              author: image.credit,
              rights: "unknown",
            },
          ]
        : [],
    };
  }
  const hotel = places[exported.hotel.placeId];
  hotel.summary = join([
    `${exported.hotel.checkInDate} 入住，${exported.hotel.checkOutDate} 退房，共 ${exported.hotel.nights} 晚`,
    exported.hotel.notes,
    "入住及退房具体时刻未确认",
  ]);

  const originIds = new Map<string, string>();
  function restaurant(group: DiningGroup, item: Restaurant) {
    const id = item.id;
    places[id] = {
      id,
      name: item.name,
      kind: "restaurant",
      areaId: group.area,
      address: item.address ?? undefined,
      coordinate: coordinate(item),
      photos: [],
      links: links(id, item),
      foodTags: [item.category],
      summary: join(item.notes),
    };
    let distance: Distance | undefined;
    if (item.distance) {
      let originPlaceId = originIds.get(item.distance.origin);
      if (!originPlaceId) {
        originPlaceId = `${exported.id}-distance-origin-${originIds.size + 1}`;
        originIds.set(item.distance.origin, originPlaceId);
        // A named measurement origin is not an extra itinerary stop or a guessed pin.
        places[originPlaceId] = {
          id: originPlaceId,
          name: item.distance.origin,
          kind: "other",
          photos: [],
          links: [],
        };
      }
      const kind = item.distance.kind;
      if (kind !== "walking" && kind !== "straight" && kind !== "driving")
        throw new Error("Unsupported distance type");
      distance = {
        meters: item.distance.meters,
        kind,
        originPlaceId,
        source: `起点：${item.distance.origin}；${item.distance.basis}`,
      };
    }
    return { placeId: id, distance };
  }

  const days: Day[] = exported.days.map((day) => {
    const stops: Stop[] = (day.stops ?? []).map((stop) => {
      const isReturn = stop.id === "d1-return";
      const role: Stop["role"] =
        stop.id === "d1-food" ? "free-time" : isReturn ? "optional" : "main";
      const sourceTitles = stop.sourceIds
        .map((id) => input.sources.find((s) => s.id === id)?.title)
        .filter(Boolean)
        .join("、");
      const returnInfo =
        day.date === exported.returnTransport.date &&
        stop.placeId === exported.returnTransport.departurePlaceId
          ? `已确认高铁发车时间：${exported.returnTransport.departureTime}；到站时间、车次和目的地未确认`
          : undefined;
      return {
        id: stop.id,
        placeId: stop.placeId,
        startTime: stop.arrivalTime ?? undefined,
        endTime: stop.departureTime ?? undefined,
        stayMinutes:
          stop.durationRangeMinutes ??
          (stop.durationMinutes !== null
            ? { min: stop.durationMinutes, max: stop.durationMinutes }
            : undefined),
        role,
        note: join([
          `行程状态：${statusText[stop.status] ?? stop.status}`,
          stop.description,
          stop.timeWindow && `时段：${stop.timeWindow}`,
          `时间依据：${stop.timeBasis}`,
          ...stop.notes,
          stop.coordinateReference?.precisionNote,
          returnInfo,
          sourceTitles && `来源：${sourceTitles}`,
        ]),
      };
    });
    const legs: RouteLeg[] = exported.routeLegs
      .filter((leg) => leg.day === day.day)
      .map((leg) => {
        if (leg.mode !== "metro" && leg.mode !== "walk")
          throw new Error(`Unsupported route mode: ${leg.mode}`);
        return {
          id: leg.id,
          fromStopId: leg.fromStopId,
          toStopId: leg.toStopId,
          mode: leg.mode === "metro" ? "transit" : "walk",
          summary: leg.description,
          plannedMinutes: leg.durationRangeMinutes
            ? { ...leg.durationRangeMinutes, source: "estimate" }
            : undefined,
          // Free dining and the standalone return stay out of the all-day route overlay.
          includeInOverview: leg.id !== "d1-l4" && leg.id !== "d1-l5",
          sourceIds: [...leg.sourceIds],
        };
      });
    const groups = (day.dining ?? []).map((group) => ({
      id: group.id,
      title: group.area,
      anchorPlaceId: group.anchorPlaceId,
      initialVisible: group.initialVisible,
      description: join([
        "候选清单不代表已确定用餐；评分与营业状态未确认。",
        ...group.restaurants.flatMap((item) =>
          item.notes
            .filter((note) => !note.startsWith("候选清单"))
            .map((note) => `${item.name}：${note}`),
        ),
      ]),
      candidates: group.restaurants.map((item) => restaurant(group, item)),
    }));
    const end = (day.stops ?? []).find((stop) => stop.id === day.endLocationId);
    const alerts = [
      `旅行日期：${exported.startDate} 至 ${exported.endDate}；酒店 ${exported.hotel.nights} 晚。`,
      `当天安排：${statusText[day.status] ?? day.status}`,
      ...day.notes,
    ];
    if (day.day === 1)
      alerts.push(...input.validation.timeConflicts.slice(0, 4));
    if (day.stops === null) alerts.push("当天行程尚未确认，按原始资料留空。");
    if (day.dining === null) alerts.push("当天餐饮尚未确认。");
    if (day.day !== 1 && day.stops)
      alerts.push("当天交通衔接、精确时间尚未确认；不补充路线或用时。");
    if (day.date === exported.returnTransport.date)
      alerts.push(
        `已确认 ${exported.returnTransport.departureTime} 高铁发车；到站时间、车次和目的地未确认。`,
      );
    return {
      id: `${exported.id}-day-${day.day}`,
      date: day.date,
      title: day.title ?? "行程尚未确认",
      directionSummary: day.summary ?? "",
      stops,
      legs,
      restaurantGroups: groups,
      nearbyPlaceIds: [],
      returnPlaceId: end?.placeId,
      alerts,
    };
  });
  return {
    id: exported.id,
    title: exported.title,
    timezone: exported.timezone,
    places,
    days,
    sources: input.sources.map((item) => ({
      id: item.id,
      title: join([
        item.title,
        `资料提供方：${item.provider}`,
        item.accessedDate &&
          `资料访问日期：${item.accessedDate}（不代表实用信息核查日期）`,
        ...item.usedFor,
      ]),
      url: item.url ?? "",
    })),
  };
}
export const changshaTrip = adaptChangsha(source);
