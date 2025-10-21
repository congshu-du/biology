import { defineComponent, reactive, ref, watchEffect } from "vue";
import { Divider, Select, Space, Table, TableProps, Tag } from "ant-design-vue";
import dayjs from "dayjs";
import { ColumnProps } from "ant-design-vue/es/table";
import { css } from "@emotion/css";
import { token } from "@/utils/theme";
import CustomDatePicker from "@/components/datePicker/Index";
import { DeInput } from "@/components/ant";
import {
  NginxDownloadLog,
  mockNginxDownloadData,
  fileTypeOptions,
  httpStatusOptions,
  countryOptions,
  downloadSourceOptions,
} from "./data";

// 状态码选项用于筛选
const statusFilterOptions = [
  { label: "成功", value: 200 },
  { label: "未找到", value: 404 },
  { label: "禁止访问", value: 403 },
  { label: "服务器错误", value: 500 },
];

// 文件大小选项用于筛选
const fileSizeOptions = [
  { label: "小于1MB", value: "small" },
  { label: "1-10MB", value: "medium" },
  { label: "大于10MB", value: "large" },
];

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

const Server = defineComponent(() => {
  const targetNode = ref<HTMLDivElement | null>(null);
  const initHeight = ref(0);
  const time = ref("now-24h~now");
  const loading = ref(false);
  const statisticLoading = ref(false);
  const search = reactive({
    current: 1,
    pageSize: 50,
    downloadSource: undefined,
    clientIp: undefined,
    requestFile: undefined,
    fileType: undefined,
    httpStatus: undefined,
    country: undefined,
  });
  const list = ref<NginxDownloadLog[]>([]);
  const downloadStats = reactive({
    success: 0,
    failed: 0,
    totalDownloads: 0,
    totalTraffic: 0,
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

  const data = ref<NginxDownloadLog[]>([]);

  watchEffect(async () => {
    try {
      statisticLoading.value = true;
      // 模拟异步加载
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 使用模拟数据并进行筛选
      let filteredData = mockNginxDownloadData.filter((item) => {
        if (search.downloadSource && item.downloadSource !== search.downloadSource) return false;
        if (search.clientIp && !item.clientIp.includes(search.clientIp)) return false;
        if (search.requestFile && !item.requestFile.includes(search.requestFile)) return false;
        if (search.fileType && item.fileType !== search.fileType) return false;
        if (search.httpStatus && item.httpStatus !== search.httpStatus) return false;
        if (search.country && item.country !== search.country) return false;
        return true;
      });

      // 计算统计数据
      downloadStats.success = filteredData.filter((item) => item.httpStatus === 200).length;
      downloadStats.failed = filteredData.filter((item) => item.httpStatus !== 200).length;
      downloadStats.totalDownloads = filteredData.reduce((acc, cur) => acc + (cur.downloadCount || 0), 0);
      downloadStats.totalTraffic = filteredData.reduce((acc, cur) => acc + cur.responseSize, 0);

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
      let filteredData = mockNginxDownloadData.filter((item) => {
        if (search.downloadSource && item.downloadSource !== search.downloadSource) return false;
        if (search.clientIp && !item.clientIp.includes(search.clientIp)) return false;
        if (search.requestFile && !item.requestFile.includes(search.requestFile)) return false;
        if (search.fileType && item.fileType !== search.fileType) return false;
        if (search.httpStatus && item.httpStatus !== search.httpStatus) return false;
        if (search.country && item.country !== search.country) return false;
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

  const columns: ColumnProps<NginxDownloadLog>[] = [
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
      title: "时间",
      dataIndex: "timestamp",
      width: 180,
      customRender: ({ text }) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
      fixed: "left",
    },
    {
      title: "下载源",
      dataIndex: "downloadSource",
      width: 130,
      customRender: ({ text }) => {
        return <span style={{ fontFamily: "monospace" }}>{text}</span>;
      },
    },
    {
      title: "客户端IP",
      dataIndex: "clientIp",
      width: 130,
      customRender: ({ text }) => {
        return <span style={{ fontFamily: "monospace" }}>{text}</span>;
      },
    },
    {
      title: "请求文件",
      dataIndex: "requestFile",
      width: 200,
      ellipsis: true,
      customRender: ({ text }) => {
        return (
          <span title={text} style={{ fontFamily: "monospace" }}>
            {text}
          </span>
        );
      },
    },
    {
      title: "文件类型",
      dataIndex: "fileType",
      width: 100,
      customRender: ({ text }) => {
        const option = fileTypeOptions.find((item) => item.value === text);
        return option ? <Tag color={token.blue}>{option.label}</Tag> : <Tag>{text}</Tag>;
      },
    },
    {
      title: "文件大小",
      dataIndex: "fileSize",
      width: 120,
      customRender: ({ text }) => {
        const size = text as number;
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
      },
    },
    {
      title: "状态码",
      dataIndex: "httpStatus",
      width: 100,
      customRender: ({ text }) => {
        const status = text as number;
        const option = httpStatusOptions.find((item) => item.value === status);
        return option ? (
          <Tag color={option.color}>{option.label}</Tag>
        ) : (
          <Tag color={status === 200 ? "green" : "red"}>{status}</Tag>
        );
      },
    },
    {
      title: "响应大小",
      dataIndex: "responseSize",
      width: 120,
      customRender: ({ text }) => {
        const size = text as number;
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
      },
    },
    {
      title: "下载耗时",
      dataIndex: "downloadTime",
      width: 100,
      customRender: ({ text }) => {
        return `${text}ms`;
      },
    },
    {
      title: "国家",
      dataIndex: "country",
      width: 80,
    },
    {
      title: "城市",
      dataIndex: "city",
      width: 100,
    },
    {
      title: "ISP",
      dataIndex: "isp",
      width: 120,
      ellipsis: true,
      customRender: ({ text }) => {
        return <span title={text}>{text}</span>;
      },
    },
    {
      title: "User Agent",
      dataIndex: "userAgent",
      width: 200,
      ellipsis: true,
      customRender: ({ text }) => {
        return <span title={text}>{text}</span>;
      },
    },
    {
      title: "域名",
      dataIndex: "domain",
      ellipsis: true,
      width: 150,
      customRender: ({ text }) => {
        return <span style={{ fontFamily: "monospace" }}>{text}</span>;
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
            placeholder="请选择下载源"
            options={downloadSourceOptions}
            class="w-36"
            v-model:value={search.downloadSource}
          />
          <DeInput class="w-36" placeholder="请输入客户端IP" v-model:value={search.clientIp} allowClear />
          <DeInput class="w-36" placeholder="请输入文件名" v-model:value={search.requestFile} allowClear />
          <Select
            allowClear
            placeholder="请选择文件类型"
            options={fileTypeOptions}
            class="w-36"
            v-model:value={search.fileType}
          />
          <Select
            allowClear
            placeholder="请选择状态码"
            options={httpStatusOptions}
            class="w-36"
            v-model:value={search.httpStatus}
          />
          <Select
            allowClear
            placeholder="请选择国家"
            options={countryOptions}
            class="w-36"
            v-model:value={search.country}
          />
          <div>
            <span class="font-semibold text-base ml-2" style={{ color: token.green }}>
              成功下载: {downloadStats.success.toLocaleString()}
            </span>
            <Divider type="vertical" />
            <span class=" font-semibold text-base" style={{ color: token.red }}>
              失败次数: {downloadStats.failed.toLocaleString()}
            </span>
            <Divider type="vertical" />
            <span class=" font-semibold text-base" style={{ color: token.blue }}>
              总流量: {(downloadStats.totalTraffic / (1024 * 1024 * 1024)).toFixed(2)} GB
            </span>
          </div>
        </Space>
      </div>
      <div class="flex-1 overflow-hidden" ref={targetNode}>
        <Table
          columns={columns}
          size="large"
          row-key={(record: NginxDownloadLog) => record.id}
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
    </div>
  );
});

export default Server;
