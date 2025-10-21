import { SyncOutlined } from "@ant-design/icons-vue";
import { Button, Select, Space } from "ant-design-vue";
import { defineComponent, ref, watchEffect } from "vue";

const Refresh = defineComponent<{ onRefresh?: () => void }>(
  ({ onRefresh }) => {
    const current = ref(0);
    watchEffect((onCleanup) => {
      let timer: number | null = null;
      if (timer) clearInterval(timer);
      if (current.value) {
        timer = setInterval(() => {
          onRefresh?.();
        }, 1000 * current.value);
      }
      onCleanup(() => {
        if (timer) {
          clearInterval(timer);
        }
      });
    });

    return () => (
      <Space.Compact block>
        <Button onClick={() => onRefresh?.()} icon={<SyncOutlined />}></Button>
        <Select
          class=" w-[84px]"
          v-model:value={current.value}
          options={[
            {
              label: "不刷新",
              value: 0,
            },
            {
              label: "5秒",
              value: 5,
            },
            {
              label: "10秒",
              value: 10,
            },
            {
              label: "20秒",
              value: 20,
            },
          ]}
        />
      </Space.Compact>
    );
  },
  { props: ["onRefresh"] },
);

export default Refresh;
