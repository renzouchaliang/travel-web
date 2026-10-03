# 长沙旅行攻略

按《旅行数据导出标准 v1》导出。字段中的 `null` 表示未确认；时间沿用原有建议，不代表实时核验结果。

- **schemaVersion**：`"1.0"`
## 旅行概览与行程

- **id**：`"changsha-2026-10"`
- **title**：`"长沙旅行攻略"`
- **subtitle**：`null`
- **city**：`"长沙"`
- **province**：`"湖南"`
- **country**：`"中国"`
- **startDate**：`"2026-10-02"`
- **endDate**：`"2026-10-05"`
- **timezone**：`"Asia/Shanghai"`
- **language**：`"zh-CN"`
### party

- **adults**：`null`
- **children**：`null`
- **notes**：`null`

### 酒店

- **name**：`"长沙滨江金融中心希尔顿欢朋酒店"`
- **address**：`"长沙市岳麓区观沙岭路龙湖铂金岛A座"`
- **lat**：`28.240356`
- **lng**：`112.95531`
- **checkInDate**：`"2026-10-02"`
- **checkOutDate**：`"2026-10-05"`
- **officialUrl**：`"https://www.hilton.com/zh-hans/hotels/csxshhx-hampton-changsha-binjiang-financial-center/hotel-location/"`
- **mapUrl**：`"https://www.amap.com/place/B0IR474XZ1"`
- **notes**：`"三晚；坐标沿用V5高德点位，GCJ02，具体出入口未核实。"`
- **nights**：`3`
- **checkInTime**：`null`
- **checkOutTime**：`null`
- **placeId**：`"hotel"`

### 每日行程


#### Day 1 · 2026-10-02

- **day**：`1`
- **date**：`"2026-10-02"`
- **title**：`"抵达、入住、书院与湖大周边"`
- **summary**：`"先到湘江西岸放行李，再向南去书院；湖大周边步行。"`
- **status**：`"confirmed"`
- **startLocationId**：`"d1-arrival"`
- **endLocationId**：`"d1-return"`
##### 时间轴与景点


###### 长沙南站

- **id**：`"d1-arrival"`
- **placeId**：`"south"`
- **name**：`"长沙南站"`
- **type**：`"transport"`
- **status**：`"confirmed"`
- **arrivalTime**：`"13:00"`
- **departureTime**：`null`
- **durationMinutes**：`null`
- **address**：`null`
- **lat**：`28.147093`
- **lng**：`113.06551`
- **description**：`"10月2日13:00抵达，先去酒店。"`
###### practicalInfo

- **openingHours**：`null`
- **ticketInfo**：`null`
- **reservationRequired**：`null`
- **recommendedDuration**：`null`

- **officialUrl**：`null`
- **mapUrl**：`null`
- **guideUrls**：`[]`
- **imageUrls**：`[]`
- **notes**：`[]`
###### sourceIds

- `"v5"`

- **timeBasis**：`"已确认行程；未细化的时刻留null"`
- **timeWindow**：`null`
- **nextStopId**：`"d1-hotel"`
- **nextLegId**：`"d1-l1"`
###### coordinateReference

- **lng**：`113.06551`
- **lat**：`28.147093`
- **crs**：`"GCJ02"`
- **precisionNote**：`"沿用V5高德点位，不代表已核实具体出入口"`



###### 长沙滨江金融中心希尔顿欢朋酒店

- **id**：`"d1-hotel"`
- **placeId**：`"hotel"`
- **name**：`"长沙滨江金融中心希尔顿欢朋酒店"`
- **type**：`"hotel"`
- **status**：`"confirmed"`
- **arrivalTime**：`"14:00"`
- **departureTime**：`"15:20"`
- **durationMinutes**：`null`
- **address**：`"长沙市岳麓区观沙岭路龙湖铂金岛A座"`
- **lat**：`28.240356`
- **lng**：`112.95531`
- **description**：`"先放行李，再在附近用午饭。"`
###### practicalInfo

- **openingHours**：`null`
- **ticketInfo**：`null`
- **reservationRequired**：`null`
- **recommendedDuration**：`null`

- **officialUrl**：`"https://www.hilton.com/zh-hans/hotels/csxshhx-hampton-changsha-binjiang-financial-center/hotel-location/"`
- **mapUrl**：`"https://www.amap.com/place/B0IR474XZ1"`
###### guideUrls


###### 1

- **title**：`"高德酒店楼栋位置"`
- **provider**：`"高德"`
- **url**：`"https://www.amap.com/place/B0IR474XZ1"`
- **type**：`"map"`


- **imageUrls**：`[]`
- **notes**：`[]`
###### sourceIds

- `"v5"`

- **timeBasis**：`"V5建议时间，非实时或预约保证"`
- **timeWindow**：`null`
- **nextStopId**：`"d1-academy"`
- **nextLegId**：`"d1-l2"`
###### coordinateReference

- **lng**：`112.95531`
- **lat**：`28.240356`
- **crs**：`"GCJ02"`
- **precisionNote**：`"沿用V5高德点位，不代表已核实具体出入口"`



###### 岳麓书院

- **id**：`"d1-academy"`
- **placeId**：`"academy"`
- **name**：`"岳麓书院"`
- **type**：`"attraction"`
- **status**：`"confirmed"`
- **arrivalTime**：`"16:00"`
- **departureTime**：`null`
- **durationMinutes**：`null`
- **address**：`null`
- **lat**：`28.180397`
- **lng**：`112.940805`
- **description**：`"先游览有入场时限的书院，再去湖大周边。"`
###### practicalInfo

- **openingHours**：`null`
- **ticketInfo**：`null`
- **reservationRequired**：`null`
- **recommendedDuration**：`"60–90分钟"`

- **officialUrl**：`"https://ylsy.hnu.edu.cn/wbly/cgdn/zxdp.htm"`
- **mapUrl**：`null`
###### guideUrls


###### 1

- **title**：`"携程攻略"`
- **provider**：`"携程"`
- **url**：`"https://gs.ctrip.com/html5/you/sight/changsha148/9013.html"`
- **type**：`"guide"`


- **imageUrls**：`[]`
###### notes

- `"书院预约结果未确认；这里只保留已选行程，不导入未预约时的替代方案。"`

###### sourceIds

- `"v5"`

- **timeBasis**：`"V5建议时间，非实时或预约保证"`
- **timeWindow**：`null`
- **nextStopId**：`"d1-square"`
- **nextLegId**：`"d1-l3"`
###### durationRangeMinutes

- **min**：`60`
- **max**：`90`

###### coordinateReference

- **lng**：`112.940805`
- **lat**：`28.180397`
- **crs**：`"GCJ02"`
- **precisionNote**：`"沿用V5高德点位，不代表已核实具体出入口"`

###### reservation

- **status**：`null`
- **exactTimeWindow**：`null`

###### imageReference

- **url**：`"https://img.rednet.cn/2022/10-12/633c6ab3-ce0b-4b1f-9b50-7142ccec7203.jpg"`
- **sourceUrl**：`"https://hn.rednet.cn/content/2022/10/12/11928392.html"`
- **credit**：`"红网 · 岳麓书院资料图"`
- **reusePermission**：`null`
- **publishableUrl**：`null`
- **placeholder**：`"图片授权待确认；发布时暂用占位，保留图源入口。"`



###### 东方红广场与湖南大学周边

- **id**：`"d1-square"`
- **placeId**：`"square"`
- **name**：`"东方红广场与湖南大学周边"`
- **type**：`"attraction"`
- **status**：`"confirmed"`
- **arrivalTime**：`"17:15"`
- **departureTime**：`null`
- **durationMinutes**：`null`
- **address**：`null`
- **lat**：`28.179428`
- **lng**：`112.943877`
- **description**：`"广场、老建筑与登高路周边散步拍照。"`
###### practicalInfo

- **openingHours**：`null`
- **ticketInfo**：`null`
- **reservationRequired**：`null`
- **recommendedDuration**：`null`

- **officialUrl**：`"https://xyzh.hnu.edu.cn/info/1025/6034.htm"`
- **mapUrl**：`null`
###### guideUrls


###### 1

- **title**：`"携程攻略"`
- **provider**：`"携程"`
- **url**：`"https://gs.ctrip.com/html5/you/sight/changsha148/1714337.html"`
- **type**：`"guide"`


- **imageUrls**：`[]`
- **notes**：`[]`
###### sourceIds

- `"v5"`

- **timeBasis**：`"V5建议时间，非实时或预约保证"`
- **timeWindow**：`null`
- **nextStopId**：`"d1-food"`
- **nextLegId**：`"d1-l4"`
###### coordinateReference

- **lng**：`112.943877`
- **lat**：`28.179428`
- **crs**：`"GCJ02"`
- **precisionNote**：`"沿用V5高德点位，不代表已核实具体出入口"`

###### imageReference

- **url**：`"https://xyzh.hnu.edu.cn/__local/6/55/57/DECF72CBFD8B009F0E4F07CEBD5_5D9258F9_437E4.jpg?e=.jpg"`
- **sourceUrl**：`"https://xyzh.hnu.edu.cn/info/1025/6034.htm"`
- **credit**：`"湖南大学 · 陈佳祺 摄"`
- **reusePermission**：`null`
- **publishableUrl**：`null`
- **placeholder**：`"图片授权待确认；发布时暂用占位，保留图源入口。"`



###### 麓山南路自由逛吃

- **id**：`"d1-food"`
- **placeId**：`"lushan-food"`
- **name**：`"麓山南路自由逛吃"`
- **type**：`"other"`
- **status**：`"confirmed"`
- **arrivalTime**：`"18:00"`
- **departureTime**：`null`
- **durationMinutes**：`null`
- **address**：`"麓山南路"`
- **lat**：`null`
- **lng**：`null`
- **description**：`"从东方红广场向南，沿路自行选择餐饮，不固定全部打卡。"`
###### practicalInfo

- **openingHours**：`null`
- **ticketInfo**：`null`
- **reservationRequired**：`null`
- **recommendedDuration**：`null`

- **officialUrl**：`null`
- **mapUrl**：`null`
- **guideUrls**：`[]`
- **imageUrls**：`[]`
- **notes**：`[]`
###### sourceIds

- `"v5"`

- **timeBasis**：`"V5建议时间，非实时或预约保证"`
- **timeWindow**：`"傍晚自由活动"`
- **nextStopId**：`"d1-return"`
- **nextLegId**：`"d1-l5"`


###### 长沙滨江金融中心希尔顿欢朋酒店

- **id**：`"d1-return"`
- **placeId**：`"hotel"`
- **name**：`"长沙滨江金融中心希尔顿欢朋酒店"`
- **type**：`"hotel"`
- **status**：`"confirmed"`
- **arrivalTime**：`null`
- **departureTime**：`null`
- **durationMinutes**：`null`
- **address**：`"长沙市岳麓区观沙岭路龙湖铂金岛A座"`
- **lat**：`28.240356`
- **lng**：`112.95531`
- **description**：`"先放行李，再在附近用午饭。"`
###### practicalInfo

- **openingHours**：`null`
- **ticketInfo**：`null`
- **reservationRequired**：`null`
- **recommendedDuration**：`null`

- **officialUrl**：`"https://www.hilton.com/zh-hans/hotels/csxshhx-hampton-changsha-binjiang-financial-center/hotel-location/"`
- **mapUrl**：`"https://www.amap.com/place/B0IR474XZ1"`
###### guideUrls


###### 1

- **title**：`"高德酒店楼栋位置"`
- **provider**：`"高德"`
- **url**：`"https://www.amap.com/place/B0IR474XZ1"`
- **type**：`"map"`


- **imageUrls**：`[]`
###### notes

- `"回酒店时间未确认；与入住酒店为同一POI。"`

###### sourceIds

- `"v5"`

- **timeBasis**：`"V5建议时间，非实时或预约保证"`
- **timeWindow**：`null`
- **nextStopId**：`null`
- **nextLegId**：`null`
###### coordinateReference

- **lng**：`112.95531`
- **lat**：`28.240356`
- **crs**：`"GCJ02"`
- **precisionNote**：`"沿用V5高德点位，不代表已核实具体出入口"`



##### 餐饮


###### 酒店附近 · 凯德壹中心

- **id**：`"hotel-food"`
- **area**：`"酒店附近 · 凯德壹中心"`
- **meal**：`null`
- **recommendedTime**：`null`
- **anchorPlaceId**：`"hotel"`
- **initialVisible**：`3`
###### restaurants


###### 海底捞火锅（凯德壹中心店）

- **id**：`"haidilao"`
- **name**：`"海底捞火锅（凯德壹中心店）"`
- **category**：`"火锅 · 可选清淡锅底"`
- **address**：`"凯德壹中心L2层19、20号"`
- **lat**：`null`
- **lng**：`null`
- **rating**：`null`
- **priceLevel**：`null`
- **mapUrl**：`null`
- **reviewUrl**：`"https://www.dianping.com/shop/k5z02Y3gGMYiQZcY"`
- **officialUrl**：`null`
###### guideUrls


###### 1

- **title**：`"大众点评"`
- **provider**：`"大众点评"`
- **url**：`"https://www.dianping.com/shop/k5z02Y3gGMYiQZcY"`
- **type**：`"review"`


- **distance**：`null`
- **businessStatus**：`null`
###### notes

- `"候选清单不代表已选定用餐；评分和实时营业情况未补造。"`
- `"未把商场入口距离作为具体门店距离。"`

###### sourceIds

- `"v5"`

- **selectionStatus**：`"candidate"`


###### 杂咖中西美食音乐餐厅（凯德壹中心店）

- **id**：`"zaka"`
- **name**：`"杂咖中西美食音乐餐厅（凯德壹中心店）"`
- **category**：`"牛排 · 意面"`
- **address**：`"凯德壹中心内"`
- **lat**：`null`
- **lng**：`null`
- **rating**：`null`
- **priceLevel**：`null`
- **mapUrl**：`null`
- **reviewUrl**：`"https://www.dianping.com/shop/E9HeBxOi6ZjZ6i3Q"`
- **officialUrl**：`null`
###### guideUrls


###### 1

- **title**：`"大众点评"`
- **provider**：`"大众点评"`
- **url**：`"https://www.dianping.com/shop/E9HeBxOi6ZjZ6i3Q"`
- **type**：`"review"`


- **distance**：`null`
- **businessStatus**：`null`
###### notes

- `"候选清单不代表已选定用餐；评分和实时营业情况未补造。"`
- `"未把商场入口距离作为具体门店距离。"`

###### sourceIds

- `"v5"`

- **selectionStatus**：`"candidate"`


###### 费大厨辣椒炒肉（凯德壹中心店）

- **id**：`"feidachu"`
- **name**：`"费大厨辣椒炒肉（凯德壹中心店）"`
- **category**：`"辣椒炒肉 · 湘菜正餐"`
- **address**：`"凯德壹中心4楼18号"`
- **lat**：`null`
- **lng**：`null`
- **rating**：`null`
- **priceLevel**：`null`
- **mapUrl**：`null`
- **reviewUrl**：`null`
- **officialUrl**：`null`
###### guideUrls


###### 1

- **title**：`"门店资料"`
- **provider**：`"携程"`
- **url**：`"https://gs.ctrip.com/html5/you/foods/fooddetail/148/22538478.html"`
- **type**：`"guide"`


- **distance**：`null`
- **businessStatus**：`null`
###### notes

- `"候选清单不代表已选定用餐；评分和实时营业情况未补造。"`
- `"未把商场入口距离作为具体门店距离。"`

###### sourceIds

- `"v5"`

- **selectionStatus**：`"candidate"`


###### 胡大山（凯德壹中心店）

- **id**：`"hudashan"`
- **name**：`"胡大山（凯德壹中心店）"`
- **category**：`"豆腐佬汤 · 湘菜小炒"`
- **address**：`null`
- **lat**：`null`
- **lng**：`null`
- **rating**：`null`
- **priceLevel**：`null`
- **mapUrl**：`null`
- **reviewUrl**：`"https://www.dianping.com/shop/126974080"`
- **officialUrl**：`null`
###### guideUrls


###### 1

- **title**：`"大众点评"`
- **provider**：`"大众点评"`
- **url**：`"https://www.dianping.com/shop/126974080"`
- **type**：`"review"`


- **distance**：`null`
- **businessStatus**：`null`
###### notes

- `"保留为V5餐饮候选；资料较早，当前营业情况未确认，不是已确定用餐门店。"`
- `"候选清单不代表已选定用餐；评分和实时营业情况未补造。"`
- `"未把商场入口距离作为具体门店距离。"`

###### sourceIds

- `"v5"`

- **selectionStatus**：`"candidate"`




###### 书院与登高路

- **id**：`"denggao-food"`
- **area**：`"书院与登高路"`
- **meal**：`null`
- **recommendedTime**：`null`
- **anchorPlaceId**：`"square"`
- **initialVisible**：`3`
###### restaurants


###### 包建斌帅哥烧饼（登高路门店）

- **id**：`"shaobing"`
- **name**：`"包建斌帅哥烧饼（登高路门店）"`
- **category**：`"现烤烧饼"`
- **address**：`null`
- **lat**：`null`
- **lng**：`null`
- **rating**：`null`
- **priceLevel**：`null`
- **mapUrl**：`null`
- **reviewUrl**：`"https://www.dianping.com/shop/3207538"`
- **officialUrl**：`null`
###### guideUrls


###### 1

- **title**：`"大众点评"`
- **provider**：`"大众点评"`
- **url**：`"https://www.dianping.com/shop/3207538"`
- **type**：`"review"`


- **distance**：`null`
- **businessStatus**：`null`
###### notes

- `"公开门牌不一致，地址留null；具体门店地址需人工核实。"`
- `"候选清单不代表已选定用餐；评分和实时营业情况未补造。"`

###### sourceIds

- `"v5"`

- **selectionStatus**：`"candidate"`


###### 向群锅饺（登高路店）

- **id**：`"xiangqun"`
- **name**：`"向群锅饺（登高路店）"`
- **category**：`"锅饺"`
- **address**：`"登高路46号"`
- **lat**：`null`
- **lng**：`null`
- **rating**：`null`
- **priceLevel**：`null`
- **mapUrl**：`null`
- **reviewUrl**：`"https://www.dianping.com/shop/k7gsBPPX7AZea2pv"`
- **officialUrl**：`null`
###### guideUrls


###### 1

- **title**：`"大众点评"`
- **provider**：`"大众点评"`
- **url**：`"https://www.dianping.com/shop/k7gsBPPX7AZea2pv"`
- **type**：`"review"`


###### distance

- **meters**：`440`
- **kind**：`"walking"`
- **origin**：`"湖南大学地铁站2号口"`
- **basis**：`"V5记录，非实时导航"`

- **businessStatus**：`null`
###### notes

- `"候选清单不代表已选定用餐；评分和实时营业情况未补造。"`

###### sourceIds

- `"v5"`

- **selectionStatus**：`"candidate"`


###### 茶颜悦色（登高路上店）

- **id**：`"chayan"`
- **name**：`"茶颜悦色（登高路上店）"`
- **category**：`"中式茶饮"`
- **address**：`null`
- **lat**：`null`
- **lng**：`null`
- **rating**：`null`
- **priceLevel**：`null`
- **mapUrl**：`null`
- **reviewUrl**：`"https://www.dianping.com/shop/k64XHWg6bjf02DUh"`
- **officialUrl**：`null`
###### guideUrls


###### 1

- **title**：`"大众点评"`
- **provider**：`"大众点评"`
- **url**：`"https://www.dianping.com/shop/k64XHWg6bjf02DUh"`
- **type**：`"review"`


- **distance**：`null`
- **businessStatus**：`null`
###### notes

- `"候选清单不代表已选定用餐；评分和实时营业情况未补造。"`

###### sourceIds

- `"v5"`

- **selectionStatus**：`"candidate"`


###### 霸王茶姬（长沙湖南大学登高路店）

- **id**：`"chagee"`
- **name**：`"霸王茶姬（长沙湖南大学登高路店）"`
- **category**：`"原叶鲜奶茶"`
- **address**：`null`
- **lat**：`null`
- **lng**：`null`
- **rating**：`null`
- **priceLevel**：`null`
- **mapUrl**：`null`
- **reviewUrl**：`"https://www.dianping.com/shop/l7F2B1eBsPYFTOcB"`
- **officialUrl**：`null`
###### guideUrls


###### 1

- **title**：`"大众点评"`
- **provider**：`"大众点评"`
- **url**：`"https://www.dianping.com/shop/l7F2B1eBsPYFTOcB"`
- **type**：`"review"`


- **distance**：`null`
- **businessStatus**：`null`
###### notes

- `"候选清单不代表已选定用餐；评分和实时营业情况未补造。"`

###### sourceIds

- `"v5"`

- **selectionStatus**：`"candidate"`




###### 麓山南路 · 向南慢慢逛

- **id**：`"lushan-food-group"`
- **area**：`"麓山南路 · 向南慢慢逛"`
- **meal**：`null`
- **recommendedTime**：`null`
- **anchorPlaceId**：`"square"`
- **initialVisible**：`3`
###### restaurants


###### 老头子糖油粑粑（麓山南路158号门店）

- **id**：`"sugar"`
- **name**：`"老头子糖油粑粑（麓山南路158号门店）"`
- **category**：`"糖油粑粑"`
- **address**：`"麓山南路158号"`
- **lat**：`28.174192`
- **lng**：`112.945291`
- **rating**：`null`
- **priceLevel**：`null`
- **mapUrl**：`null`
- **reviewUrl**：`"https://www.dianping.com/shop/5657415"`
- **officialUrl**：`null`
###### guideUrls


###### 1

- **title**：`"大众点评"`
- **provider**：`"大众点评"`
- **url**：`"https://www.dianping.com/shop/5657415"`
- **type**：`"review"`


###### distance

- **meters**：`600`
- **kind**：`"straight"`
- **origin**：`"东方红广场"`
- **basis**：`"V5约数，不是步行距离"`

- **businessStatus**：`null`
###### notes

- `"候选清单不代表已选定用餐；评分和实时营业情况未补造。"`

###### sourceIds

- `"v5"`

- **selectionStatus**：`"candidate"`


###### 中原面吧（麓山南路店）

- **id**：`"noodle"`
- **name**：`"中原面吧（麓山南路店）"`
- **category**：`"粉面 · 简单正餐"`
- **address**：`"麓山南路140号"`
- **lat**：`28.174701`
- **lng**：`112.945163`
- **rating**：`null`
- **priceLevel**：`null`
- **mapUrl**：`null`
- **reviewUrl**：`"https://www.dianping.com/shop/3154960"`
- **officialUrl**：`null`
###### guideUrls


###### 1

- **title**：`"大众点评"`
- **provider**：`"大众点评"`
- **url**：`"https://www.dianping.com/shop/3154960"`
- **type**：`"review"`


###### distance

- **meters**：`540`
- **kind**：`"straight"`
- **origin**：`"东方红广场"`
- **basis**：`"V5约数，不是步行距离"`

- **businessStatus**：`null`
###### notes

- `"候选清单不代表已选定用餐；评分和实时营业情况未补造。"`

###### sourceIds

- `"v5"`

- **selectionStatus**：`"candidate"`


###### 运栋天马牛肉饼（麓山南路228号门店）

- **id**：`"beef"`
- **name**：`"运栋天马牛肉饼（麓山南路228号门店）"`
- **category**：`"牛肉饼"`
- **address**：`"麓山南路228号"`
- **lat**：`28.173301`
- **lng**：`112.945231`
- **rating**：`null`
- **priceLevel**：`null`
- **mapUrl**：`"https://www.amap.com/place/B0FFKV3KJB"`
- **reviewUrl**：`null`
- **officialUrl**：`null`
###### guideUrls


###### 1

- **title**：`"门店资料"`
- **provider**：`"高德"`
- **url**：`"https://www.amap.com/place/B0FFKV3KJB"`
- **type**：`"map"`


###### distance

- **meters**：`690`
- **kind**：`"straight"`
- **origin**：`"东方红广场"`
- **basis**：`"V5约数，不是步行距离"`

- **businessStatus**：`null`
###### notes

- `"候选清单不代表已选定用餐；评分和实时营业情况未补造。"`

###### sourceIds

- `"v5"`

- **selectionStatus**：`"candidate"`


###### 鮨花道（麓山南路店）

- **id**：`"sushi"`
- **name**：`"鮨花道（麓山南路店）"`
- **category**：`"凯撒卷 · 牛油果鳗鱼寿司"`
- **address**：`"麓山南路308号"`
- **lat**：`28.171595`
- **lng**：`112.944636`
- **rating**：`null`
- **priceLevel**：`null`
- **mapUrl**：`null`
- **reviewUrl**：`"https://www.dianping.com/shop/FYSLBeW8fUJJXjf1"`
- **officialUrl**：`null`
###### guideUrls


###### 1

- **title**：`"大众点评"`
- **provider**：`"大众点评"`
- **url**：`"https://www.dianping.com/shop/FYSLBeW8fUJJXjf1"`
- **type**：`"review"`


###### distance

- **meters**：`870`
- **kind**：`"straight"`
- **origin**：`"东方红广场"`
- **basis**：`"V5约数，不是步行距离"`

- **businessStatus**：`null`
###### notes

- `"候选清单不代表已选定用餐；评分和实时营业情况未补造。"`

###### sourceIds

- `"v5"`

- **selectionStatus**：`"candidate"`




##### notes

- `"时间沿用V5估算；详见Validation Report中的潜在时间冲突。"`



#### Day 2 · 2026-10-03

- **day**：`2`
- **date**：`"2026-10-03"`
- **title**：`"岳麓山、五一广场"`
- **summary**：`null`
- **status**：`"confirmed"`
- **startLocationId**：`null`
- **endLocationId**：`null`
##### 时间轴与景点


###### 岳麓山

- **id**：`"d2-mountain"`
- **placeId**：`"yuelu-mountain"`
- **name**：`"岳麓山"`
- **type**：`"attraction"`
- **status**：`"confirmed"`
- **arrivalTime**：`null`
- **departureTime**：`null`
- **durationMinutes**：`null`
- **address**：`null`
- **lat**：`null`
- **lng**：`null`
- **description**：`"10月3日上午已预约爬山；具体入口及山内路线未最终确认。"`
###### practicalInfo

- **openingHours**：`null`
- **ticketInfo**：`null`
- **reservationRequired**：`null`
- **recommendedDuration**：`null`

- **officialUrl**：`null`
- **mapUrl**：`null`
- **guideUrls**：`[]`
- **imageUrls**：`[]`
###### notes

- `"用户已确认上午预约；预约精确时段、入口及登山路线未提供。"`

###### sourceIds

- `"confirmed-history"`

- **timeBasis**：`"已确认行程；未细化的时刻留null"`
- **timeWindow**：`"上午"`
- **nextStopId**：`"d2-wuyi"`
- **nextLegId**：`null`
###### reservation

- **status**：`"confirmed"`
- **date**：`"2026-10-03"`
- **period**：`"上午"`
- **exactTimeWindow**：`null`



###### 五一广场

- **id**：`"d2-wuyi"`
- **placeId**：`"wuyi"`
- **name**：`"五一广场"`
- **type**：`"shopping"`
- **status**：`"confirmed"`
- **arrivalTime**：`null`
- **departureTime**：`null`
- **durationMinutes**：`null`
- **address**：`null`
- **lat**：`null`
- **lng**：`null`
- **description**：`"10月3日安排；具体街区串联与到达时刻未确认。"`
###### practicalInfo

- **openingHours**：`null`
- **ticketInfo**：`null`
- **reservationRequired**：`null`
- **recommendedDuration**：`null`

- **officialUrl**：`null`
- **mapUrl**：`null`
- **guideUrls**：`[]`
- **imageUrls**：`[]`
###### notes

- `"保留当天五一广场安排；不导入未经最终确认的黄兴路、坡子街等串联建议。"`

###### sourceIds

- `"confirmed-history"`

- **timeBasis**：`"已确认行程；未细化的时刻留null"`
- **timeWindow**：`null`
- **nextStopId**：`null`
- **nextLegId**：`null`


- **dining**：`null`
##### notes

- `"仅保留已确认景点及顺序，不从被替换的旧版补时间、餐饮或交通方案。"`



#### Day 3 · 2026-10-04

- **day**：`3`
- **date**：`"2026-10-04"`
- **title**：`null`
- **summary**：`null`
- **status**：`"unknown"`
- **startLocationId**：`null`
- **endLocationId**：`null`
- **stops**：`null`
- **dining**：`null`
##### notes

- `"用户明确先留空；不加入任何旧备选。"`



#### Day 4 · 2026-10-05

- **day**：`4`
- **date**：`"2026-10-05"`
- **title**：`"橘子洲、返程"`
- **summary**：`null`
- **status**：`"confirmed"`
- **startLocationId**：`null`
- **endLocationId**：`"d4-departure"`
##### 时间轴与景点


###### 橘子洲

- **id**：`"d4-orange"`
- **placeId**：`"orange-isle"`
- **name**：`"橘子洲"`
- **type**：`"attraction"`
- **status**：`"confirmed"`
- **arrivalTime**：`null`
- **departureTime**：`null`
- **durationMinutes**：`null`
- **address**：`null`
- **lat**：`null`
- **lng**：`null`
- **description**：`"10月5日上午已预约；具体入园时刻与游览路线未确认。"`
###### practicalInfo

- **openingHours**：`null`
- **ticketInfo**：`null`
- **reservationRequired**：`null`
- **recommendedDuration**：`null`

- **officialUrl**：`null`
- **mapUrl**：`null`
- **guideUrls**：`[]`
- **imageUrls**：`[]`
- **notes**：`[]`
###### sourceIds

- `"confirmed-history"`

- **timeBasis**：`"已确认行程；未细化的时刻留null"`
- **timeWindow**：`"上午"`
- **nextStopId**：`"d4-departure"`
- **nextLegId**：`null`
###### reservation

- **status**：`"confirmed"`
- **date**：`"2026-10-05"`
- **period**：`"上午"`
- **exactTimeWindow**：`null`



###### 长沙南站

- **id**：`"d4-departure"`
- **placeId**：`"south"`
- **name**：`"长沙南站"`
- **type**：`"transport"`
- **status**：`"confirmed"`
- **arrivalTime**：`null`
- **departureTime**：`null`
- **durationMinutes**：`null`
- **address**：`null`
- **lat**：`28.147093`
- **lng**：`113.06551`
- **description**：`"10月5日20:40高铁返程；到站时间尚未确认。"`
###### practicalInfo

- **openingHours**：`null`
- **ticketInfo**：`null`
- **reservationRequired**：`null`
- **recommendedDuration**：`null`

- **officialUrl**：`null`
- **mapUrl**：`null`
- **guideUrls**：`[]`
- **imageUrls**：`[]`
###### notes

- `"高铁20:40发车不是到站时间；建议到站/离店时间未最终确认。"`

###### sourceIds

- `"confirmed-history"`

- **timeBasis**：`"已确认行程；未细化的时刻留null"`
- **timeWindow**：`null`
- **nextStopId**：`null`
- **nextLegId**：`null`
###### coordinateReference

- **lng**：`113.06551`
- **lat**：`28.147093`
- **crs**：`"GCJ02"`
- **precisionNote**：`"沿用V5高德点位，不代表已核实具体出入口"`



- **dining**：`null`
##### notes

- `"保留已确认返程日，不移动到10月4日。"`



### 路线


#### d1-l1

- **id**：`"d1-l1"`
- **day**：`1`
- **fromStopId**：`"d1-arrival"`
- **toStopId**：`"d1-hotel"`
- **mode**：`"metro"`
- **durationMinutes**：`null`
- **distanceKm**：`null`
- **description**：`"长沙火车南站乘地铁4号线往罐子岭方向至茶子山，出站步行到酒店，无需换乘。"`
- **routeUrl**：`null`
- **status**：`"confirmed"`
- **geometry**：`null`
##### sourceIds

- `"v5"`

##### durationRangeMinutes

- **min**：`60`
- **max**：`90`



#### d1-l2

- **id**：`"d1-l2"`
- **day**：`1`
- **fromStopId**：`"d1-hotel"`
- **toStopId**：`"d1-academy"`
- **mode**：`"metro"`
- **durationMinutes**：`null`
- **distanceKm**：`null`
- **description**：`"茶子山乘4号线往杜家坪方向，6站到湖南大学，建议2号口出站，步行至书院入口。"`
- **routeUrl**：`null`
- **status**：`"confirmed"`
- **geometry**：`null`
##### sourceIds

- `"v5"`

##### durationRangeMinutes

- **min**：`35`
- **max**：`50`



#### d1-l3

- **id**：`"d1-l3"`
- **day**：`1`
- **fromStopId**：`"d1-academy"`
- **toStopId**：`"d1-square"`
- **mode**：`"walk"`
- **durationMinutes**：`null`
- **distanceKm**：`null`
- **description**：`"书院入口向东步行至东方红广场。"`
- **routeUrl**：`null`
- **status**：`"confirmed"`
- **geometry**：`null`
##### sourceIds

- `"v5"`



#### d1-l4

- **id**：`"d1-l4"`
- **day**：`1`
- **fromStopId**：`"d1-square"`
- **toStopId**：`"d1-food"`
- **mode**：`"walk"`
- **durationMinutes**：`null`
- **distanceKm**：`null`
- **description**：`"由广场沿麓山南路向南自由逛吃，只标候选地点，不固定连线。"`
- **routeUrl**：`null`
- **status**：`"confirmed"`
- **geometry**：`null`
##### sourceIds

- `"v5"`



#### d1-l5

- **id**：`"d1-l5"`
- **day**：`1`
- **fromStopId**：`"d1-food"`
- **toStopId**：`"d1-return"`
- **mode**：`"metro"`
- **durationMinutes**：`null`
- **distanceKm**：`null`
- **description**：`"自行返回湖南大学站，乘4号线往罐子岭方向，6站到茶子山后步行回酒店。"`
- **routeUrl**：`null`
- **status**：`"confirmed"`
- **geometry**：`null`
##### sourceIds

- `"v5"`



### 返程实用信息

- **date**：`"2026-10-05"`
- **mode**：`"rail"`
- **departureTime**：`"20:40"`
- **departurePlaceId**：`"south"`
- **trainNumber**：`null`
- **destination**：`null`
- **suggestedStationArrivalTime**：`null`
#### sourceIds

- `"confirmed-history"`
- `"family-guide"`

#### notes

- `"采用后续多次确认的20:40；早期记录存在20:00表述，不作为本包时间。"`


### notes

- `"按自然日期保留Day 1–Day 4，10月4日未确认内容为null。"`
- `"仅进行格式转换，未新增搜索或实时核验。"`
- `"stop id标识一次行程停留，placeId标识物理地点；酒店往返和车站抵离复用placeId。"`
- `"durationMinutes仅存单一数字；原有范围保留在durationRangeMinutes，不取中值。"`
- `"坐标系为GCJ02；来源点位不代表已核实具体出入口。"`
- `"图片可发布权限未确认，imageUrls为空；原图来源保留在imageReference，不能直接当成可发布资产。"`
- `"未确认的数组保留null；空imageUrls代表没有已确认可用图片。"`


## 外部参考链接与来源


### v5

- **id**：`"v5"`
- **title**：`"长沙第一天_景点图文版_V5.html"`
- **provider**：`"项目已有资料"`
- **url**：`null`
- **accessedDate**：`null`
#### usedFor

- `"第一天最新保留路线、建议时刻、点位、餐饮候选及链接。"`

- **libraryFileId**：`"libfile_234a54713dc0819197062ce110a2a843"`
- **version**：`6`


### confirmed-history

- **id**：`"confirmed-history"`
- **title**：`"项目中用户确认的行程记录"`
- **provider**：`"项目已有资料"`
- **url**：`null`
- **accessedDate**：`null`
#### usedFor

- `"2026-10-02的确认记录：2日13:00南站、住三晚、3日上午岳麓山及五一广场、4日待定、5日上午橘子洲和20:40返程；酒店后续澄清为希尔顿欢朋。"`



### family-guide

- **id**：`"family-guide"`
- **title**：`"长沙三天三晚亲子旅行攻略_中英双语.pdf"`
- **provider**：`"项目已有资料"`
- **url**：`null`
- **accessedDate**：`null`
#### usedFor

- `"辅助核对10月2日至5日日期范围与返程；未将其全部助手建议自动导入。"`

- **libraryFileId**：`"libfile_322e062deca88191ada3683508563934"`


### previous-export

- **id**：`"previous-export"`
- **title**：`"changsha-trip.json"`
- **provider**：`"本项目已保存数据包"`
- **url**：`null`
- **accessedDate**：`"2026-10-03"`
#### usedFor

- `"本次字段转换与既有行程事实；本次未重新核验原始外部网页"`



## Missing Data


### 1

- **field**：`"trip.subtitle"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 2

- **field**：`"trip.party.adults"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 3

- **field**：`"trip.party.children"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 4

- **field**：`"trip.party.notes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 5

- **field**：`"trip.hotel.checkInTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 6

- **field**：`"trip.hotel.checkOutTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 7

- **field**：`"trip.days[0].stops[0].departureTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 8

- **field**：`"trip.days[0].stops[0].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 9

- **field**：`"trip.days[0].stops[0].address"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 10

- **field**：`"trip.days[0].stops[0].practicalInfo.openingHours"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 11

- **field**：`"trip.days[0].stops[0].practicalInfo.ticketInfo"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 12

- **field**：`"trip.days[0].stops[0].practicalInfo.reservationRequired"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 13

- **field**：`"trip.days[0].stops[0].practicalInfo.recommendedDuration"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 14

- **field**：`"trip.days[0].stops[0].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 15

- **field**：`"trip.days[0].stops[0].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 16

- **field**：`"trip.days[0].stops[0].timeWindow"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 17

- **field**：`"trip.days[0].stops[1].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 18

- **field**：`"trip.days[0].stops[1].practicalInfo.openingHours"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 19

- **field**：`"trip.days[0].stops[1].practicalInfo.ticketInfo"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 20

- **field**：`"trip.days[0].stops[1].practicalInfo.reservationRequired"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 21

- **field**：`"trip.days[0].stops[1].practicalInfo.recommendedDuration"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 22

- **field**：`"trip.days[0].stops[1].timeWindow"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 23

- **field**：`"trip.days[0].stops[2].departureTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 24

- **field**：`"trip.days[0].stops[2].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 25

- **field**：`"trip.days[0].stops[2].address"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 26

- **field**：`"trip.days[0].stops[2].practicalInfo.openingHours"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 27

- **field**：`"trip.days[0].stops[2].practicalInfo.ticketInfo"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 28

- **field**：`"trip.days[0].stops[2].practicalInfo.reservationRequired"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 29

- **field**：`"trip.days[0].stops[2].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 30

- **field**：`"trip.days[0].stops[2].timeWindow"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 31

- **field**：`"trip.days[0].stops[2].reservation.status"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 32

- **field**：`"trip.days[0].stops[2].reservation.exactTimeWindow"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 33

- **field**：`"trip.days[0].stops[2].imageReference.reusePermission"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 34

- **field**：`"trip.days[0].stops[2].imageReference.publishableUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 35

- **field**：`"trip.days[0].stops[3].departureTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 36

- **field**：`"trip.days[0].stops[3].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 37

- **field**：`"trip.days[0].stops[3].address"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 38

- **field**：`"trip.days[0].stops[3].practicalInfo.openingHours"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 39

- **field**：`"trip.days[0].stops[3].practicalInfo.ticketInfo"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 40

- **field**：`"trip.days[0].stops[3].practicalInfo.reservationRequired"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 41

- **field**：`"trip.days[0].stops[3].practicalInfo.recommendedDuration"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 42

- **field**：`"trip.days[0].stops[3].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 43

- **field**：`"trip.days[0].stops[3].timeWindow"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 44

- **field**：`"trip.days[0].stops[3].imageReference.reusePermission"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 45

- **field**：`"trip.days[0].stops[3].imageReference.publishableUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 46

- **field**：`"trip.days[0].stops[4].departureTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 47

- **field**：`"trip.days[0].stops[4].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 48

- **field**：`"trip.days[0].stops[4].lat"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 49

- **field**：`"trip.days[0].stops[4].lng"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 50

- **field**：`"trip.days[0].stops[4].practicalInfo.openingHours"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 51

- **field**：`"trip.days[0].stops[4].practicalInfo.ticketInfo"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 52

- **field**：`"trip.days[0].stops[4].practicalInfo.reservationRequired"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 53

- **field**：`"trip.days[0].stops[4].practicalInfo.recommendedDuration"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 54

- **field**：`"trip.days[0].stops[4].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 55

- **field**：`"trip.days[0].stops[4].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 56

- **field**：`"trip.days[0].stops[5].arrivalTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 57

- **field**：`"trip.days[0].stops[5].departureTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 58

- **field**：`"trip.days[0].stops[5].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 59

- **field**：`"trip.days[0].stops[5].practicalInfo.openingHours"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 60

- **field**：`"trip.days[0].stops[5].practicalInfo.ticketInfo"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 61

- **field**：`"trip.days[0].stops[5].practicalInfo.reservationRequired"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 62

- **field**：`"trip.days[0].stops[5].practicalInfo.recommendedDuration"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 63

- **field**：`"trip.days[0].stops[5].timeWindow"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 64

- **field**：`"trip.days[0].stops[5].nextStopId"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 65

- **field**：`"trip.days[0].stops[5].nextLegId"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 66

- **field**：`"trip.days[0].dining[0].meal"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 67

- **field**：`"trip.days[0].dining[0].recommendedTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 68

- **field**：`"trip.days[0].dining[0].restaurants[0].lat"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 69

- **field**：`"trip.days[0].dining[0].restaurants[0].lng"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 70

- **field**：`"trip.days[0].dining[0].restaurants[0].rating"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 71

- **field**：`"trip.days[0].dining[0].restaurants[0].priceLevel"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 72

- **field**：`"trip.days[0].dining[0].restaurants[0].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 73

- **field**：`"trip.days[0].dining[0].restaurants[0].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 74

- **field**：`"trip.days[0].dining[0].restaurants[0].distance"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 75

- **field**：`"trip.days[0].dining[0].restaurants[0].businessStatus"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 76

- **field**：`"trip.days[0].dining[0].restaurants[1].lat"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 77

- **field**：`"trip.days[0].dining[0].restaurants[1].lng"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 78

- **field**：`"trip.days[0].dining[0].restaurants[1].rating"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 79

- **field**：`"trip.days[0].dining[0].restaurants[1].priceLevel"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 80

- **field**：`"trip.days[0].dining[0].restaurants[1].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 81

- **field**：`"trip.days[0].dining[0].restaurants[1].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 82

- **field**：`"trip.days[0].dining[0].restaurants[1].distance"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 83

- **field**：`"trip.days[0].dining[0].restaurants[1].businessStatus"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 84

- **field**：`"trip.days[0].dining[0].restaurants[2].lat"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 85

- **field**：`"trip.days[0].dining[0].restaurants[2].lng"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 86

- **field**：`"trip.days[0].dining[0].restaurants[2].rating"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 87

- **field**：`"trip.days[0].dining[0].restaurants[2].priceLevel"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 88

- **field**：`"trip.days[0].dining[0].restaurants[2].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 89

- **field**：`"trip.days[0].dining[0].restaurants[2].reviewUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 90

- **field**：`"trip.days[0].dining[0].restaurants[2].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 91

- **field**：`"trip.days[0].dining[0].restaurants[2].distance"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 92

- **field**：`"trip.days[0].dining[0].restaurants[2].businessStatus"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 93

- **field**：`"trip.days[0].dining[0].restaurants[3].address"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 94

- **field**：`"trip.days[0].dining[0].restaurants[3].lat"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 95

- **field**：`"trip.days[0].dining[0].restaurants[3].lng"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 96

- **field**：`"trip.days[0].dining[0].restaurants[3].rating"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 97

- **field**：`"trip.days[0].dining[0].restaurants[3].priceLevel"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 98

- **field**：`"trip.days[0].dining[0].restaurants[3].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 99

- **field**：`"trip.days[0].dining[0].restaurants[3].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 100

- **field**：`"trip.days[0].dining[0].restaurants[3].distance"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 101

- **field**：`"trip.days[0].dining[0].restaurants[3].businessStatus"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 102

- **field**：`"trip.days[0].dining[1].meal"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 103

- **field**：`"trip.days[0].dining[1].recommendedTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 104

- **field**：`"trip.days[0].dining[1].restaurants[0].address"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 105

- **field**：`"trip.days[0].dining[1].restaurants[0].lat"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 106

- **field**：`"trip.days[0].dining[1].restaurants[0].lng"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 107

- **field**：`"trip.days[0].dining[1].restaurants[0].rating"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 108

- **field**：`"trip.days[0].dining[1].restaurants[0].priceLevel"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 109

- **field**：`"trip.days[0].dining[1].restaurants[0].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 110

- **field**：`"trip.days[0].dining[1].restaurants[0].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 111

- **field**：`"trip.days[0].dining[1].restaurants[0].distance"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 112

- **field**：`"trip.days[0].dining[1].restaurants[0].businessStatus"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 113

- **field**：`"trip.days[0].dining[1].restaurants[1].lat"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 114

- **field**：`"trip.days[0].dining[1].restaurants[1].lng"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 115

- **field**：`"trip.days[0].dining[1].restaurants[1].rating"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 116

- **field**：`"trip.days[0].dining[1].restaurants[1].priceLevel"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 117

- **field**：`"trip.days[0].dining[1].restaurants[1].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 118

- **field**：`"trip.days[0].dining[1].restaurants[1].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 119

- **field**：`"trip.days[0].dining[1].restaurants[1].businessStatus"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 120

- **field**：`"trip.days[0].dining[1].restaurants[2].address"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 121

- **field**：`"trip.days[0].dining[1].restaurants[2].lat"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 122

- **field**：`"trip.days[0].dining[1].restaurants[2].lng"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 123

- **field**：`"trip.days[0].dining[1].restaurants[2].rating"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 124

- **field**：`"trip.days[0].dining[1].restaurants[2].priceLevel"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 125

- **field**：`"trip.days[0].dining[1].restaurants[2].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 126

- **field**：`"trip.days[0].dining[1].restaurants[2].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 127

- **field**：`"trip.days[0].dining[1].restaurants[2].distance"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 128

- **field**：`"trip.days[0].dining[1].restaurants[2].businessStatus"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 129

- **field**：`"trip.days[0].dining[1].restaurants[3].address"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 130

- **field**：`"trip.days[0].dining[1].restaurants[3].lat"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 131

- **field**：`"trip.days[0].dining[1].restaurants[3].lng"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 132

- **field**：`"trip.days[0].dining[1].restaurants[3].rating"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 133

- **field**：`"trip.days[0].dining[1].restaurants[3].priceLevel"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 134

- **field**：`"trip.days[0].dining[1].restaurants[3].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 135

- **field**：`"trip.days[0].dining[1].restaurants[3].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 136

- **field**：`"trip.days[0].dining[1].restaurants[3].distance"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 137

- **field**：`"trip.days[0].dining[1].restaurants[3].businessStatus"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 138

- **field**：`"trip.days[0].dining[2].meal"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 139

- **field**：`"trip.days[0].dining[2].recommendedTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 140

- **field**：`"trip.days[0].dining[2].restaurants[0].rating"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 141

- **field**：`"trip.days[0].dining[2].restaurants[0].priceLevel"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 142

- **field**：`"trip.days[0].dining[2].restaurants[0].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 143

- **field**：`"trip.days[0].dining[2].restaurants[0].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 144

- **field**：`"trip.days[0].dining[2].restaurants[0].businessStatus"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 145

- **field**：`"trip.days[0].dining[2].restaurants[1].rating"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 146

- **field**：`"trip.days[0].dining[2].restaurants[1].priceLevel"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 147

- **field**：`"trip.days[0].dining[2].restaurants[1].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 148

- **field**：`"trip.days[0].dining[2].restaurants[1].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 149

- **field**：`"trip.days[0].dining[2].restaurants[1].businessStatus"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 150

- **field**：`"trip.days[0].dining[2].restaurants[2].rating"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 151

- **field**：`"trip.days[0].dining[2].restaurants[2].priceLevel"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 152

- **field**：`"trip.days[0].dining[2].restaurants[2].reviewUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 153

- **field**：`"trip.days[0].dining[2].restaurants[2].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 154

- **field**：`"trip.days[0].dining[2].restaurants[2].businessStatus"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 155

- **field**：`"trip.days[0].dining[2].restaurants[3].rating"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 156

- **field**：`"trip.days[0].dining[2].restaurants[3].priceLevel"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 157

- **field**：`"trip.days[0].dining[2].restaurants[3].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 158

- **field**：`"trip.days[0].dining[2].restaurants[3].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 159

- **field**：`"trip.days[0].dining[2].restaurants[3].businessStatus"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 160

- **field**：`"trip.days[1].summary"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 161

- **field**：`"trip.days[1].startLocationId"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 162

- **field**：`"trip.days[1].endLocationId"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 163

- **field**：`"trip.days[1].stops[0].arrivalTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 164

- **field**：`"trip.days[1].stops[0].departureTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 165

- **field**：`"trip.days[1].stops[0].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 166

- **field**：`"trip.days[1].stops[0].address"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 167

- **field**：`"trip.days[1].stops[0].lat"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 168

- **field**：`"trip.days[1].stops[0].lng"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 169

- **field**：`"trip.days[1].stops[0].practicalInfo.openingHours"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 170

- **field**：`"trip.days[1].stops[0].practicalInfo.ticketInfo"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 171

- **field**：`"trip.days[1].stops[0].practicalInfo.reservationRequired"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 172

- **field**：`"trip.days[1].stops[0].practicalInfo.recommendedDuration"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 173

- **field**：`"trip.days[1].stops[0].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 174

- **field**：`"trip.days[1].stops[0].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 175

- **field**：`"trip.days[1].stops[0].nextLegId"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 176

- **field**：`"trip.days[1].stops[0].reservation.exactTimeWindow"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 177

- **field**：`"trip.days[1].stops[1].arrivalTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 178

- **field**：`"trip.days[1].stops[1].departureTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 179

- **field**：`"trip.days[1].stops[1].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 180

- **field**：`"trip.days[1].stops[1].address"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 181

- **field**：`"trip.days[1].stops[1].lat"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 182

- **field**：`"trip.days[1].stops[1].lng"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 183

- **field**：`"trip.days[1].stops[1].practicalInfo.openingHours"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 184

- **field**：`"trip.days[1].stops[1].practicalInfo.ticketInfo"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 185

- **field**：`"trip.days[1].stops[1].practicalInfo.reservationRequired"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 186

- **field**：`"trip.days[1].stops[1].practicalInfo.recommendedDuration"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 187

- **field**：`"trip.days[1].stops[1].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 188

- **field**：`"trip.days[1].stops[1].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 189

- **field**：`"trip.days[1].stops[1].timeWindow"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 190

- **field**：`"trip.days[1].stops[1].nextStopId"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 191

- **field**：`"trip.days[1].stops[1].nextLegId"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 192

- **field**：`"trip.days[1].dining"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 193

- **field**：`"trip.days[2].title"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 194

- **field**：`"trip.days[2].summary"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 195

- **field**：`"trip.days[2].startLocationId"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 196

- **field**：`"trip.days[2].endLocationId"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 197

- **field**：`"trip.days[2].stops"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 198

- **field**：`"trip.days[2].dining"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 199

- **field**：`"trip.days[3].summary"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 200

- **field**：`"trip.days[3].startLocationId"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 201

- **field**：`"trip.days[3].stops[0].arrivalTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 202

- **field**：`"trip.days[3].stops[0].departureTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 203

- **field**：`"trip.days[3].stops[0].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 204

- **field**：`"trip.days[3].stops[0].address"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 205

- **field**：`"trip.days[3].stops[0].lat"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 206

- **field**：`"trip.days[3].stops[0].lng"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 207

- **field**：`"trip.days[3].stops[0].practicalInfo.openingHours"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 208

- **field**：`"trip.days[3].stops[0].practicalInfo.ticketInfo"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 209

- **field**：`"trip.days[3].stops[0].practicalInfo.reservationRequired"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 210

- **field**：`"trip.days[3].stops[0].practicalInfo.recommendedDuration"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 211

- **field**：`"trip.days[3].stops[0].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 212

- **field**：`"trip.days[3].stops[0].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 213

- **field**：`"trip.days[3].stops[0].nextLegId"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 214

- **field**：`"trip.days[3].stops[0].reservation.exactTimeWindow"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 215

- **field**：`"trip.days[3].stops[1].arrivalTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 216

- **field**：`"trip.days[3].stops[1].departureTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 217

- **field**：`"trip.days[3].stops[1].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 218

- **field**：`"trip.days[3].stops[1].address"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 219

- **field**：`"trip.days[3].stops[1].practicalInfo.openingHours"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 220

- **field**：`"trip.days[3].stops[1].practicalInfo.ticketInfo"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 221

- **field**：`"trip.days[3].stops[1].practicalInfo.reservationRequired"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 222

- **field**：`"trip.days[3].stops[1].practicalInfo.recommendedDuration"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 223

- **field**：`"trip.days[3].stops[1].officialUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 224

- **field**：`"trip.days[3].stops[1].mapUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 225

- **field**：`"trip.days[3].stops[1].timeWindow"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 226

- **field**：`"trip.days[3].stops[1].nextStopId"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 227

- **field**：`"trip.days[3].stops[1].nextLegId"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"high"`


### 228

- **field**：`"trip.days[3].dining"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 229

- **field**：`"trip.routeLegs[0].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 230

- **field**：`"trip.routeLegs[0].distanceKm"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 231

- **field**：`"trip.routeLegs[0].routeUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 232

- **field**：`"trip.routeLegs[0].geometry"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 233

- **field**：`"trip.routeLegs[1].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 234

- **field**：`"trip.routeLegs[1].distanceKm"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 235

- **field**：`"trip.routeLegs[1].routeUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 236

- **field**：`"trip.routeLegs[1].geometry"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 237

- **field**：`"trip.routeLegs[2].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 238

- **field**：`"trip.routeLegs[2].distanceKm"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 239

- **field**：`"trip.routeLegs[2].routeUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 240

- **field**：`"trip.routeLegs[2].geometry"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 241

- **field**：`"trip.routeLegs[3].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 242

- **field**：`"trip.routeLegs[3].distanceKm"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 243

- **field**：`"trip.routeLegs[3].routeUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 244

- **field**：`"trip.routeLegs[3].geometry"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 245

- **field**：`"trip.routeLegs[4].durationMinutes"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 246

- **field**：`"trip.routeLegs[4].distanceKm"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 247

- **field**：`"trip.routeLegs[4].routeUrl"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 248

- **field**：`"trip.routeLegs[4].geometry"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 249

- **field**：`"trip.returnTransport.trainNumber"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 250

- **field**：`"trip.returnTransport.destination"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 251

- **field**：`"trip.returnTransport.suggestedStationArrivalTime"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 252

- **field**：`"sources[0].url"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 253

- **field**：`"sources[0].accessedDate"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 254

- **field**：`"sources[1].url"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 255

- **field**：`"sources[1].accessedDate"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 256

- **field**：`"sources[2].url"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 257

- **field**：`"sources[2].accessedDate"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 258

- **field**：`"sources[3].url"`
- **reason**：`"既有确认资料未提供，或未形成已确认的单值；不补造。"`
- **priority**：`"medium"`


### 259

- **field**：`"trip.days[0].stops[0].guideUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 260

- **field**：`"trip.days[0].stops[0].imageUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 261

- **field**：`"trip.days[0].stops[1].imageUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 262

- **field**：`"trip.days[0].stops[2].imageUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 263

- **field**：`"trip.days[0].stops[3].imageUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 264

- **field**：`"trip.days[0].stops[4].guideUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 265

- **field**：`"trip.days[0].stops[4].imageUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 266

- **field**：`"trip.days[0].stops[5].imageUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 267

- **field**：`"trip.days[1].stops[0].guideUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 268

- **field**：`"trip.days[1].stops[0].imageUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 269

- **field**：`"trip.days[1].stops[1].guideUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 270

- **field**：`"trip.days[1].stops[1].imageUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 271

- **field**：`"trip.days[3].stops[0].guideUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 272

- **field**：`"trip.days[3].stops[0].imageUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 273

- **field**：`"trip.days[3].stops[1].guideUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


### 274

- **field**：`"trip.days[3].stops[1].imageUrls"`
- **reason**：`"无已确认可用的链接或图片；保留空数组。"`
- **priority**：`"low"`


## Validation Report

- **jsonValid**：`true`
- **duplicateStopIds**：`[]`
### timeConflicts

- `"13:00抵达南站，交通估算60–90分钟；14:00到酒店只覆盖最短估算，最长估算为14:30。"`
- `"15:20离开酒店加35–50分钟，到书院范围15:55–16:10；16:00是约数，未覆盖最长估算。"`
- `"16:00书院停留60–90分钟，结束为17:00–17:30；若停留90分钟，与17:15到广场相冲突，且步行耗时未确认。"`
- `"以上为原V5建议时间的条件性冲突，本次未擅自改时间。"`
- `"Day 2、Day 3和Day 4数据不足，不能判定全程无时间冲突。"`

- **routeConflicts**：`[]`
### missingCoordinates

- `"d1-food"`
- `"d2-mountain"`
- `"d2-wuyi"`
- `"d4-orange"`

- **unresolvedUrls**：`[]`
### notes

- `"Day 1顺序一致，路段起终点引用与Stop顺序相符。"`
- `"Day 2保留岳麓山在五一广场之前；实际衔接路线未确认。"`
- `"Day 3为空；Day 4保留上午橘子洲在晚间返程之前，具体交通未确认。"`
- `"未以真实路网验证所有路段，因此不宣称全程无路线风险。"`
- `"外部URL沿用来源，未进行网络有效性检查。"`
- `"尚未执行TravelTemplateV1实际导入或生产构建。"`

### confirmedContent

- `"日期2026-10-02至2026-10-05；长沙；酒店三晚。"`
- `"10月2日13:00长沙南站抵达；第一天按最新V5先酒店、书院、湖大，再麓山南路自由逛吃。"`
- `"10月3日上午岳麓山预约及当天五一广场；10月4日留空。"`
- `"10月5日上午橘子洲预约，20:40高铁返程。"`
- `"V5的12家餐饮仅作为候选保留，不等于确认就餐或营业。"`

### manualConfirmationRequired

- `"岳麓书院预约是否成功以及预约时段。"`
- `"Day 1酒店14:00到达是否有足够时间余量；是否调整16:00书院与17:15广场的衔接。"`
- `"Day 2登山入口、精确预约时段、游览路线、五一广场到达时刻和中间安排。"`
- `"Day 3保持留白，只有用户确认后再补充。"`
- `"Day 4精确预约时段、酒店取行李安排、到站时间与高铁车次。"`
- `"门店营业与图片复用授权，未知POI字段参见missingData。"`

- **timeValidationComplete**：`false`
- **routeValidationComplete**：`false`
### duplicatePOIs

- **hasDuplicatePlaceIds**：`false`
- **hasDuplicatePlaceNames**：`false`
#### intentionalRepeatedReferences


##### 1

- **placeId**：`"hotel"`
###### stopIds

- `"d1-hotel"`
- `"d1-return"`

- **reason**：`"入住与当晚返回同一家酒店。"`


##### 2

- **placeId**：`"south"`
###### stopIds

- `"d1-arrival"`
- `"d4-departure"`

- **reason**：`"抵达与返程使用同一车站。"`


#### notes

- `"相同placeId表示同一物理地点，不重复生成POI标记；不同stop id保留独立停留时间。"`


- **markdownFactsMatchJson**：`true`

