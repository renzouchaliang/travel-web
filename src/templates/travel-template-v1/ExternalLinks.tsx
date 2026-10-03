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
export function ExternalLinks({ links, maxVisible = 3, platformLabels = false }: { links: ExternalLink[]; maxVisible?: number; platformLabels?: boolean }) {
  const valid = links.filter((l) => safeUrl(l.url));
  const render = (l: ExternalLink) => (
    <a
      key={l.id}
      href={safeUrl(l.url)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {l.action === "location"
        ? <><span aria-hidden="true">📍</span> 地图打开</>
        : platformLabels && l.targetType === "detail"
          ? l.platform
          : l.targetType === "search"
        ? `在${l.platform}搜索`
        : l.targetType === "home"
          ? `${l.platform}首页`
          : l.action === "navigation" && l.navigationIntent === "planned"
            ? `${l.platform}地图导航`
            : l.action === "navigation" &&
                l.navigationIntent === "current-location"
              ? `${l.platform} · 从当前位置出发`
              : l.label.replace(/^(大众点评|携程|马蜂窝|美团)\s*[·・]\s*\1$/, "$1")}{" "}
      ↗
    </a>
  );
  return (
    <div className="external-links">
      {valid.slice(0, maxVisible).map(render)}
      {valid.length > maxVisible && (
        <details>
          <summary>更多参考</summary>
          {valid.slice(maxVisible).map(render)}
        </details>
      )}
    </div>
  );
}
