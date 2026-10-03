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
      (p.rights !== "unknown" || p.displayAsReference) &&
      !failed.includes(p.id) &&
      (safeUrl(p.src) || p.src.startsWith("/")),
  );
  if (!authorized.length) return failed.length ? <div className="photo-fallback">景点照片暂未加载</div> : null;
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
              referrerPolicy="no-referrer"
              onError={() => setFailed((v) => [...v, p.id])}
            />
          </button>
        ))}
      </div>
      <span>
        {Math.min(index + 1, authorized.length)}/{authorized.length}
      </span>
      {authorized[index]?.caption && <p>{authorized[index].caption}</p>}
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
