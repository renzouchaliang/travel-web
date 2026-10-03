// Isolated SDK contract simulation; never included in the production entry.
import { createRoot } from "react-dom/client";
import { AMapAdapter } from "../src/maps/AMapAdapter";
import { TravelTemplateV1 } from "../src/templates/travel-template-v1/TravelTemplateV1";
import { changshaTrip } from "../src/trips/changsha-2026/adapter";
import "../src/styles.css";
const state = {
  markers: [] as Marker[],
  lines: [] as Polyline[],
  popup: "",
  mounts: 0,
  plannerCalls: 0,
  interactive: false,
  resizes: 0,
};
(window as unknown as { mapTest: typeof state }).mapTest = state;
class Marker {
  element = document.createElement("button");
  constructor(public options: { title?: string; position: number[] }) {
    this.element.textContent = options.title ?? "bounds marker";
  }
  on(_event: string, callback: () => void) {
    this.element.addEventListener("click", callback);
  }
  off(_event: string, callback: () => void) {
    this.element.removeEventListener("click", callback);
  }
  setzIndex() {}
}
class Polyline {
  constructor(public options: { path: number[][]; strokeStyle: string }) {}
}
class MapStub {
  constructor(public container: HTMLElement) {
    state.mounts++;
  }
  on(event: string, callback: () => void) {
    if (event === "complete") queueMicrotask(callback);
  }
  remove() {
    state.markers = [];
    state.lines = [];
    this.container.replaceChildren();
  }
  add(overlays: (Marker | Polyline)[]) {
    for (const item of overlays) {
      if (item instanceof Marker) {
        state.markers.push(item);
        this.container.append(item.element);
      } else state.lines.push(item);
    }
  }
  setZoomAndCenter() {}
  setFitView() {}
  setStatus(options: { dragEnable: boolean }) {
    state.interactive = options.dragEnable;
  }
  resize() {
    state.resizes++;
  }
  destroy() {
    this.container.replaceChildren();
  }
}
class InfoWindow {
  content?: HTMLElement;
  constructor(_options: unknown) {}
  setContent(content: HTMLElement) {
    this.content = content;
  }
  open(map: MapStub) {
    state.popup = this.content?.textContent ?? "";
    if (this.content) map.container.append(this.content);
  }
  close() {
    this.content?.remove();
    state.popup = "";
  }
}
window.AMap = {
  Map: MapStub,
  Marker,
  Polyline,
  InfoWindow,
  plugin: () => {
    state.plannerCalls++;
    throw new Error("Sequence mode must never use routing plugins");
  },
};
const createAdapter = () =>
  new AMapAdapter({
    publicKey: "sdk-test-placeholder",
    serviceHost: "https://example.com/security-proxy",
  });
createRoot(document.getElementById("root")!).render(
  <TravelTemplateV1 trip={changshaTrip} createAdapter={createAdapter} />,
);
