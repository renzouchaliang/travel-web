import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";
import { TravelTemplateV1 } from "./templates/travel-template-v1/TravelTemplateV1";
import { demoTrip, fixtureTrip } from "./trips/demo";
import { defaultConfig } from "./templates/travel-template-v1/theme";

const params = new URLSearchParams(window.location.search);
const template = params.get("template") === "travel-template-v1";
const trip = params.get("fixture") === "multi-day" ? fixtureTrip : demoTrip;
const config = {
  ...defaultConfig,
  desktopLayout:
    params.get("layout") === "stacked"
      ? ("stacked" as const)
      : ("split" as const),
  mapSide:
    params.get("mapSide") === "right" ? ("right" as const) : ("left" as const),
};
if (template) document.documentElement.lang = "zh-CN";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {template ? <TravelTemplateV1 trip={trip} config={config} /> : <App />}
  </StrictMode>,
);
