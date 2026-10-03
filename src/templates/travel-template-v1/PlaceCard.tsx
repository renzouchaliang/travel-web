import { useState } from "react";
import type { Place, Stop, Trip } from "../../types/travel";
import { ExternalLinks } from "./ExternalLinks";
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
      {stop && <div className="stop-time"><strong>{stop.startTime ? `${stop.startTime}${stop.endTime ? `—${stop.endTime}` : ""}` : stop.timeLabel ?? (stop.role === "free-time" ? "时间自由" : "")}</strong>{stay && <span>建议游览 {stay.min}–{stay.max} 分钟</span>}</div>}
      <h3>{number && <span className="node-number">{number}</span>} {place.name}{place.branchName && ` · ${place.branchName}`}</h3>
      {place.kind === "attraction" && <div className="place-media"><PhotoGallery photos={place.photos} /><aside><strong>看看怎么逛</strong><ExternalLinks links={place.links.filter((l) => l.platform !== "高德")} /><small>景点介绍、照片与游客点评</small></aside></div>}
      <p>{stop?.description ?? place.summary}</p>
      {stop?.note && <p>{stop.note}</p>}
      {place.openingMilestones && <div className="opening-milestones">{place.openingMilestones.map((item) => <div key={item.label}><strong>{item.time}</strong><span>{item.label}</span></div>)}</div>}
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
                {String(label)}：{fact.text}
              </summary>

            </details>
          ),
      )}
      <ExternalLinks links={place.kind === "attraction" ? place.links.filter((l) => l.action === "navigation") : place.links} />
      <button onClick={onMap}>在地图看</button>
    </article>
  );
}
