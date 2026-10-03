import { useState } from "react";
import type { Day, RestaurantGroup, Trip } from "../../types/travel";
import { ExternalLinks, safeUrl } from "./ExternalLinks";
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
      <p>
        {d
          ? `${d.kind === "straight" ? "直线约" : d.kind === "walking" ? "步行约" : "驾车约"}${d.meters < 1000 ? `${Math.round(d.meters)}米` : `${(d.meters / 1000).toFixed(1)}公里`} · ${d.source} · ${d.checkedAt ?? "核查时间暂无"}`
          : "距离暂无"}
      </p>
      <p>
        {p.rating
          ? `${p.rating.platform} ${p.rating.value}/${p.rating.scale} · ${p.rating.checkedAt}`
          : "评分暂无"}
      </p>
      {p.rating && safeUrl(p.rating.sourceUrl) && (
        <a
          href={safeUrl(p.rating.sourceUrl)}
          target="_blank"
          rel="noopener noreferrer"
        >
          评分来源 ↗
        </a>
      )}
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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({}),
    [sort, setSort] = useState<Record<string, string>>({});
  const [filters, setFilters] = useState<
    Record<string, { kind: string; max: string; minRating: string }>
  >({});
  return (
    <section id="dining">
      <h2>餐饮候选 · 自由选择</h2>
      <p>不串成必去路线；评分仅在同一平台内比较。</p>
      {day.restaurantGroups.length === 0 && <p>暂无餐饮候选。</p>}
      {day.restaurantGroups.map((g) => {
        const key = `${day.id}:${g.id}`,
          platforms = [
            ...new Set(
              g.candidates
                .map((c) => trip.places[c.placeId].rating?.platform)
                .filter((v): v is string => !!v),
            ),
          ];
        const filter = filters[key] ?? { kind: "", max: "", minRating: "" };
        const updateFilter = (
          field: "kind" | "max" | "minRating",
          value: string,
        ) =>
          setFilters((v) => ({ ...v, [key]: { ...filter, [field]: value } }));
        const candidates = sortedCandidates(g, trip, sort[key]).filter((c) => {
          if (filter.kind && c.distance?.kind !== filter.kind) return false;
          if (
            filter.max &&
            (!c.distance || c.distance.meters > Number(filter.max))
          )
            return false;
          const rating = trip.places[c.placeId].rating;
          if (
            sort[key] &&
            filter.minRating &&
            (!rating ||
              rating.platform !== sort[key] ||
              rating.value / rating.scale < Number(filter.minRating) / 100)
          )
            return false;
          return true;
        });
        return (
          <section className="travel-card restaurant-group" key={key}>
            <h3>{g.title}</h3>
            <p>区域锚点：{trip.places[g.anchorPlaceId].name}</p>
            <p>{g.description}</p>
            <label>
              排序{" "}
              <select
                value={sort[key] ?? ""}
                onChange={(e) =>
                  setSort((v) => ({ ...v, [key]: e.target.value }))
                }
              >
                <option value="">区域内已知距离优先</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p}评分
                  </option>
                ))}
              </select>
            </label>
            <div className="dining-filters">
              <label>
                距离类型{" "}
                <select
                  value={filter.kind}
                  onChange={(e) => updateFilter("kind", e.target.value)}
                >
                  <option value="">全部（含暂无）</option>
                  <option value="straight">直线距离</option>
                  <option value="walking">步行距离</option>
                  <option value="driving">驾车距离</option>
                </select>
              </label>
              <label>
                距离上限（米）{" "}
                <input
                  type="number"
                  min="0"
                  value={filter.max}
                  onChange={(e) => updateFilter("max", e.target.value)}
                  placeholder="不限"
                />
              </label>
              {sort[key] && (
                <label>
                  该平台最低评分（满分百分比）{" "}
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filter.minRating}
                    onChange={(e) => updateFilter("minRating", e.target.value)}
                    placeholder="不限"
                  />
                </label>
              )}
            </div>
            {(filter.kind || filter.max || filter.minRating) && (
              <p>启用筛选时缺少所需数据的候选不显示。不同距离类型不混排。</p>
            )}
            {candidates.length === 0 && <p>没有满足筛选条件的候选。</p>}
            {(expanded[key]
              ? candidates
              : candidates.slice(0, g.initialVisible ?? 3)
            ).map((c) => (
              <RestaurantRow
                key={c.placeId}
                trip={trip}
                candidate={c}
                onMap={() => onMap(c.placeId)}
              />
            ))}
            {candidates.length > (g.initialVisible ?? 3) && (
              <button
                aria-expanded={!!expanded[key]}
                onClick={() => setExpanded((v) => ({ ...v, [key]: !v[key] }))}
              >
                {expanded[key] ? "收起候选" : "展开更多候选"}（
                {candidates.length}）
              </button>
            )}
          </section>
        );
      })}
    </section>
  );
}
