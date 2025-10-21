import { defineComponent, reactive, ref, watchEffect } from "vue";
import { Divider, Select, Space, Table, TableProps, Tag } from "ant-design-vue";
import { getBgpListPage, getBgpStatistic } from "@/services/as";
import { getTimestampArr } from "@/components/datePicker/config";
import dayjs from "dayjs";
import { ColumnProps } from "ant-design-vue/es/table";
import { BgpStatisticProps, BGPUpdateType } from "@/services/as/interface";
import { css } from "@emotion/css";
import { token } from "@/utils/theme";
import CustomDatePicker from "@/components/datePicker/Index";
import { getIPprefixUrl } from "@/utils/config";
import { useRouter } from "vue-router";
import { DeInput } from "@/components/ant";
import BgpStatistic from "./components/bgp/BgpStatistic";

const typeOptions = [
  {
    label: "宣告",
    value: "A",
  },
  {
    label: "撤销",
    value: "W",
  },
];

const ipTypeOptions = [
  {
    label: "IPv4",
    value: "4",
  },
  {
    label: "IPv6",
    value: "6",
  },
];

const collectorOptions = [
  "rrc00",
  "rrc06",
  "rrc11",
  "rrc23",
  "route-views2",
  "route-views.chicago",
  "route-views.wide",
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

const BgpPage = defineComponent(
  (props) => {
    const router = useRouter();
    const targetNode = ref<HTMLDivElement | null>(null);
    const initHeight = ref(0);
    const time = ref("now-24h~now");
    const loading = ref(false);
    const statisticLoading = ref(false);
    const search = reactive({
      current: 1,
      pageSize: 50,
      updateType: undefined,
      routePrefix: undefined,
      asPath: undefined,
      ipType: undefined,
      collectors: [collectorOptions[0]],
    });
    const list = ref<BGPUpdateType[]>([]);
    const bgpStatisticNum = reactive({ w: 0, a: 0 });
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

    const data = ref<BgpStatisticProps[]>([]);

    watchEffect(async () => {
      try {
        const timestampArr = getTimestampArr(time.value);
        statisticLoading.value = true;
        const res = await getBgpStatistic({
          ...search,
          targetAsnList: props.value ? [props.value] : [],
          searchStartTime: timestampArr![0],
          searchEndTime: timestampArr![1],
        });
        if (res.code !== 200) {
          throw new Error();
        }
        bgpStatisticNum.a = res.data?.reduce((acc, cur) => acc + cur.a, 0);
        bgpStatisticNum.w = res.data?.reduce((acc, cur) => acc + cur.w, 0);
        pagination.total = bgpStatisticNum.a + bgpStatisticNum.w;
        data.value = res.data ?? [];
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
        const timestampArr = getTimestampArr(time.value);
        loading.value = true;
        const res = await getBgpListPage({
          ...search,
          targetAsnList: props.value ? [props.value] : [],
          searchStartTime: timestampArr![0],
          searchEndTime: timestampArr![1],
        });
        if (res.code !== 200) {
          throw new Error();
        }
        list.value = res.data?.data ?? [];
        // pagination.total = res.data?.total ?? 0;
        pagination.current = res.data?.current ?? 1;
        pagination.pageSize = res.data?.pageSize ?? 20;
        loading.value = false;
      } catch (error) {
        loading.value = false;
      }
    });

    const handleTableChange: TableProps["onChange"] = (pag) => {
      search.pageSize = pag.pageSize || 50;
      search.current = pag?.current || 1;
    };

    const columns: ColumnProps<BGPUpdateType>[] = [
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
        title: "时间",
        dataIndex: "timestamp",
        width: 180,
        customRender: ({ text }) => {
          return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        },
        fixed: "left",
      },
      {
        title: "AS号",
        dataIndex: "targetAsn",
        width: 100,
        customRender: ({ text }) => {
          return <a onClick={() => router.push(`/as/base?as=${text}`)}>{text}</a>;
        },
      },
      {
        title: "路由前缀",
        dataIndex: "routePrefix",
        width: 180,
        customRender: ({ text }) => {
          return <a onClick={() => window.open(getIPprefixUrl(text))}>{text}</a>;
        },
      },
      {
        title: "前缀类型",
        dataIndex: "ipType",
        width: 100,
        customRender: ({ text }) => {
          return ipTypeOptions.find((item) => item.value === text)?.label;
        },
      },
      {
        title: "AS路径",
        dataIndex: "asPath",
        width: 280,
        customRender: ({ text }) => {
          const arr = text?.split(" ") ?? [];
          const lastArr: { label: string; num: number }[] = [];
          arr.forEach((n) => {
            const info = lastArr.at(-1);
            if (info && info?.label === n) {
              info.num = info.num + 1;
            } else {
              lastArr.push({ label: n, num: 1 });
            }
          });
          const lastArrSpan = lastArr.map((item, i) => {
            return (
              <span>
                <a onClick={() => router.push(`/as/base?as=${item.label}`)}>{item.label}</a>
                {item.num > 1 ? (
                  <span
                    style={{ background: token.C5, color: token.colorText }}
                    class="inline-block px-[6px] rounded-md ml-[1px] text-[12px]"
                  >
                    {item.num}
                  </span>
                ) : (
                  ""
                )}
                {i !== lastArr.length - 1 ? "←" : ""}
              </span>
            );
          });
          return <span>{lastArrSpan}</span>;
        },
        // fixed: "left",
      },
      {
        title: "消息类型",
        dataIndex: "updateType",
        ellipsis: true,
        width: 140,
        customRender: ({ text }) => {
          const label = typeOptions.find((item) => item.value === text)?.label;
          return <Tag color={text === "A" ? token.cyan : token.orange}>{label}</Tag>;
        },
      },
      {
        title: "采集点",
        dataIndex: "collector",
        ellipsis: true,
        width: 180,
      },
      {
        title: "协议类型",
        dataIndex: "protocolType",
        ellipsis: true,
        width: 140,
      },
      {
        title: "起源",
        dataIndex: "origin",
        width: 120,
      },
      {
        title: "自动聚合",
        dataIndex: "agStatus",
        width: 80,
        customRender: ({ text }) => {
          return text === "AG" ? "是" : "否";
        },
      },
      {
        title: "团体属性",
        dataIndex: "community",
        ellipsis: true,
        width: 200,
      },
    ];

    return () => (
      <div class="overflow-hidden h-full flex-1 flex flex-col">
        <div class="flex justify-between items-center">
          <Space class="pb-4">
            <CustomDatePicker options={timeOptions} value={time} />
            <DeInput class="w-36" placeholder="请输入路由前缀" v-model:value={search.routePrefix} allowClear />
            <DeInput class="w-36" placeholder="请输入AS路径" v-model:value={search.asPath} allowClear />
            <Select
              allowClear
              placeholder="请选择类型"
              options={typeOptions}
              class="w-36"
              v-model:value={search.updateType}
            />
            <Select
              allowClear
              placeholder="请选择前缀类型"
              options={ipTypeOptions}
              class="w-36"
              v-model:value={search.ipType}
            />
            <div>
              <span class="font-semibold text-base ml-2" style={{ color: token.C1 }}>
                宣告总数: {bgpStatisticNum.a.toLocaleString()}
              </span>
              <Divider type="vertical" />
              <span class=" font-semibold text-base" style={{ color: token.yellow }}>
                撤销总数: {bgpStatisticNum.w.toLocaleString()}
              </span>
            </div>
          </Space>
          <div>
            <span>采集点：</span>
            <Select
              class="min-w-28"
              mode="multiple"
              placeholder="请选择采集点"
              dropdownMatchSelectWidth={180}
              v-model:value={search.collectors}
              options={collectorOptions.map((n) => ({ label: n, value: n }))}
            />
          </div>
        </div>
        <div>
          <BgpStatistic data={data.value} loading={statisticLoading.value} />
        </div>
        <div class="flex-1 overflow-hidden" ref={targetNode}>
          <Table
            columns={columns}
            size="middle"
            row-key={(record: any) => record.id}
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
  },
  { props: ["value"] },
);

export default BgpPage;
