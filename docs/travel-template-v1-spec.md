# travel-template-v1：旅行攻略模板规范与 Cloud Codex 实现指令

版本：设计规范 v1 · 2026-10-03
用途：在既有 renzouchaliang/travel-web 项目中实现可选模板。本文是设计和实现任务书，尚未修改仓库、接入凭据或发布网站。

## 当前审阅版（2026-10-04 用户指令）

以 [V5 多天审阅记录](v5-preview-review.md) 为准：真实高德步行／公交查询、车站机场接驳不画线也不影响默认取景、已发布旅行默认单列 V5 图文时间轴。多天日期导航保留，空白日期留空。正文不展示资料来源、核查元数据及反复的未确定信息。以下为旧规范参考；最终资料标准待样式确认后再定。

## 0. 继承已经讨论和确认的偏好

本规范以本 Project 的讨论及《长沙第一天_景点图文版_V5.html》（当前版本 6）为基础。环境已完成：React、TypeScript、Vite、原生 CSS、Node.js 24、npm、Cloudflare 自动部署；这些按用户提供的信息接受，本次不重新核查或设计基础设施。

| 已确认的偏好 | 模板中的落实方式 |
| --- | --- |
| 面向不熟悉地图的旅行者 | 地图外同时写清起终点、方向、交通、下一步；地图不是唯一信息入口 |
| 路线是攻略核心 | 地图、路段、日程共用一份数据和选择状态 |
| 已认可第一天整体样式 | 沿用深青绿、浅灰绿底、白色卡片、紧凑路线标题、时间轴 |
| 手机优先、一个日期对应一套内容 | v1 默认单页 Day Tabs；一日游自动简化，不出现空日期 |
| 全天路线与分段查看 | 保留“查看全天”“查看这一段”“周边地点” |
| 自由逛吃只标点 | 不把所有餐厅串成必去路线，不生成虚假的固定逛吃线路 |
| 餐饮机械筛选 | 按区域、距离、平台评分筛选；每区先显示 3 家，再独立展开 |
| 餐饮数量可以稍多 | 一天约 10–20 个候选是内容建议，不是模板硬限制；不强凑数量 |
| 景点配图、旁边有攻略入口 | 景点卡片使用小幅实景图及平台按钮；机场、车站、酒店默认不配景色图 |
| 高德已在本地 Chrome 验证可用 | 本次中国大陆示例默认高德；供应商封装独立，其他模板可替换 |
| 手机文件和内置浏览器曾加载失败 | 不宣称已修复；新版访客页不要求填写 Key，发布后另做真实设备验证 |
| 最终要交互网页和简版 PDF | 共用内容数据，v1 先提供打印样式，正式 PDF 导出留作后续任务 |

区分三层：通用开发环境 → 可选的 travel-template-v1 → 每次旅行的数据与配色。模板规则放在模板目录及说明中，不把整套版式写成仓库全局限制。

## 1. 页面结构

默认页面自上而下：

1. **TripHeader：紧凑旅行标题**。城市、日期、天数、简短说明。当天主路线换行展示，不做全屏封面、倒计时和大面积照片。
2. **DayTabs：日期切换**。显示“第 1 天 · 10/2 · 抵达与湖大”。单日时显示日期条。手机（<768px）多日标签默认纵向排列，每天独占一行、占满可用宽度，长标题自然换行，无需左右滑动即可看到所有日期。平板与桌面保持横向排列，必要时横向滚动，当前项自动进入视野。此规则适用于所有使用 TravelTemplateV1 的旅行。
3. **DaySummary：当天快速概览**。主要节点顺序、一句方位说明、重要预约提醒；用时只能是有来源的估算。
4. **TripMap + RoutePanel：当天地图**。全天/分段、缩放/拖动、放大/收起、餐饮和周边开关、选中地点摘要。
5. **ItineraryTimeline：主行程**。时间、停留地点卡片、连接两站的交通卡片交替出现；自由活动可标时间段。
6. **RestaurantList：餐饮候选**。按酒店附近、景区附近、晚间区域等分组；独立展开更多。
7. **NearbyPlaces：可选周边**。明确“顺路可选”或“需要绕行”，不与当天必经节点混为一谈。
8. **来源与更新信息**。实用信息来源、核对时间、图片来源，默认折叠。
9. **MobileQuickNav：手机固定底栏**。“地图 / 行程 / 吃饭 / 回酒店”；当日没有酒店时改为“去终点”或隐藏第四项。

长沙第一天示例继续使用：长沙南站 → 滨江金融中心希尔顿欢朋酒店 → 岳麓书院 → 东方红广场/湖大 → 麓山南路自由逛吃；回酒店单独提供。正文必须有“先到湘江西岸放行李，再向南去书院；湖大周边步行”这样的方向说明。

不凭空编造第 2、3 天实际攻略。联动测试用单独标注的开发 fixture，不能混入正式旅行数据。

## 2. PC、平板和手机布局

| 场景 | 默认布局 | 地图与滚动行为 |
| --- | --- | --- |
| 手机 < 768px | 地图在上、时间轴在下，单列 | 地图默认高度 clamp(220px, 34svh, 320px)，可折叠成当天路线摘要；整页自然滚动 |
| 平板 768–1023px | 单列宽版，餐饮行可适度扩展 | 地图约 320–400px；仍避免地图加长名单的双重滚动 |
| PC ≥ 1024px | 左地图约 56%，右行程约 44%，间距 24px | 左侧 sticky，右侧随整页滚动；地图高度受可用视口限制，不做三栏密集后台 |
| 放大地图 | 一个可关闭的全屏地图面板 | 保留日期和路段控制、地点摘要；关闭恢复原页面位置 |

PC 内容最大宽度约 1320px。手机左右留白 16px，窄屏可 12px。手机 DayTabs 纵向排列并随页面自然滚动，不将整列日期吸顶；平板与桌面保持横向单行。手机标签最小高度 48px、文字左对齐，支持上下方向键切换；平板与桌面支持左右方向键，所有布局均支持 Home/End。

手机正常模式提供明确“操作地图”按钮；未激活时手指可以自然滑过地图滚动页面，激活后才拖动地图，并出现“完成”按钮。桌面默认可拖动，滚轮缩放按地图适配器能力控制，避免滚页面时误缩放。实现时验证真实触摸行为，不能只用透明遮罩假装完成。

只保留一个活动地图实例。放大时扩展同一容器并通知地图 resize，关闭时恢复；避免桌面、手机、弹层重复创建地图。全屏面板支持 Escape、关闭按钮、焦点恢复与背景滚动锁定。

布局可配置 desktopLayout: split | stacked，mapSide: left | right；v1 落实这些轻量变体。未来多页通过外层页面组合复用组件，v1 不为“未来可能需要”引入路由库或复杂布局编辑器。

## 3. 组件清单与职责

| 组件/模块 | 责任 |
| --- | --- |
| TravelTemplateV1 | 组装布局、主题与当次旅行数据，不内嵌城市内容 |
| TripHeader / DaySummary | 旅行标题、当天顺序、方位、提醒 |
| DayTabs | 日期切换及键盘访问；单日降级为日期条 |
| TripMap | 地图容器、POI、路线、视口；经适配器调用地图服务 |
| MapControls / MapStatus | 图层、全天、全屏、交互启用、加载和错误提示 |
| PlacePreview | 点击地图点后的短摘要及导航、查看行程入口 |
| RoutePanel | 全天/单段切换、路段用时、距离、交通摘要、重试 |
| ItineraryTimeline | Stop 与 RouteLeg 的有序渲染，主行程与自由活动区分 |
| PlaceCard | 景点名称、简介、停留、开放/门票、图片和链接 |
| HotelCard / TransportCard | 酒店地址、入住/返程；机场车站的抵达/离开，不默认加景色图 |
| TransitLegCard | 从哪里到哪里、方式、方向、站点、出口、预计耗时、看路线 |
| PhotoGallery | 一张或多张图、横向滑动、图片计数、大图查看、错误回退 |
| ExternalLinks | 平台名与动作明确的外链按钮 |
| RestaurantList / RestaurantRow | 按区分组、独立展开、机械筛选/排序、简短店铺行 |
| NearbyPlaces / MobileQuickNav | 可选周边及手机快捷入口 |
| useTripSelection | 当天、选中停留、地点、路段和图层的共享状态 |
| MapAdapter / AMapAdapter | 隔离供应商对象、路线结果归一化、资源清理 |

无需 UI 组件库或全局状态库。先用 React 自带状态能力完成；跨组件状态集中管理，禁止地图、Tabs、时间轴各自维护一套互不一致的选中日期。

## 4. 数据结构

核心关系：Trip 包含多个 Day；Day 引用有序 Stop 和 RouteLeg；Stop 引用 Place。相同酒店可以被多天及一天多个 Stop 引用，因此 placeId、stopId、legId 必须分开。

以下是实现契约，可由 Codex 按仓库规范拆成 TypeScript 文件：

```ts
type ID = string;
type PlaceKind = 'attraction' | 'hotel' | 'restaurant' | 'station' | 'airport' | 'other';
type TravelMode = 'walk' | 'transit' | 'drive' | 'taxi' | 'cycle';

interface Coordinate {
  lng: number;
  lat: number;
  crs: 'GCJ02' | 'WGS84' | 'BD09';
}
interface Source {
  id: ID;
  title: string;
  url: string;
  checkedAt?: string; // ISO 日期，未核查则不填
}
interface ExternalLink {
  id: ID;
  platform: string; // 携程、马蜂窝、大众点评、官方等
  action: 'guide' | 'reviews' | 'official' | 'booking' | 'navigation' | 'search';
  label: string;
  url: string;
  targetType: 'detail' | 'search' | 'home';
}
interface Photo {
  id: ID;
  src: string;
  alt: string;
  caption?: string;
  sourceUrl?: string;
  author?: string;
  rights: 'owned' | 'licensed' | 'permission' | 'unknown';
  licenseUrl?: string;
}
interface PracticalFact {
  text: string;
  sourceIds: ID[];
  checkedAt?: string;
  status: 'verified' | 'unverified';
}
interface Place {
  id: ID;
  name: string;
  branchName?: string;
  kind: PlaceKind;
  coordinate?: Coordinate; // 不知道时留空，不生成假坐标
  providerIds?: Record<string, string>;
  address?: string;
  areaId?: ID;
  summary?: string;
  suggestedStayMinutes?: { min: number; max: number };
  opening?: PracticalFact;
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
interface Stop {
  id: ID;
  placeId: ID;
  startTime?: string; // 当地计划时间 HH:mm；不是实时到达时间
  endTime?: string;
  stayMinutes?: { min: number; max: number };
  role: 'main' | 'optional' | 'free-time';
  note?: string;
}
interface RouteLeg {
  id: ID;
  fromStopId: ID;
  toStopId: ID;
  mode: TravelMode;
  viaPlaceIds?: ID[]; // 有序途经点，自驾等场景
  routePolicy?: string;
  summary: string; // 即使地图失败也可阅读
  directionHint?: string;
  boarding?: string;
  alighting?: string;
  exitHint?: string;
  plannedMinutes?: { min: number; max: number; source: 'estimate' | 'verified' };
  includeInOverview: boolean; // 返程等可默认不加入全天展示
  sourceIds: ID[];
}
interface Distance {
  meters: number;
  kind: 'straight' | 'walking' | 'driving';
  originPlaceId: ID;
  source: string;
  checkedAt?: string;
}
interface RestaurantGroup {
  id: ID;
  title: string;
  anchorPlaceId: ID;
  description?: string;
  candidates: { placeId: ID; distance?: Distance }[];
  initialVisible: number; // 默认 3
}
interface Day {
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
interface Trip {
  id: ID;
  title: string;
  timezone: string;
  places: Record<ID, Place>;
  days: Day[];
  sources: Source[];
}
interface TemplateConfig {
  templateId: 'travel-template-v1';
  desktopLayout: 'split' | 'stacked';
  mapSide: 'left' | 'right';
  initialDayId?: ID;
  mapProvider: string;
  theme: Record<string, string>; // 允许列表内的 CSS 变量
}
```

运行时路线结果与编辑的旅行数据分开：RouteResult 包含 legId、status（idle/loading/ready/partial/error）、segments、distanceMeters、durationSeconds、provider、fetchedAt 和 errorKind。每个 segment 带交通类型、坐标系和独立 path；路线缺段时显示 partial，不能自动补直线。

评分不能跨平台直接排总榜。默认按区域和已知距离排列，允许同一平台评分排序；缺失项置后并标“暂无”，不要用 0 代替。直线距离必须写“直线约…”，不能冒充步行距离。v1 可以消费人工整理的来源数据，不自动抓取各平台。

时间安排是编辑好的计划。路线查询的动态耗时单独显示，不悄悄修改预约时刻或重新排整天日程；自动行程优化不纳入 v1。

## 5. 地图与日程联动

### 共享状态

activeDayId、selectedStopId、selectedPlaceId、selectedLegId、visibleLayers、mapExpanded、mapInteractionEnabled、viewportIntent。其中视口意图区分全天、路段、地点、用户自由拖动；异步请求不得覆盖用户后续选择。

### 交互规则

| 操作 | 地图反馈 | 日程反馈 |
| --- | --- | --- |
| 首次打开/切换日期 | 只显示当天主节点和当天路线，fit 到当天范围 | 展示对应当天内容；清空上一天点位、路段选中 |
| 点击地图点 | 高亮 POI，显示短摘要 | 高亮对应 Stop；同地点多次出现时提供对应停留选择 |
| 点击“查看行程” | 保持地点选中 | 滚到指定 Stop，不在点击普通标记时突然把地图滚出屏幕 |
| 点击卡片“在地图看” | 聚焦该地点；必要时打开对应图层 | 保留选中卡片；手机滚到地图 |
| 点击“查看这一段” | 只突出该段真实路线及起终点 | 突出对应交通卡片 |
| 点击“查看全天” | 恢复当天 includeInOverview 的路线和主节点 | 清除单段选中 |
| 餐饮/周边开关 | 控制候选点显示，不改变主路线和 fit 范围 | 不强行展开所有餐饮列表 |
| 点击候选店的地图入口 | 若关闭则开启餐饮图层，并聚焦门店 | 保留候选身份，不加入必去日程 |
| 用户手动拖地图 | 保持用户视口 | 后返回的查询结果只更新路线，不强制拉回 |
| 打开高德导航 | 外部导航使用明确起终点或当前位置 | “看计划路线”与“从当前位置出发”文案区分 |

日期切换保留用户的图层开关偏好，清空不属于新日期的选中项。餐饮展开状态可按 dayId + groupId 独立保存。当天只有单个 POI 时使用合理缩放，无 POI 时显示文本说明。

### 路线真实性与异常处理

- 页面地图负责解释当天安排；实时转向导航交给地图平台。
- 规划器返回的路线才画成道路路线。无几何数据时显示地点和交通文字，不画假道路，不把连点虚线标为真实路径。
- 对公交/地铁/步行分段绘制。已知断点不跨段补线，自由逛吃只标点。
- 缓存键包含供应商、起终点及坐标系、交通方式、途经点和路线策略；按供应商条款设缓存范围和过期时间。
- 仅查询当前日期，选择路段时按需查询；切换回来复用有效结果，避免每次 render 发请求。
- 用请求序号或取消机制避免旧日期结果覆盖新日期；地图卸载清理监听、实例和未完成回调。
- 分别处理无配置、SDK失败、底图超时、路线失败。地图可用但路线失败时保留地图，只对路线提供重试。
- 无配置时仍能看完整图文行程、复制地址、打开有效外部链接。访客不出现 Key 输入框或安全密钥字段。
- 生产地图配置由制作者统一提供；浏览器可见 Key 与服务端安全配置分开。不得把安全密钥塞入 Vite 前端环境变量或提交源码。此任务不改部署链路；仓库若没有安全代理，明确列为接入前置条件，不擅自新建后台。
- 不把 GCJ02、WGS84、BD09 混用；AMapAdapter 检查输入坐标系，需要转换时使用经确认的转换方法。

## 6. 图片与外部链接

景点默认一张辅助图，约 16:10；常规手机宽度可用“图 + 右侧 100–112px 链接列”，窄屏改为图下按钮。多图水平滑动，显示 1/3，点击可看大图，无自动轮播、无整页相册封面。

机场、车站、酒店默认仅展示实用信息。餐饮使用紧凑行，不给每家店加大图。图片加载失败保留地点、文字与攻略入口，不显示大片空白。

优先自有或授权图片；来源署名不等于获得复用授权。V5 外链照片不能因已有出处就默认继承为可公开商用素材。rights 为 unknown 的图片默认不嵌入公开模板，保留图源入口或清晰标注的设计占位；不自动抓图或用生成图片冒充真实景点。

| 场景 | 按钮文案示例 |
| --- | --- |
| 景点攻略 | 携程攻略 ↗ / 马蜂窝攻略 ↗ |
| 官方实用信息 | 官方信息 ↗ / 官方预约 ↗ |
| 餐饮商家 | 大众点评 ↗ / 地图位置 ↗ |
| 社交参考 | 小红书参考 ↗ / 抖音参考 ↗ |
| 只有搜索页 | 在大众点评搜索 ↗，不能伪装成门店详情 |

景点默认露出 2–3 个主要入口，其余收在“更多参考”。优先准确景点/分店详情链接。无有效链接时不造 URL，不放空按钮。外链使用 http/https 允许列表、新标签页及安全 rel；按钮本身标平台和跳转符号，不让整张卡片成为链接。

## 7. 视觉规范

沿用第一天 V5，不重新做旅游宣传海报。

| 项目 | 默认值 |
| --- | --- |
| 主色/主按钮 | #103e42 深青绿 |
| 正文 | #183d40 |
| 次级文字 | #607374，实际背景上检查对比度 |
| 页面底色 | #f3f6f4 |
| 卡片/分隔线 | #ffffff / #dce5e2 |
| 步行/餐饮强调 | #c9632b |
| 公交/地铁 | #775497 |
| 卡片圆角 | 14–18px；按钮 8–10px |
| 字体 | 系统中文无衬线；无需在线字体 |
| 正文/辅助信息 | 16px / 14px；来源可 12–13px |
| 卡片标题/页面标题 | 18–20px / 22–28px |
| 内边距/模块间距 | 卡片 16–20px；模块 20–24px |
| 点击目标 | 至少 44×44px，常用手机主按钮约 48px 高 |

主节点带序号；餐饮、酒店、交通和可选周边用文字/图标辅助区分，不能只靠颜色。选中卡片加边框，不靠闪烁。行程默认展开关键摘要，门票细则和来源可折叠。

支持键盘焦点、日期选择状态、地图等效文本信息、减少动画设置、手机安全区。底栏不得遮住最后一条内容。使用轻微颜色反馈即可，不做视差、入场动画、自动轮播。

## 8. 可直接交给 Cloud Codex 的实现 prompt

复制以下整个代码块。若可附文件，同时附本规范及之前的 V5 HTML；没有附件也可按此 prompt 实现，不得假称已经读取旧文件。

```text
请在现有 renzouchaliang/travel-web 仓库中实现一个可选的 travel-template-v1。请实际完成代码、构建和必要验证，不只输出方案。

【范围与既有环境】
项目已具备 React、TypeScript、Vite、原生 CSS、Node.js 24、npm，以及 GitHub → Cloudflare 自动部署。先读取 AGENTS.md、README、package.json 和现有 src 结构，遵守仓库规则并检查工作区已有改动。不要重新初始化项目，不更换框架、Node、包管理器，不重建 Cloudflare/CI，不引入 UI 库、路由库或全局状态库来完成简单需求。不要覆盖无关用户改动。
本次是模板实现；按现有仓库约定交付代码，不擅自推送触发生产部署。不要修改凭据、部署链路或账户配置。
模板必须是可选的：组件、主题和旅行数据分离，模板规则只约束模板目录。保留现有 demo 可访问，沿用现有页面选择方式；若无选择方式可用简单配置或查询参数选择，不为此引入路由库。

【设计来源及固定偏好】
用户已经反复确认长沙第一天的深青绿/浅灰绿底/白色圆角卡片/时间轴样式。地图核心，面向不太会看地图的人，文字必须写清起终点、方向及下一步。紧凑标题直接写路线，不做大幅封面或倒计时。图片只给景点辅助展示，机场、车站、酒店不默认配景色图。餐饮按位置、距离及同平台评分机械筛选，不写 AI 主观美食榜，不强迫串成路线。
如仓库或附件有《长沙第一天_景点图文版_V5.html》，读取并迁移其中已有结构与可核实数据；不要整段粘贴旧脚本进 React。没有旧文件时明确说明，但仍可实现模板与清楚标注的示例，不杜撰真实评分、营业时间、路线时长或图片授权。

【页面与响应式】
顺序：TripHeader → DayTabs → DaySummary → TripMap/RoutePanel + ItineraryTimeline → 分区餐饮 → 可选周边 → 折叠来源。
手机 <768px 单列，地图在上，高度 clamp(220px,34svh,320px)，可折叠成路线摘要，可放大；页面自然滚动。底部“地图/行程/吃饭/回酒店”，无酒店时按数据改成去终点或隐藏。
768–1023px 默认宽单列；>=1024px 默认左地图56%/右行程44%，地图sticky，页面最大宽度约1320px。支持 desktopLayout=split|stacked、mapSide=left|right 两个轻量配置。
所有使用此模板的旅行默认采用：手机（<768px）日期标签上下排列、每天一行、全宽、长标题换行；平板与桌面日期标签横向排列，较多时可横滑。只有一天时改日期条。切日联动地图、路线、行程、餐饮和返程目标。
手机提供操作地图/完成按钮避免拖动地图干扰滚页；全屏地图能关闭、Escape退出并恢复焦点和滚动位置。只保留一个活动地图实例，布局变化后正确resize。

【组件】
TravelTemplateV1、TripHeader、DaySummary、DayTabs、TripMap、MapControls、MapStatus、PlacePreview、RoutePanel、ItineraryTimeline、PlaceCard、TransitLegCard、HotelCard、TransportCard、PhotoGallery、ExternalLinks、RestaurantList/RestaurantRow、NearbyPlaces、MobileQuickNav。
由共享选择状态管理 activeDayId、selectedStopId、selectedPlaceId、selectedLegId、图层、全屏和视口意图。不要为每个视图维护彼此独立的日期状态。

【数据契约】
Trip 包含 id/title/timezone/places/days/sources；Place 用稳定id，含 name/kind/branchName/address/coordinate/providerIds/summary/photos/links、可选停留/开放/门票/预约/评分信息。
coordinate 必须带 lng/lat/crs(GCJ02|WGS84|BD09)，缺失可留空。评分包括 value/scale/platform/checkedAt/sourceUrl，不编造。
Day 包含 id/date/title/directionSummary、ordered stops、legs、restaurantGroups、nearbyPlaceIds、returnPlaceId、alerts。
Stop 用独立id引用 placeId，带计划时段、停留时间、main|optional|free-time。相同酒店可被多天或同一天多个Stop引用，不能把placeId当stopId。
RouteLeg 用 fromStopId/toStopId，含交通方式、可选有序途经点、方向/上下车/出口说明、估计用时、来源和includeInOverview。动态RouteResult与计划数据分离，segment保留独立真实path及坐标系，状态区分加载/完成/部分/失败。
RestaurantGroup 有区域锚点、候选placeId、距离及距离类型straight|walking|driving，每区默认3家可独立展开。默认按区域/距离，评分只在同平台比较，缺失置后；直线距离必须明确标注。
ExternalLink 包含平台、动作、真实URL、detail|search|home类型。Photo 包含alt、出处、作者及rights；unknown默认不在公开版本嵌入。
旅行数据放在独立TS/JSON模块。用开发校验检查重复ID、失效引用、路段顺序、无效坐标；内容字段为空时正确降级。主题用CSS变量，模板可以被其他页面组合复用。

【地图】
中国大陆示例默认高德，做一个薄MapAdapter隔离供应商调用，不需要同时实现多个供应商。高德SDK、安全配置和导航URL以实现时官方文档及仓库已有约定核对，不凭记忆拼未经验证接口。
当前日期只显示当天主点和所需路线。点击POI显示摘要并高亮对应停留；点击摘要中的“查看行程”才滚到卡片。点击卡片“在地图看”聚焦地图；点击交通卡片“查看这一段”突出该段；查看全天恢复当天主路线。自由逛吃只标点。餐饮、可选周边独立开关，不能改变主行程。
手动拖动地图后，晚到请求不能强制重置视口；快速切日时旧结果不能覆盖新日期。按需查询并复用有效缓存，键含provider/起终点坐标及坐标系/mode/途经点/策略，不要每次render请求。
路线只画服务真实返回的geometry；缺段不补假直线，不把示意连线叫真实道路。规划耗时不偷偷重排用户已有日程。
无Key、SDK加载失败、底图失败、路线失败分别显示状态，提供对应重试；路线失败保留能用的底图。无配置时图文和有效外部导航仍可用，不能伪造地图成功。
访客页面不出现API Key输入框。配置由制作者统一提供；前端Key和服务端安全配置分开，不将安全密钥写进源码、VITE_*或日志。若现有仓库尚无安全代理，仅列出待接入条件，不擅自改部署架构。缺少凭据不阻塞模板实现和无配置状态测试，但最终报告必须说明真实地图尚未验证。
分开“计划起点到终点”的路线链接与“从当前位置出发”的导航入口；无可用坐标时允许复制地址或明确标注的搜索入口。不要请求定位直到用户需要从当前位置导航。

【景点、餐饮、图片、链接】
景点卡片：名称、简介、建议停留、开放/门票/预约摘要、一张小幅实景图或横滑图集、攻略和官方入口。默认图比例16:10，手机较宽时链接在图旁，窄屏下移；点击看大图，无自动轮播。
图源署名不等于授权，不能照搬旧V5的第三方图就宣称可公开复用；优先自有/授权素材，无图时干净回退。不要用生成图冒充真实景点。
餐饮保持紧凑：分店名、品类/特色、区域地标、可验证评分/距离、点评/地图入口。一天可容纳10–20家，不为了凑数编造。用户自行判断口味，禁用“必吃第一名”等主观文案。
外链露出平台和动作，如“携程攻略↗”“官方预约↗”“大众点评↗”；只有搜索链接时明写“在平台搜索”。默认2–3个主要入口，其余更多参考。不要造链接，不直接复制第三方长篇攻略。使用合法http/https链接与安全rel，不能把整卡点击和按钮点击互相嵌套。

【视觉】
主色#103e42，正文#183d40，次级#607374，底色#f3f6f4，卡片白，边线#dce5e2；步行/餐饮#c9632b，公交/地铁#775497。用序号/图标/文字辅助颜色识别。
正文16px，辅助14px，卡片标题18–20px；手机边距16px，卡片padding16–20px，圆角14–18px。点击目标至少44px，关键按钮48px高。系统中文字体，无在线字体依赖、无大动画。支持focus-visible、减少动画、safe-area、图片替代文字。底栏不遮内容。

【示例与范围】
默认以长沙第一天作为模板示例：长沙南站→滨江金融中心希尔顿欢朋酒店→岳麓书院→东方红广场/湖大→麓山南路自由逛吃；回酒店单独入口。用已有V5数据时标明其核查时间，未重新核查不更新日期或假称实时。
额外做两天独立开发fixture验证跨日/共享酒店/可选点/无图/无评分/无坐标，不伪装正式第二第三天攻略。v1不做登录、后台CMS、AI自动规划、实时共同编辑、复杂路线优化；先提供可读打印样式，PDF导出后续再做。

【交付与验收】
按现有目录惯例组织 templates/travel-template-v1、trips、地图adapter和types；不要强行重构整个src。文档说明怎样新增旅行、换配色/布局、接入地图配置及当前限制。
执行npm run build和仓库现有必要检查。测试重点：切日后无旧覆盖物；异步竞态；卡片/地图/路段双向联动；餐饮独立展开；全屏退出；无配置和路线失败可读；单日和共享酒店的引用正确。
在可用浏览器验证约390px手机、820px平板、1440px桌面；检查窄屏横向溢出、底栏遮挡、触摸滚动和焦点。模拟响应式不等于真实手机；Mock通过不等于高德线上通过，报告分开写。
缺真实Key时仍完成其余可验证部分，不提交密钥或要求普通访客填写。最终列出修改文件、使用方式、已执行测试、真实地图/真实设备未验证项和实际阻塞点，不声称自动发布或跨端问题已经解决。
```

## 9. 完成标准与后续边界

v1 完成指：模板可被选择；更换旅行数据无需重写组件；单日和多日均正常；手机可快速浏览路线/行程/餐饮；地图与卡片联动；无地图仍能使用文字攻略；构建通过并如实记录实际验证范围。

本次任务书不代表仓库实现已经完成，也不代表原手机 API 故障已修复。后续发布阶段单独验证生产配置、域名、真实手机与内置浏览器行为。环境及部署链路继续沿用用户已经完成的方案。
