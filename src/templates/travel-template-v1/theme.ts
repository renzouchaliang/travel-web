import type { TemplateConfig } from "../../types/travel";
export const defaultConfig: TemplateConfig = {
  templateId: "travel-template-v1",
  desktopLayout: "split",
  mapSide: "left",
  mapProvider: "amap",
  theme: {
    "--travel-primary": "#103e42",
    "--travel-text": "#183d40",
    "--travel-muted": "#607374",
    "--travel-bg": "#f3f6f4",
    "--travel-card": "#ffffff",
    "--travel-border": "#dce5e2",
    "--travel-walk": "#c9632b",
    "--travel-transit": "#775497",
  },
};
export function themeVariables(theme: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(theme).filter(
      ([key, value]) =>
        key in defaultConfig.theme && /^#[0-9a-f]{3,8}$/i.test(value),
    ),
  );
}
