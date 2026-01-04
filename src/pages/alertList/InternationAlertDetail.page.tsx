import { typeOptions } from "@/services/alert/contant";
import { AlertType, InternationalExtra } from "@/services/alert/interface";
import { useAlertList } from "@/store";
import { getDuration } from "@/utils/config";
import { token } from "@/utils/theme";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import styled, { tw } from "@vue-styled-components/core";
import { Descriptions, Skeleton, Divider, Tag } from "ant-design-vue";
import dayjs from "dayjs";
import { defineComponent, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

const option = [
  { label: "NCBI（美国国家生物技术信息中心）", value: "NCBI" },
  { label: "EMBL-EBI（EMBL 的欧洲生物信息学研究所）", value: "EMBL-EBI" },
  { label: "DDBJ（生物信息与 DDBJ 中心）", value: "DDBJ" },
];

const Detail = defineComponent(() => {
  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);
  const info = ref<AlertType>();
  const alertList = useAlertList();

  watchEffect(async () => {
    try {
      loading.value = true;

      info.value = alertList.list.find((item) => item.eventId === route.query.eventId);
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

  // 获取同批探测数据（从数据中读取）
  const getBatchProbeData = (currentProbe: InternationalExtra) => {
    const batchData = [
      // 同一探测点到所有数据源的探测结果（判断是否是该IP的问题）
      {
        title: `同批次 ${currentProbe.probePoint} 到所有数据源探测结果`,
        data: currentProbe.sameProbeToAllSources || [],
      },
      // 所有探测点到同一数据源的探测结果（判断是否是该数据源的问题）
      {
        title: `同批次所有探测点到 ${currentProbe.dataSource} 的探测结果`,
        data: currentProbe.allProbesToSameSource || [],
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
            {info.value?.InternationalExtra && (
              <>
                <Descriptions.Item label="异常IP" span={2}>
                  <div class="flex items-center space-x-3">
                    <span class="text-lg font-mono font-bold text-red-600">
                      {info.value.InternationalExtra.probeIp}
                    </span>
                    {getStatusTag(info.value.InternationalExtra.status)}
                    {info.value.InternationalExtra.errorCode && (
                      <Tag color={token.red}>错误码: {info.value.InternationalExtra.errorCode}</Tag>
                    )}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="探测点">
                  <span class="font-semibold text-blue-600">{info.value.InternationalExtra.probePoint}</span>
                </Descriptions.Item>
                <Descriptions.Item label="探测工具">
                  <div class="flex items-center space-x-2">
                    {getToolTag(info.value.InternationalExtra.tool)}
                    {getStatusTag(info.value.InternationalExtra.status)}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="目标数据源">{info.value.InternationalExtra.dataSource}</Descriptions.Item>
                <Descriptions.Item label="目标URL" span={1}>
                  <span class=" break-all">{info.value.InternationalExtra.dataSourceUrl}</span>
                </Descriptions.Item>
              </>
            )}
            <Descriptions.Item label="告警时间">
              {dayjs(info.value?.startTime).format("YYYY-MM-DD HH:mm:ss")}
            </Descriptions.Item>
          </Descriptions>
        </DetailDiv>

        {info.value?.InternationalExtra && (
          <>
            {/* 诊断结论 */}
            {info.value.InternationalExtra.errorMessage && (
              <>
                <div class="mb-4 pl-[2px]">
                  <div class="text-base inline-flex items-center px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                    <div class="inline-block w-1 h-5 mr-3 rounded-full bg-red-500" />
                    <span class="font-semibold text-red-900">诊断结论</span>
                  </div>
                </div>

                <ErrorAnalysisDiv class="mb-4 pt-4 pb-4">
                  <div class="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <div class="flex items-start space-x-3">
                      <div class="flex-shrink-0 mt-1">
                        <svg class="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <h4 class="text-base font-bold text-red-900 mb-2">
                          {getToolTag(info.value.InternationalExtra.tool)} 探测失败
                        </h4>
                        <p class="text-sm text-red-800 font-medium mb-3">
                          探测点 <span class="font-bold">{info.value.InternationalExtra.probePoint}</span> 使用{" "}
                          <span class="font-bold">{info.value.InternationalExtra.tool}</span> 工具探测{" "}
                          <span class="font-bold">{info.value.InternationalExtra.dataSource}</span> 时失败。
                        </p>
                        <div class="bg-white rounded-lg p-3 border border-red-200">
                          <div class="grid grid-cols-1 gap-2 text-sm">
                            <div class="flex items-center">
                              <span class="text-gray-600 w-20">错误码:</span>
                              <Tag color={token.red}>{info.value.InternationalExtra.errorCode}</Tag>
                            </div>
                            <div class="flex items-start">
                              <span class="text-gray-600 w-20 flex-shrink-0">错误信息:</span>
                              <span class="text-red-700 font-medium flex-1">
                                {info.value.InternationalExtra.errorMessage}
                              </span>
                            </div>
                            <div class="flex items-start">
                              <span class="text-gray-600 w-20 flex-shrink-0">问题原因:</span>
                              <span class="text-gray-800 flex-1">
                                {getErrorReason(
                                  info.value.InternationalExtra.errorCode || 0,
                                  info.value.InternationalExtra.errorMessage || "",
                                  info.value.InternationalExtra.tool,
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
            {/* <div class="mb-4 pl-[2px]">
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
                  `telnet ${info.value?.InternationalExtra?.dataSourceUrl} 443 - 检查HTTPS端口连通性`,
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
            </DetailDiv> */}

            {/* 备用方案 */}
            <div class="mb-4 pl-[2px]">
              <div class="text-base inline-flex items-center px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-100">
                <div class="inline-block w-1 h-5 mr-3 rounded-full bg-yellow-500" />
                <span class="font-semibold text-yellow-900">解决方案推荐</span>
              </div>
            </div>

            <DetailDiv class="mb-4 pt-4 pb-4">
              <div class="space-y-3">
                {[
                  {
                    name: "使用应急服务系统进行下载",
                    description: (
                      <a href="http://bdbe.cn/bak/" target="_blank" style="color:#4db8ff;text-decoration:underline;">
                        应急服务系统
                      </a>
                    ),
                  },
                ].map((option, index) => (
                  <div key={index} class="flex items-start space-x-3">
                    <div class="flex-shrink-0 mt-1">
                      <div class="w-2 h-2 rounded-full bg-yellow-500" />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-700">
                        <strong>{option.name}:</strong> {option.description}
                      </p>
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
`;
