import type { Day } from "../../types/travel";

const palette = [
  ["#124448", "#e9f2ef"], ["#665080", "#f0eaf6"],
  ["#805326", "#fbf0df"], ["#345d8b", "#eaf1fa"],
];
export function dayAppearance(day: Day, index: number) {
  const [fallback, soft] = palette[index % palette.length];
  const supplied = day.visual?.themeColor;
  const accent = supplied && /^#[0-9a-f]{6}$/i.test(supplied) ? supplied : fallback;
  const rgb = [1, 3, 5].map((i) => parseInt(accent.slice(i, i + 2), 16) / 255)
    .map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  const luminance = rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  return { accent, soft: accent === fallback ? soft : `${accent}16`, foreground: luminance > .179 ? "#000" : "#fff" };
}
