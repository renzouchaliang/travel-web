import type { Day, RouteResult, Trip } from "../../types/travel";
import type { TripSelection } from "./useTripSelection";
import { ExternalLinks } from "./ExternalLinks";
import { Address } from "./PlaceCard";
import { modeLabel } from "./ItineraryTimeline";
export function MapStatus({
  status,
  onRetry,
}: {
  status: string;
  onRetry: () => void;
}) {
  const text: Record<string, string> = {
    loading: "地图加载中…",
    ready: "地图已加载；路线状态单独显示。",
    unconfigured: "地图未配置：完整文字行程仍可使用。",
    "sdk-error": "地图暂未加载，可先按下方交通说明出行。",
    "basemap-timeout": "地图加载较慢，请稍后重试。",
  };
  return (
    <div className="map-status" role="status">
      <p>{text[status] ?? "地图不可用，请阅读文字行程。"}</p>
      {["sdk-error", "basemap-timeout"].includes(status) && (
        <button onClick={onRetry}>重试地图</button>
      )}
    </div>
  );
}
export function MapControls({
  selection,
  collapsed,
  onCollapse,
}: {
  selection: TripSelection;
  collapsed: boolean;
  onCollapse: () => void;
}) {
  return (
    <div className="map-controls">
      <button onClick={selection.overview}>查看全天</button>
      <button
        aria-pressed={selection.visibleLayers.restaurants}
        onClick={() => selection.toggleLayer("restaurants")}
      >
        餐饮点
      </button>
      <button
        aria-pressed={selection.visibleLayers.nearby}
        onClick={() => selection.toggleLayer("nearby")}
      >
        周边有趣地点
      </button>
      <button className="map-expand-toggle" onClick={() => selection.setMapExpanded(!selection.mapExpanded)}>
        {selection.mapExpanded ? "关闭全屏地图" : "放大地图"}
      </button>
      {!selection.mapExpanded && (
        <button aria-expanded={!collapsed} onClick={onCollapse}>
          {collapsed ? "展开地图" : "收起地图"}
        </button>
      )}

    </div>
  );
}
export function PlacePreview({
  trip,
  day,
  selection,
  onItinerary,
}: {
  trip: Trip;
  day: Day;
  selection: TripSelection;
  onItinerary: (id: string) => void;
}) {
  const p = selection.selectedPlaceId && trip.places[selection.selectedPlaceId];
  if (!p) return null;
  const stops = day.stops.filter((s) => s.placeId === p.id);
  return (
    <div className="place-preview">
      <h3>{p.name}</h3>
      <p>{p.summary}</p>
      <p>
        {p.kind === "restaurant"
          ? "候选餐饮，非必经节点"
          : day.nearbyPlaceIds.includes(p.id)
            ? "可选周边，非必经节点"
            : "行程地点"}
      </p>
      <Address place={p} />
      <ExternalLinks links={p.links} />
      {stops.map((s) => (
        <div key={`summary-${s.id}`}>
          <p>
            计划时间：{s.startTime ?? "未定"}–{s.endTime ?? "未定"}
          </p>
          <p>{s.note ?? p.summary ?? "暂无地点简介。"}</p>
        </div>
      ))}
      {stops.map((s, i) => (
        <button key={s.id} onClick={() => onItinerary(s.id)}>
          查看行程
          {stops.length > 1
            ? ` · 停留 ${i + 1} (${s.role === "optional" ? "返程 / 可选" : "主行程"})`
            : ""}
        </button>
      ))}
      {!p.coordinate && <p>暂无坐标；可复制已提供的地址或使用有效外链。</p>}
    </div>
  );
}
export function RoutePanel({
  trip,
  day,
  selection,
  results,
  onRetry,
  sequenceOnly = false,
}: {
  trip: Trip;
  day: Day;
  selection: TripSelection;
  results: Record<string, RouteResult>;
  onRetry: (id: string) => void;
  sequenceOnly?: boolean;
}) {
  const legs = selection.selectedLegId
    ? day.legs.filter((l) => l.id === selection.selectedLegId)
    : day.legs.filter((l) => l.includeInOverview && l.mapDisplay !== "text-only");
  return (
    <div className="route-panel">
      <h3>{selection.selectedLegId ? "当前路段" : "全天主路线"}</h3>
      <label>
        路线范围{" "}
        <select
          value={selection.selectedLegId ?? ""}
          onChange={(e) =>
            e.target.value
              ? selection.selectLeg(e.target.value)
              : selection.overview()
          }
        >
          <option value="">查看全天</option>
          {day.legs.filter((l) => l.mapDisplay !== "text-only").map((l) => (
            <option key={l.id} value={l.id}>
              {
                trip.places[
                  day.stops.find((s) => s.id === l.fromStopId)!.placeId
                ].name
              }{" "}
              →{" "}
              {
                trip.places[day.stops.find((s) => s.id === l.toStopId)!.placeId]
                  .name
              }
            </option>
          ))}
        </select>
      </label>
      {legs.map((l) => {
        const r = results[l.id];
        return (
          <div key={l.id}>
            <p>
              {modeLabel[l.mode]} · {l.summary}
            </p>
            {l.plannedMinutes && (
              <p>
                计划用时：{l.plannedMinutes.min}–{l.plannedMinutes.max} 分钟（
                {l.plannedMinutes.source === "estimate" ? "预留" : "计划"}）
              </p>
            )}
            <small>
              {l.mapDisplay === "text-only" ? "仅提供交通说明，不绘制接驳路线。" : sequenceOnly
                ? "仅显示顺序示意；不查询驾车、公交或步行导航。"
                : !r
                  ? "未查询：以文字说明为准"
                  : r.status === "loading"
                    ? "路线查询中"
                    : r.status === "error"
                      ? "路线暂未加载，请按交通说明出行或打开高德导航。"
                      : r.status === "partial"
                        ? "仅部分真实路径可用；缺段不补线。"
                        : "已获取真实路线"}
            </small>
            {r?.routeLabel && <p>{r.routeLabel}</p>}
            {r?.planMismatch && <p className="alert">未返回已选地铁线路，当前显示高德备选方案，请核对后使用。</p>}
            {r?.durationSeconds !== undefined && (
              <p>
                动态查询约 {Math.ceil(r.durationSeconds / 60)}{" "}
                分钟；不改变计划时间。
              </p>
            )}
            {r?.distanceMeters !== undefined && (
              <p>查询距离 {(r.distanceMeters / 1000).toFixed(1)} 公里</p>
            )}
            {r?.status === "error" && (
              <button onClick={() => onRetry(l.id)}>重试路线</button>
            )}
          </div>
        );
      })}
    </div>
  );
}
