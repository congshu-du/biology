import { defineComponent, reactive, ref, watchEffect } from "vue";
import { Divider, Select, Space, Table, TableProps, Tag, Button } from "ant-design-vue";
import dayjs from "dayjs";
import { ColumnProps } from "ant-design-vue/es/table";
import { css } from "@emotion/css";
import { token } from "@/utils/theme";
import CustomDatePicker from "@/components/datePicker/Index";
import { DeInput } from "@/components/ant";
import {
  ProbeRecord,
  ProbeStats,
  mockProbeData,
  probePointOptions,
  dataSourceOptions,
  probeToolOptions,
  probeStatusOptions,
  performanceLevelOptions,
} from "./data";
import DetectionDetail from "./DetectionDetail";

export const timeOptions = [
  { label: "最近10分钟", value: "now-10m~now" },
  { label: "最近30分钟", value: "now-30m~now" },
  { label: "最近1小时", value: "now-1h~now" },
  { label: "最近4小时", value: "now-4h~now" },
  { label: "最近12小时", value: "now-12h~now" },
  { label: "最近24小时", value: "now-24h~now" },
  { label: "最近7天", value: "now-7d~now" },
  { label: "最近30天", value: "now-30d~now" },
  { label: "最近60天", value: "now-60d~now" },
];

const Detection = defineComponent(() => {
  const targetNode = ref<HTMLDivElement | null>(null);
  const initHeight = ref(0);
  const time = ref("now-24h~now");
  const loading = ref(false);
  const statisticLoading = ref(false);
  const search = reactive({
    current: 1,
    pageSize: 50,
    probePoint: undefined,
    probeIp: undefined,
    dataSource: undefined,
    tool: undefined,
    status: undefined,
    performanceLevel: undefined,
    targetCountry: undefined,
  });
  const list = ref<ProbeRecord[]>([]);
  const probeStats = reactive<ProbeStats>({
    totalProbes: 0,
    successRate: 0,
    averageResponseTime: 0,
    avgDownloadSpeed: 0,
    avgPacketLoss: 0,
    activeProbes: 0,
    criticalAlerts: 0,
    lastUpdateTime: "",
  });
  const pagination = reactive({
    total: 0,
    current: 1,
    pageSize: 50,
    showTotal: (total: number) => (
      <span>
        共 <a>{total.toLocaleString()}</a> 条
      </span>
    ),
  });

  const data = ref<ProbeRecord[]>([]);
  const detailVisible = ref(false);
  const selectedRecord = ref<ProbeRecord | null>(null);

  // 性能等级判断函数
  const getPerformanceLevel = (responseTime: number) => {
    if (responseTime < 50) return "excellent";
    if (responseTime < 200) return "good";
    if (responseTime < 500) return "average";
    return "poor";
  };

  watchEffect(async () => {
    try {
      statisticLoading.value = true;
      // 模拟异步加载
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 使用模拟数据并进行筛选
      const filteredData = mockProbeData.filter((item) => {
        if (search.probePoint && item.probePoint !== search.probePoint) return false;
        if (search.probeIp && !item.probeIp.includes(search.probeIp)) return false;
        if (search.dataSource && item.dataSource !== search.dataSource) return false;
        if (search.tool && !item.toolResults.some((tool) => tool.tool === search.tool)) return false;
        if (search.status && item.overallStatus !== search.status) return false;
        if (search.performanceLevel && getPerformanceLevel(item.bestResponseTime) !== search.performanceLevel)
          return false;
        if (search.targetCountry && item.targetCountry !== search.targetCountry) return false;
        return true;
      });

      // 计算统计数据 - 基于新的数据结构
      const successCount = filteredData.filter((item) => item.overallStatus === "success").length;
      const failedCount = filteredData.filter((item) => item.overallStatus === "failed").length;
      const timeoutCount = filteredData.filter((item) => item.overallStatus === "timeout").length;

      probeStats.totalProbes = filteredData.length;
      probeStats.successRate = filteredData.length > 0 ? (successCount / filteredData.length) * 100 : 0;
      probeStats.averageResponseTime =
        filteredData.length > 0
          ? filteredData.reduce((acc, cur) => acc + cur.bestResponseTime, 0) / filteredData.length
          : 0;

      // 计算平均下载速度 - 取成功工具的平均值
      let totalDownloadSpeed = 0;
      let successToolCount = 0;
      filteredData.forEach((item) => {
        item.toolResults.forEach((tool) => {
          if (tool.status === "success" && tool.downloadSpeed) {
            totalDownloadSpeed += tool.downloadSpeed;
            successToolCount++;
          }
        });
      });
      probeStats.avgDownloadSpeed = successToolCount > 0 ? totalDownloadSpeed / successToolCount : 0;

      // 计算平均丢包率
      let totalPacketLoss = 0;
      let packetLossCount = 0;
      filteredData.forEach((item) => {
        item.toolResults.forEach((tool) => {
          if (tool.packetLoss !== undefined) {
            totalPacketLoss += tool.packetLoss;
            packetLossCount++;
          }
        });
      });
      probeStats.avgPacketLoss = packetLossCount > 0 ? totalPacketLoss / packetLossCount : 0;

      probeStats.activeProbes = new Set(filteredData.map((item) => item.probePoint)).size;
      probeStats.criticalAlerts = failedCount + timeoutCount;
      probeStats.lastUpdateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

      pagination.total = filteredData.length;
      data.value = filteredData;
      statisticLoading.value = false;
    } catch (error) {
      statisticLoading.value = false;
    }
  });

  watchEffect(() => {
    if (targetNode.value) {
      const ro = new ResizeObserver((entries) => {
        const { height } = entries[0].contentRect;
        initHeight.value = height as number;
      });
      ro.observe(targetNode.value);
    }
  });

  watchEffect(async () => {
    try {
      loading.value = true;
      // 模拟异步加载
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 使用模拟数据并进行筛选
      const filteredData = mockProbeData.filter((item) => {
        if (search.probePoint && item.probePoint !== search.probePoint) return false;
        if (search.probeIp && !item.probeIp.includes(search.probeIp)) return false;
        if (search.dataSource && item.dataSource !== search.dataSource) return false;
        if (search.tool && !item.toolResults.some((tool) => tool.tool === search.tool)) return false;
        if (search.status && item.overallStatus !== search.status) return false;
        if (search.performanceLevel && getPerformanceLevel(item.bestResponseTime) !== search.performanceLevel)
          return false;
        if (search.targetCountry && item.targetCountry !== search.targetCountry) return false;
        return true;
      });

      // 分页处理
      const startIndex = (search.current - 1) * search.pageSize;
      const endIndex = startIndex + search.pageSize;
      list.value = filteredData.slice(startIndex, endIndex);

      pagination.total = filteredData.length;
      pagination.current = search.current;
      pagination.pageSize = search.pageSize;
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  });

  const handleTableChange: TableProps["onChange"] = (pag) => {
    search.pageSize = pag.pageSize || 50;
    search.current = pag?.current || 1;
  };

  const handleViewDetail = (record: ProbeRecord) => {
    selectedRecord.value = record;
    detailVisible.value = true;
  };

  const handleCloseDetail = () => {
    detailVisible.value = false;
    selectedRecord.value = null;
  };

  const columns: ColumnProps<ProbeRecord>[] = [
    {
      title: "",
      dataIndex: "order",
      width: 50,
      customRender: ({ index }) => {
        return index + 1;
      },
      fixed: "left",
    },
    {
      title: "探测时间",
      dataIndex: "timestamp",
      width: 180,
      customRender: ({ text }) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
      fixed: "left",
    },
    {
      title: "探测点",
      dataIndex: "probePoint",
      width: 100,
      customRender: ({ text }) => {
        return <Tag color={token.blue}>{text}</Tag>;
      },
    },
    {
      title: "探测点IP",
      dataIndex: "probeIp",
      width: 130,
      customRender: ({ text }) => {
        return <span style={{ fontFamily: "monospace" }}>{text}</span>;
      },
    },
    {
      title: "数据源",
      dataIndex: "dataSource",
      width: 120,
      customRender: ({ text }) => {
        const colors = { NCBI: token.green, "EMBL-EBI": token.blue, DDBJ: token.orange };
        return <Tag color={colors[text as keyof typeof colors]}>{text}</Tag>;
      },
    },
    {
      title: "状态",
      dataIndex: "overallStatus",
      width: 100,
      customRender: ({ text, record }) => {
        const option = probeStatusOptions.find((item) => item.value === text);
        return (
          <Space>
            {option ? <Tag color={option.color}>{option.label}</Tag> : <Tag>{text}</Tag>}
            {/* <span style={{ fontSize: "12px", color: "#666" }}>
              ({record.successToolCount}/{record.totalToolCount})
            </span> */}
          </Space>
        );
      },
    },
    {
      title: "最佳响应时间",
      dataIndex: "bestResponseTime",
      width: 140,
      customRender: ({ text }) => {
        const level = getPerformanceLevel(text);
        const colors = {
          excellent: token.green,
          good: token.blue,
          average: token.orange,
          poor: token.red,
        };
        return <span style={{ color: colors[level as keyof typeof colors], fontWeight: "bold" }}>{text}ms</span>;
      },
    },
    // {
    //   title: "成功工具数",
    //   key: "successTools",
    //   width: 120,
    //   customRender: ({ record }) => {
    //     const successTools = record.toolResults.filter((tool) => tool.status === "success");
    //     return (
    //       <Space>
    //         <Tag color="green">{successTools.length}</Tag>
    //         <span style={{ fontSize: "12px", color: "#666" }}>
    //           {successTools.map((tool) => tool.tool.toUpperCase()).join(", ")}
    //         </span>
    //       </Space>
    //     );
    //   },
    // },
    {
      title: "平均下载速度",
      key: "avgDownloadSpeed",
      width: 140,
      customRender: ({ record }) => {
        const successTools = record.toolResults.filter((tool) => tool.status === "success" && tool.downloadSpeed);
        if (successTools.length === 0) return "-";
        const avgSpeed = successTools.reduce((acc, tool) => acc + (tool.downloadSpeed || 0), 0) / successTools.length;
        return `${avgSpeed.toFixed(1)} Mbps`;
      },
    },
    {
      title: "平均丢包率",
      key: "avgPacketLoss",
      width: 120,
      customRender: ({ record }) => {
        const toolsWithPacketLoss = record.toolResults.filter((tool) => tool.packetLoss !== undefined);
        if (toolsWithPacketLoss.length === 0) return "-";
        const avgPacketLoss =
          toolsWithPacketLoss.reduce((acc, tool) => acc + (tool.packetLoss || 0), 0) / toolsWithPacketLoss.length;
        return `${avgPacketLoss.toFixed(1)}%`;
      },
    },
    {
      title: "目标国家",
      dataIndex: "targetCountry",
      width: 100,
    },
    {
      title: "地理距离",
      dataIndex: "distance",
      width: 100,
      customRender: ({ text }) => {
        return `${text}km`;
      },
    },
    {
      title: "路由跳数",
      dataIndex: "hopCount",
      width: 100,
      customRender: ({ text }) => {
        return text || "-";
      },
    },
    {
      title: "网络路径",
      dataIndex: "networkPath",
      width: 180,
      ellipsis: true,
      customRender: ({ text }) => {
        return <span title={text}>{text}</span>;
      },
    },
    {
      title: "错误信息",
      dataIndex: "errorMessage",
      width: 150,
      ellipsis: true,
      customRender: ({ text }) => {
        return text ? (
          <span title={text} style={{ color: token.red }}>
            {text}
          </span>
        ) : (
          "-"
        );
      },
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      fixed: "right",
      customRender: ({ record }) => {
        return (
          <Space>
            <Button type="link" size="small" onClick={() => handleViewDetail(record)} style={{ padding: "0 4px" }}>
              详情
            </Button>
          </Space>
        );
      },
    },
  ];

  return () => (
    <div class="overflow-hidden h-full flex-1 flex flex-col p-4">
      <div class="flex justify-between items-center">
        <Space class="pb-4">
          <CustomDatePicker options={timeOptions} value={time} />
          <Select
            allowClear
            placeholder="请选择探测点"
            options={probePointOptions}
            class="w-36"
            v-model:value={search.probePoint}
          />
          <DeInput class="w-36" placeholder="请输入探测点IP" v-model:value={search.probeIp} allowClear />
          <Select
            allowClear
            placeholder="请选择数据源"
            options={dataSourceOptions}
            class="w-36"
            v-model:value={search.dataSource}
          />
          <Select
            allowClear
            placeholder="请选择探测工具"
            options={probeToolOptions}
            class="w-36"
            v-model:value={search.tool}
          />
          <Select
            allowClear
            placeholder="请选择状态"
            options={probeStatusOptions}
            class="w-36"
            v-model:value={search.status}
          />
          <Select
            allowClear
            placeholder="请选择性能等级"
            options={performanceLevelOptions}
            class="w-40"
            v-model:value={search.performanceLevel}
          />
          <div>
            <span class="font-semibold text-base ml-2" style={{ color: token.green }}>
              总探测: {probeStats.totalProbes.toLocaleString()}
            </span>
            <Divider type="vertical" />
            <span class="font-semibold text-base" style={{ color: token.blue }}>
              成功率: {probeStats.successRate.toFixed(1)}%
            </span>
            <Divider type="vertical" />
            <span class="font-semibold text-base" style={{ color: token.orange }}>
              平均响应: {probeStats.averageResponseTime.toFixed(0)}ms
            </span>
            <Divider type="vertical" />
            <span class="font-semibold text-base" style={{ color: token.purple }}>
              活跃节点: {probeStats.activeProbes}
            </span>
          </div>
        </Space>
      </div>
      <div class="flex-1 overflow-hidden" ref={targetNode}>
        <Table
          columns={columns}
          size="large"
          row-key={(record: ProbeRecord) => record.id}
          data-source={list.value}
          pagination={pagination}
          loading={loading.value}
          scroll={{ y: initHeight.value - 47 - 56 }}
          onChange={handleTableChange}
          class={css`
            .ant-table {
              margin-top: 1px;
              box-shadow: 0 0 0 1px ${token.colorBorderSecondary};
              tr.ant-table-row:last-child > .ant-table-cell {
                border-bottom-color: transparent !important;
              }
              .ant-table-tbody-virtual-holder-inner > div:last-child .ant-table-cell {
                border-bottom-color: transparent !important;
              }
              .ant-table-placeholder > td {
                border-bottom-color: transparent !important;
              }
            }
          `}
        />
      </div>

      {/* 详情页 */}
      {detailVisible.value && (
        <DetectionDetail visible={detailVisible.value} record={selectedRecord.value} onClose={handleCloseDetail} />
      )}
    </div>
  );
});

export default Detection;
