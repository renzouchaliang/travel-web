# 模块与资料字段草案 · 2026-10-04

这是样式调整中的字段草案。样式确认后再整理成最终 ChatGPT 资料收集指令与导出标准。本次网页不主动查找门店、改行程或编造票务信息。

| 模块 | 数据字段 | 显示方式 |
| --- | --- | --- |
| 地点 | `Place.name`, `mapLabel`, `kind`, `coordinate`, `address` | 完整名留在卡片；地图用短名；酒店默认“酒店”，两家时“酒店1/2”或指定短名 |
| 游览停留 | `Stop.startTime/endTime/stayMinutes/description/visitPurpose` | 时间、说明；用途可为游览、拍照、场馆、公园、自由活动 |
| 场馆票务 | `Place.ticket/booking/opening/openingMilestones`, `links` | 简洁票价、预约入口、停止售票/入院/闭馆时间；缺字段隐藏；买票外链可提供携程/美团/官方 |
| 到达／离开 | `Stop.transport` | 见下方字段；末尾离开显示车次航班，住酒店则以酒店休息收尾 |
| 当地交通 | `RouteLeg.mode/summary/preferredLine/directionHint/boarding/alighting/exitHint/plannedMinutes` | 独立交通卡片；方向、站点、出口和用时 |
| 路线地图 | `routingFromPlaceId/routingToPlaceId/mapDisplay/includeInOverview`, `Place.coordinate/providerIds.amapCity` | 正确入口和车站端点；真实高德查询；接驳仅文字，不画线 |
| 餐饮分区 | `RestaurantGroup.anchorPlaceId/title/candidates` | 酒店／重要景点周边标签页，一次显示一个区域的紧凑清单 |
| 门店 | `Place.name/mapLabel/foodTags/address/links/rating`，候选 `distance` | 店名定位地图；菜系、距离、评分及点评入口；不展示缺失元数据 |

## 到达／离开卡片

`transport` 支持：`direction`（arrival/departure）、`mode`（rail/flight/coach）、`origin`、`destination`、`departureTime`、`arrivalTime`、`serviceNumber`、`carriage`、`seat`、`terminal`、`gate`、`boardingDeadline`。

这些信息由前期资料沟通确认；全部可选，缺失时不出现“待定”条目。出发站和到达站各自具有地点坐标时可标记，但城际/机场车站接驳不用地图连线、不参与游玩区域取景。当前长沙第一天只提供13:00抵达长沙南站，最后一天只提供20:40发车；不填写广州南、车次、车厢或座位。

第二天从住处出发也应交接一个酒店出发节点与当地交通路段，网页依据提供的数据展示，不自行补路线。

## 餐饮前期收集要求（待最终标准确认）

- 每个酒店／重要景点区域，以明确坐标为中心，目标为至少5家、1公里内的候选。
- 优先大众点评4/5分以上；采用人气排名替代时需提供平台、排名及对应地域/榜单范围，不能从截图或不同平台评分推断合格。
- 提供具体门店、简称、菜系、坐标、距离及测量方式、同平台评分或排名、具体门店点评链接。评分/营业/距离的核查资料留在交接文档，不显示访客元数据。
- 前期不足5家时注明资料缺口，不凑数量。当前3个区域各4家、评分为空，因此沿用真实已有12家，不宣称满足筛选条件。
- 页面不做自动抓取；正式生产使用前期资料完成筛选的名单。公开分享只放适合分享的车票信息，不加入证件信息。

## 地图显示规则

- 餐饮层关闭时不显示；开启即显示固定8px橙点，zoom≥14显示简短店名。已选门店立即显示店名，卡片定位门店时设zoom=16。缺坐标的门店用已有详情链接，不假标在区域中心。
- 餐饮与主景点使用不同形状/尺寸/颜色，地址和分店信息不放在地图标签。
- 单酒店地图标签及路段按钮统一用“酒店”，景点可指定 `mapLabel`。
- 全屏占可用视口，地图自动可操作；固定“退出全屏”，Escape退出；横屏压缩顶部工具栏，浏览器支持自然横屏，不强制锁定屏幕方向。
- 文件中的规划输入与高德实时返回分开，`geometry:null` 不阻止查询；无正确坐标/城市或查询失败时不猜测路径。

## 周边有趣地点：独立资料模块

每个日期可交接 `nearbyPlaces: Place[]`；每个地点提供稳定id、名称/地图短名、类型、简介、坐标及坐标系、地址，以及实际核查的导航/攻略/官方链接。模板内部映射到 `Day.nearbyPlaceIds`，这些地点不进入主行程路段或默认取景。全程页尾去重汇总，点击定位切至该地点所属日期；展开信息与平台链接按已提供字段显示。Map默认可操作，餐饮点的“在地图看”只在提供准确坐标时显示，缺坐标不能用区域锚点冒充门店位置。
