### 5.1.5.1. 清单

| 分类 | 接口编号 | 接口名称 | 接口用途 |
|------|----------|----------|----------|
| 仪表盘 | PT1.XT05.01--XS-JK01 | 仪表盘统计告警总数，国际下载总数， 国内下载次数，国内用户数的接口 | 统计仪表盘核心指标数据，包括告警总数、国际下载量、国内下载次数及用户数量，为态势感知提供数据支撑 |
| 仪表盘 | PT1.XT05.01--XS-JK02 | 国际下载分布 | 按国家和地区维度统计国际下载流量分布，分析国际网络访问热点区域和访问模式 |
| 仪表盘 | PT1.XT05.01--XS-JK03 | 国内下载分布 | 按地域维度统计国内下载流量分布，分析各省份、城市的网络使用活跃度和服务覆盖情况 |
| 仪表盘 | PT1.XT05.01--XS-JK04 | 下载点分布（国内下载点对比） | 对比分析国内各下载节点的性能指标和负载情况，评估网络资源分布和服务质量 |
| 仪表盘 | PT1.XT05.01--XS-JK05 | 国内下载分布（国内下载源总体统计） | 从宏观层面统计国内下载源的整体分布特征，分析网络资源使用模式和负载分布情况 |
| 告警管理 | PT1.XT05.01--XS-JK06 | 告警列表接口 | 提供告警信息的分页查询服务，支持按时间、类型、严重程度等条件筛选，便于快速定位和处理告警 |
| 告警管理 | PT1.XT05.01--XS-JK07 | 告警详情接口 | 获取告警详细信息，包括告警内容、发生时间、影响范围、处理状态、相关日志等，为应急处置提供依据 |
| 告警管理 | PT1.XT05.01--XS-JK08 | 告警详情桑吉图 | 生成告警事件的桑基图可视化数据，展示告警之间的关联关系和影响路径，帮助分析复杂安全事件 |
| 网络监测 | PT1.XT05.01--XS-JK09 | 路由数据查询接口 | 提供网络路由信息的查询服务，包括AS路径、路由策略、拓扑结构等数据，用于连通性分析和故障排查 |
| 网络监测 | PT1.XT05.01--XS-JK10 | 服务数据查询接口 | 查询各类服务的运行状态、性能指标和可用性数据，包括响应时间、错误率、负载情况等，用于服务质量监控 |
| 网络监测 | PT1.XT05.01--XS-JK11 | 检测数据查询接口 | 提供网络安全检测结果的查询服务，包括漏洞扫描、入侵检测、异常行为等检测数据，用于安全态势分析 |
| 网络监测 | PT1.XT05.01--XS-JK12 | AS概览查询ipV4、ipV6接口 | 查询AS节点关联的IPv4和IPv6地址前缀信息，了解网络地址分配情况和IP版本使用趋势 |
| 网络监测 | PT1.XT05.01--XS-JK13 | AS概览查询邻居关系接口 | 获取AS节点的邻居关系信息，包括上下游连接关系、BGP会话状态等，用于网络拓扑分析和路径优化 |
| 网络监测 | PT1.XT05.01--XS-JK14 | AS概览查询流量接口 | 查询AS节点的流量统计信息，包括入流量、出流量、流量峰值等，用于网络性能监控和容量规划 |
| 网络监测 | PT1.XT05.01--XS-JK15 | AS概览查询基本信息接口 | 查询AS自治系统的基本信息，包括AS号、所属组织、国家地区、联系信息等，为网络管理提供基础数据 |
| 应急管理 | PT1.XT05.01--XS-JK16 | 断网监控处置演练基本节点接口 | 获取处置演练所有节点信息的接口 |
| 应急管理 | PT1.XT05.01--XS-JK17 | 应急处理接口 | 对模拟的应急事件进行处理的接口 |
| 配置管理 | PT1.XT05.01--XS-JK18 | 获取探针信息接口 | 获取网络探针设备的运行状态、位置信息、配置参数和监测数据，用于网络质量监控和性能评估 |
5.1.5.2. 接口说明（详细参数表与示例）

说明：下面为清单中 18 个接口的详细说明。表格列出请求参数和响应参数（字段、是否必有、类型、说明）。每个接口随后给出一个“真实风格”的请求示例与响应示例（JSON），用于前端开发与联调参考。

通用返回说明（示例规范）
| 字段 | 类型 | 说明 |
|------|------|------|
| code | Int | 状态码，100 表示成功，其他为错误 |
| msg | String | 描述信息 |
| data | Object/Array/Null | 返回数据主体 |

---

5.1.5.2.1 仪表盘 - 仪表盘统计核心指标（PT1.XT05.01--XS-JK01）
- 服务地址（示例）：GET /api/dashboard/summary
- 请求方式：GET

请求参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| startDate | 否 | String | 起始日期，格式 YYYY-MM-DD |
| endDate | 否 | String | 结束日期，格式 YYYY-MM-DD |
| granularity | 否 | String | 聚合粒度：day|week|month，默认 month |

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| msg | 是 | String | 描述 |
| data | 是 | Object | 指标对象 |
| data.alertTotal | 是 | Int | 告警总数 |
| data.internationalDownloads | 是 | Int | 国际下载总数 |
| data.domesticDownloads | 是 | Int | 国内下载次数 |
| data.domesticUsers | 是 | Int | 国内活跃用户数 |

请求示例（GET）:
GET /api/dashboard/summary?startDate=2025-09-01&endDate=2025-09-30

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": {
		"alertTotal": 254,
		"internationalDownloads": 123456,
		"domesticDownloads": 987654,
		"domesticUsers": 45213
	}
}

---

5.1.5.2.2 仪表盘 - 国际下载分布（PT1.XT05.01--XS-JK02）
- 服务地址（示例）：GET /api/dashboard/international-downloads
- 请求方式：GET

说明：本接口返回用于绘制国内下载点与国际下载源连线关系图的数据，返回结构为一个包含三个数组的对象：国内下载点数组（domesticNodes）、国际下载源数组（internationalSources）和连接线数组（links）。

请求参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| startDate | 否 | String | 起始日期 |
| endDate | 否 | String | 结束日期 |
| level | 否 | String | 地理聚合级别，默认 province |

响应参数（结构说明）：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| msg | 是 | String | 描述 |
| data.domesticNodes | 是 | Array | 国内下载点数组，[{ id, name, province, city, lat, lon, downloads }] |
| data.internationalSources | 是 | Array | 国际下载源数组，[{ id, country, name, lat, lon, downloads }] |
| data.links | 是 | Array | 连接线数组，表示国内点与国际源间的数据流动，[{ sourceId, targetId, bytes, connections }] |

请求示例：GET /api/dashboard/international-downloads?startDate=2025-09-01&endDate=2025-09-30

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": {
		"domesticNodes": [
			{ "id": "dn-001", "name": "Download-Node-GZ", "province": "Guangdong", "city": "Guangzhou", "lat": 23.1291, "lon": 113.2644, "downloads": 123456 },
			{ "id": "dn-002", "name": "Download-Node-BJ", "province": "Beijing", "city": "Beijing", "lat": 39.9042, "lon": 116.4074, "downloads": 98765 }
		],
		"internationalSources": [
			{ "id": "is-001", "country": "United States", "name": "US-CDN-1", "lat": 37.7749, "lon": -122.4194, "downloads": 45231 },
			{ "id": "is-002", "country": "Japan", "name": "JP-CDN-1", "lat": 35.6895, "lon": 139.6917, "downloads": 30210 }
		],
		"links": [
			{ "sourceId": "dn-001", "targetId": "is-001", "bytes": 12345678, "connections": 2345 },
			{ "sourceId": "dn-002", "targetId": "is-002", "bytes": 9876543, "connections": 1234 }
		]
	}
}

---

5.1.5.2.3 仪表盘 - 国内下载分布（PT1.XT05.01--XS-JK03）
- 服务地址（示例）：GET /api/dashboard/domestic-downloads
- 请求方式：GET

说明：本接口聚合并返回各省（或城市，当 level=city 时）的网络指标数组，用于在地图或表格中展示各区域的网络使用情况。默认按省级返回一个数组。

请求参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| startDate | 否 | String | 起始日期，格式 YYYY-MM-DD |
| endDate | 否 | String | 结束日期 |
| level | 否 | String | 聚合级别：province|city，默认 province |

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| msg | 是 | String | 描述 |
| data | 是 | Array | 省级数组，[{ province, downloads, activeUsers, avgSpeedMbps, errorRate, lat, lon }] |

请求示例：GET /api/dashboard/domestic-downloads?startDate=2025-09-01&endDate=2025-09-30&level=province

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": [
		{ "province": "Guangdong", "downloads": 345678, "activeUsers": 12345, "avgSpeedMbps": 85.6, "errorRate": 0.002, "lat": 23.3790, "lon": 113.7633 },
		{ "province": "Beijing", "downloads": 198765, "activeUsers": 9876, "avgSpeedMbps": 78.2, "errorRate": 0.003, "lat": 39.9042, "lon": 116.4074 }
	]
}

---

5.1.5.2.4 仪表盘 - 下载点分布（国内下载点对比）（PT1.XT05.01--XS-JK04）
- 服务地址（示例）：GET /api/dashboard/node-comparison
- 请求方式：GET

请求参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| nodeIds | 否 | String | 逗号分隔的节点 ID 列表 |
| startDate | 否 | String | 起始日期 |
| endDate | 否 | String | 结束日期 |

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| data | 是 | Array | [{ nodeId, bandwidth, concurrency, errorRate }]

请求示例：GET /api/dashboard/node-comparison?nodeIds=nd-001,nd-002&startDate=2025-09-01&endDate=2025-09-30

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": [
		{ "nodeId": "nd-001", "bandwidth": 1200000, "concurrency": 230, "errorRate": 0.002 },
		{ "nodeId": "nd-002", "bandwidth": 980000, "concurrency": 180, "errorRate": 0.005 }
	]
}

---

5.1.5.2.5 仪表盘 - 国内下载源总体统计（PT1.XT05.01--XS-JK05）
 服务地址（示例）：GET /api/dashboard/domestic-sources
 请求方式：GET

 说明：本接口返回国内所有下载源（或按条件筛选后的下载源）数组，用于展示各下载源的指标与排名。返回 data 为数组，每个元素代表一个下载源的统计信息。

 请求参数：
 | 字段 | 必有 | 类型 | 说明 |
 |------|------|------|------|
 | startDate | 否 | String | 起始日期，格式 YYYY-MM-DD |
 | endDate | 否 | String | 结束日期 |
 | page | 否 | Int | 页码，省略时返回所有或前 N 项 |
 | pageSize | 否 | Int | 每页条数 |
 | sortBy | 否 | String | 排序字段，如 downloads | 

 响应参数：
 | 字段 | 必有 | 类型 | 说明 |
 |------|------|------|------|
 | code | 是 | Int | 状态码 |
 | msg | 是 | String | 描述 |
 | data | 是 | Array | 下载源数组，[{ sourceId, name, province, city, downloads, activeUsers, avgSpeedMbps, errorRate, rank }] |

 请求示例：GET /api/dashboard/domestic-sources?startDate=2025-09-01&endDate=2025-09-30&page=1&pageSize=20&sortBy=downloads

 响应示例：
 {
	 "code": 100,
	 "msg": "success",
	 "data": [
		 { "sourceId": "s-001", "name": "cdn-a", "province": "Guangdong", "city": "Guangzhou", "downloads": 345678, "activeUsers": 23456, "avgSpeedMbps": 92.5, "errorRate": 0.001, "rank": 1 },
		 { "sourceId": "s-002", "name": "cdn-b", "province": "Beijing", "city": "Beijing", "downloads": 289123, "activeUsers": 19876, "avgSpeedMbps": 88.1, "errorRate": 0.002, "rank": 2 }
	 ]
 }
| data | 是 | Object | 总体统计数据 |

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": {
		"totalSources": 124,
		"totalDownloads": 1234567,
		"topSources": [ { "source": "cdn-a", "downloads": 345678 } ]
	}
}

---

5.1.5.2.6 告警管理 - 告警列表接口（PT1.XT05.01--XS-JK06）
- 服务地址（示例）：POST /api/alerts/list
- 请求方式：POST

请求参数（JSON body）：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| page | 否 | Int | 页码，默认 1 |
| pageSize | 否 | Int | 每页条数，默认 20 |
| startTime | 否 | String | 起始时间，ISO 格式 |
| endTime | 否 | String | 结束时间 |
| level | 否 | String | 严重程度，如 HIGH/MEDIUM/LOW |
| type | 否 | String | 告警类型 |

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| total | 是 | Int | 总条数 |
| data | 是 | Array | 告警列表 [{ id, title, level, occurTime, status }] |

请求示例：
POST /api/alerts/list
{
	"page": 1,
	"pageSize": 10,
	"startTime": "2025-09-01T00:00:00Z",
	"endTime": "2025-09-30T23:59:59Z",
	"level": "HIGH"
}

响应示例：
{
	"code": 100,
	"msg": "success",
	"total": 2,
	"data": [
		{ "id": "a-1001", "title": "BGP Hijack Detected", "level": "HIGH", "occurTime": "2025-09-12T10:12:00Z", "status": "open" },
		{ "id": "a-1002", "title": "Unexpected Traffic Spike", "level": "MEDIUM", "occurTime": "2025-09-20T04:30:00Z", "status": "resolved" }
	]
}

---

5.1.5.2.7 告警管理 - 告警详情接口（PT1.XT05.01--XS-JK07）
- 服务地址（示例）：GET /api/alerts/{alertId}
- 请求方式：GET

请求参数（path）：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| alertId | 是 | String | 告警 ID |

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| data | 是 | Object | 告警详情 |
| data.id | 是 | String | 告警 ID |
| data.title | 是 | String | 标题 |
| data.content | 否 | String | 详细内容 |
| data.occurTime | 是 | String | 发生时间 |
| data.impact | 否 | String | 影响范围 |
| data.logs | 否 | Array | 相关日志 |
| data.status | 是 | String | 处理状态 |

请求示例：GET /api/alerts/a-1001

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": {
		"id": "a-1001",
		"title": "BGP Hijack Detected",
		"content": "Prefix 203.0.113.0/24 hijacked by AS 65001",
		"occurTime": "2025-09-12T10:12:00Z",
		"impact": "several prefixes announced by unknown AS",
		"logs": ["bgp-update-2025-09-12.log"],
		"status": "open"
	}
}

---

5.1.5.2.8 告警管理 - 告警事件桑基图（PT1.XT05.01--XS-JK08）
- 服务地址（示例）：GET /api/alerts/{alertId}/sankey
- 请求方式：GET

请求参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| alertId | 是 | String | 告警 ID |

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| data.nodes | 是 | Array | 桑基图节点 [{ id, name }] |
| data.links | 是 | Array | 桑基图连线 [{ source, target, value }] |

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": {
		"nodes": [ { "id": "n1", "name": "Origin AS 65000" }, { "id": "n2", "name": "Hijacker AS 65001" } ],
		"links": [ { "source": "n1", "target": "n2", "value": 120 } ]
	}
}

---

5.1.5.2.9 网络监测 - 路由数据查询接口（PT1.XT05.01--XS-JK09）
- 服务地址（示例）：GET /api/network/routes
- 请求方式：GET

请求参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| prefix | 否 | String | 路由前缀，例如 203.0.113.0/24 |
| asn | 否 | Int | AS 编号 |
| startTime | 否 | String | 起始时间 |
| endTime | 否 | String | 结束时间 |
| page | 否 | Int | 页码 |
| pageSize | 否 | Int | 每页条数 |

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| total | 否 | Int | 总条数 |
| data | 是 | Array | [{ prefix, asPath, origin, nextHop, lastSeen }]

请求示例：GET /api/network/routes?prefix=203.0.113.0/24

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": [
		{ "prefix": "203.0.113.0/24", "asPath": [65000,65002], "origin": 65002, "nextHop": "198.51.100.1", "lastSeen": "2025-09-12T10:12:00Z" }
	]
}

---

5.1.5.2.10 网络监测 - 服务数据查询接口（PT1.XT05.01--XS-JK10）
- 服务地址（示例）：GET /api/network/services
- 请求方式：GET

请求参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| serviceName | 否 | String | 服务名称或模糊匹配 |
| startTime | 否 | String | 起始时间 |
| endTime | 否 | String | 结束时间 |

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| data | 是 | Array | [{ serviceName, status, avgResponseTimeMs, errorRate }]

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": [ { "serviceName": "auth", "status": "healthy", "avgResponseTimeMs": 120, "errorRate": 0.001 } ]
}

---

5.1.5.2.11 网络监测 - 检测数据查询接口（PT1.XT05.01--XS-JK11）
- 服务地址（示例）：POST /api/network/detections/query
- 请求方式：POST

请求参数（body）：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| filters | 否 | Object | 过滤条件，例如 { type: "port-scan" } |
| startTime | 否 | String | 起始时间 |
| endTime | 否 | String | 结束时间 |
| page | 否 | Int | 页码 |
| pageSize | 否 | Int | 每页条数 |

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| total | 否 | Int | 总条数 |
| data | 是 | Array | [{ id, type, result, time, details }]

请求示例：
POST /api/network/detections/query
{
	"filters": { "type": "port-scan" },
	"startTime": "2025-09-01T00:00:00Z",
	"endTime": "2025-09-30T23:59:59Z",
	"page": 1,
	"pageSize": 20
}

响应示例：
{
	"code": 100,
	"msg": "success",
	"total": 1,
	"data": [ { "id": "d-5001", "type": "port-scan", "result": "blocked", "time": "2025-09-11T02:12:00Z", "details": "scan on ports 22,23,80" } ]
}

---

5.1.5.2.12 网络监测 - AS 概览查询 IPv4/IPv6（PT1.XT05.01--XS-JK12）
- 服务地址（示例）：GET /api/as/{asn}/prefixes?version=4
- 请求方式：GET

请求参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| asn | 是 | Int | path 参数，AS 编号 |
| version | 否 | Int | 查询 IP 版本，4 或 6，默认 4 |

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| data | 是 | Array | [{ prefix, prefixLength, type, origin }]

请求示例：GET /api/as/65000/prefixes?version=4

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": [ { "prefix": "203.0.113.0/24", "prefixLength": 24, "type": "allocated", "origin": 65000 } ]
}

---

5.1.5.2.13 网络监测 - AS 概览邻居关系（PT1.XT05.01--XS-JK13）
- 服务地址（示例）：GET /api/as/{asn}/neighbors
- 请求方式：GET

请求参数：path 参数 asn

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| data | 是 | Array | [{ neighborAsn, relationship, sessionState, lastChange }]

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": [ { "neighborAsn": 65001, "relationship": "peer", "sessionState": "established", "lastChange": "2025-09-10T01:00:00Z" } ]
}

---

5.1.5.2.14 网络监测 - AS 概览流量（PT1.XT05.01--XS-JK14）
- 服务地址（示例）：GET /api/as/{asn}/traffic
- 请求方式：GET

请求参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| asn | 是 | Int | path 参数 |
| startTime | 否 | String | 开始时间 |
| endTime | 否 | String | 结束时间 |
| granularity | 否 | String | hour|day|minute |

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| data.inBytes | 是 | Int | 入流量字节数 |
| data.outBytes | 是 | Int | 出流量字节数 |
| data.series | 否 | Array | 时间序列 [{ ts, inBytes, outBytes }]

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": {
		"inBytes": 1234567890,
		"outBytes": 987654321,
		"series": [ { "ts": "2025-09-01T00:00:00Z", "inBytes": 12345, "outBytes": 54321 } ]
	}
}

---

5.1.5.2.15 网络监测 - AS 概览基本信息（PT1.XT05.01--XS-JK15）
- 服务地址（示例）：GET /api/as/{asn}/info
- 请求方式：GET

请求参数：path param asn

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| data.asn | 是 | Int | AS 号 |
| data.orgName | 否 | String | 组织名称 |
| data.country | 否 | String | 国家 |
| data.contact | 否 | Object | 联系信息 { name, email, phone }

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": { "asn": 65000, "orgName": "Example ISP", "country": "CN", "contact": { "name": "Ops Team", "email": "ops@example.com", "phone": "+86-10-00000000" } }
}

---

5.1.5.2.16 应急管理 - 断网监控处置演练基本节点（PT1.XT05.01--XS-JK16）
- 服务地址（示例）：GET /api/emergency/drill/nodes
- 请求方式：GET

请求参数（可选分页）：page, pageSize

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| data | 是 | Array | [{ nodeId, name, role, status }]

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": [ { "nodeId": "n-01", "name": "Backup-Router-1", "role": "edge", "status": "ready" } ]
}

---

5.1.5.2.17 应急管理 - 应急处理接口（PT1.XT05.01--XS-JK17）
- 服务地址（示例）：POST /api/emergency/handle
- 请求方式：POST

请求参数（body）：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| eventId | 是 | String | 事件 ID |
| action | 是 | String | 操作，如 trigger|ack|resolve |
| operator | 是 | String | 操作人 |
| comment | 否 | String | 备注 |

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| data | 否 | Object | 返回事件状态 { eventId, status }

请求示例：
POST /api/emergency/handle
{
	"eventId": "e-9001",
	"action": "ack",
	"operator": "admin",
	"comment": "Acknowledged and investigating"
}

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": { "eventId": "e-9001", "status": "acknowledged" }
}

---

5.1.5.2.18 配置管理 - 获取探针信息接口（PT1.XT05.01--XS-JK18）
- 服务地址（示例）：GET /api/probes
- 请求方式：GET

说明：本接口返回多个探针的列表（或单个探针对象，当使用 probeId 作为查询参数时），常用于探针管理页面展示和批量监控。默认返回数组结构。

请求参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| probeId | 否 | String | 指定单个探针 ID（存在时返回单个对象或数组中包含该对象） |
| page | 否 | Int | 页码 |
| pageSize | 否 | Int | 每页条数 |
| status | 否 | String | 状态过滤：online|offline|maintenance |

响应参数：
| 字段 | 必有 | 类型 | 说明 |
|------|------|------|------|
| code | 是 | Int | 状态码 |
| msg | 是 | String | 描述 |
| data | 是 | Array | 探针数组，[{ probeId, name, status, location, ip, lastHeartbeat, config }] |
| data[].probeId | 是 | String | 探针 ID |
| data[].name | 否 | String | 探针名称 |
| data[].status | 是 | String | 运行状态 |
| data[].location | 否 | String | 位置 |
| data[].ip | 否 | String | 探针 IP 地址 |
| data[].lastHeartbeat | 否 | String | 最后心跳时间 |
| data[].config | 否 | Object | 探针配置，如 { interval, targets }

请求示例：GET /api/probes?page=1&pageSize=20&status=online

响应示例：
{
	"code": 100,
	"msg": "success",
	"data": [
		{ "probeId": "pr-001", "name": "Probe-Shanghai-1", "status": "online", "location": "Shanghai DC", "ip": "10.0.1.11", "lastHeartbeat": "2025-10-23T08:12:00Z", "config": { "interval": 60, "targets": ["8.8.8.8", "1.1.1.1"] } },
		{ "probeId": "pr-002", "name": "Probe-Beijing-1", "status": "offline", "location": "Beijing DC", "ip": "10.0.2.12", "lastHeartbeat": "2025-10-22T22:10:00Z", "config": { "interval": 60, "targets": ["8.8.4.4"] } }
	]
}

---

说明与假设：
- 上述所有服务地址为示例路径，请以后端最终提供为准。
- 当筛选条件较多或涉及复杂布尔逻辑、分页、排序时，建议使用 POST body 传递条件。
- 返回格式建议统一为 { code, msg, data }，并在 code 字段约定成功/失败语义。

下一步：如需我可以把这些接口直接转换为 OpenAPI 3.0 草案（YAML），或把每个接口的示例请求/响应另存为单独文件以便测试和 Mock。


