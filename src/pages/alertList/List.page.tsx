import { computed, defineComponent, reactive, ref, watchEffect } from "vue";
import { Radio, Select, Space, Table, Tag, type TableProps } from "ant-design-vue";
import { useRequest } from "vue-request";
import ResizeObserver from "resize-observer-polyfill";
import DatePicker, { getTimestampArr } from "@/components/datePicker/Index";
import { ColumnProps } from "ant-design-vue/es/table";
import { useRouter } from "vue-router";
import EventStatistic from "./components/EventStatistic";
import dayjs from "dayjs";
import { token } from "@/utils/theme";
import Refresh from "./components/Refresh";
import { getAlertList } from "@/services/alert";
// import MoreSearch from "./components/MoreSearch";
import { AlertType } from "@/services/alert/interface";
// import { allAlertTestData } from "./data";
import { getDuration, getIPprefixUrl } from "@/utils/config";
import { DeInput } from "@/components/ant";
import { typeOptions } from "@/services/alert/contant";
import { useAlertList } from "@/store";

const attentionList = [
  {
    label: "重保用户",
    value: "7497",
  },
];

const AlertList = defineComponent(() => {
  const targetNode = ref<any>(null);
  const initHeight = ref<number>(0);
  const otherList = useAlertList();
  const time = ref("now-90d~now-60d");
  const type = ref();
  const search = reactive({
    attackerAsn: "",
    victimAsn: "",
    eventId: "",
    attentionAsnStr: "",
  });
  const searchValue = reactive<{ pageSize: number; current: number }>({
    current: 1,
    pageSize: 50,
  });
  const router = useRouter();

  watchEffect(() => {
    if (targetNode.value) {
      const ro = new ResizeObserver((entries) => {
        const { height } = entries[0].contentRect;
        initHeight.value = height as number;
      });
      ro.observe(targetNode.value);
    }
  });

  const { data, loading, refresh } = useRequest(
    () => {
      const timestampArr = getTimestampArr(time.value);
      return getAlertList({
        ...searchValue,
        ...search,
        searchStartTime: timestampArr![0],
        searchEndTime: timestampArr![1],
        eventType: type.value,
        pageSize: 20, // 限制获取最新20条数据
        current: 1,
      }).then((res) => {
        // 合并API数据和测试数据
        const apiData = res.data?.data || [];
        const mergedData = [...apiData];

        // 过滤掉国内下载流量波动（eventType === 5）的告警
        const filteredData = mergedData.filter((item) => item.eventType !== 5);

        // 按时间排序，最新的在前面
        const sortedData = filteredData.sort(
          (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
        );

        return {
          ...res.data,
          data: sortedData,
          total: sortedData.length,
        };
      });
    },
    {
      refreshDeps: [searchValue as any, type, time, search],
    },
  );

  const dataSource = computed(() => {
    const allData = data?.value?.data || [];
    const startIndex = (searchValue.current - 1) * searchValue.pageSize;
    const endIndex = startIndex + searchValue.pageSize;
    return allData.slice(startIndex, endIndex).concat(otherList.list);
  });

  const pagination = computed(() => ({
    total: data.value?.total || 0,
    current: searchValue.current || 1,
    pageSize: searchValue.pageSize || 50,
    showTotal: (total: number) => (
      <span>
        共 <a>{total}</a> 条
      </span>
    ),
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
  }));

  const columns: ColumnProps<AlertType>[] = [
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
      title: "创建时间",
      dataIndex: "startTime",
      width: 180,
      customRender: ({ text }) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
      fixed: "left",
    },
    // {
    //   title: "告警ID",
    //   dataIndex: "eventId",
    //   width: 180,
    //   // customRender: ({ index }) => {
    //   //   return index + 1;
    //   // },
    //   // fixed: "left",
    // },
    {
      title: "告警类型",
      dataIndex: "eventType",
      width: 120,
      customRender: ({ text }) => {
        let color = token.red;
        const label = typeOptions.find((item) => item.value === text)?.label;
        if (text === 1) {
          color = token.orange;
        } else if (text === 2) {
          color = token.cyan;
        } else if (text === 4) {
          color = token.geekblue;
        } else if (text === 5) {
          color = token.purple;
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    // {
    //   title: "影响范围",
    //   dataIndex: "gender",
    //   width: 100,
    //   customRender: ({ index }) => {
    //     const num = index % 3;
    //     let color = token.colorError;
    //     let text = "67%";
    //     if (num === 1) {
    //       color = token.colorWarning;
    //       text = "30%";
    //     } else if (num === 2) {
    //       color = token.colorSuccess;
    //       text = "5%";
    //     }
    //     return <Tag color={color}>{text}</Tag>;
    //   },
    // },

    {
      title: "描述",
      dataIndex: "desc",
      ellipsis: true,
      width: 380,
      customRender: ({ text, record }) => {
        // 如果desc字段有值,直接显示
        if (text) return text;

        // 否则拼接: AS1劫持了AS2的什么前缀
        const attackerAsn = record.attackerAsn;
        const victimAsn = record.victimAsn;
        const prefix = record.prefix;

        if (!attackerAsn && !victimAsn && !prefix) return "-";

        return (
          <span>
            {attackerAsn && <span>AS{attackerAsn}</span>}
            {attackerAsn && victimAsn && <span>劫持了</span>}
            {victimAsn && <span>AS{victimAsn}</span>}
            {prefix && victimAsn && <span>的</span>}
            {prefix && <span>{prefix}</span>}
            前缀
          </span>
        );
      },
    },
    {
      title: "劫持者AS号",
      dataIndex: "attackerAsn",
      ellipsis: true,
      width: 140,
      customRender: ({ text, record }) => {
        if (!text) return "-";
        const country = record?.attackerAs?.countryIso?.toLowerCase();
        return (
          <span class="inline-flex items-center ">
            <span hidden={!country} class={`text-2xl mr-2 fi fi-${country}`}></span>
            <a onClick={() => router.push(`/as/base?as=${text}`)}>AS{text}</a>
          </span>
        );
      },
    },
    {
      title: "受害者AS号",
      dataIndex: "victimAsn",
      ellipsis: true,
      width: 140,
      customRender: ({ text, record }) => {
        if (!text) return "-";
        const country = record?.victimAs?.countryIso?.toLowerCase();
        return (
          <span class="inline-flex items-center ">
            <span hidden={!country} class={`text-2xl fi fi-${country} mr-2`}></span>{" "}
            <a onClick={() => router.push(`/as/base?as=${text}`)}>AS{text}</a>
          </span>
        );
      },
    },
    {
      title: "劫持前缀",
      dataIndex: "prefix",
      ellipsis: true,
      width: 140,
      customRender: ({ text }) => {
        if (!text) return "-";
        return <a onClick={() => window.open(getIPprefixUrl(text))}>{text}</a>;
      },
    },
    {
      title: "泄露方",
      dataIndex: "leakByAsn",
      ellipsis: true,
      width: 140,
      customRender: ({ text, record }) => {
        if (!text) return "-";
        const country = record?.leakByAs?.countryIso?.toLowerCase();
        return (
          <a onClick={() => router.push(`/as/base?as=${text}`)}>
            <span hidden={!country} class={`text-xl fi fi-${country}`}></span> AS{text}
          </a>
        );
      },
    },
    {
      title: "泄露给",
      dataIndex: "leakToAsnList",
      ellipsis: true,
      width: 180,
      customRender: ({ text, record }) => {
        if (!text) return "-";
        return (
          <span>
            {text.map((item: any) => {
              const country = record?.leakToAsList?.find((n) => n.asn === item)?.countryIso?.toLowerCase();
              return (
                <a onClick={() => router.push(`/as/base?as=${item}`)}>
                  <span hidden={!country} class={`text-xl fi fi-${country}`}></span> AS{item}
                </a>
              );
            })}
          </span>
        );
      },
    },
    {
      title: "中断方",
      dataIndex: "outageAsn",
      ellipsis: true,
      width: 140,
      customRender: ({ text, record }) => {
        if (!text) return "-";
        const country = record?.outageAs?.countryIso?.toLowerCase();
        return (
          <a onClick={() => router.push(`/as/base?as=${text}`)}>
            <span hidden={!country} class={`text-xl fi fi-${country}`}></span> AS{text}
          </a>
        );
      },
    },
    {
      title: "同谋方",
      dataIndex: "conspiratorList",
      ellipsis: { showTitle: false },
      width: 140,
      customRender: ({ text }) => {
        if (!text) return "-";
        return (
          <span title={text.join(",")}>
            {text.map((n) => (
              <a onClick={() => router.push(`/as/base?as=${n}`)} class="mr-1">
                AS{n}
              </a>
            ))}
          </span>
        );
      },
    },
    // {
    //   title: "探测点",
    //   dataIndex: "InternationalExtra",
    //   ellipsis: true,
    //   width: 120,
    //   customRender: ({ text }) => {
    //     if (!text) return "-";
    //     return <Tag color={token.blue}>{text.probePoint}</Tag>;
    //   },
    // },
    // {
    //   title: "边界AS",
    //   dataIndex: "isTransitAS",
    //   width: 80,
    //   customRender: ({ index, text }) => {
    //     if (text === 1) {
    //       return "是";
    //     }
    //     return "否";
    //   },
    // },
    {
      title: "开始时间",
      dataIndex: "eventStartTime",
      width: 180,
      customRender: ({ text }) => {
        if (!text) return "-";
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "结束时间",
      dataIndex: "eventEndTime",
      width: 180,
      customRender: ({ text }) => {
        if (!text) return "-";
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "时长",
      dataIndex: "eventEndTime",
      width: 100,
      customRender: ({ record }) => {
        if (!record.eventStartTime || !record.eventEndTime) return "-";
        return getDuration(dayjs(record.eventEndTime).valueOf() - dayjs(record.eventStartTime).valueOf());
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 100,
      customRender: ({ record }) => {
        return (
          <Space>
            <a onClick={() => onDetail(record)}>详情</a>
            {record.eventType !== 4 && record.eventType !== 5 && (
              <a
                onClick={() => {
                  router.push("/alert/playback?eventId=" + record.eventId);
                }}
              >
                回放
              </a>
            )}
          </Space>
        );
      },
      fixed: "right",
    },
  ];

  const onDetail = (info: any) => {
    if (info.eventType === 4) {
      // type=4 国际探测告警跳转到专门的详情页
      router.push("/alert/international-detail?eventId=" + info.eventId);
    } else if (info.eventType === 5) {
      // type=5 国内探测告警跳转到专门的详情页
      router.push("/alert/domestic-detail?eventId=" + info.eventId);
    } else {
      // 其他类型告警跳转到通用详情页
      router.push("/alert/detail?eventId=" + info.eventId);
    }
  };

  const handleTableChange: TableProps["onChange"] = (pag) => {
    searchValue.pageSize = pag.pageSize || 50;
    searchValue.current = pag?.current || 1;
    // searchValue.sortField = sorter.field;
    // searchValue.sortOrder = sorter.order;
  };

  return () => (
    <div class="flex flex-col h-full">
      <div class="p-4 relative">
        <div class="flex items-center justify-between">
          <Space class="ml-[72px]">
            <Refresh
              onRefresh={() => {
                refresh();
              }}
            />
            <DatePicker value={time} />
            <Select
              allowClear
              placeholder="请选择类型"
              options={typeOptions}
              class="w-32"
              v-model={[type.value, "value"]}
            />
            <Radio.Group v-model:value={search.attentionAsnStr} option-type="button" options={attentionList} />
            {/* <Input
              type="number"
              class="w-36"
              placeholder="劫持者ASN"
              v-model={[search.attackerAsn, "value"]}
              allowClear
            />

            <Input
              type="number"
              class="w-36"
              placeholder="被劫持者ASN"
              v-model={[search.victimAsn, "value"]}

              allowClear
            />

            <Input class="w-36" placeholder="请输入告警ID" v-model={[search.eventId, "value"]} allowClear /> */}
          </Space>
          <div>
            <DeInput
              v-model:value={search.attentionAsnStr}
              class=" w-48"
              type="number"
              // options={attentionList}
              allowClear
              placeholder="请输入AS"
            />
          </div>
        </div>
        <EventStatistic time={time.value} type={type.value} search={search} />
      </div>
      <div class="flex-1 overflow-y-hidden px-4" ref={targetNode}>
        <Table
          columns={columns}
          size="middle"
          row-key={(record: any) => record.eventId}
          data-source={dataSource.value}
          pagination={pagination.value}
          loading={loading.value}
          scroll={{ y: initHeight.value - 47 - 56 }}
          onChange={handleTableChange}
          // class={css`
          //   .ant-table {
          //     transform: translateY(1px);
          //     box-shadow: 0 0 0 1px ${token.colorBorderSecondary};
          //     tr.ant-table-row:last-child > .ant-table-cell {
          //       border-bottom-color: transparent !important;
          //     }
          //     .ant-table-tbody-virtual-holder-inner > div:last-child .ant-table-cell {
          //       border-bottom-color: transparent !important;
          //     }
          //     .ant-table-placeholder > td {
          //       border-bottom-color: transparent !important;
          //     }
          //   }
          // `}
        />
      </div>
    </div>
  );
});

export default AlertList;
