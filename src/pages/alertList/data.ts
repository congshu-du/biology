import { AlertType, InternationalExtra, DomesticExtra } from "@/services/alert/interface";

// 生成国际下载网络异常测试数据
export const internationalDownloadAnomalyData: AlertType[] = [
  {
    eventId: "INT_DOWNLOAD_001",
    eventType: 4,
    attackerAsn: 0,
    victimAsn: 0,
    leakByAsn: 0,
    leakToAsnList: [],
    conspiratorList: [],
    outageAsn: 174,
    isTransitAs: 0,
    affectedPrefixNum: 15,
    prefix: "203.119.0.0/16",
    isImportantService: 1,
    startTime: "2024-01-15T10:30:00Z",
    endTime: "2024-01-15T12:45:00Z",
    eventStartTime: "2024-01-15T10:30:00Z",
    eventEndTime: "2024-01-15T12:45:00Z",
    outageAs: {
      asn: 174,
      asnName: "COGENT-174",
      countryIso: "US",
      countryName: "United States",
      latitude: 40.7128,
      longitude: -74.0060,
      organizationOrgId: "ORG-CH1-ARIN",
      organizationOrgName: "Cogent Communications",
      rank: 15,
    },
    InternationalExtra: {
      probePoint: "北京节点",
      probeIp: "202.108.22.5",
      dataSource: "NCBI",
      dataCenter: "NCBI-US-East",
      dataSourceUrl: "https://ftp.ncbi.nlm.nih.gov/",
      tool: "curl",
      status: "failed",
      responseTime: 8500,
      connectTime: 5200,
      dnsResolveTime: 890,
      sslHandshakeTime: 2410,
      downloadSpeed: 0,
      uploadSpeed: 0,
      packetLoss: 15.2,
      jitter: 8.5,
      bandwidth: 12.3,
      throughput: 0,
      targetCountry: "美国",
      targetRegion: "马里兰州",
      distance: 11234,
      hopCount: 22,
      networkPath: "北京→东京→圣何塞",
      isp: "中国电信",
      timestamp: "2025-01-14 15:30:00",
      successToolCount: 1,
      totalToolCount: 3,
      bestResponseTime: 312,
      overallStatus: "failed",
      errorMessage: "Connection timeout to NCBI FTP server",
      errorCode: 504,
    },
  },
  {
    eventId: "INT_DOWNLOAD_002",
    eventType: 4,
    attackerAsn: 0,
    victimAsn: 0,
    leakByAsn: 0,
    leakToAsnList: [],
    conspiratorList: [],
    outageAsn: 6453,
    isTransitAs: 0,
    affectedPrefixNum: 8,
    prefix: "210.140.0.0/16",
    isImportantService: 0,
    startTime: "2024-01-16T14:20:00Z",
    endTime: "2024-01-16T15:30:00Z",
    eventStartTime: "2024-01-16T14:20:00Z",
    eventEndTime: "2024-01-16T15:30:00Z",
    outageAs: {
      asn: 6453,
      asnName: "HURRICANE",
      countryIso: "US",
      countryName: "United States",
      latitude: 37.7749,
      longitude: -122.4194,
      organizationOrgId: "ORG-HT2-ARIN",
      organizationOrgName: "Hurricane Electric LLC",
      rank: 8,
    },
    InternationalExtra: {
      probePoint: "上海节点",
      probeIp: "202.96.209.5",
      dataSource: "EMBL-EBI",
      dataCenter: "EMBL-UK-Cambridge",
      dataSourceUrl: "https://ftp.ebi.ac.uk/",
      tool: "curl",
      status: "timeout",
      responseTime: 12000,
      connectTime: 0,
      dnsResolveTime: 0,
      sslHandshakeTime: 0,
      downloadSpeed: 0,
      uploadSpeed: 0,
      packetLoss: 25.8,
      jitter: 12.3,
      bandwidth: 8.7,
      throughput: 0,
      targetCountry: "英国",
      targetRegion: "剑桥",
      distance: 9214,
      hopCount: 25,
      networkPath: "上海→香港→伦敦",
      isp: "中国联通",
      timestamp: "2025-01-14 15:30:00",
      successToolCount: 2,
      totalToolCount: 3,
      bestResponseTime: 189,
      overallStatus: "failed",
      errorMessage: "Request timeout to EMBL-EBI FTP server",
      errorCode: 408,
    },
  },
  {
    eventId: "INT_DOWNLOAD_003",
    eventType: 4,
    attackerAsn: 0,
    victimAsn: 0,
    leakByAsn: 0,
    leakToAsnList: [],
    conspiratorList: [],
    outageAsn: 1299,
    isTransitAs: 0,
    affectedPrefixNum: 12,
    prefix: "91.198.0.0/16",
    isImportantService: 1,
    startTime: "2024-01-17T09:15:00Z",
    endTime: "2024-01-17T11:20:00Z",
    eventStartTime: "2024-01-17T09:15:00Z",
    eventEndTime: "2024-01-17T11:20:00Z",
    outageAs: {
      asn: 1299,
      asnName: "TELIANET",
      countryIso: "SE",
      countryName: "Sweden",
      latitude: 59.3293,
      longitude: 18.0686,
      organizationOrgId: "ORG-TS1-RIPE",
      organizationOrgName: "Telia Company AB",
      rank: 12,
    },
    InternationalExtra: {
      probePoint: "广州节点",
      probeIp: "183.62.1.5",
      dataSource: "DDBJ",
      dataCenter: "DDBJ-Japan-Tokyo",
      dataSourceUrl: "https://ftp.ddbj.nig.ac.jp/",
      tool: "curl",
      status: "failed",
      responseTime: 6500,
      connectTime: 4200,
      dnsResolveTime: 750,
      sslHandshakeTime: 1550,
      downloadSpeed: 0,
      uploadSpeed: 0,
      packetLoss: 8.7,
      jitter: 5.2,
      bandwidth: 35.6,
      throughput: 0,
      targetCountry: "美国",
      targetRegion: "马里兰州",
      distance: 11987,
      hopCount: 19,
      networkPath: "广州→香港→洛杉矶",
      isp: "中国移动",
      timestamp: "2025-01-14 15:30:00",
      successToolCount: 2,
      totalToolCount: 3,
      bestResponseTime: 145,
      overallStatus: "failed",
      errorMessage: "Service temporarily unavailable",
      errorCode: 503,
    },
  },
];

// 生成国内下载流量波动测试数据
export const domesticDownloadFluctuationData: AlertType[] = [
  {
    eventId: "DOM_DOWNLOAD_001",
    eventType: 5,
    attackerAsn: 0,
    victimAsn: 0,
    leakByAsn: 0,
    leakToAsnList: [],
    conspiratorList: [],
    outageAsn: 4134,
    isTransitAs: 0,
    affectedPrefixNum: 25,
    prefix: "202.96.0.0/16",
    isImportantService: 1,
    startTime: "2024-01-15T16:45:00Z",
    endTime: "2024-01-15T18:15:00Z",
    eventStartTime: "2024-01-15T16:45:00Z",
    eventEndTime: "2024-01-15T18:15:00Z",
    outageAs: {
      asn: 4134,
      asnName: "CHINANET-BACKBONE",
      countryIso: "CN",
      countryName: "China",
      latitude: 39.9042,
      longitude: 116.4074,
      organizationOrgId: "ORG-CH3-AP",
      organizationOrgName: "China Telecom Backbone",
      rank: 2,
    },
    DomesticExtra: {
      downloadSource: "基因组所",
      downloadSourceUrl: "https://download.big.ac.cn/",
      nginxServer: "nginx-big-beijing-01",
      alertType: "consecutive_errors",
      detectionMethod: "nginx_log_analysis",
      detectedTime: "2024-01-15T16:45:00Z",
      severity: "high",
      affectedServices: ["基因组数据下载", "序列比对服务", "变异数据库"],

      // 连续错误信息
      consecutiveErrorCount: 12,
      errorStatusCode: 500,
      firstErrorTime: "2024-01-15T16:30:00Z",
      lastErrorTime: "2024-01-15T16:45:00Z",
      errorThreshold: 10,

      // 历史状态
      historicalStatus: {
        normalDays: 127,
        lastStatusChange: "2024-01-15T16:30:00Z",
        previousStatus: "normal"
      },

      // 推断原因
      probableCause: "根据nginx日志分析，基因组所下载点连续12次返回500错误，推断该下载点服务已停止运行",
      recommendedActions: [
        "立即联系基因组所技术支持团队",
        "检查基因组所下载点服务器状态和服务进程",
        "切换至网络中心或张家口下载点",
        "通知国内用户临时使用其他国内下载点"
      ],
      expectedRecoveryTime: "2024-01-15T18:30:00Z",

      // 联系信息
      contactInfo: "基因组所技术支持：support@big.ac.cn / 010-84097780",
      diagnosticSteps: [
        "telnet download.big.ac.cn 80 检查端口连通性",
        "curl -I https://download.big.ac.cn/ 检查HTTP响应",
        "联系数据中心确认服务器状态"
      ],
      fallbackOptions: [
        "使用网络中心下载点",
        "使用张家口下载点",
        "临时使用国际NCBI主站"
      ],

      // 监控指标
      monitoringMetrics: {
        totalRequests: 15847,
        errorRate: 15.8,
        avgResponseTime: 12500,
        uptimePercentage: 84.2
      },

      // 最近日志记录
      recentLogEntries: [
        { timestamp: "2024-01-15T16:45:00Z", statusCode: 500, responseTime: 12500, errorReason: "Internal Server Error" },
        { timestamp: "2024-01-15T16:44:00Z", statusCode: 500, responseTime: 12300, errorReason: "Internal Server Error" },
        { timestamp: "2024-01-15T16:43:00Z", statusCode: 500, responseTime: 12800, errorReason: "Internal Server Error" },
        { timestamp: "2024-01-15T16:42:00Z", statusCode: 500, responseTime: 12400, errorReason: "Internal Server Error" },
        { timestamp: "2024-01-15T16:41:00Z", statusCode: 500, responseTime: 12600, errorReason: "Internal Server Error" },
        { timestamp: "2024-01-15T16:40:00Z", statusCode: 500, responseTime: 12700, errorReason: "Internal Server Error" },
        { timestamp: "2024-01-15T16:39:00Z", statusCode: 500, responseTime: 12500, errorReason: "Internal Server Error" },
        { timestamp: "2024-01-15T16:38:00Z", statusCode: 500, responseTime: 12900, errorReason: "Internal Server Error" },
        { timestamp: "2024-01-15T16:37:00Z", statusCode: 500, responseTime: 12400, errorReason: "Internal Server Error" },
        { timestamp: "2024-01-15T16:36:00Z", statusCode: 500, responseTime: 12600, errorReason: "Internal Server Error" },
        { timestamp: "2024-01-15T16:35:00Z", statusCode: 500, responseTime: 12800, errorReason: "Internal Server Error" },
        { timestamp: "2024-01-15T16:34:00Z", statusCode: 500, responseTime: 12500, errorReason: "Internal Server Error" },
        { timestamp: "2024-01-15T16:33:00Z", statusCode: 200, responseTime: 850 },
        { timestamp: "2024-01-15T16:32:00Z", statusCode: 200, responseTime: 920 },
        { timestamp: "2024-01-15T16:31:00Z", statusCode: 200, responseTime: 880 }
      ]
    },
  },
  {
    eventId: "DOM_DOWNLOAD_002",
    eventType: 5,
    attackerAsn: 0,
    victimAsn: 0,
    leakByAsn: 0,
    leakToAsnList: [],
    conspiratorList: [],
    outageAsn: 4837,
    isTransitAs: 0,
    affectedPrefixNum: 18,
    prefix: "123.125.0.0/16",
    isImportantService: 0,
    startTime: "2024-01-16T11:30:00Z",
    endTime: "2024-01-16T13:00:00Z",
    eventStartTime: "2024-01-16T11:30:00Z",
    eventEndTime: "2024-01-16T13:00:00Z",
    outageAs: {
      asn: 4837,
      asnName: "CHINA169-BACKBONE",
      countryIso: "CN",
      countryName: "China",
      latitude: 31.2304,
      longitude: 121.4737,
      organizationOrgId: "ORG-CU2-AP",
      organizationOrgName: "China Unicom Backbone Network",
      rank: 5,
    },
    DomesticExtra: {
      downloadSource: "网络中心",
      downloadSourceUrl: "https://download.cncb.ac.cn/",
      nginxServer: "nginx-cncb-beijing-01",
      alertType: "data_missing",
      detectionMethod: "nginx_log_analysis",
      detectedTime: "2024-01-16T11:30:00Z",
      severity: "critical",
      affectedServices: ["文献数据库", "蛋白质结构库", "生物信息学工具"],

      // 数据缺失信息
      lastReportTime: "2024-01-13T14:20:00Z",
      missingDuration: 69,
      expectedReportInterval: 5,
      dataMissingThreshold: 24,

      // 历史状态
      historicalStatus: {
        normalDays: 286,
        lastStatusChange: "2024-01-13T14:20:00Z",
        previousStatus: "normal"
      },

      // 推断原因
      probableCause: "连续69小时未收到nginx日志上报数据，推断网络中心下载点服务器或网络链路出现严重问题，可能已完全无法访问",
      recommendedActions: [
        "立即联系网络中心技术支持团队",
        "检查北京到网络中心的网络路由",
        "切换至基因组所或张家口下载点",
        "通知国内用户临时使用其他国内下载点"
      ],
      expectedRecoveryTime: "2024-01-17T10:00:00Z",

      // 联系信息
      contactInfo: "网络中心技术支持：support@cncb.ac.cn / 010-58881000",
      diagnosticSteps: [
        "ping download.cncb.ac.cn 检查网络连通性",
        "traceroute download.cncb.ac.cn 检查路由路径",
        "联系北京数据中心确认服务器和网络状态"
      ],
      fallbackOptions: [
        "使用基因组所下载点",
        "使用张家口下载点",
        "临时使用国际NCBI主站"
      ],

      // 监控指标
      monitoringMetrics: {
        totalRequests: 45234,
        errorRate: 0,
        avgResponseTime: 0,
        uptimePercentage: 0
      },

      // 最近日志记录（最后几条正常记录）
      recentLogEntries: [
        { timestamp: "2024-01-13T14:20:00Z", statusCode: 200, responseTime: 1250 },
        { timestamp: "2024-01-13T14:15:00Z", statusCode: 200, responseTime: 1180 },
        { timestamp: "2024-01-13T14:10:00Z", statusCode: 200, responseTime: 1320 },
        { timestamp: "2024-01-13T14:05:00Z", statusCode: 200, responseTime: 1290 },
        { timestamp: "2024-01-13T14:00:00Z", statusCode: 200, responseTime: 1210 }
      ]
    },
  },
  {
    eventId: "DOM_DOWNLOAD_003",
    eventType: 5,
    attackerAsn: 0,
    victimAsn: 0,
    leakByAsn: 0,
    leakToAsnList: [],
    conspiratorList: [],
    outageAsn: 9394,
    isTransitAs: 0,
    affectedPrefixNum: 20,
    prefix: "117.18.0.0/16",
    isImportantService: 1,
    startTime: "2024-01-17T08:00:00Z",
    endTime: "2024-01-17T09:30:00Z",
    eventStartTime: "2024-01-17T08:00:00Z",
    eventEndTime: "2024-01-17T09:30:00Z",
    outageAs: {
      asn: 9394,
      asnName: "CHINAMOBILE-BACKBONE",
      countryIso: "CN",
      countryName: "China",
      latitude: 22.3193,
      longitude: 114.1694,
      organizationOrgId: "ORG-CM1-AP",
      organizationOrgName: "China Mobile Communications Corporation",
      rank: 3,
    },
    DomesticExtra: {
      downloadSource: "张家口",
      downloadSourceUrl: "https://download.zjk.ac.cn/",
      nginxServer: "nginx-zjk-zhangjiakou-01",
      alertType: "consecutive_errors",
      detectionMethod: "nginx_log_analysis",
      detectedTime: "2024-01-17T08:00:00Z",
      severity: "critical",
      affectedServices: ["蛋白质数据库", "基因表达数据库", "代谢通路数据库"],

      // 连续错误信息
      consecutiveErrorCount: 15,
      errorStatusCode: 502,
      firstErrorTime: "2024-01-17T07:45:00Z",
      lastErrorTime: "2024-01-17T08:00:00Z",
      errorThreshold: 10,

      // 历史状态
      historicalStatus: {
        normalDays: 95,
        lastStatusChange: "2024-01-17T07:45:00Z",
        previousStatus: "normal"
      },

      // 推断原因
      probableCause: "nginx日志显示连续15次502错误，表明张家口下载点后端服务器无法正常响应，可能是服务器宕机或网络连接中断",
      recommendedActions: [
        "立即联系张家口数据中心运维团队",
        "检查张家口下载点后端服务器运行状态",
        "重启相关服务进程",
        "切换至基因组所或网络中心下载点"
      ],
      expectedRecoveryTime: "2024-01-17T10:30:00Z",

      // 联系信息
      contactInfo: "张家口数据中心运维：ops@zjk.ac.cn / 0313-5888000",
      diagnosticSteps: [
        "检查nginx-zjk配置和upstream状态",
        "直接访问张家口后端服务器端口",
        "查看张家口服务器系统日志和错误日志"
      ],
      fallbackOptions: [
        "使用基因组所下载点",
        "使用网络中心下载点",
        "临时使用国际EMBL-EBI主站"
      ],

      // 监控指标
      monitoringMetrics: {
        totalRequests: 8976,
        errorRate: 35.2,
        avgResponseTime: 8900,
        uptimePercentage: 64.8
      },

      // 最近日志记录
      recentLogEntries: [
        { timestamp: "2024-01-17T08:00:00Z", statusCode: 502, responseTime: 8900, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:59:00Z", statusCode: 502, responseTime: 9100, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:58:00Z", statusCode: 502, responseTime: 8700, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:57:00Z", statusCode: 502, responseTime: 9200, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:56:00Z", statusCode: 502, responseTime: 8800, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:55:00Z", statusCode: 502, responseTime: 9050, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:54:00Z", statusCode: 502, responseTime: 8950, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:53:00Z", statusCode: 502, responseTime: 9150, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:52:00Z", statusCode: 502, responseTime: 8850, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:51:00Z", statusCode: 502, responseTime: 9000, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:50:00Z", statusCode: 502, responseTime: 9100, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:49:00Z", statusCode: 502, responseTime: 8950, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:48:00Z", statusCode: 502, responseTime: 9050, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:47:00Z", statusCode: 502, responseTime: 8850, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:46:00Z", statusCode: 502, responseTime: 9100, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:45:00Z", statusCode: 502, responseTime: 9000, errorReason: "Bad Gateway" },
        { timestamp: "2024-01-17T07:44:00Z", statusCode: 200, responseTime: 650 },
        { timestamp: "2024-01-17T07:43:00Z", statusCode: 200, responseTime: 720 },
        { timestamp: "2024-01-17T07:42:00Z", statusCode: 200, responseTime: 680 }
      ]
    },
  },
];

// 合并所有测试数据
export const allAlertTestData = [...internationalDownloadAnomalyData, ...domesticDownloadFluctuationData];

// 按类型导出
export { internationalDownloadAnomalyData as INT_DOWNLOAD_DATA };
export { domesticDownloadFluctuationData as DOM_DOWNLOAD_DATA };