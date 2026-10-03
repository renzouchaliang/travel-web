import { useState } from "react";
import type { Photo } from "../../types/travel";
import { safeUrl } from "./ExternalLinks";

export function NearbyPhoto({ photos }: { photos: Photo[] }) {
  const [failed, setFailed] = useState<string[]>([]);
  const photo = photos.find((p) => !failed.includes(p.id) &&
    (p.rights !== "unknown" || p.displayAsReference) &&
    (safeUrl(p.src) || /^\/(?!\/)/.test(p.src)));
  if (!photo) return null;
  return <img className="nearby-photo" src={photo.src} alt={photo.alt} loading="lazy"
    width={112} height={84} referrerPolicy="no-referrer"
    onError={() => setFailed((previous) => [...previous, photo.id])} />;
}
