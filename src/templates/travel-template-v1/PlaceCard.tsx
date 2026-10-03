import { useState } from "react";
import type { IntercityTransport, Place, Stop, Trip } from "../../types/travel";
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
export function TransportCard({ place, transport }: { place: Place; transport?: IntercityTransport }) {
  if (!transport) return <Address place={place} />;
  const facts = [
    transport.serviceNumber && `班次 ${transport.serviceNumber}`,
    transport.carriage && `车厢 ${transport.carriage}`,
    transport.seat && `座位 ${transport.seat}`,
    transport.terminal && `航站楼 ${transport.terminal}`,
    transport.gate && `检票口 ${transport.gate}`,
    transport.boardingDeadline && `停止检票 ${transport.boardingDeadline}`,
  ].filter(Boolean);
  return <div className="transport-booking">
    <p className="transport-direction">{transport.direction === "arrival" ? "抵达" : "离开"} · {transport.mode === "flight" ? "航班" : transport.mode === "rail" ? "高铁／火车" : "长途汽车"}</p>
    <strong>{[transport.origin, transport.destination].filter(Boolean).join(" → ")}</strong>
    {(transport.departureTime || transport.arrivalTime) && <p>{[transport.departureTime && `${transport.departureTime} 出发`, transport.arrivalTime && `${transport.arrivalTime} 抵达`].filter(Boolean).join(" · ")}</p>}
    {!!facts.length && <div className="booking-facts">{facts.map((fact) => <span key={String(fact)}>{fact}</span>)}</div>}
    <Address place={place} />
  </div>;
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
      className={`travel-card place-card card-${stop?.transport ? stop.transport.direction : place.kind} ${selected ? "selected" : ""}`}
    >
      {stop && <div className="stop-time"><strong>{stop.startTime ? `${stop.startTime}${stop.endTime ? `—${stop.endTime}` : ""}` : stop.timeLabel ?? (stop.role === "free-time" ? "时间自由" : "")}</strong>{stay && <span>建议游览 {stay.min}–{stay.max} 分钟</span>}</div>}
      <h3 className="place-title">{number && <span className="node-number">{number}</span>}{place.name}{place.branchName && ` · ${place.branchName}`}</h3>
      {stop?.visitPurpose && <span className="purpose-tag">{{ sightseeing: "游览", photo: "拍照打卡", museum: "场馆参观", park: "公园散步", "free-time": "自由活动" }[stop.visitPurpose]}</span>}
      {place.kind === "attraction" && <div className="place-media"><PhotoGallery photos={place.photos} /><aside><strong>看看怎么逛</strong><ExternalLinks links={place.links.filter((l) => l.platform !== "高德")} /><small>景点介绍、照片与游客点评</small></aside></div>}
      <p>{stop?.description ?? place.summary}</p>
      {stop?.note && <p>{stop.note}</p>}
      {place.openingMilestones && <div className="opening-milestones">{place.openingMilestones.map((item) => <div key={item.label}><strong>{item.time}</strong><span>{item.label}</span></div>)}</div>}
      {place.kind === "hotel" ? (
        <HotelCard place={place} />
      ) : ["station", "airport"].includes(place.kind) ? (
        <TransportCard place={place} transport={stop?.transport} />
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
      <div className="card-actions">
      <ExternalLinks links={place.kind === "attraction" ? place.links.filter((l) => l.action === "location") : place.links} />
        <button className="compact-map-button" onClick={onMap}>在地图看</button>
      </div>

    </article>
  );
}
