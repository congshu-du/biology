import { computed, defineComponent, nextTick, reactive, ref, watchEffect } from "vue";
import Aslist from "./components/Aslist";
import { token } from "@/utils/theme";
import { Input, Select, Space, Table } from "ant-design-vue";
import { getPrefixListPage } from "@/services/as";
import { PrefixType } from "@/services/as/interface";
import { getStatusUi, statusOptions } from "../roaList/components/common";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { ColumnProps, TableProps } from "ant-design-vue/es/table";
import { getIPprefixUrl } from "@/utils/config";

let loadMore = false;

const PrefixList = defineComponent(() => {
  const asnum = ref("");
  const router = useRouter();
  const loading = ref(false);
  const list = ref<PrefixType[]>([]);
  const targetNode = ref<any>(null);
  const initHeight = ref<number>(0);

  const pagination = reactive({
    current: 1,
    pageSize: 100,
    pageSizeOptions: ["100", "200", "300"],
    total: 0,
    showTotal: (total: number) => (
      <span>
        共 <a>{total}</a> 条
      </span>
    ),
  });
  const param = reactive({
    current: 1,
    pageSize: 100,
    ipPrefix: "",
    authStatus: undefined,
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
      if (!loadMore) {
        param.current = 1;
      }
      loading.value = true;
      const res = await getPrefixListPage({
        ...param,
        asn: asnum.value,
      });
      if (res.code !== 200) {
        throw new Error();
      }

      list.value = res.data.data;
      pagination.current = res.data.current;
      pagination.total = res.data.total;
      pagination.pageSize = res.data.pageSize;
      loading.value = false;
      loadMore = false;
    } catch (error) {
      loading.value = false;
      loadMore = false;
    }
  });

  const columns = computed(() => {
    const _col: ColumnProps<PrefixType>[] = [
      {
        title: "AS号",
        dataIndex: "asn",
        customRender: ({ text }) => <a onClick={() => router.push(`/as/base?as=${text}`)}>AS{text}</a>,
      },
      {
        title: "IP前缀",
        ellipsis: true,
        dataIndex: "ipPrefix",
        customRender: ({ text }) => {
          if (!text) return "-";
          return <a onClick={() => window.open(getIPprefixUrl(text))}>{text}</a>;
        },
      },
      {
        title: "国家/地区",
        dataIndex: "countryName",
        ellipsis: true,
        customRender: ({ text, record }) => (
          <span>
            <span
              hidden={!record.countryIso?.toLowerCase()}
              class={`text-xl mr-2 fi fi-${record.countryIso?.toLowerCase()}`}
            ></span>
            {text}
          </span>
        ),
      },
      {
        title: "前缀类型",
        dataIndex: "ipType",
        customRender: ({ text }) => (text === 4 ? "IPv4" : "IPv6"),
      },
      // {
      //   title: "分配状态",
      //   dataIndex: "ipStatus",
      // },
      {
        title: "RPKI状态",
        dataIndex: "authStatus",
        className: "!p-2",
        customRender: ({ text }) => getStatusUi(text),
      },
      {
        title: "RPKI过期时间",
        dataIndex: "effectiveEndTime",
        customRender: ({ text }) => text && dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        title: "操作",
        width: 80,
        customRender: ({ record }) => {
          if (record.authStatus && record.roaSourceType === 2) {
            return <a onClick={() => router.push(`/resources/roa?ipPrefix=${record.ipPrefix}`)}>ROA</a>;
          }
        },
      },
    ];
    return _col;
  });

  const handleTableChange: TableProps["onChange"] = (pag) => {
    console.log(pag, 2344);
    param.pageSize = pag.pageSize || 50;
    param.current = pag?.current || 1;
    loadMore = true;
  };

  return () => (
    <div style={{ borderTop: `1px solid ${token.colorBorder}` }} class="h-full w-full flex">
      <div class="w-[300px]">
        <Aslist value={asnum} />
      </div>
      <div class="flex-1 flex flex-col overflow-hidden">
        <div style={{ borderBottom: `1px solid ${token.colorBorder}` }} class="flex items-center h-12 px-3">
          <Space>
            <Input placeholder="请输入AS" v-model={[asnum.value, "value"]} allowClear class="w-32" />
            <Input placeholder="请输入前缀" v-model={[param.ipPrefix, "value"]} allowClear class=" w-36" />
            <Select
              placeholder="请选择RPKI状态"
              v-model={[param.authStatus, "value"]}
              options={statusOptions}
              class="w-36"
              allowClear
            />
          </Space>
        </div>
        <div class="mx-3 my-2 flex-1 flex flex-col overflow-hidden" ref={targetNode}>
          <Table
            columns={columns.value}
            size="middle"
            loading={loading.value}
            dataSource={list.value}
            pagination={pagination}
            scroll={{ y: initHeight.value - 94 }}
            onChange={handleTableChange}
          />
        </div>
      </div>
    </div>
  );
});

export default PrefixList;
