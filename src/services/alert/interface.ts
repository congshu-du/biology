export interface AlertStatisticProps {
  eventCount: number;
  timeBucket: string;
}

export interface CountryLinkProps {
  attackerCountryName: string;
  victimCountryName: string;
  eventCount: number;
}

export interface AlertType {
  eventId: string;
  eventType: number;
  attackerAsn: number;
  victimAsn: number;
  leakByAsn: number;
  leakToAsnList: number[];
  conspiratorList?: number[];
  outageAsn: number;
  isTransitAs: number;
  affectedPrefixNum: number;
  prefix: string;
  isImportantService: number;
  startTime: string;
  endTime: string;
  attackerAs?: AsInfoType;
  victimAs?: AsInfoType;
  leakByAs?: AsInfoType;
  leakToAsList?: AsInfoType[];
  outageAs?: AsInfoType;
  eventStartTime?: string;
  eventEndTime?: string;
  InternationalExtra?: InternationalExtra; // 国际下载异常探测信息
  DomesticExtra?: DomesticExtra; // 国内下载流量波动信息
  desc?: string; // 描述信息
}

interface AsInfoType {
  asn: number;
  asnName: string;
  countryIso: string;
  countryName: string;
  latitude: number;
  longitude: number;
  organizationOrgId: string;
  organizationOrgName: string;
  rank: number;
}

// 单条探测结果（用于批次数据）
export interface ProbeResult {
  probePoint?: string; // 探测点名称（所有探测点到同一数据源时使用）
  probeIp?: string; // 探测点IP
  dataSource?: string; // 数据源（同一探测点到所有数据源时使用）
  tool: string; // 探测工具
  status: string; // 探测状态 success/failed/timeout
  responseTime: number; // 响应时间(ms)
  connectTime: number; // 连接时间(ms)
  dnsResolveTime: number; // DNS解析时间(ms)
  sslHandshakeTime: number; // SSL握手时间(ms)
  downloadSpeed: number; // 下载速度(Mbps)
  uploadSpeed: number; // 上传速度(Mbps)
  packetLoss: number; // 丢包率(%)
  jitter: number; // 网络抖动(ms)
  bandwidth: number; // 带宽利用率(%)
  throughput: number; // 吞吐量(MB/s)
  errorCode?: number; // 错误代码
  errorMessage?: string; // 错误信息
}

// 国际下载异常探测信息接口
export interface InternationalExtra {
  probePoint: string; // 探测点名称
  probeIp: string; // 探测点IP
  dataSource: string; // 数据源 (如 NCBI)
  dataCenter: string; // 数据中心
  dataSourceUrl: string; // 数据源URL
  tool: string; // 探测工具
  status: string; // 探测状态
  responseTime: number; // 响应时间(ms)
  connectTime: number; // 连接时间(ms)
  dnsResolveTime: number; // DNS解析时间(ms)
  sslHandshakeTime: number; // SSL握手时间(ms)
  downloadSpeed?: number; // 下载速度(Mbps)
  uploadSpeed?: number; // 上传速度(Mbps)
  packetLoss?: number; // 丢包率(%)
  jitter?: number; // 网络抖动(ms)
  bandwidth?: number; // 带宽利用率(%)
  throughput?: number; // 吞吐量(MB/s)
  targetCountry: string; // 目标国家
  targetRegion: string; // 目标地区
  distance: number; // 地理距离(km)
  hopCount?: number; // 路由跳数
  networkPath?: string; // 网络路径
  isp: string; // 网络运营商
  timestamp: string; // 探测时间
  successToolCount?: number; // 成功工具数
  totalToolCount?: number; // 总工具数
  bestResponseTime?: number; // 最佳响应时间
  overallStatus: string; // 综合状态
  errorMessage?: string; // 错误信息
  errorCode?: number; // 错误代码
  // 同批次探测数据
  sameProbeToAllSources?: ProbeResult[]; // 同一探测点到所有数据源的探测结果
  allProbesToSameSource?: ProbeResult[]; // 所有探测点到同一数据源的探测结果
}

// 国内下载服务状态监控信息接口 (基于nginx日志分析)
export interface DomesticExtra {
  downloadSource: string; // 下载源名称 (如 基因组所, NCBI北京镜像)
  downloadSourceUrl: string; // 下载源URL
  nginxServer: string; // Nginx服务器标识
  alertType: string; // 告警类型 (consecutive_errors/data_missing) 连续错误/数据缺失
  detectionMethod: string; // 检测方式 (nginx_log_analysis) 日志分析
  detectedTime: string; // 检测时间
  severity: string; // 严重程度 (low/medium/high/critical)
  affectedServices: string[]; // 受影响的服务列表

  // 连续错误相关 (alertType为consecutive_errors时使用)
  consecutiveErrorCount?: number; // 连续错误次数
  errorStatusCode?: number; // 错误状态码 (如500)
  firstErrorTime?: string; // 首次错误时间
  lastErrorTime?: string; // 最后错误时间
  errorThreshold?: number; // 错误阈值 (如连续10次)

  // 数据缺失相关 (alertType为data_missing时使用)
  lastReportTime?: string; // 最后上报时间
  missingDuration?: number; // 缺失时长 (小时)
  expectedReportInterval?: number; // 预期上报间隔 (分钟)
  dataMissingThreshold?: number; // 数据缺失阈值 (小时)

  // 历史状态信息
  historicalStatus: {
    normalDays: number; // 正常运行天数
    lastStatusChange?: string; // 最后状态变化时间
    previousStatus?: string; // 之前的状态
  };

  // 推断的问题和解决方案
  probableCause: string; // 推断原因
  recommendedActions: string[]; // 推荐操作
  expectedRecoveryTime?: string; // 预计恢复时间

  // 联系和诊断信息
  contactInfo?: string; // 联系方式
  diagnosticSteps: string[]; // 诊断步骤
  fallbackOptions: string[]; // 备用方案

  // 相关监控指标
  monitoringMetrics: {
    totalRequests: number; // 总请求数
    errorRate: number; // 错误率 (%)
    avgResponseTime: number; // 平均响应时间
    uptimePercentage: number; // 可用性百分比
  };

  // 最近的日志记录
  recentLogEntries: {
    timestamp: string; // 时间戳
    statusCode: number; // 状态码
    responseTime: number; // 响应时间
    errorReason?: string; // 错误原因
  }[];
}

export interface BgpmonEventSankeyType {
  data: { name: string; countryIso?: string }[];
  links: { source: string; target: string; value: number; type: 0 | 1 | 2 }[];
  relatedBgpData: any[];
}
