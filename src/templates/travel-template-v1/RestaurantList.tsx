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
      <h4><button className="restaurant-title-button" onClick={onMap} aria-label={`在地图看${p.name}`}>{p.name}{p.branchName && ` · ${p.branchName}`} <span aria-hidden="true" className="inline-map-icon">⌖</span></button></h4>
      <p>
        {p.foodTags?.join(" / ")} · {p.address ?? p.areaId ?? "区域暂无"}
      </p>
      {d && <p>{d.kind === "straight" ? "直线约" : d.kind === "walking" ? "步行约" : "驾车约"}{d.meters < 1000 ? `${Math.round(d.meters)}米` : `${(d.meters / 1000).toFixed(1)}公里`}</p>}
      {p.rating && <p>{p.rating.platform} {p.rating.value}/{p.rating.scale}</p>}
      <ExternalLinks links={p.links} />

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
  const [activeGroups, setActiveGroups] = useState<Record<string, string>>({});
  const active = day.restaurantGroups.find((g) => g.id === activeGroups[day.id]) ?? day.restaurantGroups[0];
  const choose = (id: string) => setActiveGroups((v) => ({ ...v, [day.id]: id }));
  return <section id="dining"><h2>沿途吃什么</h2><p>按所在位置选一家，点击店名在地图看。</p>
    <div className="dining-tabs" role="tablist" aria-label="附近餐饮区域">{day.restaurantGroups.map((g, i) => <button key={g.id} id={`dining-tab-${day.id}-${g.id}`} role="tab" aria-selected={active?.id === g.id} aria-controls={`dining-panel-${day.id}`} tabIndex={active?.id === g.id ? 0 : -1} onClick={() => choose(g.id)} onKeyDown={(e) => {
      let next = i;
      if (e.key === "ArrowRight") next = (i + 1) % day.restaurantGroups.length;
      else if (e.key === "ArrowLeft") next = (i + day.restaurantGroups.length - 1) % day.restaurantGroups.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = day.restaurantGroups.length - 1;
      else return;
      e.preventDefault(); choose(day.restaurantGroups[next].id); document.getElementById(`dining-tab-${day.id}-${day.restaurantGroups[next].id}`)?.focus();
    }}>{g.title}</button>)}</div>
    {active && <section className="travel-card restaurant-group" id={`dining-panel-${day.id}`} role="tabpanel" aria-labelledby={`dining-tab-${day.id}-${active.id}`}><p>{active.description}</p>{active.candidates.map((c) => <RestaurantRow key={c.placeId} trip={trip} candidate={c} onMap={() => onMap(c.placeId)} />)}</section>}
  </section>;
}
