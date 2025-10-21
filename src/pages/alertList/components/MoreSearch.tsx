import { Button, Form, Input, Popover, theme } from "ant-design-vue";
import { defineComponent, reactive, Reactive, watch } from "vue";
import { debounce } from "lodash-es";
import { DownOutlined } from "@ant-design/icons-vue";
// import { token } from "@/utils/theme";

interface ValueType {
  attackerAsn: string;
  victimAsn: string;
  eventId: string;
}

const CusContent = defineComponent<{ value: Reactive<ValueType> }>(
  ({ value }) => {
    const data = reactive({ ...value });

    const changeData = debounce((info) => {
      value.attackerAsn = info.attackerAsn;
      value.victimAsn = info.victimAsn;
      value.eventId = info.eventId;
    }, 600);

    watch([data], () => {
      changeData(data);
    });

    return () => (
      <div class="w-[300px] p-2">
        <Form model={data} labelCol={{ flex: "100px" }}>
          <Form.Item name="attackerAsn" label="劫持者ASN">
            <Input placeholder="请输入" v-model={[data.attackerAsn, "value"]} allowClear />
          </Form.Item>
          <Form.Item name="victimAsn" label="被劫持者ASN">
            <Input placeholder="请输入" v-model={[data.victimAsn, "value"]} allowClear />
          </Form.Item>
          <Form.Item name="eventId" label="告警ID">
            <Input placeholder="请输入" v-model={[data.eventId, "value"]} allowClear />
          </Form.Item>
        </Form>
      </div>
    );
  },
  { props: ["value"] },
);

const MoreSearch = defineComponent<{ value: Reactive<ValueType> }>(
  ({ value }) => {
    const { token } = theme.useToken();
    return () => (
      <Popover placement="bottom" destroyTooltipOnHide content={<CusContent value={value} />}>
        <Button>
          更多筛选 <DownOutlined style={{ color: token.value.colorIcon }} class="text-xs" />
        </Button>
      </Popover>
    );
  },
  {
    props: ["value"],
  },
);

export default MoreSearch;
