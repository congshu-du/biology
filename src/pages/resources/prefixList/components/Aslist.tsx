import { token } from "@/utils/theme";
import styled, { tw } from "@vue-styled-components/core";
import { Col, Input, Row, Select } from "ant-design-vue";
import { defineComponent, reactive, ref, Ref, watchEffect } from "vue";
import { RecycleScroller } from "vue-virtual-scroller";
import { getAsnCountryListPage } from "@/services/as";
import { AsnListType } from "@/services/as/interface";
import { getAllCountryList } from "@/services/roa";

let loadMore = false;
let ifHasMore = true;

const Aslist = defineComponent<{ value: Ref<string> }>(
  ({ value }) => {
    const list = ref<AsnListType[]>([]);
    const countryList = ref<{ countryIso: string; countryName: string }[]>([]);
    const loading = ref(false);

    const param = reactive<{
      asn: string | undefined;
      countryName: string | undefined;
      current: number;
      pageSize: number;
    }>({ asn: undefined, countryName: undefined, current: 1, pageSize: 300 });

    watchEffect(async () => {
      const res = await getAllCountryList();
      if (res.code !== 200) {
        return;
      }
      countryList.value = res.data?.filter((n) => !!n.countryName) ?? [];
    });

    watchEffect(async () => {
      try {
        if (!loadMore) {
          param.current = 1;
        }
        loading.value = true;
        const res = await getAsnCountryListPage({
          ...param,
        });
        if (res.code !== 200) {
          throw new Error();
        }
        if (param.current === 1) {
          list.value = res.data.data;
        } else {
          list.value = [...list.value, ...res.data.data];
        }
        ifHasMore = res.data.total > list.value.length;
        loading.value = false;
        loadMore = false;
      } catch (error) {
        loading.value = false;
        loadMore = false;
      }
    });

    return () => (
      <div class="h-full flex flex-col" style={{ borderRight: `1px solid ${token.colorBorder}` }}>
        <div style={{ borderBottom: `1px solid ${token.colorBorder}` }} class="h-12 py-2 px-3 flex">
          <Row wrap={false} gutter={[12, 12]}>
            <Col flex="120px">
              <Input class="w-full" placeholder="请输入AS" allowClear v-model={[param.asn, "value"]} />
            </Col>
            <Col flex="1 0 0">
              <Select
                v-model={[param.countryName, "value"]}
                placeholder="请选择国家"
                class="w-full"
                showSearch
                allowClear
                options={countryList.value.map((item) => ({
                  label: (
                    <span>
                      <span
                        hidden={!item.countryIso?.toLocaleLowerCase()}
                        class={`text-sm mr-2 fi fi-${item.countryIso?.toLocaleLowerCase()}`}
                      ></span>
                      {item.countryName}
                    </span>
                  ),
                  value: item.countryName,
                }))}
              />
            </Col>
            {/* <Col>
              <Button type="primary" icon={<PlusOutlined />} />
            </Col> */}
          </Row>
        </div>
        <div class="flex-1 overflow-y-hidden pb-2">
          <RecycleScroller
            class="scroller"
            style={{ height: "100%" }}
            items={list.value}
            itemSize={47}
            keyField="asn"
            active={value.value}
            onScrollEnd={() => {
              if (loading.value || !ifHasMore) return;
              loadMore = true;
              param.current += 1;
            }}
            v-slots={{
              default: ({ item }: { item: AsnListType }) => {
                const country = item?.countryIso.toLowerCase();
                return (
                  <div class="pt-2 px-3 h-[47px]">
                    <Item onClick={() => (value.value = item.asn)} checked={item.asn === value.value}>
                      <span hidden={!country} class={`text-xl mr-2 fi fi-${country}`}></span> {item.asn}
                    </Item>
                  </div>
                );
              },
            }}
          />
        </div>
      </div>
    );
  },
  { props: ["value"] },
);

export default Aslist;

const Item = styled("div", { checked: Boolean })`
  ${tw`h-full rounded flex items-center px-2 cursor-pointer`}
  background-color: ${({ checked }) => (checked ? token.colorPrimary : token.colorFillQuaternary)};
  &:hover {
    background-color: ${({ checked }) => (checked ? undefined : token.colorPrimaryBgHover)};
  }
`;
