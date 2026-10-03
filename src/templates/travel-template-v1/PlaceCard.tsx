import { useState } from "react";
import type { Place, Stop, Trip } from "../../types/travel";
import { ExternalLinks, safeUrl } from "./ExternalLinks";
import { PhotoGallery } from "./PhotoGallery";
export function Address({ place }: { place: Place }) {
  const [status, setStatus] = useState("");
  return place.address ? (
    <div>
      <p>{place.address}</p>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(place.address!);
            setStatus("地址已复制");
          } catch {
            setStatus("无法自动复制，请选择上方地址手动复制。");
          }
        }}
      >
        复制地址
      </button>
      <span role="status">{status}</span>
    </div>
  ) : null;
}
export function HotelCard({ place }: { place: Place }) {
  return (
    <>
      <p>酒店 · 入住 / 行李寄存 / 返程信息</p>
      <Address place={place} />
    </>
  );
}
export function TransportCard({ place }: { place: Place }) {
  return (
    <>
      <p>{place.kind === "airport" ? "机场" : "车站"} · 抵达 / 离开</p>
      <Address place={place} />
    </>
  );
}
export function PlaceCard({
  place,
  stop,
  number,
  selected,
  onMap,
  trip,
}: {
  place: Place;
  stop?: Stop;
  number?: number;
  selected?: boolean;
  onMap: () => void;
  trip: Trip;
}) {
  const stay = stop?.stayMinutes ?? place.suggestedStayMinutes;
  return (
    <article
      id={stop ? `stop-${stop.id}` : undefined}
      className={`travel-card place-card ${selected ? "selected" : ""}`}
    >
      <h3>
        {number && <span className="node-number">{number}</span>} {place.name}
        {place.branchName && ` · ${place.branchName}`}
      </h3>
      {stop?.role && (
        <small>
          {stop.role === "main"
            ? "主行程"
            : stop.role === "free-time"
              ? "自由活动 · 不固定线路"
              : "顺路可选 / 返程"}
        </small>
      )}
      {(stop?.startTime || stop?.endTime) && (
        <p>
          计划：{stop.startTime ?? "未定"}–{stop.endTime ?? "未定"}
        </p>
      )}
      <p>{place.summary}</p>
      {stop?.note && <p>{stop.note}</p>}
      {stay && (
        <p>
          建议停留 {stay.min}–{stay.max} 分钟
        </p>
      )}
      {place.kind === "hotel" ? (
        <HotelCard place={place} />
      ) : ["station", "airport"].includes(place.kind) ? (
        <TransportCard place={place} />
      ) : (
        <Address place={place} />
      )}
      {[
        ["开放", place.opening],
        ["门票", place.ticket],
        ["预约", place.booking],
      ].map(
        ([label, fact]) =>
          typeof fact === "object" &&
          fact && (
            <details key={String(label)}>
              <summary>
                {String(label)}：{fact.text}（
                {fact.status === "verified" ? "已核查" : "待核查"}）
              </summary>
              <p>核查：{fact.checkedAt ?? "暂无"}</p>
              {fact.sourceIds.map((id) => {
                const source = trip.sources.find((s) => s.id === id);
                return source ? (
                  <p key={id}>
                    {safeUrl(source.url) ? (
                      <a
                        href={safeUrl(source.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.title} ↗
                      </a>
                    ) : (
                      source.title
                    )}
                  </p>
                ) : null;
              })}
            </details>
          ),
      )}
      <div
        className={place.kind === "attraction" ? "place-media" : "place-links"}
      >
        {place.kind === "attraction" && <PhotoGallery photos={place.photos} />}
        <ExternalLinks links={place.links} />
      </div>
      <button onClick={onMap}>在地图看</button>
    </article>
  );
}
