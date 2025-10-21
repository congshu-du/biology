import { getAsIpprefixPageList } from "@/services/as";
import { getIPprefixUrl } from "@/utils/config";
import { Col, Input, Pagination, Radio, Row, Space } from "ant-design-vue";
import { computed, defineComponent, reactive, ref, watchEffect } from "vue";

const PrefixList = defineComponent<{ value: string }>(
  (props) => {
    const list = ref([]);
    const type = ref<4 | 6>(4);
    const search = ref("");
    const param = reactive({
      current: 1,
      pageSize: 48,
    });
    const total = ref(0);

    watchEffect(async () => {
      if (!props.value) return;
      try {
        const res = await getAsIpprefixPageList({
          asn: props.value,
          ipType: type.value,
          ...param,
        });
        if (res.code !== 200) {
          throw new Error();
        }
        list.value = res.data.data;
        total.value = res.data.total;
      } catch (error) {}
    });

    const lastList = computed(() => {
      return list.value.filter((n) => n.ipPrefix.indexOf(search.value) > -1);
    });

    return () => (
      <div>
        <Space class="p-4">
          <Radio.Group value={type.value} onChange={(e) => (type.value = e.target.value)} button-style="solid">
            <Radio.Button value={4}>IPv4</Radio.Button>
            <Radio.Button value={6}>IPv6</Radio.Button>
          </Radio.Group>
          <Input class="w-60" v-model={[search.value, "value"]} placeholder="请输入ip前缀" />
        </Space>
        <Row>
          {lastList.value.map((n) => (
            <Col span={6}>
              <div class="p-4 text-center">
                <a
                  onClick={() => {
                    window.open(getIPprefixUrl(n.ipPrefix));
                  }}
                >
                  {n.ipPrefix}
                </a>
              </div>
            </Col>
          ))}
        </Row>
        <div class="p-4 text-right">
          <Pagination
            total={total.value}
            current={param.current}
            pageSize={param.pageSize}
            onChange={(num) => {
              param.current = num;
            }}
            show-less-items
          />
        </div>
      </div>
    );
  },
  { props: ["value"] },
);

export default PrefixList;
