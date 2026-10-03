import { useEffect, useRef } from "react";
import type { Day } from "../../types/travel";
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
  useEffect(() => {
    ref.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);
  const label = (d: Day, i: number) =>
    `第 ${i + 1} 天${d.date ? ` · ${d.date.slice(5).replace("-", "/")}` : ""} · ${d.title}`;
  if (days.length === 1)
    return <div className="date-strip">{label(days[0], 0)}</div>;
  return (
    <div className="day-tabs" ref={ref} role="tablist" aria-label="旅行日期">
      {days.map((d, i) => (
        <button
          key={d.id}
          role="tab"
          id={`tab-${d.id}`}
          aria-selected={active === d.id}
          aria-controls="day-content"
          tabIndex={active === d.id ? 0 : -1}
          onClick={() => onSelect(d.id)}
          onKeyDown={(e) => {
            let n = i;
            if (e.key === "ArrowRight") n = (i + 1) % days.length;
            else if (e.key === "ArrowLeft")
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
