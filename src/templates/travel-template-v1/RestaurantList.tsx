import { useState } from "react";
import type { Day, RestaurantGroup, Trip } from "../../types/travel";
import { ExternalLinks } from "./ExternalLinks";
export function sortedCandidates(
  group: RestaurantGroup,
  trip: Trip,
  platform = "",
) {
  return [...group.candidates].sort((a, b) => {
    if (platform) {
      const ar = trip.places[a.placeId].rating,
        br = trip.places[b.placeId].rating;
      const av = ar?.platform === platform ? ar.value / ar.scale : undefined,
        bv = br?.platform === platform ? br.value / br.scale : undefined;
      return av === undefined
        ? bv === undefined
          ? 0
          : 1
        : bv === undefined
          ? -1
          : bv - av;
    }
    // Distances of different kinds/origins are not silently compared.
    const ad = a.distance,
      bd = b.distance;
    if (!ad) return bd ? 1 : 0;
    if (!bd) return -1;
    return ad.kind === bd.kind && ad.originPlaceId === bd.originPlaceId
      ? ad.meters - bd.meters
      : 0;
  });
}
export function RestaurantRow({
  trip,
  candidate,
  onMap,
}: {
  trip: Trip;
  candidate: RestaurantGroup["candidates"][number];
  onMap: () => void;
}) {
  const p = trip.places[candidate.placeId],
    d = candidate.distance;
  return (
    <article className="restaurant-row">
      <h4>
        {p.name}
        {p.branchName && ` · ${p.branchName}`}
      </h4>
      <p>
        {p.foodTags?.join(" / ")} · {p.address ?? p.areaId ?? "区域暂无"}
      </p>
      {d && <p>{d.kind === "straight" ? "直线约" : d.kind === "walking" ? "步行约" : "驾车约"}{d.meters < 1000 ? `${Math.round(d.meters)}米` : `${(d.meters / 1000).toFixed(1)}公里`}</p>}
      {p.rating && <p>{p.rating.platform} {p.rating.value}/{p.rating.scale}</p>}
      <ExternalLinks links={p.links} />
      <button onClick={onMap}>在地图看门店</button>
    </article>
  );
}
export function RestaurantList({
  trip,
  day,
  onMap,
}: {
  trip: Trip;
  day: Day;
  onMap: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  return <section id="dining"><h2>沿途吃什么</h2><p>按区域选一家，不必全部打卡。</p>{day.restaurantGroups.map((g) => {
    const key = `${day.id}:${g.id}`;
    const candidates = g.candidates;
    return <section className="travel-card restaurant-group" key={key}><h3>{g.title}</h3><p>{g.description}</p>{(expanded[key] ? candidates : candidates.slice(0, g.initialVisible ?? 3)).map((c) => <RestaurantRow key={c.placeId} trip={trip} candidate={c} onMap={() => onMap(c.placeId)} />)}{candidates.length > (g.initialVisible ?? 3) && <button aria-expanded={!!expanded[key]} onClick={() => setExpanded((v) => ({ ...v, [key]: !v[key] }))}>{expanded[key] ? "收起备选" : `再看 ${candidates.length - (g.initialVisible ?? 3)} 家备选`}</button>}</section>;
  })}</section>;
}
