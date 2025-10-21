import { getAlertDetail } from "@/services/alert";
import { typeOptions } from "@/services/alert/contant";
import { AlertType, InternationalExtra } from "@/services/alert/interface";
import { getDuration } from "@/utils/config";
import { token } from "@/utils/theme";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import styled, { tw } from "@vue-styled-components/core";
import { Descriptions, Skeleton, Divider, Tag } from "ant-design-vue";
import dayjs from "dayjs";
import { defineComponent, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { css } from "@emotion/css";
import { internationalDownloadAnomalyData } from "./data";

const Detail = defineComponent(() => {
  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);
  const info = ref<AlertType>();

  watchEffect(async () => {
    try {
      loading.value = true;

      info.value = internationalDownloadAnomalyData.find((item) => item.eventId === route.query.eventId);
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
            <span class="text-base ">国际探测告警详情</span>
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
              <div class="text-base inline-flex items-center px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
                <div class="inline-block w-1 h-5 mr-3 rounded-full bg-blue-500" />
                <span class="font-semibold text-blue-900">同批探测结果</span>
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

                      {/* 诊断步骤 */}
            <div class="mb-4 pl-[2px]">
              <div class="text-base inline-flex items-center px-3 py-2 rounded-lg bg-purple-50 border border-purple-100">
                <div class="inline-block w-1 h-5 mr-3 rounded-full bg-purple-500" />
                <span class="font-semibold text-purple-900">诊断步骤</span>
              </div>
            </div>

            <DetailDiv class="mb-4 pt-4 pb-4">
              <div class="space-y-3">
                {[
                  `ping ${info.value?.InternationalExtra?.dataSourceUrl} - 检查目标服务器连通性`,
                  `traceroute ${info.value?.InternationalExtra?.dataSourceUrl} - 检查网络路由路径`,
                  `curl -I ${info.value?.InternationalExtra?.dataSourceUrl} - 检查HTTP响应状态`,
                  `nslookup ${info.value?.InternationalExtra?.dataSourceUrl} - 检查DNS解析`,
                  `telnet ${info.value?.InternationalExtra?.dataSourceUrl} 443 - 检查HTTPS端口连通性`
                ].map((step, index) => (
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

            {/* 备用方案 */}
            <div class="mb-4 pl-[2px]">
              <div class="text-base inline-flex items-center px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-100">
                <div class="inline-block w-1 h-5 mr-3 rounded-full bg-yellow-500" />
                <span class="font-semibold text-yellow-900">备用方案</span>
              </div>
            </div>

            <DetailDiv class="mb-4 pt-4 pb-4">
              <div class="space-y-3">
                {[
                  { name: "切换至其他国际数据源", description: "使用EMBL-EBI、DDBJ等其他国际生物信息数据库" },
                  { name: "使用国内镜像站点", description: "切换至国内的数据中心镜像，提高访问速度" },
                  { name: "调整探测工具", description: "更换探测工具，如从curl切换到wget或其他HTTP客户端" },
                  { name: "更改探测节点", description: "使用其他地理位置的探测节点重新尝试连接" },
                  { name: "启用备用网络路径", description: "通过VPN或专线等其他网络路径访问目标服务" }
                ].map((option, index) => (
                  <div key={index} class="flex items-start space-x-3">
                    <div class="flex-shrink-0 mt-1">
                      <div class="w-2 h-2 rounded-full bg-yellow-500" />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-700"><strong>{option.name}:</strong> {option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DetailDiv>

            {/* 推荐操作 */}
            <div class="mb-4 pl-[2px]">
              <div class="text-base inline-flex items-center px-3 py-2 rounded-lg bg-green-50 border border-green-100">
                <div class="inline-block w-1 h-5 mr-3 rounded-full bg-green-500" />
                <span class="font-semibold text-green-900">推荐操作</span>
              </div>
            </div>

            <DetailDiv class="mb-4 pt-4 pb-4">
              <div class="space-y-3">
                {[
                  {
                    action: "立即联系目标服务器管理员",
                    details: `向${info.value?.InternationalExtra?.dataSource}的运维团队报告连接问题`
                  },
                  {
                    action: "检查本地网络配置",
                    details: "确认本地网络设备、防火墙和代理设置是否正常"
                  },
                  {
                    action: "增加探测频率",
                    details: "提高探测频率以密切监控服务恢复情况"
                  },
                  {
                    action: "启用自动切换机制",
                    details: "配置自动切换到备用数据源的机制，确保服务连续性"
                  },
                  {
                    action: "更新监控告警阈值",
                    details: "根据历史数据调整告警阈值，减少误报和漏报"
                  }
                ].map((recommendation, index) => (
                  <div key={index} class="flex items-start space-x-3">
                    <div class="flex-shrink-0 mt-1">
                      <div class="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-700"><strong>{recommendation.action}:</strong> {recommendation.details}</p>
                    </div>
                  </div>
                ))}
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
