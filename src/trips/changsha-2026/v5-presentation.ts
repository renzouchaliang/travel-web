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
  for (const day of trip.days) {
    for (const stop of day.stops) {
      const place = trip.places[stop.placeId];
      if (place.coordinate?.crs === "GCJ02" && !place.links.some((l) => l.action === "navigation")) {
        const query = new URLSearchParams({ to: `${place.coordinate.lng},${place.coordinate.lat},${place.name}`, mode: place.kind === "hotel" ? "car" : "walk", src: "travel_web", callnative: "1" });
        place.links.push({ id: `${place.id}-navigation`, platform: "高德", action: "navigation", navigationIntent: "current-location", label: "导航过去", targetType: "detail", url: `https://uri.amap.com/navigation?${query}` });
      }
    }
  }
  return trip;
}
