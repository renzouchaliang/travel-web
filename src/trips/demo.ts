import type { Day, Place, Trip } from "../types/travel";
const makePlace = (
  id: string,
  name: string,
  kind: Place["kind"],
  summary: string,
): Place => ({ id, name, kind, summary, photos: [], links: [] });
const places: Trip["places"] = {
  station: makePlace(
    "station",
    "长沙南站",
    "station",
    "演示抵达节点；请自行核对车次与出口。",
  ),
  hotel: {
    ...makePlace(
      "hotel",
      "滨江金融中心希尔顿欢朋酒店",
      "hotel",
      "演示行李寄存与返程节点；酒店名称和地址需旅行前核实。",
    ),
    address: "长沙湘江西岸滨江区域（演示区域描述，非核实地址）",
  },
  academy: makePlace(
    "academy",
    "岳麓书院",
    "attraction",
    "演示景点；开放、门票和预约信息尚未核查。",
  ),
  square: makePlace(
    "square",
    "东方红广场 / 湖大",
    "attraction",
    "演示步行停留节点。",
  ),
  foodStreet: makePlace(
    "foodStreet",
    "麓山南路自由逛吃",
    "other",
    "自由活动只标点，不规划固定餐厅路线。",
  ),
  optional: makePlace(
    "optional",
    "开发示例：可选公园",
    "other",
    "需要绕行 · 示例地点，无真实坐标。",
  ),
};
for (let i = 1; i <= 8; i++)
  places[`food${i}`] = {
    ...makePlace(
      `food${i}`,
      `开发示例餐饮 ${i}`,
      "restaurant",
      "开发占位，不是真实商家推荐。",
    ),
    branchName: "演示分店",
    areaId: i <= 4 ? "west" : "campus",
    foodTags: ["演示品类"],
  };
const day1: Day = {
  id: "day1",
  title: "抵达与湖大 · 演示",
  directionSummary:
    "先到湘江西岸放行李，再向南去书院；湖大周边步行。所有交通信息均为待核查演示说明。",
  stops: [
    { id: "s1", placeId: "station", role: "main" },
    { id: "s2", placeId: "hotel", role: "main" },
    { id: "s3", placeId: "academy", role: "main" },
    { id: "s4", placeId: "square", role: "main" },
    {
      id: "s5",
      placeId: "foodStreet",
      role: "free-time",
      note: "按个人节奏自由逛吃，不串联餐厅。",
    },
    {
      id: "s6",
      placeId: "hotel",
      role: "optional",
      note: "可选返程，非全天主路线。",
    },
  ],
  legs: [
    {
      id: "l1",
      fromStopId: "s1",
      toStopId: "s2",
      mode: "transit",
      summary: "长沙南站 → 酒店：先向湘江西岸；上下车站和出口待核查。",
      directionHint: "先放行李，再前往书院。",
      includeInOverview: true,
      sourceIds: [],
    },
    {
      id: "l2",
      fromStopId: "s2",
      toStopId: "s3",
      mode: "taxi",
      summary: "酒店 → 岳麓书院：向南，实际路线以查询结果为准。",
      includeInOverview: true,
      sourceIds: [],
    },
    {
      id: "l3",
      fromStopId: "s3",
      toStopId: "s4",
      mode: "walk",
      summary: "书院 → 东方红广场 / 湖大：周边步行；不提供未经核查的用时。",
      includeInOverview: true,
      sourceIds: [],
    },
    {
      id: "l4",
      fromStopId: "s4",
      toStopId: "s5",
      mode: "walk",
      summary: "湖大 → 麓山南路：自由逛吃，只标地点，不绘制固定路线。",
      includeInOverview: false,
      sourceIds: [],
    },
    {
      id: "l5",
      fromStopId: "s5",
      toStopId: "s6",
      mode: "taxi",
      summary: "麓山南路 → 酒店：独立返程入口，实际路线待查询。",
      includeInOverview: false,
      sourceIds: [],
    },
  ],
  restaurantGroups: [
    {
      id: "g1",
      title: "酒店附近 · 开发占位",
      anchorPlaceId: "hotel",
      initialVisible: 3,
      candidates: [1, 2, 3, 4].map((i) => ({ placeId: `food${i}` })),
    },
    {
      id: "g2",
      title: "湖大周边 · 开发占位",
      anchorPlaceId: "square",
      initialVisible: 3,
      candidates: [5, 6, 7, 8].map((i) => ({ placeId: `food${i}` })),
    },
  ],
  nearbyPlaceIds: ["optional"],
  returnPlaceId: "hotel",
  alerts: [
    "开发演示：不是已核实的可出行攻略。无真实坐标、评分、授权实景照片或路线用时。",
  ],
};
export const demoTrip: Trip = {
  id: "demo-changsha",
  title: "长沙第一天 · 模板演示（待核查）",
  timezone: "Asia/Shanghai",
  places,
  days: [day1],
  sources: [],
};
// Independent fixtures, never presented as actual second/third days of Changsha.
export const fixtureTrip: Trip = {
  ...demoTrip,
  id: "development-fixture",
  title: "两日开发 Fixture · 非真实旅行攻略",
  days: [
    { ...day1, id: "fixture-day1", title: "开发日 A", date: "2030-01-01" },
    {
      id: "fixture-day2",
      date: "2030-01-02",
      title: "开发日 B",
      directionSummary: "共享酒店与无坐标地点的联动校验。",
      stops: [
        { id: "f2s1", placeId: "hotel", role: "main" },
        { id: "f2s2", placeId: "optional", role: "main" },
        { id: "f2s3", placeId: "hotel", role: "optional" },
      ],
      legs: [
        {
          id: "f2l1",
          fromStopId: "f2s1",
          toStopId: "f2s2",
          mode: "walk",
          summary: "仅测试数据，不提供真实路线。",
          includeInOverview: true,
          sourceIds: [],
        },
      ],
      restaurantGroups: [
        {
          id: "f2g1",
          title: "开发区域 B",
          anchorPlaceId: "hotel",
          initialVisible: 3,
          candidates: [{ placeId: "food1" }],
        },
      ],
      nearbyPlaceIds: [],
      returnPlaceId: "hotel",
      alerts: ["独立开发 fixture，不是正式第二天攻略。"],
    },
  ],
};
