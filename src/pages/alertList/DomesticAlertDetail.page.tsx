import { getAlertDetail } from "@/services/alert";
import { typeOptions } from "@/services/alert/contant";
import { AlertType, InternationalExtra, DomesticExtra } from "@/services/alert/interface";
import { getDuration } from "@/utils/config";
import { token } from "@/utils/theme";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import styled, { tw } from "@vue-styled-components/core";
import { Descriptions, Skeleton, Divider, Tag } from "ant-design-vue";
import dayjs from "dayjs";
import { defineComponent, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { css } from "@emotion/css";
import { internationalDownloadAnomalyData, domesticDownloadFluctuationData } from "./data";

const Detail = defineComponent(() => {
  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);
  const info = ref<AlertType>();

  watchEffect(async () => {
    try {
      loading.value = true;

      // 先从国际下载数据中查找
      info.value = internationalDownloadAnomalyData.find((item) => item.eventId === route.query.eventId);

      // 如果没找到，再从国内流量波动数据中查找
      if (!info.value) {
        info.value = domesticDownloadFluctuationData.find((item) => item.eventId === route.query.eventId);
      }

      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  });

  const getAlertTag = (eventType: number) => {
    const label = typeOptions.find((item) => item.value === eventType)?.label;
    return <Tag color={token.geekblue}>{label}</Tag>;
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      success: { label: "成功", color: "green" },
      failed: { label: "失败", color: "red" },
      timeout: { label: "超时", color: "orange" },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const getToolTag = (tool: string) => {
    const colors = { curl: token.green, truncate: token.blue, ping: token.orange };
    return <Tag color={colors[tool as keyof typeof colors]}>{tool.toUpperCase()}</Tag>;
  };

  const getPerformanceLevel = (responseTime: number) => {
    if (responseTime < 50) return "excellent";
    if (responseTime < 200) return "good";
    if (responseTime < 500) return "average";
    return "poor";
  };

  const getPerformanceLevelTag = (responseTime: number) => {
    const level = getPerformanceLevel(responseTime);
    const levelConfig = {
      excellent: { label: "优秀", color: token.green },
      good: { label: "良好", color: token.blue },
      average: { label: "一般", color: token.orange },
      poor: { label: "较差", color: token.red },
    };
    const config = levelConfig[level as keyof typeof levelConfig];
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const getDurations = (record: AlertType | undefined) => {
    if (!record?.eventStartTime || !record?.eventEndTime) return "-";
    return getDuration(dayjs(record?.eventEndTime).valueOf() - dayjs(record?.eventStartTime).valueOf());
  };

  // 告警类型相关的工具函数
  const getAlertTypeTag = (alertType: string) => {
    const typeConfig = {
      consecutive_errors: { label: "连续错误", color: "red" },
      data_missing: { label: "数据缺失", color: "orange" },
    };
    const config = typeConfig[alertType as keyof typeof typeConfig];
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const getSeverityTag = (severity: string) => {
    const severityConfig = {
      low: { label: "低", color: "green" },
      medium: { label: "中", color: "orange" },
      high: { label: "高", color: "red" },
      critical: { label: "严重", color: "magenta" },
    };
    const config = severityConfig[severity as keyof typeof severityConfig];
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const getStatusCodeColor = (statusCode: number) => {
    if (statusCode >= 500) return token.red;
    if (statusCode >= 400) return token.orange;
    if (statusCode >= 300) return token.blue;
    return token.green;
  };

  const formatResponseTime = (responseTime: number) => {
    if (responseTime >= 10000) return `${(responseTime / 1000).toFixed(1)}s`;
    return `${responseTime}ms`;
  };

  const formatDuration = (hours: number) => {
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}天${remainingHours}小时`;
    }
    return `${hours}小时`;
  };

  const getErrorReason = (errorCode: number, errorMessage: string, tool: string) => {
    const errorReasons = {
      408: "请求超时，可能是网络延迟过高或服务器响应缓慢",
      500: "服务器内部错误，可能是目标服务暂时不可用",
      503: "服务不可用，可能是目标服务器过载或维护中",
      504: "网关超时，可能是中间网络设备响应缓慢",
      404: "资源未找到，可能是目标URL已变更或不存在",
      403: "访问被拒绝，可能是权限限制或IP被封禁",
    };

    const toolSpecificReasons = {
      curl: "下载连接失败，建议检查网络连接和目标服务器状态",
      truncate: "连接建立失败，可能是DNS解析或网络路径问题",
      ping: "网络连通性问题，建议检查路由和网络设备状态",
    };

    const baseReason = errorReasons[errorCode as keyof typeof errorReasons] || "未知错误";
    const toolReason = toolSpecificReasons[tool as keyof typeof toolSpecificReasons] || "";

    return `${baseReason}。${toolReason}`;
  };

  // 获取意见建议
  const getSuggestions = (probe: InternationalExtra, batchData: any[]): any[] => {
    const suggestions: any[] = [];

    // 基于错误类型的建议
    if (probe.status === "failed") {
      suggestions.push({
        priority: "high",
        title: "立即处理建议",
        content: "检查目标服务器状态和网络连通性，确认服务是否正常运行",
        action: "联系目标服务提供商确认服务状态",
      });

      // 基于错误码的具体建议
      if (probe.errorCode === 403) {
        suggestions.push({
          priority: "high",
          title: "IP封禁或访问限制",
          content: "检测到403访问被拒绝错误，可能是探测IP被目标服务器封禁或限制访问",
          action: "更换探测IP地址或联系目标服务器管理员解除访问限制",
        });
      } else if (probe.errorCode === 503) {
        suggestions.push({
          priority: "medium",
          title: "服务过载处理",
          content: "目标服务器可能过载，建议检查服务器负载情况",
          action: "考虑增加备用服务器或负载均衡",
        });
      } else if (probe.errorCode === 504) {
        suggestions.push({
          priority: "medium",
          title: "网络优化建议",
          content: "网络响应时间过长，可能存在网络瓶颈",
          action: "检查网络路由和中间设备配置",
        });
      }
    }

    // 基于同批探测结果的建议
    const samePointResults = batchData[0]?.data || [];
    const successRate = samePointResults.filter((r) => r.status === "success").length / samePointResults.length;

    if (successRate < 0.5) {
      suggestions.push({
        priority: "high",
        title: "探测点问题",
        content: `该探测点成功率较低(${(successRate * 100).toFixed(1)}%)，可能存在本地网络问题`,
        action: "检查探测点网络设备和连接配置",
      });
    }

    // 基于响应时间的建议
    const successfulProbes = samePointResults.filter((r) => r.status === "success");
    if (successfulProbes.length > 0) {
      const avgResponseTime = successfulProbes.reduce((sum, p) => sum + p.responseTime, 0) / successfulProbes.length;
      if (avgResponseTime > 500) {
        suggestions.push({
          priority: "medium",
          title: "性能优化建议",
          content: `平均响应时间较长(${Math.round(avgResponseTime)}ms)，建议优化网络路径`,
          action: "考虑使用CDN或优化路由配置",
        });
      }
    }

    // 预防性建议
    suggestions.push({
      priority: "low",
      title: "预防性措施",
      content: "建议建立更完善的监控和告警机制",
      action: "设置多探测点冗余，提高可靠性",
    });

    // 地理位置相关建议
    if (probe.distance > 10000) {
      suggestions.push({
        priority: "medium",
        title: "远距离探测优化",
        content: `探测距离较远(${probe.distance}km)，网络延迟较高`,
        action: "考虑增加近距离探测点或使用专线连接",
      });
    }

    return suggestions;
  };

  // 模拟获取同批探测数据
  const getBatchProbeData = (currentProbe: InternationalExtra) => {
    const batchData = [
      // 同一探测点到其他数据源的探测结果
      {
        title: `${currentProbe.probePoint} 同一时间点其他数据源探测`,
        data: [
          {
            tool: "curl",
            dataSource: "EMBL-EBI",
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
            throughput: 6.02,
          },
          {
            tool: "curl",
            dataSource: "DDBJ",
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
            throughput: 7.45,
          },
        ],
      },
      // 其他探测点到同一数据源的探测结果
      {
        title: `其他探测点到 ${currentProbe.dataSource} 的探测结果`,
        data: [
          {
            probePoint: "上海节点",
            probeIp: "202.96.209.5",
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
            throughput: 6.41,
          },
          {
            probePoint: "广州节点",
            probeIp: "183.62.1.5",
            tool: "curl",
            status: "failed",
            responseTime: 3200,
            connectTime: 1500,
            dnsResolveTime: 120,
            sslHandshakeTime: 380,
            downloadSpeed: 0,
            uploadSpeed: 0,
            packetLoss: 0,
            jitter: 0,
            bandwidth: 0,
            throughput: 0,
            errorCode: 403,
            errorMessage: "Access denied - IP address blocked due to excessive requests",
          },
          {
            probePoint: "深圳节点",
            probeIp: "202.104.15.5",
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
            errorCode: 504,
            errorMessage: "Connection timeout to NCBI FTP server",
          },
          {
            probePoint: "北京节点",
            probeIp: "211.151.1.5",
            tool: "curl",
            status: "failed",
            responseTime: 2800,
            connectTime: 1200,
            dnsResolveTime: 150,
            sslHandshakeTime: 450,
            downloadSpeed: 0,
            uploadSpeed: 0,
            packetLoss: 0,
            jitter: 0,
            bandwidth: 0,
            throughput: 0,
            errorCode: 403,
            errorMessage: "Forbidden - Your IP has been temporarily blocked due to suspicious activity",
          },
        ],
      },
    ];
    return batchData;
  };

  return () => (
    <div class="min-h-full p-4 pt-0">
      <Skeleton paragraph={{ rows: 30 }} loading={loading.value} active>
        <div class="h-12 flex justify-between items-center mb-2">
          <div class="inline-flex items-center">
            <a onClick={() => router.back()} class="mr-2 flex items-center ">
              <ArrowLeftOutlined class="text-lg translate-y-[-2px] translate-x-[-2px]" />
            </a>
            <span class="text-base ">{info.value?.eventType === 5 ? '国内下载点状态监控详情' : '国际探测告警详情'}</span>
          </div>
        </div>

        <div class="mb-4 pl-[2px]">
          <div class="text-base inline-flex items-center px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
            <div class="inline-block w-1 h-5 mr-3 rounded-full bg-blue-500" />
            <span class="font-semibold text-blue-900">告警基本信息</span>
          </div>
        </div>

        <DetailDiv class="mb-4 pt-4 pb-4">
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="告警类型">{getAlertTag(info.value?.eventType ?? 4)}</Descriptions.Item>
            <Descriptions.Item label="告警ID">{info.value?.eventId}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {dayjs(info.value?.startTime).format("YYYY-MM-DD HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="事件开始时间">
              {info.value?.eventStartTime ? dayjs(info.value?.eventStartTime).format("YYYY-MM-DD HH:mm:ss") : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="事件结束时间">
              {info.value?.eventEndTime ? dayjs(info.value?.eventEndTime).format("YYYY-MM-DD HH:mm:ss") : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="告警时长">{getDurations(info.value)}</Descriptions.Item>
            <Descriptions.Item label="中断ASN">
              {info.value?.outageAs ? (
                <a onClick={() => router.push(`/as/base?as=${info.value?.outageAsn}`)}>AS{info.value?.outageAsn}</a>
              ) : (
                "-"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="中断组织">{info.value?.outageAs?.organizationOrgName || "-"}</Descriptions.Item>
            <Descriptions.Item label="影响前缀">{info.value?.prefix}</Descriptions.Item>
            <Descriptions.Item label="影响前缀数量">
              <Tag color={token.orange}>{info.value?.affectedPrefixNum}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </DetailDiv>

        {info.value?.DomesticExtra && (
          <>
            {/* 下载点状态监控分析展示 */}
            <div class="mb-4 pl-[2px]">
              <div class="text-base inline-flex items-center px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                <div class="inline-block w-1 h-5 mr-3 rounded-full bg-red-500" />
                <span class="font-semibold text-red-900">下载点状态监控分析</span>
              </div>
            </div>

            <DetailDiv class="mb-4 pt-4 pb-4">
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="下载源">
                  <a href={info.value.DomesticExtra.downloadSourceUrl} target="_blank">
                    {info.value.DomesticExtra.downloadSource}
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label="Nginx服务器">{info.value.DomesticExtra.nginxServer}</Descriptions.Item>
                <Descriptions.Item label="告警类型">{getAlertTypeTag(info.value.DomesticExtra.alertType)}</Descriptions.Item>
                <Descriptions.Item label="检测方式">{info.value.DomesticExtra.detectionMethod}</Descriptions.Item>
                <Descriptions.Item label="严重程度">{getSeverityTag(info.value.DomesticExtra.severity)}</Descriptions.Item>
                <Descriptions.Item label="检测时间">
                  {dayjs(info.value.DomesticExtra.detectedTime).format("YYYY-MM-DD HH:mm:ss")}
                </Descriptions.Item>

                {/* 连续错误相关信息 */}
                {info.value.DomesticExtra.alertType === "consecutive_errors" && (
                  <>
                    <Descriptions.Item label="连续错误次数">
                      <Tag color={token.red}>{info.value.DomesticExtra.consecutiveErrorCount}次</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="错误状态码">
                      <Tag color={token.red}>{info.value.DomesticExtra.errorStatusCode}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="首次错误时间">
                      {dayjs(info.value.DomesticExtra.firstErrorTime).format("YYYY-MM-DD HH:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="最后错误时间">
                      {dayjs(info.value.DomesticExtra.lastErrorTime).format("YYYY-MM-DD HH:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="错误阈值">
                      {info.value.DomesticExtra.errorThreshold}次连续错误触发告警
                    </Descriptions.Item>
                  </>
                )}

                {/* 数据缺失相关信息 */}
                {info.value.DomesticExtra.alertType === "data_missing" && (
                  <>
                    <Descriptions.Item label="最后上报时间">
                      {dayjs(info.value.DomesticExtra.lastReportTime).format("YYYY-MM-DD HH:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="数据缺失时长">
                      <Tag color={token.orange}>{formatDuration(info.value.DomesticExtra.missingDuration || 0)}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="预期上报间隔">
                      {info.value.DomesticExtra.expectedReportInterval}分钟
                    </Descriptions.Item>
                    <Descriptions.Item label="缺失阈值">
                      {info.value.DomesticExtra.dataMissingThreshold}小时无数据触发告警
                    </Descriptions.Item>
                  </>
                )}

                {info.value.DomesticExtra.expectedRecoveryTime && (
                  <Descriptions.Item label="预计恢复时间">
                    {dayjs(info.value.DomesticExtra.expectedRecoveryTime).format("YYYY-MM-DD HH:mm:ss")}
                  </Descriptions.Item>
                )}
              </Descriptions>

              {/* 受影响服务列表 */}
              <div class="mt-4">
                <div class="text-sm font-semibold mb-2" style={{ color: token.colorTextSecondary }}>受影响服务:</div>
                <div class="flex flex-wrap gap-2">
                  {info.value.DomesticExtra.affectedServices.map((service, index) => (
                    <Tag key={index} color={token.blue}>{service}</Tag>
                  ))}
                </div>
              </div>

              {/* 历史状态信息 */}
              <div class="mt-4">
                <div class="text-sm font-semibold mb-2" style={{ color: token.colorTextSecondary }}>历史状态:</div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="text-center p-3 bg-blue-50 rounded-lg">
                    <div class="text-lg font-semibold" style={{ color: token.colorText }}>{info.value.DomesticExtra.historicalStatus.normalDays}天</div>
                    <div class="text-xs text-gray-600">正常运行天数</div>
                  </div>
                  <div class="text-center p-3 bg-gray-50 rounded-lg">
                    <div class="text-lg font-semibold" style={{ color: token.colorText }}>
                      {info.value.DomesticExtra.historicalStatus.previousStatus || 'unknown'}
                    </div>
                    <div class="text-xs text-gray-600">之前状态</div>
                  </div>
                  <div class="text-center p-3 bg-yellow-50 rounded-lg">
                    <div class="text-lg font-semibold" style={{ color: token.colorText }}>
                      {info.value.DomesticExtra.historicalStatus.lastStatusChange ?
                        dayjs(info.value.DomesticExtra.historicalStatus.lastStatusChange).format("MM-DD HH:mm") : '-'}
                    </div>
                    <div class="text-xs text-gray-600">最后状态变化</div>
                  </div>
                </div>
              </div>

              {/* 推断原因 */}
              {info.value.DomesticExtra.probableCause && (
                <div class="mt-4">
                  <div class="text-sm font-semibold mb-2" style={{ color: token.colorTextSecondary }}>推断原因:</div>
                  <div class="p-3 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                    <p class="text-sm text-orange-800">{info.value.DomesticExtra.probableCause}</p>
                  </div>
                </div>
              )}

              {/* 联系信息 */}
              {info.value.DomesticExtra.contactInfo && (
                <div class="mt-4">
                  <div class="text-sm font-semibold mb-2" style={{ color: token.colorTextSecondary }}>联系方式:</div>
                  <div class="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                    <p class="text-sm text-blue-800">{info.value.DomesticExtra.contactInfo}</p>
                  </div>
                </div>
              )}
            </DetailDiv>

            {/* 监控指标 */}
            <div class="mb-4 pl-[2px]">
              <div class="text-base inline-flex items-center px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
                <div class="inline-block w-1 h-5 mr-3 rounded-full bg-blue-500" />
                <span class="font-semibold text-blue-900">监控指标</span>
              </div>
            </div>

            <DetailDiv class="mb-4 pt-4 pb-4">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <div class="text-lg font-semibold" style={{ color: token.colorText }}>{info.value.DomesticExtra.monitoringMetrics.totalRequests.toLocaleString()}</div>
                  <div class="text-xs text-gray-600">总请求数</div>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <div class="text-lg font-semibold" style={{ color: token.colorError }}>{info.value.DomesticExtra.monitoringMetrics.errorRate.toFixed(1)}%</div>
                  <div class="text-xs text-gray-600">错误率</div>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <div class="text-lg font-semibold" style={{ color: token.colorText }}>{formatResponseTime(info.value.DomesticExtra.monitoringMetrics.avgResponseTime)}</div>
                  <div class="text-xs text-gray-600">平均响应时间</div>
                </div>
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <div class="text-lg font-semibold" style={{ color: token.colorText }}>{info.value.DomesticExtra.monitoringMetrics.uptimePercentage.toFixed(1)}%</div>
                  <div class="text-xs text-gray-600">可用性</div>
                </div>
              </div>
            </DetailDiv>

            {/* 最近日志记录 */}
            <div class="mb-4 pl-[2px]">
              <div class="text-base inline-flex items-center px-3 py-2 rounded-lg bg-green-50 border border-green-100">
                <div class="inline-block w-1 h-5 mr-3 rounded-full bg-green-500" />
                <span class="font-semibold text-green-900">最近日志记录</span>
              </div>
            </div>

            <DetailDiv class="mb-4 pt-4 pb-4">
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-2 px-3">时间</th>
                      <th class="text-center py-2 px-3">状态码</th>
                      <th class="text-right py-2 px-3">响应时间</th>
                      {info.value.DomesticExtra.alertType === "consecutive_errors" && (
                        <th class="text-left py-2 px-3">错误原因</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {info.value.DomesticExtra.recentLogEntries.map((entry, index) => (
                      <tr key={index} class="border-b hover:bg-gray-50">
                        <td class="py-2 px-3">{dayjs(entry.timestamp).format("HH:mm:ss")}</td>
                        <td class="text-center py-2 px-3">
                          <Tag color={getStatusCodeColor(entry.statusCode)}>{entry.statusCode}</Tag>
                        </td>
                        <td class="text-right py-2 px-3">{formatResponseTime(entry.responseTime)}</td>
                        {info.value.DomesticExtra.alertType === "consecutive_errors" && (
                          <td class="py-2 px-3 text-red-600">{entry.errorReason}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DetailDiv>

            {/* 诊断步骤 */}
            {info.value.DomesticExtra.diagnosticSteps && info.value.DomesticExtra.diagnosticSteps.length > 0 && (
              <>
                <div class="mb-4 pl-[2px]">
                  <div class="text-base inline-flex items-center px-3 py-2 rounded-lg bg-purple-50 border border-purple-100">
                    <div class="inline-block w-1 h-5 mr-3 rounded-full bg-purple-500" />
                    <span class="font-semibold text-purple-900">诊断步骤</span>
                  </div>
                </div>

                <DetailDiv class="mb-4 pt-4 pb-4">
                  <div class="space-y-3">
                    {info.value.DomesticExtra.diagnosticSteps.map((step, index) => (
                      <div key={index} class="flex items-start space-x-3">
                        <div class="flex-shrink-0 mt-1">
                          <div class="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                        </div>
                        <div class="flex-1">
                          <p class="text-sm text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DetailDiv>
              </>
            )}

            {/* 备用方案 */}
            {info.value.DomesticExtra.fallbackOptions && info.value.DomesticExtra.fallbackOptions.length > 0 && (
              <>
                <div class="mb-4 pl-[2px]">
                  <div class="text-base inline-flex items-center px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-100">
                    <div class="inline-block w-1 h-5 mr-3 rounded-full bg-yellow-500" />
                    <span class="font-semibold text-yellow-900">备用方案</span>
                  </div>
                </div>

                <DetailDiv class="mb-4 pt-4 pb-4">
                  <div class="space-y-3">
                    {info.value.DomesticExtra.fallbackOptions.map((option, index) => (
                      <div key={index} class="flex items-start space-x-3">
                        <div class="flex-shrink-0 mt-1">
                          <div class="w-2 h-2 rounded-full bg-yellow-500" />
                        </div>
                        <div class="flex-1">
                          <p class="text-sm text-gray-700">{option}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DetailDiv>
              </>
            )}

            {/* 推荐操作 */}
            <div class="mb-4 pl-[2px]">
              <div class="text-base inline-flex items-center px-3 py-2 rounded-lg bg-green-50 border border-green-100">
                <div class="inline-block w-1 h-5 mr-3 rounded-full bg-green-500" />
                <span class="font-semibold text-green-900">推荐操作</span>
              </div>
            </div>

            <DetailDiv class="mb-4 pt-4 pb-4">
              <div class="space-y-3">
                {info.value.DomesticExtra.recommendedActions.map((action, index) => (
                  <div key={index} class="flex items-start space-x-3">
                    <div class="flex-shrink-0 mt-1">
                      <div class="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-700">{action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DetailDiv>

          </>
        )}

        {info.value?.InternationalExtra && (
          <>
            {/* 错误分析展示 */}
            {info.value.InternationalExtra.errorMessage && (
              <>
                <div class="mb-4 pl-[2px]">
                  <div class="text-base inline-flex items-center px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                    <div class="inline-block w-1 h-5 mr-3 rounded-full bg-red-500" />
                    <span class="font-semibold text-red-900">错误分析</span>
                  </div>
                </div>

                <ErrorAnalysisDiv class="mb-4 pt-4 pb-4">
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="错误摘要">
                      <div class="flex items-center space-x-4">
                        <span>
                          {getToolTag(info.value.InternationalExtra.tool)}
                          <span class="mx-2">错误码:</span>
                          <Tag color={token.red}>{info.value.InternationalExtra.errorCode}</Tag>
                          <span class="mx-2">错误信息:</span>
                          <span style={{ color: token.red, fontWeight: 500 }}>
                            {info.value.InternationalExtra.errorMessage}
                          </span>
                        </span>
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="推测原因">
                      <div class="space-y-2">
                        <div class="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg shadow-sm">
                          <div class="flex items-start">
                            <div class="flex-shrink-0 mt-0.5">
                              <svg class="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fill-rule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </div>
                            <div class="ml-3 flex-1">
                              <p class="text-sm text-red-800 leading-relaxed">
                                {getErrorReason(
                                  info.value.InternationalExtra.errorCode || 0,
                                  info.value.InternationalExtra.errorMessage || "",
                                  info.value.InternationalExtra.tool,
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Descriptions.Item>
                  </Descriptions>
                </ErrorAnalysisDiv>
              </>
            )}

            {/* 同批探测结果展示 */}
            <div class="mb-4 pl-[2px]">
              <div class="text-base inline-flex items-center">
                <div class="inline-block w-1 h-4 mr-2" style={{ background: token.geekblue }} />
                <span>同批探测结果</span>
              </div>
            </div>

            {getBatchProbeData(info.value.InternationalExtra).map((batch, batchIndex) => (
              <DetailDiv key={batchIndex} class="mb-4 pt-4 pb-4">
                <h3 class="text-lg font-semibold mb-4" style={{ color: token.colorText }}>
                  {batch.title}
                </h3>
                <div class="grid grid-cols-1 gap-4">
                  {batch.data.map((probe, probeIndex) => (
                    <div
                      key={probeIndex}
                      class={`p-4 rounded-lg border ${
                        probe.status === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center space-x-3">
                          {probe.probePoint && <Tag color={token.blue}>{probe.probePoint}</Tag>}
                          <Tag color={token.green}>{probe.dataSource}</Tag>
                          {getToolTag(probe.tool)}
                          {getStatusTag(probe.status)}
                        </div>
                        <div class="text-sm text-gray-600">
                          响应时间: <span class="font-semibold">{probe.responseTime}ms</span>
                        </div>
                      </div>

                      {probe.status === "success" ? (
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span class="text-gray-600">连接时间:</span>
                            <span class="ml-1 font-medium">{probe.connectTime}ms</span>
                          </div>
                          <div>
                            <span class="text-gray-600">DNS解析:</span>
                            <span class="ml-1 font-medium">{probe.dnsResolveTime}ms</span>
                          </div>
                          <div>
                            <span class="text-gray-600">下载速度:</span>
                            <span class="ml-1 font-medium">{probe.downloadSpeed} Mbps</span>
                          </div>
                          <div>
                            <span class="text-gray-600">丢包率:</span>
                            <span class="ml-1 font-medium">{probe.packetLoss}%</span>
                          </div>
                        </div>
                      ) : (
                        <div class="text-sm">
                          <div class="text-red-600 font-medium mb-1">
                            错误码: <Tag color={token.red}>{probe.errorCode}</Tag>
                          </div>
                          <div class="text-red-600">错误信息: {probe.errorMessage}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </DetailDiv>
            ))}

            {/* 原因分析和处理建议 */}
            <div class="mb-4 pl-[2px]">
              <div class="text-base inline-flex items-center">
                <div class="inline-block w-1 h-4 mr-2" style={{ background: token.geekblue }} />
                <span>原因分析和处理建议</span>
              </div>
            </div>

            <DetailDiv class="mb-4 pt-4 pb-4">
              <div class="space-y-4">
                {getSuggestions(info.value.InternationalExtra, getBatchProbeData(info.value.InternationalExtra)).map(
                  (suggestion, index) => (
                    <div
                      key={index}
                      class={`p-4 rounded-lg border-l-4 ${
                        suggestion.priority === "high"
                          ? "border-red-500 bg-red-50"
                          : suggestion.priority === "medium"
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-blue-500 bg-blue-50"
                      }`}
                    >
                      <div class="flex items-start">
                        <div class="flex-shrink-0">
                          <div
                            class={`w-2 h-2 rounded-full mt-2 ${
                              suggestion.priority === "high"
                                ? "bg-red-500"
                                : suggestion.priority === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                            }`}
                          />
                        </div>
                        <div class="ml-3 flex-1">
                          <div class="flex items-center justify-between mb-2">
                            <h4 class="text-base font-semibold text-gray-900">{suggestion.title}</h4>
                            <span
                              class={`text-xs px-2 py-1 rounded ${
                                suggestion.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : suggestion.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {suggestion.priority === "high"
                                ? "高优先级"
                                : suggestion.priority === "medium"
                                  ? "中优先级"
                                  : "低优先级"}
                            </span>
                          </div>
                          <p class="text-gray-700 mb-2">{suggestion.content}</p>
                          <div class="flex items-center text-sm">
                            <svg
                              class="w-4 h-4 mr-1 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              />
                            </svg>
                            <span class="text-gray-600">建议操作: {suggestion.action}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </DetailDiv>
          </>
        )}
      </Skeleton>
    </div>
  );
});

export default Detail;

const DetailDiv = styled.div`
  ${tw`rounded-lg px-6`}
  border: 1px solid ${token.colorBorderSecondary};
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border-color: ${token.colorPrimary};
  }

  .ant-descriptions {
    .ant-descriptions-item-label {
      font-weight: 600;
      color: ${token.colorTextSecondary};
      background: linear-gradient(90deg, #f8fafc 0%, #ffffff 100%);
      border-right: 1px solid ${token.colorBorder};
    }

    .ant-descriptions-item-content {
      padding: 12px 16px;
      background: #ffffff;
      transition: background-color 0.2s ease;
    }

    .ant-descriptions-item {
      border-bottom: 1px solid ${token.colorBorderSecondary};

      &:hover .ant-descriptions-item-content {
        background: #fafbff;
      }
    }

    .ant-descriptions-bordered {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid ${token.colorBorderSecondary};
    }
  }
`;

const ErrorAnalysisDiv = styled.div`
  ${tw`rounded-lg px-6`}
  border: 1px solid ${token.colorError};
  background: linear-gradient(135deg, #fff5f5 0%, #fff1f0 100%);
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.08);
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 16px rgba(255, 77, 79, 0.12);
    border-color: ${token.colorErrorHover};
  }

  .ant-descriptions {
    .ant-descriptions-item-label {
      font-weight: 600;
      color: ${token.colorError};
      background: linear-gradient(90deg, #ffebe8 0%, #fff5f5 100%);
      border-right: 1px solid ${token.colorErrorBorder};
    }

    .ant-descriptions-item-content {
      padding: 14px 16px;
      background: #ffffff;
      transition: background-color 0.2s ease;
    }

    .ant-descriptions-item {
      border-bottom: 1px solid ${token.colorErrorBorder};

      &:hover .ant-descriptions-item-content {
        background: #fff5f5;
      }
    }

    .ant-descriptions-bordered {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid ${token.colorErrorBorder};
    }
  }
`;
