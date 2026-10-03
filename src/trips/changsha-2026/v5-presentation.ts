import type { Trip } from "../../types/travel";

// Presentation details retained from the user's supplied V5 HTML. The original
// export stays unchanged, and these historical facts are not a new live check.
export function applyV5Presentation(trip: Trip): Trip {
  trip.places["academy-entrance"] = { id: "academy-entrance", name: "岳麓书院入口附近", kind: "other", coordinate: { lng: 112.9416, lat: 28.18028, crs: "GCJ02" }, providerIds: { amapCity: "长沙市" }, photos: [], links: [] };
  trip.places["hnu-metro"] = { id: "hnu-metro", name: "湖南大学地铁站", kind: "other", coordinate: { lng: 112.946592, lat: 28.179689, crs: "GCJ02" }, providerIds: { amapCity: "长沙市" }, photos: [], links: [] };
  for (const leg of trip.days[0].legs) {
    if (leg.id === "d1-l2") leg.routingToPlaceId = "academy-entrance";
    if (leg.id === "d1-l3") leg.routingFromPlaceId = "academy-entrance";
    if (leg.id === "d1-l5") leg.routingFromPlaceId = "hnu-metro";
  }
  const nearby = [
    { id: "academy-entrance", name: "赫曦台", lng: 112.9416, lat: 28.18028, summary: "书院入口附近，可顺路短停。" },
    { id: "zibei", name: "自卑亭", lng: 112.944523, lat: 28.179677, summary: "东方红广场旁，可顺路看一看。" },
    { id: "hnu-stone", name: "湖南大学石碑", lng: 112.952741, lat: 28.17883, summary: "广场以东，需要额外步行，可按体力选择。" },
  ];
  for (const item of nearby) {
    trip.places[item.id] = { id: item.id, name: item.name, kind: "other", mapRole: "nearby", summary: item.summary, coordinate: { lng: item.lng, lat: item.lat, crs: "GCJ02" }, providerIds: { amapCity: "长沙市" }, photos: [], links: [] };
  }
  trip.days[0].nearbyPlaceIds = [...new Set([...trip.days[0].nearbyPlaceIds, ...nearby.map((p) => p.id)])];
  if (trip.places.square) trip.places.square.mapLabel = "湖大广场";
  if (trip.places["lushan-food"]) trip.places["lushan-food"].mapLabel = "麓山南路逛吃";
  const academy = trip.places.academy;
  if (academy) {
    academy.openingMilestones = [
      { time: "17:30", label: "停止售票" },
      { time: "17:40", label: "停止入院" },
      { time: "18:00", label: "闭馆" },
    ];
    academy.opening = { text: "5—10月常规开放时间，特殊安排以当天公告为准。", sourceIds: ["v5"], status: "unverified" };
    academy.booking = { text: "微信搜索“岳麓书院”公众号预约，含当天可提前4天。入院携带预约使用的有效证件。", sourceIds: ["v5"], status: "unverified" };
    academy.ticket = { text: "全价票40元；符合免票政策的游客也须预约。", sourceIds: ["v5"], status: "unverified" };
    academy.links = [
      { id: "academy-v5-guide", platform: "携程", label: "携程攻略", action: "guide", targetType: "detail", url: "https://gs.ctrip.com/html5/you/sight/changsha148/9013.html" },
      { id: "academy-v5-booking", platform: "官方", label: "官网预约", action: "booking", targetType: "detail", url: "https://ylsy.hnu.edu.cn/wbly/cgdn/zxdp.htm" },
    ];
  }
  for (const day of trip.days) {
    if (day.restaurantGroups.length) for (const group of day.restaurantGroups) group.initialVisible = 5;
    for (const stop of day.stops) {
      if (stop.id === "d1-arrival") stop.transport ??= { direction: "arrival", mode: "rail", destination: "长沙南站", arrivalTime: stop.startTime };
    }
  }
  for (const place of Object.values(trip.places)) {
    const existing = place.links.find((l) => l.platform === "高德" && l.url.startsWith("https://www.amap.com/place/"));
    place.links = place.links.filter((l) => l.platform !== "高德");
    const coordinate = place.coordinate;
    const query = coordinate?.crs === "GCJ02" ? new URLSearchParams({ position: `${coordinate.lng},${coordinate.lat}`, name: place.name, src: "travel_web", coordinate: "gaode", callnative: "1" }) : undefined;
    const url = existing?.url ?? (query ? `https://uri.amap.com/marker?${query}` : undefined);
    if (url) place.links.push({ id: `${place.id}-location`, platform: "高德", action: "location", label: "高德地图打开", targetType: "detail", url });
  }
  return trip;
}
