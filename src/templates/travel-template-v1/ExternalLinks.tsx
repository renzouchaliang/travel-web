import type { ExternalLink } from "../../types/travel";
export function safeUrl(url?: string): string | undefined {
  if (!url) return;
  try {
    const u = new URL(url);
    return ["https:", "http:"].includes(u.protocol) ? u.href : undefined;
  } catch {
    return;
  }
}
export function ExternalLinks({ links }: { links: ExternalLink[] }) {
  const valid = links.filter((l) => safeUrl(l.url));
  const render = (l: ExternalLink) => (
    <a
      key={l.id}
      href={safeUrl(l.url)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {l.targetType === "search"
        ? `在${l.platform}搜索`
        : l.targetType === "home"
          ? `${l.platform}首页`
          : l.action === "navigation" && l.navigationIntent === "planned"
            ? `${l.platform} · 看计划路线`
            : l.action === "navigation" &&
                l.navigationIntent === "current-location"
              ? `${l.platform} · 从当前位置出发`
              : l.label}{" "}
      ↗
    </a>
  );
  return (
    <div className="external-links">
      {valid.slice(0, 3).map(render)}
      {valid.length > 3 && (
        <details>
          <summary>更多参考</summary>
          {valid.slice(3).map(render)}
        </details>
      )}
    </div>
  );
}
