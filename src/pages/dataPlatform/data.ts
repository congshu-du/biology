// nginx下载日志数据类型定义
export interface NginxDownloadLog {
  id: string;
  timestamp: string;
  downloadSource: string;
  clientIp: string;
  userAgent: string;
  referer: string;
  requestFile: string;
  fileSize: number;
  fileType: string;
  domain: string;
  httpStatus: number;
  responseSize: number;
  downloadTime: number;
  country: string;
  city: string;
  isp: string;
  downloadCount?: number;
}

// 模拟nginx下载数据
export const mockNginxDownloadData: NginxDownloadLog[] = [
  {
    id: "1",
    timestamp: "2025-01-14 14:32:15",
    downloadSource: "基因组所",
    clientIp: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    referer: "https://example.com/downloads",
    requestFile: "/files/reports/annual_report_2024.pdf",
    fileSize: 204857600,
    fileType: "pdf",
    domain: "cdn.example.com",
    httpStatus: 200,
    responseSize: 204857600,
    downloadTime: 1250,
    country: "中国",
    city: "北京",
    isp: "中国电信",
    downloadCount: 1
  },
  {
    id: "2",
    timestamp: "2025-01-14 14:35:42",
    downloadSource: "网络中心",
    clientIp: "10.0.0.55",
    userAgent: "curl/7.68.0",
    referer: "-",
    requestFile: "/api/data/export.csv",
    fileSize: 512000,
    fileType: "csv",
    domain: "api.example.com",
    httpStatus: 200,
    responseSize: 512000,
    downloadTime: 890,
    country: "中国",
    city: "上海",
    isp: "中国联通",
    downloadCount: 3
  },
  {
    id: "3",
    timestamp: "2025-01-14 14:38:21",
    downloadSource: "张家口",
    clientIp: "172.16.0.88",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    referer: "https://example.com/resources",
    requestFile: "/static/documents/user_guide_v2.1.pdf",
    fileSize: 1024000,
    fileType: "pdf",
    domain: "static.example.com",
    httpStatus: 404,
    responseSize: 1024,
    downloadTime: 150,
    country: "中国",
    city: "深圳",
    isp: "中国移动",
    downloadCount: 0
  },
  {
    id: "4",
    timestamp: "2025-01-14 14:42:03",
    downloadSource: "基因组所",
    clientIp: "203.0.113.45",
    userAgent: "Python-requests/2.25.1",
    referer: "https://api.example.com/docs",
    requestFile: "/datasets/research_data_2025.zip",
    fileSize: 524288000,
    fileType: "zip",
    domain: "data.example.com",
    httpStatus: 200,
    responseSize: 524288000,
    downloadTime: 3200,
    country: "美国",
    city: "纽约",
    isp: "Amazon AWS",
    downloadCount: 2
  },
  {
    id: "5",
    timestamp: "2025-01-14 14:45:17",
    downloadSource: "网络中心",
    clientIp: "192.168.1.200",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    referer: "https://example.com/dashboard",
    requestFile: "/exports/weekly_summary.xlsx",
    fileSize: 768000,
    fileType: "xlsx",
    domain: "files.example.com",
    httpStatus: 200,
    responseSize: 768000,
    downloadTime: 680,
    country: "中国",
    city: "广州",
    isp: "中国电信",
    downloadCount: 5
  },
  {
    id: "6",
    timestamp: "2025-01-14 14:48:55",
    downloadSource: "张家口",
    clientIp: "10.10.10.123",
    userAgent: "Wget/1.20.3",
    referer: "-",
    requestFile: "/backup/database_backup.sql.gz",
    fileSize: 1073741824,
    fileType: "gz",
    domain: "backup.example.com",
    httpStatus: 403,
    responseSize: 512,
    downloadTime: 95,
    country: "中国",
    city: "成都",
    isp: "中国联通",
    downloadCount: 0
  },
  {
    id: "7",
    timestamp: "2025-01-14 14:52:31",
    downloadSource: "基因组所",
    clientIp: "198.51.100.77",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
    referer: "https://example.com/mobile",
    requestFile: "/mobile/app_release.ipa",
    fileSize: 2097152,
    fileType: "ipa",
    domain: "mobile.example.com",
    httpStatus: 200,
    responseSize: 2097152,
    downloadTime: 1890,
    country: "日本",
    city: "东京",
    isp: "NTT Communications",
    downloadCount: 1
  },
  {
    id: "8",
    timestamp: "2025-01-14 14:55:48",
    downloadSource: "网络中心",
    clientIp: "172.20.0.45",
    userAgent: "PostmanRuntime/7.28.4",
    referer: "-",
    requestFile: "/api/v2/analytics/report.json",
    fileSize: 256000,
    fileType: "json",
    domain: "api.example.com",
    httpStatus: 200,
    responseSize: 256000,
    downloadTime: 320,
    country: "中国",
    city: "杭州",
    isp: "阿里巴巴云",
    downloadCount: 8
  },
  {
    id: "9",
    timestamp: "2025-01-14 14:58:12",
    downloadSource: "张家口",
    clientIp: "192.168.2.88",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    referer: "https://example.com/development",
    requestFile: "/dev/sdk/linux_sdk_v3.0.tar.gz",
    fileSize: 2147483648,
    fileType: "tar.gz",
    domain: "dev.example.com",
    httpStatus: 200,
    responseSize: 2147483648,
    downloadTime: 4500,
    country: "中国",
    city: "西安",
    isp: "中国教育和科研计算机网",
    downloadCount: 2
  },
  {
    id: "10",
    timestamp: "2025-01-14 15:01:25",
    downloadSource: "基因组所",
    clientIp: "203.0.113.99",
    userAgent: "Java/1.8.0_292",
    referer: "https://example.com/integration",
    requestFile: "/java/client_library.jar",
    fileSize: 1536000,
    fileType: "jar",
    domain: "maven.example.com",
    httpStatus: 200,
    responseSize: 1536000,
    downloadTime: 1100,
    country: "德国",
    city: "柏林",
    isp: "Deutsche Telekom",
    downloadCount: 4
  },
  {
    id: "11",
    timestamp: "2025-01-14 15:05:33",
    downloadSource: "网络中心",
    clientIp: "192.168.3.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    referer: "https://example.com/docs",
    requestFile: "/documentation/api_reference.pdf",
    fileSize: 524288000,
    fileType: "pdf",
    domain: "docs.example.com",
    httpStatus: 200,
    responseSize: 524288000,
    downloadTime: 2100,
    country: "中国",
    city: "南京",
    isp: "中国电信",
    downloadCount: 2
  },
  {
    id: "12",
    timestamp: "2025-01-14 15:08:19",
    downloadSource: "张家口",
    clientIp: "172.31.0.10",
    userAgent: "axios/0.21.1",
    referer: "-",
    requestFile: "/api/v1/users/list.csv",
    fileSize: 128000,
    fileType: "csv",
    domain: "api.example.com",
    httpStatus: 200,
    responseSize: 128000,
    downloadTime: 280,
    country: "中国",
    city: "武汉",
    isp: "腾讯云",
    downloadCount: 6
  },
  {
    id: "13",
    timestamp: "2025-01-14 15:12:44",
    downloadSource: "基因组所",
    clientIp: "10.0.5.67",
    userAgent: "Python/3.9.0",
    referer: "https://example.com/research",
    requestFile: "/datasets/clinical_trial_data.xlsx",
    fileSize: 2560000,
    fileType: "xlsx",
    domain: "data.example.com",
    httpStatus: 500,
    responseSize: 2048,
    downloadTime: 3200,
    country: "中国",
    city: "天津",
    isp: "中国联通",
    downloadCount: 0
  },
  {
    id: "14",
    timestamp: "2025-01-14 15:16:02",
    downloadSource: "网络中心",
    clientIp: "198.18.0.23",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
    referer: "https://example.com/portal",
    requestFile: "/portal/monthly_newsletter.pdf",
    fileSize: 1536000,
    fileType: "pdf",
    domain: "portal.example.com",
    httpStatus: 200,
    responseSize: 1536000,
    downloadTime: 1560,
    country: "英国",
    city: "伦敦",
    isp: "British Telecom",
    downloadCount: 1
  },
  {
    id: "15",
    timestamp: "2025-01-14 15:19:28",
    downloadSource: "张家口",
    clientIp: "172.20.10.5",
    userAgent: "PowerShell/7.1.0",
    referer: "-",
    requestFile: "/scripts/deployment.ps1",
    fileSize: 25600,
    fileType: "ps1",
    domain: "scripts.example.com",
    httpStatus: 200,
    responseSize: 25600,
    downloadTime: 180,
    country: "中国",
    city: "重庆",
    isp: "中国移动",
    downloadCount: 3
  },
  {
    id: "16",
    timestamp: "2025-01-14 15:22:51",
    downloadSource: "基因组所",
    clientIp: "203.0.113.67",
    userAgent: "curl/7.78.0",
    referer: "-",
    requestFile: "/backup/config_backup.tar.gz",
    fileSize: 6291456,
    fileType: "tar.gz",
    domain: "backup.example.com",
    httpStatus: 200,
    responseSize: 6291456,
    downloadTime: 2800,
    country: "新加坡",
    city: "新加坡",
    isp: "Amazon Web Services",
    downloadCount: 1
  },
  {
    id: "17",
    timestamp: "2025-01-14 15:26:14",
    downloadSource: "网络中心",
    clientIp: "192.168.10.88",
    userAgent: "Mozilla/5.0 (Android 11; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0",
    referer: "https://example.com/mobile",
    requestFile: "/mobile/android_app.apk",
    fileSize: 4194304,
    fileType: "apk",
    domain: "mobile.example.com",
    httpStatus: 200,
    responseSize: 4194304,
    downloadTime: 3500,
    country: "中国",
    city: "苏州",
    isp: "中国电信",
    downloadCount: 2
  },
  {
    id: "18",
    timestamp: "2025-01-14 15:29:37",
    downloadSource: "张家口",
    clientIp: "172.16.20.33",
    userAgent: "Node.js/16.13.0",
    referer: "-",
    requestFile: "/npm/package.tgz",
    fileSize: 512000,
    fileType: "tgz",
    domain: "npm.example.com",
    httpStatus: 200,
    responseSize: 512000,
    downloadTime: 450,
    country: "中国",
    city: "青岛",
    isp: "中国联通",
    downloadCount: 7
  },
  {
    id: "19",
    timestamp: "2025-01-14 15:33:05",
    downloadSource: "基因组所",
    clientIp: "10.0.15.99",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    referer: "https://example.com/analytics",
    requestFile: "/analytics/traffic_report.pdf",
    fileSize: 1073741824,
    fileType: "pdf",
    domain: "analytics.example.com",
    httpStatus: 200,
    responseSize: 1073741824,
    downloadTime: 3200,
    country: "美国",
    city: "旧金山",
    isp: "Google Cloud",
    downloadCount: 3
  },
  {
    id: "20",
    timestamp: "2025-01-14 15:36:22",
    downloadSource: "网络中心",
    clientIp: "198.51.100.45",
    userAgent: "wget/1.21.1",
    referer: "-",
    requestFile: "/logs/access.log.gz",
    fileSize: 8388608,
    fileType: "gz",
    domain: "logs.example.com",
    httpStatus: 403,
    responseSize: 1024,
    downloadTime: 120,
    country: "加拿大",
    city: "多伦多",
    isp: "Rogers Communications",
    downloadCount: 0
  },
  {
    id: "21",
    timestamp: "2025-01-14 15:39:48",
    downloadSource: "张家口",
    clientIp: "192.168.5.120",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    referer: "https://example.com/help",
    requestFile: "/help/video_tutorial.mp4",
    fileSize: 1073741824,
    fileType: "mp4",
    domain: "media.example.com",
    httpStatus: 206,
    responseSize: 536870912,
    downloadTime: 4200,
    country: "中国",
    city: "大连",
    isp: "中国电信",
    downloadCount: 1
  },
  {
    id: "22",
    timestamp: "2025-01-14 15:43:11",
    downloadSource: "基因组所",
    clientIp: "172.20.30.66",
    userAgent: "Java/11.0.12",
    referer: "https://example.com/enterprise",
    requestFile: "/enterprise/software_installer.exe",
    fileSize: 2147483648,
    fileType: "exe",
    domain: "enterprise.example.com",
    httpStatus: 200,
    responseSize: 2147483648,
    downloadTime: 8900,
    country: "澳大利亚",
    city: "悉尼",
    isp: "Telstra",
    downloadCount: 2
  },
  {
    id: "23",
    timestamp: "2025-01-14 15:46:34",
    downloadSource: "网络中心",
    clientIp: "10.0.25.44",
    userAgent: "Python/3.8.10",
    referer: "-",
    requestFile: "/api/v2/metrics/data.json",
    fileSize: 512000,
    fileType: "json",
    domain: "api.example.com",
    httpStatus: 200,
    responseSize: 512000,
    downloadTime: 380,
    country: "中国",
    city: "厦门",
    isp: "中国移动",
    downloadCount: 12
  },
  {
    id: "24",
    timestamp: "2025-01-14 15:49:57",
    downloadSource: "张家口",
    clientIp: "203.0.113.88",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15",
    referer: "https://example.com/store",
    requestFile: "/store/product_catalog.csv",
    fileSize: 2048000,
    fileType: "csv",
    domain: "store.example.com",
    httpStatus: 200,
    responseSize: 2048000,
    downloadTime: 2200,
    country: "法国",
    city: "巴黎",
    isp: "Orange S.A.",
    downloadCount: 1
  },
  {
    id: "25",
    timestamp: "2025-01-14 15:53:20",
    downloadSource: "基因组所",
    clientIp: "192.168.8.200",
    userAgent: "PowerShell/5.1.19041.0",
    referer: "-",
    requestFile: "/powershell/modules.zip",
    fileSize: 3145728,
    fileType: "zip",
    domain: "ps.example.com",
    httpStatus: 200,
    responseSize: 3145728,
    downloadTime: 1800,
    country: "中国",
    city: "长沙",
    isp: "中国联通",
    downloadCount: 4
  },
  {
    id: "26",
    timestamp: "2025-01-14 15:56:43",
    downloadSource: "网络中心",
    clientIp: "172.16.40.77",
    userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0",
    referer: "https://example.com/opensource",
    requestFile: "/opensource/source_code.tar.gz",
    fileSize: 7340032,
    fileType: "tar.gz",
    domain: "github.example.com",
    httpStatus: 200,
    responseSize: 7340032,
    downloadTime: 5200,
    country: "印度",
    city: "班加罗尔",
    isp: "Tata Communications",
    downloadCount: 3
  },
  {
    id: "27",
    timestamp: "2025-01-14 16:00:06",
    downloadSource: "张家口",
    clientIp: "10.0.35.123",
    userAgent: "Axios/0.24.0",
    referer: "-",
    requestFile: "/api/v3/dashboard/stats.xlsx",
    fileSize: 1024000,
    fileType: "xlsx",
    domain: "api.example.com",
    httpStatus: 404,
    responseSize: 512,
    downloadTime: 220,
    country: "中国",
    city: "郑州",
    isp: "中国电信",
    downloadCount: 0
  },
  {
    id: "28",
    timestamp: "2025-01-14 16:03:29",
    downloadSource: "基因组所",
    clientIp: "198.18.0.55",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
    referer: "https://example.com/research",
    requestFile: "/research/paper_collection.zip",
    fileSize: 3221225472,
    fileType: "zip",
    domain: "research.example.com",
    httpStatus: 200,
    responseSize: 3221225472,
    downloadTime: 12000,
    country: "荷兰",
    city: "阿姆斯特丹",
    isp: "KPN",
    downloadCount: 2
  },
  {
    id: "29",
    timestamp: "2025-01-14 16:06:52",
    downloadSource: "网络中心",
    clientIp: "192.168.12.33",
    userAgent: "curl/7.79.1",
    referer: "-",
    requestFile: "/monitoring/system_health.json",
    fileSize: 65536,
    fileType: "json",
    domain: "monitor.example.com",
    httpStatus: 200,
    responseSize: 65536,
    downloadTime: 150,
    country: "中国",
    city: "济南",
    isp: "中国移动",
    downloadCount: 18
  },
  {
    id: "30",
    timestamp: "2025-01-14 16:10:15",
    downloadSource: "张家口",
    clientIp: "172.20.50.99",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
    referer: "https://example.com/training",
    requestFile: "/training/course_materials.pdf",
    fileSize: 1073741824,
    fileType: "pdf",
    domain: "training.example.com",
    httpStatus: 200,
    responseSize: 1073741824,
    downloadTime: 3800,
    country: "韩国",
    city: "首尔",
    isp: "SK Telecom",
    downloadCount: 1
  }
];

// 下载源选项
export const downloadSourceOptions = [
  { label: "基因组所", value: "基因组所" },
  { label: "网络中心", value: "网络中心" },
  { label: "张家口", value: "张家口" }
];

// 文件类型选项
export const fileTypeOptions = [
  { label: "PDF", value: "pdf" },
  { label: "CSV", value: "csv" },
  { label: "Excel", value: "xlsx" },
  { label: "ZIP", value: "zip" },
  { label: "压缩包", value: "gz" },
  { label: "JSON", value: "json" },
  { label: "应用包", value: "ipa" },
  { label: "开发包", value: "tar.gz" },
  { label: "JAR", value: "jar" },
  { label: "TAR.GZ", value: "tgz" },
  { label: "EXE", value: "exe" },
  { label: "APK", value: "apk" },
  { label: "MP4", value: "mp4" },
  { label: "PS1", value: "ps1" },
  { label: "PowerShell", value: "ps1" }
];

// HTTP状态码选项
export const httpStatusOptions = [
  { label: "成功 (200)", value: 200, color: "green" },
  { label: "部分内容 (206)", value: 206, color: "blue" },
  { label: "未找到 (404)", value: 404, color: "orange" },
  { label: "禁止访问 (403)", value: 403, color: "red" },
  { label: "服务器错误 (500)", value: 500, color: "red" }
];

// 国家地区选项
export const countryOptions = [
  { label: "中国", value: "中国" },
  { label: "美国", value: "美国" },
  { label: "日本", value: "日本" },
  { label: "德国", value: "德国" },
  { label: "英国", value: "英国" },
  { label: "新加坡", value: "新加坡" },
  { label: "法国", value: "法国" },
  { label: "加拿大", value: "加拿大" },
  { label: "澳大利亚", value: "澳大利亚" },
  { label: "荷兰", value: "荷兰" },
  { label: "印度", value: "印度" },
  { label: "韩国", value: "韩国" }
];

// ISP运营商选项
export const ispOptions = [
  { label: "中国电信", value: "中国电信" },
  { label: "中国联通", value: "中国联通" },
  { label: "中国移动", value: "中国移动" },
  { label: "阿里巴巴云", value: "阿里巴巴云" },
  { label: "腾讯云", value: "腾讯云" },
  { label: "Amazon AWS", value: "Amazon AWS" },
  { label: "Amazon Web Services", value: "Amazon Web Services" },
  { label: "Google Cloud", value: "Google Cloud" },
  { label: "NTT Communications", value: "NTT Communications" },
  { label: "中国教育和科研计算机网", value: "中国教育和科研计算机网" },
  { label: "Deutsche Telekom", value: "Deutsche Telekom" },
  { label: "British Telecom", value: "British Telecom" },
  { label: "Rogers Communications", value: "Rogers Communications" },
  { label: "Telstra", value: "Telstra" },
  { label: "Tata Communications", value: "Tata Communications" },
  { label: "KPN", value: "KPN" },
  { label: "SK Telecom", value: "SK Telecom" },
  { label: "Orange S.A.", value: "Orange S.A." }
];

// ===== 探测相关数据定义 =====

// 探测工具类型
export type ProbeTool = 'curl' | 'truncate' | 'ping';

// 数据源类型
export type DataSource = 'NCBI' | 'EMBL-EBI' | 'DDBJ';

// 探测状态
export type ProbeStatus = 'success' | 'failed' | 'timeout';

// 单个探测工具的结果
export interface ProbeToolResult {
  tool: ProbeTool;          // 探测工具
  status: ProbeStatus;      // 探测状态
  responseTime: number;     // 响应时间(ms)
  connectTime: number;      // 连接时间(ms)
  dnsResolveTime: number;   // DNS解析时间(ms)
  sslHandshakeTime: number; // SSL握手时间(ms)
  downloadSpeed?: number;   // 下载速度(Mbps)
  uploadSpeed?: number;     // 上传速度(Mbps)
  packetLoss?: number;      // 丢包率(%)
  jitter?: number;          // 网络抖动(ms)
  bandwidth?: number;       // 带宽利用率(%)
  throughput?: number;      // 吞吐量(MB/s)
  errorCode?: number;       // 错误代码
  errorMessage?: string;    // 错误信息
}

// 探测记录接口 - 一次探测包含多个工具的结果
export interface ProbeRecord {
  id: string;
  timestamp: string;
  probePoint: string;        // 探测点名称
  probeIp: string;          // 探测点IP
  dataSource: DataSource;   // 数据源
  dataCenter: string;       // 数据中心
  dataSourceUrl: string;    // 数据源URL

  // 综合探测结果 - 包含所有探测工具的结果
  toolResults: ProbeToolResult[];  // 各个探测工具的结果列表

  // 综合状态 - 取所有工具中最差的
  overallStatus: ProbeStatus;

  // 综合响应时间 - 取所有工具中的最佳响应时间
  bestResponseTime: number;

  // 成功的工具数量
  successToolCount: number;

  // 总工具数量
  totalToolCount: number;

  // 地理和网络信息
  targetCountry: string;    // 目标国家
  targetRegion: string;     // 目标地区
  distance: number;         // 地理距离(km)
  hopCount?: number;        // 路由跳数
  networkPath?: string;     // 网络路径
  isp: string;             // 网络运营商
}

// 探测统计数据接口
export interface ProbeStats {
  totalProbes: number;          // 总探测次数
  successRate: number;          // 成功率(%)
  averageResponseTime: number;  // 平均响应时间
  avgDownloadSpeed: number;     // 平均下载速度
  avgPacketLoss: number;        // 平均丢包率
  activeProbes: number;         // 活跃探测点数
  criticalAlerts: number;       // 严重告警数
  lastUpdateTime: string;       // 最后更新时间
}

// 探测点选项
export const probePointOptions = [
  { label: "北京节点", value: "北京节点" },
  { label: "上海节点", value: "上海节点" },
  { label: "广州节点", value: "广州节点" },
  { label: "深圳节点", value: "深圳节点" },
  { label: "成都节点", value: "成都节点" },
  { label: "武汉节点", value: "武汉节点" },
  { label: "西安节点", value: "西安节点" },
  { label: "南京节点", value: "南京节点" },
];

// 数据源选项
export const dataSourceOptions = [
  { label: "NCBI (美国)", value: "NCBI" },
  { label: "EMBL-EBI (欧洲)", value: "EMBL-EBI" },
  { label: "DDBJ (日本)", value: "DDBJ" },
];

// 探测工具选项
export const probeToolOptions = [
  { label: "CURL", value: "curl" },
  { label: "TRUNCATE", value: "truncate" },
  { label: "PING", value: "ping" },
];

// 探测状态选项
export const probeStatusOptions = [
  { label: "成功", value: "success", color: "green" },
  { label: "失败", value: "failed", color: "red" },
  { label: "超时", value: "timeout", color: "orange" },
];

// 性能等级选项
export const performanceLevelOptions = [
  { label: "优秀 (<50ms)", value: "excellent" },
  { label: "良好 (50-200ms)", value: "good" },
  { label: "一般 (200-500ms)", value: "average" },
  { label: "较差 (>500ms)", value: "poor" },
];

// 模拟探测数据 - 每个探测点每个时间点对所有数据源都进行探测
export const mockProbeData: ProbeRecord[] = [
  // 时间点1: 北京节点对所有数据源的探测
  {
    id: "1",
    timestamp: "2025-01-14 15:30:00",
    probePoint: "北京节点",
    probeIp: "202.108.22.5",
    dataSource: "NCBI",
    dataCenter: "NCBI-US-East",
    dataSourceUrl: "https://ftp.ncbi.nlm.nih.gov/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 245,
        connectTime: 120,
        dnsResolveTime: 35,
        sslHandshakeTime: 90,
        downloadSpeed: 45.2,
        uploadSpeed: 12.8,
        packetLoss: 0.1,
        jitter: 2.3,
        bandwidth: 68.5,
        throughput: 5.67
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 189,
        connectTime: 95,
        dnsResolveTime: 28,
        sslHandshakeTime: 67,
        downloadSpeed: 48.7,
        uploadSpeed: 14.1,
        packetLoss: 0.0,
        jitter: 1.8,
        bandwidth: 72.3,
        throughput: 6.02
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 156,
        connectTime: 0,
        dnsResolveTime: 24,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 1.2
      }
    ],
    overallStatus: "success",
    bestResponseTime: 156,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "美国",
    targetRegion: "马里兰州",
    distance: 11234,
    hopCount: 18,
    networkPath: "北京→东京→圣何塞",
    isp: "中国电信"
  },
  {
    id: "2",
    timestamp: "2025-01-14 15:30:00",
    probePoint: "北京节点",
    probeIp: "202.108.22.5",
    dataSource: "EMBL-EBI",
    dataCenter: "EMBL-UK-Cambridge",
    dataSourceUrl: "https://ftp.ebi.ac.uk/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 267,
        connectTime: 130,
        dnsResolveTime: 42,
        sslHandshakeTime: 95,
        downloadSpeed: 42.1,
        uploadSpeed: 11.5,
        packetLoss: 0.2,
        jitter: 2.8,
        bandwidth: 65.3,
        throughput: 5.23
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 205,
        connectTime: 105,
        dnsResolveTime: 32,
        sslHandshakeTime: 68,
        downloadSpeed: 45.8,
        uploadSpeed: 13.2,
        packetLoss: 0.1,
        jitter: 2.1,
        bandwidth: 69.7,
        throughput: 5.89
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 172,
        connectTime: 0,
        dnsResolveTime: 28,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 1.5
      }
    ],
    overallStatus: "success",
    bestResponseTime: 172,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "英国",
    targetRegion: "剑桥",
    distance: 10214,
    hopCount: 20,
    networkPath: "北京→莫斯科→伦敦",
    isp: "中国电信"
  },
  {
    id: "3",
    timestamp: "2025-01-14 15:30:00",
    probePoint: "北京节点",
    probeIp: "202.108.22.5",
    dataSource: "DDBJ",
    dataCenter: "DDBJ-Japan-Tokyo",
    dataSourceUrl: "https://ftp.ddbj.nig.ac.jp/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 125,
        connectTime: 65,
        dnsResolveTime: 18,
        sslHandshakeTime: 42,
        downloadSpeed: 58.3,
        uploadSpeed: 16.7,
        packetLoss: 0.0,
        jitter: 1.3,
        bandwidth: 81.2,
        throughput: 7.45
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 98,
        connectTime: 52,
        dnsResolveTime: 15,
        sslHandshakeTime: 31,
        downloadSpeed: 62.1,
        uploadSpeed: 17.8,
        packetLoss: 0.0,
        jitter: 1.0,
        bandwidth: 85.6,
        throughput: 7.92
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 78,
        connectTime: 0,
        dnsResolveTime: 12,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 0.9
      }
    ],
    overallStatus: "success",
    bestResponseTime: 78,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "日本",
    targetRegion: "东京",
    distance: 3124,
    hopCount: 10,
    networkPath: "北京→首尔→东京",
    isp: "中国电信"
  },

  // 时间点2: 上海节点对所有数据源的探测
  {
    id: "4",
    timestamp: "2025-01-14 15:30:00",
    probePoint: "上海节点",
    probeIp: "202.96.209.5",
    dataSource: "NCBI",
    dataCenter: "NCBI-US-East",
    dataSourceUrl: "https://ftp.ncbi.nlm.nih.gov/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 198,
        connectTime: 102,
        dnsResolveTime: 29,
        sslHandshakeTime: 67,
        downloadSpeed: 51.2,
        uploadSpeed: 14.8,
        packetLoss: 0.0,
        jitter: 1.6,
        bandwidth: 73.5,
        throughput: 6.41
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 167,
        connectTime: 85,
        dnsResolveTime: 25,
        sslHandshakeTime: 57,
        downloadSpeed: 54.9,
        uploadSpeed: 15.9,
        packetLoss: 0.0,
        jitter: 1.3,
        bandwidth: 78.1,
        throughput: 6.87
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 135,
        connectTime: 0,
        dnsResolveTime: 21,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 1.0
      }
    ],
    overallStatus: "success",
    bestResponseTime: 135,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "美国",
    targetRegion: "马里兰州",
    distance: 10892,
    hopCount: 17,
    networkPath: "上海→东京→圣何塞",
    isp: "中国联通"
  },
  {
    id: "5",
    timestamp: "2025-01-14 15:30:00",
    probePoint: "上海节点",
    probeIp: "202.96.209.5",
    dataSource: "EMBL-EBI",
    dataCenter: "EMBL-UK-Cambridge",
    dataSourceUrl: "https://ftp.ebi.ac.uk/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 189,
        connectTime: 95,
        dnsResolveTime: 28,
        sslHandshakeTime: 67,
        downloadSpeed: 52.8,
        uploadSpeed: 15.4,
        packetLoss: 0.0,
        jitter: 1.8,
        bandwidth: 75.2,
        throughput: 6.61
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 156,
        connectTime: 78,
        dnsResolveTime: 24,
        sslHandshakeTime: 54,
        downloadSpeed: 58.3,
        uploadSpeed: 16.7,
        packetLoss: 0.0,
        jitter: 1.5,
        bandwidth: 82.1,
        throughput: 7.28
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 125,
        connectTime: 0,
        dnsResolveTime: 20,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 0.9
      }
    ],
    overallStatus: "success",
    bestResponseTime: 125,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "英国",
    targetRegion: "剑桥",
    distance: 9214,
    hopCount: 15,
    networkPath: "上海→香港→伦敦",
    isp: "中国联通"
  },
  {
    id: "6",
    timestamp: "2025-01-14 15:30:00",
    probePoint: "上海节点",
    probeIp: "202.96.209.5",
    dataSource: "DDBJ",
    dataCenter: "DDBJ-Japan-Tokyo",
    dataSourceUrl: "https://ftp.ddbj.nig.ac.jp/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 112,
        connectTime: 58,
        dnsResolveTime: 17,
        sslHandshakeTime: 37,
        downloadSpeed: 61.7,
        uploadSpeed: 17.9,
        packetLoss: 0.0,
        jitter: 1.2,
        bandwidth: 86.3,
        throughput: 7.89
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 89,
        connectTime: 46,
        dnsResolveTime: 14,
        sslHandshakeTime: 29,
        downloadSpeed: 65.2,
        uploadSpeed: 18.8,
        packetLoss: 0.0,
        jitter: 0.9,
        bandwidth: 89.7,
        throughput: 8.34
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 72,
        connectTime: 0,
        dnsResolveTime: 11,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 0.8
      }
    ],
    overallStatus: "success",
    bestResponseTime: 72,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "日本",
    targetRegion: "东京",
    distance: 2156,
    hopCount: 7,
    networkPath: "上海→冲绳→东京",
    isp: "中国联通"
  },

  // 时间点3: 广州节点对所有数据源的探测
  {
    id: "7",
    timestamp: "2025-01-14 15:30:00",
    probePoint: "广州节点",
    probeIp: "183.62.1.5",
    dataSource: "NCBI",
    dataCenter: "NCBI-US-East",
    dataSourceUrl: "https://ftp.ncbi.nlm.nih.gov/",
    toolResults: [
      {
        tool: "curl",
        status: "failed",
        responseTime: 6500,
        connectTime: 4200,
        dnsResolveTime: 750,
        sslHandshakeTime: 1550,
        errorCode: 503,
        errorMessage: "Service temporarily unavailable"
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 178,
        connectTime: 92,
        dnsResolveTime: 26,
        sslHandshakeTime: 60,
        downloadSpeed: 49.8,
        uploadSpeed: 14.3,
        packetLoss: 0.1,
        jitter: 2.1,
        bandwidth: 71.6,
        throughput: 6.24
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 145,
        connectTime: 0,
        dnsResolveTime: 22,
        sslHandshakeTime: 0,
        packetLoss: 0.1,
        jitter: 1.7
      }
    ],
    overallStatus: "failed",
    bestResponseTime: 145,
    successToolCount: 2,
    totalToolCount: 3,
    targetCountry: "美国",
    targetRegion: "马里兰州",
    distance: 11987,
    hopCount: 19,
    networkPath: "广州→香港→洛杉矶",
    isp: "中国移动"
  },
  {
    id: "8",
    timestamp: "2025-01-14 15:30:00",
    probePoint: "广州节点",
    probeIp: "183.62.1.5",
    dataSource: "EMBL-EBI",
    dataCenter: "EMBL-UK-Cambridge",
    dataSourceUrl: "https://ftp.ebi.ac.uk/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 167,
        connectTime: 85,
        dnsResolveTime: 24,
        sslHandshakeTime: 58,
        downloadSpeed: 56.3,
        uploadSpeed: 16.2,
        packetLoss: 0.0,
        jitter: 1.6,
        bandwidth: 79.8,
        throughput: 7.05
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 134,
        connectTime: 68,
        dnsResolveTime: 21,
        sslHandshakeTime: 45,
        downloadSpeed: 60.1,
        uploadSpeed: 17.4,
        packetLoss: 0.0,
        jitter: 1.3,
        bandwidth: 84.7,
        throughput: 7.61
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 108,
        connectTime: 0,
        dnsResolveTime: 18,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 1.1
      }
    ],
    overallStatus: "success",
    bestResponseTime: 108,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "英国",
    targetRegion: "剑桥",
    distance: 9745,
    hopCount: 16,
    networkPath: "广州→新加坡→伦敦",
    isp: "中国移动"
  },
  {
    id: "9",
    timestamp: "2025-01-14 15:30:00",
    probePoint: "广州节点",
    probeIp: "183.62.1.5",
    dataSource: "DDBJ",
    dataCenter: "DDBJ-Japan-Tokyo",
    dataSourceUrl: "https://ftp.ddbj.nig.ac.jp/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 89,
        connectTime: 45,
        dnsResolveTime: 16,
        sslHandshakeTime: 28,
        downloadSpeed: 65.4,
        uploadSpeed: 18.9,
        packetLoss: 0.0,
        jitter: 1.1,
        bandwidth: 88.6,
        throughput: 8.17
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 125,
        connectTime: 62,
        dnsResolveTime: 22,
        sslHandshakeTime: 41,
        downloadSpeed: 55.8,
        uploadSpeed: 16.2,
        packetLoss: 0.0,
        jitter: 1.6,
        bandwidth: 79.3,
        throughput: 6.96
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 68,
        connectTime: 0,
        dnsResolveTime: 12,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 0.8
      }
    ],
    overallStatus: "success",
    bestResponseTime: 68,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "日本",
    targetRegion: "东京",
    distance: 2892,
    hopCount: 8,
    networkPath: "广州→香港→东京",
    isp: "中国移动"
  },

  // 时间点4: 深圳节点对所有数据源的探测
  {
    id: "10",
    timestamp: "2025-01-14 15:30:00",
    probePoint: "深圳节点",
    probeIp: "202.104.15.5",
    dataSource: "NCBI",
    dataCenter: "NCBI-US-East",
    dataSourceUrl: "https://ftp.ncbi.nlm.nih.gov/",
    toolResults: [
      {
        tool: "curl",
        status: "failed",
        responseTime: 8500,
        connectTime: 5200,
        dnsResolveTime: 890,
        sslHandshakeTime: 2410,
        errorCode: 503,
        errorMessage: "Service unavailable"
      },
      {
        tool: "truncate",
        status: "failed",
        responseTime: 5000,
        connectTime: 3200,
        dnsResolveTime: 450,
        sslHandshakeTime: 1350,
        errorCode: 504,
        errorMessage: "Connection timeout"
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 312,
        connectTime: 0,
        dnsResolveTime: 45,
        sslHandshakeTime: 0,
        packetLoss: 0.3,
        jitter: 4.2
      }
    ],
    overallStatus: "failed",
    bestResponseTime: 312,
    successToolCount: 1,
    totalToolCount: 3,
    targetCountry: "美国",
    targetRegion: "马里兰州",
    distance: 11689,
    hopCount: 22,
    networkPath: "深圳→香港→东京→圣何塞",
    isp: "中国电信"
  },
  {
    id: "11",
    timestamp: "2025-01-14 15:30:00",
    probePoint: "深圳节点",
    probeIp: "202.104.15.5",
    dataSource: "EMBL-EBI",
    dataCenter: "EMBL-UK-Cambridge",
    dataSourceUrl: "https://ftp.ebi.ac.uk/",
    toolResults: [
      {
        tool: "curl",
        status: "timeout",
        responseTime: 12000,
        connectTime: 0,
        dnsResolveTime: 0,
        sslHandshakeTime: 0,
        errorCode: 408,
        errorMessage: "Request timeout"
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 298,
        connectTime: 152,
        dnsResolveTime: 48,
        sslHandshakeTime: 98,
        downloadSpeed: 41.3,
        uploadSpeed: 12.1,
        packetLoss: 0.2,
        jitter: 2.8,
        bandwidth: 64.9,
        throughput: 5.18
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 189,
        connectTime: 0,
        dnsResolveTime: 32,
        sslHandshakeTime: 0,
        packetLoss: 0.1,
        jitter: 2.3
      }
    ],
    overallStatus: "failed",
    bestResponseTime: 189,
    successToolCount: 2,
    totalToolCount: 3,
    targetCountry: "英国",
    targetRegion: "剑桥",
    distance: 10023,
    hopCount: 18,
    networkPath: "深圳→香港→法兰克福→伦敦",
    isp: "中国电信"
  },
  {
    id: "12",
    timestamp: "2025-01-14 15:30:00",
    probePoint: "深圳节点",
    probeIp: "202.104.15.5",
    dataSource: "DDBJ",
    dataCenter: "DDBJ-Japan-Tokyo",
    dataSourceUrl: "https://ftp.ddbj.nig.ac.jp/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 156,
        connectTime: 82,
        dnsResolveTime: 24,
        sslHandshakeTime: 50,
        downloadSpeed: 52.1,
        uploadSpeed: 15.2,
        packetLoss: 0.1,
        jitter: 1.9,
        bandwidth: 76.8,
        throughput: 6.73
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 123,
        connectTime: 64,
        dnsResolveTime: 19,
        sslHandshakeTime: 38,
        downloadSpeed: 57.6,
        uploadSpeed: 16.7,
        packetLoss: 0.0,
        jitter: 1.5,
        bandwidth: 81.9,
        throughput: 7.14
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 98,
        connectTime: 0,
        dnsResolveTime: 16,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 1.2
      }
    ],
    overallStatus: "success",
    bestResponseTime: 98,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "日本",
    targetRegion: "东京",
    distance: 2786,
    hopCount: 9,
    networkPath: "深圳→台北→东京",
    isp: "中国电信"
  },

  // 时间点5: 15:25:00 - 北京节点对所有数据源的探测 (定时任务)
  {
    id: "13",
    timestamp: "2025-01-14 15:25:00",
    probePoint: "北京节点",
    probeIp: "202.108.22.5",
    dataSource: "NCBI",
    dataCenter: "NCBI-US-East",
    dataSourceUrl: "https://ftp.ncbi.nlm.nih.gov/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 258,
        connectTime: 125,
        dnsResolveTime: 38,
        sslHandshakeTime: 95,
        downloadSpeed: 43.8,
        uploadSpeed: 12.5,
        packetLoss: 0.1,
        jitter: 2.5,
        bandwidth: 67.2,
        throughput: 5.52
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 195,
        connectTime: 98,
        dnsResolveTime: 30,
        sslHandshakeTime: 67,
        downloadSpeed: 47.2,
        uploadSpeed: 13.8,
        packetLoss: 0.0,
        jitter: 1.9,
        bandwidth: 71.1,
        throughput: 5.88
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 162,
        connectTime: 0,
        dnsResolveTime: 26,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 1.3
      }
    ],
    overallStatus: "success",
    bestResponseTime: 162,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "美国",
    targetRegion: "马里兰州",
    distance: 11234,
    hopCount: 18,
    networkPath: "北京→东京→圣何塞",
    isp: "中国电信"
  },
  {
    id: "14",
    timestamp: "2025-01-14 15:25:00",
    probePoint: "北京节点",
    probeIp: "202.108.22.5",
    dataSource: "EMBL-EBI",
    dataCenter: "EMBL-UK-Cambridge",
    dataSourceUrl: "https://ftp.ebi.ac.uk/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 275,
        connectTime: 135,
        dnsResolveTime: 45,
        sslHandshakeTime: 95,
        downloadSpeed: 40.8,
        uploadSpeed: 11.8,
        packetLoss: 0.2,
        jitter: 2.9,
        bandwidth: 64.1,
        throughput: 5.08
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 212,
        connectTime: 108,
        dnsResolveTime: 35,
        sslHandshakeTime: 69,
        downloadSpeed: 44.5,
        uploadSpeed: 13.5,
        packetLoss: 0.1,
        jitter: 2.2,
        bandwidth: 68.3,
        throughput: 5.72
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 178,
        connectTime: 0,
        dnsResolveTime: 30,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 1.6
      }
    ],
    overallStatus: "success",
    bestResponseTime: 178,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "英国",
    targetRegion: "剑桥",
    distance: 10214,
    hopCount: 20,
    networkPath: "北京→莫斯科→伦敦",
    isp: "中国电信"
  },
  {
    id: "15",
    timestamp: "2025-01-14 15:25:00",
    probePoint: "北京节点",
    probeIp: "202.108.22.5",
    dataSource: "DDBJ",
    dataCenter: "DDBJ-Japan-Tokyo",
    dataSourceUrl: "https://ftp.ddbj.nig.ac.jp/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 132,
        connectTime: 68,
        dnsResolveTime: 20,
        sslHandshakeTime: 44,
        downloadSpeed: 56.8,
        uploadSpeed: 16.4,
        packetLoss: 0.0,
        jitter: 1.4,
        bandwidth: 79.8,
        throughput: 7.28
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 105,
        connectTime: 55,
        dnsResolveTime: 17,
        sslHandshakeTime: 33,
        downloadSpeed: 60.5,
        uploadSpeed: 17.5,
        packetLoss: 0.0,
        jitter: 1.1,
        bandwidth: 84.1,
        throughput: 7.75
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 82,
        connectTime: 0,
        dnsResolveTime: 14,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 1.0
      }
    ],
    overallStatus: "success",
    bestResponseTime: 82,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "日本",
    targetRegion: "东京",
    distance: 3124,
    hopCount: 10,
    networkPath: "北京→首尔→东京",
    isp: "中国电信"
  },

  // 时间点5: 15:25:00 - 上海节点对所有数据源的探测 (定时任务)
  {
    id: "16",
    timestamp: "2025-01-14 15:25:00",
    probePoint: "上海节点",
    probeIp: "202.96.209.5",
    dataSource: "NCBI",
    dataCenter: "NCBI-US-East",
    dataSourceUrl: "https://ftp.ncbi.nlm.nih.gov/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 205,
        connectTime: 108,
        dnsResolveTime: 31,
        sslHandshakeTime: 66,
        downloadSpeed: 49.8,
        uploadSpeed: 14.5,
        packetLoss: 0.0,
        jitter: 1.7,
        bandwidth: 72.1,
        throughput: 6.28
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 175,
        connectTime: 88,
        dnsResolveTime: 27,
        sslHandshakeTime: 60,
        downloadSpeed: 53.4,
        uploadSpeed: 15.6,
        packetLoss: 0.0,
        jitter: 1.4,
        bandwidth: 76.8,
        throughput: 6.72
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 142,
        connectTime: 0,
        dnsResolveTime: 23,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 1.1
      }
    ],
    overallStatus: "success",
    bestResponseTime: 142,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "美国",
    targetRegion: "马里兰州",
    distance: 10892,
    hopCount: 17,
    networkPath: "上海→东京→圣何塞",
    isp: "中国联通"
  },
  {
    id: "17",
    timestamp: "2025-01-14 15:25:00",
    probePoint: "上海节点",
    probeIp: "202.96.209.5",
    dataSource: "EMBL-EBI",
    dataCenter: "EMBL-UK-Cambridge",
    dataSourceUrl: "https://ftp.ebi.ac.uk/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 195,
        connectTime: 98,
        dnsResolveTime: 30,
        sslHandshakeTime: 67,
        downloadSpeed: 51.5,
        uploadSpeed: 15.1,
        packetLoss: 0.0,
        jitter: 1.9,
        bandwidth: 74.2,
        throughput: 6.48
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 165,
        connectTime: 82,
        dnsResolveTime: 26,
        sslHandshakeTime: 57,
        downloadSpeed: 56.8,
        uploadSpeed: 16.4,
        packetLoss: 0.0,
        jitter: 1.6,
        bandwidth: 81.3,
        throughput: 7.15
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 130,
        connectTime: 0,
        dnsResolveTime: 22,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 1.0
      }
    ],
    overallStatus: "success",
    bestResponseTime: 130,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "英国",
    targetRegion: "剑桥",
    distance: 9214,
    hopCount: 15,
    networkPath: "上海→香港→伦敦",
    isp: "中国联通"
  },
  {
    id: "18",
    timestamp: "2025-01-14 15:25:00",
    probePoint: "上海节点",
    probeIp: "202.96.209.5",
    dataSource: "DDBJ",
    dataCenter: "DDBJ-Japan-Tokyo",
    dataSourceUrl: "https://ftp.ddbj.nig.ac.jp/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 118,
        connectTime: 61,
        dnsResolveTime: 19,
        sslHandshakeTime: 38,
        downloadSpeed: 60.2,
        uploadSpeed: 17.5,
        packetLoss: 0.0,
        jitter: 1.3,
        bandwidth: 85.1,
        throughput: 7.72
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 94,
        connectTime: 48,
        dnsResolveTime: 16,
        sslHandshakeTime: 30,
        downloadSpeed: 63.8,
        uploadSpeed: 18.5,
        packetLoss: 0.0,
        jitter: 1.0,
        bandwidth: 88.5,
        throughput: 8.15
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 76,
        connectTime: 0,
        dnsResolveTime: 13,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 0.9
      }
    ],
    overallStatus: "success",
    bestResponseTime: 76,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "日本",
    targetRegion: "东京",
    distance: 2156,
    hopCount: 7,
    networkPath: "上海→冲绳→东京",
    isp: "中国联通"
  },

  // 时间点5: 15:25:00 - 广州节点对所有数据源的探测 (定时任务)
  {
    id: "19",
    timestamp: "2025-01-14 15:25:00",
    probePoint: "广州节点",
    probeIp: "183.62.1.5",
    dataSource: "NCBI",
    dataCenter: "NCBI-US-East",
    dataSourceUrl: "https://ftp.ncbi.nlm.nih.gov/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 168,
        connectTime: 88,
        dnsResolveTime: 25,
        sslHandshakeTime: 55,
        downloadSpeed: 48.1,
        uploadSpeed: 14.1,
        packetLoss: 0.1,
        jitter: 2.2,
        bandwidth: 70.3,
        throughput: 6.15
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 138,
        connectTime: 72,
        dnsResolveTime: 22,
        sslHandshakeTime: 44,
        downloadSpeed: 51.6,
        uploadSpeed: 15.1,
        packetLoss: 0.1,
        jitter: 1.8,
        bandwidth: 74.8,
        throughput: 6.58
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 115,
        connectTime: 0,
        dnsResolveTime: 20,
        sslHandshakeTime: 0,
        packetLoss: 0.1,
        jitter: 1.6
      }
    ],
    overallStatus: "success",
    bestResponseTime: 115,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "美国",
    targetRegion: "马里兰州",
    distance: 11987,
    hopCount: 19,
    networkPath: "广州→香港→洛杉矶",
    isp: "中国移动"
  },
  {
    id: "20",
    timestamp: "2025-01-14 15:25:00",
    probePoint: "广州节点",
    probeIp: "183.62.1.5",
    dataSource: "EMBL-EBI",
    dataCenter: "EMBL-UK-Cambridge",
    dataSourceUrl: "https://ftp.ebi.ac.uk/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 175,
        connectTime: 89,
        dnsResolveTime: 26,
        sslHandshakeTime: 60,
        downloadSpeed: 54.8,
        uploadSpeed: 16.0,
        packetLoss: 0.0,
        jitter: 1.7,
        bandwidth: 78.5,
        throughput: 6.92
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 142,
        connectTime: 71,
        dnsResolveTime: 23,
        sslHandshakeTime: 48,
        downloadSpeed: 58.5,
        uploadSpeed: 17.1,
        packetLoss: 0.0,
        jitter: 1.4,
        bandwidth: 83.4,
        throughput: 7.48
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 115,
        connectTime: 0,
        dnsResolveTime: 19,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 1.2
      }
    ],
    overallStatus: "success",
    bestResponseTime: 115,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "英国",
    targetRegion: "剑桥",
    distance: 9745,
    hopCount: 16,
    networkPath: "广州→新加坡→伦敦",
    isp: "中国移动"
  },
  {
    id: "21",
    timestamp: "2025-01-14 15:25:00",
    probePoint: "广州节点",
    probeIp: "183.62.1.5",
    dataSource: "DDBJ",
    dataCenter: "DDBJ-Japan-Tokyo",
    dataSourceUrl: "https://ftp.ddbj.nig.ac.jp/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 95,
        connectTime: 48,
        dnsResolveTime: 18,
        sslHandshakeTime: 29,
        downloadSpeed: 63.8,
        uploadSpeed: 18.5,
        packetLoss: 0.0,
        jitter: 1.2,
        bandwidth: 87.1,
        throughput: 8.05
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 130,
        connectTime: 65,
        dnsResolveTime: 24,
        sslHandshakeTime: 41,
        downloadSpeed: 54.2,
        uploadSpeed: 15.9,
        packetLoss: 0.0,
        jitter: 1.7,
        bandwidth: 78.1,
        throughput: 6.88
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 72,
        connectTime: 0,
        dnsResolveTime: 14,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 0.9
      }
    ],
    overallStatus: "success",
    bestResponseTime: 72,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "日本",
    targetRegion: "东京",
    distance: 2892,
    hopCount: 8,
    networkPath: "广州→香港→东京",
    isp: "中国移动"
  },

  // 时间点5: 15:25:00 - 深圳节点对所有数据源的探测 (定时任务)
  {
    id: "22",
    timestamp: "2025-01-14 15:25:00",
    probePoint: "深圳节点",
    probeIp: "202.104.15.5",
    dataSource: "NCBI",
    dataCenter: "NCBI-US-East",
    dataSourceUrl: "https://ftp.ncbi.nlm.nih.gov/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 218,
        connectTime: 115,
        dnsResolveTime: 35,
        sslHandshakeTime: 68,
        downloadSpeed: 46.5,
        uploadSpeed: 13.5,
        packetLoss: 0.1,
        jitter: 2.4,
        bandwidth: 69.8,
        throughput: 6.02
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 185,
        connectTime: 95,
        dnsResolveTime: 28,
        sslHandshakeTime: 62,
        downloadSpeed: 50.2,
        uploadSpeed: 14.6,
        packetLoss: 0.0,
        jitter: 1.9,
        bandwidth: 74.5,
        throughput: 6.53
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 152,
        connectTime: 0,
        dnsResolveTime: 25,
        sslHandshakeTime: 0,
        packetLoss: 0.1,
        jitter: 2.0
      }
    ],
    overallStatus: "success",
    bestResponseTime: 152,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "美国",
    targetRegion: "马里兰州",
    distance: 11689,
    hopCount: 22,
    networkPath: "深圳→香港→东京→圣何塞",
    isp: "中国电信"
  },
  {
    id: "23",
    timestamp: "2025-01-14 15:25:00",
    probePoint: "深圳节点",
    probeIp: "202.104.15.5",
    dataSource: "EMBL-EBI",
    dataCenter: "EMBL-UK-Cambridge",
    dataSourceUrl: "https://ftp.ebi.ac.uk/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 188,
        connectTime: 98,
        dnsResolveTime: 30,
        sslHandshakeTime: 60,
        downloadSpeed: 49.8,
        uploadSpeed: 14.5,
        packetLoss: 0.1,
        jitter: 2.1,
        bandwidth: 73.2,
        throughput: 6.35
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 155,
        connectTime: 80,
        dnsResolveTime: 26,
        sslHandshakeTime: 49,
        downloadSpeed: 54.1,
        uploadSpeed: 15.8,
        packetLoss: 0.1,
        jitter: 1.7,
        bandwidth: 78.9,
        throughput: 6.85
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 128,
        connectTime: 0,
        dnsResolveTime: 22,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 1.5
      }
    ],
    overallStatus: "success",
    bestResponseTime: 128,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "英国",
    targetRegion: "剑桥",
    distance: 10023,
    hopCount: 18,
    networkPath: "深圳→香港→法兰克福→伦敦",
    isp: "中国电信"
  },
  {
    id: "24",
    timestamp: "2025-01-14 15:25:00",
    probePoint: "深圳节点",
    probeIp: "202.104.15.5",
    dataSource: "DDBJ",
    dataCenter: "DDBJ-Japan-Tokyo",
    dataSourceUrl: "https://ftp.ddbj.nig.ac.jp/",
    toolResults: [
      {
        tool: "curl",
        status: "success",
        responseTime: 145,
        connectTime: 78,
        dnsResolveTime: 23,
        sslHandshakeTime: 44,
        downloadSpeed: 53.8,
        uploadSpeed: 15.6,
        packetLoss: 0.1,
        jitter: 1.8,
        bandwidth: 77.6,
        throughput: 6.82
      },
      {
        tool: "truncate",
        status: "success",
        responseTime: 115,
        connectTime: 60,
        dnsResolveTime: 18,
        sslHandshakeTime: 37,
        downloadSpeed: 58.9,
        uploadSpeed: 17.1,
        packetLoss: 0.0,
        jitter: 1.4,
        bandwidth: 82.8,
        throughput: 7.28
      },
      {
        tool: "ping",
        status: "success",
        responseTime: 92,
        connectTime: 0,
        dnsResolveTime: 15,
        sslHandshakeTime: 0,
        packetLoss: 0.0,
        jitter: 1.1
      }
    ],
    overallStatus: "success",
    bestResponseTime: 92,
    successToolCount: 3,
    totalToolCount: 3,
    targetCountry: "日本",
    targetRegion: "东京",
    distance: 2786,
    hopCount: 9,
    networkPath: "深圳→台北→东京",
    isp: "中国电信"
  }
];