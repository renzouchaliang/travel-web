export type ID = string;
export type PlaceKind =
  "attraction" | "hotel" | "restaurant" | "station" | "airport" | "other";
export type TravelMode = "walk" | "transit" | "drive" | "taxi" | "cycle";

export interface Coordinate {
  lng: number;
  lat: number;
  crs: "GCJ02" | "WGS84" | "BD09";
}
export interface Source {
  id: ID;
  title: string;
  url: string;
  checkedAt?: string; // ISO 日期，未核查则不填
}
export interface ExternalLink {
  id: ID;
  platform: string; // 携程、马蜂窝、大众点评、官方等
  action:
    "guide" | "reviews" | "official" | "booking" | "navigation" | "location" | "search";
  label: string;
  url: string;
  targetType: "detail" | "search" | "home";
  navigationIntent?: "planned" | "current-location"; // Authored, verified navigation URLs only.
}
export interface Photo {
  id: ID;
  src: string;
  alt: string;
  caption?: string;
  sourceUrl?: string;
  author?: string;
  rights: "owned" | "licensed" | "permission" | "unknown";
  licenseUrl?: string;
  displayAsReference?: boolean; // Explicitly supplied for this design preview; no rights claim.
}
export interface PracticalFact {
  text: string;
  sourceIds: ID[];
  checkedAt?: string;
  status: "verified" | "unverified";
}
export interface Place {
  id: ID;
  name: string;
  branchName?: string;
  mapLabel?: string;
  mapRole?: "nearby";
  kind: PlaceKind;
  coordinate?: Coordinate; // 不知道时留空，不生成假坐标
  providerIds?: Record<string, string>;
  address?: string;
  areaId?: ID;
  summary?: string;
  suggestedStayMinutes?: { min: number; max: number };
  opening?: PracticalFact;
  openingMilestones?: { time: string; label: string }[];
  ticket?: PracticalFact;
  booking?: PracticalFact;
  photos: Photo[];
  links: ExternalLink[];
  foodTags?: string[];
  rating?: {
    value: number;
    scale: number;
    platform: string;
    reviewCount?: number;
    checkedAt: string;
    sourceUrl: string;
  };
}
export interface IntercityTransport {
  direction: "arrival" | "departure";
  mode: "rail" | "flight" | "coach";
  origin?: string;
  destination?: string;
  departureTime?: string;
  arrivalTime?: string;
  serviceNumber?: string;
  carriage?: string;
  seat?: string;
  terminal?: string;
  gate?: string;
  boardingDeadline?: string;
}
export interface Stop {
  id: ID;
  placeId: ID;
  startTime?: string; // 当地计划时间 HH:mm；不是实时到达时间
  endTime?: string;
  stayMinutes?: { min: number; max: number };
  role: "main" | "optional" | "free-time";
  note?: string;
  description?: string;
  timeLabel?: string;
  mapOverview?: boolean;
  transport?: IntercityTransport;
  visitPurpose?: "sightseeing" | "photo" | "museum" | "park" | "free-time";
}
export interface RouteLeg {
  id: ID;
  fromStopId: ID;
  toStopId: ID;
  mode: TravelMode;
  navigationUrl?: string; // Authored provider URL, including specialized taxi/rail entry points.
  viaPlaceIds?: ID[]; // 有序途经点，自驾等场景
  routePolicy?: string;
  summary: string; // 即使地图失败也可阅读
  directionHint?: string;
  boarding?: string;
  alighting?: string;
  exitHint?: string;
  plannedMinutes?: {
    min: number;
    max: number;
    source: "estimate" | "verified";
  };
  includeInOverview: boolean; // 返程等可默认不加入全天展示
  mapDisplay?: "route" | "text-only";
  preferredLine?: string;
  routingFromPlaceId?: ID;
  routingToPlaceId?: ID;
  lineColor?: string;
  sourceIds: ID[];
}
export interface Distance {
  meters: number;
  kind: "straight" | "walking" | "driving";
  originPlaceId: ID;
  source: string;
  checkedAt?: string;
}
export interface RestaurantGroup {
  id: ID;
  title: string;
  anchorPlaceId: ID;
  description?: string;
  candidates: { placeId: ID; distance?: Distance }[];
  initialVisible: number; // 默认 3
  selectionCriteria?: { radiusMeters: number; minCandidates: number; platform: string; minRating?: number; ratingScale?: number; popularityAlternative?: boolean };
}
export interface Day {
  visual?: { themeColor?: string; headerImage?: { src: string; alt: string } };
  id: ID;
  date?: string;
  title: string;
  directionSummary: string;
  stops: Stop[];
  legs: RouteLeg[];
  restaurantGroups: RestaurantGroup[];
  nearbyPlaceIds: ID[];
  returnPlaceId?: ID;
  alerts: string[];
}
export interface Trip {
  id: ID;
  title: string;
  timezone: string;
  places: Record<ID, Place>;
  days: Day[];
  sources: Source[];
}
export interface TemplateConfig {
  templateId: "travel-template-v1";
  desktopLayout: "split" | "stacked";
  mapSide: "left" | "right";
  initialDayId?: ID;
  mapProvider: string;
  theme: Record<string, string>; // 允许列表内的 CSS 变量
}

export interface RouteSegment {
  mode: TravelMode;
  crs: Coordinate["crs"];
  path: Coordinate[];
}
export interface RouteResult {
  legId: ID;
  status: "idle" | "loading" | "ready" | "partial" | "error";
  segments: RouteSegment[];
  distanceMeters?: number;
  durationSeconds?: number;
  provider: string;
  fetchedAt?: string;
  routeLabel?: string;
  planMismatch?: boolean;
  errorKind?: string;
}
