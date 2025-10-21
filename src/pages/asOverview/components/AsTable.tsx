import { token } from "@/utils/theme";
import styled, { tw } from "@vue-styled-components/core";
import { Checkbox, Input, Table, TableProps } from "ant-design-vue";
import { computed, defineComponent, ref, watchEffect } from "vue";

const AsTable = defineComponent(
  (props) => {
    const asType = ref(["peer", "provider", "customer"]);
    const search = ref("");

    // watchEffect(() => {
    //   console.log(props.allList, 5554);
    // });
    const columns: TableProps["columns"] = [
      {
        title: "",
        dataIndex: "order",
        width: 44,
        customRender: ({ index }) => index + 1,
      },
      {
        title: "AS邻居",
        dataIndex: "name",
        width: 100,
      },
      {
        title: "名称",
        dataIndex: "name1",
        customRender: ({ record }) => {
          return <span>{record?.asnName}</span>;
        },
      },
      {
        title: "组织",
        dataIndex: "origination",
        customRender: ({ index, text, record }) => {
          return <span>{record?.orgName}</span>;
        },
      },
      {
        title: "国家/地区",
        dataIndex: "country",
        customRender: ({ index, text, record }) => {
          const country = record?.iso?.toLocaleLowerCase();
          return (
            <span class="inline-flex items-center">
              <span class={`fi fi-${country} text-3xl`}></span>
              <span class="ml-2">{record?.country === "Taiwan" ? "China-Taiwan" : record?.country || ""}</span>
            </span>
          );
        },
      },
      // {
      //   title: "as customer cone",
      //   dataIndex: "cone",
      //   customRender: ({ index, text, record }) => {
      //     return <span>{record.asInfo?.cone?.numberAsns}</span>;
      //   },
      // },
      {
        title: "关系",
        dataIndex: "category",
      },
      {
        title: "邻居数",
        dataIndex: "input",
        customRender: ({ index, text, record }) => {
          return <span>{record.degree}</span>;
        },
      },
      // {
      //   title: "前缀数",
      //   dataIndex: "output",
      //   customRender: ({ index, text, record }) => {
      //     // numberPrefixes: 1163, numberAddresses: 7052544
      //     return <span>{record.asInfo?.announcing?.numberPrefixes}</span>;
      //   },
      // },
      // {
      //   title: "地址数",
      //   dataIndex: "output2",
      //   customRender: ({ index, text, record }) => {
      //     // numberPrefixes: 1163, numberAddresses: 7052544
      //     return <span>{record.asInfo?.announcing?.numberAddresses}</span>;
      //   },
      // },
      // {
      //   title: "输入",
      //   dataIndex: "input",
      // },
      // {
      //   title: "输出",
      //   dataIndex: "output",
      // },
    ];

    const data = computed(() => {
      return props.allList.filter((item) => asType.value.includes(item.category) && item.name.includes(search.value));
    });
    return () => (
      <SContainer>
        <div class="mb-4">
          <Input
            placeholder="请输入as号"
            value={search.value}
            onChange={(e: any) => (search.value = e.target.value)}
            class="w-80 mr-4"
          />
          <Checkbox.Group
            value={asType.value}
            onChange={(value) => {
              asType.value = value as any;
            }}
            options={[
              {
                label: "provider",
                value: "provider",
              },
              {
                label: "peer",
                value: "peer",
              },
              {
                label: "customer",
                value: "customer",
              },
            ]}
          />
        </div>
        <Table
          columns={columns}
          dataSource={data.value}
          pagination={{
            showTotal: (total: number) => (
              <span>
                共 <a>{total}</a> 条
              </span>
            ),
          }}
        />
      </SContainer>
    );
  },
  { props: ["allList"] },
);

export default AsTable;

const SContainer = styled.div`
  ${tw`mt-4 p-4 pb-0 mb-4`}
  border-radius: 8px;
  border: 1px solid ${token.colorBorderSecondary};
  background-color: ${token.B2};
`;
