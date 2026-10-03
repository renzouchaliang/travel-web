# 旅行数据导出标准 v1

## 1. 目的

本标准用于把旅行规划 Project 中已经确认的最终方案，整理成可直接交给 `TravelTemplateV1` / Cloud Codex 使用的数据包。

核心原则：

- 只导出最终确认方案
- 不混入讨论过程、废案和被替换路线
- 不猜测缺失信息
- 人可读与机器可读分离
- 所有城市使用同一字段结构
- 数据和视觉模板分离

---

## 2. 每次必须导出两份文件

### A. 人工审阅版

```text
trip-[city]-[year].md
```

例如：

```text
trip-changsha-2026.md
```

作用：
- 方便人工检查
- 保留完整旅行逻辑
- 方便后续修改和讨论

### B. 机器数据版

```text
trip-[city]-[year].json
```

例如：

```text
trip-changsha-2026.json
```

作用：
- Cloud Codex 直接读取
- 映射到 TravelTemplateV1
- 构建地图、时间轴、卡片、餐饮列表和路线

---

## 3. JSON 顶层结构

统一使用：

```json
{
  "schemaVersion": "1.0",
  "trip": {},
  "sources": [],
  "missingData": [],
  "validation": {}
}
```

---

## 4. trip 基础信息

```json
{
  "trip": {
    "id": "changsha-2026-10",
    "title": "长沙三日旅行攻略",
    "subtitle": null,
    "city": "长沙",
    "province": "湖南",
    "country": "中国",
    "startDate": "2026-10-02",
    "endDate": "2026-10-04",
    "timezone": "Asia/Shanghai",
    "language": "zh-CN",
    "party": {
      "adults": null,
      "children": null,
      "notes": null
    }
  }
}
```

### 规则

- 日期统一 `YYYY-MM-DD`
- `id` 使用英文小写、数字、连字符
- 不确定字段写 `null`
- 不使用 `"待定"`、`"未知"` 代替 null

---

## 5. 酒店信息

```json
{
  "hotel": {
    "name": null,
    "address": null,
    "lat": null,
    "lng": null,
    "checkInDate": null,
    "checkOutDate": null,
    "officialUrl": null,
    "mapUrl": null,
    "notes": null
  }
}
```

如果多酒店：

```json
"hotels": []
```

不要强行塞进单个 hotel 字段。

---

## 6. 每日行程

核心结构：

```json
{
  "days": [
    {
      "day": 1,
      "date": "2026-10-02",
      "title": "抵达长沙与市中心夜游",
      "summary": null,
      "startLocationId": null,
      "endLocationId": null,
      "stops": [],
      "dining": [],
      "notes": null
    }
  ]
}
```

---

## 7. Stop 标准

所有景点、酒店、车站、商场、交通节点都尽量统一成 stop。

```json
{
  "id": "d1-orange-island",
  "name": "橘子洲",
  "type": "attraction",
  "status": "confirmed",

  "arrivalTime": "15:00",
  "departureTime": "17:00",
  "durationMinutes": 120,

  "address": null,
  "lat": null,
  "lng": null,

  "description": null,
  "practicalInfo": {
    "openingHours": null,
    "ticketInfo": null,
    "reservationRequired": null,
    "recommendedDuration": null
  },

  "officialUrl": null,
  "mapUrl": null,

  "guideUrls": [],
  "imageUrls": [],

  "notes": null
}
```

### type 固定枚举

建议只使用：

```text
attraction
hotel
restaurant
transport
shopping
activity
viewpoint
other
```

不要每个城市自己发明新的 type。

---

## 8. 路线 RouteLeg

不要只把“下一站怎么走”写进自然语言，最好单独结构化。

```json
{
  "routeLegs": [
    {
      "id": "d1-leg-01",
      "day": 1,
      "fromStopId": "d1-hotel",
      "toStopId": "d1-orange-island",
      "mode": "metro",
      "durationMinutes": 25,
      "distanceKm": null,
      "description": null,
      "routeUrl": null,
      "status": "confirmed"
    }
  ]
}
```

### mode 固定枚举

```text
walk
metro
bus
taxi
ride_hailing
drive
rail
flight
ferry
bike
other
```

---

## 9. 餐饮 Dining

餐饮不要和正式行程 stop 完全混在一起，除非已经确定一定去。

推荐结构：

```json
{
  "dining": [
    {
      "id": "d1-dining-wuyi",
      "area": "五一广场",
      "meal": "dinner",
      "recommendedTime": "18:00",
      "restaurants": [
        {
          "name": null,
          "category": null,
          "address": null,
          "lat": null,
          "lng": null,
          "rating": null,
          "priceLevel": null,
          "mapUrl": null,
          "reviewUrl": null,
          "officialUrl": null,
          "notes": null
        }
      ]
    }
  ]
}
```

### 餐饮原则

- 优先记录位置、评分、距离、类别
- 少做 AI 主观“最好吃”判断
- 推荐可多给几个
- 默认前端展示前 3 家，其余展开
- 保留大众点评/地图等入口

---

## 10. 外部攻略链接

统一结构：

```json
{
  "guideUrls": [
    {
      "title": "橘子洲游览参考",
      "provider": "马蜂窝",
      "url": "https://...",
      "type": "guide"
    }
  ]
}
```

### type 建议

```text
official
guide
review
video
map
booking
social
other
```

不要把来源名称塞进 URL 字符串里。

---

## 11. 图片

统一：

```json
{
  "imageUrls": [
    {
      "url": "https://...",
      "caption": null,
      "source": null,
      "license": null
    }
  ]
}
```

如果没有明确可用图片：

```json
"imageUrls": []
```

不要自动抓不明版权图片。

---

## 12. 来源 Sources

所有重要信息来源集中记录：

```json
{
  "sources": [
    {
      "id": "source-001",
      "title": "橘子洲景区官方信息",
      "provider": "官方",
      "url": "https://...",
      "accessedDate": "2026-10-03",
      "usedFor": [
        "openingHours",
        "ticketInfo"
      ]
    }
  ]
}
```

这样以后能追溯信息。

---

## 13. missingData

任何未确认内容都集中列出来。

```json
{
  "missingData": [
    {
      "field": "trip.hotel.lat",
      "reason": "酒店坐标尚未确认",
      "priority": "medium"
    },
    {
      "field": "days[1].stops[2].openingHours",
      "reason": "未查到可靠官方信息",
      "priority": "low"
    }
  ]
}
```

### priority

```text
high
medium
low
```

---

## 14. validation

必须附带校验结果：

```json
{
  "validation": {
    "jsonValid": true,
    "duplicateStopIds": [],
    "timeConflicts": [],
    "routeConflicts": [],
    "missingCoordinates": [],
    "unresolvedUrls": [],
    "notes": []
  }
}
```

---

## 15. Markdown 文件标准

Markdown 不需要机械复制 JSON，而是按人类阅读方式组织。

建议固定结构：

```markdown
# 长沙三日旅行攻略

## 旅行概览

## 酒店

## Day 1
### 时间轴
### 景点
### 路线
### 餐饮

## Day 2

## Day 3

## 实用信息

## 外部参考链接

## Missing Data

## Validation Report
```

---

## 16. 数据可信度规则

每个重要数据都建议有状态：

```text
confirmed
tentative
unknown
```

例如：

```json
"status": "confirmed"
```

规则：

- `confirmed`：已明确确认
- `tentative`：暂定方案
- `unknown`：尚无可靠信息

前端默认可以隐藏 `unknown` 内容。

---

## 17. 不允许的做法

以后任何城市导出时都不要：

- 混入被否决的旧路线
- 根据常识自动补时间
- 自动猜坐标
- 自动猜酒店
- 把“推荐”写成“已确定”
- 把来源不明内容标成官方信息
- 在 JSON 中加入注释
- 用中文 `"暂无"` 代替 null
- 同一个 stop 使用多个不同 ID

---

## 18. 文件命名标准

统一：

```text
trip-[city]-[year].md
trip-[city]-[year].json
```

更具体可以：

```text
trip-changsha-2026-10.md
trip-changsha-2026-10.json
```

图片资产：

```text
/assets/trips/changsha-2026/
```

---

## 19. Cloud Codex 接收规则

以后给 Cloud Codex 时，固定说：

> Use the attached trip JSON as the source of truth.
>
> Do not invent or alter itinerary facts.
> Do not redesign the reusable template.
> Populate `TravelTemplateV1` using the provided data.
> Treat `null` fields as unknown rather than filling them automatically.
> Preserve all confirmed dates, times, route order, stop IDs, and external links.
> Report missing data instead of guessing.
> Run validation and production build before deployment.

---

## 20. 建议的正式名称

以后统一叫：

**Travel Data Export Standard v1**

中文：

**旅行数据导出标准 v1**

长沙只是第一个使用实例，不要把 schema 命名成长沙专用。

---

## 标准工作流

**旅行讨论 Project**  
→ 生成标准化 `.md + .json`  
→ **Cloud Codex / TravelTemplateV1**  
→ 构建网页  
→ GitHub  
→ Cloudflare  
→ 返回链接

这套格式一旦稳定，后面换广州、南京、东京、美国自驾，都不需要重新设计数据结构。
