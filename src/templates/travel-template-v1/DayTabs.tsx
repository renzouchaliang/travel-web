import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import type { Day } from "../../types/travel";
import { dayAppearance } from "./dayAppearance";

export function DayTabs({
  days,
  active,
  onSelect,
}: {
  days: Day[];
  active: string;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vertical, setVertical] = useState(() =>
    window.matchMedia("(max-width: 767px)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setVertical(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (vertical) return;
    ref.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active, vertical]);
  const label = (d: Day, i: number) =>
    `第 ${i + 1} 天${d.date ? ` · ${d.date.slice(5).replace("-", "/")}` : ""} · ${d.title}`;
  if (days.length === 1)
    return <div className="date-strip">{label(days[0], 0)}</div>;
  return (
    <div className="day-tabs" ref={ref} role="tablist" aria-label="旅行日期" aria-orientation={vertical ? "vertical" : "horizontal"}>
      {days.map((d, i) => (
        <button
          key={d.id}
          style={{ "--day-tab-color": dayAppearance(d, i).accent, "--day-tab-bg": dayAppearance(d, i).soft, "--day-tab-foreground": dayAppearance(d, i).foreground } as CSSProperties}
          role="tab"
          id={`tab-${d.id}`}
          aria-selected={active === d.id}
          aria-controls="day-content"
          tabIndex={active === d.id ? 0 : -1}
          onClick={() => onSelect(d.id)}
          onKeyDown={(e) => {
            let n = i;
            if (e.key === (vertical ? "ArrowDown" : "ArrowRight")) n = (i + 1) % days.length;
            else if (e.key === (vertical ? "ArrowUp" : "ArrowLeft"))
              n = (i + days.length - 1) % days.length;
            else if (e.key === "Home") n = 0;
            else if (e.key === "End") n = days.length - 1;
            else return;
            e.preventDefault();
            onSelect(days[n].id);
            document.getElementById(`tab-${days[n].id}`)?.focus();
          }}
        >
          {label(d, i)}
        </button>
      ))}
    </div>
  );
}
