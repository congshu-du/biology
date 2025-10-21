import { token } from "@/utils/theme";
import { css } from "@emotion/css";
import { Input, Select, Space, Table } from "ant-design-vue";
import { computed, defineComponent, ref, nextTick, watchEffect, reactive } from "vue";
import dayjs from "dayjs";
import { ColumnProps, TableProps } from "ant-design-vue/es/table";
import { getBgpDataPage } from "@/services/roa";
import { BgpInfoType } from "@/services/roa/interface";
import { useRouter } from "vue-router";
import { getIPprefixUrl } from "@/utils/config";
import CustomDatePicker, { getTimestampArr } from "@/components/datePicker/Index";

// roaVerify
// integer <int32>
// 可选
// ROA验证：0：初始状态，未知，-1：无效，1：有效

let toFirshPage = true;

const verifyOptions = [
  {
    label: "未知",
    value: 0,
    bg: token.colorTextTertiary,
  },
  {
    label: "无效",
    value: -1,
    bg: token.colorError,
  },
  {
    label: "有效",
    value: 1,
    bg: token.colorSuccess,
  },
];

const BgpList = defineComponent(() => {
  const targetNode = ref<any>(null);
  const initHeight = ref<number>(0);
  const loading = ref(false);
  const list = ref<BgpInfoType[]>([]);
  const router = useRouter();

  const pagination = reactive({
    current: 1,
    pageSize: 100,
    total: 0,
    pageSizeOptions: ["100", "200", "300"],
    showTotal: (total: number) => (
      <span>
        共 <a>{total}</a> 条
      </span>
    ),
  });
  const time = ref("now-10m~now");
  const param = reactive({
    current: 1,
    pageSize: 100,
    asn: undefined,
    ipPrefix: undefined,
    roaVerify: undefined,
    ipType: undefined,
  });

  nextTick(() => {
    const ro = new ResizeObserver((entries) => {
      const { height } = entries[0].contentRect;
      initHeight.value = height as number;
    });
    ro.observe(targetNode.value);
  });

  watchEffect(async () => {
    try {
      if (toFirshPage) {
        param.current = 1;
      }
      const timestampArr = getTimestampArr(time.value);
      loading.value = true;
      const res = await getBgpDataPage({
        ...param,
        searchStartTime: timestampArr![0],
        searchEndTime: timestampArr![1],
      });
      if (res.code !== 200) {
        throw new Error();
      }
      list.value = res.data.data;
      pagination.current = res.data.current;
      pagination.total = res.data.total;
      pagination.pageSize = res.data.pageSize;
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  });

  const columns: ColumnProps<BgpInfoType>[] = [
    {
      title: "",
      dataIndex: "order",
      width: 44,
      customRender: ({ index }) => {
        return index + 1;
      },
      fixed: "left",
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      width: 180,
      customRender: ({ text }) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
      fixed: "left",
    },
    {
      title: "AS号",
      dataIndex: "asn",
      width: 180,
      customRender: ({ text }) => text && <a onClick={() => router.push(`/as/base?as=${text}`)}>AS{text}</a>,
    },
    {
      title: "IP前缀",
      dataIndex: "ipPrefix",
      width: 180,
      customRender: ({ text }) => {
        if (!text) return "-";
        return <a onClick={() => window.open(getIPprefixUrl(text))}>{text}</a>;
      },
    },
    {
      title: "RIR",
      dataIndex: "rir",
      // width: 180,
    },
    {
      title: "前缀类型",
      dataIndex: "ipType",
      ellipsis: true,
      width: 120,
      customRender: ({ text }) => {
        return text === 4 ? "IPv4" : "IPv6";
      },
    },
    {
      title: "ROA信息",
      dataIndex: "roaInfo",
      ellipsis: true,
      // width: 180,
    },
    // {
    //   title: "是否授权",
    //   dataIndex: "RIR",
    // },
    {
      title: "ROV结果",
      dataIndex: "roaVerify",
      customRender: ({ text }) => {
        const item = verifyOptions.find((n) => n.value === text);
        return (
          <span style={{ background: item?.bg, padding: "1px 10px", borderRadius: "4px", display: "inline-block" }}>
            {item?.label}
          </span>
        );
      },
    },
  ];

  const handleTableChange: TableProps["onChange"] = (pag) => {
    param.pageSize = pag.pageSize || 50;
    param.current = pag?.current || 1;
    toFirshPage = false;
  };

  return () => (
    <div class="flex flex-col h-full">
      <div class="p-4 relative">
        <Space>
          <Input v-model:value={param.asn} allowClear class="w-32" placeholder="请输入AS号" />
          <Input v-model:value={param.ipPrefix} allowClear class="w-36" placeholder="请输入IP前缀" />
          <Select
            placeholder="请选择前缀类型"
            class="w-36"
            v-model:value={param.ipType}
            options={[
              {
                label: "IPv4",
                value: 4,
              },
              {
                label: "IPv6",
                value: 6,
              },
            ]}
            allowClear
          />
          <Select
            options={verifyOptions}
            allowClear
            v-model:value={param.roaVerify}
            class="w-36"
            placeholder="请选择ROV结果"
          />
          <CustomDatePicker value={time} />
        </Space>
      </div>
      <div class="flex-1 overflow-y-hidden px-4" ref={targetNode}>
        <Table
          columns={columns}
          size="middle"
          row-key={(record: any) => record.eventId}
          data-source={list.value}
          pagination={pagination}
          loading={loading.value}
          scroll={{ y: initHeight.value - 104 }}
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

export default BgpList;
