import { useCallback, useRef, useState } from "react";
import type { Photo } from "../../types/travel";
import { safeUrl } from "./ExternalLinks";
import { useModal } from "./accessibility";
export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [failed, setFailed] = useState<string[]>([]),
    [index, setIndex] = useState(0),
    [large, setLarge] = useState<Photo>();
  const modal = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setLarge(undefined), []);
  useModal(!!large, modal, close);
  const authorized = photos.filter(
    (p) =>
      p.rights !== "unknown" &&
      !failed.includes(p.id) &&
      (safeUrl(p.src) || p.src.startsWith("/")),
  );
  if (!authorized.length)
    return (
      <div className="photo-fallback">
        {failed.length
          ? "图片加载失败，文字与攻略仍可使用。"
          : "暂无授权图片。"}
        {photos
          .filter((p) => safeUrl(p.sourceUrl))
          .map((p) => (
            <a
              key={p.id}
              href={safeUrl(p.sourceUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              图片来源（不代表授权） ↗
            </a>
          ))}
      </div>
    );
  return (
    <div className="photo-gallery">
      <div
        className="photo-strip"
        onScroll={(e) =>
          setIndex(
            Math.round(
              e.currentTarget.scrollLeft / e.currentTarget.clientWidth,
            ),
          )
        }
      >
        {authorized.map((p) => (
          <button
            key={p.id}
            className="photo-button"
            onClick={() => setLarge(p)}
            aria-label={`查看大图：${p.alt}`}
          >
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              onError={() => setFailed((v) => [...v, p.id])}
            />
          </button>
        ))}
      </div>
      <span>
        {Math.min(index + 1, authorized.length)}/{authorized.length}
      </span>
      {authorized[index]?.caption && <p>{authorized[index].caption}</p>}
      {authorized[index]?.author && (
        <small>作者：{authorized[index].author}</small>
      )}
      {large && (
        <div
          className="photo-modal"
          ref={modal}
          role="dialog"
          aria-modal="true"
          aria-label="图片大图"
        >
          <button onClick={close}>关闭大图</button>
          <img
            src={large.src}
            alt={large.alt}
            onError={() => {
              setFailed((v) => [...v, large.id]);
              close();
            }}
          />
          <p>{large.caption}</p>
        </div>
      )}
    </div>
  );
}
